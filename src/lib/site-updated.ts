import { execFileSync } from "node:child_process";

// Build-time only (imports node:child_process); use from .astro frontmatter, not client code.
// The site's "last updated" date is the date of the commit being built, so rebuilding
// unchanged content keeps the same date. Falls back to the build date without git history.
function lastCommitDate() {
  try {
    return execFileSync("git", ["log", "-1", "--format=%cs"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

const commitDate = lastCommitDate();
export const siteUpdated = /^\d{4}-\d{2}-\d{2}$/.test(commitDate)
  ? commitDate
  : new Date().toISOString().slice(0, 10);
