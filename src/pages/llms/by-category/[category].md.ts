import type { APIRoute } from "astro";
import { cors, generated, generatedNames } from "../../../lib/generated";

export function getStaticPaths() {
  return generatedNames("llms/by-category", ".md").map((name) => ({
    params: { category: name.slice(0, -".md".length) },
  }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(generated(`llms/by-category/${params.category}.md`), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", ...cors },
  });
