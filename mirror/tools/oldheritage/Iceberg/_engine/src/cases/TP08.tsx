// Theme Park #08 — the Martillo locks at its peak, Feria de Almería, Vega de Acá (28-29 Aug 2026). Footage = Gustavo Herrera's own vertical
// phone livestream (d3eX_B9V4m0, 72 min, 428x854; ~2K-sub one-man local channel), cut into five windows a1..a5 (source 120 / 640 / 1300 /
// 3470 / 3880 s), one LUT for all. Vertical picture = Shot_FX fill (centred on its own blurred copy) or an Inset zoom.
// Cold-open raw kept in place (cut sheet 2:15) with the stream audio muted as the sheet asks; all raws at their cue positions.
// Devices built for this case: HammerSwing (what a hammer ride does; later its single pivot), FairPins (the three Spanish fair cases on
// NASA Blue Marble). Raws: the stream's own sound where the ladder baskets work at the gondola (4 short windows).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { HammerSwing } from "../dev/TP08_HammerSwing";
import { FairPins } from "../dev/TP08_FairPins";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(168.8);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const ins = (src: string, from: number, pos: string, label?: string) => <Inset src={GR + src} from={from} box={0.4} ar={9 / 16 * 1.6} pos={pos} drift={0.12} label={label} labelAt={10} />;

const SHOTS: Sh[] = [
  // COLD OPEN raw 4.0-10.0 (cut sheet 2:15): the arm stopped over the street; stream audio muted per the cut sheet (the filmer talking live)
  { a: 4, b: 10, vo: "RAW cold open", src: "a1.mp4", from: 15.0, s0: 1.0, s1: 1.06, fy: 0.45 },
  { a: 10, b: 13, vo: "The fair in Almería, at the Vega de Acá,", src: "a1.mp4", from: 2.0, s0: 1.0, s1: 1.05, over: <RedLabel text="VEGA DE ACÁ, ALMERÍA" at={F(0.5)} hold={F(2.2)} /> },
  { a: 13, b: 16.2, vo: "on the night of Friday the 28th of August 2026.", src: "a3.mp4", from: 20.0, s0: 1.0, s1: 1.05, over: <RedLabel text="AUGUST 28, 2026" at={F(0.5)} hold={F(2.4)} /> },
  { a: 16.2, b: 19.4, vo: "At about eleven, the Martillo, the hammer, was running full (the ride, lit)", src: "a4.mp4", from: 40.0, s0: 1.0, s1: 1.06, fy: 0.4, over: <RedLabel text="THE MARTILLO" at={F(1.0)} hold={F(1.9)} y={0.86} /> },
  { a: 19.4, b: 22.4, vo: "when one witness heard something strange and it stopped dead.", src: "a1.mp4", from: 30.0, s0: 1.04, s1: 1.1, fy: 0.45 },
  { a: 22.4, b: 25.4, vo: "One arm locked at its highest point,", src: "a4.mp4", from: 130.0, s0: 1.0, s1: 1.06, fy: 0.35 },
  { a: 25.4, b: 28.4, vo: "about fifty metres up, with seven young people on it. (zoom: the gondola)", node: ins("a3.mp4", 300.0, "30% 30%") },
  { a: 28.4, b: 31.8, vo: "Other witnesses said pieces fell before it stopped.", src: "a2.mp4", from: 20.0, s0: 1.02, s1: 1.08, fy: 0.3 },
  // R1 25.8-33.8: a second basket rises to the gondola
  { a: 31.8, b: 39.8, vo: "RAW: basket rising", src: "a3.mp4", from: 192.0, s0: 1.0, s1: 1.04, fy: 0.35 },
  { a: 39.8, b: 45.6, vo: "A hammer ride swings its arms right over the top, so a second at the peak is the whole point.", node: <HammerSwing mode="swing" bg={GR + "ride_still.jpg"} /> },
  { a: 45.6, b: 48.8, vo: "Hours at the peak is something nobody signed up for.", src: "a2.mp4", from: 100.0, s0: 1.03, s1: 1.1, fy: 0.25 },
  { a: 48.8, b: 54, vo: "The first reports put them even higher, past sixty metres, and said there were eight of them. (the arm over the ladders, from the street)", src: "a3.mp4", from: 104.0, s0: 1.0, s1: 1.06 },
  // R 54.0-61.44 (cut sheet 20:30): the gondola at the top with the ladder beside it
  { a: 54, b: 61.44, vo: "RAW", src: "a3.mp4", from: 240.0, s0: 1.02, s1: 1.07, fy: 0.3 },
  { a: 61.44, b: 64.84, vo: "Firefighters and local police brought in two ladder trucks.", src: "a3.mp4", from: 64.0, s0: 1.02, s1: 1.07 },
  { a: 64.84, b: 67.64, vo: "Even then, a ladder only gets you next to the seats,", src: "a2.mp4", from: 80.5, s0: 1.04, s1: 1.1, fy: 0.25 },
  { a: 67.64, b: 70.94, vo: "and every rider was still locked into a restraint. (zoom: the seats)", node: ins("a3.mp4", 360.0, "35% 28%") },
  // R2 57.5-65.5: the basket at the seats
  { a: 70.94, b: 78.94, vo: "RAW: the basket at the seats", src: "a2.mp4", from: 60.0, s0: 1.02, s1: 1.08, fy: 0.3 },
  { a: 78.94, b: 83.04, vo: "At around twenty past one, two hours in, they started on the restraints.", src: "a4.mp4", from: 246.0, s0: 1.02, s1: 1.08, fy: 0.3, over: <RedLabel text="1:20 AM" at={F(0.5)} hold={F(2.6)} /> },
  { a: 83.04, b: 87.94, vo: "They released one rider at a time, put each one in a harness and brought them down.", src: "a5.mp4", from: 44.0, s0: 1.0, s1: 1.06 },
  { a: 87.94, b: 90.64, vo: "Meanwhile the ride's own technicians triggered a safety system", src: "a4.mp4", from: 4.0, s0: 1.02, s1: 1.08, fy: 0.4 },
  { a: 90.64, b: 93.54, vo: "to lower part of the mechanism. (the ride, wide)", src: "a4.mp4", from: 64.0, s0: 1.0, s1: 1.05 },
  // R3 80.1-89.1: a basket arrives at the gondola, lights on the riders
  { a: 93.54, b: 107.84, vo: "RAW: basket at the gondola (main raw, 14.3 s; owner rule 2 Nov: long raws)", src: "a4.mp4", from: 162.0, s0: 1.02, s1: 1.07, fy: 0.3 },
  { a: 107.84, b: 112.14, vo: "Seville, Almería and Barakaldo are all Spanish fairs on this list.",
    node: <FairPins src={GR + "spain2.jpg"} iw={3100} ih={2200} c0={[1250, 1060]} c1={[1300, 1060]} z0={1.0} z1={1.04}
      pins={[{ x: 903, y: 1682, label: "SEVILLE", at: 8 }, { x: 1607, y: 1792, label: "ALMERÍA", at: 28, active: true }, { x: 1502, y: 501, label: "BARAKALDO", at: 50 }]} /> },
  { a: 112.14, b: 114.34, vo: "All three rides were the travelling kind.", src: "a3.mp4", from: 32.0, s0: 1.02, s1: 1.07 },
  { a: 114.34, b: 117.64, vo: "They roll into town for a week or two and then leave again.", src: "a5.mp4", from: 380.0, s0: 1.0, s1: 1.05 },
  { a: 117.64, b: 122.54, vo: "Nobody in the crowd looking up knows who built the thing or when anyone last checked it.", src: "a5.mp4", from: 176.0, s0: 1.02, s1: 1.07 },
  // R 117.54-124.84 (cut sheet 33:20): the gondola, the ladder platform beside it
  { a: 122.54, b: 129.84, vo: "RAW", src: "a3.mp4", from: 330.0, s0: 1.02, s1: 1.07, fy: 0.3 },
  { a: 129.84, b: 134.14, vo: "If pieces really did come off before it stopped, that needs an answer first.", src: "a2.mp4", from: 140.0, s0: 1.06, s1: 1.14, fx: 0.6, fy: 0.25 },
  { a: 134.14, b: 137.64, vo: "A hammer ride hangs everything off one central pivot.", src: "a4.mp4", from: 100.0, s0: 1.0, s1: 1.35, fx: 0.61, fy: 0.5 },
  { a: 137.64, b: 141.44, vo: "The crews were still working the ladders well past two in the morning.", src: "a4.mp4", from: 280.0, s0: 1.02, s1: 1.07, fy: 0.3 },
  // R4 115.7-124.7: a basket comes down beside the gondola
  { a: 141.44, b: 150.44, vo: "RAW: a basket coming down", src: "a5.mp4", from: 0.5, s0: 1.0, s1: 1.05, fy: 0.35 },
  { a: 150.44, b: 155.44, vo: "The last rider was off at nearly three in the morning, close to four hours after it locked.", src: "a5.mp4", from: 64.0, s0: 1.0, s1: 1.06 },
  { a: 155.44, b: 159.74, vo: "Nobody was injured, and no cause had been confirmed when the reports came out.", src: "a5.mp4", from: 140.0, s0: 1.02, s1: 1.06 },
  { a: 159.74, b: 163.74, vo: "It's the newest case here, from this summer,", src: "a5.mp4", from: 350.0, s0: 1.0, s1: 1.05 },
  { a: 163.74, b: 168.74, vo: "and it plays out almost exactly like New Year's Eve in Rennes, eight years earlier.", src: "a1.mp4", from: 12.0, s0: 1.02, s1: 1.1, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4), kind: "glitch", len: 10 },
  { at: F(10), kind: "blurDip", len: 12 },
  { at: F(31.8), kind: "blurDip", len: 12 },
  { at: F(39.8), kind: "glitch", len: 8 },
  { at: F(54), kind: "blurDip", len: 12 },
  { at: F(61.44), kind: "blurDip", len: 12 },
  { at: F(78.94), kind: "blurDip", len: 12 },
  { at: F(90.64), kind: "blurDip", len: 12 },
  { at: F(107.84), kind: "glitch", len: 8 },
  { at: F(122.54), kind: "blurDip", len: 12 },
  { at: F(129.84), kind: "blurDip", len: 12 },   // raw (a3) -> a2: dark joins read as jumps
  { at: F(134.14), kind: "whip", len: 10 },
  { at: F(137.64), kind: "blurDip", len: 12 },   // a4 hub push -> a4 later window
  { at: F(141.44), kind: "blurDip", len: 12 },
  { at: F(163.74), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} fill s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const VO: [number, number, number][] = [[0.0, 21.6, 10], [21.6, 35.66, 40.1], [35.66, 44.85, 61.6], [44.85, 59.0, 79.24], [59.0, 73.7, 107.84], [73.7, 85.3, 129.84], [85.3, 101.7, 150.74]];
const RAW: [number, number, string][] = [[31.9, 39.8, "k1"], [54.1, 61.3, "k2"], [71.0, 78.94, "k3"], [93.6, 107.54, "k4b"], [122.64, 129.54, "k5"], [141.5, 150.44, "k6"]];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [39.75, "sfx_n2/glitch_01.wav", -28],
  [43.6, X + "metal_clank_2.wav", -28],   // the arm stops dead
  [107.79, "sfx_n2/glitch_03.wav", -28],
  [134.14, "sfx_n2/whoosh_02.wav", -30],
];
const duck = (t: number) => {
  let g = 1;
  for (const [a, b] of RAW) g = Math.min(g, interpolate(t, [a - 0.6, a, b - 0.2, b + 0.6], [1, 0.2, 0.2, 1], cl));
  return g;
};

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE HAMMER LOCKS AT ITS PEAK" bg={GR + "title_still.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, t], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAW.map(([a, b, k], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/raw_" + k + "_clean.wav")} startFrom={15} volume={(f) => dB(-6) * interpolate(f, [0, 8, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient, Music 4 (-11.9 LUFS file) about 22 dB down, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(121.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(3)} volume={(f) => dB(-22) * duck(4.0 + f / 30) * interpolate(f, [0, 30, F(118.5), F(121.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(123.0)} durationInFrames={F(45.8)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => dB(-22) * duck(123.0 + f / 30) * interpolate(f, [0, F(2.5), F(42.8), F(45.8)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed k2 (after the first-reports line, near-dup), k3 (basket at the seats, near-dup of the main k4b) and k5 (inside the travelling-fairs explanation). 7 -> 4 raws.
const _cut = cutOut(CompFull, DUR, [[54.0, 61.44], [70.94, 78.94], [122.54, 129.84]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
