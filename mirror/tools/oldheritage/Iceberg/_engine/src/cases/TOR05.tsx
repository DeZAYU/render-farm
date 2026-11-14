// Tornado #5 — Tuscaloosa, Alabama, 27 April 2011 (high-end EF4, Tuscaloosa–Birmingham). Channel grammar + devices built for this case:
//   OutbreakZoom (dev/TOR05_OutbreakZoom): the NWS/Alabama EMA map of every 27 April track as a lit table: the day -> this track ->
//                Birmingham -> the Cullman track to the north (light pool follows the camera, nothing drawn on the map).
//   WarnDial     (dev/TOR05_WarnDial): the 3:09 PM warning -> 5:10 PM arrival as a clock sweep over the dimmed storm.
//   ScaleRead    (dev/TOR05_ScaleRead): a held frame; a white bracket on one building in front, pulled out to the width of the wedge.
//   NOAA post-storm aerial (29 Apr 2011, NGS): Bryant-Denny Stadium, the swath through Forest Lake (the lake is visible).
// Footage: Bamawxcom's "Unedited Raw Version" (T0FHTG9VETY, 640x480), Sam Mujahed's storefront phone video (kTgSaq2nRiU, vertical,
// shown on its own blurred copy). Raw sound = rawclean.py output (_clean.wav), never the clip track. Store raws are cut where no
// swearing is spoken (checked with whisper: 1:58-2:30 holds only "whoa / oh my gosh / look at that guy").
// Source cuts: bama 290.9-292.3, 346-351, 361.5-368.2, 374-387, 395.0, 414.5, 427.6, 442-443.8; store black from ~151.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { OutbreakZoom } from "../dev/TOR05_OutbreakZoom";
import { WarnDial } from "../dev/TOR05_WarnDial";
import { ScaleRead } from "../dev/TOR05_ScaleRead";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(190.15);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO parts: [abs start, take start, take end]
// 3 Nov raw audit: 3 raws (wedge over the city, debris, ONE store raw); old raws 2/6/7 (after explanation, near-dup wedges) removed
const VO: [number, number, number][] = [
  [4.0, 0.0, 17.44], [36.0, 17.44, 47.60], [80.72, 47.60, 52.78], [111.52, 52.78, 130.63],
];
// raws: [picture a, b, source from, audio start, gain dB, file, fade in f, fade out f]
const RAWS: [number, number, number, number, number, string, number?, number?][] = [
  [21.7, 35.7, 16.0, 21.7, -5.5, "bama"],
  [66.42, 80.42, 185.6, 66.42, -5.5, "bama"],
  [86.22, 96.32, 122.0, 86.22, -7, "store", 6, 6],      // one store raw: the two windows overlap 0.1 s at the blur-dip
  [96.22, 111.22, 134.5, 96.22, -6, "store", 4, 20],
];
const MAP = GR + "statemap.jpg", MW = 1097, MH = 1080; // NWS BMX statewide map, cropped off its legend column

const SHOTS: Sh[] = [
  // P1
  { a: 4, b: 7.3, vo: "The 27th of April 2011 was one of the worst tornado days (the wedge from the interstate)", src: "bama.mp4", from: 0.8, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.35,
    over: <RedLabel text="APRIL 27, 2011" at={F(0.4)} hold={F(2.6)} /> },
  { a: 7.3, b: 15.18, vo: "...and this is the middle of it. It first touched the ground in rural Greene County at about 4:43. (the day's tracks -> this one)",
    node: <OutbreakZoom src={MAP} iw={MW} ih={MH} keys={[[0, 620, 560, 1.28], [40, 610, 570, 1.3], [150, 300, 700, 2.3], [237, 235, 742, 2.7]]} labels={[{ text: "GREENE COUNTY, 4:43 PM", at: 160 }]} /> },
  { a: 15.18, b: 18.3, vo: "Just after five, it reached Tuscaloosa, Alabama,", src: "bama.mp4", from: 40.5, s0: 1.05, s1: 1.1, fx: 0.55, fy: 0.35,
    over: <RedLabel text="TUSCALOOSA, ALABAMA" at={F(0.3)} hold={F(2.6)} /> },
  { a: 18.3, b: 21.7, vo: "and crossed the city near the McFarland Boulevard exit.", src: "bama.mp4", from: 118.0, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.4 },
  { a: 21.7, b: 35.7, vo: "RAW 1: the wedge over the city, trucks on the interstate", src: "bama.mp4", from: 16.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.35 },
  // P2
  { a: 35.7, b: 39.39, vo: "At a mile and a half wide there's no funnel shape left to find.", src: "bama.mp4", from: 63.6, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.3 },
  { a: 39.39, b: 41.42, vo: "You judge it by the buildings in front of it. (ScaleRead)",
    node: <ScaleRead src={GR + "scale76.jpg"} iw={1920} ih={1080} y={522} unit={[1775, 1912]} span={[400, 1200]} drawAt={4} stretchAt={22} /> },
  // P3 (56.0)
  { a: 41.42, b: 46.58, vo: "High-end EF4, about a hundred and ninety, on a track of more than eighty miles.", src: "bama.mp4", from: 136.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.35 },
  { a: 46.58, b: 52.7, vo: "The first tornado warning on this storm had gone out at 3:09, about two hours before it reached the city. (WarnDial)",
    node: <WarnDial bg={GR + "bama.mp4"} bgFrom={144.0} t0={189} t1={310} sweepAt={14} landAt={130} l0="WARNING, 3:09 PM" l1="TUSCALOOSA, 5:10 PM" l1At={112} /> },
  { a: 52.7, b: 57.91, vo: "Two hours is a long warning, and it still couldn't move a mile and a half of neighbourhoods out of the way.", src: "bama.mp4", from: 150.0, s0: 1.05, s1: 1.12, fx: 0.45, fy: 0.4 },
  { a: 57.91, b: 64.98, vo: "Somewhere inside that wall was the county's emergency management office, the building meant to run the response to a day like this.", src: "bama.mp4", from: 160.0, s0: 1.06, s1: 1.16, fx: 0.6, fy: 0.35,
    punches: [{ at: F(2.2), to: 1.08, len: 24 }] },
  { a: 64.98, b: 66.42, vo: "It was destroyed. (NWS survey photo)", src: GR + "ph12.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 66.42, b: 80.42, vo: "RAW 3: debris everywhere, the south and east side", src: "bama.mp4", from: 185.6, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.35 },
  // P4
  { a: 80.42, b: 86.22, vo: "Sam Mujahed was inside a store on the far side, behind a front made mostly of glass.", src: "store.mp4", from: 24.5, fill: true, s0: 1.0, s1: 1.03, fx: 0.5, fy: 0.5,
    over: <RedLabel text="SAM MUJAHED" at={F(0.6)} hold={F(3.2)} /> },
  // RAW 4 (86.22-111.22, 25 s): ONE store raw, approach (src 122-132, tight full-frame crop) -> blur-dip -> debris + whiteout (src 134.5-149.5, on its blurred copy)
  { a: 86.22, b: 96.22, vo: "RAW 4a: the wedge bearing down across the road toward the storefront", src: "store.mp4", from: 122.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.28 },
  { a: 96.22, b: 111.22, vo: "RAW 4b: the sign flies, debris, then the whiteout", src: "store.mp4", from: 134.5, fill: true, s0: 1.0, s1: 1.03, fx: 0.5, fy: 0.5 },
  { a: 111.22, b: 116.35, vo: "In a building like that, the safest place is as far from the front windows as you can get. (the glass front, the pillar; full-frame push, after the raw)", src: "store.mp4", from: 60.0, s0: 1.02, s1: 1.14, fx: 0.32, fy: 0.5 },
  // P6
  { a: 116.35, b: 119.72, vo: "Out by the interstate, the wall keeps moving across the city.", src: "bama.mp4", from: 218.6, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.35 },
  // P7
  { a: 119.72, b: 130.75, vo: "It carried on northeast toward Birmingham... a separate EF4 had crossed Cullman County to the north (OutbreakZoom: along to Birmingham, up to Cullman)",
    node: <OutbreakZoom src={MAP} iw={MW} ih={MH} keys={[[0, 400, 658, 2.4], [11, 400, 658, 2.4], [71, 600, 527, 2.1], [181, 600, 527, 2.0], [246, 585, 310, 2.2], [330, 590, 305, 2.3]]} labels={[{ text: "BIRMINGHAM", at: 49, hold: 120 }, { text: "CULLMAN COUNTY", at: 227 }]} /> },
  // P8 (180.0)
  { a: 130.75, b: 135.45, vo: "Sixty-four people lost their lives, forty-four of them around Tuscaloosa, (NWS aerial: the path)", src: GR + "aer3.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.55 },
  { a: 135.45, b: 140.22, vo: "including six University of Alabama students, and more than fifteen hundred were hurt. (NOAA aerial: the campus, a mile from the swath)",
    node: <Aerial src={GR + "noaa_pair.jpg"} iw={8320} ih={4160} spot={[1800, 700, 2220, 1200]} z0={1.6} z1={1.9} label="UNIVERSITY OF ALABAMA" boxAt={8} labelAt={14} /> },
  { a: 140.22, b: 146.07, vo: "It lasted an hour and thirty-one minutes, and the bill came to about two point four billion dollars. (NWS aerial)", src: GR + "aer4.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.5, fy: 0.5 },
  { a: 146.07, b: 148.75, vo: "Rosedale, Forest Lake, (NOAA: the swath through Forest Lake)",
    node: <Aerial src={GR + "noaa_pair.jpg"} iw={8320} ih={4160} spot={[4380, 2750, 4720, 3500]} z0={1.5} z1={1.7} label="FOREST LAKE" boxAt={4} labelAt={8} /> },
  { a: 148.75, b: 150.97, vo: "Cedar Crest and Alberta City were wrecked whole. (NWS: Alberta City)", src: GR + "alberta.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="ALBERTA CITY" at={F(0.2)} hold={F(1.8)} /> },
  { a: 150.97, b: 155.15, vo: "Further on, outside Birmingham, the survey found house slabs wiped clean in Pleasant Grove, (NWS aerial)", src: GR + "aer6.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 155.15, b: 159.38, vo: "and small shops in Concord were destroyed completely. (HUD photo)", src: GR + "hud3.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.5, fy: 0.5 },
  { a: 159.38, b: 162.65, vo: "In Alberta City, the elementary school was almost entirely destroyed, (HUD photo: brick walls)", src: GR + "hud9.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 162.65, b: 165.77, vo: "and so was the shopping centre beside it. (HUD photo: store goods in the rubble)", src: GR + "hud2.jpg", still: true, s0: 1.08, s1: 1.02, fx: 0.5, fy: 0.6 },
  { a: 165.77, b: 170.86, vo: "It reached its widest, a mile and a half, later on, crossing Interstate 65. (the wedge moving away up the road)", src: "bama.mp4", from: 416.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.35 },
  { a: 170.86, b: 178.16, vo: "A tornado this wide takes neighbourhoods at once... a list of names. (NOAA: along the swath)",
    node: <Aerial src={GR + "noaa_pair.jpg"} iw={8320} ih={4160} spot={[5700, 2050, 6300, 2700]} z0={1.0} z1={1.35} boxAt={99999} /> },
  { a: 178.16, b: 184.72, vo: "The recovery was uneven... less affordable housing than it had before. (HUD photo: what was left of the houses)", src: GR + "hud6.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 184.72, b: 190.15, vo: "At the Chastain Manor Apartments, the whole east side of the complex was destroyed. (HUD photo: a flattened block)", src: GR + "hud8.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.3), kind: "zoomHit", len: 10 },
  { at: F(15.18), kind: "blurDip", len: 12 },
  { at: F(21.7), kind: "blurDip", len: 12 },
  { at: F(35.7), kind: "blurDip", len: 12 },
  { at: F(41.42), kind: "blurDip", len: 12 },
  { at: F(46.58), kind: "whip", len: 10, dir: 1 },
  { at: F(57.91), kind: "blurDip", len: 12 },
  { at: F(66.42), kind: "blurDip", len: 10 },
  { at: F(80.42), kind: "glitch", len: 8 },
  { at: F(96.22), kind: "blurDip", len: 12 },   // inside the store raw
  { at: F(111.22), kind: "blurDip", len: 12 },
  { at: F(116.35), kind: "glitch", len: 8 },
  { at: F(119.72), kind: "zoomHit", len: 10 },
  { at: F(130.75), kind: "glitch", len: 8 },
  { at: F(170.86), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [7.25, "sfx_n2/whoosh_01.wav", -30],
  [46.52, "sfx_n2/whoosh_03.wav", -30],
  [80.37, "sfx_n2/glitch_03.wav", -28],
  [116.3, "sfx_n2/glitch_01.wav", -30],
  [119.67, "sfx_n2/whoosh_02.wav", -30],
  [130.7, "sfx_n2/glitch_02.wav", -28],
];

// music: Music 5 (Epidemic ambient, -20.9 LUFS -> -13.5 dB); out under the raws (their own sound carries them), back on each VO block
const M5 = dB(-13.5);
const env = (t: number) => {
  const k: [number, number][] = [[4.0, 0], [5.0, 1]];
  const raws: [number, number][] = [[21.7, 35.7], [66.42, 80.42], [86.22, 111.22]];
  for (const [a, b] of raws) { k.push([a - 0.6, 1], [a + 0.2, 0], [b - 0.2, 0], [b + 0.8, 1]); }
  k.push([188.15, 1], [190.15, 0]);
  return interpolate(t, k.map((x) => x[0]), k.map((x) => x[1]), cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="A MILE AND A HALF WIDE" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, t0, t1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0) + (i === VO.length - 1 ? 24 : 0)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, from, au, g, file, fi = 6, fo = 20], i) => {
        const n = F(b) - F(au);
        return (
          <Sequence key={"r" + i} from={F(au)} durationInFrames={n} layout="none">
            <Audio src={staticFile(MD + file + "_clean.wav")} startFrom={F(from + (au - a))} volume={(f) => dB(g) * interpolate(f, [0, fi, n - fo, n - 2], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      <Sequence from={F(4.0)} durationInFrames={F(190.15) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(40)} loop volume={(f) => M5 * env(4.0 + f / 30)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
