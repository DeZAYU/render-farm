// Theme Park #21 — Dinosaur Planet, Sukhumvit Soi 22, Bangkok, Saturday 30 April 2016: in a thunderstorm a cabin at the top of the
// park's Ferris wheel (the Dino Eye) catches fire; the storm had already shut the ride, so nobody was on it.
// Footage: [DP] main = a vertical phone clip from across the road (202x360, past power lines, rain sound; uploader credits a Facebook
// user: not named on screen), [DB] extra1 = a second filmer in a car (vertical content inside a 640x360 frame: cropped to dbv.mp4 for
// file s 0-37 and dbc.mp4 for the close shot, file s 37-43.3). Both raws' audio through rawclean.py (no music detected: original kept).
// Devices built for this case: RoundCut ([DB]'s view of the same fire as a white-ringed round inset in the corner over raw 2) and
// EmptyWheel (white-line wheel over the darkened footage: every cabin hollow, only the top one glows red, on "lucky nobody was on it").
// Handheld jolts inside continuous dp windows (not edits; cutcheck allowed): dp 9.85 (inside raw 1).
// Source cuts: dp 4.0 / 5.07 / 5.87 / 32.4 / 40.43 / 65.43 / 84.6 / 93.63; db none. Every window sits between them.
// One camera carries the incident: same-camera joins use blur-dips.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { RoundCut } from "../dev/TP21_RoundCut";
import { EmptyWheel } from "../dev/TP21_EmptyWheel";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(88.5);

const DP = "dp.mp4", DBV = "dbv.mp4", DBC = "dbc.mp4";
const DIM: Record<string, [number, number]> = { [DP]: [202, 360], [DBV]: [252, 360], [DBC]: [352, 360] };
type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

// Owner rules 2-3 Nov: fewer, longer raws; raws only at paragraph ends; every VO stretch a full thought; each device once; end on the
// last line + a short hold. Two raws: the main fire raw after the opening paragraph, the storm raw (with the second filmer's round
// cutaway) after the storm paragraph. VO take parts -> timeline:
// P1 take 0-16.62 @4.0 (13.9 ... 20.62) | RAW A 20.62-38.62 (18 s) | P2 take 16.62-27.93 @38.62 (11.3 s) | RAW B 49.93-61.93 (12 s)
// | P3 take 27.93-53.88 @61.93 (crews, rain, outcome; last word ends 87.46) | hold to 88.5
const VO: [number, number, number][] = [[4.0, 0, 16.62], [38.62, 16.62, 27.93], [61.93, 27.93, 53.88]];
const RAWA: [number, number, number] = [20.62, 38.62, 7.9];   // cue R1 DP 0:00-0:30 -> 7.9-25.9 (the fire past the power lines, smoke rising)
const RAWB: [number, number, number] = [49.93, 61.93, 66.2];  // cue R2/R3 DP 0:30-1:30 -> 66.2-78.2 (still burning under the storm sky)
const ROUND: [number, number, number] = [52.93, 59.93, 23.0]; // cue DB 0:19-0:26 -> 23.0-30.0 inside raw B (file 20-23 is a white blur)
const RAWS: [number, number][] = [[RAWA[0], RAWA[1]], [RAWB[0], RAWB[1]]];

// the vertical phone clips: shown whole in a white-framed panel over a BRIGHT blurred copy of themselves (no dark side bars)
const VertIn: React.FC<{ src: string; from: number; n: number; s0?: number; s1?: number; fx?: number; fy?: number }> = ({ src, from, n, s0 = 1, s1, fx = 0.5, fy = 0.5 }) => {
  const f = useCurrentFrame(); const u = Math.min(1, f / Math.max(1, n - 1));
  const e = u * u * (3 - 2 * u); const k = s0 + ((s1 ?? s0) - s0) * e;
  const [iw, ih] = DIM[src]; const H = 1000, W = Math.round(H * iw / ih);
  const look = src === DP ? undefined : "brightness(.9) contrast(1.15)"; // the second filmer's clip is graded bright: pull it back to match
  const v = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(GR + src)} startFrom={Math.round(from * 30)} muted style={{ ...st, filter: look }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(1.0) saturate(1.15)", transform: `scale(${1.25 + 0.03 * e})` }}>{v({ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 35%" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: (1080 - H) / 2, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.95, vo: "Dinosaur Planet had been open about a month. It was a dinosaur theme park", src: DP, from: 44.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.45 },
  { a: 7.95, b: 11.2, vo: "on Sukhumvit Soi 22 in central Bangkok, (from a car on the street)", src: DBV, from: 4.2, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="SUKHUMVIT SOI 22, BANGKOK" at={F(0.2)} hold={F(2.8)} /> },
  { a: 11.2, b: 13.94, vo: "with a big Ferris wheel called the Dino Eye. (the wheel, cabins)", src: DP, from: 85.0, s0: 1.08, s1: 1.0, fx: 0.4, fy: 0.55 },
  { a: 13.94, b: 17.35, vo: "On the afternoon of Saturday the 30th of April 2016,", src: DP, from: 50.5, s0: 1.12, s1: 1.18, fx: 0.45, fy: 0.3,
    over: <RedLabel text="APRIL 30, 2016" at={F(1.35)} hold={F(1.9)} /> },
  { a: 17.35, b: 20.62, vo: "one of the wheel's cabins caught fire, right at the top. (the close shot: the burning cabin)", src: DBC, from: 1.5, s0: 1.0, s1: 1.14, fx: 0.55, fy: 0.3 },
  // RAW A (main): 18 s of the fire burning at the top
  { a: 20.62, b: 38.62, vo: "RAW A", src: DP, from: 7.9, s0: 1.0, s1: 1.1, fx: 0.4, fy: 0.3 },
  { a: 38.62, b: 41.08, vo: "You could see it above the Sukhumvit skyline.", src: DP, from: 33.2, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.6 },
  { a: 41.08, b: 45.4, vo: "A thunderstorm had hit the area that afternoon, according to Khaosod English. (trees thrashing, the fire beyond)", src: DBV, from: 30.3, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 45.4, b: 48.2, vo: "It brought power cuts and exploding transformers, (the power lines)", src: DP, from: 54.0, s0: 1.3, s1: 1.38, fx: 0.5, fy: 0.1 },
  { a: 48.2, b: 49.93, vo: "and it had already shut the wheel. (the wheel, cabins hanging still)", src: DP, from: 38.2, s0: 1.0, s1: 1.04, fx: 0.4, fy: 0.7 },
  // RAW B: the storm raw; the second filmer's view pops in as the round cutaway for 7 s
  { a: 49.93, b: 61.93, vo: "RAW B + RoundCut",
    node: <>
      <FilmLook_FX grain={0.08}><VertIn src={DP} from={66.2} n={F(12)} s0={1.0} s1={1.07} fx={0.45} fy={0.3} /></FilmLook_FX>
      <Sequence from={F(ROUND[0] - RAWB[0])} durationInFrames={F(ROUND[1] - ROUND[0])} layout="none">
        <RoundCut src={GR + DBV} from={ROUND[2]} iw={252} ih={360} d={440} cx={1560} cy={600} zoom={1.0} fx={0.5} fy={0.22} inAt={2} look="brightness(.8) contrast(1.25) saturate(1.1)" />
      </Sequence>
    </> },
  { a: 61.93, b: 66.05, vo: "Crews from several fire stations had it under control in about twenty minutes. (the burning top, close)", src: DP, from: 61.1, s0: 1.45, s1: 1.55, fx: 0.4, fy: 0.15 },
  { a: 66.05, b: 67.94, vo: "And still the rain came down. (rain on the car window)", src: DBV, from: 35.7, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 67.94, b: 75.25, vo: "No one was hurt. A park executive said it was lucky nobody was on the wheel, and it really was luck, because the storm had closed it. (EmptyWheel)",
    node: <EmptyWheel bg={GR + DBV} bgFrom={8.4} glowAt={F(1.2)} sweepAt={F(2.9)} sweepLen={F(1.9)} /> },
  { a: 75.25, b: 80.7, vo: "Officials looked at a possible short circuit, and nobody could say for sure whether the storm caused it. (wires, the wheel)", src: DP, from: 87.9, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.3 },
  { a: 80.7, b: 82.6, vo: "The park said the wheel would stay shut (through the windscreen: the burning top)", src: DBV, from: 0.5, s0: 1.06, s1: 1.02, fx: 0.5, fy: 0.3 },
  { a: 82.6, b: 85.2, vo: "until it was repaired and people could trust it again. (the wheel past the wires)", src: DP, from: 78.6, s0: 1.2, s1: 1.25, fx: 0.4, fy: 0.55 },
  { a: 85.2, b: 88.5, vo: "For once, the weather did somebody a favour. (the empty wheel, smoke drifting in the storm) + short hold", src: DP, from: 56.8, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(13.94), kind: "blurDip", len: 10 },   // dp -> dp
  { at: F(38.62), kind: "blurDip", len: 12 },   // raw A -> dp
  { at: F(48.2), kind: "blurDip", len: 10 },    // dp -> dp
  { at: F(49.93), kind: "blurDip", len: 10 },   // dp -> raw B (dp)
  { at: F(61.93), kind: "blurDip", len: 12 },   // raw B -> dp
  { at: F(67.94), kind: "glitch", len: 8 },     // into the outcome
  { at: F(75.25), kind: "blurDip", len: 12 },   // diagram -> real
  { at: F(85.2), kind: "blurDip", len: 10 },    // dp -> dp
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><VertIn src={s.src!} from={s.from ?? 0} n={F(s.b) - F(s.a)} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// real recordings only: rain beds under the storm and rain lines, distant rumbles; glitch ticks only on the two designed glitches
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -26],
  [41.3, X + "boom_4.wav", -24],             // "thunderstorm": distant rumble
  [46.75, X + "boom_2.wav", -28],            // "exploding transformers": a far-off bang, low
  [67.9, "sfx_n2/glitch_03.wav", -30],
];
const BEDS: [number, number, string, number][] = [
  [40.9, 49.9, X + "rain_22.wav", -9],       // the storm lines, out before raw B
  [65.9, 68.3, X + "rain_9.wav", -4],        // "And still the rain came down"
  [84.9, 88.5, X + "rain_22.wav", -12],      // the last line: the weather
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FIRE AT THE TOP OF THE DINO EYE" bg={GR + "title_db.jpg"} pos="50% 22%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE21.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found); raw B's own sound dips while the second filmer's rain plays under the round cutaway */}
      <Sequence from={F(RAWA[0])} durationInFrames={F(RAWA[1]) - F(RAWA[0])} layout="none">
        <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(RAWA[2])} volume={(f) => dB(-10) * interpolate(f, [0, 6, F(RAWA[1] - RAWA[0]) - 14, F(RAWA[1] - RAWA[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(RAWB[0])} durationInFrames={F(RAWB[1]) - F(RAWB[0])} layout="none">
        <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(RAWB[2])} volume={(f) => {
          const n = F(RAWB[1] - RAWB[0]), r0 = F(ROUND[0] - RAWB[0]), r1 = F(ROUND[1] - RAWB[0]);
          return dB(-10) * interpolate(f, [0, 6, n - 14, n - 3], [0, 1, 1, 0], cl) * interpolate(f, [r0, r0 + 12, r1 - 12, r1], [1, 0.4, 0.4, 1], cl);
        }} />
      </Sequence>
      <Sequence from={F(ROUND[0])} durationInFrames={F(ROUND[1]) - F(ROUND[0])} layout="none">
        <Audio src={staticFile(C + "media/extra1_clean.wav")} startFrom={F(ROUND[2])} volume={(f) => interpolate(f, [0, 12, F(ROUND[1] - ROUND[0]) - 14, F(ROUND[1] - ROUND[0]) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient (Music 4, file -11.9 LUFS vs VO -23.7 LUFS -> -21.5 dB puts it ~10 LU under), dipped under the raws */}
      <Sequence from={F(3.6)} durationInFrames={DUR - F(3.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(14)} volume={(f) => {
          const t = f / 30 + 3.6; const duck = RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
          return dB(-21.5) * interpolate(f, [0, 30, DUR - F(3.6) - F(2.0), DUR - F(3.6)], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
      {BEDS.map(([a, b, f, d], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(f)} volume={(fr) => dB(d) * interpolate(fr, [0, 15, F(b - a) - 15, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </LibFontGate>
);
