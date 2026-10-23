import { getAttacks } from "../../lib/catalog";
export async function GET() {
  return new Response(JSON.stringify(await getAttacks(), null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
