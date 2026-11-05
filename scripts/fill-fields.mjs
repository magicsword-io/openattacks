import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { parseDocument } from "yaml";

const attacksDir = new URL("../attacks/", import.meta.url);
const files = readdirSync(attacksDir).filter(name => name.endsWith(".yaml"));

// Helper to determine category from ai_role
function inferCategory(aiRole) {
  const targetRoles = [
    "ai_agent_or_mcp_as_target",
    "ai_credential_theft",
  ];
  return targetRoles.includes(aiRole) ? "attacks-on-ai" : "adversary-use-of-ai";
}

// Helper to extract attribution from attribution_or_cluster text
function parseAttribution(text, sources) {
  if (!text || text === "unknown") return null;
  
  const attribution = {};
  
  // Extract actor name (first part before semicolon or slash)
  const actorMatch = text.match(/^([^;/]+)/);
  if (actorMatch) {
    attribution.actor_name = actorMatch[1].trim();
  }
  
  // Check for country mentions
  const countries = ["Russia", "China", "Iran", "North Korea", "PRC"];
  for (const country of countries) {
    if (text.toLowerCase().includes(country.toLowerCase())) {
      attribution.country = country === "PRC" ? "China" : country;
      break;
    }
  }
  
  // Check for motivation
  if (text.match(/nation-state|state-sponsored|government/i)) {
    attribution.motivation = "nation-state";
  } else if (text.match(/financ|crime|ransom/i)) {
    attribution.motivation = "financially-motivated";
  }
  
  // Extract confidence
  if (text.match(/high confidence/i)) attribution.confidence = "high";
  else if (text.match(/moderate|medium confidence/i)) attribution.confidence = "medium";
  else if (text.match(/low confidence/i)) attribution.confidence = "low";
  
  // Attributed by (from sources)
  if (sources && sources.length > 0) {
    const orgs = sources.map(s => s.publisher).filter(Boolean);
    if (orgs.length > 0) {
      attribution.attributed_by = orgs[0];
    }
  }
  
  return Object.keys(attribution).length > 0 ? attribution : null;
}

// Helper to determine AI involvement confidence
function inferAIConfidence(borderline, sources) {
  if (borderline) return "unverified";
  
  // Check if sources are from major vendors/researchers
  const vendorPublishers = ["CrowdStrike", "Microsoft", "Google", "Mandiant"];
  const hasVendor = sources?.some(s => 
    vendorPublishers.some(v => s.publisher?.includes(v))
  );
  
  return hasVendor ? "vendor-asserted" : "confirmed";
}

// Process each file
for (const filename of files) {
  const path = new URL(filename, attacksDir);
  const raw = readFileSync(path, "utf8");
  const doc = parseDocument(raw);
  const data = doc.toJS();
  
  // Skip if already has category
  if (data.category) {
    console.log(`✓ ${filename} already has fields`);
    continue;
  }
  
  console.log(`Processing ${filename}...`);
  
  // Add category
  data.category = inferCategory(data.ai_role);
  
  // Add attribution
  const attribution = parseAttribution(data.attribution_or_cluster, data.sources);
  if (attribution) {
    data.attribution = attribution;
  }
  
  // Add AI involvement confidence
  data.ai_involvement_confidence = inferAIConfidence(data.borderline, data.sources);
  
  // Add basic detection guidance
  data.detections = [{
    name: "Review attack-specific indicators",
    format: "guidance",
    notes: `Monitor for the techniques described in ${data.name}. Refer to sources for specific IOCs and TTPs.`
  }];
  
  // Write back
  doc.set("category", data.category);
  if (attribution) doc.set("attribution", attribution);
  doc.set("ai_involvement_confidence", data.ai_involvement_confidence);
  doc.set("detections", data.detections);
  
  writeFileSync(path, doc.toString(), "utf8");
  console.log(`  ✓ Updated ${filename}`);
}

console.log("\nDone! Please review and refine manually.");
