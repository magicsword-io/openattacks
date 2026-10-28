import { magicswordURL } from "./magicsword-links.mjs";
// Public navigation destinations. Override the MCP preview URL when its setup page launches.
const inventoryDestination =
  import.meta.env.MAGICSWORD_INVENTORY_URL ||
  "https://www.magicsword.io/use-cases/endpoint-visibility";
const mcpDestination =
  import.meta.env.MAGICSWORD_MCP_SETUP_URL ||
  "https://magic-portal-git-josehelps-mcp-server-m-a9b665-d1vious-projects.vercel.app/mcp#connect";
export const inventoryURL = magicswordURL(inventoryDestination, "inventory");
export const mcpSetupURL = magicswordURL(mcpDestination, "mcp-connect");
export const preventionURL = magicswordURL(
  "https://www.magicsword.io/",
  "nav-prevent",
);
