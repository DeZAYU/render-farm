// Workplace #07 — Mount Carbon, West Virginia, 16 Feb 2015 ~1:20 PM, snowstorm: a CSX train of 109 tank cars of Bakken crude derails
// on the Kanawha River's south bank at 33 mph; 27 cars off, ~20 leak, 14+ burn or explode, 13 fireballs over 10 hours, Boomer evacuated.
// Sources (all OK in SOURCES.csv): extra2 7IAB1rIqELY (Ryan Watson, 640x480 window view over snowy rooftops, family voices), main
// XwACBh1IWWw (Jpmcphail3, 480x854 portrait, long lens on the burning cars and a house, wind only), extra1 OXS4MvtMtX4 + extra3
// A7vUJdcCpxU (sheppybabythebarber, 608x1080 portrait, across the snowy field and river). RW's face-cam part (26 s on) is never used.
// Blender: maps/valley.mp4 (assets/valley.py: USGS 3DEP + NAIP, public domain, winter look), maps/railhead.mp4 (assets/railhead.py).
// VO = one take (CASE07.mp3) from 3.44 s ("Level two. Every one of these had a warning on file." is the level call, built separately),
// split once at the end of "...the railroad's own cold weather limit." ONE raw (VO 102 s > 70 s): RW 9.0-24.6, the fire on the far bank
// grows into the fireball over the rooftops, "Wow ... hey guys!". "Y'all looking at this sh-" (23.0-24.3) is faded out under the peak.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Tall, io } from "../dev/WP01_kit";
import { WP07_TwoFireballs } from "../dev/WP07_TwoFireballs";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/";
const RW = G + "rw.mp4", MC = G + "mc.mp4", SH = G + "sh.mp4", SH3 = G + "sh3.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(123.3);

// timeline (s): title 0-4 | VO A (3.44-25.67) @4.00 | RAW 26.23-41.83 (RW src 9.0-24.6) | VO B (25.67-end) @41.83, VO ends 121.95
const PART: [number, number, number | null][] = [[4.0, 3.44, 25.67], [41.83, 25.67, null]];
const RAW = { a: 26.23, b: 41.83, src: 9.0, g: -13, mute: [23.0, 24.3] as [number, number] };

const Render: React.FC<{ src: string }> = ({ src }) => (
  <AbsoluteFill style={{ background: "#000" }}><OffthreadVideo src={staticFile(src)} muted style={{ width: "100%", height: "100%" }} /></AbsoluteFill>
);

/** full-width crop of a portrait clip (608x1080): a landscape band centred at cy (0..1 of the picture height), slow push */
const Wide: React.FC<{ src: string; from: number; n: number; cy: [number, number]; s0?: number; s1?: number; fx?: number }> = ({ src, from, n, cy, s0 = 1.0, s1 = 1.06, fx = 0.5 }) => {
  const f = useCurrentFrame(); const u = io(f / n);
  const h = 1920 / (608 / 1080), y = cy[0] + (cy[1] - cy[0]) * u, s = s0 + (s1 - s0) * u;
  const top = Math.min(0, Math.max(1080 - h, 540 - y * h));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% 50%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={F(from)} muted style={{ position: "absolute", left: 0, top, width: 1920, height: h }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; grain?: boolean };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.84, vo: "Mount Carbon, West Virginia. February 2015. (across the snowy field and river, the smoke column)", grain: true,
    node: (n) => <><Tall src={SH3} from={20.0} n={n} s0={1.0} s1={1.07} fy={0.5} />
      <RedLabel text="MOUNT CARBON, WEST VIRGINIA" at={8} hold={F(1.7)} size={44} /><RedLabel text="FEBRUARY 16, 2015" at={F(2.05)} hold={F(1.5)} size={44} /></> },
  { a: 7.84, b: 11.61, vo: "It was about twenty past one in the afternoon, in a snowstorm. (window view over the snowy rooftops)", grain: true,
    node: (n) => <Shot_FX src={RW} from={1.5} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: 11.61, b: 20.23, vo: "A CSX train of 109 tank cars ... Bakken crude along the Kanawha River, and it came off the tracks. (Blender valley)",
    node: () => <Render src="case/maps/valley.mp4" /> },
  { a: 20.23, b: 26.23, vo: "It was doing 33 mph, under both the legal limit and the railroad's own cold weather limit. (SH wide, push)", grain: true,
    node: (n) => <Tall src={SH} from={40.0} n={n} s0={1.0} s1={1.12} fx={0.45} fy={0.55} /> },
  { a: 26.23, b: 41.83, vo: "RAW (main): the fire on the far bank grows into the fireball over the rooftops (RW 9.0-24.6)", grain: true,
    node: (n) => <Shot_FX src={RW} from={RAW.src} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.45} /> },
  { a: 41.83, b: 48.01, vo: "Twenty seven cars derailed. About twenty leaked, and at least fourteen caught fire or exploded. (SH full-width band on the fire)", grain: true,
    node: (n) => <Wide src={SH} from={100.0} n={n} cy={[0.5, 0.48]} s0={1.0} s1={1.1} fx={0.45} /> },
  { a: 48.01, b: 54.7, vo: "The first fireball ... and the last of thirteen came more than ten hours later. (TwoFireballs)",
    node: (n) => <WP07_TwoFireballs n={n} split={F(3.4)}
      a={{ src: RW, from: 19.0, rate: 0.5, w: 640, h: 480, fx: 0.62, fy: 0.42, s0: 1.08, s1: 1.22 }}
      b={{ src: MC, from: 30.8, rate: 0.75, w: 480, h: 854, fx: 0.5, fy: 0.42, s0: 1.0, s1: 1.1 }} /> },
  { a: 54.7, b: 59.06, vo: "A house near the tracks burned down, and at least one car went into the river. (MC: the house beside the fire)", grain: true,
    node: (n) => <Tall src={MC} from={8.0} n={n} s0={1.0} s1={1.1} fx={0.6} fy={0.45} /> },
  { a: 59.06, b: 64.21, vo: "The whole town of Boomer was evacuated, and two water treatment plants shut their intakes. (SH wide)", grain: true,
    node: (n) => <><Tall src={SH} from={200.0} n={n} s0={1.0} s1={1.08} fy={0.55} />
      <RedLabel text="BOOMER, WEST VIRGINIA" at={10} hold={F(3.0)} size={42} /></> },
  { a: 64.21, b: 68.48, vo: "Hundreds of families had to leave, and the fire burned for four days. (SH3 full-width band)", grain: true,
    node: (n) => <Wide src={SH3} from={120.0} n={n} cy={[0.42, 0.47]} s0={1.04} s1={1.1} fx={0.45} /> },
  { a: 68.48, b: 73.52, vo: "The Federal Railroad Administration found a broken rail with a vertical split in the rail head. (Blender rail head)",
    node: () => <><Render src="case/maps/railhead.mp4" /><RedLabel text="VERTICAL SPLIT HEAD" at={F(1.6)} hold={F(3.0)} size={42} /></> },
  { a: 73.52, b: 80.15, vo: "That defect had shown up in inspection data in December 2014, and again in January 2015. (MC: the fire column)", grain: true,
    node: (n) => <Tall src={MC} from={43.0} n={n} s0={1.0} s1={1.12} fx={0.5} fy={0.5} /> },
  { a: 80.15, b: 82.31, vo: "Nobody went out and checked it by hand. (SH3 wide)", grain: true,
    node: (n) => <Tall src={SH3} from={60.0} n={n} s0={1.0} s1={1.05} fy={0.55} /> },
  { a: 82.31, b: 86.71, vo: "These weren't old tank cars either. They were built to a newer industry standard from 2011, (MC: burning cars)", grain: true,
    node: (n) => <Tall src={MC} from={50.0} n={n} s0={1.02} s1={1.12} fx={0.5} fy={0.6} /> },
  { a: 86.71, b: 92.27, vo: "called CPC 1232, which was supposed to be the safer design. (SH, punched in)", grain: true,
    node: (n) => <><Wide src={SH} from={150.0} n={n} cy={[0.46, 0.5]} s0={1.0} s1={1.08} fx={0.45} />
      <RedLabel text="CPC-1232 TANK CARS" at={F(0.6)} hold={F(3.6)} size={42} /></> },
  { a: 92.27, b: 96.43, vo: "There's a second question with these trains, which is what's inside the cars. (SH3 wide)", grain: true,
    node: (n) => <Tall src={SH3} from={180.0} n={n} s0={1.0} s1={1.08} fy={0.55} /> },
  { a: 96.43, b: 101.54, vo: "In 2014, US regulators said Bakken crude from North Dakota tended to be more volatile (MC: the flames)", grain: true,
    node: (n) => <Tall src={MC} from={54.5} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: 101.54, b: 106.49, vo: "than other crude oils. The oil industry pushed back on parts of that claim. (SH, punched in)", grain: true,
    node: (n) => <Wide src={SH} from={250.0} n={n} cy={[0.38, 0.44]} s0={1.0} s1={1.06} fx={0.45} /> },
  { a: 106.49, b: 111.04, vo: "CSX said one person was treated for possible breathing problems. (SH3 wide)", grain: true,
    node: (n) => <Tall src={SH3} from={230.0} n={n} s0={1.0} s1={1.07} fy={0.55} /> },
  { a: 111.04, b: 116.71, vo: "CSX and its inspection contractor, Sperry, were each fined twenty five thousand dollars. (MC)", grain: true,
    node: (n) => <><Tall src={MC} from={15.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.55} />
      <RedLabel text="CSX · SPERRY RAIL SERVICE" at={10} hold={F(3.4)} size={42} /></> },
  { a: 116.71, b: 123.3, vo: "Two months of data pointed at the exact piece of steel that failed. Broken rail number three. (SH, slow pull back)", grain: true,
    node: (n) => <Tall src={SH} from={280.0} n={n} s0={1.25} s1={1.0} fx={0.45} fy={0.52} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(41.83), kind: "blurDip", len: 12 },  // raw -> later
  { at: F(64.21), kind: "blurDip", len: 12 },  // SH -> SH3 (same uploader) / four days later
  { at: F(68.48), kind: "glitch", len: 10 },   // into the investigation
  { at: F(116.71), kind: "blurDip", len: 14 }, // closing line
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FIREBALLS IN THE SNOW" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
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
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found), the swear under the fireball faded out, never under the VO */}
      <Sequence from={F(RAW.a)} durationInFrames={F(RAW.b) - F(RAW.a)} layout="none">
        <Audio src={staticFile("case/media/rw_clean.wav")} startFrom={F(RAW.src)} volume={(f) => {
          const t = RAW.src + f / 30, n = F(RAW.b - RAW.a);
          const mute = interpolate(t, [RAW.mute[0] - 0.12, RAW.mute[0], RAW.mute[1], RAW.mute[1] + 0.1], [1, 0, 0, 0.35], cl);
          return dB(RAW.g) * mute * interpolate(f, [0, 6, n - 14, n - 3], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18 LUFS file) at -16 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(123.3 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(5)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RAW.a - 0.8 || t > RAW.b + 0.6 ? 1 : t < RAW.a ? (RAW.a - t) / 0.8 : t > RAW.b ? (t - RAW.b) / 0.6 : 0;
          return dB(-16) * interpolate(t, [4.0, 5.0, 121.8, 123.3], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
