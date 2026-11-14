// Workplace video — INTRO (VID WP). Same family as TOR00 / ND00 / TP00 (one continuous 3-D move through the video's own case clips under
// the whole VO, no raws, no clip sound) but its own idea: dev/WP00_PortYard — the clips are screens on the walls of stacked shipping
// containers in a port yard at dusk, and the camera moves like a yard crane. Beats (VO from "A grain tank on a farm"; the take's first line
// "Thirty workplace incidents, five levels." is skipped: two cases were dropped): the Switz City grain tank (WP01) low on the first
// stack -> one stack along and a tier up, the UTS crane (WP02) -> up again, Sitakunda's BM container depot (WP27) -> down a tier,
// the Brumadinho dam (WP30) -> "Every one of them was somewhere people had gone to work": the camera cranes up and back over the yard,
// every stack carrying a case clip -> swoops down over the front row into the aisle behind it to a clip on the top tiers, Lynchburg
// (WP05) "Near the top" -> lowers along the aisle to ground level, Tianjin's dashcam street with the glow at its end (WP29) "The further
// down it goes ... seen coming", a slow push, blur-dip into the video title (dev/TOR00_VideoTitle) over the Alemoa tanks burning (WP03).
// Footage: windows cut into CASE00/assets and graded --house (tank/crane/titlebg from WP01/02/03's graded files); see build/CASE00/NOTES.md.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel } from "../brand";
import { VideoTitle } from "../dev/TOR00_VideoTitle";
import { PortYard, buildYard, panelPos, ROWS, type Tex } from "../dev/WP00_PortYard";
import type { Key } from "../dev/TOR00_ClipField";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V = 1.0, V0 = 2.6;  // INTRO.mp3 played from 2.6 s ("A grain tank", word at 2.63) placed at comp 1.0; last word ends comp 19.86
const T = 20.7;           // blur-dip into the video title
export const DUR = F(T + 4.0);
const D = 470;            // eye-to-hero distance (~70 % of frame)

type Hero = { id: string; row: number; i: number; tiers: number; tier: number; tex: Tex; at: number; out: number; push: number; label: string };
const H: Hero[] = [
  { id: "tank", row: 0, i: 0, tiers: 3, tier: 0, tex: { src: GR + "tank.mp4", len: 9, fit: true, q: 2 }, at: 36, out: 70, push: 40, label: "SWITZ CITY, INDIANA · 2017" },   // "A grain tank on a farm,"
  { id: "crane", row: 0, i: 1, tiers: 5, tier: 1, tex: { src: GR + "crane.mp4", len: 9, q: 2 }, at: 100, out: 124, push: 40, label: "SYDNEY, AUSTRALIA · 2012" },          // "a crane over a city street,"
  { id: "depot", row: 0, i: 2, tiers: 6, tier: 2, tex: { src: GR + "depot.mp4", len: 9, fit: true, q: 2 }, at: 158, out: 180, push: 40, label: "SITAKUNDA, BANGLADESH · 2022" }, // "a chemical depot by a port,"
  { id: "dam", row: 0, i: 3, tiers: 4, tier: 1, tex: { src: GR + "dam.mp4", len: 10, q: 3.5 }, at: 212, out: 262, push: 50, label: "BRUMADINHO, BRAZIL · 2019" },      // "a dam above a mine canteen at lunchtime."
  { id: "lyn", row: 1, i: -1, tiers: 6, tier: 3, tex: { src: GR + "lyn.mp4", len: 9, q: 1.2 }, at: 394, out: 492, push: 70, label: "LYNCHBURG, VIRGINIA · 2014" },       // "Near the top, everyone goes home, ..."
  { id: "tj", row: 1, i: -2, tiers: 3, tier: 0, tex: { src: GR + "tj.mp4", len: 13, q: 8 }, at: 532, out: F(T) + 2, push: 190, label: "TIANJIN, CHINA · 2015" },       // "The further down it goes, ... seen coming."
];
const still = (n: string, fit = false): Tex => ({ src: GR + n + ".jpg", still: true, fit });
const clip = (n: string, len = 5): Tex => ({ src: GR + n + ".mp4", len });
const FILL: Tex[] = [clip("sr", 9), still("s19"), clip("f07"), still("s09", true), clip("f12"), still("s22"), still("s13"), still("f24s"), still("s25"),
  still("yss"), still("s08"), still("f16s"), still("s14"), still("s02", true), still("fR4s"), still("s20"), still("s27"), still("f06s"), still("s11"), still("s18")];
const FIXED: Record<string, { tiers: number; panel?: { tex: Tex; tier: number; id: string } }> = {
  ...Object.fromEntries(H.map((h) => [`${h.row}:${h.i}`, { tiers: h.tiers, panel: { tex: { ...h.tex, at: h.at }, tier: h.tier, id: h.id } }])),
  "0:-1": { tiers: 2 }, "0:-2": { tiers: 2 }, "0:-3": { tiers: 1 }, "0:4": { tiers: 3 }, // low front row where the camera swoops over into the aisle
  "1:0": { tiers: 4 }, "1:-3": { tiers: 5 },
};
const STACKS = buildYard(FIXED, FILL);

const eye = (h: Hero, f: number, dz = 0, dx = 0): Key => { const p = panelPos(h.row, h.i, h.tier); return { f, x: p.x + dx, y: p.y, z: p.z + D + dz }; };
const PATH: Key[] = [
  { f: 0, x: -520, y: -1100, z: 2300 },
  ...H.slice(0, 4).flatMap((h, k) => [eye(h, h.at), eye(h, h.out, -h.push, k % 2 ? -10 : 10)]),
  { f: 304, x: 1000, y: -2050, z: 2750 }, { f: 336, x: 820, y: -2140, z: 2900 },       // crane up and back: the whole yard
  eye(H[4], H[4].at), eye(H[4], H[4].out, -H[4].push, 12),
  eye(H[5], H[5].at), eye(H[5], H[5].out, -H[5].push, -8),
];
// aim: y = focus distance, z = pitch (negative looks down)
const AIM: Key[] = [
  { f: 0, x: 0, y: 1900, z: -15 }, { f: 36, x: 0, y: D, z: 0 }, { f: 262, x: 0, y: D, z: 0 },
  { f: 304, x: 0, y: 3300, z: -29 }, { f: 336, x: 0, y: 3450, z: -30 }, { f: 394, x: 0, y: D, z: 0 },
];
export const _debug = { PATH, AIM, STACKS, ROWS };

const CUTS: FxCut[] = [{ at: F(T), kind: "blurDip", len: 14 }];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(T)} layout="none"><AbsoluteFill>
            <FilmLook_FX grain={0.07}>
              <CameraMotionBlur samples={4} shutterAngle={150}><PortYard stacks={STACKS} path={PATH} aim={AIM} /></CameraMotionBlur>
            </FilmLook_FX>
            {H.map((h) => <RedLabel key={h.id} text={h.label} at={h.at + 2} hold={h.id === "tj" ? 70 : h.out - h.at + 2} />)}
          </AbsoluteFill></Sequence>
          <Sequence from={F(T)} durationInFrames={DUR - F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={0.5} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "THE MOST DISTURBING", size: 104, at: F(0.25) }, { text: "WORKPLACE INCIDENTS", size: 104, at: F(0.55) }, { text: "ICEBERG", size: 64, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take from "A grain tank", continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} startFrom={F(V0)} /></Sequence>
      {/* music: Epidemic ambient Music 5 (as TOR00/ND00, another stretch of it), ≈10 LU under the VO, swells into the title */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(52)} volume={(f) => dB(-13) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.4), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
