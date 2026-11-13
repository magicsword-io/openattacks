import type { APIRoute } from "astro";
import { cors, generated, generatedNames } from "../../../lib/generated";

export function getStaticPaths() {
  return generatedNames("llms/by-month", ".md").map((name) => ({
    params: { month: name.slice(0, -".md".length) },
  }));
}

export const GET: APIRoute = ({ params }) =>
  new Response(generated(`llms/by-month/${params.month}.md`), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", ...cors },
  });
