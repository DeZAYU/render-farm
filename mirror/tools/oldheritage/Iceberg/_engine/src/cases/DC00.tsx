// Dashcam video — INTRO ("20 Most Disturbing Dashcam Moments Ever Caught on Camera"), rebuilt 14 Nov on the owner's own channel intro
// (Old Heritage Files mwYeratelA0 0-17 s, _ref/IntroRef): dev/OHF_PanelIntro — montage of the strongest case clips as centred 4:3 /
// portrait panels over a blurred, bloomed copy (wide shots full frame), VHS dropouts, glitch slices on the cuts, one white flash; the
// "Viewer discretion is highly advised" card on the VO's own "Viewer discretion is advised" line; montage resumes under the subscribe line;
// black CASE 01 card (red D-DIN Condensed) "THE EXCAVATOR ARREST / HARDWICK, VERMONT"; white flash out into DC01.
// VO INTRO.mp3 whole and continuous from 0.3 s, no clip sound; Epidemic ambient Music 3 under it.
// Old night-road version: build/CASE00/DC00_nightroad.tsx.bak + out/DC00_nightroad.mp4.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { CaseCard, DiscretionCard, PanelMontage, type PClip } from "../dev/OHF_PanelIntro";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.3;                 // INTRO.mp3 starts here; words (global): "These are twenty of the most disturbing" 0.3-2.05 | "dashcam moments
                               // ever caught on camera." -4.63 | "Some of them are close calls that" -6.21 "everybody drove away from," -7.72 |
                               // "and some of them still don't have an answer." -9.95 | "Viewer discretion is advised." -12.08 | "If you'd like
                               // more of these," -13.38 | "subscribing is the easiest way to make sure the next one finds you." -17.14
const D0 = 9.95, D1 = 12.25;   // discretion card
const C0 = 17.4;               // CASE 01 card
export const DUR = F(19.9);

// graded windows = build/CASE00/shots/cut.sh (cut from each case's raw, graded --house; blur notes respected: no Bentley #11 clip, no
// #20 walk-out, no Tulsa interior cam, Khayelitsha reversing away with the men far off)
const CLIPS: PClip[] = [
  { id: "exc", src: GR + "exc.mp4", start: 0, end: 2.05, from: 2.2, w: 1440 },                  // c01 Hardwick: the bucket over the cruiser
  { id: "plane", src: GR + "plane.mp4", start: 2.05, end: 4.63, from: 1.6, w: 1920, z0: 1.12, origin: "50% 0%" }, // c07 Clearwater: the plane comes down on the road (date stamp zoomed off the bottom)
  { id: "train", src: GR + "train.mp4", start: 4.63, end: 6.21, from: 2.3, w: 1440 },           // c16 Brook Park: the train hit ("close calls")
  { id: "khay", src: GR + "khay.mp4", start: 6.21, end: 7.72, from: 1.0, w: 1320 },             // c02 Khayelitsha: reversing away ("drove away from")
  { id: "trees", src: GR + "trees.mp4", start: 7.72, end: D0, from: 1.2, w: 1080, flashIn: true }, // c12 the domino forest ("still don't have an answer")
  { id: "mud", src: GR + "mud.mp4", start: D1, end: 14.44, from: 2.0, w: 1920 },                // c15 Montecito: the mud wave
  { id: "mill", src: GR + "mill.mp4", start: 14.44, end: C0, from: 0.6, w: 1440 },              // c10 Jay: the mill blast (fireball ~1.4 s in)
];

const X = "sfx_n2/";
const SFX: [number, string, number][] = [
  [D0 - 0.05, X + "glitch_02.wav", -33],
  [D1 - 0.05, X + "glitch_01.wav", -34],
  [C0, X + "title_hit_01.wav", -26],
  [19.45, X + "whoosh_02.wav", -31],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(D0)} layout="none"><FilmLook_FX grain={0.08} vig={0.6}><PanelMontage clips={CLIPS.filter((c) => c.start < D0)} seed="dcA" /></FilmLook_FX></Sequence>
      <Sequence from={F(D0)} durationInFrames={F(D1) - F(D0)} layout="none"><DiscretionCard dur={F(D1) - F(D0)} /></Sequence>
      <Sequence from={F(D1)} durationInFrames={F(C0) - F(D1)} layout="none">
        <FilmLook_FX grain={0.08} vig={0.6}><PanelMontage clips={CLIPS.filter((c) => c.start >= D1).map((c) => ({ ...c, start: c.start - D1, end: c.end - D1 }))} seed="dcB" /></FilmLook_FX>
      </Sequence>
      <Sequence from={F(C0)} durationInFrames={DUR - F(C0)} layout="none"><CaseCard dur={DUR - F(C0)} big="CASE 01" sub="THE EXCAVATOR ARREST / HARDWICK, VERMONT" /></Sequence>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 3 (~10 LU under the VO), up a little on the CASE card, out on the flash */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => dB(-19) * interpolate(f, [0, 12, F(C0 - 0.3), F(C0 + 0.2), DUR - 8, DUR], [0, 1, 1, 1.35, 1.35, 0.2], cl)} />
      </Sequence>
      {SFX.map(([t, s, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(s)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
