// Workplace #17 — CITGO Corpus Christi refinery, Texas, 19 Jul 2009: a failed control valve shakes the HF alkylation unit's piping until
// a connection breaks; the hydrocarbon/HF vapour spreads through the unit and ignites; the fire burns for days, ~21 tons of HF reported
// released, the emergency water nearly runs out. Footage: U.S. CSB surveillance cameras A (outdoor, src 6-125 -> graded/ca.mp4 t = src-6)
// and B (indoor hall, src 132-218 -> graded/cb.mp4 t = src-132); both silent, CSB logo delogo'd, source title cards never used.
// VO = one take, split at the main raw and once more after "Look at the doorway." (a short silent beat while the fireball fills it).
// Raw = camera A, the vapour cloud -> ignition -> the unit burning (src 73.2-85.2, 12 s), silent CCTV -> real SFX.
// Devices: JetTrace, DoorWatch; Blender: salt-water feed from the ship channel (maps/water.mp4), the cloud over Nueces Bay (maps/drift.mp4).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { useWpFonts } from "../dev/WP01_kit";
import { WP17_JetTrace } from "../dev/WP17_JetTrace";
import { WP17_DoorWatch } from "../dev/WP17_DoorWatch";
import { WATER, DRIFT } from "../dev/WP17_mapLabels";

const C = "case/", A = C + "graded/ca.mp4", B = C + "graded/cb.mp4";
const a = (src: number) => src - 6, b = (src: number) => src - 132; // source second -> graded file second
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO1 take 0-25.45 @4.0 | RAW 29.45-41.45 | VO2 take 25.55-67.8 @41.45 | doorway beat | VO3 take 67.85-end @88.6
const OFF2 = 41.45 - 25.55, OFF3 = 88.6 - 67.85;
const PART: [number, number, number | null][] = [[4.0, 0, 25.45], [41.45, 25.55, 67.8], [88.6, 67.85, null]];
const RAW: [number, number] = [29.45, 41.45];
const RSRC = 73.2, IGN = RAW[0] + (75.83 - RSRC);
const DOOR = 82.4, HOLD = 0.9, DT0 = b(206.4), FLOOD = 4.0; // DoorWatch start, freeze length, source t0, flood (s after the freeze)
const BOOM2 = DOOR + HOLD + 0.9; // the fireball blooming in the doorway
const END = 92.45 + OFF3, DURS = END + 1.2;
export const DUR = F(DURS);

const Credit: React.FC<{ text: string; at?: number; hold?: number }> = ({ text, at = 10, hold = 80 }) => {
  useWpFonts(); const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 10, at + hold, at + hold + 10], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 56, bottom: 40, fontFamily: "Elite", fontSize: 24, color: "rgba(242,242,240,.78)", opacity: o, textShadow: "0 2px 6px rgba(0,0,0,.9)" }}>{text}</div>;
};
const t2 = (take: number) => take + OFF2, t3 = (take: number) => take + OFF3;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.9, vo: "CITGO, Corpus Christi, Texas. July 2009. (camera A, the unit quiet)",
    node: (n) => <><Clip src={A} from={a(8.0)} n={n} s0={1.02} s1={1.08} fx={0.5} fy={0.4} />
      <RedLabel text="CITGO REFINERY · CORPUS CHRISTI, TEXAS" at={6} hold={F(1.6)} size={44} /><RedLabel text="JULY 19, 2009" at={F(2.0)} hold={F(1.5)} size={44} />
      <Credit text="SURVEILLANCE CAMERA · U.S. CHEMICAL SAFETY BOARD" at={10} hold={85} /></> },
  { a: 7.9, b: 13.9, vo: "On the refinery's alkylation unit, a control valve had failed and set the piping around it shaking violently",
    node: (n) => <><Clip src={A} from={a(21.0)} n={n} s0={1.04} s1={1.2} fx={0.38} fy={0.3} /><RedLabel text="HF ALKYLATION UNIT" at={F(0.9)} hold={F(3.6)} size={42} /></> },
  { a: 13.9, b: 22.6, vo: "until a connection broke. Part of what's coming out is hydrofluoric acid, known as HF ... gasoline. (JetTrace)",
    node: (n) => <WP17_JetTrace src={A} from={a(48.9)} n={n} rate={0.6} path={[[0.14, 0.05], [0.13, 0.34], [0.18, 0.6], [0.33, 0.84]]}
      label={["HYDROFLUORIC ACID · HF", F(12.73 - 9.9), 0.5, 0.2]} /> },
  { a: 22.6, b: 29.45, vo: "As a vapour it can drift a long way and stay dangerous to anyone it reaches. Then it found something to ignite it.",
    node: (n) => <Clip src={A} from={a(64.6)} n={n} s0={1.0} s1={1.12} fx={0.45} fy={0.65} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: camera A, the cloud fills the unit -> ignition -> fire (src 73.2-85.2)",
    node: (n) => <Clip src={A} from={a(RSRC)} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: RAW[1], b: t2(31.7), vo: "The fire kept burning for several days. CITGO reported releasing about twenty one tons of the acid. (ignition replay 0.5x)",
    node: (n) => <Clip src={A} from={a(75.3)} n={n} rate={0.5} s0={1.16} s1={1.3} fx={0.42} fy={0.55} /> },
  { a: t2(31.7), b: t2(37.75), vo: "Water cannons sprayed the unit ... the emergency water supply nearly ran out on the first day.",
    node: (n) => <Clip src={A} from={a(112.0)} n={n} s0={1.22} s1={1.1} fx={0.68} fy={0.55} /> },
  { a: t2(37.75), b: t2(45.45), vo: "About eleven and a half hours in, CITGO began pumping salt water from the ship channel ... failed several times. (Blender)",
    node: () => <BlenderShot src={C + "maps/water.mp4"} track={WATER} labels={[["plant", "CITGO REFINERY", 18, 190, 0.07], ["channel", "SHIP CHANNEL", 78, 140, -0.06]]} /> },
  { a: t2(45.45), b: t2(51.4), vo: "The CSB's investigator called that water system the community's last line of defence against an HF release.",
    node: (n) => <Clip src={A} from={a(89.5)} n={n} s0={1.0} s1={1.1} fx={0.55} fy={0.45} /> },
  { a: t2(51.4), b: t2(58.7), vo: "The CSB issued two urgent recommendations from this case within five months ... (camera B, the hall)",
    node: (n) => <><Clip src={B} from={b(150.0)} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.45} /><Credit text="SECOND CAMERA · U.S. CHEMICAL SAFETY BOARD" at={12} hold={80} /></> },
  { a: t2(58.7), b: DOOR, vo: "It also found CITGO had never audited its HF alkylation units ... every three years. (workers in the hall)",
    node: (n) => <Clip src={B} from={b(186.6)} n={n} s0={1.1} s1={1.02} fx={0.55} fy={0.6} /> },
  { a: DOOR, b: t3(69.3), vo: "Look at the doorway. [beat: the fireball fills it] About four thousand pounds of acid (DoorWatch)",
    node: (n) => <WP17_DoorWatch src={B} t0={DT0} n={n} hold={F(HOLD)} flood={F(HOLD + FLOOD)} box={[0.36, 0.1, 0.66, 0.66]} /> },
  { a: t3(69.3), b: t3(73.48), vo: "got past the spray and drifted over a nearby bay. (Blender: the cloud over Nueces Bay)",
    node: () => <BlenderShot src={C + "maps/drift.mp4"} track={{ ...DRIFT, bay: DRIFT.bay.map((): [number, number] => [0.6, 0.17]) }} labels={[["bay", "NUECES BAY", 40, 80, 0.0]]} /> },
  { a: t3(73.48), b: t3(80.85), vo: "One worker, Gabriel Alvarado, was seriously injured and exposed to the acid, and a second was treated ...",
    node: (n) => <><Clip src={A} from={a(104.0)} n={n} s0={1.06} s1={1.16} fx={0.4} fy={0.5} /><RedLabel text="GABRIEL ALVARADO" at={F(0.6)} hold={F(3.2)} size={44} /></> },
  { a: t3(80.85), b: t3(88.2), vo: "The CSB's investigator, Robert Hall, called it a significant near miss ... the refinery and the community.",
    node: (n) => <><Clip src={B} from={b(160.0)} n={n} s0={1.12} s1={1.02} fx={0.45} fy={0.4} /><RedLabel text="ROBERT HALL · CSB INVESTIGATOR" at={F(0.8)} hold={F(2.8)} size={40} /></> },
  { a: t3(88.2), b: DURS, vo: "The only thing between that cloud and the city was a water supply that almost ran dry. (the cloud, camera A)",
    node: (n) => <Clip src={A} from={a(54.6)} n={n} s0={1.0} s1={1.1} fx={0.3} fy={0.55} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(22.6), kind: "blurDip", len: 12 },   // same camera, ten seconds on
  { at: F(RAW[0]), kind: "blurDip", len: 12 }, // VO -> raw (same camera)
  { at: F(RAW[1]), kind: "blurDip", len: 14 }, // raw -> slow replay
  { at: F(t2(31.7)), kind: "blurDip", len: 12 },
  { at: F(t2(37.75)), kind: "glitch", len: 10 },
  { at: F(t2(51.4)), kind: "glitch", len: 10 }, // to the second camera
  { at: F(DOOR), kind: "blurDip", len: 12 },
  { at: F(t3(80.85)), kind: "blurDip", len: 12 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWENTY ONE TONS OF ACID" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
          <Sequence from={F(DURS) - 18} layout="none"><Fade n={18} /></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw: silent CCTV -> real SFX: the venting vapour (low roar), the ignition, the fire */}
      <Sequence from={F(RAW[0])} durationInFrames={F(IGN - RAW[0]) + 20} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} loop volume={(f) => dB(-17) * interpolate(f, [0, 20, F(IGN - RAW[0]), F(IGN - RAW[0]) + 20], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(IGN) - 2} durationInFrames={F(5)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={dB(-5)} /></Sequence>
      <Sequence from={F(IGN)} durationInFrames={F(4)} layout="none"><Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-12)} /></Sequence>
      <Sequence from={F(IGN) + 6} durationInFrames={F(RAW[1] - IGN) - 6} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-8) * interpolate(f, [0, 24, F(RAW[1] - IGN) - 30, F(RAW[1] - IGN) - 8], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* the doorway beat: the fireball through the doorway (indoors, distant) */}
      <Sequence from={F(BOOM2) - 2} durationInFrames={F(88.6 - BOOM2) - 4} layout="none">
        <Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={(f) => dB(-9) * interpolate(f, [F(88.6 - BOOM2) - 26, F(88.6 - BOOM2) - 6], [1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 5 at -13 dB, out under the raw and the doorway beat */}
      <Sequence from={F(4.0)} durationInFrames={F(DURS - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(60)} volume={(f) => {
          const t = f / 30 + 4.0;
          const dk = (ra: number, rb: number) => t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          const duck = Math.min(dk(RAW[0], RAW[1]), 0.35 + 0.65 * dk(BOOM2 - 0.3, 88.2));
          return dB(-13) * interpolate(t, [4.0, 5.0, DURS - 1.6, DURS], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);

const Fade: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />;
};
