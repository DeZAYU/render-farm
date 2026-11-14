// Amusement Parks Iceberg — INTRO ("The Scary & Disturbing Amusement Parks Iceberg Explained", Old Heritage Files), rebuilt 14 Nov on the
// owner's own channel intro (mwYeratelA0 0-17 s, _ref/IntroRef): dev/OHF_PanelIntro — montage of the strongest case clips as centred 4:3 /
// portrait panels over a blurred, bloomed copy (wide shots full frame), VHS dropouts, glitch slices on the cuts, one white flash (into the
// cord burst); the "Viewer discretion is highly advised" card on the VO's own line; then the black card in the same red condensed style
// naming LEVEL 1 / THE TIP (iceberg: AM01 opens on the Level 1 entry); white flash out.
// VO INTRO.mp3 whole and continuous from 0.3 s, no clip sound; Epidemic ambient Music 4 under it.
// Old berg-flight version: build/CASE00/AM00_berg.tsx.bak + out/AM00_berg.mp4.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { CaseCard, DiscretionCard, PanelMontage, type PClip } from "../dev/OHF_PanelIntro";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 0.3;                 // INTRO.mp3 starts here; words (global): "This is the scary and disturbing" 0.3-1.88 "amusement parks iceberg." -3.72 |
                               // "Near the top, it's malfunctions" -5.73 "guests caught on their phones," -7.35 | "like a launch cord fraying in
                               // Florida," -9.43 | "where everyone got off alive." -11.4 | "Each level down gets heavier," -13.21 | "until we reach
                               // a small French park" -15.16 | "where one coaster took two lives." -17.41 | "Viewer discretion is highly advised." -19.71
const D0 = 17.41, D1 = 19.85;  // discretion card (on the VO's line)
export const DUR = F(22.35);

// graded windows (CASE00/graded, cut + graded --house for the berg-flight version; outline safe windows, blur notes respected:
// Saw Mill girls' faces / El Gusanito boy and the 0:28 moment / Green Plaza failure all outside the windows; Krissy Hurst's clip muted)
const CLIPS: PClip[] = [
  { id: "gus", src: GR + "gus.mp4", start: 0, end: 1.88, from: 0.5, w: 1440 },                 // c03 El Gusanito: the worm train looping at night
  { id: "fut", src: GR + "fut.mp4", start: 1.88, end: 3.72, from: 0.2, w: 1330 },              // c04 Objectif Mars: flames under the car
  { id: "ts", src: GR + "ts.mp4", start: 3.72, end: 5.73, from: 2.8, w: 1440 },                // c09 Top Spin jammed upright ("malfunctions")
  { id: "ph", src: GR + "ph.mp4", start: 5.73, end: 7.35, from: 1.0, w: 1440 },                // c01 Hurst's phone clip ("guests caught on their phones")
  { id: "bu", src: GR + "bu.mp4", start: 7.35, end: 9.43, from: 0.3, w: 1920, flashIn: true }, // c01 the cord bursting (0.5x; burst ~0.9 s in, on "fraying")
  { id: "off", src: GR + "off.mp4", start: 9.43, end: 11.4, from: 0.5, w: 1920 },              // c01 the riders still strapped in ("got off alive")
  { id: "gp", src: GR + "gp.mp4", start: 11.4, end: 13.21, from: 1.0, w: 1430 },               // c10 Green Plaza CCTV, before the failure ("heavier")
  { id: "ent", src: GR + "psp_ent.jpg", still: true, start: 13.21, end: 15.16, w: 1440, push: 0.07 }, // c20 PARC DE ST PAUL arch ("a small French park")
  { id: "psp", src: GR + "psp.jpg", still: true, start: 15.16, end: D0, w: 1440, push: 0.08, pos: "50% 60%" }, // c20 the park today ("one coaster took two lives")
];

const X = "sfx_n2/";
const SFX: [number, string, number][] = [
  [D0 - 0.05, X + "glitch_02.wav", -34],
  [D1, X + "title_hit_01.wav", -26],
  [21.9, X + "whoosh_02.wav", -31],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Sequence from={0} durationInFrames={F(D0)} layout="none"><FilmLook_FX grain={0.08} vig={0.6}><PanelMontage clips={CLIPS} seed="amA" /></FilmLook_FX></Sequence>
      <Sequence from={F(D0)} durationInFrames={F(D1) - F(D0)} layout="none"><DiscretionCard dur={F(D1) - F(D0)} /></Sequence>
      <Sequence from={F(D1)} durationInFrames={DUR - F(D1)} layout="none"><CaseCard dur={DUR - F(D1)} big="LEVEL 1" sub="THE TIP" /></Sequence>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4 (~10 LU under the VO), up a little on the level card, out on the flash */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(6)} volume={(f) => dB(-23.5) * interpolate(f, [0, 12, F(D1 - 0.3), F(D1 + 0.2), DUR - 8, DUR], [0, 1, 1, 1.35, 1.35, 0.2], cl)} />
      </Sequence>
      {SFX.map(([t, s, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(s)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
