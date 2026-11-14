// Amusement Parks Iceberg — OUTRO. The OUTRO take whole from 0.5 s, no raw, no labels. Bookend on the intro's berg (dev/AM00_BergFlight,
// chart already built, no planes): close on Level 1 with EL GUSANITO ruled white ("a worm coaster pulling apart at a fair nobody can find":
// no footage of it exists beyond the one clip, so the berg's own name is the picture), one slow eased descent to the deepest band, FORMULE 1
// ruled ("a French coaster that took a second life in 2020, that's the bottom of this iceberg"), blur-dip into calm footage: the Cobra
// park's bungee towers against a quiet sky (The Adventure Schmuck's 2023 walk round the park, AArPOgl7P5k; CASE01 graded vlog 29.0-34.2)
// for the comments line, then the towers over the empty mini-golf (vlog 35.0-44.8, 0.85x) held for the end screen, dimmed, clean fade to black.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { BergFlight, type Cam } from "../dev/AM00_BergFlight";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(26.5);
const B1 = 10.1, B2 = 15.3;

// VO (global s): "From a worm coaster pulling apart at a fair nobody can find," 0.5-4.04 | "all the way down to a French coaster that
// took a second life in 2020, that's the bottom of this iceberg." -9.93 | "If there's a park story you think belonged down here, put it in
// the comments. I do read them." -15.07 | "And YouTube's already lined up something else for you on your screen, so I'll see you there." -19.7
const k = (s: number, x: number, y: number, z: number, fd: number, dim: number): Cam => ({ f: F(s), x, y, z, fd, dim });
const CAM: Cam[] = [
  k(0, 760, 420, 780, 780, 0.15),
  k(3.9, 748, 416, 750, 750, 0.15),
  k(8.0, 960, 905, 820, 820, 0.25),    // down to the deepest band
  k(B1 + 0.6, 960, 912, 770, 770, 0.3),
];

const Calm: React.FC<{ src: string; n: number; rate: number; s0: number; s1: number; fy?: number }> = ({ src, n, rate, s0, s1, fy = 0.5 }) => {
  const f = useCurrentFrame();
  const s = s0 + (s1 - s0) * interpolate(f, [0, n], [0, 1], cl);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <OffthreadVideo src={staticFile(src)} muted playbackRate={rate} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s.toFixed(4)})`, transformOrigin: `50% ${fy * 100}%` }} />
    </AbsoluteFill>
  );
};

const CUTS: FxCut[] = [{ at: F(B1), kind: "blurDip", len: 16 }, { at: F(B2), kind: "blurDip", len: 16 }];

const Dim: React.FC = () => {
  const f = useCurrentFrame();
  const d = interpolate(f, [F(20.0), F(21.4)], [0, 0.42], cl), end = interpolate(f, [F(25.1), F(26.4)], [0, 1], cl), st = 1 - interpolate(f, [0, 14], [0, 1], cl);
  return <AbsoluteFill style={{ background: "#000", opacity: Math.max(d, end, st) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(B1)} layout="none"><AbsoluteFill><FilmLook_FX grain={0.07}>
            <BergFlight cards={[]} cam={CAM} reveal={[-200, -150]} rule={[{ lvl: 0, idx: 2, at: F(0.75) }, { lvl: 4, idx: 2, at: F(6.6) }]} />
          </FilmLook_FX></AbsoluteFill></Sequence>
          <Sequence from={F(B1)} durationInFrames={F(B2 - B1)} layout="none"><AbsoluteFill><FilmLook_FX grain={0.07}>
            <Calm src={GR + "o1.mp4"} n={F(B2 - B1)} rate={1} s0={1.02} s1={1.07} />
          </FilmLook_FX></AbsoluteFill></Sequence>
          <Sequence from={F(B2)} durationInFrames={DUR - F(B2)} layout="none"><AbsoluteFill><FilmLook_FX grain={0.07}>
            <Calm src={GR + "o2.mp4"} n={DUR - F(B2)} rate={0.85} s0={1.0} s1={1.06} fy={0.6} />
          </FilmLook_FX></AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      <Dim />
      <Sequence from={F(0.5)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 1 (~10 LU under the VO), outlasts the VO, fades with the picture */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => dB(-16.7) * interpolate(f, [0, 30, F(23.0), DUR - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* the berg: the underwater bed under the descent */}
      <Sequence from={0} durationInFrames={F(B1 + 0.4)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-29) * interpolate(f, [0, 30, F(B1 - 0.8), F(B1 + 0.4)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* the quiet towers: a little real wind under the end-screen hold */}
      <Sequence from={F(B2)} durationInFrames={DUR - F(B2)} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-36) * interpolate(f, [0, 30, DUR - F(B2) - 45, DUR - F(B2) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
