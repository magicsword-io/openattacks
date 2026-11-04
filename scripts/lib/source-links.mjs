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

export function requestStatus(value, method) {
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
        headers: {
          "User-Agent":
            "OpenAttacks-Link-Checker/1.0 (+https://github.com/magicsword-io/openattacks)",
          Accept: "*/*",
        },
      },
      (response) => {
        resolve({
          status: response.statusCode,
          location: response.headers.location,
        });
        // Only inspect headers; do not download or execute linked content.
        response.destroy();
      },
    );
    request.on("error", reject);
    request.end();
  });
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
