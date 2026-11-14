// Theme Park #17 — The Big One, Blackpool Pleasure Beach, 23 April 2023: a train stops a little over halfway up the 214 ft lift hill;
// staff walk everyone down the emergency stairs beside the track. Footage: kyle the ringer's own walk-up and long handheld watch of the
// evacuation (main, source 2:45-13:42; his intro/outro and the end montage's music cut), and Jonathan Timperon's lift-hill clip (lift: the
// chain, the stairs beside the track, the hill from its base; 70 subs). Devices for this case: HillStops (the lift hill to scale, the
// three walk-down stops, the walk down the stairs) and ChainDog (the real chain + a section of chain dog / anti-rollback pawl catching).
// main.mp4 = the source windows below concatenated (one LUT for the whole source); `m(src)` maps source seconds -> file seconds.
// Source cuts (srccuts): 165.5 175.3 182.7 198.5 199.1 200.2 200.7 211.0 212.1 214.0 220.5 222.2 229.0 236.1 238.2 ... 286.1 300.5 307.9
// 324.1 397.5 408.4 416.3 417.5 420.9 481.9 488.1 504.8 516.8 529.4 531.5-531.7 540.9 556.0 651.7 720.0 751.5 752.6 803.5; lift 9.87.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { HillStops } from "../dev/TP17_HillStops";
import { ChainDog } from "../dev/TP17_ChainDog";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

// main.mp4 segments: [source a, source b]
const SEG: [number, number][] = [[165.6, 215], [228, 234.5], [265, 330], [378, 392], [420, 430], [486, 512], [533, 550], [636, 645], [684, 705], [752, 775], [805, 822]];
const m = (src: number) => { let o = 0; for (const [a, b] of SEG) { if (src >= a && src < b) return o + (src - a); o += b - a; } throw new Error("TP17: source " + src + " not in main.mp4"); };

// VO take parts (split only at the raws, in the middle of the pause before the next sentence) and the raws between them
const PARTS: [number, number][] = [[0, 27.12], [27.12, 52.52], [52.52, 84.99], [84.99, 99.89]];
// raws (owner rule 2 Nov on TP17: fewer, long raws that show the incident): three inserts at cut-sheet cues 1, 3 and 6.
// R1 (cue 1, the halted train close, riders aboard): 13:25-13:33 of the same filmer (cue 2:48 itself is one long whip-pan).
// R2 MAIN (cue 3, "and then they all walked"): people walking down the walkway beside the track (close, 6:18-6:25) -> blur-dip -> the
//   whole lift, reframed, the line of people coming down (12:36-12:48). 18.5 s, VO paused.
// R3 (cue 6, after "staring at my shoes"): the lift high up, people on the walkway (5:04-5:12, reframed). All in calm stretches of the
// handheld source (fast pans over the lattice read as cuts to cutcheck).
type Piece = { a: number; b: number; s0: number; s1: number; fx: number; fy: number; vo: string };
const RAWP: Piece[][] = [
  [{ a: 805.5, b: 813.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.4, vo: "RAW 1: the train halted high on the lift, riders aboard" }],
  [{ a: 378.6, b: 385.4, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45, vo: "RAW 2a: people walking down the walkway beside the track" },
   { a: 756.3, b: 768.0, s0: 1.5, s1: 1.6, fx: 0.42, fy: 0.6, vo: "RAW 2b: the whole lift, the line of people coming down (reframed)" }],
  [{ a: 304.0, b: 312.2, s0: 1.4, s1: 1.5, fx: 0.5, fy: 0.62, vo: "RAW 3: the lift high up, people on the walkway (reframed)" }],
];
const RAWLEN = RAWP.map((ps) => ps.reduce((t, q) => t + q.b - q.a, 0));
const T0 = 4.0;
const PSTART: number[] = []; const RSTART: number[] = [];
{ let t = T0; PARTS.forEach(([a, b], i) => { PSTART.push(t); t += b - a; if (i < RAWP.length) { RSTART.push(t); t += RAWLEN[i]; } }); }
/** VO-take seconds -> timeline seconds */
const T = (tau: number) => { let i = PARTS.findIndex(([a, b]) => tau >= a && tau < b); if (i < 0) i = PARTS.length - 1; return PSTART[i] + tau - PARTS[i][0]; };
const END = T(99.89) + 1.0;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: (n: number) => React.ReactNode; over?: React.ReactNode; raw?: boolean };
const M = "main.mp4", L = "lift.mp4";

// VO shots in take seconds (a, b = take times); converted to the timeline below
const VO_SHOTS: Sh[] = [
  { a: 0, b: 4.45, vo: "The Big One at Blackpool Pleasure Beach has emergency stairs beside its lift hill. (the stairs + chain at the lift's foot)", src: L, from: 47.3, s0: 1.08, s1: 1.14, fx: 0.8, fy: 0.45,
    over: <RedLabel text="BLACKPOOL PLEASURE BEACH" at={F(0.5)} hold={F(3.3)} /> },
  { a: 4.45, b: 8.37, vo: "There are more than four hundred steps, and you're about to see people use them. (people on the walkway, high up)", src: M, from: m(508.0), s0: 1.15, s1: 1.22, fx: 0.5, fy: 0.75 },
  { a: 8.37, b: 12.98, vo: "The Big One is 235 feet tall, the tallest coaster in Britain. (the hill from its base)", src: L, from: 37.0, s0: 1.02, s1: 1.1, fx: 0.6, fy: 0.3 },
  { a: 12.98, b: 16.66, vo: "When it opened in 1994, it was the tallest in the world. (the lift through the structure)", src: M, from: m(317.6), s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.4 },
  { a: 16.66, b: 21.47, vo: "On Sunday the 23rd of April 2023, just before three in the afternoon, (walking up to the ride)", src: M, from: m(636.5), s0: 1.1, s1: 1.16, fx: 0.4, fy: 0.6,
    over: <RedLabel text="APRIL 23, 2023" at={F(0.5)} hold={F(3.6)} /> },
  { a: 21.47, b: 27.12, vo: "a train stopped a little over halfway up. The lift hill alone climbs 214 feet. (the whole lift, people on it; push in)", src: "mainx.mp4", from: 1.0, s0: 1.0, s1: 1.22, fx: 0.42, fy: 0.5 },
  { a: 27.12, b: 29.79, vo: "The park called it a minor technical problem. (the train from below)", src: M, from: m(690.6), s0: 1.4, s1: 1.45, fx: 0.42, fy: 0.6 },
  { a: 29.79, b: 34.92, vo: "It said the safety system had worked as intended, stopping the train on the lift as a precaution. (the stopped train)", src: L, from: 4.73, s0: 1.03, s1: 1.1, fx: 0.6, fy: 0.4 },
  { a: 34.92, b: 38.06, vo: "To be fair to them, that's the right place to stop one. (up the lift from its base)", src: L, from: 22.9, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 38.06, b: 42.24, vo: "The chain holds it there and the anti-rollback catches stop it slipping back. (ChainDog)",
    node: () => <ChainDog src={GR + L} from={15.5} stopAt={14} slipAt={F(40.36 - 38.06) - 6} chainLabelAt={6} pawlLabelAt={F(39.54 - 38.06)} /> },
  { a: 42.24, b: 44.25, vo: "It's just also the highest place. (the top of the lift, reframed)", src: M, from: m(423.0), s0: 1.35, s1: 1.42, fx: 0.62, fy: 0.25 },
  { a: 44.25, b: 48.65, vo: "Trained staff climbed up, escorted everyone off, and then they all walked. (staff on the stairs by the riders)", src: M, from: m(684.6), s0: 1.45, s1: 1.5, fx: 0.4, fy: 0.62 },
  { a: 48.65, b: 50.39, vo: "The train holds thirty people, (a full train on the lift)", src: M, from: m(817.2), s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 50.39, b: 52.52, vo: "and the park didn't say how many were on it. (the riders, close)", src: M, from: m(498.5), s0: 1.15, s1: 1.22, fx: 0.5, fy: 0.75 },
  { a: 52.52, b: 55.21, vo: "Twelve days earlier, on the 11th of April, (the top of the lift, reframed)", src: M, from: m(426.5), s0: 1.35, s1: 1.42, fx: 0.62, fy: 0.25,
    over: <RedLabel text="APRIL 11, 2023" at={F(1.5)} hold={F(1.1)} /> },
  { a: 55.21, b: 57.69, vo: "staff had stopped it just feet from the top. (the stairs beside the track)", src: L, from: 32.0, s0: 1.05, s1: 1.1, fx: 0.7, fy: 0.45 },
  { a: 57.69, b: 61.35, vo: "More than a dozen guests were aboard, seconds from the first drop. (up the hill to the crest)", src: L, from: 42.0, s0: 1.04, s1: 1.12, fx: 0.7, fy: 0.3 },
  { a: 61.35, b: 66.07, vo: "The park said it was the sudden high winds, not a fault, and they walked down then too. (people on the walkway)", src: M, from: m(693.28), s0: 1.5, s1: 1.56, fx: 0.4, fy: 0.62 },
  { a: 66.07, b: 68.67, vo: "Those stairs run right alongside the track. (stairs beside the track, close)", src: L, from: 52.2, s0: 1.1, s1: 1.16, fx: 0.85, fy: 0.5 },
  { a: 68.67, b: 77.69, vo: "April 2021 as well ... Three walk-downs I could find in two years, all on the same hill. (HillStops, one evolving pass)",
    node: () => <HillStops bg={GR + M} bgFrom={m(760.0)} draw={[0, 20]} stops={[
      { u: 0.9, label: "APRIL 2021", lx: 0.66, ly: 0.5, at: F(69.48 - 68.67), bar: true },
      { u: 0.97, label: "APRIL 11, 2023", lx: 0.56, ly: 0.25, at: F(71.5 - 68.67), bar: true },
      { u: 0.55, label: "APRIL 23, 2023", lx: 0.36, ly: 0.47, at: F(73.0 - 68.67), glide: [F(73.0 - 68.67), F(74.4 - 68.67)] }]}
      walkAt={F(74.6 - 68.67)} hillAt={F(76.73 - 68.67)} /> },
  { a: 77.69, b: 80.43, vo: "Coming down from up there means open steel steps (a rider's feet on the perforated steps, April 2021 walk-down, 1/3 speed)", src: "slow_a.mp4", from: 0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 80.43, b: 82.54, vo: "and a very long view of Blackpool. (the view from the lift: pier, Tower, sea; 0.5x)", src: "slow_c.mp4", from: 0, s0: 1.02, s1: 1.07, fx: 0.6, fy: 0.45 },
  { a: 82.54, b: 84.99, vo: "I'd be staring at my shoes the entire way. (people on the stairs, close)", src: M, from: m(545.2), s0: 1.15, s1: 1.22, fx: 0.5, fy: 0.45 },
  { a: 84.99, b: 88.58, vo: "Everyone was down within thirty minutes, and nobody was hurt. (the lift, wide, pulling back)", src: M, from: m(641.4), s0: 1.4, s1: 1.15, fx: 0.4, fy: 0.6 },
  { a: 88.58, b: 90.84, vo: "The ride stayed shut for the rest of the day. (the stopped lift, wide)", src: M, from: m(533.6), s0: 1.1, s1: 1.15, fx: 0.5, fy: 0.5 },
  { a: 90.84, b: 94.55, vo: "If you have to be stranded on any of these twenty-five, pick this one. (the view down the lift hill from up top, 0.5x)", src: "slow_d.mp4", from: 0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 94.55, b: 96.46, vo: "Half an hour and a staircase. (the stairs)", src: L, from: 55.5, s0: 1.05, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 96.46, b: 99.89, vo: "Almost everyone else on this list would have traded places with them. (the hill, wide, holding)", src: M, from: m(700.5), s0: 1.14, s1: 1.04, fx: 0.4, fy: 0.62 },
];
// raw shots: reframed toward the walkway where the source is wide
// every raw piece with its timeline start
const PIECES = RAWP.flatMap((ps, i) => { let t = RSTART[i]; return ps.map((q, k) => { const o = { ...q, at: t, raw: i, first: k === 0, last: k === ps.length - 1 }; t += q.b - q.a; return o; }); });

const SHOTS: Sh[] = [
  ...VO_SHOTS.map((s) => ({ ...s, a: T(s.a), b: s.b >= 99.89 ? END : T(s.b - 1e-6) + 1e-6 })),
  ...PIECES.map((q) => ({ a: q.at, b: q.at + q.b - q.a, src: M, from: m(q.a), raw: true, s0: q.s0, s1: q.s1, fx: q.fx, fy: q.fy, vo: q.vo })),
].sort((x, y) => x.a - y.a);
// take-time end that is a part end maps to the next raw's start
SHOTS.forEach((s, i) => { if (i + 1 < SHOTS.length) s.b = SHOTS[i + 1].a; });

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const n = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(n)}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={n} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

// transitions: blur-dip on every join of two main windows (one camera), zoomHit into the first diagram, glitch at the title and before the outcome
const isMain = (s: Sh) => !s.node && (s.src === M || s.src === "mainx.mp4");
const CUTS: FxCut[] = [{ at: F(T0), kind: "glitch", len: 10 }];
SHOTS.forEach((s, i) => {
  if (i === 0) return; const p = SHOTS[i - 1]; const at = F(s.a);
  if (Math.abs(s.a - T(84.99)) < 0.01) CUTS.push({ at, kind: "glitch", len: 8 });
  else if (Math.abs(s.a - T(68.67)) < 0.01) CUTS.push({ at, kind: "zoomHit", len: 10 });
  else if ((isMain(s) && isMain(p)) || (!s.node && !p.node && s.src === p.src) || s.node || p.node) CUTS.push({ at, kind: "blurDip", len: 10 });
});
export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.3).toFixed(2)}`).join(",");

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [T0 - 0.05, "sfx_n2/glitch_02.wav", -26],
  [T(38.06) + 14 / 30, X + "metal_clank_2.wav", -32],      // the chain stops
  [T(40.36) - 0.05, X + "metal_clank_1.wav", -27],          // the pawl catches
  [T(61.35), X + "wind_gust_1.wav", -30],                  // "the sudden high winds"
  [T(74.4) - 0.05, X + "metal_clank_4.wav", -31],         // the 23 April train stops on the diagram
  [T(84.99) - 0.05, "sfx_n2/glitch_03.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(T0)} layout="none"><AbsoluteFill><TitleCard dur={F(T0)} title="FOUR HUNDRED STEPS DOWN" bg={GR + "title.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only at the raws */}
      {PARTS.map(([s0, s1], i) => (
        <Sequence key={"v" + i} from={F(PSTART[i])} durationInFrames={i === PARTS.length - 1 ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raws: the clip's sound through rawclean.py (music removed), only inside the raw windows */}
      {PIECES.map((q, i) => { const n = F(q.b - q.a); return (
        <Sequence key={"r" + i} from={F(q.at)} durationInFrames={n + (q.last ? 0 : 4)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(q.a)} volume={(f) => dB(-7) * interpolate(f, q.first ? [0, 6] : [0, 4], [0, 1], cl) * (q.last ? interpolate(f, [n - 14, n - 3], [1, 0], cl) : interpolate(f, [n, n + 4], [1, 0], cl))} />
        </Sequence>); })}
      {/* music: Epidemic ambient Music 4, ~10 LU under the VO, dipped under the raws; second pass picks up inside the main raw */}
      {([[3.6, RSTART[1] + 6.0, 8], [RSTART[1] + 5.0, END, 50]] as const).map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a; const duck = RSTART.reduce((mm, ra, i) => { const rb = ra + RAWLEN[i]; return Math.min(mm, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0); }, 1);
            const n = F(b) - F(a);
            const fade = k === 0 ? interpolate(f, [0, 30, n - 40, n], [0, 1, 1, 0], cl) : interpolate(f, [0, 40, n - 75, n - 10], [0, 1, 1, 0], cl);
            return dB(-23) * fade * (0.12 + 0.88 * duck);
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
export const SHOT_TABLE = SHOTS.map((s) => [s.a, s.b, s.src ?? "node", s.from ?? -1]);
