// Theme Park #20 — Weston-super-Mare, 28 Jul 2008: the Grand Pier pavilion burns; the alarm at 1:35 AM went to a private monitoring
// company, the key-holder didn't answer, and the fire service was called at 6:46. Channel grammar (TitleCard, RedLabel, Inset once (RAW 3), glitch /
// blur-dip). Footage: [WS] main = a tripod on the hill (4:3 in a 16:9 pillarbox, cropped; its track is near-silent), [WB] ex1 = Alex Brent
// on the beach (real sound), [WT] ex2 = close zoom (192x144 -> shown framed), [WR] ex3 = through the seafront railings (192x144 -> framed).
// Added (mesmoland, personal Weston channel): inside the pavilion the day before the fire (lv), the new pier Dec 2010 (zd), Apr 2011 (ie).
// Stills: Wikimedia Commons (free licences, see NOTES.md). Tilburg flashback = TP11's own graded TK clip (the gas bottle going up).
// Devices: CallChain (alarm -> monitoring co. -> key-holder: no answer -> empty wire -> fire service 6:46), BurnThrough (1933 pavilion photo
// burns through to the 2008 footage). VO = one take, split only at the six raws. Source cuts (file s): main 5.04 / 10.04 / 15.05 / 88.4 /
// 422.8; ex1 18.5 / 19.6 / 37.0 / 160.1 / 169.6 / 202.2 / 239.8 / 249.2 / 385-390.2 / 404.6; ex2 8.9 / 19.4; ex3 7.0 / 20.1; lv 69.1 / 146.1;
// zd 27.6. Every window sits between them (media files are trimmed copies: main_a = 0-25, main_b 95-, main_c 195-, main_d 295-,
// ex1_a 20-, ex1_g 139-, ex1_c 160.5-, ex1_d 202.5-, ex1_e 243-, ex1_f 390.5-, ex2 9.5-, ex3 7.6-, lv_a 15-, lv_b 23-, zd_a 32.5-,
// zd_b 202-, zd_c 282-, ie_a 157.5-).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { CallChain } from "../dev/TP20_CallChain";
import { BurnThrough } from "../dev/TP20_BurnThrough";
import { SplitPair } from "../dev/TP20_SplitPair";
import { RailView } from "../dev/TP20_RailView";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(167.1);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO take parts -> timeline (no count word: the take opens "It's the morning of..."):
// A 0-25.99 @4.0 | R1 29.99-39.19 | B 25.99-35.59 @39.19 | R2 48.79-65.39 (main incident raw, played through) | C 35.59-52.60 @65.39 | R3 82.40-91.60 | D+E 52.60-81.65 @91.60
// (cut-sheet RAW 4 + RAW 5 dropped: owner rules 2/3 Nov: fewer/longer raws, no lone phrase between raws) -> D+E+F 52.60-83.59 @91.60 ends 122.59
// | R6 122.59-130.3 (railings; its picture starts under 'And through the seafront railings.') | G 83.61-end @130.3
const PART: [number, number, number][] = [[4.0, 0, 25.99], [39.19, 25.99, 35.59], [65.39, 35.59, 52.60], [91.60, 52.60, 83.59]];
const PART_G = { at: 130.3, from: 83.61 };

// CallChain world: cards on one wire; the empty stretch is 311 minutes at ~10 px a minute
const N0 = 0, N1 = 560, N2 = 1120, N3 = 4240;

const SHOTS: Sh[] = [
  { a: 4.00, b: 8.30, vo: "It's the morning of Monday the 28th of July 2008, in Weston-super-Mare. (from the hill: the first white smoke over the pier)", src: "main_a.mp4", from: 0.7, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.45,
    over: <RedLabel text="JULY 28, 2008" at={F(0.5)} hold={F(3.0)} /> },
  { a: 8.30, b: 12.01, vo: "The pavilion at the end of the Grand Pier is on fire. (close on the pavilion, smoke pouring off the roof)", src: "main_a.mp4", from: 5.75, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.45,
    over: <RedLabel text="GRAND PIER, WESTON-SUPER-MARE" at={F(0.6)} hold={F(2.6)} /> },
  { a: 12.01, b: 15.22, vo: "It got this far because of a phone call that never happened. (the smoke turns black)", src: "main_a.mp4", from: 10.75, s0: 1.08, s1: 1.14, fx: 0.55, fy: 0.4 },
  { a: 15.22, b: 29.99, vo: "At 1:35 that morning an alarm went off ... the fire service wasn't called until 6:46, more than five hours later. (CallChain)",
    node: <CallChain bg={GR + "deck_night.jpg"} fire={GR + "main_b.mp4"} fireFrom={1.0} fireAt={318}
      nodes={[{ x: N0, y: 0, title: "PIER ALARM", at: 4, time: "1:35 AM", timeAt: 12 }, { x: N1, y: 0, title: "MONITORING CO.", at: 128 },
        { x: N2, y: 0, title: "KEY-HOLDER", at: 196, dead: 238 }, { x: N3, y: 0, title: "FIRE SERVICE", at: 330, time: "6:46 AM", timeAt: 350 }]}
      links={[{ from: 0, to: 1, at: 108, len: 22 }, { from: 1, to: 2, at: 176, len: 22 }, { from: 2, to: 3, at: 250, len: 92, empty: true }]}
      ring={{ node: 2, at: 205 }} noAnswerAt={232} noAnswerHold={120}
      cam={[{ at: 0, x: N1, y: 0, z: 1.0 }, { at: 248, x: N1 + 60, y: 0, z: 1.0 }, { at: 342, x: N3, y: 0, z: 1.0 }, { at: 384, x: (N0 + N3) / 2, y: 0, z: 0.38 }, { at: 443, x: (N0 + N3) / 2, y: 0, z: 0.365 }]}
      span={{ a: 2, b: 3, label: "5 HR 11 MIN", at: 392 }} /> },
  // RAW 1 (cue WS 0:16-0:46): the tall black column over the pier, flames along the pavilion's base
  { a: 29.99, b: 39.19, vo: "RAW: the black column over the pier (WS 0:15.8-0:25)", src: "main_a.mp4", from: 15.8, s0: 1.02, s1: 1.1, fx: 0.55, fy: 0.55 },
  { a: 39.19, b: 41.96, vo: "That pavilion was the pier's covered amusement hall. (inside, the day before the fire)", src: "lv_a.mp4", from: 3.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.4 },
  { a: 41.96, b: 44.17, vo: "It had been revamped only that April. (the pavilion, 5 July 2008)", src: "jul08.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.55, fy: 0.4 },
  { a: 44.17, b: 48.79, vo: "It got a go-kart track, a forty-foot climbing wall and new fairground rides. (a ride under the glass roof, May 2008)", src: "may08.jpg", still: true, s0: 1.03, s1: 1.13, fx: 0.5, fy: 0.55,
    over: <RedLabel text="INSIDE, MAY 2008" at={F(0.6)} hold={F(3.4)} /> },
  // RAW 2 (cue WB 0:18-0:48): Alex Brent from the beach, the whole pavilion burning side-on
  { a: 48.79, b: 65.39, vo: "RAW: side-on from the beach, flames the length of the pavilion (WB 0:20.5-0:37, the main incident raw, played through)", src: "ex1_a.mp4", from: 0.15, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.5 },
  { a: 65.39, b: 67.58, vo: "About forty firefighters fought it. (fire engines at the pier entrance, 10:21 that morning)", src: "firefighters.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 67.58, b: 71.22, vo: "A worker called Robert Tinker went in and carried gas canisters out of the building, (the burning pavilion, close)", src: "ex1_d.mp4", from: 0.5, s0: 1.03, s1: 1.09, fx: 0.6, fy: 0.5,
    over: <RedLabel text="ROBERT TINKER, PIER WORKER" at={F(0.7)} hold={F(2.6)} /> },
  { a: 71.22, b: 74.89, vo: "which the fire brigade said stopped it getting worse. (SplitPair: the close photo from the beach | the beach camera's wide smoke column, WB 4:04.6)",
    node: <FilmLook_FX grain={0.08}><SplitPair photo={GR + "flames.jpg"} photoPos="50% 62%" video={GR + "ex1_e.mp4"} videoFrom={1.6} videoPos="40% 50%" /></FilmLook_FX> },
  { a: 74.89, b: 78.26, vo: "Remember what two gas bottles did to that food tent in Tilburg. (TP11's clip: the bottle goes up)", src: "tilburg.mp4", from: 0.1, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.45,
    over: <RedLabel text="TILBURG, 2014" at={F(0.4)} hold={F(2.6)} /> },
  { a: 78.26, b: 82.40, vo: "He went in anyway, and nobody would have blamed him for staying outside. (from the hill, the flames at the base)", src: "main_c.mp4", from: 3.0, s0: 1.1, s1: 1.18, fx: 0.55, fy: 0.62 },
  // RAW 3 (cue WT 0:05-0:35): the close zoom, white and black smoke billowing (192x144 source -> framed)
  { a: 82.40, b: 91.60, vo: "RAW: close zoom, the pavilion in full flame (WT 0:09.6-0:18.8)",
    node: <Inset src={GR + "ex2.mp4"} from={0.0} box={0.6} ar={4 / 3} drift={0.05} /> },
  { a: 91.60, b: 95.69, vo: "Five hours. An alarm doing its job at half past one in the morning, (the hill camera, long lens)", src: "main_b.mp4", from: 3.0, s0: 1.12, s1: 1.2, fx: 0.55, fy: 0.55 },
  { a: 95.69, b: 99.38, vo: "and then a chain of phone calls that ended with nobody picking up. (beach camera, close on the flames)", src: "ex1_c.mp4", from: 5.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 99.38, b: 102.46, vo: "Maybe a call at 1:35 saves the pavilion. (inside, the day before)", src: "lv_b.mp4", from: 1.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45,
    over: <RedLabel text="JULY 27, 2008" at={F(0.4)} hold={F(2.4)} /> },
  { a: 102.46, b: 106.39, vo: "Maybe it doesn't. I'm only guessing, and so is everybody else. (the hill, still burning)", src: "main_d.mp4", from: 2.0, s0: 1.05, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 106.39, b: 109.91, vo: "The Grand Pier had burned once before, in 1930. (postcard full-frame, slow push onto the first pavilion)",
    src: "postcard.jpg", still: true, s0: 1.06, s1: 1.22, fx: 0.18, fy: 0.36, over: <RedLabel text="GRAND PIER, c. 1920" at={F(0.5)} hold={F(2.8)} /> },
  { a: 109.91, b: 120.65, vo: "Leonard Guy bought it ... reopened in 1933. So anyone on the beach that morning was watching it happen for the second time. (BurnThrough)",
    node: <BurnThrough photo={GR + "pav2005.jpg"} iw={2400} ih={1600} focus={[1150, 720]} z0={1.06} z1={1.2} under={GR + "ex1_g.mp4"} underFrom={1.0} burnAt={F(6.9)} burnLen={60} origin={[1130, 660]}>
      <RedLabel text="LEONARD GUY" at={F(1.0)} hold={F(2.6)} />
      <RedLabel text="REOPENED 1933" at={F(4.6)} hold={F(2.0)} />
    </BurnThrough> },
  // F + RAW 6 (cue WR 0:01-0:31): "And through the seafront railings." runs straight into the railing camera's raw
  { a: 120.65, b: 130.30, vo: "And through the seafront railings. + RAW (WR 0:07.7-0:19.4, 192x144 -> RailView)",
    node: <FilmLook_FX grain={0.08}><RailView src={GR + "ex3.mp4"} from={0.1} caption="FROM THE SEAFRONT" captionAt={F(2.2)} /></FilmLook_FX> },
  { a: 130.30, b: 132.53, vo: "The pavilion and its tower were destroyed. (the burnt tower, August 2008)", src: "tower.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.6, fy: 0.4 },
  { a: 132.53, b: 135.67, vo: "The pier was closed when it started, so nobody was on it. (smoking remains, that day)", src: "smoky.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 135.67, b: 139.30, vo: "Deep-fat fryers and arson were both ruled out, (a fire engine at the entrance, next day)", src: "engine.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.6, fy: 0.55 },
  { a: 139.30, b: 143.32, vo: "and in October the brigade recorded the cause as unknown, most likely electrical. (the shell from the beach, August)", src: "wreck.jpg", still: true, s0: 1.08, s1: 1.18, fx: 0.42, fy: 0.5 },
  { a: 143.32, b: 147.84, vo: "The owners, Kerry and Michelle Michael, rebuilt it for thirty-nine million pounds. (rebuilding, March 2010)", src: "rebuild.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.45,
    over: <RedLabel text="KERRY & MICHELLE MICHAEL" at={F(0.6)} hold={F(3.0)} /> },
  { a: 147.84, b: 150.69, vo: "One point two million of that went on fire safety. (the new pavilion, June 2010)", src: "jun2010.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.45 },
  { a: 150.69, b: 153.48, vo: "The new pavilion opened in October 2010. (crowds at the entrance, 25 Oct 2010)", src: "oct2010.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45,
    over: <RedLabel text="OCTOBER 2010" at={F(1.0)} hold={F(1.6)} /> },
  { a: 153.48, b: 156.60, vo: "It was built to hold six thousand seven hundred people, (inside, two floors, Dec 2010)", src: "zd_c.mp4", from: 2.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 156.60, b: 159.43, vo: "with a thousand-foot go-kart track over two floors. (the track)", src: "zd_b.mp4", from: 2.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 159.43, b: 163.18, vo: "Kerry Michael said it was everything they had planned and hoped it would be. (the new front, GRAND PIER 2010)", src: "zd_a.mp4", from: 1.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.4,
    over: <RedLabel text="KERRY MICHAEL, OWNER" at={F(0.3)} hold={F(2.8)} /> },
  { a: 163.18, b: 167.10, vo: "The next year it won Pier of the Year again. (from the beach, April 2011)", src: "ie_a.mp4", from: 0.5, s0: 1.03, s1: 1.08, fx: 0.6, fy: 0.5,
    over: <RedLabel text="PIER OF THE YEAR, 2011" at={F(1.0)} hold={F(2.5)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.00), kind: "glitch", len: 10 },
  { at: F(15.22), kind: "blurDip", len: 14 },   // into the chain
  { at: F(29.99), kind: "glitch", len: 10 },    // chain -> the raw
  { at: F(74.89), kind: "glitch", len: 8 },      // Tilburg, 2014
  { at: F(78.26), kind: "glitch", len: 8 },     // back to Weston
  { at: F(99.38), kind: "blurDip", len: 12 },   // the day before
  { at: F(102.46), kind: "blurDip", len: 12 },
  { at: F(106.39), kind: "glitch", len: 10 },    // 1920s postcard
  { at: F(109.91), kind: "blurDip", len: 12 },  // 1933
  { at: F(120.65), kind: "blurDip", len: 12 },  // beach camera -> beach camera, later
  { at: F(130.30), kind: "glitch", len: 10 },    // aftermath
  { at: F(143.32), kind: "blurDip", len: 14 },  // 2010
  { at: F(156.60), kind: "blurDip", len: 12 },   // same camera
  { at: F(159.43), kind: "blurDip", len: 12 },  // same camera
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [29.94, "sfx_n2/glitch_01.wav", -28],
  [74.84, "sfx_n2/glitch_03.wav", -28],
  [78.21, "sfx_n2/glitch_01.wav", -30],
  [106.34, "sfx_n2/glitch_02.wav", -28],
  [130.25, "sfx_n2/glitch_03.wav", -28],
];

// raw windows: [timeline a, b, audio file, source s, gain dB]. All audio = rawclean.py output (never a clip's own track).
// RAW 1's camera (main) recorded almost nothing (-50 dB room tone), so it gets the same morning's beach sound from ex1 (158-166 s: wind,
// a dog, no speech) — the TP13 precedent. RAW 6 starts under the lead-in line and its sound comes in after it (125.8).
const RAWS: [number, number, string, number, number][] = [
  [29.99, 39.19, "extra1_clean.wav", 158.0, -4], [48.79, 65.39, "extra1_clean.wav", 20.45, 0], [82.40, 91.60, "extra2_clean.wav", 9.6, -2],
  [122.59, 130.3, "extra3_clean.wav", 9.64, 4],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE ALARM NOBODY ANSWERED" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the raws play */}
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(PART_G.at)} layout="none"><Audio src={staticFile("vor/CASE20.mp3")} startFrom={F(PART_G.from)} /></Sequence>
      {RAWS.map(([a, b, file, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/" + file)} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 3, 152 s), ~-19 dB, dipped under every raw; two passes, handed over inside RAW 5 where it is ducked */}
      {([[4.0, 127.0, 20], [126.0, 167.1, 60]] as const).map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a; const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.6 : 0), 1);
            const env = k === 0 ? interpolate(t, [4.0, 5.0, 126.0, 127.0], [0, 1, 1, 0], cl) : interpolate(t, [126.0, 127.0, 164.7, 167.0], [0, 1, 1, 0], cl);
            return dB(-19) * env * (0.12 + 0.88 * duck);
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
