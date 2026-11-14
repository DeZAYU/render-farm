// Tornado #23 — an hour under a tornado emergency: the Elkhorn-Bennington-Blair EF4, 26 April 2024 (Douglas / Washington Co., NE).
// Footage: ADAMS (personal channel): the tornado from a patio over the fields (his own voice + wind), then the home's own security
// cameras as it arrives (lawn cam 540-655, yard cams after; whose house is never said); SLOAN (personal): the grey wedge behind the
// houses with sirens. Raw sound = rawclean'd wavs (music check) only. Devices for THIS case: LifeStrip (61 min of life, the emergency
// band 3:38-4:30 from IEM VTEC), TownChips (a 0-32.5 mi rail; an aerial chip of each town, DAT line drawn through it, flies in at
// its own mile as the VO names it), PageMacro (NWS Omaha's 29 July EF-4 upgrade, a macro read along the lines) + the climax 0.5x replay.
// Source cuts (ad): 15.27 535.5 654.63 709.23 768.37 812.17 869.63 877.07 903.23; sloan none. ad_a = src 0-200, ad_b = 200-530,
// ad_c = 540-1008 (offsets in comments are source seconds).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LifeStrip } from "../dev/TOR23_LifeStrip";
import { TownChips } from "../dev/TOR23_TownChips";
import { PageMacro } from "../dev/TOR23_PageMacro";
import { PATH, PATH_H, PATH_W, TOWNS } from "../dev/TOR23_data";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(158.4);

// VO parts [take from, to, timeline at]; the count ("Twenty-three started near ...") is the sentence's subject, nothing dropped
const VO: [number, number, number][] = [[0, 19.2, 4.0], [19.2, 35.25, 35.2], [35.25, 55.15, 63.25], [55.15, 104.84, 108.15]];
// raws: [timeline a, b, cleaned wav, offset, gain dB, fade-out s] — at the cut sheet's cues, dead air trimmed
// 3 Nov raw audit (owner: raws only at incident moments, no near-duplicates): R2 (after the tornado-emergency explanation), R4 (after
// Arbor Day / the width) and R5 (after the 61-minute track line) removed, the VO runs on there; R6 trimmed 28 -> 25 s (calm head).
const RAWS: [number, number, string, number, number, number][] = [
  [23.2, 35.2, "ad_a_clean.wav", 28.0, -2, 0.6],     // R1 touchdown: "Oh, it's on the ground there ... there's one behind it"
  [51.25, 63.25, "sl_clean.wav", 53.0, -2, 0.6],     // R3 Sloan: the grey wedge behind the trees, sirens
  [83.15, 108.15, "ad_c_clean.wav", 61.0, -1, 0.8],  // R6 the house cameras as it arrives (climax)
];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const g = (T: number) => +(53 + T).toFixed(2); // part G: take -> timeline

const SHOTS: Sh[] = [
  { a: 4, b: 7.2, vo: "It's around half past three on Friday the 26th of April 2024, (src 72)", src: "ad_a.mp4", from: 72.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45,
    over: <RedLabel text="APRIL 26, 2024" at={F(0.6)} hold={F(2.3)} /> },
  { a: 7.2, b: 8.98, vo: "in west Omaha. (src 86)", src: "ad_a.mp4", from: 86.0, s0: 1.05, s1: 1.09, fx: 0.5, fy: 0.5, over: <RedLabel text="WEST OMAHA, NEBRASKA" at={F(0.2)} hold={F(1.3)} /> },
  { a: 8.98, b: 14, vo: "A tornado emergency is in effect, and it will stay up for most of this tornado's life. (life strip)",
    node: <LifeStrip bg={GR + "ad_a.mp4"} bgFrom={100} minutes={61} band={[8, 60]} ticks={[8, 11]} fillAt={10} fillLen={60} bandAt={74} /> },
  { a: 14, b: 17.8, vo: "Twenty-three started near 255th and Q Streets (src 16, the funnel lowering)", src: "ad_a.mp4", from: 16.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 17.8, b: 20.1, vo: "in the far southwest of Douglas County (src 44)", src: "ad_a.mp4", from: 44.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 20.1, b: 23.2, vo: "and crossed open fields toward Waterloo and Elkhorn. (src 114)", src: "ad_a.mp4", from: 114.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 23.2, b: 35.2, vo: "RAW 1 (src 28-40)", src: "ad_a.mp4", from: 28.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 35.2, b: 39.95, vo: "A tornado emergency only goes out for a confirmed strong tornado heading for people, (Sloan: behind the houses)", src: "sl.mp4", from: 1.0, s0: 1.03, s1: 1.08, fx: 0.6, fy: 0.45 },
  { a: 39.95, b: 43.6, vo: "and forecasters keep it rare so it still means something. (src 128)", src: "ad_a.mp4", from: 128.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 43.6, b: 45.65, vo: "This tornado got two of them, (src 170)", src: "ad_a.mp4", from: 170.0, s0: 1.08, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 45.65, b: 48.8, vo: "the first as it crossed US 275. (src 184)", src: "ad_a.mp4", from: 184.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 48.8, b: 51.25, vo: "Waterloo was the first town it passed. (src 196.5)", src: "ad_a.mp4", from: 196.5, s0: 1.05, s1: 1.1, fx: 0.55, fy: 0.5, over: <RedLabel text="WATERLOO, NEBRASKA" at={F(0.3)} hold={F(1.8)} /> },
  { a: 51.25, b: 63.25, vo: "RAW 3 (Sloan 53-65)", src: "sl.mp4", from: 53.0, s0: 1.03, s1: 1.07, fx: 0.55, fy: 0.45 },
  { a: 63.25, b: 66.47, vo: "It was Arbor Day, a holiday that started in Nebraska. (Sloan: the spring trees in the yard)", src: "sl.mp4", from: 20.0, s0: 1.03, s1: 1.07, fx: 0.4, fy: 0.55 },
  { a: 66.47, b: 70.12, vo: "At its widest the tornado was nineteen hundred yards across, (Sloan 81: the wall of grey)", src: "sl.mp4", from: 81.0, s0: 1.02, s1: 1.06, fx: 0.6, fy: 0.4 },
  { a: 70.12, b: 71.5, vo: "more than a mile. (src 296, the wedge on the horizon)", src: "ad_b.mp4", from: 96.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 71.5, b: 81.5, vo: "It tracked for sixty-one minutes ... into Harrison County, Iowa. (mileage rail, a NAIP chip of each town with the DAT line through it)",
    node: <TownChips src={GR + "path.jpg"} iw={PATH_W} ih={PATH_H} path={PATH} miles={32.5} chipPx={300} bg={GR + "ad_b.mp4"} bgFrom={0} endLabel="HARRISON COUNTY, IOWA" endAt={250}
      towns={[{ name: "WATERLOO", p: TOWNS.WATERLOO, at: 118 }, { name: "ELKHORN", p: TOWNS.ELKHORN, at: 160 }, { name: "BENNINGTON", p: TOWNS.BENNINGTON, at: 180 }, { name: "BLAIR", p: TOWNS.BLAIR, at: 198 }, { name: "MISSOURI RIVER", p: TOWNS["MISSOURI RIVER"], at: 232 }]} /> },
  { a: 81.5, b: 83.15, vo: "Then it reached the houses. (the yard camera, still calm, src 545)", src: "ad_c.mp4", from: 5.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: 83.15, b: 108.15, vo: "RAW 6 (src 601-626: the calm first 3 s trimmed, the arrival and the lens hit kept)", src: "ad_c.mp4", from: 61.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(55.15), b: g(59.72), vo: "In Elkhorn it levelled a home near 216th Street and Highway 64 (0.5x replay of the debris arriving)", src: "replay.mp4", from: 0.2, s0: 1.1, s1: 1.2, fx: 0.55, fy: 0.45 },
  { a: g(59.72), b: g(62.98), vo: "and damaged or destroyed much of the Ramblewood subdivision. (src 690, trees torn)", src: "ad_c.mp4", from: 150.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(62.98), b: g(70.6), vo: "It was first rated high-end EF3 and upgraded that July to low-end EF4, estimated at a hundred and seventy. (NWS OAX 29 Jul)",
    node: <PageMacro src={SH + "pns.png"} iw={2560} ih={4800} lines={[{ box: [186, 1460, 1209, 1537], at: 24, len: 96 }, { box: [186, 1949.7, 1157, 1985.7], at: 172, len: 48 }]} /> },
  { a: g(70.6), b: g(73.96), vo: "The upgrade came from two newly built homes on Larimore. (src 744, the yard after)", src: "ad_c.mp4", from: 204.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(73.96), b: g(75.29), vo: "They were properly anchored, (src 828)", src: "ad_c.mp4", from: 288.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(75.29), b: g(78.63), vo: "and one had been built and inspected within the previous two years. (src 852)", src: "ad_c.mp4", from: 312.0, s0: 1.08, s1: 1.13, fx: 0.4, fy: 0.68 },
  { a: g(78.63), b: g(82.02), vo: "Both still had their walls swept away down to the foundation. (src 760)", src: "ad_c.mp4", from: 220.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(82.02), b: g(83.28), vo: "South of Blair, (src 470)", src: "ad_b.mp4", from: 270.0, s0: 1.05, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: g(83.28), b: g(85.38), vo: "homes that weren't anchored went the same way. (src 940)", src: "ad_c.mp4", from: 400.0, s0: 1.07, s1: 1.11, fx: 0.5, fy: 0.68 },
  { a: g(85.38), b: g(87.94), vo: "Anchored or not, those houses were gone. (src 680)", src: "ad_c.mp4", from: 140.0, s0: 1.07, s1: 1.11, fx: 0.55, fy: 0.68 },
  { a: g(87.94), b: g(89.95), vo: "The anchoring only changed the rating. (src 492)", src: "ad_b.mp4", from: 292.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: g(89.95), b: g(93.27), vo: "Four injuries, and that was the whole casualty count (Sloan 85)", src: "sl.mp4", from: 85.0, s0: 1.04, s1: 1.09, fx: 0.6, fy: 0.45 },
  { a: g(93.27), b: g(96.02), vo: "after an hour of a violent tornado on the edge of a city. (src 516)", src: "ad_b.mp4", from: 316.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: g(96.02), b: g(99.15), vo: "Property damage came to more than eight million dollars. (src 960)", src: "ad_c.mp4", from: 420.0, s0: 1.07, s1: 1.11, fx: 0.4, fy: 0.68 },
  { a: g(99.15), b: 158.4, vo: "Most of the credit for that casualty count belongs to a warning that stayed up the entire time. (src 432)", src: "ad_b.mp4", from: 232.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.98), kind: "zoomHit", len: 10 },
  { at: F(23.2), kind: "blurDip", len: 12 },
  { at: F(43.6), kind: "blurDip", len: 10 },
  { at: F(45.65), kind: "blurDip", len: 10 },
  { at: F(48.8), kind: "blurDip", len: 12 },   // patio cam, other moment (was the R2 entry)
  { at: F(63.25), kind: "blurDip", len: 10 },
  { at: F(66.47), kind: "blurDip", len: 10 },
  { at: F(71.5), kind: "glitch", len: 10 },    // into the town chips
  { at: F(81.5), kind: "whip", len: 10 },      // chips -> the yard camera
  { at: F(83.15), kind: "blurDip", len: 10 },
  { at: F(108.15), kind: "blurDip", len: 12 },
  { at: F(g(62.98)), kind: "glitch", len: 8 },
  { at: F(g(75.29)), kind: "blurDip", len: 10 },
  { at: F(g(78.63)), kind: "blurDip", len: 10 },
  { at: F(g(85.38)), kind: "blurDip", len: 10 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [8.98, "sfx_n2/whoosh_01.wav", -32],
  [71.45, "sfx_n2/glitch_03.wav", -28],
  [108.2, X + "wind_gust_1.wav", -26],     // under the slow replay, low
  [g(62.98) - 0.05, "sfx_n2/glitch_01.wav", -30],
  [g(63.0), X + "paper_2.wav", -33],
];

// R6 (83.15-108.15 = ad_c src 61-86) is a security camera with NO audio (the source is digital silence). Its sound is built from
// real recorded SFX timed to the picture: rain on the eaves and wind building from calm, gusts rising every ~2.5 s, debris hits
// where pieces cross the lawn (src ~64-65, 70-75), the lens hit (src ~82.9) and the big piece after it (src ~84). No music under it.
// [timeline s, file, dB, play length s] (each fades in 3 frames, out over its last 0.4 s)
const R6FX: [number, string, number, number][] = [
  [83.15, X + "rain_22.wav", -25, 22.0], [104.9, X + "rain_9.wav", -21, 3.25],
  [83.3, X + "wind_gust_1.wav", -27, 4], [85.8, X + "wind_gust_1.wav", -24, 4], [88.3, X + "wind_gust_1.wav", -21, 4],
  [90.8, X + "wind_gust_1.wav", -19, 4], [93.3, X + "wind_gust_1.wav", -17, 4], [95.8, X + "wind_gust_1.wav", -16, 4],
  [98.3, X + "wind_gust_1.wav", -15, 4], [100.8, X + "wind_gust_1.wav", -14, 4], [103.3, X + "wind_gust_1.wav", -13, 4],
  [105.6, X + "wind_gust_1.wav", -13, 2.55],
  [86.3, X + "impact_1.wav", -23, 3.0], [87.0, X + "metal_clank_1.wav", -24, 0.5],
  [93.2, X + "impact_3.wav", -21, 2.6], [95.4, X + "metal_clank_3.wav", -23, 2.5],
  [99.0, X + "impact_4.wav", -23, 6.0],
  [104.95, X + "impact_2.wav", -15, 2.0], [105.1, X + "metal_clank_1.wav", -19, 0.5], [106.1, X + "impact_3.wav", -18, 2.05],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="AN HOUR UNDER A TORNADO EMERGENCY" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE23.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, off, gn, fo], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(MD + file)} startFrom={F(off)} volume={(f) => dB(gn) * interpolate(f, [0, 6, F(b - a - fo), F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={F(4)} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * interpolate(fr, [0, 4, F(3), F(4) - 1], [0, 1, 1, 0], cl)} /></Sequence>)}
      {R6FX.map(([t, f, d, len], i) => (
        <Sequence key={"r6" + i} from={F(t)} durationInFrames={F(len)} layout="none">
          <Audio src={staticFile(f)} volume={(fr) => dB(d) * interpolate(fr, [0, 3, F(len) - 1 - Math.min(11, Math.floor(F(len) / 3)), F(len) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 5 (-20.9 LUFS -> -13 dB), a different bed from 21 (Music 4) and 22 (Music 1); out under every raw (wind roar) */}
      {([[4.0, 23.2, 0], [35.2, 51.25, 20], [63.25, 83.15, 36], [108.15, 158.4, 58]] as [number, number, number][]).map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => dB(-13) * interpolate(f, [0, 24, F(b - a) - 30, F(b - a) - 4], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </LibFontGate>
);
