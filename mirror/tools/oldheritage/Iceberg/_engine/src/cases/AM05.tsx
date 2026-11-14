// Amusement Parks Iceberg #05 (LEVEL 1) — The Ultimate hits a deer: Lightwater Valley, North Stainley near Ripon, North Yorkshire,
// Sat 27 Sep 2014 ~11:15. No footage of the strike exists anywhere (the outline: narrated case); YouTube personal ride clips were
// blocked by the bot check all night, so the case is built from the real Commons photos of The Ultimate (Stefan Scheer 2009, S J Simms
// 2004, Chris Heaton / geograph 2006), two real roe-deer clips from Commons (Peter Trimming, England 2016; Scarabinol, 2025) and the
// real IBTimes UK story (1 Oct 2014). No raw: there is no incident clip, and a ride clip's own sound would be a raw outside the incident.
// Devices: dev/AM05_DeerStill (deer held, hard cut to black on "hit"), dev/AM05_ReadLine (the IBTimes page, the spokeswoman's line read).
// VO = one continuous take (vor/CASE05.mp3 from 0), starting after the 4 s title card; picture cut on the words (srt times below = VO s).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { DeerStill } from "../dev/AM05_DeerStill";
import { ReadLine } from "../dev/AM05_ReadLine";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0;              // title card; VO time t sits at timeline TC + t
const END = TC + 72.2;       // last word 70.81 + hold
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode; drain?: [number, number] };

// a, b in VO seconds
const SHOTS: Sh[] = [
  { a: 0.0, b: 4.79, vo: "Picture yourself in the front row of The Ultimate at Lightwater Valley in North Yorkshire, England. (the front seats on the lift)", src: "seats.jpg", still: true, s0: 1.04, s1: 1.16, fx: 0.62, fy: 0.55,
    over: <RedLabel text="LIGHTWATER VALLEY · NORTH YORKSHIRE" at={F(2.4)} hold={F(2.1)} size={40} /> },
  { a: 4.79, b: 12.0, vo: "When it opened in 1991, this steel coaster was the longest in the world, about 1.4 miles of track. (up the lift hills)", src: "lifts.jpg", still: true, s0: 1.55, s1: 1.62, fx: 0.72, fy: 0.5, panY: [170, -150],
    over: <RedLabel text="THE ULTIMATE" at={F(2.7)} hold={F(2.4)} /> },
  { a: 12.0, b: 17.9, vo: "A ride lasts around seven and a half minutes, and most of it runs out through the woods, far from the crowds. (the track in the trees beyond a field)", src: "trees.jpg", still: true, s0: 1.02, s1: 1.14, fx: 0.62, fy: 0.42 },
  { a: 17.9, b: 24.72, vo: "It's about a quarter past eleven on a Saturday morning in late September 2014, and your train's coming around at speed. (a full train on the lift)", src: "train.jpg", still: true, s0: 1.04, s1: 1.2, fx: 0.7, fy: 0.4,
    over: <RedLabel text="SEPTEMBER 27, 2014" at={F(3.1)} hold={F(1.4)} /> },
  { a: 24.72, b: 30.0, vo: "There's a young deer standing on the track. The train hit it, and the deer was killed instantly. (DeerStill: the deer, held; black on 'hit')",
    node: <DeerStill src={GR + "deer1.mp4"} from={1.0} rate={0.6} freeze={F(26.35 - 24.72)} cut={F(27.58 - 24.72)} focus={[0.7, 0.72]} s0={1.5} s1={1.95} /> },
  { a: 30.0, b: 34.8, vo: "None of the riders were hurt, though a few came back into the station badly needing a wash. (a train in the station)", src: "station.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 34.8, b: 45.9, vo: "Staff closed the ride for about half an hour, cleaned up and then opened it again. A park spokeswoman said ... wild animals get in overnight. (ReadLine: IBTimes UK)",
    node: <ReadLine page={C + "shots/ibt_clean.png"} pw={2560} ph={3006} bg={GR + "trees.jpg"} shadeAt={F(40.0 - 34.8)}
      keys={[{ at: 0, x: 1100, y: 470, k: 0.6, ry: 24 }, { at: F(1.6), x: 1050, y: 2860, k: 0.7, ry: 15 }, { at: F(4.4), x: 1000, y: 2870, k: 0.72, ry: 13 },
        { at: F(5.6), x: 640, y: 2420, k: 0.96, ry: 6 }, { at: F(11.1), x: 600, y: 2450, k: 1.04, ry: 3 }]}
      lines={[{ box: [600, 2370, 887, 2411], at: F(43.22 - 34.8), len: 14 }, { box: [104, 2438, 932, 2479], at: F(43.7 - 34.8), len: 30 }, { box: [104, 2506, 200, 2547], at: F(44.75 - 34.8), len: 8 }]}
      rule={{ boxes: [[770, 2438, 932, 2479], [104, 2506, 186, 2547]], at: F(45.04 - 34.8) }} /> },
  { a: 45.9, b: 52.4, vo: "And it wasn't the first time. In June 1994, another deer wandered out of the woods and onto the same track. (a deer at the wood's edge)", src: "deer2.mp4", from: 16.5, s0: 1.35, s1: 1.45, fx: 0.55, fy: 0.45,
    over: <RedLabel text="JUNE 1994" at={F(1.9)} hold={F(2.6)} /> },
  { a: 52.4, b: 56.9, vo: "Twice in twenty years? That's two more than most coasters ever manage. (a deer looks back)", src: "deer1.mp4", from: 33.5, s0: 1.4, s1: 1.5, fx: 0.4, fy: 0.8 },
  { a: 56.9, b: 61.8, vo: "The Ultimate ran for five more seasons and didn't open in 2020 because of the pandemic. (the structure in the trees, close)", src: "trees.jpg", still: true, s0: 1.7, s1: 1.82, fx: 0.62, fy: 0.3 },
  { a: 61.8, b: END - TC, vo: "In January 2023 the park's new owners started tearing it down ... and by April the old record holder was gone. (both lift hills, wide; drains to grey, fades on 'gone')", src: "lifts.jpg", still: true, s0: 1.12, s1: 1.0, fx: 0.6, fy: 0.45,
    drain: [F(65.3 - 61.8), F(70.6 - 61.8)],
    over: <RedLabel text="APRIL 2023" at={F(68.9 - 61.8)} hold={F(1.6)} /> },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },             // title card -> the case
  { at: F(TC + 34.8), kind: "blurDip", len: 12 },     // into the IBTimes page
  { at: F(TC + 45.9), kind: "blurDip", len: 12 },     // out of the page, back to 1994
];

const SFX: [number, string, number, number?][] = [
  [TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [TC + 27.55, "sfx_n2/real/impact_3.wav", -17],
  [TC + 34.75, "sfx_n2/real/page_turn_1.wav", -22],
];

/** the last shot: the lift hills drain to grey as the demolition is spoken, then fade out on "gone" */
const Drain: React.FC<{ at: [number, number]; children: React.ReactNode }> = ({ at, children }) => {
  const f = useCurrentFrame();
  const g = interpolate(f, [at[0], at[0] + 60], [0, 1], cl);
  return <AbsoluteFill style={{ filter: `saturate(${1 - 0.85 * g}) brightness(${1 - 0.25 * g})` }}>{children}</AbsoluteFill>;
};

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  const shot = <Shot_FX src={GR + s.src!} still={s.still} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} panY={s.panY} />;
  return <FilmLook_FX grain={0.08}>{s.drain ? <Drain at={s.drain}>{shot}</Drain> : shot}</FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="THE ULTIMATE AND THE DEER" bg={GR + "lifts.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(TC + s.a)} durationInFrames={F(TC + s.b) - F(TC + s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(TC + 70.6)} layout="none"><FadeBlack len={F(END - TC - 70.6)} /></Sequence>
      {/* VO: one take, never split (no raw in this case) */}
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3 (-13.5 LUFS file) at -20 dB, a beat of silence under the black after "hit" */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 - TC;
          const hole = interpolate(t, [27.4, 27.6, 29.6, 31.0], [1, 0.25, 0.25, 1], cl);
          return dB(-20) * interpolate(f / 30, [0, 1.2, END - 1.6, END], [0, 1, 1, 0], cl) * hole;
        }} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
