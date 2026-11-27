import { ArrowUpRight } from "lucide-react";
import { blogRow as c, type BlogRowPost } from "../content";
import { NAV_BLOG } from "../links";
import { ScrollRowButtons, useScrollRow } from "./ScrollRow";

export function Blog({ posts }: { posts: BlogRowPost[] }) {
  const control = useScrollRow();

  return (
    <section className="band-dark sec bl" id="blog" aria-labelledby="bl-h">
      <div className="container bl-layout">
        <div className="bl-head">
          <h2 id="bl-h" className="t-display-lg">{c.title}</h2>
          <a className="bl-all" href={NAV_BLOG.u}>{c.all} <ArrowUpRight size={15} aria-hidden="true" /></a>
        </div>
        <div className="bl-list">
          <ScrollRowButtons control={control} previous={c.prev} next={c.next} />
          <ul ref={control.row} className="scroll-row bl-row" aria-label={c.label}>
            {posts.map((post) => (
              <li key={post.slug} className="bl-card">
                <a className="bl-link" href={`/blog/${post.slug}`}>
                  <h3>{post.title}</h3>
                  <span className="bl-meta">
                    <span>{post.category}</span>
                    <time dateTime={post.iso}>{post.date}</time>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
