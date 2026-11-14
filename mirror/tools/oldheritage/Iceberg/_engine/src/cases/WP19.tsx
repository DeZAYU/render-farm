// Workplace #19 — Sunrise Propane, 54 Murray Road, Downsview, Toronto, Sunday 10 Aug 2008 (~3:50 a.m.): a chain of propane blasts for
// over half an hour; employee Parminder Saini lost; off-duty district chief Bob Leek died of a heart attack after coming to the scene;
// ~12,000 homes evacuated (1.6 km). Footage (all small personal uploaders, all with their own sound, no music found by rawclean):
// GB = gibbons (XCsNcwpYjUs, 640x480, over the rooftops), DS = Daryn S (LuG4TAd7i5c, 1080p, ~200 yards), OT = orangeterry
// (oRu3-wdrZ_o, 640x480, the dark neighbour camera, 4:26 a.m.). VO = one take (CASE19.mp3, starts on "Sunrise Propane"), split once.
// RAW = GB src 43.5-58.0 (14.5 s): the yard burning over the roofs, the big blast at src 51.83, the fireball after.
// Blender (build/CASE19/maps/night3d.py, OSM ODbL): A = glide to the burning yard; B1 = the 401 and the sleeping streets; B2 = windows
// light up outward to 1.6 km. Device: FireType (the TSSA's words cut out of a veil over the fire).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { FireType } from "../dev/WP19_FireType";
import { NA, NB1, NB2 } from "../dev/WP19_blLabels";

const C = "case/", GB = C + "graded/gb.mp4", DS = C + "graded/ds.mp4", OT = C + "graded/ot.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 131.2;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-14.02) @4.0 | RAW 18.02-32.52 (GB src 43.5-58.0) | VO part 2 (take 14.02-end) @32.52
// (case = take + 18.5), VO ends 130.34, hold to 131.2
const PART: [number, number, number | null][] = [[4.0, 0, 14.02], [32.52, 14.02, null]];
const RAW: [number, number] = [18.02, 32.52];
const R0 = 43.5;
const v2 = (t: number) => t + 18.5; // take second -> case second (part 2)

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.46, vo: "Sunrise Propane, Downsview, Toronto. August 2008. (DS: the yard burning beyond the houses)",
    node: (n) => <><Clip src={DS} from={5.0} n={n} s0={1.04} s1={1.12} fx={0.42} fy={0.5} />
      <RedLabel text="SUNRISE PROPANE · DOWNSVIEW, TORONTO" at={6} hold={F(2.0)} size={44} /><RedLabel text="AUGUST 10, 2008" at={F(2.9)} hold={F(1.3)} size={44} /></> },
  { a: 8.46, b: 14.94, vo: "The first explosion went off at about ten to four on a Sunday morning, at 54 Murray Road in the north of the city. (Blender A)",
    node: () => <BlenderShot src={C + "maps/A.mp4"} track={NA} labels={[["yard", "54 MURRAY ROAD", 112, 80, -0.09]]} /> },
  { a: 14.94, b: 18.02, vo: "The blasts kept coming for well over half an hour. (OT: the neighbour's camera in the dark)",
    node: (n) => <Clip src={OT} from={2.0} n={n} s0={1.0} s1={1.1} fx={0.55} fy={0.4} /> },
  { a: 18.02, b: 32.52, vo: "RAW: over the rooftops, the yard burning, the big blast, the fireball (GB src 43.5-58.0, own sound)",
    node: (n) => <Clip src={GB} from={R0} n={n} s0={1.0} s1={1.07} fx={0.5} fy={0.45} /> },
  { a: 32.52, b: v2(19.03), vo: "Parminder Saini, a twenty five year old employee, was lost in those first blasts. (OT, slowed)",
    node: (n) => <><Clip src={OT} from={14.0} n={n} rate={0.7} s0={1.06} s1={1.16} fx={0.5} fy={0.45} />
      <RedLabel text="PARMINDER SAINI, 25" at={8} hold={F(3.6)} size={42} /></> },
  { a: v2(19.03), b: v2(26.33), vo: "The yard sits close to the 401 ... the homes around it were full of people asleep. (Blender B1)",
    node: () => <BlenderShot src={C + "maps/B1.mp4"} track={NB1} labels={[["hwy", "HIGHWAY 401", 40, 110, 0.06]]} /> },
  { a: v2(26.33), b: v2(30.0), vo: "It was a chain of explosions, close enough to homes (GB: the fire over the rooftops)",
    node: (n) => <Clip src={GB} from={0.8} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.6} /> },
  { a: v2(30.0), b: v2(32.77), vo: "that everyone within one point six kilometres was ordered out. (DS: the house in the foreground)",
    node: (n) => <Clip src={DS} from={20.0} n={n} s0={1.1} s1={1.02} fx={0.55} fy={0.5} /> },
  { a: v2(32.77), b: v2(38.26), vo: "About twelve thousand homes were evacuated, and around a hundred couldn't be lived in afterwards. (Blender B2: the wave of lights)",
    node: () => <BlenderShot src={C + "maps/B2.mp4"} track={NB2} labels={[["edge", "1.6 KM", 110, 50, -0.05]]} /> },
  { a: v2(38.26), b: v2(43.22), vo: "Bob Leek was an off duty district chief who'd spent twenty five years with Toronto Fire. (DS)",
    node: (n) => <><Clip src={DS} from={75.0} n={n} s0={1.02} s1={1.1} fx={0.45} fy={0.5} />
      <RedLabel text="BOB LEEK · DISTRICT CHIEF, TORONTO FIRE" at={8} hold={F(3.4)} size={42} /></> },
  { a: v2(43.22), b: v2(47.89), vo: "He came to the scene, collapsed with a heart attack, and passed away the next day. (GB)",
    node: (n) => <Clip src={GB} from={36.0} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.6} /> },
  { a: v2(47.89), b: v2(52.54), vo: "That detail is worth getting right, because the blasts themselves didn't take him. (OT, slowed)",
    node: (n) => <Clip src={OT} from={26.0} n={n} rate={0.7} s0={1.0} s1={1.1} fx={0.5} fy={0.42} /> },
  { a: v2(52.54), b: v2(58.3), vo: "The province's safety regulator, the TSSA, had warned Sunrise about those transfers in November 2006, (GB: the jets)",
    node: (n) => <Clip src={GB} from={60.0} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.6} /> },
  { a: v2(58.3), b: v2(63.71), vo: "and issued stop work orders in 2006 and 2007. (DS)",
    node: (n) => <Clip src={DS} from={35.0} n={n} s0={1.12} s1={1.04} fx={0.4} fy={0.5} /> },
  { a: v2(63.71), b: v2(68.46), vo: "It said afterwards that the transfers had been a frequent and routine practice at the yard. (FireType)",
    node: (n) => <FireType src={GB} from={92.0} rate={0.8} n={n} credit="TECHNICAL STANDARDS AND SAFETY AUTHORITY (TSSA)"
      lines={[[{ w: "“a", at: F(65.79 - 63.71) }, { w: "frequent", at: F(65.83 - 63.71) }, { w: "and", at: F(66.37 - 63.71) }],
        [{ w: "routine", at: F(66.48 - 63.71) }, { w: "practice”", at: F(66.93 - 63.71) }]]} /> },
  { a: v2(68.46), b: v2(74.71), vo: "The TSSA reported that a driver had been doing exactly that, moving propane from one truck to another. (DS: push into the burning jet)",
    node: (n) => <Clip src={DS} from={100.0} n={n} s0={1.0} s1={1.22} fx={0.47} fy={0.5} /> },
  { a: v2(74.71), b: v2(78.62), vo: "The court later heard that propane vapour ignited during the transfer. (replay of the raw's blast, 0.5x, pushed)",
    node: (n) => <Clip src={GB} from={51.2} n={n} rate={0.5} s0={1.12} s1={1.3} fx={0.35} fy={0.62} /> },
  { a: v2(78.62), b: v2(83.47), vo: "In June 2013, Sunrise was convicted of nine provincial offences. (OT)",
    node: (n) => <Clip src={OT} from={33.0} n={n} s0={1.12} s1={1.02} fx={0.5} fy={0.42} /> },
  { a: v2(83.47), b: v2(87.5), vo: "In January 2016, the company and its directors, (DS)",
    node: (n) => <Clip src={DS} from={50.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: v2(87.5), b: v2(92.1), vo: "Shay Ben-Moshe and Valery Belahov, were fined five point three million dollars. (GB)",
    node: (n) => <><Clip src={GB} from={66.0} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.55} />
      <RedLabel text="SHAY BEN-MOSHE · VALERY BELAHOV" at={0} hold={F(3.0)} size={42} /></> },
  { a: v2(92.1), b: v2(95.29), vo: "Residents filed a three hundred million dollar lawsuit. (DS)",
    node: (n) => <Clip src={DS} from={85.0} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v2(95.29), b: v2(102.04), vo: "By the time of the fines, Sunrise was no longer operating, and its lawyer said the directors couldn't pay millions. (GB)",
    node: (n) => <Clip src={GB} from={72.0} n={n} s0={1.0} s1={1.12} fx={0.45} fy={0.55} /> },
  { a: v2(102.04), b: v2(108.85), vo: "An audit afterwards shut six other propane facilities in Ontario that couldn't show their workers were properly trained. (DS)",
    node: (n) => <Clip src={DS} from={110.0} n={n} s0={1.02} s1={1.12} fx={0.5} fy={0.5} /> },
  { a: v2(108.85), b: END, vo: "The transfer was illegal before anybody started it. (GB, slow pull out)",
    node: (n) => <Clip src={GB} from={99.0} n={n} s0={1.14} s1={1.0} fx={0.5} fy={0.55} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.46), kind: "blurDip", len: 12 },     // into Blender A
  { at: F(14.94), kind: "blurDip", len: 12 },    // out of it
  { at: F(18.02), kind: "blurDip", len: 12 },    // VO -> raw
  { at: F(32.52), kind: "blurDip", len: 14 },    // raw -> VO
  { at: F(v2(19.03)), kind: "glitch", len: 10 }, // into Blender B1
  { at: F(v2(26.33)), kind: "blurDip", len: 12 },
  { at: F(v2(32.77)), kind: "blurDip", len: 12 }, // into B2
  { at: F(v2(38.26)), kind: "blurDip", len: 12 },
  { at: F(v2(47.89)), kind: "blurDip", len: 12 }, // GB -> the dark neighbour camera
  { at: F(v2(63.71)), kind: "blurDip", len: 12 }, // into FireType
  { at: F(v2(74.71)), kind: "blurDip", len: 12 }, // the replay
  { at: F(v2(78.62)), kind: "blurDip", len: 12 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FOUR IN THE MORNING" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found), never under the VO */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/gb_clean.wav")} startFrom={F(R0)} volume={(f) => dB(-3) * interpolate(f, [0, 6, F(RAW[1] - RAW[0]) - 16, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 4 (-12 LUFS file) at -22 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(95)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-22) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
