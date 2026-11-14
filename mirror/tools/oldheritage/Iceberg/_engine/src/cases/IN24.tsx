// Incidents #24: Brendan Explores, early 2024: stealth-camping in his van on a dark lane between Jaywick and Colchester, woken at
// 2:30 a.m.; someone tries the side door, then smashes the front passenger window and runs when he shouts. Source: Brendan Explores
// rU5RX2cVsj8 (1080p50). media/src.mov = file windows re-timed to 30 fps: A 560-580 -> 0-20 | B 1000-1030 -> 20-50 |
// C 1060-1220 -> 50-210 | D 1295-1395 -> 210-310 | E 1400-1540 -> 310-450 (graded/main.mp4). His captions (y 0.86-0.93) are framed
// out (>= 1.18x, top aligned); his whispered lines are set small as RawSub instead. Swearing: "whoever the f*** that was" (file
// ~1368) and "f***'s me" (~1378) are outside every raw window. No passers-by or plates in the windows used (daytime streets skipped).
// The intruder is never seen; nothing implies Jaywick locals (the camp was outside Jaywick).
// VO = one take (CASE24.mp3), split only at the raws:
//   A 0-39.77 @4.0 (the face cam runs straight on into R1) | R1 main file 1336.5-1361.5 (whispers "It's half past 2…", the side
//   door, "Someone's just tried the door", the smash, "Hey!", muffled voices) | B 39.77-48.43 | R2 file 1373.8-1382.0 ("I'm gonna get
//   out of here. Oh my god." the glass) | C 48.43-end (NightRun: the drive home to Shrewsbury).
// Device: NightRun.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TypeTitle, Credit, RawSub } from "../dev/IN21_kit";
import { NightRun } from "../dev/IN24_NightRun";
import route from "../dev/IN24_route.json";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const seg = (file: number) => file < 600 ? file - 560 : file < 1040 ? file - 980 : file < 1230 ? file - 1010 : file < 1398 ? file - 1085 : file - 1090;

const SPL = [39.8, 48.45];
const R1: [number, number] = [seg(1336.5), seg(1361.5)], R2: [number, number] = [seg(1373.8), seg(1382.0)];
const tA = 4.0, tR1 = tA + SPL[0], tB = tR1 + R1[1] - R1[0], tR2 = tB + SPL[1] - SPL[0], tC = tR2 + R2[1] - R2[0];
const VOEND = 69.07, END = tC + VOEND - SPL[1] + 0.9;
export const DUR = F(END);
const a = (t: number) => tA + t, b = (t: number) => tB + t - SPL[0], c = (t: number) => tC + t - SPL[1];
const K = (n: number, p: [number, number, number], q: [number, number, number]): CK[] => [{ f: 0, s: p[0], x: p[1], y: p[2] }, { f: n, s: q[0], x: q[1], y: q[2] }];
const T = (n: number, s0: number, s1: number, y = 0.42): CK[] => K(n, [s0, 0.5, y], [s1, 0.5, y]);   // caption-safe

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: a(0), b: a(9.95), vo: "Brendan, the man behind Brendan Explores, has spent hundreds of nights stealth camping, ... hoping nobody notices. (in his van)",
    node: (n) => <Cam src={M} from={seg(1112.3)} keys={T(n, 1.18, 1.3)} />, over: <><Credit text="BRENDAN EXPLORES" at={6} hold={F(6)} /><RedLabel text="BRENDAN EXPLORES" at={F(1.0)} hold={F(3.2)} /></> },
  { a: a(9.95), b: a(12.0), vo: "Early in 2024 he cooked dinner in Jaywick, (the Jaywick Beach sign)", node: (n) => <Cam src={M} from={seg(568.5)} keys={T(n, 1.18, 1.28)} />,
    over: <RedLabel text="JAYWICK, ESSEX · 2024" at={F(0.2)} hold={F(3.6)} /> },
  { a: a(12.0), b: a(14.1), vo: "in Essex, England. (cooking in the van)", node: (n) => <Cam src={M} from={seg(1017.5)} keys={T(n, 1.2, 1.3)} /> },
  { a: a(14.1), b: a(18.5), vo: "When cars and motorbikes started ripping around the streets after sunset, he left town (driving)", node: (n) => <Cam src={M} from={seg(1075.9)} keys={T(n, 1.18, 1.3)} /> },
  { a: a(18.5), b: a(22.0), vo: "and found a dark, quiet lane somewhere between Jaywick and Colchester,", node: (n) => <Cam src={M} from={seg(1147.9)} keys={T(n, 1.18, 1.3)} /> },
  { a: a(22.0), b: a(25.04), vo: "with no houses and nobody around.", node: (n) => <Cam src={M} from={seg(1164)} keys={T(n, 1.18, 1.3)} /> },
  { a: a(25.04), b: a(28.0), vo: "Four hours after he'd gone to sleep, (bedtime)", node: (n) => <Cam src={M} from={seg(1308.6)} keys={T(n, 1.18, 1.26)} /> },
  // the 2:30 face cam runs on, unbroken, into RAW 1
  { a: a(28.0), b: tB, vo: "at 2:30 in the morning, he was wide awake ... his whispering does the work. -> RAW 1",
    node: (n) => <Cam src={M} from={seg(1336.5) - (tR1 - a(28.0))} keys={[{ f: 0, s: 1.18, x: 0.5, y: 0.42 }, { f: F(tR1 - a(28.0)), s: 1.3, x: 0.5, y: 0.4 }, { f: n, s: 1.22, x: 0.5, y: 0.42 }]} />,
    over: <Sequence from={F(tR1 - a(28.0))} layout="none"><RawSub lines={[{ a: 1.5, b: 4.0, t: "It's half past two..." }, { a: 13.2, b: 15.3, t: "Someone's just tried the door..." }]} /></Sequence> },
  { a: tB, b: b(45.22), vo: "As soon as he shouted, whoever it was ran off up the lane, and a car sped away in the distance. (0.5x, lifted)",
    node: (n) => <Cam src={M} from={seg(1354.3)} rate={0.5} filter="brightness(2.1) contrast(1.15) saturate(0.7)" keys={T(n, 1.25, 1.45)} /> },
  { a: b(45.22), b: tR2, vo: "He was unhurt, but his front passenger window was gone. (him, next day)", node: (n) => <Cam src={M} from={seg(1405)} keys={T(n, 1.18, 1.28)} /> },
  { a: tR2, b: tC, vo: "RAW 2: the glass", node: (n) => <Cam src={M} from={R2[0]} keys={T(n, 1.18, 1.24)} /> },
  { a: tC, b: c(52.43), vo: "He swept the glass off his seat and left right then, and I don't blame him.", node: (n) => <Cam src={M} from={seg(1382.2)} filter="brightness(1.4)" keys={T(n, 1.2, 1.3)} /> },
  { a: c(52.43), b: c(59.92), vo: "It's a three and a half hour drive home to Shrewsbury, ... just before sunrise. (NightRun)",
    node: (n) => <NightRun src={GR + "nightmap.jpg"} iw={3600} ih={2080} path={route as [number, number][]} n={n} drawAt={14} drawLen={F(5.6)} a="JAYWICK, ESSEX" b="SHREWSBURY" /> },
  { a: c(59.92), b: c(63.93), vo: "In hundreds of nights out, he said, nothing like that had ever happened to him. (next day)", node: (n) => <Cam src={M} from={seg(1431.9)} keys={T(n, 1.18, 1.3)} /> },
  { a: c(63.93), b: END, vo: "His best guess is they'd seen the covered fridge on his front seat and taken it for a toolbox. (next day)", node: (n) => <Cam src={M} from={seg(1529.5)} keys={T(n, 1.2, 1.34)} /> },
];

const CUTS: FxCut[] = [
  { at: F(tA), kind: "glitch", len: 10 },
  { at: F(a(25.04)), kind: "blurDip", len: 12 },
  { at: F(a(28.0)), kind: "blurDip", len: 12 },
  { at: F(a(22.0)), kind: "blurDip", len: 10 },
  { at: F(tB), kind: "blurDip", len: 16 },
  { at: F(tR2), kind: "blurDip", len: 10 },
  { at: F(tC), kind: "blurDip", len: 10 },
  { at: F(c(52.43)), kind: "glitch", len: 10 },
  { at: F(c(59.92)), kind: "glitch", len: 10 },
  { at: F(c(63.93)), kind: "blurDip", len: 10 },
];
export const ALLOW = CUTS.map((x) => `${(x.at / 30 - 0.35).toFixed(2)}-${(x.at / 30 + 0.45).toFixed(2)}`).join(",");

const PART: [number, number, number | null][] = [[tA, 0, SPL[0]], [tB, SPL[0], SPL[1]], [tC, SPL[1], null]];
const RAWS: [number, number, number, number, number][] = [[tR1, tB, R1[0], 6, 0.12], [tR2, tC, R2[0], 3, 0.2]];
const SFX: [number, string, number][] = [
  [tA - 0.05, "sfx_n2/glitch_02.wav", -24], [c(52.38), "sfx_n2/glitch_01.wav", -28], [c(52.6), "sfx_n2/real/car_engine_2.wav", -34], [c(59.87), "sfx_n2/glitch_03.wav", -30],
];
const MUS: [number, number, number][] = [[tA, tR1 + 1.5, 10], [tR2 + 1, END, 60]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tA)} layout="none"><AbsoluteFill><TypeTitle dur={F(tA)} title="THE VAN DOOR AT 2:30 A.M." place="ESSEX, ENGLAND · 2024" bg={GR + "title.jpg"} size={84} /></AbsoluteFill></Sequence>
          {SHOTS.map((sh, i) => {
            const n = F(sh.b) - F(sh.a);
            return (
              <Sequence key={i} from={F(sh.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{sh.node(n)}</FilmLook_FX>{sh.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([ra, rb, src, g], i) => (
        <Sequence key={"r" + i} from={F(ra)} durationInFrames={F(rb) - F(ra)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(rb - ra) - 12, F(rb - ra) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([ma, mb, off], k) => (
        <Sequence key={"m" + k} from={F(ma)} durationInFrames={F(mb) - F(ma)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + ma;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [ma, ma + 1, mb - 1.5, mb], [0, 1, 1, 0], cl);
            return dB(-13) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, g], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(g)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
