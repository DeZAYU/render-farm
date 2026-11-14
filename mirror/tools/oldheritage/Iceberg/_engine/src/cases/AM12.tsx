// Amusement Parks Iceberg #12 (LEVEL 2, case 5) — Inferno, Terra Mítica, Benidorm, Spain, Mon 7 Jul 2014: an 18-year-old Icelandic tourist
// (not named: no verified source names him) fell from Intamin's ZacSpin "Inferno" when his restraint gave way and died in the ambulance.
// The 2017 appeal ruling (Audiencia Provincial de Alicante): the nylon strap was cut by the hard edges of a loose plastic seat cover
// ("coquilla"), a probable design defect, no crime by anyone; the maker built the piece into the seat. The rider's weight (in the ruling,
// ruled not determining) is kept off screen (outline: leave it out), so the "25 cm" paragraph is not shown.
// No footage of the incident exists: NO RAWS. VO straight through over silent footage, stills and one document device.
// Footage: [cierra] Cierra Coasters, "Inferno - Terra Mítica - Onride/Offride" (YouTube 0_guIuecxUw, 381 subs, Dec 2025, filmed with the
// park's permission), cropped 1760x990 from the top-right to frame out the channel's bottom-left watermark: sign = src 43.7-52.3,
// off1 = 14.0-26.9, off2 = 27.5-43.1, off3 = 60.7-77.5, pov = 78.1-115.4 (src cuts 13.75 27.19 43.44 52.59 60.39 77.84 115.72).
// Stills (Wikimedia Commons, credits in NOTES). Title: style B typewriter strike (dev/AM12_StrikeTitle).
// Timeline: T = v + 4.0. Last word v 69.73 -> T 73.73.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { StrikeTitle } from "../dev/AM12_StrikeTitle";
import { StripStack } from "../dev/AM12_StripStack";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0;
const T = (v: number) => +(v + TC).toFixed(3);
export const DUR = F(75.3);
const fv = (v0: number, v: number) => Math.round((v - v0) * 30);

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; dim?: number; node?: React.ReactNode; over?: React.ReactNode };

const S: Sh[] = [
  { a: 0, b: 3.92, vo: "Terra Mítica sits just outside Benidorm, on Spain's coast. (the park's name on the hill, 2014)", src: "tmsign.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.45,
    over: <RedLabel text="BENIDORM, SPAIN" at={F(1.6)} hold={F(2.0)} /> },
  { a: 3.92, b: 8.77, vo: "On July 7, 2014, an Icelandic family on vacation made a day of it there, (Inferno and its entrance, visitors)", src: "entrance.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.6,
    over: <RedLabel text="JULY 7, 2014" at={F(0.2)} hold={F(2.2)} /> },
  { a: 8.77, b: 12.84, vo: "and their 18-year-old son lined up for Inferno with his father and brother. (the ride's sign and queue)", src: "sign.mp4", from: 0.6, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="INFERNO" at={F(2.0)} hold={F(1.9)} /> },
  { a: 12.84, b: 14.42, vo: "Inferno is a ZacSpin, (a car at the top of the lift)", src: "lift.jpg", still: true, s0: 1.03, s1: 1.08, fx: 0.3, fy: 0.25 },
  { a: 14.42, b: 18.91, vo: "where riders sit on the outside of the track in seats that flip them head over heels. (the cars flipping)", src: "off2.mp4", from: 1.5, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  { a: 18.91, b: 21.76, vo: "On a sharp downward turn, his restraint gave way. (on board, a downward turn)", src: "pov.mp4", from: 16.5, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 21.76, b: 25.95, vo: "He was thrown from the seat and died shortly afterward in the ambulance. (the ride behind the colonnade, dim)", src: "silueta.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.35, dim: 0.6 },
  { a: 25.95, b: 29.16, vo: "It was the first death at the park since it opened in 2000. (the ride running)", src: "off1.mp4", from: 2.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 29.16, b: 33.9, vo: "Gröna Lund in Stockholm and other parks with the same model shut theirs down for a while. (Insane, Gröna Lund)", src: "insane.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.4,
    over: <RedLabel text="GRÖNA LUND, STOCKHOLM" at={F(0.3)} hold={F(2.6)} /> },
  { a: 33.9, b: 39.72, vo: "A court took almost three years to work out why the harness didn't hold, and the answer was smaller than you'd guess. (the seats, slow push)", src: "gondola.jpg", still: true, s0: 1.02, s1: 1.25, fx: 0.48, fy: 0.25 },
  { a: 39.72, b: 52.35, vo: "Had the nylon strap just come undone? It hadn't. Something had cut it. A plastic cover... sharp edges sliced the strap, (StripStack: AlicantePlaza on the ruling)",
    node: <StripStack bg={GR + "off3.mp4"} bgFrom={2} strips={[
      { src: C + "shots/stripA.png", w: 2240, h: 520, at: 0, scale: 0.72 },
      { src: C + "shots/stripC.png", w: 1740, h: 94, at: fv(39.72, 42.98), scale: 1.0, rule: { box: [435, 30, 1093, 83], at: fv(39.72, 43.2) } },
      { src: C + "shots/stripD.png", w: 1740, h: 238, at: fv(39.72, 44.21), scale: 1.0, band: { y0: 130, y1: 202, at: fv(39.72, 50.4) } },
    ]} /> },
  { a: 52.35, b: 56.1, vo: "and that opened a gap of about ten inches between the bar and the seat. (a car turning over, close)", src: "inversio.jpg", still: true, s0: 1.15, s1: 1.3, fx: 0.55, fy: 0.45 },
  { a: 56.1, b: 60.98, vo: "The court called the cover a probable design defect and didn't find a crime by anyone. (the ride running)", src: "off3.mp4", from: 3.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 60.98, b: 66.54, vo: "In March 2017, an appeals court kept the case closed, so nobody's ever been charged. (Inferno over the park)", src: "overview.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.4,
    over: <RedLabel text="MARCH 2017" at={F(0.2)} hold={F(2.0)} /> },
  { a: 66.54, b: 75.3, vo: "The maker has since built that piece into the seat itself. (the cars flipping; fade)", src: "off2.mp4", from: 9.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(T(39.72)), kind: "blurDip", len: 12 },
];
const SFX: [number, string, number, number?][] = [
  [0.3, "sfx_n2/real/tape_click_2.wav", -26],
  [TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(39.72), "sfx_n2/real/paper_2.wav", -25],
  [T(42.98), "sfx_n2/real/paper_3.wav", -27],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><AbsoluteFill style={{ filter: s.dim ? `brightness(${s.dim}) saturate(${0.6 + 0.4 * s.dim})` : undefined }}>
    <Shot_FX src={GR + s.src!} still={s.still} n={F(T(s.b)) - F(T(s.a))} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></AbsoluteFill></FilmLook_FX>;
};

const END = T(69.73) + 0.2;
export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><StrikeTitle title="TERRA MÍTICA INFERNO" place="BENIDORM, SPAIN · 2014" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {S.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><FadeBlack len={DUR - F(END)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE12.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file) at -16 dB ≈ 10 LU under the VO */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(45)} volume={(f) => dB(-16) * interpolate(f / 30, [0, 1.5, DUR / 30 - 1.8, DUR / 30], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
