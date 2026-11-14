// Dashcam #12: The Falling Forest. A dashcam on a wet forest road (reportedly Slovakia, filmed some time before Feb 2017; date, place,
// people, cause and injuries unverified). Trees come down one after another across the road and onto the car.
// One source: uBSJlZb37Ts ("Viral Video", 1280x720 20 fps, whole clip 0:00-1:21, original sound, no music: rawclean.py found none).
// VO = one take (CASE12.mp3, no count word), split only at the two raws, both at sentence ends:
//   A take 0-12.32 @4.00 | R1 16.32-36.32 (src 40.0-60.0: trees start falling ahead, the line reaches the car, trunks land on it) |
//   B take 12.32-49.33 @36.32 | R2 73.33-85.33 (src 62.65-74.65: pinned under the trunks, voices inside the car) |
//   C take 49.33-end @85.33, VO ends ~89.0, hold to 90.0.
// The shot before each raw runs the same clip continuously into it (src 37.72 -> 40.0, src 60.0 -> 62.65): no cut at the raw start.
// Device: StampLeaf (the camera's own date strip lifts off the held frame, then the camera travels to the leaves).
// Still: Nizke Tatry, Prasiva, view west (Daniel Baranek, Wikimedia Commons, CC BY-SA 3.0) -> credit in the description.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { StampLeaf } from "../dev/DC12_StampLeaf";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(90.0);

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.78, vo: "This dashcam was running on a narrow forest road in steady rain,", node: (n) => <Cam src={M} from={1.0} keys={K(n, [1.05, 0.5, 0.55], [1.16, 0.5, 0.6])} /> },
  { a: 7.78, b: 10.31, vo: "with tall trunks crowding both edges.", node: (n) => <Cam src={M} from={16.0} keys={K(n, [1.12, 0.5, 0.42], [1.22, 0.5, 0.36])} /> },
  { a: 10.31, b: 14.04, vo: "For about 40 seconds it records nothing but wet asphalt.", node: (n) => <Cam src={M} from={23.0} keys={K(n, [1.25, 0.5, 0.74], [1.36, 0.5, 0.76])} /> },
  { a: 14.04, b: 16.32, vo: "Look at the trees just ahead of the car. (runs straight into RAW 1)", node: (n) => <Cam src={M} from={37.72} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  // RAW 1 (main): trees fall ahead, the line comes toward the car, trunks land on the bonnet and glass
  { a: 16.32, b: 36.32, vo: "RAW 1 (src 40.0-60.0)", node: (n) => <Cam src={M} from={40.0} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.45])} /> },
  { a: 36.32, b: 39.02, vo: "Trees don't usually come down in a line like that. (0.5x replay, push)", node: (n) => <Cam src={M} from={45.4} rate={0.5} keys={K(n, [1.25, 0.5, 0.42], [1.5, 0.5, 0.4])} /> },
  { a: 39.02, b: 43.53, vo: "There's already debris on the road at the start of the clip, which suggests a storm had passed through,", node: (n) => <Cam src={M} from={4.0} rate={0.7} keys={K(n, [1.2, 0.52, 0.62], [1.5, 0.55, 0.66])} /> },
  { a: 43.53, b: 46.27, vo: "but what actually brought them down was never established.", node: (n) => <Cam src={M} from={33.5} keys={K(n, [1.18, 0.55, 0.38], [1.28, 0.55, 0.3])} /> },
  { a: 46.27, b: 50.99, vo: "Guesses at the time ran from high winds to a landslide. (the steep bank on the left)", node: (n) => <Cam src={M} from={19.0} keys={K(n, [1.3, 0.3, 0.45], [1.42, 0.28, 0.42])} /> },
  { a: 50.99, b: 55.74, vo: "The clip spread online in February 2017, labeled Slovakia,", node: (n) => <Cam src={M} from={8.0} keys={K(n, [1.08, 0.5, 0.5], [1.18, 0.5, 0.48])} />, over: <RedLabel text="ONLINE · FEBRUARY 2017" at={F(1.4)} hold={F(2.9)} /> },
  { a: 55.74, b: 63.5, vo: "and some posts put it in the Low Tatras, a national park of mountain forest in central Slovakia. That's never been confirmed.",
    node: (n) => <Still src={GR + "tatry.jpg"} n={n} s0={1.04} s1={1.15} fx={0.55} fy={0.45} />, over: <RedLabel text="LOW TATRAS, SLOVAKIA" at={F(1.26)} hold={F(4.9)} /> },
  { a: 63.5, b: 70.68, vo: "The camera's clock shows a winter date from years earlier, but the trees are in full leaf, so it almost certainly wasn't set. (StampLeaf)",
    node: (n) => <StampLeaf still={GR + "f27.png"} stamp={[0.1, 0.1, 0.37, 0.128]} leaf={[0.29, 0.3]} liftAt={15} leafAt={F(3.12)} dur={n} /> },
  { a: 70.68, b: 73.33, vo: "You can hear voices inside the car afterward. (runs straight into RAW 2)", node: (n) => <Cam src={M} from={60.0} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  // RAW 2: pinned under the trunks, voices inside the car
  { a: 73.33, b: 85.33, vo: "RAW 2 (src 62.65-74.65)", node: (n) => <Cam src={M} from={62.65} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.55])} /> },
  { a: 85.33, b: 90.0, vo: "No report has ever said who they were, or how they came out of it. (slow push into the glass)", node: (n) => <Cam src={M} from={74.65} keys={K(n, [1.08, 0.5, 0.55], [1.2, 0.5, 0.58])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.78), kind: "blurDip", len: 10 },
  { at: F(10.31), kind: "blurDip", len: 10 },
  { at: F(14.04), kind: "blurDip", len: 10 },
  { at: F(36.32), kind: "blurDip", len: 14 },  // raw -> slow replay
  { at: F(39.02), kind: "blurDip", len: 10 },
  { at: F(43.53), kind: "blurDip", len: 10 },
  { at: F(46.27), kind: "blurDip", len: 10 },
  { at: F(50.99), kind: "blurDip", len: 10 },
  { at: F(55.74), kind: "glitch", len: 10 },   // the Tatras photo
  { at: F(63.5), kind: "glitch", len: 10 },    // back to the held dashcam frame
  { at: F(70.68), kind: "blurDip", len: 12 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 12.32], [36.32, 12.32, 49.33], [85.33, 49.33, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[16.32, 36.32, 40.0, -5, 0.12], [73.33, 85.33, 62.65, 0, 0.3]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [55.69, "sfx_n2/glitch_01.wav", -28], [63.45, "sfx_n2/glitch_03.wav", -28],
  [63.5 + 15 / 30, "sfx_n2/real/tape_click_2.wav", -26],
];
// soft rain under the VO stretches (the clip's own sound plays only inside the raws)
const BED: [number, number, string, number][] = [[4.0, 16.4, "sfx_n2/real/rain_5.wav", -34], [36.2, 73.4, "sfx_n2/real/rain_5.wav", -34], [85.2, 90.0, "sfx_n2/real/rain_5.wav", -34]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE FALLING FOREST" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE12.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 15, F(b - a) - 15, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(86.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-19) * interpolate(t, [4.0, 5.0, 88.5, 90.0], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
