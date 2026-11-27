import Image from "next/image";
import { rules as c } from "../content";

type Item = (typeof c.items)[number];

/* Lucide (ISC) outlines, 24px grid, drawn at 16px with a 1.5px stroke */
const ICONS: Record<string, string> = {
  tree: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z M7 16v6 M13 19v3 M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5",
  shirt: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z",
  battery: "M16 7h1a2 2 0 0 1 2 2v.5a.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5v.5a2 2 0 0 1-2 2h-1 M7 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3 M11 7l-3 5h4l-3 5",
  factory: "M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z M17 18h1 M12 18h1 M7 18h1",
  flask: "M9 3h6 M10 9V3 M14 9V3 M10 9 4.5 18.5A2 2 0 0 0 6.2 21.5h11.6a2 2 0 0 0 1.7-3L14 9 M7 15h10",
  package: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z M12 22V12 M3.3 7 12 12l8.7-5 M7.5 4.27l9 5.15",
};

export function CardIcon({ name }: { name: string }) {
  return (
    <span className="pc-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {(ICONS[name] ?? "").split(" M").map((d, i) => <path key={i} d={i ? `M${d}` : d} />)}
      </svg>
    </span>
  );
}

function Card({ r }: { r: Item }) {
  return (
    <li className="pc rg-card">
      <div className="pc-box">
        <div className="pc-tray" aria-hidden="true" />
        <div className="pc-win">
          <div className="pc-bar"><span className="pc-url">{r.page}</span></div>
          <Image className="pc-media" src={r.poster} alt="" width={600} height={320} unoptimized />
        </div>
        <p className="pc-chip"><span className="pc-chip-dot" aria-hidden="true" />{r.chip}</p>
      </div>
      <div className="pc-text">
        <div className="pc-row">
          <h3 className="pc-t"><CardIcon name={r.icon} /><span>{r.t}</span><span className="sr">, {r.full} ({r.reg})</span></h3>
          <span className={`chip ${r.live ? "chip-live" : "chip-build"} pc-status`}>{r.live ? c.live : c.build}</span>
        </div>
        <p className="pc-d">{r.d}</p>
        {r.date ? <p className="pc-d pc-date">{r.date}</p> : null}
        <p className="pc-links">
          <a className="pc-read" href={r.href}>{r.read}</a>
          <a className="pc-src" href={r.src.u} target="_blank" rel="noopener noreferrer">{c.source}: {r.src.t}</a>
        </p>
      </div>
    </li>
  );
}

export function Rules() {
  return (
    <section className="band-dark sec rg" id="rules" aria-labelledby="rl-h">
      <div className="container rl-head">
        <h2 id="rl-h" className="t-display-lg">{c.title}</h2>
        <p className="t-body-lg rl-lead">{c.lead}</p>
      </div>
      <div className="container">
        <ul className="pc-grid" aria-label={c.label}>
          {c.items.map((r) => <Card key={r.id} r={r} />)}
        </ul>
        <p className="pc-note">{c.note}</p>
      </div>
    </section>
  );
}
