// Dashcam #01 — Hardwick, Vermont, 14 Jun 2022 ~7 PM: two Vermont State Police troopers try to arrest Brandon Tallman on the family's
// driveway off Scott Road; his mother holds on to him, and his father Wayne swings the family excavator's bucket over the troopers and
// their cruiser. One source: the VSP cruiser dashcam (public release, 23 Jun 2022) via BklynBadBoy911 (gqSNMka5eqI), 1280x720, used
// 0:00-1:27.35 only (after it: the uploader's booking-photo inset and end card). Its sound is digital silence until 0:40, then engine hum,
// then police radio from 1:22 ("all available units..."); no music (rawclean.py: none found). Troopers unnamed (handle-with-care).
// VO = one take (CASE01.mp3, no count word), split only at the two raws:
//   A 0-53.62 @4.00 | R1 57.62-71.12 (src 0.0-13.5: the arm rises, the bucket comes up over the cruiser and starts to swing) |
//   B 53.62-58.63 @71.12 | R2 76.13-99.48 (src 64.0-87.35, main raw: the bucket swings, sweeps down over the people on the ground,
//   a trooper stands and aims at the cab, the radio calls for all units) | C 58.63-end @99.48, VO ends 168.25, hold to 169.1.
// Footage windows under the VO avoid both raw ranges (src 14-63) except the deliberate 0.5x replay of the sweep (C1) and its frozen
// bottom (DropShaft). Stills: USGS NAIP (public domain), Hardwick N Main St (Wikimedia Commons, public domain), Caledonia County
// Courthouse (AlexiusHoratius, CC BY-SA 3.0). Teasers: c07 Pinellas Sheriff dashcam (plane, Clearwater 2017), c08 Ball PD (2006).
// Devices: DriveUp (aerial driveway trace), ArmKeep (held first frame, travel to the TALLMAN name on the stick, colour kept only on the
// arm), PressClip (real CBS page as torn clippings in 3-D), PressProof (real WCAX page as a tilted sheet, plea paragraph peels up),
// DropShaft (frozen sweep bottom, plumb line). v2 (owner 13 Nov): re-typed ChargeSheet removed, real page captures instead.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { DriveUp } from "../dev/DC01_DriveUp";
import { ArmKeep } from "../dev/DC01_ArmKeep";
import { PressClip } from "../dev/DC01_PressClip";
import { PressProof } from "../dev/DC01_PressProof";
import { DropShaft } from "../dev/DC01_DropShaft";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(169.1);

/** a still filling the frame with a slow eased push toward fx/fy */
const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};
/** two-key camera: from (s,x,y) to (s,x,y) over the shot */
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 11.74, vo: "On the evening of June 14, 2022, two VSP troopers drove up a dirt driveway on Scott Road in Hardwick. (DriveUp: NAIP, driveway traced, house boxed)",
    node: () => <DriveUp src={GR + "naip.jpg"} iw={2400} ih={1350} z0={1.0} z1={1.75} focus0={[1250, 640]} focus1={[1200, 560]}
      path={[[1650, 390], [1500, 336], [1344, 278], [1140, 324], [1020, 372], [948, 444], [924, 516], [1008, 600], [1080, 642]]}
      box={[1105, 625, 1255, 740]} traceAt={128} traceLen={56} boxAt={190}
      labels={[{ text: "JUNE 14, 2022", at: 12, hold: 78 }, { text: "SCOTT ROAD, HARDWICK", at: 186 }]} /> },
  { a: 11.74, b: 15.78, vo: "It's a town of about 3,000 people in the state's Northeast Kingdom. (Hardwick, North Main Street, hills behind)",
    node: (n) => <Still src={GR + "town.jpg"} n={n} s0={1.03} s1={1.12} fx={0.55} fy={0.45} />, over: <RedLabel text="HARDWICK, VERMONT" at={F(0.5)} hold={F(3.0)} /> },
  { a: 15.78, b: 19.52, vo: "They'd come for one man. Brandon Tallman, 24, (dashcam: tight on the troopers holding him on the driveway)",
    node: (n) => <Cam src={M} from={15.0} keys={K(n, [2.2, 0.48, 0.68], [2.35, 0.48, 0.69])} />, over: <RedLabel text="BRANDON TALLMAN, 24" at={F(1.7)} hold={F(1.9)} /> },
  { a: 19.52, b: 24.40, vo: "was wanted in an assault and burglary investigation from Woodbury, the next town over. (the STATE POLICE SUV and the troopers beside it)",
    node: (n) => <Cam src={M} from={33.5} keys={K(n, [1.75, 0.53, 0.66], [1.85, 0.5, 0.66])} /> },
  { a: 24.40, b: 27.17, vo: "It should've been a simple pickup, and it wasn't. (wider: the driveway, the struggle beside the SUV)",
    node: (n) => <Cam src={M} from={44.0} keys={K(n, [1.42, 0.64, 0.6], [1.5, 0.62, 0.62])} /> },
  { a: 27.17, b: 32.48, vo: "When the troopers took hold of Brandon, his mother, Amy, grabbed her son and wouldn't let go. (tight on the pile)",
    node: (n) => <Cam src={M} from={18.5} keys={K(n, [2.6, 0.45, 0.72], [2.8, 0.45, 0.72])} />, over: <RedLabel text="AMY TALLMAN" at={F(2.6)} hold={F(2.3)} /> },
  { a: 32.48, b: 36.60, vo: "Within seconds the troopers were down on the driveway wrestling with both of them. (low and wider across the dirt)",
    node: (n) => <Cam src={M} from={49.5} keys={K(n, [1.6, 0.56, 0.78], [1.72, 0.52, 0.76])} /> },
  { a: 36.60, b: 42.06, vo: "The dashcam in a cruiser parked behind the police SUV is pointed right at the struggle. (tilt up from our own hood to the struggle)",
    node: (n) => <Cam src={M} from={55.5} keys={[{ f: 0, s: 1.9, x: 0.6, y: 0.95 }, { f: 25, s: 1.9, x: 0.6, y: 0.95 }, { f: n - 20, s: 1.45, x: 0.64, y: 0.6 }, { f: n, s: 1.45, x: 0.64, y: 0.6 }]} /> },
  { a: 42.06, b: 44.42, vo: "While the troopers were tied up on the ground, (tight, the troopers on top)",
    node: (n) => <Cam src={M} from={26.5} keys={K(n, [2.3, 0.5, 0.72], [2.4, 0.5, 0.72])} /> },
  { a: 44.42, b: 57.62, vo: "Brandon's father, Wayne, ... climbed into the family's excavator. Keep your eye on the long orange arm ... (ArmKeep on frame 0)",
    node: (n) => <ArmKeep src={M} t={0} mask={GR + "arm_in.png"} maskOut={GR + "arm_out.png"} drainAt={214} drainLen={24} backAt={F(12.35)} backLen={18}
      keys={[{ f: 0, s: 2.3, x: 0.47, y: 0.7 }, { f: 22, s: 2.3, x: 0.47, y: 0.7 }, { f: 72, s: 2.7, x: 0.18, y: 0.37 }, { f: 205, s: 2.9, x: 0.18, y: 0.37 },
        { f: 252, s: 1.12, x: 0.3, y: 0.5 }, { f: F(12.0), s: 1.1, x: 0.3, y: 0.5 }, { f: n - 2, s: 1.0, x: 0.5, y: 0.5 }]}>
      <RedLabel text="WAYNE TALLMAN, 52" at={F(1.2)} hold={F(4.6)} />
    </ArmKeep> },
  // RAW 1: the arm rises behind the cruiser, the bucket lifts over its roof and starts to swing (source silent: engine bed SFX)
  { a: 57.62, b: 71.12, vo: "RAW 1 (src 0.0-13.5)", node: (n) => <Cam src={M} from={0} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.25, 0.38])} /> },
  { a: 71.12, b: 76.13, vo: "Police later said Wayne moved the bucket recklessly near the troopers and their cruisers. (the bucket over the cruiser roof, troopers right)",
    node: (n) => <Cam src={M} from={30.0} keys={K(n, [1.45, 0.34, 0.42], [1.55, 0.34, 0.44])} /> },
  // RAW 2 (main): swing -> sweep down over the pile -> a trooper stands and aims at the cab -> radio: all available units
  { a: 76.13, b: 99.48, vo: "RAW 2 (src 64.0-87.35)", node: (n) => <Cam src={M} from={64.0} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(9.5), s: 1.06, x: 0.42, y: 0.45 }, { f: n, s: 1.12, x: 0.45, y: 0.55 }]} /> },
  { a: 99.48, b: 103.07, vo: "No shot was fired, and nobody on either side was hurt. (0.5x replay of the sweep, pushing in)",
    node: (n) => <Cam src={M} from={74.2} rate={0.5} keys={K(n, [1.5, 0.45, 0.42], [1.85, 0.46, 0.55])} /> },
  { a: 103.07, b: 105.76, vo: "Brandon was arrested, and so was Wayne. (the troopers pinning Brandon)",
    node: (n) => <Cam src={M} from={60.0} keys={K(n, [2.1, 0.47, 0.7], [2.2, 0.47, 0.71])} /> },
  { a: 105.76, b: 108.23, vo: "Amy was cited for impeding an officer. (tight on the pair on the ground)",
    node: (n) => <Cam src={M} from={22.0} keys={K(n, [2.8, 0.43, 0.74], [2.95, 0.43, 0.74])} /> },
  { a: 108.23, b: 115.77, vo: "When State Police released the video nine days later, a commander admitted ... (PressClip: CBS News, 24 Jun 2022, headline + quote clippings)",
    node: () => <PressClip bg={M} bgFrom={38.0} bgKeys={K(F(7.54), [1.05, 0.5, 0.5], [1.12, 0.42, 0.45])} head={GR + "cbs_head.png"} headW={1172} headH={562}
      quote={GR + "cbs_quote.png"} quoteW={1322} quoteH={196} quoteAt={88} /> },
  { a: 115.77, b: 119.89, vo: "Wayne was first charged with attempted murder, but that count was dropped. (the bucket hanging over the cruiser and the troopers, wide)",
    node: (n) => <Cam src={M} from={46.0} keys={K(n, [1.3, 0.36, 0.45], [1.4, 0.33, 0.43])} /> },
  { a: 119.89, b: 129.17, vo: "In September 2022 he pleaded guilty to three felonies, ... aggravated assault with a deadly weapon. (PressProof: WCAX, the plea paragraph lifts)",
    node: () => <PressProof bg={M} bgFrom={50.0} bgKeys={K(F(9.28), [1.1, 0.5, 0.5], [1.15, 0.45, 0.5])} sheet={GR + "wcax_sheet.png"} sw={1980} sh={1936}
      para={[40, 1666, 1940, 1836]} keep={[1358, 1728]} liftAt={66} /> },
  { a: 129.17, b: 131.03, vo: "The weapon was the excavator. (push into the bucket)", node: (n) => <Cam src={M} from={62.0} keys={K(n, [2.1, 0.2, 0.22], [2.45, 0.19, 0.2])} /> },
  { a: 131.03, b: 135.58, vo: "He got two to four years, all of it suspended except 90 days in jail. (the boom's foot and the cab behind the SUV)",
    node: (n) => <Cam src={M} from={57.0} keys={K(n, [2.0, 0.27, 0.42], [2.15, 0.28, 0.44])} /> },
  { a: 135.58, b: 139.85, vo: "Both troopers told the court that was too light, and I can't say I blame them. (the two troopers)",
    node: (n) => <Cam src={M} from={52.0} keys={K(n, [1.95, 0.52, 0.66], [2.05, 0.5, 0.67])} /> },
  { a: 139.85, b: 145.69, vo: "Ninety days for swinging a steel bucket over two officers wrestling on the ground ... (DropShaft, frozen at the sweep's bottom)",
    node: (n) => <DropShaft src={M} t={76.4} at={8} keys={K(n, [1.1, 0.47, 0.5], [1.6, 0.47, 0.57])} shaft={[0.47, 0.56, 0.1, 0.38]} lip={[0.47, 0.5]} ground={0.63} /> },
  { a: 145.69, b: 149.53, vo: "Judge Justin Jiron took the deal anyway, with one condition. (Caledonia County Courthouse, St. Johnsbury)",
    node: (n) => <Still src={GR + "court.jpg"} n={n} s0={1.04} s1={1.12} fx={0.4} fy={0.55} />, over: <RedLabel text="CALEDONIA SUPERIOR COURT" at={F(0.5)} hold={F(3.0)} /> },
  { a: 149.53, b: 156.98, vo: "Wayne can only operate an excavator under a supervisor ..., and that supervisor can't be his son. (tilt from the bucket down to Brandon)",
    node: (n) => <Cam src={M} from={35.0} keys={[{ f: 0, s: 2.0, x: 0.2, y: 0.28 }, { f: 150, s: 2.1, x: 0.22, y: 0.3 }, { f: 205, s: 2.45, x: 0.46, y: 0.74 }, { f: n, s: 2.5, x: 0.46, y: 0.74 }]} /> },
  { a: 156.98, b: 158.77, vo: "And that's only where this starts. (the whole frame, easing back)",
    node: (n) => <Cam src={M} from={61.0} keys={K(n, [1.12, 0.45, 0.5], [1.0, 0.5, 0.5])} /> },
  { a: 158.77, b: 163.55, vo: "Still to come, a small plane drops onto a Florida road right in front of a patrol car, (case 07 clip, silent)",
    node: (n) => <Cam src={GR + "c07.mp4"} from={6.9} keys={K(n, [1.22, 0.458, 0.4], [1.32, 0.458, 0.36])} />, over: <RedLabel text="CLEARWATER, FLORIDA · 2017" at={F(0.5)} hold={F(3.6)} size={42} /> },
  { a: 163.55, b: 169.1, vo: "and an escaped prisoner talks his way past a police officer at a railroad crossing. (case 08 clip, silent)",
    node: (n) => <Cam src={GR + "c08.mp4"} from={6.0} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.6, 0.45])} />, over: <RedLabel text="BALL, LOUISIANA · 2006" at={F(0.5)} hold={F(3.6)} size={42} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.78), kind: "glitch", len: 10 },   // photo -> the dashcam
  { at: F(19.52), kind: "blurDip", len: 10 },  // same-camera reframes (cutcheck JUMP on hard cuts)
  { at: F(24.40), kind: "blurDip", len: 10 },
  { at: F(32.48), kind: "blurDip", len: 10 },
  { at: F(36.60), kind: "blurDip", len: 10 },
  { at: F(42.06), kind: "blurDip", len: 10 },
  { at: F(105.76), kind: "blurDip", len: 10 },
  { at: F(131.03), kind: "blurDip", len: 10 },
  { at: F(44.42), kind: "blurDip", len: 12 },  // live crop -> held first frame (same camera)
  { at: F(99.48), kind: "blurDip", len: 14 },  // raw -> the slow replay
  { at: F(108.23), kind: "blurDip", len: 12 }, // into the CBS clippings
  { at: F(115.77), kind: "blurDip", len: 12 }, // out of the page
  { at: F(119.89), kind: "blurDip", len: 12 }, // into the WCAX sheet
  { at: F(129.17), kind: "blurDip", len: 10 }, // out of the page
  { at: F(139.85), kind: "blurDip", len: 12 }, // into the frozen sweep
  { at: F(145.69), kind: "glitch", len: 10 },  // the court
  { at: F(149.53), kind: "glitch", len: 10 },  // back to the driveway
  { at: F(158.77), kind: "glitch", len: 10 },  // case 07
  { at: F(163.55), kind: "glitch", len: 10 },  // case 08
];

// VO take parts: [timeline at, take from, take to]
const PART: [number, number, number | null][] = [[4.0, 0, 53.62], [71.12, 53.62, 58.63], [99.48, 58.63, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[57.62, 71.12, 0.0, 0, 0.35], [76.13, 99.48, 64.0, 2, 0.1]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [15.73, "sfx_n2/glitch_01.wav", -28], [45.2, "sfx_n2/whoosh_01.wav", -30],
  [108.25, "sfx_n2/real/paper_2.wav", -26], [111.2, "sfx_n2/real/paper_3.wav", -26], [119.92, "sfx_n2/real/page_turn_1.wav", -26], [122.2, "sfx_n2/real/paper_2.wav", -28], [145.64, "sfx_n2/glitch_03.wav", -28], [149.48, "sfx_n2/glitch_01.wav", -30],
  [158.72, "sfx_n2/glitch_02.wav", -26], [163.5, "sfx_n2/glitch_03.wav", -28],
];
// the excavator's engine under the silent first raw and under the sweep (real recordings, low)
const BED: [number, number, string, number][] = [[57.62, 64.6, "sfx_n2/real/car_engine_4.wav", -24], [64.3, 71.12, "sfx_n2/real/car_engine_4.wav", -24], [85.9, 91.1, "sfx_n2/real/car_engine_2.wav", -26]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE EXCAVATOR ARREST" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 5, ~-13 dB, ducked under the raws; two passes, handed over inside RAW 2 */}
      {([[4.0, 80.0, 8], [79.0, 169.1, 20]] as const).map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = k === 0 ? interpolate(t, [4.0, 5.0, 79.0, 80.0], [0, 1, 1, 0], cl) : interpolate(t, [79.0, 80.0, 167.6, 169.1], [0, 1, 1, 0], cl);
            return dB(-13) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
