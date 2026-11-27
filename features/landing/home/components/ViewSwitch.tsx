import Link from "next/link";
import "./view-switch.css";

export function ViewSwitch({ mode }: { mode: "human" | "machine" }) {
  return (
    <nav className="bindu-view-switch" aria-label="Page view" data-skip-route-wipe>
      <Link href="/" prefetch={false} aria-current={mode === "human" ? "page" : undefined}>
        Human
      </Link>
      <Link href="/ai" prefetch={false} aria-current={mode === "machine" ? "page" : undefined}>
        Machine
      </Link>
    </nav>
  );
}
