// Amusement Parks Iceberg #14 (LEVEL 3, case 3): the New Texas Giant fall, Six Flags Over Texas, Arlington, Texas, Fri 19 Jul 2013.
// No filmed material of the event exists outside TV (outline: never TV news of the scene), and the extra ride clips found on small
// channels hit YouTube's bot check (not bypassed; listed in NOTES.md). So the case runs on real photos: Martin Lewison's set of the ride
// closed after the death (16 Aug 2013, CC BY-SA 2.0), the original wooden Texas Giant (2004/2007), the 2010 rebuild, the park's 2011
// photo, the ride in 2023/2025 (Jeremy Thompson / Martin Lewison), and the real NBC DFW story of the cross-claims (6 Mar 2014).
// VO = one take (vor/CASE14.mp3, 92.46 s), no count word, no raws (no clip sound exists), so it runs unbroken from 4.0 s.
// Handle with care: the death said once, no landing detail, her name + age only, claims as "claimed", settled with no fault.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { DropAngle } from "../dev/AM14_DropAngle";
import { SteelSkin } from "../dev/AM14_SteelSkin";
import { StandUpClaims } from "../dev/AM14_StandUpClaims";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const O = 4.0;                  // VO t=0 on the timeline (after the title card)
const T = (t: number) => O + t; // VO time -> timeline
const END = T(92.46) + 1.3;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

const Dim: React.FC<{ a: number; to: number }> = ({ a, to }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [a, a + 60], [0, to], cl) }} />;
};

// a / b in VO seconds
const SHOTS: Sh[] = [
  { a: 0.00, b: 3.85, vo: "The first drop on the New Texas Giant falls 147 feet (a guest's 2011 off-ride clip: a train over the top and down the first drop)", src: "oc3.mp4", from: 0.7, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.4,
    over: <RedLabel text="NEW TEXAS GIANT" at={F(0.9)} hold={F(2.4)} /> },
  { a: 3.85, b: 8.60, vo: "at 79 degrees, which is about as close to a wall as I'd ever want to ride. (DropAngle on the side view)",
    node: <DropAngle src={GR + "n05.jpg"} iw={1920} ih={1440} deg={79} len={430} base={[0.333, 0.53]} focus={[0.31, 0.36]}
      rail={[[0.215, 0.098], [0.245, 0.112], [0.268, 0.145], [0.282, 0.2], [0.291, 0.27], [0.298, 0.34], [0.305, 0.41], [0.316, 0.49], [0.33, 0.55], [0.352, 0.595], [0.383, 0.628], [0.423, 0.663], [0.475, 0.7], [0.53, 0.733]]}
      at={{ trace: 0, angle: 8, spot: 84 }} /> },
  { a: 8.60, b: 11.65, vo: "The Six Flags Over Texas ride opened in 1990 (the original wooden lift, 2004)", src: "old_lift.jpg", s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.35,
    over: <RedLabel text="SIX FLAGS OVER TEXAS" at={F(0.5)} hold={F(2.2)} /> },
  { a: 11.65, b: 13.74, vo: "as the world's tallest wooden coaster, (the wooden structure, 2007)", src: "old_3988.jpg", s0: 1.08, s1: 1.14, fx: 0.62, fy: 0.45 },
  { a: 13.74, b: 15.43, vo: "and in 2011 it came back (the rebuild, 2010)", src: "constr.jpg", s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.4 },
  { a: 15.43, b: 18.75, vo: "as a hybrid, wood underneath and steel track on top. (SteelSkin)",
    node: <SteelSkin src={GR + "track.jpg"} wood={C + "shots/track_wood_a.png"} steel={C + "shots/track_steel_a.png"} iw={1920} ih={1440} woodAt={F(16.04 - 15.43)} steelAt={F(17.06 - 15.43)} focus={[0.5, 0.52]} /> },
  { a: 18.75, b: 21.65, vo: "On the evening of July 19, 2013, (the ride from above, 2011)", src: "zvi.mp4", from: 2.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45,
    over: <RedLabel text="JULY 19, 2013" at={F(1.0)} hold={F(1.8)} /> },
  { a: 21.65, b: 25.80, vo: "Rosa Esparza, 52, from Dallas, got on with her family. (the station, 2013)", src: "station.jpg", s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.55,
    over: <RedLabel text="ROSA ESPARZA, 52" at={F(0.15)} hold={F(2.4)} /> },
  { a: 25.80, b: 31.26, vo: "Witnesses said she was worried before the train left the station, because her lap bar didn't feel right. (2012 clip: the station, riders boarding under the lap bars)", src: "ieq.mp4", from: 1.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 31.26, b: 32.82, vo: "The train climbed anyway. (a rider's 2012 POV up the lift hill)", src: "tpc.mp4", from: 0.5, s0: 1.02, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 32.82, b: 37.28, vo: "About a minute in, on that first steep descent, she came out of her seat and fell. (the drop and the turns, slow push, darkening)", src: "n08.jpg", s0: 1.02, s1: 1.12, fx: 0.3, fy: 0.45,
    over: <Dim a={F(2.0)} to={0.45} /> },
  { a: 37.28, b: 39.64, vo: "The medical examiner ruled it an accident. (the ride standing still, Aug 2013)", src: "n07.jpg", s0: 1.03, s1: 1.07, fx: 0.4, fy: 0.5 },
  { a: 39.64, b: 41.28, vo: "The ride closed that night. (the empty track, the station under tarps)", src: "n02.jpg", s0: 1.04, s1: 1.08, fx: 0.4, fy: 0.55 },
  { a: 41.28, b: 44.61, vo: "In September, Six Flags said mechanical failure wasn't to blame, (the entrance, closed, Aug 2013)", src: "closed.jpg", s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.3 },
  { a: 44.61, b: 47.48, vo: "though it never published an internal report. (the closed queue and track)", src: "n03.jpg", s0: 1.03, s1: 1.09, fx: 0.6, fy: 0.5 },
  { a: 47.48, b: 52.71, vo: "The coaster reopened with redesigned lap bar pads and seat belts, which it hadn't had before. (the ride running again, 2023)", src: "road2023.jpg", s0: 1.0, s1: 1.08, fx: 0.62, fy: 0.4,
    over: <RedLabel text="REOPENED · SEPT. 14, 2013" at={F(0.6)} hold={F(2.8)} /> },
  { a: 52.71, b: 57.58, vo: "Her family sued in October, and whose fault it was depends on which filing you read. (the lift and the station roof)", src: "n06.jpg", s0: 1.02, s1: 1.09, fx: 0.35, fy: 0.45 },
  { a: 57.58, b: 80.62, vo: "Six Flags claimed ... Gerstlauer claimed ... deposition ... asked in writing for no seat belts ... (StandUpClaims: the NBC DFW story)",
    node: <StandUpClaims page={C + "shots/nbcg_crop.png"} pw={1830} ph={1730} bg={GR + "n09.jpg"}
      strips={[
        { y0: 1415, y1: 1525, up: F(0.7), down: F(62.67 - 57.58) },           // "Six Flags has blamed the death on a dangerous, defective ride."
        { y0: 750, y1: 855, up: F(62.9 - 57.58), down: F(65.6 - 57.58) },      // "Gerstlauer ... said the park is solely to blame"
        { y0: 1025, y1: 1135, up: F(65.9 - 57.58), down: F(70.08 - 57.58) },   // "Six Flags failed to exercise reasonable care ... operators"
        { y0: 1195, y1: 1360, up: F(70.3 - 57.58), down: F(74.02 - 57.58) },   // employees: "a button that could have stopped ... not pressed"
        { y0: 1585, y1: 1700, up: F(74.3 - 57.58), near: 1 },                  // "expressly designed and specified in writing that there be no seat belts"
      ]}
      keys={[{ at: 0, y: 420 }, { at: F(1.2), y: 1300 }, { at: F(62.67 - 57.58), y: 1300 }, { at: F(63.4 - 57.58), y: 820 }, { at: F(65.6 - 57.58), y: 840 }, { at: F(66.4 - 57.58), y: 1080 },
        { at: F(70.0 - 57.58), y: 1090 }, { at: F(70.8 - 57.58), y: 1260 }, { at: F(74.0 - 57.58), y: 1270 }, { at: F(74.9 - 57.58), y: 1650 }, { at: F(80.62 - 57.58), y: 1665 }]}
      rule={{ x0: 134, x1: 348, y: 1694, strip: 4, at: F(77.36 - 57.58) }} /> },
  { a: 80.62, b: 84.47, vo: "I'd have liked to see that argued in front of a jury. It never got that far. (the overbank behind the park's buildings)", src: "overbank.jpg", s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.3 },
  { a: 84.47, b: 88.55, vo: "In November 2014, weeks before trial, all three sides settled (the ride from above, 2011)", src: "zvi.mp4", from: 30.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="NOVEMBER 2014" at={F(0.5)} hold={F(2.2)} /> },
  { a: 88.55, b: 92.46 + 1.3, vo: "on undisclosed terms, and nobody was ever found at fault. (2011: a train down the drop; fade)", src: "oc3.mp4", from: 14.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(O), kind: "glitch", len: 10 },            // title card -> the case
  { at: F(T(18.75)), kind: "blurDip", len: 12 },   // ride history -> the evening of the 19th
  { at: F(T(39.64)), kind: "blurDip", len: 12 },   // the death -> the closed ride
  { at: F(T(57.58)), kind: "blurDip", len: 14 },   // into the filings
  { at: F(T(80.62)), kind: "blurDip", len: 12 },   // out of the filings
];

const SFX: [number, string, number][] = [
  [O - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(57.5), "sfx_n2/whoosh_02.wav", -26],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={!s.src!.endsWith(".mp4")} from={s.from} n={F(s.b) - F(s.a)} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(O)} layout="none"><AbsoluteFill><TitleCard dur={F(O)} title="THE NEW TEXAS GIANT" bg={GR + "n04.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END - 1.1)} layout="none"><FadeBlack len={F(1.1)} /></Sequence>
      {/* VO: one unbroken take */}
      <Sequence from={F(O)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3, ~-19 dB (≈10 LU under the VO) */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} volume={(f) => dB(-19) * interpolate(f / 30, [0, 1.5, END - 2.2, END], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
