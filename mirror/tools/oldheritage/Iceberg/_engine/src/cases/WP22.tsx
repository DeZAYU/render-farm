// Workplace #22 — Rosneft's Achinsk refinery, Krasnoyarsk krai, 15 June 2014, 23:56: the gas fractionation unit explodes; eight
// workers lost. Footage (small personal uploaders only; the MChS ministry clip is dropped per SOURCES_REPLACE.md):
// AA = Айдар Альтин (hIsxg83qqAM, 25 subs): a phone filming the plant's CCTV monitor; cropped to the monitor picture (no audio of
// use: silent room -> real SFX). FA = Ещё живой (Fa0ulUVQ7Es, 2 subs): the unit burning through steelwork at dusk.
// OK = Новости Глазами Очевидцев (E9kSKqJZsNA, 180 subs): the fire from far off at night. NZ = NOVAYA PRICHULIMKA (U0ue0uQUAG8,
// 379 subs, raw handheld walk the next morning, no anchor/bug): the wrecked unit, fire trucks, investigators.
// VO = one take (CASE22.mp3), split once at the raw. RAW = AA src 25.0-41.0 (16 s): the unit burning, the flare, the blast, the fire.
// Blender (build/CASE22/maps/gfu.py): the unit at night, vapour from a flange on the overhead rack spreading low across it.
// Device: RackTrace (the overhead rack traced on the refinery's CCTV picture, turning to dashes on "not an official finding").
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { RackTrace } from "../dev/WP22_RackTrace";
import { GF } from "../dev/WP22_blLabels";

const C = "case/", AA = C + "graded/aa.mp4", FA = C + "graded/fa.mp4", OK = C + "graded/ok.mp4", NZ = C + "graded/nz.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 91.0;
export const DUR = F(END);

// timeline (s): title 0-4 | VO part 1 (take 0-16.20) @4.0 | RAW 20.6-36.6 (AA src 25.0-41.0, blast flash at src 32.5) |
// VO part 2 (take 16.51-end) @36.6 (case = take + 20.09), VO ends ~89.99, hold to 91.0
const PART: [number, number, number | null][] = [[4.0, 0, 16.2], [36.6, 16.51, null]];
const RAW: [number, number] = [20.6, 36.6];
const R0 = 25.0, BLAST = RAW[0] + (32.45 - R0);
const v2 = (t: number) => t + 20.09;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.5, vo: "Rosneft's Achinsk refinery, Krasnoyarsk, Siberia. June 2014. (OK: the fire from far off at night)",
    node: (n) => <><Clip src={OK} from={1.0} n={n} s0={1.04} s1={1.14} fx={0.42} fy={0.45} />
      <RedLabel text="ROSNEFT ACHINSK REFINERY · KRASNOYARSK, SIBERIA" at={8} hold={F(2.6)} size={40} /><RedLabel text="JUNE 15, 2014" at={F(3.2)} hold={F(1.8)} size={44} /></> },
  { a: 9.5, b: 16.5, vo: "One account that went round afterwards said an overhead pipeline in the unit had lost its seal. That isn't an official finding. (RackTrace)",
    node: (n) => <RackTrace src={AA} from={3.0} rate={0.5} n={n} at={F(7.92 - 5.5)} doubt={F(10.76 - 5.5)}
      pts={[[0, 388], [640, 392], [1330, 400], [1620, 370], [1920, 336]]} /> },
  { a: 16.5, b: 20.6, vo: "At four minutes to midnight, the gas in the fractionation unit went. (AA: punched in on the burning unit)",
    node: (n) => <Clip src={AA} from={14.0} n={n} s0={1.55} s1={1.7} fx={0.42} fy={0.28} /> },
  { a: 20.6, b: 36.6, vo: "RAW: the unit burning on the CCTV, the flare, the blast whites out the screen, the fire after (AA src 25.0-41.0, SFX)",
    node: (n) => <Clip src={AA} from={R0} n={n} s0={1.0} s1={1.06} fx={0.45} fy={0.4} /> },
  { a: 36.6, b: v2(20.26), vo: "A gas fractionation unit (replay: the flare before the blast, 0.5x, pushed)",
    node: (n) => <Clip src={AA} from={30.6} rate={0.5} n={n} s0={1.15} s1={1.32} fx={0.42} fy={0.3} /> },
  { a: v2(20.26), b: v2(29.52), vo: "takes the light gases ... propane and butane. Those are heavier than air, so a leak spreads low across the unit. (Blender gfu)",
    node: () => <BlenderShot src={C + "maps/gfu.mp4"} track={GF} labels={[["unit", "GAS FRACTIONATION UNIT", 10, 75, 0.06]]} /> },
  { a: v2(29.52), b: v2(36.22), vo: "Russia's Investigative Committee said the fire covered about four hundred square metres, and eight workers didn't survive it. (FA)",
    node: (n) => <Clip src={FA} from={0.2} n={n} s0={1.0} s1={1.1} fx={0.45} fy={0.55} /> },
  { a: v2(36.22), b: v2(41.5), vo: "The Emergencies Ministry, Russia's national rescue service, fought the fire through the night. (AA: after the blast)",
    node: (n) => <Clip src={AA} from={47.0} n={n} s0={1.05} s1={1.15} fx={0.5} fy={0.4} /> },
  { a: v2(41.5), b: v2(44.6), vo: "The Moscow Times reported seven people injured. (OK)",
    node: (n) => <Clip src={OK} from={9.5} n={n} s0={1.12} s1={1.04} fx={0.4} fy={0.45} /> },
  { a: v2(44.6), b: v2(48.54), vo: "Rosneft halted the whole refinery and restarted it that September. (NZ: the morning after)",
    node: (n) => <Clip src={NZ} from={49.7} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: v2(48.54), b: v2(52.5), vo: "In the criminal case, two men were convicted (NZ: fire truck at the wrecked building)",
    node: (n) => <Clip src={NZ} from={1.0} n={n} s0={1.02} s1={1.1} fx={0.4} fy={0.5} /> },
  { a: v2(52.5), b: v2(56.29), vo: "of breaching safety rules at a highly explosive facility and causing death through negligence. (NZ)",
    node: (n) => <Clip src={NZ} from={9.4} n={n} s0={1.1} s1={1.02} fx={0.5} fy={0.5} /> },
  { a: v2(56.29), b: v2(62.09), vo: "They were the chief engineer, Oleg Dumchev, and a process operator, Yuri Vdovenko. (NZ)",
    node: (n) => <><Clip src={NZ} from={22.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} />
      <RedLabel text="OLEG DUMCHEV · CHIEF ENGINEER" at={F(57.69 - 56.29)} hold={F(1.5)} size={42} />
      <RedLabel text="YURI VDOVENKO · PROCESS OPERATOR" at={F(60.47 - 56.29)} hold={F(1.4)} size={42} /></> },
  { a: v2(62.09), b: v2(66.24), vo: "Each got two and a half years, and both were released under an amnesty. (FA)",
    node: (n) => <Clip src={FA} from={12.0} n={n} s0={1.1} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v2(66.24), b: END, vo: "If that account is right, eight lives came down to the seal on one pipe. (NZ: the wrecked pipe rack, slow push)",
    node: (n) => <Clip src={NZ} from={28.6} n={n} s0={1.0} s1={1.12} fx={0.5} fy={0.45} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.5), kind: "blurDip", len: 12 },       // into the CCTV
  { at: F(20.6), kind: "blurDip", len: 12 },      // VO -> raw (same camera)
  { at: F(36.6), kind: "blurDip", len: 14 },      // raw -> replay
  { at: F(v2(20.26)), kind: "glitch", len: 10 },  // into Blender
  { at: F(v2(29.52)), kind: "blurDip", len: 12 },
  { at: F(v2(44.6)), kind: "blurDip", len: 12 },  // the morning after
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE GAS CLOUD AT MIDNIGHT" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE22.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the monitor clip is silent -> real recordings timed to the picture: the unit burning, the blast, the fire after */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-14) * interpolate(f, [0, 12, F(7.4), F(7.9)], [0, 1, 1, 0.2], cl)} />
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-20) * interpolate(f, [0, 12, F(16) - 16, F(16) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(BLAST)} durationInFrames={F(RAW[1] - BLAST)} layout="none">
        <Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-3)} />
        <Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-8)} />
        <Sequence from={10} layout="none">
          <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} startFrom={F(1.0)} volume={(f) => dB(-6) * interpolate(f, [0, 14, F(RAW[1] - BLAST) - 26, F(RAW[1] - BLAST) - 14], [0, 1, 1, 0], cl)} />
        </Sequence>
      </Sequence>
      {/* music: Epidemic ambient Music 5 (-20.5 LUFS file) at -12 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-12) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
