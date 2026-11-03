import catalog from "../../../simulations/catalog.json";
export const GET = () =>
  new Response(JSON.stringify(catalog), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
