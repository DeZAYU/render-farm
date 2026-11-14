// Tornado #18: Frankfort, Kentucky (6 Dec 2021, 4:10 AM EST): the tornado nobody warned about. One camera: the family's UniFi doorbell
// camera (NWS Louisville release ZousteWoWOQ), 1440x1080 IR, UniFi logo + clock delogo'd (the clock is shown once, unaltered, in the
// StampLoupe). Devices for THIS case: StampLoupe (the camera's own clock = "before dawn"), RadarSweep (real 4:10 AM radar, the beam turns
// once while the sub-30-second tornado comes and goes between passes), SkipPath (NWS survey path to scale on NAIP, outside the Census city
// limits, lifting once and ending on US 127). VO = one take ("Eighteen." removed), split for the two kept raws.
// Source cuts: 22.13-22.2 (dark frame), 61.17. Windows: raw1 8-11, 14.5, 0.8, 23, raw2 47-56, 32, raw3 62-78.2, replay 69-71.4 (0.5x),
// 80, 86.5, 92 (inset), 95.8-101.6.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { StampLoupe } from "../dev/TOR18_StampLoupe";
import { RadarSweep } from "../dev/TOR18_RadarSweep";
import { SkipPath } from "../dev/TOR18_SkipPath";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(77.8);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

const LIMITS: [number, number][] = [[3271, 1522], [3263, 1506], [3248, 1491], [3234, 1474], [3214, 1451], [3202, 1433], [3183, 1410], [3167, 1391], [3154, 1373], [3142, 1374], [3109, 1379], [3092, 1379], [3051, 1378], [3019, 1373], [2972, 1352], [2930, 1333], [2901, 1319], [2877, 1308], [2852, 1280], [2835, 1266], [2809, 1247], [2794, 1236], [2778, 1224], [2752, 1204], [2714, 1175], [2690, 1161], [2674, 1153], [2632, 1133], [2626, 1150], [2586, 1238], [2567, 1280], [2554, 1307], [2540, 1331], [2526, 1353], [2514, 1374], [2508, 1386], [2499, 1401], [2480, 1424], [2470, 1412], [2460, 1423], [2449, 1435], [2438, 1447], [2428, 1459], [2418, 1470], [2402, 1487], [2380, 1512], [2368, 1528], [2354, 1535], [2341, 1544], [2323, 1553], [2305, 1553], [2270, 1545], [2248, 1541], [2219, 1540], [2205, 1543], [2187, 1558], [2186, 1571], [2154, 1571], [2137, 1571], [2110, 1571], [2122, 1600], [2097, 1601], [2043, 1599], [2026, 1674], [2022, 1685], [2028, 1711], [2025, 1725], [2021, 1740], [2021, 1758], [2007, 1763], [1966, 1768], [1968, 1809], [1934, 1792], [1920, 1776], [1904, 1771], [1844, 1781], [1837, 1715], [1731, 1714], [1745, 1749], [1728, 1762], [1719, 1770], [1721, 1784], [1734, 1797], [1752, 1797], [1765, 1804], [1780, 1830], [1793, 1853], [1818, 1887], [1879, 1849], [1871, 1873], [1855, 1891], [1835, 1909], [1825, 1921], [1809, 1936], [1791, 1925], [1780, 1932], [1769, 1939], [1760, 1931], [1751, 1920], [1730, 1901], [1723, 1890], [1708, 1881], [1692, 1888], [1679, 1895], [1666, 1902], [1642, 1915], [1622, 1925], [1627, 1937]];
const ROAD: [number, number][] = [[2436, 0], [2410, 120], [2370, 220], [2310, 320], [2250, 430], [2190, 540], [2160, 660], [2180, 740], [2230, 820], [2300, 920], [2360, 1000], [2410, 1080], [2430, 1160], [2400, 1240], [2340, 1300], [2290, 1360], [2270, 1440], [2290, 1520], [2350, 1600], [2400, 1680], [2390, 1760]];

// VO-A take 1.06-11.79 at 4.16 (+3.10) | VO-B take 11.79-25.62 at 24.40 (+12.61) | VO-C take 25.62-end at 55.00 (+29.38)
const SHOTS: Sh[] = [
  // 3 Nov: the 3 s calm-porch cold open (raw 1) removed: the VO starts right after the title over the porch camera's own frame
  { a: 4.0, b: 7.68, vo: "Before dawn on Monday the 6th of December 2021, (the camera's own clock, frozen, bracketed)",
    node: <StampLoupe src={GR + "ring_ts.jpg"} iw={1440} ih={1080} box={[2, 1, 284, 26]} bracketAt={10} pushAt={24} pushLen={44} zEnd={4.6} /> },
  { a: 7.68, b: 10.23, vo: "at a house north of Frankfort, Kentucky.", src: "ring.mp4", from: 14.5, s0: 1.04, s1: 1.09, fx: 0.55, fy: 0.55,
    over: <RedLabel text="FRANKFORT, KENTUCKY" at={F(0.35)} hold={F(1.9)} /> },
  { a: 10.23, b: 12.04, vo: "The family inside is asleep. (reframed on the door side of the porch)", src: "ring.mp4", from: 0.8, s0: 1.32, s1: 1.36, fx: 0.18, fy: 0.5 },
  { a: 12.04, b: 15.1, vo: "No warning had been issued, not even a watch.", src: "ring.mp4", from: 23.0, s0: 1.06, s1: 1.12, fx: 0.5, fy: 0.6 },
  // RAW 2 (15.1-24.1): the rain building across the porch
  { a: 15.1, b: 24.1, vo: "RAW: rain streaks building", src: "ring.mp4", from: 47.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.6 },
  { a: 24.1, b: 28.17, vo: "A Scott County official passed on the Weather Service's explanation.", src: "ring.mp4", from: 32.0, s0: 1.14, s1: 1.2, fx: 0.62, fy: 0.55 },
  { a: 28.17, b: 38.5, vo: "This tornado formed along a line of storms ... it was already gone. (radar sweep)",
    node: <RadarSweep base={GR + "night.jpg"} radar={C + "assets/radar_0910.png"} iw={2400} ih={1350} site={[817.6, 776.1]} town={[1197.2, 674.6]}
      a0={17.5} period={244} blip={[71, 140]} z0={1.0} z1={1.32} townLabel="FRANKFORT" townAt={12} stamp="NWS RADAR, 4:10 AM" stampAt={165} /> },
  // RAW 3 (38.5-54.7): the tornado reaches the porch, debris thrown in every direction (uncut, its own sound)
  { a: 38.5, b: 54.7, vo: "RAW: debris flying across and into the camera", src: "ring.mp4", from: 62.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 54.7, b: 57.5, vo: "EF1, about ninety miles an hour. (the hit again, 0.5x)", src: "ring_replay.mp4", from: 0.3, s0: 1.12, s1: 1.22, fx: 0.45, fy: 0.55 },
  { a: 57.5, b: 61.2, vo: "It's just outside the city limits, off Highway 127. (NWS path to scale)",
    node: <SkipPath src={GR + "naip.jpg"} iw={3200} ih={1800} focus={[1850, 950]} z0={1.0} z1={1.14}
      segs={[[[1142, 1132], [2016, 634]], [[2104, 584], [2190, 537]]]} width={24} pathAt={2} pathLen={34}
      limits={LIMITS} limitsAt={24} limitsLabel="CITY LIMITS" limitsLabelPt={[2880, 1450]}
      road={ROAD} roadAt={58} roadLabel="US 127" roadLabelPt={[2560, 380]} /> },
  { a: 61.2, b: 65.55, vo: "The family woke to what sounded like bangs around the house and headed for the basement.", src: "ring.mp4", from: 80.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 65.55, b: 70.02, vo: "Carrie Beth Tigges said the ceiling came down while she was getting into her bedroom doorway. (insulation and roof pieces)", src: "ring.mp4", from: 86.5, s0: 1.2, s1: 1.27, fx: 0.4, fy: 0.55 },
  { a: 70.02, b: 71.84, vo: "It tore away part of the roof. (a piece of it, framed)",
    node: <Inset src={GR + "ring.mp4"} from={92.0} box={0.6} pos="50% 62%" drift={0.08} /> },
  { a: 71.84, b: 77.8, vo: "Every other family on this list got a few seconds to choose something. This one was asleep. (the porch after)", src: "ring.mp4", from: 95.8, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.55 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.68), kind: "blurDip", len: 12 },
  { at: F(10.23), kind: "blurDip", len: 10 },
  { at: F(12.04), kind: "blurDip", len: 12 },
  { at: F(15.1), kind: "blurDip", len: 10 },
  { at: F(24.1), kind: "blurDip", len: 12 },
  { at: F(28.17), kind: "glitch", len: 8 },
  { at: F(54.7), kind: "blurDip", len: 12 },
  { at: F(57.5), kind: "whip", len: 10 },
  { at: F(65.55), kind: "blurDip", len: 12 },
  { at: F(71.84), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const RAWS: [number, number, number, number, string][] = [ // timeline a, b, source from, level dB, rawclean file
  [15.1, 24.1, 47.0, -1, "rw2_clean.wav"], [38.5, 54.7, 62.0, -1, "rw3_clean.wav"],
];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [28.15, "sfx_n2/glitch_03.wav", -28],
  [57.48, "sfx_n2/whoosh_01.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE TORNADO NOBODY WARNED ABOUT" bg={GR + "ring_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the raws play; nothing but music under it */}
      <Sequence from={F(4.16)} durationInFrames={F(11.79) - F(1.06)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(1.06)} /></Sequence>
      <Sequence from={F(24.4)} durationInFrames={F(25.62) - F(11.79)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(11.79)} /></Sequence>
      <Sequence from={F(55.0)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(25.62)} /></Sequence>
      {/* the doorbell camera's own sound (rawclean.py windows, guide 5b), raw windows only, out before the VO */}
      {RAWS.map(([a, b, from, d, wav], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + wav)} startFrom={0} volume={(f) => dB(d) * interpolate(f, [0, 4, F(b - a) - 16, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (not used by the neighbours), low under raw 2, out for the climax, back for the aftermath */}
      <Sequence from={0} durationInFrames={F(38.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(6)} volume={(f) => dB(-21.5) * interpolate(f, [0, 20, F(14.8), F(15.6), F(23.6), F(24.6), F(36.6), F(38.5)], [0, 1, 1, 0.45, 0.45, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(55.2)} durationInFrames={F(77.8) - F(55.2)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(52)} volume={(f) => dB(-22.5) * interpolate(f, [0, F(2.5), F(20.6), F(22.6)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
      {/* end: fade the last picture down */}
      <Sequence from={F(77.0)} layout="none"><FadeOut n={F(0.8)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);

const FadeOut: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />;
};
