// ND #19 (last case) — Kitahama, Shiogama, Miyagi (11 Mar 2011). TSUNE's own phone clip from his third floor (vertical, pillarboxed in a
// 640x480 file -> cropped to 360x480 = shgv, 0-77.4 s; the phone turns landscape at 77.5 -> shgh, from 77.9 s; one source cut at 90.92).
// Devices for this case's beats: ThirdFloor (his window on a plain elevation beside his own clip), IslandShield (Matsushima Bay's islands lit
// on Sentinel-2, a surge band dimmed behind them), TollSquares (coastal cities' tolls as square areas, Shiogama red). Ōfunato callback =
// case 1's own footage. VO = one take (no count word: "We're going back..." is kept), split only for the three raws.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { ThirdFloor } from "../dev/ND19_ThirdFloor";
import { IslandShield } from "../dev/ND19_IslandShield";
import { TollSquares } from "../dev/ND19_TollSquares";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(90.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

// VO-A take 0-11.82 @4.0 | RAW1 16.0-28.2 | VO-B 11.82-21.75 @28.5 (+16.68) | RAW2 38.6-48.6 | VO-C 21.75-28.5 @48.9 (+27.15)
// RAW3 55.9-68.1 | VO-D 28.5-end @68.4 (+39.9)
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.71, vo: "We're going back to the 11th of March 2011 for the last one.", src: "shgv.mp4", from: 5.0, fill: true, s0: 1.0, s1: 1.04,
    over: <RedLabel text="MARCH 11, 2011" at={F(0.9)} hold={F(2.4)} /> },
  { a: 7.71, b: 11.54, vo: "TSUNE, a guitarist from Shiogama in Miyagi Prefecture,", src: "shgv.mp4", from: 9.5, fill: true, s0: 1.02, s1: 1.07,
    over: <RedLabel text="SHIOGAMA, MIYAGI" at={F(0.8)} hold={F(2.6)} /> },
  { a: 11.54, b: 16.0, vo: "was on the third floor of his home in the Kitahama district when the water came.",
    node: <ThirdFloor src={GR + "shgv.mp4"} from={0.2} label="KITAHAMA" labelAt={F(1.6)} waterAt={[F(1.2), F(4.2)]} /> },
  // RAW 1: the water racing past the yellow building, debris riding it
  { a: 16.0, b: 28.2, vo: "RAW", src: "shgv.mp4", from: 13.4, fill: true, s0: 1.0, s1: 1.05 },
  { a: 28.2, b: 38.6, vo: "Shiogama sits on Matsushima Bay, behind more than two hundred small islands. Those islands are widely credited with taking some of the force out of the wave before it got here.",
    node: <IslandShield img={GR + "bay_s.jpg"} iw={3262} ih={2674} field={GR + "bay_isl.png"} fscale={2} nIsl={256}
      cam0={[1640, 1300, 3262]} cam1={[1250, 1350, 2500]} lightAt={[F(2.3), F(4.8)]} band={[F(5.0), F(9.2)]} dir={[-0.8, -0.6]}
      port={[600, 1360, 850, 1590]} portAt={F(8.8)} label="SHIOGAMA" bayLabel="MATSUSHIMA BAY" bayAt={F(0.4)} /> },
  // RAW 2: the water running between the houses
  { a: 38.6, b: 48.6, vo: "RAW", src: "shgv.mp4", from: 39.5, fill: true, s0: 1.0, s1: 1.05 },
  { a: 48.6, b: 50.82, vo: "There are cars in the street below him.", src: "shgv.mp4", from: 27.0, fill: true, s0: 1.08, s1: 1.14, fy: 0.6 },
  { a: 50.82, b: 55.9, vo: "From three floors up, he's high enough to be safe and close enough to see each one go.", src: "shgv.mp4", from: 55.8, fill: true, s0: 1.0, s1: 1.05 },
  // RAW 3: the phone turns: cars carried down the street
  { a: 55.9, b: 68.1, vo: "RAW", src: "shgh.mp4", from: 0.7, s0: 1.02, s1: 1.07 },
  { a: 68.1, b: 71.26, vo: "Even so, water like this came through the town, (0.5x replay of the rush)", src: "shg_replay.mp4", from: 0, fill: true, s0: 1.1, s1: 1.18, fy: 0.6 },
  { a: 71.26, b: 78.18, vo: "and Shiogama's toll was still far lighter than its neighbours'. Miyagi Prefecture counts 42 lives lost from the city,",
    node: <TollSquares img={GR + "coast_s.jpg"} bbox={[140.75, 38.0, 141.62, 38.58]} iw={2534} ih={2152} k={2.1} at={F(0.3)} every={F(0.32)} meAt={F(2.6)}
      cam0={[141.19, 38.27, 0.86]} cam1={[141.17, 38.28, 0.78]}
      towns={[
        { lon: 140.93, lat: 38.11, toll: 186, name: "Iwanuma" },
        { lon: 140.95, lat: 38.175, toll: 954, name: "Natori" },
        { lon: 140.98, lat: 38.235, toll: 930, name: "Sendai" },
        { lon: 141.0, lat: 38.285, toll: 219 },
        { lon: 141.065, lat: 38.30, toll: 79 },
        { lon: 141.19, lat: 38.40, toll: 1133, name: "Higashimatsushima" },
        { lon: 141.3, lat: 38.425, toll: 3971, name: "Ishinomaki" },
        { lon: 141.022, lat: 38.318, toll: 42, name: "SHIOGAMA", me: true },
      ]} /> },
  { a: 78.18, b: 81.78, vo: "18 of them in the hard months afterwards, and nobody missing.", src: "shgv.mp4", from: 73.6, fill: true, s0: 1.0, s1: 1.04 },
  { a: 81.78, b: 86.2, vo: "Ōfunato had a tsunami museum and fifty-eight evacuation sites. (case 1's own footage)", src: "ofu.mp4", from: 0, s0: 1.02, s1: 1.07,
    over: <RedLabel text="ŌFUNATO" at={F(0.3)} hold={F(3.4)} /> },
  { a: 86.2, b: 90.6, vo: "Shiogama had a few hundred islands standing in the way.",
    node: <Aerial src={GR + "bay_s.jpg"} iw={3262} ih={2674} spot={[1223, 968, 2191, 1529]} z0={1.05} z1={1.25} boxAt={F(0.8)} /> },
];

export const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.71), kind: "blurDip", len: 12 },
  { at: F(28.2), kind: "zoomHit", len: 10 },
  { at: F(48.6), kind: "blurDip", len: 12 },
  { at: F(50.82), kind: "blurDip", len: 12 },
  { at: F(55.9), kind: "blurDip", len: 12 },
  { at: F(68.1), kind: "blurDip", len: 12 },
  { at: F(71.26), kind: "glitch", len: 8 },
  { at: F(86.2), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [11.5, "sfx_n2/whoosh_01.wav", -32],
  [28.15, "sfx_n2/whoosh_03.wav", -28],
  [33.4, X + "reverse_swell_3.wav", -28],   // the surge band crosses the bay
  [71.2, "sfx_n2/glitch_03.wav", -28],
  [73.9, X + "sub_drop_2.wav", -24],        // Shiogama's square
];

// raw windows [edit start, edit end, audio file, source start]
const RAWS: [number, number, string, number][] = [[16.0, 28.2, "case/media/shg_v_clean.wav", 13.4], [38.6, 48.6, "case/media/shg_v_clean.wav", 39.5], [55.9, 68.1, "case/media/shg_h_clean.wav", 0.7]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE THIRD FLOOR IN KITAHAMA" bg={GR + "shg_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* last 0.7 s: ease to black */}
      <Sequence from={F(89.9)} layout="none"><FadeIn n={F(0.7)} /></Sequence>
      {/* VO: one take, split only where a raw plays */}
      <Sequence from={F(4.0)} durationInFrames={F(11.95)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} /></Sequence>
      <Sequence from={F(28.5)} durationInFrames={F(21.9) - F(11.82)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(11.82)} /></Sequence>
      <Sequence from={F(48.9)} durationInFrames={F(28.6) - F(21.75)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(21.75)} /></Sequence>
      <Sequence from={F(68.4)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(28.5)} /></Sequence>
      {RAWS.map(([a, b, file, src], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} startFrom={F(src)} volume={(f) => dB(-3) * interpolate(f, [0, 6, F(b - a) - 10, F(b - a) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, under the VO only; out for each raw */}
      {([[4.0, 16.3, 0], [28.0, 38.9, 14], [48.4, 56.2, 26], [67.8, 90.6, 36]] as [number, number, number][]).map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => dB(-21) * interpolate(f, [0, 20, F(b - a) - 40, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeIn: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />;
};
