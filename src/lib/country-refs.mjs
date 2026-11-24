// Country references for the pew-pew map. Pure functions over attack records so
// they run in both Astro and `node --test`.
//
// Roles, strongest first:
//   origin    – attribution.country (who the source attributes the activity to)
//   target    – a named country in `regions` (reported victim geography)
//   mentioned – the country name appears in the entry's text, nothing more
// A "mentioned" country is not a victim, an origin or attribution. It can be a
// hosting location, a removed label explained in region_notes, or a news peg.

export const ROLE_ORDER = ["origin", "target", "mentioned"];

// Spellings in source text or attribution fields -> canonical map name.
export const COUNTRY_ALIASES = {
  DPRK: "North Korea",
  "Democratic People's Republic of Korea": "North Korea",
  PRC: "China",
  "People's Republic of China": "China",
  "United States of America": "United States",
  USA: "United States",
  "U.S.": "United States",
  "U.S.A.": "United States",
  US: "United States",
  UK: "United Kingdom",
  "U.K.": "United Kingdom",
  Britain: "United Kingdom",
  "Great Britain": "United Kingdom",
  "Republic of Korea": "South Korea",
  "Czech Republic": "Czechia",
  Türkiye: "Turkey",
  "Russian Federation": "Russia",
};

// Names that collide with common words, people or US states in this corpus.
// They still count when they come from a structured field.
export const AMBIGUOUS_IN_TEXT = new Set(["Georgia", "Jordan", "Chad", "Guinea"]);

export const canonicalCountry = (name, known) => {
  if (!name) return null;
  const trimmed = String(name).trim();
  const resolved = COUNTRY_ALIASES[trimmed] || trimmed;
  return known.has(resolved) ? resolved : null;
};

const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function buildMatchers(known) {
  const spellings = [
    ...[...known].filter((name) => !AMBIGUOUS_IN_TEXT.has(name)).map((n) => [n, n]),
    ...Object.entries(COUNTRY_ALIASES).filter(([, n]) => known.has(n)),
  ];
  // Longest first so "South Korea" wins over "Korea"-like fragments.
  spellings.sort((a, b) => b[0].length - a[0].length);
  return spellings.map(([spelling, country]) => ({
    country,
    // Case-sensitive on purpose: "US" the country, not "us" the pronoun.
    pattern: new RegExp(`(?<![\\w.])${escape(spelling)}(?![\\w])`),
  }));
}

export function entryText(attack) {
  const parts = [
    attack.name,
    attack.technique_summary,
    attack.initial_access,
    attack.victims_and_sectors,
    attack.region_notes,
    attack.attribution_or_cluster,
    attack.scale_and_metrics,
    attack.attribution?.actor_name,
    ...(attack.sources || []).map((source) => source.title),
    ...(attack.attack_flow?.nodes || []).flatMap((node) => [node.title, node.description]),
  ];
  return parts.filter(Boolean).join("\n");
}

/**
 * @param {object} attack
 * @param {Set<string>} known canonical country names that can be placed on the map
 * @param {ReturnType<typeof buildMatchers>} [matchers]
 * @returns {{country: string, role: "origin"|"target"|"mentioned"}[]}
 */
export function countryRefs(attack, known, matchers = buildMatchers(known)) {
  const roles = new Map();
  const add = (country, role) => {
    if (!country) return;
    const current = roles.get(country);
    if (!current || ROLE_ORDER.indexOf(role) < ROLE_ORDER.indexOf(current))
      roles.set(country, role);
  };
  add(canonicalCountry(attack.attribution?.country, known), "origin");
  for (const region of attack.regions || []) add(canonicalCountry(region, known), "target");
  const text = entryText(attack);
  for (const { country, pattern } of matchers)
    if (pattern.test(text)) add(country, "mentioned");
  return [...roles]
    .map(([country, role]) => ({ country, role }))
    .sort(
      (a, b) =>
        ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role) ||
        a.country.localeCompare(b.country),
    );
}

/**
 * Groups entries by the countries they reference and derives the arcs.
 * "reported" arcs go from an attributed origin to a reported target. "vibes"
 * arcs connect other countries the same entry references and carry no claim.
 */
/**
 * @typedef {"origin"|"target"|"mentioned"} Role
 * @param {object[]} attacks
 * @param {Set<string>} known
 * @returns {{
 *   countries: {country: string, refs: {id: string, role: Role}[]}[],
 *   arcs: {id: string, from: string, to: string, kind: "reported"|"vibes"}[],
 *   entries: {id: string, refs: {country: string, role: Role}[]}[],
 * }}
 */
export function buildPewPew(attacks, known) {
  const matchers = buildMatchers(known);
  /** @type {Map<string, {id: string, role: Role}[]>} */
  const byCountry = new Map();
  /** @type {{id: string, from: string, to: string, kind: "reported"|"vibes"}[]} */
  const arcs = [];
  const entries = [];
  for (const attack of attacks) {
    const refs = countryRefs(attack, known, matchers);
    if (!refs.length) continue;
    entries.push({ id: attack.id, refs });
    for (const ref of refs) {
      if (!byCountry.has(ref.country)) byCountry.set(ref.country, []);
      byCountry.get(ref.country).push({ id: attack.id, role: ref.role });
    }
    const origins = refs.filter((r) => r.role === "origin").map((r) => r.country);
    const targets = refs.filter((r) => r.role === "target").map((r) => r.country);
    const seen = new Set();
    const push = (from, to, kind) => {
      const key = `${from}>${to}`;
      if (from === to || seen.has(key)) return;
      seen.add(key);
      arcs.push({ id: attack.id, from, to, kind });
    };
    for (const from of origins) for (const to of targets) push(from, to, "reported");
    // Everything else fires from the strongest reference to the rest;
    // `seen` drops pairs already drawn as reported.
    const [lead, ...rest] = refs.map((r) => r.country);
    for (const to of rest) push(lead, to, "vibes");
  }
  const countries = [...byCountry]
    .map(([country, refs]) => ({ country, refs }))
    .sort((a, b) => b.refs.length - a.refs.length || a.country.localeCompare(b.country));
  return { countries, arcs, entries };
}
