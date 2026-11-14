// Incidents #05 — Lily Rock (Tahquitz Rock), Idyllwild CA, October 2023: a climber falls at ~7,500 ft and breaks his ankle; Riverside
// County Sheriff's Rescue 9 hoists him and then the second climber (red jacket) off the face. Footage: the aircrew's helmet cameras
// (Hook-in-Hand, xQBVB2nmvq8, 21:03). Media clocks: a = src 0-130, b = src 260-500 (t-260), c = src 600-990 (t-600), e = 1238-1263
// (t-1238). Faces: the climbers' faces are source-blurred in the windows used; the 15:28-15:40 partly visible face is not used.
// Timeline: title 0-4 | VO A take 0-37.67 @4 | RAW 1 41.67-66.67 (src 462-487: out of the ledge, the step-off, swinging over the
// valley under the hook) | VO B take 37.67-43.79 @66.67 | RAW 2 72.79-92.79 (src 946-966: the second climber lifted off the wall)
// | VO C take 43.79-54.12 @92.79 | end 103.9. The 15 Oct 2023 rescue report: Idyllwild Town Crier (17 Oct 2023), said in VO only.
// Still: Idyllwild and Tahquitz Rock (Don Graham, CC BY-SA 2.0). Device: SwingReplay (half-speed step-off, pendulum camera).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { SwingReplay } from "../dev/IN05_SwingReplay";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", A = GR + "a.mp4", B = GR + "b.mp4", CC = GR + "c.mp4", E = GR + "e.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V1 = 4.0, R1a = 41.67, R1b = 66.67, V2 = 66.67, R2a = 72.79, R2b = 92.79, V3 = 92.79, END = 103.9;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const sb = (s: number) => s - 260, sc = (s: number) => s - 600, se = (s: number) => s - 1238;

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: V1, b: V1 + 6.4, vo: "High on the white granite dome above Idyllwild, California, in October 2023, (Idyllwild main street, the dome above)",
    node: (n) => <Still src={GR + "tahquitz1.jpg"} n={n} s0={1.04} s1={1.2} fx={0.55} fy={0.2} />, over: <RedLabel text="IDYLLWILD, CALIFORNIA" at={F(1.0)} hold={F(3.6)} /> },
  { a: V1 + 6.4, b: V1 + 12.84, vo: "one of two climbers fell at about 7,500 feet and broke his ankle, and both of them would leave that rock on a cable. (the dome and the valley from the door, the hook)",
    node: (n) => <Cam src={A} from={65} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.45, 0.5])} /> },
  { a: V1 + 12.84, b: V1 + 16.69, vo: "Locals call it Lily Rock, and on maps it's Tahquitz Rock. (down the face)",
    node: (n) => <Cam src={A} from={105} keys={K(n, [1.06, 0.5, 0.5], [1.16, 0.5, 0.6])} />, over: <RedLabel text="LILY ROCK" at={F(0.6)} hold={F(3.0)} /> },
  { a: V1 + 16.69, b: V1 + 20.1, vo: "We're only seeing what came after, through the helmet cameras of Rescue 9, (the cabin)",
    node: (n) => <Cam src={A} from={45} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} />, over: <RedLabel text="RESCUE 9" at={F(0.8)} hold={F(2.4)} /> },
  { a: V1 + 20.1, b: V1 + 23.59, vo: "the same Riverside County Sheriff's helicopter. (out of the door, the granite close)",
    node: (n) => <Cam src={A} from={85} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.55])} /> },
  { a: V1 + 23.59, b: V1 + 28.52, vo: "It's hanging close to the granite while two small figures wait, clipped into a crack below. (the two climbers in the crack from above)",
    node: (n) => <Cam src={A} from={125} keys={K(n, [1.0, 0.5, 0.5], [1.5, 0.6, 0.62])} /> },
  { a: V1 + 28.52, b: V1 + 31.0, vo: "A rescue specialist rides the cable down to their ledge (descending to them)",
    node: (n) => <Cam src={B} from={sb(265)} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.6])} /> },
  { a: V1 + 31.0, b: V1 + 33.58, vo: "and clips the first climber in. (the clipping)",
    node: (n) => <Cam src={B} from={sb(448)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: V1 + 33.58, b: R1a, vo: "For me, the worst part of a ride like this is the second they both step off. (on the ledge, ready)",
    node: (n) => <Cam src={B} from={sb(457.5)} keys={K(n, [1.08, 0.5, 0.5], [1.16, 0.5, 0.5])} /> },
  { a: R1a, b: R1b, vo: "RAW 1 (src 462-487)", node: (n) => <Cam src={B} from={sb(462)} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: V2, b: V2 + 2.14, vo: "They swing out together over the drop. (SwingReplay)",
    node: () => <SwingReplay src={GR + "swing_slow.mp4"} from={0.4} rate={1} /> },
  { a: V2 + 2.14, b: V2 + 4.1, vo: "Then the cable goes back down (the cable going down again)",
    node: (n) => <Cam src={CC} from={sc(605)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.6])} /> },
  { a: V2 + 4.1, b: R2a, vo: "for the second climber, in a red jacket. (red jacket on the face)",
    node: (n) => <Cam src={CC} from={sc(704.5)} keys={K(n, [1.0, 0.5, 0.5], [1.12, 0.3, 0.42])} /> },
  { a: R2a, b: R2b, vo: "RAW 2 (src 946-966)", node: (n) => <Cam src={CC} from={sc(946)} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: V3, b: V3 + 5.14, vo: "There was a rescue on that rock the same day this video went up, and it's very likely these two. (into the cabin)",
    node: (n) => <Cam src={CC} from={sc(984.8)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: V3 + 5.14, b: END, vo: "One climber was flown to the hospital with moderate injuries, and the other turned down treatment. (the landing zone, the ambulance crew)",
    node: (n) => <Cam src={E} from={se(1245)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(V1), kind: "glitch", len: 10 },
  { at: F(V1 + 6.4), kind: "glitch", len: 10 },
  { at: F(V1 + 12.84), kind: "blurDip", len: 10 },
  { at: F(V1 + 20.1), kind: "blurDip", len: 10 },
  { at: F(V1 + 28.52), kind: "blurDip", len: 10 },
  { at: F(V1 + 31.0), kind: "blurDip", len: 10 },
  { at: F(V1 + 33.58), kind: "blurDip", len: 10 },
  { at: F(V2), kind: "blurDip", len: 12 },
  { at: F(V2 + 2.14), kind: "blurDip", len: 10 },
  { at: F(V2 + 4.1), kind: "blurDip", len: 10 },
  { at: F(R2a), kind: "blurDip", len: 10 },
  { at: F(V3), kind: "blurDip", len: 10 },
  { at: F(V3 + 5.14), kind: "blurDip", len: 10 },
];
const PART: [number, number, number | null][] = [[V1, 0, 37.67], [V2, 37.67, 43.79], [V3, 43.79, null]];
const RAWS: [number, number, string, number, number][] = [[R1a, R1b, "media/b_clean.wav", sb(462), 0], [R2a, R2b, "media/c_clean.wav", sc(946), 0]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(V1)} layout="none"><AbsoluteFill><TitleCard dur={F(V1)} title="HOISTED OFF LILY ROCK" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + file)} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(V1)} durationInFrames={F(END - V1)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + V1;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.12 + 0.88 * (ra - t) / 0.8 : t > rb ? 0.12 + 0.88 * (t - rb) / 0.6 : 0.12), 1);
          return dB(-16) * interpolate(t, [V1, V1 + 1, END - 1.5, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      <Sequence from={F(V1 - 0.05)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
      <Sequence from={F(V1 + 6.35)} layout="none"><Audio src={staticFile("sfx_n2/glitch_01.wav")} volume={dB(-30)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
