// Workplace #14 — Kingston, Ontario, 17 Dec 2013: a timber-frame apartment building under construction (Princess St & Victoria St)
// burns; crane operator Adam Jastrzebski, cut off in the cab, crawls out to the end of the jib and is lifted off by a CFB Trenton
// search-and-rescue helicopter; hurt, survived. Ministry of Labour: 22 charges, builder fined $60,000, three individuals $14,000.
// Footage (all small personal uploaders, graded --house): RY = ryant67 zFxCH4PsZq4 (roofline burning across the snowy lot);
// KS = Steve Kneilands NOUZOgTAYg0 (568x320, the wall of fire over the cars); LT = Lee Taylor HHb8AQlFhdg (close frame burning;
// source cuts 42-47.6, 131.6, 156.5); LT2 = Lee Taylor ncwnvzj-Jq8 (the red jib over the fire, the operator a speck on it);
// CD = Carly D'Amico 5iQsTDiHcFA (568x320, the helicopter hoist at the jib's tip; cd.mp4 t = src - 6.8). Raw audio = rawclean.py
// (cd_clean.wav from src 16; no music detected).
// VO = CASE14.mp3 (no count word), split once at the raw (sentence end "...along the lake." 49.77):
//   A 0-49.77 | RAW main: CD 17.5-32.5 (the rescuer lowered to the tip, at the operator) | B 49.77-end.
// Devices: Blender crane (maps/crane3d.py: cab above the burning frame, the operator crawls to the tip), BoomPath (dev/WP14_BoomPath.tsx).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { BoomPath } from "../dev/WP14_BoomPath";
import { CRANE } from "../dev/WP14_craneLabels";

const C = "case/", g = (n: string) => C + "graded/" + n + ".mp4";
const RY = g("ry"), KS = g("ks"), LT = g("lt"), LT2 = g("lt2"), CD = g("cd");
const cd = (src: number) => src - 6.8; // CD source second -> cd.mp4 second
const dB = (d: number) => Math.pow(10, d / 20);
const RA = 53.77, RB = 68.77;
export const DUR = F(122.5);

// timeline: title 0-4 | A @4.00 (VO 0-49.77, tl = src + 4) | RAW 53.77-68.77 | B @68.77 (VO 49.77-end, tl = src + 19), VO ends 121.42
const PART: [number, number, number | null][] = [[4.0, 0, 49.77], [RB, 49.77, null]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.31, vo: "Kingston, Ontario. December 2013. (the roofline burning across the snowy lot)",
    node: (n) => <><Clip src={RY} from={0.5} rate={0.9} n={n} s0={1.03} s1={1.09} fy={0.5} />
      <RedLabel text="KINGSTON, ONTARIO" at={6} hold={F(1.4)} size={44} /><RedLabel text="DECEMBER 17, 2013" at={F(1.6)} hold={F(1.5)} size={44} /></> },
  { a: 7.31, b: 12.33, vo: "An apartment building going up at Princess and Victoria Street was still just a timber frame. (fire on the frame's roof)",
    node: (n) => <><Clip src={RY} from={8.0} rate={0.8} n={n} s0={1.06} s1={1.14} fx={0.55} fy={0.45} />
      <RedLabel text="PRINCESS ST & VICTORIA ST" at={F(1.0)} hold={F(3.2)} size={42} /></> },
  { a: 12.33, b: 15.9, vo: "It caught fire on a Tuesday afternoon, at about quarter past two, (flames along the top floor)",
    node: (n) => <Clip src={RY} from={21.0} n={n} s0={1.1} s1={1.04} fx={0.6} fy={0.45} /> },
  { a: 15.9, b: 19.75, vo: "and within minutes the flames were running along the whole roofline. (the wall of fire)",
    node: (n) => <Clip src={KS} from={19.0} rate={0.9} n={n} s0={1.02} s1={1.08} fy={0.45} /> },
  { a: 19.75, b: 24.72, vo: "A frame with no walls or drywall yet burns very differently from a finished building. (the open frame burning, close)",
    node: (n) => <Clip src={LT} from={3.0} rate={0.8} n={n} s0={1.04} s1={1.12} fx={0.45} fy={0.5} /> },
  { a: 24.72, b: 28.46, vo: "There's nothing to slow it down, and air gets in from every side. (fire through every bay of the grid)",
    node: (n) => <Clip src={LT} from={72.0} rate={0.9} n={n} s0={1.1} s1={1.03} fy={0.5} /> },
  { a: 28.46, b: 35.69, vo: "Above all of it was the man ... Adam Jastrzebski was a crane operator from London, Ontario. (the red jib over the fire)",
    node: (n) => <><Clip src={LT2} from={10.0} rate={0.9} n={n} s0={1.0} s1={1.08} fx={0.35} fy={0.3} />
      <RedLabel text="ADAM JASTRZEBSKI · CRANE OPERATOR" at={F(3.9)} hold={F(3.0)} size={42} /></> },
  { a: 35.69, b: 42.36, vo: "He was in the cab of the crane above the building, and the fire had cut him off. He crawled out along the boom ... (Blender crane)",
    node: () => <BlenderShot src={C + "maps/crane.mp4"} scale={1.18} oy={0.2} track={CRANE} labels={[["cab", "THE CAB", 12, 70, 0.1], ["tip", "END OF THE BOOM", 140, 55, 0.1]]} /> },
  { a: 42.36, b: 49.0, vo: "...as far from the flames as it went. He stayed out there, above the fire, waiting. A military search and rescue helicopter (BoomPath)",
    node: (n) => <BoomPath src={LT2} t={8.0} n={n} from={[0.64, 0.355]} man={[0.287, 0.228]} tip={[0.04, 0.145]} at={{ line: 8, dash: 62, push: 104 }} /> },
  { a: 49.0, b: 51.3, vo: "came from CFB Trenton, about eighty kilometres (the helicopter in the air)",
    node: (n) => <Clip src={CD} from={cd(95.0)} rate={0.8} n={n} s0={1.08} s1={1.14} fx={0.5} fy={0.5} /> },
  { a: 51.3, b: RA, vo: "west along the lake. (the street watching the fire)",
    node: (n) => <Clip src={KS} from={33.0} n={n} s0={1.0} s1={1.06} fy={0.55} /> },
  { a: RA, b: RB, vo: "RAW main: CD 17.5-32.5, the helicopter over the jib's tip, the rescuer lowered to the operator",
    node: (n) => <Clip src={CD} from={cd(17.5)} n={n} s0={1.06} s1={1.16} fx={0.45} fy={0.4} /> },
  { a: RB, b: 70.83, vo: "They lifted him off the end of the boom. (the hoist line under the helicopter, slowed)",
    node: (n) => <Clip src={CD} from={cd(124.0)} rate={0.7} n={n} s0={1.2} s1={1.26} fx={0.45} fy={0.45} /> },
  { a: 70.83, b: 73.23, vo: "He was hurt, and he survived. (the helicopter moving off with him)",
    node: (n) => <Clip src={CD} from={cd(140.0)} rate={0.7} n={n} s0={1.12} s1={1.18} fx={0.5} fy={0.45} /> },
  { a: 73.23, b: 77.5, vo: "A school nearby was evacuated, power was cut in the area, (people in the snow watching it burn)",
    node: (n) => <Clip src={KS} from={1.5} rate={0.9} n={n} s0={1.02} s1={1.08} fy={0.6} /> },
  { a: 77.5, b: 81.12, vo: "and the fire threatened a gas station and the cars parked in front. (flames over the parked cars)",
    node: (n) => <Clip src={KS} from={26.0} n={n} s0={1.1} s1={1.18} fx={0.5} fy={0.75} /> },
  { a: 81.12, b: 87.19, vo: "Wood frame buildings are at their most exposed while they're going up, before the sprinklers and the drywall go in. (the frame close)",
    node: (n) => <Clip src={LT} from={12.0} rate={0.85} n={n} s0={1.0} s1={1.08} fx={0.4} fy={0.5} /> },
  { a: 87.19, b: 92.04, vo: "Until then, the frame is a huge stack of dry timber with air all round it. (the frame through the trees)",
    node: (n) => <Clip src={LT} from={104.0} rate={0.9} n={n} s0={1.08} s1={1.02} fy={0.55} /> },
  { a: 92.04, b: 95.33, vo: "The Fire Marshal couldn't determine where or how it started. (the wall of fire)",
    node: (n) => <Clip src={KS} from={40.0} n={n} s0={1.04} s1={1.1} fy={0.45} /> },
  { a: 95.33, b: 98.6, vo: "The Ontario Ministry of Labour laid twenty two charges. (the jib over the smoke)",
    node: (n) => <Clip src={LT} from={33.0} n={n} s0={1.0} s1={1.06} fy={0.4} /> },
  { a: 98.6, b: 105.7, vo: "The builder, Jay Patry Enterprises, pleaded guilty to failing to make sure the construction safety rules were carried out. (ladder and frame)",
    node: (n) => <><Clip src={LT} from={134.0} rate={0.9} n={n} s0={1.02} s1={1.1} fy={0.55} />
      <RedLabel text="BUILDER · JAY PATRY ENTERPRISES" at={F(0.9)} hold={F(3.4)} size={42} /></> },
  { a: 105.7, b: 108.39, vo: "The company was fined sixty thousand dollars. (the roofline burning down)",
    node: (n) => <Clip src={RY} from={31.0} n={n} s0={1.04} s1={1.1} fy={0.45} /> },
  { a: 108.39, b: 112.6, vo: "Three individuals were fined another fourteen thousand between them, (frame through the trees, ladder)",
    node: (n) => <Clip src={LT} from={145.0} rate={0.85} n={n} s0={1.0} s1={1.07} fy={0.55} /> },
  { a: 112.6, b: 116.94, vo: "and their charge was failing to use all reasonable means to help the inspector's investigation. (the fire, the street)",
    node: (n) => <Clip src={KS} from={44.0} rate={0.95} n={n} s0={1.06} s1={1.0} fy={0.5} /> },
  { a: 116.94, b: 122.5, vo: "The rescue plan, in the end, was a helicopter and a very long arm. (the helicopter over the jib; fade)",
    node: (n) => <Clip src={CD} from={cd(60.0)} rate={0.8} n={n} s0={1.04} s1={1.14} fx={0.45} fy={0.45} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(35.69), kind: "blurDip", len: 14 },  // -> Blender crane
  { at: F(42.36), kind: "blurDip", len: 14 },  // -> the frozen jib
  { at: F(RB), kind: "blurDip", len: 14 },     // raw -> same camera later
  { at: F(98.6), kind: "glitch", len: 10 },    // -> the charges
];

const EndFade: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len], [0, 1], cl) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE MAN ON THE BOOM" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
      <Sequence from={F(121.7)} layout="none"><EndFade len={F(0.8)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(RA)} durationInFrames={F(RB) - F(RA)} layout="none">
        <Audio src={staticFile(C + "media/cd_clean.wav")} startFrom={F(1.5)} volume={(f) => dB(-3) * interpolate(f, [0, 6, F(RB - RA) - 16, F(RB - RA) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 3 (-14.1 LUFS file) at -19 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(122.5 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RA - 0.8 || t > RB + 0.6 ? 1 : t < RA ? (RA - t) / 0.8 : t > RB ? (t - RB) / 0.6 : 0;
          return dB(-19) * interpolate(t, [4.0, 5.0, 121.0, 122.5], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
