# AM05 — The Ultimate and the Deer (Lightwater Valley, North Yorkshire, Sat 27 Sep 2014)

Code: `_engine/src/cases/AM05.tsx` · devices `dev/AM05_DeerStill.tsx`, `dev/AM05_ReadLine.tsx` · out `out/AM05.mp4` (+ `_phone`). 76.2 s. Cutcheck: 0 flags.

## Structure
TitleCard (style A) 0–4 → VO take CASE05 continuous from 4.0 (never split; no raw) → fade on the hold after "gone".
Not the first case of level 1, so no LevelEntry.

## Decisions (owner asleep)
- **No raw.** No footage of the strike exists (outline: narrated case). A ride clip's own sound would be a raw outside the incident
  (owner rule 3 Nov), so the VO runs straight through. Length 1:16 — under the 1:45 guide, but the VO is 71 s and nothing is padded.
- **YouTube bot check all night**: every personal ride clip I queued failed (no cookies, no bypass). Candidates if the owner wants
  real ride footage later (small/personal channels, not checked for subs because metadata was blocked too):
  QRvFuaMp7l4 (psyclonesteve, "The Ultimate, Lightwater Valley 2014."), e9oaFLZXOs4 (Achtbaanfanclub off-ride 2018),
  j4tewjL20NY (ATJakee off-ride), ulKk-818IpA (pampie111 2011 onride), aYxLAtoFSzY / DPjupvHMx7Q (demolition 2023).
  Retry script: C:/Users/ayush/Videos/CLAUDE/STYLE guide/tools/oldheritage/scratch/am567/fetch.sh (downloads into footage/c05/more/).
- Wikimedia API was rate-limited; files were fetched from upload.wikimedia.org thumbnails/transcodes (≤2560 px / 1080p).
- Same photo used twice with different framing (thin Commons coverage): lifts.jpg (tight pan up the lift hill / wide last shot),
  trees.jpg (wide field shot / tight on the structure).
- The deer clips are real roe deer, not the 2014 animal (the outline asks for deer stock; nothing graphic shown). Strike = hard
  cut to black on "hit", held through "killed instantly".
- Red: RedLabels + one red rule under "during the night" in the IBTimes quote.

## Sources
- Photos (Commons): UltimateTrain.jpg, UltimateLifthills.jpg, UltimateStation.jpg — Stefan Scheer, CC BY-SA; Lightwater_Valley_Ultimate.jpg — S J Simms, CC BY-SA 3.0;
  Rollercoaster in the Trees — Chris Heaton / geograph 186002, CC BY-SA 2.0.
- Video (Commons): Roe deer in England.webm — Peter Trimming, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Roe_deer_in_England.webm);
  Roe deer in Birmenstorf.webm — Scarabinol, CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Roe_deer_in_Birmenstorf.webm).
- Page: IBTimes UK, "Second Deer Struck by The Ultimate Rollercoaster…", Maria Khan, 1 Oct 2014 —
  https://www.ibtimes.co.uk/second-deer-struck-by-ultimate-rollercoaster-leaving-passengers-covered-blood-1468135 (captured live:
  shots/ibt.png; shots/ibt_clean.png = same page with ads/sidebar cut, nothing re-typed). Halifax Courier copy hit a bot check: not used.
- Labels: LIGHTWATER VALLEY · NORTH YORKSHIRE, THE ULTIMATE, SEPTEMBER 27, 2014, JUNE 1994, APRIL 2023.
- Music: Epidemic Music 3 at -20 dB (dips under the black after "hit"). SFX: glitch in, one impact on the cut, page turn.

## Footage that arrived late (22:33, after the render)
The bot check lifted at 22:33 and these downloaded into footage/c05/more/: e9oaFLZXOs4 (Achtbaanfanclub, 2k subs, 1080p off-ride 2018),
aYxLAtoFSzY (Sneaky Coasters, 243 subs, 1080p demolition 2023), ulKk-818IpA (pampie111, 480p onride 2011), j4tewjL20NY (240p), and two from
bigger channels (QRvFuaMp7l4 psyclonesteve 59k, DPjupvHMx7Q AdventureMe 69k). My image viewer stopped working at the same time, so I could
not frame-check them and did not cut them in blind. A footage pass (off-ride trains through the woods for 12–25 s and the 2023 demolition
for the last 15 s) would lift this case.

Note: OH_CASE_BRIEF.md was edited during the night to allow `--cookies-from-browser chrome`; not used (all downloads here went through without cookies).
