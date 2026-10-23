import world from "world-atlas/countries-110m.json";
import { feature } from "topojson-client";
import { geoCentroid } from "d3-geo";
import type { Topology } from "topojson-specification";
import type { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

const aliases: Record<string, string> = {
  "United States of America": "United States",
  "South Korea": "South Korea",
  "North Korea": "North Korea",
  "United Kingdom": "United Kingdom",
};
export const worldFeatures = feature(
  world as unknown as Topology,
  "countries",
) as unknown as FeatureCollection<Geometry, GeoJsonProperties>;
export const countryName = (name: string) => aliases[name] || name;
export const countryRegions = Object.fromEntries(
  worldFeatures.features.map((country) => [
    countryName(country.properties!.name),
    {
      coordinates: geoCentroid(country) as [number, number],
      id: String(country.id),
      kind: "country",
    },
  ]),
);
// A marker represents a region, never a precise victim address.
export const regionMetadata: Record<
  string,
  { coordinates: [number, number]; id?: string; kind: string }
> = {
  ...countryRegions,
  "United States": {
    ...countryRegions["United States"],
    coordinates: [-100, 39],
    kind: "country",
  },
  Australia: {
    ...countryRegions.Australia,
    coordinates: [134, -25],
    kind: "country",
  },
  "Hong Kong": { coordinates: [114.17, 22.3], kind: "country" },
  Europe: { coordinates: [20, 53], kind: "region" },
  Africa: { coordinates: [20, 4], kind: "region" },
  Asia: { coordinates: [85, 40], kind: "region" },
  "North America": { coordinates: [-105, 50], kind: "region" },
  "South America": { coordinates: [-62, -18], kind: "region" },
  Oceania: { coordinates: [155, -24], kind: "region" },
};
