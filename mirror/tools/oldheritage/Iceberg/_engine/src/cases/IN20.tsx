// Incidents #20 — Mt Futago (west peak), Ogano, Saitama, 1 Oct 2022 ~8:50 a.m.: a solo climber down-climbing the rock ridge is charged by
// an adult Asiatic black bear (a mother, cub nearby), dodges the first lunge, then hammer-fists and front-kicks it until it retreats.
// Source: the climber's own GoPro (channel "Bear attacks climber", fxJ-zAgJzt4, 1920x1080 30 fps), his watermark kept, credited.
// Skipped: title cards 0:02-0:14, his WARNING HIGH VOLUME card 0:55-1:01. Sound: rawclean.py (no music); the screaming is lowered.
// VO = one take (CASE20.mp3), split only at the two raws (sentence ends):
//   A 0-27.51 @4.00 (the clip runs from src 62.0 at 30.22 into RAW 1) | R1 31.90-57.22 (src 63.68-89.0: he turns into the sun, the
//   bear comes down at him, the fight on the rock, the bear goes off below) | B 27.51-58.61 @57.62 | R2 89.12-97.12 (src 89.0-97.0:
//   straight after, on the rock) | C 58.61-end @97.52, VO ends 118.97, hold to 120.0.
// Device: SecondLunge (both attacks side by side at half speed). Still: Mt Futago west peak from the east peak, Wikimedia Commons
// "東岳から西岳を望む.jpg", Koda6029, CC BY-SA 4.0 (credit in the description). Slow motion from a motion-interpolated 60 fps copy.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { Credit, Still } from "../dev/IN16_kit";
import { SecondLunge } from "../dev/IN20_SecondLunge";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4", SL = GR + "slow60.mp4", S0 = 67.5; // slow60 = src 67.5-80.0 at 60 fps
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(120.0);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 12.64, vo: "A climber in his forties was alone on Mount Futago, west of Tokyo, on October 1, 2022, and it was his third time on the route. (the west peak from the east peak)",
    node: (n) => <Still src={GR + "ridge.jpg"} n={n} s0={1.02} s1={1.14} fx={0.33} fy={0.45} />,
    over: <><RedLabel text="MOUNT FUTAGO, JAPAN" at={F(1.6)} hold={F(2.8)} /><RedLabel text="OCTOBER 1, 2022" at={F(4.7)} hold={F(3.2)} /></> },
  { a: 12.64, b: 20.26, vo: "Just before nine, he was down-climbing the rocky ridge below the west peak, with long drops on both sides and a GoPro on his head.",
    node: (n) => <Cam src={M} from={14.8} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} />, over: <Credit text="FOOTAGE: BEAR ATTACKS CLIMBER" at={F(0.6)} hold={F(5.0)} top /> },
  { a: 20.26, b: 25.02, vo: "His bear bell rattles nonstop on rock, so he'd silenced it for the descent.",
    node: (n) => <Cam src={M} from={30.0} keys={K(n, [1.1, 0.5, 0.55], [1.18, 0.48, 0.55])} /> },
  { a: 25.02, b: 30.22, vo: "About 160 feet below the summit, he heard heavy, animal snorting from above.",
    node: (n) => <Cam src={M} from={40.0} keys={K(n, [1.12, 0.5, 0.5], [1.04, 0.5, 0.5])} /> },
  // runs on into RAW 1 (src = timeline + 31.78)
  { a: 30.22, b: 57.22, vo: "He turned around. | RAW 1 (src 63.68-89.0)", node: (n) => <Cam src={M} from={62.0} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  { a: 57.62, b: 61.04, vo: "A full-grown black bear was coming straight down the rock at him. (0.5x: the bear out of the sun)",
    node: (n) => <Cam src={SL} from={67.9 - S0} rate={0.5} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.5, 0.45])} /> },
  { a: 61.04, b: 66.34, vo: "Where do you go on a ridge like that? Nowhere, because one wrong step means a fall. (the ridge and the drop below him)",
    node: (n) => <Cam src={M} from={98.0} keys={K(n, [1.15, 0.5, 0.5], [1.03, 0.5, 0.55])} /> },
  { a: 66.34, b: 73.26, vo: "He twisted away from the first lunge, and the bear slid past him, then scrambled back up and came at him again from below. (SecondLunge)",
    node: (n) => <SecondLunge src={SL} a={68.3 - S0} b={72.7 - S0} splitAt={150} holdA={30} n={n} focusA={0.68} focusB={0.5} /> },
  { a: 73.26, b: 79.27, vo: "He said that instead of fear, he switched to the feeling that if it was coming, he had no choice but to face it. (climbing on)",
    node: (n) => <Cam src={M} from={106.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
  { a: 79.27, b: 82.74, vo: "He screamed the whole time and brought his fist down on it like a hammer. (0.5x)",
    node: (n) => <Cam src={SL} from={73.0 - S0} rate={0.5} keys={K(n, [1.15, 0.5, 0.55], [1.3, 0.5, 0.6])} /> },
  { a: 82.74, b: 88.72, vo: "Then came a front kick, and about 20 seconds after it started, the bear crashed off into the bushes below. (0.5x: the bear going down)",
    node: (n) => <Cam src={SL} from={76.5 - S0} rate={0.5} keys={K(n, [1.1, 0.5, 0.5], [1.3, 0.45, 0.45])} /> },
  // RAW 2: straight after, on the rock
  { a: 88.72, b: 97.52, vo: "RAW 2 (src 89.0-97.0)", node: (n) => <Cam src={M} from={88.6} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 97.52, b: 101.13, vo: "I don't think I'd have kept my footing up there, let alone hit back.", node: (n) => <Cam src={M} from={120.0} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.5, 0.55])} /> },
  { a: 101.13, b: 105.26, vo: "Going back through the footage, he decided it'd been a mother with a cub nearby. (the slope below)",
    node: (n) => <Cam src={M} from={128.5} keys={K(n, [1.12, 0.5, 0.5], [1.04, 0.5, 0.5])} /> },
  { a: 105.26, b: 112.02, vo: "He says he came away with scraped, cut hands from gripping the rock and a slightly sprained wrist, both minor. (his hands on the rock)",
    node: (n) => <Cam src={M} from={134.0} keys={K(n, [1.05, 0.5, 0.55], [1.15, 0.5, 0.6])} /> },
  { a: 112.02, b: 120.0, vo: "Rather than carry on down toward where the bear had gone, he climbed back up to the summit, took a breather and went down the way he'd come.",
    node: (n) => <Cam src={M} from={158.0} keys={K(n, [1.12, 0.5, 0.45], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 }, { at: F(12.64), kind: "glitch", len: 10 },
  ...[20.26, 25.02, 30.22, 61.04, 66.34, 73.26, 79.27, 82.74, 101.13, 105.26, 112.02].map((s) => ({ at: F(s), kind: "blurDip" as const, len: 10 })),
  { at: F(57.62), kind: "blurDip", len: 14 }, { at: F(88.72), kind: "blurDip", len: 12 }, { at: F(97.52), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 27.51], [57.62, 27.51, 58.61], [97.52, 58.61, null]];
const RAWS: [number, number, number, number, number][] = [[31.9, 57.22, 63.68, -5, 0.1], [89.12, 97.12, 89.0, 0, 0.15]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE BEAR ON THE RIDGE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (~-21 dB, ~10 LU under the VO), ducked under the raws */}
      <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => {
        const t = f / 30;
        const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
        return dB(-21) * interpolate(t, [3.6, 5.0, 118.4, 120.0], [0, 1, 1, 0], cl) * duck;
      }} />
      <Sequence from={F(3.95)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
      <Sequence from={F(12.6)} layout="none"><Audio src={staticFile("sfx_n2/glitch_01.wav")} volume={dB(-30)} /></Sequence>
      <Sequence from={F(71.2)} layout="none"><Audio src={staticFile("sfx_n2/whoosh_01.wav")} volume={dB(-32)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
