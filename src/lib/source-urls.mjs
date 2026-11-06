import { BlockList, isIP } from "node:net";

const privateIPv4 = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
])
  privateIPv4.addSubnet(address, prefix);
const publicIPv6 = new BlockList();
publicIPv6.addSubnet("2000::", 3, "ipv6");
const documentationIPv6 = new BlockList();
documentationIPv6.addSubnet("2001:db8::", 32, "ipv6");

export function isPublicAddress(address) {
  if (isIP(address) === 4) return !privateIPv4.check(address);
  return (
    isIP(address) === 6 &&
    publicIPv6.check(address, "ipv6") &&
    !documentationIPv6.check(address, "ipv6")
  );
}

// Only published evidence and coverage links: never crawl IOC or payload fields.
export function entryLinks(entry) {
  return [
    ...entry.sources.map(({ url }, i) => ({ field: `/sources/${i}/url`, url })),
    ...(entry.magicsword_coverage || []).map((url, i) => ({
      field: `/magicsword_coverage/${i}`,
      url,
    })),
    ...(entry.atlas_techniques || []).flatMap((mapping, i) =>
      mapping.source_urls.map((url, j) => ({
        field: `/atlas_techniques/${i}/source_urls/${j}`,
        url,
      })),
    ),
    ...(entry.attack_flow?.nodes || []).flatMap((node, i) =>
      node.source_urls.map((url, j) => ({
        field: `/attack_flow/nodes/${i}/source_urls/${j}`,
        url,
      })),
    ),
  ];
}

export function sourceUrlError(value) {
  if (
    typeof value !== "string" ||
    /[\s\\]/u.test(value) ||
    !/^https?:\/\//.test(value)
  )
    return "must be an absolute HTTP(S) URL without whitespace or backslashes";
  let url;
  try {
    url = new URL(value);
  } catch {
    return "must be a valid URL";
  }
  if (url.username || url.password) return "must not contain credentials";
  const hostname = url.hostname.replace(/^\[|\]$/g, "").replace(/\.$/, "");
  if (isIP(hostname)) {
    if (!isPublicAddress(hostname)) return "must point to a public address";
  } else if (
    !hostname.includes(".") ||
    /\.(localhost|local|internal)$/i.test(hostname)
  ) {
    return "must point to a public hostname";
  }
  return null;
}
