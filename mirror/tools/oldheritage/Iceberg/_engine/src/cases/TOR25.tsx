// Tornado #25 — Dickinson County, Kansas: ninety minutes with the Chapman wedge (25 May 2016, upper-end EF4). The finale and the longest
// case. Two chasers' cameras: MAYNARD (Zz635RHnCEc, 25 fps: the funnel forming, touchdown, the wedge beside the road, I-70) and ALLY
// (FJvFlhqD_3A: the wedge beside the wind turbines, "get down the road", the wide wedge). Each source's windows are concatenated into ONE
// file (media/may.mp4, ally.mp4 via assets/cat.py) and graded with one LUT, so a source never changes colour between windows.
// Devices built for this case: RibbonPath (the 25-mile track as a
// to-scale ribbon on NAIP, thinning where it weakened near Abilene and swelling to the EF4 farmstead SW of Chapman), PrintBrackets
// (the NWS survey photo of the farmhouse as a print: flat, the brick bracketed, the rubble). VO = one take, split only for the raws (4 after the 3 Nov audit).
// Source cuts (srccuts): MAY 135.96 141.92 224.8 235.36 328.24 439.48 466.32 473.2 485.12 511.76 521.12 543.0 554.76;
// ALLY 194.86 272.14 283.65 295.03 394.93 400.47 406.17 438.34. Every window below starts >= 0.7 s after one and never crosses one.
// Ally's crew swears at 459.0: raw 5 ends at 457.8.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { RibbonPath } from "../dev/TOR25_RibbonPath";
import { PrintBrackets } from "../dev/TOR25_PrintBrackets";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(163.4);

// source seconds -> seconds in the concatenated file (windows exactly as cut by assets/cat.py)
const mapper = (wins: [number, number][]) => (t: number) => {
  let o = 0;
  for (const [a, b] of wins) { if (t >= a && t <= b) return o + (t - a); o += b - a; }
  throw new Error(`source time ${t} is outside the cut windows`);
};
const MAY = mapper([[60, 128.2], [142.5, 146.6], [211.8, 224.5], [299.5, 305.8], [328.8, 334.5], [371.8, 375.2], [440.5, 447], [473.8, 480], [491.5, 498.5], [521.5, 535.2], [545.5, 551.2]]);
const ALLY = mapper([[237.5, 243.5], [254.8, 271.8], [312.8, 325.7], [406.9, 411], [443.8, 458], [469.8, 473.2], [529.5, 538.5]]);

type Sh = { a: number; b: number; vo: string; src?: "may.mp4" | "ally.mp4" | "ally_slow.mp4"; at?: number; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const m = (a: number, b: number, vo: string, at: number, s0 = 1.02, s1 = 1.08, fx = 0.5, fy = 0.5, over?: React.ReactNode): Sh => ({ a, b, vo, src: "may.mp4", at, s0, s1, fx, fy, over });
const y = (a: number, b: number, vo: string, at: number, s0 = 1.02, s1 = 1.08, fx = 0.5, fy = 0.5, over?: React.ReactNode): Sh => ({ a, b, vo, src: "ally.mp4", at, s0, s1, fx, fy, over });

// NAIP 3000x1050 (EPSG:3857, bbox -97.48,38.88,-96.93,39.03); track traced from the NWS Topeka track map (georeferenced on
// Solomon / Abilene / Chapman / Enterprise), widths in image px (~15.9 m/px: 52 px = 900 yd), following the survey's segment ratings
const TRACK: [number, number][] = [[234, 279], [581, 262], [884, 217], [987, 241], [1178, 296], [1405, 285], [1493, 279], [1979, 412], [2082, 473], [2302, 500], [2385, 527], [2552, 524], [2670, 531], [2832, 555]];
const WIDTH = [8, 20, 36, 32, 22, 38, 40, 14, 22, 40, 52, 40, 24, 8];

// VO parts (take -> out): P1 0-23.36 @4.0 | P2 23.36-25.61 @38.76 | P3 25.61-34.59 @54.1 | P4 34.59-37.95 @80.5 |
// P5 37.95-52.39 @84.3 | P6 52.39-61.30 @99.2 | P7 61.30-end @121.9 (after the 3 Nov raw audit)
const SHOTS: Sh[] = [
  m(4.0, 6.25, "The last of the twenty-five is the longest. (the first lowering over the plains)", MAY(61.0), 1.0, 1.05),
  m(6.25, 9.9, "It's Wednesday the 25th of May 2016, in Kansas. (the funnel, tight)", MAY(92.0), 1.04, 1.1, 0.5, 0.55, <RedLabel text="MAY 25, 2016" at={F(0.5)} hold={F(2.8)} />),
  m(9.9, 14.25, "This one ran between Abilene, where Dwight Eisenhower grew up, and Chapman. (wide, farm and trees)", MAY(66.5), 1.0, 1.06, 0.5, 0.6, <RedLabel text="DICKINSON COUNTY, KANSAS" at={F(0.6)} hold={F(3.4)} />),
  m(14.25, 17.0, "It touched down northeast of Niles just after seven in the evening (the funnel reaching down)", MAY(98.0), 1.06, 1.12, 0.5, 0.6, <RedLabel text="7:07 PM" at={F(0.5)} hold={F(2.0)} />),
  m(17.0, 19.95, "and stayed down for ninety-three minutes. (wide)", MAY(76.0), 1.0, 1.05),
  m(19.95, 23.6, "It turned out to be the strongest tornado of the whole late-May outbreak sequence, (tight)", MAY(104.5), 1.05, 1.12, 0.5, 0.6),
  m(23.6, 27.36, "and only the second violent tornado of 2016. (wide, the trees)", MAY(111.5), 1.0, 1.05),
  // RAW 1 (27.36-38.36): "Touchdown."
  m(27.36, 38.36, "RAW: the funnel on the ground, 'Touchdown.' (117.0-128.0)", MAY(117.0), 1.0, 1.04),
  m(38.36, 41.4, "It became a wedge almost immediately. (the wedge already wide)", MAY(143.0), 1.04, 1.1),
  // RAW 2 (41.4-53.7): "That's a huge wedge."
  m(41.4, 53.7, "RAW: the huge wedge beside the road (212.0-224.3)", MAY(212.0), 1.0, 1.05),
  m(53.7, 56.1, "Upper-end EF4, a hundred and eighty miles an hour, (the wedge past the trees)", MAY(299.6), 1.02, 1.07),
  // a car crosses the lens at 302.1-302.4: the window is split round it (blur-dip)
  m(56.1, 59.2, "up to nine hundred yards wide. (the wedge, wider framing)", MAY(302.6), 1.08, 1.14),
  // the cut sheet calls the structures in ALLY 4:10 "wind turbines": they are utility / light poles in the foreground (see NOTES).
  // No device that would assert their size; the wide frame with the poles against the wedge carries the line.
  // ALLY 238.5-241.1 has a truck crossing and a zoom at 241.1: the clean 241.2-243.5 is played at 0.54x (graded/ally_slow.mp4, minterpolate)
  { a: 59.2, b: 63.5, vo: "Next to it, the wind turbines in its path look like fence posts. (the poles in front of the wedge, slowed)", src: "ally_slow.mp4" as const, at: 0.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.6 },
  // RAW 3 (63.5-80.1): the wedge beside the turbines, "Like, seriously, what is going on?"
  y(63.5, 80.1, "RAW: the wedge beside the turbines (255.0-271.6)", ALLY(255.0), 1.0, 1.05),
  m(80.1, 83.9, "The Weather Service would call it a long-track violent tornado. (the wedge over the fields)", MAY(329.5), 1.02, 1.08),
  m(83.9, 86.8, "It was the second tornado of the evening. (wide)", MAY(372.0), 1.02, 1.08),
  { a: 86.8, b: 98.8, vo: "It weakened near Abilene, then strengthened again before it reached Interstate 70. About twenty-five miles in all. Chapman itself missed a direct hit, but a farmstead about a mile southwest of town didn't. (the ribbon)",
    node: <RibbonPath src={GR + "naip_wide.jpg"} iw={3000} ih={1050} pts={TRACK} widths={WIDTH}
      draw={[{ at: F(0.2), len: F(4.4), k0: 0, k1: 0.69 }, { at: F(5.0), len: F(1.7), k0: 0.69, k1: 1 }]}
      cams={[{ at: 0, c: [620, 330], span: 1250 }, { at: F(4.6), c: [1880, 420], span: 1500 }, { at: F(5.0), c: [1880, 420], span: 1500 }, { at: F(6.7), c: [1530, 440], span: 2950 },
        { at: F(7.3), c: [1530, 440], span: 2950 }, { at: F(9.0), c: [2440, 470], span: 950 }, { at: F(12.4), c: [2415, 485], span: 820 }]}
      tags={[{ p: [1452, 790], text: "ABILENE", at: F(1.6), dy: 70 }, { p: [2030, 442], text: "I-70", at: F(3.4) }, { p: [2493, 405], text: "CHAPMAN", at: F(7.6) }, { p: [2398, 511], text: "FARMSTEAD", at: F(9.9), dy: 80 }]}
      mark={{ p: [2398, 511], at: F(9.7) }} /> },
  y(98.8, 102.4, "Days like this put chasers on every road around a storm. (chasers' cars on the road under it)", ALLY(407.0), 1.02, 1.08),
  m(102.4, 108.5, "At one point, chasers were on the interstate right alongside it, and that's closer than I'd ever want to be. (I-70, trucks)", MAY(492.0), 1.02, 1.08),
  // RAW 6 (108.5-121.5): the tornado beside I-70, debris at its base
  m(108.5, 121.5, "RAW: the tornado with debris at its base by the interstate (522.0-535.0)", MAY(522.0), 1.0, 1.05),
  m(121.5, 126.4, "The worst of the damage came after it crossed I-70 southwest of Chapman. (the debris-brown haze over the fields)", MAY(546.0), 1.02, 1.08),
  { a: 126.4, b: 141.9, vo: "That farmhouse was brick and anchor-bolted ... held the rating because the brick wasn't swept fully away. A woman in its basement survived and had to be rescued from the rubble. (NWS photo: print, brick bracketed, rubble)",
    node: <PrintBrackets src={GR + "farmhouse.jpg"} iw={1280} ih={956} flatAt={F(6.0)} flatLen={F(1.3)}
      views={[{ at: F(6.0), c: [640, 478], z: 1.0 }, { at: F(9.2), c: [840, 540], z: 1.22 }, { at: F(11.6), c: [850, 540], z: 1.28 }, { at: F(15.0), c: [560, 640], z: 1.34 }, { at: F(15.5), c: [555, 642], z: 1.35 }]}
      brackets={[{ box: [600, 455, 1130, 600], at: F(9.6), out: F(11.7) }]}
      label={{ text: "SOUTHWEST OF CHAPMAN", at: F(0.8), hold: F(4.4) }} /> },
  m(141.9, 147.4, "Nearby, a family of three rode it out in a basement bathroom while their house came down above them. (the wedge in the evening light)", MAY(441.0), 1.02, 1.08),
  m(147.4, 152.9, "The Kansas Highway Patrol counted about twenty homes and farmsteads damaged, six destroyed. (wide)", MAY(474.0), 1.02, 1.08),
  y(152.9, 155.6, "Eight people were hurt, none of them seriously. (the wedge over the wheat)", ALLY(470.0), 1.03, 1.08),
  y(155.6, 163.4, "For most of an hour and a half, this tornado stayed over open country. That's the only reason nobody was lost. (open country, wide, slow)", ALLY(530.0), 1.0, 1.07),
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  // P1 is one camera (the funnel forming): its reframes read as jumps on a hard cut, so short blur-dips join them
  { at: F(6.25), kind: "blurDip", len: 10 },
  { at: F(9.9), kind: "blurDip", len: 10 },
  { at: F(14.25), kind: "blurDip", len: 10 },
  { at: F(17.0), kind: "blurDip", len: 10 },
  { at: F(19.95), kind: "blurDip", len: 10 },
  { at: F(23.6), kind: "blurDip", len: 10 },
  { at: F(27.36), kind: "blurDip", len: 12 },  // same camera into raw 1
  { at: F(38.36), kind: "blurDip", len: 12 },
  { at: F(41.4), kind: "blurDip", len: 12 },
  { at: F(53.7), kind: "blurDip", len: 12 },
  { at: F(56.1), kind: "blurDip", len: 10 },
  { at: F(63.5), kind: "blurDip", len: 12 },  // slowed ALLY -> raw 3 (same camera)
  { at: F(83.9), kind: "blurDip", len: 12 },   // same camera, other moment (R4 removed here)
  { at: F(86.8), kind: "glitch", len: 10 },    // into the ribbon
  { at: F(98.8), kind: "zoomHit", len: 10 },   // ribbon -> the chasers' road (R5 removed here)
  { at: F(108.5), kind: "blurDip", len: 12 },
  { at: F(121.5), kind: "blurDip", len: 12 },
  { at: F(126.4), kind: "whip", len: 10 },     // into the survey photo
  { at: F(141.9), kind: "glitch", len: 10 },
  { at: F(147.4), kind: "blurDip", len: 12 },
  { at: F(155.6), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.at} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [86.75, "sfx_n2/glitch_03.wav", -27],
  [98.75, "sfx_n2/whoosh_02.wav", -30],
  [126.35, "sfx_n2/whoosh_03.wav", -28],
  [126.6, X + "paper_2.wav", -30],          // the print lands
  [136.0, X + "marker_1.wav", -34],          // the brackets close
  [141.85, "sfx_n2/glitch_01.wav", -27],
];

// raws: [out start, out end, file, source start, gain dB] — each raw's own sound through _tools/rawclean.py (music stripped,
// owner rule 5b): media/may_clean.wav / ally_clean.wav are the cleaned tracks of the concatenated files, same offsets
const RAWS: [number, number, string, number, number][] = [
  [27.36, 38.36, "may_clean.wav", MAY(117.0), 0],
  [41.4, 53.7, "may_clean.wav", MAY(212.0), -4],
  [63.5, 80.1, "ally_clean.wav", ALLY(255.0), -6],
  [108.5, 121.5, "may_clean.wav", MAY(522.0), -8],
];
// VO parts: [out, take from, take to]
// 3 Nov raw audit: R4 (after "long-track violent tornado", a near-duplicate ALLY wedge) and R5 (after the ribbon explanation) removed;
// the VO runs on with ~0.45 s pauses at the old split points.
const VO: [number, number, number][] = [[4.0, 0, 23.36], [38.76, 23.36, 25.61], [54.1, 25.61, 34.59], [80.5, 34.59, 37.95], [84.3, 37.95, 52.39], [99.2, 52.39, 61.30], [121.9, 61.30, 101.14]];
// music (Epidemic ambient Music 1, a bed not used by the neighbouring cases): under the VO sections only, out under every raw
const MUS: [number, number, number][] = [[4.0, 27.5, 8], [38.3, 41.5, 34], [53.7, 63.6, 40], [80.1, 108.6, 52], [121.5, 163.4, 84]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE CHAPMAN WEDGE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([o, a, b], i) => (
        <Sequence key={"v" + i} from={F(o)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE25.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, from, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + file)} startFrom={Math.round(from * 30)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 16, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUS.map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => dB(-16) * interpolate(f, [0, 18, F(b - a) - 24, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
