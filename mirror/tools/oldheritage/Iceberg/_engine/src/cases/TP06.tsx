// Theme Park #06 — The Flying Dinosaur, Universal Studios Japan, 1 May 2018: a sensor stops both trains, 64 riders held face-down for up
// to two hours. Footage: the guest's own clip (9Z-h4JG3e0g: the lift hill across the lagoon, the stopped train; its sound is added music,
// so no clip audio is used and the cut sheet's four 28 s raws are folded into VO shots — nothing on screen happens in them that sound
// would carry). One Commons photo of the ride running (Christophe95, CC BY-SA 4.0) shows the normal flying position.
// Devices (new, case-specific): PoseFlip (the real flying position + a line profile of a seat tipping a rider face-down), HoldBars
// (2 min designed hold vs ~2 hours, one minute axis, two mounts), WalkwayTrace (freeze, brackets on the train, the walkway traced),
// StopCount (four stops, 2016 -> 2018). Source: no cuts except 44.67 (avoided).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { PoseFlip } from "../dev/TP06_PoseFlip";
import { HoldBars } from "../dev/TP06_HoldBars";
import { WalkwayTrace } from "../dev/TP06_WalkwayTrace";
import { StopCount } from "../dev/TP06_StopCount";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TOTAL = 98.2, END = 97.0;
const DUR = F(TOTAL);
const V = GR + "fd.mp4";

type Sh = { a: number; b: number; vo: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
// VO: one take, split only at the two raws (3 Nov rule: no lone line between raws): A 0-31.3 @4.0 | B-D 31.45-56.45 @41.5 | E 56.6-end @72.85
const SHOTS: Sh[] = [
  { a: 4, b: 8, vo: "English headlines called this an upside-down coaster, and that's not quite it.", from: 2.0, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.3 },
  { a: 8, b: 11.75, vo: "The Flying Dinosaur is a coaster at Universal Studios Japan.", from: 62.0, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.6,
    over: <RedLabel text="UNIVERSAL STUDIOS JAPAN, OSAKA" at={F(0.6)} hold={F(2.8)} /> },
  { a: 11.75, b: 19.15, vo: "Riders are locked into harnesses and tipped forward, so they fly face-down under the track ... (photo of the ride running + seat profile tipping)",
    node: <PoseFlip src={V} from={0} still={GR + "flyer.jpg"} pos="55% 45%" zoom={1.25} tipAt={F(1.9)} tipLen={34} /> },
  { a: 19.15, b: 20.65, vo: "That's the normal position. (the riders on the stopped train)", from: 50.0, s0: 1.7, s1: 1.8, fx: 0.62, fy: 0.3 },
  { a: 20.65, b: 24.4, vo: "At about quarter to five on Tuesday the 1st of May 2018,", from: 70.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MAY 1, 2018" at={F(0.8)} hold={F(2.6)} /> },
  { a: 24.4, b: 26.95, vo: "a safety sensor stopped both trains.", from: 80.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 26.95, b: 30.5, vo: "Sixty-four people stayed in that position near the top of the track.", from: 92.5, s0: 1.45, s1: 1.6, fx: 0.62, fy: 0.3 },
  { a: 30.5, b: 32.45, vo: "They were twenty to thirty metres up.", from: 100.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 32.45, b: 35.3, vo: "One train had stopped almost at the end of the course. (the far end of the layout, right)", from: 75.0, s0: 1.5, s1: 1.6, fx: 0.92, fy: 0.75 },
  { a: 41.3, b: 47.8, vo: "The ride is designed to hold you like that for a couple of minutes, which is exactly why holding it any longer is the problem. (HoldBars 1)",
    node: <HoldBars bg={V} bgFrom={84} rideAt={F(1.8)} longAt={F(3.6)} longLen={60} /> },  // single mount: the red ~2 h bar runs on "any longer"
  { a: 47.8, b: 52.85, vo: "Staff reached them along a maintenance walkway beside the track and brought them off one by one. (WalkwayTrace)",
    node: <WalkwayTrace src={V} from={30.0} freezeAt={12} box={[0.55, 0.45, 0.12, 0.19]} path={[[0.435, 0.70], [0.5, 0.575], [0.56, 0.465], [0.625, 0.345], [0.665, 0.338]]} traceAt={F(1.5)} traceLen={F(2.4)} focus={[0.58, 0.45]} /> },
  { a: 52.85, b: 61.29, vo: "SoraNews24 counted this as the ride's fourth emergency stop since it opened in 2016. Four, in two years. (StopCount)",
    node: <StopCount src={V} from={104.0} marks={[F(1.6), F(2.1), F(2.6), F(3.2)]} s0={1.0} s1={1.12} fx={0.6} fy={0.35} /> },
  { a: 61.29, b: 64.17, vo: "One earlier stop was a rider holding a phone.", from: 20.0, s0: 1.8, s1: 1.9, fx: 0.62, fy: 0.25 },
  { a: 64.17, b: 66.65, vo: "Another was a child who'd wandered under the track. (under the structure)", from: 12.0, s0: 1.3, s1: 1.4, fx: 0.6, fy: 0.85 },
  { a: 72.65, b: 75.91, vo: "The last passenger spent about two hours in the air. (slow push on the stopped train; HoldBars shown once only, 3 Nov rule)", from: 58.0, s0: 1.3, s1: 1.55, fx: 0.62, fy: 0.3 },
  { a: 75.91, b: 77.2, vo: "None of them were hurt.", from: 40.0, s0: 1.06, s1: 1.1, fx: 0.55, fy: 0.4 },
  { a: 77.2, b: 82.1, vo: "The park said a protective mechanism had kicked in because of an irregularity in the system.", from: 108.0, s0: 1.2, s1: 1.4, fx: 0.62, fy: 0.3 },
  { a: 82.1, b: 84.65, vo: "Then it never said what the irregularity was. (the photo of the ride, white frame)",
    node: <Inset src={GR + "flyer.jpg"} still box={0.56} ar={4 / 3} drift={0.08} /> },
  { a: 84.65, b: 87.23, vo: "That's a very polished way of explaining nothing.", from: 9.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 87.23, b: 90.93, vo: "The park apologised, and the ride was running again later that day,", from: 66.0, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.5 },
  { a: 90.93, b: 93.19, vo: "with some people queuing back up for it.", from: 24.5, s0: 1.08, s1: 1.14, fx: 0.55, fy: 0.55 },
  { a: 93.19, b: TOTAL, vo: "If I get stuck on a coaster, I'm hoping it's one with a seat.", from: 95.0, s0: 1.25, s1: 1.0, fx: 0.6, fy: 0.35 },
];

// RAWS at the cut sheet's four ▶ RAW cues (picture only: the clip's sound is a music track; rawclean --force still left the song's
// vocal stem, so no clip audio is used — a quiet real wind bed instead). Two 6 s holds on the stopped train (3 Nov: no raw under ~5 s,
// no lone VO line between raws: cue 3's 4.9 s stretch is merged, cues 2 and 3 folded into one VO run).
const RAWS: [number, number, number, number, number][] = [[35.3, 41.3, 14.5, 0.62, 0.3], [66.65, 72.65, 86.4, 0.6, 0.35]];
SHOTS.push(...RAWS.map(([a, b, from, fx, fy]) => ({ a, b, vo: "RAW (picture)", from, s0: 1.35, s1: 1.5, fx, fy })));

const CUTS: FxCut[] = [
  { at: F(4), kind: "glitch", len: 10 },
  { at: F(8), kind: "blurDip", len: 12 },
  { at: F(11.75), kind: "blurDip", len: 12 },
  { at: F(19.15), kind: "blurDip", len: 12 },
  { at: F(20.65), kind: "blurDip", len: 12 },
  { at: F(24.4), kind: "blurDip", len: 12 },
  { at: F(26.95), kind: "blurDip", len: 12 },
  { at: F(30.5), kind: "blurDip", len: 12 },
  { at: F(32.45), kind: "blurDip", len: 12 },
  { at: F(35.3), kind: "blurDip", len: 12 },
  { at: F(41.3), kind: "glitch", len: 8 },
  { at: F(47.8), kind: "blurDip", len: 12 },
  { at: F(52.85), kind: "blurDip", len: 12 },
  { at: F(61.29), kind: "blurDip", len: 12 },
  { at: F(64.17), kind: "blurDip", len: 12 },
  { at: F(66.65), kind: "blurDip", len: 12 },
  { at: F(72.65), kind: "whip", len: 10 },
  { at: F(75.91), kind: "blurDip", len: 12 },
  { at: F(77.2), kind: "blurDip", len: 12 },
  { at: F(82.1), kind: "blurDip", len: 12 },
  { at: F(84.65), kind: "blurDip", len: 12 },
  { at: F(87.23), kind: "blurDip", len: 12 },
  { at: F(90.93), kind: "blurDip", len: 12 },
  { at: F(93.19), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={V} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [13.7, X + "metal_clank_1.wav", -30],   // the seat locks and tips (PoseFlip)
  [41.25, "sfx_n2/glitch_03.wav", -28],
  [48.2, X + "camera_shutter_2.wav", -28], // the freeze
  [72.6, "sfx_n2/whoosh_02.wav", -30],
];
const VO: [number, number, number][] = [[4.0, 0.0, 31.3], [41.5, 31.45, 56.45], [72.85, 56.6, 81.0]];
const Fade: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="TWO HOURS FACE-DOWN" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><Fade n={F(TOTAL) - F(END)} /></Sequence>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} startFrom={F(a)} /></Sequence>)}
      {RAWS.map(([a, b], i) => <Sequence key={"w" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} loop volume={(f) => dB(-30) * interpolate(f, [0, 10, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} /></Sequence>)}
      {/* music: Epidemic ambient Music 3 from 40 s (a different bed and offset from the neighbouring cases) */}
      <Sequence from={F(4.0)} durationInFrames={F(TOTAL) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} volume={(f) => dB(-19) * interpolate(f, [0, 30, F(END - 4.0), F(TOTAL - 4.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed the second picture hold (after the earlier-stops history = explanation). 2 -> 1 hold.
const _cut = cutOut(CompFull, DUR, [[66.65, 72.65]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
