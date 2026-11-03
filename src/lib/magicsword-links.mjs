const previewHost =
  "magic-portal-git-josehelps-mcp-server-m-a9b665-d1vious-projects.vercel.app";
export function isMagicSwordURL(value) {
  try {
    const url = new URL(value);
    return (
      ["https:", "http:"].includes(url.protocol) &&
      (url.hostname === "magicsword.io" ||
        url.hostname.endsWith(".magicsword.io") ||
        url.hostname === previewHost)
    );
  } catch {
    return false;
  }
}
export function magicswordURL(value, placement) {
  if (!isMagicSwordURL(value)) return value;
  const url = new URL(value);
  url.searchParams.set("utm_source", "openattacks");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set(
    "utm_content",
    placement || url.searchParams.get("utm_content") || "catalog",
  );
  return url.href;
}
