import catalog from "./catalog.json";

type CatalogEntry = [id: string, name: string, categories: string[], logoFile: string];

export const integrationCategories: Record<string, string> = catalog.categories;
export const integrationLogoBase = "https://cdn.sanity.io/images/7yse5usn/production/";

const entries = catalog.integrations as CatalogEntry[];
const featuredErpIds = [
  "sap-odata-oauth2-cc",
  "microsoft-dynamics-365-finance-and-operations",
  "netsuite",
  "infor",
  "acumatica",
  "sage-intacct-oauth",
  "odoo",
  "erpnext",
];
const entriesById = new Map(entries.map((entry) => [entry[0], entry]));
export const featuredErp = featuredErpIds.flatMap((id) => {
  const entry = entriesById.get(id);
  return entry?.[2].includes("erp") ? [entry] : [];
});
const featuredIds = new Set(featuredErp.map(([id]) => id));
const featuredFirst = [...featuredErp, ...entries.filter(([id]) => !featuredIds.has(id))];

export function findIntegrations(query: string, category: string) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const source = !terms.length && (!category || category === "erp") ? featuredFirst : entries;

  return source.filter(([id, name, tags]) => (
    (!category || tags.includes(category)) &&
    terms.every((term) => `${name.toLowerCase()} ${id}`.includes(term))
  ));
}
