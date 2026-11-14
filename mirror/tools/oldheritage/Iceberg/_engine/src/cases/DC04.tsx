// Dashcam #04 — near St Petersburg, Russia, Sat 8 Sep 2012 ~22:27: on a dark wet road a car has stopped by a striped pole; a branch and a
// row of bottles lie across the lane; the drivers get out and drag the branch clear while an oncoming car's lights approach; the oncoming
// car passes and the filmer drives on. One source: the filmer's own upload (amazurek56, x4DK3YXlYlQ), 852x480 30 fps, used 0:00-1:31
// (1:31+ is black road). Sound = the cab's own (engine, rain, the men outside; rawclean.py: no music).
// VO = one take (CASE04.mp3, no count word), split once at the raw:
//   A take 0-25.75 @4.00 | RAW @29.75-74.75 in three windows joined by blur-dips: src 20-47 (the man by the stopped car, a man walks past
//   the camera to the roadblock, the branch is dragged clear, he walks back), src 57-69 (oncoming headlights, people drifting in the light),
//   src 85-91 (the oncoming car passes, the filmer drives off) | B take 25.75-end @74.75, VO ends 101.34, hold to 102.2.
// Nobody is singled out as a suspect: no freeze on a person; the replay is of the branch being dragged.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { LightLift } from "../dev/DC04_LightLift";
import { TorchRead } from "../dev/DC04_TorchRead";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const VO0 = 4.0, SPLIT = 25.75, VOLEN = 52.36;
// raw windows: [src a, src b]
const WIN: [number, number][] = [[20.0, 47.0], [57.0, 69.0], [85.0, 91.0]];
const RAW_A = VO0 + SPLIT, RAW_B = RAW_A + WIN.reduce((s, [a, b]) => s + b - a, 0), END = RAW_B + (VOLEN - SPLIT) + 0.85;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const T = (t: number) => VO0 + t, TB = (t: number) => RAW_B + t - SPLIT;
const winAt = (i: number) => RAW_A + WIN.slice(0, i).reduce((s, [a, b]) => s + b - a, 0);

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: T(0), b: T(7.82), vo: "In 2012, Russians bought about five times as many dashcams as the year before, mostly to have proof of what happened to them on the road. (0.7x, the dark road, far tail lights)",
    node: (n) => <Cam src={M} from={0} rate={0.7} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.5, 0.5])} /> },
  { a: T(7.82), b: T(15.29), vo: "This one was rolling down a wet two lane road outside St Petersburg on the night of September 8, close to half past ten. (0.7x, tighter on the lights)",
    node: (n) => <Cam src={M} from={5.47} rate={0.7} keys={K(n, [1.35, 0.42, 0.55], [1.5, 0.45, 0.55])} />, over: <RedLabel text="NEAR ST PETERSBURG · SEPTEMBER 8, 2012" at={F(1.6)} hold={F(4.6)} size={42} /> },
  { a: T(15.29), b: T(20.32), vo: "Up ahead, a car's stopped beside a striped roadside pole, with its red lights glowing. (tight on the car and the pole)",
    node: (n) => <Cam src={M} from={10.7} keys={K(n, [1.6, 0.74, 0.5], [1.7, 0.76, 0.52])} /> },
  { a: T(20.32), b: RAW_A, vo: "Keep your eye on the road just past that pole, and the leafy branch and row of bottles lying across it. (LightLift)",
    node: (n) => <LightLift src={M} from={15.73} rate={0.787} keys={[{ f: 0, s: 1.05, x: 0.5, y: 0.55 }, { f: 70, s: 1.18, x: 0.42, y: 0.66 }, { f: n - 26, s: 1.18, x: 0.42, y: 0.66 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]}
      band={{ y0: 0.6, y1: 0.8, x0: 0.06, x1: 0.66 }} inAt={20} inLen={28} outAt={n - 34} outLen={28} /> },
  ...WIN.map(([a, b], i): Sh => ({ a: winAt(i), b: winAt(i + 1), vo: `RAW window ${i + 1} (src ${a}-${b})`,
    node: (n) => <Cam src={M} from={a} keys={i === 0 ? [{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.06, x: 0.55, y: 0.6 }] : K(n, [1.04, 0.5, 0.55], [1.0, 0.5, 0.5])} /> })),
  { a: RAW_B, b: TB(28.96), vo: "So was it a trap? Even the man filming couldn't say. (the men at the roadside, headlights coming)",
    node: (n) => <Cam src={M} from={47.0} keys={K(n, [1.25, 0.5, 0.6], [1.35, 0.48, 0.6])} /> },
  { a: TB(28.96), b: TB(37.01), vo: "He uploaded the clip the next day under a title meaning ambush, with a one line description. \"Hold-up, robbery or hooliganism.\" (TorchRead)",
    node: () => <TorchRead bg={M} bgFrom={50.5} card={GR + "yt.png"} cw={1780} ch={310} beam0={{ x: 0.14, y: 0.12, rx: 0.2, ry: 0.42 }} beam1={{ x: 0.24, y: 0.85, rx: 0.36, ry: 0.36 }} moveAt={F(32.6 - 28.96)} moveLen={34} /> },
  { a: TB(37.01), b: TB(43.51), vo: "Everything else on his channel is ordinary St Petersburg traffic. I trust his shrug more than anything in the comments. (headlights, people in the light)",
    node: (n) => <Cam src={M} from={71.0} keys={K(n, [1.1, 0.45, 0.6], [1.22, 0.42, 0.62])} /> },
  { a: TB(43.51), b: TB(47.22), vo: "People have called it a failed ambush ever since, but that's a theory. (0.5x replay: the branch dragged clear)",
    node: (n) => <Cam src={M} from={38.5} rate={0.5} keys={K(n, [1.3, 0.3, 0.65], [1.45, 0.3, 0.66])} /> },
  { a: TB(47.22), b: END, vo: "Nobody's ever been identified, and who put that branch there, or why, is still unknown. (0.75x, slow push to the pole)",
    node: (n) => <Cam src={M} from={78.0} rate={0.75} keys={K(n, [1.1, 0.6, 0.55], [1.3, 0.66, 0.6])} /> },
];

const CUTS: FxCut[] = [
  { at: F(T(0)), kind: "glitch", len: 10 },
  { at: F(T(7.82)), kind: "blurDip", len: 10 },  // reframe, same camera
  { at: F(T(15.29)), kind: "blurDip", len: 10 },
  { at: F(winAt(1)), kind: "blurDip", len: 12 }, // raw joins (time jumps)
  { at: F(winAt(2)), kind: "blurDip", len: 12 },
  { at: F(RAW_B), kind: "blurDip", len: 12 },
  { at: F(TB(28.96)), kind: "blurDip", len: 12 },// into the page
  { at: F(TB(37.01)), kind: "blurDip", len: 12 },// out of the page
  { at: F(TB(43.51)), kind: "blurDip", len: 10 },
  { at: F(TB(47.22)), kind: "blurDip", len: 10 },
];

const PART: [number, number, number | null][] = [[VO0, 0, SPLIT], [RAW_B, SPLIT, null]];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24], [TB(28.96) + 0.1, "sfx_n2/real/flashlight_click_2.wav", -24]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(VO0)} layout="none"><AbsoluteFill><TitleCard dur={F(VO0)} title="THE ROADBLOCK IN THE DARK" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {WIN.map(([a, b], i) => {
        const n = F(b - a);
        return (
          <Sequence key={"r" + i} from={F(winAt(i))} durationInFrames={n} layout="none">
            <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(a)} volume={(f) => dB(2) * interpolate(f, [0, 8, n - 10, n - 2], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      {/* music: Epidemic ambient Music 4, ~-22 dB (Music 4 is ~9 LU hotter than Music 5), ducked under the raw */}
      <Sequence from={F(VO0)} durationInFrames={F(END - VO0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + VO0;
          const duck = t < RAW_A - 0.8 || t > RAW_B + 0.6 ? 1 : t < RAW_A ? 0.22 + 0.78 * (RAW_A - t) / 0.8 : t > RAW_B ? 0.22 + 0.78 * (t - RAW_B) / 0.6 : 0.22;
          return dB(-22) * interpolate(t, [VO0, VO0 + 1, END - 1.8, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
