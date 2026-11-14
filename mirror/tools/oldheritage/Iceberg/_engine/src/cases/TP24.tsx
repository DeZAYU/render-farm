// Theme Park #24 — Demon stops twice in one day, Six Flags Great America, Gurnee, Illinois (Sat 1 Sep 2018, Labor Day weekend).
// Footage (all personal channels): [DM] L. Michelle's clip of the second stop (boUFOGTCdIw, 1080p, filmed from below the lift),
// [DJ] JiggidyNDG's clip of the same second stop (1ir1XA_PmSs, 720p: tight zoom on the walk-down, then wide), and from more/:
// [DA] JiggidyNDG "Demon After Evacuation" (Ih4ECqzZ6Ws, 720p25: the empty train still parked at the top after the FIRST walk-down,
// the one that made the news) and [DK] L. Michelle "Demon stuck on the lift hill" (Ktd3VjJNCRs, 1080p, 8 s, wide across the park).
// Devices (this case): SameSpot (dev/TP24_SameSpot: DA's first-stop frame aligned and onion-skinned onto DM's second-stop frame,
// tags 1 and 2 on one spot) + Blender block sections (assets/blocks.py: A = four blocks light up, three trains one per block;
// B = the lift sensor turns red, the lift train stops where it is, the others wait at their block ends).
// Raws (cut sheet order; owner rules 2-3 Nov: fewer, longer, only at sentence ends): DM 0:28-0:42 (14 s), DJ 0:10-0:28 (18 s, main),
// DJ 1:32-1:42 (10 s), DM 3:10-3:22 (12 s; the DJ 3:43 and DM 3:05 cues merged so no lone line sits between two raws);
// sound = rawclean.py output (park music removed). Source cuts: DM 222.3/223.1/338.4-339.0; DJ 191.08/202.28/205.36-205.56/298.72.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { SameSpot } from "../dev/TP24_SameSpot";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DM = GR + "dm.mp4", DJ = GR + "dj.mp4", DA = GR + "da.mp4", DK = GR + "dk.mp4";

// raws: inserted into the VO take at these take seconds (the cut sheet's places), [take point, length, src file, src from, snd, gain dB]
const RAW: [number, number, string, number, string, number][] = [
  [21.93, 14.0, DM, 28.0, "media/dm_clean.wav", 3],    // cue DM 0:11-0:41: the train halted at the top, riders seated
  [27.87, 18.0, DJ, 10.0, "media/dj_clean.wav", -3],   // MAIN raw, cue DJ 0:09-0:39: riders climb out onto the stairs with staff
  [36.93, 10.0, DJ, 92.0, "media/dj_clean.wav", -3],   // cue DJ 1:30-2:00: riders and staff filing down beside the cars
  [56.44, 12.0, DM, 190.0, "media/dm_clean.wav", 4],   // cues DJ 3:43 + DM 3:05 merged (owner 3 Nov: no lone line between raws): DM 3:10-3:22
];
const T0 = 4.0; // title card
// take seconds -> timeline seconds (a shot that starts exactly at a raw's take point comes after that raw)
const T = (t: number) => T0 + t + RAW.reduce((s, [p, len]) => s + (p <= t + 1e-6 ? len : 0), 0);
const RAW_AT = RAW.map(([p], i) => T0 + p + RAW.slice(0, i).reduce((s, r) => s + r[1], 0));
const TAKE_END = 75.39;
const DUR = F(T(TAKE_END) + 1.0);

type Sh = { ta: number; tb: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; tail?: number };
const SHOTS: Sh[] = [
  { ta: 0, tb: 4.13, vo: "Labor Day weekend, Saturday the 1st of September 2018, (DK: the park, the train stuck up on the lift)", src: DK, from: 0.3, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.45,
    over: <RedLabel text="SEPTEMBER 1, 2018" at={F(0.7)} hold={F(2.9)} /> },
  { ta: 4.13, tb: 7.02, vo: "at Six Flags Great America in Gurnee, Illinois. (DA: the midway, the Demon behind)", src: DA, from: 0.5, s0: 1.02, s1: 1.07, fx: 0.55, fy: 0.5,
    over: <RedLabel text="GURNEE, ILLINOIS" at={F(0.4)} hold={F(2.2)} /> },
  { ta: 7.02, tb: 10.98, vo: "A Six Flags spokeswoman said safety sensors had stopped the Demon on its climb (DM: the train halted on the lift)", src: DM, from: 100.0, s0: 1.08, s1: 1.2, fx: 0.55, fy: 0.42 },
  { ta: 10.98, tb: 13.49, vo: "and the riders were walked down. (DJ: people filing down the stairs)", src: DJ, from: 236.8, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { ta: 13.49, tb: 15.51, vo: "That stop made the local news. (DA: the first stop's train still parked at the top)", src: DA, from: 15.3, s0: 1.15, s1: 1.22, fx: 0.45, fy: 0.62 },
  { ta: 15.51, tb: 17.81, vo: "According to a fan who follows the park, (DJ: the fan's own zoom at the crest)", src: DJ, from: 308.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { ta: 17.81, tb: 21.93, vo: "there was a second one that day, on the same hill, and that one didn't. (DJ: the hill, the train halted again)", src: DJ, from: 0.3, s0: 1.05, s1: 1.12, fx: 0.5, fy: 0.5 },
  { ta: 21.93, tb: 27.87, vo: "So after the first stop, the ride was back running with people on it, and it stopped again in the same place. (SameSpot)",
    node: <SameSpot a={GR + "ss_a.jpg"} aw={1280} ah={720} aBox={[505, 400, 660, 505]} b={GR + "ss_b.jpg"} bBox={[960, 480, 1240, 680]}
      align={{ k: 2.0, ax: 630, ay: 435, bx: 1190, by: 535 }} moveAt={F(1.7)} moveLen={F(1.3)} /> },
  { ta: 27.87, tb: 31.79, vo: "Walking down the lift hill is how most coaster evacuations end. (DM: riders and staff on the stairs)", src: DM, from: 62.0, s0: 1.15, s1: 1.3, fx: 0.4, fy: 0.55 },
  { ta: 31.79, tb: 34.0, vo: "The stairs run right beside the track, (DJ: tight on the stairs beside the cars)", src: DJ, from: 78.4, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.6 },
  { ta: 34.0, tb: 36.93, vo: "and staff come up and bring the riders down with them. (DM, close: hi-vis staff leading riders)", src: DM, from: 75.0, s0: 1.7, s1: 1.82, fx: 0.37, fy: 0.62 },
  { ta: 36.93, tb: 43.23, vo: "A coaster is split into sections, and the control system only lets one train into each section at a time. (Blender A)", src: GR + "blocks_a.mp4", from: 0, s0: 1.0, s1: 1.0 },
  { ta: 43.23, tb: 47.4, vo: "When a sensor doesn't like something, it stops the train where it is, (Blender B: sensor red, the lift train stops)", src: GR + "blocks_b.mp4", from: 0, s0: 1.0, s1: 1.0 },
  { ta: 47.4, tb: 49.07, vo: "and on the Demon that was the lift hill. (DM: the whole lift, the train at its top)", src: DM, from: 108.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  { ta: 49.07, tb: 50.54, vo: "It's the system working. (DJ: staff walking riders down, calm)", src: DJ, from: 246.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { ta: 50.54, tb: 52.82, vo: "It still leaves people sitting in the air. (DM close: the seated riders at the top)", src: DM, from: 140.0, s0: 1.3, s1: 1.4, fx: 0.62, fy: 0.42 },
  { ta: 52.82, tb: 56.44, vo: "Some riders were still sitting in the cars, waiting their turn. (DJ tight: riders in the cars, staff beside)", src: DJ, from: 160.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45 },
  { ta: 56.44, tb: 58.95, vo: "Six Flags said everyone got off safely, (DJ: riders reaching the stairs)", src: DJ, from: 266.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { ta: 58.95, tb: 63.24, vo: "and the ride closed for what it called a thorough inspection before reopening. (DM: staff at the crest)", src: DM, from: 346.0, s0: 1.05, s1: 1.14, fx: 0.55, fy: 0.45 },
  { ta: 63.24, tb: 67.1, vo: "Anyone in the queue for that second ride had no idea (DK: the crowd below the stopped train)", src: DK, from: 4.3, s0: 1.08, s1: 1.15, fx: 0.5, fy: 0.6 },
  { ta: 67.1, tb: 70.54, vo: "it had already stopped up there once that day, because nobody tells the queue. (DA: the first stop's train at the top)", src: DA, from: 8.5, s0: 1.1, s1: 1.18, fx: 0.45, fy: 0.6 },
  { ta: 70.54, tb: TAKE_END, vo: "Six Flags never said how many riders were on either train or how long they waited. (DM close: the full train)", src: DM, from: 160.0, s0: 1.2, s1: 1.32, fx: 0.6, fy: 0.42, tail: 1.0 },
];

type Seg = { a: number; b: number; node: React.ReactNode; over?: React.ReactNode };
const SEGS: Seg[] = [
  ...SHOTS.map((s) => {
    const a = T(s.ta), b = a + (s.tb - s.ta) + (s.tail ?? 0);
    const node = s.node ?? <FilmLook_FX grain={0.08}><Shot_FX src={s.src!} n={F(b) - F(a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
    return { a, b, node, over: s.over };
  }),
  ...RAW.map(([, len, src, from], i) => ({ a: RAW_AT[i], b: RAW_AT[i] + len,
    node: <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(len)} from={from} s0={1.02} s1={1.07} fx={0.5} fy={0.5} /></FilmLook_FX> })),
];

const CUTS: FxCut[] = [
  { at: F(T0), kind: "glitch", len: 10 },
  { at: F(T(17.81)), kind: "blurDip", len: 12 },          // DJ crest zoom -> DJ wide (same camera)
  { at: F(T(21.93)), kind: "blurDip", len: 12 },          // raw 1 -> SameSpot (DM base frame)
  { at: F(RAW_AT[2] + RAW[2][1]), kind: "glitch", len: 10 }, // raw 3 -> the Blender mechanism
  { at: F(T(43.23)), kind: "zoomHit", len: 10 },          // Blender A -> B (closer on the lift)
  { at: F(T(47.4)), kind: "blurDip", len: 12 },           // Blender -> footage
  { at: F(T(70.54)), kind: "blurDip", len: 12 },
];

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [T0 - 0.05, "sfx_n2/glitch_02.wav", -26],
  [RAW_AT[2] + RAW[2][1] - 0.05, "sfx_n2/glitch_03.wav", -28],
  [T(43.23) + 2.0 - 0.03, X + "metal_clank_4.wav", -26],   // the lift train stops (sim frame 220 = 60 f into shot B)
  [T(43.23) + 2.0, X + "sub_drop_1.wav", -32],
  [T(50.54) - 0.2, X + "wind_gust_1.wav", -30],            // people sitting in the air
];

// music: Epidemic ambient Music 1 (-18.3 LUFS file; VO -25.8 LUFS -> about -17 dB keeps it ~10 LU under), out under every raw
const duck = (t: number) => RAW_AT.reduce((m, a, i) => {
  const b = a + RAW[i][1];
  return Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0);
}, 1);

const CompFull: React.FC = () => {
  const end = DUR / 30;
  const vo: [number, number][] = [[0, 21.93], [21.93, 27.87], [27.87, 36.93], [36.93, 56.44], [56.44, TAKE_END + 0.3]];
  return (
    <LibFontGate>
      <AbsoluteFill style={{ background: "#000" }}>
        <Transitions_FX cuts={CUTS}>
          <AbsoluteFill>
            <Sequence from={0} durationInFrames={F(T0)} layout="none"><AbsoluteFill><TitleCard dur={F(T0)} title="THE DEMON STOPS TWICE" bg={GR + "title.jpg"} pos="60% 40%" /></AbsoluteFill></Sequence>
            {SEGS.map((s, i) => (
              <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill>{s.node}{s.over}</AbsoluteFill></Sequence>
            ))}
          </AbsoluteFill>
        </Transitions_FX>
        {vo.map(([s0, s1], i) => (
          <Sequence key={"v" + i} from={F(T(s0))} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} startFrom={F(s0)} /></Sequence>
        ))}
        {RAW.map(([, len, , from, snd, g], i) => (
          <Sequence key={"r" + i} from={F(RAW_AT[i])} durationInFrames={F(len)} layout="none">
            <Audio src={staticFile(C + snd)} startFrom={F(from)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(len) - 14, F(len) - 2], [0, 1, 1, 0], cl)} />
          </Sequence>
        ))}
        <Sequence from={F(T0 - 0.4)} durationInFrames={DUR - F(T0 - 0.4)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(22)} loop volume={(f) => {
            const t = f / 30 + T0 - 0.4;
            return dB(-17) * interpolate(t, [T0 - 0.4, T0 + 0.6, end - 3.0, end - 0.2], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck(t));
          }} />
        </Sequence>
        {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
      </AbsoluteFill>
    </LibFontGate>
  );
};

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): raw 3 (DJ 1:32 riders filing down) removed: a near-duplicate of the main raw, sitting at the block-section explanation. 4 -> 3 raws.
const _cut = cutOut(CompFull, DUR, [[72.93, 82.93]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
