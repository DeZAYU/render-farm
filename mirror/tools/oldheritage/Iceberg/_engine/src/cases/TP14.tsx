// Theme Park #14 — Barakaldo, Carmen fiestas, 11 July 2015: a tower swing stops with twenty-two aboard, ~40-50 m up; aerial ladders
// take them off. Footage: Javier JOU's own clip from below (main: both ladders and baskets at the seats; its track is music -> muted),
// websmaster II (ex1: crowd, the ladder rising, the tower from the fair) and websmaster (ex2: the crown against cloud). ex1 and ex2
// carry no usable sound, main only music, so there is no clip-sound raw: the VO runs as one unsplit take and the footage carries it.
// Devices built for this case: DownRiver (IGN PNOA orthophoto: Bilbao -> downstream -> the exhibition centre) and LadderReach
// (Blender: the tower swing + an aerial ladder platform lifting its basket, with a 3-D-tracked height ruler, 40-50 m lit).
// Source cuts: none in any of the three clips (srccuts). ex1 42.0-43.0 exposure jump avoided.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { DownRiver } from "../dev/TP14_DownRiver";
import { LadderReach } from "../dev/TP14_LadderReach";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(107.9);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// river along the estuary (PNOA px, 3200x2200): Bilbao old town -> downstream (NW)
const RIVER: [number, number][] = [[2990, 2160], [3060, 1920], [3080, 1740], [3030, 1600], [2940, 1510], [2780, 1476], [2600, 1476], [2460, 1496], [2300, 1580], [2120, 1644], [1960, 1664], [1830, 1644], [1730, 1550], [1640, 1400], [1570, 1220], [1524, 1040], [1490, 860], [1456, 700], [1400, 500], [1344, 340], [1296, 190], [1264, 60]];

// VO take parts -> timeline (raws at every cut-sheet cue, in order): P1 take 0-23.3 @4.0 | R1 27.3-31.3 | P2 23.45-31.2 @31.3 | R2 39.05-43.05
// | P3 31.35-41.0 @43.05 | R3 52.7-57.7 | P4 41.15-49.6 @57.7 | R4 66.15-70.65 | P5 49.75-62.3 @70.65 | R5 83.2-87.2 | P6 62.45-65.0 @87.2
// | R6 89.75-93.75 | P7 65.15-end @93.75. No clip here has clean sound (ex1/ex2 silent, main = fair music incl. vocals even after
// rawclean --force), so the raws are short picture holds on the cue's moment with the music kept low and real wind.
const SHOTS: Sh[] = [
  { a: 4.0, b: 6.6, vo: "The ride had been running for exactly one day. (the crown against the cloud)", src: "ex2.mp4", from: 6.5, s0: 1.04, s1: 1.1, fx: 0.75, fy: 0.45 },
  { a: 6.6, b: 14.42, vo: "It was set up for the Carmen fiestas in Barakaldo, just downstream from Bilbao. The fairground sits beside the Bilbao Exhibition Centre. (DownRiver)",
    node: <DownRiver src={GR + "pnoa.jpg"} iw={3200} ih={2200} river={RIVER} traceAt={88} traceLen={48} site={[570, 440, 810, 710]} siteAt={192}
      cams={[{ at: 0, cx: 1600, cy: 1100, z: 1.0 }, { at: 140, cx: 1450, cy: 1000, z: 1.1 }, { at: 192, cx: 690, cy: 600, z: 3.0 }]}
      labels={[{ text: "BARAKALDO", x: 520, y: 330, at: 53, hold: 82 }, { text: "BILBAO", x: 2860, y: 1980, at: 90, hold: 45 }, { text: "BILBAO EXHIBITION CENTRE", x: 690, y: 790, at: 202 }]} /> },
  { a: 14.42, b: 18.41, vo: "At about eight in the evening on Saturday the 11th of July 2015, (the fair, the crowd looking up)", src: "ex1.mp4", from: 15.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6,
    over: <RedLabel text="JULY 11, 2015" at={F(1.9)} hold={F(1.9)} /> },
  { a: 18.41, b: 20.98, vo: "the ride stopped with twenty-two people aboard. (the seats, close)", src: "main.mp4", from: 50.0, s0: 1.36, s1: 1.42, fx: 0.42, fy: 0.12 },
  { a: 20.98, b: 23.4, vo: "Their seats were left hanging high over the fair.", src: "ex1.mp4", from: 80.0, s0: 1.04, s1: 1.1, fx: 0.3, fy: 0.3 },
  { a: 23.4, b: 27.3, vo: "At first, everyone on the ground could only look up and wait for the fire brigade.", src: "ex1.mp4", from: 45.5, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.75 },
  // RAW 1 (cue BW2 0:04-0:24): the stalled ride against the cloud, seats hanging at the top
  { a: 27.3, b: 31.3, vo: "RAW: the crown and the hanging seats", src: "ex2.mp4", from: 10.0, s0: 1.08, s1: 1.16, fx: 0.75, fy: 0.4 },
  { a: 31.3, b: 34.74, vo: "Reports put them somewhere around forty to fifty metres up, (LadderReach: the ruler, 40-50 M)",
    node: <LadderReach src={GR + "ladder.mp4"} from={0} rate={0.5} rulerAt={4} bandAt={36} /> },
  { a: 34.74, b: 37.8, vo: "and the Basque paper Deia said they were stuck for hours. (the crown, the ladder still far below)", src: "ex1.mp4", from: 100.0, s0: 1.05, s1: 1.1, fx: 0.3, fy: 0.4 },
  // "Then the brigade arrived." + RAW 2 (cue BW1 0:04-0:34): the ladder going up over the crowd and the stalls
  { a: 37.8, b: 43.05, vo: "Then the brigade arrived. + RAW 2 (the ladder rising over the crowd)", src: "ex1.mp4", from: 20.5, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.45 },
  { a: 43.05, b: 49.28, vo: "Their answer was an aerial ladder platform. That's a fire engine with a basket on the end of a long extending arm. (LadderReach: boom up to the seats)",
    node: <LadderReach src={GR + "ladder.mp4"} from={1.6} rate={0.706} rulerAt={0} bandAt={0} /> },
  // "They raised it beside the seats and took people off a few at a time." + RAW 3 (cue BK 0:00-0:30): both ladders at the seats
  { a: 49.28, b: 57.7, vo: "They raised it beside the seats and took people off a few at a time. + RAW 3 (the baskets at the seats)", src: "main.mp4", from: 2.0, s0: 1.22, s1: 1.34, fx: 0.55, fy: 0.14 },
  { a: 57.7, b: 63.21, vo: "If you're keeping count, nearly every stranding on this list ends with somebody waiting for one of those. (both ladders, whole)", src: "main.mp4", from: 30.0, s0: 1.02, s1: 1.1, fx: 0.55, fy: 0.3 },
  { a: 63.21, b: 66.15, vo: "First-aid crews were waiting at the bottom for each group. (the crowd at the base)", src: "ex1.mp4", from: 132.5, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.75 },
  // RAW 4 (cue BK 0:30-1:00): the ladder working at the top against the grey sky
  { a: 66.15, b: 70.65, vo: "RAW: the basket working at the top", src: "main.mp4", from: 36.0, s0: 1.2, s1: 1.26, fx: 0.55, fy: 0.15 },
  { a: 70.65, b: 74.18, vo: "Spain's summer fiesta season runs on travelling rides. (the fair's stalls)", src: "ex1.mp4", from: 24.0, s0: 1.12, s1: 1.18, fx: 0.7, fy: 0.85 },
  { a: 74.18, b: 76.93, vo: "The same machines go from town to town for months, (the crown, close)", src: "main.mp4", from: 45.0, s0: 1.32, s1: 1.38, fx: 0.4, fy: 0.1 },
  { a: 76.93, b: 81.1, vo: "put up in a few days, run hard every night, then packed away again.", src: "ex2.mp4", from: 15.0, s0: 1.03, s1: 1.09, fx: 0.75, fy: 0.5 },
  { a: 81.1, b: 83.2, vo: "That's a lot of nights for one machine.", src: "ex1.mp4", from: 110.0, s0: 1.06, s1: 1.1, fx: 0.3, fy: 0.35 },
  // RAW 5 (cue BK 1:00-1:30): the platform beside the hanging seats
  { a: 83.2, b: 87.2, vo: "RAW: the platform beside the hanging seats", src: "main.mp4", from: 62.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.25 },
  // "The basket came and went until the seats were empty." + RAW 6 (cue BK 1:30-1:48)
  { a: 87.2, b: 93.75, vo: "The basket came and went until the seats were empty. + RAW 6 (the basket at the seats)", src: "main.mp4", from: 90.0, s0: 1.24, s1: 1.32, fx: 0.55, fy: 0.15 },
  { a: 93.75, b: 97.36, vo: "No injuries were reported. The cause wasn't known that night,", src: "main.mp4", from: 100.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  { a: 97.36, b: 101.95, vo: "and as far as I can find it was never published. The reports don't even name the ride.", src: "ex1.mp4", from: 120.0, s0: 1.04, s1: 1.1, fx: 0.3, fy: 0.4 },
  { a: 101.95, b: 107.9, vo: "The ride leaves when the fiestas end, the story gets one headline, and the cause never makes the paper.", src: "ex1.mp4", from: 50.0, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.6 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(6.6), kind: "whip", len: 10 },       // into the map
  { at: F(14.42), kind: "blurDip", len: 12 },  // map -> the fair
  { at: F(23.4), kind: "blurDip", len: 12 },   // ex1 -> ex1
  { at: F(31.3), kind: "zoomHit", len: 10 },   // into the model
  { at: F(34.74), kind: "blurDip", len: 10 },
  { at: F(37.8), kind: "blurDip", len: 10 },   // ex1 -> ex1
  { at: F(43.05), kind: "blurDip", len: 12 },  // back into the model
  { at: F(57.7), kind: "blurDip", len: 12 },   // main -> main
  { at: F(87.2), kind: "blurDip", len: 12 },   // main -> main
  { at: F(93.75), kind: "blurDip", len: 12 },  // main -> main
  { at: F(101.95), kind: "glitch", len: 8 },
]

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [6.55, "sfx_n2/whoosh_01.wav", -28],
  [12.95, "sfx_n2/whoosh_03.wav", -32],     // the dive onto the exhibition centre
  [20.98, X + "wind_gust_1.wav", -30],      // high over the fair
  [27.3, X + "wind_gust_1.wav", -26],       // raw 1: up at the seats
  [31.25, "sfx_n2/whoosh_02.wav", -30],
  [39.2, X + "wind_gust_1.wav", -30],       // raw 2
  [43.75, X + "metal_clank_1.wav", -30],    // the boom sections running out
  [46.15, X + "metal_clank_3.wav", -32],
  [48.45, X + "metal_clank_2.wav", -30],    // the basket at the seats
  [53.0, X + "metal_clank_4.wav", -34],     // raw 3: basket against the seat frame
  [66.2, X + "wind_gust_1.wav", -28],       // raw 4
  [83.25, X + "wind_gust_1.wav", -30],      // raw 5
  [90.0, X + "metal_clank_1.wav", -34],     // raw 6
  [101.9, "sfx_n2/glitch_03.wav", -30],
]

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWENTY-TWO OVER THE FIESTAS" bg={GR + "title.jpg"} pos="75% 50%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only at the cut sheet's raw cues */}
      {([[4.0, 0, 23.3], [31.3, 23.45, 31.2], [43.05, 31.35, 41.0], [57.7, 41.15, 49.6], [70.65, 49.75, 62.3], [87.2, 62.45, 65.0]] as const).map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(93.75)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(65.15)} /></Sequence>
      {/* music: Epidemic ambient (Music 1), whole case, lifted a touch in the raws (no clip sound to make room for) */}
      <Sequence from={F(3.6)} durationInFrames={F(107.9) - F(3.6)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(18)} volume={(f) => {
          const t = f / 30 + 3.6; const up = [[27.3, 31.3], [39.05, 43.05], [52.7, 57.7], [66.15, 70.65], [83.2, 87.2], [89.75, 93.75]].reduce((m, [a, b]) => Math.max(m, Math.min(1, Math.max(0, Math.min(t - a, b - t) / 0.6))), 0) * 0.4 + 1;
          return dB(-15) * up * interpolate(f, [0, 30, F(101.9), F(104.2)], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed holds 4 and 5 (inside the travelling-fiesta explanation). 6 -> 4 holds (silent source).
const _cut = cutOut(CompFull, DUR, [[66.15, 70.65], [83.2, 87.2]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
