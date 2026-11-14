// Family "title": full-screen title / text cards. All frames local.
import type { VariantDef } from "../../core";
import { TitleWall } from "./TitleWall";
import { ChapterCard } from "./ChapterCard";
import { SlamCard } from "./SlamCard";
import { WordPops } from "./WordPops";
import { KineticTitle } from "./KineticTitle";
import { HorizonCard } from "./HorizonCard";
import { TypedDate } from "./TypedDate";

const T = "title";
const tiles = ["02", "03", "04", "05", "07", "08", "09", "10", "11", "12", "02", "03", "04", "05", "07"].map((n) => `demo/tile_${n}.jpg`);
import { RoleStack } from "./RoleStack";
export const variants: VariantDef[] = [
  {
    family: T, name: "TitleWall", component: TitleWall,
    defaultProps: {
      lines: [{ text: "MOST DISTURBING", colour: "#D21A1F", glow: "0 0 14px rgba(210,26,31,.6), 0 4px 18px rgba(0,0,0,.85)" }, { text: "PLACEHOLDER MOMENTS", colour: "#EEEDED", glow: "0 0 8px rgba(255,255,255,.22), 0 4px 18px rgba(0,0,0,.85)" }],
      tiles, titleAt: 10, dive: { tile: 1, at: 110, dur: 40, media: "demo/kena.png" },
    },
    durationInFrames: 150, thumbFrame: 80, stripFrames: [0, 6, 12, 18, 30, 80, 118, 140],
    ref: "Dashcam Vol.3 E8 @ 0:38.5 tile wall + title; D1 E13 @ 0:56.4; wp3 Intro3 WallScene @ abs 517-708 (approved)",
    when: "The video title after the cold open; the wall lists every case, the dive into tile 1 hands over to case 1. Once per video.",
    props: "lines[{text,colour,glow}], tiles[] (graded frames), cols, rows, face 'bebas'|'lacquer', titleAt, zoomFrom, dive {tile, at, dur, media}",
    twist: "real graded case frames under the red tiles; Bebas instead of the drip face (Lacquer optional)",
    sfx: [{ event: "title_word_hit", at: 10 }, { event: "title_wall_move", at: 110, note: "the dive" }],
    axes: { geometry: "5x3 curved tile grid", entry: "tiles flicker on, lines glitch-flicker, camera pull-back", layout: "two lines centred above the grid", accent: "red tiles + red line" },
  },
  {
    family: T, name: "ChapterCard", component: ChapterCard, defaultProps: { kicker: "CHAPTER 2", title: "THE SECOND CASE", titleAt: 15 },
    durationInFrames: 90, thumbFrame: 70, stripFrames: [2, 5, 8, 14, 20, 30, 45, 70],
    ref: "Visual Venture §1 chapter card @ 1:00.73 / 9:14.93 / 22:58.84 (MOTION.md, measured)",
    when: "Section / act breaks in long videos (part 2, 'the aftermath'), never per case if the case-opener is used.",
    props: "kicker, title, titleAt (= first word of the spoken title), boxColour",
    sfx: [{ event: "sub_boom", at: 0 }],
    axes: { geometry: "centred stack, red box", entry: "rise from bottom edge + recession x2.12 -> 1", layout: "kicker over boxed title", accent: "wide red bloom" },
  },
  {
    family: T, name: "SlamCard", component: SlamCard,
    defaultProps: { lines: [{ text: "ONE OF THE MOST", colour: "#E6FF1E", size: 110 }, { text: "SHOCKING RECORDINGS", colour: "#E30005", size: 172 }, { text: "EVER MADE.", colour: "#F2F2F2", size: 110 }], fallAt: 15, media: "demo/clip_crowd.mp4" },
    durationInFrames: 90, thumbFrame: 80, stripFrames: [0, 8, 14, 17, 20, 26, 40, 80],
    ref: "Visual Venture §2 slam card @ 17:30.63 (MOTION.md, measured)",
    when: "A superlative claim about one clip ('one of the most haunting...'); the text hits huge and falls back on the key word.",
    props: "lines[{text,colour,size}], fallAt (key word frame), media (small B/W clip, optional)",
    axes: { geometry: "left-aligned block, small framed clip", entry: "creep at x3.1, recession to x1 about left edge", layout: "3 stacked lines, middle largest", accent: "yellow / red / white" },
  },
  {
    family: T, name: "WordPops", component: WordPops,
    defaultProps: { words: [{ text: "TO", at: 3, weight: "light" }, { text: "THE", at: 9, weight: "light" }, { text: "WORST", at: 15, colour: "#EAF721" }, { text: "OF", at: 25, weight: "light" }, { text: "THE", at: 30, weight: "light" }, { text: "WORST.", at: 36, colour: "#E00006" }], lines: [3] },
    durationInFrames: 60, thumbFrame: 50, stripFrames: [3, 9, 15, 25, 30, 36, 50],
    ref: "Visual Venture §9 word pops on black @ 0:43.6, 1:07.1, 13:58.3 (MOTION.md)",
    when: "Punctuation between moving devices: a short line the VO stresses. Static on purpose. style 'sentence' = red lowercase Inter line.",
    props: "words[{text, at, colour, weight 'light'|'bold'}], style 'caps'|'sentence', cap, lines[] (break indices)",
    axes: { geometry: "centred rows on black", entry: "1-frame pops, no motion", layout: "light connectors + bold key words", accent: "yellow / red word" },
  },
  {
    family: T, name: "KineticTitle", component: KineticTitle,
    defaultProps: { media: "demo/clip_party.mp4", occlude: true, words: [
      { text: "THE", at: 4, light: true, line: 0 }, { text: "LAST", at: 10, line: 0 }, { text: "NIGHT", at: 16, line: 0 },
      { text: "BEFORE", at: 26, light: true, line: 1 }, { text: "EVERYTHING", at: 32, red: true, line: 1 }, { text: "CHANGED", at: 44, line: 2 },
    ] },
    durationInFrames: 90, thumbFrame: 70, stripFrames: [4, 8, 12, 18, 28, 34, 46, 70],
    ref: "Visual Venture §8 word-synced kinetic title @ 0:38.7 (title room) / 1:20.3 (sky occlusion) (MOTION.md)",
    when: "Hook lines over a moody scene (cold open, chapter hook). Words ghost in on the voice, the scene keeps pushing.",
    props: "media, words[{text, at, line, light?, red?}], cap, x, y, occlude, dim",
    axes: { geometry: "left-aligned block over footage", entry: "per-word ghost 30 % -> 100 % in 4 f", layout: "light/bold mixed caps, 3 lines", accent: "one red key word, scene occlusion" },
  },
  {
    family: T, name: "HorizonCard", component: HorizonCard,
    defaultProps: { year: "2019", subtitle: "FOUR YEARS LATER", media: "demo/clip_park.mp4", subAt: 23, colourAt: 66, badge: { text: "41:07", at: 75 } },
    durationInFrames: 105, thumbFrame: 96, stripFrames: [2, 8, 16, 24, 32, 40, 56, 96],
    ref: "Visual Venture §3 date card with horizon line @ 17:42 / 22:40 (MOTION.md); wp3 sec_A DateCard @ abs 1204 (approved)",
    when: "Time jumps stated in the VO ('five years later', 'in 1987'): the year + subtitle with the material rising from behind the horizon.",
    props: "year, subtitle, media (clip/still for the print), subAt, colourAt, badge {text, at}, accent",
    axes: { geometry: "horizon line at 0.59 H, torn print above", entry: "on twos: line draw, slides, print rises from behind", layout: "small year + large subtitle below the line", accent: "amber glow, B/W -> colour bloom" },
  },
  {
    family: T, name: "TypedDate", component: TypedDate,
    defaultProps: { media: "demo/clip_crowd.mp4", line1: "JULY 2014", line2: [{ text: "THE", at: 62 }, { text: "NIGHT", at: 66 }, { text: "OF", at: 71 }, { text: "THE", at: 74 }, { text: "PARTY", at: 78 }] },
    durationInFrames: 100, thumbFrame: 92, stripFrames: [4, 12, 22, 32, 42, 54, 66, 92],
    ref: "Visual Venture §4 typed date with cursor @ 2:52.0 (MOTION.md)",
    when: "A date that opens a sequence when the VO names it slowly ('April 2008...'); mechanical rhythm = a documented moment.",
    props: "media (defocused bg), line1, line2[{text, at}], startAt, perChar (5 f), colour",
    axes: { geometry: "centred, shrinking line", entry: "cursor then 1 char / 5 f, re-centring", layout: "thin caps over bold word line", accent: "cold white, defocused footage" },
  },
  {
    family: "title", name: "RoleStack", component: RoleStack, durationInFrames: 140, thumbFrame: 128, stripFrames: [0, 6, 8, 10, 30, 52, 60, 128],
    defaultProps: { roles: [{ text: "OWNER", at: 8 }, { text: "GENERAL MANAGER", at: 24 }, { text: "OPERATIONS MANAGER", at: 40 }], bar: { text: "CHARGED", at: 58 },
      charges: [{ words: "NO PROPER SAFETY PROCEDURES".split(" ").map((t, i) => ({ text: t, at: 80 + i * 5 })) }, { words: "NO REGULAR MAINTENANCE BY QUALIFIED STAFF".split(" ").map((t, i) => ({ text: t, at: 104 + i * 4 })) }] },
    ref: "DD title slam language (Dashcam Vol.1 E13 / Vol.3 E8: red over white caps, hard arrival) + DD D1 white-flash impact grammar; map c07 #18",
    when: "Who was charged / sued / dismissed, by ROLE (no names on screen), followed by what they were accused of.",
    props: "roles [{text, at}], bar {text, at}, charges [{words [{text, at}]}], x; cap (role cards, 84), labelCap (bar, 92), subCap (charges, 34)",
    twist: "separate cards fall onto a left column from above the lens with a white edge-flash and kick each; angled red bar wipes in under the stack",
    sfx: [{ event: "title_word_hit", at: 8 }, { event: "title_word_hit", at: 24 }, { event: "title_word_hit", at: 40 }, { event: "sub_boom", at: 58, note: "CHARGED bar" }],
    axes: { geometry: "left column of cards + angled bar", entry: "falling card slams, bar wipe, typed charges", layout: "stacked roles, charges under", accent: "red CHARGED bar" },
  },
];
// new set "dash1" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash1.md)
import { extra as extra_dash1 } from "./new_dash1";
variants.push(...extra_dash1);
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
