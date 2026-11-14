// Workplace #25 — Clorados III, Pajaritos petrochemical complex, Coatzacoalcos, Veracruz, 20 Apr 2016: a leak at the vinyl chloride
// plant, a black cloud across the yard, then the blast. Thirty-two lives, 130+ injured; no published official finding on the leak.
// Footage (small personal uploaders only): PJ = Angel Carretero Rios (VjrztXtnWKc): a clean repost of two plant CCTV cameras (cam 1
// 0-45.0 s: the shelter and the yard; cam 2 45.0-105 s: pipe racks, the blast across the far yard); "Xkdomega" corner tag removed
// with delogo; silent -> real SFX. JK = josue kortez (bQjXgASdfBs, 7 subs): a worker's vertical phone video walking out among the
// plant under the black smoke (own sound unused).
// VO = one take (CASE25.mp3) from "Clorados" (the level-five call before it is built separately), split once at the raw.
// RAW = PJ cam 1 src 32.0-44.8 (the cloud rolls in, the fireball, the camera whites out) + cam 2 src 54.6-59.6 (the blast front
// across the far yard).  Blender (build/CASE25/maps/coast.py): Gulf of Mexico -> Coatzacoalcos -> the Pajaritos complex outlined.
// Device: CloudGhost (the fixed camera's later cloud laid over its own quiet picture: "it never said where").
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl, io } from "../dev/WP45_kit";
import { CloudGhost } from "../dev/WP25_CloudGhost";
import { CO } from "../dev/WP25_blLabels";

const C = "case/", G = C + "graded/";
const PJ = G + "pj.mp4", JK = G + "jk.mp4";
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO part 1 (take 11.80-41.32) @4.0 (case = take - 7.8) | RAW 33.8-46.6 cam 1, 46.6-51.6 cam 2 |
// VO part 2 (take 41.30-end) @51.6 (case = take + 10.3), VO ends ~85.83, hold to END
const T0 = 11.80, v1 = (t: number) => t - T0 + 4.0;
const RAW: [number, number] = [33.8, 51.6], RAWB = 46.6;
const V2 = 41.30, v2 = (t: number) => t + (RAW[1] - V2);
const END = 87.2;
export const DUR = F(END);
const PART: [number, number, number | null][] = [[4.0, T0, 41.32], [RAW[1], V2, null]];

/** the worker's vertical phone clip: sharp at full height over its own blurred, darkened copy; slow push */
const Vert: React.FC<{ src: string; from: number; n: number; s0?: number; s1?: number }> = ({ src, from, n, s0 = 1.0, s1 = 1.06 }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const v = (style: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={style} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: "scale(1.15)", filter: "blur(38px) brightness(0.45) saturate(0.8)" }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${s})` }}>
        <div style={{ height: 1080, width: 608, boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** extra eased push over a Blender shot (its own camera starts slowly) */
const Push: React.FC<{ n: number; s1?: number; children: React.ReactNode }> = ({ n, s1 = 1.07, children }) => {
  const f = useCurrentFrame(); const s = 1 + (s1 - 1) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(16.52), vo: "Clorados III, Pajaritos, Mexico. April 2016. (PJ cam 1: the quiet shelter and yard)",
    node: (n) => <><Clip src={PJ} from={1.0} n={n} s0={1.03} s1={1.1} fx={0.45} fy={0.5} />
      <RedLabel text="CLORADOS III · PAJARITOS, MEXICO" at={8} hold={F(2.4)} size={42} /><RedLabel text="APRIL 20, 2016" at={F(14.82 - T0 + 0.1)} hold={F(1.5)} size={44} /></> },
  { a: v1(16.52), b: v1(25.17), vo: "Pajaritos is a petrochemical complex in Coatzacoalcos, on the Gulf coast of Veracruz ... one of the plants inside it. (Blender coast)",
    node: (n) => <Push n={n} s1={1.05}><BlenderShot src={C + "maps/coast.mp4"} track={CO} labels={[["city", "GULF OF MEXICO", 12, 70, 0.2], ["city", "COATZACOALCOS · VERACRUZ", 100, 70, -0.07], ["complex", "PAJARITOS COMPLEX", 200, 58, -0.12]]} /></Push> },
  { a: v1(25.17), b: v1(33.49), vo: "On the 20th, it was an ordinary working day at the plant. The plant made vinyl chloride, the same chemical ... East Palestine. (PJ cam 1: trucks in the quiet yard)",
    node: (n) => <Clip src={PJ} from={9.5} n={n} s0={1.03} s1={1.1} fx={0.4} fy={0.4} /> },
  { a: v1(33.49), b: v1(35.90), vo: "Vinyl chloride is a flammable gas. (PJ cam 2: the pipe racks, smoke far off on the horizon)",
    node: (n) => <Clip src={PJ} from={46.0} n={n} s0={1.12} s1={1.05} fx={0.6} fy={0.2} /> },
  { a: v1(35.90), b: RAW[0], vo: "According to Pemex ... there was a leak, though it never said where. (CloudGhost on cam 1)",
    node: (n) => <CloudGhost src={PJ} from={18.0} ghostFrom={34.5} ghostRate={0.5} n={n} at={12} until={n - 36} fx={0.35} fy={0.35} /> },
  { a: RAW[0], b: RAWB, vo: "RAW cam 1: the black cloud rolls across the yard, the fireball, the camera whites out (src 32.0-44.8, SFX)",
    node: (n) => <Clip src={PJ} from={32.0} n={n} s0={1.02} s1={1.07} fx={0.4} fy={0.4} /> },
  { a: RAWB, b: RAW[1], vo: "RAW cam 2: the blast front rolls across the far yard (src 54.6-59.6)",
    node: (n) => <Clip src={PJ} from={54.6} n={n} s0={1.04} s1={1.1} fx={0.55} fy={0.25} /> },
  { a: RAW[1], b: v2(43.34), vo: "The blast tore through the plant yard. (replay: cam 1 fireball 0.5x, pushed)",
    node: (n) => <Clip src={PJ} from={38.2} rate={0.5} n={n} s0={1.1} s1={1.22} fx={0.45} fy={0.42} /> },
  { a: v2(43.34), b: v2(46.37), vo: "Rescuers with dogs searched the wreckage for days. (JK: men in the plant under the smoke)",
    node: (n) => <Vert src={JK} from={52.0} n={n} /> },
  { a: v2(46.37), b: v2(51.82), vo: "By the 24th, Pemex put the toll at thirty two lives, with more than a hundred and thirty injured. (PJ cam 2: the yard burning)",
    node: (n) => <Clip src={PJ} from={66.0} n={n} s0={1.12} s1={1.03} fx={0.6} fy={0.3} /> },
  { a: v2(51.82), b: v2(55.57), vo: "It said every worker who'd been at the plant that day was accounted for. (JK: workers walking out)",
    node: (n) => <Vert src={JK} from={40.0} n={n} s0={1.04} s1={1.0} /> },
  { a: v2(55.57), b: v2(58.33), vo: "There's no published official finding on the leak. (PJ cam 2)",
    node: (n) => <Clip src={PJ} from={78.0} n={n} s0={1.02} s1={1.1} fx={0.4} fy={0.3} /> },
  { a: v2(58.33), b: v2(65.61), vo: "Six months later, Greenpeace Mexico said neither Pemex nor Mexichem ... had explained the cause. (JK: the smoke column)",
    node: (n) => <Vert src={JK} from={28.0} n={n} /> },
  { a: v2(65.61), b: v2(67.59), vo: "No sanctions had been imposed. (PJ cam 2)",
    node: (n) => <Clip src={PJ} from={90.0} n={n} s0={1.1} s1={1.04} fx={0.7} fy={0.3} /> },
  { a: v2(67.59), b: v2(71.55), vo: "Greenpeace also reported dozens of chemicals in the water nearby. (JK)",
    node: (n) => <Vert src={JK} from={70.0} n={n} /> },
  { a: v2(71.55), b: END, vo: "Thirty two lives, and the official answer to why is still missing. (PJ cam 1: the quiet yard, slow push)",
    node: (n) => <Clip src={PJ} from={26.0} n={n} s0={1.0} s1={1.12} fx={0.5} fy={0.45} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(v1(16.52)), kind: "glitch", len: 10 },   // into Blender
  { at: F(v1(25.17)), kind: "blurDip", len: 12 },  // back to cam 1 (same camera as the opening)
  { at: F(RAW[0]), kind: "blurDip", len: 12 },     // calm cam 1 -> raw cam 1
  { at: F(RAWB), kind: "blurDip", len: 12 },       // cam 1 -> cam 2
  { at: F(RAW[1]), kind: "blurDip", len: 14 },     // raw -> replay
  { at: F(v2(71.55)), kind: "blurDip", len: 14 },  // back to the quiet yard
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="CLORADOS III" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE25.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the CCTV is silent -> real recordings timed to the picture: the cloud rolling in (low wind), the blast at cam 1
          src 38.35, the fire roar after; cam 2's blast front at src 55.8 (more distant boom) */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAWB - RAW[0])} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-16) * interpolate(f, [0, 30, F(6.2), F(6.5)], [0, 1, 1, 0.3], cl)} />
        <Sequence from={F(38.35 - 32.0)} layout="none">
          <Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-2)} />
          <Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-6)} />
          <Sequence from={8} layout="none"><Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-7) * interpolate(f, [0, 12, F(5.6), F(6.2)], [0, 1, 1, 0.4], cl)} /></Sequence>
        </Sequence>
      </Sequence>
      <Sequence from={F(RAWB)} durationInFrames={F(RAW[1] - RAWB)} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} startFrom={F(8)} volume={(f) => dB(-11) * interpolate(f, [0, 8, F(RAW[1] - RAWB) - 20, F(RAW[1] - RAWB) - 6], [0.4, 1, 1, 0], cl)} />
        <Sequence from={F(55.8 - 54.6)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={dB(-6)} /></Sequence>
      </Sequence>
      {/* music: Epidemic ambient Music 1 at -16 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-16) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.06 + 0.94 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
