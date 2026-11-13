# STYLE guide

Purpose: build the editing style guides (**Farrell**, **Nocturn**, **Abyssal**) and edit videos in those styles.

## MAIN KNOWLEDGE BASE (owner rule 2026-11-13; wins over this folder's docs)
- `C:\Users\ayush\Downloads\404_Rendrer_KNOWLEDGE\404 Rendrer` (= `K`) is the main knowledge base for making videos. It is not a style.
- Every video: first read `K/CLAUDE.md`, `K/OWNER_TASTE.md`, `K/CHANNEL_STYLE.md`, `K/TEMPLATE_UPGRADES.md`, `K/CLAUDE_HANDOVER/memory/MEMORY.md` (+ files it lists), `K/CLAUDE_HANDOVER/SESSION_LEARNINGS.md`. Make the video the way K says (Remotion `K/TemplateLibrary/`, its SFX, music, QA, pipelines). If K and this folder clash, K wins; ask only if unclear.
- K paths from the old PC (`D:\404 Rendrer`, `C:\Users\avent\...`) = K. Never read K recursively (3.4 GB); skip `.cache`, `node_modules`, `pages`, media.
- Reading and using K is allowed.

## Pick the style first (owner rule 2026-11-12)
- Each style lives in its own folder: `styleguide/<style>/` (`farrell`, `nocturn`, `abyssal`). Source: `<style>.json`; readable copy: `<STYLE>_STYLE_GUIDE.md`.
- "Video in <style>" → load only `styleguide/<style>/`. Never read the other style's folder or files. Never read the whole repo.
- "Combine <A> and <B>" → load both style folders, nothing else. Use A's rule book as the base; take B's rules where they make the video better. If two rules clash, ask the owner which wins.
- No style named → ask which style before reading any guide.
- **Generic rules (owner rule 2026-11-12):** every style also follows `styleguide/_shared/GENERIC_RULES.md` (audio cuts, clips ≥3 s, SFX/music levels, smooth flow; taken from Farrell). Always load it with the chosen style. The style's own rule book wins only where it says so.
- Every style guide keeps a feedback loop: owner notes → that style's json (rule book + Learnings) the same day; the next build reads them first.

## Load nothing at chat start (owner rule 2026-11-11)
- At the start of a chat, read no files from this folder. Answer from the chat alone.
- Read folder files only when the task is video editing, or making or updating the style guide.
- For that work, read `docs/workflow/WORKFLOW.md` first (steps, case threads, editing rules). Then only the files the step needs.

## Always
- **Renders are split** (owner rule 2026-11-13): all segments on max 18 GitHub machines (private repo only), laptop = backup only, joined locally. See `tools/cloud-render/README.md`.
- **Stay inside this folder** (plus the main knowledge folder above). Do not read, learn from or search `../PROJECT` or anything else outside it until the owner says so in chat.
- **No Premiere Pro, no After Effects** here (denied in `.claude/settings.json`). Do not use Premiere-based skills.
- **Ref board: OFF** (owner, 2026-11-11). Do not run or edit it. If a task needs it, tell the owner and wait. Its notes: `CLAUDE.archive.md`.
- Never print keys (`tools/algrow-voice/.env`, env var `EPIDEMIC_SOUND_API_KEY`).
- Be concise. Mechanical work (rename, format, summarize, scrape) → Haiku sub-agent. Never suggest /compact as a cost saver.
