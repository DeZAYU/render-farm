// Amusement Parks Iceberg #02 (LEVEL 1, case 2) — Saw Mill Log Flume, Six Flags Great Adventure, Jackson, New Jersey, Sun 13 Jun 2021, ~6:30 pm:
// a guide rail on the bend before the station is out of place; the Thomas girls' log gets "quite a jolt" there (the clip), less than a minute
// later the next boat hits the wall and tips (~45°, stays upright, not on camera); two riders to hospital with leg / arm pain.
// Footage: [main] the family's 13.6 s phone clip (NJ.com K8cr3wmZfDI, "Video courtesy Steve Thomas"), 640x360 -> 1080p; the girls' faces
// (src 4.4-8.7) blurred on the source before grading (build/CASE02/assets/blurfaces.py). Only ONE angle exists and YouTube's bot check blocked
// every extra download tonight, so the rest is Commons photos of the ride (Saw Mill 2023 / 2013, El Aserradero 2023, a Six Flags flume 2010,
// the park gate 2025) + the park's own ride page (Wayback 14 Jun 2021). Slow files (minterpolate, from graded/main.mp4): wait_slow = 0-3.0 @0.4x,
// rail_slow = 9.3-13.5 @1/3x, end_slow = 11.9-13.6 @0.5x. Source cuts: none.
// VO = one take, split only at the raw (sentence end "…where the spray comes over."): A 0-40.30 @4.0 | RAW 44.30-54.90 (src 3.0-13.6: the log
// crests the last drop, splashes down past the camera, swings into the bend, spray sheets over the wall) | B 40.55-end @54.90, ends ~100.74.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { ClaimStrike } from "../dev/AM02_ClaimStrike";
import { FrameStep } from "../dev/AM02_FrameStep";
import { TiltLine } from "../dev/AM02_TiltLine";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(102.2);
const TC = 4.0;
const B = 54.90 - 40.55; // part B offset: T = t + B

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.00, b: 7.79, vo: "A father from Long Island is standing near the end of the Saw Mill Log Flume (the ride in 2023: mill house, waterwheel, the channel)", src: "sawmill23.jpg", still: true, s0: 1.45, s1: 1.55, fx: 0.86, fy: 0.42,
    over: <RedLabel text="SAW MILL LOG FLUME" at={F(2.3)} hold={F(1.4)} /> },
  { a: 7.79, b: 10.43, vo: "at Six Flags Great Adventure in New Jersey, (the park gate)", src: "gate.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45,
    over: <><RedLabel text="SIX FLAGS GREAT ADVENTURE" at={F(0.15)} hold={F(1.2)} /><RedLabel text="JACKSON, NEW JERSEY" at={F(1.45)} hold={F(1.1)} /></> },
  { a: 10.43, b: 17.90, vo: "waiting for his daughters and nieces to come around. It's a gray Sunday evening in June 2021, and his wife is filming. (her clip, the empty run-out under the bridge, 0.4x)", src: "wait_slow.mp4", from: 0, s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.4,
    over: <RedLabel text="JUNE 13, 2021" at={F(4.6)} hold={F(2.4)} /> },
  { a: 17.90, b: 22.95, vo: "A log flume is a water ride where a fake log carries you down a channel and over drops. (a Six Flags log boat on a drop, 2010)", src: "flume_sf.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.5, fy: 0.5 },
  { a: 22.95, b: 29.13, vo: "Six Flags advertised this one, opened in 1974, as the world's first. It wasn't. (ClaimStrike: the ride page, 14 Jun 2021)",
    node: <ClaimStrike page={C + "shots/sixflags_crop.png"} pw={2090} ph={1070} bg={GR + "sawmill13.jpg"} line={[14, 290, 1310, 341]} phrase={[275, 291, 744, 339]} liftAt={112} strikeAt={162}
      credit="sixflags.com · ride page as of June 14, 2021 (Wayback Machine)" /> },
  { a: 29.13, b: 33.35, vo: "The first was El Aserradero in 1963, at Six Flags Over Texas, (El Aserradero, 2023)", src: "aserradero1.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <><RedLabel text="EL ASERRADERO · 1963" at={F(0.75)} hold={F(2.0)} /><RedLabel text="SIX FLAGS OVER TEXAS" at={F(3.0)} hold={F(1.2)} /></> },
  { a: 33.35, b: 36.96, vo: "so the company lost that record to itself. (El Aserradero's sign)", src: "aserradero_sign.jpg", still: true, s0: 1.05, s1: 1.14, fx: 0.5, fy: 0.45 },
  { a: 36.96, b: 40.68, vo: "Their log comes down the last drop and swings into the bend by the old mill house. (2013: a log on the big drop)", src: "sawmill13.jpg", still: true, s0: 1.6, s1: 1.8, fx: 0.55, fy: 0.1, panY: [30, 0] },
  { a: 40.68, b: 44.30, vo: "Watch the wall on that bend, where the spray comes over. (2023: the channel wall on the bend)", src: "sawmill23.jpg", still: true, s0: 2.0, s1: 2.3, fx: 0.5, fy: 0.74, pan: [40, -40] },
  // RAW (main, 10.6 s): src 3.0-13.6
  { a: 44.30, b: 54.90, vo: "RAW: the log crests the last drop, splashes down past the camera (faces blurred), swings into the bend, spray sheets over the wall", src: "main.mp4", from: 3.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.55 },
  { a: 54.90, b: 64.45, vo: "A piece of guide rail there is out of place. They just got quite a jolt, and the family only spotted the rail when they watched this back. It's easy to miss in all that spray. (FrameStep)",
    node: <FrameStep src={GR + "main.mp4"} slow={GR + "rail_slow.mp4"} slowT0={9.3} slowX={3} revFrom={13.5} revTo={9.4} revLen={18} stepTo={10.6} stepEvery={4} stopAt={52} runMax={110}
      box={[0.53, 0.6, 0.73, 0.92]} zoom={1.65} /> },
  { a: 64.45, b: 69.00, vo: "Less than a minute later, the next boat hit the wall right there. That part isn't on camera. (the clip's last frame, held, drains on 'isn't on camera')",
    node: <EmptyBend src={GR + "last.jpg"} drainAt={F(53.68 + B - 64.45)} /> },
  { a: 69.00, b: 75.05, vo: "It rode up and stopped, tipped at what one witness put at about 45 degrees, but stayed upright. (TiltLine on the boat ahead, frozen at the bend)",
    node: <TiltLine src={GR + "main.mp4"} at={9.6} pivot={[0.525, 0.665]} len={250} levelAt={F(55.57 + B - 69.0)} tiltAt={F(56.80 + B - 69.0)} holdAt={F(60.01 + B - 69.0)} zoom={1.8} /> },
  { a: 75.05, b: 78.85, vo: "Two riders went to the hospital with leg and arm pain. (a Six Flags log boat, riders in it)", src: "flume_sf.jpg", still: true, s0: 1.5, s1: 1.65, fx: 0.72, fy: 0.42 },
  { a: 78.85, b: 83.10, vo: "Six Flags said the boat didn't complete its cycle and shut the ride for inspection. (2023: the danger sign at the channel)", src: "sawmill23.jpg", still: true, s0: 3.0, s1: 3.25, fx: 0.79, fy: 0.55 },
  { a: 83.10, b: 85.20, vo: "The father said it could've been his family. (her clip: their log into the station, 0.5x)", src: "end_slow.mp4", from: 0.6, s0: 1.15, s1: 1.25, fx: 0.55, fy: 0.55 },
  { a: 85.20, b: 90.00, vo: "Would you put them back on it? He said he would, and he'd ride it himself. I respect that. (the park gate, 2025)", src: "gate.jpg", still: true, s0: 1.35, s1: 1.45, fx: 0.4, fy: 0.55 },
  { a: 90.00, b: 92.65, vo: "The flume reopened a month later with the rail repaired. (2013: the drop and the splash pool)", src: "sawmill13.jpg", still: true, s0: 1.25, s1: 1.33, fx: 0.55, fy: 0.85 },
  { a: 92.65, b: 97.92, vo: "It closed again in 2024 for a refurbishment and came back in 2026, (2023: the park's own 'closed for a makeover' sign)", src: "sawmill23.jpg", still: true, s0: 1.6, s1: 2.05, fx: 0.235, fy: 0.78 },
  { a: 97.92, b: 102.20, vo: "more than fifty years after it first opened. (2013, wide; fade)", src: "sawmill13.jpg", still: true, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },      // title card -> the case
  { at: F(22.95), kind: "blurDip", len: 12 },   // into the ride page
  { at: F(29.13), kind: "blurDip", len: 12 },   // out of the page
  { at: F(64.45), kind: "blurDip", len: 14 },   // same camera: replay -> held last frame
  { at: F(69.00), kind: "blurDip", len: 14 },   // same camera: held frame -> TiltLine
  { at: F(83.10), kind: "blurDip", len: 12 },   // back to her clip
];

const PART: [number, number, number | null][] = [[TC, 0.0, 40.30], [54.90, 40.55, null]];
const RAWS: [number, number, number, number][] = [[44.30, 54.90, 3.0, -2]]; // timeline a, b, src s, gain dB

const SFX: [number, string, number, number?][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [22.85, "sfx_n2/real/paper_2.wav", -22],
  [F(162) / 30 + 22.95, "sfx_n2/real/marker_1.wav", -20],
  [54.90, "sfx_n2/real/tape_click_2.wav", -22],
  [54.95, "sfx_n2/real/reverse_swell_1.wav", -26, 0.7],
  [54.90 + 52 / 30, "sfx_n2/real/camera_shutter_2.wav", -24],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} panY={s.panY} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="SAW MILL LOG FLUME" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(101.0)} layout="none"><FadeBlack len={F(1.2)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raw */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => {
          const t = f / 30;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-19) * interpolate(t, [0, 1.2, 100.6, 102.1], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
        }} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [F(len) - 8, F(len)], [1, 0], cl) : 1)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

/** the clip's last frame held on the empty bend; on "isn't on camera" it drains to a cold grey and dims, slow push toward the wall */
function EmptyBend({ src, drainAt }: { src: string; drainAt: number }) {
  const f = useCurrentFrame();
  const d = interpolate(f, [drainAt, drainAt + 24], [0, 1], cl);
  const z = 1.12 + 0.12 * interpolate(f, [0, 136], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})`, transformOrigin: "62% 72%",
        filter: `saturate(${1 - 0.85 * d}) brightness(${1 - 0.35 * d}) contrast(${1 + 0.05 * d})` }} />
      <AbsoluteFill style={{ opacity: d, background: "rgba(20,32,48,.18)", mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
}

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
