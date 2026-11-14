// Theme Park #07 — Joker's Jinx, Six Flags America, Maryland (13 Apr 2017). Footage = the Prince George's County Fire/EMS camera mounted on a
// ladder-truck bucket (Mark Brady's channel, Gkju1xv8o1M, one continuous 26-min take, no source cuts; the left 29 % of every frame is the
// bucket's edge, so every window is cropped to 1360x765 of the picture and scaled), plus The Coaster Craze (666 subs, "free to use with
// attribution"): the train still stuck the next morning (Q-aKySFmOu4) and the ride in daylight (0XUjqSs_waE, cc = source - 8 s).
// Devices built for this case: HeightStaff + TiltGauge (the two spoken figures measured on real pictures), LaunchProfile (why a launched
// coaster can stop on a climb), DuskDeck (the four hours as five darkening cards), ArticlePhone (KTVU article set in real type: 2014 + inspection).
// 3 Nov audit: raws 7 -> 4 (cutOut at the end), NightClock + ChipLift replaced, Inset only once (the chains).
// VO = one take (no count word), split only where a raw sits; raws are the bucket camera's own sound (engine, crews talking).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { HeightStaff } from "../dev/TP07_HeightTilt";
import { LaunchProfile } from "../dev/TP07_LaunchProfile";
import { ArticlePhone } from "../dev/TP07_ArticlePhone";
import { DuskDeck } from "../dev/TP07_DuskDeck";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(211.0);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

// KTVU article (13 Apr 2017) set in real type on a phone (3 Nov audit: replaces the ChipLift scan crops); sweeps in frames of the shot
const page = (part: 1 | 2) => part === 1
  ? <ArticlePhone part={1} bg={GR + "cc_still.jpg"} scroll={[-60, 90]} sweeps={[[F(2.4), F(3.6)], [F(5.3), F(6.4)]]} />
  : <ArticlePhone part={2} bg={GR + "cc_still.jpg"} scroll={[-60, 150]} sweeps={[[F(0.6), F(1.8)], [F(3.3), F(4.6)]]} />;

// fixed bucket view: riders + firefighters sit around x .6 / y .3 of the cropped frame
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.6, vo: "Joker's Jinx is a coaster at Six Flags America in Maryland. (the ride in daylight)", src: "ccD.mp4", from: 1.5, s0: 1.03, s1: 1.09,
    over: <RedLabel text="SIX FLAGS AMERICA, MARYLAND" at={F(0.5)} hold={F(2.6)} /> },
  { a: 7.6, b: 11.6, vo: "At about half past five on Thursday the 13th of April 2017, (crews at dusk)", src: "jj_gd.mp4", from: 2.0, s0: 1.02, s1: 1.07, fy: 0.4,
    over: <RedLabel text="APRIL 13, 2017" at={F(0.6)} hold={F(3.0)} /> },
  { a: 11.6, b: 15.0, vo: "it stopped on its climb with twenty-four riders aboard. (the riders in the cars)", src: "jj_r1.mp4", from: 40.0, s0: 1.55, s1: 1.65, fx: 0.62, fy: 0.3 },
  { a: 15.0, b: 20.6, vo: "The train sat about a hundred feet up, tilted at roughly thirty degrees. (the stopped train the next morning, same spot, measured)",
    node: <HeightStaff src={GR + "q_still.jpg"} iw={1136} ih={640} staffX={1000} groundY={640} topY={168} target={[600, 160]} label="≈100 FT" at={8} />,
    over: <RedLabel text="TILTED ≈30°" at={F(2.5)} x={0.33} y={0.2} size={40} /> },
  { a: 20.6, b: 22.8, vo: "Crews from Prince George's and Anne Arundel counties were sent.", src: "jj_gd.mp4", from: 34.0, s0: 1.03, s1: 1.08 },
  // R1 22.8-34.6: the bucket rises through the steel toward the train (engine)
  { a: 22.8, b: 34.6, vo: "RAW: the climb to the train", src: "jj_cl.mp4", from: 20.0, s0: 1.0, s1: 1.05 },
  { a: 34.6, b: 38.1, vo: "Around seventy-five firefighters,", src: "jj_gd.mp4", from: 12.0, s0: 1.04, s1: 1.09, fy: 0.35 },
  { a: 38.1, b: 41.4, vo: "EMTs, high-angle rescuers and park staff ended up on this.", src: "jj_gn.mp4", from: 8.0, s0: 1.03, s1: 1.08 },
  { a: 41.4, b: 44.5, vo: "Before anyone moved a rider, crews chained the cars (under the train)", src: "jj_cl.mp4", from: 34.0, s0: 1.02, s1: 1.07 },
  { a: 44.5, b: 47.6, vo: "to the track, so the train couldn't roll while the weight shifted. (zoom on the wheels on the track)",
    node: <Inset src={GR + "jj_c2.mp4"} from={24.0} box={0.6} pos="35% 55%" drift={0.08} /> },
  { a: 47.6, b: 51.0, vo: "Officials said the angle and the slick track made it harder,", src: "jj_c2.mp4", from: 36.0, s0: 1.03, s1: 1.09 },
  { a: 51.0, b: 54.0, vo: "and that the team trains on these rides twice a year. (the high-angle crew)", src: "jj_gd.mp4", from: 18.0, s0: 1.05, s1: 1.1, fy: 0.35 },
  // R2 54.0-64.0: the crew at the cars talking it through
  { a: 54.0, b: 64.0, vo: "RAW: firefighters at the cars", src: "jj_r1.mp4", from: 71.5, s0: 1.45, s1: 1.55, fx: 0.62, fy: 0.3 },
  { a: 64.0, b: 68.9, vo: "One parent said it took forty-five minutes for the first fire truck to arrive.", src: "jj_gd.mp4", from: 41.0, s0: 1.02, s1: 1.08 },
  { a: 68.9, b: 71.0, vo: "That's their account, not an official one.", src: "jj_gd.mp4", from: 25.0, s0: 1.08, s1: 1.12, fy: 0.35 },
  { a: 71.0, b: 74.4, vo: "But tipped back with nothing in front of you except sky,", src: "jj_r3.mp4", from: 6.0, s0: 1.75, s1: 1.85, fx: 0.6, fy: 0.25 },
  { a: 74.4, b: 76.4, vo: "forty-five minutes must feel like a week.", src: "jj_r3.mp4", from: 40.0, s0: 1.2, s1: 1.28, fx: 0.6, fy: 0.2 },
  // 76.4 -> R3 (81.55-92.35): the bucket reaches the front car and the first firefighters climb across (one continuous shot)
  { a: 76.4, b: 92.3, vo: "Brady said that when firefighters first got up there, some of the young children were pretty much hysterical. + RAW", src: "jj_cl.mp4", from: 46.0, s0: 1.0, s1: 1.08, fy: 0.4 },
  { a: 92.3, b: 96.3, vo: "Each rider was strapped in with belts and rope before leaving the seat, (the rope work, framed)",
    src: "jj_r1.mp4", from: 16.0, s0: 1.5, s1: 1.66, fx: 0.66, fy: 0.3 },
  // 96.3 -> R4 (99.3-110.0): a rider in the bucket, it pulls away from the tilted train
  { a: 96.3, b: 110.0, vo: "then brought down in the bucket of a ladder truck. + RAW", src: "jj_r5.mp4", from: 52.0, s0: 1.0, s1: 1.06, fy: 0.45 },
  { a: 110.0, b: 114.2, vo: "Brady also said something that should make anyone who has ridden it a little uneasy. (down through the steel)", src: "jj_r5.mp4", from: 75.0, s0: 1.02, s1: 1.07 },
  { a: 114.2, b: 121.4, vo: "He said the train was stuck in about the same spot as in August 2014, ... five hours. (KTVU)", node: page(1) },
  { a: 121.4, b: 124.0, vo: "And Maryland's labor department said (the ride)", src: "ccB.mp4", from: 1.0, s0: 1.03, s1: 1.08 },
  { a: 124.0, b: 129.2, vo: "it had last been inspected on the 3rd of March 2017, six weeks earlier, with no outstanding violations. (KTVU)", node: page(2) },
  { a: 129.2, b: 132.6, vo: "So it had done this before, and it had passed. (the ride running)", src: "ccC.mp4", from: 1.0, s0: 1.03, s1: 1.08 },
  // R5 132.6-141.7: crew talk at height
  { a: 132.6, b: 141.7, vo: "RAW: 'make sure we lift that bucket up'", src: "jj_r5.mp4", from: 13.6, s0: 1.4, s1: 1.5, fx: 0.66, fy: 0.3 },
  { a: 141.7, b: 143.7, vo: "Part of it is how the ride works. (the station)", src: "ccA.mp4", from: 0.8, s0: 1.02, s1: 1.05 },
  { a: 143.7, b: 147.4, vo: "A launched coaster isn't dragged up a chain like an old wooden one.", node: <LaunchProfile mode="chain" bg={GR + "cc_still.jpg"} /> },
  { a: 147.4, b: 149.6, vo: "It's fired out of the station,", src: "ccA.mp4", from: 1.9, s0: 1.02, s1: 1.06 },
  { a: 149.6, b: 152.0, vo: "and it needs enough speed to clear whatever is ahead.", src: "ccB.mp4", from: 11.0, s0: 1.03, s1: 1.08 },
  { a: 152.0, b: 156.6, vo: "If something stops it partway, the train sits at an angle where it was never built to sit.", node: <LaunchProfile mode="launch" bg={GR + "cc_still.jpg"} bgPos="50% 30%" /> },
  // R5b 156.4-165.4: riders waiting on the tilted track (cut sheet cue 14:58)
  { a: 156.6, b: 165.4, vo: "RAW: riders waiting", src: "jj_r4.mp4", from: 12.0, s0: 1.35, s1: 1.42, fx: 0.62, fy: 0.3 },
  { a: 165.4, b: 170.5, vo: "One rider, Julia Valverde, said afterwards that the firefighters kept talking to them.", src: "jj_r3.mp4", from: 22.0, s0: 1.9, s1: 2.0, fx: 0.62, fy: 0.3 },
  // R6 161.5-172.0: "All right, are you ready?"
  { a: 170.5, b: 181.0, vo: "RAW: 'all right, are you ready?'", src: "jj_r2.mp4", from: 9.9, s0: 1.5, s1: 1.6, fx: 0.62, fy: 0.3 },
  { a: 181.0, b: 185.0, vo: "Most of it was waiting, and that's what a rescue like this really is.", src: "jj_r4.mp4", from: 4.0, s0: 1.08, s1: 1.14, fx: 0.6, fy: 0.35 },
  { a: 185.0, b: 189.4, vo: "Hours of patience, one secured rider after another, in the dark.", src: "jj_lt.mp4", from: 14.0, s0: 1.3, s1: 1.38, fx: 0.62, fy: 0.3 },
  { a: 189.4, b: 193.5, vo: "Everyone was down by half past nine, four hours after the stop. (dusk -> dark, the clock)",
    node: <DuskDeck dusk={GR + "dusk_still.jpg"} night={GR + "night_still.jpg"} hours={["5:30 PM", "6:30", "7:30", "8:30", "9:30 PM"]} at={4} every={15} last="ALL DOWN" /> },
  { a: 193.5, b: 197.9, vo: "The fire department's spokesman, Mark Brady, said they were all OK. (riders walked off by crews)", src: "jj_gw.mp4", from: 10.0, s0: 1.03, s1: 1.08 },
  { a: 197.9, b: 201.3, vo: "Six Flags said it would take a couple of days to find the cause.", src: "jj_gn.mp4", from: 30.0, s0: 1.03, s1: 1.08 },
  { a: 201.3, b: 207.0, vo: "The next morning the park opened, but the Jinx stayed shut, with its cars still sitting on the track. (the morning after)",
    src: "q.mp4", from: 9.0, s0: 1.03, s1: 1.12, fx: 0.6, fy: 0.3, over: <RedLabel text="THE NEXT MORNING" at={F(0.6)} hold={F(3.6)} /> },
  { a: 207.0, b: 211.0, vo: "No cause has ever been made public. (the ride)", src: "ccD.mp4", from: 14.0, s0: 1.04, s1: 1.1 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.0), kind: "whip", len: 10 },
  { at: F(68.9), kind: "blurDip", len: 12 },
  { at: F(74.4), kind: "blurDip", len: 12 },
  { at: F(110.0), kind: "blurDip", len: 12 },
  { at: F(114.2), kind: "glitch", len: 8 },
  { at: F(143.7), kind: "glitch", len: 8 },
  { at: F(152.0), kind: "zoomHit", len: 10 },
    { at: F(170.5), kind: "blurDip", len: 12 },
  { at: F(181.0), kind: "blurDip", len: 14 },
  { at: F(185.0), kind: "blurDip", len: 12 },
  { at: F(189.4), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

// VO parts [take from, take to, comp time]: the take is cut only in its own silences
const VO: [number, number, number][] = [
  [0.0, 18.68, 4.0], [18.68, 37.4, 34.96], [37.4, 54.8, 64.0], [54.8, 61.15, 92.85], [61.15, 83.4, 110.3], [83.4, 98.0, 142.0], [98.0, 102.9, 165.7], [102.9, 131.0, 181.3],
];
// raws: [comp from, comp to, window] — the bucket camera's sound through rawclean.py (music stripped), each wav starts 0.5 s before its window
const RAW: [number, number, string][] = [
  [22.8, 34.6, "r1"], [54.0, 64.0, "r2"], [81.7, 92.35, "r3"], [99.3, 110.0, "r4"], [132.7, 141.7, "r5"], [156.6, 165.4, "r5b"], [170.6, 181.0, "r6"],
];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [4.0, "sfx_n2/glitch_02.wav", -24],
  [14.9, "sfx_n2/whoosh_02.wav", -28],
  [17.6, X + "metal_clank_1.wav", -30],
  [114.2, "sfx_n2/page_in_01.wav", -30],
  [124.0, "sfx_n2/page_in_02.wav", -31],
  [143.7, "sfx_n2/glitch_03.wav", -28],
  [152.0, "sfx_n2/whoosh_01.wav", -30],
  [154.6, X + "metal_clank_3.wav", -26],
  [189.4, "sfx_n2/whoosh_03.wav", -32],
];
// music (Epidemic ambient, Music 1, ~-34 LUFS under a -26 LUFS take): ducked under every raw, two passes (file is 128 s)
const duck = (t: number) => {
  let g = 1;
  for (const [a, b] of RAW) g = Math.min(g, interpolate(t, [a - 0.6, a, b - 0.2, b + 0.6], [1, 0.22, 0.22, 1], cl));
  return g;
};

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FOUR HOURS ON JOKER'S JINX" bg={GR + "title_still.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, t], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAW.map(([a, b, s], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/raw_" + s + "_clean.wav")} startFrom={15} volume={(f) => dB(-7) * interpolate(f, [0, 8, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(4.0)} durationInFrames={F(126.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} volume={(f) => dB(-16) * duck(4.0 + f / 30) * interpolate(f, [0, 30, F(124.0), F(126.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(128.0)} durationInFrames={F(83.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => dB(-16) * duck(128.0 + f / 30) * interpolate(f, [0, F(2.5), F(80.0), F(83.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): raws 7 -> 4: removed r2 (crew at the cars, after the training line), r5 (after the inspection history), r5b (after the launched-coaster explanation); VO runs on in one take. Cut 3 starts 156.6 (VO ends there in silence).
const _cut = cutOut(CompFull, DUR, [[54.0, 64.0], [132.6, 141.7], [156.6, 165.6]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
