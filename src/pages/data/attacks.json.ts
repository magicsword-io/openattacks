import type { APIRoute } from "astro";
import { cors, generated } from "../../lib/generated";

export const GET: APIRoute = () =>
  new Response(generated("data/attacks.json"), {
    headers: { "Content-Type": "application/json; charset=utf-8", ...cors },
  });
