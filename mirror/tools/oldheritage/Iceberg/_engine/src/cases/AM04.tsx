// Amusement Parks Iceberg #04 (LEVEL 1, case 4) — Futuroscope (Chasseneuil-du-Poitou near Poitiers, France), Fri 7 Apr 2023, 10:16: a lithium
// battery under a seat on the second car of an Objectif Mars train catches fire at the end of the run; the train rolls into the station
// burning with riders strapped in; smoke fills the station; staff and a man from the queue use extinguishers; evacuated by 10:20; two women
// with light burns, one to CHU Poitiers for observation; closed until further notice; reopened 23 Jun 2023 without batteries and without spin.
// Footage: [main] the queue's vertical phone clip (CrMwt5Ite88, Eva Restino repost, AMBER; 444x360 with its own blurred side fill, sharp
// picture x 0.252-0.752) -> 1332x1080, graded; shown as a portrait panel (dev/AM04_QueueView). Its audio is a TV NEWS VOICE-OVER (French
// narrator over the clip), so the raw uses only Demucs' no-vocals stem (media/main_safe.wav: station noise, no speech) + one real SFX.
// Slow files (minterpolate from the source): fire_slow = 0-5.4 @0.6x, smoke_slow = 28.9-30.4 @0.5x, ext_slow = 21.6-24.0 @0.45x.
// Source cut at 28.3 (smoke_slow starts 0.6 s after it). Skipped per outline: 19-21.5, 24-25, 26.5-28 (people close to the lens).
// Stills: Commons (Objectif Mars 2022 by Philippe-Minh Nguyen CC BY-SA 4.0; Futuroscope park views). Document: the park's statement quoted on
// Parc-Attraction-Loisirs.fr (7 Apr 2023).
// VO = one take, split only at the raw (sentence end "…Then the smoke hits."): A 0-46.0 @4.0 | RAW 50.0-68.6 (src 0-18.6: flames under the
// arriving car behind the yellow railing, riders seated in the smoke, the white smoke wall, riders scramble out) | B 46.3-end @68.6, ends ~112.95.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { QueueView } from "../dev/AM04_QueueView";
import { SmokeClear } from "../dev/AM04_SmokeClear";
import { StatementCrawl } from "../dev/AM04_StatementCrawl";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(114.4);
const TC = 4.0;
const B = 68.6 - 46.3; // part B: T = t + B
const X0 = 0.252, X1 = 0.752;

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.00, b: 8.08, vo: "On April 7, 2023, at 10:16 in the morning, (Objectif Mars, riders in a spinning car, 2022)", src: "om1.jpg", still: true, s0: 1.02, s1: 1.09, fx: 0.47, fy: 0.42,
    over: <RedLabel text="APRIL 7, 2023 · 10:16 AM" at={F(0.4)} hold={F(3.2)} /> },
  { a: 8.08, b: 13.10, vo: "a coaster train at Futuroscope in France was finishing its run with a fire underneath it. (Objectif Mars, 2022)", src: "om2.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5,
    over: <RedLabel text="FUTUROSCOPE, FRANCE" at={F(1.0)} hold={F(2.6)} /> },
  { a: 13.10, b: 15.70, vo: "Futuroscope, outside Poitiers, (the park seen from its Gyrotour)", src: "fut_gyro.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="NEAR POITIERS" at={F(0.5)} hold={F(1.8)} /> },
  { a: 15.70, b: 18.55, vo: "spent most of its life as a park of screens and simulators. (the park's cinema pavilions)", src: "fut_jog.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 18.55, b: 21.75, vo: "In 2020 it finally got a real roller coaster, (Objectif Mars)", src: "om3.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 21.75, b: 25.50, vo: "Objectif Mars, a spinning coaster that cost 22 million euros, (a car mid-spin)", src: "om1.jpg", still: true, s0: 1.6, s1: 1.75, fx: 0.46, fy: 0.4,
    over: <RedLabel text="OBJECTIF MARS" at={F(0.1)} hold={F(2.4)} /> },
  { a: 25.50, b: 29.95, vo: "the park's biggest investment since it opened in 1987. (the park's night show)", src: "fut17.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 29.95, b: 33.62, vo: "Riders are meant to be training for Mars, in cars that spin freely (Objectif Mars, 2022)", src: "om2.jpg", still: true, s0: 1.5, s1: 1.65, fx: 0.4, fy: 0.45 },
  { a: 33.62, b: 37.27, vo: "as they launch around roughly 1,600 feet of track. (the track)", src: "om3.jpg", still: true, s0: 1.35, s1: 1.5, fx: 0.6, fy: 0.4 },
  { a: 37.27, b: 44.22, vo: "The fire started in a lithium battery under a seat on the second car. I'd never once thought about what's under a coaster seat. (slow push to the seats of the lower car)", src: "om1.jpg", still: true, s0: 1.3, s1: 2.3, fx: 0.47, fy: 0.64 },
  { a: 44.22, b: 50.00, vo: "This was filmed from the queue, behind the yellow railing. Watch the car as it comes in. Then the smoke hits. (QueueView holds the first frame)",
    node: <QueueView src={GR + "main.mp4"} from={0} x0={X0} x1={X1} hold={F(5.78) + 2} rise s0={0.96} s1={1.0} dimRest={0.6} /> },
  // RAW (main, 18.6 s): src 0-18.6
  { a: 50.00, b: 68.60, vo: "RAW: the car arrives burning behind the yellow railing, riders still seated, the white smoke wall, riders climbing out into the smoke (src 0-18.6)",
    node: <QueueView src={GR + "main.mp4"} from={0} x0={X0} x1={X1} s0={1.0} s1={1.04} /> },
  { a: 68.60, b: 77.40, vo: "The train couldn't stop out on the track, so it had rolled in with everyone still strapped in. One witness said there was screaming everywhere and nobody really knew what to do. (the arrival again at 0.6x, nearer)",
    node: <QueueView src={GR + "fire_slow.mp4"} from={0} x0={X0} x1={X1} s0={1.14} s1={1.3} /> },
  { a: 77.40, b: 80.30, vo: "The riders had to climb out of their cars into that smoke. (0.5x: a rider in the haze)",
    node: <QueueView src={GR + "smoke_slow.mp4"} from={0} x0={X0} x1={X1} s0={1.0} s1={1.06} /> },
  { a: 80.30, b: 85.67, vo: "Staff grabbed extinguishers, and so did a man who'd only been waiting in line. I hope somebody thanked him. (0.45x: extinguishers at the smoke)",
    node: <QueueView src={GR + "ext_slow.mp4"} from={0} x0={X0} x1={X1} s0={1.04} s1={1.12} /> },
  { a: 85.67, b: 90.30, vo: "The fire was out within minutes, and they'd cleared the station by about 10:20. (SmokeClear)",
    node: <SmokeClear smoke={GR + "main.mp4"} smokeAt={29.8} x0={X0} x1={X1} after={GR + "om2.jpg"} clearAt={42} clearLen={60} labelAt={F(67.06 + B - 85.67)} label="10:20 AM" /> },
  { a: 90.30, b: 95.60, vo: "Two women from that car had light burns, and one went to the hospital in Poitiers for observation. (the park from the Gyrotour, the lake)", src: "fut_gyro.jpg", still: true, s0: 1.5, s1: 1.62, fx: 0.3, fy: 0.55 },
  { a: 95.60, b: 102.30, vo: "The park said the ride had been checked every day and maintained the way the manufacturer recommended, and it closed until further notice. (StatementCrawl)",
    node: <StatementCrawl page={C + "shots/pal_crop.png"} pw={1090} ph={1540} bg={GR + "main.mp4"} bgAt={29.5} y0={330} y1={1430} stopAt={F(78.34 + B - 95.60)} rule={[36, 838, 1515]} ruleAt={F(78.74 + B - 95.60)}
      credit="Futuroscope's statement, 7 April 2023 · as quoted by parc-attraction-loisirs.fr" /> },
  { a: 102.30, b: 108.13, vo: "It reopened on June 23, 2023, with the batteries taken out and the spinning switched off, (Objectif Mars, wide)", src: "om1.jpg", still: true, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.5,
    over: <RedLabel text="JUNE 23, 2023" at={F(0.8)} hold={F(2.4)} /> },
  { a: 108.13, b: 111.09, vo: "though the park never said why that battery caught fire. (the park, 2014)", src: "fut14.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 111.09, b: 114.40, vo: "The cars didn't spin again until 2025. (a car on the track; fade)", src: "om2.jpg", still: true, s0: 1.12, s1: 1.2, fx: 0.6, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },     // title -> case
  { at: F(44.22), kind: "blurDip", len: 12 },  // into the queue clip
  { at: F(68.60), kind: "blurDip", len: 14 },  // raw -> replay
  { at: F(77.40), kind: "blurDip", len: 12 },  // same camera, later
  { at: F(80.30), kind: "blurDip", len: 12 },  // same camera, earlier
  { at: F(85.67), kind: "blurDip", len: 14 },  // same camera: extinguishers -> held smoke frame
  { at: F(95.60), kind: "blurDip", len: 12 },  // into the statement
  { at: F(102.30), kind: "blurDip", len: 12 }, // out of the statement
];

const PART: [number, number, number | null][] = [[TC, 0.0, 46.0], [68.6, 46.3, null]];
const RAWS: [number, number, number, number][] = [[50.0, 68.6, 0.0, 0]]; // main_safe.wav is the no-vocals stem +12 dB (limited)

const SFX: [number, string, number, number?][] = [
  [3.95, "sfx_n2/glitch_03.wav", -24],
  [50.0 + 7.2, "sfx_n2/real/wind_gust_1.wav", -20, 3.5],   // the smoke wall rolls over the queue (src 7.2)
  [68.55, "sfx_n2/real/reverse_swell_3.wav", -26, 0.8],
  [95.55, "sfx_n2/real/paper_2.wav", -22],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="OBJECTIF MARS FIRE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(113.3)} layout="none"><FadeBlack len={F(1.1)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_safe.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, ~-22 dB (≈ Music 5 at -13), ducked under the raw */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(15)} volume={(f) => {
          const t = f / 30;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-22) * interpolate(t, [0, 1.2, 112.6, 114.3], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
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
