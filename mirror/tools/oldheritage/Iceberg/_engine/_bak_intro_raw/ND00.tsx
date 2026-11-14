// ND INTRO — "The Most TERRIFYING Natural Disasters Ever Recorded". Countdown video: no iceberg. Cold open = the cut sheet's raw
// (Ontake, 27 Sep 2014: the ash cloud swallowing the daylight on the trail, the hikers' own sound, cleaned by rawclean.py), then the intro
// VO over a clean montage of the video's own cases (one picture per line, hard cuts on the words), ending on the video title card.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { VideoTitle } from "../dev/ND00_VideoTitle";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(32.5);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
// VO take from 0 at 5.8 (+5.8)
const SHOTS: Sh[] = [
  { a: 0, b: 5.5, vo: "COLD OPEN RAW: Ontake, the ash cloud swallows the trail", src: "ont.mp4", from: 0.8, s0: 1.03, s1: 1.09 },
  { a: 5.5, b: 9.3, vo: "We build our lives on a quiet assumption that the ground stays put (Ōfunato, the harbour)", src: "ofu.mp4", from: 4.0, s0: 1.02, s1: 1.08 },
  { a: 9.3, b: 11.4, vo: "and the sea stays where we left it. (Koh Ngai, calm)", src: "kng.mp4", from: 0.5, s0: 1.04, s1: 1.09 },
  { a: 11.4, b: 13.6, vo: "Most days, that assumption holds. (Fuego: traffic on the road below the volcano)", src: "fue.mp4", from: 0.2, s0: 1.03, s1: 1.07 },
  { a: 13.6, b: 15.85, vo: "These are nineteen of the days it didn't. (Toowoomba: cars carried off)", src: "tow.mp4", from: 3.5, s0: 1.03, s1: 1.08 },
  { a: 15.85, b: 18.8, vo: "A volcano turns a Sunday drive into a race. (Fuego: families running)", src: "fue.mp4", from: 8.0, s0: 1.03, s1: 1.08 },
  { a: 18.8, b: 21.85, vo: "A harbour fills to the rooftops in a few minutes. (Ōfunato: houses carried as the harbour floods)", src: "ofu2.mp4", from: 8.0, s0: 1.03, s1: 1.08 },
  { a: 21.85, b: 23.5, vo: "The most terrifying natural disasters (Gatlinburg)", src: "gat.mp4", from: 2.0, s0: 1.3, s1: 1.36, fy: 0.15 },
  { a: 23.5, b: 25.15, vo: "ever recorded, (Everest Base Camp)", src: "eve.mp4", from: 5.0, s0: 1.04, s1: 1.1 },
  { a: 25.15, b: 27.85, vo: "and what the people standing in their way did next. (Paradise)", src: "cmp.mp4", from: 1.0, s0: 1.03, s1: 1.08 },
  { a: 27.85, b: 32.5, vo: "Let's begin. (title)",
    node: <VideoTitle bg={GR + "title_bg.jpg"} fadeAt={F(3.9)} lines={[{ t: "THE MOST", size: 64, at: F(0.15) }, { t: "TERRIFYING", size: 150, at: F(0.45) }, { t: "NATURAL DISASTERS EVER RECORDED", size: 64, at: F(0.85) }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(5.5), kind: "glitch", len: 10 },
  { at: F(27.85), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* cold open: the hikers' own sound at full level, out before the VO */}
      <Sequence from={0} durationInFrames={F(5.6)} layout="none">
        <Audio src={staticFile("case/media/ont_clean.wav")} startFrom={F(0.8)} volume={(f) => interpolate(f, [0, 4, F(5.1), F(5.6)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(5.8)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5 enters on the glitch, swells a little under the title, eases out */}
      <Sequence from={F(5.4)} durationInFrames={F(32.5) - F(5.4)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(4)} volume={(f) => dB(-13) * interpolate(f, [0, 20, F(22.3), F(23.3), F(25.6), F(27.1)], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      <Sequence from={F(5.45)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-24)} /></Sequence>
      <Sequence from={F(27.9)} layout="none"><Audio src={staticFile("sfx_n2/title_hit_01.wav")} volume={dB(-22)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
