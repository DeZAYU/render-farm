// Workplace #16 — Blue Rhino propane cylinder refilling plant, Tavares, Florida, night of 29 Jul 2013 (~10:40 PM): 24 on the night
// shift; a forklift that was not explosion proof sparked propane vapour where workers were venting tanks, then ~600,000 lb of propane
// burned; cylinders burst for hours. Footage: Jeffrey Hegarty across the street (dSFJ76NXv3Y, 1080p, with sound) and The 11th Hour
// through the trees (xuU8jhoLTj0, 1080p, its audio never used). VO = one take (CASE16.mp3), split once at the main raw.
// Raw = across the street as the yard flares up (src 34.0-48.0, 14 s; rawclean: no music, original kept).
// Devices: Blender yard (vapour creeping along the floor; forklift spark -> flame front), CitationStamps (OSHA settlement).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { CitationStamps } from "../dev/WP16_CitationStamps";
import { VAP, SPK } from "../dev/WP16_blLabels";

const C = "case/", BR = C + "graded/br.mp4", EH = C + "graded/eh.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 106.2;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-13.89) @4.0 | RAW 17.89-31.89 (BR src 34.0-48.0) | VO part 2 (take 13.89-end) @31.89, ends 105.13
const PART: [number, number, number | null][] = [[4.0, 0, 13.89], [31.89, 13.89, null]];
const RAW: [number, number] = [17.89, 31.89];
const R0 = 34.0;
const STAMP = F(67.13 - 65.64); // "nine serious citations" inside the stamps shot

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.23, vo: "Tavares, Florida. July 2013. (across the street, the plant burning)",
    node: (n) => <><Clip src={BR} from={60.0} n={n} s0={1.02} s1={1.1} fx={0.55} fy={0.45} />
      <RedLabel text="BLUE RHINO PLANT · TAVARES, FLORIDA" at={6} hold={F(1.7)} size={44} /><RedLabel text="JULY 29, 2013" at={F(1.9)} hold={F(1.2)} size={44} /></> },
  { a: 7.23, b: 10.6, vo: "Blue Rhino is the brand on a lot of the propane cylinders people swap at gas stations for their grills, (through the trees)",
    node: (n) => <Clip src={EH} from={20.0} n={n} s0={1.0} s1={1.08} fx={0.4} fy={0.6} /> },
  { a: 10.6, b: 14.03, vo: "and this plant filled them. (across the street)",
    node: (n) => <Clip src={BR} from={75.0} n={n} s0={1.12} s1={1.04} fx={0.6} fy={0.4} /> },
  { a: 14.03, b: 17.89, vo: "Twenty four people were on the night shift when the first explosion went off. (through the trees, the fire lighting up)",
    node: (n) => <Clip src={EH} from={40.0} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.6} /> },
  { a: 17.89, b: 31.89, vo: "RAW: across the street, the yard flares up (src 34.0-48.0, own sound)",
    node: (n) => <Clip src={BR} from={R0} n={n} s0={1.0} s1={1.08} fx={0.55} fy={0.45} /> },
  { a: 31.89, b: 37.34, vo: "Early reports said fifteen people were missing, and that was corrected once everyone had been found. (through the trees)",
    node: (n) => <Clip src={EH} from={60.0} n={n} s0={1.08} s1={1.0} fx={0.45} fy={0.55} /> },
  { a: 37.34, b: 40.55, vo: "Firefighters set up a half mile evacuation zone. (the plant beyond the tree line, street lights)",
    node: (n) => <Clip src={BR} from={170.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.6} /> },
  { a: 40.55, b: 47.21, vo: "Propane is heavier than air. A leak doesn't rise and clear. It spreads along the floor and waits for a spark, (Blender: vapour)",
    node: () => <BlenderShot src={C + "maps/vapour.mp4"} track={VAP} labels={[["vapour", "PROPANE VAPOUR", 70, 100, 0.0]]} /> },
  { a: 47.21, b: 51.9, vo: "and in a refilling plant, thousands of full cylinders are sitting in that same air. (the yard burning)",
    node: (n) => <Clip src={BR} from={100.0} n={n} s0={1.0} s1={1.12} fx={0.5} fy={0.5} /> },
  { a: 51.9, b: 54.54, vo: "The fire was out by about two in the morning. (through the trees, later)",
    node: (n) => <Clip src={EH} from={200.0} n={n} s0={1.04} s1={1.0} fx={0.5} fy={0.6} /> },
  { a: 54.54, b: 58.7, vo: "OSHA's count of the injured was six workers, four of them severely. (across the street)",
    node: (n) => <Clip src={BR} from={130.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.45} /> },
  { a: 58.7, b: 65.05, vo: "Most people who own a grill have one of these cylinders sitting next to it, and almost nobody thinks about where it was filled.",
    node: (n) => <Clip src={EH} from={100.0} n={n} s0={1.0} s1={1.14} fx={0.45} fy={0.6} /> },
  { a: 65.05, b: 69.0, vo: "The fire chief said equipment failure and human error were the likely cause,",
    node: (n) => <Clip src={EH} from={175.0} n={n} s0={1.1} s1={1.0} fx={0.5} fy={0.55} /> },
  { a: 69.0, b: 72.53, vo: "and the fire was ruled accidental. OSHA went further.",
    node: (n) => <Clip src={BR} from={115.0} n={n} s0={1.0} s1={1.08} fx={0.55} fy={0.45} /> },
  { a: 72.53, b: 80.86, vo: "It found a forklift that wasn't explosion proof ... venting propane from tanks. Its spark lit the vapour, (Blender: forklift, spark, flame front)",
    node: () => <BlenderShot src={C + "maps/spark.mp4"} track={SPK} labels={[["forklift", "FORKLIFT", 40, 110, -0.05]]} /> },
  { a: 80.86, b: 83.64, vo: "and then nearly six hundred thousand pounds of propane. (the fireball through the trees, slowed)",
    node: (n) => <Clip src={EH} from={147.6} n={n} rate={0.6} s0={1.0} s1={1.1} fx={0.4} fy={0.65} /> },
  { a: 83.64, b: 91.14, vo: "Blue Rhino accepted nine serious citations, paid fifty two thousand dollars, and had sixty days to fix every hazard. (CitationStamps)",
    node: (n) => <CitationStamps src={BR} t={52.0} n={n} stampAt={STAMP} credit="OSHA SETTLEMENT · DECEMBER 2015"
      lines={[{ text: "“affirms nine serious … citations”", at: 8 },
        { text: "“penalties totaling $52,000”", at: F(68.6 - 65.64), hi: "$52,000", hiAt: F(69.36 - 65.64) },
        { text: "“abatement of all hazards within 60 days”", at: F(70.5 - 65.64), hi: "60 days", hiAt: F(71.23 - 65.64) }]} /> },
  { a: 91.14, b: 95.8, vo: "Then, in November 2014, the temporary staffing agency that supplied workers to the plant (through the trees)",
    node: (n) => <Clip src={EH} from={215.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.6} /> },
  { a: 95.8, b: 100.3, vo: "was cited for failing to train them on the hazardous materials they handled.",
    node: (n) => <Clip src={BR} from={187.0} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.55} /> },
  { a: 100.3, b: END, vo: "The night shift at a propane plant was staffed by people nobody had taught about propane. (last of the fire, slow pull out)",
    node: (n) => <Clip src={BR} from={224.0} n={n} s0={1.14} s1={1.0} fx={0.5} fy={0.55} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(17.89), kind: "blurDip", len: 12 },  // VO -> raw
  { at: F(31.89), kind: "blurDip", len: 14 },  // raw -> VO
  { at: F(40.55), kind: "glitch", len: 10 },   // into the Blender yard
  { at: F(47.21), kind: "blurDip", len: 12 },  // out of it
  { at: F(72.53), kind: "blurDip", len: 12 },  // into the forklift shot
  { at: F(83.64), kind: "blurDip", len: 12 },  // into the frozen frame
  { at: F(91.14), kind: "blurDip", len: 12 },  // out of it
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWENTY FOUR ON SHIFT" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output of src 30-56 (no music found), never under the VO */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/br_clean.wav")} startFrom={F(R0 - 30)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(RAW[1] - RAW[0]) - 16, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* stamps: a soft real knock per stamp */}
      {Array.from({ length: 9 }, (_, i) => (
        <Sequence key={"s" + i} from={F(83.64) + STAMP + i * 5} durationInFrames={20} layout="none"><Audio src={staticFile("sfx_n2/real/impact_3.wav")} volume={dB(-24)} /></Sequence>
      ))}
      {/* Blender forklift shot: the flash when the vapour lights (frame 194 of the shot) */}
      <Sequence from={F(72.53) + 192} durationInFrames={F(3.2)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={(f) => dB(-12) * interpolate(f, [0, 60, 96], [1, 1, 0], cl)} /></Sequence>
      {/* music: Epidemic ambient Music 1 (-18 LUFS file) at -16 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(25)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-16) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
