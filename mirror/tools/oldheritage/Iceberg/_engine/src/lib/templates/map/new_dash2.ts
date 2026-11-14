// set dash2 (Dashcam "INSTRUMENT", 2026-10-18): new map variants. Merged into ./index.ts by the lead.
import type { VariantDef } from "../../core";
import { PlanReplay } from "./PlanReplay";
import { MeasureOnSat } from "./MeasureOnSat";

const F = "map";
export const extra: VariantDef[] = [
  {
    family: F, name: "PlanReplay", component: PlanReplay, durationInFrames: 150, thumbFrame: 96, stripFrames: [0, 20, 40, 60, 80, 90, 96, 130],
    defaultProps: {
      src: "demo/mapstill.png", media: "demo/clip_park.mp4", mediaStart: 0, clipAt: 0,
      vehicles: [
        { kind: "car", role: "accent", keys: [{ f: 0, x: 180, y: 820 }, { f: 30, x: 520, y: 790 }, { f: 60, x: 800, y: 725 }, { f: 90, x: 925, y: 692 }, { f: 104, x: 965, y: 676 }] },
        { kind: "car", role: "neutral", keys: [{ f: 0, x: 1150, y: 470 }, { f: 45, x: 1060, y: 570 }, { f: 90, x: 940, y: 684 }, { f: 104, x: 905, y: 716 }] },
        { kind: "truck", role: "dim", keys: [{ f: 0, x: 600, y: 650, rot: -12 }] },
      ],
      labels: [{ text: "DASHCAM CAR", at: 24, vehicle: 0, dy: 40, accent: true }, { text: "ONCOMING SUV", at: 52, vehicle: 1, dx: 30, dy: -34 }],
      impact: { f: 90, x: 932, y: 688 },
      cam0: { cx: 960, cy: 600, s: 1.05 },
      phases: [{ at: 18, phase: "A", to: { cx: 760, cy: 660, s: 1.5 } }, { at: 56, phase: "B", to: { cx: 860, cy: 700, s: 1.7 } }, { at: 106, phase: "C", to: { cx: 930, cy: 690, s: 2.2 } }],
    },
    ref: "VisualVenture §11 world infographic @3:28.0-3:36 (phases A/B/C beziers, labels clip-wipe 6-8 f) + Dashcam Vol.1 E10 satellite @0:04.8 + Farrell FA F7 route GM @2:57.1 + Dashcam Vol.3 E9 PiP geometry (0.459 W top-right)",
    when: "Collision reconstruction when the footage alone does not show the geometry (multi-vehicle crashes, junctions, a train at a crossing). Carries thin-footage cases.",
    props: "src, srcW/srcH, grade, media/mediaStart/clipAt (PiP, in sync), pipW, pipSide (auto|tr|tl|br|bl; auto = corner clear of the impact), vehicles [{kind car|truck|train, role, keys [{f (CLIP frame),x,y,rot?}], len, wid, cars, path}], labels [{text,at,vehicle|x,y,dx,dy,accent,outAt,cap}], impact {f,x,y}, cam0, phases [{at,phase A|B|C,to,d}], driftPerS, theme",
    twist: "vehicle keys use the dashcam's own timecode so the plan and the PiP stay in lockstep; travelled paths stay as dashed lines; accent impact marker on the collision frame",
    sfx: [],
    axes: { geometry: "top-down satellite + vehicle outlines + PiP", entry: "hard cut, VV 3-phase camera", layout: "plan full frame, footage PiP top-right", accent: "needle-orange vehicle + impact X ring" },
  },
  {
    family: F, name: "MeasureOnSat", component: MeasureOnSat, durationInFrames: 120, thumbFrame: 80, stripFrames: [10, 14, 18, 26, 40, 46, 56, 80],
    defaultProps: { src: "demo/mapstill.png", a: { x: 330, y: 760 }, b: { x: 900, y: 640 }, offset: 80, at: 10, valueAt: 40, value: 580, unit: " m", prefix: "~", cam0: { cx: 660, cy: 680, s: 1.6 }, push: { s: 1.9 } },
    ref: "VisualVenture §11 @3:28.0 (dashed bracket + leaders on the world plane, value 'X2' on 'twice' +0.0 s; phase C bezier(0.242,-0.22,0,1.144)) + Dashcam Vol.1 E10 @0:04.8 + D1 E4 typed stamp @2:27.5 (2 f/char) + Abyssal E2 @0:42.62 (block cursor, 0.5 s blink)",
    when: "A spoken distance on real ground: 'nearly a kilometre along the runway', a stopping distance, how far the train dragged the car.",
    props: "src, srcW/srcH, grade, a/b {x,y} (still px), offset, at, valueAt, value, decimals, unit, prefix, cap, cam0, push {s,d,at}, driftPerS, outAt, theme",
    twist: "the value TYPES at 2 f/char with the accent block cursor (INSTRUMENT readout) instead of sliding up; camera phase-C push lands on the word",
    sfx: [{ event: "typing_key", at: 40, note: "one key per character every 2 f from valueAt (SI T1); the bracket itself is silent" }],
    axes: { geometry: "dashed bracket across an aerial still", entry: "leaders 6 f, bracket draws from centre 12 f, value types", layout: "bracket offset from the measured line, value outside", accent: "needle-orange dashes + unit + block cursor" },
  },
];
