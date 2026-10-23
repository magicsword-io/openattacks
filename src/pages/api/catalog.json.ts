import type { APIRoute } from "astro";
import { getAttacks } from "../../lib/catalog";
import {
  catalogIndex,
  environments,
  evidenceTypes,
} from "../../lib/presentation";
export const GET: APIRoute = async () =>
  new Response(
    JSON.stringify(
      {
        description:
          "Editorial browse index derived from the source-backed catalog. Original records remain at api/attacks.json. Environments describe source-stated target contexts; unspecified is not negative evidence. Evidence classes are catalog annotations, not independent incident verification.",
        environments,
        evidence_types: evidenceTypes,
        entries: (await getAttacks()).map(catalogIndex),
      },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
