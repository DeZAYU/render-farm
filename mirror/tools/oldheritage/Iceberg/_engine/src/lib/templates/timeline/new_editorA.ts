// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { DateLine_A } from "./DateLine_A";
import { DateStack_A } from "./DateStack_A";

const RULES = "Owner rules: on the case's own footage / photo (never empty black), hold >= 3 s, at most ~5 Editor A devices per video and never the same one in consecutive cases; Waterpark channel style.";

export const extra: VariantDef[] = [
  {
    family: "timeline", name: "DateLine-A", component: DateLine_A, durationInFrames: 180, thumbFrame: 150, stripFrames: [0, 3, 6, 12, 24, 90, 104, 150],
    defaultProps: {
      bg: "demo/clip_park.mp4", exitAt: 170,
      steps: [{ year: "2012", title: "THE STORM", media: "demo/ph_ma_b.jpg", at: 0 }, { year: "2013", title: "REBUILT · REOPENED", media: "demo/ph_rocaf.jpg", at: 90 }],
    },
    ref: "VV 2026 2:10-2:22 '2001 DAVID CASTOR' -> '2003 THE SECOND MARRIAGE' (TEMPLATE_UPGRADES #9): line draws from centre (5 f), torn-edge photo rises from behind the line (~0.7 s), cross-swaps to the next year. Used AP OpenV4.",
    when: "Back-story dates (a storm, a rebuild, a reopening) as a dated card that changes state in place. " + RULES,
    props: "steps [{year,title,media,mediaStart,at,pos}], bg, bgStart, lineY, exitAt, photoW, photoH",
    twist: "white line + red year (never VV gold) on the blurred/dimmed case footage; whole card pushes +3 %/s",
    sfx: [{ event: "transition_whoosh", at: 0, note: "line draw (case mix)" }, { event: "dip_whoosh", at: 6, note: "photo rise (case mix)" }],
    axes: { geometry: "centre line with a torn photo above it", entry: "line draws from centre 5 f, photo rises from behind it", layout: "year + title over the line, photo above", accent: "red year, photo cross-swap" },
  },
  {
    family: "timeline", name: "DateStack-A", component: DateStack_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 6, 15, 44, 64, 96, 140, 165],
    defaultProps: {
      media: "demo/clip_crowd.mp4",
      lines: [{ text: "ABOUT 6 IN THE EVENING", at: 6, small: true }, { text: "WEDNESDAY", at: 44 }, { text: "26 OCTOBER", at: 64 }, { text: "2022", at: 96, red: true }, { text: "ALMOST FULL", at: 140, small: true }],
    },
    ref: "TypedDate / VhsDate / DateLine_A siblings; vertical wipe per line (bottom -> top, 9 f, EZ.out3); footage tilts down +16 px/s while the block drifts up -5 px/s. Used AP C16.",
    when: "The date (and time) of the incident as a stacked block on its words. " + RULES,
    props: "media, mediaStart, lines [{text,at,red,small}], cap, x, y, right, plateFilter",
    twist: "Bebas stack with the year in red, Inter 700 small time lines; plate dimmed only on the stack's side",
    sfx: [],
    axes: { geometry: "vertical stack of date lines on one side", entry: "per-line bottom-up wipe 9 f", layout: "weekday / day month / year stacked", accent: "red year" },
  },
];
