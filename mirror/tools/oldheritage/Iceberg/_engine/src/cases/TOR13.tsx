// Tornado #13 — Pilger, Nebraska, 16 June 2014: twin EF4s from one supercell. v2 (owner rule 5b): all 8 cut-sheet raws at their cue
// positions and in order, trimmed to the moment, sound = rawclean.py output (media/rN_clean.wav). Timeline computed by dev/TOR12_layout.ts.
// Devices built for THIS case (dev/TOR13_*): StormFamily (the real radar loop of the supercell, IEM NEXRAD composites on NAIP, the six SPC
// tracks appearing at their touchdown minute; reused once in "costliest" mode), DepthStill (NOAA photo of the twins cut into depth bands),
// StatementRule (the real NWS statement "2 CONFIRMED TORNADOES", ruled in red), SwathEdge (the path through the village on the NWS aerial).
// Footage: Adam Lucio's uncut chase (personal channel). His name mark was delogo'd and the window clips are cropped from the top-left
// 1653x930 (the delogo patch sits outside it), cut as short-GOP gl_<source s>.mp4 with a 1 s pad. Brent Koops' clip (the cut sheet's
// [KOOPS] cues) is NOT used: it carries "Not For Broadcast" and a centre © watermark; Lucio's twins fill those cue positions.
// VO = one take (no count word in it), split only at the raws, at measured silences. Source cuts (lucio): 44.70, 794.03, 843.77, 872.80.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type TransKind } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { StormFamily, type FamTrack } from "../dev/TOR13_StormFamily";
import { DepthStill } from "../dev/TOR13_DepthStill";
import { StatementRule } from "../dev/TOR13_StatementRule";
import { SwathEdge } from "../dev/TOR13_SwathEdge";
import { layout, type Part, type ShotSpec, type RawPart } from "../dev/TOR12_layout";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

const RADAR = Array.from({ length: 40 }, (_, i) => { const m = 19 * 60 + 30 + i * 5; return `${GR}radar/r_${String(Math.floor(m / 60)).padStart(2, "0")}${String(m % 60).padStart(2, "0")}.png`; });
// SPC 2014 tornadoes of the family (two EF0 + four EF4), px in naip_region (3600x2600, EPSG:3857 bbox -97.75,41.72 / -96.35,42.42)
const TRACKS: FamTrack[] = [
  { a: [1002, 2031], b: [1039, 1980], z: 1238, ef4: false },
  { a: [1080, 1916], b: [1387, 1393], z: 1242, ef4: true },
  { a: [1577, 1709], b: [2316, 1123], z: 1260, ef4: true, key: true },
  { a: [1826, 1635], b: [2073, 1140], z: 1273, ef4: true },
  { a: [2266, 1106], b: [2435, 328], z: 1300, ef4: true },
  { a: [2983, 296], b: [2996, 296], z: 1361, ef4: false },
];
const TOWNS = [{ x: 1353, y: 1719, name: "STANTON" }, { x: 1790, y: 1515, name: "PILGER" }, { x: 2150, y: 1591, name: "WISNER" }, { x: 2276, y: 613, name: "WAKEFIELD" }];
const lu = (t: number, from: number, o: Partial<ShotSpec> = {}): ShotSpec => ({ t, src: `gl_${from.toFixed(1).padStart(6, "0")}.mp4`, from: 1.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55, ...o });
const raw = (from: number, dur: number, n: number, o: Partial<RawPart> = {}): RawPart => ({ kind: "raw", src: `gl_${from.toFixed(1).padStart(6, "0")}.mp4`, from: 1.0, dur, audio: `r${n}_clean.wav`, s0: 1.03, s1: 1.08, tr: "blurDip", ...o });

export const PARTS: Part[] = [
  { kind: "vo", t0: 0.0, t1: 22.87, shots: [
    { t: 0.0, id: "family", tr: "glitch" },                                      // Six tornadoes, four of them EF4, ... 16th of June 2014.
    { t: 8.8, id: "outlook", tr: "whip" },                                       // That morning the SPC called it a slight risk.
    { t: 12.08, id: "watch" },                                                   // By the afternoon ... particularly dangerous situation tornado watch.
    lu(16.99, 72.0, { s0: 1.06, s1: 1.12 }),                                     // The Pilger tornado touched down at four in the afternoon,
    lu(20.14, 98.0, { s0: 1.16, s1: 1.1, tr: "blurDip" }),                      // five and a half miles southwest of the village.
  ] },
  raw(46.0, 12.0, 1),                                                            // ▶ [LUCIO 0:46-1:16] a funnel touching down over the fields
  { kind: "vo", t0: 22.87, t1: 32.73, shots: [   // 3 Nov: RAWs 2, 4, 5, 7, 8 removed (stat lines / near-dup twins), VO parts merged
    lu(22.87, 500.0, { s0: 1.06, s1: 1.12, label: ["NEAR STANTON, NEBRASKA", 1.0, 3.0], tr: "blurDip" }), // The first tornado of the family ... 400 yards
    lu(28.59, 800.0, { tr: "blurDip" }),                                         // Two of them ended up side by side ... north of Wisner.
  ] },
  raw(826.5, 16.5, 3),                                                           // ▶ [KOOPS 0:03-0:33 -> Lucio] the twins side by side: "Twins!"
  { kind: "vo", t0: 32.73, t1: 70.85, shots: [
    lu(32.73, 812.0, { s0: 1.3, s1: 1.22, fx: 0.32, tr: "blurDip" }),          // The western one was heading for Pilger.
    lu(34.88, 1283.0, { s0: 1.12, s1: 1.18, fx: 0.65, tr: "blurDip" }),        // The eastern one, also an EF4,
    { t: 36.90, src: GR + "second.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.45, fy: 0.5 }, // crossed in front of its twin ... X Road.
    lu(40.77, 1340.0, { tr: "blurDip" }),                                        // Twin tornadoes from one storm do happen.
    { t: 43.49, id: "depth" },                                                   // Two violent ones side by side for this long almost never do.
    lu(47.39, 1376.0),                                                           // both running parallel ... northwest of Wisner.
    lu(51.27, 1045.0, { tr: "blurDip" }),                                        // They crossed Highway 275 about a minute apart.
    lu(54.83, 1425.0, { s0: 1.1, s1: 1.16, fx: 0.4, fy: 0.6, tr: "blurDip" }), // Both are closing on Pilger.
    { t: 56.61, id: "statement", tr: "blurDip" },                                               // The tornado warning named two tornadoes near the village.
    lu(59.66, 1440.0, { fy: 0.6 }),                                              // Pilger's fire chief, Kory Koehlmoos,
    lu(62.22, 1183.0, { tr: "blurDip" }),                                        // was on his way out of town ... turned back.
    lu(66.16, 1450.0, { s0: 1.08, s1: 1.14, fy: 0.6, tr: "blurDip" }),         // The power was already out ... siren ... by hand.
  ] },
  raw(873.5, 10.5, 6),                                                           // ▶ [LUCIO 14:36-15:06] both tornadoes as they near the town
  { kind: "vo", t0: 70.85, t1: 143.47, shots: [
    lu(70.85, 1166.0, { tr: "blurDip" }),                                        // The Pilger tornado crossed almost 24 miles in 46 minutes,
    lu(75.10, 1196.0, { s0: 1.18, s1: 1.1, fx: 0.45, fy: 0.6, tr: "blurDip" }), // with winds up to a hundred and ninety-one.
    { t: 77.38, id: "swath", tr: "blurDip" },                                    // About three quarters of the village ...
    lu(81.33, 1356.0),                                                           // A supercell can cycle, dropping a fresh tornado ...
    lu(85.87, 1401.0, { s0: 1.12, s1: 1.06, fy: 0.6, tr: "blurDip" }),          // and this one did it all afternoon.
    { t: 88.05, src: GR + "skyline.jpg", still: true, s0: 1.18, s1: 1.08, fx: 0.55, fy: 0.45, tr: "blurDip" }, // St. John Lutheran Church ... bell tower,
    { t: 91.71, id: "silos_after" },                                             // and the grain silos were razed.
    { t: 93.87, src: GR + "home.jpg", still: true, s0: 1.04, s1: 1.16, fx: 0.5, fy: 0.55 }, // A young girl ... storm cellar ... injured.
    lu(100.37, 1290.0, { s0: 1.06, s1: 1.12, fx: 0.55 }),                       // A 74-year-old man ... second tornado flipped his car.
    lu(105.89, 1395.0, { fx: 0.5, fy: 0.6, tr: "blurDip" }),                    // eighty-one seconds to pass through the village.
    { t: 109.46, src: GR + "debris.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.5, fy: 0.5 }, // The middle school was torn down ...
    lu(112.25, 1096.0),                                                          // the federal government declared ... a disaster area.
    { t: 116.15, id: "village" },                                                // Pilger had 352 residents ... 240 afterwards.
    { t: 121.79, id: "costliest", tr: "glitch" },                                // 14.25 million ... costliest of the four EF4s
    { t: 129.05, id: "silos_now" },                                              // FEMA put 5.6 million ... silos were back within months,
    { t: 134.41, src: GR + "skyline1.jpg", still: true, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.45 }, // and the church was rebuilt a year later.
    lu(136.77, 1410.0, { s0: 1.03, s1: 1.1, tr: "blurDip" }),                   // most beautiful sights ... village underneath it.
  ] },
];
export const L = layout(4.0, PARTS);
export const DUR = F(L.end + 0.4);

const fam = (mode: "loop" | "costliest") => (
  <StormFamily base={GR + "naip_region.jpg"} iw={3600} ih={2600} frames={RADAR} f0={1170} step={5} tracks={TRACKS} towns={TOWNS} mode={mode}
    cam={mode === "loop" ? [{ cx: 1600, cy: 1500, z: 1.05 }, { cx: 1950, cy: 1250, z: 1.2 }] : [{ cx: 1900, cy: 1350, z: 1.3 }, { cx: 1950, cy: 1420, z: 1.45 }]}
    z0={1232} z1={1366} dateLabel={mode === "loop" ? "MONDAY, JUNE 16, 2014" : undefined} />
);
const node = (id: string): React.ReactNode => {
  switch (id) {
    case "family": return fam("loop");
    case "costliest": return fam("costliest");
    case "outlook": return <Aerial src={C + "assets/spc_outlook.png"} iw={1800} ih={1012} spot={[770, 300, 990, 470]} z0={1.0} z1={1.35} boxAt={10} />;
    case "watch": return <Inset src={C + "assets/spc_watch.png"} still box={0.56} ar={1050 / 918} drift={0.05} />;
    case "depth": return <DepthStill src={GR + "twins_photo.jpg"} iw={2048} ih={1126}
      bands={[{ top: 0, bot: 1, move: 30, scale: 1.0 }, { top: 0.2, bot: 0.86, move: 80, scale: 1.03 }, { top: 0.86, bot: 1.0, move: 170, scale: 1.07 }]} />;
    case "statement": return <StatementRule src={C + "shots/svs.png"} pw={2560} ph={2800} crop={[110, 960, 1480, 1700]}
      rules={[{ box: [448, 1131.8, 1029.2, 1167.8], at: 6, len: 16 }, { box: [186, 1172.6, 505.2, 1208.6], at: 30, len: 12 }]} />;
    case "swath": return <SwathEdge src={GR + "aerial.jpg"} iw={1092} ih={626} at={6} len={40} z0={1.08} z1={1.2} focus0={[520, 330]} focus1={[600, 300]}
      north={[[0, 235], [250, 200], [450, 150], [700, 90], [900, 45], [1092, 18]]} south={[[600, 626], [720, 470], [800, 330], [930, 180], [1092, 92]]} corner={[[0, 626]]} />;
    case "silos_after": return <Aerial src={GR + "aerial.jpg"} iw={1092} ih={626} spot={[440, 88, 660, 152]} z0={1.25} z1={1.45} boxAt={6} />;
    case "village": return <Aerial src={GR + "naip_pilger.jpg"} iw={2400} ih={2100} spot={[880, 640, 2030, 1810]} z0={1.0} z1={1.15} label="PILGER, NEBRASKA" boxAt={10} labelAt={20} />;
    case "silos_now": return <Aerial src={GR + "naip_pilger.jpg"} iw={2400} ih={2100} spot={[1530, 1230, 1780, 1370]} z0={1.6} z1={1.9} boxAt={F(3.3)} />;
  }
  return null;
};

const ShotView: React.FC<{ s: ShotSpec | RawPart; n: number }> = ({ s, n }) => {
  if ("id" in s && s.id) return <>{node(s.id)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  const lab = "label" in s ? s.label : undefined;
  return <>
    <FilmLook_FX grain={0.07}><Shot_FX src={src} n={n} from={s.from} still={"still" in s ? s.still : false} s0={s.s0 ?? 1.02} s1={s.s1 ?? 1.07} fx={s.fx ?? 0.5} fy={s.fy ?? 0.55} /></FilmLook_FX>
    {lab && <RedLabel text={lab[0]} at={F(lab[1])} hold={F(lab[2])} />}
  </>;
};

const CUTS: FxCut[] = [{ at: F(4.0), kind: "glitch", len: 10 }, ...L.cuts.filter((c) => c.at > 4.05).map((c) => ({ at: F(c.at), kind: c.kind as TransKind, len: c.len }))];
const vos = L.vo.map(([at, t0, t1]) => [Math.max(4.0, at - 0.4), at + (t1 - t0) + 0.3] as [number, number]);
const MUS_OFF = [0, 23, 30, 36, 46, 62, 70, 78, 52];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24]];
L.shots.forEach((s) => { if (!s.raw && "id" in s.spec) {
  const id = (s.spec as ShotSpec).id;
  if (id === "family") SFX.push([s.a + 0.2, X + "static_3.wav", -32]);
  if (id === "outlook") SFX.push([s.a, "sfx_n2/whoosh_02.wav", -29]);
  if (id === "watch") SFX.push([s.a + 0.05, X + "page_turn_1.wav", -30]);
  if (id === "depth") SFX.push([s.a, "sfx_n2/whoosh_01.wav", -31]);
  if (id === "statement") SFX.push([s.a, X + "paper_2.wav", -29]);
  if (id === "swath") SFX.push([s.a + 0.03, "sfx_n2/whoosh_03.wav", -31]);
  if (id === "costliest") SFX.push([s.a - 0.03, "sfx_n2/glitch_03.wav", -28]);
} });

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWIN TORNADOES OVER THE VALLEY" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {L.shots.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s.spec} n={F(s.b) - F(s.a)} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {L.vo.map(([at, a, b], i) => <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(a)} /></Sequence>)}
      {L.raws.map(([a, b, p], i) => <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile(MD + p.audio)} volume={(f) => dB(p.gain ?? 0) * interpolate(f, [0, 6, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {vos.map(([a, b], i) => <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(MUS_OFF[i] ?? 0)} volume={(f) => dB(-15.2) * interpolate(f, [0, 18, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
