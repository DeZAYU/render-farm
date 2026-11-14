// Amusement Parks Iceberg #20 (LEVEL 5 "The Deepest", 3rd and last case) — Parc Saint-Paul, Saint-Paul (Oise), "Coaster Formule 1":
// July 2005 brake failure (11 slightly hurt), Aug 2009 a woman thrown out and killed, belts added; 4 July 2020 Élodie Duval, 32, killed
// after the belts had been removed and the first lap-bar notch ground down; owner Gilles Campion convicted (Beauvais, Nov 2025); the ride
// demolished 29 Jan 2026. No footage (French TV only, RED), no Commons photo of Formule 1: real Commons photos of the park (aerials 2013,
// the 1981 aerial and the 1988 entrance from the park's own archive, CC0), one CC BY POV of a similar wild-mouse coaster (labelled), and
// the real AFP report as Brut published it, in two parts. VO = vor/CASE20.mp3, one take, unsplit; no raw (no incident clip exists).
// Device: PaperFR (the French page slid in, the key line read along with a red rule, its English meaning typed beneath).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Still, type Cam } from "../dev/AM1720_Still";
import { PaperFR } from "../dev/AM20_PaperFR";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0, v = (t: number) => +(t + TC).toFixed(2), VO_END = v(98.05);
export const DUR = F(VO_END + 1.5);

const IM: Record<string, [number, number]> = { psp1: [1920, 1440], psp2: [1920, 1440], entrance: [1376, 911], aerial81: [1756, 1107], pond: [1920, 1440], swing: [1920, 1353], looping: [1536, 2048] };
const st = (n: string, a: Cam, b: Cam, o: { look?: [number, number]; gray?: number } = {}) => <Still src={GR + n + ".jpg"} iw={IM[n][0]} ih={IM[n][1]} a={a} b={b} {...o} />;

type Sh = { a: number; b: number; vo: string; node: React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: v(0), b: v(3.94), vo: "Parc Saint-Paul is a small family park in the woods north of Paris. (high view over the park in the woods, 2013)",
    node: st("psp2", { x: 0.5, y: 0.45, s: 1.02 }, { x: 0.5, y: 0.5, s: 1.12 }),
    over: <RedLabel text="PARC SAINT-PAUL, FRANCE" at={F(0.9)} hold={F(2.6)} /> },
  { a: v(3.94), b: v(7.6), vo: "In 2005 it bought a compact coaster from a Russian maker (Formule 1 itself, 2009, ukrides.info: the coaster's frame)",
    node: <Shot_FX src={GR + "f1.mp4"} n={F(v(7.6)) - F(v(3.94))} from={88.6} s0={1.02} s1={1.08} />,
    over: <RedLabel text="FORMULE 1, 2009" at={F(0.5)} hold={F(2.6)} /> },
  { a: v(7.6), b: v(13.95), vo: "and named it Formule 1. Three weeks after it opened, the brakes failed and eleven people were slightly hurt. (Formule 1, 2009: a car through the hairpins)",
    node: <Shot_FX src={GR + "f1.mp4"} n={F(v(13.95)) - F(v(7.6))} from={6.6} s0={1.0} s1={1.06} />,
    over: <RedLabel text="JULY 2005" at={F(2.2)} hold={F(2.2)} /> },
  { a: v(13.95), b: v(20.37), vo: "In August 2009, a 35-year-old woman riding with her husband was thrown out on a turn and died. (the park's ponds in the woods, still)",
    node: st("pond", { x: 0.5, y: 0.55, s: 1.03 }, { x: 0.5, y: 0.52, s: 1.13 }, { look: [0.1, 0.5] }),
    over: <RedLabel text="AUGUST 2009" at={F(0.3)} hold={F(2.2)} /> },
  { a: v(20.37), b: v(25.62), vo: "An expert's report blamed what it called inappropriate behavior, and the park was cleared. (the park's old entrance, its name)",
    node: st("entrance", { x: 0.45, y: 0.3, s: 1.5 }, { x: 0.5, y: 0.3, s: 1.62 }, { gray: 0.3 }) },
  { a: v(25.62), b: v(30.86), vo: "Seat belts went onto the lap bars, and Formule 1 kept running for another eleven years. (Formule 1 running, 2009, wide)",
    node: <Shot_FX src={GR + "f1.mp4"} n={F(v(30.86)) - F(v(25.62))} from={81.6} s0={1.02} s1={1.08} /> },
  { a: v(30.86), b: v(39.18), vo: "On July 4, 2020, Élodie Duval came to the park with her family for her son's birthday. She was 32 and rode with her partner. (the park wide from above)",
    node: st("psp1", { x: 0.5, y: 0.45, s: 1.02 }, { x: 0.52, y: 0.5, s: 1.12 }),
    over: <><RedLabel text="JULY 4, 2020" at={F(0.4)} hold={F(2.2)} /><RedLabel text="ÉLODIE DUVAL, 32" at={F(3.0)} hold={F(2.6)} /></> },
  { a: v(39.18), b: v(48.48), vo: "According to the park's owner, she was lifted out of her seat over two bumps near the end. Her partner grabbed her and held on, but he couldn't keep his grip, and she died. (the park from the air, 1981 archive photo, light going down)",
    node: st("aerial81", { x: 0.55, y: 0.45, s: 1.3 }, { x: 0.58, y: 0.42, s: 1.45 }, { look: [0.1, 0.8] }) },
  { a: v(48.48), b: v(57.85), vo: "This time, prosecutors found the seat belts added after 2009 weren't there anymore. They'd been taken off just before the park reopened after lockdown that June. (PaperFR B: 'avaient été retirées')",
    node: <PaperFR page={C + "shots/brut_b.png"} pw={1560} ph={645} line={[388, 587, 702, 631]} en="…the seat belts added after the 2009 death had been removed." bg={GR + "psp2.jpg"} k={1.35} k0={1.0} ruleAt={130} />,
    over: <RedLabel text="AFP, VIA BRUT" at={F(0.5)} hold={F(2.0)} y={0.1} size={34} /> },
  { a: v(57.85), b: v(64.04), vo: "The first locking notch on every lap bar had also been ground down, which kept the largest guests off the ride. (Formule 1 on-ride POV, 2009)",
    node: <Shot_FX src={GR + "f1.mp4"} n={F(v(64.04)) - F(v(57.85))} from={164.0} s0={1.02} s1={1.07} /> },
  { a: v(64.04), b: v(69.65), vo: "The park hadn't reported either change to inspectors, and the owner, Gilles Campion, admitted both. (the park's entrance in 1988)",
    node: st("entrance", { x: 0.5, y: 0.5, s: 1.02 }, { x: 0.5, y: 0.45, s: 1.1 }),
    over: <RedLabel text="GILLES CAMPION, OWNER" at={F(3.2)} hold={F(2.2)} /> },
  { a: v(69.65), b: v(79.61), vo: "The one fix that came out of the first death was the exact thing removed before the second. I'd call that the worst decision anyone made in this whole iceberg, and I don't think it's close. (the park's pond, tight on the water, grey)",
    node: st("pond", { x: 0.6, y: 0.75, s: 1.5 }, { x: 0.55, y: 0.72, s: 1.65 }, { gray: 0.35 }) },
  { a: v(79.61), b: v(91.33), vo: "In November 2025, a court in Beauvais convicted Campion. He got a three-year suspended sentence and a five-year ban from working in amusement parks, and Élodie's mother said justice had been done. (PaperFR A: 'trois ans de prison avec sursis')",
    node: <PaperFR page={C + "shots/brut_a.png"} pw={1740} ph={540} line={[654, 429, 1176, 473]} en="…sentenced on Tuesday to three years in prison, suspended." bg={GR + "pond.jpg"} k={1.3} k0={0.95} ruleAt={120} />,
    over: <RedLabel text="NOVEMBER 2025" at={F(0.5)} hold={F(2.0)} y={0.1} size={34} /> },
  { a: v(91.33), b: VO_END + 1.5, vo: "The park had already been sold by then, and on January 29, 2026, Formule 1 was torn down. (high view over the park, slow pull back, fade)",
    node: st("psp2", { x: 0.55, y: 0.6, s: 1.35 }, { x: 0.5, y: 0.5, s: 1.04 }),
    over: <RedLabel text="JANUARY 29, 2026" at={F(2.2)} hold={F(2.4)} /> },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(v(48.48)), kind: "blurDip", len: 12 },
  { at: F(v(79.61)), kind: "blurDip", len: 12 },
];
const SFX: [number, string, number][] = [
  [TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [v(48.48), "sfx_n2/real/paper_2.wav", -26],
  [v(79.61), "sfx_n2/real/paper_3.wav", -26],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="FORMULE 1" bg={GR + "psp1.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none">
              <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>{s.over}</AbsoluteFill>
            </Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(VO_END + 0.3)} layout="none"><FadeBlack len={F(1.2)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5, -13 dB (the AM01 bed level), dip on the deaths */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30;
          const dip = interpolate(t, [v(15.4), v(16.0), v(20.4), v(21.4), v(43.6), v(44.2), v(48.5), v(49.5)], [1, 0.6, 0.6, 1, 1, 0.6, 0.6, 1], cl);
          return dB(-13) * interpolate(t, [0, 1.2, VO_END - 0.5, VO_END + 1.5], [0, 1, 1, 0], cl) * dip;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
