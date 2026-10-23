import { magicswordURL } from "./magicsword-links.mjs";
function attributeLink(link: Element) {
  const href = link.getAttribute("href");
  if (href) link.setAttribute("href", magicswordURL(href));
}
document.querySelectorAll("a[href]").forEach(attributeLink);
// Cover source-content links and client-rendered anchors without rewriting catalog evidence.
const attributeEvent = (event: Event) => {
  const link =
    event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (link) attributeLink(link);
};
for (const name of ["click", "auxclick", "contextmenu"])
  document.addEventListener(name, attributeEvent, { capture: true });
