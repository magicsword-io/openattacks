// Runtime and website consume the same generated, source-checked definitions.
import catalog from "../../simulations/catalog.json";
export function simulationsFor(attackId) {
  return catalog.simulations
    .flatMap((sim) => {
      const mapping = sim.attack_mappings.find(
        (item) => item.attack_id === attackId,
      );
      return mapping ? [{ ...sim, mapping, stage_ids: mapping.stage_ids }] : [];
    })
    .sort(
      (a, b) =>
        Number(b.mapping.relationship === "source-match") -
        Number(a.mapping.relationship === "source-match"),
    );
}
// Kept as a small lookup for the catalog indicator.
export function simulationPreview(attackId) {
  return simulationsFor(attackId)[0];
}
