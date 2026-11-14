// Dashcam #18 - near Santiago, Chile (Colina reported, unconfirmed), Sat 26 Feb 2022 00:30: on an exit ramp down to an underpass the
// car ahead stops dead, men jump out, and the dashcam driver floors it through the gap on the right, clipping their open door.
// One source: kKJiY7uYvgw (Wild Crazy Clips, repost of a Reddit original), 640x352 -> cropped 608x342 (16:9, the camera's own date
// stamp kept bottom-left). rawclean.py: music over almost all of it -> voices + impacts only, plus real SFX at the door strike.
// VO = one take (CASE18.mp3), split only at the one raw:
//   A 0-36.55 @4.00 | RAW 40.55-60.55 (src 81.5-101.5: the car ahead stops at the bottom, men out, the swerve, the door, the underpass)
//   | B 36.55-end @60.55, VO ends 89.45, hold to 90.3.
// Devices: DashRing (Colina, unconfirmed), HalfSecond (half-speed replay, held on the men), GapStrip (the gap he left).
import React from "react";
import { RedLabel } from "../brand";
import { type FxCut } from "../lib/templates/n2fx/fx";
import { Cam } from "../dev/DC01_kit";
import { CaseRunner, type CaseDef, F, K, type Sh } from "../dev/DC17_kit";
import { DashRing } from "../dev/DC18_DashRing";
import { HalfSecond } from "../dev/DC18_HalfSecond";
import { GapStrip } from "../dev/DC18_GapStrip";

const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
export const DUR = F(90.3);

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.68, vo: "In Chile there's a word for boxing a driver in on the road to rob them. They call it an encerrona. (night motorway)",
    node: (n) => <Cam src={M} from={2.0} keys={K(n, [1.22, 0.5, 0.38], [1.32, 0.5, 0.36])} /> },
  { a: 9.68, b: 18.09, vo: "This dashcam's stamp reads February 26, 2022, just after half past midnight, on a motorway near Santiago. (down to the stamp)",
    node: (n) => <Cam src={M} from={22.0} keys={[{ f: 0, s: 1.22, x: 0.5, y: 0.38 }, { f: 40, s: 1.22, x: 0.5, y: 0.38 }, { f: 100, s: 2.4, x: 0.2, y: 0.97 }, { f: n, s: 2.5, x: 0.2, y: 0.97 }]} />,
    over: <RedLabel text="NEAR SANTIAGO, CHILE" at={F(6.9)} y={0.12} /> },
  { a: 18.09, b: 22.80, vo: "One upload places it near Colina, though the exact road hasn't been confirmed. (DashRing)",
    node: () => <DashRing src={GR + "s2.jpg"} iw={1280} ih={1280} from={[504, 760]} to={[497, 368]} z0={1.3} z1={1.55} r={70} ringAt={40} label="COLINA, NORTH OF SANTIAGO" labelAt={66} /> },
  { a: 22.80, b: 29.62, vo: "A post shared with the clip said ... drivers there leave a gap on exit ramps after dark. (cars ahead, tail lights)",
    node: (n) => <Cam src={M} from={12.0} keys={K(n, [1.3, 0.48, 0.4], [1.45, 0.5, 0.38])} /> },
  { a: 29.62, b: 33.14, vo: "The driver takes an exit ramp curving down toward an underpass, (the ramp curving)",
    node: (n) => <Cam src={M} from={64.5} keys={K(n, [1.25, 0.5, 0.4], [1.35, 0.55, 0.4])} /> },
  { a: 33.14, b: 37.57, vo: "and the car ahead starts braking harder than it needs to. He hangs back. (the car ahead on the ramp)",
    node: (n) => <Cam src={M} from={73.5} keys={K(n, [1.35, 0.6, 0.4], [1.6, 0.66, 0.38])} /> },
  { a: 37.57, b: 40.55, vo: "Look at that car's doors when it reaches the bottom of the ramp. (punch in on the car ahead)",
    node: (n) => <Cam src={M} from={78.2} keys={K(n, [1.9, 0.6, 0.36], [2.1, 0.58, 0.36])} /> },
  // RAW: the bottom of the ramp, the men, the swerve and the door, the underpass
  { a: 40.55, b: 60.55, vo: "RAW (src 81.5-101.5)", node: (n) => <Cam src={M} from={81.5} keys={K(n, [1.22, 0.5, 0.38], [1.3, 0.5, 0.38])} /> },
  { a: 60.55, b: 68.02, vo: "He didn't wait to find out what the men wanted. That trap only works if the driver hesitates, and he didn't give them half a second. (HalfSecond)",
    node: (n) => <HalfSecond src={M} from={89.6} freezeAt={96} resumeAt={161} box={[0.38, 0.3, 0.63, 0.46]} keys={K(n, [1.3, 0.5, 0.42], [1.75, 0.52, 0.4])} /> },
  { a: 68.02, b: 74.03, vo: "The month before, robberies of vehicles involving violence or threats had jumped 52 percent in Chile. (motorway, city lights)",
    node: (n) => <Cam src={M} from={40.0} keys={K(n, [1.25, 0.5, 0.4], [1.38, 0.52, 0.36])} /> },
  { a: 74.03, b: 76.45, vo: "No arrest was reported for this one. (driving away after the underpass)",
    node: (n) => <Cam src={M} from={102.0} keys={K(n, [1.25, 0.5, 0.4], [1.32, 0.5, 0.4])} /> },
  { a: 76.45, b: 80.55, vo: "Earlier that month, after a similar case, police advised skipping needless late night trips (the motorway)",
    node: (n) => <Cam src={M} from={26.0} keys={K(n, [1.25, 0.5, 0.4], [1.35, 0.46, 0.4])} /> },
  { a: 80.55, b: 84.65, vo: "and watching for cars acting oddly ahead. (a car ahead)",
    node: (n) => <Cam src={M} from={52.0} keys={K(n, [1.45, 0.5, 0.38], [1.6, 0.5, 0.36])} /> },
  { a: 84.65, b: 90.3, vo: "That gap is what got him out, and it's a habit I'd pick up on my first night driving there. (GapStrip)",
    node: (n) => <GapStrip src={M} t={88.3} at={12} near={[[0.31, 0.64], [0.72, 0.64]]} far={[[0.49, 0.4], [0.59, 0.4]]} keys={K(n, [1.2, 0.5, 0.45], [1.42, 0.52, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.68), kind: "blurDip", len: 10 }, { at: F(18.09), kind: "glitch", len: 10 }, { at: F(22.80), kind: "glitch", len: 10 },
  { at: F(29.62), kind: "blurDip", len: 10 }, { at: F(33.14), kind: "blurDip", len: 10 }, { at: F(37.57), kind: "blurDip", len: 10 },
  { at: F(40.55), kind: "blurDip", len: 10 }, { at: F(60.55), kind: "blurDip", len: 12 }, { at: F(68.02), kind: "blurDip", len: 12 },
  { at: F(74.03), kind: "blurDip", len: 10 }, { at: F(76.45), kind: "blurDip", len: 10 }, { at: F(80.55), kind: "blurDip", len: 10 },
  { at: F(84.65), kind: "blurDip", len: 12 },
];

const def: CaseDef = {
  title: "THE RAMP OUTSIDE SANTIAGO", titleBg: GR + "title.jpg", vo: "vor/CASE18.mp3", clean: C + "media/main_clean.wav", dur: 90.3,
  shots: SHOTS, cuts: CUTS,
  parts: [[4.0, 0, 36.55], [60.55, 36.55, null]],
  raws: [{ a: 40.55, b: 60.55, src: 81.5, g: 6, duck: 0.15 }],
  // the door strike (src 92.1) and the engine floored (src 91.6)
  sfx: [[3.95, "sfx_n2/glitch_02.wav", -24], [18.04, "sfx_n2/glitch_01.wav", -30], [22.75, "sfx_n2/glitch_03.wav", -30],
    [50.6, "sfx_n2/real/car_engine_2.wav", -16], [51.15, "sfx_n2/real/metal_clank_2.wav", -12], [51.2, "sfx_n2/real/impact_2.wav", -18]],
  beds: [[40.55, 50.6, "sfx_n2/real/car_engine_4.wav", -26]],
  music: { file: "music/Music 4.mp3", db: -21, passes: [[4.0, 90.3, 6]] },
};

export const Comp: React.FC = () => <CaseRunner c={def} />;
