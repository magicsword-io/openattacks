import { getAttacks } from "../../../lib/catalog";
import type { Attack } from "../../../lib/catalog";
export async function getStaticPaths() {
  return (await getAttacks()).map((attack) => ({
    params: { id: attack.id },
    props: { attack },
  }));
}
export function GET({ props }: { props: { attack: Attack } }) {
  return new Response(JSON.stringify(props.attack, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
