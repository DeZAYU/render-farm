// Workplace #06 — Columbus, Ohio, 11 Jul 2012 ~2 AM: a Norfolk Southern freight (98 cars) derails where the line passes Fifth Avenue
// (Weinland Park / Italian Village); a punctured ethanol car feeds the fire, two more ethanol cars blow apart, ~1 mile evacuated.
// Sources (all OK in SOURCES.csv): main rA84gZA-myg (PowerUniversal, 640x480, street-level, with voices), extra1 aMNDM0qLVSs
// (Commodore Crush, rooftop skyline 1080p, wind only; its own title 0-9 s is never used), extra2 XqMxM92efxE (sethld87, 320x240
// close flames through trees, silent). Blender: maps/col_A.mp4 + col_B.mp4 (assets/columbus.py, USGS NAIP, public domain).
// VO = one take (CASE06.mp3, 61.8 s < 70 s, so two raws per WP_PLAN), split only at the two raws (both at sentence ends).
// RAW1 = main 0.2-10.3 (the glow down the street, "you can hear a crackling, it's not getting better, it's getting worse");
// RAW2 = main 44.7-56.4 (main raw: zoom out to the fire as it builds, "that's like real big ... keeps burning more").
// The filmers' swearing (main ~12.0-12.8, ~29.0-30.6) is outside both raws. Raw audio = rawclean.py output (no music found).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { WP06_LampFade } from "../dev/WP06_LampFade";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/";
const MAIN = G + "main.mp4", CC = G + "cc.mp4", SE = G + "se.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(89.0);

// timeline (s): title 0-4 | VO A (0-19.64) @4.00 | RAW1 23.64-33.74 | VO B (19.64-25.47) @33.74 | RAW2 39.57-51.27 |
// VO C (25.47-end) @51.27, VO ends 87.64, hold to 89.0
const PART: [number, number, number | null][] = [[4.0, 0, 19.64], [33.74, 19.64, 25.47], [51.27, 25.47, null]];
const RAWS: { a: number; b: number; src: number; g: number }[] = [
  { a: 23.64, b: 33.74, src: 0.2, g: 6 },
  { a: 39.57, b: 51.27, src: 44.7, g: -2 },
];

/** Blender render, full frame (no grade: rendered in the night look) */
const Render: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#000" }}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%" }} /></AbsoluteFill>
);

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; grain?: boolean };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.87, vo: "Two in the morning, Columbus, Ohio. July 2012. (rooftop view over the city, the fire on the skyline)", grain: true,
    node: (n) => <><Shot_FX src={CC} from={12.0} n={n} s0={1.04} s1={1.12} fx={0.42} fy={0.42} />
      <RedLabel text="COLUMBUS, OHIO" at={8} hold={F(1.6)} size={44} /><RedLabel text="JULY 11, 2012" at={F(2.0)} hold={F(1.5)} size={44} /></> },
  { a: 7.87, b: 15.33, vo: "Around Fifth Avenue and Fourth Street ... people woke to an orange glow behind the streetlights. (LampFade)",
    node: (n) => <><WP06_LampFade src={MAIN} from={56.5} rate={0.72} n={n} glow={[305, 222]} fy={0.42} out0={0.4} out1={0.82}
      lamps={[[505, 50, 46], [360, 195, 26], [245, 212, 16], [602, 228, 13]]} />
      <RedLabel text="FIFTH AVENUE · WEINLAND PARK" at={10} hold={F(3.2)} size={42} /></> },
  { a: 15.33, b: 23.64, vo: "A Norfolk Southern freight train of 98 cars ... north of downtown ... Seventeen of its cars had come off the track. (Blender A)",
    node: () => <Render src="case/maps/col_A.mp4" /> },
  { a: 23.64, b: 33.74, vo: "RAW 1: the glow down the street, 'you can hear a crackling ... it's getting worse' (main 0.2-10.3)", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={0.2} n={n} s0={1.0} s1={1.06} fx={0.45} fy={0.4} /> },
  { a: 33.74, b: 36.06, vo: "One car was punctured and spilled ethanol, (close flames through the trees)", grain: true,
    node: (n) => <Shot_FX src={SE} from={1.0} n={n} fill s0={1.0} s1={1.06} fx={0.4} fy={0.35} /> },
  { a: 36.06, b: 39.57, vo: "and the ethanol fed the fire. Then the explosions started. (main, zoomed on the fire)", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={13.0} n={n} s0={1.05} s1={1.16} fx={0.5} fy={0.45} /> },
  { a: 39.57, b: 51.27, vo: "RAW 2 (main): zoom out, the fire builds, 'that's like real big ... keeps burning more' (main 44.7-56.4)", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={44.7} n={n} s0={1.0} s1={1.05} fx={0.47} fy={0.45} /> },
  { a: 51.27, b: 54.12, vo: "Two more ethanol cars caught fire and blew apart, (the close flames flare up)", grain: true,
    node: (n) => <Shot_FX src={SE} from={7.0} n={n} fill s0={1.02} s1={1.1} fx={0.38} fy={0.3} /> },
  { a: 54.12, b: 60.42, vo: "and everyone within about a mile was told to leave. About a hundred residents were evacuated ... (Blender B: 1-mile ring)",
    node: () => <Render src="case/maps/col_B.mp4" /> },
  { a: 60.42, b: 64.28, vo: "According to the Columbus Dispatch, there was styrene on that train as well,", grain: true,
    node: (n) => <><Shot_FX src={CC} from={22.0} n={n} s0={1.1} s1={1.2} fx={0.35} fy={0.4} />
      <RedLabel text="THE COLUMBUS DISPATCH" at={10} hold={F(2.6)} size={40} /></> },
  { a: 64.28, b: 67.63, vo: "and it never caught. That part rarely gets mentioned. (main, zoomed)", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={39.6} n={n} s0={1.08} s1={1.16} fx={0.55} fy={0.5} /> },
  { a: 67.63, b: 70.07, vo: "The NTSB counted two people injured.", grain: true,
    node: (n) => <Shot_FX src={SE} from={15.0} n={n} fill s0={1.0} s1={1.05} fx={0.45} fy={0.35} /> },
  { a: 70.07, b: 77.11, vo: "Its probable cause, issued in 2014, was a broken rail, with the damage put at one point two million dollars.", grain: true,
    node: (n) => <Shot_FX src={CC} from={40.0} n={n} s0={1.0} s1={1.16} fx={0.3} fy={0.38} /> },
  { a: 77.11, b: 82.64, vo: "Ethanol has a reputation as the clean fuel, and a tank car of it is still an enormous amount of fuel. (main, zoomed)", grain: true,
    node: (n) => <Shot_FX src={MAIN} from={18.0} n={n} s0={1.04} s1={1.15} fx={0.5} fy={0.5} /> },
  { a: 82.64, b: 89.0, vo: "Two of them going up was enough to empty a neighbourhood. That's broken rail number two. (rooftop wide, slow pull)", grain: true,
    node: (n) => <Shot_FX src={CC} from={56.0} n={n} s0={1.14} s1={1.0} fx={0.32} fy={0.4} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.33), kind: "blurDip", len: 12 }, // street -> the night aerial
  { at: F(39.57), kind: "blurDip", len: 12 }, // main zoomed -> raw 2 (same camera)
  { at: F(54.12), kind: "blurDip", len: 12 }, // footage -> the ring
  { at: F(60.42), kind: "blurDip", len: 12 }, // the ring -> rooftop
  { at: F(64.28), kind: "blurDip", len: 10 }, // rooftop -> street camera (dark-to-dark cut read as a jump)
  { at: F(70.07), kind: "blurDip", len: 12 }, // into the NTSB finding
  { at: F(77.11), kind: "glitch", len: 10 },  // the closing thought
  { at: F(82.64), kind: "blurDip", len: 14 }, // closing line (main -> rooftop)
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWO IN THE MORNING" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
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
      {/* VO: one take, split only where the two raws play */}
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found), never under the VO */}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(r.a)} durationInFrames={F(r.b) - F(r.a)} layout="none">
          <Audio src={staticFile("case/media/main_clean.wav")} startFrom={F(r.src)} volume={(f) => dB(r.g) * interpolate(f, [0, 6, F(r.b - r.a) - 14, F(r.b - r.a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (-12 LUFS file) at -22 dB, ducked under both raws */}
      <Sequence from={F(4.0)} durationInFrames={F(89.0 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, { a, b }) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
          return dB(-22) * interpolate(t, [4.0, 5.0, 87.6, 89.0], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
