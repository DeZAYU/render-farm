// n2dev batch 2: info-animation, counters, timelines, 2D mechanism diagrams, social.
import type { VariantDef } from "../../core";
import { BuildOnWords_D, ClockSweep_D, CountUp_D, DayStrip_D, IconGrid_D, RecedeNumber_D, RollUp_D, RulerTicker_D, YearScroll_D } from "./info";
import { Cutaway_D, ExplodedPart_D, ScaleCompare_D, StructureSection_D, type Part } from "./diagram";
import { CommentStack_D, PostCard_D, WatchPage_D } from "./social";

const F = "n2dev";
const ax = (geometry: string, entry: string, layout: string, accent: string) => ({ geometry, entry, layout, accent });
const PLATE = "src?, from?, dim?, blur? (dimmed + blurred behind)";
const CROWD = "demo/clip_crowd.mp4", PARTY = "demo/clip_party.mp4", FIRE = "demo/clip_fire.mp4";

// demo escalator (1920x1080 px): truss shell, step chain, comb plate (hot)
const stairs = (() => { let d = "M400 860"; for (let i = 0; i < 14; i++) { const x = 400 + i * 80, y = 860 - i * 38; d += ` L${x + 80} ${y} L${x + 80} ${y - 38}`; } return d; })();
const ESC_SHELL = ["M300 900 L1420 370 L1660 370 L1660 450 L540 980 L300 980 Z"];
const ESC_INNER: Part[] = [
  { d: stairs, fill: false, at: 44, label: "STEP BAND", lp: [880, 640, 760, 760] },
  { d: "M420 930 L1420 455 Q1450 440 1470 455 L1470 470 L470 950 Q440 960 420 930 Z", at: 52, label: "DRIVE CHAIN", lp: [1000, 720, 1120, 820] },
  { d: "M1560 370 L1660 370 L1660 392 L1560 392 Z", at: 60, hot: true, label: "COMB PLATE", lp: [1610, 380, 1700, 250] },
];
const COMB: Part[] = [
  { d: "M760 560 L1160 560 L1160 600 L760 600 Z", label: "BASE FRAME", lp: [960, 600, 760, 760], dy: 120 },
  { d: "M780 520 L1140 520 L1140 560 L780 560 Z M790 520 L790 490 M820 520 L820 490 M850 520 L850 490 M880 520 L880 490 M910 520 L910 490 M940 520 L940 490 M970 520 L970 490 M1000 520 L1000 490 M1030 520 L1030 490 M1060 520 L1060 490 M1090 520 L1090 490 M1120 520 L1120 490", hot: true, label: "COMB SEGMENT", lp: [1140, 520, 1320, 420], dy: -40 },
  { d: "M820 470 L840 470 L840 430 L820 430 Z M1080 470 L1100 470 L1100 430 L1080 430 Z", label: "BOLTS x2", lp: [1100, 450, 1300, 300], dy: -170 },
  { d: "M700 610 L1220 610 L1220 640 L700 640 Z", label: "LANDING PLATE", lp: [700, 625, 560, 820], dy: 220 },
];

export const batch2: VariantDef[] = [
  { family: F, name: "BuildOnWords", component: BuildOnWords_D, durationInFrames: 135, thumbFrame: 110,
    defaultProps: { dur: 135, src: CROWD, items: [{ icon: "cloud", t: "powder", at: 10 }, { icon: "bolt", t: "spark", at: 38 }, { icon: "flame", t: "flash fire", at: 66 }] },
    ref: "Farrell info-animation (BuildOnWords): icons + words building on the VO", when: "A cause chain or a list the VO counts off (\"powder, a spark, and a flash fire\").",
    props: `dur, items [{icon (core/kits/glyphs name), t, at}], joiner, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 8, note: "-4 dB" }], axes: ax("icon row", "draw-on per word", "centre row", "cyan newest") },
  { family: F, name: "CountUp", component: CountUp_D, durationInFrames: 120, thumbFrame: 100,
    defaultProps: { dur: 120, src: FIRE, to: 508, label: "PEOPLE INJURED", at: 8, len: 44 },
    ref: "Farrell CountUp (dignified numbers)", when: "A count: injured, cost, people (\"508 people were injured\").",
    props: `dur, to, from, at, len>=18, prefix, suffix, label, dec, ${PLATE}`,
    sfx: [{ event: "sub_pulse", at: 8, note: "on the grim number only" }], axes: ax("big mono number", "eased count", "centre", "cyan rule") },
  { family: F, name: "IconGrid", component: IconGrid_D, durationInFrames: 135, thumbFrame: 110,
    defaultProps: { dur: 135, total: 100, mark: 41, cols: 20, label: "IN CRITICAL CONDITION (OF 100)" },
    ref: "Farrell IconGrid toll (library toll family), re-skinned ice/cyan, no red", when: "A share / toll (\"41 of every 100\", \"15 of the 508 died\").",
    props: `dur, total<=400, mark, cols, at, len, label, icon, ${PLATE}`,
    sfx: [{ event: "silent", at: 0, note: "music drop; dignified" }], axes: ax("icon grid", "fill in order", "centre block", "cyan marked") },
  { family: F, name: "RollUp", component: RollUp_D, durationInFrames: 105, thumbFrame: 90,
    defaultProps: { dur: 105, value: 1250, suffix: "°C", label: "PEAK TEMPERATURE" },
    ref: "Library stat/RollUp (odometer), channel look", when: "A measured value (\"over 1,000 degrees\", \"120 km/h\").",
    props: `dur, value, at, len>=24, suffix, label, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 4 }], axes: ax("odometer", "roll + settle", "centre", "cyan rails") },
  { family: F, name: "RecedeNumber", component: RecedeNumber_D, durationInFrames: 105, thumbFrame: 80,
    defaultProps: { dur: 105, src: PARTY, text: "15", label: "LIVES LOST" },
    ref: "Library stat/RecedeNumber + PEAK_V5 'number carved in type, camera pushing through it' (2D)", when: "One heavy number as its own beat (deaths).",
    props: `dur, text, label, at, ${PLATE}`,
    sfx: [{ event: "sub_pulse", at: 0 }], axes: ax("extruded digits", "recede from camera", "centre", "fog") },
  { family: F, name: "ClockSweep", component: ClockSweep_D, durationInFrames: 120, thumbFrame: 100,
    defaultProps: { dur: 120, m0: 0, m1: 20, label: "20 MINUTES", clock0: "20:32  ->  20:52" },
    ref: "Library stat/ClockSweep", when: "A duration (\"within 20 minutes\", \"it took 40 minutes for help\").",
    props: `dur, m0, m1 (minutes on the dial), at, len>=30, label, clock0, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 8 }], axes: ax("clock face", "hand sweep", "centre", "cyan sector") },
  { family: F, name: "YearScroll", component: YearScroll_D, durationInFrames: 120, thumbFrame: 100,
    defaultProps: { dur: 120, y0: 2026, y1: 2005, marks: [{ year: 2005, t: "OPENED" }, { year: 2015, t: "THE FIRE" }] },
    ref: "Library timeline/YearScroll", when: "Jumping back / forward years (\"it opened in 2005\").",
    props: `dur, y0, y1, at, len>=30, marks [{year, t}], ${PLATE}`,
    sfx: [{ event: "transition_whoosh", at: 4, note: "-6 dB" }], axes: ax("year ruler", "decelerating glide", "centre needle", "amber target") },
  { family: F, name: "RulerTicker", component: RulerTicker_D, durationInFrames: 150, thumbFrame: 120,
    defaultProps: { dur: 150, m0: 20 * 60 + 25, m1: 20 * 60 + 52, events: [{ min: 20 * 60 + 32, t: "FIRST FLASH" }, { min: 20 * 60 + 40, t: "FIRST CALL" }, { min: 20 * 60 + 50, t: "CREWS ARRIVE" }] },
    ref: "Library timeline/RulerTicker", when: "A minute-by-minute sequence (\"at 8:32... by 8:50...\").",
    props: `dur, m0, m1 (minutes after midnight), events [{min, t}], at, len, pxPerMin, ${PLATE}`,
    sfx: [{ event: "silent", at: 0, note: "or a soft tick bed from the music" }], axes: ax("time ruler", "slide under needle", "centre needle", "amber passed") },
  { family: F, name: "DayStrip", component: DayStrip_D, durationInFrames: 120, thumbFrame: 100,
    defaultProps: { dur: 120, days: [{ d: "THU", sub: "25 JUN" }, { d: "FRI", sub: "26 JUN", mark: "permit issued" }, { d: "SAT", sub: "27 JUN", mark: "THE EVENT" }, { d: "SUN", sub: "28 JUN" }], from: 1, to: 2, label: "ONE DAY LATER" },
    ref: "Library timeline/DayStrip", when: "\"Two days earlier\", \"the next morning\": a day offset.",
    props: `dur, days [{d, sub, mark}], from, to (cell index), at, len>=30, label, ${PLATE}`,
    sfx: [{ event: "dissolve_whoosh", at: 12 }], axes: ax("day cells", "camera glide + arc", "row", "amber active day") },
  { family: F, name: "Cutaway", component: Cutaway_D, durationInFrames: 165, thumbFrame: 140,
    defaultProps: { dur: 165, shell: ESC_SHELL, inner: ESC_INNER, sweepAt: 30, sweepLen: 44, title: "ESCALATOR  ·  SECTION" },
    ref: "Library diagram/StructureSection + Fern 21 x-ray cutaway, 2D", when: "How it failed, when a 3D scene is overkill (\"the comb plate gave way\").",
    props: "dur, shell [svg d], inner [{d, at, hot, label, lp [x,y,lx,ly], fill}], sweepAt, sweepLen>=24, title, plate props",
    sfx: [{ event: "dissolve_whoosh", at: 30 }], axes: ax("blueprint section", "x-ray sweep", "full frame", "amber failure part") },
  { family: F, name: "ExplodedPart", component: ExplodedPart_D, durationInFrames: 150, thumbFrame: 130,
    defaultProps: { dur: 150, parts: COMB, at: 30, len: 30, title: "COMB PLATE ASSEMBLY" },
    ref: "Library diagram/ExplodedPart", when: "The parts of the thing that broke (\"two bolts held the plate\").",
    props: "dur, parts [{d, dx, dy, hot, label, lp}], at, len>=20, title, plate props",
    sfx: [{ event: "transition_whoosh", at: 30, note: "-8 dB" }], axes: ax("assembly", "staggered explode", "centre", "amber hot part") },
  { family: F, name: "ScaleCompare", component: ScaleCompare_D, durationInFrames: 135, thumbFrame: 110,
    defaultProps: { dur: 135, h: 10, what: "THE DROP", unit: "m" },
    ref: "Library diagram/ScaleCompare", when: "A height / depth against a person (\"fell 10 metres\").",
    props: "dur, h, unit, what, person (1.75), at, len>=24, plate props",
    sfx: [{ event: "dissolve_whoosh", at: 8 }], axes: ax("person vs bar", "grow + tilt down", "centre", "cyan bar") },
  { family: F, name: "StructureSection", component: StructureSection_D, durationInFrames: 135, thumbFrame: 115,
    defaultProps: { dur: 135, floors: 8, basement: 2, hot: 3, label: "3F  ·  FOOD COURT" },
    ref: "Library diagram/StructureSection", when: "Which floor / area of a building (\"on the third floor\").",
    props: "dur, floors, basement, hot (floor index, 0 = G, -1 = B1), label, at, plate props",
    sfx: [{ event: "dissolve_whoosh", at: 6 }], axes: ax("building section", "floors build up", "centre", "amber floor") },
  { family: F, name: "PostCard", component: PostCard_D, durationInFrames: 135, thumbFrame: 110,
    defaultProps: { dur: 135, handle: "taipei_nights", time: "27 Jun 2015 · 20:41", text: "Something exploded at the color party, people are running. Pray for everyone there.", media: CROWD, likes: 48200, shares: 12100 },
    ref: "Library social/PostCard, generic UI (no platform logo)", when: "A viral post / the first post about it.",
    props: "dur, handle, time, text, media?, mediaFrom, likes, shares, at, src? (backdrop; defaults to media)",
    sfx: [{ event: "page_entry", at: 6 }], axes: ax("post card", "rise", "centre", "none") },
  { family: F, name: "CommentStack", component: CommentStack_D, durationInFrames: 150, thumbFrame: 130,
    defaultProps: { dur: 150, src: PARTY, comments: [{ who: "linwei", t: "I was 20 metres from the stage. The powder just lit.", at: 8, likes: 3200 }, { who: "kaoru.t", t: "Why was nobody stopping the cannons?", at: 30, likes: 980, key: true }, { who: "anon_88", t: "My cousin is in hospital now.", at: 52, likes: 410 }, { who: "mira", t: "This should never have been allowed.", at: 74, likes: 2600 }] },
    ref: "Library social/CommentStack", when: "Public reaction, witnesses in the comments.",
    props: `dur, comments [{who, t, at, likes?, key?}] (>= 12 f apart), ${PLATE}`,
    sfx: [{ event: "silent", at: 0 }], axes: ax("comment list", "slide-in stack", "centre column", "cyan key comment") },
  { family: F, name: "WatchPage", component: WatchPage_D, durationInFrames: 120, thumbFrame: 30,
    defaultProps: { dur: 120, media: PARTY, title: "Color party stage fire (raw, 27 June)", channel: "witness upload", views: "4.1M views", date: "28 Jun 2015", at: 46, len: 46 },
    ref: "Library social/WatchPage, generic dark video page", when: "Where the clip was first uploaded, then INTO the clip (hand-off to footage).",
    props: "dur, media, mediaFrom, title, channel, views, date, at, len>=30",
    sfx: [{ event: "dissolve_whoosh", at: 46 }], axes: ax("video page", "glide into player", "page", "none") },
];
