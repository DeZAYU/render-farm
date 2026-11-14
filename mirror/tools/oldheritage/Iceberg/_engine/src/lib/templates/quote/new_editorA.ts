// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { MarkerQuote_A } from "./MarkerQuote_A";
import { PhraseSlam_A } from "./PhraseSlam_A";
import { QuoteRule_A } from "./QuoteRule_A";
import { ShoutLines_A } from "./ShoutLines_A";

const RULES = "Owner rules: always over the case footage (never text on black), hold >= 3 s, at most ~5 Editor A devices per video and never the same one in consecutive cases; Waterpark channel style.";

export const extra: VariantDef[] = [
  {
    family: "quote", name: "MarkerQuote-A", component: MarkerQuote_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 10, 40, 48, 56, 110, 130, 160],
    defaultProps: {
      media: "demo/clip_park.mp4", lines: ["Staff followed the protocols", "set by the manufacturer.", "All visitors left safely."],
      marks: [{ line: 0, from: 1, to: 3, at: 40 }, { line: 2, from: 2, to: 3, at: 120 }], attribution: "the park (statement)", cap: 56,
    },
    ref: "Abyssal E5 marker logic without a page; sibling of QuoteOnPlate / QuoteRule_A / PageLift; Editor A dolly across a 6 deg Y-tilted plane (-22 px/s, +1.4 %/s push). Used AP C01.",
    when: "A reported statement whose key phrase is highlighted on its word (all words present from frame 0, no empty lead); footage behind defocused 16 px at 30 %. " + RULES,
    props: "media, mediaStart, lines string[], marks [{line,from,to (word idx),at,dur}], attribution, cap, quoted",
    twist: "translucent red marker bar (70 %) wipes under the key words like a highlighter; attribution on a thin rule under the block",
    sfx: [],
    axes: { geometry: "Y-tilted quote plane over defocused footage", entry: "words present at 0, sideways dolly", layout: "left block + attribution rule", accent: "red 70 % highlighter wipe" },
  },
  {
    family: "quote", name: "PhraseSlam-A", component: PhraseSlam_A, durationInFrames: 150, thumbFrame: 110, stripFrames: [0, 30, 36, 38, 40, 44, 60, 110],
    defaultProps: {
      media: "demo/clip_fire.mp4", at: 36, lines: [{ text: "RIGHT PAST THE EDGE" }, { text: "OF A CATASTROPHE", red: true }],
      attribution: { text: "a state official, to reporters", at: 4 }, cap: 96,
    },
    ref: "SlamCard / KineticTitle / WordPops siblings; phrase lands x1.6 -> 1 in 5 f with a 2 f kick + 1 f white flash; camera +3 %/s push and settle drift. Used AP C17.",
    when: "ONE short reported phrase (a quote's key words) slammed over the footage at 46 % with a dark centre. " + RULES,
    props: "media, mediaStart, lines [{text,red}], at, attribution {text,at}, cap",
    twist: "Bebas caps phrase (wraps to 2 lines), key line red; attribution types on first so the slam answers it",
    sfx: [],
    axes: { geometry: "centred two-line phrase over darkened footage", entry: "x1.6 -> 1 slam in 5 f + 2 f kick + 1 f white flash", layout: "phrase centre, small typed attribution under", accent: "red key line + white flash" },
  },
  {
    family: "quote", name: "QuoteRule-A", component: QuoteRule_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 6, 30, 56, 90, 130, 150, 165],
    defaultProps: {
      media: "demo/clip_crowd.mp4",
      lines: [[{ text: "Several changes", at: 30 }], [{ text: "to modernize safety", at: 60 }], [{ text: "and procedural standards", at: 96 }], [{ text: "reviewed by the state", at: 136, red: true }]],
      attribution: { text: "the park (statement)", at: 6 }, cap: 50,
    },
    ref: "VV 8 word sync (ghost 22 % -> full on the spoken time, no per-word motion); sibling of QuoteOnPlate / WordSyncPhoto / RedSentence. Used AP C16.",
    when: "A longer paraphrase / quote that must stay readable while the VO reads it word by word, over defocused footage. " + RULES,
    props: "media, mediaStart, lines QWord[][] [{text,at,red}], attribution {text,at}, cap, x, y, quoted",
    twist: "a red vertical rule grows beside the block with the share of words said; block drifts diagonally while the footage trucks the other way (parallax)",
    sfx: [],
    axes: { geometry: "left text block with a growing red side rule", entry: "ghost words light on their times", layout: "stacked lines + attribution under the rule", accent: "red rule height = words said" },
  },
  {
    family: "quote", name: "ShoutLines-A", component: ShoutLines_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 30, 36, 40, 76, 82, 130, 160],
    defaultProps: {
      media: "demo/clip_party.mp4", attribution: { text: "a witness, to local news", at: 4 },
      shouts: [{ text: "NOT THE PROPER PROTOCOLS", at: 30, red: true }, { text: "TO STOP THE RIDE", at: 76 }, { text: "THEY SHOULD KNOW WHAT TO DO", at: 124 }],
    },
    ref: "KineticTitle / WordPops / RedSentence siblings; phrases whip in 80 px (EZ.quick 9 f, 10 px motion blur clearing) + 1 f white edge flash. Used AP C02.",
    when: "A witness account as short shouted phrases ('out of control / kids crying'), alternating left/right; the footage stays visible at 42 % (not blurred). " + RULES,
    props: "media, mediaStart, shouts [{text,at,red}], attribution {text,at}, cap",
    twist: "earlier phrases step back to 55 % and shrink 6 %; each phrase drifts toward centre after landing; attribution types on in the corner",
    sfx: [],
    axes: { geometry: "alternating left / right phrases", entry: "80 px side whip + motion blur + 1 f edge flash", layout: "stacked phrases zig-zag, older ones recede", accent: "red key phrase" },
  },
];
