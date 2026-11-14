// Dashcam #05 — Bukit Tunku (Kenny Hills), Kuala Lumpur, Fri 5 May 2017 21:30 by the camera's clock: Aswan Yap's dashcam rounds a
// chevron bend and finds a small pale shape sitting on the centre line far up the road; the car stops and turns back. One source:
// early repost by Hafeedz (v9pPRdfhcXc, 1280x720), used src 0–97 (media/main.mp4 = src 0–100). Speed stamp reads 000 KM/H throughout.
// VO = one take (CASE05.mp3, no count word), split only at the two raws (both at sentence ends):
//   A take 0–29.30 @4.00 | R1 33.30–62.70 (src 9.0–38.4, main: the figure, "that's a bit scary... very scary", "traction control just
//   came on", the turn, "what the [muted] was that... some dude is sitting there in the middle") | B take 29.30–55.85 @62.70 |
//   R2 89.25–98.65 (src 79.8–89.2: stopped under a lamp, "check system... maybe it's like a reverse too fast. Yeah, maybe.") |
//   C take 55.85–end @98.65, VO ends 103.57, hold to 104.5.
// Devices: HillPull (Sentinel-2 KL, Lake Gardens / Kenny Hills), CentreLine (held frame, centre-line dashes light up to the shape),
// Headlamp (real Higgypop page lit by a headlight beam). Swearing at src 30.85–31.35 muted.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { HillPull } from "../dev/DC05_HillPull";
import { CentreLine } from "../dev/DC05_CentreLine";
import { Headlamp } from "../dev/DC05_Headlamp";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(104.5);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const FIG: [number, number] = [0.604, 0.597];   // the shape on the centre line at src 9.0

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 11.91, vo: "Aswan Yap was driving through Bukit Tunku with a friend ... between Lake Gardens and Kenny Hills. (HillPull)",
    node: () => <HillPull src={GR + "kl.jpg"} iw={3328} ih={3328} z0={1.12} z1={2.9} f0={[1760, 1640]} f1={[1380, 1745]} lineAt={F(7.0)}
      pts={[{ x: 1409, y: 1990, name: "LAKE GARDENS", at: F(6.04), side: "r" }, { x: 1327, y: 1488, name: "KENNY HILLS", at: F(6.84), side: "l" }]}>
      <RedLabel text="BUKIT TUNKU, KUALA LUMPUR" at={F(1.4)} hold={F(3.9)} size={42} />
    </HillPull> },
  { a: 11.91, b: 14.9, vo: "It's a quiet hill district in the middle of Kuala Lumpur, Malaysia, (lamp over the hill road, trees)",
    node: (n) => <Cam src={M} from={56.0} keys={K(n, [1.25, 0.5, 0.45], [1.35, 0.52, 0.45])} /> },
  { a: 14.9, b: 17.66, vo: "where the road winds through patches of jungle. (a bend in the headlights, chevrons)",
    node: (n) => <Cam src={M} from={45.2} keys={K(n, [1.3, 0.5, 0.62], [1.42, 0.5, 0.64])} /> },
  { a: 17.66, b: 20.3, vo: "Local stories call it one of the city's most haunted streets, (dark road, trees, lamp)",
    node: (n) => <Cam src={M} from={60.5} keys={K(n, [1.2, 0.45, 0.5], [1.32, 0.45, 0.48])} /> },
  { a: 20.3, b: 23.46, vo: "though none of them has ever been backed by a record. (long lit road, trees)",
    node: (n) => <Cam src={M} from={73.0} keys={K(n, [1.3, 0.55, 0.55], [1.18, 0.55, 0.55])} /> },
  { a: 23.46, b: 27.51, vo: "They round a bend marked with yellow chevrons, and Yap stops the car. (live: the chevron bend)",
    node: (n) => <Cam src={M} from={4.6} keys={K(n, [1.12, 0.52, 0.55], [1.22, 0.55, 0.6])} />, over: <RedLabel text="MAY 5, 2017 · 9:30 PM" at={F(0.4)} hold={F(3.0)} size={40} /> },
  { a: 27.51, b: 33.3, vo: "The shape is tiny at this distance, so look at the center line far up the road, where the headlights fade out. (CentreLine)",
    node: (n) => <CentreLine src={M} t={9.0} dimAt={4} litAt={F(2.2)} litLen={F(2.6)} endAt={n} far={FIG}
      path={[[0.533, 0.8], [0.565, 0.715], [0.585, 0.66], [0.598, 0.625], [0.603, 0.605]]}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(1.8), s: 1.05, x: 0.55, y: 0.56 }, { f: F(5.3), s: 2.3, x: FIG[0], y: FIG[1] }, { f: n, s: 2.35, x: FIG[0], y: FIG[1] }]} /> },
  // RAW 1 (main): live from the held frame: hold tight on the shape while it sits there, then ease out as the car stops and turns
  { a: 33.3, b: 62.7, vo: "RAW 1 (src 9.0-38.4)",
    node: (n) => <Cam src={M} from={9.0} filter="brightness(1.22) contrast(1.06)" keys={[{ f: 0, s: 2.35, x: FIG[0], y: FIG[1] }, { f: F(4.8), s: 2.2, x: 0.6, y: 0.6 },
      { f: F(8.0), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.05, x: 0.5, y: 0.52 }]} /> },
  { a: 62.7, b: 73.47, vo: "Yap later said he was convinced it was a ghost ... Others thought ... rob the driver. (Headlamp: Higgypop page)",
    node: () => <Headlamp sheet={GR + "higgy_sheet.png"} sw={2240} sh={1720} stops={[
      { at: 0, len: 0, x: 560, y: 470, rx: 760, ry: 250, s: 1.08 },
      { at: 50, len: 36, x: 735, y: 1450, rx: 860, ry: 150, s: 1.5 },
      { at: F(6.9), len: 30, x: 735, y: 1254, rx: 860, ry: 150, s: 1.5 }]} /> },
  { a: 73.47, b: 79.08, vo: "No police report was ever made public, and some people online have doubted the video is real at all. (0.5x lifted replay of the shape)",
    node: (n) => <Cam src={M} from={9.6} rate={0.5} filter="brightness(.96) contrast(1.12) saturate(.85)" keys={K(n, [1.7, 0.59, 0.6], [2.15, 0.59, 0.61])} /> },
  { a: 79.08, b: 81.37, vo: "That fault isn't as spooky as it sounds, though. (driving away, straight lit road)",
    node: (n) => <Cam src={M} from={51.0} keys={K(n, [1.25, 0.5, 0.55], [1.35, 0.5, 0.57])} /> },
  { a: 81.37, b: 85.3, vo: "The warning on his dashboard was the traction control, (down to the hood / road in the headlights)",
    node: (n) => <Cam src={M} from={64.5} keys={K(n, [1.5, 0.5, 0.75], [1.62, 0.5, 0.78])} /> },
  { a: 85.3, b: 89.25, vo: "and his friend offered a plain reason on the spot, wondering out loud if they'd reversed too fast. (the car slowing under the lamp)",
    node: (n) => <Cam src={M} from={75.6} keys={K(n, [1.2, 0.55, 0.5], [1.3, 0.55, 0.52])} /> },
  // RAW 2: stopped under the lamp, the friend's plain reason in their own voices
  { a: 89.25, b: 98.65, vo: "RAW 2 (src 79.8-89.2)", node: (n) => <Cam src={M} from={79.8} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.52, 0.48])} /> },
  { a: 98.65, b: 104.5, vo: "I like that the clip hands us the ordinary answer before anyone online can dress it up. (back up the night road, easing out)",
    node: (n) => <Cam src={M} from={40.0} keys={K(n, [1.3, 0.5, 0.55], [1.08, 0.5, 0.52])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(11.91), kind: "glitch", len: 10 },
  { at: F(14.9), kind: "blurDip", len: 10 },
  { at: F(17.66), kind: "blurDip", len: 10 },
  { at: F(20.3), kind: "blurDip", len: 10 },
  { at: F(23.46), kind: "blurDip", len: 10 },
  { at: F(27.51), kind: "blurDip", len: 10 },
  { at: F(62.7), kind: "blurDip", len: 12 },
  { at: F(73.47), kind: "blurDip", len: 12 },
  { at: F(79.08), kind: "blurDip", len: 10 },
  { at: F(81.37), kind: "blurDip", len: 10 },
  { at: F(85.3), kind: "blurDip", len: 10 },
  { at: F(89.25), kind: "blurDip", len: 10 },
  { at: F(98.65), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 29.3], [62.7, 29.3, 55.85], [98.65, 55.85, null]];
// raws: [timeline a, b, src s, gain dB, music duck]
const RAWS: [number, number, number, number, number][] = [[33.3, 62.7, 9.0, 3, 0.12], [89.25, 98.65, 79.8, 3, 0.15]];
const MUTE: [number, number][] = [[30.82, 31.38]];   // src seconds: swearing
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [11.86, "sfx_n2/glitch_01.wav", -28], [28.0, "sfx_n2/sub_pulse_01.wav", -24],
  [73.4, "sfx_n2/real/reverse_swell_1.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE FIGURE AT BUKIT TUNKU" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => {
            const t = src + f / 30;
            const m = MUTE.reduce((v, [x, y]) => Math.min(v, t < x - 0.04 || t > y + 0.04 ? 1 : 0), 1);
            return m * dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl);
          }} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(100.5)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-19) * interpolate(t, [4.0, 5.0, 103.0, 104.5], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
