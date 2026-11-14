// Incidents #21: Wichita, Kansas, 2 Apr 2021: urban explorer Jared Coker is caught leaving the fire-gutted TreatCo plant by its owner,
// made to handcuff himself and held for police; ~15 min after he is driven off the owner (Ken Thomas, 62) fires a shotgun at two other
// trespassers (off camera). Source: Jared Coker Urbex, edited upload aEKNPFlRF_I (1080p60). media/src.mov = 4 windows of it, re-timed
// to 30 fps: A file 880-1060 -> 0-180 | B 1100-1215 -> 180-295 | C 1310-1445 -> 295-430 | D 1500-1530 -> 430-460 (graded/main.mp4).
// The upload burns Jared's subtitles at y 0.86-0.99 (and a few joke captions mid-frame): every window is framed at >= 1.18x, top
// aligned, so no caption is on screen; the windows avoid the joke captions (file 1393, 1410-1411, 1415-1416, 1195 "Huge Blast").
// The man's face is already blurred by Jared. The teens are never shown. VO = one take (CASE21.mp3), split only at the three raws:
//   A 0-23.29 @4.0 | R1 src 104.0-112.5 (car at the gate: "they're coming in the gate") | B 23.29-36.23 | R2 (main) src 337.0-362.8
//   (out in the open -> "Whoa, stop right there" -> "Who else is with you?" -> sit down, handcuffs, "Put 'em on. Got it?") |
//   C 36.23-46.24 | R3 src 414.6-425.0 ("Don't you see something that says use of deadly force?" wall, "I thought that was kids'
//   spray painting." "No, that's me telling you I'll shoot you.") | D 46.24-end.
// Devices: LampRead (the Wichita Eagle verdict/sentence page under a lamp). Still: USGS NAIP (public domain) of the plant.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TypeTitle, Credit, Still } from "../dev/IN21_kit";
import { LampRead } from "../dev/IN21_LampRead";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

const SPL = [23.29, 36.23, 46.24];
const R1: [number, number] = [104.0, 112.5], R2: [number, number] = [337.0, 362.8], R3: [number, number] = [414.6, 425.0];
const tA = 4.0, tR1 = tA + SPL[0], tB = tR1 + (R1[1] - R1[0]), tR2 = tB + SPL[1] - SPL[0], tC = tR2 + (R2[1] - R2[0]),
  tR3 = tC + SPL[2] - SPL[1], tD = tR3 + (R3[1] - R3[0]);
const VOEND = 90.27, END = tD + VOEND - SPL[2] + 0.85;
export const DUR = F(END);
const a = (t: number) => tA + t, b = (t: number) => tB + t - SPL[0], c = (t: number) => tC + t - SPL[1], d = (t: number) => tD + t - SPL[2];

/** caption-safe camera: >= 1.18x, focus kept high so the burned subtitles (y > 0.86) stay out of frame */
const T = (n: number, s0: number, s1: number, x0 = 0.5, x1 = 0.5, y0 = 0.42, y1 = 0.42): CK[] => [{ f: 0, s: s0, x: x0, y: y0 }, { f: n, s: s1, x: x1, y: y1 }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: a(0), b: a(3.4), vo: "On April 2, 2021, urban explorer Jared Coker (Jared, his own sit-down)",
    node: (n) => <Cam src={M} from={431.8} keys={T(n, 1.2, 1.28, 0.45, 0.45, 0.4, 0.38)} />,
    over: <><RedLabel text="APRIL 2, 2021" at={F(0.2)} hold={F(2.6)} /><Credit text="JARED COKER URBEX" at={4} hold={F(2.7)} /></> },
  { a: a(3.4), b: a(5.6), vo: "squeezed into the old TreatCo plant in Wichita, (the roof)", node: (n) => <Cam src={M} from={5.1} keys={T(n, 1.2, 1.3)} /> },
  { a: a(5.6), b: a(9.2), vo: "a pet-treat factory gutted by fires. (the plant from its roof)", node: (n) => <Cam src={M} from={8.1} keys={T(n, 1.22, 1.34, 0.5, 0.52)} />,
    over: <RedLabel text="TREATCO PLANT · WICHITA, KANSAS" at={F(0.3)} hold={F(3.0)} size={42} /> },
  { a: a(9.2), b: a(13.29), vo: "For almost two hours it's an ordinary video of dark production floors.", node: (n) => <Cam src={M} from={61.0} keys={T(n, 1.2, 1.32)} /> },
  { a: a(13.29), b: a(17.2), vo: "From an upstairs window, he saw a red car roll through the gate. (his window view)", node: (n) => <Cam src={M} from={93.2} keys={T(n, 1.2, 1.35, 0.5, 0.55, 0.42, 0.45)} /> },
  { a: a(17.2), b: a(20.6), vo: "A man got out and walked the fence line,", node: (n) => <Cam src={M} from={122.2} keys={T(n, 1.25, 1.4, 0.5, 0.5, 0.45, 0.45)} /> },
  { a: a(20.6), b: tR1, vo: "and Jared didn't want to be seen, so he started looking for a way out.", node: (n) => <Cam src={M} from={141.9} keys={T(n, 1.2, 1.3)} /> },
  { a: tR1, b: tB, vo: "RAW 1: the car at the gate", node: (n) => <Cam src={M} from={R1[0]} keys={T(n, 1.18, 1.24)} /> },
  { a: tB, b: b(26.97), vo: "Through the windows he caught the man again, carrying something long.", node: (n) => <Cam src={M} from={195.3} keys={T(n, 1.22, 1.36)} /> },
  { a: b(26.97), b: b(31.79), vo: "Then a loud blast echoed across the site, and Jared thought it was a gunshot.", node: (n) => <Cam src={M} from={279.6} keys={T(n, 1.25, 1.4, 0.5, 0.5, 0.44, 0.44)} /> },
  { a: b(31.79), b: b(34.78), vo: "At dusk, he climbed out a window and headed for the trees.", node: (n) => <Cam src={M} from={312.3} keys={T(n, 1.2, 1.3)} /> },
  { a: b(34.78), b: tR2, vo: "He almost made it. (the trail at dusk)", node: (n) => <Cam src={M} from={329.0} keys={T(n, 1.2, 1.3)} /> },
  { a: tR2, b: tC, vo: "RAW 2 (main): caught, sit down, handcuffs", node: (n) => <Cam src={M} from={R2[0]} keys={[{ f: 0, s: 1.18, x: 0.5, y: 0.42 }, { f: n, s: 1.26, x: 0.5, y: 0.4 }]} /> },
  { a: tC, b: c(40.87), vo: "The man stepped out of the bushes with a gun and made Jared put handcuffs on himself. (0.5x replay)",
    node: (n) => <Cam src={M} from={346.5} rate={0.5} keys={T(n, 1.3, 1.6, 0.5, 0.5, 0.42, 0.4)} /> },
  { a: c(40.87), b: tR3, vo: "With the camera rolling, he said the \"use of deadly force\" painted on the wall wasn't graffiti.", node: (n) => <Cam src={M} from={402.6} keys={T(n, 1.2, 1.3)} /> },
  { a: tR3, b: tD, vo: "RAW 3: the painted words; the wall cutaway (src 418.67-422.67) framed tight on the paint, away from its caption", node: (n) => {
    const c1 = F(418.67 - R3[0]) + 1, c2 = F(422.67 - R3[0]) + 1;
    return <Cam src={M} from={R3[0]} keys={[{ f: 0, s: 1.18, x: 0.5, y: 0.42 }, { f: c1 - 1, s: 1.2, x: 0.5, y: 0.42 }, { f: c1, s: 2.0, x: 0.47, y: 0.6 },
      { f: c2 - 1, s: 2.15, x: 0.48, y: 0.6 }, { f: c2, s: 1.18, x: 0.5, y: 0.42 }, { f: n, s: 1.22, x: 0.5, y: 0.42 }]} />;
  } },
  { a: tD, b: d(54.26), vo: "Police took about an hour and a half to arrive, he says, ... criminal trespass and paid a 200 dollar fine.",
    node: (n) => <Cam src={M} from={380.0} keys={T(n, 1.2, 1.34)} /> },
  { a: d(54.26), b: d(64.25), vo: "That blast earlier wasn't a gun, Jared later said. It'd been a noise device the owner had rigged. I'd call Jared lucky, ... (Jared, sit-down)",
    node: (n) => <Cam src={M} from={437.1} keys={T(n, 1.2, 1.36, 0.45, 0.45, 0.38, 0.36)} /> },
  { a: d(64.25), b: d(71.63), vo: "About 15 minutes after Jared was driven off, ... two other trespassers came in. None of it's on camera. (NAIP of the plant)",
    node: (n) => <Still src={GR + "naip.jpg"} n={n} s0={1.05} s1={1.3} fx={0.5} fy={0.5} />, over: <RedLabel text="2300 N. BROADWAY · THAT NIGHT" at={F(0.6)} hold={F(4.0)} size={42} /> },
  { a: d(71.63), b: d(76.27), vo: "The plant's owner, 62-year-old Ken Thomas, fired a shotgun at them.", node: (n) => <Cam src={M} from={388.5} keys={T(n, 1.24, 1.36)} />,
    over: <RedLabel text="KEN THOMAS, 62" at={F(0.5)} hold={F(3.6)} /> },
  { a: d(76.27), b: d(80.54), vo: "Both were hospitalized, and neither injury turned out to be life-threatening. (the plant in the dark)", node: (n) => <Cam src={M} from={233.2} keys={T(n, 1.2, 1.3)} /> },
  { a: d(80.54), b: END, vo: "In July 2023, a Sedgwick County jury convicted Thomas ... two years' probation. (LampRead: Wichita Eagle, 14 Sep 2023)",
    node: (n) => <LampRead sheet={GR + "eagle.jpg"} sw={1494} sh={1027} bg={M} bgFrom={390.0}
      stops={[{ f: 0, y: 190, z: 0.95 }, { f: 70, y: 478, z: 1.12 }, { f: 190, y: 478, z: 1.15 }, { f: 250, y: 795, z: 1.12 }, { f: n, y: 800, z: 1.15 }]}
      rules={[{ x0: 985, x1: 1335, y: 538, at: 96 }, { x0: 112, x1: 590, y: 601, at: 110 }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(tA), kind: "glitch", len: 10 },
  ...[tR1, tB, b(34.78), tR2, tC, c(40.87), tR3, tD, d(76.27)].map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),
  { at: F(d(64.25)), kind: "glitch", len: 10 },
  { at: F(d(80.54)), kind: "blurDip", len: 12 },
];
export const ALLOW = CUTS.map((x) => `${(x.at / 30 - 0.35).toFixed(2)}-${(x.at / 30 + 0.45).toFixed(2)}`).join(",");

const PART: [number, number, number | null][] = [[tA, 0, SPL[0]], [tB, SPL[0], SPL[1]], [tC, SPL[1], SPL[2]], [tD, SPL[2], null]];
const RAWS: [number, number, number, number, number][] = [[tR1, tB, R1[0], 2, 0.3], [tR2, tC, R2[0], 3, 0.15], [tR3, tD, R3[0], 3, 0.15]];
const SFX: [number, string, number][] = [
  [tA - 0.05, "sfx_n2/glitch_02.wav", -24], [b(27.6), "sfx_n2/real/boom_2.wav", -27], [d(64.2), "sfx_n2/glitch_03.wav", -28],
  [d(80.6), "sfx_n2/real/paper_2.wav", -27],
];
const MUS: [number, number, number][] = [[tA, tC + 2, 14], [tC - 1, END, 70]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tA)} layout="none"><AbsoluteFill><TypeTitle dur={F(tA)} title="HELD AT GUNPOINT" place="WICHITA, KANSAS · 2021" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE21.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([ra, rb, src, g], i) => (
        <Sequence key={"r" + i} from={F(ra)} durationInFrames={F(rb) - F(ra)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 5, F(rb - ra) - 12, F(rb - ra) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([ma, mb, off], k) => (
        <Sequence key={"m" + k} from={F(ma)} durationInFrames={F(mb) - F(ma)} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + ma;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [ma, ma + 1, mb - 1.5, mb], [0, 1, 1, 0], cl);
            return dB(-20) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, g], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(g)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
