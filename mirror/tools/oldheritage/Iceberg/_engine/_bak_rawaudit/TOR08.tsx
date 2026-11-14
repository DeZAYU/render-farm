// Tornado #8 — Lužice and Moravská Nová Ves, South Moravia, Thursday 24 June 2021 (IF4). "Inside a village in South Moravia."
// Footage: [HOUSE] a phone at an upstairs window in Lužice (WFRXZ_a28Gk, vertical: shown on its own blurred copy), [GARDEN] Pavel Toman
// in his garden in Moravská Nová Ves (oeqdd3-REZc). House source cuts: 128.67-129.53 (the swing), black 139-152. Garden: 1.97-2.67.
// Devices built for THIS case: ScarDevelop (NASA HLS / Sentinel-2, 19 vs 29 June 2021: the scar develops along the track from Břeclav
// to Pánov), PhotoTally (Lužice / Moravská Nová Ves / Mikulčice photographs with the destroyed houses counted out as squares: 17, 31, 62).
// Photos: Wikimedia Commons, CC BY-SA 4.0 (Tadeáš Bednarz, Martin Strachoň; credits in NOTES). VO = one take, split only for the raws;
// raw sound = rawclean.py output (music stripped, guide 5b).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { ScarDevelop } from "../dev/TOR08_ScarDevelop";
import { PhotoTally } from "../dev/TOR08_PhotoTally";
import { PhoneWindow } from "../dev/TOR08_PhoneWindow";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(214.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

const VO: [number, number, number][] = [
  [14.4, 0.05, 16.91],    // Lužice ... east of Břeclav.
  [44.0, 16.91, 36.89],   // IF4 ... to Pánov.
  [88.7, 36.89, 48.25],   // One village along ... 7:25.
  [112.8, 48.25, 56.1],   // Roofs ... open field.
  [133.4, 56.1, 75.62],   // counts ... F4 on the ground.
  [163.7, 75.64, 126.4],  // outcome
];
// raws: [timeline a, b, clean wav, source s, gain dB]
const RAWS: [number, number, string, number, number][] = [
  [4.0, 14.0, "house_clean.wav", 44.0, -2],
  [31.6, 43.6, "house_clean.wav", 66.0, -2],
  [64.4, 79.8, "house_clean.wav", 113.0, -3],
  [79.8, 87.55, "house_clean.wav", 130.3, -3],
  [100.4, 112.4, "garden_clean.wav", 3.0, -3],
  [121.0, 133.0, "garden_clean.wav", 32.0, -3],
  [153.3, 163.3, "garden_clean.wav", 92.0, -3],
];

const P = (name: string) => GR + name + ".jpg";
const SHOTS: Sh[] = [
  // RAW 1: the street of red roofs as the rain and wind build
  { a: 4.0, b: 14.0, vo: "RAW house street", src: "house.mp4", from: 44.0, fill: true, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  // VO A
  { a: 14.0, b: 16.9, vo: "Lužice, a village in South Moravia,", src: "house.mp4", from: 20.0, fill: true, s0: 1.02, s1: 1.06,
    over: <RedLabel text="LUŽICE, CZECH REPUBLIC" at={10} hold={F(2.2)} /> },
  { a: 16.9, b: 21.42, vo: "about twenty-five past seven on Thursday the 24th of June 2021.", src: "house.mp4", from: 26.0, fill: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.4,
    over: <RedLabel text="JUNE 24, 2021" at={14} hold={F(3.3)} /> },
  { a: 21.42, b: 25.57, vo: "Europe logs hundreds of tornadoes a year, and nearly all of them are weak.", src: "house.mp4", from: 33.0, fill: true, s0: 1.12, s1: 1.18, fx: 0.5, fy: 0.3 },
  { a: 25.57, b: 28.51, vo: "Nobody on these streets had a reason to think about one. (a car goes by on the wet street)", src: "house.mp4", from: 0.6, fill: true, s0: 1.04, s1: 1.08, fx: 0.4, fy: 0.6 },
  { a: 28.51, b: 31.6, vo: "This one had touched down just east of Břeclav. (Sentinel-2, the days before)",
    node: <Aerial src={GR + "hls_before.jpg"} iw={2000} ih={1385} spot={[300, 1060, 470, 1200]} z0={1.0} z1={1.35} label="BŘECLAV" boxAt={10} labelAt={16} /> },
  // RAW 2: debris over the street
  { a: 31.6, b: 43.6, vo: "RAW house approaching", src: "house.mp4", from: 66.0, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  // VO B
  { a: 43.6, b: 49.1, vo: "IF4, on the International Fujita scale European forecasters use to rate damage. (Hrušky church)",
    node: <Inset src={P("hrusky_church")} still box={0.6} ar={3 / 2} label="HRUŠKY" labelAt={12} /> },
  { a: 49.1, b: 55.21, vo: "Its widest point was three and a half kilometres across, the widest of any tornado ever recorded in Europe.", src: "house.mp4", from: 86.0, fill: true, s0: 1.0, s1: 1.08, fx: 0.5, fy: 0.35 },
  { a: 55.21, b: 59.69, vo: "It was also Europe's first confirmed violent tornado since 2017. (roofs torn open, Hrušky)", src: P("roofs"), still: true, s0: 1.06, s1: 1.16, fx: 0.55, fy: 0.35 },
  { a: 59.69, b: 64.4, vo: "Its track ran twenty-seven kilometres, from east of Břeclav to Pánov. (the scar develops)",
    node: <ScarDevelop before={GR + "hls_before.jpg"} after={GR + "hls_after.jpg"} iw={2000} ih={1385} at={6} len={F(3.9)} focus={[1060, 620]} z0={1.12} z1={1.2}
      path={[[380, 1150], [600, 1040], [1263, 505], [1692, 140], [1790, 70]]}
      towns={[{ x: 179, y: 1217, label: "BŘECLAV" }, { x: 1692, y: 127, label: "PÁNOV" }]} /> },
  // RAW 3: the debris fills the sky, then the swing to the houses opposite
  { a: 64.4, b: 79.8, vo: "RAW house climax", src: "house.mp4", from: 113.0, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  { a: 79.8, b: 87.55, vo: "RAW house opposite", src: "house.mp4", from: 130.3, fill: true, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  // VO C
  { a: 87.55, b: 91.48, vo: "One village along, in Moravská Nová Ves,", src: P("mnv_street"), still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MORAVSKÁ NOVÁ VES" at={8} hold={F(2.6)} /> },
  { a: 91.48, b: 96.92, vo: "Pavel Toman sheltered in a brick outbuilding in his back garden as the same tornado came through.", src: "garden.mp4", from: 17.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="PAVEL TOMAN" at={14} hold={F(3.6)} /> },
  { a: 96.92, b: 100.4, vo: "The village church clock stopped at 7:25. (the tower, the clock)", src: P("mnv_clock"), still: true, fill: true, s0: 1.25, s1: 2.6, fx: 0.512, fy: 0.272 },
  // RAW 4: Moravská Nová Ves, the same tornado
  { a: 100.4, b: 112.4, vo: "RAW garden roof pieces", src: "garden.mp4", from: 3.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45 },
  // VO D
  { a: 112.4, b: 115.35, vo: "Roofs were being torn off all along the track. (Lužice, the rafters bare)", src: P("luzice_roofs"), still: true, s0: 1.05, s1: 1.12, fx: 0.4, fy: 0.4 },
  { a: 115.35, b: 121.0, vo: "In Mikulčice, further along, a car was thrown two hundred metres into an open field.", src: P("car"), still: true, s0: 1.04, s1: 1.14, fx: 0.3, fy: 0.62,
    over: <RedLabel text="MIKULČICE" at={14} hold={F(4.6)} /> },
  // RAW 5
  { a: 121.0, b: 133.0, vo: "RAW garden trees bending", src: "garden.mp4", from: 32.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45 },
  // VO E: the three villages counted
  { a: 133.0, b: 147.23, vo: "In Lužice a hundred homes were damaged and seventeen destroyed. Moravská Nová Ves ... thirty-one destroyed. In Mikulčice ... sixty-two destroyed.",
    node: <PhotoTally bg={P("luzice_street")} v={[{ src: P("luzice_street"), name: "LUŽICE", count: 17, at: 12 }, { src: P("mnv_rubble"), name: "MORAVSKÁ NOVÁ VES", count: 31, at: 130 }, { src: P("mik_house"), name: "MIKULČICE", count: 62, at: 293 }]} /> },
  { a: 147.23, b: 153.3, vo: "In the south of the village thick masonry walls came down, which is what F4 looks like on the ground.", src: P("walls"), still: true, s0: 1.04, s1: 1.12, fx: 0.45, fy: 0.5 },
  // RAW 6
  { a: 153.3, b: 163.3, vo: "RAW garden the wind tearing", src: "garden.mp4", from: 92.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.45 },
  // VO F: outcome
  { a: 163.3, b: 166.4, vo: "Six people were lost, (the window glass, the debris)", src: "house.mp4", from: 172.0, fill: true, s0: 1.02, s1: 1.06 },
  { a: 166.4, b: 170.81, vo: "and hundreds were hurt, with counts running from about two hundred to five hundred and seventy-six.", src: P("tarp"), still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 170.81, b: 177.42, vo: "At least twelve hundred buildings were left damaged or in ruins, at a cost of about fifteen billion Czech crowns. (the window after)", src: "house.mp4", from: 154.0, fill: true, s0: 1.03, s1: 1.08 },
  { a: 177.42, b: 180.6, vo: "Rescue teams came from across the country and from neighbouring Austria and Slovakia,", src: P("rescue"), still: true, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 180.6, b: 184.41, vo: "and the Czech Army was deployed.", src: P("army"), still: true, s0: 1.05, s1: 1.12, fx: 0.3, fy: 0.55 },
  { a: 184.41, b: 187.9, vo: "Structures at the zoo in Hodonín were badly damaged too. (the zoo's woods, Bažantnice)", src: P("zoo"), still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="BAŽANTNICE, HODONÍN" at={10} hold={F(2.6)} /> },
  { a: 187.9, b: 192.37, vo: "A hundred and eighty buildings that were still standing had to be scheduled for demolition.", src: P("crane"), still: true, s0: 1.1, s1: 1.04, fx: 0.55, fy: 0.5 },
  { a: 192.37, b: 199.17, vo: "One Czech foundation alone collected about a hundred and eighty-five million crowns in donations in the first five days. (supplies, Hrušky)", src: P("donations"), still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.6 },
  { a: 199.17, b: 206.15, vo: "It was the strongest tornado in modern Czech history, and no tornado in Europe had taken more lives since 2001. (the moment again, slow)", src: "house_replay.mp4", from: 0.0, fill: true, s0: 1.04, s1: 1.14, fx: 0.5, fy: 0.4 },
  { a: 206.15, b: 210.1, vo: "About a hundred and twenty-one thousand households in the region lost power, (Pánov)", src: P("solar"), still: true, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.6 },
  { a: 210.1, b: 214.6, vo: "and the D2 motorway between Brno and Bratislava had to be closed. (the garden after)", src: "garden.mp4", from: 118.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(14.0), kind: "blurDip", len: 10 },
  { at: F(28.51), kind: "whip", len: 10 },
  { at: F(31.6), kind: "blurDip", len: 10 },
  { at: F(49.1), kind: "blurDip", len: 10 },
  { at: F(59.69), kind: "glitch", len: 8 },
  { at: F(79.8), kind: "blurDip", len: 12 },
  { at: F(91.48), kind: "blurDip", len: 10 },
  { at: F(100.4), kind: "blurDip", len: 10 },
  { at: F(133.0), kind: "glitch", len: 8 },
  { at: F(163.3), kind: "blurDip", len: 12 },
  { at: F(199.17), kind: "blurDip", len: 12 },
  { at: F(210.1), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  if (s.fill && !s.still) return <FilmLook_FX grain={0.08}><PhoneWindow src={src} from={s.from ?? 0} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} turn={Math.round(s.a) % 2 ? 6 : -6} /></FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [28.51, "sfx_n2/whoosh_01.wav", -30],
  [43.65, X + "camera_shutter_2.wav", -28],
  [59.69, "sfx_n2/glitch_03.wav", -28],
  [133.0, "sfx_n2/glitch_01.wav", -28],
  [133.4, X + "paper_2.wav", -30],
  [137.4, X + "paper_3.wav", -32],
  [142.8, X + "paper_2.wav", -32],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="INSIDE A VILLAGE IN SOUTH MORAVIA" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t, a, b], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, wav, src, g], i) => { const n = F(b) - F(a); return (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + wav)} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, n - 18, n], [0, 1, 1, 0], cl)} />
        </Sequence>); })}
      {/* music: Epidemic ambient Music 5 (-13 dB ~ 10 LU under the VO), out under every raw */}
      {VO.map(([t, a, b], i) => { const n = F(b) - F(a) + F(0.8); const off = [5, 24, 46, 60, 70, 12][i];
        return (
          <Sequence key={"m" + i} from={F(t) - 10} durationInFrames={n + 10} layout="none">
            <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => dB(-13) * interpolate(f, [0, 16, n - 6, n + 10], [0, 1, 1, 0], cl)} />
          </Sequence>); })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
