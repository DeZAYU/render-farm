// Incidents #12 — Sairan, Almaty, Kazakhstan, late May 2016: a dog stuck at the foot of the Ulken Almatinka's concrete channel, a young man
// climbs down to it and can't climb back; strangers at the railing form a chain, the first is too short, the second (four or five men)
// hauls them both up. One source: the vertical phone video from the far bank, Марьяна Тлеулина's upload (pH2od2iAc9U, 480x854),
// graded/main = the whole clip (shown on a blurred fill). Source cuts: 129.33/129.5, 208.0, 219.97/220.13 (208-220 = the handheld close
// shot of faces at the fence: not used). Raw audio: rawclean.py (no music); the water, the bank, the shouts.
// VO = CASE12.mp3 split at two raws (sentence ends):
//   A 0-37.29 @4.0 | R1 src 112.0-129.2 (the first chain stretched down the wall, not reaching; a shout for one more man) |
//   B 37.29-49.42 | R2 src 253.0-276.0 (main: the second chain reaches the bottom, the dog and the man are hauled up hand over hand) |
//   C 49.42-end (teaser: case 20, Mt Futago, the climber's own GoPro, graded/c20 = src 38-90, watermark framed out).
// Device: ChainCast (the real chain frozen beside the Times of Central Asia photo of the 2026 sculpture "Unity").
import React from "react";
import { RedLabel, TitleCard } from "../brand";
import { Cam } from "../dev/DC01_kit";
import { CaseLayout, F, K, VCam, type Raw, type Sh } from "../dev/IN11_kit";
import { ChainCast } from "../dev/IN12_ChainCast";
import type { FxCut } from "../lib/templates/n2fx/fx";

const GR = "case/graded/", M = GR + "main.mp4", C20 = GR + "c20.mp4"; // c20: src 38 = 0
const V = (from: number, n: number, a: [number, number, number], b: [number, number, number], rate = 1) => <VCam src={M} from={from} rate={rate} iw={480} ih={854} keys={K(n, a, b)} />;
export const DUR = F(126.6);

const SHOTS: Sh[] = [
  { a: 4.0, b: 10.72, vo: "In Almaty, Kazakhstan, the Ulken Almatinka river reaches Lake Sairan through a steep channel of smooth concrete. (wide: the wall, the river)",
    node: (n) => V(176.0, n, [1.0, 0.5, 0.6], [1.15, 0.5, 0.62]), over: <RedLabel text="SAIRAN, ALMATY, KAZAKHSTAN" at={F(0.6)} hold={F(5.2)} /> },
  { a: 10.72, b: 15.5, vo: "In late May 2016, fast brown floodwater was tearing along the foot of that wall, and a small black dog was stuck in the corner (the dog at the waterline)",
    node: (n) => V(2.0, n, [1.6, 0.55, 0.55], [2.0, 0.56, 0.55]), over: <RedLabel text="LATE MAY 2016" at={F(0.4)} hold={F(3.6)} /> },
  { a: 15.5, b: 20.28, vo: "...where the wall meets the water. (the brown water close)", node: (n) => V(196.0, n, [2.3, 0.5, 0.78], [2.5, 0.5, 0.8]) },
  { a: 20.28, b: 22.55, vo: "A young man climbed down and reached it. (beside the dog)", node: (n) => V(8.0, n, [1.7, 0.45, 0.52], [1.85, 0.45, 0.52]) },
  { a: 22.55, b: 29.26, vo: "But he couldn't climb that steep, smooth wall back up holding a dog, and now there were two of them trapped at the waterline.",
    node: (n) => V(14.0, n, [1.25, 0.5, 0.55], [1.55, 0.45, 0.55]) },
  { a: 29.26, b: 32.36, vo: "A woman named Marianna was filming from the far bank. (the whole frame)", node: (n) => V(26.0, n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5]),
    over: <RedLabel text="FILMED FROM THE FAR BANK" at={F(0.4)} hold={F(2.4)} /> },
  { a: 32.36, b: 36.57, vo: "Up at the railing, strangers start lowering themselves down, hand in hand. (a man going over and down)", node: (n) => V(62.0, n, [1.3, 0.5, 0.5], [1.45, 0.5, 0.5]) },
  { a: 36.57, b: 41.29, vo: "One of the men, Birzhan Seidakhmet, said that first chain just couldn't reach. (the chain of two above the man and the dog)",
    node: (n) => V(80.0, n, [1.4, 0.45, 0.5], [1.55, 0.45, 0.52]) },
  // RAW 1: the first chain, not long enough
  { a: 41.29, b: 58.49, vo: "RAW 1 (src 112.0-129.2)", node: (n) => V(112.0, n, [1.15, 0.5, 0.52], [1.3, 0.5, 0.55]) },
  { a: 58.49, b: 64.99, vo: "So more people came off the railing, and Seidakhmet, who says he was the tallest, was lowered further to close the gap. (zoomed: three on the wall)",
    node: (n) => V(130.2, n, [1.1, 0.5, 0.55], [1.25, 0.5, 0.6]) },
  { a: 64.99, b: 70.62, vo: "This time it's four or five men long, wrists locked, with the top man anchored to the fence. (the second chain going down)",
    node: (n) => V(247.0, n, [1.2, 0.5, 0.5], [1.35, 0.5, 0.52]) },
  // RAW 2 (main): the long chain reaches the bottom; the dog and the man come up hand over hand
  { a: 70.62, b: 93.62, vo: "RAW 2 (src 253.0-276.0)", node: (n) => V(253.0, n, [1.15, 0.5, 0.55], [1.3, 0.5, 0.58]) },
  { a: 93.62, b: 97.53, vo: "The man and the dog were hauled up hand over hand, and nobody got hurt. (0.5x replay, pushing in)",
    node: (n) => V(270.0, n, [1.6, 0.5, 0.6], [2.0, 0.5, 0.62], 0.5) },
  { a: 97.53, b: 101.94, vo: "Marianna posted it with one line: the world isn't without kind people. (wide: the river and the wall)", node: (n) => V(182.0, n, [1.0, 0.5, 0.55], [1.1, 0.5, 0.55]) },
  { a: 101.94, b: 108.09, vo: "At the time, nobody knew who those men were, and ... none of them had to go over that fence. (men at the railing, the first going over)",
    node: (n) => V(224.0, n, [1.5, 0.5, 0.45], [1.65, 0.5, 0.45]) },
  { a: 108.09, b: 117.86, vo: "In March 2026, a sculpture of the chain called Unity was unveiled ..., and the last figure's hand reaches past the railing for anyone to take. (ChainCast)",
    node: (n) => <ChainCast clip={M} t={264.5} ciw={480} cih={854} crop={[60, 330, 460, 692]} photo={GR + "sculpt.jpg"} piw={814} pih={717} head={GR + "tca_head.png"} hw={1640} hh={330}
      inAt={F(0.5)} soloAt={F(4.6)} handAt={F(5.6)} hand={[0.91, 0.12]} n={n} /> },
  { a: 117.86, b: 122.23, vo: "We're not even halfway yet, and before this list is over, (case 20: the knife-edge ridge, the climber's GoPro)",
    node: (n) => <Cam src={C20} from={3.0} keys={K(n, [1.35, 0.5, 0.38], [1.45, 0.5, 0.36])} />, over: <RedLabel text="MT FUTAGO, JAPAN · 2022" at={F(0.4)} hold={F(3.6)} size={42} /> },
  { a: 122.23, b: 126.6, vo: "a man alone on a knife-edge ridge will have to fight off a bear with his fists. (the bear on the ridge)",
    node: (n) => <Cam src={C20} from={43.5} keys={K(n, [1.35, 0.5, 0.38], [1.5, 0.5, 0.36])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(10.72), kind: "blurDip", len: 10 }, { at: F(15.5), kind: "blurDip", len: 10 }, { at: F(20.28), kind: "blurDip", len: 10 },
  { at: F(22.55), kind: "blurDip", len: 10 }, { at: F(29.26), kind: "blurDip", len: 10 }, { at: F(32.36), kind: "blurDip", len: 10 },
  { at: F(36.57), kind: "blurDip", len: 10 }, { at: F(41.29), kind: "blurDip", len: 10 }, { at: F(58.49), kind: "blurDip", len: 12 },
  { at: F(64.99), kind: "blurDip", len: 10 }, { at: F(70.62), kind: "blurDip", len: 10 }, { at: F(93.62), kind: "blurDip", len: 14 },
  { at: F(97.53), kind: "blurDip", len: 10 }, { at: F(101.94), kind: "blurDip", len: 10 }, { at: F(108.09), kind: "blurDip", len: 12 },
  { at: F(117.86), kind: "glitch", len: 10 }, { at: F(122.23), kind: "blurDip", len: 10 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 37.29], [58.49, 37.29, 49.42], [93.62, 49.42, null]];
const W = "case/media/main_clean.wav";
const RAWS: Raw[] = [
  { a: 41.29, b: 58.49, s: 112.0, wav: W, g: 0, duck: 0.15 },
  { a: 70.62, b: 93.62, s: 253.0, wav: W, g: 0, duck: 0.12 },
];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_03.wav", -24], [117.81, "sfx_n2/glitch_01.wav", -28]];

export const Comp: React.FC = () => (
  <CaseLayout vo="vor/CASE12.mp3" tDur={4.0} dur={DUR}
    title={<TitleCard dur={F(4.0)} title="THE HUMAN CHAIN AT SAIRAN" bg={GR + "title.jpg"} pos="50% 60%" />}
    shots={SHOTS} cuts={CUTS} parts={PART} raws={RAWS} sfx={SFX}
    music={{ file: "music/Music 5.mp3", db: -13, passes: [[4.0, 126.6, 0]] }} />
);
