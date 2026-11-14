// Tornado #22 — the Douglas County deputy and the Elkhorn Ranch landspout, Elbert County, Colorado (18 May 2025).
// Footage: DCSO's release of the deputy's Axon dashcam (his own radio + phone audio; the DCSO badge and the Axon OSD are delogo'd
// before the grade; his self-identification on the radio at src 17.5-21.1 s is never used) and the photos at its end; small personal
// channels for the same afternoon's other tornadoes: danmeso + CajunSnowMan (Bennett), 1000CalorieSnackPack (genesis over the prairie).
// Devices for THIS case: PlainsRelief (NAIP x 3DEP hillshade of the Front Range edge in 3-D: Elbert County outline / the four DAT
// tracks of the day), EFLadder (the EF scale beside his footage, EF2 lit, the survey's 125 mph peak), the NWS Boulder survey statement
// as a TeletypeSheet (the PNS re-typeset as a tilted teletype printout: EF2 boxed, "uncharacteristically strong landspout" ruled).
// Source cuts: dc 186.33 248.63 313.87 318.87 323.87; gen (ChDbg from 45 s) 10.63 17.13 147.17. Windows avoid them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { PlainsRelief } from "../dev/TOR22_PlainsRelief";
import { EFLadder } from "../dev/TOR22_EFLadder";
import { TeletypeSheet } from "../dev/TOR22_TeletypeSheet";
import { COUNTIES, PLACES, TRACKS25 } from "../dev/TOR22_data";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(128.4);

// VO: one take, "Twenty-two." dropped (take starts at 0.85 s in the pause after it), split only where the raws sit.
// 3 Nov raw audit (owner: raws only at incident moments): R2 (after the landspout/EF2 explanation), R3 (between "homes it's just
// crossed" and "into the damage path") and R5 (after the EF2 wind range) removed; the VO runs on there.
const VO: [number, number, number][] = [[0.85, 14.34, 20.2], [14.34, 43.62, 44.39], [43.62, 86.35, 85.17]];
// raws: [timeline a, b, media file, file offset, gain dB, fade-out s] — his radio / phone, faded to 0 before the VO returns
const RAWS: [number, number, string, number, number, number][] = [
  [4.0, 20.2, "dc_a_clean.wav", 21.4, -1, 0.6],     // R0 "194 and 17 ... it's heading northeast" (after his name)
  [33.69, 44.39, "dc_a_clean.wav", 40.3, 0, 0.6],   // R1 "... watch some roofs come off houses and stuff"
  [73.67, 85.17, "dc_b_clean.wav", 46.0, 0, 0.7],  // R4 "I called it in ... I watched roofs come off houses ... that's a tornado"
];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const BEN1 = { s0: 1.2, fx: 1.0, fy: 0.5 }; // danmeso's upload has a black strip down the left edge: framed out


const SHOTS: Sh[] = [
  // R0 4.0-20.2: the dirt column crossing the open land ahead, his radio
  { a: 4, b: 20.2, vo: "RAW 0", src: "dc_a.mp4", from: 21.4, s0: 1.06, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 20.2, b: 23.3, vo: "On Sunday the 18th of May 2025,", src: "dc_a.mp4", from: 2.0, s0: 1.05, s1: 1.1, fx: 0.55, fy: 0.45, over: <RedLabel text="MAY 18, 2025" at={F(0.5)} hold={F(2.2)} /> },
  { a: 23.3, b: 26.95, vo: "a Douglas County sheriff's deputy was driving to work in Colorado.", src: "dc_a.mp4", from: 60.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.55 },
  { a: 26.95, b: 29.75, vo: "A tornado touched down in the next county over.", src: "dc_a.mp4", from: 8.0, s0: 1.12, s1: 1.2, fx: 0.55, fy: 0.4 },
  { a: 29.75, b: 33.69, vo: "He got on the radio and told dispatch he was watching roofs come off houses.", src: "dc_a.mp4", from: 86.0, s0: 1.05, s1: 1.1, fx: 0.6, fy: 0.45 },
  { a: 33.69, b: 44.39, vo: "RAW 1", src: "dc_a.mp4", from: 40.3, s0: 1.06, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 44.39, b: 46.45, vo: "It's brown because it's full of dirt. (white-framed zoom on the column)", node: <Inset src={GR + "dc_a.mp4"} from={66.0} box={0.62} pos="62% 42%" drift={0.12} /> },
  { a: 46.45, b: 49.75, vo: "Elbert County is open grassland southeast of Denver,",
    node: <PlainsRelief src={GR + "relief.jpg"} iw={3840} ih={2160} keys={[[0, 1500, 1050, 0.62], [99, 2100, 1350, 0.8]]} counties={COUNTIES} hiCounty="Elbert" countyAt={6}
      places={[{ name: "DENVER", p: PLACES.DENVER, at: 4 }, { name: "ELIZABETH", p: PLACES.ELIZABETH, at: 30 }]} label="ELBERT COUNTY, COLORADO" labelAt={F(1.2)} /> },
  { a: 49.75, b: 51.91, vo: "with homes spread out on big lots.", src: "dc_b.mp4", from: 24.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 51.91, b: 53.35, vo: "This was a landspout,", src: "dc_a.mp4", from: 92.0, s0: 1.1, s1: 1.16, fx: 0.62, fy: 0.45 },
  { a: 53.35, b: 58.43, vo: "a tornado that grows up from the ground without the big rotating storm behind most tornadoes.", src: "dc_a.mp4", from: 102.0, s0: 1.06, s1: 1.14, fx: 0.7, fy: 0.4 },
  { a: 58.43, b: 62.76, vo: "The plains east of Colorado's mountains are one of the best-known places for them, (the prairie the same afternoon)", src: "gen.mp4", from: 6.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 62.76, b: 64.15, vo: "and they're usually weak. (a thin funnel and its dust whirl)", src: "gen.mp4", from: 133.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 64.15, b: 69.25, vo: "The Weather Service rated this one EF2 and called it uncharacteristically strong. (NWS Boulder survey: TeletypeSheet)", node: <TeletypeSheet bg={GR + "dc_a.mp4"} bgFrom={64.0} /> },
  { a: 69.25, b: 71.84, vo: "He's driving toward the homes it's just crossed.", src: "dc_a.mp4", from: 110.0, s0: 1.04, s1: 1.06, fx: 0.55, fy: 0.5 },
  { a: 71.84, b: 73.67, vo: "And now into the damage path.", src: "dc_b.mp4", from: 16.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 73.67, b: 85.17, vo: "RAW 4: rain and hail on the glass in the neighbourhood, his phone call", src: "dc_b.mp4", from: 46.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 85.17, b: 89.19, vo: "This was one of four tornadoes south and east of Denver that afternoon. (the four DAT tracks)",
    node: <PlainsRelief src={GR + "relief.jpg"} iw={3840} ih={2160} keys={[[0, 1700, 900, 0.7], [118, 2500, 880, 1.25]]} tracks={TRACKS25} trackAt={14} trackEvery={16} tilt={42}
      places={[{ name: "DENVER", p: PLACES.DENVER, at: 2 }, { name: "BENNETT", p: PLACES.BENNETT, at: 50 }]} /> },
  { a: 89.19, b: 92.34, vo: "Two of the others were on the ground near Bennett at the same time,", src: "ben1.mp4", from: 20.0, s0: BEN1.s0, s1: BEN1.s0 + 0.05, fx: BEN1.fx, fy: BEN1.fy,
    over: <RedLabel text="BENNETT, COLORADO" at={F(0.4)} hold={F(2.4)} /> },
  { a: 92.34, b: 94.84, vo: "between 1:40 and 1:46. (CajunSnowMan: the other Bennett tornado, same minutes)", src: "ben2.mp4", from: 7.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: 94.84, b: 99.41, vo: "EF2 on the scale covers winds of 111 to 135. (the EF ladder beside his footage)", node: <EFLadder bg={GR + "dc_a.mp4"} bgFrom={70.0} hi="EF2" hiAt={10} peak={125} peakAt={84} /> },
  { a: 99.41, b: 101.35, vo: "According to the sheriff's office, (the office's own photo: the patrol car at the damaged house)", src: "dc_b.mp4", from: 193.0, s0: 1.03, s1: 1.07, fx: 0.6, fy: 0.5 },
  { a: 101.35, b: 103, vo: "he's a trained paramedic. (on scene)", src: "dc_b.mp4", from: 152.0, s0: 1.12, s1: 1.16, fx: 0.25, fy: 0.6 },
  { a: 103, b: 106.24, vo: "He went in to check on the people nearby and look for injuries.", src: "dc_b.mp4", from: 160.5, s0: 1.08, s1: 1.13, fx: 0.5, fy: 0.6 },
  { a: 106.24, b: 109.53, vo: "He radioed back five to ten homes severely damaged,", src: "dc_b.mp4", from: 197.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 109.53, b: 113.7, vo: "and dispatch sent fire crews to a collapsed garage and a gas leak.", src: "dc_b.mp4", from: 202.6, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.6 },
  { a: 113.7, b: 116.89, vo: "Nineteen homes near Elizabeth were damaged in the end.", src: "dc_b.mp4", from: 140.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55,
    over: <RedLabel text="ELIZABETH, COLORADO" at={F(0.5)} hold={F(2.4)} /> },
  { a: 116.89, b: 119.36, vo: "The sheriff's office said he was in the right place,", src: "dc_b.mp4", from: 74.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 119.36, b: 120.78, vo: "at the right time.", src: "dc_a.mp4", from: 14.0, s0: 1.08, s1: 1.12, fx: 0.55, fy: 0.42 },
  { a: 120.78, b: 124.32, vo: "Driving at a tornado is a terrible plan for almost anyone.", src: "dc_a.mp4", from: 53.5, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 124.32, b: 128.4, vo: "A paramedic with a radio and a reason is the one exception I'll make.", src: "dc_a.mp4", from: 95.0, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(20.2), kind: "blurDip", len: 12 },
  { at: F(23.3), kind: "blurDip", len: 10 },   // dashcam to dashcam, other moment (jump-cut guard)
  { at: F(26.95), kind: "blurDip", len: 10 },
  { at: F(29.75), kind: "blurDip", len: 10 },
  { at: F(33.69), kind: "blurDip", len: 10 },
  { at: F(44.39), kind: "zoomHit", len: 10 },
  { at: F(51.91), kind: "blurDip", len: 10 },  // dc_b -> dc_a: same dashcam release, other moment
  { at: F(53.35), kind: "blurDip", len: 10 },
  { at: F(62.76), kind: "blurDip", len: 10 },
  { at: F(64.15), kind: "blurDip", len: 10 },  // prairie -> the teletype sheet
  { at: F(69.25), kind: "blurDip", len: 12 },  // teletype sheet -> dashcam (was the R2 exit)
  { at: F(71.84), kind: "blurDip", len: 10 },
  { at: F(73.67), kind: "blurDip", len: 10 },
  { at: F(85.17), kind: "glitch", len: 10 },
  { at: F(99.41), kind: "glitch", len: 8 },    // EF ladder -> the office's own photo (was R5's edges)
  { at: F(103.0), kind: "blurDip", len: 10 },
  { at: F(106.24), kind: "blurDip", len: 10 },
  { at: F(109.53), kind: "blurDip", len: 10 },
  { at: F(113.7), kind: "blurDip", len: 10 },
  { at: F(116.89), kind: "blurDip", len: 10 },
  { at: F(120.78), kind: "blurDip", len: 10 },
  { at: F(124.32), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [44.4, "sfx_n2/whoosh_01.wav", -32],
  [46.5, "sfx_n2/whoosh_02.wav", -33],
  [64.2, X + "paper_3.wav", -34],
  [85.12, "sfx_n2/glitch_03.wav", -28],
  [94.9, "sfx_n2/whoosh_01.wav", -33],
  [99.36, "sfx_n2/glitch_01.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE DEPUTY WHO DROVE TOWARD IT" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE22.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, off, g, fo], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(MD + file)} startFrom={F(off)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a - fo), F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
      {/* music: Epidemic ambient, Music 1 (-18.3 LUFS -> about -33.5), only under the VO blocks long enough to carry it; out under the radio raws */}
      {([[20.2, 33.69, 5], [44.39, 73.67, 20], [85.17, 128.4, 48]] as [number, number, number][]).map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => dB(-15.5) * interpolate(f, [0, 24, F(b - a) - 30, F(b - a) - 4], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
    </AbsoluteFill>
  </LibFontGate>
);
