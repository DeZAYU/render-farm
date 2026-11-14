// Family "stat": numbers the viewer must keep. DD two-tone first (TwoTone, StatSwitch, RollUp); Farrell 7-seg for running clocks/counts;
// VV recession for the one big figure of a video. All frames local; the number lands +0.1..0.4 s after it is spoken (D3 E5).
import type { VariantDef } from "../../core";
import { TwoTone } from "./TwoTone";
import { StatSwitch } from "./StatSwitch";
import { SegCounter } from "./SegCounter";
import { RollUp } from "./RollUp";
import { RecedeNumber } from "./RecedeNumber";
import { CounterStack } from "./CounterStack";
import { ClockSweep } from "./ClockSweep";
import { BigNumber } from "./BigNumber";
import { CompareBars } from "./CompareBars";
import { PriceTag } from "./PriceTag";

const F = "stat";
export const variants: VariantDef[] = [
  {
    family: F, name: "TwoTone", component: TwoTone, durationInFrames: 75, thumbFrame: 40, stripFrames: [0, 2, 4, 6, 10, 16, 22, 40],
    defaultProps: { media: "demo/clip_crowd.mp4", num: "~500", word: "injured", at: 0 },
    ref: "Dashcam Vol.3 E5 '23 years' @1:47.87 (+ '20 minutes' @922.4, '1300HP' @1:42); wp3 sec_C Stat @ abs 5390 / 7180 (approved)",
    when: "A count or duration over the footage it belongs to ('~500 injured'). Dies on the hard cut, no exit.",
    props: "media, num, word, at, wordAt, cap, y", twist: "velocity smear on the red rise; +0.5 %/s drift on the pair",
    axes: { geometry: "centred inline pair", entry: "number pulse-pop + red 46 px rise", layout: "number then word", accent: "red word glow" },
  },
  {
    family: F, name: "StatSwitch", component: StatSwitch, durationInFrames: 90, thumbFrame: 50, stripFrames: [10, 12, 14, 18, 24, 30, 40, 50],
    defaultProps: { media: "demo/clip_fire.mp4", mediaStart: 40, at: 12, lines: [[{ text: "WELL", at: 13 }, { text: "UNDER", at: 19 }], [{ text: "A", at: 26 }, { text: "MINUTE", at: 30, red: true }]] },
    ref: "Farrell T5 / R11 stat sentence on the same clip (L05 @SL 15:10.50: blur 12, gain .45, desat on the same frame) + Dashcam Vol.3 E5 pop; wp3 sec_B StatMinute @ abs 4069",
    when: "A short fact sentence that must stop the eye while the clip keeps running ('well under a minute').",
    props: "media, at (switch frame), lines [[{text,at,red}]], cap, y, push", twist: "stacked two-line sentence; D3 pop curves per word",
    axes: { geometry: "centred two-line block", entry: "same-frame background switch + word pops", layout: "stacked sentence", accent: "blurred, dimmed, desaturated clip" },
  },
  {
    family: F, name: "SegCounter", component: SegCounter, durationInFrames: 90, thumbFrame: 50, stripFrames: [0, 2, 10, 20, 30, 40, 41, 50],
    defaultProps: { from: 0, to: 900, rollAt: 4, landAt: 40, format: "time", flipAt: 74, flipColour: "#05E40C" },
    ref: "Farrell T8 / R9 7-segment counters: G04 @GoFundMe 4:08.5 (linear roll, stops dead + bloom flash, 1 f colour flip), Y08 @YT 13:52.33 red '15:00'; wp3 refsys SevenSeg",
    when: "A clock or total that RUNS (minutes passing, money climbing). Colour flip on the narrative turn. Rare (Farrell signature).",
    props: "from, to, rollAt, landAt, format int|comma|time|money, decimals, colour, flipAt, flipColour, height, flicker, media (faint backdrop)",
    twist: "faint red scanline matrix; ghosted unlit segments; 0.7 px chromatic copy",
    axes: { geometry: "big centred LED digits", entry: "4 f in + linear roll, bloom landing", layout: "single counter", accent: "LED glow + segment ghosts" },
  },
  {
    family: F, name: "RollUp", component: RollUp, durationInFrames: 75, thumbFrame: 44, stripFrames: [0, 3, 6, 10, 16, 22, 30, 44],
    defaultProps: { media: "demo/clip_crowd.mp4", value: 1000, prefix: "~", word: "people", at: 0, wordAt: 14 },
    ref: "Dashcam Vol.3 E5 two-tone stat + Farrell R9 counter roll; wp3 sec_A Stat1000 '~1,000 people' @ abs 1896 (approved v4)",
    when: "A count over a busy scene (crowd, diagram, map) where the centre must stay clear: top band.",
    props: "media, value, prefix, word, at, wordAt, rollDur, cap, y, decimals", twist: "Helvetica-class numerals rolling ease-out (counts, not a static pop)",
    axes: { geometry: "top band", entry: "counter roll + red rise", layout: "inline, high", accent: "Inter 800 red word glow" },
  },
  {
    family: F, name: "RecedeNumber", component: RecedeNumber, durationInFrames: 90, thumbFrame: 70, stripFrames: [0, 5, 10, 14, 16, 18, 24, 70],
    defaultProps: { media: "demo/clip_fire.mp4", top: "MORE THAN", value: 15000, bottom: "PEOPLE IN THE PARK", fallAt: 15 },
    ref: "Visual Venture §2 slam card @17:30.63 (MOTION.md §2: x3.1 overflowing creep, recession tau .35 s + .9 s tail about the left-centre) + §15 rule 4",
    when: "The one headline figure of a video (scale of the event). Use once; hard cut out.",
    props: "media, top, value, prefix, suffix, bottom, fallAt (key word), decimals, x; cap (figure, 220), labelCap (bottom line, 86), subCap (top line, 62)", twist: "the figure counts up during the overflowing creep and lands on the key word; defocused case footage underneath",
    axes: { geometry: "left-aligned oversize block", entry: "overflow creep -> recession", layout: "light kicker / big red figure / white line", accent: "Bebas red figure, soft shadow" },
  },
  {
    family: F, name: "CounterStack", component: CounterStack, durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 6, 14, 30, 40, 56, 70, 100],
    defaultProps: { media: "demo/clip_park.mp4", rows: [{ value: 36, prefix: "$", word: "MILLION", at: 4 }, { value: 20000, suffix: " m²", word: "COVERED", at: 34 }, { value: 8000, word: "VISITORS / DAY", at: 64 }] },
    ref: "Farrell R9 counters (G04 @GoFundMe 4:08.5 linear roll, glow on landing) + Dashcam Vol.3 E5 '23 years' @1:47.87; maps c02 #3, c05 #20",
    when: "Two or three figures of one thing in one sentence (cost / size / capacity), or a running timer that stops SHORT of a mark ('almost 8 minutes').",
    props: "media (defocused plate), rows [{value, prefix, suffix, word, at, roll, decimals}] OR timer {from, to, mark, at, dur, label, labelAt} (seconds), x, cap; cap (figures, 96), labelCap (unit words, 54)",
    twist: "earlier rows step back (dim, lift) when the next lands; timer mode shows the never-reached mark as a hollow red outline",
    axes: { geometry: "left-aligned column", entry: "staggered rolls per row", layout: "figure + red unit per row", accent: "focus shift by dimming" },
  },
  {
    family: F, name: "ClockSweep", component: ClockSweep, durationInFrames: 110, thumbFrame: 96, stripFrames: [0, 6, 20, 40, 60, 74, 80, 96],
    defaultProps: { minutes: 60, sweepAt: 8, landAt: 74, figure: "~ 1", word: "HOUR", labelAt: 74 },
    ref: "Farrell clock glyph (FA evidence E1 line glyphs) + Visual Venture §7 neon object @0:32.3 / 10:43.0 (colour = meaning) + DD D3 E5 label; maps c02 #23, c04 #13",
    when: "A duration someone endured ('held her up for about an hour', 'trapped ten minutes'). The sweep runs under the sentence and lands on the duration word.",
    props: "minutes (swept), sweepAt, landAt, figure, word, labelAt, r, startMin; cap (label, 74)",
    twist: "linear sweep that only settles into the final word; the swept sector fills dark red; hour hand moves 1/12",
    axes: { geometry: "centred neon dial", entry: "steady minute-hand sweep", layout: "dial over a two-tone label", accent: "red swept sector" },
  },
  {
    family: F, name: "BigNumber", component: BigNumber, durationInFrames: 100, thumbFrame: 90, stripFrames: [0, 3, 6, 10, 16, 40, 50, 90],
    defaultProps: { num: "28", at: 2, second: { figure: "~ 200", word: "INJURED", at: 40 } },
    ref: "Visual Venture §7 tank 'hold -> burst' @10:43.0 (log bezier .326,0,.143,.807) + VV §15 rule 6 layer stagger + DD D3 E5 two-tone; maps c02 #36, c04 #23",
    when: "A death toll or headline count said on its own, followed by a smaller related figure ('28 ... close to 200 injured').",
    props: "num, at, second {figure, word, at}, size; cap (second figure, 210), labelCap (its word, 74)", twist: "the numeral bursts forward out of the dark (motion-blurred), then slides aside for the second figure",
    axes: { geometry: "centred giant numeral -> left/right pair", entry: "forward burst from depth", layout: "numeral + red figure with light word", accent: "dark-red stage glow" },
  },
  {
    family: F, name: "CompareBars", component: CompareBars, durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 8, 16, 30, 50, 68, 80, 100],
    defaultProps: { bars: [{ label: "SLOW STOP", seconds: 8, at: 6 }, { label: "EMERGENCY STOP", seconds: 2, at: 6, red: true }], timeScale: 0.25, grey: { index: 1, at: 76, tag: "LAST RESORT ONLY" } },
    ref: "Visual Venture §11 world-space infographic @3:28.0 + VV §15 rule 10 (mechanical meaning = constant rate) + DD two-tone; maps c03 #20, c06 #25",
    when: "Two durations whose difference IS the story (8 s vs 2 s; under a second vs the minute after).",
    props: "bars [{label, seconds, at, display, red}], timeScale (1 = real time), maxLen, grey {index, at, tag}, x0; cap (values, 44), labelCap (bar labels + tag, 32), subCap (ruler, 28)",
    twist: "bars grow at a constant rate from a shared start line with a seconds ruler; elapsed time counts at the tips; red grey-out tag",
    axes: { geometry: "horizontal bars from a start line", entry: "linear real-time race", layout: "labels above, values at tips", accent: "red bar + red tag stamp" },
  },
  {
    family: F, name: "PriceTag", component: PriceTag, durationInFrames: 140, thumbFrame: 120, stripFrames: [0, 10, 16, 30, 50, 62, 74, 120],
    defaultProps: { object: "sensor", tag1: { lines: [{ text: "SENSOR" }, { text: "< $3,000", red: true }], at: 12 }, tag2: { lines: [{ text: "THE OPERATOR" }, { text: "3 CHARGES" }, { text: "FINED $3.6 MILLION", red: true }], at: 60 }, pullAt: 46 },
    ref: "Visual Venture §7 neon object @0:32.3 / 10:43.0 + VV §11 camera bezier (0.31,0,0,0.957) + DD D3 E5 red figure; map c03 #28",
    when: "A cheap fix that was never made vs what it cost afterwards (fine, damages). The two tags side by side are the point.",
    props: "object ('sensor' or a GLYPHS name), tag1 {lines [{text, red}], at}, tag2 {lines, at}, pullAt; cap (tag text base, 34; big tag x1.4)",
    twist: "paper tags on strings with damped swings; the big tag drops in from above and out-sizes the small one",
    axes: { geometry: "object + two hanging tags", entry: "close hold -> pull-back + tag drop", layout: "small tag left, big tag right", accent: "neon line object, red price line" },
  },
];
// new set "dash1" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash1.md)
import { extra as extra_dash1 } from "./new_dash1";
variants.push(...extra_dash1);
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
