"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyMarkdown({ markdown }: { markdown: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "unavailable">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown);
      setStatus("copied");
    } catch {
      setStatus("unavailable");
    }
  }

  return (
    <>
      <button className="machine-copy" type="button" onClick={copy}>
        {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
        {status === "copied" ? "Copied" : "Copy Markdown"}
      </button>
      <span className="machine-copy-status" role="status">
        {status === "copied" ? "Markdown copied." : status === "unavailable" ? "Open Raw Markdown to copy the text." : ""}
      </span>
    </>
  );
}
