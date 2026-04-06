export function applySeoFromMetaHeader(metaHeader) {
  if (!metaHeader) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(metaHeader, "text/html");

  const title = doc.querySelector("title")?.textContent?.trim();
  if (title) document.title = title;

  const upsertMeta = (name, content, isProperty = false) => {
    if (!content) return;
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      if (isProperty) el.setAttribute("property", name);
      else el.setAttribute("name", name);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  const upsertCanonical = (href) => {
    if (!href) return;
    let el = document.head.querySelector('link[rel="canonical"]');
    if (!el) {
      el = document.createElement("link");
      el.setAttribute("rel", "canonical");
      document.head.appendChild(el);
    }
    el.setAttribute("href", href);
  };

  doc.querySelectorAll('meta[name]').forEach((m) => upsertMeta(m.getAttribute("name"), m.getAttribute("content")));
  doc.querySelectorAll('meta[property]').forEach((m) => upsertMeta(m.getAttribute("property"), m.getAttribute("content"), true));
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href");
  upsertCanonical(canonical);
}
