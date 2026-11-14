// Tornado video — OUTRO. The outro VO over calm aftermath drone footage from three of the video's towns (Moore, Washington IL,
// Fairdale), ending on Fairdale rebuilt (2019) with room for the end screen; slow cross blur-dips, Music 3, a clean fade to black.
// Drone clips: footage/26_Moore/more/wZV9TwvuuOo.mp4 22-34 (source cut at +6.13), footage/20_Washington/more/N0cWWLQsYso.mp4 56-68,
// CASE01 media drone2015.mp4 38-50 and drone2019.mp4 72-88 (Fairdale, the case-1 drone clips). No raws, so no raw audio.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(26.0);

type Sh = { a: number; b: number; vo: string; src: string; from: number; s0: number; s1: number; label: string; labelHold: number };
const SHOTS: Sh[] = [
  { a: 0, b: 5.9, vo: "That's the list. Across twenty-five tornadoes, the wind speed decided less than you'd think. (Moore from above)", src: "moore.mp4", from: 0.1, s0: 1.0, s1: 1.06, label: "MOORE, OKLAHOMA", labelHold: F(3.6) },
  { a: 5.9, b: 11.4, vo: "What decided most of them was how many minutes someone had between the warning and the door. (Washington, Illinois)", src: "wash.mp4", from: 1.0, s0: 1.0, s1: 1.06, label: "WASHINGTON, ILLINOIS", labelHold: F(3.4) },
  { a: 11.4, b: 15.6, vo: "If the emergency alerts on your phone are switched off, turn them back on. (Fairdale, 2015)", src: "fair15.mp4", from: 2.0, s0: 1.0, s1: 1.05, label: "FAIRDALE, ILLINOIS", labelHold: F(2.6) },
  { a: 15.6, b: 26.0, vo: "The next video is up on your screen. (Fairdale rebuilt, 2019; end-screen hold, dims, fades out)", src: "fair19.mp4", from: 1.0, s0: 1.0, s1: 1.08, label: "FAIRDALE · 2019", labelHold: F(2.4) },
];
const CUTS: FxCut[] = [
  { at: F(5.9), kind: "blurDip", len: 16 },
  { at: F(11.4), kind: "blurDip", len: 16 },
  { at: F(15.6), kind: "blurDip", len: 16 },
];

const Dim: React.FC = () => {
  const f = useCurrentFrame(); // global frame (outside Sequences)
  const d = interpolate(f, [F(18.6), F(20.0)], [0, 0.42], cl), end = interpolate(f, [F(24.6), F(25.9)], [0, 1], cl);
  return <AbsoluteFill style={{ background: "#000", opacity: Math.max(d, end) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill>
              <FilmLook_FX grain={0.07}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} /></FilmLook_FX>
              <RedLabel text={s.label} at={F(0.7)} hold={s.labelHold} />
            </AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Dim />
      <Sequence from={F(0.6)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      <Sequence from={0} durationInFrames={F(26.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(64)} volume={(f) => dB(-19) * interpolate(f, [0, 30, F(23.0), F(25.9)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(5.85)} layout="none"><Audio src={staticFile("sfx_n2/whoosh_03.wav")} volume={dB(-34)} /></Sequence>
      <Sequence from={F(11.35)} layout="none"><Audio src={staticFile("sfx_n2/whoosh_03.wav")} volume={dB(-34)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
