// set "editorA" (Amusement Park 2026-10-19, EDITOR A siblings: VV continuous-camera motion + Farrell explanation, channel/Waterpark style).
// Same D3 identity as CornerFade / CentreSettle (Nunito 900 red-gradient number in the corner, Varela-Round date / place rows, red key word);
// six different camera entrances so consecutive cases never open the same way. Merged into index.ts by tools/merge_extras.py.
import type { VariantDef } from "../../core";
import { DriftOpen_A } from "./DriftOpen_A";
import { PullOpen_A } from "./PullOpen_A";
import { RackOpen_A } from "./RackOpen_A";
import { SlideOpen_A, TiltOpen_A, IrisOpen_A } from "./MoveOpens_A";

const RULES = "Owner rules: always on the case's own first footage (never on black); hold the number + rows >= 3 s; rotate the six Editor A entrances so no two consecutive cases open alike; Waterpark channel style only.";
const PROPS = "number, media, mediaStart, push, numberAt, numberOut, dateWords/placeWords [{text,at,red}], dateOut, placeOut";
const SFX = [{ event: "case_number_hit", at: 2, note: "first visible number frame (the caller's cue)" }];
const words = (date: [string, string, string], place: [string, string], pAt: number) => ({
  dateWords: [{ text: date[0], at: 6 }, { text: date[1], at: 11 }, { text: date[2], at: 17, red: true }],
  placeWords: [{ text: place[0], at: pAt }, { text: place[1], at: pAt + 8, red: true }],
});

export const extra: VariantDef[] = [
  {
    family: "caseopener", name: "DriftOpen-A", component: DriftOpen_A, durationInFrames: 130, thumbFrame: 66, stripFrames: [0, 2, 6, 10, 18, 30, 66, 110],
    defaultProps: { number: "7", media: "demo/clip_park.mp4", band: 0.55, numberAt: 2, numberOut: 104, dateOut: 52, placeOut: 112, ...words(["July", "14,", "2015"], ["Lakeside,", "Ohio"], 58) },
    ref: "VV 2026 continuous world camera (truck inside the linear push) + D3 E1 corner number / DD wordRise rows; UPGRADES #21 optional one-second freeze. Used AP C10 / C19A opener.",
    when: "Case opener on a wide establishing shot with lateral room (an entrance sign, a midway). " + RULES,
    props: PROPS + ", cap, band, truck, labelY, freeze {at,hold}, plateFilter",
    twist: "footage trucks sideways -26 px/s while the number decelerates in from the right on a nearer parallax layer (1.18 -> 1 settle, defocus 9 -> 0); rows ride a middle layer",
    sfx: SFX,
    axes: { geometry: "D3 corner number on a nearer parallax layer", entry: "number decelerates in from the right, 1.18 -> 1 + defocus", layout: "trucking plate + centred band rows (0.6x truck)", accent: "red-gradient number + red key word, parallax depth" },
  },
  {
    family: "caseopener", name: "PullOpen-A", component: PullOpen_A, durationInFrames: 130, thumbFrame: 70, stripFrames: [0, 2, 6, 12, 24, 40, 70, 110],
    defaultProps: { number: "16", media: "demo/clip_crowd.mp4", focus: { x: 1000, y: 400 }, numberAt: 2, numberOut: 108, dateOut: 56, placeOut: 112, ...words(["March", "3rd,", "2019"], ["Riverside,", "Texas"], 70) },
    ref: "VV 11 world camera 'quick start / long settle' (pull back x1.32 -> x1.04 over 40 f, EZ.quick) + D3 corner number + DD sequential centred rows. Used AP C12 opener.",
    when: "Case opener where the subject is small in a big frame (a platform, a tower top): start close on it and reveal the scene. " + RULES,
    props: PROPS + ", cap, band, focus {x,y}, pull, labelY, plateFilter",
    twist: "the shot opens close on `focus` and pulls back; the number lands from x1.45 with a 1 f white edge flash and 8 px defocus clearing",
    sfx: SFX,
    axes: { geometry: "close-on-focus plate pulling back to wide", entry: "camera pull-back x1.32 -> 1.04 + number from x1.45", layout: "corner number + centred rows one at a time", accent: "1 f white edge flash on the landing number" },
  },
  {
    family: "caseopener", name: "RackOpen-A", component: RackOpen_A, durationInFrames: 130, thumbFrame: 70, stripFrames: [0, 2, 8, 14, 20, 26, 70, 110],
    defaultProps: { number: "15", media: "demo/clip_fire.mp4", numberAt: 2, numberOut: 108, dateOut: 54, placeOut: 112, ...words(["May", "25,", "2021"], ["Kingsport,", "Florida"], 60) },
    ref: "VV 'rack open' (out-of-focus open, 14 px -> 0 over 26 f) + constant +22 px/s tilt down inside the push; D3 corner number; DD wordRise rows lower-left. Used AP C06 / C16 opener.",
    when: "Case opener on aftermath / drone / wreck footage where a focus pull reads as 'finding' the scene. " + RULES,
    props: PROPS + ", cap, band, tilt, rack, plateFilter",
    twist: "the plate racks into focus while the camera tilts down; the number rises 60 px into the corner with a defocus clearing in step with the rack; rows sit LEFT in the lower third",
    sfx: SFX,
    axes: { geometry: "corner number + lower-left row block", entry: "focus rack 14 -> 0 px + number rise 60 px", layout: "left lower-third rows (0.1 W, 0.74 H), word by word", accent: "defocus clearing in step with the rack" },
  },
  {
    family: "caseopener", name: "SlideOpen-A", component: SlideOpen_A, durationInFrames: 130, thumbFrame: 66, stripFrames: [0, 2, 5, 9, 14, 24, 66, 110],
    defaultProps: { number: "19", media: "demo/clip_party.mp4", numberAt: 2, numberOut: 108, dateOut: 52, placeOut: 112, ...words(["July", "23,", "2023"], ["Harbor", "Bay"], 58) },
    ref: "VV 2026 lateral whip entrance (420 px on EZ.quick, 14 px motion blur clearing) then a -20 px/s truck; D3 corner number from the left edge. Used AP C02 / C20 opener.",
    when: "Case opener on footage that already moves sideways (a spinning ride, a crowd pan) so the whip carries into it. " + RULES,
    props: PROPS + ", cap, band, labelY, focus, plateFilter",
    twist: "the whole shot slides in from the right with motion blur and keeps trucking left; the number slides in from the left edge (opposing directions)",
    sfx: SFX,
    axes: { geometry: "corner number crossing against the plate", entry: "420 px lateral whip of the shot + number from the left edge", layout: "centred DD band rows under a trucking plate", accent: "14 px motion-blur smear clearing" },
  },
  {
    family: "caseopener", name: "TiltOpen-A", component: TiltOpen_A, durationInFrames: 130, thumbFrame: 66, stripFrames: [0, 2, 8, 16, 26, 34, 66, 110],
    defaultProps: { number: "20", media: "demo/clip_fire.mp4", mediaStart: 30, focus: { x: 960, y: 380 }, numberAt: 2, numberOut: 108, dateOut: 52, placeOut: 112, ...words(["May", "1,", "2001"], ["North", "Valley"], 58) },
    ref: "VV 2026 tilt-up entrance (plate travels 260 px up on EZ.quick over 34 f, then -8 px/s drift); number drops 70 px into the D3 corner as the tilt lands. Used AP C17 / C18 opener.",
    when: "Case opener on a tall subject (smoke column, tower, drop ride): the camera tilts up onto it. " + RULES,
    props: PROPS + ", cap, band, labelY, focus, plateFilter",
    twist: "vertical camera entrance instead of lateral; the number drops in from above timed to the tilt landing",
    sfx: SFX,
    axes: { geometry: "corner number over an upward-travelling plate", entry: "260 px tilt-up of the shot + number drops 70 px", layout: "centred DD band rows", accent: "tilt landing synced to the number drop" },
  },
  {
    family: "caseopener", name: "IrisOpen-A", component: IrisOpen_A, durationInFrames: 130, thumbFrame: 66, stripFrames: [0, 4, 10, 16, 22, 30, 66, 110],
    defaultProps: { number: "18", media: "demo/clip_crowd.mp4", focus: { x: 960, y: 420 }, numberAt: 2, numberOut: 108, dateOut: 52, placeOut: 112, ...words(["August", "18,", "2024"], ["Port", "City"], 58) },
    ref: "VV 2026 soft iris reveal (radial mask 0 -> full over 30 f on `focus`, linear push inside); number fades up as the iris passes the D3 corner. Used AP C01 opener.",
    when: "Case opener when the case's first image has one clear centre of interest (a tower, a ride car) to open the frame around. " + RULES,
    props: PROPS + ", cap, band, labelY, focus {x,y}, plateFilter",
    twist: "the frame opens through a soft radial iris centred on the subject; the number appears when the iris edge reaches the corner",
    sfx: SFX,
    axes: { geometry: "radial reveal centred on the subject", entry: "soft iris mask 0 -> full over 30 f", layout: "corner number + centred band rows", accent: "feathered iris edge passing the number" },
  },
];
