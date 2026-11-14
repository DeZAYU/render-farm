// Dashcam #17 - Mactan, Cebu, Philippines, Tue 30 Sep 2025 9:59 PM: a car on the old Mactan-Mandaue bridge when the M6.9 Bogo quake
// hits; the deck rolls, riders along the right rail drop their bikes and hold the railing; nobody on the bridge hurt.
// One source: zyNKSEQFGpg (Teonel Amahit, repost "not mine"), 1920x1080, 117.7 s; the clip starts already shaking (no calm crossing
// exists), car stopped from ~16 s, traffic moves again ~100 s. rawclean.py found music over the whole clip -> voices only.
// VO = one take (CASE17.mp3), split only at the two raws:
//   A 0-28.28 @4.00 | R1 32.28-56.28 (src 0-24: shaking, riders drop bikes, grab the rail) | B 28.28-43.90 @56.28 |
//   R2 71.90-83.90 (src 98-110: the shaking passes, traffic starts to crawl) | C 43.90-end @83.90, VO ends 131.04, hold to 132.0.
// Footage under the VO stays out of both raw windows (src 26-95, 113-117). Stills: Sentinel-2 cloudless (EOX, CC BY 4.0), Wikimedia
// Commons (see NOTES.md). Devices: TwinSpans, PostWatch, SwayTrace, NorthLine, LampScan.
import React from "react";
import { RedLabel } from "../brand";
import { type FxCut } from "../lib/templates/n2fx/fx";
import { Cam } from "../dev/DC01_kit";
import { CaseRunner, type CaseDef, F, K, Still, type Sh } from "../dev/DC17_kit";
import { TwinSpans } from "../dev/DC17_TwinSpans";
import { PostWatch } from "../dev/DC17_PostWatch";
import { SwayTrace } from "../dev/DC17_SwayTrace";
import { NorthLine } from "../dev/DC17_NorthLine";
import { LampScan } from "../dev/DC17_LampScan";

const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
export const DUR = F(132.0);

const SHOTS: Sh[] = [
  { a: 4.0, b: 10.06, vo: "Two bridges link Mandaue City to Mactan Island ..., the island where Cebu's airport sits. (TwinSpans)",
    node: () => <TwinSpans src={GR + "s2.jpg"} iw={1792} ih={1792} z0={1.0} z1={1.12} focus0={[900, 880]} focus1={[1000, 1060]}
      spans={[{ a: [902, 676], b: [1000, 796], at: 12 }, { a: [676, 866], b: [728, 962], at: 30 }]}
      runway={[[930, 1440], [1010, 1530], [1600, 940], [1520, 850]]} runwayAt={132}
      labels={[{ text: "MANDAUE CITY", at: 22, hold: 34, x: 0.27, y: 0.14 }, { text: "MACTAN ISLAND", at: 62, x: 0.6, y: 0.8 }]} /> },
  { a: 10.06, b: 14.19, vo: "Just before ten on a Tuesday night, a car is crossing one of them, (the bridge deck, daytime photo)",
    node: (n) => <Still src={GR + "deck.jpg"} n={n} s0={1.04} s1={1.14} fx={0.5} fy={0.62} /> },
  { a: 14.19, b: 16.92, vo: "with lamp posts sliding past against a black sky (dashcam: lamp posts and the lit sign)",
    node: (n) => <Cam src={M} from={45.0} keys={K(n, [1.8, 0.42, 0.28], [1.9, 0.56, 0.28])} /> },
  { a: 16.92, b: 19.76, vo: "and motorbikes riding along the railing on the right. (riders at the right rail)",
    node: (n) => <Cam src={M} from={113.0} keys={K(n, [1.7, 0.76, 0.62], [1.8, 0.72, 0.62])} /> },
  { a: 19.76, b: 22.79, vo: "The date is September 30, 2025. (the dashcam, wide)",
    node: (n) => <Cam src={M} from={75.0} keys={K(n, [1.12, 0.5, 0.5], [1.2, 0.52, 0.45])} />, over: <RedLabel text="SEPTEMBER 30, 2025 · 9:59 PM" at={F(0.3)} hold={F(2.4)} size={42} /> },
  { a: 22.79, b: 28.53, vo: "Most likely it's the older of the two, a two-lane truss bridge that opened in 1973. (the red truss from the water)",
    node: (n) => <Still src={GR + "truss.jpg"} n={n} s0={1.03} s1={1.12} fx={0.6} fy={0.45} />, over: <RedLabel text="MACTAN-MANDAUE BRIDGE · 1973" at={F(2.1)} hold={F(3.3)} size={42} /> },
  { a: 28.53, b: 32.28, vo: "Watch the lamp posts first, then the riders along that rail. (PostWatch on the first frame)",
    node: () => <PostWatch src={M} t={0} keys={K(112, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} dimAt={4} liftAt={96}
      pools={[{ f: 0, x: 0.53, y: 0.24, rx: 0.16, ry: 0.3 }, { f: 50, x: 0.53, y: 0.24, rx: 0.16, ry: 0.3 }, { f: 78, x: 0.84, y: 0.62, rx: 0.18, ry: 0.3 }]} /> },
  // RAW 1: the deck rolls, the riders put their bikes down and grab the railing
  { a: 32.28, b: 56.28, vo: "RAW 1 (src 0-24)", node: (n) => <Cam src={M} from={0} keys={K(n, [1.0, 0.5, 0.5], [1.1, 0.62, 0.52])} /> },
  { a: 56.28, b: 60.41, vo: "The car wasn't swerving. The deck itself was rolling under the traffic. (SwayTrace on the lamp)",
    node: (n) => <SwayTrace src={M} from={26.0} at={8} keys={K(n, [2.0, 0.52, 0.33], [2.25, 0.52, 0.33])} /> },
  { a: 60.41, b: 69.20, vo: "They were feeling a magnitude 6.9 earthquake ... centered about 60 miles to the north, near Bogo City, (NorthLine)",
    node: () => <NorthLine src={GR + "cebu.jpg"} iw={1280} ih={1280} from={[663, 891]} to={[716, 225]} z0={1.55} z1={1.65} runAt={150} runLen={70}
      label="MAGNITUDE 6.9 · NEAR BOGO CITY" labelAt={226} /> },
  { a: 69.20, b: 71.90, vo: "and the shaking lasted about 30 seconds. (riders holding the rail)",
    node: (n) => <Cam src={M} from={33.0} keys={K(n, [2.0, 0.8, 0.62], [2.1, 0.8, 0.62])} /> },
  // RAW 2: the shaking passes; riders stand, cars start to crawl past
  { a: 71.90, b: 83.90, vo: "RAW 2 (src 98-110)", node: (n) => <Cam src={M} from={98.0} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.55, 0.55])} /> },
  { a: 83.90, b: 85.93, vo: "So was that bridge about to give way? (low along the deck and the rail)",
    node: (n) => <Cam src={M} from={50.0} keys={K(n, [1.55, 0.62, 0.72], [1.65, 0.64, 0.72])} /> },
  { a: 85.93, b: 90.73, vo: "Officials shut it that night for a safety check, and it reopened a few hours later. (wide, the stopped deck)",
    node: (n) => <Cam src={M} from={85.0} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.48, 0.48])} /> },
  { a: 90.73, b: 92.84, vo: "Nobody on it was reported hurt. (riders standing by the rail)",
    node: (n) => <Cam src={M} from={94.0} keys={K(n, [2.0, 0.8, 0.6], [2.1, 0.79, 0.6])} /> },
  { a: 92.84, b: 100.35, vo: "Officials reported no structural damage on the newer bridge beside it, ... joint inspection of the old one. (the channel)",
    node: (n) => <Still src={GR + "channel.jpg"} n={n} s0={1.05} s1={1.2} fx={0.55} fy={0.3} /> },
  { a: 100.35, b: 105.36, vo: "That's half a mile of steel more than fifty years old, and I'd want that inspection too. (under the old truss)",
    node: (n) => <Still src={GR + "bridge1.jpg"} n={n} s0={1.04} s1={1.14} fx={0.45} fy={0.4} /> },
  { a: 105.36, b: 111.02, vo: "Northern Cebu wasn't so lucky. Houses and centuries-old churches came down across the north. (Bogo from the air)",
    node: (n) => <Still src={GR + "heli.jpg"} n={n} s0={1.14} s1={1.24} fx={0.42} fy={0.62} />, over: <RedLabel text="BOGO CITY, CEBU" at={F(2.3)} hold={F(3.0)} /> },
  { a: 111.02, b: 117.0, vo: "In San Remigio alone, at least 100 sinkholes opened, (Bogo City Hall)",
    node: (n) => <Still src={GR + "cityhall.jpg"} n={n} s0={1.2} s1={1.3} fx={0.72} fy={0.45} /> },
  { a: 117.0, b: 122.22, vo: "... aftershocks over the next three weeks. The whole province was placed under a state of calamity. (collapsed homes)",
    node: (n) => <Still src={GR + "village.jpg"} n={n} s0={1.04} s1={1.14} fx={0.4} fy={0.6} /> },
  { a: 122.22, b: 132.0, vo: "The death toll went up and down ... settled at 79 people, with more than 550 injured. (LampScan on GMA)",
    node: () => <LampScan bg={GR + "village.jpg"} sheet={GR + "gma_sheet.png"} sw={1648} sh={956} credit="GMA News Online · October 17, 2025"
      spots={[{ f: 0, y: 290, h: 470 }, { f: 168, y: 290, h: 470 }, { f: 200, y: 738, h: 320 }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(16.92), kind: "blurDip", len: 10 }, { at: F(19.76), kind: "blurDip", len: 10 },
  { at: F(28.53), kind: "glitch", len: 10 },
  { at: F(56.28), kind: "blurDip", len: 12 },
  { at: F(71.90), kind: "blurDip", len: 12 }, { at: F(83.90), kind: "blurDip", len: 12 },
  { at: F(85.93), kind: "blurDip", len: 10 }, { at: F(90.73), kind: "blurDip", len: 10 },
  { at: F(92.84), kind: "glitch", len: 10 }, { at: F(105.36), kind: "glitch", len: 10 },
  { at: F(122.22), kind: "blurDip", len: 12 },
];

const def: CaseDef = {
  title: "THE BRIDGE TO MACTAN", titleBg: GR + "title.jpg", vo: "vor/CASE17.mp3", clean: C + "media/main_clean.wav", dur: 132.0,
  shots: SHOTS, cuts: CUTS,
  parts: [[4.0, 0, 28.28], [56.28, 28.28, 43.90], [83.90, 43.90, null]],
  raws: [{ a: 32.28, b: 56.28, src: 0.0, g: 5, duck: 0.25 }, { a: 71.90, b: 83.90, src: 98.0, g: 5, duck: 0.3 }],
  sfx: [[3.95, "sfx_n2/glitch_02.wav", -24], [28.48, "sfx_n2/glitch_01.wav", -30], [92.8, "sfx_n2/glitch_03.wav", -30], [105.3, "sfx_n2/glitch_01.wav", -30],
    [122.25, "sfx_n2/real/paper_2.wav", -26]],
  beds: [],
  music: { file: "music/Music 3.mp3", db: -19, passes: [[4.0, 76.0, 12], [75.0, 132.0, 40]] },
};

export const Comp: React.FC = () => <CaseRunner c={def} />;
