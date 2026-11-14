// Theme Park #18 — Hastings Pier, 5 Oct 2010: a night fire takes about 95 % of the Victorian pier; rebuilt, Stirling Prize 2017, then
// administration and a sale. Channel grammar (TitleCard, RedLabel, glitch / blur-dip). Footage: [HP] a fixed camera on the shore all night
// (main, 320x240, real sound -> the HP raws and the borrowed fire bed), [HF] East Sussex FRS aerial-ladder camera (ex1, silent),
// [HG] a night compilation from the beach and promenade (ex2, 1080p, near-silent), [HA] a handheld phone (ex3, silent); downloaded from
// small personal channels: zeroh studio's dawn film of the fire (dawn), john edwards' rebuild drone (rebuild), Joe's Drones spring 2016
// (joe). Stills: Wikimedia Commons (geograph etc., see NOTES). Devices built for this case: BirchPrints (Birch's two piers as prints in
// 3-D, the West Pier ruin taking over), PierBurn (the deck traced on a real aerial, washed red section by section, land end left),
// AshToDeck (the burnt deck re-boarded plank by plank into the 2016 deck). VO = one take, split only where the seven raws play.
// media files are concatenated windows: main = src [18-29][138-147][210-224][298-308][418-430][558-564]; ex1 = src 12-36; ex3 = src 60-69;
// dawn = src [95-102][178-186]; rebuild = src [5.6-9.4][16.0-20.5]; joe = src [15.6-20.8][91.6-98.0]. Source cuts (srccuts.py): main 231.5;
// ex1 25.53 (= 13.53 here) / 35.70; ex2 2.72 5.69 10.09 13.89 21.34 28.15 32.23 34.76 40.40 47.49 52.21 60.26 64.54 68.15 70.07 73.99 81.92
// 86.57 89.85 93.01 101.46 107.27; every window below sits between them (start >= 0.7 s after a cut).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { PierBurn } from "../dev/TP18_PierBurn";
import { BirchPrints } from "../dev/TP18_BirchPrints";
import { AshToDeck } from "../dev/TP18_AshToDeck";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
// raws lengthened (owner rule on TP17): old-timeline points shift by the extra raw time inserted before them
const SH: [number, number][] = [[42.4, 8.0], [64.0, 1.65], [79.8, 0.3], [87.0, 2.9], [128.25, 1.0], [142.9, 2.4]];
const sh = (t: number) => +(t + SH.reduce((m, [b, d]) => m + (t >= b - 1e-6 ? d : 0), 0)).toFixed(3);
const DUR = F(sh(197.4));

type Sh = { a: number; b: number; abs?: boolean; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; pan?: [number, number]; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO take parts -> timeline (raws at every cut-sheet cue, in order):
// A 0-30.3 @4.0 | R1 34.4-42.4 | B 30.5-44.25 @42.4 | R2 56.25-64.0 | C 44.5-53.8 @64.0 | R3 73.4-79.8 | D 54.06-56.95 @79.8 | R4 82.75-87.0
// | E 57.17-67.9 @87.0 | R5 97.8-106.65 | F 68.08-82.6 @106.65 | R6 121.25-128.25 | G 82.64-89.2 @128.25 | R7 134.9-142.9 | H 89.41-end @142.9
const SHOTS0: Sh[] = [
  { a: 4.0, b: 6.9, vo: "Hastings Pier opened in 1872. (the pier before the fire, Aug 2010)", src: "pre2010.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.3, fy: 0.3,
    over: <RedLabel text="HASTINGS, ENGLAND" at={F(0.4)} hold={F(2.1)} /> },
  { a: 6.9, b: 12.28, vo: "Eugenius Birch built it. He was the engineer behind a lot of Britain's Victorian piers. (the ironwork under the deck)", src: "substr.jpg", still: true, s0: 1.14, s1: 1.04, fx: 0.5, fy: 0.45,
    over: <RedLabel text="EUGENIUS BIRCH" at={F(0.3)} hold={F(3.2)} /> },
  { a: 12.28, b: 16.78, vo: "Over the years it held a shooting gallery, slot machines and a bowling alley. (the funfair on the pier, 2005)", src: "fun2005.jpg", still: true, s0: 1.06, s1: 1.16, fx: 0.62, fy: 0.5 },
  { a: 16.78, b: 19.76, vo: "Jimi Hendrix and The Rolling Stones both played there. (the pavilion out on the deck)", src: "pre_apr10.jpg", still: true, s0: 1.3, s1: 1.4, fx: 0.25, fy: 0.42 },
  { a: 19.76, b: 23.61, vo: "By 2010 it had been closed to the public for safety reasons. (the deck empty, May 2010)", src: "deserted.jpg", still: true, s0: 1.03, s1: 1.11, fx: 0.5, fy: 0.55 },
  { a: 23.61, b: 27.51, vo: "The first fire crews got there at about one in the morning on Tuesday the 5th of October. (the engines arriving)", src: "ex2.mp4", from: 48.2, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <RedLabel text="OCTOBER 5, 2010" at={F(0.8)} hold={F(2.6)} /> },
  { a: 27.51, b: 31.3, vo: "By then the fire was already moving through its wooden buildings.", src: "ex2.mp4", from: 82.62, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 31.3, b: 34.4, vo: "From the shore, the whole town could see it. (the crowd on the promenade)", src: "ex2.mp4", from: 102.16, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  // RAW 1 (cue HP 0:19-0:49): the shore camera, flames along the length reflected in the sea
  { a: 34.4, b: 42.4, vo: "RAW: the pier burning end to end from the shore", src: "main.mp4", from: 1.5, s0: 1.08, s1: 1.16, fx: 0.42, fy: 0.42 },
  { a: 42.4, b: 45.16, vo: "A pier is close to the worst fire there is.", src: "ex2.mp4", from: 61.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45 },
  { a: 45.16, b: 49.6, vo: "It's a long timber building standing out in the wind, with exactly one way on (smoke driven along the deck)", src: "main.mp4", from: 21.0, s0: 1.1, s1: 1.18, fx: 0.55, fy: 0.42 },
  { a: 49.6, b: 52.06, vo: "for a fire engine, from the land end. (the ladder at the entrance kiosk)", src: "ex2.mp4", from: 90.55, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5 },
  { a: 52.06, b: 54.6, vo: "Crews went up on an aerial ladder to fight it from above,", src: "ex2.mp4", from: 87.27, s0: 1.06, s1: 1.12, fx: 0.3, fy: 0.3 },
  // "straight down the deck." + RAW 2 (cue HF 0:05-0:35): the ladder camera itself, walls of flame, crews on the deck
  { a: 62.6, b: 68.9, abs: true, vo: "straight down the deck. + RAW 2a (ladder camera: walls of flame down the deck)", src: "ex1.mp4", from: 7.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 68.9, b: 73.65, abs: true, vo: "RAW 2b (ladder camera: crews on the deck against the flames; source cut between)", src: "ex1.mp4", from: 14.25, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 64.0, b: 67.59, vo: "At its peak there were about five dozen firefighters on this. (hose crews under the pier)", src: "ex2.mp4", from: 74.7, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 67.59, b: 73.4, vo: "By half past three, two and a half hours after the first crews arrived, it was still burning end to end.", src: "main.mp4", from: 44.0, s0: 1.06, s1: 1.16, fx: 0.5, fy: 0.42,
    over: <RedLabel text="3:30 AM" at={F(0.3)} hold={F(2.4)} /> },
  // RAW 3 (cue HG 0:10-0:40): from the beach, flames reflected on the wet sand
  // "Next to those flames, a fire engine looks tiny." + RAW 4 (cue HG 0:46-1:16): the appliances on the promenade, then the flames over them
  { a: 83.05, b: 90.25, abs: true, vo: "Next to those flames, a fire engine looks tiny. + RAW 4 (one VO stretch C+D, then R4 and R3 back to back)", src: "ex2.mp4", from: 52.9, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.5 },
  { a: 90.25, b: 93.15, abs: true, vo: "RAW 4b: under the pier, the glow through the legs", src: "ex2.mp4", from: 65.24, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 93.15, b: 99.85, abs: true, vo: "RAW 3 (cue HG 0:10-0:40, moved into the same raw block): the pier burning from the wet sand", src: "ex2.mp4", from: 14.6, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.5 },
  { a: 87.0, b: 95.89, vo: "Birch also designed the West Pier in Brighton, a bit further along the same coast. That one burned twice in 2003 and never came back. (BirchPrints)",
    node: <BirchPrints a={{ src: GR + "pre_apr10.jpg", label: "HASTINGS PIER", pos: "30% 50%" }} b={{ src: GR + "westpier.jpg", label: "WEST PIER, BRIGHTON", pos: "50% 55%" }}
      name="EUGENIUS BIRCH" moveAt={F(0.9)} moveLen={F(1.6)} growAt={F(4.6)} growLen={F(1.3)} tag="2003" tagAt={F(5.9)} /> },
  // "Out on the deck, it was growing again." + RAW 5 (cue HP 3:35-4:05): the shore camera, the fire growing along the deck
  { a: 95.89, b: 106.65, vo: "Out on the deck, it was growing again. + RAW 5", src: "main.mp4", from: 30.0, s0: 1.06, s1: 1.18, fx: 0.45, fy: 0.42 },
  { a: 106.65, b: 110.0, vo: "In May 2011, the Heritage Lottery Fund gave (the campaign banner on the burnt pier, June 2011)", src: "jun11.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.3, fy: 0.3,
    over: <RedLabel text="MAY 2011" at={F(0.3)} hold={F(2.6)} /> },
  { a: 110.0, b: 113.14, vo: "a first grant of three hundred and fifty-seven thousand pounds. (the burnt end in the surf)", src: "cleared_storm.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.4, fy: 0.45 },
  { a: 113.14, b: 115.75, vo: "The whole bid was for nearly nine million. (the cleared deck)", node: <Inset src={GR + "cleared.jpg"} still box={0.56} ar={4 / 3} drift={0.08} /> },
  { a: 115.75, b: 118.6, vo: "English Heritage gave the council a hundred thousand pounds (panorama, the wreck from the entrance)", src: "pano.jpg", still: true, s0: 1.02, s1: 1.02, fx: 0.5, fy: 0.5, pan: [-260, 160] },
  { a: 118.6, b: 121.25, vo: "just for emergency works on what was left.", src: "wreck.jpg", still: true, s0: 1.05, s1: 1.14, fx: 0.42, fy: 0.45 },
  // RAW 6 (cue HA 1:00-1:30): the handheld phone across the water
  { a: 121.25, b: 128.25, vo: "RAW: the pier burning across the water (phone)", src: "ex3.mp4", from: 0.95, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 128.25, b: 130.2, vo: "It burned for hours.", src: "main.mp4", from: 66.0, s0: 1.12, s1: 1.18, fx: 0.5, fy: 0.42 },
  { a: 130.2, b: 134.9, vo: "By daylight, people in Hastings had been watching their pier go since the middle of the night. (dawn: the banner silhouetted on fire)", src: "dawn.mp4", from: 1.0, s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.5 },
  // RAW 7 (cue HP 7:00-7:30): the shore camera, still burning, smoke along the length
  { a: 134.9, b: 142.9, vo: "RAW: still burning, smoke along the length", src: "main.mp4", from: 53.5, s0: 1.08, s1: 1.14, fx: 0.5, fy: 0.45 },
  { a: 142.9, b: 147.77, vo: "By the end, the fire service said about ninety-five per cent of the structure was gone. (PierBurn)",
    node: <PierBurn src={GR + "aerial26.jpg"} iw={3840} ih={2560} focus={[2090, 1290]} z0={1.0} z1={1.07}
      deck={[[960, 1440], [1128, 1332], [1380, 1188], [1476, 1128], [1716, 1056], [1896, 1032], [2112, 960], [2316, 893], [2496, 821], [2640, 720], [2659, 643],
        [2892, 581], [3204, 605], [3187, 648], [3108, 715], [2940, 883], [2923, 941], [3043, 1236], [3012, 1320], [2868, 1596], [2760, 1848], [2688, 1920],
        [2064, 2016], [1920, 1920], [1536, 1788], [1344, 1709], [1128, 1632], [960, 1536]]}
      axis={[[1836, 1680], [2205, 333]]} keep={0.045} sections={9} traceAt={4} traceLen={F(1.0)} burnAt={F(1.1)} every={8} /> },
  { a: 147.77, b: 152.29, vo: "Two people were arrested on suspicion of arson, and nobody was ever charged. (daylight: the burnt pier, still smoking)", src: "dawn.mp4", from: 9.0, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.4 },
  { a: 152.29, b: 155.9, vo: "That should have been the end of it. Instead, in 2013 (the shell, March 2013)", src: "mar13.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.4, fy: 0.5,
    over: <RedLabel text="2013" at={F(1.5)} hold={F(1.9)} /> },
  { a: 155.9, b: 159.72, vo: "the council forced a compulsory purchase to get it back into local hands.", src: "saveme.jpg", still: true, s0: 1.12, s1: 1.04, fx: 0.5, fy: 0.45 },
  { a: 159.72, b: 163.1, vo: "The Hastings Pier Charity ran a fourteen-million-pound rebuild, (drone, November 2014)", src: "rebuild.mp4", from: 0.2, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5 },
  { a: 163.1, b: 166.22, vo: "designed by the architects dRMM. (the new visitor centre going up)", src: "cafe.jpg", still: true, s0: 1.18, s1: 1.26, fx: 0.5, fy: 0.42 },
  { a: 166.22, b: 169.88, vo: "The pier reopened on the 27th of April 2016. (reopening day)", src: "reopen.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5,
    over: <RedLabel text="APRIL 27, 2016" at={F(0.5)} hold={F(2.6)} /> },
  { a: 169.88, b: 174.16, vo: "The next year it won the Stirling Prize, Britain's top architecture award. (the pier from above, spring 2016)", src: "joe.mp4", from: 0.4, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5,
    over: <RedLabel text="STIRLING PRIZE 2017" at={F(0.6)} hold={F(3.0)} /> },
  { a: 174.16, b: 180.73, vo: "A pier that was nearly all ash six years earlier, beating every new building in the country. I love that. (AshToDeck)",
    node: <AshToDeck before={GR + "deck_ash.jpg"} after={GR + "newdeck.jpg"} beforePos="50% 60%" afterPos="50% 62%" at={F(1.4)} every={5} planks={14} horizon={0.4} beforeLabel="2010" afterLabel="2016" /> },
  { a: 180.73, b: 184.5, vo: "The ending is less lovely. The charity running it", src: "fog22.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.68 },
  { a: 184.5, b: 188.34, vo: "went into administration in November 2017, a few months after the prize. (the finished pier from above)", src: "rebuild.mp4", from: 4.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5,
    over: <RedLabel text="NOVEMBER 2017" at={F(0.6)} hold={F(2.7)} /> },
  { a: 188.34, b: 191.96, vo: "In June 2018 the pier was sold to Abid Gulzar. (the pier that August, beach huts on the deck)", src: "huts18.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.45,
    over: <RedLabel text="ABID GULZAR" at={F(1.2)} hold={F(2.2)} /> },
  { a: 191.96, b: 197.4, vo: "He's a local businessman who already owned another pier you'll see later. (dusk, the pier from the sea)", src: "joe.mp4", from: 5.6, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
];

const SHOTS: Sh[] = SHOTS0.map((x) => x.abs ? x : { ...x, a: sh(x.a), b: sh(x.b) });

const CUTS0: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(23.61), kind: "glitch", len: 8 },     // history -> the night
  { at: F(31.3), kind: "blurDip", len: 10 },    // night -> night
  { at: F(52.06), kind: "blurDip", len: 10 },   // ladder -> ladder (other angle)
  { at: F(87.0), kind: "glitch", len: 8 },      // to Brighton
  { at: F(95.89), kind: "blurDip", len: 12 },   // back to the night
  { at: F(106.65), kind: "glitch", len: 8 },    // 2011
  { at: F(121.25), kind: "glitch", len: 8 },    // back to the night (HA)
  { at: F(130.2), kind: "blurDip", len: 14 },   // night -> dawn
  { at: F(134.9), kind: "blurDip", len: 12 },   // dawn -> night again
  { at: F(142.9), kind: "glitch", len: 8 },     // the count
  { at: F(147.77), kind: "blurDip", len: 12 },
  { at: F(159.72), kind: "blurDip", len: 12 },  // the rebuild
  { at: F(174.16), kind: "zoomHit", len: 10 },
  { at: F(180.73), kind: "blurDip", len: 14 },
];
const CUTS: FxCut[] = [...CUTS0.map((c) => ({ ...c, at: F(sh(c.at / 30)) })), { at: F(68.9), kind: "blurDip", len: 10 }, { at: F(90.25), kind: "blurDip", len: 10 }, { at: F(93.15), kind: "blurDip", len: 10 }];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} pan={s.pan} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// real recordings only on designed moments (no whooshes / chimes)
const SFX0: [number, string, number][] = [
  [3.95, X + "static_1.wav", -30],
  [106.6, X + "static_1.wav", -32],
  [142.85, X + "static_3.wav", -32],
  [174.1, X + "camera_shutter_2.wav", -28],
];
const SFX = [...SFX0.map(([t, f, d]) => [sh(t), f, d] as [number, string, number]), [99.8, X + "static_3.wav", -32] as [number, string, number]];

// raw windows: [timeline a, b, bed file, gain dB]. Beds = rawclean.py output, cut + loudness-matched (media/r1..r7.wav):
// R1/R5/R7 the shore camera's own sound; R2 (ladder cam, silent) / R6 (phone, silent) / R3 = the shore camera's fire bed from other
// minutes of the same night; R4 = HG's own engines + that fire bed.
const RAWS: [number, number, string, number][] = [[34.45, 50.4, "r1", 0], [64.25, 73.65, "r2", -2], [86.15, 99.85, "r34", 0],
  [sh(97.8), sh(106.65), "r5", 0], [sh(121.25), sh(128.25), "r6", -2], [sh(134.95), sh(142.9), "r7", 0]];

const VO0: [number, number, number][] = [[4.0, 0, 30.3], [42.4, 30.5, 44.25], [64.0, 44.5, 56.95], [87.0, 57.17, 67.9],
  [106.65, 68.08, 82.6], [128.25, 82.64, 89.2]];
const VO = VO0.map(([at, a, b]) => [sh(at), a, b] as [number, number, number]);

const duck = (t: number) => RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="95% OF HASTINGS PIER" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
          {/* end: fade to black under the last words */}
          <Sequence from={F(sh(195.9))} layout="none"><Fade /></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the raws play (cut-sheet cue positions) */}
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(sh(142.9))} layout="none"><Audio src={staticFile("vor/CASE18.mp3")} startFrom={F(89.41)} /></Sequence>
      {RAWS.map(([a, b, f, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(MD + f + ".wav")} volume={(fr) => dB(g) * interpolate(fr, [0, 5, F(b - a) - 12, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 5), dipped under each raw; a second pass from another offset after the count (it is 126 s long) */}
      <Sequence from={F(4.0)} durationInFrames={F(144.0) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(3)} volume={(fr) => {
          const t = fr / 30 + 4.0;
          return dB(-14) * interpolate(fr, [0, 30, F(121.5), F(123.5)], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck(t));
        }} />
      </Sequence>
      <Sequence from={F(125.0)} durationInFrames={DUR - F(125.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(30)} volume={(fr) => {
          const t = fr / 30 + 125.0;
          return dB(-14) * interpolate(fr, [0, F(2.5), DUR - F(125.0) - F(3.0), DUR - F(125.0)], [0, 1, 1, 0], cl) * (0.1 + 0.9 * duck(t));
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const Fade: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 45], [0, 1], cl) }} />;
};

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed RAW 6 (phone across the water: sat after the Heritage Lottery / English Heritage funding lines). 7 -> 6 raw pieces.
const _cut = cutOut(CompFull, DUR, [[134.1, 142.1]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
