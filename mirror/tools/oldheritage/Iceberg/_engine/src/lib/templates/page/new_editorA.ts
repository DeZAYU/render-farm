// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { SlideTrack_A } from "./SlideTrack_A";

export const extra: VariantDef[] = [
  {
    family: "page", name: "SlideTrack-A", component: SlideTrack_A, durationInFrames: 150, thumbFrame: 100, stripFrames: [0, 4, 8, 12, 16, 40, 70, 100],
    defaultProps: {
      src: "demo/pg_tt0702.png", cssW: 1300, cssH: 1600, scale: 1.45, start: { x: 480, y: 1080 }, mode: "bar",
      marks: [{ r: [100, 1062, 704, 26], at: 40, dur: 30 }, { r: [100, 1086, 64, 26], at: 70, dur: 12 }], credit: "Taipei Times, 2 Jul 2015",
    },
    ref: "VV 2026 9:41.4-9:46.0 + 5:54 (TEMPLATE_UPGRADES #13): page slides in from the right (~0.5 s, decelerating, peak ~-540 px/s), camera tracks along the marked line while the mark wipes word by word. Used AP C03 / C19A.",
    when: "One real captured article / report line read by the VO: slide the page in and track along the line. Behind it the same page blurred and dimmed (no black side bars, M-073). Real captures only (headless Chrome 2x DPR, rects in CSS px). Hold >= 3 s; at most ~5 Editor A devices per video, never in consecutive cases; Waterpark style.",
    props: "src, cssW, cssH, scale, marks [{r [x,y,w,h] css, at, dur}], mode bar|yellow, start {x,y} css, slide, credit, exitAt",
    twist: "DD red multiply bar (default) or VV yellow #D5DE10 marker; slight pull (-1.4 %/s) and +0.2 deg/s roll while tracking",
    sfx: [{ event: "dip_whoosh", at: 0, note: "optional, the case's call" }],
    axes: { geometry: "full page sliding in from the right edge", entry: "decelerating lateral slide-in ~15 f", layout: "camera tracks along one marked line", accent: "red bar (or yellow marker) wiping word by word" },
  },
];
