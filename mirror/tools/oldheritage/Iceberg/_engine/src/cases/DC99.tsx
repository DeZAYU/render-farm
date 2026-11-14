// Dashcam video — OUTRO. The outro VO (OUTRO.mp3, whole, from 0.5 s) over calm footage of the cases it names, one shot per clause, hard
// cuts (every shot a different filmer), slow eased pushes, no raws, no labels, no clip sound:
//   "From a bucket swinging over a patrol car in Vermont"        c01 Hardwick: the bucket hanging over the cruiser (src 26.5)
//   "to a stolen Army Humvee tipping into a South Carolina ditch"  c20 Aiken County: the Humvee tilted off the road in the grass (src 325.5)
//   "all of these moments exist because a camera was running..."  c12 the forest road before the trees come down, just a camera running (src 17.5)
//   "nobody ever found out who was waiting in the road..."         c05 Bukit Tunku: slow push toward the pale shape on the centre line (src 7.8)
//   "If you know more ... tell me in the comments. I do read them." c04 St Petersburg: the branch across the night road, a man in the lights (src 8.8)
//   "There's another video waiting on your screen ..."             c17 Cebu bridge: traffic moving again; dims for the end screen, clean fade
// Windows: build/CASE99/shots/cut.sh (srccuts: no source cut inside any window), graded with grade_case.py --house.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.5;                       // VO starts; last word ends V + 26.81
export const DUR = F(30.3);

type Sh = { a: number; b: number; src: string; from: number; s0: number; s1: number; fx?: number; fy?: number };
// cut points = clause starts in OUTRO.srt (+V)
const SHOTS: Sh[] = [
  { a: 0, b: 3.43, src: "exc.mp4", from: 0.3, s0: 1.03, s1: 1.1, fx: 0.3, fy: 0.3 },
  { a: 3.43, b: 7.41, src: "humvee.mp4", from: 0.3, s0: 1.04, s1: 1.12, fx: 0.62, fy: 0.55 },
  { a: 7.41, b: 11.53, src: "forest.mp4", from: 0.3, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 11.53, b: 16.66, src: "bukit.mp4", from: 0.3, s0: 1.08, s1: 1.42, fx: 0.59, fy: 0.62 },
  { a: 16.66, b: 23.31, src: "spb.mp4", from: 0.3, s0: 1.03, s1: 1.1, fx: 0.55, fy: 0.55 },
  { a: 23.31, b: 30.3, src: "cebu.mp4", from: 0.3, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.55 },
];

const Dim: React.FC = () => {
  const f = useCurrentFrame();
  const d = interpolate(f, [F(26.4), F(27.8)], [0, 0.42], cl), end = interpolate(f, [F(29.0), F(30.25)], [0, 1], cl);
  const open = interpolate(f, [0, 10], [1, 0], cl);
  return <AbsoluteFill style={{ background: "#000", opacity: Math.max(d, end, open) }} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      {SHOTS.map((s, i) => (
        <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill>
          <FilmLook_FX grain={0.07}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>
        </AbsoluteFill></Sequence>
      ))}
      <Dim />
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/OUTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (intro uses Music 3, DC01 Music 5) ~10 LU under the VO, outlasts it, fades with the picture */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => dB(-21) * interpolate(f, [0, 30, F(27.0), F(28.0), F(28.6), F(30.25)], [0, 1, 1, 1.25, 1.25, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
