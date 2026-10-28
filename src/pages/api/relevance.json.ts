import type { APIRoute } from "astro";
import { getAttacks } from "../../lib/catalog";
import { stackIndex } from "../../lib/stack-data";
export const GET: APIRoute = async () =>
  new Response(JSON.stringify(stackIndex(await getAttacks()), null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
