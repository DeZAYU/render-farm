// Family "n2page" (algrow-2 pages, v3). Study: Disasters2/v3_tests/pages/PAGE_STUDY.md. Rules: ./rules_n2p.ts (asserted at render).
import type { VariantDef } from "../../core";
import { ChipLift_N2P, CutoutFade_N2P, DeskSheet_N2P, EmberLens_N2P, PageLight_N2P, SelectStrip_N2P, TitleMacro_N2P } from "./n2page";
import type { PSpan, Rect } from "./rules_n2p";

const F = "n2page";
// demo page = KTVU Cobb Parkway article (Disasters2 c02), 2560 x 4800 capture; rects measured with Disasters2/v3_tests/pages/tools/wordboxes.py
const PG = { src: "demo/pg_ktvu.png", imgW: 2560, imgH: 4800, crop: [120, 2870, 1660, 3960] as Rect };
const AA1: Rect = [769, 3225, 1485, 3262], CLIP: Rect = [290, 3281, 635, 3318], PAR: Rect = [262, 3200, 1582, 3446];
const TITLE: Rect[] = [[297, 253, 2228, 346], [296, 385, 2175, 506], [294, 517, 1144, 638]];
const two = (a: number, b: number): PSpan[] => [
  { text: "a single-engine Grumman American AA-1,", lines: [AA1], at: a },
  { text: "clipping a powerline", lines: [CLIP], at: b },
];
const axes = (geometry: string, entry: string, layout: string, accent: string) => ({ geometry, entry, layout, accent });
const PROPS = "dur, src, imgW, imgH, crop?, spans [{text, lines: Rect[], at, sweep?, keep?}], inF?, outF?";

export const variants: VariantDef[] = [
  { family: F, name: "ChipLift_N2P", component: ChipLift_N2P, durationInFrames: 150, thumbFrame: 130, stripFrames: [0, 14, 40, 96, 104, 130, 149],
    defaultProps: { dur: 150, ...PG, spans: two(14, 96) },
    ref: "Parallel Pipes 57-min Wikipedia @44:44-44:50 (phrase chip lifts, page darkens continuously, push ~1.0->1.3)", when: "THE default case page: one VO-quoted fact, 4-6 s.", props: PROPS,
    twist: "chip is a padded crisp copy with a soft shadow + amber hairline growing with the words; the previous chip eases back down when the next lifts",
    sfx: [{ event: "page_in", at: 0 }], axes: axes("lifted chip", "fade + push", "auto-framed phrase", "amber hairline") },
  { family: F, name: "SelectStrip_N2P", component: SelectStrip_N2P, durationInFrames: 120, thumbFrame: 100, stripFrames: [0, 20, 50, 70, 100, 119],
    defaultProps: { dur: 120, ...PG, strip: PAR, spans: [{ text: "a single-engine Grumman American AA-1,", lines: [AA1], at: 6, sweep: [8, 44] }, { text: "clipping a powerline", lines: [CLIP], at: 60, sweep: [62, 84] }] },
    ref: "Parallel Pipes @8:58.3-9:06 (whole page 0.4 s, hard cut to the paragraph strip on black, browser selection grows word by word)", when: "Hard-cut macro of the one sentence the VO reads. 2.5-7 s.", props: PROPS + ", strip: Rect",
    axes: axes("strip on black", "hard cut", "full-width paragraph", "selection blue") },
  { family: F, name: "CutoutFade_N2P", component: CutoutFade_N2P, durationInFrames: 100, thumbFrame: 80, stripFrames: [0, 10, 25, 45, 99],
    defaultProps: { dur: 100, ...PG, crop: [0, 0, 2560, 4800], box: [262, 230, 2260, 660], spans: [{ text: "Driver's dashcam video captures moment small plane crashes on Cobb Parkway", lines: TITLE, at: 4, sweep: [4, 20] }] },
    ref: "Parallel Pipes @0:04.0-0:05.3 (title box stays lit, the page sinks to black linearly over 1.3 s)", when: "Naming the source/article in one beat. 2.2-5 s.", props: PROPS + ", box: Rect",
    axes: axes("cut-out card", "page sinks to black", "box centred", "none") },
  { family: F, name: "TitleMacro_N2P", component: TitleMacro_N2P, durationInFrames: 96, thumbFrame: 40, stripFrames: [0, 48, 95],
    defaultProps: { dur: 96, ...PG, crop: [0, 0, 2560, 4800], spans: [{ text: "Driver's dashcam video captures moment small plane crashes on Cobb Parkway", lines: TITLE, at: 0, sweep: [0, 12] }] },
    ref: "Parallel Pipes @0:00-0:03, 6:40, 10:21 (headline macro, lateral drift, hard cuts)", when: "A 1.5-4 s headline beat between footage.", props: PROPS,
    axes: axes("headline macro", "hard cut", "full width", "none") },
  { family: F, name: "PageLight_N2P", component: PageLight_N2P, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 20, 46, 70, 120, 160, 179],
    defaultProps: { dur: 180, ...PG, crop: [120, 0, 1660, 4800], spans: two(56, 124), tilt: true },
    ref: "Farrell 'Google Maps Directions' 6:46-6:51 (tilted page, drift) + Nocturn eased-settle push (Smoothness_Guide 4.1) + Farrell wide-then-macro", when: "A light article where the reader should see it IS the article first. 5-8 s.", props: PROPS + ", tilt?",
    axes: axes("wide -> line", "wide hold + glide", "auto-framed line", "yellow marker") },
  { family: F, name: "EmberLens_N2P", component: EmberLens_N2P, durationInFrames: 165, thumbFrame: 140, stripFrames: [0, 18, 40, 100, 140, 164],
    defaultProps: { dur: 165, ...PG, spans: two(22, 100) },
    ref: "Fern Cold-War doc device 20 'document magnifier' (red bar #9C2E09 + DOF) + LEMMiNO Kryptos k_432 / k_372 (active passage white, the rest grey)", when: "Official text: reports, rulings, police statements. 4-8 s.", props: PROPS,
    twist: "no lens ring (owner: no circles); the focus band follows the phrase, the page is in dark mode", axes: axes("dark page + DOF", "fade", "focus band", "ember bar") },
  { family: F, name: "DeskSheet_N2P", component: DeskSheet_N2P, durationInFrames: 180, thumbFrame: 150, stripFrames: [0, 24, 60, 110, 150, 179],
    defaultProps: { dur: 180, ...PG, crop: [180, 2870, 1640, 3960], spans: two(40, 118) },
    ref: "Fern 'Hunt for America's Smartest Killer' @7:00-7:10 (clipping macro, slow truck, shallow DOF) and @20:25 (papers on a desk under one lamp)", when: "Archive print, letters, old reports. 5-9 s.", props: PROPS + ", marker?",
    axes: axes("3D sheet on desk", "rise", "light pool", "marker") },
];
