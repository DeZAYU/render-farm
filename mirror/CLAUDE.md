# STYLE guide

Purpose: build the editing style guides (**Farrell**, **Nocturn**, **Abyssal**) and edit videos in those styles.

## MAIN KNOWLEDGE BASE (owner rule 2026-11-13; wins over this folder's docs)
- `C:\Users\ayush\Downloads\404_Rendrer_KNOWLEDGE\404 Rendrer` (= `K`) is the main knowledge base for making videos. It is not a style.
- Every video: first read `K/CLAUDE.md`, `K/OWNER_TASTE.md`, `K/CHANNEL_STYLE.md`, `K/TEMPLATE_UPGRADES.md`, `K/CLAUDE_HANDOVER/memory/MEMORY.md` (+ files it lists), `K/CLAUDE_HANDOVER/SESSION_LEARNINGS.md`. Make the video the way K says (Remotion `K/TemplateLibrary/`, its SFX, music, QA, pipelines). If K and this folder clash, K wins; ask only if unclear.
- K paths from the old PC (`D:\404 Rendrer`, `C:\Users\avent\...`) = K. Never read K recursively (3.4 GB); skip `.cache`, `node_modules`, `pages`, media.
- Reading and using K is allowed.

## Owner SOP (added 2026-11-14; newest owner rules; general, applies everywhere)
- The SOP applies to every video: every style (Farrell, Nocturn, Abyssal, combined) and the Old Heritage / Iceberg kit. Always load it with the chosen style.
- The chosen style's guide sets the look (palette, fonts, devices); it replaces SOP section 4 only. Every other SOP rule (briefing, licence, privacy, pacing, text, audio, feedback decoder, checklist) always applies.
- `docs/workflow/SOP.md`: briefing, licence/privacy rules, editing/audio rules, feedback decoder, send checklist. Read it before every video.
- SOP wins over K and this folder on look, rules and checks. K stays the source for tools and pipelines. The SOP bans the 404 Thread look (case cards, stamps, tape/VHS, red seams, caps cinematic lines).
- Clashes with older rules: `styleguide/_shared/GENERIC_RULES.md` section H.

## Master SOP v2.0 = general rules for EVERY style (owner rule 2026-11-14)
- All styles (Farrell, Nocturn, Abyssal, combined) are caught-on-camera styles. So `docs/workflow/CAUGHT_ON_CAMERA_MASTER_SOP.md` applies to every video in every style. Read it A–Z before every video, with `docs/workflow/SOP.md`.
- Order: master SOP v2.0 > `docs/workflow/SOP.md` > K > `GENERIC_RULES.md` > style rule book. Exception: the chosen style's guide sets the look (palette, fonts, devices, title, grade) = the master SOP's channel profile (§3, §8).
- Pipelines (K, OHF kit) give workflow and tools only, never looks (master SOP §2.4).
- **SOP §2.4 ban wins over the style look (owner 2026-11-14).** Farrell: no sentence-case Farrell type, tilted 3-D pages, tier cards, phone motif. Abyssal: no berg level graphic, typewriter level cards, cyan palette, ice-cyan glitch titles (iceberg format may stay). Replace them with new devices from the refs. Top rule in both rule books.
- Its paths are Mac paths (`~/Documents/ALL PIPELINES/…`). On this PC, resolve them once (K = 404 Rendrer above) and note them here.
- Brief with no channel named → ask one question: "Which channel is this for, and is it a new one?"

## Old Heritage / Iceberg kit (added 2026-11-14)
- `tools/oldheritage/` = the Old Heritage Files channel kit (own rules + own Remotion engine). Not a style. Read `tools/oldheritage/ANALYSIS.md` first, then its `CLAUDE.md`. Load only for Old Heritage / Iceberg videos.

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
- **Renders are split** (owner rule 2026-11-13): every task (renders and any script) split equally over up to 500 GitHub machines (DeZAYU Enterprise, PUBLIC repo `DeZAYU/render-farm`, account kumai007), laptop = backup only, joined locally. The repo auto-syncs this folder every 15 min (no keys, no media). See `tools/cloud-render/README.md`.
- **Stay inside this folder** (plus the main knowledge folder above). Do not read, learn from or search `../PROJECT` or anything else outside it until the owner says so in chat.
- **No Premiere Pro, no After Effects** here (denied in `.claude/settings.json`). Do not use Premiere-based skills.
- **Ref board: OFF** (owner, 2026-11-11). Do not run or edit it. If a task needs it, tell the owner and wait. Its notes: `CLAUDE.archive.md`.
- Never print keys (`tools/algrow-voice/.env`, env var `EPIDEMIC_SOUND_API_KEY`).
- Be concise. Mechanical work (rename, format, summarize, scrape) → Haiku sub-agent. Never suggest /compact as a cost saver.
