// Theme Park #04 — Rennes, New Year's Eve 2018: eight riders stuck at the top of the Bomber Maxxx's 52 m arm for nine hours.
// Footage: K58U85he5Gc (main: the arm and gondola from a building across the esplanade), 3cMwyVxvt2E (e1: the descents, camera following
// a rescuer + passenger down the arm to the ladder basket; applause at the end), xbKgNzYwOII (e2: SDIS 35 release, rescuer on the arm),
// sYKeQwkxEcc (e3: a later descent into the basket), TN-kxBRLYd0 (dl: a fairgoer's vertical phone clip from the ground).
// Raws sit at all seven ▶ RAW cues of the cut sheet, in order, trimmed to the moment; their sound is the rawclean.py output
// (media/*_clean.wav: background music stripped), never the clip's own track.
// Devices (new, case-specific): Blender model of the ride (arm swings up and over, stops at the top; orbit round the stuck tip),
// LadderGap (16 storeys / 30 m ladder / the 20 m nobody can reach), RopeZoom (live magnified panel of the two figures on the rope; replaced FreezeBracket 3 Nov), DescentLedger (eight
// marks come down the arm via the 30 m platform; the last at 6 AM; nine hours bracketed).
// VO = one take (no count word), split only where a raw plays. Sources have no cuts (srccuts: none).
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { LadderGap } from "../dev/TP04_LadderGap";
import { DescentLedger } from "../dev/TP04_DescentLedger";
import { RopeZoom } from "../dev/TP04_RopeZoom";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = C + "media/", MAP = C + "maps/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TOTAL = 201.4, END = 200.2;
const DUR = F(TOTAL);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO parts (take -> timeline): A 0-29.9 @4.0 | B 30.2-49.35 @42.1 | C 49.6-60.35 @68.45 | D 60.7-71.85 @87.4 | E 71.95-76.1 @104.75
//   | F 76.35-84.28 @123.1 | G 84.5-86.9 @144.7 | H 87.2-end @156.3
// RAWS (cut-sheet cues in order): R1 B2 e2 1.0 | R2 BM main 9.5 | R3 BM main 48.6 | R4 BM main 76.0 | R5 B1 e1 22.0 | R6 B1 e1 80.0 | R7 B3 e3 4.4
const RAWS: { a: number; b: number; src: string; from: number; snd: string; g: number; s0: number; s1: number; fx: number; fy: number }[] = [
  { a: 33.9, b: 41.9, src: "e2.mp4", from: 1.0, snd: "e2_clean", g: 2, s0: 1.03, s1: 1.08, fx: 0.3, fy: 0.45 },     // a rescuer climbing the arm
  { a: 61.25, b: 68.25, src: "main.mp4", from: 9.5, snd: "main_clean", g: 10, s0: 1.25, s1: 1.33, fx: 0.25, fy: 0.15 }, // the lit gondola, rope below
  { a: 79.2, b: 87.2, src: "main.mp4", from: 48.6, snd: "main_clean", g: -2, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.25 },   // held at the top, sound from below
  { a: 98.55, b: 104.55, src: "main.mp4", from: 76.0, snd: "main_clean", g: 10, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },  // the arm over the empty street
  { a: 108.9, b: 122.9, src: "e1.mp4", from: 22.0, snd: "e1_clean", g: 3, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },      // the two figures go down
  { a: 131.03, b: 144.53, src: "e1.mp4", from: 80.0, snd: "e1_clean", g: 2, s0: 1.02, s1: 1.07, fx: 0.4, fy: 0.6 },    // into the basket, applause
  { a: 147.1, b: 156.1, src: "e3.mp4", from: 4.4, snd: "e3_clean", g: 7, s0: 1.06, s1: 1.11, fx: 0.45, fy: 0.4 },      // another descent into the basket
];

const SHOTS: Sh[] = [
  // A
  { a: 4.0, b: 8.4, vo: "It's New Year's Eve 2018 at the Christmas funfair in Rennes, in Brittany,", src: "e2.mp4", from: 26.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.3,
    over: <RedLabel text="RENNES, FRANCE" at={F(0.5)} hold={F(3.2)} /> },
  { a: 8.4, b: 10.75, vo: "and the crowd below is waiting for midnight.", src: "dl.mp4", from: 0.3, fill: true, s0: 1.0, s1: 1.05, fy: 0.7,
    over: <RedLabel text="DECEMBER 31, 2018" at={F(0.2)} hold={F(1.8)} /> },
  { a: 10.75, b: 15.8, vo: "About fifty metres above them, eight people are sitting in the gondola of the Bomber Maxxx.", src: "main.mp4", from: 30.0, s0: 1.9, s1: 2.15, fx: 0.24, fy: 0.08,
    over: <RedLabel text="BOMBER MAXXX" at={F(3.0)} hold={F(1.8)} /> },
  { a: 15.8, b: 21.8, vo: "The ride is a fifty-two-metre arm that swings its gondola up and over, and it had stopped right at the top. (Blender model)", src: MAP + "bomberA.mp4", from: 0, s0: 1.0, s1: 1.02 },
  { a: 21.8, b: 26.6, vo: "A mother on the ground told reporters she saw sparks and heard a big metallic noise. (from the ground: the stuck arm above the fair)", src: "dl.mp4", from: 17.0, fill: true, s0: 1.0, s1: 1.06, fy: 0.3 },
  { a: 26.6, b: 30.0, vo: "The fire brigade's longest ladder reached thirty metres,", src: "e1.mp4", from: 70.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.6 },
  { a: 30.0, b: 33.9, vo: "so just before midnight a helicopter winched a rescuer up to rig a rope. (a rescuer on the rope under the gondola)", src: "main.mp4", from: 0.4, s0: 1.02, s1: 1.08, fx: 0.25, fy: 0.3 },
  // B (+11.9)
  { a: 42.1, b: 45.9, vo: "That team is GRIMP, the French fire service's rope specialists,", src: "e2.mp4", from: 13.0, s0: 1.12, s1: 1.2, fx: 0.25, fy: 0.45,
    over: <RedLabel text="GRIMP" at={F(0.5)} hold={F(3.0)} /> },
  { a: 45.9, b: 49.0, vo: "and their plan was simple to say and awful to do.", src: "e2.mp4", from: 21.5, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5 },
  { a: 49.0, b: 54.4, vo: "Take each of the eight out of a seat fifty metres up and lower them on a rope to the top of the ladder.", src: "e1.mp4", from: 4.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 54.4, b: 57.2, vo: "Five of the eight were teenagers.", src: "main.mp4", from: 62.0, s0: 2.0, s1: 2.15, fx: 0.37, fy: 0.08 },
  { a: 57.2, b: 61.25, vo: "The other three were adults who'd gone up for a spin over the town centre on the last night of the year.", src: "e2.mp4", from: 40.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  // C (+18.85)
  { a: 68.25, b: 70.75, vo: "Midnight came and went while they were up there. (the gondola as the year turns: date label)", src: "main.mp4", from: 40.0, s0: 1.0, s1: 1.06, fx: 0.3, fy: 0.3,
    over: <RedLabel text="JANUARY 1, 2019" at={F(0.5)} hold={F(1.8)} /> },
  { a: 70.75, b: 73.95, vo: "Down below, a fight broke out between relatives and fair workers,", src: "dl.mp4", from: 44.0, fill: true, s0: 1.0, s1: 1.06, fy: 0.8 },
  { a: 73.95, b: 79.2, vo: "according to The Local. Tear gas was used, though the reports don't say who used it.", src: "e1.mp4", from: 48.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.6 },
  // D (+26.7)
  { a: 87.2, b: 98.55, vo: "Fifty metres is roughly a sixteen-storey building ... The tip of a ride arm has neither. (LadderGap)",
    node: <LadderGap bg={GR + "main.mp4"} bgFrom={66} tStorey={F(1.75)} tLadder={F(3.65)} tWall={F(7.1)} tWindow={F(8.3)} tArm={F(9.45)} tGap={F(9.85)} /> },
  // E (+32.8)
  { a: 104.55, b: 108.9, vo: "The two small figures on that rope are a rescuer and the second passenger. (RopeZoom: live, runs into R5)",
    node: <RopeZoom src={GR + "e1.mp4"} from={17.65} fig={[895, 885]} rope={[890, 250]} ropeAt={F(106.38 - 104.55)} tag1At={F(106.91 - 104.55)} tag2At={F(107.93 - 104.55)} /> },
  // F (+46.75)
  { a: 122.9, b: 125.85, vo: "Each trip ended on the ladder platform at thirty metres,", src: "e1.mp4", from: 58.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.6 },
  { a: 125.85, b: 128.35, vo: "and from there it was the ladder the rest of the way.", src: "e3.mp4", from: 20.5, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.75 },
  { a: 128.35, b: 131.03, vo: "Then the rope went back up for the next one.", src: "main.mp4", from: 36.0, s0: 1.12, s1: 1.2, fx: 0.3, fy: 0.3 },
  // G (+60.2)
  { a: 144.53, b: 147.1, vo: "Another descent, hours after midnight. (runs on into R7, same take)", src: "e3.mp4", from: 1.83, s0: 1.06, s1: 1.06, fx: 0.45, fy: 0.4 },
  // H (+69.1)
  { a: 156.1, b: 161.9, vo: "The last of the eight touched the ground at six in the morning on New Year's Day, about nine hours after the stop. (DescentLedger)",
    node: <DescentLedger bg={GR + "e1.mp4"} bgFrom={40} start={2} every={8} lastAt={F(2.4)} spanAt={F(4.2)} /> },
  { a: 161.9, b: 163.65, vo: "No injuries were reported.", src: "e1.mp4", from: 66.0, s0: 1.06, s1: 1.1, fx: 0.45, fy: 0.55 },
  { a: 163.65, b: 168.2, vo: "The owner, Alexandre Thinel, said a new part had broken and jammed the ride. (Blender: round the stuck tip)", src: MAP + "bomberB.mp4", from: 0, s0: 1.0, s1: 1.03 },
  { a: 168.2, b: 171.6, vo: "He called it a technical incident that had never happened before.", src: "main.mp4", from: 80.0, s0: 1.5, s1: 1.62, fx: 0.4, fy: 0.12 },
  { a: 171.6, b: 177.4, vo: "He also told reporters there was fortunately no danger to clients, and that the only problem was getting them down.", src: "e2.mp4", from: 48.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.3 },
  { a: 177.4, b: 179.6, vo: "Nine hours of getting them down.", src: "e1.mp4", from: 14.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.3 },
  { a: 179.6, b: 184.4, vo: "One of the riders, Antoine, said it was long, it was cold and it was frightening.", src: "main.mp4", from: 22.0, s0: 1.4, s1: 1.5, fx: 0.25, fy: 0.15 },
  { a: 184.4, b: 189.1, vo: "Another, Nicholas, said next year he was staying at home with his champagne and biscuits.", src: "e2.mp4", from: 32.0, s0: 1.1, s1: 1.04, fx: 0.5, fy: 0.3 },
  { a: 189.1, b: 194.6, vo: "Of all twenty-five, this is the night I'd least want to have spent. The height alone would be enough for me.", src: "dl.mp4", from: 60.0, fill: true, s0: 1.0, s1: 1.06, fy: 0.4 },
  { a: 194.6, b: TOTAL, vo: "Seeing in the new year up there while a fight breaks out underneath you is where I'd lose it.", src: "dl.mp4", from: 80.0, fill: true, s0: 1.0, s1: 1.07, fy: 0.4 },
];
const ALL: Sh[] = [...SHOTS, ...RAWS.map((r) => ({ a: r.a, b: r.b, vo: "RAW", src: r.src, from: r.from, s0: r.s0, s1: r.s1, fx: r.fx, fy: r.fy }))];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(21.8), kind: "blurDip", len: 12 },
  { at: F(42.1), kind: "blurDip", len: 12 },   // e2 -> e2
  { at: F(45.9), kind: "blurDip", len: 12 },
  { at: F(61.25), kind: "blurDip", len: 12 },  // audit: half-dip into the removed R2 window (pairs with 68.25)
  { at: F(68.25), kind: "blurDip", len: 12 },  // main -> main
  { at: F(87.2), kind: "glitch", len: 8 },
  { at: F(98.55), kind: "blurDip", len: 12 },
  { at: F(104.55), kind: "blurDip", len: 12 }, // R4 -> the freeze (cutcheck JUMP)
  { at: F(108.9), kind: "blurDip", len: 12 },  // freeze -> the raw
  { at: F(122.9), kind: "blurDip", len: 12 },  // e1 -> e1
  { at: F(147.1), kind: "blurDip", len: 12 },  // audit: half-dip into the removed R7 window (pairs with 156.1)
  { at: F(156.1), kind: "blurDip", len: 12 },
  { at: F(161.9), kind: "blurDip", len: 12 },
  { at: F(163.65), kind: "whip", len: 10 },
  { at: F(168.2), kind: "blurDip", len: 12 },
  { at: F(179.6), kind: "blurDip", len: 12 },
  { at: F(194.6), kind: "blurDip", len: 12 },
];
export const ALLOW = "3.6-4.4,21.4-22.2,41.7-42.5,45.5-46.3,60.85-61.65,79.8-80.6,91.15-91.95,95.5-96.3,109.5-110.3,133.7-134.5,139.5-140.3,141.25-142.05,145.8-146.6,157.2-158.0,172.2-173.0"; // OUTPUT timeline after the 3 Nov cutOut (-7 s at 61.25, -6 s at 98.55, -9 s at 147.1)

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [15.75, "sfx_n2/whoosh_01.wav", -30],
  [33.95, X + "wind_gust_1.wav", -32],
  [87.15, "sfx_n2/glitch_03.wav", -28],
  [163.6, "sfx_n2/whoosh_02.wav", -30],
];
const VO: [number, number, number][] = [
  [4.0, 0.0, 29.9], [42.1, 30.2, 49.35], [68.45, 49.6, 60.35], [87.4, 60.7, 71.85], [104.75, 71.95, 76.1], [123.1, 76.35, 84.28], [144.7, 84.5, 86.9], [156.3, 87.2, 131.0],
];
const Fade: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="NEW YEAR'S EVE ON THE BOMBER MAXXX" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {ALL.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><Fade n={F(TOTAL) - F(END)} /></Sequence>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(a)} /></Sequence>)}
      {/* raws: the music-stripped clean sound (rawclean.py) of the same window, faded in/out, never under the VO */}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(r.a)} durationInFrames={F(r.b) - F(r.a)} layout="none">
          <Audio src={staticFile(M + r.snd + ".wav")} startFrom={F(r.from)} volume={(f) => dB(r.g) * interpolate(f, [0, 8, F(r.b - r.a) - 14, F(r.b - r.a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, dipped under the raws, second pass from 20 s for the last part */}
      <Sequence from={F(4.0)} durationInFrames={F(119.0) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(4)} volume={(f) => {
          const t = f / 30 + 4.0; let duck = 1;
          for (const r of RAWS) duck = Math.min(duck, interpolate(t, [r.a - 0.2, r.a + 0.8, r.b - 0.8, r.b + 0.2], [1, 0.4, 0.4, 1], cl));
          return dB(-21.5) * duck * interpolate(f, [0, 30, F(112.5), F(115.0)], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      <Sequence from={F(112.0)} durationInFrames={F(TOTAL) - F(112.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(10)} volume={(f) => {
          const t = f / 30 + 112.0; let duck = 1;
          for (const r of RAWS) duck = Math.min(duck, interpolate(t, [r.a - 0.2, r.a + 0.8, r.b - 0.8, r.b + 0.2], [1, 0.4, 0.4, 1], cl));
          return dB(-21.5) * duck * interpolate(f, [0, F(3), F(TOTAL - 112.0 - 2.5), F(TOTAL - 112.0)], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): R2 (main 9.5, lit gondola: near-dup of R3, sat on the rider background), R4 (main 76, after the LadderGap explanation: near-dup) and R7 (e3 4.4, another descent: near-dup of R6, only a 2.6 s line before it) removed. 7 -> 4 raws. FreezeBracket replaced by RopeZoom.
const _cut = cutOut(CompFull, DUR, [[61.25, 68.25], [98.55, 104.55], [147.1, 156.1]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
