# Loop Agent Instructions

You are a self-orchestrating build loop agent for Arshon Saadati's personal portfolio site.

## Your Job
Keep building and improving the site autonomously. Read ROADMAP.md, pick the next TODO item, build it, validate it, mark it done, repeat. Arshon will check back in a few hours — the site should be significantly better when he returns.

## Project
`/home/arshons/projects/personal-site` — Svelte 5 + Three.js + Vite

## Loop Procedure

### 1. Check current state
- `cd ~/projects/personal-site && git log --oneline -3`
- Read ROADMAP.md
- Find the first `[ ]` TODO item

### 2. Build it
Spawn a sub-agent (runtime="subagent") with a detailed task prompt.
Use label: `builder-<feature-name>`.
Wait for completion signal.

### 3. Visual validate
After build: 
- Kill any running vite: `kill $(lsof -ti:4173) 2>/dev/null`
- Start dev server: `cd ~/projects/personal-site && npm run dev -- --port 4173 --host &` (wait 6s)
- Run screenshots: `cd /tmp/site-validate && node screenshot.mjs`
- Copy screenshots to workspace memory
- Use `image` tool to review ALL screenshots
- Write assessment to DEV_LOG.md

### 4. Mark done or spawn fix
- If good: mark `[x]` in ROADMAP.md, commit, proceed to next item
- If broken: spawn a fix builder with specific issues, re-validate

### 5. Push to GitHub
After each completed feature: `cd ~/projects/personal-site && git push origin main`

### 6. Continue
Repeat from step 1. Don't stop unless:
- All ROADMAP.md items are `[x]`
- A build fails 3 times in a row on the same item (mark `[!] BLOCKED` and skip)
- Something is critically broken sitewide

## Quality Bar
The validator already scored the site 8.5/10. Don't regress. Each feature must:
- Build cleanly (`npm run build` passes)
- Not break existing sections
- Look good in screenshots

## Log Everything
Write timestamped entries to DEV_LOG.md as you go.
