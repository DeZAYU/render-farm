// Workplace #26 — Amuay refinery, Paraguaná Refining Centre, Punto Fijo, Venezuela, Saturday 25 Aug 2012 (~1:11 a.m.): a gas leak
// formed a vapour cloud that exploded, flattened a National Guard post and set storage tanks burning for days; at least 39 dead
// (National Guard members, neighbours, a child). Footage (small personal uploaders): AM = Hector Gutierrez (2HpsHLjYVoU, 640x480, the
// night horizon burning, near-silent track), OD = Osman Dugarte (dVK8i75fQNI, 192x144, the afternoon roadside: residents, black columns).
// VO = one take (CASE26.mp3, starts on "Amuay"), split once. RAW = AM src 12.0-27.0 (15 s): the fire, the pan to the flare-up.
// Blender (build/CASE26/maps/amuay3d.py, OSM ODbL): wide = the refinery on the coast by day; cloud = the vapour cloud spreads and
// ignites; close = from the rooftops east of the fence, the tanks burning a few hundred metres away. Device: GasDrift.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { GasDrift } from "../dev/WP26_GasDrift";
import { NW, NCL, NCO } from "../dev/WP26_blLabels";

const C = "case/", AM = C + "graded/am.mp4", OD = C + "graded/od.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 128.8;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-19.32) @4.0 | RAW 23.32-38.32 (AM src 12.0-27.0) | VO part 2 (take 19.32-end) @38.32
// (case = take + 19.0), VO ends 127.93, hold to 128.8
const PART: [number, number, number | null][] = [[4.0, 0, 19.32], [38.32, 19.32, null]];
const RAW: [number, number] = [23.32, 38.32];
const R0 = 12.0;
const v1 = (t: number) => t + 4.0, v2 = (t: number) => t + 19.0;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(3.31), vo: "Amuay, Venezuela. August 2012. (AM: the night horizon burning)",
    node: (n) => <><Clip src={AM} from={47.0} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.55} />
      <RedLabel text="AMUAY REFINERY · PUNTO FIJO, VENEZUELA" at={6} hold={F(1.6)} size={42} /><RedLabel text="AUGUST 25, 2012" at={F(1.8)} hold={F(1.3)} size={44} /></> },
  { a: v1(3.31), b: v1(8.71), vo: "Amuay is the country's largest refinery, part of the Paraguaná Refining Centre at Punto Fijo, (Blender wide)",
    node: () => <BlenderShot src={C + "maps/wide.mp4"} track={NW} labels={[["plant", "PARAGUANÁ REFINING CENTRE", 66, 86, -0.1]]} /> },
  { a: v1(8.71), b: v1(11.87), vo: "one of the biggest refining complexes in the world. (OD: the column over the plain)",
    node: (n) => <Clip src={OD} from={129.2} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.5} /> },
  { a: v1(11.87), b: v1(15.09), vo: "The blast came at about quarter past one on a Saturday morning, (AM: the fire close)",
    node: (n) => <Clip src={AM} from={8.2} n={n} s0={1.1} s1={1.02} fx={0.5} fy={0.6} /> },
  { a: v1(15.09), b: RAW[0], vo: "and hours later the sky over the neighbourhoods beside it was still orange. (AM)",
    node: (n) => <Clip src={AM} from={29.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.35} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the refinery fire at night, the pan to the flare-up (AM src 12.0-27.0, own sound lifted + fire bed)",
    node: (n) => <Clip src={AM} from={R0} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.55} /> },
  { a: RAW[1], b: v2(28.74), vo: "Survivors said later they'd smelled gas ... a leak formed a cloud, and the cloud exploded. (GasDrift)",
    node: (n) => <GasDrift src={AM} from={0.3} n={n} rate={0.75} thick={F(25.6 - 19.32)} boom={F(27.11 - 19.32)} /> },
  { a: v2(28.74), b: v2(34.89), vo: "A vapour cloud explosion needs a delay. The gas has to leak and mix with the air before something ignites it. (Blender cloud)",
    node: () => <BlenderShot src={C + "maps/cloud.mp4"} track={NCL} labels={[]} /> },
  { a: v2(34.89), b: v2(40.13), vo: "The blast flattened a National Guard post at the refinery and set storage tanks on fire. (replay of the raw's flare-up, 0.5x)",
    node: (n) => <Clip src={AM} from={18.6} n={n} rate={0.5} s0={1.14} s1={1.3} fx={0.45} fy={0.5} /> },
  { a: v2(40.13), b: v2(45.42), vo: "By that afternoon, the tanks were still burning, and residents had gathered at the roadside. (OD)",
    node: (n) => <Clip src={OD} from={3.2} n={n} s0={1.0} s1={1.08} fx={0.45} fy={0.6} /> },
  { a: v2(45.42), b: v2(49.84), vo: "At least thirty nine people were lost. Many of them weren't refinery workers. (OD)",
    node: (n) => <Clip src={OD} from={27.0} n={n} s0={1.06} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v2(49.84), b: v2(54.54), vo: "They were National Guard members and people from the neighbourhood, and one of them was a child. (OD: the watchers)",
    node: (n) => <Clip src={OD} from={40.0} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.7} /> },
  { a: v2(54.54), b: v2(61.08), vo: "Look at how close the houses are. That closeness is why ... (Blender close)",
    node: () => <BlenderShot src={C + "maps/close.mp4"} track={NCO} labels={[["fire", "AMUAY TANK FARM", 20, 110, -0.12], ["houses", "HOMES", 34, 96, 0.06]]} /> },
  { a: v2(61.08), b: v2(63.54), vo: "The government later said it was sabotage. (OD)",
    node: (n) => <Clip src={OD} from={56.0} n={n} s0={1.0} s1={1.07} fx={0.6} fy={0.5} /> },
  { a: v2(63.54), b: v2(68.08), vo: "That claim came from the same government that ran the refinery, through the state oil company, (OD)",
    node: (n) => <Clip src={OD} from={64.0} n={n} s0={1.08} s1={1.0} fx={0.6} fy={0.45} /> },
  { a: v2(68.08), b: v2(72.07), vo: "PDVSA. In effect, the government was ruling on itself. (OD)",
    node: (n) => <><Clip src={OD} from={134.2} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} />
      <RedLabel text="PDVSA · STATE OIL COMPANY" at={4} hold={F(2.6)} size={44} /></> },
  { a: v2(72.07), b: v2(75.28), vo: "Critics disputed it and pointed to poor maintenance. (AM, night)",
    node: (n) => <Clip src={AM} from={36.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: v2(75.28), b: v2(79.08), vo: "Fernando Sánchez, of the Petroleum Engineers of Venezuela, (OD)",
    node: (n) => <><Clip src={OD} from={96.4} n={n} s0={1.0} s1={1.07} fx={0.55} fy={0.5} />
      <RedLabel text="FERNANDO SÁNCHEZ · PETROLEUM ENGINEERS OF VENEZUELA" at={4} hold={F(3.0)} size={38} /></> },
  { a: v2(79.08), b: v2(83.0), vo: "pointed to official figures. They showed the company's refineries running at about sixty five percent (OD)",
    node: (n) => <Clip src={OD} from={195.0} n={n} s0={1.06} s1={1.0} fx={0.6} fy={0.5} /> },
  { a: v2(83.0), b: v2(88.11), vo: "... of capacity, because of too little maintenance and investment. (OD)",
    node: (n) => <Clip src={OD} from={45.0} n={n} s0={1.1} s1={1.02} fx={0.4} fy={0.5} /> },
  { a: v2(88.11), b: v2(94.38), vo: "Heraldo Sifontes, who had run Amuay for seven years, said the quality of management had to be bad. (OD, slowed)",
    node: (n) => <><Clip src={OD} from={21.0} n={n} rate={0.9} s0={1.02} s1={1.1} fx={0.55} fy={0.5} />
      <RedLabel text="HERALDO SIFONTES · FORMER AMUAY MANAGER" at={4} hold={F(3.0)} size={40} /></> },
  { a: v2(94.38), b: v2(97.89), vo: "No independent investigation that I could find ever settled it. (AM)",
    node: (n) => <Clip src={AM} from={42.0} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v2(97.89), b: v2(102.14), vo: "One detail still matters, though. People smelled gas before it exploded. (OD)",
    node: (n) => <Clip src={OD} from={245.6} n={n} s0={1.0} s1={1.07} fx={0.5} fy={0.55} /> },
  { a: v2(102.14), b: END, vo: "A smell doesn't decide whether it was sabotage or neglect. It does mean there was a stretch of time when somebody could have acted. (AM, slow pull out)",
    node: (n) => <Clip src={AM} from={45.6} n={n} rate={0.85} s0={1.16} s1={1.0} fx={0.5} fy={0.55} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(v1(3.31)), kind: "blurDip", len: 12 },   // into Blender wide
  { at: F(v1(8.71)), kind: "blurDip", len: 12 },   // out of it
  { at: F(v1(11.87)), kind: "glitch", len: 10 },   // day -> night
  { at: F(RAW[0]), kind: "blurDip", len: 12 },     // VO -> raw
  { at: F(RAW[1]), kind: "blurDip", len: 14 },     // raw -> GasDrift
  { at: F(v2(28.74)), kind: "blurDip", len: 12 },  // into Blender cloud
  { at: F(v2(34.89)), kind: "blurDip", len: 12 },  // out of it -> replay
  { at: F(v2(40.13)), kind: "glitch", len: 10 },   // night -> afternoon
  { at: F(v2(45.42)), kind: "blurDip", len: 12 },  // OD -> OD
  { at: F(v2(54.54)), kind: "blurDip", len: 12 },  // into Blender close
  { at: F(v2(61.08)), kind: "blurDip", len: 12 },
  { at: F(v2(63.54)), kind: "blurDip", len: 12 },  // OD -> OD
  { at: F(v2(72.07)), kind: "blurDip", len: 12 },  // day -> night
  { at: F(v2(75.28)), kind: "blurDip", len: 12 },
  { at: F(v2(83.0)), kind: "blurDip", len: 12 },   // OD -> OD, same angle
  { at: F(v2(94.38)), kind: "blurDip", len: 12 },
  { at: F(v2(97.89)), kind: "blurDip", len: 12 },
  { at: F(v2(102.14)), kind: "blurDip", len: 12 },
];
export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.35).toFixed(2)}-${(c.at / 30 + 0.45).toFixed(2)}`).join(",");

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE GAS CLOUD BEFORE DAWN" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE26.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found), near-silent, lifted with a limiter (am_raw.wav) + a real fire bed; never under the VO */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/am_raw.wav")} startFrom={F(R0)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(RAW[1] - RAW[0]) - 16, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} loop volume={(f) => dB(-15) * interpolate(f, [0, 12, F(RAW[1] - RAW[0]) - 20, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* SFX under the VO: the cloud igniting (GasDrift) and the Blender cloud's flame front */}
      <Sequence from={F(RAW[1]) + F(27.11 - 19.32)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-14)} /></Sequence>
      <Sequence from={F(v2(28.74)) + 148} layout="none"><Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={dB(-18)} /></Sequence>
      {/* music: Epidemic ambient Music 4 at -22 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-22) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
