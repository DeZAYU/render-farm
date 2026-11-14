// Theme Park video — INTRO ("25 Most HORRIFYING Theme Park Accidents That Will HAUNT You Forever"). Countdown video: no iceberg.
// Rebuilt 3 Nov 2026 (owner rule: "no raw in intro, just VO with 3D motion or clip"): the Tilburg cold open with its own crowd sound is
// gone. Opens on the video title (Elite, over Star City burning at night, case 13) under the music, glitch, then the intro VO, whole and
// continuous, over one real shot per phrase from the video's own cases (all silent under the music): a fair running normally, a rescuer at a
// rider's restraint on Joker's Jinx, up into the jammed Zipper's frame, the Big Tex crowd with phones up, the Barakaldo tower, The Flying
// Dinosaur's lift hill, a gondola of The Wheel at night, the Tilburg blast at 0.5x (picture only), the Martillo locked at its peak in Almería,
// then the Seville fair and the Steel Max masts before the launch, ending on the last line plus a short hold into case 1's title card.
// Backup of the cold-open version: _engine/_bak_intro_raw/TP00.tsx.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";
import { CaseWall, cardCenter, WALL_W, WALL_H, type WCard, type WFeat, type WKey } from "../dev/TP00_CaseWall";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const T = 4.0;  // title 0 -> T, glitch into the VO montage
const V = 4.1;  // VO (INTRO.mp3, whole) starts here; ends V+38.83
const O = 6.2;  // shot times below were laid out for the old V = 10.3; shifted by -O
export const DUR = F(49.8 - O);

type Sh = { a: number; b: number; vo: string; src?: string; node?: React.ReactNode; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; over?: React.ReactNode };
// graded windows (CASE00/graded, each cut 1 s before the used moment from the case's graded file):
// co = TP11 tk_mb (motion-blended tk) 32.0 (blast at +4.0) / fair = TP15 fair_a 2.0 / jj = TP07 jj 29.0 / zx = TP03 tp03_zx 2.0 / bw = TP12 bw 19.0 /
// bk = TP14 main 29.0 / fd = TP06 fd 59.0 / iw = TP10 iw 22.5 / tks = TP11 tk_slow / cause = TP08 a2 1.0 / sx = TP01 tp01_sx 21.0-49.0
// (launch at sx 50.6, never reached) / titlebg = TP13 main 138.0
// the countdown wall, 25 -> 1 (cards = a frame of each case's own graded footage)
const WALL: WCard[] = [
  { src: GR + "cards/TP25.jpg", label: "WEST ALLIS 2010" },
  { src: GR + "cards/TP24.jpg", label: "GURNEE 2018" },
  { src: GR + "cards/TP23.jpg", label: "TAMPA 2014" },
  { src: GR + "cards/TP22.jpg", label: "EASTBOURNE 2014" },
  { src: GR + "cards/TP21.jpg", label: "BANGKOK 2016" },
  { src: GR + "cards/TP20.jpg", label: "WESTON-SUPER-MARE 2008" },
  { src: GR + "cards/TP19.jpg", label: "CONEY ISLAND 2010" },
  { src: GR + "cards/TP18.jpg", label: "HASTINGS 2010" },
  { src: GR + "cards/TP17.jpg", label: "BLACKPOOL 2023" },
  { src: GR + "cards/TP16.jpg", label: "LONDON 2016" },
  { src: GR + "cards/TP15.jpg", label: "AACHEN 2022" },
  { src: GR + "cards/TP14.jpg", label: "BARAKALDO 2015" },
  { src: GR + "cards/TP13.jpg", label: "MANILA 2019" },
  { src: GR + "cards/TP12.jpg", label: "DALLAS 2012" },
  { src: GR + "cards/TP11.jpg", label: "TILBURG 2014" },
  { src: GR + "cards/TP10.jpg", label: "ORLANDO 2022" },
  { src: GR + "cards/TP09.jpg", label: "BERLIN 2009" },
  { src: GR + "cards/TP08.jpg", label: "ALMERÍA 2026" },
  { src: GR + "cards/TP07.jpg", label: "MARYLAND 2017" },
  { src: GR + "cards/TP06.jpg", label: "OSAKA 2018" },
  { src: GR + "cards/TP05.jpg", label: "GEISELWIND 2019" },
  { src: GR + "cards/TP04.jpg", label: "RENNES 2018" },
  { src: GR + "cards/TP03.jpg", label: "WILMINGTON 2023" },
  { src: GR + "cards/TP02.jpg", label: "YOGYAKARTA 2018" },
  { src: GR + "cards/TP01.jpg", label: "SEVILLE 2026" },
];
// CaseWall v2 (frames from 16.12 s = VO "These are twenty-five times"): soft reveal 0-110, Osaka (card j 19) on "Some of them are slow.
// Riders hang face-down for two hours in Osaka.", Orlando (card j 15) on "Sixty-two people sit stuck on a dark wheel over Orlando ..."
const [ox, oy] = cardCenter(19), [wx, wy] = cardCenter(15), MX = WALL_W / 2, MY = WALL_H / 2 - 10;
const WFEATS: WFeat[] = [
  { j: 19, video: GR + "fd.mp4", from: 0.6, vin: 142, vout: 214 },
  { j: 15, video: GR + "iw.mp4", from: 0.6, vin: 272, vout: 378 },
];
const WCAM: WKey[] = [
  { f: 0, x: MX - 350, y: MY - 260, s: 0.95, ry: -16, rx: 9 }, { f: 108, x: MX, y: MY, s: 0.66, ry: -12, rx: 7 },
  { f: 142, x: ox, y: oy, s: 2.5, ry: -6, rx: 3 }, { f: 218, x: ox - 20, y: oy, s: 2.6, ry: -6, rx: 3 },
  { f: 270, x: wx, y: wy, s: 2.5, ry: -6, rx: 3, hop: 1.1 }, { f: 381, x: wx + 20, y: wy, s: 2.62, ry: -6, rx: 3 },
];
const SHOTS0: Sh[] = [
  { a: 10.0, b: 14.6, vo: "A ride is built to scare you without ever putting you in danger. That's the whole deal. (a fair running, Aachen)", src: "fair.mp4", from: 1.0, s0: 1.03, s1: 1.1 },
  { a: 14.6, b: 17.72, vo: "You hand over your ticket, somebody checks your harness, (a rescuer at the riders' restraints, Joker's Jinx)", src: "jj.mp4", from: 1.0, s0: 1.06, s1: 1.14, fx: 0.62, fy: 0.4 },
  { a: 17.72, b: 22.32, vo: "and you trust that every bolt and cable on the thing was looked at by someone who cared. (up into the Zipper's frame)", src: "zx.mp4", from: 1.0, s0: 1.04, s1: 1.12, fy: 0.4 },
  { a: 22.32, b: 35.0, vo: "These are twenty-five times that deal broke while somebody was filming. Some of them are slow. Riders hang face-down for two hours in Osaka. Sixty-two people sit stuck on a dark wheel over Orlando on New Year's Eve. (CaseWall v2: soft reveal of all 25, then Osaka and Orlando featured with their footage)", node: <CaseWall cards={WALL} feats={WFEATS} cam={WCAM} fadeIn={[0, 80]} /> },
  { a: 35.0, b: 36.59, vo: "Some are over in a second. (the Tilburg blast, 0.5x, reframed)", src: "tks.mp4", from: 0.2, s0: 1.1, s1: 1.18, fx: 0.42, fy: 0.5 },
  { a: 36.59, b: 38.96, vo: "A few still don't have an official cause. (Almería: the Martillo locked at its peak, ladder at the arm; no cause confirmed)", src: "cause.mp4", from: 1.0, s0: 1.03, s1: 1.09, fy: 0.3 },
  { a: 38.96, b: 43.01, vo: "I've put the worst first. It's Friday evening at the Seville fair. (the street of rides, sx 22)", src: "sx.mp4", from: 1.0, s0: 1.0, s1: 1.06,
    over: <RedLabel text="SEVILLE, SPAIN" at={F(2.4)} hold={F(1.6)} /> },
  { a: 43.01, b: 46.48, vo: "Two kids are strapped into a slingshot called Steel Max, (the masts and cables, sx 31, tight)", src: "sx.mp4", from: 10.0, s0: 1.32, s1: 1.4, fx: 0.32, fy: 0.35 },
  { a: 46.48, b: 49.8, vo: "and one of its two cables is about to let go. (the masts, sx 44, ends before the launch)", src: "sx.mp4", from: 23.0, s0: 1.02, s1: 1.12, fy: 0.3 },
];

const SHOTS: Sh[] = SHOTS0.map((s) => ({ ...s, a: s.a - O, b: s.b - O }));

const CUTS: FxCut[] = [
  { at: F(T), kind: "glitch", len: 10 },          // title -> VO montage
  { at: F(43.01 - O), kind: "blurDip", len: 14 }, // same camera (sx) joins
  { at: F(46.48 - O), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => s.node ? <FilmLook_FX grain={0.06}>{s.node}</FilmLook_FX> : (
  <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} fill={s.fill} /></FilmLook_FX>
);

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [0.5, "sfx_n2/title_hit_01.wav", -24],
  [T - 0.05, "sfx_n2/glitch_02.wav", -24], // out of the title
  [35.05 - O, X + "boom_2.wav", -27],      // the blast replayed at half speed (picture only under the VO)
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
          <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={1.0} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST HORRIFYING", size: 108, at: F(0.25) }, { text: "THEME PARK ACCIDENTS", size: 108, at: F(0.55) }, { text: "THAT WILL HAUNT YOU FOREVER", size: 56, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (−11.6 LUFS file -> −21.4 dB ≈ 10 LU under the VO), from the first frame (up under the title), out with the intro */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => dB(-21.4) * interpolate(f, [0, 12, F(T - 0.4), F(T + 0.6), DUR - F(1.8), DUR], [0, 1.5, 1.5, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
