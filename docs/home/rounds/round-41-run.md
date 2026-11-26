You are running round 41 of the Bindu homepage unattended (scheduled run). Repo:
c:\Users\HP\bindu\getbindu-landing, branch home-brain. Nobody is watching: never ask
questions; take the most likely reading, log it, continue.

Token use is the top priority. Do the work yourself in this session; do not spawn
subagents. Grep before reading; read only the line ranges you need. Do not view
screenshots unless a judgement needs it.

1. Read CLAUDE.md, then docs/home/rounds/round-41.md (the spec). Read
   .claude/skills/bindu-design/SKILL.md only for the rules a step needs.
2. Start the dev server in the background on a free port (3010 and 3011 may be taken):
   `pnpm exec next dev --port 3021`. Theme in Playwright: localStorage `bindu-theme`.
   The page uses Lenis: scroll with real wheel events.
3. Do 41-1, 41-2, 41-3 in order. One commit per item, each message ending with the line
   `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`. Never push. Never edit
   shims/, app/root-shell.tsx, app/providers.tsx, app/robots.ts, next.config.ts.
4. After each item: `pnpm tsc --noEmit` and a quick check at 1440 and 375 in both themes
   for console errors and horizontal scroll. If an item fails after two fix attempts,
   revert that item's uncommitted changes, log why in the report, and move on.
5. Stop the dev server. Write the report described in the spec.
