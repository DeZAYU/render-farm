// Workplace #05 — Lynchburg, Virginia, 30 Apr 2014 ~1:54 PM: a CSX crude-oil train derails beside the James River downtown; cars burn,
// oil reaches the river, the fire department lets it burn; ~30,000 gal escape; DEQ fine $361,000; NTSB: a broken rail.
// Footage (all small personal uploaders, graded --house): OF = Grateful Dad Z1SH1pn4jeY (office window over downtown, 1080p, one take);
// LYN = bblankinship q_wWk68kgxQ (riverbank, 568x320); BR = bblankinship FcsvPpDR7d0 (driving past, car window, 1080p; source cut 64.7).
// VO = CASE05.mp3 (no count word), split once at the main raw (after "...beside the water."): A 0-13.6 | R OF 0.6-15.1 (14.5 s, cars burning
// below the window, flames surging; stops before the window frame enters ~18.5) | B 13.81-end. VO 76.6 s -> one raw (WP_PLAN).
// Devices: Blender corridor (NAIP + DEM + OSM, rail along the James, the derailment stretch in red), Blender reach (Blue Marble relief,
// Lac-Megantic -> Lynchburg), EdgeWash (the slick a water attack would push into the river), RailWord (the NTSB sentence, BROKEN RAIL held).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { EdgeWash } from "../dev/WP05_EdgeWash";
import { RailWord } from "../dev/WP05_RailWord";
import { CORRIDOR } from "../dev/WP05_corridorLabels";
import { REACH } from "../dev/WP05_reachLabels";

const C = "case/", OF = C + "graded/of.mp4", LYN = C + "graded/lyn.mp4", BR = C + "graded/br.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(95.8);

// timeline (s): title 0-4 | A @4.0 (VO 0-13.6) | R 17.6-32.1 | B @32.1 (VO 13.81-end, tl = t + 18.29), VO ends 94.89
const PART: [number, number, number | null][] = [[4.0, 0, 13.6], [32.1, 13.81, null]];
const RAW: [number, number, number, number] = [17.6, 32.1, 0.6, -5]; // timeline a, b, src, gain dB

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.2, vo: "Downtown Lynchburg, Virginia. 2014. (the column over the downtown blocks)",
    node: (n) => <><Clip src={BR} from={3.0} n={n} s0={1.04} s1={1.1} fy={0.6} />
      <RedLabel text="DOWNTOWN LYNCHBURG, VIRGINIA" at={6} hold={F(1.4)} size={44} /><RedLabel text="APRIL 30, 2014" at={F(1.9)} hold={F(1.2)} size={44} /></> },
  { a: 7.2, b: 14.2, vo: "Early in the afternoon of the 30th of April, a CSX train carrying crude oil was running through the middle of the city, (Blender corridor)",
    node: () => <BlenderShot src={C + "maps/corridor.mp4"} track={CORRIDOR} scale={1.08} oy={0.85}
      labels={[["downtown", "DOWNTOWN", 118, 80, -0.06], ["site", "CSX LINE · JAMES RIVER", 160, 60, -0.07]]} /> },
  { a: 14.2, b: 17.6, vo: "along the James River. Part of it came off the rails beside the water. (from the car: the cars burning on the tracks)",
    node: (n) => <Clip src={BR} from={47.6} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.7} /> },
  { a: 17.6, b: 32.1, vo: "RAW (main): OF, the tank cars burning below the office window, flames surging (src 0.6-15.1)",
    node: (n) => <Clip src={OF} from={0.6} n={n} s0={1.0} s1={1.12} fx={0.42} fy={0.55} /> },
  { a: 32.1, b: 35.45, vo: "About twelve to fourteen tank cars had left the rails. (closer from the road, flames along the cars)",
    node: (n) => <Clip src={BR} from={52.5} n={n} s0={1.06} s1={1.14} fx={0.62} fy={0.75} /> },
  { a: 35.45, b: 41.48, vo: "In 2014, crude was moving across North America by rail in numbers it never had before. (past the yard: the tank train on the tracks below)",
    node: (n) => <Clip src={BR} from={41.3} n={n} s0={1.02} s1={1.08} fy={0.7} /> },
  { a: 41.48, b: 48.48, vo: "The summer before, a runaway oil train had destroyed the centre of Lac-Megantic in Quebec, and forty seven people were lost. (Blender reach)",
    node: () => <BlenderShot src={C + "maps/reach.mp4"} track={REACH} scale={1.1} oy={0.6}
      labels={[["lac", "LAC-MÉGANTIC · JULY 2013", 14, 150, -0.07], ["lyn", "LYNCHBURG", 158, 60, -0.07]]} /> },
  { a: 48.48, b: 51.08, vo: "Everybody in that city knew what it could have been. (the window view: rooftops, the column)",
    node: (n) => <Clip src={OF} from={15.4} n={n} s0={1.05} s1={1.12} fx={0.35} fy={0.7} /> },
  { a: 51.08, b: 55.15, vo: "At least three cars split open, and some of the oil ran into the river. (the riverbank: fire on the water's edge)",
    node: (n) => <Clip src={LYN} from={2.0} n={n} s0={1.0} s1={1.08} fx={0.45} fy={0.65} /> },
  { a: 55.15, b: 60.61, vo: "Then the fire department made a call that sounds strange ... They let it burn. (the column from the road)",
    node: (n) => <Clip src={BR} from={58.4} n={n} s0={1.0} s1={1.1} fx={0.75} fy={0.6} /> },
  { a: 60.61, b: 68.74, vo: "Next to a river, it was the right call. Pouring water and foam ... into the water supply. (EdgeWash)",
    node: (n) => <EdgeWash src={LYN} from={20.0} rate={0.6} n={n} at={{ box: 12, river: 40, bank: 140, slick: 160, slickEnd: 232 }} /> },
  { a: 68.74, b: 72.13, vo: "The area around the tracks was evacuated while it burned. (the window view, later)",
    node: (n) => <Clip src={OF} from={28.6} rate={0.93} n={n} s0={1.1} s1={1.04} fx={0.4} fy={0.6} /> },
  { a: 72.13, b: 76.08, vo: "Nobody was injured, and the city said its drinking water wasn't affected. (the riverbank, the fire lower)",
    node: (n) => <Clip src={LYN} from={47.0} n={n} s0={1.12} s1={1.04} fx={0.4} fy={0.6} /> },
  { a: 76.08, b: 82.63, vo: "Virginia's environment department said nearly thirty thousand gallons of crude escaped, and most of it burned off. (the column over the hill, from the car)",
    node: (n) => <Clip src={BR} from={22.0} n={n} s0={1.0} s1={1.08} fy={0.5} /> },
  { a: 82.63, b: 86.82, vo: "The department proposed a fine of three hundred and sixty one thousand dollars. (the riverbank)",
    node: (n) => <Clip src={LYN} from={30.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: 86.82, b: 95.8, vo: "The NTSB found the likely cause was a broken rail. Hold on to those two words. (RailWord)",
    node: (n) => <RailWord src={BR} from={56.0} rate={0.25} n={n} at={{ type0: 8, type1: 118, red: 151, hold: 187 }} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(41.48), kind: "glitch", len: 10 },   // -> Lac-Megantic map (a section within the case)
  { at: F(48.48), kind: "blurDip", len: 12 },  // map -> back to the city
  { at: F(86.82), kind: "blurDip", len: 14 },  // -> the finding
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="OIL CARS IN THE RIVER" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1]) - F(RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/of_clean.wav")} startFrom={F(RAW[2])} volume={(f) => dB(RAW[3]) * interpolate(f, [0, 6, F(RAW[1] - RAW[0]) - 14, F(RAW[1] - RAW[0]) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file) at -16 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(95.8 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0;
          return dB(-16) * interpolate(t, [4.0, 5.0, 94.2, 95.8], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
