// Incidents #16 — Lake Champlain, 10 Aug 2024 ~8:45 a.m.: Bassmaster Elite pro Wes Logan's boat hits something under the surface at ~50 mph
// (believed to be storm-loosened dock, never confirmed); the outboard tears off, the boat spins, he is thrown across the deck.
// One source: his own deck camera (Wes Logan Fishing, VS_-5q_V1y8, 1920x1080 59.94 fps -> 30 fps), 0:00-1:30. No source cuts.
// Its sound: wind/engine to 1:15, then his phone call ("I'm hurt really bad… my motor broke off the boat… in the middle of the lake").
// rawclean.py: no music. VO = one take (CASE16.mp3), split only at the two raws (both at sentence ends):
//   A 0-27.64 @4.00 (the clip itself starts at 22.88 from src 0 and runs on into RAW 1 without a cut) | R1 31.84-53.88 (src 8.96-31.0:
//   the run, the hit at src 14.1, the spin, Logan up holding his head) | B 27.64-42.64 @54.40 | R2 69.80-81.30 (src 74.8-86.3: the call)
//   | C 42.64-end @81.70, VO ends 100.72, hold to 101.5.
// Devices: SaidLater (real Bassmaster page, his account lifted), BlindWater (frozen frame before the hit, colour kept on the empty water).
// Stills: EOX Sentinel-2 cloudless 2020 (CC BY 4.0, contains modified Copernicus Sentinel data 2020).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { Credit, Still } from "../dev/IN16_kit";
import { SaidLater } from "../dev/IN16_SaidLater";
import { BlindWater } from "../dev/IN16_BlindWater";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(101.5);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 10.75, vo: "The Bassmaster Elite tournament on Lake Champlain was running a day late, because a storm had torn across the lake the day before. (Sentinel-2: the lake between Plattsburgh and the islands)",
    node: (n) => <Still src={GR + "lake.jpg"} n={n} s0={1.0} s1={1.16} fx={0.52} fy={0.55} />, over: <RedLabel text="LAKE CHAMPLAIN, NEW YORK" at={F(1.6)} hold={F(4.6)} /> },
  { a: 10.75, b: 22.88, vo: "It was August 10, 2024, and Wes Logan, ... four bass in the boat ... Around a quarter to nine, he was running ... at about 50 miles an hour, (SaidLater)",
    node: () => <SaidLater bg={M} bgFrom={40} page={GR + "bass.png"} pw={2560} ph={4800} crop={[360, 940, 2200, 3760]}
      keys={[{ f: 0, x: 1180, y: 1180, z: 0.78, rx: 24 }, { f: 62, x: 1180, y: 1200, z: 0.8, rx: 23 }, { f: 104, x: 1280, y: 2080, z: 0.6, rx: 17 },
        { f: 222, x: 1270, y: 2140, z: 0.62, rx: 16 }, { f: 268, x: 1240, y: 3630, z: 1.02, rx: 8 }]}
      lines={[[631.7, 3552.1, 1862.6, 3600.1], [616, 3608.2, 827.2, 3656.2], [1164, 3664.3, 1433.1, 3712.3]]} litAt={262} />,
    over: <><RedLabel text="AUGUST 10, 2024" at={F(0.4)} hold={F(2.0)} /><RedLabel text="WES LOGAN" at={F(2.55)} hold={F(2.8)} /></> },
  // the deck camera from its first frame, running on into RAW 1 (src = timeline - 22.88)
  { a: 22.88, b: 53.88, vo: "his deck camera rolling. The sky's clear now ... For about fifteen seconds, it's just the bow and the spray. | RAW 1",
    node: (n) => <Cam src={M} from={0} keys={[{ f: 0, s: 1.12, x: 0.55, y: 0.55 }, { f: F(8.6), s: 1.04, x: 0.5, y: 0.5 }, { f: F(9.4), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 54.4, b: 63.36, vo: "\"I don't really know what happened,\" he said later. The best guess is a piece of dock ... though nobody's confirmed it. (BlindWater, frozen src 13.6)",
    node: (n) => <BlindWater src={M} t={13.6} slow={GR + "slow60.mp4"} slowT={0.6} n={n} spot={[0.3, 0.66, 0.2, 0.17]} drainAt={20} releaseAt={F(7.4)}
      keys={[{ f: 0, s: 1.05, x: 0.5, y: 0.5 }, { f: F(7.2), s: 1.55, x: 0.33, y: 0.62 }, { f: n, s: 1.6, x: 0.33, y: 0.62 }]} /> },
  { a: 63.36, b: 69.4, vo: "Whatever it was, it tore the engine off the back of the boat, and a safety leash kept it from flipping in on top of him. (0.5x: the spin)",
    node: (n) => <Cam src={GR + "slow60.mp4"} from={2.0} rate={0.5} keys={K(n, [1.25, 0.5, 0.55], [1.45, 0.55, 0.6])} /> },
  // RAW 2: on the phone, slumped at the console
  { a: 69.4, b: 81.7, vo: "RAW 2 (src 74.4-86.7)", node: (n) => <Cam src={M} from={74.4} keys={K(n, [1.25, 0.72, 0.62], [1.4, 0.74, 0.62])} /> },
  { a: 81.7, b: 86.8, vo: "An ambulance met him at the shore. He needed stitches to his face, and his ribs were cracked. (wide at the console -> in on him bent over)",
    node: (n) => <Cam src={M} from={44.0} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 40, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.9, x: 0.78, y: 0.6 }]} /> },
  { a: 86.8, b: 94.72, vo: "I'm pretty sure most people would've called it a day right there. Wes Logan got clear scans ... back out on the water. (tight on him slumped, easing back to the lake)",
    node: (n) => <Cam src={M} from={58.0} keys={[{ f: 0, s: 2.0, x: 0.8, y: 0.62 }, { f: 70, s: 2.0, x: 0.8, y: 0.62 }, { f: n, s: 1.05, x: 0.55, y: 0.45 }]} /> },
  { a: 94.72, b: 101.5, vo: "He caught his fifth bass, about three pounds, and climbed from around 85th place to 60th. (the open lake off the bow)",
    node: (n) => <Cam src={M} from={66.5} keys={K(n, [1.08, 0.35, 0.4], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(10.75), kind: "blurDip", len: 12 },  // into the page
  { at: F(22.88), kind: "blurDip", len: 12 },  // out of the page onto the deck camera
  { at: F(54.4), kind: "blurDip", len: 14 },   // raw -> frozen frame
  { at: F(63.36), kind: "blurDip", len: 10 },
  { at: F(69.4), kind: "blurDip", len: 10 },
  { at: F(81.7), kind: "blurDip", len: 12 },
  { at: F(86.8), kind: "blurDip", len: 10 },
  { at: F(94.72), kind: "blurDip", len: 10 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 27.64], [54.4, 27.64, 42.64], [81.7, 42.64, null]];
const RAWS: [number, number, number, number, number][] = [[31.84, 53.88, 8.96, 0, 0.12], [69.8, 81.3, 74.8, 3, 0.12]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [10.78, "sfx_n2/real/paper_2.wav", -26], [54.4, "sfx_n2/whoosh_01.wav", -32], [61.8, "sfx_n2/real/reverse_swell_1.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE LAKE AFTER THE STORM" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
          <Sequence from={F(22.88)} durationInFrames={F(6)} layout="none"><Credit text="FOOTAGE: WES LOGAN FISHING" at={F(0.6)} hold={F(4.5)} /></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws */}
      <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(12)} volume={(f) => {
        const t = f / 30;
        const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
        return dB(-19) * interpolate(t, [3.6, 5.0, 99.8, 101.5], [0, 1, 1, 0], cl) * duck;
      }} />
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
