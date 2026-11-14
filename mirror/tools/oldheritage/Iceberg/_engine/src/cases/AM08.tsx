// Amusement Parks Iceberg #08 (LEVEL 2 "BELOW THE SURFACE", case 1) — Queens Land, Kuthambakkam / Poonamallee, west of Chennai, India,
// Tue 18 Jun 2019 ~4:30 pm: the Free Fall Tower's right-hand platform (12 riders) was being lowered when its cables snapped about ten
// feet up; minor injuries; police say the park hid it and only learnt from the video; park ordered shut 21 Jun.
// The VO take (vor/CASE08.mp3) opens with the level line, so the case opens on the iceberg: dev/AM_LevelEntry (n 2), then the TitleCard.
// Footage: [main] the bystander clip (Oorukku Pudhusu upload QwJ8g37QLQk, AMBER), 4:3 inside a pillarboxed 1280x720 -> cropped 960x720 ->
// 1440x1080 lanczos, graded; one raw pass 0.0-12.2 (upload loops it from 12.31). Stills: Commons "Free Fall Tower in Queens Land, Chennai"
// (Vijay5050, CC BY-SA 3.0, 2009) and "Aerial view queensland" (Vijay5050, CC0, 2009), both graded. Page: The News Minute, 21 Jun 2019.
// [trip] TRIP CHART (14 subs), 'FREE FALL TOWER', 15 Jun 2020, Y8gwzKkgZpo, same ride, media/trip.mp4 = src 70-120 (fetched 14 Nov with the
// owner's Chrome cookies). drop_slow = graded main 7.6-11.0 @0.4x (minterpolate). Source cuts: 11.01 (a head enters), 12.31 (loop) -> raw ends 10.9.
// VO split only at the raw (sentence end "…on its way back down."): L 0-5.30 @0.6 | A 5.55-36.85 @12.0 | RAW 43.30-53.80 (src 0.4-10.9) |
// B 36.95-end @53.80, last word 91.18 -> 108.03, hold + fade to 109.4.
import React from "react";
import { AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { LevelEntry } from "../dev/AM_LevelEntry";
import { SideLight } from "../dev/AM08_SideLight";
import { FollowLight } from "../dev/AM08_FollowLight";
import { ColumnScroll } from "../dev/AM08_ColumnScroll";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(109.4);
const LE = 8.0, TC = 4.0;

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; fill?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; panY?: [number, number]; node?: React.ReactNode; over?: React.ReactNode };

/** a portrait still at full frame width (1920 x 2560), eased vertical travel (y = top offset in px) + slow scale: the camera rides the tower */
const TallPan: React.FC<{ src: string; y0: number; y1: number; k0?: number; k1?: number }> = ({ src, y0, y1, k0 = 1, k1 = 1.04 }) => {
  const f = useCurrentFrame(); const { durationInFrames: d } = useVideoConfig();
  const u = Easing.bezier(0.45, 0, 0.25, 1)(interpolate(f, [0, d - 1], [0, 1], cl));
  const y = y0 + (y1 - y0) * u, k = k0 + (k1 - k0) * u;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transform: `scale(${k.toFixed(5)})`, transformOrigin: "50% 50%" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: y, width: 1920, height: 2560 }} />
      </div>
    </AbsoluteFill>
  );
};

const SHOTS: Sh[] = [
  { a: 12.00, b: 19.07, vo: "Two platforms full of riders are sitting near the top of a red tower, and the one on the right has a board on it that says Free Fall. (her first frame, slow push toward the board)",
    src: "f0.2.jpg", still: true, fill: true, s0: 1.0, s1: 1.1, fx: 0.52, fy: 0.24 },
  { a: 19.07, b: 26.76, vo: "This is Queens Land, an amusement park on the highway west of Chennai, India, on the afternoon of June 18, 2019. (the park from above, 2009)",
    src: "aerial.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.55, fy: 0.42,
    over: <><RedLabel text="QUEENS LAND" at={F(0.3)} hold={F(2.6)} /><RedLabel text="CHENNAI, INDIA" at={F(3.38)} hold={F(1.7)} /><RedLabel text="JUNE 18, 2019" at={F(5.45)} hold={F(2.0)} /></> },
  { a: 26.76, b: 33.54, vo: "A free-fall tower is about as simple as thrill rides get: you're hauled up, here about 150 feet, and dropped. (the tower, 2009: base -> top)",
    node: <TallPan src={GR + "tower.jpg"} y0={-1480} y1={-150} /> },
  { a: 33.54, b: 36.80, vo: "There are 24 people aboard, 12 on each side. (the same ride loaded, 2020 visitor's clip)", src: "trip.mp4", from: 14.3, s0: 1.0, s1: 1.05 },
  { a: 36.80, b: 43.30, vo: "The left platform drops first, and that's the ride working normally. Now watch the right-hand one on its way back down. (SideLight on her first frame)",
    node: <SideLight still={GR + "f0.4.jpg"} iw={1440} ih={1080} spots={[{ at: 0, x: 0.15, y: 0.19, r: 0.2 }, { at: 120, x: 0.15, y: 0.19, r: 0.2 }, { at: 150, x: 0.51, y: 0.22, r: 0.22 }]} inAt={0} liftAt={176} /> },
  // RAW (main, 10.5 s): src 0.4-10.9: both up, the left drops, the right is lowered, its cables snap ~10 ft up, it lands behind the bushes
  { a: 43.30, b: 53.80, vo: "RAW: her whole pass (src 0.4-10.9)", src: "main.mp4", fill: true, from: 0.4, s0: 1.0, s1: 1.0 },
  { a: 53.80, b: 57.73, vo: "It's nearly home, about ten feet up. The cables had snapped. (FollowLight 0.4x replay)",
    node: <FollowLight src={GR + "drop_slow.mp4"} from={4.0} iw={1440} ih={1080} inAt={4}
      track={[{ at: 0, x: 0.47, y: 0.48, r: 0.24 }, { at: 30, x: 0.47, y: 0.52, r: 0.24 }, { at: 60, x: 0.47, y: 0.55, r: 0.24 }, { at: 75, x: 0.47, y: 0.57, r: 0.24 }, { at: 90, x: 0.47, y: 0.6, r: 0.26 }, { at: 118, x: 0.47, y: 0.61, r: 0.26 }]} /> },
  { a: 57.73, b: 62.18, vo: "If it had happened at the top, one officer said, all 12 would have died. (a platform at the top, 2020 visitor's clip)",
    src: "trip.mp4", from: 31.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.4 },
  { a: 62.18, b: 69.08, vo: "Instead the riders had minor injuries, and after first aid on the spot they were treated at a nearby hospital and sent home. (her last clean frame: the base, wide)",
    src: "f10.7.jpg", still: true, fill: true, s0: 1.0, s1: 1.06, fx: 0.45, fy: 0.62 },
  { a: 69.08, b: 73.53, vo: "The police were angrier about what happened next. The park didn't report the crash, (the park, other side)",
    src: "aerial.jpg", still: true, s0: 1.14, s1: 1.22, fx: 0.3, fy: 0.55 },
  { a: 73.53, b: 80.44, vo: "and police say it talked the riders into a compromise. Nobody filed a complaint, and no police case was ever reported. (the park's QUEENS sign, slow push)",
    src: "f10.9.jpg", still: true, fill: true, s0: 1.28, s1: 1.42, fx: 0.8, fy: 0.27 },
  { a: 80.44, b: 88.01, vo: "Officers say they only found out from this video, which by Friday was everywhere. Without this clip, I'm not sure we'd ever have heard about it. (the clip itself, framed)",
    node: <Inset src={GR + "main.mp4"} from={12.6} ar={4 / 3} box={0.6} drift={0.04} /> },
  { a: 88.01, b: 99.80, vo: "In the assistant commissioner's words, the park tried to hide the whole thing. Police had written to the park that April ... which clearly wasn't the case. (ColumnScroll: TNM)",
    node: <ColumnScroll page={C + "shots/tnm_sheet.png"} pw={1580} ph={4680} bg={GR + "main.mp4"} bgFrom={1.0}
      keys={[{ at: 0, y: 1640, k: 0.66, turn: -22 }, { at: 54, y: 3040, k: 0.8, turn: -16 }, { at: 232, y: 3055, k: 0.82, turn: -15 }, { at: 266, y: 2715, k: 0.85, turn: -13 }, { at: 354, y: 2712, k: 0.87, turn: -12 }]}
      bands={[{ at: 52, box: [33, 2978, 1545, 3098], lines: [[1151, 2978, 1475, 3038], [33, 3038, 273, 3098]], red: true }, { at: 250, box: [33, 2614, 1545, 2794], lines: [[33, 2674, 891, 2734]] }]} /> },
  { a: 99.80, b: 101.64, vo: "The park refused to comment. (the foot of the tower, 2009)", node: <TallPan src={GR + "tower.jpg"} y0={-1470} y1={-1440} k0={1.04} k1={1.08} /> },
  { a: 101.64, b: 109.40, vo: "On June 21, police ordered the whole park shut indefinitely, until it could show a fitness certificate for every ride. (her first frame again, pulling back; fade)",
    src: "f0.2.jpg", still: true, fill: true, s0: 1.1, s1: 1.0, fx: 0.4, fy: 0.3,
    over: <RedLabel text="JUNE 21, 2019" at={F(0.3)} hold={F(2.6)} /> },
];

const CUTS: FxCut[] = [
  { at: F(12.0), kind: "glitch", len: 10 },     // title card -> the case
  { at: F(53.80), kind: "blurDip", len: 14 },   // raw -> its replay (same camera)
  { at: F(88.01), kind: "blurDip", len: 12 },   // into the TNM story
];

const PART: [number, number, number | null][] = [[0.6, 0, 5.30], [LE + TC, 5.55, 36.85], [53.80, 36.95, null]];
const RAWS: [number, number, number, number][] = [[43.30, 53.80, 0.4, 0]];

const SFX: [number, string, number, number?][] = [
  [0.55, "sfx_n2/real/sub_drop_1.wav", -15],
  [6.95, "sfx_n2/whoosh_02.wav", -22],
  [11.95, "sfx_n2/glitch_02.wav", -24],
  [56.30, "sfx_n2/real/metal_clank_2.wav", -24],
  [87.96, "sfx_n2/real/paper_2.wav", -26],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} fill={s.fill} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} panY={s.panY} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(LE)} layout="none"><AbsoluteFill><LevelEntry n={2} name="BELOW THE SURFACE" at={{ level: 18, names: 60, mark: 168 }} /></AbsoluteFill></Sequence>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(LE)} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="QUEENS LAND FREE FALL TOWER" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(108.3)} layout="none"><FadeBlack len={F(109.4 - 108.3)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={F(LE)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-24) * interpolate(f, [0, 15, F(LE) - 20, F(LE)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 3, -19 dB (≈ 7-8 LU under this take), ducked under the raw */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(40)} volume={(f) => {
          const t = f / 30;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-19) * interpolate(t, [0, 1.2, 107.6, 109.3], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
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
