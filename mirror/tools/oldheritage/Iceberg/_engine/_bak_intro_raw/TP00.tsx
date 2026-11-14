// Theme Park video — INTRO ("25 Most HORRIFYING Theme Park Accidents That Will HAUNT You Forever"). Countdown video: no iceberg.
// Cold open on Tilburg's opening night (case 11): the food tent burning among the rides and the gas bottle going off, with its own crowd
// sound (tk_clean.wav = rawclean'd by case 11). Glitch into the video title (Elite, over Star City burning at night, case 13). Then the
// intro VO, whole, over one real shot per phrase from the video's own cases: a fair running normally ("built to scare you"), a rescuer
// at a rider's restraint on Joker's Jinx ("checks your harness"), looking up into the jammed Zipper's frame ("every bolt and cable"),
// the Big Tex crowd holding up phones ("while somebody was filming"), the Barakaldo tower ("slow"), The Flying Dinosaur's lift hill
// ("Osaka"), a gondola of The Wheel at night ("Orlando"), the Tilburg blast at 0.5x ("over in a second"), the Martillo locked at its peak in Almería
// ("no official cause"), then the Seville fair and the Steel Max masts before the launch, handing over to case 1's own title card.
// All windows are cut from the cases' already graded files (house grade); none repeats a window those cases use, except the
// deliberate 0.5x replay of the blast (case 11's tk_slow, reframed).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(49.8);
const V = 10.3; // VO (INTRO.mp3, whole) starts here

type Sh = { a: number; b: number; vo: string; src: string; from: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; over?: React.ReactNode };
// graded windows (CASE00/graded, each cut 1 s before the used moment from the case's graded file):
// co = TP11 tk_mb (motion-blended tk) 32.0 (blast at +4.0) / fair = TP15 fair_a 2.0 / jj = TP07 jj 29.0 / zx = TP03 tp03_zx 2.0 / bw = TP12 bw 19.0 /
// bk = TP14 main 29.0 / fd = TP06 fd 59.0 / iw = TP10 iw 22.5 / tks = TP11 tk_slow / cause = TP08 a2 1.0 / sx = TP01 tp01_sx 21.0-49.0
// (launch at sx 50.6, never reached) / titlebg = TP13 main 138.0
const SHOTS: Sh[] = [
  // COLD OPEN (own sound): Tilburg, the tent burning, the gas bottle blast at 3.0
  { a: 0.0, b: 5.4, vo: "COLD: Tilburg kermis, the food tent burns, the gas bottle goes off (tk 33.0-38.4)", src: "co.mp4", from: 1.0, s0: 1.02, s1: 1.08,
    over: <RedLabel text="TILBURG, NETHERLANDS" at={F(0.4)} hold={F(2.4)} /> },
  // VO montage (VO at 10.3)
  { a: 10.0, b: 14.6, vo: "A ride is built to scare you without ever putting you in danger. That's the whole deal. (a fair running, Aachen)", src: "fair.mp4", from: 1.0, s0: 1.03, s1: 1.1 },
  { a: 14.6, b: 17.72, vo: "You hand over your ticket, somebody checks your harness, (a rescuer at the riders' restraints, Joker's Jinx)", src: "jj.mp4", from: 1.0, s0: 1.06, s1: 1.14, fx: 0.62, fy: 0.4 },
  { a: 17.72, b: 22.32, vo: "and you trust that every bolt and cable on the thing was looked at by someone who cared. (up into the Zipper's frame)", src: "zx.mp4", from: 1.0, s0: 1.04, s1: 1.12, fy: 0.4 },
  { a: 22.32, b: 25.99, vo: "These are twenty-five times that deal broke while somebody was filming. (the Big Tex crowd, phones up)", src: "bw.mp4", from: 1.0, s0: 1.03, s1: 1.09, fy: 0.6 },
  { a: 25.99, b: 27.53, vo: "Some of them are slow. (the Barakaldo tower, seats hanging)", src: "bk.mp4", from: 0.5, s0: 1.04, s1: 1.08 },
  { a: 27.53, b: 30.48, vo: "Riders hang face-down for two hours in Osaka. (The Flying Dinosaur's lift hill)", src: "fd.mp4", from: 1.0, s0: 1.1, s1: 1.18, fy: 0.45 },
  { a: 30.48, b: 35.0, vo: "Sixty-two people sit stuck on a dark wheel over Orlando on New Year's Eve. (a gondola of The Wheel at night)", src: "iw.mp4", from: 1.0, s0: 1.03, s1: 1.1 },
  { a: 35.0, b: 36.59, vo: "Some are over in a second. (the Tilburg blast, 0.5x, reframed)", src: "tks.mp4", from: 0.2, s0: 1.1, s1: 1.18, fx: 0.42, fy: 0.5 },
  { a: 36.59, b: 38.96, vo: "A few still don't have an official cause. (Almería: the Martillo locked at its peak, ladder at the arm; no cause confirmed)", src: "cause.mp4", from: 1.0, s0: 1.03, s1: 1.09, fy: 0.3 },
  { a: 38.96, b: 43.01, vo: "I've put the worst first. It's Friday evening at the Seville fair. (the street of rides, sx 22)", src: "sx.mp4", from: 1.0, s0: 1.0, s1: 1.06,
    over: <RedLabel text="SEVILLE, SPAIN" at={F(2.4)} hold={F(1.6)} /> },
  { a: 43.01, b: 46.48, vo: "Two kids are strapped into a slingshot called Steel Max, (the masts and cables, sx 31, tight)", src: "sx.mp4", from: 10.0, s0: 1.32, s1: 1.4, fx: 0.32, fy: 0.35 },
  { a: 46.48, b: 49.8, vo: "and one of its two cables is about to let go. (the masts, sx 44, ends before the launch)", src: "sx.mp4", from: 23.0, s0: 1.02, s1: 1.12, fy: 0.3 },
];

const CUTS: FxCut[] = [
  { at: F(5.4), kind: "glitch", len: 10 },    // cold open -> title
  { at: F(43.01), kind: "blurDip", len: 14 }, // same camera (sx) joins
  { at: F(46.48), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => (
  <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} fill={s.fill} /></FilmLook_FX>
);

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [5.35, "sfx_n2/glitch_02.wav", -24],  // into the title
  [5.9, "sfx_n2/title_hit_01.wav", -24],
  [35.05, X + "boom_2.wav", -27],       // the blast replayed at half speed (picture only under the VO)
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
          <Sequence from={F(5.4)} durationInFrames={F(10.0) - F(5.4)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={1.0} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST HORRIFYING", size: 108, at: F(0.25) }, { text: "THEME PARK ACCIDENTS", size: 108, at: F(0.55) }, { text: "THAT WILL HAUNT YOU FOREVER", size: 56, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* cold open: the crowd's own sound (rawclean'd by case 11, owner rule 5b), out before the title */}
      <Sequence from={0} durationInFrames={F(5.5)} layout="none">
        <Audio src={staticFile(C + "media/co_clean.wav")} startFrom={F(1.0)} volume={(f) => interpolate(f, [0, 3, F(4.9), F(5.5)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* VO: the intro take, whole */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (−11.6 LUFS file -> −21.4 dB ≈ 10 LU under the VO), enters on the title, out with the intro */}
      <Sequence from={F(5.4)} durationInFrames={F(49.8) - F(5.4)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => dB(-21.4) * interpolate(f, [0, 12, F(4.0), F(5.0), F(42.6), F(44.4)], [0, 1.5, 1.5, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
