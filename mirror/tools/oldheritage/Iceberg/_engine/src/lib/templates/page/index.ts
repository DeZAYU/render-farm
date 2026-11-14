// Family "page": article page treatments (captured pages, 2x DPR PNG, rects in CSS px). All frames LOCAL. Nocturn variety rule: never the same
// treatment twice in a row, about half the pages WITHOUT a highlight (every highlight prop is optional).
import type { VariantDef } from "../../core";
import { LayerSplit } from "./LayerSplit";
import { InfoboxBar } from "./InfoboxBar";
import { TranslateOverlay } from "./TranslateOverlay";
import { MacroPan } from "./MacroPan";
import { ParagraphFocus } from "./ParagraphFocus";
import { DocScan } from "./DocScan";
import { PinnedLines } from "./PinnedLines";
import { FlatPush } from "./FlatPush";
import { HeadlineCrop } from "./HeadlineCrop";
import { RedInkWords } from "./RedInkWords";
import { RisingMarker } from "./RisingMarker";
import { ScrollToParagraph } from "./ScrollToParagraph";
import { TiltedPrint } from "./TiltedPrint";
import { VVPushHighlight } from "./VVPushHighlight";
import { entrySfx } from "./shared";
import { TornClip } from "./TornClip";
import { ColumnSlide } from "./ColumnSlide";
import { PhotoInPage } from "./PhotoInPage";

export const variants: VariantDef[] = [
  {
    family: "page", name: "FlatPush", component: FlatPush,
    defaultProps: { src: "demo/ft_sup.png", cssW: 1200, cssH: 2387, clip: [90, 2387], x1: 810, cam: { cx: 402, cy: 318, s: 2.42 }, move: { cx: 405, cy: 1128, s: 2.4, at: 45, d: 34 }, push: 0.006, entry: "whiteFrame" },
    durationInFrames: 150, thumbFrame: 120, stripFrames: [0, 1, 20, 44, 50, 56, 64, 120],
    ref: "Farrell PG2/MV1 spotlight page + EN4 single white frame (CC 4:50.3); wp3 sec_C SupPage @ abs 6733 (+ FivePage wide plate @ 6250)",
    when: "A ruling, statement or official page that only needs to be SEEN (the VO carries the words). The calm page between busier ones; default no highlight.",
    props: "src/cssW/cssH, clip [y0,y1], x1 crop, cam {cx,cy,s}, move? {cx,cy,s,at,d} (one eased scroll), push %/s, select? Mark[] (blue HL1 band), entry",
    twist: "the scroll is one quick-start/long-settle move with motion blur only while it travels; optional Farrell blue selection band instead of a wipe",
    sfx: [{ event: "title_wall_move", at: 45, note: "optional soft move cue on the scroll (anchor = move.at)" }],
    axes: { geometry: "flat sheet, spotlight", entry: "1 white frame", layout: "headline -> paragraph", accent: "none / blue selection" },
  },
  {
    family: "page", name: "TiltedPrint", component: TiltedPrint,
    defaultProps: {
      src: "demo/pg_tt0702.png", cssW: 1300, cssH: 1600, from: { cx: 478, cy: 1000 }, to: { cx: 478, cy: 1196 }, s: 2.35, scrollAt: 0, entry: "flashStreak",
      bars: [{ rects: [[390.8, 1203.4, 317.5, 17]], at: 46, dur: 30 }, { rects: [[405.9, 1179.4, 431.4, 17], [100, 1203.4, 136.1, 17]], at: 86, dur: 26 }],
    },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 2, 5, 9, 20, 36, 60, 140],
    ref: "Dashcam Vol.3 E4 tilted print @0:08.0-0:14.4 (bar 0:10.0) + D3 F1 flash-streak; wp3 sec_B TTQuote @ abs 3748 (sec_A CpaPage @ 1509 without bars)",
    when: "A witness / police / news account read word for word: the bars follow the VO's order. The 'physical evidence' page.",
    props: "src/cssW/cssH, clip?, x1?, from {cx,cy}, to? {cx,cy} (short DD scroll; omit = static print), s, scrollAt, bars? Mark[] (red multiply bars), roll [a,b], pitch, entry",
    twist: "zoom bump + roll settle run together with the DD scroll; bars may follow the VO order, not the page order",
    sfx: entrySfx("flashStreak"),
    axes: { geometry: "3-D tilted print, edge defocus", entry: "D3 flash-streak", layout: "two paragraphs, short scroll", accent: "red multiply bars" },
  },
  {
    family: "page", name: "ScrollToParagraph", component: ScrollToParagraph,
    defaultProps: {
      src: "demo/pg_tt15.png", cssW: 1600, cssH: 2000, from: { cx: 560, cy: 250 }, to: { cx: 640, cy: 1660 }, s: 2.05, scrollAt: 10, scrollDur: 66, entry: "glitch",
      bars: [{ rects: [[645.8, 1607.4, 137.8, 17]], at: 84, dur: 22 }, { rects: [[823.7, 1675.4, 121.9, 17]], at: 114, dur: 18 }],
    },
    durationInFrames: 160, thumbFrame: 150, stripFrames: [0, 1, 3, 14, 30, 44, 76, 150],
    ref: "Dashcam Vol.3 E4 scroll @0:08.0-0:14.4 + VV §10 glitch @0:13.55 + Caving red bar @22:06.8 / 35:38.6 (Nocturn CP12); wp3 sec_A TtPage @ abs 2412",
    when: "The proof is deep in the article: start on the headline (the source), travel to the paragraph the VO quotes. Good after footage.",
    props: "src/cssW/cssH, clip?, x1?, from/to {cx,cy}, s, scrollAt, scrollDur, bars? Mark[] (glow bars), barColour, glow, entry",
    twist: "upright column with a horizontal DOF reading band; Caving halo bar instead of the flat DD bar; motion blur only at the scroll peak",
    sfx: entrySfx("glitch"),
    axes: { geometry: "upright column, DOF band", entry: "VV glitch tear", layout: "headline -> deep paragraph (long scroll)", accent: "red glow bar" },
  },
  {
    family: "page", name: "RisingMarker", component: RisingMarker,
    defaultProps: {
      src: "demo/pts_2019.png", cssW: 1200, cssH: 1850, clip: [988, 1170], x0: 214, x1: 976, width: 1480, top: 0.34, plate: "demo/n2019_pts.png",
      marks: [{ rects: [[867, 1005.5, 67.5, 19], [236, 1038.5, 225.5, 19]], at: 44, dur: 30 }],
    },
    durationInFrames: 150, thumbFrame: 130, stripFrames: [0, 3, 6, 10, 16, 26, 50, 130],
    ref: "Abyssal (Chinese iceberg) E5 page excerpt + marker @19:50.6-20:00.4; wp3 sec_C PtsInner part (a) @ abs 6325",
    when: "Quoting one sentence of a report over the story's own picture (dark plate). Strong for numbers / dates said aloud.",
    props: "src/cssW/cssH, clip [y0,y1] + x0/x1 (the excerpt), width (px), top (fraction H), plate (media), riseDur, marks? Mark[] (yellow marker), markColour",
    twist: "the plate is the article's own photo / the case footage, defocused; excerpt keeps the page's real typography",
    sfx: [{ event: "title_wall_move", at: 0, note: "optional rise cue" }],
    axes: { geometry: "floating excerpt over dark plate", entry: "rise from below 1.3 s", layout: "one paragraph", accent: "yellow marker" },
  },
  {
    family: "page", name: "VVPushHighlight", component: VVPushHighlight,
    defaultProps: {
      src: "demo/ft_skin.png", cssW: 1200, cssH: 600, x1: 820, start: { cx: 420, cy: 395 }, target: { cx: 394, cy: 457 }, s: 2.05, Z: 0.0105,
      marks: [{ rects: [[222.8, 447.7, 342.9, 20]], at: 3, dur: 45 }],
    },
    durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 3, 8, 16, 26, 36, 50, 100],
    ref: "Visual Venture §6 page push + highlighter @1:32.51 (5:13.86, 7:08.05); wp3 sec_A MdtPage @ abs 2075, sec_C SkinPage @ abs 5571",
    when: "A single key line (a number, a cause) that must land hard and fast; 2-4 s beats. Omit marks for the VV burst without a highlight.",
    props: "src/cssW/cssH, clip?, x1?, start {cx,cy}, target {cx,cy} (key line centre), s, Z (burst strength), marks? Mark[] (yellow #D5DE10), grey",
    twist: "motion blur on the burst peak; the wipe can be retimed to end on the last spoken word",
    sfx: [],
    axes: { geometry: "grey re-graded page, DOF on key line", entry: "hard cut + velocity burst", layout: "one key line", accent: "yellow highlighter" },
  },
  {
    family: "page", name: "HeadlineCrop", component: HeadlineCrop,
    defaultProps: {
      src: "demo/ft_2018.png", cssW: 1200, cssH: 600, clip: [60, 600], x1: 800, wide: { cx: 410, cy: 372, s: 1.42 }, macro: { cx: 358, cy: 340, s: 2.85, roll: -1.2 }, cutAt: 45, pan: 0.018, entry: "fade",
    },
    durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 6, 14, 30, 44, 45, 70, 110],
    ref: "Farrell MV3 wide page -> hard cut to macro (SL 8:34 -> 8:37; GR 10:01) + PG4 macro DOF (GF headline macros @13:50.8); wp3 sec_C FivePage @ abs 6250",
    when: "The headline IS the fact (a verdict, a sentence, a number in the title). Cut lands on the spoken key word.",
    props: "src/cssW/cssH, clip?, x1?, wide {cx,cy,s}, macro {cx,cy,s,roll}, cutAt, pan (W/s), entry",
    twist: "the macro is slightly rolled with a lateral pan and a DOF band, so the cut reads as a camera move, not a zoom",
    sfx: [],
    axes: { geometry: "wide sheet -> rolled macro", entry: "fade up, then hard cut", layout: "headline only", accent: "none (the crop)" },
  },
  {
    family: "page", name: "RedInkWords", component: RedInkWords,
    defaultProps: {
      src: "demo/ft_high.png", cssW: 1200, cssH: 4392, x1: 815, slices: [{ y0: 90, y1: 440, vy: 0 }, { y0: 1020, y1: 1560, vy: 350 }],
      from: { cx: 400, cy: 240, s: 2.1 }, to: { cx: 410, cy: 390, s: 2.45 }, moveAt: 40, moveDur: 24, entry: "flash",
      words: [{ rects: [[139.8, 1045.6, 575.7, 20], [56, 1071.2, 41.3, 20]], at: 68, dur: 26 }],
    },
    durationInFrames: 140, thumbFrame: 125, stripFrames: [0, 1, 3, 30, 44, 52, 80, 125],
    ref: "Dashcam Vol.3 E4 red key words @0:07.6 + D1 4-f white flash; wp3 sec_C HighPage @ abs 7036",
    when: "A ruling / finding whose exact wording matters ('held jointly liable'): headline first, then the words turn red as they are said.",
    props: "src/cssW/cssH, slices? (collapse the page), x1?, from/to {cx,cy,s} (virtual css), moveAt, moveDur, words? Mark[] (red ink), ink, entry",
    twist: "slices stack the headline right above the paragraph so ONE move reads both; only the glyphs turn red (lighten), the paper stays clean",
    sfx: entrySfx("flash"),
    axes: { geometry: "flat collapsed sheet, DOF band", entry: "4-f hard white flash", layout: "headline stacked on paragraph", accent: "red ink type" },
  },
  {
    family: "page", name: "TornClip", component: TornClip,
    defaultProps: {
      src: "demo/ft_2018.png", cssW: 1200, cssH: 600, crop: [36, 258, 690, 400], width: 1500, focus: { cx: 337, cy: 321, s: 2.1, at: 66, d: 24 },
      ink: [{ rects: [[288, 305, 99, 31]], at: 72, dur: 8 }],
    },
    durationInFrames: 140, thumbFrame: 125, stripFrames: [0, 3, 8, 20, 40, 66, 74, 90, 125],
    ref: "Visual Venture torn print / photo card @1:29.3 (VV §5 oversize -> settle, rotation drift; V4_BRIEF photo-card list) applied to a page + D1 E6 punch @3:03.0; wp3 sec_C ChuCard torn-print motion",
    when: "A headline whose NUMBER is the point (patients released, people evacuated): the clipping lands, then the camera punches in on the figure on its word.",
    props: "src/cssW/cssH, crop [x0,y0,x1,y1] (CSS), width, focus? {cx,cy,s,at,d} (punch-in point), ink? Mark[] (red ink on the figure), paper, seed",
    twist: "the page becomes newsprint (warm paper, desaturated ink) with a torn edge; the punch lands exactly on the figure, which can turn red",
    sfx: [{ event: "zoom_boom", at: 66, note: "optional, anchor = focus.at" }],
    axes: { geometry: "torn newsprint clipping on black", entry: "oversize -> settle (VV recession)", layout: "headline only", accent: "punch-in + red figure" },
  },
  {
    family: "page", name: "ColumnSlide", component: ColumnSlide,
    defaultProps: {
      src: "demo/pts_2019.png", cssW: 1200, cssH: 1850, photo: [159, 358, 880.5, 436], column: [214, 985, 976, 1850], slideAt: 6, scroll: 52,
      date: { white: "Friday,", red: "June 12th", at: 30 },
    },
    durationInFrames: 160, thumbFrame: 120, stripFrames: [0, 6, 12, 20, 36, 50, 80, 120, 159],
    ref: "Farrell text T-layout (photo + column; evidence A1 locked photos, B1 linear drift, MV4 slow scroll GM 6:14) + D1 E4 typed time @2:27.5",
    when: "A witness / local-news article: the person's photo stays up while their account rises beside it; the date is typed on its word.",
    props: "src/cssW/cssH, photo Rect (CSS, the article's own photo), column [x0,y0,x1,y1], slideAt, scroll (px/s), date? {white, red, at, cpf}, marks?, labelCap (date 52)",
    twist: "the column keeps a constant read-scroll after it settles; the date uses the Dashcam label recipe on the photo",
    sfx: [{ event: "typing_key", at: 30, note: "typed date (one key per glyph step)" }],
    axes: { geometry: "split T-layout on paper", entry: "column slides up", layout: "photo left, text column right", accent: "typed Dashcam date" },
  },
  {
    family: "page", name: "PhotoInPage", component: PhotoInPage,
    defaultProps: {
      src: "demo/ft_high.png", cssW: 1200, cssH: 4392, x1: 815, head: { cx: 410, cy: 330, s: 2.4 }, photo: { cx: 407, cy: 690, s: 2.55 },
      line: { cx: 400, cy: 1273, s: 2.6, at: 88, d: 40 }, marks: [{ rects: [[56, 1263.1, 501, 20]], at: 112, dur: 40 }],
    },
    durationInFrames: 180, thumbFrame: 170, stripFrames: [0, 10, 24, 40, 70, 92, 104, 130, 170],
    ref: "Visual Venture page burst + pan @1:32.51 / 2:02.08 (VV §6) + VV §11 phase move (0.31,0,0,0.957); wp3 sec_B TTHead @ abs 3311",
    when: "An article whose photo shows the thing AND one sentence says the finding: headline -> its photo -> back up to the sentence.",
    props: "src/cssW/cssH, clip?, x1?, head/photo {cx,cy,s}, line {cx,cy,s,at,d}, burstNorm, marks? Mark[] (yellow), grey",
    twist: "two journeys on one page; the DOF opens while we are inside the photo and closes on the sentence",
    sfx: [],
    axes: { geometry: "grey page, travelling DOF", entry: "velocity burst down", layout: "headline -> photo -> sentence", accent: "yellow highlighter" },
  },
  {
    family: "page", name: "LayerSplit", component: LayerSplit,
    defaultProps: {
      src: "demo/wiki.png", cssW: 1200, cssH: 6000, layers: [[262, 92, 680, 132], [262, 212, 616, 414], [636, 250, 924, 418], [630, 672, 932, 976]], key0: 0,
      cam: { cx: 600, cy: 330, s: 1.75 }, splitAt: 14, keyAt: 46, keyS: 1.5,
    },
    durationInFrames: 140, thumbFrame: 120, stripFrames: [0, 14, 20, 28, 46, 54, 64, 120],
    ref: "VV §6 page push + VV rule 8 depth by occlusion/parallax (MOTION.md §15) + Farrell B4 lift-out (OF 4:29.5)",
    when: "A reference page where ONE block is the point (title + date, the photo, the lead): the page comes apart in depth and that block comes forward.",
    props: "src/cssW/cssH, layers [x0,y0,x1,y1][], key0 (index), cam {cx,cy,s}, splitAt, keyAt, keyS, marks? (yellow, on the key layer)",
    twist: "every block is its own depth layer; non-key layers fall back, defocus and dim",
    sfx: [{ event: "title_wall_move", at: 14, note: "the split" }],
    axes: { geometry: "exploded 3-D layers", entry: "assembled page splits in z", layout: "blocks in depth", accent: "key layer forward (none / marker)" },
  },
  {
    family: "page", name: "InfoboxBar", component: InfoboxBar,
    defaultProps: {
      src: "demo/wiki.png", cssW: 1200, cssH: 6000, box: [626, 205, 940, 980], page: { cx: 600, cy: 560, s: 1.35 }, liftAt: 8,
      row: { cy: 775, s: 2.5, at: 50, d: 32 }, bars: [{ rects: [[721, 759, 173, 15], [723.5, 780, 122, 12]], at: 66, dur: 26 }],
    },
    durationInFrames: 140, thumbFrame: 125, stripFrames: [0, 8, 14, 22, 40, 56, 70, 125],
    ref: "Dashcam Vol.1 E9 Guardian red bar @4:15.8 (wp3 sec_C Wiki red bars @ abs 5744) + Farrell B4 lift-out (OF 4:29.5)",
    when: "A fact that lives in an infobox / lead block (a name, a role, a date, a location): the box lifts off the page and the value gets the bar.",
    props: "src/cssW/cssH, box [x0,y0,x1,y1], page {cx,cy,s}, liftAt, row? {cy,s,at,d}, bars? Mark[]",
    twist: "the box physically lifts out of the blurred page, then the camera reads down it",
    sfx: [],
    axes: { geometry: "card lifted over blurred page", entry: "lift-out + turn settle", layout: "narrow fact box", accent: "DD red bar on one value" },
  },
  {
    family: "page", name: "TranslateOverlay", component: TranslateOverlay,
    defaultProps: {
      src: "demo/pg_yt.png", cssW: 1150, cssH: 1200, cam: { cx: 340, cy: 960, s: 2.9 },
      chips: [{ r: [28.5, 952.5, 245, 14], text: "only meant to record my life", at: 30 }, { r: [28.5, 992.5, 181.5, 14], text: "but it filmed something else", at: 80 }],
    },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 10, 24, 34, 44, 60, 84, 100, 140],
    ref: "D3 I13 boxed caption (Dashcam Vol.3 @8:12.5) typed like Farrell T9, pinned ON the page; Farrell EN2 fade-up (IS 4:54.8); VV §11 phase moves",
    when: "A foreign-language source (RU / ID / ZH): the English sits on the phrase it translates, as the VO says it.",
    props: "src/cssW/cssH, clip?, x1?, cam {cx,cy,s}, chips {r, text, at, side? right|below|above}[], follow, cpf, labelCap (chip 34)",
    twist: "the chips live in page space (they move with the page) and older chips dim",
    sfx: [{ event: "typing_key", at: 39, note: "chip 1 typing (chip at + 9)" }, { event: "typing_key", at: 89 }],
    axes: { geometry: "flat page, slow push", entry: "fade up from black", layout: "phrase + pinned chip", accent: "red underline + boxed typed English" },
  },
  {
    family: "page", name: "MacroPan", component: MacroPan,
    defaultProps: {
      src: "demo/ft_sup.png", cssW: 1200, cssH: 2387, line: { y: 1142.5, x0: 150, x1: 600 }, s: 4, panFrames: 130, roll: -2.6,
      marks: [{ rects: [[249.2, 1132.5, 444.1, 20]], at: 34, dur: 80 }],
    },
    durationInFrames: 140, thumbFrame: 120, stripFrames: [0, 6, 14, 30, 50, 70, 100, 130],
    ref: "Farrell PG4 macro + shallow DOF + lateral pan (CC 17:28.8, AR 2:25.2; GF @13:50.8) + HL2 soft marker #F4D086 (CC 14:10.9)",
    when: "One sentence that carries the beat ('a new park opened on the site'): read it in macro, the marker following the eye.",
    props: "src/cssW/cssH, clip?, line {y, x0, x1}, s, panFrames, roll, rack, marks? Mark[], markColour",
    twist: "the whole shot is the macro (no wide), rack-focus entry, the marker paced with the pan",
    sfx: [],
    axes: { geometry: "extreme macro, razor DOF", entry: "rack focus", layout: "one line, lateral pan", accent: "soft Farrell marker" },
  },
  {
    family: "page", name: "ParagraphFocus", component: ParagraphFocus,
    defaultProps: {
      src: "demo/wiki.png", cssW: 1200, cssH: 6000, para: [258, 838, 620, 942], fromY: 380, cx: 440, s: 2.3, liftAt: 36,
      bars: [{ rects: [[265, 870.5, 338.5, 15]], at: 62, dur: 20 }],
    },
    durationInFrames: 140, thumbFrame: 125, stripFrames: [0, 4, 10, 20, 36, 44, 56, 80, 125],
    ref: "Dashcam Vol.3 E4 scroll @0:08.0-0:14.4 + VV §6 DOF + Nocturn CP2 eased settle (urban 10:59.5)",
    when: "A long article where one paragraph is the finding (a settlement, a ruling, a statement); optional soften on 'never made public'.",
    props: "src/cssW/cssH, x1?, para [x0,y0,x1,y1], fromY, cx, s, tau, liftAt, bars? Mark[], softenAt?",
    twist: "cut in mid-scroll; the paragraph lifts off the page with a red side rule while the page falls back",
    sfx: [],
    axes: { geometry: "lifted block over dimmed page", entry: "mid-scroll settle", layout: "one paragraph", accent: "red side rule (+ bar)" },
  },
  {
    family: "page", name: "DocScan", component: DocScan,
    defaultProps: {
      pages: [
        { src: "demo/wiki.png", cssW: 1200, cssH: 6000, crop: [250, 1000, 960, 2000], x: -560, y: 0, w: 900, rot: -3 },
        { src: "demo/pg_tt15.png", cssW: 1600, cssH: 2000, crop: [240, 1380, 1040, 2000], x: 520, y: 40, w: 900, rot: 2.5 },
      ],
      cam0: { x: -560, y: -60, z: 1.05 }, moves: [{ at: 40, d: 40, x: 520, y: -50, z: 1.7 }],
      ruler: { page: 1, r: [248, 1604, 775, 22], at: 84 }, count: { to: 15, at: 92, suffix: " MIN" },
    },
    durationInFrames: 150, thumbFrame: 140, stripFrames: [0, 2, 4, 20, 50, 70, 86, 96, 140],
    ref: "Farrell evidence A7 documents on a lit surface (GR 8:33, CC 9:40 switch-on flicker) + DD V1 E12 camera moves + Farrell R9 roll-up",
    when: "Official reports / PDFs / tables: travel from the cover to the page, then rule off the one row that matters (optionally count it).",
    props: "pages {src,cssW,cssH,crop,x,y,w,rot}[], cam0 {x,y,z}, moves {at,d,x,y,z}[], ruler? {page, r, at}, count? {to, at, dur, suffix}, bars? {page, marks}, cap (count 120)",
    twist: "documents seen at a reading angle on a desk; a reading-guide band instead of a highlighter",
    sfx: [{ event: "title_wall_move", at: 40, note: "camera travel" }],
    axes: { geometry: "pitched desk plane, several pages", entry: "lamp flicker on", layout: "page to page", accent: "ruler band + roll-up" },
  },
  {
    family: "page", name: "PinnedLines", component: PinnedLines,
    defaultProps: {
      src: "demo/ft_high.png", cssW: 1200, cssH: 4392, crop: [30, 1000, 800, 1330], wide: 1.95,
      lines: [{ rects: [[139.8, 1045.6, 575.7, 20], [56, 1071.2, 41.3, 20]], at: 56, dur: 28, s: 2.4 }, { rects: [[56, 1263.1, 501, 20]], at: 116, dur: 24, s: 2.4 }],
    },
    durationInFrames: 170, thumbFrame: 160, stripFrames: [0, 10, 30, 44, 60, 84, 104, 124, 160],
    ref: "Dashcam Vol.3 E4 red multiply bars (bar 0:10.0, 0.3-0.5 s early) + Nocturn CP4 pull-out reveal (psy 23:28.0) + D1 E12 pushpins",
    when: "A ruling / coroner's finding read in several lines: the page never moves, the camera tilts down to each line as it is quoted.",
    props: "src/cssW/cssH, crop [x0,y0,x1,y1] (the pinned sheet), wide (scale for the whole sheet), lines (Mark & {s})[], softenAt?",
    twist: "the camera pitches a few degrees on each move (a tilt, not a scroll); the sheet is held by four pins",
    sfx: [],
    axes: { geometry: "sheet pinned to a dark wall", entry: "pull-out reveal", layout: "whole sheet -> line -> line", accent: "red bars + pins" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
