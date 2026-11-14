// Amusement Parks Iceberg #07 (LEVEL 1, last case of the level) — Son of Beast, Kings Island, Mason, Ohio: the 9 Jul 2006 Rose Bowl
// accident (27 riders to hospital), the Dec 2006 state finding (a cracked "bent leg"), the loop removed, the 2009 closure, Banshee.
// Nothing of the accident was filmed outside TV packages (narrated case per the outline); YouTube's bot check blocked the personal
// off-ride / demolition clips all night, so the case runs on real Commons photos of the ride (ThrillZing 2000-2006, Jeremy Thompson
// 2001-2014, Library of Congress-era views) the one personal clip that came through (the lift hill's demolition, Nov 2012) and the real FOX19 story on the state report (14 Dec 2006). No raw: no incident clip.
// Devices: dev/AM07_FoldOpen (the report story), dev/AM07_BentLeg (the cracked upright), dev/AM07_LoopOut (the loop taken out).
// No 2006 rider and not the 2009 rider is named or shown. VO = one continuous take after the 4 s title card.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { FoldOpen } from "../dev/AM07_FoldOpen";
import { BentLeg } from "../dev/AM07_BentLeg";
import { LoopOut } from "../dev/AM07_LoopOut";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0;
const END = TC + 93.6; // last word 92.2 + hold
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; video?: boolean; from?: number; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; pan?: [number, number]; impacts?: { at: number; amt?: number; len?: number }[]; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 0.0, b: 4.8, vo: "When Son of Beast opened at Kings Island in Mason, Ohio, in April 2000, (the entrance sign, August 2000)", src: "sign.jpg", s0: 1.03, s1: 1.12, fx: 0.5, fy: 0.45,
    over: <RedLabel text="KINGS ISLAND · MASON, OHIO" at={F(1.3)} hold={F(3.0)} /> },
  { a: 4.8, b: 8.1, vo: "no wooden roller coaster on Earth had ever been bigger. (both hills and the loop from the tower, 2006)", src: "peaks.jpg", s0: 1.0, s1: 1.08, fx: 0.4, fy: 0.45 },
  { a: 8.1, b: 12.0, vo: "It stood 218 feet tall and hit 78 miles an hour, (up the lift hill)", src: "lift.jpg", s0: 1.25, s1: 1.3, fx: 0.6, fy: 0.5, panY: [160, -160] },
  { a: 12.0, b: 16.8, vo: "and it had a 118-foot vertical loop that no other wooden coaster had. (the park view, the loop between the hills)", src: "overview.jpg", s0: 1.25, s1: 1.45, fx: 0.48, fy: 0.42 },
  { a: 16.8, b: 19.3, vo: "That's a lot to ask of timber, isn't it? (the wall of timber)", src: "liftst.jpg", s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 19.3, b: 21.1, vo: "Trouble started almost right away. (the hill under a cloudy sky, 2001)", src: "cloudy.jpg", s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 21.1, b: 26.4, vo: "The park had fired the builder before construction was even finished, and I'd have had questions right there. (the structure over the station)", src: "loopP.jpg", s0: 1.02, s1: 1.12, fx: 0.5, fy: 0.4 },
  { a: 26.4, b: 29.9, vo: "Within weeks it shut so a rough stretch of track could be smoothed, (a train on the trestle, 2000)", src: "trestle.jpg", s0: 1.02, s1: 1.1, fx: 0.55, fy: 0.55 },
  { a: 29.9, b: 32.9, vo: "and complaints about how hard it hit people didn't stop. (riders on the trestle, 2002)", src: "riders.jpg", s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 32.9, b: 36.4, vo: "Then came the afternoon of July 9, 2006. (the hills through the woods)", src: "hills.jpg", s0: 1.02, s1: 1.1, fx: 0.55, fy: 0.5,
    over: <RedLabel text="JULY 9, 2006" at={F(1.6)} hold={F(1.8)} /> },
  { a: 36.4, b: 43.6, vo: "A train went into the Rose Bowl, a big wooden helix late in the ride, where a support under the track had failed and left a dip. (the helix with a train in it)", src: "helix.jpg", s0: 1.0, s1: 1.16, fx: 0.55, fy: 0.55,
    over: <RedLabel text="THE ROSE BOWL" at={F(1.1)} hold={F(2.6)} /> },
  { a: 43.6, b: 45.6, vo: "The train slammed straight through it. (a train past the supports, one jolt)", src: "supports.jpg", s0: 1.05, s1: 1.1, fx: 0.7, fy: 0.45, impacts: [{ at: F(44.17 - 43.6), amt: 0.7, len: 14 }] },
  { a: 45.6, b: 50.8, vo: "All 27 people on board were taken to the hospital, none with life-threatening injuries. (a full train on the lift, far)", src: "climb.jpg", s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.6 },
  { a: 50.8, b: 56.9, vo: "Ohio inspectors gave their answer that December. The wooden supports had never been designed to carry the ride's weight, (FoldOpen: FOX19)",
    node: <FoldOpen page={C + "shots/fox19_clean.png"} pw={2560} ph={1430} fold={505} bg={GR + "lattice.jpg"} openAt={F(1.0)} camAt={F(2.4)} focus={812} keep={[740, 880]} dimAt={F(2.9)} k0={0.62} k1={0.95} /> },
  { a: 56.9, b: 61.0, vo: "and one vertical timber, called a bent leg, had cracked under the load. (BentLeg)",
    node: <BentLeg src={GR + "lattice.jpg"} leg={[[948, 170], [948, 1040]]} crack={[0.52, 0.72]} legAt={F(57.15 - 56.9)} crackAt={F(59.68 - 56.9)} /> },
  { a: 61.0, b: 63.1, vo: "The park's fix was lighter trains. (the lighter blue trains)", src: "gtrains.jpg", s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.5 },
  { a: 63.1, b: 67.6, vo: "They couldn't handle the loop, so the loop came out, and in July 2007 (LoopOut)",
    node: <LoopOut src={GR + "loopV.jpg"} iw={1920} ih={2560} ring={{ cx: 1080, cy: 1240, rx: 232, ry: 770 }} traceAt={F(64.0 - 63.1)} outAt={F(65.18 - 63.1)} />,
    over: <RedLabel text="JULY 2007" at={F(66.1 - 63.1)} hold={F(1.3)} /> },
  { a: 67.6, b: 71.0, vo: "Son of Beast came back as just another tall wooden coaster. (the hill without its loop, 2009)", src: "y2009.jpg", s0: 1.02, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 71.0, b: 73.3, vo: "I think that's when it stopped being special. (far off beside the drop tower)", src: "droptower.jpg", s0: 1.0, s1: 1.06, fx: 0.45, fy: 0.6 },
  { a: 73.3, b: 77.4, vo: "It didn't last. In June 2009 a woman told the park she'd had a burst vessel in her brain (the ride's structure from the path)", src: "early.jpg", s0: 1.02, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="JUNE 2009" at={F(1.4)} hold={F(2.2)} /> },
  { a: 77.4, b: 81.6, vo: "after a ride, and Kings Island closed it that day. (the entrance sign coming down, Aug 2009)", src: "signs09.jpg", s0: 1.02, s1: 1.1, fx: 0.3, fy: 0.45 },
  { a: 81.6, b: 84.6, vo: "The state found nothing wrong with the ride, but it never ran again. (the empty structure)", src: "y2003b.jpg", s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 84.6, b: 88.4, vo: "The lift hill came down in November 2012, (the real demolition: the lift hill falls; personal clip, silent under the VO, makers' bug cropped out)", src: "demo.mp4", video: true, from: 1.3, s0: 1.02, s1: 1.06, fx: 0.45, fy: 0.5,
    over: <RedLabel text="NOVEMBER 2012" at={F(1.0)} hold={F(1.8)} /> },
  { a: 88.4, b: END - TC, vo: "and Banshee, a steel coaster, opened on the same ground in 2014. (the Son of Beast marker beside Banshee, 2000-2009)", src: "grave.jpg", s0: 1.02, s1: 1.14, fx: 0.4, fy: 0.5,
    over: <RedLabel text="BANSHEE · 2014" at={F(1.5)} hold={F(2.4)} /> },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(TC + 50.8), kind: "blurDip", len: 12 },
  { at: F(TC + 56.9), kind: "blurDip", len: 12 },
  { at: F(TC + 73.3), kind: "glitch", len: 10 },   // 2007 -> 2009: the closure section
];

const SFX: [number, string, number, number?][] = [
  [TC - 0.05, "sfx_n2/glitch_03.wav", -24],
  [TC + 44.15, "sfx_n2/real/impact_2.wav", -16],
  [TC + 44.15, "sfx_n2/real/metal_clank_2.wav", -24],
  [TC + 50.75, "sfx_n2/real/paper_3.wav", -22],
  [TC + 59.66, "sfx_n2/real/impact_4.wav", -24],
  [TC + 73.25, "sfx_n2/glitch_02.wav", -27],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => (
  <FilmLook_FX grain={0.08}>{s.node ?? <Shot_FX src={GR + s.src!} still={!s.video} from={s.from} fill={s.fill} n={F(s.b) - F(s.a)} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} pan={s.pan} impacts={s.impacts} />}</FilmLook_FX>
);

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="SON OF BEAST" bg={GR + "lattice.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(TC + s.a)} durationInFrames={F(TC + s.b) - F(TC + s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(TC + 92.4)} layout="none"><FadeBlack len={F(END - TC - 92.4)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 1 (-18.4 LUFS file) at -15 dB */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(6)} volume={(f) => dB(-15) * interpolate(f / 30, [0, 1.2, END - 1.6, END], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
