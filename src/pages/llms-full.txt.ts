import type { APIRoute } from "astro";
import { cors, generated } from "../lib/generated";

export const GET: APIRoute = () =>
  new Response(generated("llms-full.txt"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", ...cors },
  });
