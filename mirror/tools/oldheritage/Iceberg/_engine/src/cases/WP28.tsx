// Workplace #28 — Shahid Rajaee port, Bandar Abbas, Iran, 26 Apr 2025: containers burning on the Sina yard wharf, orange smoke, then
// the explosion that tore across the yard. 57 lives (judiciary), 1,000+ injured.
// Footage (small personal uploaders only): SR = ویدیوباز (Za72r1DOjEA): the wide port camera, the orange plume, the fireball and the
// wave of dust (silent upload -> real SFX for the raw). YS = اغذیه یاسین سمنان (orcuioWLY8g): the yard CCTV filmed off a monitor
// (forklift, people on the apron, the flames, the blast; silent). MH = Tianjin phone clip (MR. H., _hHRAbJCyow) for the closing line.
// VO = one take (CASE28.mp3), split once at the raw. RAW = SR src 19.5-34.0 (14.5 s): plume -> fireball -> dust swallowing the yard.
// Blender (build/CASE28/maps/port.py): yard = the wharf stacks and the orange plume; hangar = Beirut's Hangar 12, white bags.
// Devices: ForkliftSpot (the yard camera freezes on the forklift), BlastSync (both cameras side by side, synced on the blast).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { Tall } from "../dev/WP01_kit";
import { ForkliftSpot } from "../dev/WP28_ForkliftSpot";
import { BlastSync } from "../dev/WP28_BlastSync";
import { YARD, HANGAR } from "../dev/WP28_blLabels";

const C = "case/", G = C + "graded/";
const SR = G + "sr.mp4", YS = G + "ys.mp4", MH = G + "mh.mp4";
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO part 1 (take 0-13.80) @4.0 | RAW 18.0-32.5 (SR src 19.5-34.0) | VO part 2 (take 13.78-end) @32.5
const v1 = (t: number) => t + 4.0;
const RAW: [number, number] = [18.0, 32.5];
const R0 = 19.5;
const V2 = 13.78, v2 = (t: number) => t + (RAW[1] - V2);
const END = 103.3;
export const DUR = F(END);
const PART: [number, number, number | null][] = [[4.0, 0, 13.8], [RAW[1], V2, null]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(6.01), vo: "Shahid Rajaee, Iran's biggest container port, near Bandar Abbas. April 2025. (SR: the port camera, the plume)",
    node: (n) => <><Clip src={SR} from={0.5} n={n} s0={1.03} s1={1.1} fx={0.55} fy={0.4} />
      <RedLabel text="SHAHID RAJAEE PORT · BANDAR ABBAS, IRAN" at={8} hold={F(2.6)} size={40} /><RedLabel text="APRIL 26, 2025" at={F(3.4)} hold={F(2.0)} size={44} /></> },
  { a: v1(6.01), b: RAW[0], vo: "Around noon on a Saturday, containers on the wharf of the Sina yard were already burning, the smoke ... orange. (YS)",
    node: (n) => <><Clip src={YS} from={40.0} n={n} s0={1.04} s1={1.12} fx={0.3} fy={0.3} />
      <RedLabel text="SINA CONTAINER YARD" at={F(v1(8.99) - v1(6.01))} hold={F(2.4)} size={42} /></> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the plume, the fireball, the dust wave (SR src 19.5-34.0, real SFX)",
    node: (n) => <Clip src={SR} from={R0} n={n} s0={1.0} s1={1.06} fx={0.6} fy={0.35} /> },
  { a: RAW[1], b: v2(17.70), vo: "Iranian authorities said hazardous goods and chemical materials were involved. (YS)",
    node: (n) => <Clip src={YS} from={50.0} n={n} s0={1.1} s1={1.03} fx={0.25} fy={0.3} /> },
  { a: v2(17.70), b: v2(25.55), vo: "Several reports pointed to ... ammonium perchlorate ... and Iran's defence ministry denied it. (Blender yard)",
    node: () => <BlenderShot src={C + "maps/yard.mp4"} track={YARD} labels={[["plume", "THE BURNING CONTAINERS", 70, 120, 0.0]]} /> },
  { a: v2(25.55), b: v2(32.71), vo: "Mohammad Jamalian, a lawmaker ... declaring hazardous chemicals as low risk cargo. (YS)",
    node: (n) => <><Clip src={YS} from={60.0} n={n} s0={1.02} s1={1.09} fx={0.3} fy={0.4} />
      <RedLabel text="MOHAMMAD JAMALIAN · IRANIAN LAWMAKER" at={6} hold={F(2.6)} size={40} /></> },
  { a: v2(32.71), b: v2(37.97), vo: "He said the forklift operator didn't know ... and that a spark set it off. (ForkliftSpot)",
    node: (n) => <ForkliftSpot src={YS} from={17.2} n={n} freeze={F(2.3)} at={[0.49, 0.7]} /> },
  { a: v2(37.97), b: v2(44.20), vo: "The state judiciary later put the toll at fifty seven lives, revised down from ... seventy, (YS)",
    node: (n) => <Clip src={YS} from={74.0} n={n} s0={1.08} s1={1.02} fx={0.2} fy={0.35} /> },
  { a: v2(44.20), b: v2(48.45), vo: "with more than a thousand injured. Opposition sources claimed far more. (SR: the dust)",
    node: (n) => <Clip src={SR} from={40.0} n={n} s0={1.02} s1={1.08} fx={0.5} fy={0.45} /> },
  { a: v2(48.45), b: v2(53.84), vo: "The blast wave tore across the rest of the yard. The fire was declared contained on the 28th. (BlastSync)",
    node: (n) => <BlastSync a={YS} aFrom={96.6} aX={0.03} b={SR} bFrom={25.6} bX={0.74} n={n} open={16} /> },
  { a: v2(53.84), b: v2(59.50), vo: "Interior Minister Eskandar Momeni said the cause was negligence ... safety measures, (SR: the dust settling)",
    node: (n) => <><Clip src={SR} from={47.0} n={n} s0={1.1} s1={1.03} fx={0.5} fy={0.5} />
      <RedLabel text="ESKANDAR MOMENI · INTERIOR MINISTER" at={6} hold={F(2.6)} size={40} /></> },
  { a: v2(59.50), b: v2(63.42), vo: "and two people, including a government official, were arrested in May. (YS)",
    node: (n) => <Clip src={YS} from={84.0} n={n} s0={1.02} s1={1.08} fx={0.2} fy={0.3} /> },
  { a: v2(63.42), b: v2(69.67), vo: "If the reports about those containers are right ... sitting on a wharf next to a fire. (SR: the plume behind the stacks)",
    node: (n) => <Clip src={SR} from={10.5} n={n} s0={1.03} s1={1.14} fx={0.6} fy={0.25} /> },
  { a: v2(69.67), b: v2(80.24), vo: "Beirut, in August 2020 ... ammonium nitrate sat in a port warehouse for years ... more than two hundred people were lost. (Blender hangar)",
    node: () => <><BlenderShot src={C + "maps/hangar.mp4"} track={HANGAR} labels={[["far", "HANGAR 12 · PORT OF BEIRUT", 14, 80, 0.0]]} />
      <RedLabel text="AMMONIUM NITRATE" at={F(73.48 - 69.67)} hold={F(2.4)} x={0.5} y={0.86} size={42} /></> },
  { a: v2(80.24), b: END, vo: "China had already done it five years before Beirut. (MH: Tianjin, the fire on the skyline)",
    node: (n) => <><Tall src={MH} from={44.0} n={n} s0={1.0} s1={1.07} fy={0.55} />
      <RedLabel text="TIANJIN, CHINA · 2015" at={10} hold={F(2.6)} size={42} /></> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(RAW[0]), kind: "blurDip", len: 12 },      // VO -> raw
  { at: F(RAW[1]), kind: "blurDip", len: 12 },      // raw -> VO
  { at: F(v2(17.70)), kind: "glitch", len: 10 },    // into Blender
  { at: F(v2(25.55)), kind: "blurDip", len: 12 },
  { at: F(v2(32.71)), kind: "blurDip", len: 12 },   // same yard camera, 40 s later (ForkliftSpot)
  { at: F(v2(69.67)), kind: "glitch", len: 10 },    // to Beirut
  { at: F(v2(80.24)), kind: "glitch", len: 10 },    // to China
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE CONTAINER YARD" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE28.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the upload is silent -> real recordings: the fire's roar under the plume, the fireball's boom, the wave, debris */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-8) * interpolate(f, [0, 12, F(RAW[1] - RAW[0]) - 24, F(RAW[1] - RAW[0]) - 6], [0, 1, 1, 0], cl)} />
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-20) * interpolate(f, [0, 30, F(RAW[1] - RAW[0]) - 24, F(RAW[1] - RAW[0]) - 6], [0, 1, 1, 0], cl)} />
        <Sequence from={F(29.75 - R0) - 2} layout="none">
          <Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-2)} />
          <Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-6)} />
        </Sequence>
        <Sequence from={F(31.0 - R0)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_2.wav")} volume={dB(-10)} /></Sequence>
        <Sequence from={F(31.6 - R0)} layout="none"><Audio src={staticFile("sfx_n2/real/impact_3.wav")} volume={dB(-16)} /></Sequence>
      </Sequence>
      {/* music: Epidemic ambient Music 4 at -18 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(10)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-18) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.06 + 0.94 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
