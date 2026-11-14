// ND #18 — Koh Ngai, Trang, Thailand (26 Dec 2004). Julian Hadden's own camera (1440x1080, 25 fps, one source cut at 64.36).
// Devices for this case's beats: RuptureDive (Blue Marble -> Sentinel-2 dive from the rupture to the island), WaveWrap (computed wave
// crests bending round the island to the sheltered side), Drawdown (the textbook section of the sea pulling back, Mai Khao), OceanReach
// (real travel-time spread across the Indian Ocean, Thailand boxed). Raws: Julian's "paradise island" line, the surge (24.6 s uncut; its in-camera whip pans are allowed windows in cutcheck),
// the boat in the surge. VO = one take (no count word), split for the three raws only.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { RuptureDive } from "../dev/ND18_RuptureDive";
import { WaveWrap } from "../dev/ND18_WaveWrap";
import { Drawdown } from "../dev/ND18_Drawdown";
import { OceanReach } from "../dev/ND18_OceanReach";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(106.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

// VO-A take 0-22.59 @4.0 (+4.0) | RAW1 26.8-32.3 | VO-B 22.59-31.15 @32.55 (+9.96) | RAW2 41.3-65.9 | VO-C 31.15-43.86 @66.2 (+35.05)
// RAW3 79.0-89.58 | VO-D 43.86-end @89.9 (+46.04)
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.76, vo: "Germany had days of warning. On the morning of the 26th of December 2004,", src: "kng.mp4", from: 10.0, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.5,
    over: <RedLabel text="DECEMBER 26, 2004" at={F(2.4)} hold={F(2.1)} /> },
  { a: 8.76, b: 11.77, vo: "the beaches of the Andaman Sea had none to speak of.", src: "kng.mp4", from: 21.2, s0: 1.12, s1: 1.18, fx: 0.2, fy: 0.5 },
  { a: 11.77, b: 21.85, vo: "At 7:58 local time, one of the largest earthquakes ever recorded broke the seabed off Sumatra. On Koh Ngai, a small island off Thailand's Trang coast,",
    node: <RuptureDive
      layers={[
        { src: GR + "io.jpg", lon0: 38, lon1: 110, lat0: -20, lat1: 28, op: () => 1 },
        { src: GR + "and.jpg", lon0: 88, lon1: 104, lat0: -1, lat1: 17, op: () => 1 },
        { src: GR + "mid.png", lon0: 97.6, lon1: 100.4, lat0: 6.0, lat1: 9.0, op: (w) => interpolate(w, [2.6, 5], [1, 0], cl) },
        { src: GR + "kng_area.jpg", lon0: 99.05, lon1: 99.42, lat0: 7.30, lat1: 7.55, op: (w) => interpolate(w, [0.7, 1.1], [1, 0], cl) },
      ]}
      epi={[95.85, 3.32]} rupture={[[95.85, 3.32], [94.9, 4.6], [94.1, 6.2], [93.6, 7.8], [93.0, 9.4], [92.6, 11.0], [92.5, 12.6], [92.9, 13.6]]}
      cam0={[96.6, 8.2, 24]} cam1={[96.6, 8.2, 22]} cam2={[99.207, 7.417, 0.21]} fly={[F(6.0), F(8.9)]}
      epiAt={F(0.2)} traceAt={F(2.2)} traceLen={F(3.0)} spanLabel="1,300 KM" epiLabel="OFF SUMATRA"
      box={[99.190, 7.391, 99.224, 7.442]} boxAt={F(8.5)} label="KOH NGAI, TRANG" labelAt={F(8.9)} /> },
  { a: 21.85, b: 26.8, vo: "Julian Hadden's group was on the beach near the pier, on what looked like a calm morning.", src: "kng.mp4", from: 25.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  // RAW 1: Julian to camera, "reporting from a paradise island, not far from Sumatra"
  { a: 26.8, b: 32.3, vo: "RAW", src: "kng.mp4", from: 0.05, s0: 1.02, s1: 1.05, fx: 0.55, fy: 0.4 },
  { a: 32.3, b: 41.3, vo: "They were on the sheltered side, facing the mainland. Tsunamis bend around islands, so the wave came around Koh Ngai instead of hitting it head on.",
    node: <WaveWrap img={GR + "kng_area.jpg"} iw={4310} ih={2937} field={GR + "kng_T.png"} fscale={4} tmax={1438.2}
      cam0={[2080, 1560, 2700]} cam1={[1990, 1580, 2250]} spot={[1905, 1625]} spotLabel="JULIAN HADDEN'S GROUP" spotAt={F(0.4)} spotHold={F(3.0)}
      sight={[3330, 1560]} sightAt={F(1.7)} sightHold={F(2.0)} front={[F(3.6), F(8.1), 170, 600]} lambda={24} crests={6} /> },
  // RAW 2: the surge, uncut (water creeping up the sand while they talk -> it hits the chairs -> the open sea heaving)
  { a: 41.3, b: 65.9, vo: "RAW", src: "kng.mp4", from: 31.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 65.9, b: 71.88, vo: "That same morning, a British schoolgirl on a beach in Phuket saw the sea pull back and froth.",
    node: <Drawdown bg={GR + "kng_sea.jpg"} label="MAI KHAO BEACH, PHUKET" labelAt={F(1.2)} pull={[F(1.4), F(4.4)]} hump={[F(4.2), F(6.0)]} /> },
  { a: 71.88, b: 76.68, vo: "She recognised it from a geography lesson, and she got her family and the beach cleared.",
    node: <Aerial src={GR + "maikhao.jpg"} iw={2564} ih={3767} spot={[1010, 1850, 1190, 2650]} z0={1.25} z1={1.5} label="MAI KHAO BEACH" boxAt={F(0.5)} labelAt={F(1.0)} /> },
  // "There's a boat coming in with this surge." -> the same shot runs on into RAW 3 (the boat carried in, the wave breaking)
  { a: 76.68, b: 89.58, vo: "boat line + RAW 3", src: "kng.mp4", from: 67.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 89.58, b: 92.4, vo: "Julian Hadden says everyone in his group survived. (0.5x: the group walking off the beach)", src: "kng_group_slow.mp4", from: 1.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 92.4, b: 99.86, vo: "Across the Indian Ocean around 228,000 people didn't, at least 5,400 of them in Thailand.",
    node: <OceanReach img={GR + "io.jpg"} bbox={[38, -20, 110, 28]} field={GR + "io_T.png"} tmaxh={10} hours={[F(4.6), 0.2, 7.6]}
      cam0={[78, 5, 64]} cam1={[80, 6, 58]} box={[97.3, 6.4, 99.6, 9.9]} boxAt={F(4.7)} label="THAILAND" /> },
  { a: 99.86, b: 103.0, vo: "The far side of a small island (slow replay: the surge round the tree)", src: "kng_replay.mp4", from: 0, s0: 1.12, s1: 1.2, fx: 0.5, fy: 0.55 },
  { a: 103.0, b: 106.6, vo: "turned out to be one of the luckiest places anyone stood that morning. (0.5x)", src: "kng_end_slow.mp4", from: 0.05, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(11.77), kind: "whip", len: 10 },
  { at: F(26.8), kind: "blurDip", len: 12 },
  { at: F(65.9), kind: "glitch", len: 8 },
  { at: F(71.88), kind: "blurDip", len: 12 },
  { at: F(89.58), kind: "blurDip", len: 12 },
  { at: F(99.86), kind: "blurDip", len: 12 },
  { at: F(103.0), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [11.72, "sfx_n2/whoosh_03.wav", -28],
  [12.0, X + "sub_drop_2.wav", -22],          // the seabed breaks
  [17.8, "sfx_n2/whoosh_01.wav", -30],        // the dive
  [35.6, X + "reverse_swell_1.wav", -26],     // the crests roll in
  [65.85, "sfx_n2/glitch_03.wav", -28],
  [67.2, X + "reverse_swell_3.wav", -30],     // the sea runs out
  [71.9, "sfx_n2/whoosh_02.wav", -32],
  [92.4, X + "sub_drop_1.wav", -24],
];

// raw windows [edit start, edit end, source start]: Julian's own sound (rawclean.py output, music-checked), faded in/out inside the window
const RAWS: [number, number, number][] = [[26.8, 32.3, 0.05], [41.3, 65.9, 31.0], [79.0, 89.58, 69.32]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE WAVE AROUND KOH NGAI" bg={GR + "kng_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where a raw plays */}
      <Sequence from={F(4.0)} durationInFrames={F(22.75)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} /></Sequence>
      <Sequence from={F(32.55)} durationInFrames={F(31.3) - F(22.59)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(22.59)} /></Sequence>
      <Sequence from={F(66.2)} durationInFrames={F(43.86) - F(31.15)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(31.15)} /></Sequence>
      <Sequence from={F(89.9)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(43.86)} /></Sequence>
      {RAWS.map(([a, b, src], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("case/media/kng_clean.wav")} startFrom={F(src)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(b - a) - 10, F(b - a) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, under the VO only; out for each raw */}
      <Sequence from={F(4.0)} durationInFrames={F(27.2) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(8)} volume={(f) => dB(-15) * interpolate(f, [0, 30, F(21.6), F(23.2)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(32.0)} durationInFrames={F(42.0) - F(32.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(34)} volume={(f) => dB(-15) * interpolate(f, [0, 20, F(8.6), F(10.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(65.6)} durationInFrames={F(80.0) - F(65.6)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(48)} volume={(f) => dB(-15) * interpolate(f, [0, 20, F(13.0), F(14.4)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(89.3)} durationInFrames={F(106.6) - F(89.3)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(70)} volume={(f) => dB(-15) * interpolate(f, [0, F(1.5), F(15.6), F(17.3)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
