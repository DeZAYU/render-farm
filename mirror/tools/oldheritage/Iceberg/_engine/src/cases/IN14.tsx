// Incidents #14 — Redondo Beach Pier, California, 30 Mar 2017 just after 7 p.m.: a 24-ft sailboat with four aboard, out of King Harbor in
// high wind, is pushed onto the pier and rolled into the pilings by a wave; all four reach the rocks. One camera: Jason Wells on the pier,
// his full upload (AdYTGre3fAA, 8:49; the 42-s cut Isufp-6fudo failed the bot check and isn't needed). graded/a = src 40-185,
// graded/b = src 240-330. Audio: wind and the pier (rawclean.py: no music). Source cuts: src 160.37, 181.5 (+ a dissolve ~140.7).
// VO = CASE14.mp3 split at three raws (sentence ends):
//   A 0-14.31 @4.0 | R0 src 100-108 (heeled over in the whitecaps, the wind) | B 14.31-40.81 | R1 src 123.0-140.4 (main: the boat
//   alongside the pilings, the wave stands up, rolls it into the pier, the hull under the boards) | C 40.81-52.85 | R2 src 254-268
//   (heads in the surf between the pilings and the rocks) | D 52.85-end.
// Devices: HarbourGap (NAIP: breakwater traced, measured gap to the pier), WireSheet (the AP story, "lucky to be alive" paragraph lifts).
import React from "react";
import { RedLabel } from "../brand";
import { Cam } from "../dev/DC01_kit";
import { CaseLayout, F, K, type Raw, type Sh } from "../dev/IN11_kit";
import { TitleCard } from "../brand";
import { HarbourGap } from "../dev/IN14_HarbourGap";
import { WireSheet } from "../dev/IN14_WireSheet";
import type { FxCut } from "../lib/templates/n2fx/fx";

const GR = "case/graded/", A = GR + "a.mp4", B = GR + "b.mp4"; // a: src 40 = 0, b: src 240 = 0
const a = (s: number) => s - 40, b = (s: number) => s - 240;
export const DUR = F(121.95);

const SHOTS: Sh[] = [
  { a: 4.0, b: 9.5, vo: "On March 30, 2017, just after seven in the evening, (the boat far out in the chop at sunset)",
    node: (n) => <Cam src={A} from={a(60)} keys={K(n, [1.25, 0.4, 0.4], [1.4, 0.38, 0.4])} />, over: <RedLabel text="MARCH 30, 2017" at={F(0.5)} hold={F(4.2)} /> },
  { a: 9.5, b: 15.15, vo: "a 24-foot sailboat left King Harbor in Redondo Beach, California, with four people aboard, all in life jackets. (closer: the crew aboard)",
    node: (n) => <Cam src={A} from={a(84)} keys={K(n, [1.35, 0.6, 0.5], [1.55, 0.6, 0.5])} />, over: <RedLabel text="REDONDO BEACH, CALIFORNIA" at={F(0.6)} hold={F(4.3)} /> },
  { a: 15.15, b: 18.41, vo: "The wind was howling, and the sea was white with chop. (wide: whitecaps)", node: (n) => <Cam src={A} from={a(92)} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.55, 0.5])} /> },
  { a: 18.41, b: 26.41, vo: "RAW 0 (src 100-108)", node: (n) => <Cam src={A} from={a(100)} keys={K(n, [1.1, 0.55, 0.5], [1.2, 0.6, 0.5])} /> },
  { a: 26.41, b: 34.11, vo: "They couldn't get back behind the breakwater. Every gust shoved the boat sideways toward the pier, (HarbourGap)",
    node: (n) => <HarbourGap src={GR + "naip.jpg"} iw={2400} ih={1350} n={n} z0={1.0} z1={1.55} f0={[1250, 520]} f1={[1470, 660]}
      wall={[[875, 0], [988, 238], [1075, 350], [1200, 478], [1375, 600]]} wallAt={14} gap={[[1375, 600], [1600, 745]]} gapAt={F(3.0)} gapText="ABOUT 300 METRES"
      pier={[[1565, 605], [1735, 605], [1735, 845], [1565, 845]]} pierAt={F(4.6)}
      labels={[{ text: "KING HARBOR", at: F(0.4), hold: F(3.6), y: 0.12 }, { text: "REDONDO BEACH PIER", at: F(4.8), hold: F(2.6), y: 0.88 }]} /> },
  { a: 34.11, b: 38.87, vo: "where people were gathering at the railing, and one of them, Jason Wells, stopped his electric unicycle and started filming. (the pier, crowd along the rail)",
    node: (n) => <Cam src={A} from={a(170)} keys={K(n, [1.2, 0.5, 0.3], [1.32, 0.45, 0.28])} />, over: <RedLabel text="FILMED BY JASON WELLS" at={F(1.2)} hold={F(3.0)} /> },
  { a: 38.87, b: 44.17, vo: "From up there, it's easy to see where this ends ... (the boat below, the pilings top left)",
    node: (n) => <Cam src={A} from={a(108.5)} keys={K(n, [1.05, 0.4, 0.4], [1.18, 0.35, 0.38])} /> },
  { a: 44.17, b: 53.01, vo: "They're fighting the sail as the boat slides in under the outer pilings ... Then a bigger wave stands up behind them. (alongside the pilings, runs straight into the raw)",
    node: (n) => <Cam src={A} from={a(114.17)} keys={K(n, [1.15, 0.6, 0.55], [1.0, 0.5, 0.5])} /> },
  // RAW 1 (main): the wave stands up, rolls the boat into the pilings, the hull under the boards
  { a: 53.01, b: 70.41, vo: "RAW 1 (src 123.0-140.4)", node: () => <Cam src={A} from={a(123.0)} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 70.41, b: 74.8, vo: "The impact shook the pier, Wells said, and he was almost on top of it. (0.5x replay of the roll into the pilings, pushing in)",
    node: (n) => <Cam src={A} from={a(135.6)} rate={0.5} keys={K(n, [1.2, 0.45, 0.5], [1.55, 0.4, 0.55])} /> },
  { a: 74.8, b: 82.55, vo: "Now there are four heads in the white water between the wooden pilings and the rocks, ... swim for shore. (the surf by the pilings)",
    node: (n) => <Cam src={B} from={b(246)} keys={K(n, [1.15, 0.45, 0.6], [1.35, 0.4, 0.62])} /> },
  // RAW 2: the heads in the surf, the wind, the pier
  { a: 82.55, b: 96.55, vo: "RAW 2 (src 254-268)", node: (n) => <Cam src={B} from={b(254)} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.45, 0.55])} /> },
  { a: 96.55, b: 101.91, vo: "One by one, the sailors made it in to the rocks, where lifeguards and firefighters were arriving. (the rocks, wading in)",
    node: (n) => <Cam src={B} from={b(312)} keys={K(n, [1.1, 0.4, 0.55], [1.22, 0.38, 0.6])} /> },
  { a: 101.91, b: 115.71, vo: "The captain and another man went to the hospital ... Rappaport said they were lucky to be alive, ... (WireSheet: AP / Yahoo News)",
    node: (n) => <WireSheet bg={B} bgFrom={b(320)} sheet={GR + "ap_sheet.png"} sw={1560} sh={1319} n={n} para={[140, 1129, 1450, 1259]} liftAt={F(8.4)} y0={330} y1={1120} /> },
  { a: 115.71, b: 121.95, vo: "As for the boat, it broke apart on those pilings, and it didn't even turn up in the first search. (empty pilings in the surf)",
    node: (n) => <Cam src={A} from={a(170)} keys={K(n, [1.6, 0.4, 0.62], [1.8, 0.38, 0.66])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(18.41), kind: "blurDip", len: 10 },
  { at: F(26.41), kind: "glitch", len: 10 },   // into the aerial
  { at: F(34.11), kind: "glitch", len: 10 },   // back to the pier
  { at: F(38.87), kind: "blurDip", len: 10 },
  { at: F(44.17), kind: "blurDip", len: 10 },
  { at: F(70.41), kind: "blurDip", len: 14 },  // raw -> slow replay
  { at: F(74.8), kind: "blurDip", len: 12 },
  { at: F(82.55), kind: "blurDip", len: 10 },
  { at: F(96.55), kind: "blurDip", len: 12 },
  { at: F(101.91), kind: "blurDip", len: 12 }, // into the page
  { at: F(115.71), kind: "blurDip", len: 12 }, // out of the page
];
const PART: [number, number, number | null][] = [[4.0, 0, 14.31], [26.41, 14.31, 40.81], [70.41, 40.81, 52.85], [96.55, 52.85, null]];
const RAWS: Raw[] = [
  { a: 18.41, b: 26.41, s: a(100), wav: "case/media/a_clean.wav", g: -2, duck: 0.2 },
  { a: 53.01, b: 70.41, s: a(123.0), wav: "case/media/a_clean.wav", g: 0, duck: 0.1 },
  { a: 82.55, b: 96.55, s: b(254), wav: "case/media/b_clean.wav", g: 0, duck: 0.15 },
];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_03.wav", -24], [26.36, "sfx_n2/glitch_01.wav", -30], [34.06, "sfx_n2/glitch_02.wav", -30],
  [101.95, "sfx_n2/real/paper_2.wav", -26], [110.3, "sfx_n2/real/paper_3.wav", -28],
];

export const Comp: React.FC = () => (
  <CaseLayout vo="vor/CASE14.mp3" tDur={4.0} dur={DUR}
    title={<TitleCard dur={F(4.0)} title="THE SAILBOAT AND THE PIER" bg={GR + "title.jpg"} />}
    shots={SHOTS} cuts={CUTS} parts={PART} raws={RAWS} sfx={SFX}
    music={{ file: "music/Music 5.mp3", db: -13, passes: [[4.0, 121.95, 4]] }} />
);
