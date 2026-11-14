// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { CountUp_A } from "./CountUp_A";
import { FigureLine_A } from "./FigureLine_A";
import { FlowCount_A } from "./FlowCount_A";
import { FunnelCount_A } from "./FunnelCount_A";
import { StatSlide_A } from "./StatSlide_A";
import { TallyTags_A } from "./TallyTags_A";

const RULES = "Owner rules: always over the case footage (never text on black), hold >= 3 s, at most ~5 Editor A devices per video and never the same one in consecutive cases; numbers roll only between their stated values (M-069); Waterpark channel style.";

export const extra: VariantDef[] = [
  {
    family: "stat", name: "CountUp-A", component: CountUp_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 6, 12, 22, 66, 76, 130, 165],
    defaultProps: {
      media: "demo/clip_fire.mp4",
      rows: [{ value: 600, label: "FIREFIGHTERS", at: 6, prefix: "> " }, { value: 80, label: "VEHICLES", at: 66, prefix: "~ " }, { value: "3:30 PM", label: "UNDER CONTROL", at: 126, red: true }],
    },
    ref: "Farrell R9 roll (16 f ease-out, tabular) + RollUp / CounterStack siblings; stack tilts up -6 px/s, plate pushes +2.5 %/s. Used AP C17.",
    when: "One to three stacked response figures (crews, vehicles, time) on their words; a text value wipes instead of rolling. " + RULES,
    props: "media, mediaStart, rows [{value number|string,label,at,prefix,suffix,red}], cap, labelCap, x",
    twist: "label types on beside each figure; key row red; footage at 40 % lightly defocused",
    sfx: [],
    axes: { geometry: "left vertical stack of figures", entry: "0 -> value roll 16 f + typed label", layout: "figure + label per row, stacked", accent: "red key row" },
  },
  {
    family: "stat", name: "FigureLine-A", component: FigureLine_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 10, 16, 20, 80, 90, 140, 165],
    defaultProps: {
      media: "demo/clip_park.mp4", cap: 104,
      figs: [{ value: "3 DAYS", label: "IN HOSPITAL", at: 10 }, { value: "$50,000", label: "THE BILL", at: 80, red: true }, { value: "PAID", label: "BY INSURANCE", at: 140 }],
    },
    ref: "CounterStack / TwoTone siblings; figure rises 40 px + 6 px defocus clearing (EZ.quick 10 f); line trucks -16 px/s against the footage +12 px/s. Used AP C12.",
    when: "Two to four short facts in one line ('3 days / $50,000 / paid by insurance'), each on its word. " + RULES,
    props: "media, mediaStart, figs [{value,label,at,red}], cap, labelCap, y, header {text,at}",
    twist: "label wipes in 4 f after its figure; thin rules draw between neighbours; counter-trucking layers so the frame never parks",
    sfx: [],
    axes: { geometry: "horizontal line of 2-4 figures", entry: "rise 40 px + defocus clear, label wipe 4 f later", layout: "figures left-to-right with rules between", accent: "red key figure" },
  },
  {
    family: "stat", name: "FlowCount-A", component: FlowCount_A, durationInFrames: 200, thumbFrame: 170, stripFrames: [0, 2, 8, 16, 66, 74, 130, 170],
    defaultProps: {
      x: 300, y: 520, cap: 150, exitAt: 186,
      rows: [{ num: "9:54 PM", word: "THE PARK SAID", at: 2, wordAt: 30 }, { num: "ALL 21", word: "SAFELY ON THE GROUND", at: 66, wordAt: 96 }, { num: "8 HRS", word: "AFTER IT STOPPED", at: 128, wordAt: 146 }],
    },
    ref: "DD Zoo stacked stats (white figure + red key word on dimmed footage) + RollUp (14 f roll, 8 px rise) + VV 2026 continuous camera. Used AP C07.",
    when: "OVERLAY (no media; demo shows it alone): a sequence of figures that replace each other on the words (state change, not a stack) over the case footage darkened by its own feathered band. " + RULES,
    props: "rows [{num,word,at,wordAt,from,to,prefix,suffix,decimals}], x, y, cap, exitAt, align left|center, truck",
    twist: "next row rises in while the previous is carried up and dims; group trucks -30 px/s (ramped) with a 1.12 -> 1 settle on its first frame",
    sfx: [],
    axes: { geometry: "single active row, previous carried up", entry: "1.12 -> 1 settle + row rise / roll 14 f", layout: "Nunito figure over Varela red word", accent: "DD red #F22522 word with glow" },
  },
  {
    family: "stat", name: "FunnelCount-A", component: FunnelCount_A, durationInFrames: 180, thumbFrame: 160, stripFrames: [0, 6, 14, 22, 100, 110, 120, 160],
    defaultProps: { media: "demo/clip_crowd.mp4", max: 65, stages: [{ value: 65, label: "TREATED", at: 6 }, { value: 16, label: "TO HOSPITAL", at: 100, red: true }] },
    ref: "Arithmetic / CountUp_A siblings; Farrell R9 count inside the bar (16 f); funnel outline draws on the next stage's word; tilt keeps the newest stage at 55 % H. Used AP C20.",
    when: "A casualty count that narrows (treated -> hospital -> critical); the last stage can split into parts. " + RULES,
    props: "media, mediaStart, stages [{value,label,at,red,parts [{value,label}]}], max, cap, labelCap",
    twist: "log-ish bar widths so 65 vs 4 both read; funnel outline joins the bars; plate = case footage at 34 %",
    sfx: [],
    axes: { geometry: "top-down narrowing bars joined by a funnel", entry: "bar grows + count 16 f, outline draws on next word", layout: "bars stacked, labels right", accent: "red key stage bar" },
  },
  {
    family: "stat", name: "StatSlide-A", component: StatSlide_A, durationInFrames: 150, thumbFrame: 110, stripFrames: [0, 40, 44, 48, 54, 62, 70, 110],
    defaultProps: { media: "demo/clip_park.mp4", value: "~10", at: 40, word: "STOREYS UP", wordAt: 62, top: "THE PLATFORM", topAt: 6 },
    ref: "TwoTone / RecedeNumber / BigNumber siblings; VV world camera: figure slides in from the right with a 16 px horizontal smear (EZ.quick 14 f) and drifts at 0.4x the truck. Used AP C12.",
    when: "One key figure + red qualifier over trucking footage (height, speed, count). " + RULES,
    props: "media, mediaStart, value, at, word, wordAt, top, topAt, truck, cap, wordCap, x, y, plateFilter",
    twist: "left-weighted dark band only behind the text so the footage stays readable on the right; qualifier wipes in left-to-right on its own word",
    sfx: [],
    axes: { geometry: "left big figure over a trucking plate", entry: "slide-in from the right edge with 16 px smear", layout: "top line / figure / red qualifier stacked left", accent: "red Bebas qualifier wipe" },
  },
  {
    family: "stat", name: "TallyTags-A", component: TallyTags_A, durationInFrames: 180, thumbFrame: 165, stripFrames: [0, 20, 26, 30, 40, 60, 140, 165],
    defaultProps: {
      media: "demo/clip_party.mp4", header: "SAME RIDE SHUT · ACROSS THE STATE", headerAt: 4,
      tags: [{ text: "NORTH PARK", at: 20 }, { text: "BAYSIDE", at: 40 }, { text: "HILLTOP", at: 66 }, { text: "SEAFRONT", at: 96 }],
      word: "WHILE THE MAKER INVESTIGATED", wordAt: 140,
    },
    ref: "VV 9 word pop for the tag + Farrell R9 counter for the figure; sibling of CounterStack / IconGrid / RollUp. Used AP C06.",
    when: "A count built from named items (cities, rides, roles): the figure ticks up by one as each tag lands on its word. " + RULES,
    props: "media, mediaStart, tags [{text,at}], word, wordAt, header, headerAt, cap, tagCap",
    twist: "newest tag drops 46 px (EZ.quick 10 f) with a 1 f white edge flash, earlier tags settle to 70 %; plane trucks -14 px/s with +1.2 %/s push",
    sfx: [],
    axes: { geometry: "big figure beside a row of tags", entry: "tag drops 46 px + figure ticks +1", layout: "figure left, tag row right, qualifier under", accent: "red qualifier wipe + 1 f edge flash" },
  },
];
