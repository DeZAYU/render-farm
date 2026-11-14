// set "midway" (Amusement Park "MIDWAY AFTER DARK", 2026-10-18). Merged into index.ts by the lead.
import type { VariantDef } from "../../core";
import { ExplodedPart } from "./ExplodedPart";
import { MeasureOnPhoto } from "./MeasureOnPhoto";

export const extra: VariantDef[] = [
  {
    family: "diagram", name: "ExplodedPart", component: ExplodedPart, durationInFrames: 200, thumbFrame: 160, stripFrames: [0, 40, 60, 96, 110, 126, 140, 160],
    defaultProps: {
      photo: "demo/ph_rocaf.jpg", part: { x: 968, y: 515 }, zoom: 3, burstAt: 39, explodeAt: 110, axis: { x: 0.12, y: -1 }, spread: 22,
      pieces: [
        { poly: [[967, 497], [990, 494], [1000, 497], [1015, 505], [1016, 514], [1005, 519], [976, 520], [967, 509]], shift: 2.3 },
        { poly: [[874, 551], [900, 534], [964, 515], [996, 521], [996, 538], [930, 543], [890, 551]], shift: 1 },
        { poly: [[998, 526], [1040, 520], [1060, 526], [1058, 536], [998, 540]], shift: 0.6 },
      ],
      crack: { pts: [[985, 496], [980, 503], [987, 509], [981, 514], [985, 520]], at: 128, piece: 0 },
      labels: [
        { text: "Bolt", value: "M20", at: 120, valueAt: 132, x: 1015, y: 508, dx: 150, dy: -80, piece: 0 },
        { text: "Fatigue crack", at: 136, x: 983, y: 517, dx: -230, dy: -60, piece: 0 },
      ],
    },
    ref: "Farrell FA story explainer (#3/#15/#33 returns) + Visual Venture §11 camera phases @3:28.0 + VV §7 tank burst @10:43.0 (hold 1.3 s, x2.98 in 57 f, log bez(0.326,0,0.143,0.807)) + VV §7 colour = meaning; REFERENCE_SYNTHESIS §I3 AP-1 / §I4 #2",
    when: "MIDWAY ride-mechanics beat on ONE component (braking-plate bolt, carousel column, cord anchor): burst into the real photo, the part separates, the crack draws on 'fatigue', values on their words.",
    props: "photo, part {x,y}, zoom, burstAt, burstDur, pieces [{poly px, shift}], axis, spread, outlineAt, explodeAt, crack {pts, at, piece}, labels [{text, value, at, valueAt, x, y, dx, dy, piece}], stroke, theme, fire",
    twist: "the pieces are cut out of the real photo itself (clip-path) and separate along the axis while the gaps darken; accent 5 px outlines, white-hot crack; nothing on a dark plate",
    sfx: [{ event: "zoom_boom", at: 39, note: "tank-burst start" }],
    axes: { geometry: "exploded cut-outs of a real photo", entry: "hold -> log tank burst -> quick-start separation", layout: "part centred, labels on leaders", accent: "magenta cut outlines + white-hot crack" },
  },
  {
    family: "diagram", name: "MeasureOnPhoto", component: MeasureOnPhoto, durationInFrames: 150, thumbFrame: 100, stripFrames: [0, 10, 14, 20, 40, 46, 52, 100],
    defaultProps: {
      media: "demo/clip_park.mp4", a: { x: 1300, y: 900 }, b: { x: 1300, y: 170 }, at: 10, value: "165", unit: "M", valueAt: 40, side: 1,
      note: [{ text: "above", at: 62 }, { text: "the", at: 66 }, { text: "ground", at: 70 }],
    },
    ref: "Visual Venture §11 dashed bracket 'X2' @3:28.0 (slides out 0.5 s on its word, phase-C camera) + Dashcam Vol.3 E5 two-tone stat @1:47.87 + Dashcam Vol.1 typed '40 minutes' @0:15.6 (2 f/char); REFERENCE_SYNTHESIS §I3 AP-1 / §I4 #3",
    when: "DROPPED 2026-10-19 (merged into map/MeasureOnSat; TEMPLATE_UPGRADES verdict). Do NOT use. Was: Heights, drops and depths ON the real ride photo (165 m wheel, pool depth, drop height). Value on its word.",
    props: "media, mediaStart, push, a/b {x,y} (source px), at, value, unit, valueAt, note [{text,at,hot}], side, cap, pushTo, theme, fire",
    twist: "the bracket lives on the real ride photo (not a diagram plate); number neutral + unit accent typed 2 f/char; VV phase-C push about the bracket",
    sfx: [{ event: "typing_key", at: 40, note: "one key per 2 f character step" }],
    axes: { geometry: "dashed dimension bracket on a photo", entry: "15 f quick slide-out + typed value", layout: "value beside the bracket midpoint", accent: "magenta dashes, two-tone value" },
  },
];
