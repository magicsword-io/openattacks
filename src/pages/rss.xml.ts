import type { APIRoute } from "astro";
import { dateKey, getAttacks, href, roles } from "../lib/catalog";

// RSS 2.0 feed of every catalog entry, newest report first. Generated from
// attacks/*.yaml in the same static build as the JSON and CSV exports.

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    // Characters XML 1.0 forbids would make the whole feed unparseable.
    .replace(
      /[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
      "",
    );

// A partial date is published at noon UTC on the first of its month, matching
// how the catalog sorts it.
const rfc822 = (date: string) =>
  new Date(`${dateKey(date)}T12:00:00Z`).toUTCString();

export const GET: APIRoute = async ({ site, url }) => {
  const attacks = await getAttacks();
  const absolute = (path: string) =>
    new URL(href(path), site || url.origin).href;
  const feedURL = absolute("rss.xml");

  const items = attacks.map((attack) => {
    const link = absolute(`attacks/${attack.id}/`);
    // Feed readers render <description> as HTML, so build escaped paragraphs
    // and links rather than plain text whose line breaks would collapse.
    const description = [
      escape(attack.technique_summary),
      attack.borderline && attack.borderline_note
        ? `Qualification: ${escape(attack.borderline_note)}`
        : "",
      `Sources: ${attack.sources
        .map((source) => `<a href="${escape(source.url)}">${escape(source.url)}</a>`)
        .join(" ")}`,
    ]
      .filter(Boolean)
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
    const categories = [
      roles[attack.ai_role]?.label ?? attack.ai_role,
      ...(attack.tags ?? []),
    ];
    return [
      "    <item>",
      `      <title>${escape(attack.name)}</title>`,
      `      <link>${escape(link)}</link>`,
      `      <guid isPermaLink="true">${escape(link)}</guid>`,
      `      <pubDate>${rfc822(attack.date_reported)}</pubDate>`,
      `      <description>${escape(description)}</description>`,
      ...categories.map(
        (category) => `      <category>${escape(category)}</category>`,
      ),
      "    </item>",
    ].join("\n");
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>OpenAttacks — MagicSword</title>",
    `    <link>${escape(absolute(""))}</link>`,
    `    <atom:link href="${escape(feedURL)}" rel="self" type="application/rss+xml" />`,
    "    <description>A sourced catalog of reported AI-enabled attacks and qualified security-research findings, newest report first.</description>",
    "    <language>en</language>",
    ...(attacks.length
      ? [`    <lastBuildDate>${rfc822(attacks[0].date_reported)}</lastBuildDate>`]
      : []),
    ...items,
    "  </channel>",
    "</rss>",
  ].join("\n");

  return new Response(`${xml}\n`, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
};
