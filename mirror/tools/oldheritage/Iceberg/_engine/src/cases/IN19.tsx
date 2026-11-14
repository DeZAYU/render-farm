// Incidents #19 — Angora, Southwest Philadelphia, 2 Jan 2019: investors walking an empty row house find a line across a glass-strewn stair;
// pulled with a pole, it drops an upside-down crutch with a knife taped to it, which swings down to head/neck height. Nobody hurt.
// One source: Ekrem Uysaler's vertical phone video via a re-upload (Marc Z, C3BNFKDZ9Vk, 480x848 -> 612x1080), 0:00-1:20, no edits.
// Shown full height over its own blurred copy (Tall). Sound: the men talking (whisper checked); rawclean.py: no music; swearing muted.
// VO = one take (CASE19.mp3), split only at the two raws (sentence ends):
//   A 0-24.60 @4.00 (the clip runs from src 12.59 at 26.59 straight on into RAW 1) | R1 29.00-36.40 (src 15.0-22.4: "look at this wall…
//   look at the knife… see the knife?") | B 24.60-38.29 @36.80 (the clip runs from src 31.0 at 45.53 into RAW 2) | R2 50.89-64.53
//   (src 36.36-50.0: "at the step", the line pulled, the crutch swings down at src 40.3, the knife hanging) | C 38.29-end @64.93, VO ends 96.96.
// Privacy (outline): the man with the pole, the man in the red beanie and the door notice are blurred (Blur zones, clip coordinates).
// Device: BladeLevel (frozen frame: a band of colour at the blade's height across to the man beside it).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { type CK } from "../dev/DC01_kit";
import { Blur, Credit, Tall, TitleStrike } from "../dev/IN16_kit";
import { BladeLevel } from "../dev/IN19_BladeLevel";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4", AR = 612 / 1080;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(97.8);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
// blur zones in clip coordinates, by source time (the clip is played at rate 1 in the continuous shots)
const POLE_FACE: [number, number, number, number] = [-0.04, 0.4, 0.32, 0.68];
const BEANIE_FACE: [number, number, number, number] = [0.48, 0.32, 0.9, 0.6];
const NOTICE: [number, number, number, number] = [0.66, 0.22, 1.0, 0.66];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 13.62, vo: "On January 2, 2019, five people from a property firm walked into a row house in Philadelphia's Angora neighborhood that'd been empty for at least three years. (the stairs)",
    node: (n) => <Tall src={M} ar={AR} from={0.2} rate={0.62} keys={K(n, [1.0, 0.5, 0.5], [1.12, 0.5, 0.45])} />,
    over: <><RedLabel text="JANUARY 2, 2019" at={F(0.5)} hold={F(3.6)} /><RedLabel text="ANGORA, PHILADELPHIA" at={F(5.6)} hold={F(3.4)} /></> },
  { a: 13.62, b: 18.78, vo: "They buy run-down houses to fix up and sell, so a walkthrough like this was routine. (the gutted room off the hall)",
    node: (n) => <Tall src={GR + "slowA.mp4"} ar={AR} from={0.4} rate={0.5} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.4, 0.5])} /> },
  { a: 18.78, b: 22.23, vo: "One of the men started up the stairs, and a co-worker stopped him. (a colleague at the foot of the stairs, from behind)",
    node: (n) => <Tall src={M} ar={AR} from={9.0} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.5])} /> },
  { a: 22.23, b: 26.59, vo: "The steps were covered in broken glass, and a thin line ran across one of them. (the stairs from below, slowed)",
    node: (n) => <Tall src={GR + "slowB.mp4"} ar={AR} from={0.2} rate={0.55} keys={K(n, [1.1, 0.5, 0.7], [1.3, 0.5, 0.75])} /> },
  { a: 26.59, b: 36.8, vo: "Ekrem Uysaler started filming. | RAW 1 (src 15.0-22.4)",
    node: (n) => <Tall src={M} ar={AR} from={12.59} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} />, over: <Credit text="FOOTAGE: EKREM UYSALER" at={F(0.4)} hold={F(4.5)} /> },
  { a: 36.8, b: 42.68, vo: "The line ran up the stairwell to the ceiling, where an old crutch hung upside down with a big knife on the end. (the knife over the stairs)",
    node: (n) => <Tall src={M} ar={AR} from={74.0} rate={0.7} keys={K(n, [1.0, 0.5, 0.55], [1.2, 0.5, 0.35])} /> },
  { a: 42.68, b: 45.53, vo: "Would it work? They weren't going to find out with a foot. (the foot of the stairs, slowed)",
    node: (n) => <Tall src={M} ar={AR} from={29.6} rate={0.5} keys={K(n, [1.05, 0.5, 0.6], [1.12, 0.5, 0.62])} layers={<Blur box={NOTICE} />} /> },
  // the man with the pole, running on into RAW 2 (src = timeline - 14.53); his face blurred while he is in frame (src 31.0-39.4)
  { a: 45.53, b: 64.53, vo: "One of the men stood back and hooked the line with a long pole. Watch the top of the stairwell. | RAW 2 (src 36.36-50.0)",
    node: (n) => <Tall src={M} ar={AR} from={31.0} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} layers={<Blur box={POLE_FACE} from={F(0.2)} to={F(7.5)} />} /> },
  { a: 64.93, b: 67.06, vo: "The crutch swung down across the stairs, (0.5x replay of the swing)",
    node: (n) => <Tall src={GR + "slow60.mp4"} ar={AR} from={0.6} rate={0.5} keys={K(n, [1.15, 0.5, 0.3], [1.35, 0.5, 0.25])} /> },
  { a: 67.06, b: 71.42, vo: "and the blade stopped right at neck height for a grown man. Nobody was hurt. (BladeLevel, frozen src 57.0)",
    node: (n) => <BladeLevel src={M} t={57.0} ar={AR} band={[0.33, 0.55]} face={BEANIE_FACE} n={n} /> },
  { a: 71.42, b: 79.21, vo: "I can't stop thinking about the guy who almost went up first. He was about to walk right into it, and he's only fine because somebody looked down. (a worker going down the stairs past the knife)",
    node: (n) => <Tall src={GR + "slowC.mp4"} ar={AR} from={0.2} rate={0.45} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.5, 0.6])} layers={<><Blur box={[0.25, 0.22, 0.8, 0.62]} to={F(3.0)} px={30} /><Blur box={[-0.08, 0.0, 0.75, 0.42]} from={F(3.0)} px={30} /></>} /> },
  { a: 79.21, b: 81.6, vo: "Uysaler called whoever built it a genius. (the knife, close)",
    node: (n) => <Tall src={M} ar={AR} from={50.5} keys={K(n, [1.1, 0.5, 0.45], [1.2, 0.5, 0.45])} /> },
  { a: 81.6, b: 88.59, vo: "A colleague posted the clip as a warning to other investors, and a Facebook repost reached about 12 million views. (knife over the stairs, torch light)",
    node: (n) => <Tall src={M} ar={AR} from={68.8} rate={0.75} keys={K(n, [1.0, 0.5, 0.5], [1.12, 0.5, 0.4])} layers={<Blur box={[0.45, 0.28, 1.0, 0.62]} to={F(3.2)} px={30} />} /> },
  { a: 88.59, b: 92.94, vo: "As for the firm, it didn't walk away. It went ahead with the renovation anyway. (the knife against the wall)",
    node: (n) => <Tall src={M} ar={AR} from={52.9} rate={0.5} keys={K(n, [1.2, 0.5, 0.45], [1.05, 0.5, 0.5])} /> },
  { a: 92.94, b: 97.8, vo: "Nobody's ever come forward, and nobody knows who that line was strung for. (the stairwell and the knife, last frames)",
    node: (n) => <Tall src={M} ar={AR} from={78.1} rate={0.45} keys={K(n, [1.15, 0.5, 0.4], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  ...[13.62, 18.78, 22.23, 26.59, 36.8, 42.68, 45.53, 67.06, 71.42, 79.21, 81.6, 88.59, 92.94].map((s) => ({ at: F(s), kind: "blurDip" as const, len: 10 })),
  { at: F(64.93), kind: "blurDip", len: 14 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 24.6], [36.8, 24.6, 38.29], [64.93, 38.29, null]];
const RAWS: [number, number, number, number, number][] = [[29.0, 36.4, 15.0, 2, 0.12], [50.89, 64.53, 36.36, 0, 0.1]];
// swearing (whisper word times, source seconds): muted
const MUTE: [number, number][] = [[41.0, 41.56], [41.94, 42.46], [43.33, 43.76], [44.64, 45.04], [46.38, 46.87]];
const mute = (s: number) => MUTE.reduce((m, [a, b]) => Math.min(m, interpolate(s, [a - 0.06, a, b, b + 0.06], [1, 0, 0, 1], cl)), 1);

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleStrike dur={F(4.0)} title="THE LINE ON THE STAIRS" place="PHILADELPHIA · 2019" bg={GR + "title.jpg"} size={88} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * mute(src + f / 30) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 5 (~-13 dB, ~10 LU under the VO), ducked under the raws */}
      <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(40)} volume={(f) => {
        const t = f / 30;
        const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
        return dB(-13) * interpolate(t, [3.6, 5.0, 96.2, 97.8], [0, 1, 1, 0], cl) * duck;
      }} />
      <Sequence from={F(3.95)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
      <Sequence from={F(67.06)} layout="none"><Audio src={staticFile("sfx_n2/real/reverse_swell_1.wav")} volume={dB(-32)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
