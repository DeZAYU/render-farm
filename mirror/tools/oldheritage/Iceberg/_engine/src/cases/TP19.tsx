// Theme Park #19 — the Coney Island Arcade fire, W 12th St & the Bowery, Brooklyn, Wed 5 May 2010 (COLD OPEN: starts on the clip).
// Footage: [CI] main = the filmer's own dusk upload (h8mwU21rqh8, 640x480, 83 s; source cuts 0.83/0.97/71.37), [CS] ex1 = a second
// filmer's phone at night from beside the raised walkway (5AaKiz7zNFU, 640x480 ~12 fps; cuts 43.3-53.7 cluster, 62.59, 65.35, 76.38,
// 83.40, 191.44). Both upscaled (lanczos 1440x1080) and graded --house. Raw sound = rawclean.py output (main_clean / ex1_clean), never
// the clips' own tracks. Raws: cold open, R2, one merged 24 s main raw (cues CS 1:36 + 2:06), R6; the VO is never split mid-paragraph. Devices: BlockBack (NYS 2008 orthophoto in 3-D, boardwalk
// -> arcade, Wonder Wheel), VoidCut (2.5-D cutaway: shutter, ceiling, the burning gap, the two cuts; once), RoofLift
// (2008 -> 2012 orthophotos, the arcade's roof plate lifts away). Wonder Wheel photo: Rhododendrites, CC BY-SA 4.0 (Commons).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { VoidCut } from "../dev/TP19_VoidCut";
import { BlockBack } from "../dev/TP19_BlockBack";
import { RoofLift } from "../dev/TP19_RoofLift";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(156.2);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO take (no count word: the case opens on the clip), split ONLY at paragraph ends (owner rule 3 Nov), four raws:
// R1 4.0-15.0 (cold open) | V1 take 0-21.57 @15.0 ("...hadn't even started.") | R2 36.57-45.57 | V2 21.57-47.56 @45.57 ("...hoses were on it.")
// | MAIN RAW 71.56-95.56 | V3 47.56-57.46 @95.56 ("...just as well.") | R6 105.46-115.46 | V4 57.46-96.98 @115.46 -> ends 154.98, hold to 156.2
const VO: [number, number, number | null][] = [[15, 0, 21.57], [45.57, 21.57, 47.56], [95.56, 47.56, 57.46], [115.46, 57.46, null]];

const SHOTS: Sh[] = [
  // RAW 1 (cold open, cue CI 0:02-0:32): flames over the roofline, the crowd, the aerial ladder going up; runs on under the first line
  { a: 4, b: 19.77, vo: "RAW 1 + It's about eight in the evening on Wednesday the 5th of May 2010, in Coney Island.", src: "main.mp4", from: 1.7, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.38,
    over: <RedLabel text="MAY 5, 2010" at={F(11.4)} hold={F(3.6)} /> },
  { a: 19.77, b: 23.5, vo: "The first fire trucks are pulling up at West 12th Street and the Bowery. (bucket + red lights)", src: "main.mp4", from: 60.0, s0: 1.04, s1: 1.1, fx: 0.3, fy: 0.45,
    over: <RedLabel text="W 12TH ST & THE BOWERY" at={F(1.4)} hold={F(2.0)} /> },
  { a: 23.5, b: 27.25, vo: "The building pouring smoke from its roof is the Coney Island Arcade.", src: "main.mp4", from: 29.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.42,
    over: <RedLabel text="CONEY ISLAND ARCADE" at={F(1.5)} hold={F(2.0)} /> },
  { a: 27.25, b: 31.32, vo: "It sits a block back from the boardwalk, right behind Deno's Wonder Wheel. (BlockBack)",
    node: <BlockBack src={GR + "o08.jpg"} arcade={[1400, 370, 1556, 492]} walk={[[1322, 1650], [1322, 505], [1400, 488]]} wheel={[1555, 1072, 1825, 1148]} boardwalk={[1240, 1700]}
      t={{ box: 4, bw: 40, walk: 40, wheel: 80 }} /> },
  { a: 31.32, b: 34.41, vo: "That wheel has turned on the corner since 1920. (Commons photo)", src: "wheel.jpg", still: true, s0: 1.05, s1: 1.13, fx: 0.55, fy: 0.4 },
  { a: 34.41, b: 36.57, vo: "The summer season hadn't even started. (the crowd, phones up)", src: "main.mp4", from: 17.0, s0: 1.06, s1: 1.11, fx: 0.4, fy: 0.5 },
  // RAW 2 (cue CI 0:44-1:14): firefighters on the sidewalk, the flames behind them
  { a: 36.57, b: 45.57, vo: "RAW 2: firefighters at the shutters, flames above", src: "main.mp4", from: 41.3, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  // V2 = one paragraph (take 21.57-47.56, "The FDNY dispatch log ..." -> "By now the hoses were on it."), no raw inside it
  { a: 45.57, b: 49.75, vo: "The FDNY dispatch log called it a suspicious fire in a vacant structure,", src: "ex1.mp4", from: 84.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 49.75, b: 54.25, vo: "heavy fire on arrival. It wasn't vacant. Manny Cohen was running it,", src: "main.mp4", from: 53.0, s0: 1.04, s1: 1.09, fx: 0.45, fy: 0.55 },
  { a: 54.25, b: 57.81, vo: "and he wasn't even in the country, he was at a trade expo in China.", src: "main.mp4", from: 35.0, s0: 1.1, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 57.81, b: 65.63, vo: "And the fire was burning in the gap between the roof and the ceiling. To reach it, firefighters had to cut through the metal shutters and then the roof itself. (VoidCut)",
    node: <VoidCut mode="cut" bg={GR + "main.mp4"} bgFrom={56.0} t={{ xray: 18, fire: 40, lRoof: 62, lCeil: 78, cut1: 160, cut2: 196 }} /> },
  { a: 65.63, b: 69.8, vo: "It went to two alarms. More than a hundred firefighters responded.", src: "main.mp4", from: 77.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.6 },
  { a: 69.8, b: 71.56, vo: "By now the hoses were on it. (hose stream)", src: "main.mp4", from: 50.6, s0: 1.08, s1: 1.12, fx: 0.4, fy: 0.55 },
  // MAIN RAW (cut-sheet cues CS 1:36 + 2:06, merged): flames under the hose streams, blur-dip, then the flames at their strongest (24 s)
  { a: 71.56, b: 77.56, vo: "MAIN RAW a: flames and hose streams", src: "ex1.mp4", from: 94.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 77.56, b: 95.56, vo: "MAIN RAW b: flames at their strongest, then the smoke", src: "ex1.mp4", from: 128.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  // V3 (take 47.56-57.46): the shutters
  { a: 95.56, b: 98.55, vo: "Those shutters are a big part of why this took so long.", src: "main.mp4", from: 22.5, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.62 },
  { a: 98.55, b: 102.07, vo: "An arcade closed for the night locks itself up behind steel,", src: "ex1.mp4", from: 30.0, s0: 1.08, s1: 1.03, fx: 0.5, fy: 0.6 },
  { a: 102.07, b: 105.46, vo: "which keeps people out and keeps firefighters out just as well.", src: "main.mp4", from: 64.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },
  // RAW 6 (cue CS 2:41-3:11): dense smoke, the hose streams
  { a: 105.46, b: 115.46, vo: "RAW 6: dense smoke and hose streams", src: "ex1.mp4", from: 161.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  // V4 (take 57.46-end): the outcome
  { a: 115.46, b: 117.76, vo: "They had it under control by 10:40.", src: "ex1.mp4", from: 200.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 117.76, b: 120.08, vo: "Three firefighters had minor injuries,", src: "main.mp4", from: 80.2, s0: 1.05, s1: 1.1, fx: 0.55, fy: 0.62 },
  { a: 120.08, b: 122.9, vo: "the only firefighters hurt in any of the fires here.", src: "ex1.mp4", from: 118.5, s0: 1.08, s1: 1.13, fx: 0.4, fy: 0.7 },
  { a: 122.9, b: 127.59, vo: "The arcade kept two cats, Target and Targette, and Targette didn't make it out.", src: "ex1.mp4", from: 14.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 127.59, b: 131.07, vo: "The cause was still under investigation when the reports were written,", src: "main.mp4", from: 19.3, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.35 },
  { a: 131.07, b: 133.83, vo: "and I couldn't find a finding published after that.", src: "main.mp4", from: 38.2, s0: 1.08, s1: 1.03, fx: 0.5, fy: 0.35 },
  { a: 133.83, b: 138.77, vo: "A witness told a local blog, Amusing the Zillion, that workers had been tarring the roof earlier that day. (the roof burning)", src: "ex1.mp4", from: 150.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 138.77, b: 142.58, vo: "Nobody official ever said that was the cause.", src: "ex1.mp4", from: 184.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 142.58, b: 147.69, vo: "The building's owner, Jeff Persily, had the burned shell taken down in the spring of 2011. (RoofLift 2008 -> 2012)",
    node: <RoofLift before={GR + "o08.jpg"} after={GR + "o12.jpg"} foot={[1400, 370, 1556, 492]} liftAt={86} swapAt={124} beforeLabel="2008" afterLabel="2012" /> },
  { a: 147.69, b: 150.96, vo: "Everything anyone outside could see was the roof and the street. (roof + street, dusk)", src: "main.mp4", from: 25.6, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 150.96, b: 156.2, vo: "The real fight was happening out of sight, in that gap above the ceiling. (0.5x replay of the main raw's flames) + 1.2 s hold",
    src: "ex1_slow.mp4", from: 0.5, s0: 1.14, s1: 1.24, fx: 0.55, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4), kind: "glitch", len: 10 },
  { at: F(19.77), kind: "blurDip", len: 12 },   // main -> main
  { at: F(23.5), kind: "blurDip", len: 12 },
  { at: F(27.25), kind: "zoomHit", len: 10 },   // into the aerial
  { at: F(36.57), kind: "blurDip", len: 12 },   // main -> main (raw 2)
  { at: F(54.25), kind: "blurDip", len: 12 },
  { at: F(57.81), kind: "glitch", len: 8 },     // into the cutaway
  { at: F(77.56), kind: "blurDip", len: 14 },   // inside the main raw: later in the same phone clip
  { at: F(115.46), kind: "blurDip", len: 12 },  // ex1 -> ex1
  { at: F(122.9), kind: "blurDip", len: 12 },
  { at: F(131.07), kind: "blurDip", len: 12 },
  { at: F(138.77), kind: "blurDip", len: 12 },
  { at: F(142.58), kind: "glitch", len: 10 },   // a year later
  { at: F(150.96), kind: "blurDip", len: 16 },  // into the slow replay
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -26],
  [57.76, "sfx_n2/glitch_01.wav", -28],
  [57.81 + 176 / 30, X + "metal_clank_2.wav", -24],   // the shutter flap hits the street
  [57.81 + 212 / 30, X + "metal_clank_4.wav", -28],   // the roof panel comes away
  [142.53, "sfx_n2/glitch_03.wav", -28],
  [142.58 + 92 / 30, X + "metal_clank_1.wav", -30],   // the roof plate lifts
];

// raws: [timeline a, b, file, source s at a, gain dB] (gains put each raw ~ -21 LUFS against the -26 LUFS take; master -> -16)
const RAWS: [number, number, string, number, number][] = [
  [3.4, 15, "main_clean.wav", 1.1, -9.5],
  [36.57, 45.57, "main_clean.wav", 41.3, -16],
  [71.56, 77.9, "ex1_clean.wav", 94.0, -10],
  [77.4, 95.56, "ex1_clean.wav", 127.84, -2.5],
  [105.46, 115.46, "ex1_clean.wav", 161.0, -4],
];

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title={"THE\u00A0ARCADE BEHIND\u00A0THE\u00A0WONDER\u00A0WHEEL"} bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the raws play */}
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 == null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + file)} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 1), out under every raw, back for the VO */}
      <Sequence from={F(3.0)} durationInFrames={DUR - F(3.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 3.0; const duck = RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
          return dB(-15) * interpolate(f, [0, 30, DUR - F(3.0) - 60, DUR - F(3.0) - 2], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed RAW 6 (after the shutters explanation; near-dup of the main hose raw). 5 -> 4 raws.
const _cut = cutOut(CompFull, DUR, [[105.46, 115.46]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
