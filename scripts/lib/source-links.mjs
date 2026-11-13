import { lookup } from "node:dns";
import { request as httpRequest } from "node:http";
import { request as httpsRequest } from "node:https";
import { setTimeout as delay } from "node:timers/promises";
import {
  entryLinks,
  isPublicAddress,
  sourceUrlError,
} from "../../src/lib/source-urls.mjs";

function unsafe(message) {
  return Object.assign(new Error(message), { code: "UNSAFE_URL" });
}

// Validate the actual DNS answers used by the connection, including redirects.
function publicLookup(hostname, options, callback) {
  lookup(
    hostname,
    { all: true, family: options.family || 0 },
    (error, addresses) => {
      if (error) return callback(error);
      if (
        !addresses.length ||
        addresses.some(({ address }) => !isPublicAddress(address))
      )
        return callback(unsafe("hostname resolves to a non-public address"));
      if (options.all) callback(null, addresses);
      else callback(null, addresses[0].address, addresses[0].family);
    },
  );
}

const REQUEST_HEADERS = {
  "User-Agent":
    "OpenAttacks-Link-Checker/1.0 (+https://github.com/magicsword-io/openattacks)",
  Accept: "*/*",
};

// Shared by evidence-link checks and detection-rule checks. Rejects private
// destinations before a socket is opened.
function publicRequest(value, method) {
  const issue = sourceUrlError(value);
  if (issue) return Promise.reject(unsafe(issue));
  const url = new URL(value);
  return new Promise((resolve, reject) => {
    const request = (url.protocol === "https:" ? httpsRequest : httpRequest)(
      url,
      {
        method,
        lookup: publicLookup,
        signal: AbortSignal.timeout(8000),
        headers: REQUEST_HEADERS,
      },
      (response) => resolve(response),
    );
    request.on("error", reject);
    request.end();
  });
}

export function requestStatus(value, method) {
  return publicRequest(value, method).then((response) => {
    const result = {
      status: response.statusCode,
      location: response.headers.location,
    };
    // Only inspect headers; do not download or execute linked content.
    response.destroy();
    return result;
  });
}

export function readCappedResponse(response, maxBytes = 65536) {
  return new Promise((resolve) => {
    const chunks = [];
    let size = 0;
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve({
        status: response.statusCode,
        location: response.headers.location,
        body: Buffer.concat(chunks).toString("utf8"),
      });
    };
    response.on("data", (chunk) => {
      if (size >= maxBytes) return;
      const slice = chunk.subarray(0, maxBytes - size);
      chunks.push(slice);
      size += slice.length;
      if (size >= maxBytes) response.destroy();
    });
    response.on("end", finish);
    response.on("error", finish);
    response.on("aborted", finish);
    response.on("close", finish);
  });
}

export function requestPublic(
  value,
  { method = "GET", maxBytes = 65536 } = {},
) {
  return publicRequest(value, method).then((response) =>
    readCappedResponse(response, maxBytes),
  );
}

// Follow public redirects and return the final HTTP status plus a capped body.
export async function fetchPublic(
  url,
  { request = requestPublic, maxBytes = 65536 } = {},
) {
  let current = url;
  const seen = new Set();
  for (let hop = 0; hop <= 5; hop++) {
    const issue = sourceUrlError(current);
    if (issue) throw unsafe(issue);
    const canonical = new URL(current);
    canonical.hash = "";
    if (seen.has(canonical.href)) throw unsafe("redirect loop");
    seen.add(canonical.href);
    const response = await request(canonical.href, { method: "GET", maxBytes });
    if (![301, 302, 303, 307, 308].includes(response.status))
      return {
        status: response.status,
        body: response.body || "",
        url: canonical.href,
      };
    if (!response.location) throw unsafe("redirect has no Location header");
    try {
      current = new URL(response.location, current).href;
    } catch {
      throw unsafe("redirect has an invalid Location header");
    }
  }
  throw unsafe("too many redirects (maximum 5)");
}

export async function checkSourceUrl(
  url,
  { request = requestStatus, retryDelayMs = 500 } = {},
) {
  async function follow(method) {
    let current = url;
    const seen = new Set();
    for (let hop = 0; hop <= 5; hop++) {
      const issue = sourceUrlError(current);
      if (issue) throw unsafe(issue);
      const canonical = new URL(current);
      canonical.hash = "";
      if (seen.has(canonical.href)) throw unsafe("redirect loop");
      seen.add(canonical.href);
      const response = await request(canonical.href, method);
      if (![301, 302, 303, 307, 308].includes(response.status))
        return response.status;
      if (!response.location) throw unsafe("redirect has no Location header");
      try {
        current = new URL(response.location, current).href;
      } catch {
        throw unsafe("redirect has an invalid Location header");
      }
    }
    throw unsafe("too many redirects (maximum 5)");
  }
  let result;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      let status;
      try {
        status = await follow("HEAD");
      } catch (error) {
        if (error.code === "UNSAFE_URL") throw error;
      }
      if (!(status >= 200 && status < 300)) status = await follow("GET");
      if (status >= 200 && status < 300)
        return { status: "ok", detail: `HTTP ${status}` };
      result = {
        status: [404, 410].includes(status) ? "error" : "warning",
        detail: `HTTP ${status}${[404, 410].includes(status) ? " confirmed with GET" : "; manual review needed"}`,
      };
    } catch (error) {
      if (error.code === "UNSAFE_URL")
        return { status: "error", detail: error.message };
      result = {
        status: "warning",
        detail: `${error.code || error.name}: request failed; manual review needed`,
      };
    }
    if (attempt === 0) await delay(retryDelayMs);
  }
  return result;
}

export function collectLinks(entries) {
  const links = new Map();
  for (const { filename, data } of entries)
    for (const { url, field } of entryLinks(data)) {
      const target = new URL(url);
      target.hash = "";
      const references = links.get(target.href) || new Set();
      references.add(`attacks/${filename}${field}`);
      links.set(target.href, references);
    }
  return links;
}

export async function checkLinks(links, check = checkSourceUrl) {
  const pending = [...links];
  const results = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(4, pending.length) }, async () => {
      while (next < pending.length) {
        const [url, references] = pending[next++];
        results.push({
          url,
          references: [...references],
          ...(await check(url)),
        });
      }
    }),
  );
  return results.sort((a, b) => a.url.localeCompare(b.url));
}
