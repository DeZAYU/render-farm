// Tornado #17 — the semi on I-75, Ocala, Florida, Sat 12 March 2022 (~7:45–8:20 AM EST). Channel grammar (brand.tsx) + devices built for
// THIS case: CrossingBand (the 65-yard maximum width laid TO SCALE across I-75 at SR 200 on NAIP, along the NWS survey points, then the
// apartment complex the survey names), SailPanel (the frame where the trailer's flank is broadside, frozen, the flank outlined: "a loaded
// trailer is basically a sail"), the NWS Jacksonville survey statement (ScaleDeal: rating + peak-wind lines lift off the page, then its six EF rows deal into a stack, EF1 lit second from the bottom).
// One camera: McCarlSpeed's dashcam (gyKOC7Fd_qY), SILENT (-91 dB) -> every raw is built from real recorded SFX; the owner watermark
// "Property of Carlspeed Motorsports, Inc." (x455 y615 1030x70) is delogo'd before the grade. No source cuts; src 4.6-5.4 is a real
// power-line flash (allowed window). VO = one take, "Seventeen," removed (take 0.94), split only at the raws.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { ScaleDeal } from "../dev/TOR17_ScaleDeal";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { CrossingBand } from "../dev/TOR17_CrossingBand";
import { SailPanel } from "../dev/TOR17_SailPanel";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(88.3);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// NWS DAT "SWMarion" survey points on the NAIP close-up (2600x1720, bbox -82.215..-82.150 / 29.130..29.170)
const PTS: [number, number][] = [[696, 1092], [840, 1135], [936, 1131], [1592, 916], [1596, 882], [1620, 864], [1648, 968], [1684, 852], [1844, 843], [1904, 710], [1912, 787], [1956, 830], [2084, 740], [2092, 740]];

// rows of the statement's EF table (page px, 41 px pitch from the EF1 row at 2436.8)
const EFROWS: [number, number, number, number][] = [0, 1, 2, 3, 4, 5].map((i) => [186, 2436.8 + (i - 1) * 41.2, 720, 2472.8 + (i - 1) * 41.2]);
const pns = (_dur: number) => (
  <ScaleDeal src={SH + "pns.png"} iw={2560} ih={3600} block={[150, 1010, 1180, 1300]}
    lifts={[{ r: [186, 1050.2, 636.2, 1086.2], at: 5 }, { r: [186, 1091.0, 701.7, 1127.0], at: 32 }]}
    rows={EFROWS} lit={1} bAt={74} />
);

const SHOTS: Sh[] = [
  // RAW 1 (4.0-23.7): the trailer beside the car is lifted across the lane, a power-line flash, it slides into the semi ahead, sparks
  { a: 4.0, b: 23.7, vo: "RAW 1 dash 0.3-20.0", src: "dash.mp4", from: 0.3, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  // VO-A (t 23.7 = take 0.94)
  { a: 23.7, b: 25.9, vo: "And the star of this one is a tractor-trailer. (the trailers on their sides ahead)", src: "dash.mp4", from: 64.0, s0: 1.16, s1: 1.24, fx: 0.55, fy: 0.55 },
  { a: 25.9, b: 29.3, vo: "It's Saturday morning, the 12th of March 2022,", src: "dash.mp4", from: 34.5, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55,
    over: <RedLabel text="MARCH 12, 2022" at={F(1.5)} hold={F(1.7)} /> },
  { a: 29.3, b: 32.2, vo: "on I-75 near Ocala, Florida. (I-75 at State Road 200 from above)",
    node: <Aerial src={GR + "ocw.jpg"} iw={2048} ih={1536} spot={[880, 740, 1000, 850]} z0={1.0} z1={1.3} label="I-75, OCALA, FLORIDA" boxAt={F(0.2)} labelAt={F(0.5)} /> },
  { a: 32.2, b: 37.6, vo: "A man is driving north to a motorsports event, and that turned out to be the calm part of his weekend.", src: "dash.mp4", from: 44.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
  { a: 37.6, b: 45.46, vo: "Florida Highway Patrol said two tractor-trailers crashed on the northbound side at State Road 200 as the storm went through.", src: "dash.mp4", from: 66.9, s0: 1.06, s1: 1.16, fx: 0.6, fy: 0.55 },
  // RAW 2 (45.46-57.96): the dragged trailer throwing sparks, debris in the rain
  { a: 45.46, b: 57.96, vo: "RAW 2 dash 20.5-33.0", src: "dash.mp4", from: 20.5, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.55 },
  // VO-B (t 57.96 = take 22.7)
  { a: 57.96, b: 63.1, vo: "It started near Dunnellon at 7:45 and stayed down for about thirty-five minutes. (the start point, NWS)",
    node: <Aerial src={GR + "dun.jpg"} iw={3072} ih={2048} spot={[1500, 1110, 1690, 1290]} z0={1.0} z1={1.3} label="DUNNELLON, FLORIDA" boxAt={F(0.4)} labelAt={F(0.8)} /> },
  { a: 63.1, b: 72.06, vo: "27 miles, never more than 65 yards wide. It damaged homes and an apartment building in south and east Ocala. (CrossingBand)",
    node: <CrossingBand src={GR + "close.jpg"} iw={2600} ih={1720} a={[300, 1275]} b={[2400, 662]} widthPx={24.5} bandIn={[F(1.9), F(3.6)]}
      pts={PTS} ptsIn={[F(5.0), F(6.2)]} box={[1595, 925, 1705, 1012]} boxAt={F(6.4)} boxLabel="SADDLEWORTH GREEN APARTMENTS"
      road={{ p: [1209, 560], label: "I-75", at: F(0.4), hold: F(2.2) }}
      cam={[{ at: 0, x: 1209, y: 1000, z: 1.05 }, { at: F(3.2), x: 1215, y: 1000, z: 1.9 }, { at: F(4.8), x: 1300, y: 990, z: 1.75 }, { at: F(7.0), x: 1480, y: 950, z: 1.85 }, { at: F(8.96), x: 1500, y: 950, z: 1.9 }]} /> },
  // VO-C (t 72.06 = take 36.8; 3 Nov: raw 3 removed, VO-B runs straight on)
  { a: 72.06, b: 76.66, vo: "EF1, a hundred and ten miles an hour, near the bottom of the scale, (NWS Jacksonville survey statement)", node: pns(F(76.66) - F(72.06)) },
  { a: 76.66, b: 78.9, vo: "and it still put one semi into another. (the moment again, half speed)", src: "dash_replay.mp4", from: 0.3, s0: 1.08, s1: 1.16, fx: 0.4, fy: 0.5 },
  { a: 78.9, b: 81.4, vo: "A loaded trailer is basically a sail. (SailPanel)",
    node: <SailPanel still={GR + "sail.jpg"} quad={[[0, 30], [975, 470], [925, 730], [0, 1080]]} at={4} len={26} /> },
  { a: 81.4, b: 84.6, vo: "Nobody was listed as hurt,", src: "dash.mp4", from: 38.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 84.6, b: 88.3, vo: "and northbound I-75 stayed shut until about a quarter past eleven. (the interchange from above)",
    node: <Aerial src={GR + "close.jpg"} iw={2600} ih={1720} spot={[1150, 700, 1275, 1000]} z0={1.1} z1={1.4} label="I-75 NORTHBOUND" boxAt={F(0.5)} labelAt={F(0.9)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(23.7), kind: "blurDip", len: 12 },
  { at: F(25.9), kind: "blurDip", len: 10 },
  { at: F(29.3), kind: "whip", len: 10 },
  { at: F(37.6), kind: "blurDip", len: 12 },
  { at: F(45.46), kind: "blurDip", len: 12 },
  { at: F(57.96), kind: "glitch", len: 10 },
  { at: F(72.06), kind: "zoomHit", len: 10 },
  { at: F(76.66), kind: "blurDip", len: 12 },
  { at: F(78.9), kind: "blurDip", len: 10 },   // replay -> SailPanel freeze (same camera, jump-cut guard)
  { at: F(81.4), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const VO: [number, number, number][] = [[23.7, 0.94, 22.7], [45.46 + 12.5, 22.7, 52.37]];
const RAWS: [number, number][] = [[4.0, 23.7], [45.46, 57.96]];
const X = "sfx_n2/real/";
// the dashcam recorded no sound: rain on the glass and wind throughout the raws; the flash, the trailer meeting the semi and the
// sparks of the dragged trailer get real recordings timed to the picture (src t + 3.7 = edit t in raw 1, src t + 24.96 in raw 2)
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [4.0, X + "rain_22.wav", -20], [4.2, X + "wind_gust_1.wav", -16], [6.0, X + "wind_gust_1.wav", -13],
  [8.25, X + "static_3.wav", -22], [8.3, X + "boom_2.wav", -18],          // the power-line flash (src 4.6)
  [10.2, X + "wind_gust_1.wav", -12], [12.6, X + "impact_2.wav", -14],   // the trailer meets the semi ahead
  [12.8, X + "metal_clank_4.wav", -16], [14.0, X + "metal_clank_2.wav", -18], [15.5, X + "rain_9.wav", -22], [16.6, X + "metal_clank_3.wav", -19],
  [18.0, X + "wind_gust_1.wav", -14], [20.0, X + "metal_clank_1.wav", -21],
  [29.3, "sfx_n2/whoosh_01.wav", -31],
  [45.5, X + "rain_22.wav", -20], [45.7, X + "wind_gust_1.wav", -13], [46.6, X + "metal_clank_2.wav", -20], [48.3, X + "metal_clank_4.wav", -19],
  [50.5, X + "wind_gust_1.wav", -12], [51.8, X + "metal_clank_1.wav", -21], [53.6, X + "impact_1.wav", -21], [55.0, X + "rain_5.wav", -22],
  [57.9, "sfx_n2/glitch_01.wav", -28],
  [72.4, X + "paper_2.wav", -31],
  [79.0, X + "marker_1.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE SEMI ON I-75" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} startFrom={F(a)} /></Sequence>)}
      {/* music: Music 3 (Epidemic ambient) from 40 s in, held low under the SFX-built raws */}
      <Sequence from={F(3.6)} durationInFrames={F(88.3) - F(3.6)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 3.6; let k = 1;
          for (const [a, b] of RAWS) k = Math.min(k, 1 - 0.6 * interpolate(t, [a - 0.6, a + 0.4, b - 0.4, b + 0.6], [0, 1, 1, 0], cl));
          return dB(-19) * k * interpolate(f, [0, 20, F(84.7) - 50, F(84.7)], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
