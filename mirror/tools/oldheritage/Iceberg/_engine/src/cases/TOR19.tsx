// Tornado #19: Elie, Manitoba (22 June 2007), Canada's only F5. Footage: Chris Hughes' drive on the Trans-Canada (xCI1u05KD_s, 854x480;
// its soundtrack after 0:18 is the car radio (DJ + adverts), so only 0:00-0:09 of its own sound is used; the silent debris window gets real
// SFX) and a resident's 2007 camera in Elie (u2dIDdA4YU0, 192x144, own sound: "it sounds like a freight train ... can you hear that?").
// The "it's ripping something up now" line (0:55) is left for the video's cold open (cut sheet INTRO) so it is not heard twice.
// Raws (3 Nov rule, incident moments only): H1 (Hughes, 8.3 s) and the main Roque raw (17.3 s); sound only via rawclean.py (guide 5b).
// Devices for THIS case: LoopTrace (follow-cam path on Sentinel-2: touchdown, highway, flour-mill loop, SW Elie), TwoViews (highway and
// town cameras side by side), ScaleRails (US vs Canada switch to the Enhanced Fujita scale; Elie on the old one). Stills: Justin Hobson's
// Commons photos (CC BY-SA 3.0 / CC BY 2.5). "Nineteen is the only F5..." is one sentence, so the count word stays in.
// Hughes black frames 25.93, 50.42 (avoided). Roque is a handheld 15 fps camera: its own jerks flag as JUMP in cutcheck (allowed, not cuts).
// Hughes source cuts: 74.9, 99.4, 101.5, 117.95, 120.4, 126.4, 130.3, 136.8, 146.85. Roque cuts: 11.36, 48.32, 60.09.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LoopTrace } from "../dev/TOR19_LoopTrace";
import { TwoViews } from "../dev/TOR19_TwoViews";
import { ScaleRails } from "../dev/TOR19_ScaleRails";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(116.95);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

const PATH: [number, number][] = [[432, 589], [470, 621], [519, 669], [569, 712], [608, 755], [658, 774], [693, 784], [698, 827], [683, 865], [683, 899], [737, 909], [792, 928], [801, 961], [816, 947], [841, 957], [858, 981], [851, 1009], [836, 1017], [818, 1005], [808, 981], [809, 1029], [814, 1096], [824, 1144], [838, 1173], [876, 1187], [945, 1187], [1004, 1175], [1034, 1173], [1044, 1153], [1062, 1152], [1074, 1163], [1084, 1158], [1089, 1175], [1064, 1180], [1059, 1194], [1044, 1221], [1004, 1245], [965, 1264], [917, 1290]];
const loop = (part: "A" | "B", n: number) => part === "A"
  ? <LoopTrace src={GR + "s2.jpg"} iw={2400} ih={1600} path={PATH} g0={0} g1={0.345} drawFrom={4} drawLen={n - 10} z={[2.1, 2.25]} start
      road={{ a: [380, 765], b: [1060, 966], at: 54 }} marks={[{ g: 0.262, label: "TRANS-CANADA HIGHWAY", pt: [760, 880], dy: -110 }]} />
  : <LoopTrace src={GR + "s2.jpg"} iw={2400} ih={1600} path={PATH} g0={0.345} g1={1} drawFrom={0} drawLen={n - 8} z={[2.25, 1.85]} start
      marks={[{ g: 0.5, label: "FLOUR MILL", pt: [830, 985], dy: -90 }, { g: 0.84, label: "ELIE", pt: [1150, 1120], dy: -80 }]} />;

// VO-A take 0-20.8 at 4.0 (+4.0) | VO-B take 20.9-38.3 at 33.1 (+12.2) | VO-C take 38.35-end at 68.2 (+29.85)
// 3 Nov (raws only at incident moments): H2 + H3 (5 s each, after explanation lines) removed; R1 + R2 merged into ONE main raw (roque src
// 30.5-47.8, contiguous inside one source segment, its rawclean wav runs 0-17.3) after "From the highway it was hanging right over the houses."
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.4, vo: "Nineteen is the only F5 Canada has ever officially had.", src: "hughes.mp4", from: 40.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 7.4, b: 11.1, vo: "It's Friday evening, the 22nd of June 2007.", src: "hughes.mp4", from: 13.0, s0: 1.06, s1: 1.11, fx: 0.45, fy: 0.5,
    over: <RedLabel text="JUNE 22, 2007" at={F(0.5)} hold={F(2.8)} /> },
  { a: 11.1, b: 14.5, vo: "Chris Hughes and the people in his car are driving to Alberta. (the car on the highway, side window)", src: "hughes.mp4", from: 112.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="CHRIS HUGHES" at={F(0.3)} hold={F(2.6)} /> },
  { a: 14.5, b: 20.4, vo: "At the western edge of Elie, Manitoba, in his words, the tornado appears right in front of them.", src: "hughes.mp4", from: 50.9, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="ELIE, MANITOBA" at={F(1.25)} hold={F(3.2)} /> },
  { a: 20.4, b: 24.6, vo: "It was early evening, and it would stay on the ground for about thirty-five minutes. (Hobson's photo of the early funnel)", src: GR + "hobson2.jpg", still: true, s0: 1.06, s1: 1.16, fx: 0.47, fy: 0.62 },
  // RAW H1 (24.6-32.9): Hughes' own car: "Oh, it's already down"
  { a: 24.6, b: 32.9, vo: "RAW: through the windshield, the funnel reaching the ground ahead", src: "hughes.mp4", from: 0.3, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 32.9, b: 38.27, vo: "Open prairie gives you nothing to measure it against until the debris turns up at the base.", src: "hughes.mp4", from: 63.5, s0: 1.04, s1: 1.14, fx: 0.42, fy: 0.75 },
  { a: 38.27, b: 41.43, vo: "It touched down north of the Trans-Canada Highway (path part A)", node: loop("A", F(41.43) - F(38.27)) },
  { a: 41.43, b: 43.05, vo: "and overturned semi-trailers. (semis on the highway by the tornado)", src: "hughes.mp4", from: 121.2, s0: 1.04, s1: 1.08, fx: 0.6, fy: 0.6 },
  { a: 43.05, b: 47.7, vo: "Then it looped over the town's flour mill and swung into the southwest edge of Elie. (path part B)", node: loop("B", F(47.7) - F(43.05)) },
  { a: 47.7, b: 50.7, vo: "From the highway it was hanging right over the houses. (two cameras side by side)",
    node: <TwoViews left={{ src: GR + "hughes.mp4", from: 70.0, label: "TRANS-CANADA HIGHWAY", ar: 16 / 9 }} right={{ src: GR + "roque.mp4", from: 25.5, label: "ELIE", ar: 4 / 3, pos: "50% 60%" }} labelAt={8} /> },
  // RAW (main, 50.7-68.0, 17.3 s): the resident in Elie, "I think it's still in the field ... all that black work ... it sounds like a freight train ... can you hear that?"
  { a: 50.7, b: 68.0, vo: "RAW: the tornado over the Elie houses", src: "roque.mp4", from: 30.5, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  // the 4:3 home camera is shown framed (fill) only for the main raw and once later; elsewhere a full-frame crop so the look does not repeat
  { a: 68.0, b: 71.28, vo: "It hung over Elie Street for about four minutes.", src: "roque.mp4", from: 14.2, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.55 },
  { a: 71.28, b: 76.4, vo: "Its path was only six kilometres long and never more than a hundred and fifty yards wide. (the thin funnel overhead)", src: "hughes.mp4", from: 147.6, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 76.4, b: 80.12, vo: "A house bolted to its foundation was lifted and broken apart. (debris at the base, among the houses)", src: "hughes.mp4", from: 92.0, s0: 1.08, s1: 1.16, fx: 0.55, fy: 0.75 },
  { a: 80.12, b: 82.61, vo: "Two others were nearly swept off theirs.", src: "roque.mp4", from: 21.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.62 },
  { a: 82.61, b: 84.88, vo: "A car ended up on a neighbour's roof.", src: "hughes.mp4", from: 96.5, s0: 1.12, s1: 1.18, fx: 0.55, fy: 0.75 },
  { a: 84.88, b: 87.82, vo: "Damage was put at about thirty-nine million dollars.", src: "hughes.mp4", from: 137.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 87.82, b: 89.81, vo: "It was first rated F4.", src: "hughes.mp4", from: 22.0, s0: 1.08, s1: 1.12, fx: 0.5, fy: 0.45 },
  { a: 89.81, b: 94.34, vo: "On the 18th of September 2007 it was upgraded to F5, (Hobson's photo, the funnel at the ground)", src: GR + "hobson1.jpg", still: true, s0: 1.04, s1: 1.14, fx: 0.55, fy: 0.55,
    over: <RedLabel text="SEPTEMBER 18, 2007" at={F(0.4)} hold={F(3.4)} /> },
  { a: 94.34, b: 99.3, vo: "after a closer look at the damage showed the destroyed homes had been well built and well secured. (the houses under it)", src: "roque.mp4", from: 4.0, fill: true, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 99.3, b: 106.6, vo: "Canada was still on the old Fujita scale ... It didn't switch until 2013. (the two rails)",
    node: <ScaleRails bg={GR + "hughes.mp4"} bgFrom={30.0} y0={2005} y1={2014}
      rails={[{ name: "UNITED STATES", sw: 2007.08, at: 82, label: "ENHANCED SCALE, FEB 2007" }, { name: "CANADA", sw: 2013.25, at: 185, label: "ENHANCED SCALE, APR 2013" }]}
      mark={{ t: 2007.47, label: "ELIE, JUNE 2007", at: 12 }} cam={[{ t: 2007.5, f: 0 }, { t: 2007.5, f: 140 }, { t: 2012.4, f: 192 }]} /> },
  { a: 106.6, b: 108.97, vo: "Nobody was hurt.", src: "hughes.mp4", from: 60.5, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 108.97, b: 113.54, vo: "From inside a car on that highway it looked almost calm, and that calm is the trap.", src: "hughes.mp4", from: 153.2, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 113.54, b: 116.95, vo: "A thin tornado can still be an F5.", src: "hughes.mp4", from: 26.5, s0: 1.06, s1: 1.14, fx: 0.5, fy: 0.4 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.4), kind: "blurDip", len: 10 },
  { at: F(20.4), kind: "blurDip", len: 12 },
  { at: F(32.9), kind: "blurDip", len: 12 },
  { at: F(38.27), kind: "glitch", len: 8 },
  { at: F(47.7), kind: "whip", len: 10 },
  { at: F(68.0), kind: "blurDip", len: 12 },
  { at: F(76.4), kind: "blurDip", len: 12 },
  { at: F(84.88), kind: "blurDip", len: 12 },
  { at: F(89.81), kind: "blurDip", len: 12 },
  { at: F(99.3), kind: "glitch", len: 10 },
  { at: F(106.6), kind: "blurDip", len: 12 },
  { at: F(113.54), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [38.25, "sfx_n2/glitch_03.wav", -28],
  [47.68, "sfx_n2/whoosh_02.wav", -30],
  [99.28, "sfx_n2/glitch_01.wav", -28],
];

const FadeOut: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="CANADA'S ONLY F5" bg={GR + "hughes_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(116.25)} layout="none"><FadeOut n={F(0.7)} /></Sequence>
      {/* VO: one take, split only where the two raws play */}
      <Sequence from={F(4.0)} durationInFrames={F(20.8)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={0} /></Sequence>
      <Sequence from={F(33.1)} durationInFrames={F(38.3) - F(20.9)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(20.9)} /></Sequence>
      <Sequence from={F(68.2)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} startFrom={F(38.35)} /></Sequence>
      {/* raws: own sound only through rawclean.py (guide 5b): Hughes' voices (0:00-0:09, before the radio), the Elie resident (levelled) */}
      <Sequence from={F(24.6)} durationInFrames={F(32.9) - F(24.6)} layout="none">
        <Audio src={staticFile(C + "media/rwH1_clean.wav")} startFrom={0} volume={(f) => dB(-3) * interpolate(f, [0, 5, F(8.3) - 16, F(8.3) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(50.7)} durationInFrames={F(17.3)} layout="none">
        <Audio src={staticFile(C + "media/rwR1_clean_lv.wav")} startFrom={0} volume={(f) => interpolate(f, [0, 5, F(17.3) - 16, F(17.3) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (case 18 = Music 4, case 20 = Music 5), low under H1, out under the main raw, back under the VO */}
      <Sequence from={0} durationInFrames={F(50.9)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(10)} volume={(f) => dB(-15) * interpolate(f, [0, 20, F(23.6), F(24.6), F(32.9), F(33.9), F(49.1), F(50.7)], [0, 1, 1, 0.12, 0.12, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(67.8)} durationInFrames={F(116.95) - F(67.8)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(60)} volume={(f) => dB(-15.5) * interpolate(f, [0, 14, F(116.95 - 67.8) - F(2.0), F(116.95 - 67.8)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
