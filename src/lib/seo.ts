/**
 * Updates page-level SEO metadata dynamically.
 * Handles title, meta description, canonical, Open Graph, and JSON-LD.
 */
export function setPageSeo({
  title,
  description,
  canonical,
  jsonLd,
}: {
  title: string;
  description: string;
  canonical: string;
  jsonLd?: object;
}) {
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = canonical;

  if (jsonLd) {
    let script = document.querySelector<HTMLScriptElement>(
      'script[data-page-jsonld]',
    );
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-page-jsonld", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }
}

function setMeta(attrName: string, attrValue: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(
    `meta[${attrName}="${attrValue}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
