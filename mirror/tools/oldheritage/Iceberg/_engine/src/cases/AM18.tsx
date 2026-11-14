// Amusement Parks Iceberg #18 (LEVEL 5 "The Deepest", 1st case: opens with dev/AM_LevelEntry) — Kings Island "Black Sunday", Mason,
// Ohio, Sunday 9 June 1991: ~8:30 pm two men electrocuted in the Oktoberfest lake trying to save a friend (aerator pump, no working GFCI),
// ~9:45 pm Candy Taylor fell from Flight Commander. No footage of either exists outside 1991 TV (RED); no Commons photo of the lake's
// walkway or of Flight Commander. Built from real Commons photos of the park (the Oktoberfest fountain/lake by Viking Fury, the carousel
// and Eiffel Tower at night, the park in 1972 and 1996), a CC BY POV of Kings Island's Racer (The Coaster Scoop, Commons) and the real
// AP story as the Deseret News printed it on 10 Jun 1991. VO = vor/CASE18.mp3, one take (it opens with the Level 5 line): part 1 inside
// the level entry, part 2 after the title card; no raw (no incident clip exists).
// Devices: PondShimmer (only the lake stays lit and moves), StripStack (the Deseret story's three real strips land on a table, in two parts).
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LevelEntry } from "../dev/AM_LevelEntry";
import { Still, type Cam } from "../dev/AM1720_Still";
import { PondShimmer } from "../dev/AM18_PondShimmer";
import { StripStack } from "../dev/AM18_StripStack";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const LE = 8.4, TC = 4.0, L_END = 6.87, O = LE + TC - L_END; // case time = VO time + O for the case part
const v = (t: number) => +(t + O).toFixed(2);
const VO_END = v(103.96);
export const DUR = F(VO_END + 1.3);

const IM: Record<string, [number, number]> = { viking: [1920, 1440], carousel: [1920, 1289], eiffel: [1920, 1440], ki96: [1920, 1285], ki72: [1920, 2373], clock: [1920, 1440], eiffeln: [1920, 1440] };
const st = (n: string, a: Cam, b: Cam, o: { look?: [number, number]; gray?: number } = {}) => <Still src={GR + n + ".jpg"} iw={IM[n][0]} ih={IM[n][1]} a={a} b={b} {...o} />;

// Deseret News sheet (shots/deseret_sheet.png, 1490x1235): strips = headline+date 0-340, pond paragraphs 380-890, Flight Commander 930-1235
const SHEET = { sheet: C + "shots/deseret_sheet.png", sw: 1490, sh: 1235, bg: GR + "carousel.jpg", cx: 745,
  strips: [{ y0: 0, y1: 340, land: -40, rot: -1.2, dx: -10 }, { y0: 380, y1: 890, land: 4, rot: 0.8, dx: 14 }, { y0: 930, y1: 1235, land: 186, rot: -0.6, dx: -6 }],
  keys: [{ at: 0, y: 300, k: 0.92 }, { at: 30, y: 640, k: 1.08 }, { at: 160, y: 700, k: 1.0 }, { at: 200, y: 1060, k: 1.12 }, { at: 440, y: 1090, k: 1.16 }],
  focus: [{ y0: 561, y1: 770, at: 26 }, { y0: 954, y1: 1217, at: 206 }] };
const PART_B = 174; // device frame where part B starts (part A runs 174 frames)

type Sh = { a: number; b: number; vo: string; node: React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: v(6.87), b: v(13.11), vo: "On Sunday, June 9, 1991, Kings Island in Ohio had the worst night in its history. (the park in 1996: King Cobra)",
    node: st("ki96", { x: 0.5, y: 0.55, s: 1.02 }, { x: 0.55, y: 0.5, s: 1.12 }),
    over: <><RedLabel text="JUNE 9, 1991" at={F(0.6)} hold={F(2.2)} /><RedLabel text="KINGS ISLAND, OHIO" at={F(3.1)} hold={F(2.6)} /></> },
  { a: v(13.11), b: v(17.22), vo: "Two unrelated accidents happened about 75 minutes apart. (Racer lift hill POV, the park below)",
    node: <Shot_FX src={GR + "racer_a.mp4"} n={F(v(17.22)) - F(v(13.11))} from={1.5} s0={1.02} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: v(17.22), b: v(22.84), vo: "At around 8:30, a 22-year-old named Timothy was crossing a wooden walkway over the lake. (the Oktoberfest lake and fountain)",
    node: st("viking", { x: 0.45, y: 0.5, s: 1.02 }, { x: 0.38, y: 0.55, s: 1.12 }),
    over: <RedLabel text="OKTOBERFEST LAKE, 8:30 PM" at={F(0.4)} hold={F(2.8)} /> },
  { a: v(22.84), b: v(27.46), vo: "He reached down to splash the water, a jolt went through him, and he fell in. (PondShimmer)",
    node: <PondShimmer src={GR + "viking.jpg"} iw={1920} ih={1440} center={[0.32, 0.6]} rx={0.3} ry={0.16} a={{ x: 0.36, y: 0.58, s: 1.25 }} b={{ x: 0.33, y: 0.6, s: 1.38 }} jolt={F(25.07 - 22.84)} /> },
  { a: v(27.46), b: v(35.87), vo: "His friend Eddie Haithcoat jumped in after him. So did Darrell Robertson, a 20-year-old park security guard. I don't know that I'd have been that brave. (the carousel lit at night)",
    node: st("carousel", { x: 0.5, y: 0.5, s: 1.03 }, { x: 0.52, y: 0.46, s: 1.16 }),
    over: <><RedLabel text="EDDIE HAITHCOAT" at={F(0.5)} hold={F(2.0)} /><RedLabel text="DARRELL ROBERTSON, PARK SECURITY" at={F(2.8)} hold={F(2.6)} /></> },
  { a: v(35.87), b: v(42.68), vo: "But the water was live. A pump that kept the lake moving had surged, and it didn't have working ground-fault protection, (the fountain, tight, lights going down)",
    node: st("viking", { x: 0.3, y: 0.55, s: 1.7 }, { x: 0.32, y: 0.58, s: 1.9 }, { look: [0.15, 0.75] }) },
  { a: v(42.68), b: v(47.28), vo: "the safety switch meant to cut the power the instant electricity leaks where it shouldn't. (the park's lights at night: Eiffel Tower and carousel)",
    node: st("eiffel", { x: 0.6, y: 0.6, s: 1.05 }, { x: 0.66, y: 0.62, s: 1.16 }) },
  { a: v(47.28), b: v(53.08), vo: "Eddie and Darrell were both killed. Timothy, the man they'd gone in to save, survived with burns. (StripStack A: the Deseret News story lands, the names paragraph lit)",
    node: <StripStack {...SHEET} /> },
  { a: v(53.08), b: v(57.28), vo: "And the night wasn't over. At about 9:45, across the park, (the Eiffel Tower at night)",
    node: st("eiffeln", { x: 0.3, y: 0.5, s: 1.04 }, { x: 0.26, y: 0.46, s: 1.14 }),
    over: <RedLabel text="9:45 PM" at={F(1.5)} hold={F(2.0)} /> },
  { a: v(57.28), b: v(65.95), vo: "Candy Taylor, 32, from Toledo, rode Flight Commander, where riders steered two-seat pods with a joystick and could roll them all the way over. (StripStack B: the Flight Commander strip lands)",
    node: <StripStack {...SHEET} t0={PART_B} />,
    over: <RedLabel text="FLIGHT COMMANDER" at={F(2.7)} hold={F(2.2)} y={0.12} size={38} /> },
  { a: v(65.95), b: v(73.51), vo: "Candy was alone in her pod. At some point she slipped out of her restraint into the empty seat beside her, which had nothing holding it closed. (the carousel's lights, far off, going down)",
    node: st("carousel", { x: 0.75, y: 0.35, s: 1.6 }, { x: 0.72, y: 0.38, s: 1.75 }, { look: [0.2, 0.7], gray: 0.3 }) },
  { a: v(73.51), b: v(78.33), vo: "When the pod went upside down, she fell from the pod, and she died in the hospital. (the night sky over the park)",
    node: st("eiffeln", { x: 0.7, y: 0.2, s: 1.3 }, { x: 0.7, y: 0.28, s: 1.38 }, { look: [0.1, 0.6] }) },
  { a: v(78.33), b: v(85.88), vo: "The coroner found she'd been drinking, but officials blamed a design flaw. A ride that flips shouldn't have an open seat you can slide into. (the park in the 1990s, tight)",
    node: st("ki96", { x: 0.3, y: 0.6, s: 1.6 }, { x: 0.27, y: 0.62, s: 1.75 }) },
  { a: v(85.88), b: v(91.61), vo: "OSHA fined Kings Island $23,500 over safety violations at the lake. (the floral clock at the park's front)",
    node: st("clock", { x: 0.5, y: 0.5, s: 1.03 }, { x: 0.5, y: 0.48, s: 1.14 }),
    over: <RedLabel text="OSHA FINE: $23,500" at={F(1.0)} hold={F(3.0)} /> },
  { a: v(91.61), b: v(99.15), vo: "Flight Commander came back in 1992 with seat dividers and new restraints, and it was gone after 1995. (Racer POV, the ride running)",
    node: <Shot_FX src={GR + "racer_b.mp4"} n={F(v(99.15)) - F(v(91.61))} from={4.0} s0={1.0} s1={1.05} fx={0.5} fy={0.5} />,
    over: <RedLabel text="1992" at={F(1.2)} hold={F(1.8)} /> },
  { a: v(99.15), b: VO_END + 1.3, vo: "Three people died in one night, and fans of the park still call it Black Sunday. (the park in 1972, slow pull, fade)",
    node: st("ki72", { x: 0.5, y: 0.45, s: 1.15 }, { x: 0.5, y: 0.42, s: 1.03 }, { gray: 0.4 }) },
];

const CUTS: FxCut[] = [
  { at: F(LE + TC), kind: "glitch", len: 10 },
  { at: F(v(47.28)), kind: "blurDip", len: 12 },
  { at: F(v(57.28)), kind: "blurDip", len: 12 },
  { at: F(v(65.95)), kind: "blurDip", len: 14 },
];

const SFX: [number, string, number][] = [
  [0.55, "sfx_n2/real/sub_drop_1.wav", -15],
  [LE + TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [v(25.07), "sfx_n2/real/impact_1.wav", -24],
  [v(47.28), "sfx_n2/real/paper_3.wav", -26],
  [v(57.28), "sfx_n2/real/paper_2.wav", -27],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(LE)} layout="none"><AbsoluteFill><LevelEntry n={5} name="THE DEEPEST" at={{ level: 24, names: 66, mark: 206 }} /></AbsoluteFill></Sequence>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(LE)} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="BLACK SUNDAY" bg={GR + "carousel.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none">
              <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>{s.over}</AbsoluteFill>
            </Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(VO_END + 0.2)} layout="none"><FadeBlack len={F(1.1)} /></Sequence>
      {/* VO: one take; the level line plays inside the level entry, the case after the title card */}
      <Sequence from={F(0.6)} durationInFrames={F(L_END)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} /></Sequence>
      <Sequence from={F(LE + TC)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(L_END)} /></Sequence>
      <Sequence from={0} durationInFrames={F(LE)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-24) * interpolate(f, [0, 15, F(LE) - 20, F(LE)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1, -15 dB (matched to the AM01 bed), in after the level entry, dip on the deaths */}
      <Sequence from={F(LE)} durationInFrames={DUR - F(LE)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(10)} volume={(f) => {
          const t = f / 30 + LE;
          const dip = interpolate(t, [v(47.0), v(47.6), v(53.0), v(54.0), v(73.3), v(73.9), v(78.3), v(79.3)], [1, 0.6, 0.6, 1, 1, 0.6, 0.6, 1], cl);
          return dB(-15) * interpolate(t, [LE, LE + 1.5, VO_END - 0.5, VO_END + 1.3], [0, 1, 1, 0], cl) * dip;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
