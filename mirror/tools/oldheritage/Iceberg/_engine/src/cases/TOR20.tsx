// Tornado #20: Manchester, South Dakota (24 June 2003), the town that was erased. Footage: the HILL chase (uqNkAeU39gY, stormchase.net
// watermark delogo'd; own voices: "significant tornado damage ... hope I didn't destroy anybody's house", "big chunks of debris falling",
// "I wonder if anybody got hurt"), POL1 (43nv6terLrY, wind + "We don't have time!") and POL3 (BKb7eSNqjWs, the tornado over parked cars).
// Devices for THIS case: OutbreakClock (every SD tornado that day from the SPC database dropping at its own time), PressureTrace (the real
// Manchester probe reading -> 100 mb bracket -> ground vs ~1 km up), GhostFade (1991 USGS aerial, each building bracketed, 2004 photo
// dissolves under the brackets). Stills: NWS damage photos, the probe (field + museum), El Reno (NWS). All public domain / CC (NOTES.md).
// HILL source cuts 62.56, 70.44, 122.99, 174.94, 204.8 | POL1 11.67, 19.73-19.87, 22.73, 33.33, 40.8, 50.73, 59.47-59.87, 70.2, 71.33, 92.47
// | POL3 8.53, 10.6, 15.87, 28.6, 60.13, 107.73. Every window below sits between them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { OutbreakClock } from "../dev/TOR20_OutbreakClock";
import { PressureTrace } from "../dev/TOR20_PressureTrace";
import { GhostFade } from "../dev/TOR20_GhostFade";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(153.12);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO-1 take 0-23.45 at 20.1 (+20.1) | VO-3 take 23.68-27.5 at 51.8 | VO-4 take 27.65-29.3 at 56.02
// | VO-5 take 29.35-41.4 at 69.57 | VO-6 take 41.8-end at 95.94 (+54.14)
const SHOTS: Sh[] = [
  // RAW 1 (4.0-19.8): HILL, the wedge through the trees, "significant tornado damage here ... violent F4 F5 ... hope I didn't destroy anybody's house"
  { a: 4, b: 19.8, vo: "RAW: the tornado over the trees and farmland", src: "hill.mp4", from: 76.2, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 19.8, b: 23.53, vo: "It's Tuesday evening, the 24th of June 2003,", src: "hill.mp4", from: 140.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="JUNE 24, 2003" at={F(0.6)} hold={F(2.7)} /> },
  { a: 23.53, b: 25.77, vo: "in Kingsbury County, South Dakota.", src: "hill.mp4", from: 100.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.55,
    over: <RedLabel text="KINGSBURY COUNTY, SOUTH DAKOTA" at={F(0.2)} hold={F(1.8)} /> },
  { a: 25.77, b: 33.78, vo: "The state logged sixty-seven tornadoes that day, all in under eight hours. That tied the American record ... (SPC map)",
    node: <OutbreakClock base={GR + "bm.jpg"} iw={2400} ih={1350} runFrom={12} runTo={150} kingsAt={176} z={[1.32, 1.46]} focus={[1730, 700]} label="MANCHESTER F4" /> },
  { a: 33.78, b: 35.83, vo: "Chasers were out on every road.", src: "hill.mp4", from: 186.0, s0: 1.04, s1: 1.09, fx: 0.4, fy: 0.6 },
  { a: 35.83, b: 38.63, vo: "This one was an F4, about half a mile wide,", src: "hill.mp4", from: 117.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 38.63, b: 41.4, vo: "covering roughly twenty-five miles in twenty-four minutes.", src: "pol1.mp4", from: 52.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 41.4, b: 44, vo: "The next thing in its path was a town. (Manchester from above, 1991)",
    node: <Aerial src={GR + "man1991.jpg"} iw={2260} ih={1176} spot={[640, 360, 1500, 1170]} z0={1.0} z1={1.1} label="MANCHESTER, SOUTH DAKOTA" boxAt={4} labelAt={10} /> },
  // RAW 3 (44.0-51.5): POL1, the dark wedge over the fields, wind
  { a: 44, b: 51.5, vo: "RAW: the large tornado over the fields", src: "pol1.mp4", from: 24.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 51.5, b: 55.75, vo: "The survey estimated its winds at up to two hundred and sixty miles an hour. (NWS survey aerial: the scour across the fields)", src: GR + "dmg2.jpg", still: true, s0: 1.04, s1: 1.14, fx: 0.4, fy: 0.55 },
  { a: 55.75, b: 57.92, vo: "It's about to reach Manchester.", src: "hill.mp4", from: 160.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.55 },
  // RAW 5 (57.92-69.32): POL3, the tornado and debris cloud close above the parked cars
  { a: 57.92, b: 69.32, vo: "RAW: the tornado above the parked cars", src: "pol3.mp4", from: 16.6, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 69.32, b: 72.87, vo: "It went straight over Manchester, a town of six people.", src: "hill.mp4", from: 109.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 72.87, b: 76.87, vo: "Every structure was destroyed or swept away, the post office included. (NWS: Manchester's foundations)", src: GR + "dmg1.jpg", still: true, s0: 1.03, s1: 1.12, fx: 0.4, fy: 0.6 },
  { a: 76.87, b: 81.62, vo: "Four of the six were hurt, three of them badly enough for hospital, and all six survived. (the chaser's look at the damage)", src: "hill.mp4", from: 102.6, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.6 },
  // RAW 6 (81.62-95.72): HILL, the rope as it dies, "power lines down ... I wonder if anybody got hurt or killed"
  { a: 81.62, b: 95.72, vo: "RAW: the rope tornado beside the road as it dies", src: "hill.mp4", from: 341.5, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 95.72, b: 100.56, vo: "Nearby, Tim Samaras and his TWISTEX research team set a probe in its path. (a TWISTEX probe)", src: GR + "probe_field.jpg", still: true, s0: 1.04, s1: 1.14, fx: 0.5, fy: 0.55 },
  { a: 100.56, b: 105.2, vo: "A probe is a low, heavy cone of instruments that you drop on the road and drive away from. (the Manchester probe itself)",
    src: GR + "probe_museum.jpg", still: true, s0: 1.02, s1: 1.12, fx: 0.45, fy: 0.55, // full-frame push (Inset kept once per case: El Reno)
    over: <RedLabel text="THE MANCHESTER PROBE" at={F(0.5)} hold={F(3.4)} /> },
  { a: 105.2, b: 107.53, vo: "The team laid out several across the area.", src: "hill.mp4", from: 150.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 107.53, b: 113.07, vo: "When they came back, the gravel around it had been scoured off, except the patch directly underneath. (the gravel road)", src: "hill.mp4", from: 176.0, s0: 1.06, s1: 1.14, fx: 0.4, fy: 0.75 },
  { a: 113.07, b: 126.82, vo: "This probe was dropped just eighty-two seconds before ... a kilometre up a mountain. (the real reading)",
    node: <PressureTrace bg={GR + "hill_title.jpg"} keys={[[9, 0], [110, 82], [177, 95], [255, 225]]} secAt={44} dropAt={201} railAt={278} /> },
  { a: 126.82, b: 133.58, vo: "Manchester was never rebuilt ... Today it's a ghost town on the prairie. (1991 -> 2004)",
    node: <GhostFade then={GR + "man1991.jpg"} now={GR + "man2004.jpg"} iw={2260} ih={1176} focus={[1000, 700]} z={[1.08, 1.2]} markAt={8} every={8} fadeAt={118} fadeLen={40} thenLabel="1991" nowLabel="2004"
      marks={[[730, 220], [820, 300], [1380, 724], [600, 956], [734, 1036], [996, 1056], [400, 1050], [470, 1096], [304, 1092], [430, 910]]} /> },
  { a: 133.58, b: 139.6, vo: "The state disincorporated it in 2004, and a memorial went up on the old town site in 2007. (the site today, NAIP)",
    node: <Aerial src={GR + "naip.jpg"} iw={2000} ih={1125} spot={[870, 330, 1250, 570]} z0={1.0} z1={1.3} label="MANCHESTER TOWN SITE" boxAt={8} labelAt={16} /> },
  { a: 139.6, b: 146.59, vo: "Ten years later, on the 31st of May 2013, Samaras lost his life to a tornado near El Reno, Oklahoma. (NWS: the team's car)",
    node: <AbsoluteFill><Inset src={GR + "elreno.jpg"} still box={0.62} ar={4 / 3} drift={0.05} /><RedLabel text="MAY 31, 2013" at={F(0.5)} hold={F(2.6)} y={0.92} /><RedLabel text="EL RENO, OKLAHOMA" at={F(3.6)} y={0.92} /></AbsoluteFill> },
  { a: 146.59, b: 149.97, vo: "His son Paul and their colleague Carl Young were lost with him. (the rope, fading)", src: "hill.mp4", from: 300.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 149.97, b: 153.12, vo: "Everyone lived, and the town still didn't. (an empty foundation in Manchester)", src: GR + "dmg1.jpg", still: true, s0: 1.3, s1: 1.38, fx: 0.72, fy: 0.68 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(19.8), kind: "blurDip", len: 12 },
  { at: F(23.53), kind: "blurDip", len: 10 },
  { at: F(25.77), kind: "zoomHit", len: 10 },
  { at: F(33.78), kind: "blurDip", len: 12 },
  { at: F(35.83), kind: "blurDip", len: 10 },
  { at: F(41.4), kind: "glitch", len: 8 },
  { at: F(55.75), kind: "blurDip", len: 12 },
  { at: F(69.32), kind: "blurDip", len: 12 },
  { at: F(76.87), kind: "blurDip", len: 10 },
  { at: F(81.62), kind: "blurDip", len: 12 },
  { at: F(95.72), kind: "glitch", len: 10 },
  { at: F(105.2), kind: "blurDip", len: 10 },
  { at: F(107.53), kind: "blurDip", len: 10 },
  { at: F(113.07), kind: "whip", len: 10 },
  { at: F(126.82), kind: "blurDip", len: 14 },
  { at: F(133.58), kind: "blurDip", len: 12 },
  { at: F(139.6), kind: "glitch", len: 8 },
  { at: F(146.59), kind: "blurDip", len: 14 },
  { at: F(149.97), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

// raws: [timeline a, b, file, source from, dB]
const RAWS: [number, number, string, number, number][] = [ // rawclean.py windows (guide 5b), each cut at its source in-point
  // 3 Nov (raws only at incident moments): rw2 "debris falling" (after the width/track stats, near-dup HILL) and rw4 (after the survey line) removed
  [4.0, 19.8, "rw1_clean.wav", 0, -7], [44.0, 51.5, "rw3_clean_lv.wav", 0, 0], [57.92, 69.32, "rw5_clean.wav", 0, 0], [81.62, 95.72, "rw6_clean.wav", 0, -4],
];
const VO: [number, number, number][] = [ // timeline at, take from, take to (to = -1: to the end)
  [20.1, 0, 23.45], [51.8, 23.68, 27.5], [56.02, 27.65, 29.3], [69.57, 29.35, 41.4], [95.94, 41.8, -1],
];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [25.75, "sfx_n2/whoosh_03.wav", -31],
  [41.38, "sfx_n2/glitch_03.wav", -28],
  [95.70, "sfx_n2/glitch_01.wav", -28],
  [113.05, "sfx_n2/whoosh_01.wav", -30],
  [139.58, "sfx_n2/glitch_03.wav", -30],
];
// music: Epidemic ambient Music 5 (case 18 = Music 4, case 19 = Music 1), only under the VO stretches, never under the raws with voices
const MUSIC: [number, number, number, number][] = [ // timeline a, b, file offset, dB
  [19.6, 44.2, 30, -13], [51.3, 58.1, 55, -14], [69.12, 81.82, 0, -13], [95.52, 153.12, 62, -13], // offsets never repeat, last one ends inside the file (126.5 s)
];
const FadeOut: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE TOWN THAT WAS ERASED" bg={GR + "hill_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(152.32)} layout="none"><FadeOut n={F(0.8)} /></Sequence>
      {VO.map(([at, a, b], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={b < 0 ? undefined : F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, from, d], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + file)} startFrom={F(from)} volume={(f) => dB(d) * interpolate(f, [0, 5, F(b - a) - 16, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {MUSIC.map(([a, b, off, d], i) => (
        <Sequence key={"m" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(off)} volume={(f) => dB(d) * interpolate(f, [0, 14, F(b - a) - 14, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
