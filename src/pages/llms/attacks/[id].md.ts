import type { APIRoute } from "astro";
import { cors, generated, generatedNames } from "../../../lib/generated";

export function getStaticPaths() {
  return generatedNames("llms/attacks", ".md").map((name) => ({
    params: { id: name.slice(0, -".md".length) },
  }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(generated(`llms/attacks/${params.id}.md`), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", ...cors },
  });
