// Amusement Parks Iceberg #11 (LEVEL 2, case 4) — Sailing Ship Columbia, Frontierland dock, Disneyland, Anaheim, Thu 24 Dec 1998:
// the docking line was looped round the bow cleat while the ship was still moving; the cleat's bolts sheared and ~9 lb of iron was flung
// into the boarding line. Luan Phi Dawson (33) died two days later; his wife and the cast member were hurt. Cal/OSHA (Mar 1999): no
// 8-hour training, an overloaded cleat with bolts already bent; $12,500; settlement reportedly ~$25M; ride reopened 28 Jun 1999.
// No footage of the incident exists: NO RAWS. The VO take runs straight through over silent footage, stills and three devices:
// RiverLoop (NAIP aerial, the Columbia's circuit), LineTaut (the 2014 photo of the bow at the landing: the line, the cleat, the tear),
// LensRead (the Seattle Times report on the Cal/OSHA findings under a loupe).
// Footage: [dl8] a family's 8mm Disneyland reel (archive.org disneyland-8mm-home-movie; src 129.4-149.8 -> dl8.mp4: river-bank crowds
// file 0-12.4, the Columbia under sail file 13.3-20.0; sprocket border cropped); [foley] Helen L. Foley's 1958 Disneyland home movie
// (archive.org 2022.3.6-foley-di, Public Domain Mark; src 2.6-30.6 -> foley.mp4, river file 9.4-16.4); [xmas] a family's December 2000
// Disneyland tape (archive.org capture-a-4690; src 725-760 -> xmas.mp4, the Town Square tree ~file 13, crowds ~file 25).
// Timeline: T = v + 4.0 (VO take from 4.0, no level line in this take). Last word v 97.34 -> T 101.34.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { RiverLoop } from "../dev/AM11_RiverLoop";
import { LineTaut } from "../dev/AM11_LineTaut";
import { LensRead } from "../dev/AM11_LensRead";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0;
const T = (v: number) => +(v + TC).toFixed(3);
export const DUR = F(102.7);
const fv = (v0: number, v: number) => Math.round((v - v0) * 30); // frame inside a device that starts at v0

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; dim?: number; node?: React.ReactNode; over?: React.ReactNode };

// NAIP (3000x2400, bbox -117.9250,33.8090 .. -117.9175,33.8150): the river channel loop round Tom Sawyer Island, from the Frontierland
// landing (the Columbia is moored there in the image) clockwise back to it.
const LOOP: [number, number][] = [[1640, 1050], [1625, 985], [1570, 930], [1495, 885], [1430, 840], [1400, 770], [1382, 700], [1370, 625], [1345, 560], [1295, 508], [1200, 498], [1122, 518], [1078, 580], [1095, 680], [1132, 790], [1180, 880], [1230, 960], [1278, 1040], [1320, 1130], [1365, 1215], [1420, 1285], [1500, 1322], [1590, 1318], [1655, 1272], [1685, 1200], [1670, 1120], [1640, 1050]];

const S: Sh[] = [
  { a: 0, b: 4.26, vo: "The Sailing Ship Columbia is a 110-foot replica tall ship (the full ship, tilt up the masts)", src: "ship.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.5, panY: [-220, 160],
    over: <RedLabel text="THE SAILING SHIP COLUMBIA" at={F(0.5)} hold={F(2.7)} /> },
  { a: 4.26, b: 7.78, vo: "that's circled the Rivers of America at Disneyland on an underwater rail (RiverLoop)",
    node: <RiverLoop src={GR + "naip.jpg"} iw={3000} ih={2400} path={LOOP} box={[1625, 990, 1715, 1110]} cam={[1380, 910, 1750, 1540, 990, 1350]} drawAt={4} drawLen={66} boxAt={78} />,
    over: <RedLabel text="RIVERS OF AMERICA, DISNEYLAND" at={F(0.5)} hold={F(2.6)} /> },
  { a: 7.78, b: 9.56, vo: "since 1958. (a 1958 home movie on the river)", src: "foley.mp4", from: 10.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <RedLabel text="1958" at={F(0.25)} hold={F(1.2)} /> },
  { a: 9.56, b: 11.67, vo: "On Christmas Eve in 1998, (the Town Square tree at night, a December home video)", src: "xmas.mp4", from: 20.0, s0: 1.04, s1: 1.1, fx: 0.48, fy: 0.45,
    over: <RedLabel text="DECEMBER 24, 1998" at={F(0.2)} hold={F(1.7)} /> },
  { a: 11.67, b: 14.72, vo: "holiday crowds were packed onto the Frontierland dock, (crowds along the river, 8mm)", src: "dl8.mp4", from: 0.8, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55,
    over: <RedLabel text="FRONTIERLAND DOCK" at={F(1.85)} hold={F(1.1)} /> },
  { a: 14.72, b: 16.16, vo: "waiting to board her. (the Columbia moored at the landing)", src: "docked.jpg", still: true, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.6 },
  { a: 16.16, b: 20.37, vo: "Luan Phi Dawson was in that line with his wife, Lieu Thuy Vuong. (the crowd on the bank, 8mm)", src: "dl8.mp4", from: 6.4, s0: 1.06, s1: 1.13, fx: 0.45, fy: 0.55,
    over: <><RedLabel text="LUAN PHI DAWSON, 33" at={F(0.15)} hold={F(2.5)} /><RedLabel text="LIEU THUY VUONG" at={F(2.85)} hold={F(1.2)} /></> },
  { a: 20.37, b: 23.87, vo: "He'd escaped Vietnam and become a Microsoft engineer. (Vietnamese boat people, US Navy photo 1984)", src: "boat.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.42 },
  { a: 23.87, b: 25.6, vo: "The ship came in, (the Columbia under sail, 8mm)", src: "dl8.mp4", from: 13.4, s0: 1.02, s1: 1.06, fx: 0.55, fy: 0.5 },
  { a: 25.6, b: 40.24, vo: "and a cast member looped a mooring line around a cast-iron cleat ... The cleat's bolts sheared, and about nine pounds of iron tore out of the hull (LineTaut)",
    node: <LineTaut src={GR + "c2014.jpg"} iw={4928} ih={2772} post={[3310, 2245]} cleat={[2905, 1932]}
      cam={[{ at: 0, cx: 3000, cy: 1900, w: 2600 }, { at: 70, cx: 3020, cy: 2020, w: 1500 }, { at: 125, cx: 2930, cy: 1960, w: 820 }, { at: 175, cx: 2960, cy: 1990, w: 900 },
        { at: 240, cx: 3090, cy: 2080, w: 1180 }, { at: 365, cx: 3100, cy: 2090, w: 1120 }, { at: 439, cx: 3180, cy: 2140, w: 1500 }]}
      drawAt={fv(25.6, 26.05)} boxAt={fv(25.6, 28.08)} creep={[fv(25.6, 31.4), fv(25.6, 33.2)]} tautAt={[fv(25.6, 33.37), fv(25.6, 34.1)]} snapAt={fv(25.6, 38.0)} dimAt={fv(25.6, 39.2)} /> },
  { a: 40.24, b: 42.63, vo: "and into the boarding line. (the crowd on the bank, dim)", src: "dl8.mp4", from: 10.0, s0: 1.1, s1: 1.14, fx: 0.5, fy: 0.6, dim: 0.55 },
  { a: 42.63, b: 46.96, vo: "It struck Dawson and his wife in the head, and the cast member was hurt too. (the dark river, 1958)", src: "foley.mp4", from: 13.6, s0: 1.08, s1: 1.15, fx: 0.5, fy: 0.6, dim: 0.5 },
  { a: 46.96, b: 52.8, vo: "Dawson never regained consciousness and died two days later. His wife survived, badly hurt. (the Columbia moored, still)", src: "c2022.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5, dim: 0.7 },
  { a: 52.8, b: 63.58, vo: "In March 1999, Cal OSHA ... found that Disney's own manual required eight hours of training before anyone worked the Columbia. (LensRead: Seattle Times)",
    node: <LensRead page={C + "shots/seattle_sheet.png"} pw={2560} ph={1720} bg={GR + "dl8.mp4"} bgFrom={14}
      keys={[{ at: 0, x: 330, y: 240, k: 0.62 }, { at: fv(52.8, 54.6), x: 880, y: 122, k: 0.62 }, { at: fv(52.8, 58.2), x: 360, y: 1112, k: 0.68 }, { at: fv(52.8, 61.5), x: 470, y: 1118, k: 0.7 }]}
      rule={{ box: [270, 1104, 868, 1138], at: fv(52.8, 60.1) }} /> },
  { a: 63.58, b: 67.76, vo: "The employee on the dock hadn't had it, and she'd never docked the ship before. (the landing)", src: "docked.jpg", still: true, s0: 1.25, s1: 1.33, fx: 0.15, fy: 0.75 },
  { a: 67.76, b: 71.52, vo: "Her first try came on Christmas Eve, in front of a packed dock, (the boarding queue at the Columbia sign, 1985)", src: "queue1985.jpg", still: true, s0: 1.02, s1: 1.09, fx: 0.55, fy: 0.6 },
  { a: 71.52, b: 73.31, vo: "and I doubt I'd have done better. (the rigging)", src: "ship.jpg", still: true, s0: 1.5, s1: 1.58, fx: 0.5, fy: 0.3 },
  { a: 73.31, b: 77.6, vo: "The second finding was worse. That cleat was built to hold a ship at rest, (the Columbia at the landing, wide)", src: "c2014.jpg", still: true, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 77.6, b: 79.22, vo: "not to stop a moving one, (the Columbia under sail)", src: "dl8.mp4", from: 15.0, s0: 1.02, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 79.22, b: 81.45, vo: "and its bolts were already bent. (the bow, tight)", src: "c2014.jpg", still: true, s0: 2.6, s1: 2.75, fx: 0.585, fy: 0.69 },
  { a: 81.45, b: 87.13, vo: "Disney disputed the report but paid $12,500, the most the law allowed then, (the stern at the landing)", src: "docked.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 87.13, b: 91.68, vo: "and the family's lawsuit reportedly settled for around $25 million. (the Columbia moored, later)", src: "c2022.jpg", still: true, s0: 1.12, s1: 1.2, fx: 0.5, fy: 0.3 },
  { a: 91.68, b: 94.51, vo: "The Columbia still sails, and after that day, (the Columbia under sail, 8mm)", src: "dl8.mp4", from: 17.2, s0: 1.04, s1: 1.08, fx: 0.55, fy: 0.5 },
  { a: 94.51, b: 98.7, vo: "dock crews were barred from stopping her with a rope. (the landing's sign and rail; fade)", src: "c2014.jpg", still: true, s0: 2.0, s1: 2.1, fx: 0.66, fy: 0.75 },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(T(25.6)), kind: "blurDip", len: 12 },  // 8mm -> the photo device
  { at: F(T(52.8)), kind: "blurDip", len: 12 },  // into the report
];
const SFX: [number, string, number, number?][] = [
  [0.0, "sfx_n2/whoosh_02.wav", -24],
  [TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(37.98), "sfx_n2/real/metal_clank_2.wav", -19],
  [T(52.8), "sfx_n2/real/paper_2.wav", -24],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><AbsoluteFill style={{ filter: s.dim ? `brightness(${s.dim}) saturate(${0.6 + 0.4 * s.dim})` : undefined }}>
    <Shot_FX src={GR + s.src!} still={s.still} n={F(T(s.b)) - F(T(s.a))} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} /></AbsoluteFill></FilmLook_FX>;
};

const END = T(97.34) + 0.2;
export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="SAILING SHIP COLUMBIA" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {S.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><FadeBlack len={DUR - F(END)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3 (-14.1 LUFS file) at -20 dB ≈ 10 LU under the VO */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(20)} volume={(f) => dB(-20) * interpolate(f / 30, [0, 1.5, DUR / 30 - 1.8, DUR / 30], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
