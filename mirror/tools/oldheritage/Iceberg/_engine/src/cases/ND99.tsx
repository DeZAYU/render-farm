// ND OUTRO — the outro VO over calm aftermath from the video's own cases: Ōfunato's flooded town seen from the hillside the filmer stood
// on (case 1), Everest Base Camp under the settling snow cloud (case 8), Koh Ngai after the surge (case 18), Kitahama's still water from TSUNE's third floor (case 19).
// Slow pushes, hard cuts on the words, one blur-dip on the same-camera join, a long ease to black. No graphics.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(19.8);

type Sh = { a: number; b: number; vo: string; src: string; from: number; fill?: boolean; s0: number; s1: number; fx?: number; fy?: number };
// VO take from 0 at 0.5 (+0.5)
const SHOTS: Sh[] = [
  { a: 0, b: 2.2, vo: "Nineteen disasters, (Ōfunato, the flooded town from the hillside)", src: "ofu.mp4", from: 0.0, s0: 1.04, s1: 1.08 },
  { a: 2.2, b: 3.76, vo: "and in almost every one, (Koh Ngai after the surge, 0.5x)", src: "kng.mp4", from: 1.4, s0: 1.03, s1: 1.06 },
  { a: 3.76, b: 6.4, vo: "the people who came through it had a few floors (Kitahama, from the third floor)", src: "shgv.mp4", from: 0.1, fill: true, s0: 1.0, s1: 1.04 },
  { a: 6.4, b: 8.91, vo: "or a hillside between them and the worst of it. (Ōfunato, the hillside)", src: "ofu.mp4", from: 6.0, s0: 1.02, s1: 1.07, fx: 0.4 },
  { a: 8.91, b: 11.16, vo: "The planet doesn't owe anyone a warning. (the cloud settling over Base Camp)", src: "eve.mp4", from: 5.0, s0: 1.04, s1: 1.08 },
  { a: 11.16, b: 15.18, vo: "What the people in charge do with the warnings they do get is a different story,", src: "ofu.mp4", from: 24.0, s0: 1.02, s1: 1.06, fx: 0.6 },
  { a: 15.18, b: 19.8, vo: "and most of these nineteen turned on it. (ease to black)", src: "ofu.mp4", from: 40.0, s0: 1.03, s1: 1.09 },
];
const CUTS: FxCut[] = [{ at: F(15.18), kind: "blurDip", len: 14 }];

const Fade: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, F(2.0)], [0, 1], cl) }} />; };

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none">
              <AbsoluteFill><FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX></AbsoluteFill>
            </Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(17.8)} layout="none"><Fade /></Sequence>
      <Sequence from={F(0.5)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3, a quiet bed that outlasts the VO and fades with the picture */}
      <Sequence from={0} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(60)} volume={(f) => dB(-19) * interpolate(f, [0, 30, F(17.3), F(19.8)], [0, 1, 1, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
