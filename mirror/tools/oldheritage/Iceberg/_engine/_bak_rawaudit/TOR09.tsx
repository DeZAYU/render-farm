// Tornado #9 — the 3 May 1999 Bridge Creek-Moore F5 (tornado A9), southwest Oklahoma City. One source: Earl's camcorder tape from the
// I-44 / I-35 side (VmWLoy62EMo; the uploader muted it, so every raw is silent footage with real rain / wind recordings timed to it).
// Devices for THIS case: FujitaGauge (the F-scale with DOW 301 / 321 mph and the never-used F6 band), SlideProjector (the NWS Norman
// forecaster's overpass talk, real slides), PathMap (NWS damage outline on NAIP: the one-mile width measured between section roads, then
// the 38-mile path revealed town by town), the NWS tornado table as a lit page (PageLight_N2P), NWS / FEMA / CSWR photos as stills.
// VO = one take, "Ninth is" dropped (starts on "the tornado Moore had already lived through"), split only where a raw plays.
// Source cuts (srccuts): 73.67, 307.14, 387.15, 395.40, 416.62 — no window crosses one.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { PageLight_N2P } from "../lib/templates/n2page/n2page";
import { Inset, RedLabel, TitleCard } from "../brand";
import { FujitaGauge } from "../dev/TOR09_FujitaGauge";
import { SlideProjector } from "../dev/TOR09_SlideProjector";
import { MileMeasure, PathTowns } from "../dev/TOR09_PathMap";
import { POLY_WIDE as polyWide, POLY_ALL as polyAll } from "../dev/TOR09_polys";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/", SH = "case/shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(203.0);
type Pt = [number, number];

// VO parts: [take start, take end, timeline start]; everything between parts is a raw
const VO: [number, number, number][] = [
  [0.45, 8.0, 4.0], [8.1, 28.4, 20.55], [28.4, 34.6, 49.85], [34.6, 56.8, 64.05],
  [56.8, 76.3, 95.25], [76.3, 80.8, 123.75], [80.8, 89.45, 138.25], [89.45, 136.3, 154.9],
];
type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: (d: number) => React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.0, b: 6.22, vo: "the tornado Moore had already lived through.", src: "earl.mp4", from: 75.0, s0: 1.05, s1: 1.13, fx: 0.62, fy: 0.45 },
  { a: 6.22, b: 8.87, vo: "Monday the 3rd of May 1999,", src: "earl.mp4", from: 10.2, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.55,
    over: <RedLabel text="MAY 3, 1999" at={8} hold={F(2.2)} /> },
  { a: 8.87, b: 11.55, vo: "on the rain-soaked southwest side of Oklahoma City.", src: "earl.mp4", from: 30.0, s0: 1.08, s1: 1.14, fx: 0.55, fy: 0.5,
    over: <RedLabel text="SOUTHWEST OKLAHOMA CITY" at={8} hold={F(2.2)} /> },
  { a: 11.55, b: 20.55, vo: "RAW 1 (0:47-0:56): the tornado beyond the road signs, traffic in the rain", src: "earl.mp4", from: 47.0, s0: 1.0, s1: 1.08, fx: 0.3, fy: 0.5 },
  { a: 20.55, b: 28.75, vo: "F5. A Doppler on Wheels radar measured 301 ... reanalysis put it at 321, (the gauge)",
    node: () => <FujitaGauge bg={GR + "earl.mp4"} bgFrom={100.0} f5At={8} needle={[{ v: 40, at: 40 }, { v: 301, at: 92, label: "301 MPH" }, { v: 321, at: 128, label: "321 MPH" }]} /> },
  { a: 28.75, b: 31.73, vo: "the highest wind speed ever recorded in a tornado.", src: "earl.mp4", from: 165.0, s0: 1.05, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 31.73, b: 38.61, vo: "The old Fujita chart had room for an F6, above 319. Nothing has ever been rated F6,",
    node: () => <FujitaGauge bg={GR + "earl.mp4"} bgFrom={205.5} f5At={-30} needle={[{ v: 321, at: 0, label: "321 MPH" }]} f6At={48} emptyAt={137} /> },
  { a: 38.61, b: 40.85, vo: "because no damage on the ground can prove it. (NWS ground photo)", src: "kj3.jpg", still: true, s0: 1.04, s1: 1.11, fx: 0.45, fy: 0.55 },
  { a: 40.85, b: 49.85, vo: "RAW 2 (1:56-2:05): the wedge across the city's southwest side", src: "earl.mp4", from: 116.5, s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 49.85, b: 53.39, vo: "That afternoon a lot of drivers did something that sounds sensible.", src: "earl.mp4", from: 186.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 53.39, b: 56.05, vo: "They pulled over and climbed up under highway overpasses. (cars stopped on the shoulder)", src: "earl.mp4", from: 174.5, s0: 1.1, s1: 1.18, fx: 0.6, fy: 0.75 },
  { a: 56.05, b: 64.05, vo: "RAW 3 (2:30-2:38): still on the ground beyond the highway, traffic passing", src: "earl.mp4", from: 150.5, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 64.05, b: 74.26, vo: "According to the Weather Service in Norman ... seven interstate locations. Three hit overpasses directly ... (the NWS talk, slide 5)",
    node: () => <SlideProjector slides={[{ src: GR + "slide05.jpg", at: 0 }]} cam={[[0, 329, 240, 1.0], [110, 320, 225, 1.45], [178, 340, 230, 1.9], [306, 345, 236, 2.1]]} /> },
  { a: 74.26, b: 76.61, vo: "A bridge can funnel the wind and speed it up, (the wind in the trees)", src: "earl.mp4", from: 342.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 76.61, b: 86.25, vo: "a person wedged underneath ... (slide 7: under the 16th St overpass) The Shields Boulevard overpass ... no girders (slide 8)",
    node: () => <SlideProjector slides={[{ src: GR + "slide07.jpg", at: 0 }, { src: GR + "slide08.jpg", at: 126, label: "SHIELDS BOULEVARD, I-35, MOORE", labelAt: 150 }]}
      cam={[[0, 300, 230, 1.15], [70, 205, 165, 2.0], [118, 230, 190, 1.7], [160, 480, 345, 2.2], [289, 498, 358, 2.55]]} /> },
  { a: 86.25, b: 95.25, vo: "RAW 4 (4:26-4:35): closer, the wedge filling the horizon", src: "earl.mp4", from: 266.0, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 95.25, b: 99.5, vo: "It lasted eighty-five minutes over about thirty-eight miles. (NWS tornado table, A9 row)",
    node: (d) => <PageLight_N2P tilt dur={d} src={SH + "nws_table.png"} imgW={2560} imgH={2400} crop={[360, 250, 2220, 680]} singleCam
      spans={[{ text: "1726-1848", lines: [[739, 439, 895, 475]], at: 14, sweep: [16, 28] }, { text: "38", lines: [[935, 439, 975, 475]], at: 70, sweep: [70, 78] }]} /> },
  { a: 99.5, b: 101.93, vo: "The Weather Service's first warning went out at 4:50,", src: "earl.mp4", from: 64.0, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.5 },
  { a: 101.93, b: 104.64, vo: "ninety minutes before it touched down near Amber. (NWS forecaster's photo of A9 near Bridge Creek)", src: "a9photo.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.45 },
  { a: 104.64, b: 109.89, vo: "Then at about 6:57, the Norman office issued something it had never issued before.", src: "earl.mp4", from: 284.0, s0: 1.03, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 109.89, b: 114.75, vo: "It was a tornado emergency, the alert now saved for the worst tornadoes on this list.", src: "earl.mp4", from: 300.5, s0: 1.04, s1: 1.12, fx: 0.55, fy: 0.45 },
  { a: 114.75, b: 123.75, vo: "RAW 5 (5:08-5:17): the rural road, the tornado crossing ahead", src: "earl.mp4", from: 308.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 123.75, b: 128.25, vo: "At its widest it was seventeen hundred and sixty yards, a full mile. (NWS outline, measured between section roads)",
    node: () => <MileMeasure src={GR + "naipwide.jpg"} iw={2560} ih={1440} poly={polyWide as Pt[]} a={[1280, 409]} b={[1276, 1037]} focus={[1300, 720]} drawAt={0} measureAt={47} label="1,760 YARDS" /> },
  { a: 128.25, b: 138.25, vo: "RAW 6 (5:26-5:36): debris across the windshield", src: "earl.mp4", from: 326.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 138.25, b: 140.78, vo: "A Doppler on Wheels is what it sounds like, (DOW 1, 1995)", src: "dow1.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="DOPPLER ON WHEELS" at={10} hold={F(2.0)} /> },
  { a: 140.78, b: 144.53, vo: "a radar dish on a truck that researchers drive out to the storm. (DOW and a tornado)", src: "dowtor.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.6 },
  { a: 144.53, b: 146.9, vo: "That's how anyone got close enough for that number.", src: "earl.mp4", from: 296.0, s0: 1.08, s1: 1.15, fx: 0.5, fy: 0.5 },
  { a: 146.9, b: 154.9, vo: "RAW 7 (6:11-6:19): on the road behind it, the tornado ahead", src: "earl.mp4", from: 371.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 154.9, b: 161.79, vo: "It passed from near Amber through Bridge Creek, Moore, south Oklahoma City, Del City and Midwest City. (path revealed)",
    node: () => <PathTowns src={GR + "naip.jpg"} iw={3200} ih={2200} poly={polyAll as Pt[]} axis={[[604, 1952], [2639, 175]]}
      reveal={[[0, 0], [42, 0.05], [58, 0.25], [84, 0.79], [148, 0.94], [174, 1.0], [206, 1.0]]}
      cam={[[0, 760, 1780, 2.1], [58, 1100, 1520, 1.7], [120, 1800, 1000, 1.25], [206, 1621, 1063, 1.0]]}
      towns={[{ name: "AMBER", p: [700, 1880], at: 42 }, { name: "BRIDGE CREEK", p: [1120, 1520], at: 58 }, { name: "MOORE", p: [2330, 705], at: 84, dx: 120, dy: 40 },
        { name: "SOUTH OKC", p: [2030, 890], at: 104, dx: -110, dy: 40 }, { name: "DEL CITY", p: [2560, 330], at: 148, dx: -130, dy: 0 }, { name: "MIDWEST CITY", p: [2630, 190], at: 174, dx: -120, dy: -46 }]} /> },
  { a: 161.79, b: 167.38, vo: "The direct toll was thirty-six, with five more indirect. About 583 were hurt, (the A9 row again)",
    node: (d) => <PageLight_N2P dur={d} src={SH + "nws_table.png"} imgW={2560} imgH={2400} crop={[360, 250, 2220, 680]} singleCam driftX={10}
      spans={[{ text: "36", lines: [[1198, 439, 1240, 475]], at: 31, sweep: [31, 40] }, { text: "583", lines: [[1278, 439, 1336, 475]], at: 101, sweep: [101, 112] }]} /> },
  { a: 167.38, b: 170.44, vo: "and more than eight thousand homes were damaged or flattened. (NWS aerial)", src: "a211.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 170.44, b: 172.93, vo: "Weather Service researchers later said the toll would likely (NWS oblique aerial: the swath through the city)", src: "a220.jpg", still: true, s0: 1.08, s1: 1.02, fx: 0.5, fy: 0.6 },
  { a: 172.93, b: 176.01, vo: "have passed six hundred without those warnings.", src: "mb211.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 176.01, b: 181.58, vo: "Engineers from Texas Tech found many destroyed frame homes had been built below minimal code. (a slab swept bare)",
    node: () => <Inset src={GR + "mb117.jpg"} still box={0.62} ar={3 / 2} drift={0.08} /> },
  { a: 181.58, b: 186.61, vo: "Properly strapped and bolted homes should have stood up to winds of around 155.", src: "kj6.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 186.61, b: 191.46, vo: "A federal building assessment team said the codes of the day needed raising above their minimums.", src: "mb118.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.5, fy: 0.6 },
  { a: 191.46, b: 196.3, vo: "By May 2003 the area had 6,016 new safe rooms. (FEMA, Moore, May 2003)", src: "shelter.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45,
    over: <RedLabel text="MOORE, MAY 2003" at={12} hold={F(3.6)} /> },
  { a: 196.3, b: 203.0, vo: "The damage came to about a billion dollars at the time, one of the costliest tornadoes on record. (NWS aerial, pull-out)", src: "a208.jpg", still: true, s0: 1.16, s1: 1.0, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.87), kind: "blurDip", len: 12 },
  { at: F(11.55), kind: "blurDip", len: 12 },
  { at: F(20.55), kind: "blurDip", len: 12 },
  { at: F(31.73), kind: "blurDip", len: 12 },
  { at: F(53.39), kind: "blurDip", len: 12 },
  { at: F(64.05), kind: "blurDip", len: 12 },
  { at: F(109.89), kind: "blurDip", len: 12 },
  { at: F(74.26), kind: "whip", len: 10 },
  { at: F(76.61), kind: "blurDip", len: 12 },
  { at: F(114.75), kind: "blurDip", len: 12 },
  { at: F(123.75), kind: "zoomHit", len: 10 },
  { at: F(128.25), kind: "blurDip", len: 12 },
  { at: F(138.25), kind: "whip", len: 10 },
  { at: F(146.9), kind: "blurDip", len: 12 },
  { at: F(154.9), kind: "glitch", len: 10 },
  { at: F(176.01), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const d = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(d)}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={d} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// the tape is silent: each raw gets real rain / wind recordings, the debris pass on the windshield gets small hits
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [11.6, X + "rain_22.wav", -16], [13.0, X + "wind_gust_1.wav", -24], [16.6, X + "wind_gust_1.wav", -22],
  [20.6, "sfx_n2/whoosh_02.wav", -30], [22.4, X + "reverse_swell_1.wav", -28],
  [40.9, X + "wind_gust_1.wav", -20], [43.5, X + "rain_9.wav", -14], [45.2, X + "wind_gust_1.wav", -21],
  [56.1, X + "rain_22.wav", -18], [57.5, X + "wind_gust_1.wav", -22], [60.6, X + "wind_gust_1.wav", -20],
  [64.1, X + "projector_1.wav", -22], [67.9, X + "projector_1.wav", -26],
  [74.26, "sfx_n2/whoosh_01.wav", -30],
  [76.65, X + "projector_1.wav", -24], [80.81, X + "tape_click_2.wav", -14], [80.86, X + "projector_1.wav", -26],
  [86.3, X + "wind_gust_1.wav", -18], [88.4, X + "rain_9.wav", -16], [90.6, X + "wind_gust_1.wav", -18],
  [95.3, X + "page_turn_1.wav", -28],
  [114.8, X + "rain_22.wav", -15], [115.5, X + "wind_gust_1.wav", -17], [118.7, X + "wind_gust_1.wav", -16], [121.4, X + "wind_gust_1.wav", -19],
  [123.75, "sfx_n2/whoosh_03.wav", -30],
  [128.3, X + "rain_22.wav", -13], [129.0, X + "wind_gust_1.wav", -16], [132.2, X + "impact_2.wav", -22], [132.7, X + "metal_clank_1.wav", -24],
  [133.3, X + "impact_3.wav", -22], [134.0, X + "wind_gust_1.wav", -15], [135.6, X + "metal_clank_1.wav", -26],
  [138.25, "sfx_n2/whoosh_02.wav", -30],
  [146.95, X + "rain_9.wav", -15], [147.6, X + "wind_gust_1.wav", -18], [151.0, X + "wind_gust_1.wav", -20],
  [154.85, "sfx_n2/glitch_03.wav", -26], [155.0, "sfx_n2/whoosh_01.wav", -32],
  [161.8, X + "page_turn_2.wav", -28],
  [176.05, "sfx_n2/whoosh_03.wav", -32],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE 1999 F5" bg={GR + "earl_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t0, t1, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      {/* music: Epidemic ambient Music 5 (≈ -13 dB = ~10 LU under the VO), two passes crossfaded; stays under the silent raws */}
      <Sequence from={F(4.0)} durationInFrames={F(126.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} volume={(f) => dB(-13) * interpolate(f, [0, 45, F(123.5), F(126.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(127.5)} durationInFrames={F(203.0) - F(127.5)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(24)} volume={(f) => dB(-13) * interpolate(f, [0, F(2.5), F(72.5), F(75.5)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
