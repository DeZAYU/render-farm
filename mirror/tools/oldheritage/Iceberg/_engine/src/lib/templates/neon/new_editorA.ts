// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// lineEngine_A.tsx is the shared engine (not a variant). Merged into index.ts by tools/merge_extras.py.
import React from "react";
import type { VariantDef } from "../../core";
import { Media } from "../../core";
import { StateScene_A } from "./StateScene_A";
import { P } from "./lineEngine_A";

const TRACK = Array.from({ length: 49 }, (_, i) => { const a = (i / 48) * Math.PI * 2; return [960 + 520 * Math.cos(a), 600 + 200 * Math.sin(a) + 40 * Math.sin(a * 6)] as [number, number]; });
const CARS = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i / 8) * Math.PI * 2; return P.capsule(960 + 520 * Math.cos(a), 590 + 200 * Math.sin(a) + 40 * Math.sin(a * 6), 70, 34); }).join(" ");

export const extra: VariantDef[] = [
  {
    family: "neon", name: "StateScene-A", component: StateScene_A, durationInFrames: 200, thumbFrame: 170, stripFrames: [0, 5, 9, 14, 52, 94, 130, 170],
    defaultProps: {
      plate: React.createElement(Media, { src: "demo/clip_party.mp4" }), skel: "niris", outAt: 190, cam: { s0: 1.02, push: 0.03, dx: 14 },
      items: [
        { d: P.line(TRACK), at: 0, draw: 10 },
        { d: CARS, at: 2, draw: 8, red: 94, move: [{ f: 0, x: 0, y: 0, rot: 0 }, { f: 100, x: 0, y: 0, rot: -10 }, { f: 200, x: 0, y: 0, rot: -26 }] },
        { d: P.arrow(620, 360, 420, 300), at: 52, draw: 8, red: 52 },
      ],
      words: [
        { text: "the backward section", at: 52, x: 960, y: 200, typed: true, cap: 34 },
        { text: "it didn't stop", at: 94, x: 960, y: 270, red: true, typed: true, cap: 38 },
        { text: "pull the plug", at: 140, x: 960, y: 960, typed: true, cap: 30 },
      ],
    },
    ref: "VV 2026 'Impossible Cold Cases' 0:56-1:02, 2:16-2:22, 11:05-12:35 (TEMPLATE_UPGRADES #5): one neon scene that changes state on the words; entry = 9 f dissolve from the footage plate (VV26 55.4 s). Used AP C02 / C03.",
    when: "Show what happened as a state change (cars stop, a part goes red, a divider draws, a typed red word) right after the footage it explains. Plate = the case footage it dissolves from (never empty black); hold >= 3 s; at most ~5 Editor A devices per video, never in consecutive cases; Waterpark style skin (white glow + #E30A10), never VV teal/magenta.",
    props: "items LItem[] {d,x,y,at,draw,red,redOut,move,out,dash,pulse}, words LWord[] {text,at,x,y,red,typed,cap,leader}, cam {s0,settle,push,dx,dy,roll,stations}, plate (ReactNode), outAt, labelCap, skel (niris|nsplit|ntilt|ngrid|wide...)",
    twist: "calmer than VV (push +3 %/s, drift -24 px/s, roll -0.35 deg/s, drift ramps in over 20 f) so typed words stay readable; skeletons vary plate/frame/camera per use",
    sfx: [{ event: "typing_key", at: 52, note: "on each typed word (case mix); nothing on the dissolve" }],
    axes: { geometry: "one neon pictogram scene that changes state", entry: "9 f cross-dissolve from the footage plate + 1.1 -> 1 settle", layout: "scene centre, small typed words above/below", accent: "parts turn #E30A10 red on their words" },
  },
];
