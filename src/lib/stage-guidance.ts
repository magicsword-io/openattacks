import annotations from "../../detections/stages.json";
import catalog from "../../detections/catalog.json";
import { href, repo, type Attack, type AttackFlowNode } from "./catalog";
import { attackFlow } from "./attack-flow";
import { magicswordURL } from "./magicsword-links.mjs";

const productURL = magicswordURL(
  "https://www.magicsword.io/use-cases/application-control",
  "stage-control",
);
export type QueryFormat = "sigma" | "kql" | "spl";
export interface StageGuidance {
  profile: string;
  title: string;
  hypothesis: string;
  visibility: string;
  telemetry: string[];
  investigate: string[];
  limitation: string;
  note?: string;
  queries: Record<QueryFormat, string> | null;
  query_scope: string;
  query_kind: "native" | "custom_schema" | "gap";
  origin: "catalog_authored";
  definition_url: string;
  query_downloads: Record<QueryFormat, string> | null;
  validation: "draft" | "not_applicable" | "not_assessed";
  evidence: string[];
  reviewed: string | null;
  control?: {
    title: string;
    action: string;
    scope: string;
    limitation: string;
    url: string;
  };
  resource?: { name: string; url: string };
}
interface Profile {
  id: string;
  title: string;
  hypothesis: string;
  visibility: string;
  telemetry: string[];
  investigate: string[];
  limitation: string;
  search: string[];
  reviewed: string | null;
  origin: string;
  query_kind: "native" | "custom_schema" | "gap";
  query_scope: string;
  queries: Record<QueryFormat, string> | null;
}
const profiles = catalog.profiles as Record<string, Profile>;

const controls: Record<string, { title: string; action: string }> = {
  "script-hosts": {
    title: "Restrict script / execution utilities",
    action:
      "Use MagicSword to review and enforce a policy restricting unneeded Windows script hosts, shells or installer utilities identified in this branch.",
  },
  "shell-helper": {
    title: "Restrict an unsafe execution helper",
    action:
      "Use MagicSword application control to restrict an unneeded Windows shell/helper or deny unapproved payloads while the vulnerable client is patched.",
  },
  "unapproved-code": {
    title: "Deny an unapproved executable",
    action:
      "Use MagicSword to audit the actual executable's signer, publisher or hash, then enforce a policy that denies unapproved code on managed Windows hosts.",
  },
};
const resources: Record<string, string> = {
  LOLSkills: "https://lolskills.io",
  GTFOBins: "https://gtfobins.github.io",
  HijackLibs: "https://hijacklibs.net",
  LOLDrivers: "https://www.loldrivers.io",
};
type Annotation = {
  profile: string;
  control?: string;
  scope?: string;
  resource?: string;
  note?: string;
  reviewed?: string;
};
const curated = annotations as Record<string, Record<string, Annotation>>;
export function stageGuidance(
  attack: Attack,
  node: AttackFlowNode,
): StageGuidance {
  const a = curated[attack.id]?.[node.id];
  const id = a?.profile || "unassessed";
  const p = profiles[id];
  if (!p)
    throw new Error(`Unknown hunt profile ${id} for ${attack.id}/${node.id}`);
  if (a?.resource && !resources[a.resource])
    throw new Error(
      `Unknown stage resource ${a.resource} for ${attack.id}/${node.id}`,
    );
  const control = a?.control ? controls[a.control] : undefined;
  if (a?.control && (!control || !a.scope))
    throw new Error(`Unscoped control for ${attack.id}/${node.id}`);
  const querySet = p.queries;
  return {
    profile: id,
    title: p.title,
    hypothesis: p.hypothesis,
    visibility: p.visibility || "Defender-side logs where collected",
    telemetry: p.telemetry,
    investigate: p.investigate,
    limitation: p.limitation,
    note: a?.note,
    queries: querySet,
    query_scope: p.query_scope,
    query_kind: p.query_kind,
    origin: "catalog_authored",
    definition_url: `${repo}/blob/main/detections/definitions/${id}.yaml`,
    query_downloads: querySet
      ? {
          sigma: href(`api/detections/${id}.sigma.yml`),
          kql: href(`api/detections/${id}.kql`),
          spl: href(`api/detections/${id}.spl`),
        }
      : null,
    validation: querySet
      ? "draft"
      : id === "unassessed"
        ? "not_assessed"
        : "not_applicable",
    evidence: node.source_urls,
    reviewed: id === "unassessed" ? null : a?.reviewed || p.reviewed,
    control: control
      ? {
          ...control,
          scope: a!.scope!,
          limitation:
            "Policy opportunity, not tested incident coverage. Requires enrolled Windows devices, a policy covering the actual executable, and enforcement. Audit mode records decisions without blocking; allowed tools and in-process / cloud actions can remain reachable.",
          url: productURL,
        }
      : undefined,
    resource: a?.resource
      ? { name: a.resource, url: resources[a.resource] }
      : undefined,
  };
}

export function attackGuidance(attack: Attack) {
  return {
    attack_id: attack.id,
    status: "catalog_recommendations_not_validated_coverage",
    stages: attackFlow(attack).nodes.map((node) => ({
      node_id: node.id,
      ...stageGuidance(attack, node),
    })),
  };
}
