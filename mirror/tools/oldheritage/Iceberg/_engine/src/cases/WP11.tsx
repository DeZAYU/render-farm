// Workplace #11 — Chevron Richmond refinery, California, 6 Aug 2012: a leaking line in Crude Unit No. 4 ruptures while crews work on
// it; the vapour cloud swallows the unit and ignites; 19 workers escape; 15,000+ residents seek medical care. Footage: U.S. CSB
// surveillance camera (public domain, silent; cropped below the burned-in time/"LOW PRESSURE" text; close view = src 0-107, wide
// view = src 126-300, source dissolves at 14.6-15.5 / 44.7-45.7 / 107.7-125 avoided), a driver on the 580 (michaelocallahan,
// syyBHIhGpYU), a resident's street (Custer, COcdbVWddic; the TV alert screen 46-62 never used). VO = one take (CASE11.mp3), split once
// at the main raw. Raw = the wide camera: the cloud billowing over the unit -> it ignites, black smoke bursts up (src 172.0-187.5,
// 15.5 s), silent CCTV -> real SFX. Devices: SameCamWipe, TwinFires; Blender: sulfidation pipe cutaway.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { useWpFonts } from "../dev/WP01_kit";
import { SameCamWipe } from "../dev/WP11_SameCamWipe";
import { TwinFires } from "../dev/WP11_TwinFires";
import { PIPE } from "../dev/WP11_pipeLabels";

const C = "case/", M = C + "graded/main.mp4", MO = C + "graded/mo.mp4", CU = C + "graded/cu.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(103.4);

const Credit: React.FC<{ text: string; at?: number; hold?: number }> = ({ text, at = 10, hold = 80 }) => {
  useWpFonts(); const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 10, at + hold, at + hold + 10], [0, 1, 1, 0], cl);
  return <div style={{ position: "absolute", left: 56, bottom: 40, fontFamily: "Elite", fontSize: 24, color: "rgba(242,242,240,.78)", opacity: o, textShadow: "0 2px 6px rgba(0,0,0,.9)" }}>{text}</div>;
};

// timeline (s): title 0-4 | VO part 1 (take 0-17.35) @4.0 | RAW 21.35-36.85 (src 172.0-187.5) | VO part 2 (take 17.4-end) @36.85, ends 102.4
const PART: [number, number, number | null][] = [[4.0, 0, 17.35], [36.85, 17.4, null]];
const RAW: [number, number] = [21.35, 36.85];
const RSRC = 172.0, IGN = RAW[0] + (181.6 - RSRC); // first black smoke on the timeline

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.58, vo: "Chevron, Richmond, California. August 2012. (the unit quiet, the refinery's camera)",
    node: (n) => <><Clip src={M} from={1.0} n={n} s0={1.0} s1={1.06} />
      <RedLabel text="CHEVRON REFINERY · RICHMOND, CALIFORNIA" at={6} hold={F(1.75)} size={44} /><RedLabel text="AUGUST 6, 2012" at={F(2.11)} hold={F(1.2)} size={44} />
      <Credit text="SURVEILLANCE CAMERA · U.S. CHEMICAL SAFETY BOARD" at={10} hold={85} /></> },
  { a: 7.58, b: 13.26, vo: "In Crude Unit Number Four, a pipe had started to leak, and crews had been sent out to deal with it. (the first vapour)",
    node: (n) => <Clip src={M} from={17.0} n={n} s0={1.06} s1={1.18} fx={0.32} fy={0.42} /> },
  { a: 13.26, b: 21.35, vo: "While they were working on it, the pipe ruptured. According to the CSB, nineteen workers ... inside that cloud. (SameCamWipe)",
    node: (n) => <SameCamWipe src={M} tBefore={8.0} fromAfter={62.0} n={n} w0={10} w1={46} fx={0.4} fy={0.55} /> },
  { a: 21.35, b: 36.85, vo: "RAW: the wide camera, the cloud billowing over the unit -> black smoke bursts up (src 172.0-187.5)",
    node: (n) => <Clip src={M} from={RSRC} n={n} s0={1.0} s1={1.1} fx={0.45} fy={0.4} /> },
  { a: 36.85, b: 41.45, vo: "All nineteen got out. The corrosion here has a name, sulfidation.",
    node: (n) => <Clip src={M} from={196.0} n={n} s0={1.14} s1={1.06} fx={0.5} fy={0.4} /> },
  { a: 41.45, b: 50.95, vo: "Sulfur compounds ... eat at carbon steel pipe from the inside ... The wall thins along a whole length ... (Blender pipe)",
    node: () => <BlenderShot src={C + "maps/pipe.mp4"} track={PIPE} labels={[["outside", "CARBON STEEL PIPE", 12, 80, -0.09], ["wall", "THE INSIDE OF THE WALL", 165, 105, 0]]} /> },
  { a: 50.95, b: 55.05, vo: "A pipe can look fine from the outside right up to the day it fails. (the unit's pipework, quiet)",
    node: (n) => <Clip src={M} from={9.5} n={n} s0={1.3} s1={1.4} fx={0.6} fy={0.68} /> },
  { a: 55.05, b: 58.85, vo: "By evening, the smoke was rising over the 580 freeway. (a driver on the 580)",
    node: (n) => <><Clip src={MO} from={33.5} n={n} s0={1.02} s1={1.08} fy={0.6} />
      <RedLabel text="INTERSTATE 580 · RICHMOND" at={8} hold={F(2.6)} size={44} /><Credit text="A DRIVER'S VIDEO" at={10} hold={90} /></> },
  { a: 58.85, b: 63.99, vo: "The smoke drifted over the city, and more than fifteen thousand residents sought medical care.",
    node: (n) => <><Clip src={CU} from={20.0} n={n} s0={1.0} s1={1.08} fx={0.6} fy={0.4} /><Credit text="A RESIDENT'S VIDEO" at={10} hold={100} /></> },
  { a: 63.99, b: 67.87, vo: "Those people weren't on the refinery payroll. They were its neighbours.",
    node: (n) => <Clip src={CU} from={8.0} n={n} s0={1.12} s1={1.02} fx={0.4} fy={0.6} /> },
  { a: 67.87, b: 73.05, vo: "The CSB found Chevron hadn't identified sulfidation as a likely way for that pipe to fail.",
    node: (n) => <Clip src={M} from={214.0} n={n} s0={1.0} s1={1.1} fx={0.55} fy={0.45} /> },
  { a: 73.05, b: 78.4, vo: "Chevron also had no formal guidance for responding to a leak, so the crews walked up to it. (the cloud building, close camera)",
    node: (n) => <Clip src={M} from={47.0} n={n} s0={1.0} s1={1.1} fx={0.4} fy={0.5} /> },
  { a: 78.4, b: 84.15, vo: "It also reported that Chevron's own specialists had recommended upgrading piping like this years before.",
    node: (n) => <Clip src={CU} from={27.6} n={n} rate={0.83} s0={1.0} s1={1.08} fx={0.6} fy={0.4} /> },
  { a: 84.15, b: 90.95, vo: "In 2013, Chevron pleaded no contest to six misdemeanour charges and agreed to pay two million dollars.",
    node: (n) => <Clip src={M} from={240.0} n={n} s0={1.02} s1={1.14} fx={0.62} fy={0.4} /> },
  { a: 90.95, b: 97.4, vo: "Cal OSHA ... proposed a fine of nearly a million, and Chevron appealed it.",
    node: (n) => <Clip src={CU} from={65.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.45} /> },
  { a: 97.4, b: 103.4, vo: "Two refineries, three years apart, and the same quiet problem in the steel. (TwinFires)",
    node: (n) => <TwinFires n={n} slide={[12, 52]} a={{ src: C + "graded/se.mp4", from: 60.0, ox: -150, label: "WOODS CROSS · 2009" }}
      b={{ src: M, from: 262.0, ox: 120, label: "RICHMOND · 2012" }} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.58), kind: "blurDip", len: 12 },  // same camera, minutes later
  { at: F(13.26), kind: "blurDip", len: 12 },  // back to the quiet frame for the wipe
  { at: F(21.35), kind: "blurDip", len: 12 },  // VO -> raw (wide camera)
  { at: F(36.85), kind: "blurDip", len: 14 },  // raw -> the same camera later
  { at: F(50.95), kind: "blurDip", len: 12 },  // Blender -> camera
  { at: F(73.05), kind: "blurDip", len: 12 },
  { at: F(84.15), kind: "blurDip", len: 12 },
  { at: F(97.4), kind: "glitch", len: 10 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="NINETEEN IN THE CLOUD" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw: silent CCTV -> real SFX: the venting cloud (low roar), then the ignition and the fire */}
      <Sequence from={F(RAW[0])} durationInFrames={F(IGN - RAW[0]) + 20} layout="none">
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} loop volume={(f) => dB(-18) * interpolate(f, [0, 24, F(IGN - RAW[0]), F(IGN - RAW[0]) + 20], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(IGN) - 2} durationInFrames={F(5)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={dB(-5)} /></Sequence>
      <Sequence from={F(IGN)} durationInFrames={F(4)} layout="none"><Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-12)} /></Sequence>
      <Sequence from={F(IGN) + 6} durationInFrames={F(RAW[1] - IGN) - 6} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-8) * interpolate(f, [0, 24, F(RAW[1] - IGN) - 30, F(RAW[1] - IGN) - 8], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 3 (-14 LUFS file) at -20 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(103.4 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-20) * interpolate(t, [4.0, 5.0, 101.8, 103.4], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
