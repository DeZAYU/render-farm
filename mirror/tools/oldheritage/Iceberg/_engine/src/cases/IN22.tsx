// Incidents #22: a wire strung between trees across a woodland trail catches ATV rider Greg Harris under the helmet chin (upload
// 14 Feb 2018; trail and ride date not given). Source: Greg Harris rmEQadJ8_6I, 54 s helmet cam, 1280x720 50p -> media/src.mov 30p,
// graded/main.mp4; one continuous take, no source cuts. Audio: engine/wind, no music (rawclean: none). Whisper hears "holy shit"
// quietly at ~31, ~33 and ~40 s: every raw window avoids those seconds (no swearing in the edit). Nothing to blur (no one else in frame).
// VO = one take (CASE22.mp3), split only at the two raws:
//   A 0-18.20 @4.0 over the ride, which runs straight on into R1 (src 18.5-30.8: the bend, the jerk up into the treetops, the roll
//   into the clearing) | B 18.20-36.26 (0.5x replay, WireSnap, the clearing) | R2 src 41.6-50.0 (sitting stopped, looking down at his
//   hands and the quad, engine) | C 36.26-end (LineLift: his real upload page, "Be careful people.").
// Devices: WireSnap, LineLift.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TypeTitle, Credit } from "../dev/IN21_kit";
import { WireSnap } from "../dev/IN22_WireSnap";
import { LineLift } from "../dev/IN22_LineLift";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

const SPL = [18.2, 36.26];
const S0 = 0.3;                                   // the ride under VO A starts here and runs on into R1
const R1: [number, number] = [S0 + SPL[0], 30.8], R2: [number, number] = [41.6, 50.0];
const tA = 4.0, tR1 = tA + SPL[0], tB = tR1 + (R1[1] - R1[0]), tR2 = tB + SPL[1] - SPL[0], tC = tR2 + (R2[1] - R2[0]);
const VOEND = 47.37, END = tC + VOEND - SPL[1] + 0.9;
export const DUR = F(END);
const b = (t: number) => tB + t - SPL[0], c = (t: number) => tC + t - SPL[1];
const K = (n: number, p: [number, number, number], q: [number, number, number]): CK[] => [{ f: 0, s: p[0], x: p[1], y: p[2] }, { f: n, s: q[0], x: q[1], y: q[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  // VO A + R1 as one continuous run of the helmet cam (the VO stops, the ride's own sound comes up at R1)
  { a: tA, b: tB, vo: "A red quad is bouncing down a sandy, puddled trail ... Don't blink, because it's over in two seconds. -> RAW 1",
    node: (n) => <Cam src={M} from={S0} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(7), s: 1.08, x: 0.5, y: 0.55 }, { f: F(12), s: 1.08, x: 0.5, y: 0.55 },
      { f: F(SPL[0] - 1), s: 1.14, x: 0.5, y: 0.48 }, { f: F(SPL[0] + 2), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} />,
    over: <><Credit text="GREG HARRIS" at={6} hold={F(5)} /><RedLabel text="GREG HARRIS" at={F(7.2)} hold={F(3.4)} /></> },
  { a: tB, b: b(20.84), vo: "That jerk up into the treetops is a metal wire. (0.6x replay from the 50p original: graded/replay.mp4 = src 25.2-27.2 slowed, house LUT)",
    node: (n) => <Cam src={GR + "replay.mp4"} from={0.33} keys={K(n, [1.15, 0.5, 0.45], [1.45, 0.5, 0.4])} /> },
  { a: b(20.84), b: b(27.06), vo: "Someone had tied it between two trees across the trail, ... then snapped. (WireSnap)",
    node: (n) => <WireSnap src={M} t={25.45} n={n} y={0.48} drawAt={36} drawLen={40} snapAt={F(26.02 - 20.84)} rate={0.6} /> },
  { a: b(27.06), b: b(32.81), vo: "He rolled into a clearing and stopped, the wire still stuck under his chin guard and his foot jammed under the shifter.",
    node: (n) => <Cam src={M} from={31.0} keys={K(n, [1.05, 0.5, 0.55], [1.2, 0.5, 0.62])} /> },
  { a: b(32.81), b: tR2, vo: "For half a minute, all he could say was \"oh my god.\" (his hands on the bars)",
    node: (n) => <Cam src={M} from={37.0} keys={K(n, [1.25, 0.5, 0.7], [1.35, 0.5, 0.72])} /> },
  { a: tR2, b: tC, vo: "RAW 2: stopped, looking down at his hands and the quad", node: (n) => <Cam src={M} from={R2[0]} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.55])} /> },
  { a: tC, b: c(43.85), vo: "He posted the clip on February 14, 2018, with a short warning to be careful, ... (LineLift: his upload page)",
    node: (n) => <LineLift sheet={GR + "ytsheet.jpg"} sw={728} sh={349} line={[60, 236, 233, 53]} bg={M} bgFrom={2.0} n={n} liftAt={F(40.71 - 36.26 - 0.35)} />,
    over: <RedLabel text="FEBRUARY 14, 2018" at={F(0.4)} hold={F(3.0)} /> },
  { a: c(43.85), b: END, vo: "After a ride like that, I wouldn't go near that trail again. (the clearing where he stopped, end of his clip)",
    node: (n) => <Cam src={M} from={49.95} keys={K(n, [1.05, 0.5, 0.5], [1.25, 0.5, 0.48])} /> },
];

const CUTS: FxCut[] = [
  { at: F(tA), kind: "glitch", len: 10 },
  { at: F(tB), kind: "blurDip", len: 12 },
  { at: F(b(20.84)), kind: "blurDip", len: 10 },
  { at: F(b(27.06)), kind: "blurDip", len: 10 },
  { at: F(b(32.81)), kind: "blurDip", len: 10 },
  { at: F(tR2), kind: "blurDip", len: 10 },
  { at: F(tC), kind: "glitch", len: 10 },
  { at: F(c(43.85)), kind: "glitch", len: 10 },
];
export const ALLOW = CUTS.map((x) => `${(x.at / 30 - 0.35).toFixed(2)}-${(x.at / 30 + 0.45).toFixed(2)}`).join(",");

const PART: [number, number, number | null][] = [[tA, 0, SPL[0]], [tB, SPL[0], SPL[1]], [tC, SPL[1], null]];
const RAWS: [number, number, number, number, number][] = [[tR1, tB, R1[0], 0, 0.15], [tR2, tC, R2[0], 3, 0.3]];
const SFX: [number, string, number][] = [
  [tA - 0.05, "sfx_n2/glitch_02.wav", -24], [b(20.84) + 0.2, "sfx_n2/whoosh_02.wav", -32], [b(26.02), "sfx_n2/real/metal_clank_2.wav", -27],
  [tC - 0.05, "sfx_n2/glitch_01.wav", -28], [c(40.4), "sfx_n2/real/paper_3.wav", -30], [c(43.8), "sfx_n2/glitch_03.wav", -30],
];
const MUS: [number, number, number][] = [[tA, tB + 2, 6], [tB - 1, END, 40]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tA)} layout="none"><AbsoluteFill><TypeTitle dur={F(tA)} title="THE WIRE ACROSS THE TRAIL" place="A WOODLAND TRAIL · 2018" bg={GR + "title.jpg"} size={84} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE22.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([ra, rb, src, g], i) => (
        <Sequence key={"r" + i} from={F(ra)} durationInFrames={F(rb) - F(ra)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(rb - ra) - 12, F(rb - ra) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([ma, mb, off], k) => (
        <Sequence key={"m" + k} from={F(ma)} durationInFrames={F(mb) - F(ma)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + ma;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [ma, ma + 1, mb - 1.5, mb], [0, 1, 1, 0], cl);
            return dB(-15.5) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, g], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(g)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
