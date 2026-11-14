// Theme Park #2 — the Sekaten night market Ferris wheel, Yogyakarta (11 November 2018). Channel grammar (brand.tsx) + devices built for
// this case: YearPlates (archive photos of the market flown through in 3-D), HalfCage (one cabin: the barred half boxed, the open half
// dashed), PlumbLine (a level cabin's plumb line vs a tipped cabin's axis). Cold open on the strongest raw, slow replay at the end.
// Footage: one repost (wYbnnmYtbSE, vidmar project): a vertical phone clip placed in a square with a blurred side-fill -> the centre is
// cropped (404x720 at x158) and upscaled to 608x1080 (tp02_bg), shown on its own blurred copy. Its pieces (source s): S1 0-9.8 base
// cabin / people climbing out, S2 9.8-22.4 purple wheel, 22.4-25.5 a selfie + black (never used), S3 25.5-44 purple wheel (glare 38-45)
// + 45-51.8 crowd at the base, S5 52.6-84.9 white wheel with the tipped cabins, S6 85.1-100 the wheel from further back.
// Its own cuts: 9.8, 22.4, 51.84, 52.6, 84.92, 85.12 -> every window sits between them.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { YearPlates } from "../dev/TP02_YearPlates";
import { HalfCage } from "../dev/TP02_HalfCage";
import { PlumbLine } from "../dev/TP02_PlumbLine";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", AS = C + "assets/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(102.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

// VO parts (take s -> timeline s): A 0-15.25 @12.3 | B 15.99-34.97 @39.2 | C 34.97-39.72 @69.0 | D 39.72-end @80.0
const VO: [number, number, number][] = [[0, 15.4, 12.3], [15.85, 34.97, 39.06], [34.9, 39.72, 68.93], [39.65, 61.9, 79.93]];
// raws (the clip's own sound): [timeline a, b, source from]
const RAWS: [number, number, number][] = [[4.0, 12.1, 52.9], [27.8, 39.0, 10.6], [58.3, 68.8, 26.3], [73.95, 79.75, 3.5]];

/** archive photo, lit: a slow push across a white-framed print tilted in 3-D, a light pool drifting over it */
const LitPrint: React.FC<{ src: string; n: number; label: string }> = ({ src, n, label }) => {
  const f = useCurrentFrame(); const u = f / n;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(26px) brightness(.32)" }} />
      <AbsoluteFill style={{ perspective: 1500 }}>
        <div style={{ position: "absolute", left: 300, top: 120, width: 1320, height: 800, border: "6px solid #fff", overflow: "hidden", boxShadow: "0 40px 90px rgba(0,0,0,.7)",
          transform: `rotateY(${-12 + 9 * u}deg) rotateX(${3 - 2 * u}deg) translateZ(${-60 + 90 * u}px)` }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.05 + 0.08 * u}) translateX(${-20 + 40 * u}px)` }} />
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 65% at ${25 + 50 * u}% 45%, rgba(255,240,215,.18), rgba(0,0,0,.35) 85%)` }} />
        </div>
      </AbsoluteFill>
      <RedLabel text={label} at={10} y={0.92} size={40} />
    </AbsoluteFill>
  );
};

const SHOTS: Sh[] = [
  // RAW 1 (cold open) 4.0-12.1: the white wheel turning with its cabins tipped, the crowd shouting
  { a: 4.0, b: 12.1, vo: "RAW S5 52.9-61.0", src: "bg.mp4", from: 52.9, s0: 1.0, s1: 1.05, fy: 0.4 },
  { a: 12.1, b: 17.15, vo: "The Sekaten night market in Yogyakarta, Sunday the 11th of November 2018,", src: "bg.mp4", from: 85.9, s0: 1.0, s1: 1.05, fy: 0.5,
    over: <><RedLabel text="SEKATEN NIGHT MARKET, YOGYAKARTA" at={F(0.3)} hold={F(2.3)} size={42} /><RedLabel text="NOVEMBER 11, 2018" at={F(2.8)} hold={F(2.0)} /></> },
  { a: 17.15, b: 20.18, vo: "and the wheel is still turning while its cabins go over.", src: "bg.mp4", from: 61.3, s0: 1.06, s1: 1.12, fy: 0.35 },
  { a: 20.18, b: 26.2, vo: "Sekaten happens every year around the Prophet's birthday. The square fills with food stalls and travelling rides,",
    node: <YearPlates bg={GR + "tp02_s11a.jpg"} at={[0, F(3.3)]} plates={[{ src: AS + "tp02_sbw_c.jpg", pos: "50% 40%" }, { src: GR + "tp02_s11a.jpg", label: "SEKATEN, 2011", pos: "50% 40%" }]} /> },
  { a: 26.2, b: 27.8, vo: "and this wheel was one of them.", src: "bg.mp4", from: 91.2, s0: 1.04, s1: 1.08 },
  // RAW 2 27.8-39.0: the purple wheel, cabins over, riders on the frame
  { a: 27.8, b: 39.0, vo: "RAW S2 10.6-21.8", src: "bg.mp4", from: 10.6, s0: 1.0, s1: 1.05, fy: 0.4 },
  { a: 39.0, b: 41.77, vo: "Evi Wahyuni ran the market's site team.", src: "bg.mp4", from: 45.2, s0: 1.02, s1: 1.07, fy: 0.5 },
  { a: 41.77, b: 44.97, vo: "She said afterwards that this was a newer model of wheel.", src: "bg.mp4", from: 72.8, s0: 1.03, s1: 1.09, fy: 0.4 },
  { a: 44.97, b: 49.12, vo: "On this model, only half of each cabin was closed in by safety bars. (HalfCage)",
    node: <HalfCage src={AS + "tp02_f1.5.png"} iw={608} ih={1080} focus={[220, 330]} z0={1.25} z1={1.75} closed={[84, 262, 152, 356]} open={[152, 262, 356, 424]} closedAt={F(0.9)} openAt={F(2.4)} /> },
  { a: 49.12, b: 52.14, vo: "A Ferris wheel cabin stays level for one reason.", src: "bg.mp4", from: 76.2, s0: 1.05, s1: 1.12, fy: 0.3 },
  { a: 52.14, b: 58.3, vo: "It hangs free and gravity keeps it upright. Once it tips, that half set of bars is all that's left. (PlumbLine)",
    node: <PlumbLine iw={608} ih={1080} bg={AS + "tp02_f65.5.png"} rightAt={F(2.75)} left={{ src: AS + "tp02_f1.5.png", hang: [211, 71], len: 411 }} right={{ src: AS + "tp02_f65.5.png", c: [551, 343], axis: [451, 323], r: 110, z: 1.9 }} /> },
  // RAW 3 58.3-68.8: the purple wheel again, riders gripping the cabins
  { a: 58.3, b: 68.8, vo: "RAW S3 26.3-36.8", src: "bg.mp4", from: 26.3, s0: 1.02, s1: 1.07, fy: 0.4 },
  { a: 68.8, b: 73.95, vo: "From the ground, there was nothing anyone could do for them except wait for the wheel to stop.", src: "bg.mp4", from: 79.4, s0: 1.02, s1: 1.07, fy: 0.55 },
  // RAW 4 73.95-79.75: at the base, people climbing out of a cabin
  { a: 73.95, b: 79.75, vo: "RAW S1 3.5-9.3", src: "bg.mp4", from: 3.5, s0: 1.0, s1: 1.04, fy: 0.45 },
  { a: 79.75, b: 81.7, vo: "Nobody lost their life.", src: "bg.mp4", from: 66.6, s0: 1.08, s1: 1.12, fy: 0.4 },
  { a: 81.7, b: 84.78, vo: "Republika reported several riders were left traumatised,", src: "bg.mp4", from: 48.3, s0: 1.03, s1: 1.08 },
  { a: 84.78, b: 89.56, vo: "and the operator said it would take anyone injured to hospital, without saying how many.", src: "bg.mp4", from: 93.2, s0: 1.03, s1: 1.09, fy: 0.6 },
  { a: 89.56, b: 92.08, vo: "By the next day the cabins were coming off. (the last frame held, the next day's date)",
    node: <AbsoluteFill style={{ filter: "saturate(.35) brightness(.8)" }}><FilmLook_FX grain={0.1}><Shot_FX src={AS + "tp02_f98.6.png"} still n={F(2.52)} fill s0={1.0} s1={1.06} fy={0.4} /></FilmLook_FX></AbsoluteFill>,
    over: <RedLabel text="MONDAY, NOVEMBER 12" at={F(0.2)} /> },
  { a: 92.08, b: 98.61, vo: "Then organisers asked every operator at the market to check their rides again and proposed a safety certificate for them.",
    node: <LitPrint src={GR + "tp02_s11b.jpg"} n={F(6.53)} label="SEKATEN, 2011" /> },
  { a: 98.61, b: 102.6, vo: "A great idea, I just would've liked it to exist before the cabins flipped. (0.5x replay of the tipped cabins)", src: "replay.mp4", from: 0.0, s0: 1.15, s1: 1.3, fx: 0.65, fy: 0.4 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.1), kind: "blurDip", len: 12 },
  { at: F(20.18), kind: "zoomHit", len: 10 },
  { at: F(27.8), kind: "glitch", len: 10 },
  { at: F(44.97), kind: "blurDip", len: 12 },
  { at: F(52.14), kind: "whip", len: 10 },
  { at: F(58.3), kind: "glitch", len: 10 },
  { at: F(89.56), kind: "blurDip", len: 14 },
  { at: F(98.61), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + "tp02_" + s.src!} n={F(s.b) - F(s.a)} from={s.from} fill s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_01.wav", -24],
  [20.1, "sfx_n2/whoosh_01.wav", -32],
  [23.4, "sfx_n2/whoosh_03.wav", -34],
  [27.75, "sfx_n2/glitch_02.wav", -28],
  [46.0, X + "marker_1.wav", -30],
  [52.1, "sfx_n2/whoosh_02.wav", -31],
  [54.9, X + "metal_clank_2.wav", -30],
  [58.25, "sfx_n2/glitch_03.wav", -28],
  [89.5, X + "reverse_swell_1.wav", -30],
];

// music: Epidemic ambient Music 1 (-18.3 LUFS file -> -16 dB), out under every raw
const musicVol = (T: number) => {
  let v = 1;
  for (const [a, b] of RAWS) v *= T < a - 0.6 || T > b + 0.9 ? 1 : T < a ? interpolate(T, [a - 0.6, a], [1, 0], cl) : T > b ? interpolate(T, [b, b + 0.9], [0, 1], cl) : 0;
  return v * interpolate(T, [101.0, 102.6], [1, 0], cl);
};

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE SEKATEN FERRIS WHEEL" bg={AS + "tp02_title.png"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, from], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/tp02_bg_clean.wav")} startFrom={F(from)} volume={(f) => dB(0) * interpolate(f, [0, 6, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(11.4)} durationInFrames={F(102.6) - F(11.4)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(8)} volume={(f) => dB(-16) * musicVol(11.4 + f / 30) * interpolate(f, [0, 25], [0, 1], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed RAW 2 (S2, sat in the background/design explanation) and RAW 4 (S1, 5.8 s, lone line before it). 4 -> 2 raws (cold open 8.1 s, main 10.5 s).
const _cut = cutOut(CompFull, DUR, [[27.8, 39.0], [73.95, 79.75]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
