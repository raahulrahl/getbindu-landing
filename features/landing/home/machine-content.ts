import "server-only";

import { benchmarkAxes, benchmarkDatasets, benchmarkSeries } from "./benchmarks";
import {
  DEMO_URL, TESTIMONIALS_PLACEHOLDER, cta, footer, footerRoles,
  blogRow, faq, hero, journey, nav, pricing, publishedFaqItems, rules, statement, story, voices,
} from "./content";
import { featuredErp } from "../integrations/catalog";
import { getHomeBlogPosts } from "./home-blog-posts";
import {
  DOCS_HREF, ERP_INTEGRATIONS_HREF, ERP_REQUEST_HREF, FOOTER_PAGES, INTEGRATIONS_HREF,
  LEGAL_LINKS, LOGIN_HREF, NAV_BLOG, NAV_REGULATIONS,
} from "./links";
import { regulationQuestions } from "./regulation-questions";
import { shipmentExamples } from "./shipment-examples";

const site = "https://getbindu.com";
const sections = (...blocks: string[]) => blocks.join("\n\n");
const list = (items: string[]) => items.map((text) => `- ${text}`).join("\n");
const link = (label: string, target: string) => {
  const href = target.startsWith("#") ? `/${target}` : target;
  return `[${label}](${href.startsWith("/") ? site + href : href})`;
};
const links = (items: { t: string; u: string }[]) => list(items.map(({ t, u }) => link(t, u)));

export const machineNavigation = {
  product: links([
    ...nav.links.map(({ t, href }) => ({ t, u: href })),
    { t: "Integrations", u: INTEGRATIONS_HREF },
    { t: "Log in", u: LOGIN_HREF },
  ]),
  regulations: links(NAV_REGULATIONS),
  resources: links([
    NAV_BLOG,
    { t: "Docs", u: DOCS_HREF },
    ...footer.company,
  ]),
};

export const machineHero = sections(
  `# ${hero.title.join(" ")}`,
  hero.eyebrow,
  hero.sub,
  link(cta.demo, DEMO_URL),
);

export const machineSections = [
  sections(
    "## Ask about EU trade rules",
    ...regulationQuestions.map(({ question, answer, title, href, source }) => sections(
      `### ${question}`, answer, href ? `${link(title, href)} · ${link("EU source", source)}` : link("EU source", source),
    )),
  ),
  sections(
    `## ${story.title}`,
    `${statement.before} Bindu ${statement.after}`,
    story.lead,
    story.stops.map((step, index) => `${index + 1}. **${step.t}** · ${step.cap}`).join("\n"),
    "Bindu files EUDR due diligence statements to EU TRACES and returns the reference number.",
    link("EUDR filing workflow", "/eudr"),
  ),
  sections(
    `## ${journey.title}`,
    journey.caption,
    ...journey.stories.map(({ tab, sub, milestones }) => sections(
      `### ${tab}`, sub, list(milestones.map(({ label, detail }) => `${label} · ${detail}`)),
    )),
  ),
  sections(
    "## Worked examples",
    "These fictional shipment scenarios illustrate how evidence changes the outcome. Authorities decide whether real shipments clear customs.",
    ...shipmentExamples.map((example) => sections(
      `### ${example.head}`,
      `${example.goods} · ${example.route} · ${example.rule} · ${example.verdict === "pass" ? "Let through" : "Stopped"}`,
      example.story + (example.build ? " Battery passports are in build." : ""),
    )),
  ),
  sections(
    "## Trade compliance benchmarks",
    "Illustrative data for review time and evidence completeness. The figures are placeholders for measured results.",
    ...benchmarkDatasets.map(({ label, sample, methodology, testingDates, runs }) => sections(
      `### ${label}`, sample, methodology, testingDates,
      [
        `| Run | Workflow | ${benchmarkAxes.time.label} | ${benchmarkAxes.completeness.label} |`,
        "| --- | --- | ---: | ---: |",
        ...runs.map(({ id, series, minutes, completeness }) => `| ${id} | ${benchmarkSeries[series]} | ${minutes} | ${completeness} |`),
      ].join("\n"),
    )),
  ),
  sections(
    `## ${voices.title}`,
    voices.placeholder,
    ...TESTIMONIALS_PLACEHOLDER.map(({ q, role, country, company, guide }) =>
      sections(`> ${q}`, `${company} · ${role} · ${country}${guide ? ` · ${link(guide.label, guide.href)}` : ""}`),
    ),
  ),
  sections(
    `## ${rules.title}`,
    rules.lead,
    ...rules.items.map(({ t, d, live, date, read, href, src }) => sections(
      `### ${t}`,
      `Bindu status: ${live ? rules.live : rules.build}`,
      d,
      ...(date ? [date] : []),
      `${link(read, href)} · ${link(src.t, src.u)}`,
    )),
  ),
  sections(
    "## Protected workspaces, traceable filings",
    `Each filing links back to its supplier evidence. Our ${link("privacy policy", "/privacy")} explains how we protect the records in your workspace.`,
    list(["EU hosting", "Workspace isolation", "Encryption in transit", "Source-linked evidence", "5-year EUDR retention"]),
  ),
  sections(
    `## ${pricing.title}`,
    pricing.lead,
    ...pricing.tabs.map((tab) => {
      if (tab.price) return sections(
        `### ${tab.label}`,
        `From ${tab.price.amount} ${tab.price.unit}. ${pricing.calc.vat}.`,
        list(tab.price.rows.map(({ k, v }) => `${k} · ${v}`)),
      );
      if (tab.lines) return sections(
        `### ${tab.label}`,
        list(tab.lines.map(({ t, s }) => `${t} · ${s === "live" ? rules.live : rules.build}`)),
      );
      return sections(`### ${tab.label}`, `${rules.build}. ${tab.desc}`);
    }),
    link("Open the EUDR cost estimator", "#pricing"),
  ),
  sections(
    `## ${blogRow.title}`,
    list(getHomeBlogPosts().map((post) =>
      `${link(post.title, `/blog/${post.slug}`)} · ${post.category} · ${post.date}`,
    )),
    link(blogRow.all, NAV_BLOG.u),
  ),
  sections(
    "## Filing and supplier channels",
    list([link("EU TRACES", "/eudr"), "WhatsApp", "Email"]),
  ),
  sections(
    "## 1,000+ integrations",
    "Search the homepage integration catalog by app or category. For platform-specific setup and workflow availability, talk to Bindu.",
    list([
      link("Browse all integrations", INTEGRATIONS_HREF),
      link("Find ERP integrations", ERP_INTEGRATIONS_HREF),
      link("Request a connector", ERP_REQUEST_HREF),
    ]),
    "### Featured ERP connectors",
    list(featuredErp.map(([, name]) => name)),
  ),
  sections(
    `## ${faq.title}`,
    ...publishedFaqItems.map(({ q, a }) => sections(`### ${q}`, a)),
  ),
];

export const machineFooter = sections(
  "## More from Bindu",
  links([...FOOTER_PAGES, ...LEGAL_LINKS]),
  `${footerRoles.lead} ${footerRoles.items.map(({ t, href }) => link(t, href)).join(", ")}.`,
  footer.legal,
);

export const machineMarkdown = sections(
  machineHero,
  "## Navigation",
  "### Product",
  machineNavigation.product,
  "### Regulations",
  machineNavigation.regulations,
  "### Resources",
  machineNavigation.resources,
  ...machineSections,
  machineFooter,
) + "\n";
