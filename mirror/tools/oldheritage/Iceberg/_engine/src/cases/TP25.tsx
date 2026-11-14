// Theme Park #25 (last case) — Wisconsin State Fair, West Allis, opening night Thursday 5 August 2010: the Sky Glider chairlift's
// motor fails, ~200 riders hang over the midway; fire crews take them off chair by chair with a bucket truck (~2.5 h), nobody hurt.
// Footage (all filmed that night by fairgoers): [SK] main 480x360 phone (Ijwhu8zBqpk) shown whole over its own bright blurred copy;
// [ST] 720p (_cAzqSObyuY: the crowd at the station, the bucket at the chairs, the wide cable line); [SB] 720p (BXZ0ziG3TnQ: bucket
// among the coloured chairs next to the lit wheel, then the fire engine). Devices: CableRun (freeze of the wide line: one cable, one
// drive, the drive dies, every chair holds), SpreadOut (one coaster train vs 100 chairs along a cable, the bucket one chair at a time).
// VO = one take, split only for the six raws (cut sheet cues in order). Raw sound = each clip through rawclean.py --force (fair music out).
// Source cuts: SK 223.57 / 232.7 / 235.67; ST 11.27; SB none. Every window avoids them.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { CableRun } from "../dev/TP25_CableRun";
import { SpreadOut } from "../dev/TP25_SpreadOut";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const END = 148.0;
const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; node?: React.ReactNode; over?: React.ReactNode };
const SK = "sk.mp4", ST = "st.mp4", SB = "sb.mp4";

// VO take parts (split only at sentence ends, every stretch >= 6 s) -> timeline:
// A 0-22.45 @4.0 | R1 26.45-40.45 | B 22.45-32.45 @40.45 | R2 50.45-60.45 | C 32.45-46.55 @60.45 | R3 74.55-88.55
// | D 46.55-58.3 @88.55 | R4 100.3-124.0 (ST 12 s + SB 11.7 s) | G 58.3-end @124.0 (last word ~145.9, short hold to 148.0)
const VO: [number, number, number][] = [[4.0, 0, 22.45], [40.45, 22.45, 32.45], [60.45, 32.45, 46.55], [88.55, 46.55, 58.3], [124.0, 58.3, 80.6]];
// raws: [a, b, clean wav, source sec, gain dB] (gains bring each window to ~ -24 LUFS, the VO's level)
const RAWS: [number, number, string, number, number][] = [
  [26.45, 40.45, "sk", 20.0, -7], [50.45, 60.45, "sk", 58.0, -4], [74.55, 88.55, "sk", 93.5, -5],
  [100.3, 112.3, "st", 13.0, -10], [112.3, 124.0, "sb", 0.8, -4],
];

const SHOTS: Sh[] = [
  { a: 4.0, b: 8.75, vo: "Opening night at the Wisconsin State Fair, Thursday the 5th of August 2010. (the midway at night, the wheel lit)", src: SK, from: 0.5, fill: true, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.5,
    over: <><RedLabel text="WEST ALLIS, WISCONSIN" at={F(0.3)} hold={F(2.0)} /><RedLabel text="AUGUST 5, 2010" at={F(2.6)} hold={F(1.8)} /></> },
  { a: 8.75, b: 10.68, vo: "The Sky Glider is a chairlift. (its coloured chairs by the wheel)", src: SB, from: 13.3, s0: 1.04, s1: 1.09, fx: 0.4, fy: 0.3,
    over: <RedLabel text="SKY GLIDER" at={F(0.2)} hold={F(1.5)} /> },
  { a: 10.68, b: 16.23, vo: "Its open chairs run on one cable high over the midway, so you can see the whole fair from above. (the wide line of chairs over the crowd)", src: ST, from: 61.9, s0: 1.02, s1: 1.1, fx: 0.7, fy: 0.4 },
  { a: 16.23, b: 19.82, vo: "That evening its motor failed and the operator couldn't restart it, (the chairs, stopped, dark)", src: SK, from: 44.0, fill: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.3 },
  { a: 19.82, b: 23.71, vo: "and some riders said it was about ten minutes before they even noticed. (riders sitting in the chairs)", src: ST, from: 50.5, s0: 1.08, s1: 1.15, fx: 0.7, fy: 0.3 },
  { a: 23.71, b: 26.45, vo: "Firefighters came with ladders and a cherry picker. (the fire engine on the midway)", src: SB, from: 18.3, s0: 1.03, s1: 1.07, fx: 0.6, fy: 0.5 },
  // RAW 1 (cue SK 0:22-0:52): the bucket going up to the stopped chairs
  { a: 26.45, b: 40.45, vo: "RAW: the bucket reaching the chairs over the midway", src: SK, from: 20.0, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  { a: 40.45, b: 50.45, vo: "Every chair on a chairlift runs off one cable and one drive. When the motor goes, every chair stops wherever it happens to be, (CableRun)",
    node: <CableRun src={GR + "cable.png"} iw={1280} ih={720}
      cable={[[262, -10], [352, 40], [692, 132], [895, 252], [1025, 280], [1128, 334], [1230, 410]]}
      chairs={[[285, 210, 110, 90], [355, 75, 110, 80], [697, 205, 100, 70], [805, 330, 80, 80], [897, 276, 80, 40], [940, 355, 70, 70], [1027, 310, 70, 50], [1125, 355, 60, 40], [1180, 460, 50, 50], [1232, 480, 50, 50]]}
      drive={[1150, 548, 50]} fx={0.8} fy={0.45} traceAt={F(0.25)} traceLen={F(2.3)} driveAt={F(2.9)} stopAt={F(4.05)} holdAt={F(5.05)} /> },
  // RAW 2 (cue SK 0:52-1:20): the chairs strung over the lit midway, the bucket beside them
  { a: 50.45, b: 60.45, vo: "RAW: bucket beside the chairs", src: SK, from: 58.0, fill: true, s0: 1.06, s1: 1.1, fx: 0.4, fy: 0.3 },
  { a: 60.45, b: 65.56, vo: "There were two hundred people on it, and that's what makes a chairlift different from everything else here. (the bucket among the chairs)", src: ST, from: 40.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 65.56, b: 74.55, vo: "A coaster keeps its riders together... every chair is its own rescue. (SpreadOut)",
    node: <SpreadOut bg={GR + ST} bgFrom={44} t={{ train: F(0.1), spread: F(3.1), one: F(5.85), every: F(7.0) }} /> },
  // RAW 3 (cue SK 1:20-1:50): the bucket level with the hanging chairs
  { a: 74.55, b: 88.55, vo: "RAW: the bucket at the chairs", src: SK, from: 93.5, fill: true, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.35 },
  { a: 88.55, b: 94.55, vo: "Because it was opening night, the fair underneath was packed, so every chair that came down had an audience. (the crowd round the station)", src: ST, from: 0.7, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },
  // RAW 4 (cues ST 0:10-0:40 + SB 0:00-0:17 merged into one long raw, two angles): the bucket with riders by the station, then among the coloured chairs by the lit wheel
  { a: 100.3, b: 112.3, vo: "RAW: the bucket with riders by the station", src: ST, from: 13.0, s0: 1.08, s1: 1.03, fx: 0.4, fy: 0.4 },
  { a: 94.55, b: 97.7, vo: "Some of the chairs were stuck right beside the Ferris wheel. (the wheel's glare, chairs beside it)", src: SB, from: 15.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.4 },
  { a: 112.3, b: 124.0, vo: "RAW: bucket among the chairs by the wheel", src: SB, from: 0.8, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.4 },
  { a: 97.7, b: 100.3, vo: "The bucket kept working its way down the line. (the bucket truck at the chairs)", src: SK, from: 146.0, fill: true, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 124.0, b: 126.4, vo: "It took fire crews about two and a half hours (the crowd round the station, the bucket down)", src: ST, from: 7.5, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 126.4, b: 129.97, vo: "to bring all two hundred down, and not one of them was hurt. (the bucket at the chairs, steady)", src: SK, from: 116.0, fill: true, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: 129.97, b: 133.02, vo: "Within two days it was reported up and running again. (the long line of chairs)", src: ST, from: 55.5, s0: 1.03, s1: 1.08, fx: 0.7, fy: 0.35 },
  { a: 133.02, b: 137.15, vo: "The same ride broke down again the next summer, but that's a separate story. (the midway crowd under the station)", src: SK, from: 214.0, fill: true, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 137.15, b: 141.2, vo: "I've put this one last on purpose. A motor failed, and that's all. (the bucket at the chairs, calm)", src: ST, from: 34.0, s0: 1.02, s1: 1.06, fx: 0.4, fy: 0.4 },
  { a: 141.2, b: 143.18, vo: "Nobody fell and nothing burned. (riders in the bucket, close)", src: ST, from: 47.0, s0: 1.22, s1: 1.27, fx: 0.4, fy: 0.45 },
  { a: 143.18, b: END, vo: "The crews just kept going until the last chair was empty. (the bucket at the chairs, held; fade)", src: SK, from: 166.0, fill: true, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.35 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(19.82), kind: "blurDip", len: 12 },   // SK -> ST, same bucket from two sides
  { at: F(40.45), kind: "zoomHit", len: 10 },   // into CableRun
  { at: F(50.45), kind: "blurDip", len: 12 },   // freeze -> raw
  { at: F(60.45), kind: "blurDip", len: 12 },   // SK -> ST, same bucket
  { at: F(65.56), kind: "glitch", len: 8 },     // into SpreadOut
  { at: F(74.55), kind: "blurDip", len: 12 },   // diagram -> raw
  { at: F(97.7), kind: "blurDip", len: 12 },    // SK -> SK
  { at: F(129.97), kind: "blurDip", len: 12 },  // SK -> ST, same bucket
  { at: F(141.2), kind: "blurDip", len: 12 },   // ST -> ST
];

// the 4:3 night phone clip [SK] shown whole (1440x1080) over a BRIGHT blurred copy of itself (no dark side bars), eased push inside
const Fill43: React.FC<{ s: Sh }> = ({ s }) => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <AbsoluteFill style={{ filter: "blur(32px) brightness(1.9) saturate(1.25)", transform: "scale(1.3)" }}>
      <OffthreadVideo src={staticFile(GR + s.src!)} startFrom={Math.round((s.from ?? 0) * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </AbsoluteFill>
    <div style={{ position: "absolute", left: 240, top: 0, width: 1440, height: 1080, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.6)" }}>
      <Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} />
    </div>
  </AbsoluteFill>
);

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.fill) return <FilmLook_FX grain={0.08}><Fill43 s={s} /></FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const EndFade: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [F(END - 1.2), F(END) - 1], [0, 1], cl) }} />;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -26],
  [23.75, X + "car_engine_2.wav", -34],      // the fire engine idling
  [44.5, X + "metal_clank_2.wav", -27],      // the drive stops (CableRun)
  [44.6, X + "sub_drop_2.wav", -32],
  [65.5, "sfx_n2/glitch_03.wav", -32],
  [68.6, X + "wind_gust_1.wav", -34],        // the long cable in the night air
];

const duck = (t: number) => RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.6 || t > b + 0.5 ? 1 : t < a ? (a - t) / 0.6 : t > b ? (t - b) / 0.5 : 0), 1);
const MUS = -22; // Music 4 measures ~ -12 LUFS; VO take -24.5 LUFS -> bed ~10 LU under
const MusicVol = (t: number) => dB(MUS) * (0.12 + 0.88 * duck(t));

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWO HUNDRED ON THE SKY GLIDER" bg={GR + "title.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <EndFade />
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE25.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, w, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + w + "_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 from a late offset (TP21 uses its start), looped once with a crossfade hidden under raw 3, dipped under the raws */}
      <Sequence from={F(3.6)} durationInFrames={F(75.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(45)} volume={(f) => MusicVol(f / 30 + 3.6) * interpolate(f, [0, 30, F(73.0), F(75.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(76.6)} durationInFrames={F(END) - F(76.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => MusicVol(f / 30 + 76.6) * interpolate(f, [0, F(4.0), F(END - 76.6 - 2.5), F(END - 76.6) - 1], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed RAW 2 and RAW 3 (inside the one-cable / every-chair-is-its-own-rescue explanation; near-dups of RAW 1). 5 -> 3 raws (14 s, then 12 + 11.7 s back to back).
const _cut = cutOut(CompFull, DUR, [[50.45, 60.45], [74.55, 88.55]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
