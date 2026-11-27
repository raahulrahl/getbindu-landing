import type { Metadata } from "next";
import { markdownToHtml } from "@/features/landing/blog/posts";
import { CopyMarkdown } from "@/features/landing/home/components/CopyMarkdown";
import { ViewSwitch } from "@/features/landing/home/components/ViewSwitch";
import { INTEGRATIONS_HREF, LOGIN_HREF } from "@/features/landing/home/links";
import {
  machineFooter, machineHero, machineMarkdown, machineNavigation, machineSections,
} from "@/features/landing/home/machine-content";
import "./machine.css";

export const metadata: Metadata = {
  title: "Machine view",
  description: "A plain-text overview of Bindu’s EU trade compliance workflows and integrations.",
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
};

async function renderMachineMarkdown(markdown: string) {
  const html = await markdownToHtml(markdown);
  return html.replace(/href="(https:\/\/getbindu\.com(\/[^"]*))"/g, (match, url, path) =>
    url === LOGIN_HREF ? match : `href="${path}"`,
  );
}

export default async function MachinePage() {
  const navigation = [
    { title: "Product", markdown: machineNavigation.product },
    { title: "Regulations", markdown: machineNavigation.regulations },
    { title: "Resources", markdown: machineNavigation.resources },
  ];
  const [hero, footer, groups, sections] = await Promise.all([
    renderMachineMarkdown(machineHero),
    renderMachineMarkdown(machineFooter),
    Promise.all(navigation.map(({ markdown }) => renderMachineMarkdown(markdown))),
    Promise.all(machineSections.map(renderMachineMarkdown)),
  ]);

  return (
    <div className="bindu-machine">
      <a className="machine-skip" href="#machine-content">Skip to content</a>
      <ViewSwitch mode="machine" />
      <div className="machine-shell">
        <header>
          <div className="machine-toolbar">
            <p className="machine-brand"><a href="/">Bindu</a><span aria-hidden="true">/</span>Machine view</p>
            <div className="machine-tools">
              <a href="/ai.md">Raw Markdown</a>
              <CopyMarkdown markdown={machineMarkdown} />
            </div>
          </div>

          <div className="machine-notice">
            <a href={INTEGRATIONS_HREF}>Browse the integrations catalog <span aria-hidden="true">↗</span></a>
            <a href="/llms.txt">llms.txt</a>
          </div>

          <nav className="machine-navigation machine-prose" aria-label="Bindu navigation">
            {navigation.map(({ title }, index) => (
              <section key={title}>
                <h2>{title}</h2>
                <div dangerouslySetInnerHTML={{ __html: groups[index] ?? "" }} />
              </section>
            ))}
          </nav>
        </header>

        <main id="machine-content" tabIndex={-1} className="machine-prose">
          <section className="machine-hero" dangerouslySetInnerHTML={{ __html: hero }} />
          {sections.map((html, index) => (
            <section key={index} className="machine-section" dangerouslySetInnerHTML={{ __html: html }} />
          ))}
        </main>
        <footer className="machine-section machine-prose" dangerouslySetInnerHTML={{ __html: footer }} />
      </div>
    </div>
  );
}
