// Dashcam #13: The Challenger in Keller. June 2016, night, Keller, Texas (I-35W). The filmer ("Bear With Hat", anonymous) is followed by a
// white car (he believed a Dodge Challenger), which stops in front of him in a turning lane; men get out; he swerves round them and away.
// One source: the filmer's own upload P3iVn0CqRLI (phone held at the windscreen, 1920x1080 ~30 fps, original sound: engine, no music,
// no speech; rawclean.py: none found). No plate is legible. Men never identified: no "carjacker".
// VO = one take (CASE13.mp3, no count word), split only at the one raw:
//   A take 0-39.37 @4.00 | RAW T 43.37-63.37 (src 30.31-50.31: the car waiting, both doors open, the swerve round them, the dark escape,
//   passing close by the white car's side) | B take 39.37-end @63.37, VO ends ~96.1, hold to 97.1.
// The shot before the raw runs the same clip straight into it (src 28.0 -> 30.31).
// Devices: NightLift (held frame, night lifted round the man beside the car), TitleLift (the filmer's real YouTube page: title, then views).
// Aerial: USGS NAIP (public domain) of I-35W at the north Fort Worth / Keller edge: the corridor only; the filmer never named the exit,
// so no route is drawn and no hospital is boxed.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, ScarTrace, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { NightLift } from "../dev/DC13_NightLift";
import { TitleLift } from "../dev/DC13_TitleLift";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(97.1);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

/** the phone clip with its exposure lifted once the picture drops into the dark (after the swerve): brightness ramps lo -> hi
 *  between shot-local seconds r0 and r1 (the clip is near-black there; the lift only makes what was filmed visible) */
const LiftCam: React.FC<{ from: number; rate?: number; keys: CK[]; r0: number; r1: number; lo?: number; hi?: number }> = ({ from, rate = 1, keys, r0, r1, lo = 1, hi = 1.9 }) => {
  const f = useCurrentFrame(); const b = r1 > r0 ? interpolate(f / 30, [r0, r1], [lo, hi], cl) : lo;
  return <Cam src={M} from={from} rate={rate} keys={keys} filter={`brightness(${b.toFixed(3)}) contrast(1.06)`} />;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 12.94, vo: "A YouTuber who goes by Bear With Hat was leaving a friend's house in Keller, Texas, one night in June 2016 when he noticed a white car close behind him.",
    node: (n) => <Cam src={M} from={18.0} keys={K(n, [1.0, 0.5, 0.5], [1.14, 0.49, 0.62])} />, over: <RedLabel text="KELLER, TEXAS · JUNE 2016" at={F(3.4)} hold={F(3.8)} /> },
  { a: 12.94, b: 15.08, vo: "He thought it was a Dodge Challenger. (tight on the white car)", node: (n) => <Cam src={M} from={12.0} keys={K(n, [2.1, 0.49, 0.7], [2.3, 0.49, 0.7])} /> },
  { a: 15.08, b: 22.4, vo: "So he tested it. He signaled for the Interstate 35W on-ramp and cut onto the service road at the last second, (I-35W traced on NAIP)",
    node: () => <ScarTrace src={GR + "naip.jpg"} iw={2400} ih={1350} path={[[1250, 1350], [1262, 1000], [1275, 700], [1310, 450], [1374, 222]]} at={F(1.4)} len={F(4.2)} z0={1.08} z1={1.22} label="INTERSTATE 35W" labelAt={F(2.2)} /> },
  { a: 22.4, b: 30.37, vo: "but at the next overpass the white car was already waiting at the light. He made a U-turn and pulled over, and it pulled over right behind him.",
    node: () => <Aerial src={GR + "naip.jpg"} iw={2400} ih={1350} spot={[1290, 192, 1452, 258]} z0={1.75} z1={1.55} boxAt={6} label="NEAR KELLER, TEXAS" labelAt={F(1.2)} /> },
  { a: 30.37, b: 35.54, vo: "When he stopped in a turning lane outside a hospital, the white car stopped right in front of him. (the lane, the turn sign, the car)",
    node: (n) => <Cam src={M} from={0.5} keys={K(n, [1.12, 0.42, 0.6], [1.26, 0.45, 0.62])} /> },
  { a: 35.54, b: 41.06, vo: "He didn't have a dashcam, so he held up his phone, hoping to catch a plate for a 911 call. (the windscreen, wide)",
    node: (n) => <Cam src={M} from={6.0} keys={K(n, [1.0, 0.5, 0.5], [1.07, 0.5, 0.56])} /> },
  { a: 41.06, b: 43.37, vo: "Watch the passenger side of the white car. (runs straight into the raw)", node: (n) => <Cam src={M} from={28.0} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  // RAW: doors open, a man beside the car, the swerve, dark escape, past the white car's side
  { a: 43.37, b: 63.37, vo: "RAW (src 30.31-50.31)", node: (n) => <LiftCam from={30.31} r0={4.4} r1={5.8} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(3.0), s: 1.12, x: 0.46, y: 0.62 }, { f: F(5.5), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 63.37, b: 70.65, vo: "He said later that he swung out so close he'd have hit the passenger, the man standing beside the car, if he hadn't jumped clear. (NightLift)",
    node: (n) => <NightLift src={M} from={34.2} rate={0.4} holdAt={35.0} spot={[0.4, 0.76]} r={[0.09, 0.16]} liftAt={F(2.6)}
      keys={[{ f: 0, s: 1.15, x: 0.46, y: 0.66 }, { f: F(2.0), s: 1.3, x: 0.44, y: 0.7 }, { f: n, s: 2.1, x: 0.41, y: 0.74 }]} /> },
  { a: 70.65, b: 74.39, vo: "The phone fell to the floor, and that's why the picture goes dark.", node: (n) => <LiftCam from={51.0} r0={0} r1={0} lo={1.3} keys={K(n, [1.0, 0.5, 0.5], [1.06, 0.5, 0.5])} /> },
  { a: 74.39, b: 83.6, vo: "He got away unhurt. His video's title asks whether it was an attempted carjacking. Close to half a million people have watched it, and nobody's ever answered that. (TitleLift)",
    node: (n) => <TitleLift card={GR + "yt_block.png"} cw={1800} ch={405} bg={M} bgFrom={2.0} title={[24, 8, 780, 70]} views={[46, 214, 340, 258]} titleAt={F(1.6)} viewsAt={F(4.9)} dur={n} /> },
  { a: 83.6, b: 85.1, vo: "So why did they give up? (the white car's tail lights)", node: (n) => <Cam src={M} from={14.0} keys={K(n, [1.7, 0.49, 0.7], [1.85, 0.49, 0.7])} /> },
  { a: 85.1, b: 86.93, vo: "With his phone rolling around the floor,", node: (n) => <LiftCam from={58.0} r0={0} r1={0} lo={1.9} keys={K(n, [1.05, 0.5, 0.6], [1.12, 0.5, 0.62])} /> },
  { a: 86.93, b: 92.28, vo: "he still had the sense to head for a grocery store where he knew a police officer often parked. (0.6x: lights streaking past as he drives off)",
    node: (n) => <LiftCam from={39.2} rate={0.6} r0={0} r1={0} lo={1.9} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.55, 0.48])} /> },
  { a: 92.28, b: 97.1, vo: "The moment the white car saw where he was going, it peeled away. (0.5x: the white car's side going past)",
    node: (n) => <LiftCam from={46.6} rate={0.5} r0={0} r1={0} lo={1.9} keys={K(n, [1.1, 0.5, 0.55], [1.22, 0.52, 0.55])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.94), kind: "blurDip", len: 10 },
  { at: F(15.08), kind: "glitch", len: 10 },   // to the aerial
  { at: F(22.4), kind: "blurDip", len: 12 },
  { at: F(30.37), kind: "glitch", len: 10 },   // back to the phone clip
  { at: F(35.54), kind: "blurDip", len: 10 },
  { at: F(41.06), kind: "blurDip", len: 10 },
  { at: F(63.37), kind: "blurDip", len: 14 },  // raw -> slowed replay
  { at: F(70.65), kind: "blurDip", len: 10 },
  { at: F(74.39), kind: "blurDip", len: 12 },  // into the page
  { at: F(83.6), kind: "blurDip", len: 12 },
  { at: F(85.1), kind: "blurDip", len: 10 },
  { at: F(86.93), kind: "blurDip", len: 10 },
  { at: F(92.28), kind: "blurDip", len: 10 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 39.37], [63.37, 39.37, null]];
const RAWS: [number, number, number, number, number][] = [[43.37, 63.37, 30.31, 1, 0.15]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [15.03, "sfx_n2/glitch_03.wav", -28], [30.32, "sfx_n2/glitch_01.wav", -28],
  [74.39 + 1.6, "sfx_n2/real/mouse_click_1.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE CHALLENGER IN KELLER" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE13.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(93.1)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(6)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(MUS) * interpolate(t, [4.0, 5.0, 95.6, 97.1], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
const MUS = -16;
