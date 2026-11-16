import { magicswordURL } from "./magicsword-links.mjs";
// Public navigation destinations.
const inventoryDestination =
  import.meta.env.MAGICSWORD_INVENTORY_URL ||
  "https://www.magicsword.io/use-cases/endpoint-visibility";
const mcpDestination =
  import.meta.env.MAGICSWORD_MCP_SETUP_URL ||
  "https://www.magicsword.io/mcp#connect";
export const inventoryURL = magicswordURL(inventoryDestination, "inventory");
export const mcpSetupURL = magicswordURL(mcpDestination, "mcp-connect");
export const preventionURL = magicswordURL(
  "https://www.magicsword.io/",
  "nav-prevent",
);
