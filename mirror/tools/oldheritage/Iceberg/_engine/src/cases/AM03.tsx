// Amusement Parks Iceberg #03 (LEVEL 1, case 3) — "El Gusanito": a fairground worm-train coaster splits behind its first car, at night, at a
// fair somewhere in Mexico (place and date of the incident unconfirmed; the clip was posted on 22 Feb 2016 and has 3.1M views).
// Footage: [main] Temin Garza's own 1:02 phone clip (7QCZtsKRwJg, GREEN), 480x360 @ 14 fps -> 1440x1080 (shown cover-fit), graded.
// Skipped per the outline: 0-4 (small boy), 28-33 (halves return; a child; a girl past the lens), 51-62 (small children close to the lens).
// Slow files (minterpolate from the 14 fps source, then 1440x1080 + LUT): gap_slow = 23.6-26.2 @0.4x, head_slow = 40.8-44.1 @0.5x,
// walk_slow = 33.5-35.2 @0.5x. Stills: Commons "Wacky Worm" photos (Corey Coyle, CC BY 3.0: a worm coaster of the same type at a US fair).
// Documents: the clip's own YouTube page (title + uploader's description line), the Prensa Libre story on the 2017 Quiché worm ride.
// Source cuts: 58.0 only. Camera whips at 35-38 avoided.
// VO = one take, split only at the two raws (both at sentence ends): A 0-25.10 @4.0 | RAW1 29.10-39.20 (src 17.5-27.6: loops, the head and
// first car pull away on the far side at ~25, empty track) | B 25.15-53.80 @39.20 | RAW2 67.85-74.85 (src 43.9-50.9: riders climb out,
// laughing) | C 54.40-end @74.85, ends ~94.8.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { TitleCard } from "../brand";
import { FarSide } from "../dev/AM03_FarSide";
import { NightCaption } from "../dev/AM03_NightCaption";
import { GapSpan } from "../dev/AM03_GapSpan";
import { HeadCheck } from "../dev/AM03_HeadCheck";
import { WireStory } from "../dev/AM03_WireStory";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(96.3);
const TC = 4.0;
const MUSIC_DB = -16;
const B = 39.20 - 25.15, Cc = 74.85 - 54.40; // T = t + offset (parts B, C)

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; node?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.00, b: 7.74, vo: "El Gusanito is a little worm train coaster you'll find at fairs all over Mexico, (a worm coaster of the same type at a fair)", src: "wacky1.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.7, fy: 0.45 },
  { a: 7.74, b: 10.52, vo: "built for kids and their parents. (the round green cars)", src: "wacky6.jpg", still: true, s0: 1.5, s1: 1.62, fx: 0.62, fy: 0.62, pan: [30, -30] },
  { a: 10.52, b: 13.05, vo: "The one in this clip is packed with grown-ups. (the clip: adults squeezed in, passing close)", src: "main.mp4", from: 10.6, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.55 },
  { a: 13.05, b: 17.39, vo: "It's night, and the ride is looping a low oval under blue and white lights. (the far side under the canopy lights)", src: "main.mp4", from: 4.6, s0: 1.0, s1: 1.06, fx: 0.55, fy: 0.45 },
  { a: 17.39, b: 19.50, vo: "A grinning green head in a cartoon hat (the head, stopped in the station later)", src: "head.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.42, fy: 0.35 },
  { a: 19.50, b: 21.32, vo: "pulls a chain of round cars, (the head swings past, the cars behind it)", src: "main.mp4", from: 9.0, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 21.32, b: 25.62, vo: "with the riders squeezed in two to a car. I've got no idea how (the train on the far side, then close)", src: "main.mp4", from: 13.15, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 25.62, b: 29.10, vo: "...some of them folded themselves in. Keep your eye on the far side of the loop. (FarSide: held on the raw's first frame)",
    node: <FarSide src={GR + "main.mp4"} at={17.5} band={[0.36, 0.66]} cx={0.5} zoom={1.12} release={14} /> },
  // RAW 1 (main, 10.1 s): src 17.5-27.6
  { a: 29.10, b: 39.20, vo: "RAW 1: loops; on the far side the head and its first car pull away (~25), the track empties (src 17.5-27.6)", src: "main.mp4", from: 17.5, s0: 1.0, s1: 1.06, fx: 0.45, fy: 0.5 },
  { a: 39.20, b: 44.45, vo: "Whoever posted this on February 22, 2016 wrote that the worm split in two. (NightCaption: the clip's YouTube title + description)",
    node: <NightCaption bg={GR + "main.mp4"} at={20.3} title={{ src: C + "shots/yt_title_inv.png", w: 752, h: 88 }} desc={{ src: C + "shots/yt_desc_inv.png", w: 794, h: 52 }}
      descAt={F(28.73 - 25.15)} credit="youtube.com · the uploader's own description" /> },
  { a: 44.45, b: 52.25, vo: "That's true, but it isn't a break down the middle. The head and its first car pull away and run on alone, while everyone else falls back. (GapSpan 0.4x)",
    node: <GapSpan src={GR + "gap_slow.mp4"} freeze={128} gap={[0.452, 0.5, 0.525]} front={[0.14, 0.45]} spanAt={F(35.06 + B - 44.45)} shadeAt={F(36.66 + B - 44.45)} z0={1.12} z1={1.85} focus={[0.4, 0.52]} /> },
  { a: 52.25, b: 55.05, vo: "When the train stops in the station, (the stopped train, the head at the platform)", src: "main.mp4", from: 38.4, s0: 1.02, s1: 1.07, fx: 0.55, fy: 0.5 },
  { a: 55.05, b: 58.65, vo: "a man in a striped sweater, apparently the operator, walks along the cars. (0.5x: he walks past the head)", src: "walk_slow.mp4", from: 0.1, s0: 1.08, s1: 1.15, fx: 0.6, fy: 0.5 },
  { a: 58.65, b: 67.85, vo: "And the first thing he checks? The worm's head. One of the most-liked comments caught that before the passengers did. The riders climb out over the sides, and some of them are laughing. (HeadCheck)",
    node: <HeadCheck src={GR + "head_slow.mp4"} from={1.13} freeze={F(46.48 + B - 58.65)} spot={[0.74, 0.58]} rx={0.3} ry={0.46} zoom={1.32} releaseAt={F(51.05 + B - 58.65)} /> },
  // RAW 2 (7 s): src 43.9-50.9
  { a: 67.85, b: 74.85, vo: "RAW 2: riders climbing out over the sides, laughing, the woman in the red cardigan (src 43.9-50.9)", src: "main.mp4", from: 43.9, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 74.85, b: 84.15, vo: "These little rides aren't always harmless. In Guatemala in 2017, a different worm ride lost its last car and a rider was badly hurt. (WireStory: Prensa Libre)",
    node: <WireStory page={C + "shots/prensa_crop.png"} pw={1820} ph={620} bg={GR + "wacky1.jpg"} labelAt={F(57.28 + Cc - 74.85)} label="GUATEMALA · 2017" credit="Prensa Libre · August 21, 2017" headY={110} /> },
  { a: 84.15, b: 90.30, vo: "No injuries were ever reported, and nothing official ever turned up, though hundreds of commenters have asked. (a worm coaster's empty fair lot under grey sky)", src: "wacky4.jpg", still: true, s0: 1.06, s1: 1.16, fx: 0.55, fy: 0.55 },
  { a: 90.30, b: 96.30, vo: "This clip has been viewed more than three million times, and nobody can say where it was filmed. (the worm looping in the dark, slow push; fade)", src: "main.mp4", from: 19.0, s0: 1.05, s1: 1.25, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },     // title -> case
  { at: F(39.20), kind: "blurDip", len: 14 },  // raw -> the page
  { at: F(44.45), kind: "blurDip", len: 12 },  // page -> the replay
  { at: F(52.25), kind: "blurDip", len: 12 },  // replay -> the station (same camera)
  { at: F(55.05), kind: "blurDip", len: 12 },  // same camera, earlier moment
  { at: F(58.65), kind: "blurDip", len: 12 },  // same camera -> HeadCheck
  { at: F(74.85), kind: "blurDip", len: 14 },  // raw 2 -> the Guatemala story
  { at: F(90.30), kind: "blurDip", len: 14 },  // photo -> the closing clip
];

const PART: [number, number, number | null][] = [[TC, 0.0, 25.10], [39.20, 25.15, 53.80], [74.85, 54.40, null]];
const RAWS: [number, number, number, number][] = [[29.10, 39.20, 17.5, -2], [67.85, 74.85, 43.9, -3]];

const SFX: [number, string, number, number?][] = [
  [3.95, "sfx_n2/glitch_01.wav", -24],
  [25.62, "sfx_n2/real/sub_drop_2.wav", -22],
  [39.15, "sfx_n2/real/projector_1.wav", -28, 5.2],
  [44.45 + 128 / 30, "sfx_n2/real/tape_click_2.wav", -24],
  [74.80, "sfx_n2/real/paper_3.wav", -22],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.1}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.1}><Shot_FX src={GR + s.src!} still={s.still} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="EL GUSANITO" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(95.0)} layout="none"><FadeBlack len={F(1.3)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_safe.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, ducked under both raws */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(MUSIC_DB) * interpolate(t, [0, 1.2, 94.6, 96.2], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
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
