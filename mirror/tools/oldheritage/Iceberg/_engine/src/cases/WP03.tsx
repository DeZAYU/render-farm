// Workplace #03 — Ultracargo fuel terminal, Alemoa, Santos (Brazil), 2-10 Apr 2015: tank fire spreading tank to tank for nine days,
// foam + water cannons, run-off into the estuary and mangroves, CETESB fine.
// Sources (all OK in SOURCES.csv): extra1 8NU0lyaBcNQ (EP, phone over the scrub: tanks bursting into flame, sound), main CUyyoBd6fbc
// (SAN, cannon arc over the burning tank rim), extra3 p8VDxN-q4-U (DR, drone over the terminal; source cuts 18.2 29.5 43.1 53.3 92.1
// 100.3 112.3 128.4 136.2 140.7 respected), extra2 5Ep_EC2O220 (JE, smoke column from the port road; the TV van stretch skipped).
// VO = one take (CASE03.mp3), split once after "By the 4th, a sixth tank had caught." (silence 15.44-15.83).
// ONE raw (WP_PLAN: VO 77 s > 70 s): EP 2.0-16.0, the tanks going up behind the power lines with the filmer's sound (rawclean:
// music removed 15-17 s). The cut sheet's other raws (cannons, drone) run silent under the VO: they are explanation beats.
// Blender (v3, 4 Nov): maps/floatburn3d.py, a cutaway tank (water sinks under the burning fuel, foam smothers) replaces FloatBurn.
// Devices (new, dev/WP03_*): RunOff (drone frame:
// streams from the foam apron across the mangroves into the lagoon).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot } from "../dev/WP45_kit";
import { NFB } from "../dev/WP03_blLabels";
import { WP03_RunOff } from "../dev/WP03_RunOff";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/";
const EP = G + "ep.mp4", SAN = G + "san.mp4", DR = G + "dr.mp4", JE = G + "je.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(95.4);

// timeline (s): title 0-4 | VO A (0-15.7) @4.00 | RAW 19.7-33.7 (EP src 2.0-16.0) | VO B (15.7-end) @33.7 (tl = vo + 18.0),
// VO ends 94.27, hold to 95.4
const PART: [number, number, number | null][] = [[4.0, 0, 15.7], [33.7, 15.7, null]];
const RAW = { a: 19.7, b: 33.7, src: 2.0, gain: 0 };

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; grain?: boolean };
const SHOTS: Sh[] = [
  { a: 4.0, b: 6.56, vo: "Alemoa, Brazil, 2015. (JE: the smoke column from the port road)", grain: true,
    node: (n) => <><Shot_FX src={JE} from={5} n={n} s0={1.02} s1={1.08} fy={0.4} />
      <RedLabel text="ALEMOA · SANTOS, BRAZIL" at={6} hold={F(1.3)} size={44} /><RedLabel text="APRIL 2015" at={F(1.55)} hold={F(0.95)} size={44} /></> },
  { a: 6.56, b: 9.3, vo: "Ultracargo's fuel terminal sits (DR: the burning tank farm)", grain: true,
    node: (n) => <><Shot_FX src={DR} from={12.0} n={n} s0={1.0} s1={1.06} />
      <RedLabel text="ULTRACARGO FUEL TERMINAL" at={6} hold={F(2.2)} size={44} /></> },
  { a: 9.3, b: 11.92, vo: "right next to the port of Santos, the biggest port in the country. (DR: the container port)", grain: true,
    node: (n) => <><Shot_FX src={DR} from={75.0} n={n} s0={1.0} s1={1.05} />
      <RedLabel text="PORT OF SANTOS" at={6} hold={F(2.0)} size={44} /></> },
  { a: 11.92, b: 17.11, vo: "The fire started at about ten in the morning on the 2nd of April, and it didn't stay in one tank.", grain: true,
    node: (n) => <Shot_FX src={JE} from={20} n={n} s0={1.05} s1={1.18} fx={0.42} fy={0.55} /> },
  { a: 17.11, b: 19.7, vo: "By the 4th, a sixth tank had caught. (DR top-down: tanks burning)", grain: true,
    node: (n) => <Shot_FX src={DR} from={21.0} n={n} s0={1.0} s1={1.08} /> },
  { a: 19.7, b: 33.7, vo: "RAW (main): EP, tanks going up behind the power lines (src 2.0-16.0)",
    node: (n) => <Shot_FX src={EP} from={RAW.src} n={n} s0={1.0} s1={1.05} fx={0.55} fy={0.4} /> },
  { a: 33.7, b: 37.82, vo: "By then, according to Maritime Executive, four tanks were burning. (DR: burnt tank tops)", grain: true,
    node: (n) => <Shot_FX src={DR} from={31.0} n={n} s0={1.0} s1={1.08} /> },
  { a: 37.82, b: 45.3, vo: "You can't put out a tank of fuel with water, because the fuel floats on top and keeps burning. Crews have to smother the surface in foam, (Blender floatburn: cutaway tank, water sinks under the burning fuel, foam smothers)", grain: true,
    node: () => <BlenderShot src={"case/maps/floatburn.mp4"} track={NFB}
      labels={[["fuel", "FUEL", 14, 62, 0], ["water", "WATER", 96, 52, 0.03], ["foam", "FOAM", 160, 60, -0.06]]} /> },
  { a: 45.3, b: 49.83, vo: "in huge volumes, and keep cooling the tanks next door so they don't go as well. (DR: cannon arcs on the tanks)", grain: true,
    node: (n) => <Shot_FX src={DR} from={93.0} n={n} s0={1.0} s1={1.07} /> },
  { a: 49.83, b: 53.89, vo: "Water cannon trucks were brought in to keep the jets on the tanks around the clock. (SAN: the arc)", grain: true,
    node: (n) => <Shot_FX src={SAN} from={10} n={n} s0={1.0} s1={1.08} fx={0.4} fy={0.4} /> },
  { a: 53.89, b: 60.03, vo: "The water and foam had to go somewhere, and a lot of it ran into the estuary and the mangroves around the terminal. (RunOff)",
    node: (n) => <WP03_RunOff src={DR} t={89.5} n={n} focus={[1000, 380]} flowAt={20} shoreAt={110} label="MANGROVES" labelAt={[0.56, 0.2]}
      paths={[[[1560, 450], [1400, 420], [1200, 400], [1020, 410], [920, 420]], [[1500, 330], [1300, 300], [1120, 285], [950, 285]], [[1620, 520], [1350, 505], [1100, 480], [890, 455]]]}
      lagoon={[[0, 500], [200, 390], [400, 340], [600, 300], [760, 256], [880, 236], [940, 280], [930, 380], [900, 460], [600, 510], [300, 550], [0, 570]]} /> },
  { a: 60.03, b: 64.96, vo: "Ultracargo said there were no victims, and the area around the terminal was evacuated. (DR: fire trucks under the tanks)", grain: true,
    node: (n) => <Shot_FX src={DR} from={101.5} n={n} s0={1.0} s1={1.06} /> },
  { a: 64.96, b: 66.99, vo: "The tanks burned for nine days.", grain: true,
    node: (n) => <Shot_FX src={SAN} from={95} n={n} s0={1.05} s1={1.12} /> },
  { a: 66.99, b: 70.9, vo: "No cause was given at the time, and what came instead was the bill. (DR: foam over the ground, crews)", grain: true,
    node: (n) => <Shot_FX src={DR} from={118.0} n={n} s0={1.0} s1={1.06} /> },
  { a: 70.9, b: 74.3, vo: "CETESB, the São Paulo state environment agency, (DR: burnt tanks)", grain: true,
    node: (n) => <><Shot_FX src={DR} from={44.5} n={n} s0={1.0} s1={1.06} />
      <RedLabel text="CETESB · STATE ENVIRONMENT AGENCY" at={8} hold={F(2.8)} size={40} /></> },
  { a: 74.3, b: 77.77, vo: "fined Ultracargo more than twenty two million reais. (SAN: the burning rim)", grain: true,
    node: (n) => <Shot_FX src={SAN} from={60} n={n} s0={1.1} s1={1.2} fx={0.35} fy={0.7} /> },
  { a: 77.77, b: 82.51, vo: "It cited the deaths of thousands of fish in the estuary and the Casqueiro river. (DR: the estuary at the quay)", grain: true,
    node: (n) => <Shot_FX src={DR} from={64.5} n={n} s0={1.0} s1={1.06} /> },
  { a: 82.51, b: 86.09, vo: "Federal prosecutors also charged the company over the pollution. (SAN: smoke over the tanks)", grain: true,
    node: (n) => <Shot_FX src={SAN} from={120} n={n} s0={1.0} s1={1.08} /> },
  { a: 86.09, b: 90.86, vo: "A terminal like this sits beside the port because ships unload straight into its tanks. (DR: ships at the quay)", grain: true,
    node: (n) => <Shot_FX src={DR} from={54.0} n={n} s0={1.0} s1={1.06} /> },
  { a: 90.86, b: 95.4, vo: "So when it burns, it burns next to everything the port depends on. (JE: the column over the port road)", grain: true,
    node: (n) => <Shot_FX src={JE} from={70} n={n} s0={1.0} s1={1.1} fy={0.45} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(33.7), kind: "blurDip", len: 14 }, // raw -> VO (days later)
  { at: F(37.82), kind: "blurDip", len: 12 }, // into Blender floatburn
  { at: F(45.3), kind: "blurDip", len: 12 },  // out of it
  { at: F(66.99), kind: "glitch", len: 10 }, // the aftermath section: the bill
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="NINE DAYS AT ALEMOA" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill>{s.grain ? <FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX> : s.node(n)}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (music removed 15-17 s of the clip), never under the VO */}
      <Sequence from={F(RAW.a)} durationInFrames={F(RAW.b) - F(RAW.a)} layout="none">
        <Audio src={staticFile("case/media/ep_clean.wav")} startFrom={F(RAW.src)}
          volume={(f) => dB(RAW.gain) * interpolate(f, [0, 8, F(RAW.b - RAW.a) - 18, F(RAW.b - RAW.a) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18 LUFS file) at -15.5 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(95.4 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RAW.a - 0.8 || t > RAW.b + 0.6 ? 1 : t < RAW.a ? (RAW.a - t) / 0.8 : t > RAW.b ? (t - RAW.b) / 0.6 : 0;
          return dB(-15.5) * interpolate(t, [4.0, 5.0, 94.2, 95.4], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
