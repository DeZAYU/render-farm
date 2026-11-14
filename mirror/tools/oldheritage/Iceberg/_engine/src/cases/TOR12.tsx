// Tornado #12 — Hesston and Goessel, Kansas, 13 March 1990: two F5s from one supercell. v2 (owner rule 5b): all 8 cut-sheet raws in their
// cue positions and order, trimmed to the moment, sound = rawclean.py output (media/rN_clean.wav), never the clip's own track.
// Channel grammar (brand.tsx) + devices built for THIS case (dev/TOR12_*): CamDate (the camcorder's own "03 13 90" stamp is the date),
// TwinTrack (both SPC tracks drawn on a tilted NAIP plane), OrbitTrace (the satellite explained on the real VHS frame), MergeFrames (the four
// photographs of the merge), Cycloid (scour loops drawn on a real Goessel field), DebrisCarry (checks carried 85 / 115 miles).
// Footage: the 1990 VHS (vortexva repost, "2011vortexva" delogo'd), NWS Wichita's two Hesston clips (nws1 = added music in the upload:
// its raw plays the cleaned track + real wind; nws2 = the filmer's own voice). VO = one take, "Twelve." dropped, split only at the raws,
// at measured silences. Timeline computed by dev/TOR12_layout.ts.
// Source cuts: vhs 35.10 hard; soft 51.89 / 241.61 / 243.01 / 246.25 / 311.41 / 332.0 / 336.6-338.94 / 346.18 / 351-356 / 366.17 / 390.02 /
// 391.86 / 512.08 / 531.66 / 542.04; nws1 14.88, 24.66; nws2 30.36, 42.71. Every window starts >= 0.7 s after one and never crosses one.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type TransKind } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, TitleCard } from "../brand";
import { CamDate } from "../dev/TOR12_CamDate";
import { TwinTrack } from "../dev/TOR12_TwinTrack";
import { OrbitTrace } from "../dev/TOR12_OrbitTrace";
import { MergeFrames } from "../dev/TOR12_MergeFrames";
import { Cycloid } from "../dev/TOR12_Cycloid";
import { DebrisCarry } from "../dev/TOR12_DebrisCarry";
import { layout, type Part, type ShotSpec, type RawPart } from "../dev/TOR12_layout";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

// NAIP track plane (3600x3600, EPSG:3857, bbox -98.45,37.45 / -96.85,38.75). SPC: Hesston 37.77,-98.02 -> 38.18,-97.37 (48 mi); Goessel 38.15,-97.43 -> 38.42,-97.17 (22 mi)
const HESSTON_TRACK: [number, number][] = [[994, 2720], [1248, 2535], [1517, 2359], [1756, 2023], [2018, 1847], [2260, 1706], [2410, 1586]];
const GOESSEL_TRACK: [number, number][] = [[2279, 1670], [2371, 1539], [2462, 1404], [2609, 1273], [2756, 1105], [2846, 920]];
const vhs = (t: number, from: number, o: Partial<ShotSpec> = {}): ShotSpec => ({ t, src: "vhs.mp4", from, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55, ...o });

export const PARTS: Part[] = [
  // ▶ RAW 1 [VHS 0:18-0:48]: the Hesston tornado; "we better head for the barn 'cause that one's on the ground too. Look at that roof."
  { kind: "raw", src: "vhs.mp4", from: 36.5, dur: 13.8, audio: "r1_clean.wav", tr: "glitch" },
  { kind: "vo", t0: 0.79, t1: 14.36, shots: [
    { t: 0.79, id: "camdate", tr: "blurDip" },                                   // Half past four on Tuesday the 13th of March 1990, near Hesston, Kansas.
    { t: 6.17, id: "track1", tr: "whip" },                                       // touched down northeast of Pretty Prairie ... forty-eight miles.
    vhs(11.74, 95.5, { tr: "blurDip" }),                                         // A second tornado is about to form beside it.
  ] },
  // ▶ RAW 2 [VHS 1:31-2:01]: the wedge with the new lowering beside it
  { kind: "raw", src: "vhs.mp4", from: 105.0, dur: 10.0, audio: "r2_clean.wav", tr: "blurDip" },
  { kind: "vo", t0: 14.36, t1: 94.05, shots: [   // 3 Nov: RAWs 3-7 removed (raws only at incident moments), VO parts merged
    vhs(14.36, 186.0, { s0: 1.06, s1: 1.12, fy: 0.6, tr: "blurDip" }),          // Witnesses saw a new tornado form to the north.
    vhs(17.34, 248.0, { s0: 1.08, s1: 1.14, fx: 0.35, tr: "blurDip" }),         // The Hesston tornado became its satellite,
    { t: 19.64, id: "orbit", tr: "blurDip" },                                    // which means a smaller tornado orbiting a bigger one.
    { t: 22.69, id: "merge" },                                                   // It circled the new tornado and then merged into it.
    vhs(25.65, 312.1, { s0: 1.03, s1: 1.09 }),                                   // Two F5s from one supercell in a single afternoon
    vhs(29.0, 321.0, { s0: 1.12, s1: 1.04, fx: 0.4, tr: "blurDip" }),           // is something most forecasters never see in a whole career.
    { t: 32.44, src: "nws1.mp4", from: 27.0, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.5 },  // Near Haven the damage path was ... wide.
    { t: 37.28, src: "nws1.mp4", from: 44.0, s0: 1.14, s1: 1.08, fx: 0.4, fy: 0.55, tr: "blurDip" }, // In Hesston itself, parts ... F5.
    { t: 41.32, src: "nws2.mp4", from: 43.6, s0: 1.1, s1: 1.16, fx: 0.55, fy: 0.45 }, // In western Hesston, 226 homes and 21 businesses ...
    { t: 47.27, id: "swept" },                                                   // Some were swept clean off their foundations.
    { t: 49.83, src: GR + "farm_debris.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.4, fy: 0.5 }, // twenty farms were torn apart.
    vhs(53.18, 357.0),                                                           // On the old Fujita scale,
    vhs(56.5, 141.0, { s0: 1.14, s1: 1.06, fx: 0.45, fy: 0.6, tr: "blurDip" }), // F5 meant winds of 261 to 318
    vhs(59.82, 384.5, { s0: 1.03, s1: 1.09, tr: "blurDip" }),                  // The tornado that swallowed it became the Goessel F5.
    { t: 63.02, id: "track2", tr: "glitch" },                                    // The Goessel tornado ran 22 miles ... Hillsboro.
    vhs(69.41, 444.5),                                                           // Near Goessel, surveyors called the damage extreme F5.
    vhs(73.51, 466.0, { s0: 1.08, s1: 1.14, fx: 0.4, fy: 0.7, tr: "blurDip" }), // They found cycloidal scour marks in the fields.
    { t: 76.40, id: "cycloid", tr: "blurDip" },                                  // Those are loops carved into the dirt ...
    vhs(81.92, 160.0, { s0: 1.03, s1: 1.1, fy: 0.6 }),                           // among the strongest tornadoes ever documented.
    vhs(86.13, 498.0, { s0: 1.05, s1: 1.1, fy: 0.6, tr: "blurDip" }),           // This was before every forecast office had Doppler radar.
    { t: 89.80, src: "nws1.mp4", from: 52.5, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.55 }, // ... spotters and people on the ground.
  ] },
  // ▶ RAW 8 [VHS 7:39-8:09]: people on the ground as it passes: "Come on, quick! You can hear it, sounds like a jet."
  { kind: "raw", src: "vhs.mp4", from: 532.4, dur: 6.6, audio: "r8_clean.wav", s0: 1.03, s1: 1.07, fy: 0.6 },
  { kind: "vo", t0: 94.05, t1: 130.35, shots: [
    vhs(94.05, 576.0, { s0: 1.1, s1: 1.04, fy: 0.6, tr: "blurDip" }),           // Two people were lost. In Burrton,
    { t: 97.9, src: "nws1.mp4", from: 36.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.6 }, // a young boy ... chimney ... basement
    vhs(101.32, 556.0, { s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.65 }),               // Near Goessel, an elderly woman ...
    vhs(105.84, 368.0, { s0: 1.08, s1: 1.16, fx: 0.7, fy: 0.68, tr: "blurDip" }), // old army barracks ... no basement.
    { t: 110.29, src: GR + "hesston_debris.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.55, fy: 0.5 }, // Around sixty were injured,
    { t: 113.6, src: GR + "hesston_street.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.4, fy: 0.5 }, // Harvey County ... 25 million
    { t: 116.63, id: "debris", tr: "zoomHit" },                                  // Checks ... Manhattan ... near Blaine.
    vhs(127.05, 562.5, { s0: 1.04, s1: 1.1, fy: 0.6, tr: "blurDip" }),          // That boy's family were doing exactly what they'd been told to do.
  ] },
];
export const L = layout(4.0, PARTS);
export const DUR = F(L.end + 0.4);

const node = (id: string): React.ReactNode => {
  switch (id) {
    case "camdate": return <CamDate src={GR + "nws1.mp4"} from={15.6} sw={640} sh={480} box={[95, 366, 247, 402]} inAt={F(1.25)} outAt={F(4.15)} date="TUESDAY, MARCH 13, 1990" place="HESSTON, KANSAS" placeAt={F(4.55)} />;
    case "track1": return <TwinTrack src={GR + "naip_track.jpg"} iw={3600} ih={3600} tilt={36}
      keys={[{ f: 0, cx: 1084, cy: 2609, z: 3.3 }, { f: F(2.0), cx: 1363, cy: 2404, z: 2.6 }, { f: F(5.57), cx: 1854, cy: 2060, z: 1.95 }]}
      tracks={[{ pts: HESSTON_TRACK, at: F(0.7), len: F(4.6) }]}
      labels={[{ x: 994, y: 2692, text: "PRETTY PRAIRIE", at: F(0.3), hold: F(3.0) }, { x: 2277, y: 1703, text: "HESSTON", at: F(4.2) }]} />;
    case "orbit": return <OrbitTrace still={GR + "v295.jpg"} sw={640} sh={480} a={[350, 192, 482, 365]} b={[40, 238, 320, 392]} aLabel="HESSTON TORNADO" bLabel="NEW TORNADO"
      centre={[185, 318]} rx={225} ry={62} startAng={-0.18} at={{ a: 4, b: 16, orbit: 30, len: 52 }} />;
    case "merge": return <MergeFrames frames={[GR + "merge1.jpg", GR + "merge2.jpg", GR + "merge3.jpg", GR + "merge4.jpg"]} ar={1125 / 483} bg={GR + "merge3.jpg"} />;
    case "swept": return <Inset src={GR + "swept.jpg"} still box={0.6} ar={1248 / 928} drift={0.08} />;
    case "track2": return <TwinTrack src={GR + "naip_track.jpg"} iw={3600} ih={3600} tilt={30}
      keys={[{ f: 0, cx: 2182, cy: 1765, z: 2.3 }, { f: F(6.69), cx: 2560, cy: 1330, z: 2.5 }]}
      tracks={[{ pts: HESSTON_TRACK, at: -60, len: 1, head: false }, { pts: GOESSEL_TRACK, at: F(0.7), len: F(4.4), color: "#E3141B", w: 11 }]}
      labels={[{ x: 2462, y: 1403, text: "GOESSEL", at: F(1.6), hold: F(2.6) }, { x: 2772, y: 1109, text: "HILLSBORO", at: F(4.3) }]} />;
    case "cycloid": return <Cycloid src={GR + "goessel_field.jpg"} iw={2400} ih={1800} focus={[1150, 560]} z0={1.25} z1={1.36} at={8} R={150} loops={4.0} />;
    case "debris": return <DebrisCarry src={GR + "naip_kansas.jpg"} iw={2950} ih={3000} origin={[1388, 2425]} originLabel="HESSTON" originAt={F(0.4)}
      keys={[{ f: 0, cx: 1388, cy: 2425, z: 2.0 }, { f: F(1.2), cx: 1500, cy: 2200, z: 1.7 }, { f: F(4.4), cx: 2150, cy: 1150, z: 1.15 }, { f: F(10.4), cx: 2350, cy: 760, z: 1.25 }]}
      drops={[{ to: [2393, 859], at: F(1.4), len: F(2.8), label: "MANHATTAN · 85 MILES", labelAt: F(4.3) },
        { to: [2559, 401], at: F(5.6), len: F(2.6), label: "NEAR BLAINE · 115 MILES", labelAt: F(8.9), bend: -0.1 }]} />;
  }
  return null;
};

const ShotView: React.FC<{ s: ShotSpec | RawPart; n: number }> = ({ s, n }) => {
  if ("id" in s && s.id) return <>{node(s.id)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={n} from={s.from} still={"still" in s ? s.still : false} s0={s.s0 ?? 1.02} s1={s.s1 ?? 1.07} fx={s.fx ?? 0.5} fy={s.fy ?? 0.55} /></FilmLook_FX>;
};

const CUTS: FxCut[] = L.cuts.map((c) => ({ at: F(c.at), kind: c.kind as TransKind, len: c.len }));
// music: Music 4 (-11.9 LUFS -> -21.5 dB ≈ the channel bed level) under the VO parts only, fresh offset each time
const vos = L.vo.map(([at, t0, t1]) => [at - 0.4, at + (t1 - t0) + 0.3] as [number, number]);
const MUS_OFF = [0, 14, 33, 43, 62, 66, 90, 82];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [[3.95, "sfx_n2/glitch_02.wav", -24]];
L.shots.forEach((s) => { if (!s.raw && "id" in s.spec) {
  const id = (s.spec as ShotSpec).id;
  if (id === "track1") SFX.push([s.a, "sfx_n2/whoosh_02.wav", -29]);
  if (id === "orbit") SFX.push([s.a, X + "vhs_1.wav", -24]);
  if (id === "merge" || id === "swept") SFX.push([s.a, X + "camera_shutter_2.wav", -27]);
  if (id === "track2") SFX.push([s.a - 0.03, "sfx_n2/glitch_03.wav", -28]);
  if (id === "cycloid") SFX.push([s.a + 0.1, X + "wind_gust_1.wav", -27]);
  if (id === "debris") { SFX.push([s.a - 0.04, "sfx_n2/whoosh_01.wav", -29]); SFX.push([s.a + 2.5, X + "paper_2.wav", -27]); SFX.push([s.a + 6.9, X + "paper_3.wav", -27]); }
} });
L.raws.forEach(([a, , p]) => (p.sfx ?? []).forEach(([t, f, d]) => SFX.push([a + t, f, d])));

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWO F5s FROM ONE STORM" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {L.shots.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s.spec} n={F(s.b) - F(s.a)} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {L.vo.map(([at, a, b], i) => <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE12.mp3")} startFrom={F(a)} /></Sequence>)}
      {/* raws: cleaned sound only (rawclean.py), faded to 0 before the VO comes back */}
      {L.raws.map(([a, b, p], i) => <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile(MD + p.audio)} volume={(f) => dB(p.gain ?? 0) * interpolate(f, [0, 6, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {vos.map(([a, b], i) => <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(MUS_OFF[i] ?? 0)} volume={(f) => dB(-21.5) * interpolate(f, [0, 18, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
      </Sequence>)}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
