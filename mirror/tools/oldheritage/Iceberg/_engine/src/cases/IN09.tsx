// Incidents #09 — "Badger DZ", 2011 or earlier: a US Army paratrooper's helmet GoPro from the C-130 door to the ground. One source: his own
// upload XOsGnaeT03k (bananagunner, 1280x720 29.97 fps, 3:02; source cuts at 80.75-80.88, 109.1-109.2, 121.6, 137.3, 146.05).
// Cut BEFORE contact (src 141.6; contact ~143) per the brief; the aftermath used is only the silent sky/grass view (src 146.8-156.9), no
// faces, no aftermath audio (screaming/profanity never used). The jumpmaster's face (src 34-43) is never used.
// VO = one take (CASE09.mp3), split only at the two raws (sentence ends):
//   A 0-13.29 @4.0 | R1 17.29-28.29 (src 60.0-71.0: last seconds in the door, the exit, the fall to the opening shock) | B 13.29-30.35 @28.29 |
//   R2 45.35-61.95 (main: src 125.0-141.6, the drift across the drop zone, the ground coming up sideways) | 0.5 s black |
//   C 30.35-end @62.45, VO ends 96.36, hold to 97.4.
// Devices: LastFrame (half-speed replay of the final second, held on the last frame before the ground, draining). Photo: U.S. Army
// (public domain) C-47 jump at D-Day 80, Wikimedia Commons.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TitleStrike, Still } from "../dev/IN16_kit";
import { LastFrame } from "../dev/IN09_LastFrame";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(97.4);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 11.06, vo: "You stand in the open side door of a C-130, 1,200 feet above the ground, with a camera on your helmet. (the bright door from inside the dark hold)",
    node: (n) => <Cam src={M} from={22.0} keys={K(n, [1.3, 0.42, 0.45], [1.12, 0.45, 0.45])} /> },
  { a: 11.06, b: 16.19, vo: "This is a static line jump, so a cord tied to the aircraft pulls your chute open as you leave. (out of the door: forest, the yellow static-line bag)",
    node: (n) => <Cam src={M} from={44.0} keys={K(n, [1.1, 0.5, 0.6], [1.2, 0.5, 0.65])} /> },
  // "Then you're out." -> RAW 1 -> "Your T-10D blooms overhead" all one continuous run of the clip (src 58.9 -> 75.97)
  { a: 16.19, b: 33.26, vo: "Then you're out. + RAW 1 (src 60.0-71.0) + Your T-10D blooms overhead, and round canopies drift down around you.",
    node: (n) => <Cam src={M} from={58.9} keys={[{ f: 0, s: 1.1, x: 0.5, y: 0.55 }, { f: F(1.2), s: 1.0, x: 0.5, y: 0.5 }, { f: F(12.2), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.12, x: 0.5, y: 0.4 }]} /> },
  { a: 33.26, b: 37.30, vo: "It all looks calm, but the wind up high is blowing 30 knots, (canopies over the drop zone)",
    node: (n) => <Cam src={M} from={81.5} keys={K(n, [1.05, 0.5, 0.4], [1.15, 0.5, 0.35])} /> },
  { a: 37.30, b: 41.35, vo: "and the T-10D can't be steered, so it goes wherever the wind decides to take it. (looking down, the ground under the boots)",
    node: (n) => <Cam src={M} from={100.0} keys={K(n, [1.1, 0.5, 0.55], [1.2, 0.48, 0.6])} /> },
  { a: 41.35, b: 45.35, vo: "The ground starts sliding sideways under your boots, faster than it should. (the field and the road under him)",
    node: (n) => <Cam src={M} from={116.5} keys={K(n, [1.15, 0.5, 0.6], [1.25, 0.55, 0.62])} /> },
  // RAW 2 (main): the drift, the field rushing sideways, cut before contact
  { a: 45.35, b: 61.95, vo: "RAW 2 (src 125.0-141.6)", node: (n) => <Cam src={M} from={125.0} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.55])} filter="brightness(1.12)" /> },
  { a: 61.95, b: 62.45, vo: "(black)", node: () => <AbsoluteFill style={{ background: "#000" }} /> },
  { a: 62.45, b: 67.10, vo: "The man behind that helmet camera was a US Army paratrooper ... (after: on his back, sky and grass, silent)",
    node: (n) => <Cam src={M} from={146.8} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.55, 0.5])} />, over: <RedLabel text="FILMED BY BANANAGUNNER · 2011" at={F(0.8)} hold={F(3.4)} size={40} /> },
  { a: 67.10, b: 71.87, vo: "... who posted the clip in 2011. (his own hand on the riser, earlier in the descent)",
    node: (n) => <Cam src={M} from={92.5} keys={K(n, [1.1, 0.6, 0.5], [1.2, 0.62, 0.5])} /> },
  { a: 71.87, b: 78.85, vo: "By his own account, he came down about 200 meters past his target, in a tank ditch, and his right leg broke badly. (LastFrame)",
    node: (n) => <LastFrame src={GR + "last_slow.mp4"} from={0} hold={5.0} rate={1} n={n} keys={K(n, [1.05, 0.5, 0.5], [1.75, 0.5, 0.72])} /> },
  { a: 78.85, b: 84.89, vo: "After 12 surgeries he chose amputation below the knee, and the Army medically retired him in 2014. (the sky from the grass, 0.8x)",
    node: (n) => <Cam src={GR + "sky_slow.mp4"} from={0} keys={K(n, [1.1, 0.4, 0.5], [1.2, 0.35, 0.5])} /> },
  { a: 84.89, b: 91.11, vo: "Would he do it again? He says he wouldn't change a thing ... I can't imagine saying that. (canopies drifting, calm)",
    node: (n) => <Cam src={M} from={110.0} keys={K(n, [1.05, 0.5, 0.4], [1.12, 0.5, 0.36])} /> },
  { a: 91.11, b: 97.4, vo: "He has since gone back to jumping a few times a year from a World War Two era C-47. (C-47 and round canopies, U.S. Army photo)",
    node: (n) => <Still src={GR + "c47.jpg"} n={n} s0={1.02} s1={1.12} fx={0.5} fy={0.48} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(11.06), kind: "blurDip", len: 10 },
  { at: F(16.19), kind: "blurDip", len: 10 },
  { at: F(33.26), kind: "blurDip", len: 10 },
  { at: F(37.30), kind: "blurDip", len: 10 },
  { at: F(41.35), kind: "blurDip", len: 10 },
  { at: F(45.35), kind: "blurDip", len: 10 },
  { at: F(67.10), kind: "blurDip", len: 10 },
  { at: F(71.87), kind: "blurDip", len: 12 },  // into the replay
  { at: F(78.85), kind: "blurDip", len: 12 },
  { at: F(84.89), kind: "blurDip", len: 10 },
  { at: F(91.11), kind: "glitch", len: 10 },   // the photo
];

const PART: [number, number, number | null][] = [[4.0, 0, 13.29], [28.29, 13.29, 30.35], [62.45, 30.35, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[17.29, 28.29, 60.0, 0, 0.2], [45.35, 61.95, 125.0, 0, 0.1]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [61.93, "sfx_n2/real/impact_2.wav", -22], [91.06, "sfx_n2/glitch_03.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleStrike dur={F(4.0)} title="THE BADGER DZ JUMP" place="C-130 · STATIC LINE · 2011" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 6, F(b - a)], [0, 1, 1, i === 1 ? 1 : 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, ducked under the raws, silent through the black beat */}
      <Sequence from={F(4.0)} durationInFrames={F(97.4 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 1.5 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 1.5 : lv), 1);
          return dB(-22) * interpolate(t, [4.0, 5.0, 96.0, 97.4], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
