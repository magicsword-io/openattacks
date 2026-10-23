import { getAttacks, toCSV } from "../../lib/catalog";
export async function GET() {
  return new Response(toCSV(await getAttacks()), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
