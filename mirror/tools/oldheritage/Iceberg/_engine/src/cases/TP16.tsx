// Theme Park #16 — the Starflyer, Jubilee Gardens, London South Bank, Sunday 31 July 2016: the tower swing stops just before six with ten
// capsules ~20 m up (19 riders, six children); LFB aerial ladder platforms take them off one capsule at a time, the ring turned by hand
// to the basket; all down after 9:45. Footage: Evangelina Tobinski's own 12.7-min phone clip of the rescue (main, 568x320, upscaled
// to 720p before the grade; its crowd sound -> all six raws, through rawclean.py), Suresh's daytime clip of the same Starflyer
// running a week later (sures, 7 Aug 2016) and TheBaebunsen's on-ride POV of the South Bank Starflyer in 2012 (pov = source 20-46 s).
// The Aachen seat in SeatPair is TP15's graded clip (aachen.mp4, copied). Devices built for this case: CapsuleTurn (top-down ring:
// the gap, the hand turn, the ten capsules emptied and counted), SeatPair (open seat vs closed capsule), SkySlices (the clip's sky in time slices, before six -> 9:45).
// Source cuts: main none (one continuous take); sures none; pov (file s) 3.93 + 20.6. One camera carries the incident: main->main
// joins are blur-dips or a hard cut to another source between them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { CapsuleTurn } from "../dev/TP16_CapsuleTurn";
import { SeatPair } from "../dev/TP16_SeatPair";
import { SkySlices } from "../dev/TP16_SkySlices";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(141.4);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const M = "main.mp4";

// VO take parts (no count word in this take) -> timeline. Owner rules: fewer, longer raws (2 Nov, TP17); raws only at paragraph ends,
// every VO stretch between raws a full thought, each device once, no angle 5+ shots in a row (3 Nov, TP19).
// Three raws at cut-sheet cues 1, 3, 6 (cues 2, 4, 5 dropped; their VO runs on): R1 8 s, R3 = main incident raw 15 s, R6 8.5 s.
// A 0-24.2 @4.0 | R1 28.2-36.2 | BC 24.2-58.4 @36.2 | R3 70.4-85.4 | DEF 58.4-80.45 @85.4 | R6 107.45-115.95 | G 80.45-end @115.95
const VO: [number, number, number][] = [[4.0, 0, 24.2], [36.2, 24.2, 58.4], [85.4, 58.4, 80.45], [115.95, 80.45, 104.76]];
// raws: [timeline a, b, main source s]
const RAWS: [number, number, number][] = [[28.2, 36.2, 8.0], [70.4, 85.4, 220.5], [107.45, 115.95, 621.0]];

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.6, vo: "Just before six on the evening of Sunday the 31st of July 2016,", src: M, from: 42.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.35,
    over: <RedLabel text="JULY 31, 2016" at={F(0.8)} hold={F(2.4)} /> },
  { a: 7.6, b: 11.0, vo: "the Starflyer on London's South Bank broke down. (crowd and police below the stopped tower)", src: M, from: 52.0, s0: 1.06, s1: 1.12, fx: 0.55, fy: 0.6,
    over: <RedLabel text="SOUTH BANK, LONDON" at={F(0.6)} hold={F(2.4)} /> },
  { a: 11.0, b: 14.4, vo: "It had been a summer fixture there since 2012. (on-ride, South Bank, 2012)", src: "pov.mp4", from: 6.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 14.4, b: 18.25, vo: "It's a tall tower that lifts hanging capsules and swings them round. (the same Starflyer running, a week later)", src: "sures.mp4", from: 4.0, s0: 1.0, s1: 1.07, fx: 0.4, fy: 0.3 },
  { a: 18.25, b: 21.7, vo: "It stopped with ten capsules raised about twenty metres up. (the crown, capsules hanging still)", src: M, from: 160.0, s0: 1.08, s1: 1.15, fx: 0.5, fy: 0.3 },
  { a: 21.7, b: 25.7, vo: "Nineteen people were inside, thirteen adults and six children. (baskets at the capsules)", src: M, from: 182.0, s0: 1.3, s1: 1.4, fx: 0.55, fy: 0.45 },
  { a: 25.7, b: 28.2, vo: "It stood almost in the shadow of the London Eye. (the Eye beside the tower)", src: "sures.mp4", from: 28.0, s0: 1.02, s1: 1.07, fx: 0.3, fy: 0.5,
    over: <RedLabel text="THE LONDON EYE" at={F(0.5)} hold={F(1.6)} /> },
  // RAW 1 (cue SF 0:05-0:35): the stopped tower, capsules high, a platform beside them, the London Eye behind
  { a: 28.2, b: 36.2, vo: "RAW: stopped tower, platform, the Eye", src: M, from: 8.0, s0: 1.0, s1: 1.07, fx: 0.4, fy: 0.4 },
  { a: 36.2, b: 40.9, vo: "London Fire Brigade sent two fire engines from Lambeth and two aerial ladder platforms, (engines on site)", src: M, from: 724.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.6,
    over: <RedLabel text="LONDON FIRE BRIGADE" at={F(0.6)} hold={F(3.2)} /> },
  { a: 40.9, b: 43.0, vo: "from Greenwich and Clapham. (the two booms)", src: M, from: 104.0, s0: 1.02, s1: 1.07, fx: 0.6, fy: 0.4 },
  { a: 43.0, b: 47.2, vo: "The idea was to reach each capsule, secure it and move the riders across. (a basket at a capsule)", src: M, from: 192.0, s0: 1.25, s1: 1.34, fx: 0.62, fy: 0.45 },
  { a: 47.2, b: 50.55, vo: "The problem was that the capsules wouldn't line up with the platform. (ground angle: the ladder platform)", src: M, from: 258.0, s0: 1.04, s1: 1.1, fx: 0.7, fy: 0.4 },
  { a: 50.55, b: 54.3, vo: "An engineer from the ride helped the crews release its brake by hand. (a basket in at the tower's hub)", src: M, from: 604.0, s0: 1.12, s1: 1.2, fx: 0.5, fy: 0.45 },
  { a: 54.3, b: 58.2, vo: "That let them turn each capsule until it sat next to the platform. (a basket close at the capsules)", src: M, from: 585.0, s0: 1.1, s1: 1.18, fx: 0.5, fy: 0.5 },
  { a: 58.2, b: 61.25, vo: "Station manager Clive Robinson called it slow work. (two baskets under the crown)", src: M, from: 335.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4,
    over: <RedLabel text="STATION MANAGER CLIVE ROBINSON" at={F(0.5)} hold={F(2.2)} size={40} /> },
  { a: 61.25, b: 63.5, vo: "And six of the nineteen were children. (capsules, close)", src: M, from: 455.0, s0: 1.3, s1: 1.36, fx: 0.62, fy: 0.55 },
  { a: 63.5, b: 67.3, vo: "You can't just tell a kid to step from a swinging capsule onto a platform (the capsules swinging, running a week later)", src: "sures.mp4", from: 42.0, s0: 1.8, s1: 1.9, fx: 0.53, fy: 0.45 },
  { a: 67.3, b: 70.4, vo: "twenty metres up. Somebody has to talk them across. (a basket close in at the capsules)", src: M, from: 485.0, s0: 1.2, s1: 1.28, fx: 0.35, fy: 0.4 },
  // RAW 3 = the main incident raw (cue SF 3:30-4:00): the filmer zooms in on a basket working at a capsule, then holds on it
  { a: 70.4, b: 85.4, vo: "RAW: the basket at a capsule, played through (15 s)", src: M, from: 220.5, s0: 1.0, s1: 1.12, fx: 0.55, fy: 0.45 },
  { a: 85.4, b: 87.05, vo: "It was daylight when this started. (the first minutes)", src: M, from: 1.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 87.05, b: 88.45, vo: "That didn't last. (dusk, blue lights, Big Ben)", src: M, from: 706.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 88.45, b: 97.65, vo: "Same basic idea as the swing in Aachen ... only these are closed capsules. Given the choice, the capsule wins, though not by much. (SeatPair)",
    node: <SeatPair open={GR + "aachen.mp4"} openFrom={85} openPos="42% 30%" closed={GR + "pov.mp4"} closedFrom={11.0} closedPos="45% 45%" closedZoom={1.25} bg={GR + M} bgFrom={400}
      closedAt={F(4.6)} winsAt={F(6.85)} muchAt={F(8.15)} /> },
  { a: 97.65, b: 107.45, vo: "Each capsule was turned by hand and held in place. Then it was secured and emptied, and the next one was brought round. That happened ten times, (CapsuleTurn: the ten, counted) with a crowd watching from the river.",
    node: <CapsuleTurn bg={GR + M} bgFrom={500} mode="cycle" endAt={F(6.9)} /> },
  // RAW 6 (cue SF 10:13-10:43): a basket in at the tower, lights on, nearly dusk
  { a: 107.45, b: 115.95, vo: "RAW: basket at the tower, lights on", src: M, from: 621.0, s0: 1.0, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 115.95, b: 119.8, vo: "The brigade logged the job closed at 9:22 that night, (crews on the ground, night)", src: M, from: 740.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 119.8, b: 123.5, vo: "and ITV reported everyone was down shortly after 9:45. (Big Ben, blue lights)", src: M, from: 714.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 123.5, b: 128.1, vo: "Robinson said that everyone was relieved to be back on the ground, and very calm. (people on the ground)", src: M, from: 735.3, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 128.1, b: 131.0, vo: "No one was hurt, and no cause was ever published. (the ride running again a week later)", src: "sures.mp4", from: 60.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 131.0, b: 135.3, vo: "Robinson said afterwards that everyone was patiently waiting for us to get around to them. (a basket by the Eye)", src: M, from: 690.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45 },
  { a: 135.3, b: 141.4, vo: "Patiently, twenty metres up, from before six until after half past nine. (SkySlices)",
    node: <SkySlices bg={GR + M} frames={[3, 160, 330, 470, 600, 690, 742]} run={[F(0.3), F(3.7)]} from="BEFORE 6 PM" to="9:45 PM" label="NEARLY FOUR HOURS" labelAt={F(4.0)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.6), kind: "blurDip", len: 10 },
  { at: F(18.25), kind: "whip", len: 10 },
  { at: F(21.7), kind: "blurDip", len: 10 },
  { at: F(28.2), kind: "blurDip", len: 12 },
  { at: F(36.2), kind: "blurDip", len: 12 },
  { at: F(40.9), kind: "blurDip", len: 10 },
  { at: F(43.0), kind: "blurDip", len: 10 },
  { at: F(47.2), kind: "blurDip", len: 10 },
  { at: F(50.55), kind: "blurDip", len: 10 },
  { at: F(54.3), kind: "blurDip", len: 10 },
  { at: F(58.2), kind: "blurDip", len: 10 },
  { at: F(61.25), kind: "blurDip", len: 10 },
  { at: F(70.4), kind: "blurDip", len: 12 },
  { at: F(85.4), kind: "blurDip", len: 12 },
  { at: F(87.05), kind: "blurDip", len: 10 },
  { at: F(88.45), kind: "glitch", len: 10 },
  { at: F(97.65), kind: "blurDip", len: 12 },
  { at: F(107.45), kind: "blurDip", len: 12 },
  { at: F(115.95), kind: "glitch", len: 10 },
  { at: F(119.8), kind: "blurDip", len: 10 },
  { at: F(123.5), kind: "blurDip", len: 10 },
  { at: F(135.3), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [88.4, "sfx_n2/glitch_03.wav", -30],
  [98.1, X + "metal_clank_4.wav", -32],      // the first capsule held at the basket
  [115.9, "sfx_n2/glitch_02.wav", -30],
  [135.4, X + "wind_gust_1.wav", -34],       // the evening comes on over the sky slices
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE STARFLYER BREAKS DOWN" bg={GR + "title.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound = the clip's own crowd, cleaned (rawclean.py): only inside the raw windows, faded out before the VO returns */}
      {RAWS.map(([a, b, src], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(-6) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 5, -20.9 LUFS file -> ~-14.5 dB = ~10 LU under the -25 LUFS take), dipped under the raws.
          The file is 126 s, the case 141 s: a second pass (from the file's 20 s) cross-fades in under the outcome section. */}
      {([[3.6, 0, 123.0, 0, 0, 0], [119.5, 20, DUR / 30, 119.5, 123.0, DUR / 30]] as const).map(([at, from, end, fi0, fi1, fo], k) => (
        <Sequence key={"m" + k} from={F(at)} durationInFrames={F(end) - F(at)} layout="none">
          <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(from)} volume={(f) => {
            const t = f / 30 + at; const duck = RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
            const env = k === 0 ? interpolate(t, [3.6, 4.6, 119.5, 123.0], [0, 1, 1, 0], cl)
              : interpolate(t, [fi0, fi1, fo - 2.8, fo - 0.1], [0, 1, 1, 0], cl);
            return dB(-14.5) * env * (0.2 + 0.8 * duck);
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
