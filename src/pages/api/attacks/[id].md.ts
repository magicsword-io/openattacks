import { getAttacks, href, type Attack } from "../../../lib/catalog";
import { attackMarkdown } from "../../../lib/markdown";
import type { APIRoute } from "astro";
export async function getStaticPaths() {
  return (await getAttacks()).map((attack) => ({
    params: { id: attack.id },
    props: { attack },
  }));
}
export const GET: APIRoute = ({ props, site, url }) =>
  new Response(
    attackMarkdown(
      props.attack as Attack,
      (path) => new URL(href(path), site || url.origin).href,
    ),
    { headers: { "Content-Type": "text/markdown; charset=utf-8" } },
  );
