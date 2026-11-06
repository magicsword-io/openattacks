import catalog from "../../../../detections/catalog.json";
export function getStaticPaths() {
  return Object.values(catalog.profiles)
    .filter((profile) => profile.queries)
    .map((profile) => ({
      params: { profile: profile.id },
      props: { query: profile.queries!.sigma },
    }));
}
export function GET({ props }: { props: { query: string } }) {
  return new Response(props.query, {
    headers: { "Content-Type": "application/yaml; charset=utf-8" },
  });
}
