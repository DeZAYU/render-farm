// Family "caseopener": the case-opener SYSTEM. One identity in every variant: the Dashcam Vol.3 E1 case number (Nunito 900, footed "1", red
// gradient #D61E18 -> #870608, FONTS.md) + Varela-Round two-tone date / place labels (white + red key word). Only the ENTRY changes.
// FULL_PLAN ledger rule: the opener keeps one identity but rotates among >= 3 entries; never the same entry twice in a row.
// All frames local (0 = the case's first picture frame). Words land on the spoken word (+0.0..0.15 s).
import type { VariantDef } from "../../core";
import { CornerFade } from "./CornerFade";
import { CentreSettle } from "./CentreSettle";
import { TypedStamp } from "./TypedStamp";
import { ChapterRise } from "./ChapterRise";
import { FlashSlam } from "./FlashSlam";

const F = "caseopener";
const date = (a: number, s = 8) => [{ text: "March", at: a }, { text: "3rd,", at: a + s }, { text: "2019", at: a + 2 * s, red: true }];
const place = (a: number, s = 7) => [{ text: "Riverside", at: a }, { text: "Park,", at: a + s }, { text: "Ohio", at: a + 2 * s, red: true }];
const COMMON = "number, dateWords [{text,at,red}], placeWords, media, mediaStart, push, numberAt/numberOut, dateOut/placeOut";
export const variants: VariantDef[] = [
  {
    family: F, name: "CornerFade", component: CornerFade, durationInFrames: 135, thumbFrame: 44, stripFrames: [0, 6, 12, 20, 30, 44, 76, 100],
    defaultProps: { number: "4", dateWords: date(8), placeWords: place(84), media: "demo/clip_park.mp4", numberOut: 66 },
    ref: "Dashcam Vol.3 E1 @0:48.0 (case '2' top-right, alpha ease-out, no motion) + E2 @0:48.6 'July 26th, 2024' word-rise; wp3 sec_A CaseNumber + DateLabel @ abs 708 (approved)",
    when: "Default opener: a calm case start on footage. The number sits top-right while the date rises word by word mid-frame; the place replaces it.",
    props: `${COMMON}, cap, band (dark radial band behind the label)`, twist: "place label added in the same slot after the date (one label at a time); crisp SVG round type",
    sfx: [{ event: "case_number_hit", at: 0, note: "first visible frame of the number" }],
    axes: { geometry: "top-right corner + centre slot", entry: "alpha ease-out, no motion", layout: "sequential centred labels", accent: "red key word glow" },
  },
  {
    family: F, name: "CentreSettle", component: CentreSettle, durationInFrames: 140, thumbFrame: 104, stripFrames: [0, 3, 8, 30, 50, 56, 64, 104],
    defaultProps: { number: "4", dateWords: date(70), placeWords: place(92), media: "demo/clip_party.mp4", mediaStart: 60, settleAt: 46 },
    ref: "Dashcam Vol.1 E1 centre number on a freeze (#3 @2:19.17, focus-in 6 f, glossy, red glow) + D1 corner variant (#12 @13:22.1, corner number + mid-frame date)",
    when: "A case that opens on a striking still moment: the footage holds while the big number lands, then everything moves on together.",
    props: `${COMMON}, settleAt (resume + travel), settleDur, bigGlyph, cap`, twist: "the centred D1 number settles into the D3 corner slot (VV quick-start/long-settle, motion-blurred) on the frame the clip resumes; date + place stack as two lines",
    sfx: [{ event: "case_number_hit", at: 2 }, { event: "title_wall_move", at: 46, note: "optional soft move under the settle" }],
    axes: { geometry: "centre -> corner travel", entry: "focus-in on a freeze", layout: "two stacked centred lines", accent: "glossy top + red glow that fades as it settles" },
  },
  {
    family: F, name: "TypedStamp", component: TypedStamp, durationInFrames: 130, thumbFrame: 92, stripFrames: [0, 2, 4, 30, 44, 60, 80, 92],
    defaultProps: { number: "4", dateWords: date(40, 10), placeWords: place(74, 9), media: "demo/clip_crowd.mp4", numberOut: 54, outAt: 118 },
    ref: "Dashcam Vol.2 E9 @8:23.4 (case '10' top-right, 3-step in 0.2 s, out 0.2 s, then 'the date types under it') + D2 E2 left-aligned label + D1 E4 typed stamp @2:29.2 (2 f/char, smear exit)",
    when: "A case where the exact time/date matters (timeline-driven stories). Reads as a record being written.",
    props: `${COMMON}, step (f per char), cap, x/y (left edge, first line), outAt (smear)`, twist: "two typed lines (date, place) left-aligned; red key word with D1's dark-red drop shadow; one 3 f smear exit",
    sfx: [{ event: "case_number_hit", at: 0 }, { event: "typing_key", at: 40, note: "one key per character step" }],
    axes: { geometry: "corner number + left column", entry: "3-step pop, then per-character typing", layout: "left-aligned two-line stack", accent: "dark-red shadowed key word" },
  },
  {
    family: F, name: "ChapterRise", component: ChapterRise, durationInFrames: 110, thumbFrame: 70, stripFrames: [0, 2, 5, 9, 14, 22, 40, 70],
    defaultProps: { number: "4", dateWords: date(17, 7), placeWords: place(30, 6), media: "demo/clip_fire.mp4", clearAt: 84 },
    ref: "Visual Venture §1 chapter card 'rise and recede' @1:00.73 / 9:14.93 / 22:58.84 (MOTION.md §1, recession S = 0.39 + 0.61 e^-t/1.1, box +13 f bezier .404,.252,.291,.94)",
    when: "Opening a long or chapter-like case (multi-part story), or after a black beat. Hard cut from the card to the sharp footage.",
    props: `${COMMON}, clearAt (cut to sharp footage), glyph, cap, defocus`, twist: "the card plate is the case footage defocused under VV's dark-red glow; the number is the headline, the DD date line is the 'box'; ghosted words on the voice",
    sfx: [{ event: "sub_boom", at: 0, note: "card frame" }, { event: "case_number_hit", at: 2 }],
    axes: { geometry: "centred group, oversize -> recede", entry: "rise from the bottom edge + recession", layout: "number over two centred lines", accent: "wide red bloom + dust on a defocused plate" },
  },
  {
    family: F, name: "FlashSlam", component: FlashSlam, durationInFrames: 125, thumbFrame: 26, stripFrames: [0, 2, 4, 6, 9, 14, 26, 60],
    defaultProps: { number: "4", dateWords: date(16), placeWords: place(84), media: "demo/clip_party.mp4", mediaStart: 100, numberOut: 52 },
    ref: "Dashcam Vol.2 E9 @12:56.25 (case '13' assembles from eroded particles on a red wash with scanlines, halo blooms/shrinks) + D1 hard white flash + D1 red wash @0:13.31",
    when: "The heaviest case of the video (impact on the entry). Uses the case's one white flash; never two in a row.",
    props: `${COMMON}, glyph, cap, seed (dissolve noise)`, twist: "number and date stacked as one title block; the red wash decays (half-life 8 f) as the footage sharpens",
    sfx: [{ event: "white_flash_hit", at: 0, note: "anchor = first white frame" }, { event: "case_number_hit", at: 0 }],
    axes: { geometry: "centre title block", entry: "white flash + particle assembly", layout: "number over date, place replaces date", accent: "red wash + scanlines + blooming halo" },
  },
];
// new set "dash1" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash1.md)
import { extra as extra_dash1 } from "./new_dash1";
variants.push(...extra_dash1);
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
