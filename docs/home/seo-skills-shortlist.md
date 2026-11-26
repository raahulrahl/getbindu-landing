# SEO Skills Shortlist for Next.js Marketing Site

Evaluated 23 Nov 2026 for technical SEO, Next.js metadata, structured data, indexability, and internal linking.

## Candidate Comparison

| Skill / Tool | Source & License | Last Update | Focus / Capabilities | Overlap with Installed | Scripts / Network |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`seo`** | `addyosmani/web-quality-skills` (MIT) | Nov 2026 | Technical SEO, JSON-LD (Org, App, FAQ), metadata, CWV rank signal | Sibling to installed `web-quality-audit` & `core-web-vitals` | Pure Markdown; no scripts, no network |
| **`squirrelscan`** | `squirrelscan/squirrelscan` (MIT) | 2026 | Automated 350+ rule crawler: sitemap, tags, canonicals, schema, `llms.txt` | Complements `best-practices` with local crawl validation | CLI binary/script; runs on localhost, no ext. net |
| **`claude-blog`** | `AgriciDaniel/claude-blog` (MIT) | 2026 | Blog SEO, internal link retention, E-E-A-T author schema, slug stability | Complements `blog-post`; specialized for `content/blog/` | Python script (`analyze_blog.py`); no ext. net |
| **`full-seo-sprint`**| `GetBindu/awesome-claude-code` (MIT) | 2026 | Broad marketing: keyword clustering, competitor gap, SERP analysis | Overlaps with `copywriting` and `strategic-narrative` | Prompts + external SERP APIs (needs network) |

## Recommended Set (Top 3)

1. **`addyosmani/web-quality-skills` (`skills/seo`)**: Native extension to installed web-quality suite; provides offline Next.js App Router metadata and JSON-LD schema patterns with zero dependencies.
2. **`squirrelscan` (`squirrelscan/skills`)**: Automated crawler verifying canonicals, internal linking between `/` and regulation routes, and structured data against the production server.
3. **`AgriciDaniel/claude-blog` (`blog-analyze`)**: Existing house standard ensuring blog URL stability, internal link reciprocity to `/`, and author E-E-A-T metadata remain intact.

*Note: Per CLAUDE.md, no skills installed and `robots.ts` / `noindex` remain unchanged.*
