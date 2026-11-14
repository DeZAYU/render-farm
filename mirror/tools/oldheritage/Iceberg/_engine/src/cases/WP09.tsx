// Workplace #09 — East Palestine, Ohio, Fri 3 Feb 2023 ~8:55 PM: a Norfolk Southern freight's hopper-car bearing overheats and fails,
// 38 cars derail and burn; 6 Feb five vinyl chloride tank cars are vented and burned (NTSB 2024: not necessary).
// Sources (all OK in SOURCES.csv): main 95igiL5rmhI (Firestar Drone Photography, morning drone over the wreck; logo slate cut, music
// track not used), extra1 4U0zFodfvro + extra2 cgTJfAax_vg (Mr.Random, night drone, SILENT; on-screen title cut), extra3 BxfQy0jo9EU
// (Eric's Train Yard, 4 Feb drone hover over a burning tank car; music track not used). USGS NAIP aerial (public domain) for MileRing.
// VO = one take (CASE09.mp3), split once at the end of "Thirty eight cars came off." (silence 29.24-29.47).
// ONE raw (WP_PLAN: VO 84 s > 70 s): the night drone along the burning wreck, 14 s (mr 154.2-168.2). Every source with sound carries
// only music, so the raw's sound is a real fire recording (CC0, freesound 158476 "fire burning", case/media/sfx) + wind.
// Blender (build/CASE09/assets/train.py): bearing (the camera rides back along the freight to the glowing bearing), detector (the hot car
// crosses a trackside detector, its lamp turns red).
// Devices (new, dev/WP09_*): PileFreeze (drone pass freezes, white line along the derailed stretch, brackets on the burning tank cars),
// MileRing (NAIP aerial in 3-D, one-mile ring to scale round the site).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { WP09_PileFreeze } from "../dev/WP09_PileFreeze";
import { WP09_MileRing } from "../dev/WP09_MileRing";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/", MP = "case/maps/";
const FS = G + "fs.mp4", MR = G + "mr.mp4", MR2 = G + "mr2.mp4", ET = G + "et.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(103.6);

// timeline (s): title 0-4 | VO A (0-29.35) @4.00 | RAW 33.60-47.60 (MR 154.2-168.2) | VO B (29.35-end) @47.90 (tl = vo + 18.55),
// VO ends 102.44, hold to 103.6
const PART: [number, number, number | null][] = [[4.0, 0, 29.35], [47.9, 29.35, null]];
const RAW: [number, number] = [33.6, 47.6];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const V = (src: string, from: number, o: { s0?: number; s1?: number; fx?: number; fy?: number } = {}) => (n: number) =>
  <Shot_FX src={src} from={from} n={n} s0={o.s0 ?? 1.0} s1={o.s1 ?? 1.07} fx={o.fx ?? 0.5} fy={o.fy ?? 0.5} />;
const Two = (a: (n: number) => React.ReactNode, b: (n: number) => React.ReactNode, split: number) => (n: number) => (
  <>
    <Sequence durationInFrames={F(split)} layout="none"><AbsoluteFill>{a(F(split))}</AbsoluteFill></Sequence>
    <Sequence from={F(split)} layout="none"><AbsoluteFill>{b(n - F(split))}</AbsoluteFill></Sequence>
  </>
);

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.82, vo: "East Palestine, Ohio. February 2023. (morning drone over the wreck)",
    node: (n) => <>{V(FS, 1.0, { s0: 1.0, s1: 1.08 })(n)}<RedLabel text="EAST PALESTINE, OHIO" at={6} hold={F(1.7)} size={44} /><RedLabel text="FEBRUARY 3, 2023" at={F(1.94)} hold={F(1.7)} size={44} /></> },
  { a: 7.82, b: 12.08, vo: "Almost everyone has heard of this one, mostly for what happened three days later. (push into the smoke)",
    node: (n) => V(FS, 9.0, { s0: 1.3, s1: 1.5, fx: 0.58, fy: 0.22 })(n) },
  { a: 12.08, b: 16.07, vo: "It happened just before nine on a Friday night, on the edge of the village. (night drone: the fire far off, village lights)",
    node: (n) => V(MR2, 30.0, { s0: 1.0, s1: 1.1, fy: 0.45 })(n) },
  { a: 16.07, b: 23.4, vo: "A Norfolk Southern freight was passing through ... a bearing on one of its hopper cars overheated and failed. (Blender bearing)",
    node: (n) => V(MP + "bearing.mp4", 0, { s0: 1.0, s1: 1.0 })(n) },
  { a: 23.4, b: 27.6, vo: "Detectors beside the track are there to catch a hot bearing. The crew got no warning until the train passed one, (Blender detector)",
    node: (n) => V(MP + "detector.mp4", 0, { s0: 1.0, s1: 1.0 })(n) },
  { a: 27.6, b: 31.73, vo: "and by then it was too late to stop. (night drone: the fire growing)",
    node: (n) => V(MR2, 95.0, { s0: 1.04, s1: 1.12 })(n) },
  { a: 31.73, b: 33.6, vo: "Thirty eight cars came off. (morning drone along the pile)",
    node: (n) => V(FS, 15.0, { s0: 1.05, s1: 1.12, fx: 0.55, fy: 0.6 })(n) },
  { a: 33.6, b: 47.6, vo: "RAW (night drone, silent + real fire): the wreck burning in a long wall of flame (mr 154.2-168.2)",
    node: (n) => V(MR, 154.2, { s0: 1.0, s1: 1.1, fy: 0.55 })(n) },
  { a: 47.9, b: 52.68, vo: "Eleven were tank cars carrying hazardous materials, and three were breached. (PileFreeze)",
    node: (n) => <WP09_PileFreeze src={FS} from={24.6} freezeAt={1.4} n={n} zoom={1.45}
      pile={[[575, 425], [640, 470], [735, 500], [830, 545], [930, 600], [1030, 640], [1140, 665], [1230, 715], [1320, 775], [1445, 830]]}
      box={[880, 560, 1185, 690]} /> },
  { a: 52.68, b: 56.98, vo: "Those three were an older tank car design, the DOT one eleven, (night drone: burning tank cars)",
    node: (n) => V(MR2, 181.0, { s0: 1.0, s1: 1.1, fx: 0.55 })(n) },
  { a: 56.98, b: 61.27, vo: "which safety investigators had criticised for years for splitting open in derailments. (close hover over a burning tank car)",
    node: (n) => V(ET, 8.0, { s0: 1.06, s1: 1.16, fx: 0.42, fy: 0.45 })(n) },
  { a: 61.27, b: 64.13, vo: "The village ordered everyone within a mile to leave. (MileRing on the NAIP aerial)",
    node: (n) => <WP09_MileRing img={G + "naip.jpg"} W={2880} H={1920} site={[1440, 960]} r={644} n={n} /> },
  { a: 64.13, b: 69.62, vo: "On the 6th of February, five tank cars of vinyl chloride were deliberately vented and burned. (morning drone: smoke columns over the tank cars)",
    node: (n) => V(FS, 30.3, { s0: 1.6, s1: 1.78, fx: 0.78, fy: 0.72 })(n) },
  { a: 69.62, b: 72.76, vo: "This car was still burning the day after the derailment. (4 Feb hover)",
    node: (n) => <>{V(ET, 40.0, { s0: 1.0, s1: 1.08 })(n)}<RedLabel text="FEBRUARY 4, 2023" at={8} hold={F(2.2)} size={44} /></> },
  { a: 72.76, b: 76.01, vo: "The NTSB reported no deaths and no injuries. (night drone wide)",
    node: (n) => V(MR2, 240.5, { s0: 1.08, s1: 1.0 })(n) },
  { a: 76.01, b: 82.85, vo: "In June 2024, the NTSB found the vent and burn wasn't necessary to prevent a tank car failure. (hover, slow push)",
    node: (n) => V(ET, 20.0, { s0: 1.0, s1: 1.12, fx: 0.45 })(n) },
  { a: 82.85, b: 89.42, vo: "It said the decision rested on incomplete and misleading information from Norfolk Southern officials and contractors.",
    node: Two(V(MR, 110.0, { s0: 1.0, s1: 1.07 }), V(ET, 55.0, { s0: 1.1, s1: 1.18, fx: 0.6 }), 3.3) },
  { a: 89.42, b: 97.9, vo: "In September 2024, a judge gave final approval to a six hundred million dollar settlement for residents and businesses within twenty miles.",
    node: Two(V(MR2, 120.0, { s0: 1.0, s1: 1.08 }), V(MR, 228.0, { s0: 1.0, s1: 1.07 }), 4.2) },
  { a: 97.9, b: 99.87, vo: "The derailment was the accident. (night drone: close wall)",
    node: (n) => V(MR2, 262.0, { s0: 1.0, s1: 1.06 })(n) },
  { a: 99.87, b: 103.6, vo: "The fire everyone remembers was a choice. (the tank car burning, slow push)",
    node: (n) => V(ET, 62.0, { s0: 1.0, s1: 1.12, fy: 0.45 })(n) },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(47.9), kind: "blurDip", len: 14 },   // raw -> the morning drone freeze
  { at: F(61.27), kind: "glitch", len: 10 },   // into the map
  { at: F(64.13), kind: "blurDip", len: 12 },  // map -> three days later
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THIRTY EIGHT CARS" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* the raw's sound: real fire recording (two overlapping passes of the 12.3 s bed) + low wind, faded out before the VO */}
      {[[RAW[0], 0], [RAW[0] + 10.5, 1.5]].map(([at, off], i) => {
        const len = RAW[1] - 0.15 - at;
        return (
          <Sequence key={"f" + i} from={F(at)} durationInFrames={F(len)} layout="none">
            <Audio src={staticFile("case/media/sfx/fire_big_cc0.wav")} startFrom={F(off)} volume={(f) => dB(-3) * interpolate(f, [0, i ? 30 : 8, F(len) - 24, F(len)], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0] - 0.15)} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-20) * interpolate(f, [0, 10, 100, 120], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file) ~-16 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(103.6 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RAW[0] - 0.8 || t > RAW[1] + 0.6 ? 1 : t < RAW[0] ? (RAW[0] - t) / 0.8 : t > RAW[1] ? (t - RAW[1]) / 0.6 : 0;
          return dB(-16) * interpolate(t, [4.0, 5.0, 102.1, 103.6], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
