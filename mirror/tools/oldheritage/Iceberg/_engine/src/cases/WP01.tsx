// Workplace #01 — White Farms, Switz City, Indiana, 31 Jul 2017 ~1 PM: an overhead load-out tank full of corn leaks, its steel frame
// buckles, it drops, and the grain dust flashes. One source: cptnwiz (147 subs, the filmer's family farm), fmrxFcTTv-c, 202x360 portrait
// (upscaled to 608x1080, graded --house --nonorm). No other personal-channel angle exists (only Daily Mail / TV: not used).
// VO = one take (CASE01.mp3) from 3.22 s ("Level one. Nobody on these sites was lost." is the level call, left to the level card),
// split only at the two raws. v2 (owner 4 Nov, niche rule + WP_PLAN budget VO + ~19 s): PourClock / LoadPath / DustFlash / FallFlash removed;
// the clip stays big (full height or full-width crops, layouts alternated); devices work ON the footage: LegPunch, ClaimReplay.
// v3 (4 Nov, Blender rule): LoadTrace (lines on a frozen frame) replaced by a Blender shot over the same VO span (maps/loadout3d.py).
// R1 = the filmer's "it's buckling the frame of the superstructure" (src 58.5-67.2, 8.7 s); R2 = main raw, the pour surging -> drop ->
// flash (src 103.0-116.25, 13.25 s; cut on the flash before the camera swings to the ground), replayed at 0.5x under "according to the farm".
// Swearing in the source (~35.6 s, ~71 s) is outside both raws. Raw audio = rawclean.py output (no music found).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Tall, io } from "../dev/WP01_kit";
import { LegPunch } from "../dev/WP01_LegPunch";
import { BlenderShot } from "../dev/WP45_kit";
import { NLO } from "../dev/WP01_blLabels";
import { ClaimReplay } from "../dev/WP01_ClaimReplay";

const F = (s: number) => Math.round(s * 30);
const C = "case/", M = C + "graded/main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(80.3);

/** full-width crop of the portrait clip: cy = centre of the band (0..1 of the picture height), slow push / tilt */
const Crop: React.FC<{ from: number; n: number; cy: [number, number]; s0?: number; s1?: number; fx?: number }> = ({ from, n, cy, s0 = 1.0, s1 = 1.06, fx = 0.5 }) => {
  const f = useCurrentFrame(); const u = io(f / n);
  const h = 1920 / (608 / 1080), y = cy[0] + (cy[1] - cy[0]) * u, s = s0 + (s1 - s0) * u;
  const top = Math.min(0, Math.max(1080 - h, 540 - y * h));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% 50%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(M)} startFrom={F(from)} muted style={{ position: "absolute", left: 0, top, width: 1920, height: h }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// timeline (s): title 0-4 | A (VO 3.22-17.97) @4.00 | R1 18.75-27.45 (src 58.5-67.2) | B (VO 17.97-35.58) @27.45 |
// R2 45.06-58.31 (src 103.0-116.25) | C (VO 35.58-end) @58.31, VO ends 79.26, hold to 80.3
const PART: [number, number, number | null][] = [[4.0, 3.22, 17.97], [27.45, 17.97, 35.58], [58.31, 35.58, null]];
const RAWS: [number, number, number, number][] = [[18.75, 27.45, 58.5, -9], [45.06, 58.31, 103.0, -11]]; // timeline a, b, src s, gain dB

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.22, vo: "White Farms, Switz City, Indiana. July 2017. (the tank leaking, full height)",
    node: (n) => <><Tall src={M} from={1.0} n={n} s0={1.0} s1={1.07} fy={0.6} />
      <RedLabel text="WHITE FARMS · SWITZ CITY, INDIANA" at={8} hold={F(2.0)} size={44} /><RedLabel text="JULY 31, 2017" at={F(2.55)} hold={F(1.4)} size={44} /></> },
  { a: 8.22, b: 11.6, vo: "At about one in the afternoon on Monday the 31st, (full-width: tilt down the elevator legs to the tank)",
    node: (n) => <Crop from={8.0} n={n} cy={[0.2, 0.42]} s0={1.04} s1={1.04} /> },
  { a: 11.6, b: 14.82, vo: "an overhead tank full of corn started emptying out of its side. (full height, push into the pour)",
    node: (n) => <Tall src={M} from={30.0} n={n} s0={1.02} s1={1.3} fx={0.36} fy={0.7} /> },
  { a: 14.82, b: 18.75, vo: "Before long, the people nearby could see the steel underneath it buckling. (LegPunch: freeze, x2 onto the bent frame)",
    node: () => <LegPunch src={M} from={98.8} freeze={30} box={[0.38, 0.58, 0.68, 0.79]} zoom={2.0} /> },
  { a: 18.75, b: 27.45, vo: "RAW 1: 'It's buckling the frame of the superstructure, knocking the tin off the superstructure' (src 58.5-67.2)",
    node: (n) => <Tall src={M} from={58.5} n={n} s0={1.0} s1={1.22} fx={0.45} fy={0.78} /> },
  { a: 27.45, b: 34.96, vo: "A tank like this sits up on legs so a truck can drive underneath and load from above. All the weight ... steel structure. (Blender loadout: truck rolls under, corn pours, near wall ghosts to show the corn over the legs)",
    node: () => <BlenderShot src={C + "maps/loadout.mp4"} track={NLO} labels={[]} /> },
  { a: 34.96, b: 38.46, vo: "Grain dust is the part farm safety people worry about most. (full-width: the pour, dust off the stream)",
    node: (n) => <Crop from={76.0} n={n} cy={[0.66, 0.7]} s0={1.0} s1={1.08} fx={0.35} /> },
  { a: 38.46, b: 41.48, vo: "It's the fine powder that comes off corn when it moves. (full height, push into the pour)",
    node: (n) => <Tall src={M} from={90.0} n={n} s0={1.1} s1={1.35} fx={0.45} fy={0.64} /> },
  { a: 41.48, b: 45.06, vo: "When enough of it hangs in the air, it can flash in an instant. (full-width: the haze round the tank, the pour heavier)",
    node: (n) => <Crop from={97.5} n={n} cy={[0.6, 0.66]} s0={1.0} s1={1.1} fx={0.45} /> },
  { a: 45.06, b: 58.31, vo: "RAW 2 (main): the pour surges, 'There it goes', the tank drops, the flash (src 103.0-116.25)",
    node: (n) => <Tall src={M} from={103.0} n={n} s0={1.0} s1={1.16} fx={0.45} fy={0.72} /> },
  { a: 58.31, b: 67.61, vo: "According to the farm, the tank struck a power line ... lit the dust. No agency report backs that up ... (ClaimReplay: 0.5x replay into the flash)",
    node: () => <ClaimReplay src={M} t0={113.2} freezeAt={180} words={[61, 135]} rule={126} doubt={156} credit="THE FILMER'S POST · YOUTUBE · JULY 31, 2017" /> },
  { a: 67.61, b: 71.99, vo: "Nobody was hurt. Farm safety trainers now use this collapse as a lesson. (the tank down in its own corn, full height)",
    node: (n) => <Tall src={M} from={139.0} n={n} s0={1.0} s1={1.1} fy={0.75} /> },
  { a: 71.99, b: 75.05, vo: "They spend more time on the flash at the end than on the fall. (full-width: the cloud over the yard)",
    node: (n) => <Crop from={121.0} n={n} cy={[0.5, 0.55]} s0={1.0} s1={1.08} fx={0.45} /> },
  { a: 75.05, b: 80.3, vo: "The flash is the part that has cost lives in grain elevators again and again. (full height, the cloud settling, slow push)",
    node: (n) => <Tall src={M} from={126.0} n={n} s0={1.0} s1={1.12} fx={0.5} fy={0.6} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(18.75), kind: "blurDip", len: 12 },  // punched-in freeze -> raw 1 (earlier in the clip)
  { at: F(27.45), kind: "blurDip", len: 14 },  // raw -> Blender loadout
  { at: F(34.96), kind: "blurDip", len: 12 },  // out of Blender -> footage
  { at: F(58.31), kind: "blurDip", len: 14 },  // raw -> the replay
  { at: F(67.61), kind: "blurDip", len: 12 },  // later: the tank down
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE TANK THAT FOLDED" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
      {/* VO: one take, split only where the two raws play */}
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output, never under the VO */}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3 (-14 LUFS file), ~-20 dB, ducked under both raws */}
      <Sequence from={F(4.0)} durationInFrames={F(80.3 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-20) * interpolate(t, [4.0, 5.0, 78.8, 80.3], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
