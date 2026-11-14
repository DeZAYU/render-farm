// Incidents #08 — off Matagorda, Texas, June 2019 (uploaded 16 Jun 2019): Kim and Bill (KillerBeeOutdoors) on two yellow kayaks, towed
// offshore by a bull shark they put at close to ten feet. One source: their own upload pVMcvINwxhI (1920x1080 59.94 fps, 15:26), trimmed into
// wA = src 38-152, wB = src 172-404.5, wC = src 545-650 (30 fps; source cuts checked with srccuts.py). Music stripped by rawclean.py
// (media/main_clean.wav = src 0-680). Kim and Bill are the uploaders, on camera by choice (no blur).
// VO = one take (CASE08.mp3), split only at the three raws (sentence ends, in the pauses):
//   A 0-29.05 @4.0 | R1 33.05-47.05 (src 235.0-249.0: "He's pulling two kayaks and two grown adults now", the sideways swells) |
//   B 29.05-44.3 @47.05 | R2 62.3-73.6 (main: src 390.5-404.3, the shark's shape beside Bill's kayak, "Oh, I see his body! There is the
//   dang shark, look at it") | C 44.3-56.3 @73.6 | R3 85.6-92.4 (src 375.8-382.6, Kim: "Are you crazy? You think I want to be right by you
//   right now?") | D 56.3-end @92.4, VO ends 104.32, hold to 105.5.
// Device: MurkLift (the boatside underwater GoPro held at src 579: haze cut inside an oval round the shark's head and fin).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { MurkLift } from "../dev/IN08_MurkLift";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const WA = GR + "wA.mp4", WB = GR + "wB.mp4", WC = GR + "wC.mp4";   // src offsets 38, 172, 545
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(105.5);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 12.86, vo: "Kim and Bill are a married couple who film their fishing trips, and in June 2019 they paddled two yellow kayaks through the surf at Matagorda, Texas.",
    node: (n) => <Cam src={WA} from={2.0} keys={K(n, [1.08, 0.5, 0.45], [1.16, 0.5, 0.42])} />, over: <RedLabel text="MATAGORDA, TEXAS · JUNE 2019" at={F(0.6)} hold={F(3.6)} size={42} /> },
  { a: 12.86, b: 17.5, vo: "It was only Kim's second day ever fishing beyond the breakers, (Kim paddling out)",
    node: (n) => <Cam src={WA} from={11.0} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.52, 0.48])} />, over: <RedLabel text="FILMED BY KILLERBEEOUTDOORS" at={F(0.4)} hold={F(3.4)} size={38} /> },
  { a: 17.5, b: 22.14, vo: "out past the waves near an offshore rig, in a north wind of 15 to 18 miles an hour. (Kim, the rig behind her)",
    node: (n) => <Cam src={WA} from={66.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.45, 0.5])} /> },
  { a: 22.14, b: 28.36, vo: "Kim hooked something on a chunk of jack. It didn't run. It just pulled, steadily, away from shore. (Kim far off, bent rod, Bill paddling to her)",
    node: (n) => <Cam src={WA} from={98.0} keys={K(n, [1.15, 0.5, 0.5], [1.3, 0.55, 0.5])} /> },
  // "Bill paddled over ... so now it towed both." runs on into RAW 1 (src 230.3 -> 249.0)
  { a: 28.36, b: 47.05, vo: "Bill paddled over and they held their kayaks together, so now it towed both. + RAW 1 (src 235.0-249.0)",
    node: (n) => <Cam src={WB} from={58.3} keys={[{ f: 0, s: 1.1, x: 0.5, y: 0.5 }, { f: F(4.7), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.04, x: 0.5, y: 0.5 }]} /> },
  { a: 47.05, b: 53.16, vo: "After about 30 minutes Kim's arms were done, and Bill took the rod while the rig kept shrinking behind them. (Kim telling it)",
    node: (n) => <Cam src={WB} from={174.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.45])} /> },
  { a: 53.16, b: 57.0, vo: "Whatever's on the other end has now dragged two loaded kayaks a long way from where they started, (the rig far behind)",
    node: (n) => <Cam src={WB} from={48.5} keys={K(n, [1.1, 0.5, 0.5], [1.22, 0.5, 0.45])} /> },
  { a: 57.0, b: 60.12, vo: "and it still hasn't shown itself. (Bill's kayak alone on the swell)",
    node: (n) => <Cam src={WB} from={185.0} keys={K(n, [1.1, 0.5, 0.5], [1.18, 0.5, 0.45])} /> },
  // "Then a fin breaks the surface." runs on into RAW 2 (src 388.3 -> 404.3)
  { a: 60.12, b: 73.6, vo: "Then a fin breaks the surface. + RAW 2 (src 390.5-404.3)",
    node: (n) => <Cam src={WB} from={216.3} keys={[{ f: 0, s: 1.08, x: 0.5, y: 0.5 }, { f: F(2.2), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.05, x: 0.5, y: 0.5 }]} /> },
  { a: 73.6, b: 79.57, vo: "It's a bull shark, one of the three species most likely to bite people, and they put it at close to ten feet. (0.5x replay: the shape beside Bill's kayak)",
    node: (n) => <Cam src={GR + "shark_slow.mp4"} from={0} keys={K(n, [1.25, 0.45, 0.6], [1.6, 0.42, 0.62])} /> },
  { a: 79.57, b: 85.6, vo: "Kim didn't want to be anywhere near it, and on her second day out past the breakers, I can't blame her. (from Kim's bow, Bill far off)",
    node: (n) => <Cam src={WB} from={195.9} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.55, 0.45])} /> },
  // RAW 3: Kim, "Are you crazy?" (src 375.8-382.6)
  { a: 85.6, b: 92.4, vo: "RAW 3 (src 375.8-382.6)", node: (n) => <Cam src={WB} from={203.8} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: 92.4, b: 98.17, vo: "Bill got it beside his kayak again and again, until the knot gave out, probably at the swivel. (MurkLift, underwater src 579)",
    node: (n) => <MurkLift src={WC} t={34.0} at={20} len={70} oval={[0.36, 0.5, 0.42, 0.36]} keys={K(n, [1.0, 0.5, 0.5], [1.32, 0.38, 0.52])} /> },
  { a: 98.17, b: 101.8, vo: "By their count the fight ran about an hour and 15 minutes, (Bill's kayak beside hers, after the shark)",
    node: (n) => <Cam src={WC} from={79.3} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.48])} /> },
  { a: 101.8, b: 105.5, vo: "and it had dragged them more than a mile off the rig. (Bill's kayak alone on the open swell)",
    node: (n) => <Cam src={WB} from={189.0} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.86), kind: "blurDip", len: 10 },
  { at: F(17.5), kind: "blurDip", len: 10 },
  { at: F(22.14), kind: "blurDip", len: 10 },
  { at: F(28.36), kind: "blurDip", len: 10 },
  { at: F(47.05), kind: "blurDip", len: 10 },
  { at: F(53.16), kind: "blurDip", len: 10 },
  { at: F(57.0), kind: "blurDip", len: 10 },
  { at: F(60.12), kind: "blurDip", len: 10 },
  { at: F(73.6), kind: "blurDip", len: 12 },
  { at: F(79.57), kind: "blurDip", len: 10 },
  { at: F(85.6), kind: "blurDip", len: 10 },
  { at: F(92.4), kind: "blurDip", len: 12 },
  { at: F(98.17), kind: "blurDip", len: 12 },
  { at: F(101.8), kind: "blurDip", len: 10 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 29.05], [47.05, 29.05, 44.3], [73.6, 44.3, 56.3], [92.4, 56.3, null]];
// raws: [timeline a, b, clean-wav s (= src), gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[33.05, 47.05, 235.0, 0, 0.15], [62.3, 73.6, 390.5, 0, 0.1], [85.6, 92.4, 375.8, 0, 0.15]];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TOWED BY A BULL SHARK" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 5, ~-13 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(105.5 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(60)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-13) * interpolate(t, [4.0, 5.0, 104.0, 105.5], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
