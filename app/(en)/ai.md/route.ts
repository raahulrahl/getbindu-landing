import { machineMarkdown } from "@/features/landing/home/machine-content";

export function GET() {
  return new Response(machineMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "X-Robots-Tag": "noindex",
    },
  });
}
