// Dashcam #15 — Montecito, California, early hours of 9 Jan 2018: CHP officers Will Clotworthy and Mike Fabilla, heading north on
// Olive Mill Road to a reported structure fire, are hit by a debris flow that lifts, spins and carries their cruiser. Source: the
// CHP release (25 Jan 2018) via edhat (JNl2wUIynvY), pillarboxed night dashcam, used 0-185 s. Its sound is digital silence until
// 0:61 (the hit is silent: real SFX timed to the picture), then siren/engine, shouting (70-72.5 "Get out of here!"), the radio call
// (112-131); rawclean.py removed music-like sound in 22 s (siren). The light bar flashes from 0:61 on (srccuts lists them as cuts).
// VO = one take (CASE15.mp3, no count word), split at the three raws (all at sentence ends):
//   A 0-36.01 @4.00 | R1 40.01-60.81 (src 1.2-22.0, main: the flow hits, the car turns, branches on the glass, carried in the dark) |
//   B 36.01-57.82 @60.81 | R2 82.62-101.82 (src 111.8-131.0: the radio call that got through) | C 57.82-76.35 @101.82 |
//   R3 120.35-133.35 (src 63.5-76.5: lights on, "Get out of here!") | D 76.35-end @133.35, VO ends 159.6, hold to 160.5.
// Devices: NorthLine (NAIP), DarkAhead (held first frame), ColumnDrop (KSBY page); brand ThenNow (NASA EO Landsat Nov 2017 / Jan 2018).
// Stills: USGS NAIP (PD), NASA Earth Observatory 91573 Landsat 8 (PD), DVIDS 4086279 / 4086280 (USACE) and 4073956 / 4071736
// (California National Guard) — US government works, public domain.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, ThenNow, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { DarkAhead } from "../dev/DC15_DarkAhead";
import { NorthLine } from "../dev/DC15_NorthLine";
import { ColumnDrop } from "../dev/DC15_ColumnDrop";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main169.mp4"; // graded CHP picture cropped out of its pillarbox (x 262-1654, y 148-931) to 16:9, no side bars
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(160.5);
const OB = 24.80, OC = 44.0, OD = 57.0;   // VO parts B, C, D: timeline = take time + offset
// keys were set on the pillarboxed frame: map them onto the cropped picture (crop x 262-1654, y 148-931 of 1920x1080)
const T = (k: CK[]): CK[] => k.map((c) => ({ f: c.f, s: Math.max(1, c.s / 1.379), x: (c.x * 1920 - 262) / 1392, y: (c.y * 1080 - 148) / 783 }));
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => T([{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }]);
const LIFT = "brightness(1.9) contrast(1.15)"; // the near-black carried section, lifted so the branches read

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.6, vo: "In the early hours of January 9, 2018, two California Highway Patrol officers (their dashcam, lights on, right of the light-bar glare)",
    node: (n) => <Cam src={M} from={86.0} keys={K(n, [1.45, 0.66, 0.5], [1.55, 0.68, 0.5])} />, over: <RedLabel text="JANUARY 9, 2018" at={F(0.6)} hold={F(4.2)} /> },
  { a: 9.6, b: 15.51, vo: "were driving north up Olive Mill Road in Montecito, California, on their way to a reported structure fire. (NorthLine)",
    node: () => <NorthLine src={GR + "naip.jpg"} iw={3200} ih={1800} drawAt={18} drawLen={110}
      path={[[1600, 1170], [1597, 1124], [1587, 1028], [1584, 947], [1576, 919], [1564, 900], [1559, 875], [1555, 816], [1554, 732], [1553, 694], [1547, 652], [1543, 630]]}>
      <RedLabel text="OLIVE MILL ROAD, MONTECITO" at={F(1.6)} hold={F(4.0)} />
    </NorthLine> },
  { a: 15.51, b: 20.49, vo: "A month earlier, the Thomas Fire had burned the hills above the town down to bare soil. (ThenNow: Landsat, Nov 2017 -> Jan 2018)",
    node: () => <ThenNow then={GR + "eo_then.jpg"} now={GR + "eo_now.jpg"} iw={3200} ih={1800} focus={[1100, 1150]} at={F(1.6)} len={34} z0={1.15} z1={1.3} thenLabel="NOVEMBER 2017" nowLabel="JANUARY 2018" /> },
  { a: 20.49, b: 27.79, vo: "Now a storm was sitting over those hills ... half an inch of rain fell in roughly five minutes. (rain in the cruiser's lights)",
    node: (n) => <Cam src={M} from={140.0} keys={K(n, [1.5, 0.66, 0.55], [1.62, 0.66, 0.6])} /> },
  { a: 27.79, b: 30.59, vo: "The officers were Will Clotworthy and Mike Fabilla. (their dashcam)",
    node: (n) => <Cam src={M} from={134.0} keys={K(n, [1.35, 0.7, 0.5], [1.42, 0.7, 0.5])} />, over: <RedLabel text="WILL CLOTWORTHY · MIKE FABILLA" at={F(0.3)} hold={F(2.3)} size={42} /> },
  { a: 30.59, b: 40.01, vo: "There's nothing on their dashcam but a wet road and a yellow warning sign ... / Look past that sign, into the dark stretch beyond it. (DarkAhead)",
    node: (n) => <DarkAhead src={M} t={1.2} pool={[0.473, 0.335, 0.21, 0.18]} at={F(2.14)} backAt={n - 40}
      keys={T([{ f: 0, s: 1.4, x: 0.5, y: 0.5 }, { f: F(2.0), s: 1.6, x: 0.52, y: 0.42 }, { f: F(5.5), s: 2.1, x: 0.49, y: 0.39 }, { f: n - 40, s: 2.2, x: 0.48, y: 0.39 }, { f: n - 4, s: 1.38, x: 0.5, y: 0.5 }])} /> },
  // RAW 1 (main): src 1.2-22.0 — the flow comes out of the dark, hits, the car turns, trees sweep past, branches against the glass,
  // then carried in the dark. Silent source: rain bed + rumble + impacts timed to the picture.
  { a: 40.01, b: 60.81, vo: "RAW 1 (src 1.2-22.0)", node: (n) => <Cam src={M} from={1.2} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(12), s: 1.04, x: 0.5, y: 0.5 }, { f: n, s: 1.18, x: 0.5, y: 0.55 }]} filter="brightness(1.15)" /> },
  { a: 36.01 + OB, b: 38.27 + OB, vo: "What hit them is called a debris flow. (0.5x replay, the car turning in the mud)",
    node: (n) => <Cam src={M} from={5.0} rate={0.5} keys={K(n, [1.5, 0.5, 0.55], [1.7, 0.5, 0.58])} filter="brightness(1.3)" /> },
  { a: 38.27 + OB, b: 42.07 + OB, vo: "It's mud carrying boulders and whole trees down off burned slopes. (DVIDS: boulders in a Montecito front yard)",
    node: (n) => <Still src={GR + "yard.jpg"} n={n} s0={1.04} s1={1.14} fx={0.55} fy={0.62} /> },
  { a: 42.07 + OB, b: 48.24 + OB, vo: "It lifted the cruiser off the road, and for about 15 seconds the two of them were floating down the street inside it. (carried, lifted)",
    node: (n) => <Cam src={M} from={22.0} keys={K(n, [1.25, 0.5, 0.55], [1.4, 0.5, 0.55])} filter={LIFT} /> },
  { a: 48.24 + OB, b: 52.64 + OB, vo: "Clotworthy grabbed the radio, but at first the signal was too weak to get through. (the dark windscreen)",
    node: (n) => <Cam src={M} from={34.0} keys={K(n, [1.6, 0.45, 0.6], [1.7, 0.45, 0.6])} filter={LIFT} /> },
  { a: 52.64 + OB, b: 57.82 + OB, vo: "Fabilla said he was trying to tell them they were in a mudslide, floating down Olive Mill Road. (still carried)",
    node: (n) => <Cam src={M} from={46.0} keys={K(n, [1.3, 0.55, 0.5], [1.38, 0.55, 0.52])} filter={LIFT} /> },
  // RAW 2: the call that got through — "a very active mudslide coming down Olive Mill towards the 101 ... It overtook our vehicle as we
  // were heading north on Olive Mill ... barely escape ... down by the freeway now ... a lot of debris ... near the freeway very shortly"
  { a: 82.62, b: 101.82, vo: "RAW 2 (src 111.8-131.0)", node: (n) => <Cam src={M} from={111.8} keys={K(n, [1.25, 0.64, 0.5], [1.32, 0.64, 0.52])} /> },
  { a: 57.82 + OC, b: 63.45 + OC, vo: "I can't picture keeping it together enough to work a radio in a car that's floating, and Clotworthy kept at it.",
    node: (n) => <Cam src={M} from={138.0} keys={K(n, [1.6, 0.68, 0.52], [1.7, 0.68, 0.55])} /> },
  { a: 63.45 + OC, b: 68.0 + OC, vo: "They didn't head for safety, either. With lights and siren on, (driving out, lights on)",
    node: (n) => <Cam src={M} from={84.0} keys={K(n, [1.45, 0.66, 0.5], [1.55, 0.66, 0.5])} /> },
  { a: 68.0 + OC, b: 73.40 + OC, vo: "they drove down toward the 101 freeway and radioed a warning that a very active mudslide was coming down Olive Mill.",
    node: (n) => <Cam src={M} from={93.0} keys={K(n, [1.4, 0.7, 0.52], [1.5, 0.7, 0.5])} /> },
  { a: 73.40 + OC, b: 76.35 + OC, vo: "One of them got out and shouted at people to get inside. (an officer in rain gear out in the road)",
    node: (n) => <Cam src={M} from={151.5} keys={K(n, [1.45, 0.62, 0.5], [1.55, 0.62, 0.5])} /> },
  // RAW 3: lights on, siren, "Get out of here! Get out of here! Get out of here! Go! Go!"
  { a: 120.35, b: 133.35, vo: "RAW 3 (src 63.5-76.5)", node: (n) => <Cam src={M} from={63.5} keys={K(n, [1.3, 0.66, 0.5], [1.36, 0.66, 0.52])} /> },
  { a: 76.35 + OD, b: 79.30 + OD, vo: "Both men stayed on duty for nearly 24 hours. (officer in the water at the roadblock)",
    node: (n) => <Cam src={M} from={176.0} keys={K(n, [1.45, 0.64, 0.55], [1.52, 0.64, 0.55])} /> },
  { a: 79.30 + OD, b: 82.51 + OD, vo: "By daylight, the debris flows had torn through Montecito. (DVIDS: a Montecito street under mud)",
    node: (n) => <Still src={GR + "street.jpg"} n={n} s0={1.03} s1={1.1} fx={0.5} fy={0.6} /> },
  { a: 82.51 + OD, b: 88.56 + OD, vo: "Nobody died in this shot, but 23 people died in them that morning, and one of them has never been found. (DVIDS: boulders, a buried truck)",
    node: (n) => <Still src={GR + "truck.jpg"} n={n} s0={1.05} s1={1.14} fx={0.3} fy={0.55} /> },
  { a: 88.56 + OD, b: 92.62 + OD, vo: "The 101 stayed shut under mud until January 21. (DVIDS: a closed road under mud at dusk)",
    node: (n) => <Still src={GR + "closed.jpg"} n={n} s0={1.03} s1={1.1} fx={0.45} fy={0.5} /> },
  { a: 92.62 + OD, b: 100.13 + OD, vo: "A year later, Fabilla described the moment in the plainest words possible. He'd tried telling his partner to slow down, slow down, (ColumnDrop: KSBY)",
    node: (n) => <ColumnDrop bg={M} bgFrom={2.0} bgKeys={K(n, [1.1, 0.5, 0.5], [1.15, 0.5, 0.45])} sheet={GR + "ksby_sheet.png"} sw={2000} sh={1056}
      quote={[205, 918, 1450, 975]} sinkAt={F(3.4)} sinkLen={F(2.4)} /> },
  { a: 100.13 + OD, b: 160.5, vo: "and all of a sudden it just hit them. (0.5x replay: the road ahead, the flow arriving on 'hit')",
    node: (n) => <Cam src={M} from={2.91} rate={0.5} keys={K(n, [1.25, 0.49, 0.42], [1.6, 0.48, 0.4])} filter="brightness(1.25)" /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.6), kind: "glitch", len: 10 },     // into the aerial
  { at: F(15.51), kind: "blurDip", len: 12 },
  { at: F(20.49), kind: "glitch", len: 10 },   // back to the dashcam
  { at: F(27.79), kind: "blurDip", len: 10 },
  { at: F(30.59), kind: "blurDip", len: 12 },  // -> held first frame
  { at: F(60.81), kind: "blurDip", len: 14 },  // raw -> replay
  { at: F(38.27 + OB), kind: "glitch", len: 10 },
  { at: F(42.07 + OB), kind: "glitch", len: 10 },
  { at: F(48.24 + OB), kind: "blurDip", len: 10 },
  { at: F(52.64 + OB), kind: "blurDip", len: 10 },
  { at: F(82.62), kind: "blurDip", len: 12 },
  { at: F(101.82), kind: "blurDip", len: 12 },
  { at: F(63.45 + OC), kind: "blurDip", len: 10 },
  { at: F(68.0 + OC), kind: "blurDip", len: 10 },
  { at: F(73.40 + OC), kind: "blurDip", len: 10 },
  { at: F(120.35), kind: "blurDip", len: 12 },
  { at: F(133.35), kind: "blurDip", len: 12 },
  { at: F(79.30 + OD), kind: "glitch", len: 10 },  // daylight
  { at: F(82.51 + OD), kind: "blurDip", len: 10 },
  { at: F(88.56 + OD), kind: "blurDip", len: 10 },
  { at: F(92.62 + OD), kind: "blurDip", len: 12 }, // into the page
  { at: F(100.13 + OD), kind: "glitch", len: 10 }, // back to that night
];

const PART: [number, number, number | null][] = [[4.0, 0, 36.01], [60.81, 36.01, 57.82], [101.82, 57.82, 76.35], [133.35, 76.35, null]];
// raws: [timeline a, b, src s, gain dB, music duck]; R1's source is silent (its bed is the SFX below)
const RAWS: [number, number, number, number, number][] = [[40.01, 60.81, 1.2, -60, 0.25], [82.62, 101.82, 111.8, -1, 0.1], [120.35, 133.35, 63.5, -14, 0.1]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [9.55, "sfx_n2/glitch_01.wav", -28], [20.44, "sfx_n2/glitch_03.wav", -28],
  // RAW 1, timed to the picture (src = t - 38.81)
  [42.3, "sfx_n2/real/sub_drop_1.wav", -18], [42.6, "sfx_n2/real/impact_2.wav", -16], [43.3, "sfx_n2/real/boom_5.wav", -20], [45.6, "sfx_n2/real/impact_3.wav", -20],
  [47.2, "sfx_n2/real/metal_clank_2.wav", -24], [51.0, "sfx_n2/real/metal_clank_4.wav", -24], [52.4, "sfx_n2/real/impact_1.wav", -22], [55.5, "sfx_n2/real/metal_clank_3.wav", -28],
  [38.27 + OB - 0.05, "sfx_n2/glitch_01.wav", -30], [42.07 + OB - 0.05, "sfx_n2/glitch_02.wav", -30], [79.30 + OD - 0.05, "sfx_n2/glitch_03.wav", -28],
  [92.65 + OD, "sfx_n2/real/paper_3.wav", -26], [100.13 + OD - 0.05, "sfx_n2/glitch_01.wav", -28], [101.7 + OD, "sfx_n2/real/impact_2.wav", -20],
];
// rain + low roar of the flow under the silent raw, rain under the carried-in-the-dark lines
const BED: [number, number, string, number][] = [
  [40.01, 60.81, "sfx_n2/real/rain_9.wav", -18], [42.2, 58.0, "sfx_n2/real/wind_gust_1.wav", -22],
  [61.0, 82.62, "sfx_n2/real/rain_3.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="MUDSLIDE ON OLIVE MILL ROAD" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.filter((r) => r[3] > -50).map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 18, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1 (~-15.5 dB), ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={DUR - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(12)} loop volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-15.5) * interpolate(t, [4.0, 5.0, 159.0, 160.5], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
