# AM01 — Level 1 entry + The Vertical Accelerator Cord (Cobra Adventure Park, Panama City Beach, FL, Sat 17 Aug 2019)

Code: `_engine/src/cases/AM01.tsx` · level piece `_engine/src/dev/AM_LevelEntry.tsx` (+ `AM_levels.ts`) · devices `dev/AM01_*.tsx`.
Output: `out/AM01.mp4` (master, -16 LUFS) + `out/AM01_phone.mp4`. Length 113.4 s.

## Structure (timeline s)
- 0–8.0 LEVEL 1 entry (VO "Level one is the tip…nobody in them died." at 0.6). Reusable for L2–L5: `<LevelEntry n={k} name="…" at={{level, names, mark}} mark={i} />`
  (tested at L3 and L5). Level names: THE TIP / BELOW THE SURFACE / DARK WATERS / THE ABYSS / THE DEEPEST (script). Case names = script headings.
- 8.0–12.0 TitleCard "THE VERTICAL ACCELERATOR CORD" on her own frame (src 13.0).
- 12.0–55.9 VO A (take 6.17–50.07) · RAW 1 55.9–69.1 (13.2 s, src 47.5–60.7: the wait, "Cali husband!", attendant walks over, burst at src 53.4, cage jolts, strands hang)
  · VO B 69.1–78.5 over BurstReplay · RAW 2 78.5–85.8 (7.3 s, src 67.3–74.6: "We just dodged death", laughter) · VO C 85.8–112.5, hold + fade to 113.4.
- VO split only at the two raws, both at sentence ends ("…walks over to the launch controls." / "…no idea what had just happened."); 9.4 s of VO between them.

## Raw audio (title says LANGUAGE WARNING)
rawclean.py (music removed in 6 s: 18–20, 34–36) → Demucs two-stem split → voice stem muted over every swear found by transcribing the clean
track in 1.5 s windows (whisper-small): 36.0–37.6, 40.9–43.0, 45.8–47.1, 55.9–58.2 ("holy shit"), 62.9–66.4, 70.88–72.05 ("…you m-f"), 75.3–end.
Re-transcribed main_safe.wav over both raw windows: no swear left. File: `media/main_safe.wav` (the clip's own track is never used).
Woman's face at src 76.5–77.7 (outline skip) is outside every window.

## Footage / sources (all graded with grade_case.py --house; vlog + tony --nonorm)
- main: Krissy Hurst's phone clip, posted by Panama City News Herald — https://www.youtube.com/watch?v=_ilOizTWjlE (AMBER per outline). 640x360 → lanczos 1080p.
- tony: Tony "Big-Tony" Wilford, "Me on The Vertical Accelerator at The Cobra Adventure Park", 28 Jun 2010, 806 subs — https://www.youtube.com/watch?v=T8gSOc_zIas (same ride, daytime: cords, launch, flight).
- vlog: The Adventure Schmuck, Cobra Adventure Park travel vlog, 2 Oct 2023, ~4.8k subs — https://www.youtube.com/watch?v=AArPOgl7P5k (arcade, ticket window, towers, ride running in 2023). No burned-in text in used windows.
- onboard: Amber Nicole, "Cobra Slingshot after Navy Ball", 8 May 2016, 25 subs — https://www.youtube.com/watch?v=Ckgr7PNfox4 (the ride's own on-board camera video).
- Downloaded but unused (kept in footage/c01/more): 3ZJ9UVOyz7E (Matt Graham, 2014, vertical; a child rider). No other angle of the 2019 incident exists outside TV packages (WMBB, ABC, 6abc, Tampa Bay 28: not used).
- Document: WMBB News 13 "UPDATE: Riders of snapped PCB ride speak out", mypanhandle.com, 22 Aug 2019 — captured from the Wayback Machine copy https://web.archive.org/web/20190918053545/https://www.mypanhandle.com/news/update-riders-of-snapped-pcb-ride-speak-out/ (live page blocks bots; archive CSS missing, so shots/wmbb.png is its print view: real masthead image, headline, dateline and paragraphs, nothing re-worded). Owner 13 Nov: real source pages, one red mark only. Labels: AUGUST 17, 2019; COBRA ADVENTURE PARK; PANAMA CITY BEACH, FLORIDA; NICK AND VIC (first names they chose); 2023.
- NAIP aerial fetched (assets/naip_*.jpg) but not used: the park is shown by footage of its own arcade; an aerial added no information (owner: no pointless place shots).

## Devices (REGISTRY.md)
LevelEntry (level piece), DeadFeed, CordTrace, BurstReplay, NewsSheet. Brand: TitleCard, RedLabel. No Inset, no Blender, no HUD.

## Shot notes
Same camera runs are broken by reframes / blurDips (46.37, 69.10, 78.52, 85.82). The incident stretch (attendant line → raw 1 → replay → raw 2 → after)
is one camera by necessity (only one angle exists); varied by device and framing. Slow files are minterpolate (mci) copies of graded/main.mp4.
Red: only the RedLabels and one thin rule under "the allowable number of uses"; the level mark is white.
Music: Epidemic ambient Music 5, -13 dB, ducked under both raws. SFX: sub drop on LEVEL 1, whoosh on the push, glitch into the case, static on the dead feed, blur-dip into the WMBB story.
