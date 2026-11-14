// Theme Park video — OUTRO. The outro VO over the one thing it names: the stairs. Six Flags Great America's Demon (case 24) stopped on its
// lift hill under a grey sky ("look twice at the next ride you queue for"), then JiggidyNDG's own footage of riders and staff in hi-vis
// walking down the lift-hill stairs ("where the stairs are"), then the wide of the hill with the line of people on the steps, held for
// the end screen, dimmed, a clean fade to black. Hard cut between the two filmers, one blur-dip on the same-camera join. No raws, no labels.
// Sources: footage/09_Six_Flags_Great_America_Demon_Riders_Walk_Down_the/main_boUFOGTCdIw.mp4 23.0-30.5 (source cuts 130.6, 222.3, 338.4)
// and extra1_1ir1XA_PmSs.mp4 110.5-116.5 + 134.5-150.0 (wide used from 136.4: a zoom jump at 136.1) (between its cuts 109.24 / 133.76 / 156.48); graded with grade_case.py --house.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(22.0);

type Sh = { a: number; b: number; vo: string; src: string; from: number; s0: number; s1: number; fx?: number; fy?: number };
// VO take from 0 at 0.5 (+0.5)
const SHOTS: Sh[] = [
  { a: 0, b: 5.7, vo: "That's all of them. If one of these made you look twice at the next ride you queue for, that's fair. (Demon halted on its lift hill)", src: "dm.mp4", from: 1.0, s0: 1.02, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 5.7, b: 8.42, vo: "You're probably not wrong to ask where the stairs are. (riders and staff walking down the lift-hill stairs, tight)", src: "djs.mp4", from: 0.5, s0: 1.03, s1: 1.08 },
  { a: 8.42, b: 22.0, vo: "There's another video on your screen now if you want to keep going. Thanks for watching. (the hill wide, people on the steps; end-screen hold)", src: "djw.mp4", from: 1.9, s0: 1.0, s1: 1.07 },
];
const CUTS: FxCut[] = [{ at: F(8.42), kind: "blurDip", len: 16 }];

const Dim: React.FC = () => {
  const f = useCurrentFrame(); // global frame (outside Sequences)
  const d = interpolate(f, [F(13.0), F(14.4)], [0, 0.42], cl), end = interpolate(f, [F(20.6), F(21.9)], [0, 1], cl);
  return <AbsoluteFill style={{ background: "#000", opacity: Math.max(d, end) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill>
              <FilmLook_FX grain={0.07}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>
            </AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Dim />
      <Sequence from={F(0.5)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 1 (−18.8 LUFS file -> −14.2 dB ≈ 10 LU under the VO), outlasts the VO, fades with the picture */}
      <Sequence from={0} durationInFrames={F(22.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(30)} volume={(f) => dB(-14.2) * interpolate(f, [0, 30, F(19.0), F(21.9)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* the silent wide of the hill: a little real wind under the end-screen hold */}
      <Sequence from={F(12.0)} durationInFrames={F(10.0)} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-36) * interpolate(f, [0, 30, F(8.5), F(9.9)], [0, 1, 1, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
