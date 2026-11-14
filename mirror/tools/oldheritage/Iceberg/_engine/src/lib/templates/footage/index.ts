// Family "footage": how a raw clip is presented. DD first: linear-push hold with targeted blurs, replay hand-over, PiP second camera, vertical
// clip with blur fill (D3, = Abyssal panel); VV CRT set for broadcast news. Linear push on footage only (never eased); all frames local.
import type { VariantDef } from "../../core";
import { DashHold } from "./DashHold";
import { CrtTv } from "./CrtTv";
import { PhonePanel } from "./PhonePanel";
import { Replay } from "./Replay";
import { PipCam } from "./PipCam";
import { Letterbox } from "./Letterbox";

const F = "footage";
// demo face tracks on demo/clip_crowd.mp4 from source frame 84 (NCC-tracked, source px)
const FACES = [
  [[0, 1094, 930], [2, 1108, 941], [4, 1127, 951], [6, 1139, 951], [8, 1140, 949], [10, 1137, 953], [12, 1132, 956], [14, 1125, 961], [16, 1120, 976], [18, 1113, 992], [20, 1108, 1007], [22, 1100, 1012], [24, 1092, 1012], [26, 1084, 1012], [28, 1072, 1012], [30, 1056, 1012], [32, 1041, 1012], [34, 1036, 1012], [36, 1034, 1012], [38, 1015, 1012], [40, 987, 1012], [42, 960, 1012], [44, 939, 1008], [46, 922, 998]],
  [[0, 1533, 883], [2, 1543, 901], [4, 1558, 915], [6, 1562, 908], [8, 1551, 897], [10, 1536, 897], [12, 1520, 900], [14, 1504, 905], [16, 1488, 924], [18, 1477, 943], [20, 1473, 955], [22, 1472, 967], [24, 1472, 980], [26, 1472, 992], [28, 1474, 1004], [30, 1472, 1012], [32, 1473, 1012], [34, 1480, 1012], [36, 1483, 1012], [38, 1471, 1012], [40, 1448, 1012], [42, 1424, 1012], [44, 1400, 1012], [46, 1379, 1009]],
  [[0, 1683, 899], [2, 1708, 916], [4, 1739, 926], [6, 1759, 912], [8, 1764, 894], [10, 1763, 892], [12, 1759, 892], [14, 1752, 893], [16, 1744, 904], [18, 1736, 920], [20, 1728, 936], [22, 1719, 952], [24, 1704, 968], [26, 1688, 983], [28, 1668, 996], [30, 1645, 1010], [32, 1632, 1012], [34, 1628, 1012], [36, 1623, 1012], [38, 1607, 1012], [40, 1584, 1012], [42, 1563, 1012], [44, 1544, 1012], [46, 1530, 1009]],
].map((k) => ({ keys: k.map(([f, x, y]) => ({ f, x, y })), rx: 70, ry: 88, px: 18 }));
export const variants: VariantDef[] = [
  {
    family: F, name: "DashHold", component: DashHold, durationInFrames: 60, thumbFrame: 16, stripFrames: [0, 8, 16, 24, 32, 46],
    defaultProps: { media: "demo/clip_crowd.mp4", mediaStart: 84, blurs: FACES },
    ref: "Dashcam Vol.1 linear push hold +4.5 %/s (e.g. @0:42.21-0:45.21) + D1 C targeted censor blurs; wp3 sec_B/sec_C Shot + EBlur (approved)",
    when: "Default for every raw clip under narration (45 % of a case). Blur faces of bystanders / injured people, targeted, tracked.",
    props: "media, mediaStart, push, base, origin, blurs [{keys [{f,x,y}] source px, rx, ry, px, from, to}], filter", twist: "blurs tracked in source px and carried by the push",
    axes: { geometry: "full frame", entry: "hard cut", layout: "-", accent: "feathered elliptical face blurs" },
  },
  {
    family: F, name: "CrtTv", component: CrtTv, durationInFrames: 90, thumbFrame: 45, stripFrames: [0, 30, 60, 89],
    defaultProps: { media: "demo/clip_fire.mp4", mediaStart: 60 },
    ref: "Visual Venture §14 CRT / TV push @0:03.0 (+1.0 %/s linear, +0.18 deg/s, CRT shader on the screen only) and @1:03.0 (room +2.8 %/s)",
    when: "Broadcast / archive news clips ('it was all over the news'). Max 1-2 per video; cut in and out hard.",
    props: "media, mediaStart, rate (/s), rot (deg/s), screenW, spill 'r,g,b', bw", twist: "drawn 4:3 set (no stock), curved glass, misconvergence, 2 % flicker, light spill",
    axes: { geometry: "4:3 tube set on black", entry: "hard cut + constant drift", layout: "object in space", accent: "scanlines, glass glare, screen spill" },
  },
  {
    family: F, name: "PhonePanel", component: PhonePanel, durationInFrames: 95, thumbFrame: 40, stripFrames: [0, 40, 80, 94],
    defaultProps: { media: "demo/clip_vertical.mp4" },
    ref: "Dashcam Vol.3 I14 vertical clip (case 15 @12:22-12:26, blur fill sigma 30, -35 %) + Abyssal I8 vertical blur fill (@33:28-34:56, panel x .311-.686, sides blurred ~40 px at 10-35 % luma)",
    when: "Every vertical phone clip (eyewitness, social). Never black bars.",
    props: "media, mediaStart, push, panelW (720 Abyssal / 607 native), blur, dim, pos", twist: "both layers share the clip clock and the linear push",
    axes: { geometry: "centre vertical panel", entry: "hard cut", layout: "panel over its own blur", accent: "hard edge, dark blurred wings" },
  },
  {
    family: F, name: "Replay", component: Replay, durationInFrames: 150, thumbFrame: 100, stripFrames: [60, 74, 75, 76, 90, 120, 149],
    defaultProps: { media: "demo/clip_fire.mp4", mediaStart: 30, cutAt: 75, back: 60, mode: "pullout" },
    ref: "Dashcam Vol.1 E8 / I12 replay hand-over (cut +0.22 s after the last word, back 3.5-29.4 s, no overlays/label/slow-mo) + Dashcam Vol.2 E1 replay pull-out @0:16.85 (170 -> 100 % linear in 3.03 s, hard stop)",
    when: "Handing the clip over to its own sound: after the narration describes the event, show it again. About half of all hand-overs in DD. Host: step the clip audio +12..+23 dB within 3 f at cutAt (no SFX).",
    props: "media, mediaStart, cutAt (first replay frame), back (frames rewound), mode cut|pullout|dip, push, pullFrom, pullDur",
    twist: "three DD modes in one device",
    axes: { geometry: "full frame", entry: "hard cut back / linear pull-out / short blur-dip", layout: "-", accent: "none (DD: no replay graphics)" },
  },
  {
    family: F, name: "PipCam", component: PipCam, durationInFrames: 150, thumbFrame: 20, stripFrames: [0, 20, 40, 60, 90, 120, 135, 136],
    defaultProps: { media: "demo/clip_park.mp4", pip: "demo/clip_crowd.mp4", growAt: 30, growDur: 60, shrinkAt: 95, shrinkDur: 36, outAt: 136 },
    ref: "Dashcam Vol.3 E9 / I12 PiP (case 3 @2:37-2:43.4, top-right 0.459 W, 10 px red border #CA000C + shadow, leaves on a flash) + Dashcam Vol.2 E6 PiP grow/shrink @7:26.87 (beziers .40,.22,0,.92 / .47,.12,.01,.85)",
    when: "Two cameras of one event (dashcam + cabin, phone + CCTV). Grow the PiP when the story moves to it.",
    props: "media, pip, pipStart, push, rest (0.459 W), big, growAt/growDur, shrinkAt/shrinkDur, outAt (4 f white flash), side", twist: "-",
    sfx: [{ event: "white_flash_hit", at: 136, note: "only if outAt is used" }],
    axes: { geometry: "corner inset", entry: "with the scene; eased grow/shrink", layout: "top-right (or left)", accent: "solid red 10 px border" },
  },
  {
    family: F, name: "Letterbox", component: Letterbox, durationInFrames: 90, thumbFrame: 45, stripFrames: [0, 30, 60, 89],
    defaultProps: { media: "demo/clip_fire.mp4", mediaStart: 40, src: { x: 0, y: 60, w: 1920, h: 760 } },
    ref: "Abyssal I8 phone panel over its blurred copy (@33:28-34:56) + Dashcam Vol.3 I14 vertical-clip blur fill, turned horizontal (scope band); study/full/new_variants.md footage-Letterbox, map_c12 #5/#7/#9/#13/#16",
    when: "News / social clips with burned-in captions or chyrons (crop them out with src), scope-ratio phone or drone clips. Never black bars.",
    props: "media, mediaStart, src {x,y,w,h} (source px shown in the band), cy, bandH, push, bgPush, blur, dim, shadow, blurs (tracked, source px)",
    twist: "band-edge shadow + top light catch, content pushes inside the band while the plate drifts slower (parallax depth), tracked blurs carried through the crop",
    axes: { geometry: "full-width horizontal band", entry: "hard cut", layout: "band over its own blur", accent: "soft edge shadow, dark blurred plate" },
  },
];
// new set "dash2" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_dash2.md)
import { extra as extra_dash2 } from "./new_dash2";
variants.push(...extra_dash2);
// new set "midway" (2026-10-18, Dashcam/AmusementPark identities; see _shared_tools/templates_midway.md)
import { extra as extra_midway } from "./new_midway";
variants.push(...extra_midway);
