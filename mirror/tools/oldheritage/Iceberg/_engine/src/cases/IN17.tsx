// Incidents #17 — Gijón, Spain, Sunday 2 Feb 2014: a swell storm on the spring tides; a wave breaks over the sea wall of the Muro de San
// Lorenzo and sweeps the promenade where hundreds stood filming; the crowd runs. No serious injuries reported.
// One source: Manfredo Alvarez's clip from a building across the road (dWN5UYcAOkw, 480x270, upscaled 1920 lanczos), 0:00-1:29. Handheld,
// zooms and whip pans (srccuts flags are pans, no edits). Sound: wind/crowd (whisper: no speech), rawclean.py: no music.
// VO = one take (CASE17.mp3), split only at the main raw (sentence end):
//   A 0-40.17 @4.00 (the clip runs from src 26.0 at 33.46 straight on into the raw) | R1 44.57-62.46 (src 37.11-55.0: spray, the wave over
//   the wall at src 40, the crowd running across the promenade and the grass, the water draining back) | B 40.17-end @62.86, VO ends 90.41.
// Devices: TwoNotes (the ministry's real press note of 25 Feb 2014, two A4 pages dealt on a table, credit paragraph then the San Lorenzo
// entry). Faces: tiny at 480x270 from high up, plates unreadable: no blur needed.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { Credit, TitleStrike } from "../dev/IN16_kit";
import { TwoNotes } from "../dev/IN17_TwoNotes";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(91.2);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 11.02, vo: "Gijón sits on the north coast of Spain, and above its San Lorenzo beach runs a long promenade on top of a high sea wall. (the railing, the crowd, the white sea)",
    node: (n) => <Cam src={M} from={1.0} keys={K(n, [1.08, 0.5, 0.55], [1.18, 0.45, 0.6])} />, over: <RedLabel text="GIJÓN, SPAIN" at={F(0.4)} hold={F(3.4)} /> },
  { a: 11.02, b: 16.46, vo: "On Sunday, February 2, 2014, a huge swell storm was hitting that whole coast, (waves breaking on the wall)",
    node: (n) => <Cam src={M} from={58.0} keys={K(n, [1.1, 0.5, 0.45], [1.2, 0.52, 0.42])} />, over: <RedLabel text="FEBRUARY 2, 2014" at={F(0.4)} hold={F(3.6)} /> },
  { a: 16.46, b: 22.64, vo: "with waves of up to 11 meters, about 36 feet, and it landed on the spring high tides. (the swell rolling in)",
    node: (n) => <Cam src={M} from={66.0} keys={K(n, [1.05, 0.5, 0.4], [1.18, 0.5, 0.35])} /> },
  { a: 22.64, b: 25.07, vo: "It's like half the town came down to watch. (pan onto the crowd by the shelter)",
    node: (n) => <Cam src={M} from={16.0} keys={K(n, [1.1, 0.6, 0.65], [1.15, 0.62, 0.65])} /> },
  { a: 25.07, b: 33.46, vo: "Hundreds of people stood shoulder to shoulder along the railing ... while a local named Manfredo Alvarez filmed them from across the road. (tight along the line)",
    node: (n) => <Cam src={M} from={8.5} keys={K(n, [1.6, 0.4, 0.8], [1.45, 0.55, 0.78])} />, over: <Credit text="FOOTAGE: MANFREDO ALVAREZ" at={F(6.4)} hold={F(4.6)} /> },
  // one continuous run from src 26.0 into the raw (src = timeline - 7.46)
  { a: 33.46, b: 62.46, vo: "The sea below is pure white ... nobody in that line steps back. I'd have been three blocks away. Then one wave doesn't stop at the wall. | RAW",
    node: (n) => <Cam src={M} from={26.0} keys={[{ f: 0, s: 1.22, x: 0.5, y: 0.6 }, { f: F(10.4), s: 1.08, x: 0.5, y: 0.55 }, { f: F(11.2), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 62.86, b: 67.65, vo: "People were still running between the parked cars as the next waves hit the wall behind them. (the street below)",
    node: (n) => <Cam src={M} from={74.4} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.55, 0.5])} /> },
  { a: 67.65, b: 72.6, vo: "No serious injuries were reported in Gijón that day, which I honestly didn't expect. (0.5x: the wave over the wall)",
    node: (n) => <Cam src={GR + "slow60.mp4"} from={0.6} rate={0.5} keys={K(n, [1.15, 0.5, 0.45], [1.4, 0.5, 0.5])} /> },
  { a: 72.6, b: 84.39, vo: "Later that month, Spain approved nearly 44 million euros ... and 265,000 euros of it went to San Lorenzo itself. (TwoNotes)",
    node: () => <TwoNotes bg={M} bgFrom={60.0} p1={GR + "p1.png"} p3={GR + "p3.png"} light1={[424, 1838, 1659, 2028]} light3={[424, 1097, 1659, 1188]}
      rule={[962, 1152, 1285, 1182]} lit1At={50} swapAt={212} ruleAt={276} /> },
  { a: 84.39, b: 91.2, vo: "When the next big storm rolled in that March, police put up a perimeter on the promenade to keep the crowds back. (the wall and the sea, wide)",
    node: (n) => <Cam src={M} from={82.5} keys={K(n, [1.2, 0.5, 0.6], [1.04, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(11.02), kind: "blurDip", len: 10 }, { at: F(16.46), kind: "blurDip", len: 10 }, { at: F(22.64), kind: "blurDip", len: 10 },
  { at: F(25.07), kind: "blurDip", len: 10 }, { at: F(33.46), kind: "blurDip", len: 10 },
  { at: F(62.46), kind: "blurDip", len: 14 }, { at: F(67.65), kind: "blurDip", len: 12 },
  { at: F(72.6), kind: "blurDip", len: 12 }, { at: F(84.39), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 40.17], [62.86, 40.17, null]];
const RAWS: [number, number, number, number, number][] = [[44.57, 62.46, 37.11, 2, 0.12]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -26], [72.62, "sfx_n2/real/paper_2.wav", -26], [79.7, "sfx_n2/real/paper_3.wav", -25],
];
// the crowd shot is silent footage under the VO: a low real wind bed keeps the sea alive (no clip sound under the VO)
const BED: [number, number, string, number][] = [[4.0, 44.6, "sfx_n2/real/wind_gust_1.wav", -34]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleStrike dur={F(4.0)} title="ONE WAVE OVER THE WALL" place="GIJÓN, SPAIN · 2014" bg={GR + "title.jpg"} size={88} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 20, F(b - a) - 20, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1 (level matched to ~10 LU under the VO), ducked under the raw */}
      <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(30)} volume={(f) => {
        const t = f / 30;
        const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
        return dB(-14) * interpolate(t, [3.6, 5.0, 89.5, 91.2], [0, 1, 1, 0], cl) * duck;
      }} />
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
