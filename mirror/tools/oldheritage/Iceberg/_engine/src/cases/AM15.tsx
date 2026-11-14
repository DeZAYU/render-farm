// Amusement Parks Iceberg #15 (LEVEL 3, case 4): the Hotel Embrujado death, Parque Warner, San Martín de la Vega (Madrid), Sat 13 Aug 2005.
// No film of the event exists; the extra ride-through clips found on small channels hit YouTube's bot check (not bypassed, NOTES.md).
// Built from: Commons photos of the park and the ride building (2003 / 2010 / 2017 / 2021), the park's own photos of the walk-through
// (parquewarner.com), one Blender shot of how a madhouse ride works (empty bench, one shared bar, the room turning round it; no figures),
// and two real pages: El País 14 Aug 2005 (the park's panic-attack version) and Europa Press 13 Aug 2007 (the two convictions, the fines,
// "no estaba pendiente de las cámaras", the appeal). VO = one take (vor/CASE15.mp3, 90.15 s), no count word, no raws (no clip sound).
// Handle with care: the death said once, no injury description, both versions given, convictions = two employees with fines,
// no "22 millones" claim, no family photos, the sister not named.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Torchlight } from "../dev/AM15_Torchlight";
import { LineRide } from "../dev/AM15_LineRide";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const O = 4.0;
const T = (t: number) => O + t;
const END = T(90.15) + 1.4;
export const DUR = F(END);

const Dim: React.FC<{ a: number; to: number }> = ({ a, to }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [a, a + 60], [0, to], cl) }} />;
};

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };
const r = (s: number, a: number) => F(s - a); // frame inside a shot that starts at VO second a

const SHOTS: Sh[] = [
  { a: 0.00, b: 4.76, vo: "Francisco Javier was 22 and worked for a wholesale fruit business in Seville. (the park's entrance globe at night)", src: "night.jpg", s0: 1.04, s1: 1.12, fx: 0.62, fy: 0.42,
    over: <RedLabel text="FRANCISCO JAVIER, 22" at={F(0.3)} hold={F(3.2)} /> },
  { a: 4.76, b: 9.17, vo: "In August 2005 he came to Madrid with his sister and his girlfriend, (the park on the plain south of Madrid, pan)", src: "pano.jpg", s0: 1.9, s1: 1.9, fx: 0.5, fy: 0.55, pan: [380, -380],
    over: <RedLabel text="MADRID · AUGUST 2005" at={F(1.0)} hold={F(2.8)} /> },
  { a: 9.17, b: 13.45, vo: "and on August 13 they spent the afternoon at Parque Warner with a cousin. (the main gate in the sun)", src: "gate.jpg", s0: 1.03, s1: 1.1, fx: 0.62, fy: 0.45,
    over: <><RedLabel text="AUGUST 13, 2005" at={F(0.3)} hold={F(2.0)} /><RedLabel text="PARQUE WARNER MADRID" at={F(2.6)} hold={F(1.5)} /></> },
  { a: 13.45, b: 17.61, vo: "Hotel Embrujado, the Haunted Hotel, starts as a walk-through. (the sign, push to the skull)", src: "sign.jpg", s0: 1.02, s1: 1.22, fx: 0.48, fy: 0.42 },
  { a: 17.61, b: 27.13, vo: "Then you're seated in a banquet hall, one bar comes down across your whole row, and the room starts to swing around you. He sat between his girlfriend and his cousin under the same bar. (Blender madhouse)",
    src: "madhouse.mp4", from: 0, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 27.13, b: 33.17, vo: "His sister was sitting elsewhere, and she said hers wouldn't let her move at all. Here's how his family told it. (a 2026 ride-through: the banquet hall, the rows)", src: "nbq.mp4", from: 1.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 33.17, b: 39.53, vo: "When the room began to turn, he felt dizzy and stood up, and his cousin said the bar lifted without any trouble. (2025 ride-through: the banquet table, candles)", src: "wendy.mp4", from: 0.5, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 39.53, b: 44.81, vo: "He grabbed what looked like a ledge on the wall, but it was part of the moving machinery, and it struck him. (the building, slow push, darkening)", src: "bld2017.jpg", s0: 1.03, s1: 1.12, fx: 0.45, fy: 0.45,
    over: <Dim a={F(1.5)} to={0.5} /> },
  { a: 44.81, b: 48.65, vo: "According to his sister, the ride didn't stop until the cycle was over. (the hotel's front, 2003)", src: "bld2003.jpg", s0: 1.75, s1: 1.85, fx: 0.5, fy: 0.12 },
  { a: 48.65, b: 52.59, vo: "He was flown by helicopter to a Madrid hospital and died there. (the park's empty plaza)", src: "hall.jpg", s0: 1.02, s1: 1.07, fx: 0.55, fy: 0.45 },
  { a: 52.59, b: 58.46, vo: "The park's story wasn't the same. It described a panic attack, and a guest who'd forced his way out of the restraint. (Torchlight: El País)",
    node: <Torchlight page={C + "shots/elpais_crop.png"} pw={2360} ph={1890}
      keys={[{ at: 0, x: 1180, y: 80, r: 170, k: 0.62 }, { at: 30, x: 1120, y: 480, r: 300, k: 0.62 }, { at: r(54.4, 52.59), x: 900, y: 1590, r: 150, k: 0.95 }, { at: r(56.6, 52.59), x: 920, y: 1645, r: 150, k: 1.0 }, { at: r(58.46, 52.59), x: 930, y: 1650, r: 150, k: 1.02 }]} /> },
  { a: 58.46, b: 64.11, vo: "The Guardia Civil, Spain's national police force, found no sign of mechanical failure at first. (a park street, 2010)", src: "street.jpg", s0: 1.02, s1: 1.09, fx: 0.4, fy: 0.5,
    over: <RedLabel text="GUARDIA CIVIL" at={F(0.2)} hold={F(2.6)} /> },
  { a: 64.11, b: 69.23, vo: "Afterward, staff told his cousin the room was watched on camera. So who was watching it? (the hall in the dark, 2026)", src: "nbq.mp4", from: 40.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 69.23, b: 88.03, vo: "The family took it to court ... convicted two park employees ... fines ... nobody had been watching the screens ... appeals court upheld (LineRide: Europa Press)",
    node: <LineRide page={C + "shots/europa_crop.png"} pw={2020} ph={1990} rule={{ x0: 108, x1: 538, y: 1166, at: r(83.4, 69.23) }}
      keys={[{ at: 0, x: 1000, y: 330, k: 0.78, band: 170 }, { at: r(72.5, 69.23), x: 1050, y: 330, k: 0.82, band: 170 }, { at: r(73.7, 69.23), x: 650, y: 545, k: 1.05, band: 80 },
        { at: r(77.3, 69.23), x: 1150, y: 545, k: 1.05, band: 80 }, { at: r(78.1, 69.23), x: 640, y: 1495, k: 1.2, band: 50 }, { at: r(81.4, 69.23), x: 760, y: 1495, k: 1.2, band: 50 },
        { at: r(82.2, 69.23), x: 640, y: 1140, k: 1.15, band: 50 }, { at: r(84.9, 69.23), x: 720, y: 1140, k: 1.15, band: 50 }, { at: r(85.6, 69.23), x: 620, y: 1315, k: 1.2, band: 50 },
        { at: r(88.03, 69.23), x: 1000, y: 1315, k: 1.2, band: 50 }]} /> },
  { a: 88.03, b: 90.15 + 1.4, vo: "upheld both convictions in full. (the Hotel Embrujado today; fade)", src: "mansion.jpg", s0: 1.12, s1: 1.18, fx: 0.4, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(O), kind: "glitch", len: 10 },
  { at: F(T(17.61)), kind: "blurDip", len: 12 },  // into the ride
  { at: F(T(27.13)), kind: "blurDip", len: 12 },  // out of the ride (dark CG -> dark interior photo)
  { at: F(T(52.59)), kind: "blurDip", len: 14 },  // into the park's version (El País)
  { at: F(T(69.23)), kind: "blurDip", len: 14 },  // into the court (Europa Press)
  { at: F(T(88.03)), kind: "blurDip", len: 12 },
];

const SFX: [number, string, number][] = [
  [O - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(17.4), "sfx_n2/whoosh_02.wav", -26],
  [T(20.0), "sfx_n2/real/metal_clank_2.wav", -26],          // the bar locks down
  [T(52.7), "sfx_n2/real/flashlight_click_2.wav", -22],     // the torch
  [T(69.2), "sfx_n2/real/paper_2.wav", -26],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  const still = !s.src!.endsWith(".mp4");
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={still} from={s.from} n={F(T(s.b)) - F(T(s.a))} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(O)} layout="none"><AbsoluteFill><TitleCard dur={F(O)} title="HOTEL EMBRUJADO" bg={GR + "sign.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END - 1.2)} layout="none"><FadeBlack len={F(1.2)} /></Sequence>
      <Sequence from={F(O)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4, matched by ear/loudness to ~10 LU under the VO */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => dB(-21) * interpolate(f / 30, [0, 1.5, END - 2.2, END], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
