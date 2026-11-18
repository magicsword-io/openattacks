import type { APIRoute } from "astro";
import { cors, generated } from "../../../lib/generated";

export const GET: APIRoute = ({ site, url }) => {
  const base = new URL(import.meta.env.BASE_URL, site || url.origin);
  return new Response(generated("skills/openattacks/SKILL.md"), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
      Link: `<${new URL("llms.txt", base).href}>; rel="describedby"`,
      ...cors,
    },
  });
};
