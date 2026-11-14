// Workplace video — OUTRO. Calm, VO-only, four long silent shots of the video's own footage with slow pushes, hard cuts between filmers:
// the Brumadinho mine conveyor standing over the settled mud ("That's the bottom ... long before anything caught fire"), the East
// Palestine derailment from the drone, the cars still smoking ("a gauge, a rail, a valve or a container"), the Alemoa terminal from the
// air, container stacks in the foreground and the tanks burning beyond ("say so in the comments"), and Exxon Baton Rouge 1989 across the
// water, held and dimmed for the end screen ("the next one is on your screen"), fade to black. No raws, no labels.
// VO: OUTRO.mp3 with "Thirty incidents." cut out (1.08-2.20: two cases were dropped, the count is wrong): 0-1.08 at 0.5, 2.20-end at 1.58.
// Sources (cut into CASE99/assets, graded --house): 30 main na2n3E3EqzA 146-153.5 · 07 main 95igiL5rmhI 38-43.5 · 05 extra3 p8VDxN-q4-U
// 78-83.5 · 19 main 4eE4v2Xh6jw 28-37.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(23.5);

type Sh = { a: number; b: number; vo: string; src: string; from: number; s0: number; s1: number; fx?: number; fy?: number };
const SHOTS: Sh[] = [
  { a: 0, b: 6.5, vo: "That's the bottom. In almost every one, the decision that caused it came long before anything caught fire.", src: "bm.mp4", from: 0.3, s0: 1.02, s1: 1.09, fx: 0.45, fy: 0.55 },
  { a: 6.5, b: 11.13, vo: "It sat in a gauge, a rail, a valve or a container nobody would take.", src: "ep.mp4", from: 0.3, s0: 1.0, s1: 1.06, fx: 0.55, fy: 0.5 },
  { a: 11.13, b: 15.53, vo: "If you'd move any of these up or down a level, say so in the comments.", src: "st.mp4", from: 0.3, s0: 1.03, s1: 1.08, fx: 0.6, fy: 0.45 },
  { a: 15.53, b: 23.5, vo: "And if you want to keep going down, the next one is on your screen. (end-screen hold)", src: "br.mp4", from: 0.3, s0: 1.0, s1: 1.07 },
];

const Dim: React.FC = () => {
  const f = useCurrentFrame();
  const d = interpolate(f, [F(19.4), F(20.8)], [0, 0.42], cl), end = interpolate(f, [F(22.2), F(23.45)], [0, 1], cl);
  return <AbsoluteFill style={{ background: "#000", opacity: Math.max(d, end) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill>
          <FilmLook_FX grain={0.07}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>
        </AbsoluteFill></Sequence>
      ))}
      <Dim />
      <Sequence from={F(0.5)} durationInFrames={F(1.08)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      <Sequence from={F(1.58)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} startFrom={F(2.2)} /></Sequence>
      {/* music: Epidemic ambient Music 1 (as TP99, −14.2 dB ≈ 10 LU under the VO), outlasts the VO, fades with the picture */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(70)} volume={(f) => dB(-14.2) * interpolate(f, [0, 30, F(20.5), F(23.4)], [0, 1, 1, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
