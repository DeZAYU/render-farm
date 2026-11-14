// Tornado #14 — Greenfield, Iowa, 21 May 2024: the tornado that took the wind turbines. All 6 cut-sheet raws at their cue positions and in
// order, trimmed to the moment, sound = rawclean.py output (media/rN_clean.wav). Timeline computed by dev/TOR12_layout.ts.
// Devices built for THIS case (dev/TOR14_*): TurbineFeather (the turbine's own defence drawn as a mechanism over the real wind farm:
// blades pitch edge-on, the rotor brakes to a stop), PathFollow (the camera rides the NWS-surveyed line across the Greenfield street map).
// Plus channel grammar: Aerial boxes on real data images (SPC storm reports, the DOW6 velocity scan), Inset (NWS radar, DOW7 scan).
// Footage: Stas is Chasing (STAS, only from 2:47 on: earlier tornadoes are other ones; crown handle mark delogo'd x1800 y965 w118 h110;
// media/stas.mp4 = source 160-290 s) and Forrest's chase vlog (FORRY, media/forry.mp4 = source 270-560 s, windows avoid its burned-in
// captions at ~266-271, 418-428, 495-503, 532-538 s and the profanity at 308-312 s / STAS 273 s).
// Source cuts: stas 218.13, 265.54; forry 397.50, 518.47 (+ camera moves at 299, 306.5, 310, 312.5, 314, 333.5, 345.5, 362 avoided or crossed only inside raws).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type TransKind } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { TurbineFeather } from "../dev/TOR14_TurbineFeather";
import { PathFollow } from "../dev/TOR14_PathFollow";
import { layout, type Part, type ShotSpec, type RawPart } from "../dev/TOR12_layout";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/", AS = C + "assets/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

const st = (t: number, src: number, o: Partial<ShotSpec> = {}): ShotSpec => ({ t, src: "stas.mp4", from: src - 160, s0: 1.05, s1: 1.11, fx: 0.5, fy: 0.55, ...o });
const fo = (t: number, src: number, o: Partial<ShotSpec> = {}): ShotSpec => ({ t, src: "forry.mp4", from: src - 270, s0: 1.05, s1: 1.11, fx: 0.5, fy: 0.55, ...o });
const ph = (t: number, file: string, o: Partial<ShotSpec> = {}): ShotSpec => ({ t, src: GR + file, still: true, s0: 1.04, s1: 1.13, fx: 0.5, fy: 0.5, ...o });
const raw = (clip: "stas" | "forry", src: number, dur: number, n: number, o: Partial<RawPart> = {}): RawPart =>
  ({ kind: "raw", src: clip + ".mp4", from: src - (clip === "stas" ? 160 : 270), dur, audio: `r${n}_clean.wav`, s0: 1.03, s1: 1.08, tr: "blurDip", ...o });
const TOWN_PATH: [number, number][] = [[100, 2580], [500, 2269], [900, 1987], [1300, 1760], [1700, 1492], [2100, 1251], [2500, 966], [2900, 713], [3300, 493], [3700, 268]];

export const PARTS: Part[] = [
  raw("stas", 167.5, 18.5, 1, { tr: "glitch" }),                                 // ▶ [STAS 2:47-3:17] beside the road: "full zoom out, here we go ... oh my!"
  { kind: "vo", t0: 0.77, t1: 16.01, shots: [
    fo(0.77, 277.0, { label: ["TUESDAY, MAY 21, 2024", 0.9, 3.2], tr: "blurDip" }), // Southwest Iowa, Tuesday the 21st of May 2024,
    { t: 4.76, id: "reports", tr: "whip" },                                      // a day with several tornadoes on the ground, and this is the one that hit Greenfield.
    st(9.33, 199.0, { s0: 1.08, s1: 1.14 }),                                     // Rain-wrapped means the tornado sits inside the rain,
    fo(12.40, 285.2, { tr: "blurDip" }),                                         // so by the time anyone in town can see it, it's already arriving.
  ] },
  raw("stas", 219.0, 17.0, 2),                                                   // ▶ [STAS 3:40-4:10] the rain-wrapped tornado, the roar
  { kind: "vo", t0: 16.01, t1: 21.31, shots: [
    fo(16.01, 301.0, { tr: "blurDip" }),                                         // Southwest of town, along Iowa Route 25,
    fo(19.41, 307.4, { s0: 1.12, s1: 1.06, fx: 0.6, tr: "blurDip" }),          // it ran straight into a wind farm.
  ] },
  raw("forry", 334.0, 18.0, 3),                                                  // ▶ [FORRY 5:28-5:58] among the turbines: "this thing is booking across the ground"
  { kind: "vo", t0: 21.31, t1: 68.51, shots: [  // (3 Nov) raws 4 + 5 removed: explanation runs on over silent footage
    { t: 21.31, id: "feather", tr: "blurDip" },                                  // A turbine is built to turn its blades out of strong wind and shut down,
    ph(25.52, "turbine.jpg", { fx: 0.62 }),                                      // and many of them collapsed along this path.
    { t: 28.04, id: "dow6" },                                                    // A Doppler on Wheels briefly measured 309 to 318 ...
    fo(33.61, 353.0, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // a little above the ground.
    st(35.16, 255.0, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // Only three readings over 300 ...
    ph(39.61, "dmg.jpg"),                                                        // The survey team's own estimate was a hundred and eighty-five.
    { t: 43.17, id: "dow7" },                                                    // Forty-four metres up, the radar also caught a gust of 263 to 271.
    st(47.0, 245.0, { s0: 1.06, s1: 1.12 }),
    fo(49.91, 296.0, { s0: 1.1, s1: 1.04, tr: "blurDip" }),                    // It probably lasted less than a second.
    st(52.11, 190.0, { tr: "blurDip" }),                                         // It was rated EF4,
    st(53.87, 205.0, { s0: 1.14, s1: 1.08, fx: 0.45, tr: "blurDip" }),         // which sounds like a contradiction after a reading like that.
    ph(56.78, "slab2.jpg"),                                                      // The scale rates damage.
    ph(58.46, "dmg.jpg", { s0: 1.2, s1: 1.1, fx: 0.7, fy: 0.55 }),              // ... only as high as the strongest thing it hits allows.
    ph(62.87, "slab1.jpg", { s0: 1.04, s1: 1.14, fx: 0.4 }),                    // EF5 needs something like a well-built house swept off its foundation.
    { t: 67.17, id: "town", tr: "blurDip" },                                   // Greenfield is next.
  ] },
  raw("stas", 266.3, 6.3, 6),                                                    // ▶ [FORRY 9:10, SCRUB -> STAS 4:26] moving on toward town
  { kind: "vo", t0: 68.51, t1: 123.79, shots: [
    { t: 68.51, id: "radar", tr: "blurDip" },                                    // An experimental forecasting system had flagged ...
    fo(72.4, 384.0, { s0: 1.04, s1: 1.1 }),                                      // ... more than an hour before the tornado formed.
    st(76.16, 280.0, { s0: 1.04, s1: 1.1, tr: "blurDip" }),                    // It tracked for 48 minutes on a path of 42 miles,
    fo(79.75, 311.0, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // up to thirteen hundred yards wide.
    st(82.06, 213.0, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // It was moving at about forty-five miles an hour,
    { t: 84.81, id: "path", tr: "whip" },                                        // and it spent less than a minute in town.
    ph(87.19, "aerial_dmg.jpg", { s0: 1.06, s1: 1.18 }),                         // Dozens of homes were levelled,
    fo(88.78, 448.6, { s0: 1.04, s1: 1.1 }),                                     // and the county hospital's chief executive said ...
    fo(91.6, 510.6, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                    // ... the whole building would have been gone.
    fo(94.20, 504.6, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // Four elderly people in Greenfield didn't make it,
    st(96.92, 192.0, { s0: 1.06, s1: 1.12, tr: "blurDip" }),                   // ... a woman whose car was caught on Highway 148 in Adams County.
    ph(101.64, "slab2.jpg", { s0: 1.16, s1: 1.08, fx: 0.6 }),                    // Thirty-five were hurt.
    fo(103.15, 524.4, { s0: 1.04, s1: 1.1 }),                                    // Half of the town's electricity was back by the morning of the 24th,
    fo(106.0, 514.2, { s0: 1.12, s1: 1.06, tr: "blurDip" }),                   // and the hospital fully reopened six months later.
    ph(110.12, "house.jpg", { s0: 1.04, s1: 1.12, fx: 0.4 }),                   // By that November, 51 permits ... 34 homes under construction.
    { t: 116.14, id: "town2" },                                                  // The local community foundation had raised a million dollars.
    st(119.56, 283.0, { s0: 1.03, s1: 1.1, tr: "blurDip" }),                   // If you only ever read the rating, Greenfield would look smaller than it was.
  ] },
];
export const L = layout(4.0, PARTS);
export const DUR = F(L.end + 0.4);

const node = (id: string): React.ReactNode => {
  switch (id) {
    case "reports": return <Aerial src={AS + "spc_rpts3.png"} iw={1746} ih={1224} spot={[870, 345, 1050, 500]} z0={1.0} z1={1.5} boxAt={F(1.6)} label="GREENFIELD, IOWA" labelAt={F(3.0)} />;
    case "feather": return <TurbineFeather bg={GR + "forry.mp4"} bgFrom={360 - 270} featherAt={F(1.0)} stopAt={F(3.6)} />;
    case "dow6": return <Aerial src={AS + "dow6.png"} iw={1668} ih={1004} spot={[1110, 340, 1490, 640]} z0={1.0} z1={1.3} boxAt={F(1.2)} label="DOPPLER ON WHEELS" labelAt={F(2.0)} />;
    case "dow7": return <Aerial src={AS + "dow7.jpg"} iw={945} ih={710} spot={[370, 380, 650, 560]} z0={1.0} z1={1.18} boxAt={F(1.0)} label="44 METRES UP" labelAt={F(1.6)} />;
    case "town": return <Aerial src={GR + "naip_gf.jpg"} iw={2800} ih={2200} spot={[1036, 560, 2016, 1680]} z0={1.0} z1={1.12} label="GREENFIELD, IOWA" boxAt={4} labelAt={10} />;
    case "town2": return <Aerial src={GR + "naip_gf.jpg"} iw={2800} ih={2200} spot={[1036, 560, 2016, 1680]} z0={1.25} z1={1.1} boxAt={6} />;
    case "radar": return <Inset src={AS + "radar2039.png"} still box={0.66} ar={1722 / 940} drift={0.06} />;
    case "path": return <PathFollow src={AS + "townmap.png"} iw={3840} ih={2914} path={TOWN_PATH} u0={0.22} u1={0.86} z0={1.7} z1={2.1} />;
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

const CUTS: FxCut[] = L.cuts.map((c) => ({ at: F(c.at), kind: c.kind as TransKind, len: c.len }));
const vos = L.vo.map(([at, t0, t1]) => [at - 0.4, at + (t1 - t0) + 0.3] as [number, number]);
// music: Music 3 (-13.8 LUFS -> -19.5 dB ≈ channel bed level), a fresh offset per VO stretch
const MUS_OFF = [40, 56, 62, 0];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24]];
L.shots.forEach((s) => { if (!s.raw && "id" in s.spec) {
  const id = (s.spec as ShotSpec).id;
  if (id === "reports" || id === "path") SFX.push([s.a, "sfx_n2/whoosh_02.wav", -29]);
  if (id === "feather") { SFX.push([s.a, X + "wind_gust_1.wav", -26]); SFX.push([s.a + 3.4, X + "metal_clank_1.wav", -30]); }
  if (id === "dow6" || id === "radar") SFX.push([s.a + 0.05, X + "static_1.wav", -32]);
  if (id === "dow7") SFX.push([s.a, X + "camera_shutter_2.wav", -29]);
} });

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE TORNADO THAT TOOK THE WIND TURBINES" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {L.shots.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s.spec} n={F(s.b) - F(s.a)} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {L.vo.map(([at, a, b], i) => <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(a)} /></Sequence>)}
      {L.raws.map(([a, b, p], i) => <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile(MD + p.audio)} volume={(f) => dB(p.gain ?? 0) * interpolate(f, [0, 6, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {vos.map(([a, b], i) => <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(MUS_OFF[i] ?? 0)} volume={(f) => dB(-19.5) * interpolate(f, [0, 18, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
