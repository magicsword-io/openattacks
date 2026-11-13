import type { APIRoute } from "astro";
import { cors, generatedForSite, generatedNames } from "../../../lib/generated";

export function getStaticPaths() {
  return generatedNames("llms/by-month", ".md").map((name) => ({
    params: { month: name.slice(0, -".md".length) },
  }));
}

export const GET: APIRoute = ({ params, site, url }) =>
  new Response(
    generatedForSite(
      `llms/by-month/${params.month}.md`,
      new URL(import.meta.env.BASE_URL, site || url.origin),
    ),
    { headers: { "Content-Type": "text/markdown; charset=utf-8", ...cors } },
  );
