import { ArrowUpRight, ChevronDown, Copy } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

const promptTitle = "Explain how Bindu works";
const prompt = [
  `${promptTitle} (https://getbindu.com/) in plain English for an EU importer.`,
  "Walk me through one EUDR shipment. Start with the goods, then show how Bindu requests and checks supplier evidence, prepares the filing, and returns a TRACES reference.",
  "At each step, explain what Bindu does, what my team or suppliers need to provide, and what I get back. Verify the workflow using Bindu’s product pages and cite official EU sources for regulatory claims.",
].join("\n\n");

const assistants = [
  { name: "Claude", icon: "/home/assistants/claude.png", href: "https://claude.ai/new" },
  { name: "Codex", icon: "/home/assistants/codex.png", href: "https://chatgpt.com/codex" },
  { name: "Cursor", icon: "/home/assistants/cursor.png", href: "https://cursor.com/agents" },
];

export function ExplainBindu() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState("");
  const disclosure = useRef<HTMLButtonElement>(null);

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setStatus("Prompt copied");
    } catch {
      setOpen(true);
      setStatus("Select the prompt to copy it manually.");
    }
  }

  return (
    <div className="hero-prompt" onKeyDown={(event) => {
      if (event.key !== "Escape" || !open) return;
      setOpen(false);
      disclosure.current?.focus();
    }}>
      <div className="hero-prompt-actions">
        <button type="button" className="btn btn-secondary hero-prompt-copy" title="Copy this prompt" onClick={copyPrompt}>
          <Copy size={15} aria-hidden="true" />
          <span className="hero-prompt-label">{status === "Prompt copied" ? status : promptTitle}</span>
          <span className="hero-prompt-marks" aria-hidden="true">
            {assistants.map(({ name, icon }) => <Image key={name} src={icon} alt="" width={15} height={15} unoptimized />)}
          </span>
        </button>
        <button ref={disclosure} type="button" className="btn btn-secondary hero-prompt-toggle"
          aria-expanded={open} aria-controls="hero-bindu-prompt" aria-label="Explain Bindu prompt options" onClick={() => setOpen(!open)}>
          <ChevronDown size={15} aria-hidden="true" />
        </button>
      </div>
      <div id="hero-bindu-prompt" className="hero-prompt-preview" hidden={!open}>
        <h2>{promptTitle}</h2>
        <div className="hero-prompt-assistants">
          {assistants.map(({ name, icon, href }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer">
              <Image src={icon} alt="" width={18} height={18} unoptimized />
              {name}
              <ArrowUpRight size={12} aria-hidden="true" />
            </a>
          ))}
        </div>
        <label htmlFor="hero-bindu-prompt-text" className="sr">Prompt to paste into your AI assistant</label>
        <textarea id="hero-bindu-prompt-text" readOnly rows={7} value={prompt} onFocus={(event) => event.currentTarget.select()} />
      </div>
      <span className="sr" role="status">{status}</span>
    </div>
  );
}
