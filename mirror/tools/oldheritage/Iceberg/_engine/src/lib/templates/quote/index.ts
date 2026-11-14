// Family "quote": quote cards. All timing props are LOCAL frames (words land on their spoken frames). See each file's header for the reference.
import type { VariantDef } from "../../core";
import { PageLift } from "./PageLift";
import { RedSentence } from "./RedSentence";
import { Typewriter } from "./Typewriter";
import { WhiteBox } from "./WhiteBox";
import { WordSyncPhoto } from "./WordSyncPhoto";

const w = (s: string, at: number, step = 6) => s.split(" ").map((text, i) => ({ text, at: at + i * step }));

import { QuoteOnPlate } from "./QuoteOnPlate";
import { StampVerdict } from "./StampVerdict";
import { ReportExcerpt } from "./ReportExcerpt";
import { WitnessLine } from "./WitnessLine";
export const variants: VariantDef[] = [
  {
    family: "quote", name: "WordSyncPhoto", component: WordSyncPhoto,
    defaultProps: {
      src: "demo/n2019_pts.png", pos: "50% 40%",
      lines: [{ words: w("“It was never", 14).concat(w("our decision.”", 34)) }, { words: w("“We were told it was safe.”", 52) }],
      attribution: "Name Surname, 2019", attrAt: 90,
    },
    durationInFrames: 120, thumbFrame: 110, stripFrames: [0, 10, 14, 16, 20, 26, 40, 60, 110],
    ref: "Visual Venture @ 1:26.3 (MOTION §8 word-synced title over a scene) + Farrell IG @ 5:39.04 (T6 I08 quote over a dimmed face); wp3 sec_C PtsInner (c) @ 6460",
    when: "A person's own words read by the VO, over that person's photo or the place they refer to. The default quote device.",
    props: "src, pos, lines {words {text, at}[], cap?}[], attribution?, attrAt, dimAt, dim, push, streak, y",
    twist: "lines re-centre smoothly over 4 f as words arrive; photo dims/defocuses on the first word; VV anamorphic streak sweep",
    axes: { geometry: "full-frame dimmed photo", entry: "word ghosts on the voice", layout: "centred re-centring lines", accent: "anamorphic streak" },
  },
  {
    family: "quote", name: "WhiteBox", component: WhiteBox,
    defaultProps: { bg: "demo/clip_party.mp4", lines: [w("I might not", 14, 7), w("make it out.", 38, 7)], speaker: "Name Surname" },
    durationInFrames: 100, thumbFrame: 80, stripFrames: [0, 4, 8, 12, 15, 18, 24, 40, 60],
    ref: "Abyssal @ 35:00 / 61:50 (E4 quote card with speech-synced decode); FONTS.md quote card (Inter 600 black on white)",
    when: "A short spoken line (radio call, witness, 911) that must hit hard; the footage keeps running behind in a threshold look.",
    props: "bg, lines {text, at}[][] (1-2 lines), at (box pop), speaker?, posterize, cap",
    twist: "threshold bands in DD red only (no rainbow), speaker line under the box, box breathes +0.3 %/s",
    sfx: [{ event: "glitch_static", at: 8, note: "very low, under the threshold switch" }],
    axes: { geometry: "pure white box", entry: "1 f pop + ink-blob decode", layout: "centred 1-2 lines", accent: "red threshold footage" },
  },
  {
    family: "quote", name: "Typewriter", component: Typewriter,
    defaultProps: { bg: "demo/clip_fire.mp4", lines: [w("security wasn't nearly as tight", 10, 7), w("as you might expect.", 50, 7)], layout: "caption" },
    durationInFrames: 100, thumbFrame: 90, stripFrames: [8, 12, 18, 26, 36, 48, 56, 66, 90],
    ref: "SIRIUS @ 0:24.18 (E3 T1 word-locked typewriter caption) / @ 12:39.85 (T2 over blurred footage) / @ 29:17.5 (T3 large block)",
    when: "The one sentence of a case that must stick, typed exactly as spoken; or a quoted demand. layout 'block' for the big 3-line form.",
    props: "bg?, lines {text, at, end?}[][], layout 'caption'|'block', blur, dim",
    twist: "DD-graded defocused footage under it with a slow push; the text block rises 2 px/s",
    sfx: [{ event: "typing_key", at: 10, note: "one click per 2 f step while typing, -8 dB under VO" }],
    axes: { geometry: "bottom caption over blur", entry: "glyph pops on 2 f steps", layout: "left-aligned block, centred", accent: "soft white glow" },
  },
  {
    family: "quote", name: "RedSentence", component: RedSentence,
    defaultProps: {
      words: [
        { text: "and", at: 6, colour: "white" }, { text: "then", at: 12, colour: "white" }, { text: "the", at: 17, colour: "white" },
        { text: "lights", at: 22 }, { text: "went", at: 30 }, { text: "out.", at: 36 },
      ],
    },
    durationInFrames: 70, thumbFrame: 60, stripFrames: [0, 6, 12, 17, 22, 30, 36, 60],
    ref: "Visual Venture @ 1:07.1 and @ 13:58.3 (MOTION §9 hard word pops on black, red sentence); FONTS.md VV sentence on black",
    when: "Punctuation: the turning point of a story said in one short sentence, between moving devices. Use rarely.",
    props: "words {text, at, colour 'red'|'white'|'yellow'}[], align 'left'|'centre', cap, maxWidth, x",
    twist: "per-word colour mix, automatic wrap; still fully static as measured (the deliberate exception to the life-drift rule)",
    sfx: [{ event: "sub_boom", at: 22, note: "optional, on the red word" }],
    axes: { geometry: "pure black frame", entry: "static 1 f pops", layout: "left-aligned sentence", accent: "red ink, no glow" },
  },
  {
    family: "quote", name: "PageLift", component: PageLift,
    defaultProps: {
      page: { src: "demo/pg_tt0702.png", cssW: 1300, cssH: 1600 },
      quote: [[405.9, 1179.4, 431.4, 17], [100, 1203.4, 136.1, 17]],
      strip: [94, 1171, 772, 56],
      barAt: 8, lineDur: 16, liftAt: 48,
      speaker: [{ text: "—", at: 64 }, { text: "Name", at: 64 }, { text: "Surname", at: 70 }], role: "speaking to reporters",
    },
    durationInFrames: 130, thumbFrame: 110, stripFrames: [0, 10, 24, 40, 48, 52, 56, 62, 72, 110],
    ref: "Dashcam Vol.1 @ 4:15.8 (E9 red page bar) on Dashcam Vol.3 @ 0:07.6 (E4 tilted print) + Farrell OF @ 4:29.5 (evidence B4/R9 lift-out)",
    when: "A quote that exists in print (a court ruling, a statement, an article): mark it on the page, then lift it out with who said it.",
    props: "page {src, cssW, cssH}, quote Rect[] (css), strip? [x,y,w,h], barAt, lineDur, liftAt, speaker {text, at}[], role?, cam {cx, cy, s, rot}, targetW",
    twist: "the lifted strip is the page's own crop (red bars kept) and travels to a readable size; attribution words in sync; cap exemption: the lifted strip and page are the captured page image (not typeset)",
    sfx: [{ event: "transition_whoosh", at: 48, note: "soft, on the lift" }],
    axes: { geometry: "page + lifted paper strip", entry: "red bar wipe, then lift-out", layout: "strip centre, name under", accent: "DD red bar" },
  },
  {
    family: "quote", name: "QuoteOnPlate", component: QuoteOnPlate, durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 8, 12, 18, 30, 52, 60, 100],
    defaultProps: { media: "demo/clip_crowd.mp4", lines: [{ text: "IF IT HAPPENED ONCE MORE...", at: 8 }, { text: "...SHUT THE RIDE DOWN", at: 52, red: true }, { text: "FOR THE DAY", at: 62, red: true }], attribution: { text: "evidence to the inquest", at: 78 } },
    ref: "Farrell text T6 I08 (quote lines over a dimmed face, IG 5:39.04) + Farrell T5/R11 plate (blur, gain .45, desat) + VV §8 ghosting; maps c03 #9, c05 #25",
    when: "Reported words from evidence / a statement when there is no page to show and no photo of the speaker: over the case footage, defocused.",
    props: "media, mediaStart, lines [{text, at, red}], attribution {text, at}, cap, x, maxW; subCap (attribution, 30)",
    twist: "whole lines land on their word while their letter-spacing closes 0.16 -> 0.02 em; red key line; red dash before the attribution",
    axes: { geometry: "left-aligned block over a falloff", entry: "line ghost + tracking close + 12 px rise", layout: "two caps lines + attribution", accent: "red key line, red dash" },
  },
  {
    family: "quote", name: "StampVerdict", component: StampVerdict, durationInFrames: 100, thumbFrame: 70, stripFrames: [0, 30, 36, 38, 40, 42, 50, 70],
    defaultProps: { title: "NAME SURNAME", lines: ["Case no. ________", "Charge: ________"], stamp: "GUILT FULLY ESTABLISHED", stampAt: 40, attribution: { text: "- the prosecutor, 2006", at: 56 } },
    ref: "DD case-file stamp language (D1 E12 corkboard index card @14:44.4, red ink caps) + DD impact kick (D1 white-flash grammar); maps c02 #43, c08 #32",
    when: "A verdict, finding or label that is FINAL ('guilt fully established', 'one big epic failure'). Use on its phrase; max twice a video.",
    props: "title, lines (index card) OR src (document image), stamp, stampAt (contact frame), rot, attribution {text, at}, seed; cap (stamp, 96), labelCap (card lines 30, title x1.5), subCap (attribution, 32)",
    twist: "the stamp falls from above the lens (x1.7 -> 1 in 4 f), lands with a 2 f kick, ink texture with missing bits, multiply onto the card",
    sfx: [{ event: "sub_boom", at: 40, note: "stamp contact" }],
    axes: { geometry: "card on a desk + rotated stamp", entry: "falling stamp impact", layout: "card centre, stamp across it", accent: "rough red ink double frame" },
  },
  {
    family: "quote", name: "ReportExcerpt", component: ReportExcerpt, durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 10, 30, 50, 70, 90, 110, 140],
    defaultProps: { words: "None of the park employees appeared to be aware of what had happened at the ride.".split(" ").map((t, i) => ({ text: t, at: 8 + i * 6 })), attribution: { text: "- deputy chief, incident report", at: 112 } },
    ref: "Farrell document typing (FA text T9, evidence 'document on desk') + DD D1 E9 red marking (as a pen bracket) + FONTS.md Courier Prime; map c04 #22",
    when: "One line from an official report / inquest / police record, read verbatim by the VO. Paper, not a web page.",
    props: "header, fields (generic letterhead), words [{text, at}] (typed word-locked), attribution {text, at}, cpf (chars/frame), maxChars (wrap); cap (typed body, 30 on a x1.12-1.32 sheet), labelCap (fields 26, header x1.55), subCap (attribution, 26 on sheet = 29 on screen)",
    twist: "the camera tracks the typing line close, then pulls back when the line ends; a red pen bracket draws in the margin",
    sfx: [{ event: "typing_key", at: 8, note: "one key per character" }],
    axes: { geometry: "report sheet close-up, tilted 1.4 deg", entry: "word-locked typing, tracking camera", layout: "letterhead + ruled lines", accent: "red pen margin bracket" },
  },
  {
    family: "quote", name: "WitnessLine", component: WitnessLine, durationInFrames: 110, thumbFrame: 96, stripFrames: [0, 10, 16, 22, 30, 40, 60, 96],
    defaultProps: { media: "demo/clip_fire.mp4", lines: [{ text: "LIKE A TORPEDO", at: 10, red: true, underline: true }], attribution: { text: "- a witness", at: 50 } },
    ref: "Farrell text T6 (quote over a dimmed plate) as a handwritten variant; FONTS.md Lacquer (the shipped brush/marker face); maps c08 #11, #20",
    when: "One short, vivid witness / victim phrase ('like a torpedo', 'inconceivable'). Reported speech: no quotation marks.",
    props: "media (dark plate), lines [{text, at, red, underline}], attribution {text, at}, cap, cps (letters/s), tilt; subCap (attribution, 30)",
    twist: "letters are WRITTEN on at writing speed with an ink-spread pop; hand-drawn tapered red underline after the word",
    axes: { geometry: "tilted centred handwriting", entry: "letter-by-letter write-on", layout: "one or two lines + attribution", accent: "red marker + drawn underline" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
