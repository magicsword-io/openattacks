import type { APIRoute } from "astro";
import { cors, generatedForSite, generatedNames } from "../../../lib/generated";

export function getStaticPaths() {
  return generatedNames("llms/by-framework", ".md").map((name) => ({
    params: { framework: name.slice(0, -".md".length) },
  }));
}

export const GET: APIRoute = ({ params, site, url }) =>
  new Response(
    generatedForSite(
      `llms/by-framework/${params.framework}.md`,
      new URL(import.meta.env.BASE_URL, site || url.origin),
    ),
    { headers: { "Content-Type": "text/markdown; charset=utf-8", ...cors } },
  );
