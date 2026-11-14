// Incidents #15 — Matcheetawin Discovery Trails, Fort McMurray, Alberta, 5 Jun 2014 ~8:10 a.m.: a young black bear follows two Syncrude
// co-workers on a morning run for close to 20 minutes; they hold their ground, it climbs a small tree, they run for the Jeep. One camera:
// Bruce D. Allan's phone (LlB0FqQ0DlQ, 1280x720), graded/main = src 0-330 (no title card 0-10, no in-vehicle shots of Greg).
// Source cuts: 10.04 155.99 158.86 161.83 321.69. Raw audio: rawclean.py (no music; the app's "pausing workout" voice is real).
// VO = CASE15.mp3 split at three raws (sentence ends):
//   A 0-34.35 @4.0 | R1 src 48.8-66.5 ("We got nothing for you ... that's as far as you're going, stop, stop, right now, stop") |
//   B 34.35-41.70 | R2 src 75.5-88.5 ("Get together Greg ... we'll look bigger together ... stay together") | C 41.70-51.0 |
//   R3 src 231.8-242.0 (the bear goes up the small tree: "atta boy, big guy, beautiful") | D 51.0-end.
// Devices: RunLog (his own run-tracker screenshot of that morning), ReadLine (the Global News page, the wildlife specialist's lines).
import React from "react";
import { RedLabel } from "../brand";
import { Cam } from "../dev/DC01_kit";
import { CaseLayout, F, K, StrikeTitle, type Raw, type Sh } from "../dev/IN11_kit";
import { RunLog } from "../dev/IN15_RunLog";
import { ReadLine } from "../dev/IN15_ReadLine";
import type { FxCut } from "../lib/templates/n2fx/fx";

const GR = "case/graded/", M = GR + "main.mp4";
export const DUR = F(117.4);

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.77, vo: "Bruce Allan and Greg Armour worked together at Syncrude, in the oil sands outside Fort McMurray, Alberta. (the gravel trail at a run)",
    node: (n) => <Cam src={M} from={290.0} keys={K(n, [1.15, 0.5, 0.55], [1.25, 0.5, 0.5])} />, over: <RedLabel text="BRUCE ALLAN & GREG ARMOUR" at={F(0.6)} hold={F(4.4)} /> },
  { a: 9.77, b: 16.6, vo: "Just after eight on the morning of June 5, 2014, they were about two and a half miles into a run (RunLog: his run of that morning)",
    node: () => <RunLog bg={M} bgFrom={300} shot={GR + "runlog.png"} iw={1182} ih={1776} noteAt={F(4.7)} note={[0.04, 0.925, 0.3, 0.975]} credit="COURTESY: BRUCE ALLAN"
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 18, s: 1.0, x: 0.5, y: 0.5 }, { f: 60, s: 1.7, x: 0.5, y: 0.08 }, { f: 100, s: 1.7, x: 0.5, y: 0.08 }, { f: 150, s: 1.6, x: 0.3, y: 0.9 }, { f: 205, s: 1.65, x: 0.3, y: 0.9 }]} /> },
  { a: 16.6, b: 22.9, vo: "on the Matcheetawin trails when a young black bear stepped onto the gravel ahead. I can't think of a worse time to meet one around there. (the bear far down the trail)",
    node: (n) => <Cam src={M} from={10.8} keys={K(n, [1.6, 0.5, 0.45], [2.0, 0.5, 0.45])} />, over: <RedLabel text="FORT McMURRAY, ALBERTA · JUNE 5, 2014" at={F(0.5)} hold={F(3.4)} size={40} /> },
  { a: 22.9, b: 29.96, vo: "Just over a month earlier, a black bear had killed a Suncor worker named Lorna Weafer at an oil sands site north of the city. (the bear coming on)",
    node: (n) => <Cam src={M} from={24.0} keys={K(n, [1.3, 0.55, 0.45], [1.5, 0.55, 0.45])} />, over: <RedLabel text="LORNA WEAFER · KILLED MAY 7, 2014" at={F(1.6)} hold={F(4.2)} size={40} /> },
  { a: 29.96, b: 31.22, vo: "This one didn't leave.", node: (n) => <Cam src={M} from={33.5} keys={K(n, [1.2, 0.5, 0.5], [1.3, 0.5, 0.5])} /> },
  { a: 31.22, b: 35.99, vo: "It followed them, Allan said, for close to 20 minutes, and he filmed the last few.", node: (n) => <Cam src={M} from={36.5} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.45])} /> },
  { a: 35.99, b: 38.45, vo: "Listen to how flat he keeps his voice.", node: (n) => <Cam src={M} from={46.3} keys={K(n, [1.25, 0.5, 0.45], [1.1, 0.5, 0.5])} /> },
  // RAW 1: "that's as far as you're going. Stop."
  { a: 38.45, b: 56.15, vo: "RAW 1 (src 48.8-66.5)", node: (n) => <Cam src={M} from={48.8} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 56.15, b: 58.22, vo: "They kept moving, and so did the bear.", node: (n) => <Cam src={M} from={68.5} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.5, 0.5])} /> },
  { a: 58.22, b: 63.6, vo: "At a hairpin bend, it cut through the trees and came out ahead of them, pinning them against the tree line. (the bear in the trees)",
    node: (n) => <Cam src={M} from={126.0} keys={K(n, [1.1, 0.5, 0.5], [1.25, 0.55, 0.5])} /> },
  // RAW 2: "get together Greg ... we'll look bigger together"
  { a: 63.6, b: 76.6, vo: "RAW 2 (src 75.5-88.5)", node: (n) => <Cam src={M} from={75.5} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 76.6, b: 80.17, vo: "They yelled and made themselves big, and it only backed off a little. (the bear close, easing back)",
    node: (n) => <Cam src={M} from={100.0} keys={K(n, [1.25, 0.5, 0.45], [1.1, 0.5, 0.5])} /> },
  { a: 80.17, b: 86.0, vo: "What finally got them out of there was a small tree, because the bear got distracted and started climbing it. (the bear by the trees)",
    node: (n) => <Cam src={M} from={222.0} keys={K(n, [1.1, 0.5, 0.5], [1.25, 0.6, 0.45])} /> },
  // RAW 3: the bear goes up the tree
  { a: 86.0, b: 96.2, vo: "RAW 3 (src 231.8-242.0)", node: (n) => <Cam src={M} from={231.8} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.55, 0.45])} /> },
  { a: 96.2, b: 98.5, vo: "They ran the rest of the trail, over a little footbridge", node: (n) => <Cam src={M} from={295.4} keys={K(n, [1.1, 0.5, 0.5], [1.25, 0.5, 0.45])} /> },
  { a: 98.5, b: 100.95, vo: "to the Jeep, and nobody was hurt. (the Jeep)", node: (n) => <Cam src={M} from={322.4} keys={K(n, [1.1, 0.6, 0.55], [1.2, 0.62, 0.55])} /> },
  { a: 100.95, b: 111.05, vo: "Mike Ewald ... said it was likely a young bear, possibly one people had fed before, and it wasn't showing aggression. (ReadLine: Global News)",
    node: () => <ReadLine bg={M} bgFrom={250} sheet={GR + "global_strip.png"} sw={1700} sh={1380} headAt={F(0.3)}
      lines={[{ box: [120, 660, 1520, 770], at: F(0.4) }, { box: [120, 790, 1520, 980], at: F(4.6) }, { box: [120, 1030, 1520, 1205], at: F(6.6) }, { box: [120, 1265, 1520, 1340], at: F(8.6) }]}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.22 }, { f: 40, s: 1.0, x: 0.5, y: 0.22 }, { f: 110, s: 1.12, x: 0.5, y: 0.55 }, { f: 210, s: 1.18, x: 0.5, y: 0.8 }, { f: 303, s: 1.2, x: 0.5, y: 0.86 }]} /> },
  { a: 111.05, b: 114.2, vo: "They'd handled it well, he said, but should've carried bear spray, (the bear walking off down the trail)",
    node: (n) => <Cam src={M} from={243.9} keys={K(n, [1.05, 0.7, 0.35], [1.15, 0.72, 0.33])} /> },
  { a: 114.2, b: 117.4, vo: "and both men have bought some since. (the Jeep)", node: (n) => <Cam src={M} from={325.0} keys={K(n, [1.3, 0.35, 0.9], [1.38, 0.37, 0.9])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.77), kind: "blurDip", len: 12 }, { at: F(16.6), kind: "blurDip", len: 12 },
  { at: F(22.9), kind: "blurDip", len: 10 }, { at: F(29.96), kind: "blurDip", len: 10 }, { at: F(31.22), kind: "blurDip", len: 10 },
  { at: F(35.99), kind: "blurDip", len: 10 }, { at: F(38.45), kind: "blurDip", len: 10 },
  { at: F(56.15), kind: "blurDip", len: 12 }, { at: F(58.22), kind: "blurDip", len: 10 }, { at: F(63.6), kind: "blurDip", len: 10 },
  { at: F(76.6), kind: "blurDip", len: 12 }, { at: F(80.17), kind: "blurDip", len: 10 }, { at: F(86.0), kind: "blurDip", len: 10 },
  { at: F(96.2), kind: "glitch", len: 10 }, { at: F(98.5), kind: "blurDip", len: 10 },
  { at: F(100.95), kind: "blurDip", len: 12 }, { at: F(111.05), kind: "blurDip", len: 12 }, { at: F(114.2), kind: "glitch", len: 10 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 34.35], [56.15, 34.35, 41.70], [76.6, 41.70, 51.0], [96.2, 51.0, null]];
const W = "case/media/main_clean.wav";
const RAWS: Raw[] = [
  { a: 38.45, b: 56.15, s: 48.8, wav: W, g: 2, duck: 0.15 },
  { a: 63.6, b: 76.6, s: 75.5, wav: W, g: 2, duck: 0.15 },
  { a: 86.0, b: 96.2, s: 231.8, wav: W, g: 2, duck: 0.15, mute: [[231.5, 232.1]] },
];
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24], [96.15, "sfx_n2/glitch_03.wav", -30]];

export const Comp: React.FC = () => (
  <CaseLayout vo="vor/CASE15.mp3" tDur={4.0} dur={DUR}
    title={<StrikeTitle dur={F(4.0)} title="THE BEAR THAT FOLLOWED TWO JOGGERS" sub="FORT McMURRAY, ALBERTA · 2014" bg={GR + "title.jpg"} />}
    shots={SHOTS} cuts={CUTS} parts={PART} raws={RAWS} sfx={SFX}
    music={{ file: "music/Music 4.mp3", db: -21.5, passes: [[4.0, 117.4, 0]] }} />
);
