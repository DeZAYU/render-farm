// Family "evidence": multi-source evidence scenes (several pages / photos in one camera space). All frames LOCAL; items land on their nouns.
import type { VariantDef } from "../../core";
import { CitationSheet } from "./CitationSheet";
import { ClaimSplit } from "./ClaimSplit";
import { Corkboard } from "./Corkboard";
import { DeskSpread } from "./DeskSpread";
import { StackFlyThrough } from "./StackFlyThrough";
import { TiltedWall } from "./TiltedWall";
import { SplitCompare } from "./SplitCompare";

const TILES = ["02", "03", "04", "05", "07", "08", "09", "10", "11", "12"].map((n) => `demo/tile_${n}.jpg`).concat(["demo/ken_1872.png", "demo/ken_1908.png"]);
export const variants: VariantDef[] = [
  {
    family: "evidence", name: "Corkboard", component: Corkboard,
    defaultProps: {
      board: { src: "demo/cork.jpg", w: 3000, h: 1900 },
      items: [
        { kind: "page", src: "demo/pg_amcham_ex.png", cssW: 615, cssH: 220, x: 2420, y: 420, w: 880, rot: 2.2, at: -1 },
        { kind: "page", src: "demo/pg_wiki_ex.png", cssW: 510, cssH: 185, x: 1270, y: 800, w: 1260, rot: -1.6, at: 0,
          bars: [{ rects: [[9, 136.5, 448, 17], [9, 162.5, 166.5, 17]], at: 24, dur: 34 }, { rects: [[80, 110.5, 188.5, 17]], at: 64, dur: 14 }] },
        { kind: "polaroid", src: "demo/ph_rocaf.jpg", cssW: 2400, cssH: 1350, x: 2250, y: 1330, w: 820, rot: 3.2, at: 76, caption: { text: "Search team,", red: "day two", at: 100 } },
      ],
      strings: [{ a: 1, b: 0, at: 8 }, { a: 1, b: 2, at: 80 }],
      cam0: { x: 1280, y: 805, z: 1.3 },
      moves: [{ at: 70, d: 34, x: 2250, y: 1330, z: 1.3 }, { at: 128, d: 40, x: 1580, y: 960, z: 0.68 }],
    },
    durationInFrames: 190, thumbFrame: 185, stripFrames: [0, 5, 40, 76, 82, 90, 110, 140, 185],
    ref: "Dashcam Vol.1 E12 corkboard @14:44.4 (884.4-902.7) + D1 E9 red bar; wp3 sec_B Board @ abs 4937, sec_C Cork @ abs 7377",
    when: "Several sources that add up to one point (reports + a photo), or 'what is left today'. 6-8 s; camera visits 2-3 items, ends on the whole board.",
    props: "board {src,w,h}, items EvItem[] (kind page/photo/polaroid, src, cssW/cssH, x,y,w,rot, at, bars?, caption? {text, red, at, cap (42)}), strings {a,b,at}[], cam0 {x,y,z}, moves {at,d,x,y,z}[]; keep the final zoom >= 0.67 so captions stay >= 28 px",
    twist: "real excerpts with DD red bars inside the board; the polaroid margin carries a Dashcam-label caption whose red word lands on the VO",
    sfx: [{ event: "title_wall_move", at: 70, note: "each camera move (anchor = move.at)" }, { event: "title_wall_move", at: 128 }],
    axes: { geometry: "flat cork plane, pinned items", entry: "fade 10 f + 1.04 settle per item", layout: "scattered board + red string", accent: "red pins / string / bars" },
  },
  {
    family: "evidence", name: "DeskSpread", component: DeskSpread,
    defaultProps: {
      items: [
        { kind: "photo", src: "demo/voa_fire_still.png", cssW: 1300, cssH: 730, x: -520, y: -170, w: 640, rot: -4, at: 4 },
        { kind: "page", src: "demo/pg_wiki_ex.png", cssW: 510, cssH: 185, x: 360, y: -250, w: 760, rot: 3, at: 16 },
        { kind: "polaroid", src: "demo/ph_ma_b.jpg", cssW: 2400, cssH: 1714, x: 480, y: 240, w: 500, rot: 5, at: 30 },
        { kind: "page", src: "demo/cb_ruins_head.png", cssW: 740, cssH: 158, x: -400, y: 300, w: 820, rot: -2.5, at: 42 },
      ],
      cam0: { x: 0, y: 20, z: 0.9 }, pull: 0.015, focus: { i: 1, at: 80, z: 1.9, d: 40 },
    },
    durationInFrames: 150, thumbFrame: 145, stripFrames: [0, 6, 14, 22, 36, 60, 84, 96, 145],
    ref: "Farrell evidence A7 objects on a lit surface (GR 8:33 / 9:06, CC 9:40) + B4 lift-out (OF 4:29.5) + B2 push burst (SL 8:34)",
    when: "'Reports came in from everywhere': several sources pile up, then ONE of them is the point. 4-6 s.",
    props: "items EvItem[] (world px around 0,0; at = landing frame), cam0 {x,y,z}, pull (per s), focus {i, at, z, d} (lift + punch-in), dealFrames",
    twist: "fan-in without pins: prints slide in with a landing shadow; the key print lifts off the dimmed desk before the punch",
    sfx: [{ event: "title_wall_move", at: 80, note: "the punch-in (anchor = focus.at)" }],
    axes: { geometry: "top-down desk, loose prints", entry: "dealt in from off-frame", layout: "overlapping fan", accent: "lift-out + dim" },
  },
  {
    family: "evidence", name: "StackFlyThrough", component: StackFlyThrough,
    defaultProps: {
      items: [
        { kind: "page", src: "demo/cb_ruins_head.png", cssW: 740, cssH: 158, w: 1300, at: 0, x: -50, y: -10, rot: -1.8 },
        { kind: "page", src: "demo/pg_amcham_ex.png", cssW: 615, cssH: 220, w: 1250, at: 34, x: 70, y: 20, rot: 1.4 },
        { kind: "page", src: "demo/pg_wiki_ex.png", cssW: 510, cssH: 185, w: 1250, at: 64, x: -40, y: -20, rot: -1 },
        { kind: "photo", src: "demo/cb_sc_print.png", cssW: 1890, cssH: 1580, w: 820, at: 94, x: 30, y: 0, rot: 1.2 },
      ],
      travel: 16,
    },
    durationInFrames: 140, thumbFrame: 130, stripFrames: [0, 20, 24, 28, 34, 52, 60, 94, 130],
    ref: "Farrell B3 headline montage (GF 13:50.8) + Abyssal iceberg level fly-through (zoom x(1+2.2u^2) while fading)",
    when: "'It was everywhere' / several outlets said the same thing: one source per ~1 s, landing on each outlet's word.",
    props: "items StackItem[] (EvItem without world x/y: x,y = parallax offset; at = arrival frame), travel (frames), gap, bg",
    twist: "one continuous z-dolly through a loose stack instead of hard cuts; the waiting sources are visible in depth (defocused, darker)",
    sfx: [{ event: "zoom_boom", at: 18, note: "optional, first fly-through (anchor = items[1].at - travel)" }],
    axes: { geometry: "z-stack in depth", entry: "fly-through each item", layout: "one item at a time", accent: "depth blur / darkening" },
  },
  {
    family: "evidence", name: "TiltedWall", component: TiltedWall,
    defaultProps: { tiles: TILES, cols: 4, yaw: -24, pitch: 8, panFrom: -260, panTo: 200, focus: { i: 6, at: 66, dive: 96, d: 30 } },
    durationInFrames: 127, thumbFrame: 80, stripFrames: [0, 4, 10, 24, 66, 96, 108, 116, 126],
    ref: "Dashcam Vol.1 E13 20-tile grid @0:54.4-1:04.4 (flicker on, dive into tile) + Nocturn CP7 tilted videos grid with DOF (worst 3:11.0, 12:09)",
    when: "A body of material (many clips / photos / uploads) and one of them is our story: ends full-frame on that tile -> cut to it.",
    props: "tiles media[], cols, tileW/tileH/gap, yaw/pitch, panFrom/panTo, appear, focus {i, at (red frame), dive, d}",
    twist: "the dive squares the plane to the lens and lands exactly on the tile, so the next shot can be that picture",
    sfx: [{ event: "zoom_boom", at: 96, note: "anchor = focus.dive" }],
    axes: { geometry: "3-D tilted grid wall", entry: "random tile flicker", layout: "grid", accent: "red tile frame + dive" },
  },
  {
    family: "evidence", name: "SplitCompare", component: SplitCompare,
    defaultProps: {
      left: { source: "The operator:", claim: "Equipment fault", glyph: "bolt", at: 4 },
      right: { source: "The inspectors:", claim: "Days of heavy rain", glyph: "cloud", at: 44, credit: "official report" },
      neqAt: 78, loser: { side: "left", at: 110 },
    },
    durationInFrames: 160, thumbFrame: 150, stripFrames: [0, 6, 16, 30, 44, 56, 80, 112, 150],
    ref: "Dashcam device family (word-by-word labels, red key mark) + VV §11 world-space infographic @3:28.0; c02-08 legend intent 'two claims side by side, then one wins'",
    when: "Two parties disagree about why / what happened (operator vs officials, staff vs witness). ≠ on 'didn't agree'; the losing side greys on 'definitely wasn't'.",
    props: "left/right {source, claim, glyph?, at, credit?}, neqAt?, loser? {side, at}, gap, cap (claim 64, auto-fit floor 40), labelCap (source 38), subCap (credit 28)",
    twist: "one camera on one plane: opens on the first claim, settles wide when the second lands, leans to the side that stands",
    sfx: [{ event: "title_wall_move", at: 44, note: "camera widens (anchor = second claim)" }],
    axes: { geometry: "two-column world plane", entry: "label rise + glyph draw per side", layout: "side by side, divider", accent: "red ≠ + loser greys" },
  },
  {
    family: "evidence", name: "CitationSheet", component: CitationSheet,
    defaultProps: {
      title: "INSPECTION NOTES",
      rows: [{ text: "INSPECTION: OVERDUE", at: 4 }, { text: "SIGNAGE: MISSING", at: 34 }, { text: "STAFF: NOT TRAINED", at: 64 }, { text: "LOGBOOK: INCOMPLETE", at: 94 }],
      pullAt: 124,
    },
    durationInFrames: 175, thumbFrame: 170, stripFrames: [0, 6, 14, 36, 50, 66, 96, 130, 170],
    ref: "Dashcam Vol.1 E12 item timing (884.4-902.7: 10 f, 1.04 settle) + VV §11 phase camera @3:28.0; Courier Prime typewriter strips (FONTS.md)",
    when: "A list of violations / citations / findings, one per phrase; ends on the whole list. Rows can also be cropped source excerpts.",
    props: "rows {text | src+cssW+cssH+crop, at}[], title?, pullAt?, paper, cap (row 40), labelCap (heading 44); keep <= 6 rows so the pull-back stays >= 28 px cap",
    twist: "each line gets a red margin tick as it lands; the camera steps down the sheet line by line",
    sfx: [{ event: "title_wall_move", at: 124, note: "pull back" }],
    axes: { geometry: "ruled sheet, vertical list", entry: "strip settle + tick draw", layout: "numbered rows", accent: "red margin ticks" },
  },
  {
    family: "evidence", name: "ClaimSplit", component: ClaimSplit,
    defaultProps: {
      left: { title: "Claimants", at: 4, cards: [{ text: "The family", sub: "filed the suit", at: 18 }, { text: "Six other visitors", at: 36 }] },
      right: { title: "Respondents", at: 60, cards: [{ text: "The hotel", at: 72 }, { text: "The ride builder", at: 86 }, { text: "12+ contractors", at: 100 }] },
      links: [{ l: 0, r: 0, at: 116 }, { l: 0, r: 2, at: 126 }], pullAt: 140,
    },
    durationInFrames: 180, thumbFrame: 170, stripFrames: [0, 8, 20, 40, 60, 74, 104, 128, 170],
    ref: "Dashcam Vol.1 E12 (pins, red string 10 f, items on nouns) + VV §11 world camera @3:28.0",
    when: "Who is on which side of a lawsuit / dispute (plaintiffs vs defendants), several parties each.",
    props: "left/right {title, at, cards {text, sub?, at}[]}, links {l, r, at}[], pullAt?, cap (heading 56), labelCap (card 36), subCap (card sub 32); settled zoom 0.9 keeps all >= 28 px on screen",
    twist: "two pinned columns on a slate wall; strings cross the gap between opposing cards",
    sfx: [{ event: "title_wall_move", at: 60, note: "camera widens to both sides" }],
    axes: { geometry: "two card columns on slate", entry: "cards drop + pin", layout: "side vs side lists", accent: "red underline headers + strings" },
  },
];
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
