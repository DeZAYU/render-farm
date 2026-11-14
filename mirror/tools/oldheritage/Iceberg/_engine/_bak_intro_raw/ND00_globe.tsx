// ND INTRO — "The Most TERRIFYING Natural Disasters Ever Recorded" (rebuilt 3 Nov 2026 twice; owner: "no raw in intro, just VO with 3D
// motion or clip", then real 3-D motion "showing many cases"). Countdown video: no iceberg. The intro VO runs straight through from 0.5 s over
// silent footage of the video's own cases, one picture per line, hard cuts on the words; a glitch on the turn ("nineteen of the days it
// didn't", the Ontake ash cloud swallowing the trail); then GlobeRun (ND00_GlobeRun: a real 3-D Blue Marble globe, the camera flying
// Americas -> Europe -> Asia -> Japan while all 19 cases pin in with a white-framed card of their footage + red place/year) on "The most
// terrifying natural disasters ever recorded, and what the people standing in their way did next", blur-dip into the title + short hold.
// No clip sound anywhere. Backup of the cold-open version: _engine/_bak_intro_raw/ND00.tsx (the old master's raw was spliced to 14 s).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { VideoTitle } from "../dev/ND00_VideoTitle";
import { GlobeRun, type GFeat, type GPin, type Cam } from "../dev/ND00_GlobeRun";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.5;     // VO (INTRO.mp3, whole) starts here
const G = 8.28;    // glitch on "These are nineteen of the days it didn't" (V+7.78)
const T = 22.55;   // title on "Let's begin." (V+22.05); VO ends V+23.17
export const DUR = F(26.85);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode };
// GlobeRun v2 (frames from 10.54 s): four featured cases, each on its own VO line, footage playing in the card; the other 15 fade in at the end
const GFEATS: GFeat[] = [
  { lon: -90.88, lat: 14.47, label: "FUEGO, GUATEMALA · 2018", video: GR + "fue.mp4", from: 8.0, drop: 16, out: 80 },        // "A volcano turns a Sunday drive into a race."
  { lon: 141.72, lat: 39.07, label: "ŌFUNATO, JAPAN · 2011", video: GR + "ofu2.mp4", from: 8.0, drop: 112, out: 170 },     // "A harbour fills to the rooftops in a few minutes."
  { lon: 86.86, lat: 28.0, label: "EVEREST BASE CAMP · 2015", video: GR + "eve.mp4", from: 5.0, drop: 198, out: 256 },     // "The most terrifying natural disasters ever recorded,"
  { lon: -121.62, lat: 39.76, label: "PARADISE, CALIFORNIA · 2018", video: GR + "cmp.mp4", from: 1.0, drop: 284, out: 336 }, // "and what the people ... did next."
];
const GCTX: GPin[] = [
  [-104.99, 39.74], [-83.51, 35.71], [-93.22, 30.23], [-81.09, 24.71], [-0.46, 39.46], [6.4, 46.5], [6.76, 50.55], [78.79, 31.04],
  [96.08, 21.97], [99.2, 7.43], [151.95, -27.56], [137.48, 35.89], [141.02, 38.31], [141.57, 38.91], [141.49, 40.51],
].map(([lon, lat]) => ({ lon, lat }));
// lon kept continuous across the flights (Pacific westward: 141.72 = -218.28; Nepal 86.86 = -273.14; then back east to Paradise)
const GCAM: Cam[] = [
  { f: 0, lon: -97, lat: 20, r: 560 }, { f: 20, lon: -90.88, lat: 14.47, r: 640 }, { f: 80, lon: -91.6, lat: 15.2, r: 660 },
  { f: 116, lon: -218.28, lat: 39.07, r: 640, hop: 430 }, { f: 170, lon: -219, lat: 38.6, r: 660 },
  { f: 202, lon: -273.14, lat: 28.0, r: 640, hop: 540 }, { f: 256, lon: -273.8, lat: 28.4, r: 660 },
  { f: 288, lon: -121.62, lat: 39.76, r: 640, hop: 440 }, { f: 330, lon: -122.3, lat: 39.4, r: 660 },
  { f: 361, lon: -100, lat: 33, r: 470 },
];
const SHOTS: Sh[] = [
  { a: 0, b: 4.02, vo: "We build our lives on a quiet assumption that the ground stays put (Ōfunato, the harbour)", src: "ofu.mp4", from: 4.0, s0: 1.02, s1: 1.08 },
  { a: 4.02, b: 6.09, vo: "and the sea stays where we left it. (Koh Ngai, calm)", src: "kng.mp4", from: 0.5, s0: 1.04, s1: 1.09 },
  { a: 6.09, b: G, vo: "Most days, that assumption holds. (Fuego: traffic on the road below the volcano)", src: "fue.mp4", from: 0.2, s0: 1.03, s1: 1.07 },
  { a: G, b: 10.54, vo: "These are nineteen of the days it didn't. (Ontake: the ash cloud swallows the trail, picture only)", src: "ont.mp4", from: 0.5, s0: 1.03, s1: 1.09 },
  { a: 10.54, b: T, vo: "A volcano turns a Sunday drive into a race. A harbour fills to the rooftops in a few minutes. The most terrifying natural disasters ever recorded, and what the people standing in their way did next. (GlobeRun v2: Fuego, Ōfunato, Everest, Paradise featured; 15 context pins)",
    node: <GlobeRun tex={GR + "world_4k.jpg"} feats={GFEATS} context={GCTX} cam={GCAM} ctx0={326} ctx1={356} /> },
  { a: T, b: 26.85, vo: "Let's begin. (title)",
    node: <VideoTitle bg={GR + "title_bg.jpg"} fadeAt={F(3.6)} lines={[{ t: "THE MOST", size: 64, at: F(0.15) }, { t: "TERRIFYING", size: 150, at: F(0.45) }, { t: "NATURAL DISASTERS EVER RECORDED", size: 64, at: F(0.85) }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(G), kind: "glitch", len: 10 },
  { at: F(T), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return s.vo.startsWith("Let's") ? <>{s.node}</> : <FilmLook_FX grain={0.06}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5 from the first frame under the VO, swells a little under the title, eases out */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(4)} volume={(f) => dB(-13) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.5), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      <Sequence from={F(G - 0.05)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-24)} /></Sequence>
      <Sequence from={F(T + 0.05)} layout="none"><Audio src={staticFile("sfx_n2/title_hit_01.wav")} volume={dB(-22)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
