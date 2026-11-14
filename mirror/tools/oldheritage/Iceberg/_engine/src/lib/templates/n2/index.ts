// Family "n2" (algrow-2 channel devices). Spec: Disasters2/NEW_CHANNEL_STYLE.md. All timings asserted in ../iceberg/rules_ic.ts.
import type { VariantDef } from "../../core";
import { DateType_N2, NameTag_N2, PageRise_N2, SonarMap_N2, RawSub_N2, DepthCut_N2, Shot } from "./n2";
import React from "react";

const F = "n2";
const w = (t: string, at: number, end: number) => ({ t, at, end });
export const variants: VariantDef[] = [
  { family: F, name: "DateType_N2", component: DateType_N2, durationInFrames: 180, thumbFrame: 150, defaultProps: { dur: 180, place: [w("COBB", 6, 14), w("PARKWAY,", 14, 26), w("GEORGIA", 26, 38)], date: [w("THURSDAY,", 60, 76), w("7", 78, 84), w("APRIL", 84, 96), w("2022", 96, 120)], coords: "34.013° N   84.599° W" },
    ref: "Abyssal STUDY §E2 @0:42.62-0:45.03 (typed as spoken ~18 char/s, caret blinks 0.5 s, 0.85 s fade)", when: "Case start: place + date, typed on the spoken words.", props: "dur, date/place [{t, at, end}], coords",
    twist: "left lockup in Archivo (not VCR), thin amber caret, mono coordinates, corner shade instead of a blur box", sfx: [{ event: "n2_type", at: 6 }], axes: { geometry: "left lockup", entry: "typed on the words", layout: "3 lines", accent: "amber caret" } },
  { family: F, name: "NameTag_N2", component: NameTag_N2, durationInFrames: 90, thumbFrame: 40, defaultProps: { dur: 90, name: "Corey Robertson", role: "The pilot" },
    ref: "VV26 name type-on (refs/vv_coldcases/frames/name_typeon_54.6.jpg) timing; OWNER_TASTE name tag 2.1-2.9 s", when: "First mention of a key person only.", props: "dur, name, role",
    axes: { geometry: "rule + 2 lines", entry: "rule grows, name slides out of it", layout: "lower left", accent: "amber rule" } },
  { family: F, name: "PageRise_N2", component: PageRise_N2, durationInFrames: 180, thumbFrame: 120, defaultProps: { dur: 180, src: "demo/pg_wiki_ex.png", imgW: 1020, imgH: 370, focusY: 185, boxes: [{ x0: 60, y0: 170, x1: 620, y1: 202, at: 50, end: 95 }], bg: "demo/clip_park.mp4" },
    ref: "Abyssal STUDY §E5 @19:50.60-20:00.4 (rise 1.3 s ease-out, drift -0.2 %H/s, marker with the words); VV page line focus (refs/vv_coldcases/frames/page_slide_highlight_583.0.jpg)", when: "A real report/article line the VO quotes or depends on. 4-8 s.", props: "dur, src, imgW, imgH, focusY, boxes, bg",
    sfx: [{ event: "n2_page", at: 0 }], axes: { geometry: "flat excerpt card", entry: "rise from below", layout: "centre", accent: "amber marker" } },
  { family: F, name: "SonarMap_N2", component: SonarMap_N2, durationInFrames: 120, thumbFrame: 80, defaultProps: { dur: 120, src: "demo/mapstill.png", pin: [0.55, 0.48], place: "Cobb Parkway", coords: "34.013° N   84.599° W" },
    ref: "VV26 snap-zoom map (refs/vv_coldcases/frames/map_pin_485.6.jpg: desaturated satellite + pin); D1 E10 pin + leader", when: "A precisely named place the footage does not show. 3-5 s.", props: "dur, src, pin [x,y] 0..1, place, coords",
    twist: "cold duotone instead of B/W, sonar ping instead of a red dot/box", sfx: [{ event: "n2_map", at: 14 }], axes: { geometry: "satellite", entry: "snap zoom", layout: "pin + label", accent: "amber ping" } },
  { family: F, name: "RawSub_N2", component: RawSub_N2, durationInFrames: 90, thumbFrame: 30, defaultProps: { lines: [{ t: "Oh my God, is that a plane?", at: 6, end: 50, who: "driver" }, { t: "It's coming down!", at: 52, end: 86, who: "driver" }] },
    ref: "Nocturn raw captions (FINDINGS_nocturnA); Abyssal §I11 (phrase on/off)", when: "Every raw with speech (genuine clip sound only).", props: "lines [{t, at, end, who, tr}]",
    axes: { geometry: "centre bottom line", entry: "3 f fade per phrase", layout: "bottom", accent: "amber speaker tag" } },
  { family: F, name: "DepthCut_N2", component: (p: { a: string; b: string; cut: number }) => React.createElement(DepthCut_N2, { cut: p.cut, a: React.createElement(Shot, { src: p.a }), b: React.createElement(Shot, { src: p.b }) }), durationInFrames: 60, thumbFrame: 30,
    defaultProps: { a: "demo/clip_party.mp4", b: "demo/clip_park.mp4", cut: 30 },
    ref: "Smoothness_Guide §5 exposure flash (ramp, peak on the cut, decay); Abyssal glitch-tear role (card exits, clip entries) re-skinned as water refraction", when: "Chart -> footage, page -> footage, section turns. <= 3 per minute.", props: "a, b nodes, cut, len",
    sfx: [{ event: "n2_cut", at: 26 }], axes: { geometry: "full frame ripple", entry: "14 f refraction + cold lift", layout: "-", accent: "ice light" } },
];
