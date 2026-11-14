// Workplace #04 — Magnablend, Waxahachie, Texas, 3 Oct 2011: a chemical blending plant burns; 25-30 workers all get out, ~1,000 people,
// Wedgeworth Elementary and Navarro College evacuated; OSHA proposes $45,000 (7 serious violations, ventilation, sprinkler).
// Footage: MAG = R Re (26 subs) UW25SNPKX5I, a montage of the uploader's own clips with source cuts (title card 0-3.8 never used);
// MF = mrfixitdusty (17 subs) GKdTlf6fS3s, one parking-lot take. Both graded --house; raw audio = rawclean.py (no music found).
// VO = CASE04.mp3 (no count word), split only at the two raws (both at sentence ends):
//   A 0-9.68 | R1 main: MF 14.3-24.8 (the plant burning from the lot, hoses arcing; jitter cuts end 13.6) | B 9.68-34.37 ("...got out.") |
//   R2: MAG 25.1-28.9 + 31.6-35.7 (fireball at the rail crossing, then the crowd watching the yard burn; one source cut) | C 34.37-end.
// Devices: OneRoof (frozen lot frame, the plant's one long building traced), Blender evac map (NAIP + OSM, plant site, Wedgeworth
// Elementary, Navarro College), FineSlip (the OSHA release printed on a slip, the fine torn off).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { OneRoof } from "../dev/WP04_OneRoof";
import { FineSlip } from "../dev/WP04_FineSlip";
import { EVAC } from "../dev/WP04_evacLabels";

const C = "case/", MAG = C + "graded/mag.mp4", MF = C + "graded/mf.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(79.2);

// timeline (s): title 0-4 | A @4.00 (VO 0-9.68) | R1 13.68-24.18 | B @24.18 (VO 9.68-34.37, tl = t + 14.5) | R2 48.87-56.77 | C @56.77 (tl = t + 22.4), VO ends 78.27
const PART: [number, number, number | null][] = [[4.0, 0, 9.68], [24.18, 9.68, 34.37], [56.77, 34.37, null]];
// raw audio windows: timeline a, b, clean wav, src start, gain dB
const RAWS: [number, number, string, number, number][] = [
  [13.68, 24.18, "mf_clean.wav", 14.3, -6],
  [48.87, 52.67, "mag_clean.wav", 25.1, -9],
  [52.67, 56.77, "mag_clean.wav", 31.6, -9],
];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.1, vo: "Magnablend. Waxahachie, Texas. October 2011. (the column over the trees)",
    node: (n) => <><Clip src={MAG} from={4.4} n={n} s0={1.02} s1={1.1} fy={0.7} />
      <RedLabel text="MAGNABLEND · WAXAHACHIE, TEXAS" at={6} hold={F(2.1)} size={44} /><RedLabel text="OCTOBER 3, 2011" at={F(2.6)} hold={F(1.3)} size={44} /></> },
  { a: 8.1, b: 10.9, vo: "The fire broke out shortly before eleven in the morning, (silos, flames at their feet)",
    node: (n) => <Clip src={MAG} from={49.1} rate={0.6} n={n} s0={1.04} s1={1.12} fx={0.4} fy={0.75} /> },
  { a: 10.9, b: 13.68, vo: "and the black smoke darkened the sky for miles. (the column seen across the fields)",
    node: (n) => <Clip src={MAG} from={40.0} rate={0.7} n={n} s0={1.0} s1={1.08} fy={0.4} /> },
  { a: 13.68, b: 24.18, vo: "RAW 1 (main): MF, the plant burning from the parking lot, hoses arcing (src 14.3-24.8)",
    node: (n) => <Clip src={MF} from={14.3} n={n} s0={1.0} s1={1.1} fx={0.55} fy={0.45} /> },
  { a: 24.18, b: 27.8, vo: "Magnablend makes custom chemicals for oil fields, farming, (the yard, a hose arcing in)",
    node: (n) => <Clip src={MAG} from={12.8} rate={0.93} n={n} s0={1.08} s1={1.02} fy={0.7} /> },
  { a: 27.8, b: 34.56, vo: "water treatment and other industries. It blends and packages them on site, so ... one building. (OneRoof)",
    node: (n) => <OneRoof src={MF} t={6.0} n={n} traceAt={F(3.4)} labelAt={F(6.1)} label="THE BLENDING PLANT" /> },
  { a: 34.56, b: 36.9, vo: "Between twenty five and thirty people were inside (the yard burning behind the crossing)",
    node: (n) => <Clip src={MAG} from={21.05} rate={0.65} n={n} s0={1.03} s1={1.1} fx={0.5} fy={0.75} /> },
  { a: 36.9, b: 40.0, vo: "that morning, mixing a wastewater treatment product. (the column from the road)",
    node: (n) => <Clip src={MAG} from={46.8} rate={0.5} n={n} s0={1.0} s1={1.07} fy={0.6} /> },
  { a: 40.0, b: 43.2, vo: "According to the company, the mix gave off too much steam, (the lot view: the smoke boiling off the building)",
    node: (n) => <Clip src={MF} from={8.3} rate={0.6} n={n} s0={1.2} s1={1.32} fx={0.3} fy={0.5} /> },
  { a: 43.2, b: 46.5, vo: "and a spark nearby lit it. That's the company's own account (the fireball, slowed)",
    node: (n) => <Clip src={MAG} from={18.0} rate={0.68} n={n} s0={1.0} s1={1.12} fx={0.3} fy={0.45} /> },
  { a: 46.5, b: 48.87, vo: "of it. Every one of them got out. (the smoke over the buildings beside the plant)",
    node: (n) => <Clip src={MAG} from={23.3} rate={0.58} n={n} s0={1.0} s1={1.06} /> },
  { a: 48.87, b: 52.67, vo: "RAW 2a: the fireball at the rail crossing (MAG 25.1-28.9)",
    node: (n) => <Clip src={MAG} from={25.1} n={n} s0={1.0} s1={1.06} /> },
  { a: 52.67, b: 56.77, vo: "RAW 2b: people watching the yard burn (MAG 31.6-35.7)",
    node: (n) => <Clip src={MAG} from={31.6} n={n} s0={1.0} s1={1.06} fy={0.7} /> },
  { a: 56.77, b: 62.77, vo: "About a thousand residents were moved out, along with an elementary school and a junior college nearby. (Blender evac)",
    node: () => <BlenderShot src={C + "maps/evac.mp4"} track={EVAC} labels={[["plant", "MAGNABLEND PLANT SITE", 10, 92, -0.06], ["school", "WEDGEWORTH ELEMENTARY", 84, 90, -0.07], ["college", "NAVARRO COLLEGE", 114, 60, -0.07]]} /> },
  { a: 62.77, b: 65.9, vo: "In March 2012, OSHA, the federal workplace safety agency, (the column, later, over the trees)",
    node: (n) => <Clip src={MAG} from={9.0} rate={0.9} n={n} s0={1.1} s1={1.02} fy={0.55} /> },
  { a: 65.9, b: 79.2, vo: "proposed $45,000 in fines for seven violations ... ventilation ... sprinkler ... Forty five thousand dollars. Remember that number. (FineSlip)",
    node: (n) => <FineSlip src={MAG} t={36.6} n={n} at={{ fine: 19, viol: 100, vent: 166, spr: 193, tear: 272, hold: 300 }} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(56.77), kind: "glitch", len: 10 },   // raw -> the map
  { at: F(65.9), kind: "blurDip", len: 14 },   // -> the frozen crossing + slip
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE BLENDING PLANT" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, wav, src, g], i) => {
        const n = F(b) - F(a), first = i !== 2, last = i !== 1;
        return (
          <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
            <Audio src={staticFile(C + "media/" + wav)} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, first ? 6 : 2, n - (last ? 14 : 3), n - (last ? 3 : 0)], [0, 1, 1, last ? 0 : 1], cl)} />
          </Sequence>
        );
      })}
      {/* music: Epidemic ambient Music 4 (-11.9 LUFS file) at -22 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(79.2 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = [[13.68, 24.18], [48.87, 56.77]].reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-22) * interpolate(t, [4.0, 5.0, 77.6, 79.2], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
