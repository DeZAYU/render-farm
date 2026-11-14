// Family "iceberg" (IC, algrow-2 channel): the chart the whole video travels down. Data-driven: levels + beats. Spec: Disasters2/NEW_CHANNEL_STYLE.md.
import type { VariantDef } from "../../core";
import { IcebergChart_IC } from "./IcebergChart_IC";
import { D2_LEVELS } from "./d2_levels";
import { ChartIntro_IC3, EntryCard_IC3, LevelCard_IC3 } from "./cine";
import { ChartIntro_AB, EntryCard_AB, LevelCard_AB, ENTRIES_D2 } from "./abyss";
export * from "./cine";
export * from "./abyss";

const F = "iceberg";
export const variants: VariantDef[] = [
  {
    family: F, name: "IcebergChart_IC", component: IcebergChart_IC, durationInFrames: 560, thumbFrame: 150, stripFrames: [0, 30, 60, 90, 130, 200, 260, 330, 420, 520],
    defaultProps: { levels: D2_LEVELS, dur: 560, title: { line1: "VIDEOS BEFORE", line2: "DISASTERS", sub: "VOLUME 2" },
      beats: [{ k: "reveal", at: 0 }, { k: "level", at: 190 }, { k: "case", at: 330, id: "c02" }].map((b) => (b.k === "level" ? { ...b, level: 0 } : b)) },
    ref: "owner reference refs/owner_iceberg_chart_ref.webp (bands, bright bars, condensed caps names, light -> navy water); refs/iceberg/ICEBERG_MOTION.md §1 (reveal stagger 0.26 s/level, dive/sink, 45 % dim, fly-through x(1+2.2u^2)); Abyssal STUDY §E1 @0:36.55-0:40.0 (level card hold 1.17 s, zoom-through 0.40 s + ease-out landing)",
    when: "Intro (reveal), every level change (level beat), every case start (case beat: the name lifts into the case title). The video's spine.",
    props: "plate (layout contract), levels, beats [{k:'reveal'|'level'|'case', at, level|id}], title, dur, namePx, snow",
    twist: "Real chart (not a photo card): one plate, live type, a camera that sinks with motion blur, a depth gauge, and the case title is the chart name itself lifting off its band (no separate title card).",
    sfx: [{ event: "ic_reveal", at: 18 }, { event: "ic_descend", at: 190 }, { event: "ic_level_through", at: 258 }, { event: "ic_lift", at: 358 }],
    axes: { geometry: "iceberg chart", entry: "bars draw from centre, names rise", layout: "7 bands", accent: "amber marker" },
  },
  // IC3 (v3, 2026-10-26): Abyssal grammar on the photoreal Blender berg (Disasters2/ICEBERG_SPEC_ABYSSAL.md). Plates: Disasters2 public/ic3.
  { family: F, name: "LevelCard_IC3", component: LevelCard_IC3, durationInFrames: 150, thumbFrame: 60, stripFrames: [10, 30, 50, 74, 78, 82, 90, 120],
    defaultProps: { dur: 150, level: 1 }, ref: "Abyssal CCTV Iceberg Vol 4 0:30-0:36, 1358 s, 1886 s (black 0.8 s, fade 0.5 s, Level N 1.1 s on the waterline, push 0.35 s with zoom blur, lands at depth)",
    when: "Every level change.", props: "dur, level (1-7), plates", twist: "depth = camera position on ONE photoreal berg", sfx: [{ event: "level_dive", at: 72 }],
    axes: { geometry: "iceberg photo", entry: "fade from black", layout: "centred on the waterline", accent: "none" } },
  { family: F, name: "EntryCard_IC3", component: EntryCard_IC3, durationInFrames: 120, thumbFrame: 80, stripFrames: [10, 25, 34, 38, 42, 80, 110],
    defaultProps: { dur: 120, level: 1, title: ["THE PLANE", "IN THE MEDIAN"] }, ref: "Abyssal 0:33-0:36, 1886 s, 2402 s (black 0.7 s, depth close-up, ice-cyan glitch-typed title 0.3 s, hold 2.5 s, glitch cut)",
    when: "Every entry start (also right after a level card).", props: "dur, level, title lines, plates", twist: "close-up at the CURRENT depth", sfx: [{ event: "glitch", at: 33 }, { event: "case_name_lift", at: 33 }],
    axes: { geometry: "iceberg photo", entry: "glitch-type", layout: "upper third centre", accent: "ice cyan glow" } },
  { family: F, name: "ChartIntro_IC3", component: ChartIntro_IC3, durationInFrames: 100, thumbFrame: 60, stripFrames: [2, 10, 30, 60, 95],
    defaultProps: { dur: 100, levels: D2_LEVELS }, ref: "Abyssal 0:12-0:15 (static dark wide photo, thin white bars, typed names two per row, deeper names blurred)",
    when: "Once, in the intro, on the line that explains the format.", props: "dur, levels, plates, clearLevels", twist: "static and brief: no zooms", sfx: [{ event: "glitch", at: 0 }],
    axes: { geometry: "iceberg photo", entry: "glitch in", layout: "7 bands", accent: "none" } },
  // AB (v3 owner fix 2026-10-26 "not high-quality 3D / angle super bad"): photoreal Blender berg with an ice SKULL under the water, low camera at the
  // sea surface, REAL rendered camera push per level (Disasters2/art/src/build_berg3.py). Plates: Disasters2 public/ice3.
  { family: F, name: "ChartIntro_AB", component: ChartIntro_AB, durationInFrames: 90, thumbFrame: 60, stripFrames: [2, 8, 20, 40, 85],
    defaultProps: { dur: 90 }, ref: "Abyssal CCTV Iceberg Vol 4 0:12-0:15 (refs/abyssal_v4/f_13.5.jpg: dark wide photo, thin white bars, two names per row, deeper names blurred)",
    when: "Once, in the intro, on the line that explains the format.", props: "dur (75-120), levels (default D2_LEVELS), plates, blurFrom (level index that starts blurring, 2), px (31)",
    twist: "the skull is faintly visible under the bars; Special Elite typewriter names", sfx: [{ event: "typewriter_burst", at: 4 }],
    axes: { geometry: "iceberg photo", entry: "fade + type", layout: "7 bands", accent: "none" } },
  { family: F, name: "LevelCard_AB", component: LevelCard_AB, durationInFrames: 120, thumbFrame: 60, stripFrames: [20, 30, 45, 72, 78, 82, 86, 100],
    defaultProps: { dur: 120, level: 4 }, ref: "Abyssal 0:30-0:33, 1358 s, 1886 s (black 0.8 s, fade 0.5 s, Level N 1.1 s on the waterline, push ~0.35 s with blur, lands at depth)",
    when: "Every level change.", props: "dur (98-210), level 1-7, plates, label, holdUntil (72)", twist: "real Blender dolly with Cycles motion blur into the level's depth on the skull berg",
    sfx: [{ event: "typewriter_keys", at: 26 }, { event: "level_whoosh", at: 70 }, { event: "deep_boom", at: 86 }],
    axes: { geometry: "iceberg photo", entry: "fade from black", layout: "centred on the waterline", accent: "none" } },
  { family: F, name: "EntryCard_AB", component: EntryCard_AB, durationInFrames: 130, thumbFrame: 80, stripFrames: [10, 25, 34, 38, 44, 80, 124, 128],
    defaultProps: { dur: 130, level: 5, lines: ENTRIES_D2[0].lines }, ref: "Abyssal 0:33-0:36, 1886 s, 2402 s (black 0.7 s, depth close-up, ice-cyan glitch-typed title 0.3 s, hold 2.5 s, glitch cut)",
    when: "Every entry start (also right after a level card).", props: "dur (119-170), level, lines | title, plates, out (glitch frames, 8), seed; follow with GlitchIn_AB on the footage",
    twist: "close-up at the CURRENT depth of the skull berg; Syncopate wide caps glow", sfx: [{ event: "glitch_type", at: 33 }, { event: "glitch_out", at: 122 }],
    axes: { geometry: "iceberg photo", entry: "glitch-type", layout: "upper third centre", accent: "ice cyan glow" } },
];
