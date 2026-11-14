// Tornado #3 — Moore, Oklahoma, 20 May 2013 (EF5). Channel grammar (brand.tsx) + two devices built for this case's beats:
//   TwoDistances (dev/TOR03_TwoDistances): the backyard view a mile off vs Lechus's car across the street, two 3-D footage planes.
//   TrackTilt   (dev/TOR03_TrackTilt): the NWS damage-path map on a tipped plane: a low flight along the track, then a
//               measuring bar across the widest stretch of the outer contour (~140 px at ~130 px/mile = 1.1 mi).
// Footage: [YARD] William Ton-That's uncle (hToWqy0SfDY), [DRIVE] Jeffrey Lechus (-iuGipbmneY), [CARPORT] Richard Miller's repost
// (0LVMg6XNOB8; filmer not named on screen), aftermath: Darren's drone (wZV9TwvuuOo), obedgranados at Plaza Towers (OH82lIMKd7o),
// Ryan Willis drive (uy_n3n_lj5Y, cropped above its burned-in captions), James Bendall walk (s_ojoq3FemI), Caleb Grunzke then/now
// (AtKVmDQkLRU). Stills: NWS Norman survey photos + damage-path map, Oklahoma National Guard photo of Gov. Fallin (public domain).
// VO = one take ("Third," removed), split only where the four raws play (3 Nov: raws 3/5/6 removed). Source cuts: drive 45.7-48.6 (finger), 48.8 / 51.6 (white
// haze), 68.4; darren cuts 54.3 / 85.5; every window avoids them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { TwoDistances } from "../dev/TOR03_TwoDistances";
import { TrackTilt } from "../dev/TOR03_TrackTilt";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(174.83);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const P = (abs: number, a: number) => F(abs) - F(a);

// VO parts: [abs start, take start, take end]
// 3 Nov raw audit: raws 3 / 5 / 6 removed (near-duplicate, after explanation), the take runs on across them
const VO: [number, number, number][] = [
  [4.0, 0.64, 10.34], [25.8, 10.34, 16.18], [46.2, 16.18, 30.66], [70.97, 30.66, 56.06], [112.03, 56.06, 117.95],
];
// raws: [picture a, b, source from, audio start (abs), gain dB, file]
const RAWS: [number, number, number, number, number, string][] = [
  [13.9, 25.4, 48.6, 13.9, -9.5, "yard"],
  [31.9, 45.9, 12.0, 31.9, -3, "drive"],
  [60.47, 70.37, 58.0, 60.77, 12, "drive"],
  [96.63, 111.63, 86.0, 96.63, -13, "carport"],
];

const PATH: [number, number][] = [[130, 752], [300, 622], [540, 542], [700, 530], [900, 492], [1090, 387], [1300, 372], [1500, 332], [1800, 307]];

const SHOTS: Sh[] = [
  // P1 "and the first of two visits to Moore, Oklahoma. Monday the 20th of May 2013. The Weather Service office in Norman gave the city sixteen minutes of warning."
  { a: 4, b: 6.8, vo: "the first of two visits to Moore, Oklahoma (the backyard, the wedge behind the rooftops)", src: "yard.mp4", from: 2.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45,
    over: <RedLabel text="MOORE, OKLAHOMA" at={F(0.5)} hold={F(2.0)} /> },
  { a: 6.8, b: 9.54, vo: "Monday the 20th of May 2013 (the wedge, closer framing)", src: "yard.mp4", from: 22.0, s0: 1.45, s1: 1.52, fx: 0.72, fy: 0.32,
    over: <RedLabel text="MAY 20, 2013" at={F(0.3)} hold={F(2.1)} /> },
  { a: 9.54, b: 13.9, vo: "The Weather Service office in Norman gave the city sixteen minutes of warning. (the wedge behind the rooftops, wider framing)", src: "yard.mp4", from: 36.0, s0: 1.18, s1: 1.25, fx: 0.4, fy: 0.38 },
  { a: 13.9, b: 25.4, vo: "RAW 1: the wedge behind the fence and rooftops, the family's voices", src: "yard.mp4", from: 48.6, s0: 1.03, s1: 1.1, fx: 0.62, fy: 0.4 },
  // P2
  { a: 25.4, b: 28.2, vo: "Jeffrey Lechus was out on the road, driving home to his daughter, (his own camera, from the car)", src: "drive.mp4", from: 4.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="JEFFREY LECHUS" at={F(0.8)} hold={F(1.8)} /> },
  { a: 28.2, b: 31.9, vo: "and the tornado was a lot closer to him. (TwoDistances: backyard a mile off / his car across the street)",
    node: <TwoDistances far={{ src: GR + "yard.mp4", from: 30.0, label: "ABOUT A MILE AWAY" }} near={{ src: GR + "drive.mp4", from: 0.4, label: "ACROSS THE STREET" }} bg={{ src: GR + "drive.mp4", from: 0.4, label: "" }} nearAt={F(1.0)} /> },
  { a: 31.9, b: 45.9, vo: "RAW 2: the debris-laden tornado over the houses, from his vehicle", src: "drive.mp4", from: 12.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45 },
  // P3
  { a: 45.9, b: 48.93, vo: "A tornado is only as dark as what it's carrying. (the black-brown wall, debris in it)", src: "carport.mp4", from: 30.5, s0: 1.08, s1: 1.16, fx: 0.5, fy: 0.5 },
  { a: 48.93, b: 52.27, vo: "By the time this one reached the neighbourhoods, it was carrying them. (the wedge over the rooftops)", src: "yard.mp4", from: 68.0, s0: 1.3, s1: 1.38, fx: 0.6, fy: 0.42 },
  // P4
  { a: 52.27, b: 55.48, vo: "A car is about the worst place to be when a tornado reaches a town. (parked cars on a Moore street, the wall behind them)", src: "carport.mp4", from: 2.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.6 },
  { a: 55.48, b: 57.67, vo: "On a residential street there's no open road to run down (through the windshield)", src: "drive.mp4", from: 49.3, s0: 1.04, s1: 1.08, fx: 0.45, fy: 0.55 },
  { a: 57.67, b: 60.47, vo: "and nowhere to turn around. (the street, debris crossing)", src: "drive.mp4", from: 52.1, s0: 1.12, s1: 1.18, fx: 0.4, fy: 0.6 },
  { a: 60.47, b: 70.37, vo: "RAW 4: wind and debris across the street through the windshield", src: "drive.mp4", from: 58.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  // P5
  { a: 70.37, b: 73.87, vo: "On the Orr Family Farm a ten-ton propane tank (NWS: the farm after)", src: GR + "orr1.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.55,
    over: <RedLabel text="ORR FAMILY FARM" at={F(0.5)} hold={F(2.4)} /> },
  { a: 73.87, b: 76.21, vo: "was thrown more than half a mile. (NWS: the scoured field)", src: GR + "orr2.jpg", still: true, s0: 1.14, s1: 1.06, fx: 0.4, fy: 0.6 },
  { a: 76.21, b: 78.44, vo: "A strip mall nearby was flattened. (Bendall: the flattened buildings by the theatre)", src: "bend_strip.mp4", from: 18.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.6 },
  // P6
  { a: 78.44, b: 82.2, vo: "EF5, two hundred to two hundred and ten miles an hour, (the wall, a house lit in front of it)", src: "carport.mp4", from: 36.5, s0: 1.1, s1: 1.18, fx: 0.55, fy: 0.62 },
  { a: 82.2, b: 85.01, vo: "almost fourteen miles in thirty-nine minutes. (TrackTilt: low flight along the NWS track)",
    node: <TrackTilt src={GR + "pathmap.jpg"} iw={1867} ih={892} mode="glide" path={PATH} zoom={2.1} startLabel="NEWCASTLE" endLabel="MOORE" /> },
  { a: 85.01, b: 91, vo: "Since the current scale came in in 2007, only a handful of tornadoes have reached the top of it. (the wedge, slow)", src: "yard.mp4", from: 76.0, s0: 1.2, s1: 1.3, fx: 0.55, fy: 0.4,
    punches: [{ at: P(87.84, 85.01), to: 1.08, len: 24 }] },
  { a: 91, b: 95.13, vo: "Its widest point was about nineteen hundred yards, more than a mile. (TrackTilt: bar across the widest contour)",
    node: <TrackTilt src={GR + "pathmap.jpg"} iw={1867} ih={892} mode="measure" bar={[[426, 504], [454, 644]]} barAt={F(0.9)} barLabel="1.1 MILES" zoom={2.6} /> },
  // P7
  { a: 95.13, b: 96.63, vo: "It isn't finished.", src: "carport.mp4", from: 70.0, s0: 1.12, s1: 1.18, fx: 0.5, fy: 0.55 },
  { a: 96.63, b: 111.63, vo: "RAW 7: flying debris and wind sweeping across the lawn", src: "carport.mp4", from: 86.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  // P8 (149.6)
  { a: 111.63, b: 115.91, vo: "Twenty-four people didn't survive it and two hundred and twelve were hurt. (the debris again, half speed)", src: "carport_rep.mp4", from: 0.2, s0: 1.12, s1: 1.22, fx: 0.4, fy: 0.45 },
  { a: 115.91, b: 119.68, vo: "Briarwood Elementary was destroyed, and nobody there was lost. (NWS survey photo)", src: GR + "bw1.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.55,
    over: <RedLabel text="BRIARWOOD ELEMENTARY" at={F(0.4)} hold={F(3.0)} /> },
  { a: 119.68, b: 122.93, vo: "Its rating was later lowered from EF5 to EF4, (Briarwood, full frame pull-out; Inset kept only for Fallin)",
    src: GR + "bw2.jpg", still: true, s0: 1.14, s1: 1.04, fx: 0.38, fy: 0.5 },
  { a: 122.93, b: 126.25, vo: "because surveyors found signs of poor construction. (Briarwood: what was left of the walls)", src: GR + "bw3.jpg", still: true, s0: 1.16, s1: 1.06, fx: 0.45, fy: 0.6 },
  { a: 126.25, b: 129.43, vo: "At Plaza Towers Elementary (the school's ground, from the road)", src: "ryan.mp4", from: 8.0, s0: 1.02, s1: 1.07, fx: 0.3, fy: 0.5,
    over: <RedLabel text="PLAZA TOWERS ELEMENTARY" at={F(0.3)} hold={F(2.8)} /> },
  { a: 129.43, b: 131.93, vo: "a cinder-block wall collapsed, and seven children never came home. (NWS: the walls at Plaza Towers)", src: GR + "pt1.jpg", still: true, s0: 1.05, s1: 1.12, fx: 0.7, fy: 0.5 },
  { a: 131.93, b: 135.13, vo: "Many parents had already picked their children up early, (the school's car park that evening)", src: "plaza.mp4", from: 0.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.4 },
  { a: 135.13, b: 138.24, vo: "so only about seventy-five students and teachers were inside. (NWS: searchers in the ruins)", src: GR + "pt2.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 138.24, b: 142.15, vo: "Only two of the twelve schools in Moore's district had storm shelters. (the school from its car park)", src: "plaza.mp4", from: 17.6, s0: 1.06, s1: 1.12, fx: 0.55, fy: 0.4 },
  { a: 142.15, b: 146.03, vo: "Afterwards, Governor Mary Fallin (Oklahoma National Guard photo, Moore, 28 May 2013)",
    node: <Inset src={GR + "fallin_c.jpg"} still box={0.36} ar={0.8} label="GOV. MARY FALLIN" labelAt={10} drift={0.05} /> },
  { a: 146.03, b: 148.51, vo: "quickly dismissed the idea of a law requiring them in every Oklahoma school. (Darren's drone over the wrecked streets the day after)", src: "darren_b.mp4", from: 1.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  { a: 148.51, b: 152.82, vo: "Moore Medical Center was heavily damaged, and nobody inside it was hurt. (Bendall)", src: "bend_med.mp4", from: 10.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55,
    over: <RedLabel text="MOORE MEDICAL CENTER" at={F(0.5)} hold={F(3.2)} /> },
  { a: 152.82, b: 158.05, vo: "Damage estimates ran up to two billion dollars, the costliest tornado since Joplin. (drone over the swath)", src: "darren_w.mp4", from: 2.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 158.05, b: 163.98, vo: "In March 2014, Moore became the first city in the country with a building code written for tornadoes. (the rebuilt streets, 2018)", src: "caleb_now.mp4", from: 9.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45,
    over: <RedLabel text="MOORE, 2018" at={F(0.8)} hold={F(3.0)} /> },
  { a: 163.98, b: 168.15, vo: "New homes there now have to withstand a hundred and thirty-five miles an hour. (new houses)", src: "caleb_now.mp4", from: 45.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 168.15, b: 174.83, vo: "Fourteen years earlier this same town had taken the strongest wind ever measured, and that one's coming. (the tornado moving off)", src: "carport.mp4", from: 156.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4), kind: "glitch", len: 10 },
  { at: F(6.8), kind: "blurDip", len: 12 },
  { at: F(9.54), kind: "blurDip", len: 12 },
  { at: F(13.9), kind: "blurDip", len: 12 },
  { at: F(28.2), kind: "whip", len: 10, dir: -1 },
  { at: F(57.67), kind: "blurDip", len: 10 },
  { at: F(60.47), kind: "blurDip", len: 12 },
  { at: F(78.44), kind: "blurDip", len: 12 },
  { at: F(82.2), kind: "zoomHit", len: 10 },
  { at: F(85.01), kind: "blurDip", len: 12 },
  { at: F(91), kind: "blurDip", len: 12 },
  { at: F(95.13), kind: "blurDip", len: 12 },
  { at: F(96.63), kind: "zoomHit", len: 10 },
  { at: F(111.63), kind: "blurDip", len: 14 },
  { at: F(115.91), kind: "glitch", len: 8 },
  { at: F(158.05), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [28.1, "sfx_n2/whoosh_03.wav", -30],
  // raw 4: Lechus's audio is almost gone after 0:45 (wind noise only), real wind and rain timed to the debris on the glass
  [60.77, X + "wind_gust_1.wav", -20],
  [61.07, X + "rain_9.wav", -27],
  [65.27, X + "wind_gust_1.wav", -22],
  [82.14, "sfx_n2/whoosh_01.wav", -30],
  [91.04, "sfx_n2/whoosh_02.wav", -32],
  [96.58, X + "sub_drop_1.wav", -26],
  [111.03, X + "reverse_swell_1.wav", -30],
  [115.88, "sfx_n2/glitch_03.wav", -28],
  [142.18, X + "camera_shutter_2.wav", -28],
];

// music: Music 1 (Epidemic ambient, -18.3 LUFS -> -16 dB sits ~10 LU under the take); ducked under the quieter raws, out under the carport raws
const M1 = dB(-16);
const duck = (t: number) => {
  const k: [number, number][] = [[4.0, 0], [5.0, 1], [13.6, 1], [14.4, 0.35], [25.0, 0.35], [25.9, 1], [31.6, 1], [32.4, 0.35], [45.6, 0.35], [46.4, 1],
    [60.1, 1], [60.8, 0.3], [70.3, 0.3], [71.0, 1], [95.9, 1], [96.7, 0]];
  return interpolate(t, k.map((x) => x[0]), k.map((x) => x[1]), cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE WALL COMING DOWN THE STREET" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, t0, t1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0) + (i === VO.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, from, au, g, file], i) => {
        const n = F(b) - F(au);
        return (
          <Sequence key={"r" + i} from={F(au)} durationInFrames={n} layout="none">
            <Audio src={staticFile(MD + file + "_clean.wav")} startFrom={F(from + (au - a))} volume={(f) => dB(g) * interpolate(f, [0, 6, n - 20, n - 2], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      <Sequence from={F(4.0)} durationInFrames={F(96.7) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} volume={(f) => M1 * duck(4.0 + f / 30)} />
      </Sequence>
      <Sequence from={F(111.83)} durationInFrames={F(174.83) - F(111.83)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(65)} volume={(f) => M1 * interpolate(f, [0, F(2.5), F(61.0), F(63.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
