// Workplace #10 — Silver Eagle refinery, Woods Cross, Utah, 4 Nov 2009: a 10-inch pipe at the bottom of a reactor ruptures, the
// hydrogen cloud ignites, the blast wave damages 100+ homes. Footage: U.S. CSB surveillance camera CAM 006 (public domain, silent;
// cropped 640x360 to drop the letterbox + "CSB / CAM 006" burn-in), a neighbour's video of the January 12 2009 fire (fwcprodutions,
// 49 subs, C0ZR-NfCw7U), a CSB photo inside the refinery (Jan 2009). VO = one take (CASE10.mp3), split once at the main raw.
// Raw = the camera's last quiet seconds -> the fireball -> the blast shaking the camera -> fire (src 19.2-33.0, 13.8 s), silent CCTV
// so real SFX timed to the picture (gas hiss, boom at the flash, fire bed). Devices: BlastHold, WallShave; Blender: place + blast wave.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl, io } from "../dev/WP45_kit";
import { useWpFonts } from "../dev/WP01_kit";
import { BlastHold } from "../dev/WP10_BlastHold";
import { WallShave } from "../dev/WP10_WallShave";
import { PLACE, BLAST } from "../dev/WP10_blLabels";

const C = "case/", M = C + "graded/main.mp4", J = C + "graded/jan.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(87.2);

const Credit: React.FC<{ text: string; at?: number; hold?: number }> = ({ text, at = 10, hold = 80 }) => {
  useWpFonts(); const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 10, at + hold, at + hold + 10], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 56, bottom: 40, fontFamily: "Elite", fontSize: 24, color: "rgba(242,242,240,.78)", opacity: o, textShadow: "0 2px 6px rgba(0,0,0,.9)" }}>{text}</div>;
};
const Photo: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

// timeline (s): title 0-4 | VO part 1 (take 0-28.4) @4.0 | RAW 32.4-46.2 (src 19.2-33.0) | VO part 2 (take 28.6-end) @46.2, ends 86.1
const PART: [number, number, number | null][] = [[4.0, 0, 28.4], [46.2, 28.6, null]];
const RAW: [number, number] = [32.4, 46.2];
const IGN = 32.4 + (24.39 - 19.2); // the flash on the timeline

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.85, vo: "Silver Eagle refinery, Woods Cross, Utah. November 2009.",
    node: (n) => <><Clip src={M} from={0.7} n={n} s0={1.0} s1={1.06} />
      <RedLabel text="SILVER EAGLE REFINERY · WOODS CROSS, UTAH" at={8} hold={F(2.2)} size={44} /><RedLabel text="NOVEMBER 4, 2009" at={F(2.98)} hold={F(1.6)} size={44} />
      <Credit text="SURVEILLANCE CAMERA · U.S. CHEMICAL SAFETY BOARD" at={12} hold={110} /></> },
  { a: 8.85, b: 14.6, vo: "Woods Cross is a small city just north of Salt Lake, and the refinery sits right next to a neighbourhood. (Blender place)",
    node: () => <BlenderShot src={C + "maps/place.mp4"} track={PLACE} labels={[["ref", "THE REFINERY", 24, 70, -0.08], ["homes", "WOODS CROSS HOMES", 112, 52, -0.06]]} /> },
  { a: 14.6, b: 18.6, vo: "On the 4th of November, a pipe on the unit called a hydrotreater ruptured. (push to the unit)",
    node: (n) => <Clip src={M} from={6.0} n={n} s0={1.12} s1={1.38} fx={0.44} fy={0.32} /> },
  { a: 18.6, b: 21.0, vo: "That cloud is hydrogen. (tight on the haze round the towers)",
    node: (n) => <Clip src={M} from={10.3} n={n} s0={1.32} s1={1.42} fx={0.38} fy={0.38} /> },
  { a: 21.0, b: 26.0, vo: "A hydrotreater strips sulfur out of fuel ... high pressure and high temperature. (CSB photo inside the refinery)",
    node: (n) => <><Photo src={C + "graded/inv.jpg"} n={n} s0={1.02} s1={1.12} fx={0.42} fy={0.32} />
      <RedLabel text="INSIDE THE REFINERY · JANUARY 2009" at={10} hold={F(2.6)} size={40} />
      <Credit text="PHOTO · U.S. CHEMICAL SAFETY BOARD" at={14} hold={110} /></> },
  { a: 26.0, b: 32.4, vo: "So when a pipe on one fails, it doesn't leak slowly. It lets go, and hydrogen needs almost nothing to ignite.",
    node: (n) => <Clip src={M} from={12.6} n={n} s0={1.0} s1={1.2} fx={0.45} fy={0.4} /> },
  { a: 32.4, b: 46.2, vo: "RAW: last quiet seconds -> the fireball (src 24.4) -> blast shakes the camera -> fire (src 19.2-33.0)",
    node: (n) => <Clip src={M} from={19.2} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.45} /> },
  { a: 46.2, b: 50.75, vo: "Four workers were knocked off their feet, and none of them was seriously hurt. (BlastHold)",
    node: (n) => <BlastHold src={M} t0={23.75} peak={24.75} n={n} hold={30} box={[0.56, 0.18, 0.84, 0.66]} /> },
  { a: 50.75, b: 57.47, vo: "The blast wave carried on into the neighbourhood ... one was pushed off its foundation. (Blender blast wave)",
    node: () => <BlenderShot src={C + "maps/blast.mp4"} track={BLAST} labels={[]} /> },
  { a: 57.47, b: 65.5, vo: "In 2014 the CSB found the pipe wall had corroded down to 0.039 in. No record of it ever being checked. (WallShave)",
    node: (n) => <WallShave src={M} t={58.0} n={n} fx={0.55} fy={0.5} line="The segment that failed was found to have a wall thickness as low as 0.039-inch."
      hi="0.039-inch" credit="U.S. CHEMICAL SAFETY BOARD · APRIL 2014" /> },
  { a: 65.5, b: 69.69, vo: "It wasn't even the refinery's first serious fire that year.",
    node: (n) => <Clip src={M} from={82.0} n={n} s0={1.18} s1={1.06} fx={0.5} fy={0.42} /> },
  { a: 69.69, b: 76.0, vo: "In January, a vapour cloud from a naphtha tank had flashed into a fire, and four workers were badly hurt. (neighbour's video)",
    node: (n) => <><Clip src={J} from={0.5} n={n} s0={1.0} s1={1.12} fx={0.55} fy={0.4} />
      <RedLabel text="WOODS CROSS · JANUARY 12, 2009" at={10} hold={F(2.4)} size={44} /><Credit text="A NEIGHBOUR'S VIDEO" at={14} hold={120} /></> },
  { a: 76.0, b: 81.1, vo: "Corrosion is slow, which means there were years in which a single inspection would have found it.",
    node: (n) => <Clip src={M} from={70.0} n={n} s0={1.02} s1={1.14} fx={0.42} fy={0.45} /> },
  { a: 81.1, b: 87.2, vo: "Three years later, the same failure turned up in a much bigger refinery in California. (pull out, the smoke)",
    node: (n) => <Clip src={M} from={94.0} n={n} s0={1.14} s1={1.0} fx={0.45} fy={0.4} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(18.6), kind: "blurDip", len: 10 },  // same camera, a tighter window
  { at: F(32.4), kind: "blurDip", len: 12 },  // VO -> raw
  { at: F(46.2), kind: "blurDip", len: 14 },  // raw -> the replay
  { at: F(65.5), kind: "blurDip", len: 12 },  // the frozen frame -> the camera later
  { at: F(81.1), kind: "blurDip", len: 14 },  // later still
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE WHITE CLOUD" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw: silent CCTV -> real SFX timed to the picture */}
      <Sequence from={F(RAW[0])} durationInFrames={F(IGN - RAW[0]) + 4} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} loop volume={(f) => dB(-22) * interpolate(f, [0, 30, F(IGN - RAW[0]) - 2, F(IGN - RAW[0]) + 4], [0, 1, 1.3, 0], cl)} />
      </Sequence>
      <Sequence from={F(IGN) - 1} durationInFrames={F(5)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-3)} /></Sequence>
      <Sequence from={F(IGN) - 1} durationInFrames={F(3)} layout="none"><Audio src={staticFile("sfx_n2/real/impact_2.wav")} volume={dB(-9)} /></Sequence>
      <Sequence from={F(IGN)} durationInFrames={F(4)} layout="none"><Audio src={staticFile("sfx_n2/real/sub_drop_1.wav")} volume={dB(-12)} /></Sequence>
      <Sequence from={F(IGN) + 4} durationInFrames={F(RAW[1] - IGN) - 4} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-9) * interpolate(f, [0, 20, F(RAW[1] - IGN) - 30, F(RAW[1] - IGN) - 6], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 5 (-20 LUFS file) at -13 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(87.2 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(18)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-13) * interpolate(t, [4.0, 5.0, 85.6, 87.2], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
