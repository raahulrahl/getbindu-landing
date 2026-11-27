import { ArrowUpRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { findIntegrations, integrationCategories, integrationLogoBase } from "../../integrations/catalog";
import { IntegrationLogo } from "../../integrations/integration-logo";
import { ERP_REQUEST_HREF, INTEGRATIONS_ANCHOR } from "../links";
import { ScrollRowButtons, useScrollRow } from "./ScrollRow";

const number = new Intl.NumberFormat("en-US");
const pageSize = 36;
const defaultView = { query: "", category: "", page: 1 };

function readView(params: URLSearchParams) {
  const category = params.get("category") ?? "";
  const page = Number(params.get("page"));

  return {
    query: (params.get("q") ?? "").slice(0, 100),
    category: Object.hasOwn(integrationCategories, category) ? category : "",
    page: Number.isSafeInteger(page) ? Math.max(1, page) : 1,
  };
}

export function Integrations() {
  const [view, setView] = useState(defaultView);
  const { query, category } = view;
  const results = useMemo(() => findIntegrations(query, category), [query, category]);
  const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(view.page, pageCount);
  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, results.length);
  const control = useScrollRow({ contentKey: JSON.stringify([query, category, page]), stepByViewport: true });

  useEffect(() => {
    function restoreView() {
      setView(readView(new URLSearchParams(window.location.search)));
    }
    restoreView();
    window.addEventListener("popstate", restoreView);
    return () => window.removeEventListener("popstate", restoreView);
  }, []);

  function updateView(next: typeof defaultView) {
    setView(next);
    const url = new URL(window.location.href);
    const params = { q: next.query.trim(), category: next.category, page: next.page > 1 ? String(next.page) : "" };

    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    url.hash = INTEGRATIONS_ANCHOR;
    window.history.replaceState(null, "", url);
  }

  return (
    <section className="band-dark sec home-integrations" id={INTEGRATIONS_ANCHOR} aria-labelledby="integrations-heading">
      <div className="container connector-row">
        <div id="erp-connectors" className="integration-intro">
          <h2 id="integrations-heading" className="t-display-lg">1,000+ integrations</h2>
          <a className="integration-request" href={ERP_REQUEST_HREF}>
            Request a connector <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
        <div className="integration-browser">
          <form className="integration-filters" role="search" aria-label="Integration directory" onSubmit={(event) => event.preventDefault()}>
            <label className="integration-search">
              <span className="sr">Search integrations</span>
              <Search size={16} aria-hidden="true" />
              <input type="search" value={query} placeholder="Search apps" maxLength={100}
                onChange={(event) => updateView({ ...view, query: event.target.value, page: 1 })} />
            </label>
            <label>
              <span className="sr">Integration category</span>
              <select value={category} onChange={(event) => updateView({ ...view, category: event.target.value, page: 1 })}>
                <option value="">All categories</option>
                {Object.entries(integrationCategories).map(([id, name]) => <option key={id} value={id}>{name}</option>)}
              </select>
            </label>
          </form>

          <div className="integration-toolbar">
            <p className="integration-count" role="status">
              {results.length ? `${number.format(start + 1)}–${number.format(end)} of ${number.format(results.length)}` : "0 results"}
            </p>
            {results.length > 0 && <ScrollRowButtons control={control} previous="Previous integrations" next="Next integrations" />}
          </div>

          {results.length > 0 ? (
            <ul ref={control.row} className="scroll-row integration-row" role="list" aria-label="Integrations" tabIndex={0}>
              {results.slice(start, end).map(([id, name, tags, logoFile]) => (
                <li className="integration-slide" key={id}>
                  <IntegrationLogo name={name} src={integrationLogoBase + logoFile} />
                  <h3>{name}</h3>
                  <p>{tags.map((tag) => integrationCategories[tag]).join(" · ")}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="integration-empty">
              <p>Try another app name or category.</p>
              <button className="btn btn-secondary" type="button" onClick={() => updateView(defaultView)}>Clear filters</button>
            </div>
          )}

          {pageCount > 1 && (
            <nav className="integration-paging" aria-label="Integration result pages">
              <button className="btn btn-secondary" type="button" disabled={page === 1}
                onClick={() => updateView({ ...view, page: page - 1 })}>Previous results</button>
              <span>Page {page} of {pageCount}</span>
              <button className="btn btn-secondary" type="button" disabled={page === pageCount}
                onClick={() => updateView({ ...view, page: page + 1 })}>Next results</button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
