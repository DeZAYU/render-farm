// Dashcam #03 — outside Calais, France, Tue 6 Sep 2016 22:04: on the raised port road a lorry's high dashcam meets branches and a tree top
// across both lanes; a crowd climbs over the concrete barrier and fills the road round the cab; the lorry stops, then rolls on through.
// One source: QMAgSp3Yfj8 (Sonal Sehgal repost, filmer not traced), 1280x720 30 fps, 34.75 s, whole clip; the sound is the cab's own
// (engine, voices outside; rawclean.py: no music). graded/main60.mp4 = motion-interpolated 60 fps copy for slow shots.
// VO = one take (CASE03.mp3, no count word), split at the two raws (both at sentence ends):
//   A take 0-44.02 @4.00 | RAW 1 src 4.98-19.48 @48.02-62.52 (figures on the barrier, the tangle across the lanes, the lorry stops, the crowd
//   climbs over and fills the road) | B take 44.02-60.86 @62.52 | RAW 2 src 19.48-26.48 @79.36-86.36 (the crowd thins and scatters, the
//   lorry starts rolling toward the tree top) | C take 60.86-end @86.36, VO ends 94.08, hold to 94.9.
// Handle with care: no freeze on individuals (frozen frames used: the empty road only); "a crowd", no motive claims; the Mick Young attack
// is shown only as the real Wikipedia row (a different truck, March 2016).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { StampFold } from "../dev/DC03_StampFold";
import { TwoDates } from "../dev/DC03_TwoDates";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4", M60 = GR + "main60.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const VO0 = 4.0, S1 = 44.02, S2 = 60.86;
const R1A = VO0 + S1, R1B = R1A + 14.5, R2A = R1B + (S2 - S1), R2B = R2A + 7.0, END = R2B + (68.58 - S2) + 0.82;
export const DUR = F(END);

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];
const T = (t: number) => VO0 + t, TB = (t: number) => R1B + t - S1, TC = (t: number) => R2B + t - S2;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: T(0), b: T(13.39), vo: "This camera sits high in the cab of a truck, ... September 6, 2016. It's on the raised road that carries freight into Calais ... ferries to Britain. (StampFold)",
    node: () => <StampFold src={M} t={0.05} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 18, s: 1.0, x: 0.5, y: 0.5 }, { f: 120, s: 3.0, x: 0.18, y: 0.07 }, { f: 400, s: 3.1, x: 0.18, y: 0.07 }]}
      rule={[0.052, 0.315, 0.066]} ruleAt={104} foldAt={F(6.46)} foldLen={34}
      sat={GR + "cal14.jpg"} iw={2304} ih={2304} gps={[1209, 1138, 1265, 1194]} port={[770, 570, 880, 670]} z0={1.0} z1={1.22} driftAt={F(6.46) + 96} label="CALAIS, FRANCE" /> },
  { a: T(13.39), b: T(18.30), vo: "For a few seconds there's nothing on screen but an empty curve and a concrete barrier.",
    node: (n) => <Cam src={M60} from={0.05} rate={0.5} keys={K(n, [1.12, 0.45, 0.5], [1.22, 0.4, 0.48])} /> },
  { a: T(18.30), b: T(26.60), vo: "That year, thousands of people were living in a camp outside town known as the Jungle, ... hidden in the back of trucks. (camp, 2015)",
    node: (n) => <Still src={GR + "camp.jpg"} n={n} s0={1.03} s1={1.14} fx={0.62} fy={0.5} />, over: <RedLabel text="THE JUNGLE, CALAIS · 2015" at={F(0.8)} hold={F(5.5)} /> },
  { a: T(26.60), b: T(31.97), vo: "Branches dragged into the lanes were a known way to make a driver stop long enough to climb aboard. (0.45x: the tree top across the lane)",
    node: (n) => <Cam src={M60} from={26.8} rate={0.45} keys={K(n, [1.25, 0.42, 0.62], [1.4, 0.45, 0.6])} /> },
  { a: T(31.97), b: T(38.07), vo: "The day before this was filmed, truckers had joined farmers in blocking the highway to demand the camp be shut. (Calais from above, the day before)",
    node: () => <Aerial src={GR + "cal12.jpg"} iw={1792} ih={1792} spot={[560, 700, 1100, 940]} z0={1.1} z1={1.3} boxAt={F(0.8)} labelAt={F(1.4)} label="CALAIS · SEPTEMBER 5, 2016" /> },
  { a: T(38.07), b: T(44.02), vo: "The thing to watch is the top of that concrete barrier, and the dark tangle lying across both lanes. (0.4x, easing toward the barrier top)",
    node: (n) => <Cam src={M60} from={2.6} rate={0.4} keys={[{ f: 0, s: 1.15, x: 0.45, y: 0.45 }, { f: n - 40, s: 1.3, x: 0.42, y: 0.38 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: R1A, b: R1B, vo: "RAW 1 (src 4.98-19.48)", node: (n) => <Cam src={M} from={4.98} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(5), s: 1.06, x: 0.45, y: 0.45 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: R1B, b: TB(55.91), vo: "Online, this clip usually gets told with another story attached ... badly cut. That's a different attack on a different truck, months earlier. (TwoDates)",
    node: () => <TwoDates bg={M60} bgFrom={9.0} row={GR + "row.png"} rw={1510} rh={690} dateCell={[0, 300, 160, 420]} keyLines={[1045, 386, 1505, 590]}
      stampSrc={M} stampT={2.0} stampBox={[64, 22, 412, 74]} panAt={70} dimAt={150} splitAt={F(52.64 - S1)} /> },
  { a: TB(55.91), b: R2A, vo: "In this one, nobody's seen throwing anything at the cab, and the glass doesn't break. (0.5x, the crowd round the cab)",
    node: (n) => <Cam src={M60} from={15.0} rate={0.5} keys={K(n, [1.05, 0.5, 0.55], [1.2, 0.5, 0.6])} /> },
  { a: R2A, b: R2B, vo: "RAW 2 (src 19.48-26.48)", node: (n) => <Cam src={M} from={19.48} keys={K(n, [1.0, 0.5, 0.5], [1.05, 0.5, 0.5])} /> },
  { a: R2B, b: END, vo: "So who was behind the wheel, and did anyone get into the trailer? Nobody's ever reported either. Seven weeks later the Jungle was cleared. (0.63x, the empty road on)",
    node: (n) => <Cam src={M60} from={29.2} rate={0.63} keys={K(n, [1.05, 0.5, 0.5], [1.18, 0.55, 0.45])} /> },
];

const CUTS: FxCut[] = [
  { at: F(T(0)), kind: "glitch", len: 10 },
  { at: F(T(13.39)), kind: "glitch", len: 10 },  // satellite -> the road
  { at: F(T(18.30)), kind: "glitch", len: 10 },  // -> the camp
  { at: F(T(31.97)), kind: "glitch", len: 10 },  // footage -> the aerial
  { at: F(T(38.07)), kind: "glitch", len: 10 },  // aerial -> back on the road
  { at: F(R1B), kind: "blurDip", len: 12 },      // raw -> the page
  { at: F(TB(55.91)), kind: "blurDip", len: 12 },// page -> replay
  { at: F(R2A), kind: "blurDip", len: 10 },      // replay -> raw 2 (same camera)
  { at: F(R2B), kind: "blurDip", len: 12 },      // raw 2 -> the road on
];

const PART: [number, number, number | null][] = [[VO0, 0, S1], [R1B, S1, S2], [R2B, S2, null]];
const RAWS: [number, number, number, number, number][] = [[R1A, R1B, 4.98, 0, 0.25], [R2A, R2B, 19.48, -9, 0.2]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [T(6.46) + 0.1, "sfx_n2/whoosh_02.wav", -30], [T(13.34), "sfx_n2/glitch_01.wav", -28], [T(18.25), "sfx_n2/glitch_03.wav", -30],
  [T(31.92), "sfx_n2/glitch_02.wav", -30], [T(38.02), "sfx_n2/glitch_01.wav", -30], [R1B + 0.1, "sfx_n2/real/paper_2.wav", -28], [TB(52.64), "sfx_n2/real/paper_3.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(VO0)} layout="none"><AbsoluteFill><TitleCard dur={F(VO0)} title="THE CALAIS BRANCH ROADBLOCK" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-20 dB (Music 3 is ~7 LU hotter than Music 5), ducked under the raws */}
      <Sequence from={F(VO0)} durationInFrames={F(END - VO0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30 + VO0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-20) * interpolate(t, [VO0, VO0 + 1, END - 1.6, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
