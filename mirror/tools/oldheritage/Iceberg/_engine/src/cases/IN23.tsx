// Incidents #23: a solo duck hunter (Ethan Gooch, Lucas Reinsch channel, Nov 2020, lake and state not named) wades out after a
// mallard, steps off an underwater ledge and his waders fill. Source: Lucas Reinsch z3oOGTnjDzI (1080p29.97); media/src.mov = file
// 40-400 re-timed to 30 fps (src = file - 40), graded/main.mp4. Burned caption "AS I WALK TO GET THE DUCK I FALL OFF A LEDGE…" at
// file 253.5-259.5 (y 0.76-0.95): the struggle raw is framed 1.35x top-aligned so it never shows. No swearing (whisper), no blur needed.
// VO = one take (CASE23.mp3), split only at the raws:
//   A 0-21.32 @4.0 | R0 file 236.0-244.0 (the shots, "Got one") | B 21.32-32.24 (LedgeSection) | R1 main file 249.6-274.0 (head
//   cam: he drops, water and sky, gasping, swimming) | C 32.24-41.15 | R2 file 325.4-333.5 (his piece to camera: "scary moment…
//   should've just gone slower… I didn't know") | D 41.15-end.
// Device: LedgeSection.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { TypeTitle, Credit } from "../dev/IN21_kit";
import { LedgeSection } from "../dev/IN23_LedgeSection";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const O = 40;                                   // file time -> src time
const s = (file: number) => file - O;

const SPL = [21.32, 32.36, 41.15];
const R0: [number, number] = [s(236.0), s(244.0)], R1: [number, number] = [s(249.6), s(274.0)], R2: [number, number] = [s(325.4), s(333.5)];
const tA = 4.0, tR0 = tA + SPL[0], tB = tR0 + R0[1] - R0[0], tR1 = tB + SPL[1] - SPL[0], tC = tR1 + R1[1] - R1[0], tR2 = tC + SPL[2] - SPL[1], tD = tR2 + R2[1] - R2[0];
const VOEND = 51.52, END = tD + VOEND - SPL[2] + 0.9;
export const DUR = F(END);
const a = (t: number) => tA + t, b = (t: number) => tB + t - SPL[0], c = (t: number) => tC + t - SPL[1], d = (t: number) => tD + t - SPL[2];
const K = (n: number, p: [number, number, number], q: [number, number, number]): CK[] => [{ f: 0, s: p[0], x: p[1], y: p[2] }, { f: n, s: q[0], x: q[1], y: q[2] }];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: a(0), b: a(6.83), vo: "Picture a pile of bleached driftwood on the point of a big, gray lake, one camera on a tripod and another on a hunter's beanie.",
    node: (n) => <Cam src={M} from={s(171.2)} keys={K(n, [1.04, 0.5, 0.5], [1.18, 0.5, 0.48])} />, over: <Credit text="LUCAS REINSCH" at={8} hold={F(5)} /> },
  { a: a(6.83), b: a(12.76), vo: "That's where Ethan Gooch set up in November 2020, after a three quarter mile walk in the dark to hunt alone. (the walk in)",
    node: (n) => <Cam src={M} from={s(112.0)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.5])} />, over: <RedLabel text="ETHAN GOOCH · NOVEMBER 2020" at={F(0.8)} hold={F(4.2)} size={42} /> },
  { a: a(12.76), b: a(19.3), vo: "He was in waders, waterproof overalls with the boots built in. They keep you dry until water gets over the top. (him on the point)",
    node: (n) => <Cam src={M} from={s(300.5)} keys={K(n, [1.6, 0.5, 0.3], [2.0, 0.5, 0.28])} /> },
  { a: a(19.3), b: tR0, vo: "A group of four mallards dropped in. (the decoys, tripod)", node: (n) => <Cam src={M} from={s(213.0)} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.5])} /> },
  { a: tR0, b: tB, vo: "RAW 0: the shots, \"Got one\"", node: (n) => <Cam src={M} from={R0[0]} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: tB, b: b(25.71), vo: "He shot one, but it fell well out in the water, and with no boat, he waded out.", node: (n) => <Cam src={M} from={s(244.9)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.5, 0.5])} /> },
  { a: b(25.71), b: tR1, vo: "For about 30 yards it stayed chest deep, ... drop-off. The next step just isn't there. (LedgeSection)",
    node: (n) => <LedgeSection src={M} from={s(218.0)} n={n} flatAt={6} flatLen={66} labelAt={12} dropAt={158} /> },
  { a: tR1, b: tC, vo: "RAW 1 (main): the head cam goes under", node: (n) => <Cam src={M} from={R1[0]} keys={K(n, [1.35, 0.5, 0.37], [1.4, 0.5, 0.36])} /> },
  { a: tC, b: c(35.93), vo: "His waders filled with lake water. I'm amazed he didn't panic. (0.5x replay of the drop)",
    node: (n) => <Cam src={M} from={s(250.0)} rate={0.5} keys={K(n, [1.4, 0.5, 0.36], [1.7, 0.5, 0.33])} /> },
  { a: c(35.93), b: c(38.72), vo: "He swam back toward shore until his boots could touch.", node: (n) => <Cam src={M} from={s(276.0)} keys={K(n, [1.3, 0.5, 0.4], [1.4, 0.5, 0.4])} /> },
  { a: c(38.72), b: tR2, vo: "And the duck? He grabbed it on the way.", node: (n) => <Cam src={M} from={s(284.2)} keys={K(n, [1.2, 0.5, 0.45], [1.32, 0.5, 0.5])} /> },
  { a: tR2, b: tD, vo: "RAW 2: his piece to camera", node: (n) => <Cam src={M} from={R2[0]} keys={K(n, [1.25, 0.5, 0.3], [1.35, 0.5, 0.3])} /> },
  { a: tD, b: d(45.64), vo: "Back on the driftwood, he called it a boneheaded move, going after the bird too fast. (close, beanie cam)",
    node: (n) => <Cam src={M} from={s(364.5)} keys={K(n, [1.04, 0.5, 0.45], [1.14, 0.5, 0.42])} /> },
  { a: d(45.64), b: END, vo: "Once your waders fill, he said, you sink fast, and being out there by yourself is a whole other deal. (him alone on the point)",
    node: (n) => <Cam src={M} from={s(292.5)} keys={K(n, [1.0, 0.5, 0.5], [1.25, 0.5, 0.32])} /> },
];

const CUTS: FxCut[] = [
  { at: F(tA), kind: "glitch", len: 10 },
  { at: F(a(12.76)), kind: "blurDip", len: 10 },
  { at: F(tR0), kind: "blurDip", len: 10 },
  { at: F(b(25.71)), kind: "blurDip", len: 12 },
  { at: F(tR1), kind: "blurDip", len: 10 },
  { at: F(tC), kind: "blurDip", len: 12 },
  { at: F(c(35.93)), kind: "blurDip", len: 10 },
  { at: F(c(38.72)), kind: "blurDip", len: 10 },
  { at: F(tR2), kind: "glitch", len: 10 },
  { at: F(tD), kind: "blurDip", len: 10 },
  { at: F(d(45.64)), kind: "blurDip", len: 12 },
];
export const ALLOW = CUTS.map((x) => `${(x.at / 30 - 0.35).toFixed(2)}-${(x.at / 30 + 0.45).toFixed(2)}`).join(",");

const PART: [number, number, number | null][] = [[tA, 0, SPL[0]], [tB, SPL[0], SPL[1]], [tC, SPL[1], SPL[2]], [tD, SPL[2], null]];
const RAWS: [number, number, number, number, number][] = [[tR0, tB, R0[0], -3, 0.2], [tR1, tC, R1[0], 2, 0.15], [tR2, tD, R2[0], 3, 0.25]];
const SFX: [number, string, number][] = [
  [tA - 0.05, "sfx_n2/glitch_02.wav", -24], [b(25.71) + 0.05, "sfx_n2/real/reverse_swell_1.wav", -32], [b(25.71) + 5.25, "sfx_n2/dive_01.wav", -28],
  [tR2 - 0.05, "sfx_n2/glitch_01.wav", -28],
];
const MUS: [number, number, number][] = [[tA, tR1 + 2, 4], [tR1 + 1, END, 50]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(tA)} layout="none"><AbsoluteFill><TypeTitle dur={F(tA)} title="THE DUCK HUNTER'S WADERS" place="A PUBLIC-LAND LAKE · 2020" bg={GR + "title.jpg"} size={84} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE23.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([ra, rb, src, g], i) => (
        <Sequence key={"r" + i} from={F(ra)} durationInFrames={F(rb) - F(ra)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(rb - ra) - 12, F(rb - ra) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([ma, mb, off], k) => (
        <Sequence key={"m" + k} from={F(ma)} durationInFrames={F(mb) - F(ma)} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + ma;
            const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = interpolate(t, [ma, ma + 1, mb - 1.5, mb], [0, 1, 1, 0], cl);
            return dB(-22) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, g], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(g)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
