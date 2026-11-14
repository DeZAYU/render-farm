// Amusement Parks Iceberg #16 (LEVEL 4 opens, case 1): the Perilous Plunge death, Knott's Berry Farm, Buena Park, California, 21 Sep 2001.
// The take (vor/CASE16.mp3) opens with the level line ("The abyss is where the design itself was the problem…", 0–5.04), so the case
// opens on the iceberg: dev/AM_LevelEntry (Level 4 "THE ABYSS"), then the TitleCard, then the case.
// No film of the event; the ride clips found on small channels (2002 off-ride, POVs) hit YouTube's bot check: not bypassed (NOTES.md).
// Built from the one free photo of the ride (Cliff, 2002, CC BY 2.0), Knott's Boardwalk photos (2003 / 2013 / 2018) and the real AP story
// (The Daily Herald, 24 Oct 2001). VO split only once: the level line inside the level entry, the rest unbroken. No raws.
// Handle with care: the death said once, no fall height, no landing detail; her size stated once as the investigators' point; the
// restraint and the missing rule lead; children not mentioned; no lawsuit outcome claimed.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { LevelEntry } from "../dev/AM_LevelEntry";
import { WireFold } from "../dev/AM16_WireFold";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const LE = 7.0, TC = 4.0, V0 = 5.04;          // level entry, title card, where the case's VO starts in the take
const T = (t: number) => LE + TC + (t - V0);  // take time -> timeline
const END = T(84.89) + 1.3;
export const DUR = F(END);

const Dim: React.FC<{ a: number; to: number }> = ({ a, to }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [a, a + 50], [0, to], cl) }} />;
};

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };
const r = (s: number, a: number) => F(s - a);

const SHOTS: Sh[] = [
  { a: 5.04, b: 9.06, vo: "When Knott's Berry Farm opened Perilous Plunge in September 2000, (the lift tower and the top of the chute, 2002)", src: "pp.jpg", s0: 1.5, s1: 1.62, fx: 0.62, fy: 0.22,
    over: <><RedLabel text="KNOTT'S BERRY FARM" at={F(0.4)} hold={F(1.8)} /><RedLabel text="SEPTEMBER 2000" at={F(2.6)} hold={F(1.3)} /></> },
  { a: 9.06, b: 12.80, vo: "it was billed as the tallest, steepest water ride in the world. (a guest's 2005 clip: a boat down the chute into the splash, framed over its blurred copy)", node: <Inset src={GR + "ep.mp4"} from={0.7} ar={4 / 3} box={0.56} /> },
  { a: 12.80, b: 17.42, vo: "Its boats dropped 115 feet at close to 78 degrees. (a rider's 2011 POV: over the top and down the chute)", src: "pov.mp4", from: 21.4, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 17.42, b: 21.73, vo: "Almost exactly a year later, on September 21, 2001, (2010 clip: the chute, a boat hits the pool)", src: "sam.mp4", from: 161.8, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45,
    over: <RedLabel text="SEPTEMBER 21, 2001" at={F(19.23 - 17.42)} hold={F(2.2)} /> },
  { a: 21.73, b: 27.25, vo: "Lori Mason-Larez rode it with her family. She was 40, a mother of five from Duarte. (2011 POV: the climb, the park below)", src: "pov.mp4", from: 2.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5,
    over: <RedLabel text="LORI MASON-LAREZ, 40" at={F(0.2)} hold={F(4.6)} /> },
  { a: 27.25, b: 30.78, vo: "During the descent she came out of the boat, and she was killed. (the chute, slow push, darkening)", src: "pp.jpg", s0: 1.8, s1: 1.9, fx: 0.42, fy: 0.42,
    over: <Dim a={F(1.2)} to={0.45} /> },
  { a: 30.78, b: 33.37, vo: "The ride shut, and the arguing started. (Knott's, 2003)", src: "sky.jpg", fill: true, s0: 1.35, s1: 1.42, fx: 0.5, fy: 0.25 },
  { a: 33.37, b: 52.72, vo: "Intamin pointed to the coroner's report ... the only rule posted at the ride was a four-foot minimum height. There wasn't a word about size. (WireFold: the AP story)",
    node: <WireFold page={C + "shots/ap_sheet.png"} pw={1300} ph={1743} bg={GR + "pp.jpg"}
      keys={[{ at: 0, y: 330, k: 0.8, para: [100, 360] }, { at: r(35.09, 33.37), y: 735, k: 1.15, para: [665, 800] }, { at: r(41.45, 33.37), y: 920, k: 1.15, para: [875, 962] },
        { at: r(43.56, 33.37), y: 1180, k: 1.15, para: [1130, 1222] }, { at: r(47.17, 33.37), y: 1410, k: 1.22, para: [1340, 1472] }]}
      rule={{ segs: [[1181, 1220, 1430], [16, 243, 1472]], at: r(49.19, 33.37) }} /> },
  { a: 52.72, b: 56.69, vo: "Would you have read that sign and thought you might not fit? I wouldn't have. (2010: the loading station)", src: "sam.mp4", from: 2.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 56.69, b: 60.61, vo: "In March 2002, Cal OSHA mostly sided with the family. (the Boardwalk)", src: "boom.jpg", s0: 1.3, s1: 1.38, fx: 0.78, fy: 0.45,
    over: <RedLabel text="CAL/OSHA · MARCH 2002" at={F(1.5)} hold={F(2.2)} /> },
  { a: 60.61, b: 68.11, vo: "It ruled the restraints inadequate and said they'd contributed to her death, with her size and the position of the belt listed as factors. (the ride, wide, slow)", src: "pp.jpg", s0: 1.04, s1: 1.16, fx: 0.5, fy: 0.42 },
  { a: 68.11, b: 72.58, vo: "Knott's couldn't reopen it without changing the restraints or limiting who could ride. (the Boardwalk)", src: "boom.jpg", s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.4 },
  { a: 72.58, b: 75.18, vo: "Her family sued the park and Intamin. (the lift tower)", src: "pp.jpg", s0: 1.3, s1: 1.36, fx: 0.72, fy: 0.3 },
  { a: 75.18, b: 79.83, vo: "The boats came back with four-point harnesses, and the ride lasted another decade. (2010: staff check the four-point harnesses)", src: "sam.mp4", from: 52.8, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 79.83, b: 82.49, vo: "Perilous Plunge closed in September 2012, (Coast Rider, one of its replacements, 2013)", src: "bw2013.jpg", s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.35,
    over: <RedLabel text="SEPTEMBER 2012" at={F(0.8)} hold={F(1.6)} /> },
  { a: 82.49, b: 84.89 + 1.3, vo: "and three new rides took its place. (the Boardwalk in 2018: Surfside Gliders where it stood; fade)", src: "bw2018.jpg", s0: 1.0, s1: 1.07, fx: 0.55, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(LE + TC), kind: "glitch", len: 10 },
  { at: F(T(21.73)), kind: "blurDip", len: 12 },  // the 2010 splash -> the 2011 POV climb (two cameras, time jump)
  { at: F(T(33.37)), kind: "blurDip", len: 14 },
  { at: F(T(52.72)), kind: "blurDip", len: 12 },
  { at: F(T(79.83)), kind: "blurDip", len: 12 },
];

const SFX: [number, string, number][] = [
  [0.55, "sfx_n2/real/sub_drop_1.wav", -15],
  [LE + TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(33.3), "sfx_n2/real/paper_3.wav", -24],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={!s.src!.endsWith(".mp4")} from={s.from} fill={s.fill} n={F(T(s.b)) - F(T(s.a))} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(LE)} layout="none"><AbsoluteFill><LevelEntry n={4} name="THE ABYSS" at={{ level: 18, names: 60, mark: 165 }} /></AbsoluteFill></Sequence>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(LE)} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="PERILOUS PLUNGE" bg={GR + "pp.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END - 1.2)} layout="none"><FadeBlack len={F(1.2)} /></Sequence>
      {/* VO: the level line inside the level entry, then the case unbroken */}
      <Sequence from={F(0.6)} durationInFrames={F(V0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} /></Sequence>
      <Sequence from={F(LE + TC)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(V0)} /></Sequence>
      <Sequence from={0} durationInFrames={F(LE)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-24) * interpolate(f, [0, 15, F(LE) - 20, F(LE)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18.8 LUFS file) at -14 dB ≈ the -33 LUFS bed of AM14/AM15 */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(30)} volume={(f) => dB(-14) * interpolate(f / 30, [0, 1.2, END - 2.2, END], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
