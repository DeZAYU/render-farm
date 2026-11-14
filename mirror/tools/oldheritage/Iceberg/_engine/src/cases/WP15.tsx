// Workplace #15 — Southwest Industrial Gases, 538 S. Industrial Blvd, Dallas, 25 Jul 2007 ~9:30 AM: a fire in a yard of acetylene
// cylinders; they burst for at least half an hour, burning pieces land on the interstates (I-30 / I-35E shut), half-mile evacuation.
// Footage: snoblic's telephoto (SyUVswUkEIA, 396x220 15 fps, SILENT -> upscaled lanczos 1296x720 before the grade), pfdtx's view from
// high downtown (3mbsA14Y2TU, 640x480, Reunion Arena + Tower in shot -> 1280x960), txocicat's phone through a chain-link fence
// (kKRYhXZSRmM, 192x144 7.4 fps -> 768x576, used once as the Inset). VO = one take (CASE15.mp3), split once at the main raw.
// Raw = the telephoto at the height of the bursts (src 19.5-33.5, 14 s), silent -> real SFX on the fireball onsets (src 22.72, 24.72,
// 30.92, 33.2) over a fire bed. Devices: Blender cylinder cutaway (filler + acetone, then heat), LaunchArcs, TwoVersions.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { LaunchArcs } from "../dev/WP15_LaunchArcs";
import { TwoVersions } from "../dev/WP15_TwoVersions";
import { CYL } from "../dev/WP15_blLabels";

const C = "case/", SW = C + "graded/sw.mp4", PF = C + "graded/pf.mp4", TX = C + "graded/tx.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 102.4;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-9.87) @4.0 | RAW 13.87-27.87 (SW src 19.5-33.5) | VO part 2 (take 9.87-end) @27.87, ends 101.29
const PART: [number, number, number | null][] = [[4.0, 0, 9.87], [27.87, 9.87, null]];
const RAW: [number, number] = [13.87, 27.87];
const R0 = 19.5; // raw source start
const BOOMS: [number, string, number][] = [[22.72, "boom_4", -4], [24.72, "boom_2", -3], [30.92, "boom_5", -3], [33.2, "boom_4", -6]]; // src s, file, dB

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.42, vo: "Southwest Industrial Gases, Dallas. July 2007. (high downtown view: the yard burning by the freeway)",
    node: (n) => <><Clip src={PF} from={12.0} n={n} s0={1.02} s1={1.12} fx={0.46} fy={0.55} />
      <RedLabel text="SOUTHWEST INDUSTRIAL GASES · DALLAS, TEXAS" at={8} hold={F(1.9)} size={44} /><RedLabel text="JULY 25, 2007" at={F(2.5)} hold={F(1.6)} size={44} /></> },
  { a: 8.42, b: 13.87, vo: "Around nine thirty in the morning, a fire started in a yard full of gas cylinders near downtown. (Reunion Tower in shot)",
    node: (n) => <><Clip src={PF} from={47.0} n={n} s0={1.0} s1={1.04} fx={0.0} fy={0.5} />
      <RedLabel text="DOWNTOWN DALLAS" at={F(3.6)} hold={F(1.6)} size={40} y={0.88} /></> },
  { a: 13.87, b: 27.87, vo: "RAW: the telephoto on the yard, fireballs rolling up as cylinders burst (src 19.5-33.5, silent + SFX)",
    node: (n) => <Clip src={SW} from={R0} n={n} s0={1.0} s1={1.1} fx={0.58} fy={0.55} /> },
  { a: 27.87, b: 30.9, vo: "Those are acetylene cylinders. (tight on the burning cylinders)",
    node: (n) => <Clip src={SW} from={60.0} n={n} s0={1.28} s1={1.4} fx={0.58} fy={0.66} /> },
  { a: 30.9, b: 34.23, vo: "Acetylene is the gas in a welding torch, and under pressure on its own it's unstable. (high view, a burst)",
    node: (n) => <Clip src={PF} from={22.0} n={n} s0={1.2} s1={1.3} fx={0.46} fy={0.56} /> },
  { a: 34.23, b: 41.3, vo: "So inside each cylinder, it's dissolved in acetone and packed into a porous filler. Even then, heat them enough and they burst. (Blender cutaway)",
    node: () => <BlenderShot src={C + "maps/cyl.mp4"} track={CYL} labels={[["acetone", "ACETONE", 66, 60, 0.0], ["filler", "POROUS FILLER", 92, 66, 0.0]]} /> },
  { a: 41.3, b: 43.5, vo: "They kept going for at least half an hour. (wide, smoke, bursts)",
    node: (n) => <Clip src={SW} from={200.0} n={n} s0={1.04} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: 43.5, b: 50.24, vo: "Burning pieces landed on the interstates, in parking lots and on businesses nearby, and about a dozen cars were damaged. (LaunchArcs)",
    node: (n) => <LaunchArcs src={PF} t={4.0} n={n} fire={[296, 272]}
      roads={[[[290, 152], [200, 222], [130, 278], [60, 335], [12, 374]], [[345, 304], [430, 301], [500, 297], [560, 293], [592, 300], [606, 322], [614, 352]]]}
      arcs={[{ to: [205, 219], at: 14, h: 120 }, { to: [512, 296], at: 24, h: 150 }, { to: [118, 288], at: 36, h: 190, dur: 32 }, { to: [418, 301], at: 46, h: 90 },
        { to: [395, 266], at: 66, h: 80 }, { to: [160, 268], at: 74, h: 110 }, { to: [386, 306], at: 90, h: 70 }, { to: [588, 299], at: 100, h: 170, dur: 32 },
        { to: [470, 336], at: 116, h: 120 }, { to: [235, 262], at: 128, h: 70 }]} /> },
  { a: 50.24, b: 54.98, vo: "Parts of two interstates were shut, and everything within half a mile was evacuated. (wide: the freeway beside the smoke)",
    node: (n) => <Clip src={SW} from={335.0} n={n} s0={1.08} s1={1.0} fx={0.3} fy={0.5} /> },
  { a: 54.98, b: 61.94, vo: "At least three people were hurt, the facility's manager, a worker and a truck driver, and two of them were in serious condition. (Inset: through the fence)",
    node: () => <Inset src={TX} from={1.0} box={0.6} ar={4 / 3} /> },
  { a: 61.94, b: 66.51, vo: "Cylinders that have been through a fire can stay dangerous for hours after it looks finished. (a fireball rolls up)",
    node: (n) => <Clip src={SW} from={150.5} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.45} /> },
  { a: 66.51, b: 71.3, vo: "That's why fire crews cool them from a distance for a long time before anyone walks up. (later, the smoke)",
    node: (n) => <Clip src={SW} from={420.0} n={n} s0={1.1} s1={1.02} fx={0.45} fy={0.5} /> },
  { a: 71.3, b: 76.3, vo: "The CSB sent a team. The same kind of delivery trailer, (high view)",
    node: (n) => <Clip src={PF} from={88.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: 76.3, b: 81.62, vo: "from the same gas supplier, seemed to have been involved in another acetylene fire that summer, at The Woodlands in Texas.",
    node: (n) => <Clip src={SW} from={480.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: 81.62, b: 93.44, vo: "There are two versions of why. Lavender: a malfunctioning connector ... The son: a broken valve on a delivery truck. (TwoVersions)",
    node: (n) => <TwoVersions src={SW} t={46.0} n={n} split={8} turnA={F(65.45 - 63.62)} turnB={F(71.55 - 63.62)} settle={n - 24}
      a={{ focus: [0.58, 0.66], zoom: 1.7, tag: "FIRE LT. JOEL LAVENDER", line: "“a malfunctioning connector”", at: F(65.45 - 63.62) + 6 }}
      b={{ focus: [0.82, 0.66], zoom: 1.7, tag: "AN INJURED MAN'S SON", line: "“a broken valve on a delivery truck”", at: F(71.55 - 63.62) + 6 }} /> },
  { a: 93.44, b: END, vo: "No final finding settles it, so a yard of cylinders spent half an hour launching itself over a freeway, and officially nobody knows why.",
    node: (n) => <Clip src={PF} from={97.0} n={n} s0={1.16} s1={1.0} fx={0.55} fy={0.6} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(13.87), kind: "blurDip", len: 12 },  // VO -> raw
  { at: F(27.87), kind: "blurDip", len: 14 },  // raw -> same camera, later
  { at: F(34.23), kind: "glitch", len: 10 },   // into the Blender cutaway
  { at: F(41.3), kind: "blurDip", len: 12 },   // out of it
  { at: F(81.62), kind: "blurDip", len: 12 },  // into the frozen frame
  { at: F(93.44), kind: "blurDip", len: 14 },  // out of it
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FLYING CYLINDERS" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw: the telephoto is silent -> fire bed + real booms on the fireball onsets */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-8) * interpolate(f, [0, 12, F(RAW[1] - RAW[0]) - 24, F(RAW[1] - RAW[0]) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {BOOMS.map(([t, file, g], i) => {
        const at = RAW[0] + (t - R0); const left = RAW[1] - at;
        return (
          <Sequence key={"b" + i} from={F(at) - 1} durationInFrames={F(Math.min(4, left))} layout="none">
            <Audio src={staticFile(`sfx_n2/real/${file}.wav`)} volume={(f) => dB(g) * interpolate(f, [0, F(Math.min(4, left)) - 8, F(Math.min(4, left))], [1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      <Sequence from={F(RAW[0] + (24.72 - R0)) - 1} durationInFrames={F(3)} layout="none"><Audio src={staticFile("sfx_n2/real/metal_clank_2.wav")} volume={dB(-14)} /></Sequence>
      {/* music: Epidemic ambient Music 4 (-12 LUFS file) at -22 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-22) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
