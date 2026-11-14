// Family "toll": pixel-people counts (core PP_PATH glyph). All timing props LOCAL frames; land the switches on the spoken number words.
import type { VariantDef } from "../../core";
import { Arithmetic } from "./Arithmetic";
import { FillCounter } from "./FillCounter";
import { FillInsideShape } from "./FillInsideShape";
import { IconGrid } from "./IconGrid";
import { NameAgeRoll } from "./NameAgeRoll";
import { GridTurnRed } from "./GridTurnRed";
import { RowCompare } from "./RowCompare";
import { SingleFile } from "./SingleFile";

export const variants: VariantDef[] = [
  {
    family: "toll", name: "GridTurnRed", component: GridTurnRed,
    defaultProps: { total: 500, red: 15, redAt: 14, number: "15", word: "dead", numberAt: 50 },
    durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 14, 18, 24, 32, 44, 50, 60, 100],
    ref: "Farrell CC @ 12:41.6 (R16 glowing icon + number) + Farrell YT @ 22:36 (pixel glyphs) + Farrell story #34 ('icons go red'); wp3 sec_C Fifteen @ 5660",
    when: "The death toll against the size of what happened: a field of everyone involved, the dead flip red on the number word.",
    props: "total, red, redAt, stagger, number?, word?, numberAt, seed, pull",
    twist: "grid auto-fits any total; each flip blooms 25 % for 6 f; optional DD stat line under the field",
    sfx: [{ event: "sub_boom", at: 14, note: "low, on the first flip" }],
    axes: { geometry: "dense full-frame grid", entry: "field pops, reds flip 2 f apart", layout: "field (+ stat below)", accent: "red glow flips" },
  },
  {
    family: "toll", name: "FillCounter", component: FillCounter,
    defaultProps: { people: 240, value: 1000, prefix: "~", word: "people", at: 6, dur: 60 },
    durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 8, 14, 20, 28, 38, 50, 66, 100],
    ref: "Farrell CC @ 12:41.6 (number on its word) + Farrell GR @ 6:09.3 (counter roll) + Dashcam Vol.3 @ 1:47.87 (E5 stat); wp3 sec_A explainer @ 1827 (crowd fills on 'thousand')",
    when: "How many people were there: the crowd builds while the figure rolls up to it.",
    props: "people (glyphs), value, prefix, word?, at, dur, wordAt",
    twist: "crowd and counter share one quick-start/long-settle progress curve; diagonal sweep from the front rows",
    sfx: [{ event: "riser", at: 6, note: "short, under the roll" }],
    axes: { geometry: "figure left, block right", entry: "diagonal fill + rolling count", layout: "split: number | crowd", accent: "white glow + red word" },
  },
  {
    family: "toll", name: "RowCompare", component: RowCompare,
    defaultProps: {
      a: { count: 100, value: "~500", word: "injured", at: 4 },
      b: { count: 3, value: "15", word: "dead", at: 50, red: true },
      perLine: 25,
    },
    durationInFrames: 110, thumbFrame: 100, stripFrames: [0, 4, 10, 18, 30, 50, 56, 66, 100],
    ref: "Farrell YT @ 4:10.6 (two pixel families in contrast, lateral drift) + Farrell story #12 (ICO arithmetic on the words) + Dashcam Vol.3 @ 1:47.87 (E5 stat)",
    when: "Two quantities side by side where the ratio is the story (injured vs dead, attendees vs staff, before vs after). Same glyph scale = honest comparison.",
    props: "a / b {count (glyphs), value, word, at, red?}, perLine, sweep",
    twist: "row A dims to grey when row B lands so focus moves; sideways drift until the cut",
    sfx: [{ event: "title_word_hit", at: 50, note: "row B lands" }],
    axes: { geometry: "two horizontal rows", entry: "left->right sweep per row", layout: "figure + word left of each row", accent: "red row vs dimmed row" },
  },
  {
    family: "toll", name: "SingleFile", component: SingleFile,
    defaultProps: {
      people: [{ at: 8 }, { at: 22 }, { at: 34 }, { at: 44 }, { at: 54 }, { at: 62, red: true }, { at: 70, red: true }],
      word: "missing",
    },
    durationInFrames: 120, thumbFrame: 110, stripFrames: [0, 8, 12, 22, 34, 54, 62, 74, 110],
    ref: "Farrell YT @ 22:36 (E3 pixel glyph with glow and a reflected floor) + Visual Venture @ 1:44.1 (MOTION §7 crowd pull-back as new figures arrive) + VV @ 12:47.3 (§13 hard rise)",
    when: "Small counts that must be felt one at a time: each victim / each missing person rises on their own word.",
    props: "people {at, red?}[], word?, px (cell size), gapCells",
    twist: "camera keeps the growing line framed (log zoom, VV settle); floor reflection; red figures for the dead",
    sfx: [{ event: "title_word_hit", at: 8, note: "soft, one per figure" }],
    axes: { geometry: "one line of big glyphs on a floor", entry: "hard rise from below, one by one", layout: "count left, line right", accent: "reflection + red figures" },
  },
  {
    family: "toll", name: "Arithmetic", component: Arithmetic,
    defaultProps: { total: 25, steps: [{ remove: 4, at: 14 }, { remove: 3, at: 40 }], redAt: 66, number: "18", word: "left behind", numberAt: 90 },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 14, 22, 40, 50, 66, 74, 92, 140],
    ref: "Farrell story #12 (YT ICO arithmetic: 25 persons, 4 fade on 'four', 3 on 'three', 18 turn red, big '18') + #34 + Farrell evidence rule 10 (slide the plane)",
    when: "A count that changes in steps as the VO explains it (some left, some were rescued, the rest…), ending on the final figure.",
    props: "total, steps {remove, at}[], redAt, number?, word?, numberAt, cols",
    twist: "departed people stay as 8 % ghosts; the plane slides left (quick start/long settle) for the DD-face figure",
    sfx: [{ event: "sub_boom", at: 90, note: "on the final figure" }],
    axes: { geometry: "compact block", entry: "subtract by fading, then red", layout: "block slides left, figure right", accent: "ghost gaps + red block" },
  },
  {
    family: "toll", name: "IconGrid", component: IconGrid,
    defaultProps: {
      count: 24, cols: 6, icon: "bag",
      events: [
        { at: 30, op: "empty", n: 14, seed: 4, stagger: 1 },
        { at: 60, op: "red", others: true, stagger: 1 },
        { at: 92, op: "cross", ids: [2, 9, 17], stagger: 4 },
      ],
      figure: { text: "?", at: 70, red: true }, tags: [{ text: "never collected", at: 64, red: true }, { text: "a short tag line", at: 96 }],
    },
    durationInFrames: 140, thumbFrame: 130, stripFrames: [0, 10, 24, 34, 44, 64, 74, 96, 130],
    ref: "Farrell CC @ 12:41.6 (R16 icon + number) + Farrell story #12 / #34 (icon arithmetic on the words) + VV @ 19:26.4 (§7 red X drawn in 3 f) + Dashcam Vol.3 @ 1:47.87 (E5 stat); wp3 C#4",
    when: "Counting objects that stand for people (bags never collected, empty beds, seats) or a small set of people with different fates: red, crossed, dimmed, emptied, lit.",
    props: "count, cols, icon (glyphs-kit name | 'bag' | 'bed'), events {at, op red|cross|dim|empty|light, ids? | n + seed, stagger}[], figure? {text, at, red?}, tags {text, at, red?}[]",
    twist: "large tiles that cascade in diagonally; five state ops incl. drawn red crosses; figure + tags column (DD stat face)",
    sfx: [{ event: "sub_boom", at: 60, note: "low, on the red turn" }],
    axes: { geometry: "tiled wall of large icons", entry: "diagonal tile cascade", layout: "wall left, figure + tags right", accent: "red crosses / emptied tiles" },
  },
  {
    family: "toll", name: "NameAgeRoll", component: NameAgeRoll,
    defaultProps: {
      rows: [
        { name: "Name Surname", at: 6, age: "42", ageAt: 96 },
        { name: "Child's name", at: 22, fadeAt: 84 },
        { name: "Name Surname", at: 36, age: "32", ageAt: 106 },
        { name: "Child's name", at: 50, fadeAt: 84 },
        { name: "Name Surname", at: 62, age: "35", ageAt: 116, note: "brother", noteAt: 74 },
        { name: "Name Surname", at: 74, age: "38", ageAt: 126, redAt: 130 },
      ],
    },
    durationInFrames: 160, thumbFrame: 150, stripFrames: [0, 8, 20, 40, 66, 84, 100, 120, 150],
    ref: "Farrell memorial roll / Farrell text R2 (names typed on their words) + T9 typed text + Dashcam Vol.1 @ 0:16.9 (E4 '40 minutes' red typed per character)",
    when: "Naming the dead / the people involved without photos (faces rule): each name on its word, then the ages on theirs; survivors' lines fade.",
    props: "rows {name, at, age?, ageAt?, note?, noteAt?, fadeAt?, redAt?}[], cap, step (f/char), roll (px/s)",
    twist: "names only, typed with a short cursor; red tabular ages in their own column; fades for those who survived; the list rolls up slowly",
    sfx: [{ event: "typing_key", at: 6, note: "very soft, per name" }],
    axes: { geometry: "text list, no glyphs", entry: "typed per character", layout: "names left, ages right column", accent: "red ages + fading lines" },
  },
  {
    family: "toll", name: "FillInsideShape", component: FillInsideShape,
    defaultProps: { min: 50, max: 100, at: 26, bandAt: 70, figure: "50–100", word: "people", figureAt: 74 },
    durationInFrames: 130, thumbFrame: 120, stripFrames: [0, 8, 16, 26, 40, 60, 74, 90, 120],
    ref: "wp3 sec_A explainer @ 1827 (pool outline draws, pixel crowd fills) + Farrell evidence E1 (clean line art, one element per noun) + Dashcam Vol.3 @ 1:47.87 (E5 stat)",
    when: "How many people were inside a space when only a range is known ('between 50 and 100'): the room fills to the lower bound, the band shows as ghosts.",
    props: "shape (polygon, frame fractions), min, max, at, bandAt, figure?, word?, figureAt, px, seed",
    twist: "the uncertainty is drawn: solid people up to min, 22 % ghosts up to max; outline draws on first",
    axes: { geometry: "plan outline filled with glyphs", entry: "outline draw, then fill", layout: "plan left, figure right", accent: "ghost band (uncertainty)" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
