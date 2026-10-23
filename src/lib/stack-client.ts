import {
  hasStackCriteria,
  matchStack,
  normalizeSelection,
  selectionFromURL,
  selectionURL,
  stackTools,
  stackSystems,
  type StackSelection,
} from "./stack-matching.mjs";
import type { StackEntry } from "./stack-data";

const root = document.querySelector<HTMLElement>("[data-stack-explorer]");
if (root) {
  const payload = JSON.parse(
    root.querySelector("[data-stack-data]")!.textContent!,
  ) as { entries: StackEntry[] };
  const form = root.querySelector<HTMLFormElement>("form")!;
  const inputs = Array.from(form.querySelectorAll<HTMLInputElement>("input"));
  const latest = document.querySelector<HTMLElement>("[data-stack-default]");
  const results = root.querySelector<HTMLElement>("[data-stack-results]")!;
  const cards = Array.from(
    root.querySelectorAll<HTMLElement>("[data-stack-result]"),
  );
  const list = root.querySelector(".stack-result-list")!;
  const showAll = root.querySelector<HTMLButtonElement>(
    "[data-stack-show-all]",
  )!;
  const copy = root.querySelector<HTMLButtonElement>("[data-stack-copy]")!;
  const reset = root.querySelector<HTMLButtonElement>("[data-stack-reset]")!;
  const status = root.querySelector<HTMLElement>("[data-stack-copy-status]")!;
  let expanded = false;
  let selection: StackSelection = normalizeSelection();
  function readForm(): StackSelection {
    return normalizeSelection({
      tools: inputs
        .filter((input) => input.name === "tools" && input.checked)
        .map((input) => input.value),
      systems: inputs
        .filter((input) => input.name === "systems" && input.checked)
        .map((input) => input.value),
      mcp:
        inputs.find((input) => input.name === "mcp" && input.checked)?.value ||
        "",
    });
  }
  function render(updateURL = true) {
    const active = hasStackCriteria(selection);
    const matches = matchStack(payload.entries, selection);
    const selected = [
      ...stackTools
        .filter((tool) => selection.tools.includes(tool.id))
        .map((tool) => tool.label),
      ...stackSystems
        .filter((system) => selection.systems.includes(system.id))
        .map((system) => system.label),
      ...(selection.mcp
        ? [
            selection.mcp === "yes"
              ? "MCP connected"
              : selection.mcp === "no"
                ? "No MCP connections"
                : "MCP connections unknown",
          ]
        : []),
    ];
    root!.querySelector("[data-stack-selection-summary]")!.textContent =
      selected.join(" · ") ||
      "Start with a tool, an operating system, or MCP connections.";
    copy.hidden = reset.hidden = selected.length === 0;
    results.hidden = !active;
    if (latest) latest.hidden = active;
    root!.querySelector("[data-stack-count]")!.textContent =
      `${matches.length} ${matches.length === 1 ? "report" : "reports"} to review`;
    root!.querySelector<HTMLElement>("[data-stack-empty]")!.hidden =
      matches.length > 0;
    root!
      .querySelector<HTMLElement>("[data-stack-inventory]")!
      .classList.toggle("is-uncertain", selection.mcp === "unknown");
    cards.forEach((card) => {
      card.hidden = true;
    });
    matches.forEach((match, index) => {
      const card = cards.find(
        (card) => card.dataset.stackResult === match.entry.id,
      )!;
      card.hidden = !expanded && index >= 4;
      card.querySelector("[data-stack-reason]")!.textContent =
        match.reasons.join(" ");
      card.querySelector("[data-stack-relationship]")!.textContent =
        match.relationship;
      const conditions = card.querySelector("[data-stack-conditions]")!;
      conditions.replaceChildren(
        ...match.conditions.map((condition) => {
          const item = document.createElement("li");
          item.textContent = condition;
          return item;
        }),
      );
      const policy = card.querySelector<HTMLElement>("[data-stack-policy]");
      if (policy)
        policy.hidden =
          selection.systems.length > 0 &&
          !selection.systems.includes("windows");
      list.append(card);
    });
    showAll.hidden = matches.length <= 4;
    showAll.textContent = expanded
      ? "Show fewer reports"
      : `Show all ${matches.length} reports`;
    root!.dataset.stackActive = String(active);
    root!.dataset.matchedIds = JSON.stringify(
      matches.map((match) => match.entry.id),
    );
    document.dispatchEvent(
      new CustomEvent("stack:change", {
        detail: { active, ids: matches.map((match) => match.entry.id) },
      }),
    );
    if (updateURL)
      history.replaceState(
        null,
        "",
        selectionURL(new URL(location.href), selection),
      );
  }
  function loadURL() {
    selection = selectionFromURL(new URLSearchParams(location.search));
    inputs.forEach((input) => {
      input.checked =
        input.name === "tools"
          ? selection.tools.includes(input.value)
          : input.name === "systems"
            ? selection.systems.includes(input.value)
            : selection.mcp === input.value;
    });
    const more = root!.querySelector<HTMLDetailsElement>(".stack-more-tools");
    if (
      more &&
      stackTools.some(
        (tool) => !tool.primary && selection.tools.includes(tool.id),
      )
    )
      more.open = true;
    expanded = false;
    render(false);
  }
  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("change", () => {
    selection = readForm();
    expanded = false;
    status.textContent = "";
    render();
  });
  form.addEventListener("reset", (event) => {
    event.preventDefault();
    inputs.forEach((input) => {
      input.checked = false;
    });
    selection = normalizeSelection();
    expanded = false;
    status.textContent = "";
    render();
  });
  showAll.addEventListener("click", () => {
    expanded = !expanded;
    render(false);
  });
  copy.addEventListener("click", async () => {
    const url = selectionURL(new URL(location.href), selection);
    url.hash = "your-stack";
    try {
      await navigator.clipboard.writeText(url.href);
      status.textContent =
        "Link copied. Anyone with this link can open the same selection.";
    } catch {
      status.textContent = `Copy this link: ${url.href}`;
    }
  });
  window.addEventListener("popstate", loadURL);
  loadURL();
}
