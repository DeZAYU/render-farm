// Theme Park #10 — The Wheel at ICON Park, Orlando (31 Dec 2022): 62 people stranded ~4.5 h after a power loss, crews turn the wheel by hand.
// Footage: Orange County Fire Rescue's own drone release (iE3erUjymgs), SILENT, drone (night colour) + a 4:3 thermal camera, joined by slow
// dissolves (72-73, 103-104, 119-120, 131-136, 149-150, 160-161, 189-190, 213-214, 222-223 avoided). Burned-in caption strip at the very
// bottom cropped off (media/iw.mp4 = crop 1880x1058, thermal media/iwt.mp4 = crop of the 4:3 picture to fill).
// Raws: the source has no sound, so the cut sheet's six 30 s raws are kept as short breathing windows (6.5-8 s) where firefighters visibly
// work on the steel, under real wind / metal recordings (owner rule: silent footage -> real SFX). VO = one take, split only at the raws.
// Devices (new, dev/): HeightSheet (ride photo vs the NPS HAER elevation of the Statue of Liberty on one ground line), the Blender hand-turn
// model (20 of 30 gondolas lit, stepped one spacing at a time, each lit gondola going dark at the bottom), WheelClock (the rim as a dial,
// 6:20 -> 10:43).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { HeightSheet } from "../dev/TP10_HeightSheet";
import { WheelClock } from "../dev/TP10_WheelClock";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

// VO parts: [take a, take b, comp start]; raws sit between them
const VO: [number, number, number][] = [
  [0.0, 19.85, 4.0], [19.85, 41.05, 31.35], [41.05, 46.6, 60.55], [46.6, 57.2, 74.1], [57.2, 59.6, 91.2], [59.6, 62.6, 100.6], [62.6, 102.75, 110.1],
];
const DUR = F(151.2);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const IW = "iw.mp4", IT = "iwt.mp4";
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.7, vo: "The Wheel at ICON Park stands four hundred feet over International Drive", src: IW, from: 0.8, s0: 1.03, s1: 1.1, fx: 0.6, fy: 0.45,
    over: <RedLabel text="THE WHEEL, ICON PARK" at={F(0.5)} hold={F(2.8)} /> },
  { a: 7.7, b: 12.1, vo: "in Orlando, taller than the Statue of Liberty from its base to the torch. (HeightSheet)",
    node: <HeightSheet ride={{ src: GR + "wheel_day.jpg", iw: 1920, ih: 2387, top: 282, ground: 1696, cx: 880, feet: 400 }}
      ref2={{ src: GR + "haer_north2.jpg", iw: 1120, ih: 975, top: 15, ground: 970, cx: 625, feet: 290 }}
      rideLabel="400 FT" refLabel="STATUE OF LIBERTY" rideAt={2} refAt={F(5.36 - 3.7) - 6} lineAt={F(7.17 - 3.7) - 6} /> },
  { a: 12.1, b: 15.35, vo: "At about twenty past six on New Year's Eve 2022,", src: IW, from: 73.6, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5,
    over: <RedLabel text="DECEMBER 31, 2022" at={F(0.4)} hold={F(2.6)} /> },
  { a: 15.35, b: 19.05, vo: "it lost power with sixty-two people in twenty of its gondolas. (gondolas hanging over the lit park)", src: IW, from: 81.0, s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.45 },
  { a: 19.05, b: 23.85, vo: "One account had the power cutting out, then a shower of sparks above one gondola. (push onto a gondola's roof)", src: IW, from: 9.0, s0: 1.04, s1: 1.14, fx: 0.62, fy: 0.6 },
  // RAW1 23.85-31.35: A 26.5-34, a firefighter on the gondola's roof (wind)
  { a: 23.85, b: 31.35, vo: "RAW 1", src: IW, from: 26.5, s0: 1.0, s1: 1.06, fx: 0.55, fy: 0.4 },
  { a: 31.35, b: 33.95, vo: "That shape on the steel is a firefighter. (thermal: the white figure on the frame)", src: IT, from: 48.2, s0: 1.04, s1: 1.1, fx: 0.3, fy: 0.4 },
  { a: 33.95, b: 36.5, vo: "With no power, the wheel couldn't turn itself,", src: IW, from: 88.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 36.5, b: 39.6, vo: "so crews climbed the structure and turned it by hand. (figures on the ladder)", src: IW, from: 39.0, s0: 1.08, s1: 1.16, fx: 0.72, fy: 0.45 },
  { a: 39.6, b: 43.0, vo: "The fire department's special operations team trains on this wheel", src: IT, from: 52.5, s0: 1.02, s1: 1.08, fx: 0.35, fy: 0.45 },
  { a: 43.0, b: 46.3, vo: "about a dozen times a year, according to WKMG. (thermal from above)", src: IT, from: 105.2, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 46.3, b: 50.15, vo: "It had run this exact scenario only weeks before.", src: IW, from: 15.5, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.45 },
  { a: 50.15, b: 52.55, vo: "As each gondola came round, they opened it. (gondola at the platform, a firefighter beside it)", src: IW, from: 137.5, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.75 },
  // RAW2 52.55-60.55: thermal, two firefighters on top of a gondola
  { a: 52.55, b: 60.55, vo: "RAW 2", src: IT, from: 60.5, s0: 1.0, s1: 1.05, fx: 0.55, fy: 0.35 },
  { a: 60.55, b: 66.1, vo: "Turning it by hand meant one gondola at a time, each one worked round to the bottom before the next. (Blender)", src: "handturn.mp4", from: 0.1, s0: 1.0, s1: 1.1, fx: 0.5, fy: 0.75 },
  // RAW3 66.1-74.1: a gondola worked down to the platform
  { a: 66.1, b: 74.1, vo: "RAW 3", src: IW, from: 121.0, s0: 1.0, s1: 1.05, fx: 0.4, fy: 0.5 },
  { a: 74.1, b: 77.57, vo: "An observation wheel is the gentlest ride in any park, (the wheel lit at night)", src: GR + "wheel_night.jpg", still: true },
  { a: 77.57, b: 79.75, vo: "and still a bad place to be stuck. (thermal: a pod from above)", src: IT, from: 110.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 79.75, b: 83.0, vo: "It's built tall and built slow, and when the power goes,", src: IW, from: 205.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.55 },
  { a: 83.0, b: 84.7, vo: "both of those work against you.", src: IW, from: 44.0, s0: 1.06, s1: 1.1, fx: 0.6, fy: 0.5 },
  // RAW4 84.7-91.2: the gondolas still at height over the park
  { a: 84.7, b: 91.2, vo: "RAW 4", src: IW, from: 93.5, s0: 1.0, s1: 1.06, fx: 0.45, fy: 0.45 },
  { a: 91.2, b: 93.6, vo: "Hours in, they were still on the steel. (thermal: two figures on top of the rim)", src: IT, from: 215.0, s0: 1.06, s1: 1.12, fx: 0.55, fy: 0.3 },
  // RAW5 93.6-100.6: thermal, firefighters with a pod at the platform
  { a: 93.6, b: 100.6, vo: "RAW 5", src: IT, from: 151.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 100.6, b: 103.6, vo: "And the wheel, still standing dead over the park.", src: IW, from: 175.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  // RAW6 103.6-110.1: the rim and its gondolas over the lit city
  { a: 103.6, b: 110.1, vo: "RAW 6", src: IW, from: 192.0, s0: 1.0, s1: 1.06, fx: 0.4, fy: 0.6 },
  { a: 110.1, b: 115.6, vo: "Everyone was confirmed off at 10:43 that night, about four and a half hours after the outage. (WheelClock)",
    node: <WheelClock src={GR + "wheel_day.jpg"} iw={1920} ih={2387} rim={[945, 905, 645, 565]} h0={6 + 20 / 60} h1={10 + 43 / 60}
      sweepAt={F(0.4)} sweepLen={F(64.42 - 62.6) - F(0.4) + 6} label0="6:20 PM" label1="10:43 PM" label1At={F(64.17 - 62.6)} /> },
  { a: 115.6, b: 116.85, vo: "Nobody was injured. (a gondola at the platform)", src: IW, from: 181.0, s0: 1.05, s1: 1.08, fx: 0.4, fy: 0.6 },
  { a: 116.85, b: 118.9, vo: "The cause was never made public.", src: IT, from: 113.5, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 118.9, b: 123.4, vo: "The Wheel passed a state inspection and reopened in February 2023. (the wheel by day, from the street)", src: GR + "wheel_street.jpg", still: true,
    over: <RedLabel text="FEBRUARY 2023" at={F(74.49 - 71.4) - 4} /> },
  { a: 123.4, b: 127.35, vo: "ICON Park said the affected parts had been replaced and upgraded. (the gondola arm and frame, close)", src: IW, from: 5.0, s0: 1.08, s1: 1.16, fx: 0.4, fy: 0.45 },
  { a: 127.35, b: 131.95, vo: "It worked with the manufacturer, Intamin, and with outside engineers. (the hub, inset)",
    node: <Inset src={GR + "wheel_night.jpg"} still box={0.56} ar={16 / 9} pos="55% 38%" label="INTAMIN" labelAt={F(81.72 - 79.85) - 4} drift={0.1} /> },
  { a: 131.95, b: 134.95, vo: "It also added what it called supplemental safeguards.", src: IW, from: 169.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
  { a: 134.95, b: 138.85, vo: "As far as I know, nobody outside the company has said what those are.", src: IT, from: 217.8, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 138.85, b: 140.93, vo: "I'm sure they're very supplemental.", src: IW, from: 185.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 140.93, b: 145.6, vo: "This ride stranded sixty-two people for an evening, and the cause stayed private. (fire trucks below)", src: IW, from: 224.0, s0: 1.02, s1: 1.07, fx: 0.6, fy: 0.55 },
  { a: 145.6, b: 151.2, vo: "So the only people who can tell you it won't happen again are the ones selling the tickets. (the boarding platform)", src: IW, from: 142.0, s0: 1.03, s1: 1.1, fx: 0.45, fy: 0.7 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(23.85), kind: "blurDip", len: 12 },
  { at: F(60.55), kind: "blurDip", len: 12 },
  { at: F(66.1), kind: "blurDip", len: 12 },
  { at: F(74.1), kind: "blurDip", len: 12 },
  { at: F(84.7), kind: "blurDip", len: 12 },   // audit join (raw 4 cut out): half dip in ...
  { at: F(91.2), kind: "blurDip", len: 12 },   // ... half dip out = one dip at the join (same thermal/wide sources)
  { at: F(93.6), kind: "blurDip", len: 12 },
  { at: F(110.1), kind: "glitch", len: 8 },
  { at: F(118.9), kind: "blurDip", len: 12 },
  { at: F(127.35), kind: "whip", len: 10 },
];

const Still: React.FC<{ s: Sh }> = ({ s }) => {
  return <FilmLook_FX grain={0.08}><Shot_FX src={s.src!} n={F(s.b) - F(s.a)} still s0={s.s0 ?? 1.04} s1={s.s1 ?? 1.14} fx={s.fx ?? 0.5} fy={s.fy ?? 0.4} /></FilmLook_FX>;
};
const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.still) return <Still s={s} />;
  return <FilmLook_FX grain={0.08}><Shot_FX src={(s.src!.startsWith("case/") ? "" : GR) + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// the release is silent: each raw gets wind at height + metal where a firefighter is working the frame
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [7.75, "sfx_n2/whoosh_01.wav", -30],
  [23.9, X + "wind_gust_1.wav", -19], [27.6, X + "metal_clank_1.wav", -26],
  [52.6, X + "wind_gust_1.wav", -20], [54.4, X + "metal_clank_2.wav", -25], [57.3, X + "metal_clank_4.wav", -27],
  [60.6, "sfx_n2/whoosh_02.wav", -30],
  [61.0, X + "metal_clank_3.wav", -26], [62.3, X + "metal_clank_3.wav", -28], [63.6, X + "metal_clank_3.wav", -28], [64.9, X + "metal_clank_3.wav", -28],
  [66.15, X + "wind_gust_1.wav", -20], [69.0, X + "metal_clank_1.wav", -27],
  [84.75, X + "wind_gust_1.wav", -21],
  [93.65, X + "wind_gust_1.wav", -20], [96.4, X + "metal_clank_2.wav", -26],
  [103.65, X + "wind_gust_1.wav", -21],
  [110.05, "sfx_n2/glitch_03.wav", -28],
  [118.95, "sfx_n2/whoosh_02.wav", -30],
  [127.35, "sfx_n2/whoosh_03.wav", -30],
];

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="SIXTY-TWO ON THE WHEEL" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (−11.9 LUFS file -> −21.5 dB ≈ 10 LU under the VO); the raws are near-silent so the bed carries them */}
      <Sequence from={F(4.0)} durationInFrames={F(118.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} volume={(f) => dB(-21.5) * interpolate(f, [0, 30, F(116.0), F(118.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(118.0)} durationInFrames={F(151.2) - F(118.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20)} volume={(f) => dB(-21.5) * interpolate(f, [0, F(2.0), F(31.0), F(33.2)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed holds 3 (after the Blender explanation), 4 (after the 'gentlest ride' commentary) and 6 (near-dup; lone line between 5 and 6). 6 -> 3 holds (silent source).
const _cut = cutOut(CompFull, DUR, [[66.1, 74.1], [84.7, 91.2], [103.6, 110.1]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
