// Dashcam #02 — Khayelitsha, Cape Town, Fri 9 Apr 2021 13:12: three men run at a car stopped beside an oncoming bus; the driver reverses
// hard, turns round and gets away. One source: the car's own front dashcam (CH1, GPS/speed/date stamp) via Anton Koen (jpMZLKfWE3w),
// 586x480 @17 fps, 30.3 s, whole clip; its audio is only hiss (-57 dB), so the raw runs on a low real engine bed + tyre SFX.
// media/main.mp4 = 16:9 crop (y 148-478, stamp kept) at 30 fps; graded/main60.mp4 = the same crop motion-interpolated to 60 fps
// (slow shots); graded/full.mp4 = the whole 4:3 picture (SpeedStamp).
// VO = one take (CASE02.mp3, no count word), split only at the one raw:
//   A take 0-38.39 @4.00 | RAW src 3.03-23.03 @42.39-62.39 (car halts beside the bus, two men run at the driver's side, the man in red
//   raises his arm, the car reverses away with him following, the tight reverse turn) | B take 38.39-end @62.39, VO ends 82.73, hold to 83.6.
// Stills: 2018 aerial of Khayelitsha (Kno-Biesdorf, CC BY-SA 4.0), Khayelitsha at the N2 (Olga Ernst, CC BY-SA 4.0), EOX Sentinel-2
// cloudless 2016 (CC BY 4.0) at the camera's GPS. Page: Swisher Post (capture_page.py, Nov 2026).
// Devices: SpeedStamp (the camera's own speed readout), VergeLight (shade + pool on the verge before the raw), PaperBands (news page bands over
// the slow replay). Brand: TitleCard, RedLabel, Aerial.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { SpeedStamp } from "../dev/DC02_SpeedStamp";
import { VergeLight } from "../dev/DC02_VergeLight";
import { PaperBands } from "../dev/DC02_PaperBands";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4", M60 = GR + "main60.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const VO0 = 4.0, SPLIT = 38.39, RAW_A = VO0 + SPLIT, RAW_B = RAW_A + 20.0, END = 83.6;
export const DUR = F(END);

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const T = (take: number) => VO0 + take;            // take time -> timeline (part A)
const TB = (take: number) => RAW_B + take - SPLIT; // part B

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: T(0), b: T(7.18), vo: "Khayelitsha is one of the largest townships in South Africa, out on the Cape Flats about 19 miles from central Cape Town. (aerial photo over the township to False Bay)",
    node: (n) => <Still src={GR + "luftbild.jpg"} n={n} s0={1.04} s1={1.16} fx={0.45} fy={0.6} />, over: <RedLabel text="KHAYELITSHA, CAPE TOWN" at={F(0.8)} hold={F(5.6)} /> },
  { a: T(7.18), b: T(13.3), vo: "Just after one in the afternoon on Friday, April 9, 2021, a car was driving down one of its roads, past corrugated iron shacks (shacks by the N2)",
    node: (n) => <Still src={GR + "n2.jpg"} n={n} s0={1.03} s1={1.13} fx={0.62} fy={0.55} /> },
  { a: T(13.3), b: T(19.83), vo: "and people walking on the verges, near the area known as Site B. (Sentinel-2: box on the camera's GPS point)",
    node: () => <Aerial src={GR + "cape.jpg"} iw={1792} ih={1792} spot={[1323, 993, 1413, 1053]} z0={1.55} z1={2.15} boxAt={F(1.2)} labelAt={F(4.6)} label="SITE B, KHAYELITSHA" /> },
  { a: T(19.83), b: T(24.82), vo: "The camera's stamp reads 36 kilometers an hour, about 22 miles an hour. (SpeedStamp)",
    node: () => <SpeedStamp src={GR + "full.mp4"} t={0.05} ar={586 / 480} focus={[0.62, 0.86]} zoom={2.05} rule={[0.69, 0.82, 0.905]} pushAt={6} pushLen={70} ruleAt={64} /> },
  { a: T(24.82), b: T(30.93), vo: "A green and white bus is coming the other way, and the driver slows almost to a stop to let it squeeze past. (0.43x, the bus grows)",
    node: (n) => <Cam src={M60} from={0.4} rate={0.43} keys={K(n, [1.22, 0.6, 0.48], [1.08, 0.55, 0.5])} /> },
  { a: T(30.93), b: T(38.39), vo: "It's lunchtime on a busy street, and that's what makes this so hard to believe. Look at the edge of the road as the car halts beside the bus. (VergeLight)",
    node: (n) => <VergeLight src={M} t={3.03} keys={[{ f: 0, s: 1.08, x: 0.55, y: 0.5 }, { f: 40, s: 1.08, x: 0.55, y: 0.5 }, { f: n - 60, s: 1.3, x: 0.28, y: 0.42 }, { f: n - 8, s: 1.0, x: 0.5, y: 0.5 }]}
      pool={{ x: 0.2, y: 0.4, rx: 0.2, ry: 0.11, rot: 18 }} inAt={110} inLen={30} outAt={n - 34} outLen={26} /> },
  // RAW: the stop, the men at the driver's side, the reverse and the turn (silent source: engine bed + tyres)
  { a: RAW_A, b: RAW_B, vo: "RAW (src 3.03-23.03)",
    node: (n) => <Cam src={M60} from={3.03} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 75, s: 1.0, x: 0.5, y: 0.5 }, { f: 120, s: 1.16, x: 0.36, y: 0.56 }, { f: 210, s: 1.16, x: 0.38, y: 0.56 }, { f: 300, s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: RAW_B, b: TB(50.55), vo: "A local news site said three armed men ran at the car from both sides ... barrel of a gun. He didn't wait to find out what came next. It's over in about five seconds. (0.5x replay + PaperBands)",
    node: (n) => (
      <PaperBands page={GR + "swisher.png"} pw={1720} ph={520} head={{ y0: 26, y1: 130 }} kb={{ y0: 392, y1: 520 }} credit="SWISHER POST · APRIL 29, 2021" width={1500}
        headAt={8} keyAt={44} sweepAt={78} outAt={F(7.4)}>
        <Cam src={M60} from={5.3} rate={0.5} keys={[{ f: 0, s: 1.2, x: 0.4, y: 0.5 }, { f: F(7.0), s: 1.3, x: 0.36, y: 0.5 }, { f: n, s: 1.04, x: 0.5, y: 0.5 }]} />
      </PaperBands>) },
  { a: TB(50.55), b: END, vo: "The clip surfaced two weeks later on the channel of a South African anti-hijacking trainer, under the title \"Alert driver escapes carjacking.\" (driving away)",
    node: (n) => <Cam src={M60} from={22.9} rate={0.8} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.46])} /> },
];

const CUTS: FxCut[] = [
  { at: F(T(0)), kind: "glitch", len: 10 },
  { at: F(T(19.83)), kind: "glitch", len: 10 },  // aerial -> the camera
  { at: F(T(24.82)), kind: "blurDip", len: 10 }, // 4:3 hold -> 16:9 slow (same camera)
  { at: F(RAW_B), kind: "blurDip", len: 14 },    // raw -> slow replay
  { at: F(TB(50.55)), kind: "blurDip", len: 12 },// replay -> drive-off (time jump)
];

const PART: [number, number, number | null][] = [[VO0, 0, SPLIT], [RAW_B, SPLIT, null]];
// raw bed: engine idling under the stop, tyres on the reverse and on the turn (real recordings)
const BED: [number, number, string, number][] = [[RAW_A, RAW_A + 6.9, "sfx_n2/real/car_engine_4.wav", -27], [RAW_A + 5.4, RAW_A + 10.6, "sfx_n2/real/car_engine_2.wav", -24],
  [RAW_A + 10.3, RAW_A + 17.2, "sfx_n2/real/car_engine_4.wav", -26], [RAW_A + 16.8, RAW_B, "sfx_n2/real/car_engine_2.wav", -27]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [T(19.78), "sfx_n2/glitch_01.wav", -28],
  [RAW_A + 5.55, "sfx_n2/real/tires_gravel_1.wav", -17], [RAW_A + 10.2, "sfx_n2/real/tires_gravel_1.wav", -20],
  [RAW_B + 1.3, "sfx_n2/real/paper_2.wav", -27], [RAW_B + 0.27 + 44 / 30, "sfx_n2/real/paper_3.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(VO0)} layout="none"><AbsoluteFill><TitleCard dur={F(VO0)} title="THE KHAYELITSHA AMBUSH" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 10, F(b - a) - 10, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, ~-15.5 dB (matches DC01's Music 5 at -13), ducked under the raw */}
      <Sequence from={F(VO0)} durationInFrames={F(END - VO0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + VO0;
          const duck = t < RAW_A - 0.8 || t > RAW_B + 0.6 ? 1 : t < RAW_A ? 0.3 + 0.7 * (RAW_A - t) / 0.8 : t > RAW_B ? 0.3 + 0.7 * (t - RAW_B) / 0.6 : 0.3;
          return dB(-15.5) * interpolate(t, [VO0, VO0 + 1, END - 1.6, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
