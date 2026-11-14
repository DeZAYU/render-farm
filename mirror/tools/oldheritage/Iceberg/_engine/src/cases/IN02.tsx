// Incidents #02 — a night lobster dive off Southern California (place not given), filmed on the diver's own torch-lit helmet camera
// (Kodiak Thunder, 0FWy4QdN4AE, 7:18, uploaded 13 Dec 2013): "Chased a big bug into a cave and got lost at one point and nearly drowned.
// Thankfully I got out fine!!!" The upload's soundtrack is commercial music (muted): raw audio = rawclean output + a real underwater bed.
// m.mp4 = src 0-432 (t = src). Intro card 0:00-0:08 and end card 7:08+ unused.
// Timeline: title 0-4 | VO A take 0-32.39 @4 | RAW 1 36.39-58.39 (src 281.1-303.1: the big lobster in the crack, the grab, the beam
// swinging round the walls) | VO B take 32.39-37.28 @58.39 | RAW 2 63.28-75.28 (src 244-256: bare rock in every direction of the
// beam, the passage he later called getting lost) | VO C take 37.28-52.64 @75.28 | end 91.4.
// Device: BeamClose (the dark closing in on the torch beam as he follows the lobster deeper).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { BeamClose } from "../dev/IN02_BeamClose";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "m.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V1 = 4.0, R1a = 36.39, R1b = 58.39, V2 = 58.39, R2a = 63.28, R2b = 75.28, V3 = 75.28, END = 91.4;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: V1, b: V1 + 5.71, vo: "A dive light cuts a white tunnel through black water, and the camera on this diver's head sees nothing else.",
    node: (n) => <Cam src={M} from={14.5} keys={K(n, [1.05, 0.5, 0.5], [1.16, 0.5, 0.5])} /> },
  { a: V1 + 5.71, b: V1 + 9.0, vo: "It's a lobster night off Southern California,",
    node: (n) => <Cam src={M} from={26} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} />, over: <RedLabel text="SOUTHERN CALIFORNIA · 2013" at={F(0.5)} hold={F(2.6)} size={42} /> },
  { a: V1 + 9.0, b: V1 + 12.6, vo: "and he's out with his father at his honeyhole, slang for a place that always pays off. (another light in the water)",
    node: (n) => <Cam src={M} from={81} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.45, 0.5])} /> },
  { a: V1 + 12.6, b: V1 + 15.67, vo: "Divers here can only take spiny lobsters by hand. (a lobster in his glove)",
    node: (n) => <Cam src={M} from={111.4} keys={K(n, [1.08, 0.5, 0.5], [1.18, 0.5, 0.5])} /> },
  { a: V1 + 15.67, b: V1 + 20.64, vo: "A scared one backs deep into the rock and braces against the walls, so you follow it in. (lobsters deep in a crack)",
    node: (n) => <Cam src={M} from={97.5} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.5])} /> },
  { a: V1 + 20.64, b: V1 + 25.94, vo: "Reaching into a black hole underwater for dinner? I'd pass, and that's before anything goes wrong. (antennae in a crack)",
    node: (n) => <Cam src={M} from={40.4} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.5])} /> },
  { a: V1 + 25.94, b: V1 + 27.95, vo: "The yellow mesh bag keeps filling. (the yellow bag)",
    node: (n) => <Cam src={M} from={127.8} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: V1 + 27.95, b: R1a, vo: "Then he chases a big one further into a cave, and the rock closes in around him. (BeamClose)",
    node: (n) => <BeamClose src={M} from={262} n={n} /> },
  { a: R1a, b: R1b, vo: "RAW 1 (src 281.1-303.1)", node: (n) => <Cam src={M} from={281.1} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: V2, b: R2a, vo: "He wins the grab, and somewhere in here, by his own account, he loses the way out. (bare rock in the beam)",
    node: (n) => <Cam src={M} from={218} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.5])} /> },
  { a: R2a, b: R2b, vo: "RAW 2 (src 244-256)", node: (n) => <Cam src={M} from={244} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.5])} /> },
  { a: V3, b: V3 + 3.29, vo: "He finds it again, and his father's light shows up in the water. (lights in open water)",
    node: (n) => <Cam src={M} from={404} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 3.29, b: V3 + 6.0, vo: "Between them they took two limits, about 14 lobsters, (the catch)",
    node: (n) => <Cam src={M} from={425.0} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 6.0, b: V3 + 8.63, vo: "plus a six-pound cabezon. (the fish)",
    node: (n) => <Cam src={M} from={169} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.5, 0.5])} /> },
  { a: V3 + 8.63, b: END, vo: "When he posted the dive in December 2013, he wrote that he nearly drowned down there, and thankfully got out fine. (the diver in the light)",
    node: (n) => <Cam src={M} from={411} keys={K(n, [1.14, 0.5, 0.5], [1.0, 0.5, 0.5])} />, over: <RedLabel text="FILMED BY KODIAK THUNDER" at={F(1.0)} hold={F(3.2)} size={40} /> },
];

const CUTS: FxCut[] = [
  { at: F(V1), kind: "glitch", len: 10 },
  { at: F(V1 + 9.0), kind: "blurDip", len: 10 },
  { at: F(V1 + 15.67), kind: "blurDip", len: 10 },
  { at: F(V1 + 25.94), kind: "blurDip", len: 10 },
  { at: F(V1 + 27.95), kind: "blurDip", len: 10 },
  { at: F(R1a), kind: "blurDip", len: 10 },
  { at: F(V2), kind: "blurDip", len: 10 },
  { at: F(R2a), kind: "blurDip", len: 10 },
  { at: F(V3), kind: "blurDip", len: 12 },
  { at: F(V3 + 6.0), kind: "blurDip", len: 10 },
  { at: F(V3 + 8.63), kind: "blurDip", len: 10 },
];
const PART: [number, number, number | null][] = [[V1, 0, 32.39], [V2, 32.39, 37.28], [V3, 37.28, null]];
const RAWS: [number, number, number][] = [[R1a, R1b, 281.1], [R2a, R2b, 244]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(V1)} layout="none"><AbsoluteFill><TitleCard dur={F(V1)} title="LOST IN THE LOBSTER CAVE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src], i) => (
        <React.Fragment key={"r" + i}>
          <Sequence from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
            <Audio src={staticFile(C + "media/m_clean.wav")} startFrom={F(src)} volume={(f) => interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
          </Sequence>
          <Sequence from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
            <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} loop volume={(f) => dB(-14) * interpolate(f, [0, 15, F(b - a) - 15, F(b - a)], [0, 1, 1, 0], cl)} />
          </Sequence>
        </React.Fragment>
      ))}
      {/* a low underwater bed under the whole VO too, the dive never surfaces */}
      <Sequence from={F(V1)} durationInFrames={F(END - V1)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} loop volume={(f) => dB(-30) * interpolate(f, [0, 30, F(END - V1) - 30, F(END - V1)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(V1)} durationInFrames={F(END - V1)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(70)} volume={(f) => {
          const t = f / 30 + V1;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.12 + 0.88 * (ra - t) / 0.8 : t > rb ? 0.12 + 0.88 * (t - rb) / 0.6 : 0.12), 1);
          return dB(-16) * interpolate(t, [V1, V1 + 1, END - 1.5, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      <Sequence from={F(V1 - 0.05)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
