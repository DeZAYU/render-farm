// Tornado video — INTRO. A countdown video: no iceberg. Cold open on two of the video's strongest moments with their own sound
// (Washington, Illinois: "you ready to run with me?" with the wedge behind the homes; Elie, Manitoba: "It's ripping something up now",
// the cut sheet's cold-open line), then the intro VO over a fast, clean montage of real footage from eight other cases, each shot on
// its phrase (aftermath for "the next morning", chasers for "on purpose", a doorbell and the Joplin ER for "before any warning"),
// ending on the video's title card in the channel serif. Hard cuts only, one blur-dip into the title; no flash, no glitch spam.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(30.0);

type Sh = { a: number; b: number; vo: string; src: string; from: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; over?: React.ReactNode };
// graded windows (media/*.mp4 cut from the raw clips): lanc 99.6 / roque 52.0 / junko 64.0 / clem 82.0 / hughes 10.5 / drive 4.0 /
// carport 48.0 / er 106.0 (6 fps CCTV, the lights drop at +1.0) / wedge 215.5 / titlebg 300.0 (+2.8, after its source cut at +2.1)
const SHOTS: Sh[] = [
  // COLD OPEN (own sound)
  { a: 0.0, b: 4.4, vo: "COLD: Washington, Illinois, the wedge behind the homes: 'you ready to run with me? be ready to run with me' (LANC 100.2-104.6)", src: "lanc.mp4", from: 0.6, s0: 1.0, s1: 1.06,
    over: <RedLabel text="WASHINGTON, ILLINOIS" at={F(0.5)} hold={F(3.2)} /> },
  { a: 4.4, b: 8.4, vo: "COLD: Elie, Manitoba: 'It's ripping something up now' (ROQUE 52.6-56.6; the 15 fps source jumps at 56.7)", src: "roque.mp4", from: 0.6, s0: 1.0, s1: 1.06, fill: true,
    over: <RedLabel text="ELIE, MANITOBA" at={F(0.4)} hold={F(3.4)} /> },
  // VO montage (VO at 9.4)
  { a: 8.4, b: 12.5, vo: "Tornadoes used to be something most people heard about the next morning. (Washington, Indiana, the lot after)", src: "after.mp4", from: 0.0, s0: 1.02, s1: 1.1 },
  { a: 12.5, b: 14.2, vo: "These are twenty-five times people were standing (Tsukuba: the funnel at the power pole)", src: "junko.mp4", from: 0.5, s0: 1.03, s1: 1.09 },
  { a: 14.2, b: 16.8, vo: "right there when one arrived. (Fairdale: from Clem Schultz's window)", src: "clem.mp4", from: 0.5, s0: 1.16, s1: 1.22, fx: 0.3, fy: 0.3 },
  { a: 16.8, b: 18.6, vo: "A few were there on purpose. (Elie: the funnel through the windshield)", src: "hughes.mp4", from: 0.5, s0: 1.03, s1: 1.1 },
  { a: 18.6, b: 20.1, vo: "Most of them weren't. (Moore: the tornado across the street)", src: "drive.mp4", from: 0.5, s0: 1.03, s1: 1.08 },
  { a: 20.1, b: 21.9, vo: "And in some of these, the tornado got there (Moore: the black tornado beyond the carport; the doorbell clip flashed frame to frame)", src: "carport.mp4", from: 0.5, s0: 1.03, s1: 1.08 },
  { a: 21.9, b: 23.8, vo: "before any warning did. (Joplin: the ER waiting room as the lights drop)", src: "er.mp4", from: 0.3, s0: 1.02, s1: 1.06, fill: true },
  { a: 23.8, b: 25.1, vo: "Worst first. (Chapman: the wedge)", src: "wedge.mp4", from: 0.5, s0: 1.04, s1: 1.1 },
];

const CUTS: FxCut[] = [
  { at: F(25.1), kind: "blurDip", len: 14 }, // into the title
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => (
  <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} fill={s.fill} /></FilmLook_FX>
);

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [20.1, X + "wind_gust_1.wav", -30],     // the carport clip is silent
  [21.95, X + "sub_drop_1.wav", -22],     // the ER lights drop (silent CCTV)
  [22.4, X + "impact_2.wav", -24],
  [25.0, "sfx_n2/whoosh_02.wav", -28],    // into the title
  [25.6, "sfx_n2/title_hit_01.wav", -26],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
          <Sequence from={F(25.1)} durationInFrames={F(30.0) - F(25.1)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={2.8} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST DISTURBING", size: 112, at: F(0.25) }, { text: "TORNADO ENCOUNTERS", size: 112, at: F(0.55) }, { text: "EVER CAUGHT ON CAMERA", size: 58, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* cold open: each clip's own sound (cleaned by rawclean.py, owner rule 5b), short fades at the hard cut, out before the VO */}
      <Sequence from={0} durationInFrames={F(4.4)} layout="none"><Audio src={staticFile(C + "media/lanc_clean.wav")} startFrom={F(0.6)} volume={(f) => interpolate(f, [0, 3, F(4.4) - 4, F(4.4)], [0, 1, 1, 0], cl)} /></Sequence>
      <Sequence from={F(4.4)} durationInFrames={F(4.0)} layout="none"><Audio src={staticFile(C + "media/roque_clean.wav")} startFrom={F(0.6)} volume={(f) => dB(4) * interpolate(f, [0, 3, F(3.7), F(4.0)], [0, 1, 1, 0], cl)} /></Sequence>
      {/* VO: the intro take, whole */}
      <Sequence from={F(9.4)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5, in under the VO, swells into the title, out with it */}
      <Sequence from={F(8.8)} durationInFrames={F(30.0) - F(8.8)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(20)} volume={(f) => dB(-13) * interpolate(f, [0, 24, F(16.0), F(17.0), F(19.6), F(21.2)], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
