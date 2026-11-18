const root = document.querySelector<HTMLElement>("[data-catalog]");
if (root) {
  const rows = Array.from(
    root.querySelectorAll<HTMLElement>("[data-attack-row]"),
  );
  const list = root.querySelector<HTMLOListElement>("[data-entry-list]")!;
  const search = root.querySelector<HTMLInputElement>("input[name=q]")!;
  const selects = Array.from(
    root.querySelectorAll<HTMLSelectElement>("select"),
  );
  const moreButton = root.querySelector<HTMLButtonElement>(".more-filters")!;
  const advanced = root.querySelector<HTMLElement>(".advanced-filters")!;
  const clearButton = root.querySelector<HTMLButtonElement>(".reset-filters")!;
  const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-next]");
  let page = 1;
  let ascending = false;
  const size = 10;
  const arrayFields: Record<string, string> = {
    environment: "environments",
    region: "regions",
    tool: "tools",
    framework: "frameworks",
  };

  function updateURL() {
    const url = new URL(location.href);
    url.search = "";
    if (search.value.trim()) url.searchParams.set("q", search.value.trim());
    for (const select of selects)
      if (select.value) url.searchParams.set(select.name, select.value);
    if (ascending) url.searchParams.set("sort", "oldest");
    if (page > 1) url.searchParams.set("page", String(page));
    history.replaceState(null, "", url);
  }
  function render(update = true) {
    const query = search.value.trim().toLowerCase();
    const tokens = query.split(/\s+/).filter(Boolean);
    const filters = selects.filter((select) => select.value);
    const chips = root!.querySelector(".active-filter-chips");
    if (chips) {
      chips.replaceChildren();
      const addChip = (label: string, clear: () => void) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "active-filter-chip";
        button.textContent = `${label} ×`;
        button.setAttribute("aria-label", `Remove filter: ${label}`);
        button.addEventListener("click", () => {
          clear();
          page = 1;
          render();
        });
        chips.append(button);
      };
      if (query)
        addChip(search.value, () => {
          search.value = "";
        });
      filters.forEach((select) =>
        addChip(select.selectedOptions[0]?.textContent || select.value, () => {
          select.value = "";
        }),
      );
    }
    const matches = rows
      .filter(
        (row) =>
          tokens.every((token) => row.dataset.search!.includes(token)) &&
          filters.every((select) => {
            if (select.name === "tool" && select.value.startsWith("platform:"))
              return (
                JSON.parse(row.dataset.platforms || "[]") as string[]
              ).includes(select.value.slice(9));
            if (
              select.name === "sector" &&
              select.value.startsWith("category:")
            )
              return (
                JSON.parse(row.dataset.sectorGroups || "[]") as string[]
              ).includes(select.value.slice(9));
            if (arrayFields[select.name])
              return (
                JSON.parse(
                  row.dataset[arrayFields[select.name]] || "[]",
                ) as string[]
              ).includes(select.value);
            return row.dataset[select.name] === select.value;
          }),
      )
      .sort(
        (a, b) =>
          (ascending ? 1 : -1) *
            a.dataset.date!.localeCompare(b.dataset.date!) ||
          a.dataset.id!.localeCompare(b.dataset.id!),
      );
    const pageCount = Math.max(1, Math.ceil(matches.length / size));
    page = Math.min(page, pageCount);
    rows.forEach((row) => {
      row.hidden = true;
    });
    const visible = matches.slice((page - 1) * size, page * size);
    const fragment = document.createDocumentFragment();
    let previousMonth = "";
    visible.forEach((row) => {
      const month = row.dataset.month!;
      if (month !== previousMonth) {
        const group = document.createElement("li");
        group.className = "catalog-month";
        group.dataset.monthHeading = "";
        const heading = document.createElement("h2");
        const label = new Intl.DateTimeFormat("en", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(new Date(`${month}-01T00:00:00Z`));
        heading.append(`Reported in ${label} `);
        const count = visible.filter(
          (entry) => entry.dataset.month === month,
        ).length;
        const total = document.createElement("span");
        total.textContent = `${count} ${count === 1 ? "entry" : "entries"} on this page`;
        heading.append(total);
        group.append(heading);
        fragment.append(group);
        previousMonth = month;
      }
      row.hidden = false;
      fragment.append(row);
    });
    // Keep every source row available for subsequent filters without stale headings.
    rows.filter((row) => row.hidden).forEach((row) => fragment.append(row));
    list.replaceChildren(fragment);
    const start = matches.length ? (page - 1) * size + 1 : 0;
    const end = Math.min(page * size, matches.length);
    root!.querySelector("[data-results-count]")!.textContent =
      `${query || filters.length ? "Found" : "Showing"} ${matches.length} ${matches.length === 1 ? "entry" : "entries"}${query || filters.length ? ` of ${rows.length}` : ""}`;
    root!.querySelector("[data-page-status]")!.textContent =
      `Showing ${start}–${end} of ${matches.length} entries`;
    clearButton.hidden = !query && !filters.length;
    root!.querySelector<HTMLElement>(".results-meta")!.hidden =
      !query && !filters.length;
    root!.querySelector<HTMLElement>(".empty-state")!.hidden =
      matches.length > 0;
    list.hidden = matches.length === 0;
    if (prev) prev.disabled = page === 1;
    if (next) next.disabled = page >= pageCount;
    const pageButtons = root!.querySelector(".page-number-buttons");
    if (pageButtons) {
      pageButtons.replaceChildren();
      for (let n = 1; n <= pageCount; n++) {
        const button = document.createElement("button");
        button.className = `page-button${n === page ? " active" : ""}`;
        button.textContent = String(n);
        button.setAttribute("aria-label", `Page ${n}`);
        if (n === page) button.setAttribute("aria-current", "page");
        button.addEventListener("click", () => {
          page = n;
          render();
          root!.scrollIntoView({ block: "start" });
        });
        pageButtons.append(button);
      }
    }
    if (update) updateURL();
    const sortButton = root!.querySelector<HTMLButtonElement>(".sort-button")!;
    sortButton.setAttribute(
      "aria-label",
      `Sort by reported date, ${ascending ? "newest" : "oldest"} first`,
    );
    sortButton.setAttribute("aria-pressed", String(ascending));
    root!.querySelector("[data-sort-label]")!.textContent = ascending
      ? "Oldest first"
      : "Newest first";
    root!.querySelector("[data-sort-arrow]")!.textContent = ascending
      ? "↑"
      : "↓";
  }
  function readURL() {
    const params = new URLSearchParams(location.search);
    search.value = params.get("q") || "";
    for (const select of selects) {
      select.value = params.get(select.name) || "";
    }
    const requestedPage = Number(params.get("page"));
    page = Number.isFinite(requestedPage)
      ? Math.max(1, Math.floor(requestedPage))
      : 1;
    ascending = params.get("sort") === "oldest";
    const hasAdvanced = selects.some(
      (select) => advanced.contains(select) && select.value,
    );
    if (hasAdvanced) {
      advanced.hidden = false;
      moreButton.setAttribute("aria-expanded", "true");
    }
    render(false);
  }
  function reset() {
    search.value = "";
    selects.forEach((select) => {
      select.value = "";
    });
    page = 1;
    render();
  }
  search.addEventListener("input", () => {
    page = 1;
    render();
  });
  selects.forEach((select) =>
    select.addEventListener("change", () => {
      page = 1;
      render();
    }),
  );
  moreButton.addEventListener("click", () => {
    advanced.hidden = !advanced.hidden;
    moreButton.setAttribute("aria-expanded", String(!advanced.hidden));
  });
  clearButton.addEventListener("click", reset);
  root.querySelector("[data-empty-reset]")!.addEventListener("click", reset);
  root.querySelector(".sort-button")!.addEventListener("click", () => {
    ascending = !ascending;
    page = 1;
    render();
  });
  prev?.addEventListener("click", () => {
    page--;
    render();
  });
  next?.addEventListener("click", () => {
    page++;
    render();
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "/" &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        (event.target as HTMLElement).tagName,
      )
    ) {
      event.preventDefault();
      search.focus();
    }
  });
  window.addEventListener("popstate", readURL);
  readURL();
}
