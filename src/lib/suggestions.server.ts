import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";
import { sourceUrlError } from "./source-urls.mjs";
import {
  descriptionLimit,
  sourceLimit,
  suggestionTypes,
} from "./suggestions.ts";

const issuesApi =
  "https://api.github.com/repos/magicsword-io/openattacks/issues";
const maxBodyBytes = 32 * 1024;
const bodyTooLarge = Symbol("body too large");
const hour = 60 * 60;
const day = 24 * hour;
const clientLimit = 4;
const totalLimit = 25;
const allowedFields = new Set([
  "type",
  "relatedIncident",
  "description",
  "source",
  "consent",
  "website",
]);
const emailPattern =
  /(?:^|[^\p{L}\p{N}._%+-])[\p{L}\p{N}._%+-]+@[\p{L}\p{N}.-]+\.[\p{L}\p{N}]{2,}/u;

type SuggestionConfig = {
  githubToken: string;
  redisUrl: URL;
  redisToken: string;
};

type Suggestion = {
  type: keyof typeof suggestionTypes;
  relatedIncident: string;
  description: string;
  source: string;
};

export function getSuggestionConfig(
  env: NodeJS.ProcessEnv,
): SuggestionConfig | null {
  const githubToken = env.OPENATTACKS_SUGGESTIONS_GITHUB_TOKEN?.trim();
  const redisToken = env.OPENATTACKS_SUGGESTIONS_REDIS_TOKEN?.trim();
  if (
    env.OPENATTACKS_SUGGESTIONS_ENABLED !== "true" ||
    !githubToken ||
    !redisToken
  ) {
    return null;
  }
  const redisUrl = URL.parse(env.OPENATTACKS_SUGGESTIONS_REDIS_URL ?? "");
  if (
    !redisUrl ||
    redisUrl.protocol !== "https:" ||
    redisUrl.username ||
    redisUrl.password ||
    redisUrl.pathname !== "/" ||
    redisUrl.search ||
    redisUrl.hash
  ) {
    return null;
  }
  return { githubToken, redisUrl, redisToken };
}

export function suggestionResponse(
  body:
    { enabled: boolean } | { result: string; message: string; issue?: number },
  status = 200,
  headers: Record<string, string> = {},
) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
}

// Count bytes while streaming, even if Content-Length is absent.
async function readSubmission(request: Request) {
  if (Number(request.headers.get("Content-Length")) > maxBodyBytes)
    return bodyTooLarge;
  if (!request.body) return null;
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let json = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > maxBodyBytes) {
      void reader.cancel().catch(() => undefined);
      return bodyTooLarge;
    }
    json += decoder.decode(value, { stream: true });
  }
  return JSON.parse(json + decoder.decode());
}

function validate(data: unknown): Suggestion | string {
  if (
    !data ||
    typeof data !== "object" ||
    Array.isArray(data) ||
    Object.keys(data).some((key) => !allowedFields.has(key))
  ) {
    return "Use the form to submit only the public fields shown.";
  }
  const fields = data as Record<string, unknown>;
  if (fields.consent !== true)
    return "Consent is required to post a public issue.";
  if (fields.website !== undefined && fields.website !== "")
    return "Submission blocked.";
  if (
    typeof fields.type !== "string" ||
    !Object.hasOwn(suggestionTypes, fields.type)
  ) {
    return "Choose a submission type.";
  }
  const type = fields.type as keyof typeof suggestionTypes;
  const relatedIncident = fields.relatedIncident ?? "";
  if (
    typeof relatedIncident !== "string" ||
    !/^(?:[a-z0-9-]{1,160})?$/.test(relatedIncident)
  ) {
    return "Choose a related incident from the catalog.";
  }
  const rawDescription = fields.description;
  if (
    typeof rawDescription !== "string" ||
    rawDescription.length > descriptionLimit ||
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(rawDescription)
  ) {
    return `Enter a description of up to ${descriptionLimit.toLocaleString("en-US")} characters.`;
  }
  const description = rawDescription
    .replace(/\r\n?/g, "\n")
    .trim()
    .normalize("NFC");
  if (!description) return "Enter a description.";

  const rawSource = fields.source ?? "";
  if (typeof rawSource !== "string" || rawSource.length > sourceLimit) {
    return "Enter a valid public source URL.";
  }
  const source = rawSource.trim();
  if (source && sourceUrlError(source)) {
    return "Enter a public HTTP or HTTPS source URL without credentials.";
  }
  let decodedSource = source;
  try {
    decodedSource = decodeURIComponent(source);
  } catch {
    return "Enter a valid public source URL.";
  }
  if (emailPattern.test(description) || emailPattern.test(decodedSource)) {
    return "Remove email addresses before posting publicly.";
  }
  return { type, relatedIncident, description, source };
}

// Combine both rate limits and the duplicate reservation in one Redis operation.
const reserveScript = `
local existing = redis.call("GET", KEYS[1])
if existing then return existing end
for i = 2, 3 do
  if tonumber(redis.call("GET", KEYS[i]) or "0") >= tonumber(ARGV[i]) then
    return "limited"
  end
end
for i = 2, 3 do
  if redis.call("INCR", KEYS[i]) == 1 then
    redis.call("EXPIRE", KEYS[i], ARGV[4])
  end
end
redis.call("SET", KEYS[1], ARGV[1], "EX", ARGV[5])
return "reserved"
`;

const finishScript = `
if redis.call("GET", KEYS[1]) ~= ARGV[1] then return 0 end
if ARGV[2] == "" then return redis.call("DEL", KEYS[1]) end
redis.call("SET", KEYS[1], ARGV[2], "EX", ARGV[3])
return 1
`;

function digest(config: SuggestionConfig, value: string) {
  return createHmac("sha256", config.redisToken).update(value).digest("hex");
}

function issuePayload(suggestion: Suggestion) {
  // Indentation keeps Markdown, mentions, references and source URLs literal.
  const codeBlock = (value: string) =>
    value
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n");
  const title = `[Site submission] ${suggestionTypes[suggestion.type]}`;
  const body = ["### Description\n\n" + codeBlock(suggestion.description)];
  if (suggestion.relatedIncident) {
    body.unshift(
      "### Related incident\n\n" + codeBlock(suggestion.relatedIncident),
    );
  }
  if (suggestion.source)
    body.push("### Source URL\n\n" + codeBlock(suggestion.source));
  return { title, body: body.join("\n\n") };
}

function issueNumber(value: unknown): number | undefined {
  const parsed =
    typeof value === "string" && /^\d+$/.test(value) ? Number(value) : value;
  return typeof parsed === "number" &&
    Number.isSafeInteger(parsed) &&
    parsed > 0
    ? parsed
    : undefined;
}

export async function handleSuggestion(
  request: Request,
  {
    config,
    address,
    incidentExists,
    fetcher = fetch,
  }: {
    config: SuggestionConfig | null;
    address: string | null;
    incidentExists: (id: string) => Promise<boolean>;
    fetcher?: typeof fetch;
  },
) {
  const unavailable = () =>
    suggestionResponse(
      {
        result: "unavailable",
        message:
          "Website submissions are unavailable. You can use the GitHub issue templates below.",
      },
      503,
    );
  if (!config || !address || !isIP(address)) return unavailable();
  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return suggestionResponse(
      { result: "invalid", message: "Submit from the OpenAttacks website." },
      403,
    );
  }
  if (
    request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !==
    "application/json"
  ) {
    return suggestionResponse(
      { result: "invalid", message: "Use the OpenAttacks submission form." },
      415,
    );
  }

  const data = await readSubmission(request).catch(() => null);
  if (data === bodyTooLarge) {
    return suggestionResponse(
      { result: "invalid", message: "This submission is too large." },
      413,
    );
  }
  const submission = validate(data);
  if (typeof submission === "string") {
    return suggestionResponse({ result: "invalid", message: submission }, 400);
  }
  if (submission.relatedIncident) {
    const exists = await incidentExists(submission.relatedIncident).catch(
      () => null,
    );
    if (exists === null) return unavailable();
    if (!exists) {
      return suggestionResponse(
        {
          result: "invalid",
          message: "Choose a related incident from the catalog.",
        },
        400,
      );
    }
  }

  const requestKey = `openattacks:suggestions:submission:${digest(config, JSON.stringify(submission))}`;
  const clientKey = `openattacks:suggestions:client:${digest(config, address)}`;
  const totalKey = "openattacks:suggestions:total";
  const claim = `pending:${randomUUID()}`;
  const redis = async (command: (string | number)[]) => {
    const response = await fetcher(config.redisUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      redirect: "error",
      signal: AbortSignal.timeout(2500),
    });
    if (!response.ok) throw new Error("Submission store unavailable");
    const { result, error } = await response.json();
    if (error || result === undefined)
      throw new Error("Submission store unavailable");
    return result;
  };

  const reservation = await redis([
    "EVAL",
    reserveScript,
    3,
    requestKey,
    clientKey,
    totalKey,
    claim,
    clientLimit,
    totalLimit,
    hour,
    day,
  ]).catch(() => null);
  if (reservation === "limited") {
    return suggestionResponse(
      {
        result: "limited",
        message:
          "The submission limit was reached. Please try again in an hour.",
      },
      429,
      { "Retry-After": String(hour) },
    );
  }
  const existingIssue = issueNumber(reservation);
  if (existingIssue || reservation === "posted") {
    return suggestionResponse({
      result: "duplicate",
      message: "This submission already has a public GitHub issue.",
      issue: existingIssue,
    });
  }
  if (typeof reservation === "string" && reservation.startsWith("pending:")) {
    return suggestionResponse(
      {
        result: "unconfirmed",
        message:
          "An identical submission is pending or could not be confirmed. Check recent issues below before posting again.",
      },
      409,
    );
  }
  if (reservation !== "reserved") return unavailable();

  const github = await fetcher(issuesApi, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${config.githubToken}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify(issuePayload(submission)),
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  }).catch(() => null);
  const finish = (value: string) =>
    redis(["EVAL", finishScript, 1, requestKey, claim, value, day]).catch(
      () => null,
    );

  if (github?.status === 201) {
    const issue = issueNumber((await github.json().catch(() => null))?.number);
    await finish(issue ? String(issue) : "posted");
    return suggestionResponse(
      {
        result: "posted",
        message: "Your submission was posted as a public GitHub issue.",
        issue,
      },
      201,
    );
  }
  if (
    github &&
    github.status >= 400 &&
    github.status < 500 &&
    github.status !== 408
  ) {
    // GitHub rejected the request. A later retry can take a new reservation.
    await finish("");
    return unavailable();
  }
  // GitHub may have accepted the issue before the connection failed.
  return suggestionResponse(
    {
      result: "unconfirmed",
      message:
        "We couldn’t confirm whether GitHub received this submission. Check recent issues below before posting again.",
    },
    502,
  );
}
