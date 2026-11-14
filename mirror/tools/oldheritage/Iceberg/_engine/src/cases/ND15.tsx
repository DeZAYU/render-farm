// Natural Disasters #15 — Hurricane Laura's eyewall from a Lake Charles parking garage (27 Aug 2020). Channel grammar + devices for THIS case:
//   AdvisoryTerminal (dev/ND15_AdvisoryTerminal): the NHC advisory (IEM archive) typed onto a dark terminal, "Unsurvivable storm surge"
//     and "Calcasieu Lake...15-20 ft" typed in red with a red rule under each.
//   RadarLast (dev/ND15_RadarLast): the real KLCH radar loop of landfall (NWS, Commons): landfall frames; later the last two scans and
//     the radar's own "data unavailable" frame.
//   StationTrace (dev/ND15_StationTrace): KLCH ASOS 1-minute data (IEM): the gust line to the 133 mph record that stops where the sensor
//     died; later the pressure line bottoming out as the eye passes the airport.
//   ForceSquares (dev/ND15_ForceSquares): wind force ~ speed squared: 100 vs 140 mph as square areas, the small one fitting twice.
//   InlandRuler (dev/ND15_InlandRuler): USGS NAIP, a mile ruler from the Gulf shore to downtown Lake Charles (31 mi).
// Footage: one continuous upload (DYyNWwToZqs, the chasers' own wind sound, no music). Every raw plays its own sound; none under the VO.
// Source cuts: 22.0 51.7 66.3 100.3 125.0 142.6 159.4 248.7 251.2 281.9 314.0 354.1-357.3 403.6 431.7 439.1 504.3 553-554.1 582.7-585.4 610.9 626.6.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { AdvisoryTerminal } from "../dev/ND15_AdvisoryTerminal";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { RadarLast } from "../dev/ND15_RadarLast";
import { StationTrace } from "../dev/ND15_StationTrace";
import { ForceSquares } from "../dev/ND15_ForceSquares";
import { InlandRuler } from "../dev/ND15_InlandRuler";
import { GUST, PRES } from "../dev/ND15_asos";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, GAP = 0.35;

const BL: [number, number][] = [[0, 29.68], [29.68, 61.17], [61.17, 108.04], [108.04, 144.48], [144.48, 166.96]];
type Raw = { a: number; b: number; what: string };
const RAWS: Raw[] = [
  // 3 Nov owner rule: raws only at the incident (the eyewall arriving, the power flashes, 'it just keeps coming', the way out). The five
  // raws after the eyewall / garage / force / tower / inland explanation are cut (near-duplicates of the same deck); that VO runs on.
  { a: 22.4, b: 40.0, what: "the eyewall: roof panels and debris flying past the garage in the dark" },
  { a: 196.5, b: 212.0, what: "power flashes lighting the sky over the street" },
  { a: 452.0, b: 468.0, what: "debris and wind past the railing in the dark" },
  { a: 611.5, b: 626.3, what: "down at the bottom of the garage: the sheriff's car, the way out" },
];
const BS: number[] = [], RS: number[] = [];
{ let t = TITLE; BL.forEach(([s, e], i) => { BS.push(t); t += e - s; if (RAWS[i]) { RS.push(t); t += RAWS[i].b - RAWS[i].a + GAP; } }); }
const blockOf = (take: number) => { let k = 0; BL.forEach(([s], i) => { if (take >= s - 0.001) k = i; }); return k; };
const T = (take: number) => BS[blockOf(take)] + take - BL[blockOf(take)][0];
const END = BS[BL.length - 1] + BL[BL.length - 1][1] - BL[BL.length - 1][0] + 0.8;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: (n: number) => React.ReactNode; over?: React.ReactNode };
const L = (a: number, b: number, from: number, vo: string, s0 = 1.04, s1 = 1.1, fx = 0.5, fy = 0.5, over?: React.ReactNode): Sh => ({ a, b, vo, src: "laura.mp4", from, s0, s1, fx, fy, over });
const HOUR = ["9 PM", "10 PM", "11 PM", "12 AM", "1 AM", "2 AM", "3 AM"].map((label, i) => ({ m: i * 60, label }));

const VO_SHOTS: Sh[] = [
  { a: 0, b: 8.9, vo: "Unsurvivable. That's the word the NHC used for the storm surge... as much as twenty feet of water. (NHC advisory 27A)",
    node: () => <AdvisoryTerminal header="NHC PUBLIC ADVISORY · AUG 26 2020 · 10 AM CDT" credit="SOURCE: NATIONAL HURRICANE CENTER ADVISORY (IEM ARCHIVE)" zoomTo={5} zoomAt={196}
      lines={[
        { text: "Unsurvivable storm surge with large and destructive", at: 18, mark: "Unsurvivable storm surge" },
        { text: "waves will cause catastrophic damage from Sea Rim", at: 44 },
        { text: "State Park, Texas, to Intracoastal City, Louisiana,", at: 68 },
        { text: "...", at: 150, dim: true },
        { text: "Johnson Bayou LA to Rockefeller Wildlife Refuge", at: 168 },
        { text: "including Calcasieu Lake...15-20 ft", at: 192, mark: "15-20 ft" },
      ]} /> },
  L(8.9, 10.56, 6.0, "...as much as twenty feet of water. (the storm out past the rail)", 1.04, 1.08),
  L(10.56, 14.37, 68.6, "The coast emptied, and Lake Charles was told to evacuate too. (the empty lit lot)", 1.03, 1.08),
  { a: 14.37, b: 23.59, vo: "Laura came ashore at Cameron at about one in the morning... Category 4, 150 mph. (KLCH radar, landfall)",
    node: () => <RadarLast dir={GR + "radar"} frames={[0, 1, 2]} keys={[0, F(3.0), F(6.0)]} focus={[300, 300]} z0={1.0} z1={1.55}
      labels={[{ text: "CAMERON, LOUISIANA", at: F(0.8), hold: F(4.0) }, { text: "AUGUST 27, 2020", at: F(5.4) }]} /> },
  L(23.59, 26.6, 12.2, "Two amateur storm chasers drove inland to Lake Charles anyway (the pavilion over the rail)", 1.04, 1.1, 0.5, 0.5,
    <RedLabel text="LAKE CHARLES, LOUISIANA" at={F(0.4)} hold={F(2.4)} />),
  L(26.6, 29.68, 150.6, "and set up in a downtown parking garage. (the deck, its lights)", 1.03, 1.09, 0.6, 0.5),
  // block 2
  L(29.68, 34.06, 44.3, "This is the eyewall, the ring of the strongest winds wrapped around the calm eye.", 1.03, 1.09),
  L(34.06, 37.05, 88.0, "Laura had strengthened very fast before landfall. (the pavilion in the dark)", 1.3, 1.36, 0.45, 0.5),
  L(37.05, 40.1, 128.0, "Its winds picked up about 65 miles an hour in a single day,", 1.04, 1.1, 0.5, 0.5),
  L(40.1, 43.08, 136.5, "and it held a lot of that strength inland.", 1.32, 1.4, 0.3, 0.55),
  { a: 43.08, b: 53.73, vo: "At 1:42... a gust of 133 mph. That was a record for the station. Then the equipment was destroyed. (ASOS gust trace)",
    node: () => <StationTrace bg={GR + "laura.mp4"} bgFrom={232.0} data={GUST} t0="9 PM" minutes={330} ticks={HOUR.slice(0, 6)} vmin={0} vmax={140} vticks={[0, 40, 80, 120]} unit="MPH"
      drawAt={8} drawLen={F(4.8)} mark={{ m: 282, label: "133 MPH, 1:42 AM", at: F(5.0) }} end={{ label: "LAST READING", at: F(8.9) }} station="LAKE CHARLES AIRPORT: WIND GUSTS" /> },
  { a: 53.73, b: 57.48, vo: "The city's weather radar sent its last image at 12:53. (the last two scans, then the radar's own outage frame)",
    node: () => <RadarLast dir={GR + "radar"} frames={[3, 4]} keys={[0, F(1.2)]} focus={[300, 270]} z0={1.25} z1={1.4} deadAt={F(3.0)}
      labels={[{ text: "12:53 AM", at: F(1.3), hold: F(1.6) }]} /> },
  // block 3
  L(57.48, 61.17, 160.2, "Those flashes in the dark are power lines and transformers failing.", 1.03, 1.08),
  // block 4
  L(61.17, 63.88, 252.2, "A parking garage isn't a bad choice for this. (the lit deck)", 1.03, 1.08),
  L(63.88, 67.6, 300.6, "It's reinforced concrete, it's open so the wind passes through", 1.3, 1.36, 0.4, 0.55),
  L(67.6, 71.47, 260.6, "and it's high enough to stay above the floodwater. (looking down to the street)", 1.03, 1.09, 0.5, 0.6),
  L(71.47, 73.57, 372.2, "The trouble is what the wind is carrying. (debris in the air)", 1.04, 1.1),
  L(73.57, 77.34, 396.6, "Sheet metal roofing is among the most dangerous things a hurricane picks up. (roof sheets on the street)", 1.04, 1.12, 0.45, 0.5),
  { ...L(77.34, 81.98, 424.5, "It's light enough to fly and sharp enough to cut, and it moves at the speed of the wind.", 1.04, 1.06, 0.55, 0.45),
    punches: [{ at: F(1.4), to: 1.28, len: 18 }] },
  // block 5
  { a: 81.98, b: 92.66, vo: "Wind damage doesn't climb in a straight line... 140 mph pushes about twice as hard as one of 100. (ForceSquares)",
    node: () => <ForceSquares bg={GR + "laura.mp4"} bgFrom={265.0} a={100} b={140} aAt={F(2.7)} bAt={F(6.9)} proofAt={F(9.0)} aLabel="100 MPH" bLabel="140 MPH" /> },
  // block 6
  { a: 92.66, b: 95.6, vo: "Across town, many of the windows in the Capital One Tower, the tallest building in the city, (the tower before, 2012)",
    node: () => <Inset src={GR + "cap1.jpg"} still box={0.3} ar={0.75} pos="50% 40%" label="CAPITAL ONE TOWER" labelAt={8} /> },
  { a: 95.6, b: 98.78, vo: "were blown out. (National Guard, Lake Charles after Laura: the tower's broken glass)", src: GR + "ng1.jpg", still: true, s0: 1.05, s1: 1.15, fx: 0.4, fy: 0.35 },
  { a: 98.78, b: 103.1, vo: "A tower that tall is designed around wind, and Laura still found its glass. (close on the empty window frames)", src: GR + "ng1.jpg", still: true, s0: 2.3, s1: 2.6, fx: 0.42, fy: 0.22 },
  // block 7
  L(103.1, 106.72, 476.0, "This goes on for minutes, with no single moment to brace for.", 1.03, 1.09),
  L(106.72, 108.04, 492.2, "It just keeps coming.", 1.3, 1.36, 0.6, 0.5),
  // block 8
  { a: 108.04, b: 112.6, vo: "Lake Charles is more than thirty miles from the Gulf. (InlandRuler on NAIP)",
    node: () => <InlandRuler src={GR + "naip.jpg"} iw={2600} ih={1800} coast={[1366, 1360]} city={[1366, 448]} pxPerMile={28.9} at={8} len={F(2.6)} coastLabel="GULF OF MEXICO" cityLabel="LAKE CHARLES" distLabel="31 MILES" z0={1.0} z1={1.12} /> },
  L(112.6, 117.67, 536.0, "People that far inland tend to think of hurricanes as a coastal problem, and Laura was still a major hurricane when it got here.", 1.03, 1.1),
  // block 9
  L(117.67, 121.0, 544.0, "According to the two chasers, debris trapped them on the garage's second level,", 1.04, 1.1),
  L(121.0, 124.0, 572.5, "and they had to find another way down. (the dark stair rail)", 1.04, 1.1),
  { a: 124.0, b: 135.64, vo: "Laura's eye passed almost directly over the city, close to the airport, at around 2:20 ... 956 millibars, the lowest the station had ever measured. (ASOS pressure)",
    node: () => <StationTrace bg={GR + "laura.mp4"} bgFrom={480.0} data={PRES} t0="9 PM" minutes={420} ticks={HOUR} vmin={950} vmax={1010} vticks={[960, 980, 1000]} unit="MB"
      drawAt={8} drawLen={F(4.0)} mark={{ m: 320, label: "LOWEST, 2:20 AM", at: F(4.0) }} station="LAKE CHARLES AIRPORT: AIR PRESSURE" /> },
  L(135.64, 138.37, 482.8, "Low pressure is what drives a hurricane's winds.", 1.3, 1.36, 0.45, 0.5),
  { a: 138.37, b: 144.48, vo: "Down on the coast, a structure in Creole was later found with a water line 17.1 feet above the ground. (Louisiana Sea Grant, Cameron Parish)",
    src: GR + "cameron.jpg", still: true, s0: 1.04, s1: 1.16, fx: 0.35, fy: 0.5, over: <RedLabel text="CAMERON PARISH, LOUISIANA" at={F(0.6)} hold={F(4.6)} /> },
  // block 10
  L(144.48, 145.71, 664.0, "They got out. (headlights at the bottom of the garage)", 1.04, 1.08),
  { a: 145.71, b: 149.6, vo: "Laura took 81 lives, 47 of them in the storm itself, (a Lake Charles house with no roof)", src: GR + "noroof.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.55 },
  { a: 149.6, b: 153.63, vo: "and caused at least 23.3 billion dollars in damage. (Air National Guard clearing downtown)", src: GR + "ng2.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.4, fy: 0.5 },
  L(153.63, 158.4, 576.5, "Many of the others came in the days after, in the heat, in a region with no power. (the dark garage)", 1.04, 1.1),
  { a: 158.4, b: 162.6, vo: "Six weeks later Hurricane Delta came ashore a few miles from where Laura had and hit Lake Charles again, (NASA MODIS, Delta in the Gulf)",
    src: GR + "delta.jpg", still: true, s0: 1.1, s1: 1.25, fx: 0.55, fy: 0.45, over: <RedLabel text="HURRICANE DELTA, OCTOBER 2020" at={F(0.8)} hold={F(3.0)} /> },
  { a: 162.6, b: 166.96, vo: "while the blue tarps were still on the roofs. (CBP officers tarping a Lake Charles roof)", src: GR + "tarp1.jpg", still: true, s0: 1.06, s1: 1.16, fx: 0.4, fy: 0.55 },
];

const SHOTS: Sh[] = [
  ...VO_SHOTS.map((s) => ({ ...s, a: T(s.a), b: s.b >= 166.9 ? END : T(s.b - 0.001) + 0.001 })),
  ...RAWS.map((r, i) => ({ a: RS[i], b: BS[i + 1], vo: "RAW: " + r.what, src: "laura.mp4", from: r.a, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 })),
].sort((x, y) => x.a - y.a);

// one camera all night: every join of two windows of it gets a blur-dip; designed glitches between sections
export const CUTS: FxCut[] = (() => {
  const c: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }];
  for (let i = 1; i < SHOTS.length; i++) if (SHOTS[i].src === "laura.mp4" && SHOTS[i - 1].src === "laura.mp4") c.push({ at: F(SHOTS[i].a), kind: "blurDip", len: 10 });
  c.push({ at: F(T(43.08)), kind: "glitch", len: 10 }, { at: F(T(81.98)), kind: "zoomHit", len: 10 }, { at: F(T(124.0)), kind: "glitch", len: 10 }, { at: F(T(144.48)), kind: "blurDip", len: 12 });
  return c.sort((a, b) => a.at - b.at).filter((x, i, arr) => i === 0 || x.at - arr[i - 1].at > 14);
})();
export const CUT_TIMES = CUTS.map((c) => c.at / 30);

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const n = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={n} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(14.37), "sfx_n2/whoosh_02.wav", -30],
  [T(43.08) - 0.05, "sfx_n2/glitch_03.wav", -28],
  [T(53.73) + 3.0, X + "static_1.wav", -24],          // the radar's outage frame
  [T(81.98), "sfx_n2/whoosh_01.wav", -30],
  [T(81.98) + 6.9, X + "metal_clank_2.wav", -26],      // the 140 mph square lands
  [T(108.04), "sfx_n2/whoosh_02.wav", -30],
  [T(124.0) - 0.05, "sfx_n2/glitch_01.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE EYEWALL FROM THE GARAGE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={Math.max(1, F(s.b) - F(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {BL.map(([s, e], i) => (
        <Sequence key={"v" + i} from={F(BS[i])} durationInFrames={F(e - s) + (i === BL.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(s)} /></Sequence>
      ))}
      {RAWS.map((r, i) => {
        const n = F(r.b - r.a);
        return <Sequence key={"r" + i} from={F(RS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + "laura_clean.wav")} startFrom={F(r.a)} volume={(f) => dB(-3) * interpolate(f, [0, 6, n - 18, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {/* music: Epidemic ambient Music 3 (case 13 = Music 4, case 14 = Music 1) under the VO blocks only */}
      {BL.map(([s, e], i) => {
        const n = F(e - s) + (i === BL.length - 1 ? 24 : 0);
        return <Sequence key={"m" + i} from={F(BS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(60 + BS[i] - TITLE)} volume={(f) => dB(-20) * interpolate(f, [0, 20, n - 20, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
