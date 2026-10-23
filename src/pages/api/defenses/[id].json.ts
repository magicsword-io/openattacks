import { getAttacks, type Attack } from "../../../lib/catalog";
import { attackGuidance } from "../../../lib/stage-guidance";
import { attackFlow } from "../../../lib/attack-flow";

export async function getStaticPaths() {
  return (await getAttacks()).map((attack) => ({
    params: { id: attack.id },
    props: { attack },
  }));
}
export function GET({ props: { attack } }: { props: { attack: Attack } }) {
  return new Response(
    JSON.stringify(
      { ...attackGuidance(attack), attack_flow: attackFlow(attack) },
      null,
      2,
    ),
    { headers: { "Content-Type": "application/json; charset=utf-8" } },
  );
}
