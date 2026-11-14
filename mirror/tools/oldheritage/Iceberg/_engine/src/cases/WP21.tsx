// Workplace #21 — AB Specialty Silicones, Waukegan, Illinois, Friday 3 May 2019 (~11 p.m.): an operator adds potassium hydroxide
// solution instead of the polymer Andisil XL 10, the batch overflows giving off hydrogen, the building explodes; four workers lost.
// Footage: M = C Webley (zoRaHvAuRdI, 27 subs, 608x1080 portrait night phone video from a car, the plant burning across the road;
// the filmer's own voice is muted per the cut sheet, raw sound = real fire SFX); CSB = U.S. Chemical Safety Board video 8j8EprZP4IE
// (public domain; "CSB" corner bug removed with delogo before the grade).
// VO = one take (CASE21.mp3, starts on "AB Specialty Silicones"), split once at the raw.
// RAW = M src 27.0-41.0 (14 s): the car turns the corner, the burning plant across the field.
// Blender (build/CASE21/maps/h2roof.py): the hall cut open, hydrogen gathering under the roof, the flame front, the roof lifting.
// Device: TwinDrums (two same blue drums named, red seam on "react").
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl, io } from "../dev/WP45_kit";
import { Tall } from "../dev/WP01_kit";
import { TwinDrums } from "../dev/WP21_TwinDrums";
import { H2 } from "../dev/WP21_blLabels";

const C = "case/", M = C + "graded/main.mp4", CS1 = C + "graded/csb1.mp4", CS = C + "graded/csb2.mp4";
const cs = (abs: number) => abs - 140; // CSB video second -> csb2.mp4 second
const dB = (d: number) => Math.pow(10, d / 20);
const END = 109.2;
export const DUR = F(END);

/** full-width crop of the portrait phone clip: cy = centre of the band (0..1 of the picture height), slow push */
const Wide: React.FC<{ from: number; n: number; cy: [number, number]; s0?: number; s1?: number; fx?: number; rate?: number }> = ({ from, n, cy, s0 = 1.0, s1 = 1.06, fx = 0.5, rate = 1 }) => {
  const f = useCurrentFrame(); const u = io(Math.min(1, f / n));
  const h = 1920 / (608 / 1080), y = cy[0] + (cy[1] - cy[0]) * u, s = s0 + (s1 - s0) * u;
  const top = Math.min(0, Math.max(1080 - h, 540 - y * h));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% 50%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(M)} startFrom={F(from)} playbackRate={rate} muted style={{ position: "absolute", left: 0, top, width: 1920, height: h }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** the portrait clip at full height over its blurred copy, with speed control (Tall has none) */
const Port: React.FC<{ from: number; n: number; rate: number; s0: number; s1: number; fx: number; fy: number }> = ({ from, n, rate, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n)); const W = 1080 * (608 / 1080);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(M)} startFrom={F(from)} playbackRate={rate} muted
        style={{ position: "absolute", inset: -80, width: 2080, height: 1240, objectFit: "cover", filter: "blur(34px) brightness(.5) saturate(.85)" }} />
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: 0, width: W, height: 1080, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <OffthreadVideo src={staticFile(M)} startFrom={F(from)} playbackRate={rate} muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} />
      </div>
    </AbsoluteFill>
  );
};

// timeline (s): title 0-4 | VO part 1 (take 0-10.40) @4.0 | RAW 14.8-28.8 (M src 27.0-41.0) | VO part 2 (take 10.60-end) @28.8
// (case = take + 18.2), VO ends ~108.2, hold to 109.2
const PART: [number, number, number | null][] = [[4.0, 0, 10.4], [28.8, 10.6, null]];
const RAW: [number, number] = [14.8, 28.8];
const R0 = 27.0;
const v2 = (t: number) => t + 18.2;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.75, vo: "AB Specialty Silicones, Waukegan, Illinois. May 2019. (CSB aerial of the plant)",
    node: (n) => <><Clip src={CS1} from={7.0} n={n} s0={1.02} s1={1.1} fx={0.45} fy={0.5} />
      <RedLabel text="AB SPECIALTY SILICONES · WAUKEGAN, ILLINOIS" at={6} hold={F(1.9)} size={42} /><RedLabel text="MAY 3, 2019" at={F(2.2)} hold={F(1.3)} size={44} /></> },
  { a: 7.75, b: 11.6, vo: "Late on a Friday night, a batch went wrong inside the plant, (CSB: the batch tank churning)",
    node: (n) => <Clip src={CS} from={cs(256.0)} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.45} /> },
  { a: 11.6, b: 14.8, vo: "and shortly afterwards the building exploded. (CSB: the blast)",
    node: (n) => <Clip src={CS} from={cs(329.4)} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: 14.8, b: 28.8, vo: "RAW: the filmer's car turns the corner, the plant burning across the field (M src 27.0-41.0, fire SFX)",
    node: (n) => <Tall src={M} from={R0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.45} /> },
  { a: 28.8, b: v2(13.0), vo: "The CSB found that an operator meant to add (CSB: the operator at the drums)",
    node: (n) => <Clip src={CS} from={cs(220.6)} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.45} /> },
  { a: v2(13.0), b: v2(21.79), vo: "a polymer called Andisil XL 10, and added a potassium hydroxide solution instead. The drums looked identical, and the two react. (TwinDrums)",
    node: (n) => <TwinDrums src={CS} t={92.0} n={n} a={[910, 50, 1116, 420]} b={[370, 430, 700, 940]}
      nameA="ANDISIL XL 10" nameB="POTASSIUM HYDROXIDE SOLUTION" atA={F(14.0 - 13.0)} atB={F(16.13 - 13.0)} same={F(19.44 - 13.0)} react={F(20.94 - 13.0)}
      credit="ANIMATION: U.S. CHEMICAL SAFETY BOARD" /> },
  { a: v2(21.79), b: v2(25.3), vo: "The mixture overflowed the tank, (CSB: the tank foaming over)",
    node: (n) => <Clip src={CS} from={cs(486.0)} n={n} s0={1.02} s1={1.12} fx={0.5} fy={0.45} /> },
  { a: v2(25.3), b: v2(28.79), vo: "and the workers could tell something had gone badly wrong, but not that it was giving off hydrogen. (CSB: workers walking)",
    node: (n) => <Clip src={CS} from={cs(308.2)} n={n} s0={1.08} s1={1.0} fx={0.5} fy={0.5} /> },
  { a: v2(28.79), b: v2(35.9), vo: "Two workers were told to vent the building, and it ignited before they could. The reaction gave off hydrogen, and the hydrogen ignited. (Blender h2roof)",
    node: () => <BlenderShot src={C + "maps/h2roof.mp4"} track={H2} labels={[["layer", "HYDROGEN", 92, 50, -0.08]]} /> },
  { a: v2(35.9), b: v2(39.3), vo: "Four workers didn't survive, (M: the fire, slowed)",
    node: (n) => <Tall src={M} from={70.0} n={n} s0={1.06} s1={1.16} fx={0.5} fy={0.5} /> },
  { a: v2(39.3), b: v2(41.96), vo: "the plant was destroyed, and businesses nearby were badly damaged. (CSB: the ruins from the air)",
    node: (n) => <Clip src={CS} from={cs(347.6)} n={n} s0={1.0} s1={1.07} fx={0.5} fy={0.5} /> },
  { a: v2(41.96), b: v2(46.0), vo: "In October 2019, OSHA cited the company for twelve willful violations. (M)",
    node: (n) => <><Tall src={M} from={45.0} n={n} s0={1.0} s1={1.1} fx={0.45} fy={0.5} />
      <RedLabel text="OSHA · OCTOBER 2019" at={8} hold={F(3.2)} size={44} /></> },
  { a: v2(46.0), b: v2(52.14), vo: "Willful means a violation committed with intentional disregard, or plain indifference to the law. (M wide, slowed)",
    node: (n) => <Wide from={74.8} n={n} rate={0.8} cy={[0.3, 0.34]} s0={1.0} s1={1.08} fx={0.45} /> },
  { a: v2(52.14), b: v2(57.2), vo: "OSHA found electrical equipment in the production area that wasn't approved for hazardous locations, (CSB: the production floor)",
    node: (n) => <Clip src={CS} from={cs(290.0)} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: v2(57.2), b: v2(61.79), vo: "and propane forklifts being used where flammable liquids and gases were handled. (CSB: the forklift with drums)",
    node: (n) => <Clip src={CS} from={cs(147.6)} n={n} s0={1.0} s1={1.06} fx={0.45} fy={0.5} /> },
  { a: v2(61.79), b: v2(65.4), vo: "The penalties came to one point five nine million dollars, (M: police lights on the road)",
    node: (n) => <Tall src={M} from={54.6} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.5} /> },
  { a: v2(65.4), b: v2(69.16), vo: "and the company went into OSHA's Severe Violator Enforcement Program. (M wide)",
    node: (n) => <Wide from={80.0} n={n} cy={[0.34, 0.3]} s0={1.08} s1={1.0} fx={0.5} /> },
  { a: v2(69.16), b: v2(73.7), vo: "Back on level one, Magnablend was fined forty five thousand dollars with nobody hurt. (M)",
    node: (n) => <Tall src={M} from={104.0} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.55} /> },
  { a: v2(73.7), b: v2(78.95), vo: "This fine was more than thirty times bigger, and four people paid for it first. (replay of the raw, 0.5x, pushed)",
    node: (n) => <Clip src={M} from={0} n={n} s0={1} s1={1} /> },
  { a: v2(78.95), b: v2(83.65), vo: "The CSB also found the building had no system to detect flammable gas. (CSB: the hall from above)",
    node: (n) => <Clip src={CS} from={cs(313.6)} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.5} /> },
  { a: v2(83.65), b: v2(87.0), vo: "And after an earlier explosion there in 2014, the company hadn't made the improvements it needed. (M: the fire from far off)",
    node: (n) => <Tall src={M} from={13.0} n={n} s0={1.08} s1={1.2} fx={0.55} fy={0.4} /> },
  { a: v2(87.0), b: END, vo: "Know what you're mixing. (CSB: the drums, slow push)",
    node: (n) => <Clip src={CS} from={cs(365.6)} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.5} /> },
];
// the replay shot: the raw's moment at half speed, full height, pushed in toward the fire
SHOTS[18].node = (n) => <Port from={31.0} rate={0.5} n={n} s0={1.12} s1={1.34} fx={0.5} fy={0.3} />;
SHOTS[9].node = (n) => <Port from={70.0} rate={0.7} n={n} s0={1.06} s1={1.16} fx={0.5} fy={0.5} />;

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(14.8), kind: "blurDip", len: 12 },      // VO -> raw
  { at: F(28.8), kind: "blurDip", len: 14 },      // raw -> VO
  { at: F(v2(13.0)), kind: "blurDip", len: 12 },  // into TwinDrums (same CSB sequence)
  { at: F(v2(28.79)), kind: "glitch", len: 10 },  // into Blender
  { at: F(v2(35.9)), kind: "blurDip", len: 12 },  // out of it
  { at: F(v2(41.96)), kind: "blurDip", len: 12 }, // section: OSHA
  { at: F(v2(73.7)), kind: "blurDip", len: 14 },  // the replay
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE WRONG TWO CHEMICALS" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE21.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the filmer's audio is muted (cut sheet); real fire recording + a low wind bed, faded before the VO returns */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-6) * interpolate(f, [0, 10, F(12.0) - 30, F(12.0)], [0, 1, 1, 0.6], cl)} />
        <Sequence from={F(9.0)} layout="none">
          <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} startFrom={F(2.0)} volume={(f) => dB(-6) * interpolate(f, [0, 30, F(5.0) - 16, F(5.0) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-16) * interpolate(f, [0, 12, F(14.0) - 16, F(14.0) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* the hydrogen igniting in the Blender shot: a deep boom on the flame front */}
      <Sequence from={F(v2(28.79)) + 146} durationInFrames={F(3.0)} layout="none">
        <Audio src={staticFile("sfx_n2/real/boom_5.wav")} volume={dB(-12)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18 LUFS file) at -14 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(48)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-14) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
