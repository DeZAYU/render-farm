// Natural Disasters #13 — Driving through the Gatlinburg firestorm (28 Nov 2016). Channel grammar (brand.tsx) + devices for THIS case:
//   RidgeStack (dev/ND13_RidgeStack): NPS / Commons photos of the Chimney Tops fire hung in 3-D depth, the camera flies through them.
//   EmberRun  (dev/ND13_EmberRun): NAIP x 3DEP relief in perspective, the line from the Chimney Tops over the ridges into Gatlinburg.
//   GustGauge (dev/ND13_GustGauge): the NWS forecast (25-40 mph, gusts 60) vs the 87 mph gust on one mph ruler.
//   BulletinPair (dev/ND13_BulletinPair): the two real EVACUATION IMMEDIATE bulletins (9:03 / 11:47 PM) as lit sheets in 3-D.
// Footage: "js" = c_9h6Vi0ed0 (the drive with its own sound, 400x230 upscaled), "mah" = Robert Mahorney's upload (_T9Qt1b3sVU: a re-filmed
// copy of the same drive WITH ADDED MUSIC -> picture only, under the VO, only its first 45 s which the other upload lacks),
// "ac" = Angel Craig's Part 4 (c4Joyn2liys, 1080p, own sound). Every raw plays its own real sound; no clip sound under the VO.
// Source cuts: js 158.13 / 298.2; ac 29.73 34.51 35.32 56.05 56.85 59.23 65.62 69.60 70.40 71.20 92.87 93.58 111.67-112.84 121.84; mah 14.93.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { RidgeStack } from "../dev/ND13_RidgeStack";
import { EmberRun } from "../dev/ND13_EmberRun";
import { GustGauge } from "../dev/ND13_GustGauge";
import { BulletinPair } from "../dev/ND13_BulletinPair";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, GAP = 0.3;

// VO take split only where a raw sits (quiet points measured in the take)
// 3 Nov owner rule (raws only at the incident): Mahorney's drive, the trees at the road, the Craig family leaving, the tail-lights. The
// five raws after the fire-chief / embers / forecast / wooded-hills / alert explanation are cut and those blocks merged (was 10 / 9).
const BL: [number, number][] = [[0, 32.88], [32.88, 78.35], [78.35, 93.89], [93.89, 99.63], [99.63, 154.65]];
type Raw = { src: "js" | "ac"; a: number; b: number; vol?: number; what: string; s0?: number; s1?: number; fx?: number; fy?: number };
const RAWS: Raw[] = [
  { src: "js", a: 48.6, b: 64.0, what: "flames along the road beside the car, the mirror lit, burning ground" },
  { src: "js", a: 216.0, b: 227.6, what: "burning trees right at the roadside" },
  { src: "ac", a: 12.0, b: 29.5, vol: -5, what: "fire glow, burning roadside, emergency lights (family voices kept low)" },
  { src: "ac", a: 72.0, b: 92.6, what: "the queue of tail-lights, embers, fire beside the road" },
];
// timeline: block i at BS[i]; raw i at RS[i]
const BS: number[] = [], RS: number[] = [];
{ let t = TITLE; BL.forEach(([s, e], i) => { BS.push(t); t += e - s; if (RAWS[i]) { RS.push(t); t += RAWS[i].b - RAWS[i].a + GAP; } }); }
const blockOf = (take: number) => { let k = 0; BL.forEach(([s], i) => { if (take >= s - 0.001) k = i; }); return k; };
/** take time -> timeline seconds */
const T = (take: number) => BS[blockOf(take)] + take - BL[blockOf(take)][0];
const END = BS[BL.length - 1] + BL[BL.length - 1][1] - BL[BL.length - 1][0] + 0.6;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: (n: number) => React.ReactNode; over?: React.ReactNode; abs?: boolean };

// shots under the VO (a/b = take seconds)
const VO_SHOTS: Sh[] = [
  { a: 0.0, b: 2.22, vo: "Hail comes and goes in a few minutes. (the drive begins: dark road, headlights)", src: "js.mp4", from: 2.0, s0: 1.04, s1: 1.09, fx: 0.55, fy: 0.5 },
  { a: 2.22, b: 16.71, vo: "The fire... in plain view on a mountain for five days. / It started on the Chimney Tops... / and for days it stayed small. (RidgeStack)",
    node: (n) => <RidgeStack planes={[
      { src: GR + "ct2fire.jpg", ar: 4 / 3, at: 6, pos: "50% 40%", side: 1 },
      { src: GR + "ctview.jpg", ar: 1.5, at: F(7.58 - 2.22) + 4, pos: "50% 30%", label: "CHIMNEY TOPS", side: -1 },
      { src: GR + "ct2east.jpg", ar: 16 / 9, at: F(13.6 - 2.22), label: "GREAT SMOKY MOUNTAINS NATIONAL PARK", side: 1 },
    ]} /> },
  { a: 16.71, b: 21.82, vo: "Then, on the night of Monday the 28th of November 2016, the wind arrived. (the light flaring, debris in the beams)", src: "js.mp4", from: 18.6, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.5,
    over: <RedLabel text="NOVEMBER 28, 2016" at={F(1.6)} hold={F(3.0)} /> },
  { a: 21.82, b: 25.67, vo: "Wildfires usually calm down at night, when the air cools. (a red glow in the dark woods ahead)", src: "js.mp4", from: 37.4, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 25.67, b: 27.74, vo: "That night the wind did the opposite. (Mahorney's copy: a wall of flame along the road)", src: "mah.mp4", from: 2.4, s0: 1.3, s1: 1.36, fx: 0.62, fy: 0.5 },
  { a: 27.74, b: 32.88, vo: "Robert Mahorney was one of the people driving out through it, and he later called it driving through hell.", src: "mah.mp4", from: 6.6, s0: 1.3, s1: 1.38, fx: 0.6, fy: 0.5,
    over: <RedLabel text="ROBERT MAHORNEY" at={F(0.5)} hold={F(3.6)} /> },
  // block 2
  { a: 32.88, b: 38.59, vo: "At around five that evening, Gatlinburg's fire chief put out a release saying there were no fires in the city. (the Gatlinburg strip)", src: "ac.mp4", from: 151.0, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.5,
    over: <RedLabel text="GATLINBURG, TENNESSEE" at={F(0.8)} hold={F(4.0)} /> },
  { a: 38.59, b: 41.59, vo: "Within about an hour, more than twenty buildings were burning. (a house burning, a fire truck)", src: "ac.mp4", from: 127.6, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 41.59, b: 45.06, vo: "He said the wind gusted past 87 miles an hour. (the red glow through the trees)", src: "mah.mp4", from: 33.4, s0: 1.3, s1: 1.36, fx: 0.5, fy: 0.45 },
  { a: 45.06, b: 50.2, vo: "It threw embers over the ridges into town (EmberRun: Chimney Tops -> Gatlinburg)",
    node: (n) => <EmberRun src={GR + "relief.jpg"} iw={1400} ih={1750} a={[1048, 1519]} b={[541, 170]} ctrl={[1010, 760]} k={1.9} tilt={50}
      aLabel="CHIMNEY TOPS" bLabel="GATLINBURG" runAt={8} runLen={F(3.4)} bAt={F(3.6)} distLabel="6 MILES" distAt={F(4.1)} /> },
  { a: 50.2, b: 53.04, vo: "...so it seemed to start everywhere at once. (a hillside alight in many places)", src: "ac.mp4", from: 187.6, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5 },
  // block 3
  { a: 53.04, b: 56.08, vo: "Those streaks on the glass are embers, not rain. (slow replay of the streaks)", src: "js_replay.mp4", from: 0.0, s0: 1.12, s1: 1.22, fx: 0.5, fy: 0.4 },
  { a: 56.08, b: 59.18, vo: "Embers are behind most of the homes lost to wildfires. (buildings burning in town)", src: "ac.mp4", from: 168.3, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 59.18, b: 64.69, vo: "They get into vents, gutters and under decks, and a house can catch long after the flames have passed. (a house alight through the window)", src: "js.mp4", from: 228.0, s0: 1.03, s1: 1.1, fx: 0.62, fy: 0.45 },
  // block 4: forecast vs reality
  { a: 64.69, b: 75.58, vo: "Before it reached town, the weather service had forecast winds of 25 to 40 ... gusts over 60 ... The gusts that night went well past that. (GustGauge)",
    node: (n) => <GustGauge bg={GR + "js.mp4"} bgFrom={236.5} max={100} band={[25, 40]} bandAt={F(64.81 + 3.3 - 64.69)} gust={60} gustAt={F(64.81 + 5.6 - 64.69)} real={87} realAt={F(73.3 - 64.69)}
      bandLabel="FORECAST 25-40" gustLabel="GUSTS 60" realLabel="87 MPH" /> },
  // block 5
  { a: 75.58, b: 78.35, vo: "On this stretch the trees grow right up to the road. (trees burning at the edge of the road)", src: "js.mp4", from: 160.3, s0: 1.03, s1: 1.08, fx: 0.6, fy: 0.45 },
  // block 6
  { a: 78.35, b: 81.95, vo: "Wooded hills are about the worst place there is to escape a fire. (burning trunks close by)", src: "js.mp4", from: 177.6, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 81.95, b: 86.7, vo: "The roads wind, the trees crowd the asphalt, and there's often only one way down. (the road bending through smoke)", src: "js.mp4", from: 139.6, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  // block 7: Angel Craig
  { a: 86.7, b: 90.17, vo: "Angel Craig's family was staying at Gatlinburg Falls Resort. (their road out, smoke and red light)", src: "ac.mp4", from: 196.4, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="ANGEL CRAIG" at={F(0.4)} hold={F(2.7)} /> },
  { a: 90.17, b: 93.89, vo: "They left that evening following another car, with no phone signal. (the car ahead)", src: "ac.mp4", from: 0.8, s0: 1.03, s1: 1.08, fx: 0.45, fy: 0.55 },
  // block 8
  { a: 93.89, b: 97.04, vo: "Following the tail-lights in front of you is what almost anyone would do. (the red glare of the car ahead)", src: "ac.mp4", from: 42.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 97.04, b: 99.63, vo: "You just hope that driver knows the way. (tail-lights into the smoke)", src: "ac.mp4", from: 102.6, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.55 },
  // block 9: the alert gap
  { a: 99.63, b: 101.97, vo: "No signal mattered more than it sounds. (police lights in the smoke)", src: "ac.mp4", from: 113.4, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 101.97, b: 106.4, vo: "Only Tennessee's emergency agency could push a mobile alert to this area. (inside the car, the dash screen)", src: "ac.mp4", from: 60.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.55 },
  { a: 106.4, b: 112.84, vo: "The agency said it couldn't get the evacuation order from the county, because phones, internet and power were all down. (power lines over the burning strip)", src: "ac.mp4", from: 164.4, s0: 1.03, s1: 1.09, fx: 0.45, fy: 0.45 },
  { a: 112.84, b: 116.86, vo: "Even when they work, those phone alerts are capped at 90 characters. (the smoky road, the drive goes on)", src: "js.mp4", from: 196.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 116.86, b: 124.05, vo: "The weather service's evacuation messages went out at 9:03 and 11:47 that night, to television and radio. (BulletinPair)",
    node: (n) => <BulletinPair bg={GR + "ac.mp4"} bgFrom={206.0} sheets={[
      { src: SH + "evi903.png", imgW: 2560, imgH: 3200, crop: [150, 1180, 1420, 1750], mark: [186, 1419.5, 619.8, 1455.5], at: 0, markAt: F(118.85 - 116.86), from: -1 },
      { src: SH + "evi1147.png", imgW: 2560, imgH: 3200, crop: [150, 1180, 1420, 1750], mark: [186, 1419.5, 636.2, 1455.5], at: F(119.6 - 116.86), markAt: F(120.5 - 116.86), from: 1 },
    ]} /> },
  { a: 124.05, b: 127.96, vo: "A warning system that works perfectly, as long as nobody needs it. (blue lights in the smoke)", src: "ac.mp4", from: 106.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  // block 10: the outcome
  { a: 127.96, b: 131.9, vo: "Fourteen people lost their lives, around 190 were injured (the town burning)", src: "ac.mp4", from: 170.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 131.9, b: 135.62, vo: "and about 2,460 buildings were destroyed. (National Guard, Gatlinburg 29 Nov: a burned-out building, cars)", src: GR + "guard.jpg", still: true, s0: 1.04, s1: 1.14, fx: 0.55, fy: 0.55,
    over: <RedLabel text="GATLINBURG, NOVEMBER 29" at={F(0.6)} hold={F(2.8)} /> },
  { a: 135.62, b: 139.28, vo: "Two teenagers were charged with starting the fire on the Chimney Tops. (the peaks, burn scars visible)", src: GR + "ctview.jpg", still: true, s0: 1.55, s1: 1.4, fx: 0.48, fy: 0.25 },
  { a: 139.28, b: 141.04, vo: "The charges were later dropped. (the drive at the start: dark road)", src: "js.mp4", from: 10.0, s0: 1.04, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 141.04, b: 147.68, vo: "Prosecutors couldn't prove... the wind and the power lines had started fires of their own. (embers in the beams, the light flaring)", src: "js.mp4", from: 182.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 147.68, b: 151.4, vo: "A few miles away in Pigeon Forge, Dolly Parton's foundation (Dolly Parton, Knoxville 2016)",
    node: (n) => <Inset src={GR + "dolly.jpg"} still bg={{ src: GR + "ac.mp4", from: 209.0 }} box={0.3} ar={0.75} pos="50% 20%" label="DOLLY PARTON" labelAt={8} /> },
  { a: 151.4, b: 155.25, vo: "gave a thousand dollars a month to families who'd lost their homes. (the smoke-filled road out, last)", src: "ac.mp4", from: 200.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
];

const SHOTS: Sh[] = [
  ...VO_SHOTS.map((s) => ({ ...s, a: T(s.a), b: s.b >= 154.6 ? END : T(s.b - 0.001) + 0.001, abs: true })),
  ...RAWS.map((r, i) => ({ a: RS[i], b: BS[i + 1], vo: "RAW: " + r.what, src: r.src + ".mp4", from: r.a, s0: r.s0 ?? 1.02, s1: r.s1 ?? 1.06, fx: 0.5, fy: 0.5, abs: true })),
].sort((x, y) => x.a - y.a);

// transitions: glitch after the title and into the outcome; blur-dips on same-camera joins / time jumps
const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  { at: F(T(2.22)), kind: "blurDip", len: 12 },
  { at: F(T(16.71)), kind: "blurDip", len: 12 },
  { at: F(T(21.82)), kind: "blurDip", len: 12 },     // two windows of the same drive
  { at: F(T(45.06)), kind: "whip", len: 10, dir: 1 },
  { at: F(RS[2]), kind: "blurDip", len: 12 },        // Angel Craig's camera: the car ahead -> the raw, same camera
  { at: F(T(64.69)), kind: "blurDip", len: 12 },
  { at: F(T(116.86)), kind: "blurDip", len: 12 },
  { at: F(T(127.96)), kind: "glitch", len: 10 },
  { at: F(T(147.68)), kind: "blurDip", len: 12 },
];

export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`).join(",");

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const n = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={n} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(2.22), "sfx_n2/whoosh_02.wav", -30],
  [T(45.06), "sfx_n2/whoosh_01.wav", -28],
  [T(64.69) + 0.1, "sfx_n2/real/wind_gust_1.wav", -26],
  [T(116.86), "sfx_n2/page_in_01.wav", -30],
  [T(119.6), "sfx_n2/page_in_02.wav", -30],
  [T(127.96) - 0.05, "sfx_n2/glitch_03.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THROUGH THE FIRESTORM" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={Math.max(1, F(s.b) - F(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where a raw plays */}
      {BL.map(([s, e], i) => (
        <Sequence key={"v" + i} from={F(BS[i])} durationInFrames={F(e - s) + (i === BL.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(s)} /></Sequence>
      ))}
      {/* raws: their own sound, in over 5 f, out over the last 0.6 s, silent before the VO returns */}
      {RAWS.map((r, i) => {
        const n = F(r.b - r.a);
        return <Sequence key={"r" + i} from={F(RS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + r.src + "_clean.wav")} startFrom={F(r.a)} volume={(f) => dB(r.vol ?? -1) * interpolate(f, [0, 5, n - 18, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {/* music: Epidemic ambient Music 4, only under the VO blocks; out under every raw (the fire is loud), back after */}
      {BL.map(([s, e], i) => {
        const n = F(e - s) + (i === BL.length - 1 ? 18 : 0);
        return <Sequence key={"m" + i} from={F(BS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(20 + BS[i] - TITLE)} volume={(f) => dB(-21.5) * interpolate(f, [0, 20, n - 20, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
