import catalog from "../../../../detections/catalog.json";
export function getStaticPaths() {
  return Object.values(catalog.profiles)
    .filter((profile) => profile.queries)
    .map((profile) => ({
      params: { profile: profile.id },
      props: { query: profile.queries!.spl },
    }));
}
export function GET({ props }: { props: { query: string } }) {
  return new Response(props.query, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
