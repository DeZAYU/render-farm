# AM18 — Black Sunday (Kings Island, Mason, Ohio, Sun 9 Jun 1991) · opens Level 5 "The Deepest"

Code: `_engine/src/cases/AM18.tsx` · devices `dev/AM18_PondShimmer.tsx`, `dev/AM18_StripStack.tsx`, level piece `dev/AM_LevelEntry.tsx`
(n=5 "THE DEEPEST", at level 24 / names 66 / mark 206) · helper `dev/AM1720_Still.tsx`.
Output: `out/AM18.mp4` + `out/AM18_phone.mp4`. Length 110.9 s. Cutcheck: 22 cuts, 0 flags with the level-entry -> title window 8.1-8.7
added (same designed dip-to-black join as AM01; the render-time check had flagged it as JUMP before the window was added).

## Structure
0-8.4 LevelEntry (VO level line 0-6.87 at 0.6) -> 8.4-12.4 TitleCard "BLACK SUNDAY" (carousel at night) -> glitch -> VO from 6.87 to the end
(109.5) -> hold + fade. VO split only between the level line and the case (sentence end). **No raw**: no clip of either accident exists
outside 1991 TV (RED).

## Footage / sources
- Commons photos (credits `footage/c18/cc/credits.tsv`): Paramount's Kings Island 1996 and Viking Fury and fountain (Kings Island) (Jeremy
  Thompson, CC BY 2.0; the fountain lake is the Oktoberfest area, not the exact walkway), Kings Island Grand Carousel at night 2023 (Jeremy
  Thompson, CC BY 2.0), Kings Island Eiffel Tower and Carousel (2019) (Fritzmann2002, CC BY-SA 4.0), Kings Island Eiffel Tower at night
  (Eli Duke, CC BY-SA 2.0), Floral clock (Kings Island) (Jeremy Thompson, CC BY 2.0), Kings Island 1972 (Alan Light, CC BY 2.0).
- Video: "Racer Kings Island Racing Roller Coaster POV.webm" (The Coaster Scoop, CC BY 3.0, Wikimedia Commons), windows src 8.5-12.6 (lift
  hill) and 44-51.5 (ride), 4K60 -> 1080p30, graded. No logo found.
- Page: Deseret News "3 are killed in accidents at Ohio amusement park" (AP, 10 Jun 1991)
  https://www.deseret.com/1991/6/10/18924967/3-are-killed-in-accidents-at-ohio-amusement-park/ — article strips only (ads, share buttons out).
  FOX19 2023 page captured (shots/fox19.png) but not used (its lead image is an Enquirer news photo).
- Dropped: archive.org "Kings Island 1992" turned out to be a sponsored TV special (Chevrolet / WCET) = TV, deleted. No Commons photo of
  Flight Commander exists; a Blender model of the pod ride was scripted (`assets/pods.py`) but the machine-wide Blender lock was held by
  another builder's stalled job for 1 h+, so it was dropped. Flight Commander beats run on the Deseret strip + night park photos.

## Devices
PondShimmer, StripStack (two parts of one table: names paragraph; then the Flight Commander strip lands). Brand: TitleCard, RedLabel
(date, place, OKTOBERFEST LAKE 8:30 PM, the two rescuers' names, 9:45 PM, FLIGHT COMMANDER, OSHA FINE $23,500, 1992). No red marks.
Taylor's drinking stated once as the VO does; design flaw kept as the officials' finding. Robertson framed as a rescuer (label).

## Mix
Music 1 at -15 dB from the title, dips on both deaths; underwater bed under the level entry; SFX sub drop, glitch, impact on the jolt, paper on the strips.
NOTE for the owner: Kings Island is flagged "milked" in the exclusion register (outline says tell Ekam).
