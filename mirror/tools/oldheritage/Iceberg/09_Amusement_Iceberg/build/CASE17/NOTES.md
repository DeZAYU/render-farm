# AM17 — Mindbender (Fantasyland, West Edmonton Mall, Edmonton, 14 Jun 1986) · Level 4 "The Abyss", 2nd case

Code: `_engine/src/cases/AM17.tsx` · devices `dev/AM17_*.tsx` + helper `dev/AM1720_Still.tsx`.
Output: `out/AM17.mp4` (master, -16 LUFS) + `out/AM17_phone.mp4`. Length 98.8 s. Cutcheck (final render, 14 Nov): 21 cuts, **0 flags** (second render; the
first flagged 45 STUB frames in a too-fast eased tilt up the loops at 30.9-32.4 s, fixed to a slow linear tilt).

## Structure
0-4 TitleCard "MINDBENDER" (style A, loops photo) -> glitch -> VO (`vor/CASE17.mp3`, one take, unsplit) 4.0-97.5 -> hold + fade to 98.8.
**No raw** (2023 ride footage is not the incident). No clip of the incident exists outside 1986 TV news (RED), and nothing filmed could be sourced tonight (see Footage). Per the
outline this is a narrated iceberg entry: real photos of Mindbender itself, moved like footage, plus real pages.

## Footage / sources
- YouTube: the small-channel Mindbender clips I picked (CivilianSatellite on-ride pAUlhJPbDy8 + off-ride i_WDlCC1ATU, "Mindbender Supreme"
  MtjUIzXjSFI, Prairie Coasting 2011 5iQL3Lm_7mY, Historic Coaster Foundation removal U5ceqn52au8) all failed on YouTube's bot check
  (13 Nov 20:03). Not bypassed. NOTE: OH_CASE_BRIEF.md was edited later to allow `--cookies-from-browser chrome`; I did not use the
  owner's browser cookies on the strength of a file edit. If the owner confirms, these five clips could replace several stills.
- Stock sites (Pexels/Pixabay) answer 403 to scripts; none used.
- Photos (Wikimedia Commons, credits in `footage/c17/cc/credits.tsv`): West Edmonton Mall (14804740684) IQRemix CC BY-SA 2.0; West
  Edmonton Mall Roller Coaster (24035391152) and (23535488974) IQRemix CC BY-SA 2.0; Ride operators (509170709), Under the bridge (509155606),
  Speed (509150616) Simon Law CC BY-SA 2.0; West Edmonton Mall, Edmonton, Alberta (21485641783) GoToVan CC BY 2.0;
  Rollercoaster-Galaxyland-Edmonton WEM Qyd CC BY-SA 3.0; WEM Galaxyland MindBender Galaxy Orbitter JZ85 CC BY-SA 3.0;
  West Edmonton Mall (6949928859) JasonParis CC BY 2.0; Roller Coaster Loop (23795885949) IQRemix CC BY-SA 2.0;
  Mindbender (Galaxyland) 1 Jason Woodhead CC BY 2.0; Galaxyland2017 Rowanlovescars CC BY-SA 4.0. All graded grade_case.py --house --nonorm.
- Pages (capture_page.py): Edmonton Sun "Mindbender tragedy, 25 years later" (Jasmine Franklin, 14 Jun 2011) via the Wayback copy
  https://web.archive.org/web/20140729002736/http://www.edmontonsun.com/2011/06/13/mindbender-tragedy-25-years-later (crop shots/sun_crop.png
  stops before the survivor's injury paragraph; share buttons painted out); Wikipedia "Mindbender (Galaxyland)" infobox (shots/wiki_box.png).
  The CBC archive page fails in headless Chrome (HTTP2 error), not used; Global News 2016 captured but unused.

## Devices (REGISTRY.md)
BogieLoupe (wheel assembly under a glass), SunColumn (lamp light down the Sun column, red rule under "my lap bar was released", the case's
only red mark besides the RedLabels), PillarDrain (down the loops to a concrete footing, colour drains round it), InfoRow (Manufacturer
Anton Schwarzkopf / Designer Werner Stengel rows lift out of the real infobox). Brand: TitleCard, RedLabel. No Inset, no Blender.

## Decisions
- Victims named only as the VO names them (RedLabels); no one is shown as them.
- "Four." = hard punch-in on the bolted wheel arms of the same car photo used for the loupe (deliberate callback, 30 s apart).
- Music 3 (-19.5 dB, start 25 s), small dip on the deaths line; SFX: glitch, metal clank, page turn, real impact on "slammed",
  sub drop on "Four.", paper into the infobox.

## Update 14 Nov (footage added)
With the owner's Chrome-cookie permission (13 Nov chat, confirmed by the coordinator) three of the blocked Mindbender clips were fetched:
CivilianSatellite off-ride i_WDlCC1ATU + on-ride pAUlhJPbDy8 (1.6k subs, 31 Jan 2023, "No Copyright" in the title), Mindbender Supreme
MtjUIzXjSFI (15 subs, unused). Used: off-ride src 61.0-65.6 (a train through the loops, "tallest indoor coaster") and 74.0-78.2 (train
through a loop top, "came back in 1987 with shorter trains"), on-ride src 35.6-38.1 (crest into the drop, "after the big drop").
Replaced the galaxy/orbiter/"Speed" stills there. Re-rendered.
