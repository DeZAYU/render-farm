// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { NameType_A } from "./NameType_A";
import { PlaceTruck_A } from "./PlaceTruck_A";

const RULES = "OVERLAY (no media; the demo shows it alone): always over the case footage, never on black; hold >= 3 s; at most ~5 Editor A devices per video and never in consecutive cases; Waterpark channel style.";

export const extra: VariantDef[] = [
  {
    family: "labels", name: "NameType-A", component: NameType_A, durationInFrames: 130, thumbFrame: 80, stripFrames: [6, 8, 10, 14, 18, 30, 40, 80],
    defaultProps: { first: "Daniel", last: "Weel", at: 6, role: "ride engineer, to local news", roleAt: 30, out: 110 },
    ref: "VV 2026 53.4-55.4 'MICHAEL', 11:35 'MATTHEW GIBSON' (TEMPLATE_UPGRADES #10): name types on ~1 char/f lower-left. Used AP C08.",
    when: "Name a speaker / expert / witness the first time they talk (lower-left). " + RULES,
    props: "first, last, at, role, roleAt, out, x, y, cap, cpf (chars per frame)",
    twist: "Oswald 200 glowing name with the surname in DD red #F22522; Varela + stroke role line rises on its word; soft local dark band keeps >= 4.5:1 (M-024); group drifts +6 px/s",
    sfx: [{ event: "case_number_hit", at: 6, note: "optional, -10 dB (VV soft LF thump) or none" }],
    axes: { geometry: "lower-left name + role block", entry: "letter-by-letter type-on (~1 char/f)", layout: "thin name line over a rising role line", accent: "surname in DD red with glow" },
  },
  {
    family: "labels", name: "PlaceTruck-A", component: PlaceTruck_A, durationInFrames: 130, thumbFrame: 70, stripFrames: [4, 8, 12, 16, 26, 40, 70, 115],
    defaultProps: {
      line1: [{ text: "Lakeside", at: 6 }, { text: "Park", at: 12 }],
      line2: [{ text: "Riverside,", at: 26 }, { text: "Ohio", at: 32, red: true }],
      ruleAt: 14, exitAt: 106,
    },
    ref: "TitlePlace (Varela cap 113/96, red rule #FD292D glow 14, words blur-in 3-4 f, stagger 6-8 f) + Farrell FA F1 1:32.9 place-in-shot + VV 2026 continuous camera. Built for AP C08 / C19A.",
    when: "Place name inside the shot (the footage trucks; the label rides a nearer parallax layer, 1.35x the truck). " + RULES,
    props: "line1/line2 [{text,at,red}], cap, cap2, x, y, truck (px/s), exitAt, ruleAt, band",
    twist: "the label reads as part of the shot (parallax truck) instead of pasted on top; red rule draws under line 1 on its word (EZ.quick 14 f); exit 20 f ease-in + 3 px blur while the drift continues",
    sfx: [],
    axes: { geometry: "two-line place label on a parallax layer", entry: "words blur-in + red rule draws 14 f", layout: "white line 1 over line 2 with red key word", accent: "#FD292D glowing rule" },
  },
];
