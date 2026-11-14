// Amusement Parks Iceberg #01 (LEVEL 1, case 1) — Cobra Adventure Park, Front Beach Road, Panama City Beach, Florida, Sat 17 Aug 2019:
// the Vertical Accelerator (a reverse bungee: a two-seat steel cage, two rubber cords to two towers) — the left cord bursts at the launch,
// the cage never leaves the deck, nobody hurt. The VO take (vor/CASE01.mp3) opens with the level line, so the case opens on the iceberg:
// dev/AM_LevelEntry (Level 1 "THE TIP", reusable for levels 2-5), then the case TitleCard on the case's own frame, then the case.
// Footage: [main] Krissy Hurst's own phone clip (posted by the Panama City News Herald, _ilOizTWjlE, 640x360 -> 1080p, graded);
// [tony] Tony Wilford's 2010 clip of the same ride at Cobra (T8gSOc_zIas); [vlog] The Adventure Schmuck's 2023 walk round Cobra
// (AArPOgl7P5k, vlog.mp4 = source 75-165 s); [onboard] Cobra's on-ride camera video, 2016 (Ckgr7PNfox4). Slow files from graded/main.mp4
// (ffmpeg minterpolate): burst_slow = 52.8-57.2 @0.5x, cord_slow = 64.6-67.2 @0.35x, off_slow = 87.9-89.55 @0.6x.
// Source cuts: main 84.2-85.7 only; tony 48.6; vlog (file s) 3.67 7.9 9.5 11.7 12.2 12.3 27.0 34.4 45.0 94.2 103.8 119.7 130.0 163.7.
// Raw audio = media/main_safe.wav: rawclean.py output split by Demucs, the voice stem muted over every swear (36.0-37.6, 40.9-43.0,
// 45.8-47.1, 55.9-58.2, 62.9-66.4, 70.88-72.05, 75.3-end); checked by re-transcribing the windows. Never the clip's own track.
// VO = one take, split only at the two raws (both at sentence ends): L 0-6.12 @0.6 (inside the level entry) | A 6.17-50.07 @12.0 |
// RAW1 55.90-69.10 (src 47.5-60.7: the wait, "Cali husband!", the attendant walks over, the cord bursts, the cage jolts, the strands hang) |
// B 50.07-59.49 @69.10 (BurstReplay) | RAW2 78.52-85.82 (src 67.3-74.6: "We just dodged death", laughter) | C 59.49-end @85.82, ends 112.54.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LevelEntry } from "../dev/AM_LevelEntry";
import { DeadFeed } from "../dev/AM01_DeadFeed";
import { CordTrace } from "../dev/AM01_CordTrace";
import { BurstReplay } from "../dev/AM01_BurstReplay";
import { NewsSheet } from "../dev/AM01_NewsSheet";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(113.4);
const LE = 8.0, TC = 4.0;

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 12.00, b: 15.46, vo: "Krissy Hurst had ridden the Vertical Accelerator plenty of times, (the cage swinging close, 2010)", src: "tony.mp4", from: 126.5, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.45,
    over: <RedLabel text="THE VERTICAL ACCELERATOR" at={F(0.6)} hold={F(2.3)} /> },
  { a: 15.46, b: 20.18, vo: "but on a Saturday night in August 2019 she stayed on the ground and filmed it. (her clip: the cage on the deck at night)", src: "main.mp4", from: 9.0, s0: 1.02, s1: 1.08, fx: 0.45, fy: 0.45,
    over: <RedLabel text="AUGUST 17, 2019" at={F(1.29)} hold={F(2.6)} /> },
  { a: 20.18, b: 24.08, vo: "The ride's own camera wasn't working, which is why she was filming at all. (DeadFeed: the on-ride camera dies -> her phone)",
    node: <DeadFeed feed={GR + "onboard.mp4"} feedFrom={3.0} phone={GR + "main.mp4"} phoneFrom={16.04} dieAt={34} phoneAt={59} label="THE RIDE'S OWN CAMERA · 2016" /> },
  { a: 24.08, b: 28.10, vo: "The ride stood at Cobra Adventure Park in Panama City Beach, Florida. (the park's arcade from the car park, 2023)", src: "vlog.mp4", from: 3.0, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.5,
    over: <><RedLabel text="COBRA ADVENTURE PARK" at={F(0.96)} hold={F(1.1)} /><RedLabel text="PANAMA CITY BEACH, FLORIDA" at={F(2.16)} hold={F(1.7)} /></> },
  { a: 28.10, b: 31.95, vo: "It's a reverse bungee, which works like a bungee jump played backwards. (the cage flung between the towers, 2023)", src: "vlog.mp4", from: 56.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.4 },
  { a: 31.95, b: 35.92, vo: "Two huge rubber cords run from a steel cage up to two towers. (CordTrace on the 2010 clip)",
    node: <CordTrace src={GR + "tony.mp4"} from={55.1} freeze={24} cordsAt={29} cageAt={55} towersAt={89} /> },
  { a: 35.92, b: 39.28, vo: "The cage is held down on the deck while the cords stretch tight, (her clip: the attendant pulls it down)", src: "main.mp4", from: 24.5, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.55 },
  { a: 39.28, b: 41.88, vo: "and then it's let go and flung into the sky. (2010: the launch)", src: "tony.mp4", from: 51.6, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 41.88, b: 44.58, vo: "Nick and Vic are strapped in for their first ride. (close on the two seats)", src: "main.mp4", from: 15.0, s0: 1.35, s1: 1.5, fx: 0.45, fy: 0.42,
    over: <RedLabel text="NICK AND VIC" at={F(0.4)} hold={F(1.9)} /> },
  { a: 44.58, b: 46.37, vo: "Hurst's friend was meant to go too, (the cage on the deck, wide)", src: "main.mp4", from: 20.0, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 46.37, b: 50.93, vo: "but pulled out at the last second over a bad feeling. I'm glad she listened to it. (the long wait, slow push in)", src: "main.mp4", from: 36.0, s0: 1.02, s1: 1.14, fx: 0.42, fy: 0.5 },
  { a: 50.93, b: 52.63, vo: "The cords are pulled tight, (2010: the cords stretched up from the cage)", src: "tony.mp4", from: 36.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.3 },
  { a: 52.63, b: 55.90, vo: "and the attendant in the yellow shirt walks over to the launch controls. (her clip: the attendant at the cage)", src: "main.mp4", from: 22.2, s0: 1.25, s1: 1.32, fx: 0.78, fy: 0.55 },
  // RAW 1 (main incident raw, 13.2 s): src 47.5-60.7
  { a: 55.90, b: 69.10, vo: "RAW 1: 'Cali husband!', the attendant walks past, the left cord bursts (src 53.4), the cage jolts, the strands hang (src 47.5-60.7)", src: "main.mp4", from: 47.5, s0: 1.0, s1: 1.07, fx: 0.42, fy: 0.45 },
  { a: 69.10, b: 78.52, vo: "Then the left cord bursts. Neither man was hurt. One of them said later he was in total shock, his hands still stuck up in the air, with no idea what had just happened. (BurstReplay 0.5x)",
    node: <BurstReplay src={GR + "burst_slow.mp4"} from={0.5} freeze={219} spot={[0.5, 0.33]}
      keys={[{ at: 0, x: 0.25, y: 0.3, s: 1.6 }, { at: 46, x: 0.26, y: 0.34, s: 1.5 }, { at: 100, x: 0.45, y: 0.42, s: 1.22 }, { at: 219, x: 0.46, y: 0.42, s: 1.24 }, { at: 283, x: 0.5, y: 0.33, s: 1.75 }]} /> },
  // RAW 2 (7.3 s): src 67.3-74.6
  { a: 78.52, b: 85.82, vo: "RAW 2: the attendant at the cage, the riders still strapped in, 'We just dodged death', laughter (src 67.3-74.6)", src: "main.mp4", from: 67.3, s0: 1.0, s1: 1.06, fx: 0.4, fy: 0.5 },
  { a: 85.82, b: 88.29, vo: "The park took both men off and refunded them, (the cage tilted on the deck, the attendant, slow)", src: "off_slow.mp4", from: 0.05, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.5 },
  { a: 88.29, b: 91.10, vo: "though Hurst said nobody there seemed very sorry. (the park's ticket window, 2023)", src: "vlog.mp4", from: 21.5, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 91.10, b: 93.80, vo: "The manager said they ran safety checks every day, (the towers, 2023)", src: "vlog.mp4", from: 30.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  { a: 93.80, b: 95.39, vo: "and the ride stayed open. (the cage in the air, 2023)", src: "vlog.mp4", from: 68.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4,
    over: <RedLabel text="2023" at={F(0.3)} hold={F(1.1)} /> },
  { a: 95.39, b: 102.70, vo: "Florida's ride inspectors said they'd check whether the cord had been maintained properly and whether it had gone past its allowed number of uses. (NewsSheet: the WMBB story, print view, the statement in focus)",
    node: <NewsSheet page={C + "shots/wmbb.png"} pw={2560} ph={3800} bg={GR + "cord_slow.mp4"} para={[1480, 1740]} rule={{ box: [1260, 1618, 1739, 1670], at: 172 }}
      keys={[{ at: 0, y: 700, k: 0.52, tilt: 16 }, { at: 40, y: 720, k: 0.54, tilt: 14 }, { at: 120, y: 1610, k: 0.72, tilt: 7 }, { at: 219, y: 1630, k: 0.76, tilt: 6 }]} /> },
  { a: 102.70, b: 105.27, vo: "I'd love to know how many launches it had done. (the cage flung again, 2023)", src: "vlog.mp4", from: 80.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  { a: 105.27, b: 107.86, vo: "Whatever the state found was never made public. (looking up the tower, 2023)", src: "vlog.mp4", from: 36.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 107.86, b: 113.40, vo: "And if stories like these keep you watching, hit subscribe so the next one finds you. (2010: the cage between the towers; fade)", src: "tony.mp4", from: 108.0, s0: 1.0, s1: 1.08, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(12.0), kind: "glitch", len: 10 },     // title card -> the case
  { at: F(46.37), kind: "blurDip", len: 12 },   // same camera, later in the wait
  { at: F(69.10), kind: "blurDip", len: 14 },   // raw -> its replay
  { at: F(78.52), kind: "blurDip", len: 14 },   // replay freeze -> raw 2 (same camera)
  { at: F(85.82), kind: "blurDip", len: 12 },   // raw 2 -> the end of her clip (same camera)
  { at: F(95.39), kind: "blurDip", len: 12 },   // into the WMBB story
];

const PART: [number, number, number | null][] = [[0.6, 0, 6.12], [LE + TC, 6.17, 50.07], [69.10, 50.07, 59.49], [85.82, 59.49, null]];
const RAWS: [number, number, number, number][] = [[55.90, 69.10, 47.5, 0], [78.52, 85.82, 67.3, -1]]; // timeline a, b, src s, gain dB

const SFX: [number, string, number, number?][] = [
  [0.55, "sfx_n2/real/sub_drop_1.wav", -15],
  [6.95, "sfx_n2/whoosh_02.wav", -22],
  [11.95, "sfx_n2/glitch_02.wav", -24],
  [21.36, "sfx_n2/real/static_1.wav", -27, 0.9],
  [95.34, "sfx_n2/glitch_01.wav", -28],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(LE)} layout="none"><AbsoluteFill><LevelEntry n={1} name="THE TIP" at={{ level: 18, names: 61, mark: 196 }} /></AbsoluteFill></Sequence>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={F(LE)} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="THE VERTICAL ACCELERATOR CORD" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* fade to black on the hold after the last word */}
      <Sequence from={F(112.3)} layout="none"><FadeBlack len={F(113.4 - 112.3)} /></Sequence>
      {/* VO: one take, split only where the raws play */}
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: rawclean + swear-muted voice stem, never under the VO */}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_safe.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* the level entry's underwater bed */}
      <Sequence from={0} durationInFrames={F(LE)} layout="none">
        <Audio src={staticFile("sfx_n2/bed_underwater_01.wav")} volume={(f) => dB(-24) * interpolate(f, [0, 15, F(LE) - 20, F(LE)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 5, ~-13 dB (≈10 LU under the VO), ducked under both raws */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
          return dB(-13) * interpolate(t, [0, 1.2, 111.6, 113.3], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck);
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
