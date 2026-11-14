// Family "labels": place / date / time / name labels on footage or photos. All frames local; words land on the spoken word (+0.0..0.15 s).
// Rule 0: DD variants first (WordRise, TypedTime, HudCallout, TitlePlace, NameTag); Farrell PhotoLabel for real photos; Abyssal VhsDate sparingly.
import type { VariantDef } from "../../core";
import { WordRise } from "./WordRise";
import { TypedTime } from "./TypedTime";
import { HudCallout } from "./HudCallout";
import { TitlePlace } from "./TitlePlace";
import { PhotoLabel } from "./PhotoLabel";
import { NameTag } from "./NameTag";
import { VhsDate } from "./VhsDate";

const F = "labels";
/** stage-banner track on demo/clip_party.mp4 from source frame 90 (local = source - 90), NCC-tracked, source px (demo data only) */
export const PARTY_TRACK = [[0, 541, 535], [2, 578, 559], [4, 601, 566], [6, 631, 566], [8, 660, 584], [10, 686, 607], [12, 696, 622], [14, 704, 624], [16, 711, 628], [18, 715, 636], [20, 716, 637], [22, 717, 632], [24, 725, 624], [26, 740, 617], [28, 753, 618], [30, 763, 616], [32, 764, 616], [34, 764, 617], [36, 764, 620], [38, 768, 620], [40, 776, 620], [42, 784, 617], [44, 788, 615], [46, 788, 612], [48, 784, 612], [50, 772, 612], [52, 756, 612], [54, 736, 609], [56, 708, 608], [58, 676, 608], [60, 644, 608], [62, 614, 603], [64, 569, 587], [66, 494, 564], [68, 407, 548], [70, 351, 544]]
  .map(([f, x, y]) => ({ f, x, y }));
export const variants: VariantDef[] = [
  {
    family: F, name: "WordRise", component: WordRise, durationInFrames: 90, thumbFrame: 50, stripFrames: [0, 3, 6, 10, 14, 20, 30, 50],
    defaultProps: { media: "demo/clip_park.mp4", words: [{ text: "Riverside", at: 2 }, { text: "Park,", at: 10 }, { text: "Ohio", at: 18, red: true }], exitAt: 70 },
    ref: "Dashcam Vol.3 E2 @0:03.4 'Northern Ontario' / @0:48.6 'July 26th, 2024'; wp3 refsys DDLabel (Intro3 'Dadifeng, Yunnan' @ abs 22)",
    when: "Default place or date label on footage, centred, one at a time. The red word = region / year.",
    props: "media, mediaStart, push, words [{text,at,red}], cap (104 place / 70-89 date), y, exitAt, band", twist: "SVG round type, soft radial band on bright shots, slow life drift after settle",
    axes: { geometry: "centred single line", entry: "word-rise, red defocus->sharp", layout: "inline two-tone", accent: "red key-word glow" },
  },
  {
    family: F, name: "TypedTime", component: TypedTime, durationInFrames: 80, thumbFrame: 52, stripFrames: [0, 4, 10, 16, 22, 30, 66, 67],
    defaultProps: { media: "demo/clip_fire.mp4", white: "SATURDAY", red: "- 8:30 PM", at: 2, outAt: 66 },
    ref: "Dashcam Vol.1 E4 'MONDAY - 4:30 PM' @2:27.5-2:29.2 (2 f/char, over a freeze) + D1 '40 minutes' @0:15.6; wp3 sec_B TimeStamp @ abs 3069 (approved)",
    when: "A clock time or duration that matters ('8:30 PM', '40 minutes'). Optional freeze under it.",
    props: "media, white, red, at, redAt, step (f/char), cap, x, y, outAt (3 f smear), freezeAt/resumeAt", twist: "red part with D1's dark-red drop shadow; 3 f vertical smear exit",
    sfx: [{ event: "typing_key", at: 2, note: "one key per character step" }],
    axes: { geometry: "mid-left line", entry: "per-character typing", layout: "white + red caps run", accent: "dark-red drop shadow" },
  },
  {
    family: F, name: "HudCallout", component: HudCallout, durationInFrames: 70, thumbFrame: 40, stripFrames: [0, 3, 6, 9, 12, 15, 24, 40],
    defaultProps: { media: "demo/clip_party.mp4", mediaStart: 90, text: "[Riverside Park stage]", at: 0, track: PARTY_TRACK, elbow: { dx: -170, dy: -190 }, left: true },
    ref: "Dashcam Vol.1 E4 bracket callout @1:07.9-1:09.3 '[2004 Subaru Forester XT]', @7:02 '[chasing...]'; wp3 Intro3 HudCallout '[Liseberg, Sweden]' @ abs 88",
    when: "Naming an object / vehicle / building in the shot. Leads the spoken words by 0.4-1.0 s.",
    props: "media, text '[...]', at, track [{f,x,y}] (source px), elbow {dx,dy}, left, cap, wordStep, outAt", twist: "anchor tracks the object with the footage push applied; red anchor dot",
    axes: { geometry: "leader polyline + bracket text", entry: "line draws 8 f, words type 3 f each", layout: "off-object bracket", accent: "thin red glow line" },
  },
  {
    family: F, name: "TitlePlace", component: TitlePlace, durationInFrames: 90, thumbFrame: 60, stripFrames: [0, 2, 4, 8, 12, 16, 22, 60],
    defaultProps: { media: "demo/clip_park.mp4", mediaStart: 60, line1: [{ text: "Riverside", at: 0 }], line2: [{ text: "Water", at: 7 }, { text: "Park", at: 14 }] },
    ref: "Dashcam Vol.1 E3 @1:10.57-1:12.0 'Angeles / Crest Highway' (title size, two lines, blur+opacity per word, stagger 6-8 f); FONTS.md 'Title-size place'",
    when: "The one big place name of a case (the location IS the story). Over a wide establishing shot.",
    props: "media, line1/line2 words, cap (113), y, outAt", twist: "+0.6 %/s scale life drift on the block",
    axes: { geometry: "two big centred lines", entry: "per-word blur+opacity reveal", layout: "white line over red line", accent: "red glow ~14 px" },
  },
  {
    family: F, name: "PhotoLabel", component: PhotoLabel, durationInFrames: 75, thumbFrame: 50, stripFrames: [0, 1, 2, 3, 8, 14, 20, 50],
    defaultProps: { src: "demo/ffc_park_g.png", words: [{ text: "Riverside", at: 6 }, { text: "Water", at: 13 }, { text: "Park", at: 19 }] },
    ref: "Farrell text T1b baked label 'Dallas' (GF 7:22-7:32) + camera R5 flash-decay @8:33.08; wp3 sec_A ParkPhoto @ abs 852 (approved)",
    when: "A place name on a real photograph of the place. The label belongs to the photo (it pushes with it).",
    props: "src (photo), words [{text,at}], y, ink (cap px), pos, origin, rate (push/s), colour", twist: "words pop 1 f on their spoken words",
    sfx: [{ event: "white_flash_hit", at: 0, note: "optional, soft (decay entry)" }],
    axes: { geometry: "top band inside the photo", entry: "3 f flash-decay + 1 f word pops", layout: "single grotesk line", accent: "none (photo-baked, shadow only)" },
  },
  {
    family: F, name: "NameTag", component: NameTag, durationInFrames: 80, thumbFrame: 46, stripFrames: [0, 2, 5, 8, 11, 14, 20, 46],
    defaultProps: { media: "demo/clip_party.mp4", mediaStart: 90, text: "name surname", at: 2, x: 980, y: 900, track: PARTY_TRACK.map((k) => ({ ...k, y: k.y + 110 })), outAt: 70 },
    ref: "Dashcam Vol.2 E10 name label @2:32.70-2:33.35 'trucker carl bayer' (decode, box wipe L->R 0.27 s, pointer drop) + D2 17:38.5 'Brian'/'Lauren'; FONTS.md 'Name tag box'",
    when: "Naming a person in the footage (witness, driver, victim) as spoken, lowercase. Box lower-middle, pointer to the person.",
    props: "media, text (as spoken), at, x/y (box centre), track (pointer end, source px), cap, outAt", twist: "pointer end tracks the person; ghosts are the real glyphs blurred (no reflow)",
    axes: { geometry: "lower-middle box + vertical pointer", entry: "letter decode, box wipe, pointer drop", layout: "lowercase wide-tracked light", accent: "dark-red box, 2 px red border" },
  },
  {
    family: F, name: "VhsDate", component: VhsDate, durationInFrames: 100, thumbFrame: 62, stripFrames: [0, 6, 12, 18, 26, 40, 62, 90],
    defaultProps: { media: "demo/clip_crowd.mp4", words: [{ text: "MARCH", at: 10 }, { text: "3,", at: 32 }, { text: "2019", at: 42 }], place: { text: "RIVERSIDE PARK", at: 50 }, outAt: 72 },
    ref: "Abyssal (Chinese iceberg) typed VHS date @0:42.6-0:45.0 'DECEMBER 20, 2015' (study I3) + location label @0:46.5; FONTS.md 'Typed date (VHS)'",
    when: "Archive / tape / CCTV-era cases, found footage. An Abyssal signature: max once per video (Rule 0).",
    props: "media, words [{text,at}], step (f/char), cap (96), y, outAt, outDur, place {text,at}; labelCap (location tag, 38)", twist: "word-locked typing; cursor blinks on the last glyph; the plate un-blurs in the last 9 f of the fade",
    sfx: [{ event: "typing_key", at: 10, note: "one key per character" }],
    axes: { geometry: "centred mono line + bottom-right tag", entry: "typed with red block cursor over a blurring plate", layout: "VCR caps", accent: "RGB fringe + hard black shadow" },
  },
];
// new set "dash1" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash1.md)
import { extra as extra_dash1 } from "./new_dash1";
variants.push(...extra_dash1);
// new set "editorA" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_editorA.md)
import { extra as extra_editorA } from "./new_editorA";
variants.push(...extra_editorA);
