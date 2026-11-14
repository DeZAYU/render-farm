// Workplace #20 — Lakeland Mills sawmill, Prince George, B.C., night of 23 Apr 2012 (~9:40 p.m.): a wood-dust explosion, then fire;
// Alan Little and Glenn Roche died, 22 injured. Footage (small personal uploaders, own sound, no music found by rawclean):
// LM = DANGLER76 (tEXYeYTvM5M, 720p, near the yard behind the light poles; the filmer's "Whoa, did you see that?" ~31.5 s),
// KP = KilrPilr (DzYyZoO9mkg, 640x480, the burning mill among the city lights from the cutbanks). VO = one take (CASE20.mp3), split twice.
// R1 = LM src 1.5-13.0 (the wall of flame, sirens), R2 = LM src 26.5-34.0 (the flare-up and the filmer's reaction).
// Blender (build/CASE20/maps/dust3d.py): haze (dust hanging in a lit mill hall), chain (first flash -> dust shaken off the beams ->
// secondary flame front). Devices: FlashMatch (level one's grain-dust flash irises into Lakeland's fire), WestLine (Blue Marble plate,
// Prince George -> Burns Lake, Babine). Level-one clip = WP01's graded source (cptnwiz, fmrxFcTTv-c) src 113-116.2.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, Still, F, cl } from "../dev/WP45_kit";
const HOLD = 166;
import { FlashMatch } from "../dev/WP20_FlashMatch";
import { WestLine } from "../dev/WP20_WestLine";
import { HAZE, CHAIN } from "../dev/WP20_blLabels";

const C = "case/", LM = C + "graded/lm.mp4", KP = C + "graded/kp.mp4";
const dB = (d: number) => Math.pow(10, d / 20);
const END = 89.2;
export const DUR = F(END);

// timeline (s): title 0-4 | VO 1 (take 0-12.19) @4.0 | R1 16.19-27.69 (LM 1.5-13.0) | VO 2 (take 12.19-18.31) @27.69 (+15.5) |
// R2 33.81-41.31 (LM 26.5-34.0) | VO 3 (take 18.31-end) @41.31 (+23.0), VO ends 88.4, hold to 89.2
const PART: [number, number, number | null][] = [[4.0, 0, 12.19], [27.69, 12.19, 18.31], [41.31, 18.31, null]];
const RAWS: [number, number, number, number][] = [[16.19, 27.69, 1.5, -4], [33.81, 41.31, 26.5, -3]]; // a, b, src s, gain dB
const v2 = (t: number) => t + 15.5, v3 = (t: number) => t + 23.0;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.93, vo: "Lakeland Mills, Prince George, British Columbia. April 2012. (KP: the mill burning among the city lights)",
    node: (n) => <><Clip src={KP} from={3.0} n={n} s0={1.04} s1={1.14} fx={0.42} fy={0.45} />
      <RedLabel text="LAKELAND MILLS · PRINCE GEORGE, B.C." at={6} hold={F(1.9)} size={44} /><RedLabel text="APRIL 23, 2012" at={F(2.65)} hold={F(1.1)} size={44} /></> },
  { a: 7.93, b: 12.47, vo: "It happened at night. According to the widow of one of the men, they were working the third shift. (KP: push in on the mill)",
    node: (n) => <Clip src={KP} from={12.0} n={n} s0={1.2} s1={1.45} fx={0.36} fy={0.4} /> },
  { a: 12.47, b: 16.19, vo: "An explosion tore through the sawmill, and then the buildings caught fire. (LM: the flames behind the light poles)",
    node: (n) => <Clip src={LM} from={34.5} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: 16.19, b: 27.69, vo: "RAW 1: the wall of flame over the yard, sirens (LM src 1.5-13.0)",
    node: (n) => <Clip src={LM} from={1.5} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.45} /> },
  { a: 27.69, b: v2(15.44), vo: "Two workers, Alan Little and Glenn Roche, never came home. (LM)",
    node: (n) => <><Clip src={LM} from={21.8} n={n} s0={1.1} s1={1.02} fx={0.5} fy={0.5} />
      <RedLabel text="ALAN LITTLE · GLENN ROCHE" at={F(1.0)} hold={F(2.0)} size={42} /></> },
  { a: v2(15.44), b: 33.81, vo: "Twenty two others were injured, many of them seriously. (KP, slowed)",
    node: (n) => <Clip src={KP} from={25.0} n={n} rate={0.7} s0={1.1} s1={1.2} fx={0.38} fy={0.42} /> },
  { a: 33.81, b: 41.31, vo: "RAW 2: the fire flares, 'Whoa, did you see that?' (LM src 26.5-34.0)",
    node: (n) => <Clip src={LM} from={26.5} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.45} /> },
  { a: 41.31, b: v3(25.23), vo: "WorkSafeBC ... concluded the blast came from wood dust hanging in the air. (Blender haze)",
    node: () => <BlenderShot src={C + "maps/haze.mp4"} track={HAZE} labels={[["haze", "WOOD DUST", 24, 80, 0.06]]} /> },
  { a: v3(25.23), b: v3(29.16), vo: "It was the same kind of flash as the grain dust under the tank on level one. (FlashMatch)",
    node: (n) => <FlashMatch a={C + "graded/wp01.mp4"} aFrom={1.6} aRate={0.5} aAR={608 / 1080} flashAt={78} spot={[0.45, 0.84]}
      b={LM} bFrom={38.4} n={n} label="LEVEL ONE · SWITZ CITY, INDIANA" /> },
  { a: v3(29.16), b: v3(36.67), vo: "OSHA warns that a first explosion can throw settled dust back into the air ... secondary explosions. (Blender chain)",
    node: (n) => <>
      <Sequence durationInFrames={HOLD} layout="none"><BlenderShot src={C + "maps/chain.mp4"} track={CHAIN} labels={[["beam", "SETTLED DUST", 8, 40, -0.06]]} /></Sequence>
      <Sequence from={HOLD} layout="none"><Still src={C + "maps/chain.mp4"} t={(HOLD - 1) / 30} n={n - HOLD} s0={1.0} s1={1.05} fx={0.5} fy={0.55} /></Sequence></> }, // hold the flame front before it fills the hall
  { a: v3(36.67), b: v3(46.39), vo: "Lakeland was the second fatal sawmill dust explosion in the province that year. Three months earlier, at Babine ... (WestLine)",
    node: (n) => <WestLine plate={C + "graded/bc.jpg"} pw={1920} ph={1068} a={[1473, 609]} b={[477, 433]} pan={[F(40.78 - 36.67), F(40.78 - 36.67) + 75]}
      bOn={F(42.11 - 36.67)} n={n} labA="LAKELAND MILLS · PRINCE GEORGE" labB="BABINE FOREST PRODUCTS · BURNS LAKE" labB2="JANUARY 20, 2012" /> },
  { a: v3(46.39), b: v3(51.92), vo: "WorkSafeBC imposed more than seven hundred thousand dollars in penalties and recommended charges. (KP)",
    node: (n) => <Clip src={KP} from={30.0} n={n} s0={1.02} s1={1.12} fx={0.4} fy={0.45} /> },
  { a: v3(51.92), b: v3(57.6), vo: "None were approved, because prosecutors expected Lakeland to succeed with a due diligence defence. (LM)",
    node: (n) => <Clip src={LM} from={39.4} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v3(57.6), b: END, vo: "After Babine, nobody running a sawmill ... and that defence was still expected to work. (KP: slow pull out)",
    node: (n) => <Clip src={KP} from={52.0} n={n} s0={1.3} s1={1.0} fx={0.38} fy={0.42} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.93), kind: "blurDip", len: 12 },      // same KP camera, later and pushed in
  { at: F(16.19), kind: "blurDip", len: 12 },     // VO -> raw 1 (same camera, earlier)
  { at: F(27.69), kind: "blurDip", len: 14 },     // raw 1 -> VO (same camera, later)
  { at: F(33.81), kind: "blurDip", len: 12 },     // -> raw 2
  { at: F(41.31), kind: "glitch", len: 10 },      // raw 2 -> Blender hall
  { at: F(v3(25.23)), kind: "blurDip", len: 12 }, // -> level one
  { at: F(v3(29.16)), kind: "blurDip", len: 12 }, // -> Blender chain
  { at: F(v3(36.67)), kind: "blurDip", len: 12 }, // -> plate
  { at: F(v3(46.39)), kind: "blurDip", len: 12 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE MILL AT NIGHT" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean.py output (no music found), never under the VO */}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/lm_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* Blender chain: a low real boom as the flame front runs through the hall (shot frame ~110) */}
      <Sequence from={F(v3(29.16)) + 108} durationInFrames={F(3.5)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={(f) => dB(-14) * interpolate(f, [0, 70, 105], [1, 1, 0], cl)} /></Sequence>
      {/* music: Epidemic ambient Music 1 (-18 LUFS file) at -16 dB, out under both raws */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(100)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0), 1);
          return dB(-16) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
