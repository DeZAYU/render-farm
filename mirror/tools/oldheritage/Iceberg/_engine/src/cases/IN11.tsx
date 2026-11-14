// Incidents #11 — Brighton Resort, Utah, 15 Jan 2023: Bryce Bigelow's helmet camera; a drop under the Snake lift, his left ski tip digs
// in, the binding does not release and his leg breaks. One source: the skier's own upload (eeZI1u3sRCg, 1920x1080 60p -> 30p), graded/main
// = src 0-272, graded/late = src 690-830 (sled). Raw audio: rawclean.py (no music found); the swear word in raw 3 is muted.
// Source cuts (srccuts): 17.07 112.1 123.97 131.2 151.63 155.17 178.07 (in-camera black: the lens in the snow) 228.53 238.13 256.37; late 10.63 14.17.
// VO = CASE11.mp3 (no count word), split only at the three raws (all at sentence ends):
//   A 0-24.85 @4.00 | R1 src 168.9-181.0 (the lip, take-off, the landing, the tumble; cut before the leg is seen) |
//   B 24.85-36.04 | R2 src 219.6-228.4 (on his back under the chairlift: "I think I broke my leg... it's twisted") |
//   C 36.04-42.26 | R3 src 257.1-270.0 (patrol arrives: "I had my buddy blocking the jump" / "good job") | D 42.26-end.
// Handle with care: nothing after src 181 that shows the leg; patrollers only far / from behind; no patrol-room footage.
// Device: HeldBinding (the ski standing upright out of the snow with the boot locked in it, frozen).
import React from "react";
import { RedLabel } from "../brand";
import { Cam } from "../dev/DC01_kit";
import { CaseLayout, F, K, StrikeTitle, type Raw, type Sh } from "../dev/IN11_kit";
import { HeldBinding } from "../dev/IN11_HeldBinding";
import type { FxCut } from "../lib/templates/n2fx/fx";

const GR = "case/graded/", M = GR + "main.mp4", L = GR + "late.mp4"; // late: src 690 = 0
export const DUR = F(91.6);

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.53, vo: "Bryce Bigelow's helmet camera spends almost three minutes in fresh powder (red ski tips in powder)",
    node: (n) => <Cam src={M} from={4.0} keys={K(n, [1.12, 0.5, 0.6], [1.22, 0.5, 0.66])} />, over: <RedLabel text="BRYCE BIGELOW" at={F(0.5)} hold={F(2.6)} /> },
  { a: 7.53, b: 11.8, vo: "at Brighton Resort in Utah, weaving through heavy pines behind a friend. (the friend ahead in the trees)",
    node: (n) => <Cam src={M} from={27.6} keys={K(n, [1.25, 0.6, 0.4], [1.12, 0.55, 0.45])} /> },
  { a: 11.8, b: 16.52, vo: "It's January 15, 2023, and I could watch that run on loop. (deep powder between pines)",
    node: (n) => <Cam src={M} from={58.0} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.45])} />, over: <RedLabel text="BRIGHTON RESORT, UTAH · JAN 15, 2023" at={F(0.4)} hold={F(3.6)} size={40} /> },
  { a: 16.52, b: 21.72, vo: "Then he lines up on a drop under the Snake lift and jokes that he's going to jump off it and get wrecked. (lift towers, the run ahead)",
    node: (n) => <Cam src={M} from={155.9} keys={K(n, [1.08, 0.5, 0.4], [1.25, 0.5, 0.42])} /> },
  { a: 21.72, b: 23.73, vo: "The lip is way bigger than it looked. (the approach)", node: (n) => <Cam src={M} from={163.4} keys={K(n, [1.15, 0.5, 0.5], [1.3, 0.5, 0.45])} /> },
  { a: 23.73, b: 28.95, vo: "In the air he panicked and tucked, then started to turn. He comes down nose first. (0.5x: the run-in to the lip)",
    node: (n) => <Cam src={M} from={165.9} rate={0.5} keys={K(n, [1.3, 0.5, 0.4], [1.6, 0.5, 0.36])} /> },
  // RAW 1: the lip, the drop, the landing (lens in the snow: dark frames in the source at 178.0-178.4), the tumble, the first screams
  { a: 28.95, b: 41.05, vo: "RAW 1 (src 168.9-181.0)", node: (n) => <Cam src={M} from={168.9} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 41.05, b: 47.69, vo: "His left ski tip dug in, and the binding ... didn't release. (HeldBinding, src 179.55)",
    node: (n) => <HeldBinding src={M} t={179.6} band={[0.505, 0, 0.585, 1]} bind={[0.5, 0.83, 0.67, 0.995]} drainAt={20} boxAt={F(4.1)}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 30, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.4, x: 0.57, y: 0.8 }]} /> },
  { a: 47.69, b: 52.34, vo: "His body kept going forward over a boot that couldn't move, and his leg snapped. (both skis lying crossed in the snow)",
    node: (n) => <Cam src={M} from={199.0} keys={K(n, [1.1, 0.4, 0.5], [1.3, 0.42, 0.55])} /> },
  // RAW 2: on his back under the lift, shouting up at the chairs
  { a: 52.34, b: 61.14, vo: "RAW 2 (src 219.6-228.4)", node: (n) => <Cam src={M} from={219.6} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.45, 0.4])} /> },
  { a: 61.14, b: 63.23, vo: "Someone on the chairlift called it in. (the chairs going over)", node: (n) => <Cam src={M} from={152.4} keys={K(n, [1.1, 0.5, 0.4], [1.22, 0.5, 0.35])} /> },
  { a: 63.23, b: 67.46, vo: "He told patrol his buddy was blocking the jump so nobody else came off it. (in the sled under the lift, patrol beyond)",
    node: (n) => <Cam src={M} from={32.5} keys={K(n, [1.2, 0.55, 0.45], [1.32, 0.55, 0.42])} /> },
  // RAW 3: patrol arrives; the buddy blocking the jump; "good job ... exactly what we want to see"
  { a: 67.46, b: 80.36, vo: "RAW 3 (src 257.1-270.0)", node: (n) => <Cam src={M} from={257.1} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.45])} /> },
  { a: 80.36, b: 83.89, vo: "Who thinks about that with a broken leg? Bryce, apparently. (earlier: the friend skiing ahead)",
    node: (n) => <Cam src={M} from={124.7} keys={K(n, [1.3, 0.55, 0.45], [1.45, 0.55, 0.45])} /> },
  { a: 83.89, b: 88.0, vo: "Patrol splinted his leg, rolled him into a sled and towed him down the mountain. (sled ride POV, patroller towing)",
    node: (n) => <Cam src={L} from={128.0} keys={K(n, [1.1, 0.5, 0.4], [1.22, 0.5, 0.35])} /> },
  { a: 88.0, b: 91.6, vo: "Two months later, he was back on skis. (ski tips in powder)",
    node: (n) => <Cam src={M} from={40.0} keys={K(n, [1.15, 0.5, 0.6], [1.05, 0.5, 0.55])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(23.73), kind: "blurDip", len: 10 },  // into the slow run-in
  { at: F(28.95), kind: "blurDip", len: 10 },  // slow -> raw (same run)
  { at: F(41.05), kind: "blurDip", len: 12 },  // raw -> the held frame
  { at: F(61.14), kind: "glitch", len: 10 },   // raw 2 out
  { at: F(80.36), kind: "blurDip", len: 12 },  // raw 3 out, back to earlier in the run
  { at: F(88.0), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 24.85], [41.05, 24.85, 36.04], [61.14, 36.04, 42.26], [80.36, 42.26, null]];
const W = "case/media/main_clean.wav";
const RAWS: Raw[] = [
  { a: 28.95, b: 41.05, s: 168.9, wav: W, g: -1, duck: 0.12 },
  { a: 52.34, b: 61.14, s: 219.6, wav: W, g: 0, duck: 0.15 },
  { a: 67.46, b: 80.36, s: 257.1, wav: W, g: 0, duck: 0.15, mute: [[262.9, 263.35]] },
];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24], [61.09, "sfx_n2/glitch_01.wav", -30]];

export const Comp: React.FC = () => (
  <CaseLayout vo="vor/CASE11.mp3" tDur={4.0} dur={DUR}
    title={<StrikeTitle dur={F(4.0)} title="THE BINDING THAT WOULDN'T LET GO" sub="BRIGHTON, UTAH · 2023" bg={GR + "title.jpg"} />}
    shots={SHOTS} cuts={CUTS} parts={PART} raws={RAWS} sfx={SFX}
    music={{ file: "music/Music 3.mp3", db: -19.5, passes: [[4.0, 91.6, 12]] }} />
);
