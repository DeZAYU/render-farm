// Tornado #6 — Washington, Illinois, Sunday 17 November 2013 (EF4). "Look at it flying."
// Footage: [VIGO] Vigo L (rJDQ3HgV_Zc, the wedge beyond the power poles south of town), [SMOCK] fn6zP9cTyT8 (a store lot in Washington,
// "tornado warning!"), [LANC] Kris & Mandy Lancaster's yard (pVanmvVNHcc), [WELLS] Marc Wells (HFrgSVoJi1U: the tornado, then his house
// after), [KITE] Josh Lillie's low aerial the day after (N0cWWLQsYso), [DRIVE] CJ Conger's drive through the streets (NuNAPpEg8ng).
// Devices built for THIS case: OutlookFlip (the real SPC outlooks: the day's High risk lifts off to show Thursday's Day 4-8 outlook),
// FreezeLift (the debris in the funnel, frozen, bracketed, lifted out and played slow), ClockedRun (NCEI segment times riding the
// head of the 46-mile track on NASA HLS imagery). VO = one take ("Sixth." cut), split only where the 5 raws play (3 Nov raw audit: vigo freight-train and smock noise raws removed); raw sound never under VO.
// Profanity in the raws is bleeped (1 kHz, the raw ducked to 0 under it). Source cuts: lanc 39.67-40.8 (finger), 55.9-56.6; vigo
// 22.9-32.9, 119.9; smock 60.8+; every window below avoids them.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { OutlookFlip } from "../dev/TOR06_OutlookFlip";
import { FreezeLift } from "../dev/TOR06_FreezeLift";
import { ClockedRun } from "../dev/TOR06_ClockedRun";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(195.58);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO blocks: [timeline start, take start, take end]
const VO: [number, number, number][] = [
  [16.4, 0.97, 28.19],    // A+B  Sunday ... entered Washington. (raw 2 removed 3 Nov: the take runs on)
  [58.37, 28.19, 49.23],   // C+D  forty-six miles ... out shopping. (raw 4 removed 3 Nov)
  [100.78, 49.23, 52.74],  // E  What's flying ...
  [118.48, 52.74, 58.33],  // F  basement ... Marc Wells
  [133.48, 58.35, 119.4],  // G  outcome
];
const MSTART = [6, 37, 62, 18, 64]; // Music 1 (128 s) offsets per VO block
// raws: [timeline a, b, file, source from, gain dB, bleeps (source s)]
const RAWS: [number, number, string, number, number, [number, number][]][] = [
  [4.0, 16.0, "vigo.mp4", 41.0, -3, []],
  [43.97, 57.97, "smock.mp4", 0.8, -2, []],
  [79.68, 100.38, "lanc.mp4", 2.8, -1, [[8.88, 9.3], [10.85, 11.27]]],
  [104.58, 118.08, "lanc.mp4", 93.5, -1, [[96.35, 97.9]]],
  [124.38, 133.08, "wells.mp4", 2.2, -3, []],
];

const SHOTS: Sh[] = [
  // RAW 1: the wedge beyond the power poles, south of town
  { a: 4.0, b: 16.0, vo: "RAW vigo", src: "vigo.mp4", from: 41.0, s0: 1.02, s1: 1.07, fx: 0.45, fy: 0.45 },
  // VO A
  { a: 16.0, b: 19.25, vo: "Sunday the 17th of November 2013, (Washington, a store lot as it comes)", src: "smock.mp4", from: 17.5, s0: 1.04, s1: 1.09, fx: 0.55, fy: 0.45,
    over: <RedLabel text="NOVEMBER 17, 2013" at={10} hold={F(2.6)} /> },
  { a: 19.25, b: 23.13, vo: "just before eleven in the morning, south of Cummings in central Illinois.", src: "vigo.mp4", from: 34.0, s0: 1.05, s1: 1.1, fx: 0.4, fy: 0.5,
    over: <RedLabel text="CENTRAL ILLINOIS" at={14} hold={F(3.0)} /> },
  { a: 23.13, b: 25.0, vo: "That's November. (bare trees in the Lancasters' yard)", src: "lanc.mp4", from: 135.6, s0: 1.06, s1: 1.1, fx: 0.3, fy: 0.4 },
  { a: 25.0, b: 28.07, vo: "A strong autumn cold front had run into air that was still warm and humid,", src: "vigo.mp4", from: 99.0, s0: 1.08, s1: 1.14, fx: 0.5, fy: 0.35 },
  { a: 28.07, b: 34.04, vo: "and the whole Midwest got an outbreak out of it. Forecasters had flagged the risk as early as the Thursday before, (SPC outlooks)",
    node: <OutlookFlip top={GR + "spc_day1.jpg"} under={GR + "spc_day48.jpg"} iw={815} ih={555} flipAt={72} topLabel="SUNDAY: HIGH RISK" underLabel="ISSUED THURSDAY, NOV 14" focus={[0.66, 0.42]} bg={GR + "spc_day1.jpg"} /> },
  { a: 34.04, b: 35.8, vo: "so a lot of people were ready. (a man filming from the lot)", src: "smock.mp4", from: 36.5, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  // VO B
  { a: 35.8, b: 40.52, vo: "EF4, up to a hundred and ninety, half a mile across at its widest.", src: "lanc.mp4", from: 72.0, s0: 1.02, s1: 1.08, fx: 0.45, fy: 0.4 },
  { a: 40.52, b: 43.97, vo: "It hit its peak strength just as it entered Washington.", src: "smock.mp4", from: 44.5, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.4,
    over: <RedLabel text="WASHINGTON, ILLINOIS" at={8} hold={F(2.6)} /> },
  // RAW 3: "tornado warning!" across the lot
  { a: 43.97, b: 57.97, vo: "RAW smock warning", src: "smock.mp4", from: 0.8, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45 },
  // VO C
  { a: 57.97, b: 61.27, vo: "It covered forty-six miles in forty-eight minutes,", src: "vigo.mp4", from: 64.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45 },
  { a: 61.27, b: 64.2, vo: "close to sixty miles an hour across the ground.", src: "lanc.mp4", from: 112.0, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.45 },
  { a: 64.2, b: 67.25, vo: "That leaves almost no time to pick a place to go.", src: "smock.mp4", from: 22.0, s0: 1.06, s1: 1.12, fx: 0.55, fy: 0.45 },
  { a: 67.25, b: 71.1, vo: "The warning for Washington was updated a few minutes before it struck.", src: "vigo.mp4", from: 108.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.42 },
  // VO D
  { a: 71.1, b: 75.26, vo: "Kris and Mandy Lancaster were out in their yard in Washington with the dogs.", src: "lanc.mp4", from: 26.5, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5,
    over: <RedLabel text="KRIS AND MANDY LANCASTER" at={12} hold={F(3.4)} /> },
  { a: 75.26, b: 79.68, vo: "It was a Sunday morning, and a lot of the town was in church or out shopping. (the store lot)", src: "smock.mp4", from: 50.0, s0: 1.05, s1: 1.1, fx: 0.4, fy: 0.5 },
  // RAW 5: "look at it flying" (bleeped), the run for the house
  { a: 79.68, b: 100.38, vo: "RAW lanc look at it flying", src: "lanc.mp4", from: 2.8, s0: 1.02, s1: 1.05, fx: 0.5, fy: 0.45 },
  // VO E: the debris in the funnel, frozen, lifted out, slow
  { a: 100.38, b: 104.58, vo: "What's flying is other people's houses, pulled up into the funnel.",
    node: <FreezeLift still={GR + "lanc_f96.jpg"} stillAt={9.6} slow={GR + "lanc_replay.mp4"} slowFrom={4.2} box={[0.38, 0.27, 0.66, 0.64]} bracketAt={4} liftAt={30} /> },
  // RAW 6: the wedge right behind the homes, "be ready to run with me"
  { a: 104.58, b: 118.08, vo: "RAW lanc wedge", src: "lanc.mp4", from: 93.5, s0: 1.02, s1: 1.07, fx: 0.45, fy: 0.45 },
  // VO F
  { a: 118.08, b: 121.18, vo: "They got themselves and the dogs into the basement. (the last look before the door)", src: "lanc.mp4", from: 63.0, s0: 1.08, s1: 1.13, fx: 0.4, fy: 0.45 },
  { a: 121.18, b: 124.38, vo: "Nearby, Marc Wells got below ground too. (the wedge over the town)", src: "vigo.mp4", from: 104.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.42 },
  // RAW 7: Marc Wells, the debris-laden tornado right outside
  { a: 124.38, b: 133.08, vo: "RAW wells", src: "wells.mp4", from: 2.2, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.45,
    over: <RedLabel text="MARC WELLS" at={14} hold={F(3.0)} /> },
  // VO G: the outcome
  { a: 133.08, b: 141.82, vo: "It first came down at 10:59 southeast of East Peoria and finally lifted at 11:47, just east of Long Point. (clocked run on NASA HLS)",
    node: <ClockedRun src={GR + "hls_track.jpg"} iw={3000} ih={2370} h0={10} m0={59} at={24} len={F(5.6)} z0={2.3} z1={1.0}
      nodes={[[457, 1888, 0], [1095, 1390, 13], [2051, 687, 34], [2368, 487, 42], [2628, 370, 48]]}
      places={[{ x: 420, y: 1714, label: "EAST PEORIA" }, { x: 938, y: 1566, label: "WASHINGTON" }, { x: 2477, y: 383, label: "LONG POINT" }]} /> },
  { a: 141.82, b: 146.18, vo: "Three people were lost. An eighty-four-year-old man in Washington was one. (the streets the next day)", src: "drive.mp4", from: 112.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 146.18, b: 149.73, vo: "An eighty-two-year-old woman there passed away about a week later. (from above, the rows)", src: "kite.mp4", from: 92.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 149.73, b: 154.78, vo: "The third was a fifty-one-year-old man out in the countryside, before it reached the city. (the open country south of town)", src: "vigo.mp4", from: 5.0, s0: 1.06, s1: 1.12, fx: 0.45, fy: 0.45 },
  { a: 154.78, b: 160.71, vo: "A hundred and twenty-five people were hurt, a hundred and twenty-one in or near Washington. (Marc Wells' house after)", src: "wells.mp4", from: 117.6, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 160.71, b: 164.58, vo: "1,484 homes were damaged or destroyed. (from above: the rows of homes)", src: "kite.mp4", from: 22.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 164.58, b: 168.61, vo: "Washington alone had more than eight hundred million dollars of damage.", src: "drive.mp4", from: 104.4, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 168.61, b: 173.39, vo: "Statewide, the tornadoes that day did about a billion dollars of damage.", src: "kite.mp4", from: 60.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 173.39, b: 178.88, vo: "Up in Chicago, the same storms held up a Bears game at Soldier Field for two hours. (the same line of storms)", src: "vigo.mp4", from: 72.0, s0: 1.55, s1: 1.62, fx: 0.4, fy: 0.12 },
  { a: 178.88, b: 182.93, vo: "Nobody in central Illinois spends November thinking about basements, (Wells' basement door)", src: "wells.mp4", from: 88.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 182.93, b: 186.96, vo: "which makes that run for the stairs the smartest decision in this case. (Wells' outside stairs, standing alone)", src: "wells_stairs.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.4, fy: 0.5 },
  { a: 186.96, b: 190.98, vo: "The same storm put down another tornado that afternoon,", src: "drive.mp4", from: 120.3, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 190.98, b: 195.58, vo: "in a different Washington, two hundred and thirty miles away in Indiana. (rising over the rows)", src: "kite.mp4", from: 128.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(28.07), kind: "whip", len: 10 },
  { at: F(34.04), kind: "blurDip", len: 10 },
  { at: F(43.97), kind: "blurDip", len: 12 },     // smock window -> smock raw
  { at: F(100.38), kind: "zoomHit", len: 10 },   // raw -> its frozen frame
  { at: F(104.58), kind: "blurDip", len: 12 },   // lift -> the next lanc window
  { at: F(133.08), kind: "glitch", len: 8 },
  { at: F(141.82), kind: "blurDip", len: 12 },
  { at: F(182.93), kind: "blurDip", len: 12 },  // two Wells windows back to back
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [28.07, "sfx_n2/whoosh_01.wav", -30],
  [28.2, X + "paper_2.wav", -30],
  [30.5, X + "page_turn_1.wav", -28],   // the print lifts
  [100.38, X + "camera_shutter_2.wav", -24], // the freeze
  [101.38, "sfx_n2/whoosh_02.wav", -31],
  [133.08, "sfx_n2/glitch_03.wav", -28],
];

// raw audio: the clip's sound after rawclean.py (music stripped, guide 5b), full window, out over the last 0.6 s; bleeps duck it to 0
const RawAudio: React.FC<{ r: (typeof RAWS)[number] }> = ({ r }) => {
  const [a, b, file, from, g, bleeps] = r;
  const n = F(b) - F(a);
  return (
    <Sequence from={F(a)} durationInFrames={n} layout="none">
      <Audio src={staticFile(MD + file.replace(".mp4", "_clean.wav"))} startFrom={F(from)} volume={(f) => {
        const t = from + f / 30;
        const duck = bleeps.some(([x, y]) => t >= x && t <= y) ? 0 : 1;
        return dB(g) * duck * interpolate(f, [0, 5, n - 18, n], [0, 1, 1, 0], cl);
      }} />
      {bleeps.map(([x, y], i) => (
        <Sequence key={i} from={F(x - from)} durationInFrames={F(y - x)} layout="none"><Audio src={staticFile(C + "assets/bleep.wav")} volume={dB(-14)} /></Sequence>
      ))}
    </Sequence>
  );
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="LOOK AT IT FLYING" bg={GR + "lanc_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, "Sixth." removed, split only where the raws play */}
      {VO.map(([t, a, b], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map((r, i) => <RawAudio key={"r" + i} r={r} />)}
      {/* music: Epidemic ambient Music 1 (not used by the neighbouring cases), out under each raw, back after */}
      {VO.map(([t, a, b], i) => {
        const n = F(b) - F(a) + F(0.8);
        return (
          <Sequence key={"m" + i} from={F(t) - 10} durationInFrames={n + 10} layout="none">
            <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(MSTART[i])} volume={(f) => dB(-16) * interpolate(f, [0, 16, n - 6, n + 10], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
