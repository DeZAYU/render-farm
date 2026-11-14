// Workplace #30 (last case) — Córrego do Feijão mine, Brumadinho, Minas Gerais, Brazil, Friday 25 Jan 2019, 12:28: Vale's Dam I, an
// upstream tailings dam, collapsed; ~12 million m³ of mine waste ran down the valley over the mine's offices and cafeteria at lunchtime;
// about 270 lost. Footage (small personal uploaders, both tracks silent): DF = Charles P. (DPAFiH0Znl0, 1280x720): a hillside filmer's view
// of the dam face starting to move and the mud surging over the loading plant; VA = Dudinha Rodrigues (na2n3E3EqzA, 640x360 25 fps): a
// repost of Vale's own CCTV over the conveyor, two cameras looped (unique: cam A 101.0-153.7, cam B 153.7-188.0; the outro WP99 uses
// cam A 146-153.5, so nothing here touches it).
// VO = one take (CASE30.mp3, starts on "Córrego"), split once at the raw (25.30, in the pause after "began to move.").
// RAW = DF src 10.0-25.0 (15 s), no cut into or out of it (the same take runs on); its sound is a real-recording bed (CC0 landslide +
// rock-slide field recording + wind) because the clip is silent. Blender: approach / flow (valley3d.py) + upstream (upstream3d.py).
// Device: MinuteEarlier.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { MinuteEarlier } from "../dev/WP30_MinuteEarlier";
import { NA, NF, NU } from "../dev/WP30_blLabels";

const C = "case/", DF = C + "graded/df.mp4", VA = C + "graded/va.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 144.8;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-25.30) @4.0 | RAW 29.30-44.30 (DF src 10.0-25.0) | VO part 2 (take 25.30-end) @44.30
// (case = take + 19.0), VO ends 143.93, hold to 144.8
const SPLIT = 25.3;
const RAW: [number, number] = [29.3, 44.3];
const R0 = 10.0;
const v1 = (t: number) => t + 4.0, v2 = (t: number) => t + 19.0;

const Fade: React.FC<{ n: number; children: React.ReactNode }> = ({ n, children }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ opacity: interpolate(f, [n - 16, n - 1], [1, 0], cl) }}>{children}</AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(7.91), vo: "Córrego do Feijão mine, Brumadinho, Brazil. January 2019. The last case ... doesn't have a fire in it. (VA cam A: mud round the conveyor)",
    node: (n) => <><Clip src={VA} from={120.0} n={n} rate={0.75} s0={1.04} s1={1.12} fx={0.5} fy={0.6} />
      <RedLabel text="CÓRREGO DO FEIJÃO MINE · BRUMADINHO, BRAZIL" at={6} hold={F(2.7)} size={40} /><RedLabel text="JANUARY 25, 2019" at={F(3.0)} hold={F(1.7)} size={44} /></> },
  { a: v1(7.91), b: v1(15.28), vo: "Dam I at this iron ore mine was a tailings dam, built in 1976 and owned by Vale since 2001. (Blender approach)",
    node: () => <><BlenderShot src={C + "maps/approach.mp4"} track={NA} labels={[["dam", "DAM I", 12, 205, -0.11]]} />
      <RedLabel text="VALE · BRAZILIAN MINING COMPANY" at={160} hold={50} size={40} /></> },
  { a: v1(15.28), b: v1(21.04), vo: "A tailings dam holds back the waste left over from mining, a wet mud of crushed rock and water. (VA cam B, close, slowed)",
    node: (n) => <Clip src={VA} from={156.2} n={n} rate={0.6} s0={1.12} s1={1.2} fx={0.62} fy={0.62} /> },
  { a: v1(21.04), b: RAW[0], vo: "At twenty eight minutes past noon on a Friday, the dam face began to move. (DF: the dam still, runs straight on into the raw)",
    node: (n) => <Clip src={DF} from={5.74} n={n} s0={1.0} s1={1.04} fx={0.5} fy={0.55} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the dam face moving, the dust, the brown surge over the loading plant (DF src 10.0-25.0; sound = CC0 landslide bed)",
    node: (n) => <Clip src={DF} from={R0} n={n} s0={1.04} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: RAW[1], b: v2(28.71), vo: "It released around twelve million cubic metres of mine waste. (DF runs on, slightly slowed)",
    node: (n) => <Clip src={DF} from={25.0} n={n} rate={0.85} s0={1.1} s1={1.16} fx={0.5} fy={0.55} /> },
  { a: v2(28.71), b: v2(37.21), vo: "Below the dam were the mine's administrative area and its cafeteria, and it was lunchtime. The mud swept down the valley ... (Blender flow)",
    node: () => <BlenderShot src={C + "maps/flow.mp4"} track={NF} labels={[["dam", "DAM I", 5, 236, -0.1], ["office", "OFFICES · CAFETERIA", 42, 200, 0.1]]} /> },
  { a: v2(37.21), b: v2(43.5), vo: "Everything in its path had been part of a working mine a minute earlier. About two hundred and seventy people were lost, (MinuteEarlier)",
    node: (n) => <MinuteEarlier src={VA} before={101.3} after={138.6} n={n} wipe={[60, 168]} /> },
  { a: v2(43.5), b: v2(47.31), vo: "and Vale's president said most of them were Vale employees. (VA cam B)",
    node: (n) => <Clip src={VA} from={160.0} n={n} s0={1.02} s1={1.1} fx={0.55} fy={0.6} /> },
  { a: v2(47.31), b: v2(50.26), vo: "It had happened in the same state before. (VA cam A)",
    node: (n) => <Clip src={VA} from={126.5} n={n} s0={1.1} s1={1.04} fx={0.4} fy={0.6} /> },
  { a: v2(50.26), b: v2(55.11), vo: "In November 2015, a tailings dam collapsed at Mariana, at a mine run by Samarco. (VA cam B)",
    node: (n) => <Clip src={VA} from={164.5} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.55} /> },
  { a: v2(55.11), b: v2(59.65), vo: "Vale owned Samarco jointly with BHP, and nineteen people were lost. (VA cam A)",
    node: (n) => <Clip src={VA} from={130.0} n={n} rate={0.9} s0={1.08} s1={1.0} fx={0.45} fy={0.55} /> },
  { a: v2(59.65), b: v2(72.13), vo: "Brumadinho's dam was the same upstream type. An upstream dam is raised in steps ... that waste can liquefy. (Blender upstream)",
    node: () => <BlenderShot src={C + "maps/upstream.mp4"} track={NU} labels={[["dam", "UPSTREAM DAM", 50, 110, -0.03], ["tail", "TAILINGS · MINE WASTE", 172, 120, 0.12]]} /> },
  { a: v2(72.13), b: v2(76.84), vo: "After Brumadinho, Brazil's mining agency ordered all eighty eight upstream dams in the country (VA cam B, fog)",
    node: (n) => <Clip src={VA} from={172.5} n={n} rate={0.9} s0={1.02} s1={1.09} fx={0.5} fy={0.6} /> },
  { a: v2(76.84), b: v2(80.74), vo: "decommissioned or removed by August 2021. (VA cam A)",
    node: (n) => <Clip src={VA} from={134.5} n={n} s0={1.0} s1={1.07} fx={0.6} fy={0.6} /> },
  { a: v2(80.74), b: v2(87.13), vo: "And this is what puts it at the very bottom. Vale knew of problems with the dam's monitoring sensors before it failed. (DF: the surge replayed 0.5x)",
    node: (n) => <Clip src={DF} from={19.5} n={n} rate={0.5} s0={1.16} s1={1.32} fx={0.56} fy={0.6} /> },
  { a: v2(87.13), b: v2(92.4), vo: "According to reporting on the case, executives at TÜV Süd, the company that inspected the dam, (VA cam A)",
    node: (n) => <><Clip src={VA} from={108.0} n={n} s0={1.04} s1={1.1} fx={0.4} fy={0.55} />
      <RedLabel text="TÜV SÜD · THE DAM'S INSPECTOR" at={F(89.83 - 87.13)} hold={F(92.4 - 89.83) - 14} size={42} /></> },
  { a: v2(92.4), b: v2(95.11), vo: "knew a year earlier that it was becoming unstable. (VA cam B)",
    node: (n) => <Clip src={VA} from={177.5} n={n} s0={1.08} s1={1.02} fx={0.55} fy={0.6} /> },
  { a: v2(95.11), b: v2(99.28), vo: "In January 2020, prosecutors charged Vale and its inspector, (VA cam A)",
    node: (n) => <Clip src={VA} from={113.5} n={n} s0={1.0} s1={1.07} fx={0.5} fy={0.6} /> },
  { a: v2(99.28), b: v2(103.39), vo: "TÜV Süd, with intentional homicide and environmental crimes. (DF: dust over the buried plant)",
    node: (n) => <Clip src={DF} from={28.0} n={n} s0={1.04} s1={1.1} fx={0.5} fy={0.6} /> },
  { a: v2(103.39), b: v2(109.18), vo: "They also charged sixteen people, including the former Vale president, Fabio Schvartsman. (VA cam B)",
    node: (n) => <><Clip src={VA} from={181.0} n={n} rate={0.9} s0={1.02} s1={1.1} fx={0.45} fy={0.6} />
      <RedLabel text="FABIO SCHVARTSMAN · FORMER VALE PRESIDENT" at={F(107.57 - 103.39)} hold={F(109.18 - 107.57) - 2} size={40} /></> },
  { a: v2(109.18), b: v2(113.57), vo: "In February 2021, Vale signed a thirty seven point seven billion reais (VA cam A, slowed)",
    node: (n) => <Clip src={VA} from={102.0} n={n} rate={0.8} s0={1.08} s1={1.02} fx={0.35} fy={0.6} /> },
  { a: v2(113.57), b: v2(118.34), vo: "settlement with the state of Minas Gerais, about seven billion dollars. (VA cam B, slowed)",
    node: (n) => <Clip src={VA} from={169.5} n={n} rate={0.48} s0={1.0} s1={1.06} fx={0.5} fy={0.55} /> },
  { a: v2(118.34), b: v2(121.04), vo: "Intentional is the word prosecutors chose. (VA cam A)",
    node: (n) => <Clip src={VA} from={105.5} n={n} rate={0.9} s0={1.06} s1={1.1} fx={0.3} fy={0.6} /> },
  { a: v2(121.04), b: END, vo: "Their case is that the risk was known before anyone sat down to eat. (DF: the dam still standing, slow pull out, fade)",
    node: (n) => <Fade n={n}><Clip src={DF} from={0.0} n={n} rate={0.9} s0={1.14} s1={1.02} fx={0.5} fy={0.5} /></Fade> },
];

const K = (t: number, kind: FxCut["kind"] = "blurDip", len = 12): FxCut => ({ at: F(t), kind, len });
const CUTS: FxCut[] = [
  K(4.0, "glitch", 10),            // title -> footage
  K(v1(7.91)), K(v1(15.28)), K(v1(21.04)),     // VA -> Blender approach -> VA cam B -> DF
  K(v2(28.71)), K(v2(37.21)),      // DF -> Blender flow -> MinuteEarlier
  K(v2(43.5)), K(v2(47.31)), K(v2(50.26)), K(v2(55.11)),
  K(v2(59.65)), K(v2(72.13)),      // into / out of Blender upstream
  K(v2(76.84)), K(v2(80.74), "glitch", 10),    // "And this is what puts it at the very bottom" -> the replay
  K(v2(87.13)), K(v2(92.4)), K(v2(95.11)), K(v2(99.28)), K(v2(103.39)), K(v2(109.18)), K(v2(113.57)), K(v2(118.34)), K(v2(121.04)),
];
export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.35).toFixed(2)}-${(c.at / 30 + 0.45).toFixed(2)}`).join(",") + `,${(END - 0.7).toFixed(2)}-${END.toFixed(2)}`;

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE LUNCH HOUR" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
      <Sequence from={F(4.0)} durationInFrames={F(SPLIT)} layout="none"><Audio src={staticFile("vor/CASE30.mp3")} /></Sequence>
      <Sequence from={F(RAW[1])} layout="none"><Audio src={staticFile("vor/CASE30.mp3")} startFrom={F(SPLIT)} /></Sequence>
      {/* raw sound: the clip is silent (rawclean: no music, nothing to keep), so a real-recording bed: CC0 landslide + rock slide + wind */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/raw_bed.wav")} volume={(f) => dB(-3) * interpolate(f, [0, 8, F(RAW[1] - RAW[0]) - 18, F(RAW[1] - RAW[0]) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* low real rumble under the VO: the Blender mud front running down the valley, and the mud washing over the CCTV yard */}
      <Sequence from={F(v2(28.71)) + 14} durationInFrames={F(8.0)} layout="none">
        <Audio src={staticFile(C + "media/sfx/landslide_chs_cc0.mp3")} startFrom={F(8)} volume={(f) => dB(-24) * interpolate(f, [0, 30, F(8.0) - 40, F(8.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(v2(37.21)) + 60} durationInFrames={F(4.0)} layout="none">
        <Audio src={staticFile(C + "media/sfx/landslide_chs_cc0.mp3")} startFrom={F(12)} volume={(f) => dB(-26) * interpolate(f, [0, 24, F(4.0) - 30, F(4.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 3 at -20 dB, out under the raw, fades with the picture */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(60)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-20) * interpolate(t, [4.0, 5.0, END - 1.6, END], [0, 1, 1, 0], cl) * (0.06 + 0.94 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
