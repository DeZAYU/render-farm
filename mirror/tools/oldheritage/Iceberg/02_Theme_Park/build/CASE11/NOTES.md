# TP11 — Gas bottles on opening night (Tilburg kermis, 18 Jul 2014)

Code: `_engine/src/cases/TP11.tsx` · out: `build/CASE11/out/TP11.mp4` (+ `_phone`) · 89.6 s.

## Footage
- [TK] https://www.youtube.com/watch?v=bR-IWGdYTHk (Tom van der Meer repost, footage credited to Kermis FM per the description:
  keep "Beeld: Kermis FM" in the credits). 1080p, handheld, no source cuts, real crowd sound.
- [TW] https://www.youtube.com/watch?v=GlY5rcwk-9g (Wouter van der Put), 400x224 -> lanczos 1280x720; camera whips 39.9-44.7 avoided.
  Its cold-open raw is shown framed (brand Inset) because the source is 224 px tall.

## Edit
- Title -> cold-open raw (TW 0.3-11.3, "kom eruit") -> VO, raw B (TK 2.5-11, the stall burning under the dart banners) ->
  VO -> raw C (TK 33.6-44.1: the gas bottle goes up, the fireball and the crowd running) -> VO; the explosion returns as a
  0.5x replay (minterpolate blend, reframed) under the last line ("the gas bottle behind the counter").
- Music 1 at −15 dB, out under every raw.

## Devices
- FlameFreeze (`dev/TP11_FlameFreeze.tsx`): freeze of TK 1.5 s pulled into a white print; a white rule from the tent's roof line
  to the flame tip (≈490 px against the stall's own ≈350 px / ~3 m height, i.e. consistent with the witness's 4-5 m), red "4–5 M";
  then the camera slides to the balconies above and a white box draws round the flats ("There are flats above that square").
- Omroep Brabant's own report (ChipLift_N2P, ≤1 page per case): "Vooraf zijn de eettentjes niet gecontroleerd." and
  "Onderzocht wordt of de eigenaar nalatig is geweest." lit on the VO. Captured with `_tools/capture_page.py`
  (cookie banner declined), source: https://www.omroepbrabant.nl/nieuws/1876063/grote-brand-bij-eettent-op-tilburgse-kermis-door-ontplofte-gasflessen-geen-slachtoffers

## Notes
- A PDOK aerial of the Piusplein was fetched and NOT used: Omroep Brabant says Heuvelring, Kermis FM says Piusplein, and the stall's
  exact spot can't be placed, so a marked aerial would be a guess (and a "place named" shot). The flats are shown on the footage instead.
- No new video downloaded.

## Raw audio (guide 5b)
- Raw sound comes from `media/tw_clean.wav` (rawclean --force: TW has fair music under the shouting; whole clip cleaned to voices +
  impacts) and `media/tk_clean.wav` (rawclean: music found and removed in 23 of 60 s). The clips' own tracks are not used.
- Raws stay at the cut sheet's cue positions (cold open, after "flats above that square", after "turned around"); nothing to blur.
- TK is used as `graded/tk_mb.mp4` (3-frame tmix): the phone whips otherwise read as 100+ STUB "cuts" in cutcheck.

## 3 Nov 2026 audit
- Raws unchanged (3: cold open 11.0 s, B 8.5 s, C 10.5 s). ChipLift_N2P on the Omroep Brabant scan (71.06-78.28) replaced by a new
  device, **WordFlip** (`dev/TP11_WordFlip.tsx`): the report's two Dutch sentences set sharp (Elite) on a tilting white card over the
  dark blurred footage, English gloss under each; on the VO's words "niet gecontroleerd." flips to red NOT INSPECTED. and "nalatig"
  to NEGLIGENT; credit "Source: Omroep Brabant, July 2014". Registry line added. Inset used once (cold open). Render 89.7 s;
  cutcheck 1 flag: STUB 60.50 s = the phone's own whip inside raw C (source motion, raw unchanged), nothing else.
