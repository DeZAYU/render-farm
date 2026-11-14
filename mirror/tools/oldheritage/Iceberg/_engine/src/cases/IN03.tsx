// Incidents #03 — Stawamus Chief, Squamish BC, July 2022: Casey Dubois falls from the last hard move of pitch 4 of Warriors of the
// Wasteland; a 0.1 cam rips and the carabiner on the piece below unclips itself; he slides more than half the 30 m pitch, helmet cracked,
// "a little shaken ... totally okay". Footage: Kyle Smith's clip via R Velarde's raw repost (F1n3YKiTMUA, 37.3 s, 1280x720 24p ->
// m.mp4 30p). Source cuts at 10.79, 16.5, 27.5, 29.67, 30.0, 34.0, 34.33. The repost carries an added music bed: raw audio is
// rawclean --force (voices + impacts only).
// Timeline: title 0-4 | VO A take 0-30.39 @4.0 | RAW 34.39-46.79 (src 17.2-29.6: the last reach, he comes off, the scream, the long
// slide, the source's own close replay) | VO B take 30.39-55.91 @46.79 | end 73.1.
// Stills: Stawamus Chief from the Chief Overlook (Daniel Lu / dllu, CC BY-SA 4.0); Petzl carabiner (Stefan Bellini, CC0).
// Devices: RackPunch (held frame, punch in on the cams on his harness, glide down the crack), RopeCatch (held wide shot, the rope
// traced from the anchor end to the speck that is Casey).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { RackPunch } from "../dev/IN03_RackPunch";
import { RopeCatch } from "../dev/IN03_RopeCatch";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "m.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V1 = 4.0, R0 = 34.39, R1 = 46.79, V2 = 46.79, END = 73.1;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: V1, b: V1 + 6.41, vo: "The Stawamus Chief is a granite dome that rises more than 2,000 feet over Howe Sound in Squamish, British Columbia. (the Chief from the overlook)",
    node: (n) => <Still src={GR + "chief.jpg"} n={n} s0={1.04} s1={1.16} fx={0.42} fy={0.62} />, over: <RedLabel text="SQUAMISH, BRITISH COLUMBIA" at={F(2.6)} hold={F(3.4)} /> },
  { a: V1 + 6.41, b: V1 + 12.53, vo: "In July 2022, Casey Dubois was on the fourth pitch of a route called Warriors of the Wasteland. (top-down on Casey)",
    node: (n) => <Cam src={M} from={0.75} rate={0.85} keys={K(n, [1.05, 0.5, 0.45], [1.18, 0.45, 0.35])} />, over: <RedLabel text="CASEY DUBOIS · JULY 2022" at={F(0.8)} hold={F(3.6)} /> },
  { a: V1 + 12.53, b: V1 + 17.85, vo: "A pitch is one rope length of climbing, and this one's a thin finger crack about 100 feet long. (the crack running up past him)",
    node: (n) => <Cam src={M} from={11.5} rate={0.92} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.55, 0.4])} /> },
  { a: V1 + 17.85, b: V1 + 24.90, vo: "He's placed small spring loaded cams in the crack, each clipped to his rope with a carabiner, a metal loop with a spring gate. (RackPunch)",
    node: (n) => <RackPunch src={M} t={10.3} spot={[[0.6, 0.35], [0.53, 0.37], [0.53, 0.37], [0.6, 0.68]]} spotKeys={[0, 40, 120, n - 10]}
      keys={[{ f: 0, s: 1.05, x: 0.6, y: 0.4 }, { f: 30, s: 1.15, x: 0.58, y: 0.38 }, { f: 42, s: 2.6, x: 0.53, y: 0.37 }, { f: 120, s: 2.75, x: 0.53, y: 0.38 }, { f: n, s: 2.2, x: 0.6, y: 0.68 }]} /> },
  { a: V1 + 24.90, b: R0, vo: "Kyle Smith's filming from above, and Casey's got one last reach to go. He comes off. (top-down, slowed)",
    node: (n) => <Cam src={M} from={6.2} rate={0.62} keys={K(n, [1.2, 0.55, 0.3], [1.1, 0.5, 0.4])} />, over: <RedLabel text="FILMED BY KYLE SMITH" at={F(0.6)} hold={F(3.0)} size={40} /> },
  // RAW: the reach, the fall, the scream, the slide, the filmer's own close replay
  { a: R0, b: R1, vo: "RAW (src 17.2-29.6)", node: (n) => <Cam src={M} from={17.2} keys={K(n, [1.0, 0.5, 0.5], [1.04, 0.5, 0.5])} /> },
  { a: V2, b: V2 + 6.82, vo: "Watch the replay. The tiny cam at his ankles rips out, and somehow the carabiner on the piece below comes off the rope. (0.5x replay, following him down)",
    node: () => <Cam src={GR + "fall_slow.mp4"} from={0} keys={[{ f: 0, s: 1.35, x: 0.55, y: 0.32 }, { f: 54, s: 1.45, x: 0.58, y: 0.32 }, { f: 96, s: 1.5, x: 0.68, y: 0.45 }, { f: 132, s: 1.55, x: 0.45, y: 0.5 }, { f: 168, s: 1.6, x: 0.4, y: 0.6 }, { f: 205, s: 1.62, x: 0.4, y: 0.62 }]} /> },
  { a: V2 + 6.82, b: V2 + 11.79, vo: "The best guess is it'd flipped as the rope went slack, though Kyle said they couldn't work out how. (the filmer's wide replay)",
    node: (n) => <Cam src={GR + "wide_slow.mp4"} from={0} rate={1.5} keys={K(n, [1.1, 0.45, 0.5], [1.25, 0.42, 0.62])} /> },
  { a: V2 + 11.79, b: V2 + 17.33, vo: "A carabiner's got one job, and that's staying shut, and I think a loose rock would scare me less. (a carabiner)",
    node: (n) => <Still src={GR + "biner.jpg"} n={n} s0={1.02} s1={1.14} fx={0.4} fy={0.35} /> },
  { a: V2 + 17.33, b: V2 + 20.30, vo: "Casey slid more than half the pitch before the rope caught him. (RopeCatch)",
    node: (n) => <RopeCatch src={M} t={26.4} at={4} len={46} path={[[0.628, 1.0], [0.592, 0.78], [0.572, 0.64], [0.556, 0.5]]}
      keys={K(n, [1.0, 0.5, 0.5], [1.22, 0.58, 0.58])} /> },
  { a: V2 + 20.30, b: END, vo: "His helmet cracked in several places, but Kyle said he was a little shaken and totally okay. (wide, him far down the slab)",
    node: (n) => <Cam src={GR + "end_slow.mp4"} from={1.46} rate={0.76} keys={K(n, [1.3, 0.55, 0.45], [1.5, 0.55, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(V1), kind: "glitch", len: 10 },
  { at: F(V1 + 12.53), kind: "blurDip", len: 10 },
  { at: F(V1 + 17.85), kind: "blurDip", len: 12 },
  { at: F(V1 + 24.90), kind: "blurDip", len: 12 },
  { at: F(R0), kind: "blurDip", len: 10 },
  { at: F(V2), kind: "blurDip", len: 14 },     // raw -> slow replay
  { at: F(V2 + 6.82), kind: "blurDip", len: 10 },
  { at: F(V2 + 17.33), kind: "blurDip", len: 12 },
  { at: F(V2 + 20.30), kind: "blurDip", len: 12 },
];
const SFX: [number, string, number][] = [
  [V1 - 0.05, "sfx_n2/glitch_02.wav", -26], [V1 + 17.9, "sfx_n2/whoosh_02.wav", -30], [V1 + 19.25, "sfx_n2/real/metal_clank_2.wav", -30],
  [V2 + 11.85, "sfx_n2/real/metal_clank_1.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(V1)} layout="none"><AbsoluteFill><TitleCard dur={F(V1)} title="THE CARABINER THAT OPENED ITSELF" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
      <Sequence from={F(V1)} durationInFrames={F(30.39)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} /></Sequence>
      <Sequence from={F(V2)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(30.39)} /></Sequence>
      <Sequence from={F(R0)} durationInFrames={F(R1 - R0)} layout="none">
        <Audio src={staticFile(C + "media/m_clean.wav")} startFrom={F(17.2)} volume={(f) => dB(4) * interpolate(f, [0, 6, F(R1 - R0) - 14, F(R1 - R0) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(R0)} durationInFrames={F(R1 - R0)} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-30) * interpolate(f, [0, 15, F(R1 - R0) - 15, F(R1 - R0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(V1)} durationInFrames={F(END - V1)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + V1;
          const duck = t < R0 - 0.8 || t > R1 + 0.6 ? 1 : t < R0 ? 0.12 + 0.88 * (R0 - t) / 0.8 : t > R1 ? 0.12 + 0.88 * (t - R1) / 0.6 : 0.12;
          return dB(-13) * interpolate(t, [V1, V1 + 1, END - 1.5, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
