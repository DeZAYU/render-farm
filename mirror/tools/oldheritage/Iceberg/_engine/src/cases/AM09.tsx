// Amusement Parks Iceberg #09 (LEVEL 2, case 2) — Albanifest, Winterthur, Switzerland, night of Sat 27 / Sun 28 Jun 2009, shortly before
// 00:30: the Buser family's travelling Top Spin stopped dead mid-ride (gear damage); 28 riders left upright about 5 m up; the fire brigade
// took them off by turntable ladder within an hour; nobody reported hurt.
// Footage: [main] ceko9999's phone clip (9-ZoDMBO6hQ, AMBER, 320x240 -> 1440x1080 lanczos, graded). Its whole soundtrack is dubbed music
// (Ne-Yo) -> MUTED everywhere: the raws play silent under the music bed (VO paused), never the clip's own track.
// Stills (graded): Commons Albanifest 2023 banner (TheHelvetic, CC BY-SA 4.0), Albanifest 2007 street / ferris wheel / star flyer
// (Peter Alder, CC BY-SA 3.0), Huss Top Spin at Serengeti-Park (DerRaser, CC BY-SA 4.0: the ride type), a turntable ladder at night
// (SimonWaldherr, CC BY-SA 4.0: the kind of ladder, not the rescue). run_slow = main 0.95-3.65 @0.5x; stills f90.0 / f17.6 / f82 from graded main.
// The clip is full of ride-light flashes (srccuts: 0.9 1.07 2.4 3.7 4.5-5.2 6.4-8.0 17.8 20.2 24.2-24.9 27.4 30.4 35.5 37.3 49.7 52.6
// 58.5 69.2 75.3 78.3-79.3 85.2 85.5 93.4): windows sit between the hard ones; the rest are the ride's own lights (allowed in the render).
// VO split only at the two raws (sentence ends): A 0-19.80 @4.0 | RAW1 23.85-35.35 (src 8.0-19.5, running) | B 19.94-25.65 @35.35 (StopDead) |
// RAW2 41.10-52.10 (src 30.6-41.6, the gondola stuck above the sign) | C 25.95-end @52.10, last word 76.26 -> 102.41, hold + fade to 104.2.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { StopDead } from "../dev/AM09_StopDead";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(104.2);
const TC = 4.0;

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; fill?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.00, b: 9.27, vo: "Every June since 1971, the Swiss city of Winterthur has thrown the Albanifest, (the festival banner, 2023)", src: "banner.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.4,
    over: <RedLabel text="WINTERTHUR, SWITZERLAND" at={F(2.3)} hold={F(2.6)} /> },
  { a: 9.27, b: 12.52, vo: "a street festival that draws about a hundred thousand people. (the old town during the fair, 2007)", src: "street.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 12.52, b: 17.84, vo: "Late one Saturday night in 2009, someone's phone is pointed up at its Top Spin, (his clip, 0.5x)", src: "run_slow.mp4", fill: true, from: 0, s0: 1.0, s1: 1.05,
    over: <RedLabel text="ALBANIFEST 2009" at={F(1.4)} hold={F(2.4)} /> },
  { a: 17.84, b: 23.85, vo: "a long gondola hung between two big arms that swings riders high and flips them head over heels. (a Top Spin by day: the ride type)", src: "topspin.jpg", still: true, s0: 1.0, s1: 1.1, fx: 0.5, fy: 0.45 },
  // RAW 1 (11.5 s, silent: dubbed music muted): src 8.0-19.5, the ride running, the gondola flipping past the neon sign
  { a: 23.85, b: 35.35, vo: "RAW 1: running (src 8.0-19.5)", src: "main.mp4", fill: true, from: 8.0, s0: 1.0, s1: 1.04 },
  { a: 35.35, b: 41.10, vo: "Just before half past midnight, in the middle of a ride and without slowing down at all, it stops dead. (StopDead)",
    node: <StopDead src={GR + "main.mp4"} from={21.97} stopAt={148} iw={1440} ih={1080} /> },
  // RAW 2 (main, 11 s, silent): src 30.6-41.6, the gondola frozen above the sign, arms level, riders upright
  { a: 41.10, b: 52.10, vo: "RAW 2: stuck (src 30.6-41.6)", src: "main.mp4", fill: true, from: 30.6, s0: 1.0, s1: 1.05 },
  { a: 52.10, b: 56.54, vo: "Look at the gondola now. It's frozen above the neon sign with the arms level, (the same shot runs on)", src: "main.mp4", fill: true, from: 41.6, s0: 1.05, s1: 1.09 },
  { a: 56.54, b: 65.47, vo: "and 28 people are sitting in it upright, a good 16 feet off the ground, with the lights still flashing around them. I'd be counting every minute up there. (closer angle)",
    src: "main.mp4", fill: true, from: 59.3, s0: 1.0, s1: 1.06 },
  { a: 65.47, b: 70.31, vo: "Something in the ride's gears had broken, and the crew had no way to bring the gondola down. (still stuck, staff below)", src: "main.mp4", fill: true, from: 69.9, s0: 1.04, s1: 1.0 },
  { a: 70.31, b: 72.15, vo: "The rescue isn't in this clip. (still stuck)", src: "main.mp4", fill: true, from: 76.0, s0: 1.0, s1: 1.02 },
  { a: 72.15, b: 78.97, vo: "The fire brigade came with a turntable ladder and took riders off a few at a time, and they had everyone down within an hour. (a turntable ladder at night: the kind used)",
    src: "ladder.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.45 },
  { a: 78.97, b: 80.85, vo: "Nobody was reported hurt. (the gondola, still, wide)", src: "f82.jpg", still: true, fill: true, s0: 1.0, s1: 1.03 },
  { a: 80.85, b: 85.11, vo: "It wasn't the fair's first scare. A year earlier, a metal part came loose (the fair's rides in the old town, 2007)", src: "wheel.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 85.11, b: 90.43, vo: "from a ride there and hurt a woman, and afterward the organizers started their own surprise checks. (a fair ride, 2007)", src: "fair07.jpg", still: true, s0: 1.0, s1: 1.08, fx: 0.5, fy: 0.35 },
  { a: 90.43, b: 95.43, vo: "The operator, Ruth Buser, whose family owned the ride, said they'd had one piece of luck. (the stuck gondola over the family's neon sign, push to the sign)",
    src: "f90.0.jpg", still: true, fill: true, s0: 1.0, s1: 1.12, fx: 0.55, fy: 0.45 },
  { a: 95.43, b: 98.25, vo: "If the gondola had jammed upside down, (earlier in his clip: the gondola inverted mid-ride)", src: "f17.6.jpg", still: true, fill: true, s0: 1.0, s1: 1.08, fx: 0.5, fy: 0.3 },
  { a: 98.25, b: 104.20, vo: "her crew would have had to turn the whole ride by hand before anyone could reach the riders. (the gondola still stuck; fade)", src: "main.mp4", fill: true, from: 80.05, s0: 1.0, s1: 1.05 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },      // title card -> the case
  { at: F(35.35), kind: "blurDip", len: 12 },   // raw 1 -> StopDead (same camera)
  { at: F(41.10), kind: "blurDip", len: 14 },   // the freeze -> the real stuck gondola (time jump)
  { at: F(56.54), kind: "blurDip", len: 10 },   // closer angle
  { at: F(65.47), kind: "blurDip", len: 10 },   // later, same camera
  { at: F(70.31), kind: "blurDip", len: 10 },   // later, same camera
  { at: F(90.43), kind: "blurDip", len: 12 },   // back to the clip
];

const PART: [number, number, number | null][] = [[TC, 0.0, 19.80], [35.35, 19.94, 25.65], [52.10, 25.95, null]];
const RAWS: [number, number][] = [[23.85, 35.35], [41.10, 52.10]];

const SFX: [number, string, number, number?][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [40.28, "sfx_n2/real/metal_clank_4.wav", -26],   // the stop (on "stops")
  [72.10, "sfx_n2/real/wind_gust_1.wav", -30, 6.5],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} fill={s.fill} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="ALBANIFEST TOP SPIN" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(103.0)} layout="none"><FadeBlack len={F(104.2 - 103.0)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, -15 dB under the VO; the raws are silent footage, so the bed rises a little there instead of ducking */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30;
          const up = RAWS.reduce((m, [ra, rb]) => Math.max(m, interpolate(t, [ra - 0.4, ra + 0.8, rb - 0.8, rb + 0.2], [0, 1, 1, 0], cl)), 0);
          return dB(-15 + 5 * up) * interpolate(t, [0, 1.2, 102.4, 104.1], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [0, 20, F(len) - 20, F(len)], [0, 1, 1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
