// set dash2 (Dashcam "INSTRUMENT", 2026-10-18): new lookhere variants. Merged into ./index.ts by the lead.
import type { VariantDef } from "../../core";
import { PARTY_TRACK } from "../labels";
import { WatchZone } from "./WatchZone";
import { TrackTrail } from "./TrackTrail";

const F = "lookhere";
const M = { media: "demo/clip_party.mp4", mediaStart: 90 };
export const extra: VariantDef[] = [
  {
    family: F, name: "WatchZone", component: WatchZone, durationInFrames: 100, thumbFrame: 50, stripFrames: [10, 13, 16, 20, 24, 50, 74, 88],
    defaultProps: { ...M, zone: PARTY_TRACK, r: 300, aspect: 0.8, feather: 260, at: 12, releaseAt: 72 },
    ref: "Caving @29:47.6-29:54.4 (frame dims L 87->44 = x0.5 over 12 f, release 18 f) + Farrell FV PG7 CC @4:31.3-4:37.3 (rest dims to x0.17 in 0.5 s) + Farrell FB F7 V5 @21:32.3 (soft iris 0.5 W, feather 0.15 W)",
    when: "On the VO's 'keep your eye on the wheel / roofline / that car': the viewer's eye is steered while the clip keeps running; releases on the impact.",
    props: "media, mediaStart, push, zone [{f,x,y,r?}] (source px), r, aspect, feather, at, dim (0.45), dimFrames (12), releaseAt, releaseFrames (18), theme",
    twist: "no ring and no freeze (CV has both): the clip plays at 1x, the lit zone tracks the subject through the linear push, x0.45 not x0.5",
    sfx: [],
    axes: { geometry: "feathered lit ellipse, rest of frame dimmed", entry: "12 f eased dim, 18 f release on impact", layout: "tracked zone on live footage", accent: "none: light only (x0.45 outside)" },
  },
  {
    family: F, name: "TrackTrail", component: TrackTrail, durationInFrames: 96, thumbFrame: 60, stripFrames: [4, 7, 10, 20, 34, 50, 66, 90],
    defaultProps: { ...M, track: PARTY_TRACK, at: 4, outAt: 88, label: { text: "RUNNER", at: 10, dx: 130, dy: -120, outAt: 84 } },
    ref: "Dashcam Vol.2 E3 tracked arrow @0:07.88-0:09.70 (follows at up to -424 px/s, out 5-6 f) + Dashcam Vol.1 E5 ring path @15:38.0-15:48.3 (10 s follow) + Farrell FA F7 route GM @2:57.1 (line behind a leading dot)",
    when: "Showing HOW something moved: a swerve, a loose wheel's path, a roll, a car launching off a ramp. The path stays readable for 1 s after the object passes.",
    props: "media, mediaStart, push, track [{f,x,y}] (source px), at, outAt, trailSec (1.0), width (4), dotR, label {text,at,dx,dy,cap,outAt}, theme",
    twist: "the FA route line is drawn ON the footage by the tracked object itself and fades over 1.0 s; the optional head chip is the D1 HUD callout in theme colours",
    sfx: [],
    axes: { geometry: "accent dot + fading 4 px trail", entry: "dot grows 6 f, trail accumulates", layout: "tracked, path left behind", accent: "needle-orange trail + optional theme chip" },
  },
];
