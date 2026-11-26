import { useEffect, useRef, useState } from "react";
import { blogRow as c, type BlogRowPost } from "../content";
import { NAV_BLOG } from "../links";
import { reduceMotion } from "../lib/motion";

/* Round 65 (r65-7, Austin): "From the blog" (id `blog`), after pricing. A row of the r65 parallel-style cards (styles/r65.css): the warm-grey box with
   the post's own thumbnail in the white window, then the title (the card's one link, stretched over the card), the date and a "Read" cue. A native
   horizontal scroll-snap row, three cards in view on desktop and about one and a bit on phones; two small arrow buttons step one card and are
   disabled at the ends; swipe, trackpad and keyboard work as native scrolling does. No auto-play, no drift. The posts and their titles, dates and
   thumbnails come from each post's frontmatter (app/(en)/(home)/page.tsx), so nothing here is a hand copy. */

export function Blog({ posts }: { posts: BlogRowPost[] }) {
  const row = useRef<HTMLUListElement>(null);
  const [ends, setEnds] = useState({ start: true, end: false });
  useEffect(() => {
    const r = row.current;
    if (!r) return;
    const on = () => setEnds({ start: r.scrollLeft < 4, end: r.scrollLeft + r.clientWidth > r.scrollWidth - 4 });
    on();
    r.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { r.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const step = (dir: 1 | -1) => {
    const r = row.current;
    const card = r?.querySelector<HTMLElement>(".pc");
    if (!r || !card) return;
    r.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: reduceMotion() ? "auto" : "smooth" });
  };
  return (
    <section className="band-dark sec bl" id="blog" aria-labelledby="bl-h">
      <div className="container bl-head">
        <h2 id="bl-h" className="t-display-lg">{c.title}</h2>
        <div className="bl-ctl">
          <a className="bl-all" href={NAV_BLOG.u}>{c.all}</a>
          <button type="button" className="btn btn-icon bl-arrow" aria-label={c.prev} disabled={ends.start} onClick={() => step(-1)}>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3 5 8l5 5" /></svg>
          </button>
          <button type="button" className="btn btn-icon bl-arrow" aria-label={c.next} disabled={ends.end} onClick={() => step(1)}>
            <svg aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 3 5 5-5 5" /></svg>
          </button>
        </div>
      </div>
      <div className="container bl-wrap">
        <ul ref={row} className="bl-row" aria-label={c.label}>
          {posts.map((p) => (
            <li key={p.slug} className="pc bl-card">
              <div className="pc-box">
                <div className="pc-tray" aria-hidden="true" />
                <div className="pc-win">
                  <div className="pc-bar"><span className="pc-url">{p.category}</span></div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img className="pc-media bl-img" src={p.image} alt="" loading="lazy" decoding="async" />
                </div>
              </div>
              <div className="pc-text">
                <h3 className="pc-t bl-t"><a className="bl-link" href={`/blog/${p.slug}`}>{p.title}</a></h3>
                <p className="bl-meta"><time dateTime={p.iso}>{p.date}</time><span className="bl-read" aria-hidden="true">{c.read}</span></p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
