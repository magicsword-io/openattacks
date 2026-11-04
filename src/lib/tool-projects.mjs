import registry from "../data/tool-projects.json" with { type: "json" };

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const aliases = registry.projects
  .flatMap((project) => project.aliases.map((alias) => ({ alias, project })))
  .sort((a, b) => b.alias.length - a.alias.length);
const projectsByAlias = new Map(
  aliases.map(({ alias, project }) => [alias.toLowerCase(), project]),
);
// Prefer the longest name, and do not match inside paths, URLs or worker identifiers.
const mention = new RegExp(
  `(?<![\\p{L}\\p{N}_./:@-])(${aliases.map(({ alias }) => escape(alias)).join("|")})(?![\\p{L}\\p{N}_./:@-])`,
  "giu",
);

/**
 * Preserve the reported label verbatim while linking only reviewed project names.
 * @param {string} label
 * @returns {Array<{text: string, project?: (typeof registry.projects)[number]}>}
 */
export function toolingSegments(label) {
  const segments = [];
  let offset = 0;
  for (const match of label.matchAll(mention)) {
    if (match.index > offset)
      segments.push({ text: label.slice(offset, match.index) });
    segments.push({
      text: match[0],
      project: projectsByAlias.get(match[0].toLowerCase()),
    });
    offset = match.index + match[0].length;
  }
  if (offset < label.length || !segments.length)
    segments.push({ text: label.slice(offset) });
  return segments;
}
