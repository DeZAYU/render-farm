// Amusement Parks Iceberg #06 (LEVEL 1) — Dueling Dragons (Dragon Challenge since 2010): Carlos Montalvo, 52, loses his right eye,
// Islands of Adventure, Orlando, 31 Jul 2011. Nothing of the incident was filmed (narrated case per the outline); YouTube's bot check
// blocked the personal off-ride clips all night, so the case runs on real Commons photos of the ride (ThrillZing July 2006, Jeremy
// Thompson 2001/2012, Rmkf1982 2004, Dragon Challenge 01-08) and the real Claims Journal story (25 Oct 2011). No raw: no incident clip.
// Devices: dev/AM06_PassGap (both trains in one photo, the gap between them), dev/AM06_SlitLight ("eye discomfort" on the real page).
// No photo of Montalvo (outline), no injury image. VO = one continuous take after the 4 s title card.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { PassGap } from "../dev/AM06_PassGap";
import { SlitLight } from "../dev/AM06_SlitLight";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0;
const END = TC + 90.3; // last word 88.89 + hold
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 0.0, b: 6.9, vo: "At Universal's Islands of Adventure in Orlando, two roller coasters were built to look like they were about to crash into each other. (the two dragon heads facing off)", src: "heads.jpg", s0: 1.03, s1: 1.13, fx: 0.5, fy: 0.45,
    over: <RedLabel text="ISLANDS OF ADVENTURE · ORLANDO" at={F(1.0)} hold={F(3.2)} size={42} /> },
  { a: 6.9, b: 10.6, vo: "On Dueling Dragons, two trains left the station together, (the Dueling Dragons sign, 2006)", src: "sign.jpg", fill: true, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.4 },
  { a: 10.6, b: 13.0, vo: "riders' legs dangling under the track, (an inverted train, legs hanging)", src: "legs.jpg", s0: 1.05, s1: 1.13, fx: 0.6, fy: 0.35 },
  { a: 13.0, b: 17.9, vo: "and they twisted around each other so they'd pass within feet at up to 60 miles an hour. (Ice train in its loop through the red track)", src: "loop2.jpg", s0: 1.02, s1: 1.12, fx: 0.4, fy: 0.45 },
  { a: 17.9, b: 22.6, vo: "In 2010 it became Dragon Challenge for the Wizarding World of Harry Potter, (the Dragon Challenge gate)", src: "entrance.jpg", s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.4,
    over: <RedLabel text="DRAGON CHALLENGE · 2010" at={F(1.8)} hold={F(2.6)} /> },
  { a: 22.6, b: 26.9, vo: "but the duel didn't change. That near miss was why you got in line. (Fire train beside the Ice loop)", src: "dc02.jpg", s0: 1.04, s1: 1.14, fx: 0.7, fy: 0.55 },
  { a: 26.9, b: 34.4, vo: "On July 31, 2011, Carlos Montalvo, a 52-year-old nurse visiting from Puerto Rico, was on board. (an Ice train through its loop)", src: "dc08.jpg", s0: 1.02, s1: 1.12, fx: 0.5, fy: 0.4,
    over: <><RedLabel text="JULY 31, 2011" at={F(0.5)} hold={F(2.0)} /><RedLabel text="CARLOS MONTALVO, 52" at={F(2.5)} hold={F(3.6)} /></> },
  { a: 34.4, b: 39.9, vo: "Just as the trains swept past each other, something hit him in the right eye, and he didn't see what it was. (PassGap)",
    node: <PassGap src={GR + "cs.jpg"} a={[260, 330, 730, 720]} b={[1080, 300, 1420, 640]} gap={[[700, 470], [1060, 500]]} bracketAt={F(34.97 - 34.4)} lineAt={F(35.5 - 34.4)} sinkAt={F(36.77 - 34.4)} /> },
  { a: 39.9, b: 45.4, vo: "His lawyer later said the eye had to be removed, and Montalvo's other eye was already weak. (the intertwined track, slow)", src: "tangle.jpg", s0: 1.0, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 45.4, b: 48.2, vo: "Universal reopened the ride in less than a day. (the Dragon Challenge castle)", src: "castle.jpg", s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: 48.2, b: 56.4, vo: "In its injury report to the state, the park called what happened to him 'eye discomfort.' I can't think of a milder way to put losing an eye. (SlitLight: Claims Journal)",
    node: <SlitLight page={C + "shots/cj_clean.png"} pw={1226} ph={1504} slit={[1399, 1428]} slitAt={F(50.6 - 48.2)} rule={[792, 1004, 1428]} ruleAt={F(51.99 - 48.2)}
      keys={[{ at: 0, y: 420, k: 1.0 }, { at: F(1.7), y: 1210, k: 1.08 }, { at: F(3.0), y: 1413, k: 1.3 }, { at: F(8.2), y: 1413, k: 1.38 }]} /> },
  { a: 56.4, b: 58.8, vo: "What hit him? It was never found. (a Fire train through the trees)", src: "trees7.jpg", s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 58.8, b: 65.4, vo: "About two weeks later, another rider said something struck him in the face at the same spot, and again nothing turned up. (an Ice train upside down)", src: "dc04.jpg", fill: true, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.3,
    over: <RedLabel text="AUGUST 2011" at={F(0.6)} hold={F(2.4)} /> },
  { a: 65.4, b: 71.7, vo: "The likeliest answer is a loose phone or keys flying from one train into the other, but it's never been confirmed. (Fire train cresting under the Ice track)", src: "pass17.jpg", s0: 1.03, s1: 1.14, fx: 0.3, fy: 0.55 },
  { a: 71.7, b: 77.9, vo: "Universal said the ride wasn't to blame, but it put up signs about lockers and started launching the trains apart. (a lone Fire train, 2012)", src: "dc03.jpg", s0: 1.02, s1: 1.1, fx: 0.75, fy: 0.55 },
  { a: 77.9, b: 80.8, vo: "In October 2011 the duel ended for good. (a lone Ice train, 2012)", src: "dc05.jpg", s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.45,
    over: <RedLabel text="OCTOBER 2011" at={F(0.4)} hold={F(2.2)} /> },
  { a: 80.8, b: 82.6, vo: "I get why people loved it. (the queue under the dragon, 2001)", src: "dd2001.jpg", s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 82.6, b: END - TC, vo: "But if you sell two trains passing that close, anything that comes loose from one has the other right there to hit. (the two trains head to head, 2004)", src: "h2h.jpg", s0: 1.02, s1: 1.16, fx: 0.6, fy: 0.55 },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(TC + 48.2), kind: "blurDip", len: 12 },
  { at: F(TC + 56.4), kind: "blurDip", len: 12 },
];

const SFX: [number, string, number, number?][] = [
  [TC - 0.05, "sfx_n2/glitch_01.wav", -24],
  [TC + 35.35, "sfx_n2/whoosh_01.wav", -26],
  [TC + 36.75, "sfx_n2/real/sub_drop_2.wav", -20],
  [TC + 48.15, "sfx_n2/real/paper_2.wav", -22],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => (
  <FilmLook_FX grain={0.08}>{s.node ?? <Shot_FX src={GR + s.src!} still fill={s.fill} n={F(s.b) - F(s.a)} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} />}</FilmLook_FX>
);

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="DUELING DRAGONS" bg={GR + "h2h.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(TC + s.a)} durationInFrames={F(TC + s.b) - F(TC + s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(TC + 89.0)} layout="none"><FadeBlack len={F(END - TC - 89.0)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (-11.4 LUFS file) at -22 dB */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(8)} volume={(f) => dB(-22) * interpolate(f / 30, [0, 1.2, END - 1.6, END], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
