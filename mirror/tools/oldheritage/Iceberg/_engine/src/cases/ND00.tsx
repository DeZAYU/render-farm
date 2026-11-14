// ND INTRO v5 (RingField: clips on the inside of a turning ring — owner: "adjacent intro style 3d but differently"). Was v4 — "The Most TERRIFYING Natural Disasters Ever Recorded" (3 Nov 2026). Built the way the owner approved on TOR00 ("ok looks
// good"): one continuous cinematic 3-D flight through a field of the video's own case clips (dev/TOR00_ClipField + dev/ClipFieldKit), silent
// under the music, the camera easing to one hero clip per VO beat. The calm "assumption" beats (Ōfunato harbour, Koh Ngai, the road below
// Fuego) are unlabelled; on "nineteen of the days it didn't" the camera pulls back as the field fans out, then pushes into the Ontake ash
// cloud, and every disaster hero carries its red place + year. Blur-dip into the title on "Let's begin." VO straight through from 0.5 s,
// no clip sound. Old versions (cold open, montage, GlobeRun): _engine/_bak_intro_raw/.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/ND00_VideoTitle";
import { RingField, ringCards, ringHeroes, ringPath, type RingHero } from "../dev/ND00_RingField";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.5;    // VO (INTRO.mp3, whole) starts here
const T = 22.55;  // title on "Let's begin." (V+22.05); VO ends V+23.17
export const DUR = F(26.85);
const D = 470;    // eye distance at a hero

// graded windows in CASE00/graded: ofu (harbour), kng, fue (traffic at 0.2, families running at 8.5), ont, ofu2 (houses carried at 8.0),
// tow (Toowoomba cars carried at 3.5), eve (5.0), cmp (Paradise, 1.0), kes (filler)
const B = [
  { id: "ofu", src: "ofu.mp4", len: 29.8, q: 4.4, at: 66, out: 104, label: "" },          // "...the ground stays put"
  { id: "kng", src: "kng.mp4", len: 3.45, q: 0.8, at: 126, out: 176, label: "" },         // "and the sea stays where we left it."
  { id: "fue1", src: "fue.mp4", len: 14, q: 0.6, at: 200, out: 238, label: "" },          // "Most days, that assumption holds."
  { id: "ont", src: "ont.mp4", len: 10, q: 1.0, at: 292, out: 314, label: "MOUNT ONTAKE, JAPAN · 2014" },        // "...the days it didn't."
  { id: "fue2", src: "fue.mp4", len: 14, q: 8.6, at: 340, out: 396, label: "FUEGO, GUATEMALA · 2018" },          // "A volcano turns a Sunday drive into a race."
  { id: "ofu2", src: "ofu2.mp4", len: 13.8, q: 8.4, at: 422, out: 488, label: "ŌFUNATO, JAPAN · 2011" },         // "A harbour fills to the rooftops..."
  { id: "tow", src: "tow.mp4", len: 12, q: 3.8, at: 512, out: 538, label: "TOOWOOMBA, AUSTRALIA · 2011" },       // "The most terrifying natural"
  { id: "eve", src: "eve.mp4", len: 10, q: 5.3, at: 560, out: 590, label: "EVEREST BASE CAMP · 2015" },          // "disasters ever recorded,"
  { id: "cmp", src: "cmp.mp4", len: 10, q: 1.4, at: 614, out: 668, label: "PARADISE, CALIFORNIA · 2018" },       // "and what the people ... did next."
] as RingHero[];
const H = ringHeroes(B, GR);
const card = (n: string) => ({ src: GR + "cards/ND" + n + ".jpg", still: true });
const PLANES = [...H, ...ringCards([
  { src: GR + "kes.mp4", len: 15.9 }, card("05"), card("06"), card("11"), card("13"), card("14"), card("15"), card("16"),
  card("17"), card("19"), card("10"), card("12"), card("04"), card("18"), card("09"), card("07"),
])];
const PATH = ringPath(H, B, 3, 262);

const CUTS: FxCut[] = [{ at: F(T), kind: "blurDip", len: 14 }];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill>
            <FilmLook_FX grain={0.07}>
              <CameraMotionBlur samples={4} shutterAngle={150}><RingField planes={PLANES} path={PATH} fan={[238, 262, 280, 300]} focus={D} /></CameraMotionBlur>
            </FilmLook_FX>
            {B.filter((h) => h.label).map((h) => <RedLabel key={h.id} text={h.label} at={h.at + 2} hold={h.out - h.at + 2} />)}
          </AbsoluteFill></Sequence>
          <Sequence from={F(T)} durationInFrames={DUR - F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "title_bg.jpg"} fadeAt={F(3.6)} lines={[{ t: "THE MOST", size: 64, at: F(0.15) }, { t: "TERRIFYING", size: 150, at: F(0.45) }, { t: "NATURAL DISASTERS EVER RECORDED", size: 64, at: F(0.85) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5 from the first frame under the VO, swells a little under the title, eases out */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(4)} volume={(f) => dB(-13) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.5), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      <Sequence from={F(T - 0.1)} layout="none"><Audio src={staticFile("sfx_n2/whoosh_02.wav")} volume={dB(-28)} /></Sequence>
      <Sequence from={F(T + 0.05)} layout="none"><Audio src={staticFile("sfx_n2/title_hit_01.wav")} volume={dB(-22)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
