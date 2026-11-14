// Amusement Parks Iceberg #13 (LEVEL 3 "DARK WATERS", case 1) — Ride of Steel, Darien Lake, Darien Center, New York, Fri 8 Jul 2011:
// Sgt. James Hackemer, 29, an Iraq War veteran who had lost both legs, was let onto the Intamin hypercoaster against the posted two-legs
// rule, was lifted out of the front seat on the last of three airtime hills and fell; the ride itself worked as designed.
// The VO take (vor/CASE13.mp3) opens with the level line, so the case opens on the iceberg: dev/AM_LevelEntry (n=3) -> TitleCard -> case.
// No footage of the incident exists (the sheriff's account rests on witnesses): NO RAWS. The VO runs straight through over silent footage:
// [trav] "This Is Darien Lake" (Castle Guard Production / John Oblender, 2013, CC BY-NC-SA 3.0, archive.org DarienLakeThisIs, 640x360):
//   gate = src 76.5-89.5, walk = 96.5-115.5, lift = 117.0-175.0, garden = 176.0-242.7 (src cuts 75.08 95.70 116.39 175.35 243.18);
// [pov] front-seat ride video of Ride of Steel (filmed by "East Coast(er) General", 2009, archive.org mirror of CoasterForce's upload):
//   pov.mp4 = src 6-86 (only cut 5.23); crest_slow = src 55.0-56.6 @0.4x; return_slow = src 81-86 @0.5x (minterpolate).
// Stills (Wikimedia Commons, credits in NOTES): entrance (Zotdragon, CC BY-SA 3.0), station (Joekid, CC BY-SA 3.0), firsthill (CC BY-SA 3.0),
// humvee (US military, PD, 2008), walterreed (Carol M. Highsmith, LOC, PD).
// Timeline: T = v + 6.05 for the case VO (v = time in the take). Level line v 0-4.95 at 0.6. Last word v 98.07 -> T 104.12.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LevelEntry } from "../dev/AM_LevelEntry";
import { LampRead } from "../dev/AM13_LampRead";
import { CrestFreeze } from "../dev/AM13_CrestFreeze";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const LE = 7.0, TC = 4.0, OFF = LE + TC - 4.95; // case VO v -> timeline
const T = (v: number) => +(v + OFF).toFixed(3);
export const DUR = F(105.5);

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

const S: Sh[] = [
  { a: 4.95, b: 9.54, vo: "On July 8, 2011, James Hackemer went to Darien Lake, in New York, (the park gate, crowds)", src: "gate.mp4", from: 1.6, s0: 1.02, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <><RedLabel text="JULY 8, 2011" at={F(0.2)} hold={F(1.6)} /><RedLabel text="DARIEN LAKE, NEW YORK" at={F(2.05)} hold={F(2.3)} /></> },
  { a: 9.54, b: 13.29, vo: "with his family. He was 29 and an Iraq War veteran. (the park's walkway)", src: "walk.mp4", from: 1.2, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="JAMES HACKEMER, 29" at={F(1.0)} hold={F(2.4)} /> },
  { a: 13.29, b: 17.65, vo: "In 2008, a roadside explosive device had taken both his legs, (US Army humvee convoy, 2008)", src: "humvee.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.5, fy: 0.5 },
  { a: 17.65, b: 19.66, vo: "and he'd had to learn to speak again. (Walter Reed Army Hospital)", src: "walterreed.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 19.66, b: 21.16, vo: "He picked Ride of Steel, (the lift hill and first drop)", src: "firsthill.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.4,
    over: <RedLabel text="RIDE OF STEEL" at={F(0.25)} hold={F(1.15)} /> },
  { a: 21.16, b: 24.62, vo: "a 208-foot coaster that hits 73 miles an hour (tilt up the lift hill)", src: "lift.mp4", from: 14.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.4 },
  { a: 24.62, b: 27.72, vo: "and holds riders with only a lap bar and a seat belt. (front seat: the drop)", src: "pov.mp4", from: 16.4, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 27.72, b: 31.32, vo: "A sign at the entrance said you couldn't ride without two legs. (the ride's entrance)", src: "entrance.jpg", still: true, s0: 1.08, s1: 1.2, fx: 0.32, fy: 0.62 },
  { a: 31.32, b: 33.07, vo: "How did he end up in the front seat? (front seat on the lift)", src: "pov.mp4", from: 0.3, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.55 },
  { a: 33.07, b: 35.62, vo: "He came in through the exit, the accessible entrance, (the ride's stairs)", src: "garden.mp4", from: 64.2, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5 },
  { a: 35.62, b: 37.55, vo: "so nobody measured him. (the station, wide)", src: "station.jpg", still: true, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.55 },
  { a: 37.55, b: 40.56, vo: "His 19-year-old nephew lifted him into the seat. (the station: the train's front car)", src: "station.jpg", still: true, s0: 1.7, s1: 1.82, fx: 0.62, fy: 0.85 },
  { a: 40.56, b: 46.27, vo: "On the platform, three attendants, all between 18 and 24, could see he didn't have legs. (the ride from the path)", src: "garden.mp4", from: 2.5, s0: 1.03, s1: 1.12, fx: 0.45, fy: 0.45 },
  { a: 46.27, b: 50.18, vo: "They checked the bars, the board showed green, and they sent the train. (front seat leaving: up the lift)", src: "pov.mp4", from: 8.6, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 50.18, b: 56.02, vo: "On the last of three big hills, the train crested and his cap flew off. Witnesses saw him reach for it. (front seat: up the hill)", src: "pov.mp4", from: 43.5, s0: 1.0, s1: 1.03, fx: 0.5, fy: 0.5 },
  { a: 56.02, b: 62.08, vo: "With no legs to brace under the bar, he lifted right out of the seat. He fell from the train and died instantly. (CrestFreeze)",
    node: <CrestFreeze src={GR + "crest_slow.mp4"} from={0.75} hold={92} drain={[70, 140]} fall={[106, 170]} /> },
  { a: 62.08, b: 66.56, vo: "When the train came back, his seat was empty, and the bar and belt were still locked. (front seat: back into the station, slow)", src: "return_slow.mp4", from: 0.2, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 66.56, b: 70.51, vo: "The ride had worked perfectly. The state cited the park for operator error, (the top of the lift)", src: "lift.mp4", from: 35.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  { a: 70.51, b: 75.22, vo: "and the sheriff said Darien Lake broke its own policies but found no criminal wrongdoing. (the drop's lattice behind the gardens)", src: "garden.mp4", from: 14.0, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.4 },
  { a: 75.22, b: 76.92, vo: "Let's go back to that sign. (the entrance again, tight)", src: "entrance.jpg", still: true, s0: 1.55, s1: 1.65, fx: 0.3, fy: 0.55 },
  { a: 76.92, b: 86.78, vo: "All five staff... passed written safety exams... rules said two legs. Why they let him on anyway was never explained. (LampRead: The Batavian, sheriff's FOIL report)",
    node: <LampRead page={C + "shots/batavian_sheet.png"} pw={2560} ph={1860} bg={GR + "lift.mp4"} bgFrom={40}
      keys={[{ at: 0, box: [80, 60, 2400, 570], k: 0.62 }, { at: 40, box: [80, 1390, 2400, 1490], k: 0.78 }, { at: 160, box: [80, 1660, 2400, 1760], k: 0.82 }, { at: 225, box: [80, 625, 2140, 680], k: 0.86 }]}
      rule={{ box: [1918, 1660, 2228, 1700], at: 172 }} /> },
  { a: 86.78, b: 90.65, vo: "I don't think a green light on a board should ever outrank the sign at the entrance. (the ride beyond the gardens)", src: "garden.mp4", from: 38.5, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 90.65, b: 93.36, vo: "His mother said it'd help a little that he'd been happy. (the park gate)", src: "gate.mp4", from: 8.4, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 93.36, b: 99.45, vo: "Two weeks later, once every operator had been retrained, Ride of Steel reopened. (tilt up the lift hill; fade)", src: "lift.mp4", from: 22.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.4 },
];

const CUTS: FxCut[] = [
  { at: F(LE + TC), kind: "glitch", len: 10 },     // title card -> the case
  { at: F(T(37.55)), kind: "blurDip", len: 12 },   // same photo, reframed onto the car
  { at: F(T(50.18)), kind: "blurDip", len: 12 },   // pov on the lift -> pov on the hills (same camera, later)
  { at: F(T(56.02)), kind: "blurDip", len: 10 },   // pov -> its slow crest (same camera)
  { at: F(T(62.08)), kind: "blurDip", len: 14 },   // the dark crest -> the train back (same camera)
  { at: F(T(76.92)), kind: "blurDip", len: 12 },   // into the sheriff's report
];
export const ALLOW = CUTS.map((c) => `${((c.at - 9) / 30).toFixed(2)}-${((c.at + 9) / 30).toFixed(2)}`).join(",");

const SFX: [number, string, number, number?][] = [
  [0.5, "sfx_n2/real/sub_drop_1.wav", -15],
  [LE - 1.05, "sfx_n2/whoosh_02.wav", -22],
  [LE + TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(76.92), "sfx_n2/real/paper_3.wav", -25],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} n={F(T(s.b)) - F(T(s.a))} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} /></FilmLook_FX>;
};

const END = T(98.07) + 0.15;
export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(LE)} layout="none"><AbsoluteFill><LevelEntry n={3} name="DARK WATERS" at={{ level: 16, names: 42, mark: 160 }} /></AbsoluteFill></Sequence>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(LE)} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="RIDE OF STEEL" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {S.map((s, i) => (
            <Sequence key={i} from={F(T(s.a))} durationInFrames={F(T(s.b)) - F(T(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><FadeBlack len={DUR - F(END)} /></Sequence>
      {/* VO: one take; the level line inside the level entry, then the case (no raws, so no other split) */}
      <Sequence from={F(0.6)} durationInFrames={F(4.95)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} /></Sequence>
      <Sequence from={F(LE + TC)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(4.95)} /></Sequence>
      <Sequence from={0} durationInFrames={F(LE)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-24) * interpolate(f, [0, 15, F(LE) - 20, F(LE)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 4 (-11.9 LUFS file) at -22 dB ≈ 10 LU under the VO; dips a little under the crest */}
      <Sequence from={F(LE - 0.5)} durationInFrames={DUR - F(LE - 0.5)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + LE - 0.5;
          const dip = interpolate(t, [T(56.0), T(57.5), T(62.0), T(63.5)], [1, 0.55, 0.55, 1], cl);
          return dB(-22) * interpolate(t, [LE - 0.5, LE + 1.5, DUR / 30 - 1.6, DUR / 30], [0, 1, 1, 0], cl) * dip;
        }} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
