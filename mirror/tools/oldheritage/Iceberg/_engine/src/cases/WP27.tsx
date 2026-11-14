// Workplace #27 — BM Container Depot, Sitakunda (outside Chittagong), Bangladesh, Saturday 4 Jun 2022: a fire in the loading area at
// ~9 p.m.; hydrogen peroxide in the yard; a massive explosion at ~11:45 p.m.; at least 47 dead (firefighters among them, about 16 depot
// workers, among them Oliur Rahman Nayan, 20, who was filming a Facebook live), ~450 injured. Footage (all vertical, small personal
// uploaders): NY = RI10 M (JQIeGblZKhc, repost of Nayan's live; our media copy is cut at src 64.3 s, before the flash and the black
// screen, which are never used), ZC = Zia Chowdhury's Vlog (bN11aa71cWg: zca = src 6:00-8:25, zcb = src 14:08-18:48), MA = Muhammad
// Atikur Rahman (cqD6VZAaBV0: ma = src 18:41-28:21). VO = one take (CASE27.mp3, starts on "BM Container Depot"), split once.
// RAW = NY src 50.0-64.2 (14.2 s): the yard burning, people silhouetted close in front; it fades to black before the explosion.
// Blender (build/CASE27/maps/peroxide3d.py): the peroxide drums in a cut-away box warm, vent oxygen, the fire burns harder.
// Device: ThreePhones (three vertical phone views: firefighters / a depot worker's live / the onlookers).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, F, cl } from "../dev/WP45_kit";
import { Tall } from "../dev/WP01_kit";
import { ThreePhones } from "../dev/WP27_ThreePhones";
import { NPX } from "../dev/WP27_blLabels";

const C = "case/", NY = C + "graded/ny.mp4", ZA = C + "graded/zca.mp4", ZB = C + "graded/zcb.mp4", MA = C + "graded/ma.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 119.5;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-49.16) @4.0 | RAW 53.16-67.36 (NY src 50.0-64.2) | VO part 2 (take 49.16-end) @67.36
// (case = take + 18.2), VO ends 118.62, hold to 119.5
const PART: [number, number, number | null][] = [[4.0, 0, 49.16], [67.36, 49.16, null]];
const RAW: [number, number] = [53.16, 67.36];
const R0 = 50.0;
const v1 = (t: number) => t + 4.0, v2 = (t: number) => t + 18.2;

/** the raw: Nayan's live at full height, fading to black over its last half second (before the explosion) */
const RawLive: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  const o = 1 - interpolate(f, [n - 16, n - 2], [0, 1], cl);
  return <AbsoluteFill style={{ background: "#000" }}><AbsoluteFill style={{ opacity: o }}><Tall src={NY} from={R0} n={n} s0={1.0} s1={1.05} fy={0.55} /></AbsoluteFill></AbsoluteFill>;
};
/** opens from black (after the raw's fade) */
const FromBlack: React.FC<{ children: React.ReactNode; len?: number }> = ({ children, len = 14 }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000" }}><AbsoluteFill style={{ opacity: interpolate(f, [4, 4 + len], [0, 1], cl) }}>{children}</AbsoluteFill></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(4.85), vo: "BM Container Depot, Sitakunda, Bangladesh. June 2022. (ZC: the yard on fire)",
    node: (n) => <><Tall src={ZA} from={30.8} n={n} s0={1.02} s1={1.1} fy={0.4} />
      <RedLabel text="BM CONTAINER DEPOT · SITAKUNDA, BANGLADESH" at={6} hold={F(2.6)} size={42} /><RedLabel text="JUNE 4, 2022" at={F(3.37)} hold={F(1.3)} size={44} /></> },
  { a: v1(4.85), b: v1(8.71), vo: "The depot sits outside Chittagong, the country's main port city. (MA: a fire truck, a burning box)",
    node: (n) => <Tall src={MA} from={1.0} n={n} s0={1.08} s1={1.0} fy={0.5} /> },
  { a: v1(8.71), b: v1(16.93), vo: "The fire broke out in its loading area ... firefighters, depot workers and onlookers were all standing close to it. (ThreePhones)",
    node: (n) => <ThreePhones n={n} mid={{ src: MA, from: 118.0 }} left={{ src: NY, from: 14.0 }} right={{ src: ZB, from: 82.0 }}
      punch={F(12.89 - 8.71)} inL={F(13.76 - 8.71)} inR={F(14.66 - 8.71)} /> },
  { a: v1(16.93), b: v1(20.0), vo: "The containers held chemicals, and the fire service chief said (ZC)",
    node: (n) => <Tall src={ZA} from={38.0} n={n} s0={1.0} s1={1.08} fy={0.45} /> },
  { a: v1(20.0), b: v1(24.25), vo: "hydrogen peroxide stored at the depot made the fire impossible to control. (ZC: crowd and fire under the shed)",
    node: (n) => <><Tall src={ZB} from={186.0} n={n} s0={1.06} s1={1.0} fy={0.5} />
      <RedLabel text="HYDROGEN PEROXIDE" at={F(0.16)} hold={F(2.6)} size={46} /></> },
  { a: v1(24.25), b: v1(27.34), vo: "Hydrogen peroxide doesn't burn by itself. (MA)",
    node: (n) => <Tall src={MA} from={160.0} n={n} s0={1.0} s1={1.08} fy={0.5} /> },
  { a: v1(27.34), b: v1(27.34) + 7.8, vo: "When it's heated it breaks down and gives off oxygen ... It feeds a fire without being the fuel, (Blender peroxide)",
    node: () => <BlenderShot src={C + "maps/peroxide.mp4"} track={NPX} labels={[]} /> },
  { a: v1(27.34) + 7.8, b: v1(38.1), vo: "and there's another chemical like that at the next port. (MA)",
    node: (n) => <Tall src={MA} from={300.0} n={n} s0={1.06} s1={1.0} fy={0.5} /> },
  { a: v1(38.1), b: v1(41.68), vo: "Firefighters were working close in, and so were depot workers. (MA: a man in front of the fire)",
    node: (n) => <Tall src={MA} from={200.0} n={n} s0={1.0} s1={1.08} fy={0.55} /> },
  { a: v1(41.68), b: RAW[0], vo: "Among the depot workers was Oliur Rahman Nayan. He was twenty, and ... he stayed near the yard with the others. (NY, his live)",
    node: (n) => <><Tall src={NY} from={30.0} n={n} s0={1.0} s1={1.1} fy={0.55} />
      <RedLabel text="OLIUR RAHMAN NAYAN, 20" at={F(1.55)} hold={F(3.2)} size={44} /></> },
  { a: RAW[0], b: RAW[1], vo: "RAW: Nayan's live, the yard burning, people silhouetted close in front (NY src 50.0-64.2, own sound cleaned); fades to black",
    node: (n) => <RawLive n={n} /> },
  { a: RAW[1], b: v2(53.18), vo: "At about quarter to midnight, a massive explosion tore through the yard. (from black: ZC, the fire)",
    node: (n) => <FromBlack><Tall src={ZA} from={52.0} n={n} s0={1.12} s1={1.02} fy={0.45} /></FromBlack> },
  { a: v2(53.18), b: v2(58.92), vo: "Nayan was among those who didn't survive. He was one of about sixteen depot workers who were lost. (NY, early in his live, slowed)",
    node: (n) => <Tall src={NY} from={2.0} n={n} s0={1.02} s1={1.1} fy={0.5} /> },
  { a: v2(58.92), b: v2(65.47), vo: "At least forty seven people lost their lives, firefighters among them, and around four hundred and fifty were injured. (ZC)",
    node: (n) => <Tall src={ZA} from={125.0} n={n} s0={1.0} s1={1.08} fy={0.5} /> },
  { a: v2(65.47), b: v2(68.07), vo: "The fire burned until the 7th of June. (MA)",
    node: (n) => <Tall src={MA} from={330.0} n={n} s0={1.06} s1={1.0} fy={0.5} /> },
  { a: v2(68.07), b: v2(72.4), vo: "Two of the inquiry panels blamed the depot and Al Razi Chemical, (ZC)",
    node: (n) => <><Tall src={ZB} from={240.0} n={n} s0={1.0} s1={1.07} fy={0.5} />
      <RedLabel text="AL RAZI CHEMICAL" at={F(70.4 - 68.07)} hold={F(1.9)} size={46} /></> },
  { a: v2(72.4), b: v2(76.92), vo: "which owned the hydrogen peroxide. Al Razi was a sister company with the same owners. (MA)",
    node: (n) => <Tall src={MA} from={400.0} n={n} s0={1.07} s1={1.0} fy={0.5} /> },
  { a: v2(76.92), b: v2(81.0), vo: "The port's panel said dangerous goods hadn't been kept apart from the export containers, (ZC: the shed)",
    node: (n) => <Tall src={ZB} from={5.0} n={n} s0={1.0} s1={1.07} fy={0.5} /> },
  { a: v2(81.0), b: v2(85.0), vo: "as the rules required. It said the depot had no fire hydrants, (ZC)",
    node: (n) => <Tall src={ZA} from={133.0} n={n} s0={1.06} s1={1.0} fy={0.5} /> },
  { a: v2(85.0), b: v2(88.75), vo: "and that the peroxide had been due to leave two days earlier. (MA)",
    node: (n) => <Tall src={MA} from={470.0} n={n} s0={1.0} s1={1.07} fy={0.5} /> },
  { a: v2(88.75), b: v2(93.67), vo: "The first case was filed against eight depot employees, and not against the owners. (ZC)",
    node: (n) => <Tall src={ZB} from={50.0} n={n} s0={1.07} s1={1.0} fy={0.5} /> },
  { a: v2(93.67), b: END, vo: "Dangerous goods were sitting among ordinary export containers, and the people fighting the fire were standing right beside them. (MA, slow push)",
    node: (n) => <Tall src={MA} from={60.0} n={n} s0={1.0} s1={1.12} fy={0.55} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(v1(4.85)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v1(20.0)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v1(24.25)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(58.92)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(68.07)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(72.4)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(81.0)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(85.0)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v2(88.75)), kind: "blurDip", len: 10 },  // dark phone -> dark phone
  { at: F(v1(8.71)), kind: "blurDip", len: 12 },   // into ThreePhones
  { at: F(v1(16.93)), kind: "blurDip", len: 12 },  // out of it
  { at: F(v1(27.34)), kind: "blurDip", len: 12 },  // into Blender
  { at: F(v1(27.34) + 7.8), kind: "blurDip", len: 12 },
  { at: F(v1(38.1)), kind: "blurDip", len: 12 },   // MA -> MA
  { at: F(v1(41.68)), kind: "blurDip", len: 12 },  // into his live
  { at: F(RAW[0]), kind: "blurDip", len: 12 },     // VO -> raw (same live)
  { at: F(v2(53.18)), kind: "blurDip", len: 14 },
  { at: F(v2(65.47)), kind: "blurDip", len: 12 },
  { at: F(v2(76.92)), kind: "glitch", len: 10 },   // into the findings
  { at: F(v2(93.67)), kind: "blurDip", len: 12 },
];
export const ALLOW = [...CUTS.map((c) => [c.at / 30 - 0.35, c.at / 30 + 0.45]), [RAW[1] - 0.6, RAW[1] + 0.8]]
  .map(([a, b]) => `${a.toFixed(2)}-${b.toFixed(2)}`).join(",");

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="CUT OFF MID BROADCAST" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE27.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (music removed where found), never under the VO; out with the picture's fade */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/ny_clean.wav")} startFrom={F(R0)} volume={(f) => dB(-3) * interpolate(f, [0, 6, F(RAW[1] - RAW[0]) - 18, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* SFX under the VO: fire bed under the Blender shot, a deep boom on "explosion" */}
      <Sequence from={F(v1(27.34))} durationInFrames={F(7.8)} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-21) * interpolate(f, [0, 15, F(7.8) - 20, F(7.8)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(v2(50.65))} layout="none"><Audio src={staticFile("sfx_n2/real/boom_2.wav")} volume={dB(-15)} /></Sequence>
      {/* music: Epidemic ambient Music 5 at -13 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(75)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 1.2 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 1.2 : 0;
          return dB(-13) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
