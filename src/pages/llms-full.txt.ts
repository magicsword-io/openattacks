import type { APIRoute } from "astro";
import { cors, generatedForSite } from "../lib/generated";

export const GET: APIRoute = ({ site, url }) =>
  new Response(
    generatedForSite(
      "llms-full.txt",
      new URL(import.meta.env.BASE_URL, site || url.origin),
    ),
    { headers: { "Content-Type": "text/plain; charset=utf-8", ...cors } },
  );
