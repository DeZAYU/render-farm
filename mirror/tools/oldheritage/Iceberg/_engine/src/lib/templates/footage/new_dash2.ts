// set dash2 (Dashcam "INSTRUMENT", 2026-10-18): new footage variants. Merged into ./index.ts by the lead.
import type { VariantDef } from "../../core";
import { AngleSync } from "./AngleSync";
import { RadioWave, demoPeaks } from "./RadioWave";
import { FloatingClipCard } from "./FloatingClipCard";

const F = "footage";
export const extra: VariantDef[] = [
  {
    family: F, name: "AngleSync", component: AngleSync, durationInFrames: 150, thumbFrame: 40, stripFrames: [0, 4, 8, 40, 64, 76, 100, 140],
    defaultProps: { a: { media: "demo/clip_party.mp4", mediaStart: 40 }, b: { media: "demo/clip_crowd.mp4", mediaStart: 0 }, layout: "side", tcStart: 52327, tcFormat: "clock", winner: "a", growAt: 60 },
    ref: "Dashcam Vol.2 C12 split @11:21-13:12 (full-frame switches @11:55-11:58, 12:31-12:33) + D2 C19 stacked (seam y ~503) + Nocturn NB8 LOST @3:12.5 (hard 2-up, 4 s) + D2 E6 PiP grow bezier(0.40,0.22,0,0.92) 2.57 s",
    when: "Two cameras caught the same crash (two dashcams, dashcam + CCTV): both play on the same instant, then the angle that shows the impact takes the frame.",
    props: "a/b {media, mediaStart (same instant), pos, label?}, layout side|stacked, gap, push, tcStart (s), tcFormat clock|tc, tcCap, winner a|b, growAt, growDur (77), theme",
    twist: "a shared source-timecode chip (D-DIN Exp) at the seam proves the sync; the switch is the D2 PiP grow curve instead of a hard cut",
    sfx: [],
    axes: { geometry: "2-up split (side or stacked)", entry: "hard cut, then bezier grow to full frame", layout: "two equal panels + seam chip", accent: "timecode chip in the numeral face" },
  },
  {
    family: F, name: "RadioWave", component: RadioWave, durationInFrames: 150, thumbFrame: 60, stripFrames: [0, 4, 8, 24, 44, 60, 102, 140],
    defaultProps: {
      media: "demo/clip_fire.mp4", mediaStart: 0, peaks: demoPeaks(400), in: 0, outAt: 140,
      chunks: [
        { text: "911,", at: 6, who: "dispatcher" }, { text: "what's your", at: 14, who: "dispatcher" }, { text: "emergency?", at: 24, who: "dispatcher" },
        { text: "there's a", at: 44, who: "caller" }, { text: "car on fire", at: 54, who: "caller" }, { text: "on the bridge", at: 68, who: "caller" },
        { text: "is anyone", at: 92, who: "dispatcher" }, { text: "inside?", at: 102, who: "dispatcher", out: 130 },
      ],
    },
    ref: "Nocturn NA B1/WV1 DOOR @2:04.5-2:08 (waveform band y 0.25-0.35 H over the footage + per-speaker captions) + Dashcam Vol.1 kinetic 911 captions @18:28.8-18:38.8 (1-2 words, role in colour) + D1 speaker boxes 168-181 s",
    when: "A 911 call or police-radio excerpt (2-8 s raw) over the scene it describes. Never on black.",
    props: "media, mediaStart, push, dim (0.5), peaks number[] (0..1 @30/s from _shared_tools/peaks.py), peaksStart, bandY/bandH, windowSec, in, outAt, chunks [{text,at,who,out?}], capCap, captionY, theme",
    twist: "past half of the band lit in the accent, future half dim, playhead at the centre; dispatcher = accent, caller = white; over dimmed scene footage (owner rule: never on black)",
    sfx: [],
    axes: { geometry: "full-width waveform band upper third", entry: "band grows 8 f, words ghost in 4 f", layout: "band y 0.30, captions y 0.74", accent: "speaker-coded captions (accent / white)" },
  },
  {
    family: F, name: "FloatingClipCard", component: FloatingClipCard, durationInFrames: 140, thumbFrame: 50, stripFrames: [0, 5, 10, 15, 30, 45, 99, 100],
    defaultProps: { media: "demo/clip_park.mp4", mediaStart: 0, cutAt: 100 },
    ref: "Nocturn NA nA6 FINAL @0:02-0:06 and @1:09.25 (card 60 % x 60 %, 2 px light edge, shadow, over the clip blurred sigma 30; 0.5 s dissolve; 0.6 -> 0.78 in 1.5 s ease-out; hard cut to full frame)",
    when: "'A man who posts as ... uploaded this', news clips, uploader clips: the clip as an object before it plays full frame. Replaces the banned CRT.",
    props: "media, mediaStart, s0 (0.6), s1 (0.78), settle (45), creep, dissolve (15), blur (30), zoom + pos (crop logos), cutAt, push, theme",
    twist: "slow linear creep after the settle (never dead-still); zoom/pos crop for burned-in logos; the full-frame part gets the DD linear push",
    sfx: [],
    axes: { geometry: "centred floating card over its own sigma-30 blur", entry: "0.5 s dissolve + 1.5 s ease-out scale", layout: "card 0.6 -> 0.78, then full frame", accent: "2 px light edge + deep shadow" },
  },
];
