# Nocturn deconstruction brief (agents)

Goal: dissect one Nocturn reference video into purpose-labelled clips on the ref board `nocturn`,
the same way Farrell video 1 was done. Owner asked for it in chat (2026-11-11). No questions; finish.

Root: `C:\Users\ayush\Videos\CLAUDE\STYLE guide` (run all commands from here, Git Bash).

## Do
1. Read `.claude/skills/ref-deconstruct/SKILL.md` and follow it exactly (steps 2-6). Prep is already done.
   Board server is running on port 8766. Board name is in `deconstruct/config.json` (`nocturn`).
2. Voice example: read ~40 lines of `productions/farrell-01-internet-archive/01_reference/DECONSTRUCTION_claude.md`.
3. Read `units.txt` + `sheets/sNN.jpg` one at a time, write `spec_NN.py`, post after each spec
   (`python tools/deconstruct/post.py <prod> --end <frame>`), final post without `--end`.
4. `verify.py` must print OK. Then `mkdoc.py <prod> "<title>"`. Do NOT run `arrange.py` (the coordinator does it).
5. Also write `productions/<prod>/01_reference/deconstruct/PURPOSE_SUMMARY.md` (max 40 lines):
   - clip count per category, total motion-graphic clips, % of runtime that is raw-footage vs graphics
   - the intro (first 90 s) clip by clip: what + why
   - every distinct graphic device used (look, length, enter/exit, SFX if audible from context) and its purpose
   - how a case/section starts and ends (pattern), transitions between cases
   - 3-5 things a Farrell editor should copy

## Nocturn-specific categories
Use the skill's categories. Extras map: date card / time-jump title -> `T`; name tag, red arrow, label callout,
channel pop-up on footage -> keep the footage category, note the device; PiP / grid / numbered preview -> `L`;
VHS/glitch sting -> `G`; censor blur is a note, not a category.

## Rules
- Never write to source mp4s. Change the board only via post.py. Never edit `_boards/*.json`.
- Touch only your own production folder `productions/<prod>/01_reference/deconstruct/` (+ DECONSTRUCTION_claude.md).
- Other agents post to the same board at the same time. If post.py fails with a rev conflict/409, wait a few
  seconds and re-run the same post (it is safe to re-run).
- Stay inside Root. No ../PROJECT. Never print keys or .env.
- Report in under 15 lines: clips posted, frames covered, verify result, uncertain clips, top 3 style findings.
