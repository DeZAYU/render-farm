// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { CardWall_A } from "./CardWall_A";
import { ListBuild_A } from "./ListBuild_A";
import { StatementCard_A } from "./StatementCard_A";
import { TermsCard_A } from "./TermsCard_A";

const RULES = "Owner rules: hold >= 3 s, at most ~5 Editor A devices per video and never the same one in consecutive cases; Waterpark channel style (no logos, no letterheads, no TV frames).";
const ONPLATE = "Its own background is a dark wall/desk: in a video, run it over the case's defocused footage (OnPlate), never alone on black. ";

export const extra: VariantDef[] = [
  {
    family: "evidence", name: "CardWall-A", component: CardWall_A, durationInFrames: 210, thumbFrame: 190, stripFrames: [0, 6, 12, 16, 60, 90, 130, 190],
    defaultProps: {
      cap: 44, cam0: { x: 700, y: 420, z: 1.3 }, moves: [{ at: 52, x: 960, y: 450, z: 1.05 }, { at: 120, x: 960, y: 560, z: 0.9 }],
      cards: [
        { text: "WORN SEATBELTS", x: 520, y: 360, w: 420, at: 6 },
        { text: "OIL LEAKS", x: 1000, y: 330, w: 320, at: 60 },
        { text: "CRACKED SUPPORTS", x: 1440, y: 380, w: 420, at: 86 },
        { text: "CRACKED RAILS", x: 560, y: 700, w: 360, at: 128 },
        { text: "BROKEN BOLTS", x: 960, y: 720, w: 340, at: 150 },
        { text: "REPORTED BEFORE THAT NIGHT", x: 1420, y: 740, w: 460, at: 172, red: true },
      ],
    },
    ref: "Corkboard (text-only version) + Farrell 'it was a list' findings + VV world camera (stations on EZ.quick 30 f + constant +1 %/s push). Used AP C24 (OnPlate).",
    when: "Many inspection findings that have no images: each card pins on its word, the key finding gets a red rule. " + ONPLATE + RULES,
    props: "cards [{text,x,y,w,at,red,rot}], cam0 {x,y,z}, moves [{at,x,y,z}], cap",
    twist: "text index cards instead of photos; starts close on the first card and travels / pulls back across the wall; red pin + 1 f contact kick per card",
    sfx: [],
    axes: { geometry: "text index cards on a dark wall", entry: "each card drops 40 px on its word (10 f) with a red pin", layout: "scattered 2-row wall, camera travels between stations", accent: "red rule on the key-finding card" },
  },
  {
    family: "evidence", name: "ListBuild-A", component: ListBuild_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 4, 20, 26, 30, 70, 120, 160],
    defaultProps: {
      media: "demo/clip_park.mp4", header: { text: "WHAT THE INSPECTORS FOUND", at: 4 }, source: "state inspection report",
      items: [{ text: "A sensor was out of position", at: 20 }, { text: "The restraint was not checked", at: 70 }, { text: "No one logged the fault", at: 120 }],
    },
    ref: "Farrell 'it was a list' (one line per finding on its spoken word) + VV tilt along a tall plane; sibling of CitationSheet / ChainReaction. Used AP C16.",
    when: "A findings list from a report / investigation, item by item on the words, over the case footage defocused 18 px at 30 % (no flat card). " + RULES,
    props: "media, mediaStart, header {text,at}, items [{text,at}], cap, headerCap, pitch, x, source",
    twist: "camera tilts along the list (EZ.quick re-centre + constant +0.9 %H/s); items slide in 70 px from the right with a red index number popping 2 f earlier; older items step down to 42 %",
    sfx: [],
    axes: { geometry: "tall list plane over defocused footage", entry: "item slides 70 px from right + 6 px defocus clearing", layout: "left-aligned numbered list, Bebas header", accent: "red Nunito index numbers, older items dim" },
  },
  {
    family: "evidence", name: "StatementCard-A", component: StatementCard_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 4, 8, 14, 20, 60, 110, 160],
    defaultProps: {
      source: "STATEMENT · THE MANUFACTURER",
      lines: [{ text: "The ride passed its last inspection.", at: 8 }, { text: "It put out a statement:", at: 60 }, { text: "It is important for the public to know", at: 104, key: { at: 120 } }],
    },
    ref: "StampVerdict / ReportExcerpt family + Abyssal pen-circle logic; Editor A diagonal glide (-9 / -5 px/s) with +1.4 %/s push. Used AP C23 (OnPlate).",
    when: "A company / official press statement as plain points (no letterhead, no logos), the key phrase boxed in red on its word. " + ONPLATE + RULES,
    props: "source, lines [{text,at,key {at}}], cap",
    twist: "plain sheet slides up 60 px, lines type on one by one; the key phrase gets a red box drawn in 4 strokes (10 f) like a pen",
    sfx: [],
    axes: { geometry: "plain off-white sheet on a dark desk", entry: "sheet slides up 60 px, lines type on", layout: "source line over typed statement lines", accent: "red hand-drawn box around the key phrase" },
  },
  {
    family: "evidence", name: "TermsCard-A", component: TermsCard_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 4, 12, 24, 30, 80, 130, 165],
    defaultProps: {
      title: "THE PARK'S POSITION", titleAt: 4, source: "the owner, to reporters",
      lines: [
        { text: "He signed a waiver", at: 16, mark: { kind: "underline", at: 30 } },
        { text: "Medical costs, with receipts", at: 66, mark: { kind: "tick", at: 82 } },
        { text: "Compensation for other expenses", at: 112, mark: { kind: "strike", at: 130 } },
      ],
    },
    ref: "CitationSheet / StampVerdict siblings; Editor A diagonal glide across a 2.5 deg tilted card (-12 / -7 px/s, +1.2 %/s push). Used AP C12 (OnPlate).",
    when: "An offer / waiver / conditions list where each line gets judged: red tick (covered), strike (refused) or underline (the key condition) on its word. " + ONPLATE + RULES,
    props: "title, titleAt, lines [{text,at,mark {kind tick|strike|underline, at}}], cap, source",
    twist: "warm-white paper tilted 2.5 deg; lines slide 30 px up (EZ.quick 10 f); marks draw in 8 f (tick strokes, strike left to right)",
    sfx: [],
    axes: { geometry: "tilted terms card on a dark desk", entry: "lines slide 30 px up, marks draw 8 f", layout: "title over ruled condition lines", accent: "red tick / strike / underline per line" },
  },
];
