// Family "censor" (FULL_PLAN "CENSORSHIP", owner rule, binding): pick by severity. All frames local; regions in final screen px.
// a) TrackedBlur / Mosaic: targeted, tracked, soft edge. b) CutAway: freeze -> defocus + darken + accent tint. c) CensorCard / PosterCard: the worst moments.
// QC: render a 4 fps contact sheet over EVERY censored window (node tools/render.mjs strip <id> <frames>) and check no injury is visible on any frame.
import type { VariantDef } from "../../core";
import { TrackedBlur } from "./TrackedBlur";
import { Mosaic } from "./Mosaic";
import { CutAway } from "./CutAway";
import { CensorCard } from "./CensorCard";
import { PosterCard } from "./PosterCard";

const C = "censor";
const track = [
  { f: 0, cx: 980, cy: 860, rx: 260, ry: 200 }, { f: 30, cx: 1060, cy: 840, rx: 270, ry: 210 }, { f: 60, cx: 1120, cy: 860, rx: 280, ry: 210 }, { f: 90, cx: 1150, cy: 880, rx: 280, ry: 200 },
];
export const variants: VariantDef[] = [
  {
    family: C, name: "TrackedBlur", component: TrackedBlur,
    defaultProps: { media: "demo/clip_crowd.mp4", regions: [{ keys: track }, { keys: [{ f: 0, cx: 380, cy: 560, rx: 150, ry: 170 }, { f: 90, cx: 430, cy: 560, rx: 150, ry: 170 }] }], blur: 34 },
    durationInFrames: 90, thumbFrame: 45, stripFrames: [0, 15, 30, 45, 60, 89],
    ref: "Dashcam Vol.1 censor blur: C19 burning rider @ 23:06 (grey feathered ellipse ~300x180), C12 impact @ 13:22 (orange blob), C17 face; wp3 sec_B EBlur aftermath",
    when: "Severity (a): faces of victims/injured, an injured person in a wide shot. Track every 3-10 f; regions cover the whole person with margin.",
    props: "media, startFrom, regions[{keys[{f,cx,cy,rx,ry}], from, to}], blur, tint (e.g. 'rgba(255,120,30,.28)' DD orange), feather",
    twist: "real defocused copy (render-stable), Catmull-Rom tracked, slight lift so it never reads as a smudge",
    axes: { geometry: "tracked soft ellipses", entry: "none (always on)", layout: "on the subject", accent: "neutral grey / optional orange" },
  },
  {
    family: C, name: "Mosaic", component: Mosaic,
    defaultProps: { media: "demo/clip_crowd.mp4", regions: [{ keys: track }], block: 48 },
    durationInFrames: 90, thumbFrame: 45, stripFrames: [0, 15, 30, 45, 60, 89],
    ref: "Abyssal pixel mosaic on victims @ 29:00-29:16, 59:00-59:28 (STUDY §7 / I9: 40-60 px blocks, up to 1/12 W on gore)",
    when: "Severity (a+): bodies, burns, blood in frame while the clip must keep playing. Block 48 for people, 120-160 on close-ups.",
    props: "media, startFrom, regions[...], block, feather, id (unique per mosaic on screen)",
    twist: "screen-locked block grid (no shimmer) with a feathered region edge",
    axes: { geometry: "tracked block mosaic", entry: "none", layout: "on the subject", accent: "hard blocks, soft edge" },
  },
  {
    family: C, name: "CutAway", component: CutAway,
    defaultProps: { media: "demo/clip_fire.mp4", freezeAt: 24, accent: "#B0141A", line: { text: "seconds later,", red: "everyone was running", at: 46 } },
    durationInFrames: 105, thumbFrame: 80, stripFrames: [20, 24, 27, 30, 36, 46, 56, 80],
    ref: "D1 E6 exact-frame freeze @ 2:18.6 + Farrell T5 L05 defocus/gain .45 background switch + D1 C12 tinted blob colour",
    when: "Severity (b): the instant someone is hurt; freeze on the last safe frame and let the VO carry the moment. Optional DD label.",
    props: "media, startFrom, freezeAt (last SAFE frame), accent, line {text, red, at}",
    axes: { geometry: "full-frame freeze plate", entry: "12 f defocus + darken + duotone tint", layout: "optional centred two-tone label", accent: "case accent duotone" },
  },
  {
    family: C, name: "CensorCard", component: CensorCard,
    defaultProps: { media: "demo/clip_fire.mp4", freezeAt: 20, white: "This part of the footage", red: "is too graphic to show", textAt: 30 },
    durationInFrames: 105, thumbFrame: 80, stripFrames: [18, 20, 24, 30, 36, 42, 50, 80],
    ref: "Abyssal censor card @ 13:53.7-14:04.5 + Dashcam Vol.3 E2 two-tone label @ 0:03.4 + D1 I3 blur-dip",
    when: "Severity (c): the worst moments (someone burning, a body). Replaces the picture for 2-4 s; narration continues.",
    props: "media, startFrom, freezeAt, white, red, textAt, cap",
    axes: { geometry: "centred two lines + red rule", entry: "plate blur-dip, words rise, red line defocus -> sharp", layout: "white over red, centred", accent: "red rule + red glow" },
  },
  {
    family: C, name: "PosterCard", component: PosterCard,
    defaultProps: { media: "demo/clip_fire.mp4", freezeAt: 20, note: "FOOTAGE REMOVED: TOO GRAPHIC", block: 80 },
    durationInFrames: 105, thumbFrame: 85, stripFrames: [18, 20, 21, 23, 30, 45, 60, 85],
    ref: "Abyssal posterised censor card @ 13:53.7-14:04.5 (colour-noise posterisation + small VCR line at y .88)",
    when: "Severity (c) for CCTV/found-footage cases where a raw, harsher card fits better than the clean DD card.",
    props: "media, startFrom, freezeAt, note, noteAt, block, id",
    axes: { geometry: "full-frame posterised mosaic", entry: "3 f noise burst, then typed note", layout: "single VCR line at 0.88 H", accent: "RGB fringe, colour noise" },
  },
];
