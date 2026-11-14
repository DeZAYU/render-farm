// Family "transition": cuts between two scenes. All frames local; `cut` = first incoming frame. SFX via the hints (sfx.json events).
// Usage rule (DD V3 §633 + Nocturn): rotate them; plain hard cuts for most footage changes inside a case, a designed transition for page/time/case changes.
import type { VariantDef } from "../../core";
import { WhiteFlash } from "./WhiteFlash";
import { FlashStreak } from "./FlashStreak";
import { GlitchStreak } from "./GlitchStreak";
import { BlurFlash } from "./BlurFlash";
import { BlurDip } from "./BlurDip";
import { SineDip } from "./SineDip";
import { BlackBeat } from "./BlackBeat";
import { SliceGlitch } from "./SliceGlitch";

const A = "demo/clip_party.mp4", B = "demo/clip_park.mp4";
const T = "transition";
import { CrackSplit } from "./CrackSplit";
export const variants: VariantDef[] = [
  {
    family: T, name: "WhiteFlash", component: WhiteFlash, defaultProps: { a: A, b: B, cut: 30 }, durationInFrames: 60, thumbFrame: 31, stripFrames: [28, 29, 30, 31, 32, 33, 34, 40],
    ref: "Dashcam Vol.1 hard white flash (case entries, look-here release, D1 I5 step 6); wp3 sec_A FLASH4 @ abs 1509 / 2879, FA flash-decay @ 852",
    when: "Time skip inside one story; footage -> photo/page entry; the release of a look-here freeze. 'decay' envelope = softer photo entry. Max ~1 per minute.",
    props: "a/b media or A/B nodes, cut, envelope 'hard'|'decay', tint", sfx: [{ event: "white_flash_hit", at: 30, note: "anchor = cut" }],
    axes: { geometry: "full-frame cut inside white", entry: "4 f hard white 1/.85/.5/.2", layout: "-", accent: "pure white" },
  },
  {
    family: T, name: "FlashStreak", component: FlashStreak, defaultProps: { a: A, b: B, cut: 30, seed: 7 }, durationInFrames: 60, thumbFrame: 28, stripFrames: [27, 28, 29, 30, 32, 34, 35, 38],
    ref: "Dashcam Vol.3 F1 flash-streak @ 0:07.37 / 0:14.43 (31 uses, STUDY I4); wp3 sec_B TTQuote, sec_C HighPage (flashStreak)",
    when: "Into an article page, a case change, or a time skip inside a raw. Always with the whoosh.",
    props: "a/b or A/B, cut, seed, bars", sfx: [{ event: "transition_whoosh", at: 30, note: "anchor = first full-white frame (cut)" }],
    axes: { geometry: "horizontal light streaks", entry: "streaks c-3, bloom, 2nd burst c+4..7", layout: "random-y bars", accent: "white streak glow" },
  },
  {
    family: T, name: "GlitchStreak", component: GlitchStreak, defaultProps: { a: A, b: B, cut: 30, seed: 3 }, durationInFrames: 60, thumbFrame: 29, stripFrames: [28, 29, 30, 31, 32, 33, 34, 36],
    ref: "Dashcam Vol.3 F2 soft glitch-streak @ 0:21.63 (54 uses, STUDY I5)",
    when: "Shot changes inside a case (second angle, into a raw), softer than FlashStreak; DD's most frequent designed cut.",
    props: "a/b or A/B, cut, seed", sfx: [{ event: "glitch", at: 30 }],
    axes: { geometry: "haze + 3 shifted bands", entry: "9 f, stepped 2-frame decay", layout: "-", accent: "white haze" },
  },
  {
    family: T, name: "BlurFlash", component: BlurFlash, defaultProps: { a: A, b: B, cut: 30 }, durationInFrames: 60, thumbFrame: 31, stripFrames: [26, 28, 29, 30, 31, 33, 36, 38],
    ref: "Dashcam Vol.1 BF blur-flash case transition (9 case entries, e.g. 2:18.60, 9:28.0; STUDY I2)",
    when: "Case entries (pairs with the case-opener number), the DD signature into a new case.",
    props: "a/b or A/B, cut, sigma", sfx: [{ event: "white_flash_hit", at: 30, note: "optional; DD has none measurable" }],
    axes: { geometry: "full-frame defocus", entry: "4 f defocus+brighten out, 6 f blurred hot in, 2 f snap", layout: "-", accent: "exposure bloom" },
  },
  {
    family: T, name: "BlurDip", component: BlurDip, defaultProps: { a: A, b: B, cut: 30, form: "normal" }, durationInFrames: 60, thumbFrame: 24, stripFrames: [16, 20, 24, 28, 29, 32, 36, 42],
    ref: "Dashcam Vol.1 BD blur-dip to black @ 0:17.05 (24 uses, STUDY I3)",
    when: "Time skips, page <-> clip, clip -> replay. Forms short 0.4 s / normal 0.93 s / long 2.1 s.",
    props: "a/b or A/B, cut (first incoming frame), form 'short'|'normal'|'long', maxBlur", sfx: [],
    axes: { geometry: "full-frame", entry: "linear fade+defocus out, 1 black, linear in", layout: "-", accent: "black" },
  },
  {
    family: T, name: "SineDip", component: SineDip, defaultProps: { a: A, b: B, cut: 40 }, durationInFrames: 80, thumbFrame: 24, stripFrames: [8, 16, 24, 32, 38, 40, 48, 60],
    ref: "Dashcam Vol.3 F3 dip to black @ 0:46.1 -> case 2 (52 uses, STUDY I6)",
    when: "Case changes and time skips where the VO re-enters in the black; slower, calmer than BlurDip.",
    props: "a/b or A/B, cut, outF, blackF, inF", sfx: [{ event: "sub_boom", at: 38, note: "hit on the first black frame +0.2 s" }],
    axes: { geometry: "full-frame", entry: "cos ease-in out / 2 black / sin ease-out in", layout: "-", accent: "black" },
  },
  {
    family: T, name: "BlackBeat", component: BlackBeat, defaultProps: { a: A, b: B, blackAt: 24, cut: 54, hot: [0.47], word: { text: "then it happened.", at: 34, colour: "#E00006" } }, durationInFrames: 80, thumbFrame: 44, stripFrames: [20, 24, 34, 44, 53, 54, 55, 60],
    ref: "Farrell camera MOTION §2.5 act break (YT 4:58.0, 21:28.0: black hold, hard cut back + hot frames); wp3 sec_B 1.0 s black beat @ abs 3038; VV §9 word on black",
    when: "The beat before the shocking moment or an act break; optional one sentence on black (VV static red sentence).",
    props: "a/b or A/B, blackAt, cut, dissolveF (0 hard / 18 act break), hot[], word {text, at, colour}", sfx: [{ event: "sub_boom", at: 24 }],
    axes: { geometry: "full black", entry: "hard cut (or 18 f dissolve) to black, hard cut back with hot frame", layout: "centred word", accent: "red sentence / hot white frame" },
  },
  {
    family: T, name: "SliceGlitch", component: SliceGlitch, defaultProps: { a: A, b: B, cut: 30, mode: "tear", seed: 5 }, durationInFrames: 60, thumbFrame: 28, stripFrames: [26, 27, 28, 29, 30, 31, 32, 34],
    ref: "Visual Venture §10 glitch @ 0:13.55 (112 uses) and 'signal loss' @ 0:02.67; wp3 sec_A TtPage glitch-in @ abs 2412",
    when: "Into a page or a disturbing reveal where a digital tear fits (internet/video sources). Use 'signal' for CCTV/livestream cuts.",
    props: "a/b or A/B, cut, mode 'tear'|'signal', seed", sfx: [{ event: "glitch", at: 30 }],
    axes: { geometry: "54 horizontal bands", entry: "4 f tear out, 1 f tear in (signal: 10 f with near-black R/B split)", layout: "-", accent: "sideways smear" },
  },
  {
    family: T, name: "CrackSplit", component: CrackSplit, durationInFrames: 110, thumbFrame: 62, stripFrames: [20, 40, 60, 61, 62, 66, 72, 80],
    defaultProps: { b: "demo/clip_party.mp4", white: "JUST AFTER", red: "7 PM", typeAt: 6, crackAt: 60, cut: 80, seed: 3 },
    ref: "DD black beat (wp3 sec_B 1.0 s black) + Dashcam Vol.1 E4 typed stamp @2:29.2 + Visual Venture §10 tear with Rule 0 white; maps c02 #13, c08 #7",
    when: "The moment something physically breaks (a crack, a creak, a collapse) at a stated time: black, the time types, the frame cracks open into the next shot.",
    props: "b (incoming media) or B, white/red (typed time), typeAt, crackAt (crack word), cut (halves gone), seed, slope; cap (typed time, 76)",
    twist: "the typed text splits with the halves; hot white crack core with short branches; the incoming clip shows through the widening gap",
    sfx: [{ event: "typing_key", at: 6 }, { event: "glitch_static", at: 60, note: "until a crack SFX exists in sfx.json: use the crack/creak foley; anchor = crackAt" }],
    axes: { geometry: "jagged crack across the frame", entry: "3 f crack draw, halves part (ease-in, blurred)", layout: "typed time on black", accent: "hot white crack + bloom" },
  },
];
// new set "dash1" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash1.md)
import { extra as extra_dash1 } from "./new_dash1";
variants.push(...extra_dash1);
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
