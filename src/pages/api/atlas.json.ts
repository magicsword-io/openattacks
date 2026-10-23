import atlas from "../../data/atlas-techniques.json";
export function GET() {
  return new Response(JSON.stringify(atlas, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
