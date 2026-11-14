// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import React from "react";
import type { VariantDef } from "../../core";
import { Media } from "../../core";
import { LineSection_A } from "./LineSection_A";
import { MeasureBracket_A } from "./MeasureBracket_A";
import { FaultList_A } from "./FaultList_A";
import { P } from "../neon/lineEngine_A";

const RULES = "Owner rules: footage or a plate behind (never text on black), hold >= 3 s, at most ~5 Editor A devices per video and never the same one in consecutive cases; Waterpark channel style.";
const TOWERS = P.line([[560, 980], [700, 120]]) + " " + P.line([[1360, 980], [1220, 120]]) + " " + P.ground(420, 1500, 980);
const POD = P.circle(0, 0, 70) + " M-70 0 A70 26 0 0 0 70 0 M0 -70 A26 70 0 0 0 0 70";

export const extra: VariantDef[] = [
  {
    family: "diagram", name: "LineSection-A", component: LineSection_A, durationInFrames: 180, thumbFrame: 150, stripFrames: [0, 4, 12, 20, 60, 76, 110, 150],
    defaultProps: {
      skel: "dim", plate: React.createElement(Media, { src: "demo/clip_park.mp4" }), outAt: 170, cam: { stations: [{ f: 0, cx: 960, cy: 560, s: 0.92 }] },
      items: [
        { d: TOWERS, at: 2, draw: 16 },
        { d: POD, x: 960, y: 860, at: 60, draw: 12 },
        { d: P.line([[900, 830], [700, 130]]) + " " + P.line([[1020, 830], [1220, 130]]), at: 100, draw: 14, red: 112, pulse: 120 },
      ],
      words: [
        { text: "two towers", at: 20, x: 420, y: 420 },
        { text: "the pod", at: 64, x: 1300, y: 880, leader: { x: 1040, y: 870 } },
        { text: "the cables", at: 112, x: 960, y: 140, red: true },
      ],
    },
    ref: "Farrell McGuire line-art explainers (FA/FB: white strokes, red key part, labels on the spoken word) + CHANNEL_STYLE 15 diagrams; engine shared with neon/StateScene_A (lineEngine_A). Used AP C02 / C03.",
    when: "Explain how a ride is built / which part failed, drawn on the words over the case's own footage dimmed to .26. " + RULES,
    props: "items LItem[] {d,x,y,at,draw,red,pulse,move,out,dash}, words LWord[] {text,at,x,y,red,leader,typed}, cam {stations,s0,push,dx,dy,roll}, plate (ReactNode), plateDim, outAt, labelCap, skel (dim|wide|tilt|split|grid|trace)",
    twist: "Farrell line art kept level (no roll) but the camera moves between stations on EZ.quick with a +1 %/s push; failing part turns red and pulses; skeletons stop it reading as one template",
    sfx: [],
    axes: { geometry: "white line-art section over dimmed footage", entry: "1.08 -> 1 settle + strokes draw on the words", layout: "Varela labels with leaders around the structure", accent: "failing part turns red and pulses" },
  },
  {
    family: "diagram", name: "MeasureBracket-A", component: MeasureBracket_A, durationInFrames: 120, thumbFrame: 70, stripFrames: [8, 12, 16, 20, 24, 30, 70, 104],
    defaultProps: { a: { x: 1231, y: 960 }, b: { x: 1231, y: 515 }, offset: -140, at: 10, valueAt: 26, value: "100", unit: "FT", side: "left", out: 100 },
    ref: "TEMPLATE_UPGRADES #7 (VV 11 'X2' slide-up, D1 typed '40 minutes', D3 two-tone): leaders 6 f, dashed red bracket draws out from its centre 14 f, value types 2 f/char. Used AP C07.",
    when: "OVERLAY (no media; demo shows it alone): put it over the ride's own footage/photo to give a height or distance on the word; pass the plate's push as `cam` so it stays registered. " + RULES,
    props: "a/b {x,y} screen px, offset, at, valueAt, value, unit, out, cam {push,ox,oy}, cap, side left|right",
    twist: "bracket lives directly on the live footage (not a diagram plate) and rides the plate's camera; Nunito 900 white value + Varela red unit",
    sfx: [{ event: "typing_key", at: 26, note: "value types 2 f/char" }],
    axes: { geometry: "dashed red bracket between two footage points", entry: "leaders drop 6 f, bracket draws from its centre 14 f", layout: "value typed beside the bracket", accent: "two-tone white value + red unit" },
  },
  {
    family: "diagram", name: "FaultList-A", component: FaultList_A, durationInFrames: 180, thumbFrame: 150, stripFrames: [0, 6, 14, 22, 28, 66, 120, 150],
    defaultProps: {
      header: { text: "WHAT WAS WRONG", at: 4 },
      items: [{ glyph: "x", label: "THE STOP DIDN'T WORK", at: 8 }, { glyph: "phone", label: "NOBODY CALLED", at: 60, mark: "ring" }, { glyph: "bolt", label: "POWER CUT", at: 110, mark: "ring" }],
    },
    ref: "Farrell 'faults found' list + VV neon line icons; sibling of evidence/ListBuild_A and CleanDiagram. Used AP C02 (on a defocused crowd plate via OnPlate).",
    when: "Faults found / failures listed ('fewer screws, no washers, not bolted down'), each on its word. Its own background is dark with a red floor glow: in a video, run it over the case's defocused footage, never alone on black. " + RULES,
    props: "items [{glyph,label,at,mark x|ring}], header {text,at}, size, labelCap",
    twist: "white neon glyph draws on its word, then a red neon X or ring slams over it 6 f later with a 2 f bloom; world camera re-centres onto the newest item",
    sfx: [],
    axes: { geometry: "row of neon line icons on a world plane", entry: "glyph draws 16 f, red X/ring slams 6 f later", layout: "horizontal row with captions under", accent: "red neon X / ring with 2 f bloom" },
  },
];
