// Family "lookhere": pointing the viewer at the key moment. DD: freeze/punch/ring (D1 E6), tracked ring (D1 E5), tracked arrow (D2 E3),
// brush circle on a freeze (D3 E3), red subject tint (D2 E14), punch on moving footage + ellipse (D1 E7). One look-here per big case (D1 rule 7).
// `track` keys are SOURCE px of the 1920x1080 media (local frames); demo tracks come from an NCC tracker on demo/clip_party.mp4.
import type { VariantDef } from "../../core";
import { PARTY_TRACK } from "../labels";
import { FreezePunch } from "./FreezePunch";
import { TrackedRing } from "./TrackedRing";
import { TrackedArrow } from "./TrackedArrow";
import { FreezeCircle } from "./FreezeCircle";
import { SubjectTint } from "./SubjectTint";
import { PunchEllipse } from "./PunchEllipse";

const F = "lookhere";
const M = { media: "demo/clip_party.mp4", mediaStart: 90 };
import { CutMarkers } from "./CutMarkers";
export const variants: VariantDef[] = [
  {
    family: F, name: "FreezePunch", component: FreezePunch, durationInFrames: 140, thumbFrame: 100, stripFrames: [24, 30, 36, 44, 56, 70, 100, 122],
    defaultProps: { ...M, freezeAt: 30, target: { x: 763, y: 616 }, scale: 2.1, ringR: 330, releaseAt: 120 },
    ref: "Dashcam Vol.1 E6 @3:03.0-3:07.0 (freeze, punch x2.29, dim, ring at ~90 %, hold 2.6 s, 4 f white flash back to live); wp3 sec_A LookHere @ abs 2711, Intro3 @ abs 408",
    when: "THE key moment of a big case ('what almost nobody noticed...'). Max one per case.",
    props: "media, mediaStart, push, freezeAt, target {x,y} (source px), scale, punchDur, ringAt, ringR (screen px), releaseAt, dim",
    twist: "contrast lift with the dim; motion-blurred punch; release flash into the live clip (hard continue from the frozen frame)",
    sfx: [{ event: "ring_draw", at: 60, note: "disabled in sfx.json; DD has no measurable SFX on rings" }, { event: "white_flash_hit", at: 120 }],
    axes: { geometry: "full-frame punch + centred ring", entry: "freeze -> ease-out punch -> ring draw", layout: "target centred", accent: "dim + 11 px ring + white flash out" },
  },
  {
    family: F, name: "TrackedRing", component: TrackedRing, durationInFrames: 70, thumbFrame: 30, stripFrames: [4, 6, 7, 8, 9, 10, 30, 65],
    defaultProps: { ...M, track: PARTY_TRACK.map((k) => ({ ...k, r: 175 })), at: 6, outAt: 62 },
    ref: "Dashcam Vol.1 E5 tracked ring @0:08.45 (pickup) / @15:38-15:48 (plane): 7 px #C8060A + glow, draw 160/270/320/350/360 deg per frame, follows the object, 3 f fade; wp3 Intro3 TrackedRing @ abs 23",
    when: "A moving hazard / person while the clip plays ('a pickup swerved into her lane'). On the noun.",
    props: "media, track [{f,x,y,r}] (source px), at, outAt, r (override), core, ry (ellipse)", twist: "track in source px with the push applied, so the ring sits on the subject through the push",
    axes: { geometry: "circle on the subject", entry: "5-step clockwise draw from 12", layout: "tracked", accent: "thin 7 px core + soft glow" },
  },
  {
    family: F, name: "TrackedArrow", component: TrackedArrow, durationInFrames: 60, thumbFrame: 30, stripFrames: [4, 6, 7, 8, 10, 20, 30, 51],
    defaultProps: { ...M, track: PARTY_TRACK.map((k) => ({ ...k, y: k.y - 95 })), at: 6, outAt: 50 },
    ref: "Dashcam Vol.2 E3 red block arrow @0:07.88-0:09.70 and 0:20.6 (down at the subject, ~240 px, tilted 2 deg, appears in place, tracked, out 0.1 s)",
    when: "Pointing at something small or easy to miss in a busy frame ('ahead', 'that car'). Life 1-1.8 s.",
    props: "media, track (subject top point, source px), at, outAt, gap, size, tilt", twist: "-",
    axes: { geometry: "block arrow above the subject", entry: "in-place opacity steps", layout: "tracked, tip-down", accent: "solid red, 3 px glow" },
  },
  {
    family: F, name: "FreezeCircle", component: FreezeCircle, durationInFrames: 80, thumbFrame: 36, stripFrames: [18, 20, 22, 24, 26, 28, 36, 60],
    defaultProps: { ...M, freezeAt: 20, x: 716, y: 637, r: 300, hold: 32 },
    ref: "Dashcam Vol.3 E3 circle on a freeze @0:51.77-0:52.63 (hand-drawn #E30A10, taper-ended, draw from 1 o'clock in 12 f, scale settle 1.23 -> 0.966 -> 1) + E10 freeze 26-31 f",
    when: "A short 'this one' beat: the subject is identified while the clip holds for ~1 s, then the clip runs on. Lighter than FreezePunch.",
    props: "media, freezeAt, hold, at, x/y/r (screen px), fadeAt, stroke, seed", twist: "ribbon-polygon brush stroke (taper + breathing width) instead of a uniform stroke",
    axes: { geometry: "static brush ring", entry: "freeze + accelerating hand-drawn stroke", layout: "untracked, on the freeze", accent: "taper-ended brush red" },
  },
  {
    family: F, name: "SubjectTint", component: SubjectTint, durationInFrames: 70, thumbFrame: 40, stripFrames: [0, 6, 12, 20, 30, 40, 59, 60],
    defaultProps: { ...M, track: PARTY_TRACK, at: 4, ramp: 30, outAt: 60, rx: 330, ry: 150 },
    ref: "Dashcam Vol.2 E14 red subject tint @13:01-13:07, 14:01-14:08 (tracked mask, additive red ~R+120, ramps ~1 s, cuts off in 1 f)",
    when: "Marking the subject that will matter BEFORE the narration names it (foreshadowing); no text, no ring.",
    props: "media, track, at, ramp, outAt, rx/ry (source px), gain", twist: "feathered elliptical mask instead of a roto shape",
    axes: { geometry: "soft ellipse over the subject", entry: "1 s additive ramp, 1 f cut out", layout: "tracked", accent: "additive red light" },
  },
  {
    family: F, name: "PunchEllipse", component: PunchEllipse, durationInFrames: 75, thumbFrame: 56, stripFrames: [6, 12, 18, 24, 30, 38, 44, 56],
    defaultProps: { ...M, track: PARTY_TRACK, at: 8, scale: 2.4, dur: 45, rx: 170, ry: 80 },
    ref: "Dashcam Vol.1 E7 punch on moving footage @22:16.5-22:18.6 (C18 BMW: x4.1 in 1.5 s, peak 12.5 %/f at 0.6 s, creep after, red ellipse) + recipe I6 bezier(0.45,0,0.15,1)",
    when: "Live action you must not stop (a car moving, a person walking): punch in while it plays, ellipse around the subject.",
    props: "media, track, at, scale, dur, creep (per f), ringAt, rx/ry (source px), outAt", twist: "the camera follows the tracked target (stays framed), motion blur on the punch",
    axes: { geometry: "punched frame + ellipse", entry: "eased live punch, then creep", layout: "camera-follow", accent: "8 px ellipse ring" },
  },
  {
    family: F, name: "CutMarkers", component: CutMarkers, durationInFrames: 140, thumbFrame: 120, stripFrames: [18, 20, 21, 24, 30, 56, 62, 120],
    defaultProps: { media: "demo/clip_crowd.mp4", mediaStart: 0, cuts: [20, 56, 92], skip: 18 },
    ref: "Dashcam Vol.1 E4 HUD bracket callout @1:07.9 (Inter 700 #EF020C, words ~3 f) + DD red ring/flash language (D1 E5, 2 f pulses); map c05 #19",
    when: "Surveillance / CCTV with jump cuts when the gaps themselves matter (time missing from the record). Ticks accumulate: the count is the argument.",
    props: "media, mediaStart, cuts (local frames of the jumps), skip (frames skipped per cut, demo / pre-cut sources), push, label, hold; cap (HUD line, 36)",
    twist: "accumulating red tally ticks + 2 f red frame-edge pulse on every jump; the HUD line re-types on each cut",
    axes: { geometry: "top-left tally + HUD line", entry: "tick draw + 3 f/word HUD typing per cut", layout: "corner overlay on footage", accent: "red edge pulse" },
  },
];
// new set "dash2" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash2.md)
import { extra as extra_dash2 } from "./new_dash2";
variants.push(...extra_dash2);
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
