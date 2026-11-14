// Theme Park #05 — Freizeitland Geiselwind, 3 Sept 2019: the Top of the World tower's platform stops at ~60 m with 21 aboard; three
// helicopters lift them off one by one. Footage: one filmer's own video (IjumeHUPx0c, Berthold Diem): the tower from below, the
// helicopters, rescuers on lines, the field. Its sound is the real rotor noise — used only in the raws. The corner date (0-5 s) and the
// end credit (146 s+) are never in a window.
// Devices (new, case-specific): LevelLines (whole-frame levels on the real footage: 95 m at the tower top, then a red level on the stuck platform with the 60 m below washed dark),
// HeliTriptych (three helicopter moments in three white-framed panels on "three helicopters"), RescueBar (4:30 -> 8:30 PM: most down by
// 7, the last at 8:15; 21 blocks, 11 turn red for the children), Bavarian DOP20 orthophoto (Boomerang coaster boxed; the park road
// traced toward the A3).
// Source cuts: 5.12 10.0 29.6 34.0 46.8 51.8 56.8 66.2 94.84 110.24 115.52 122.6 132.28 142.6 — every window sits between them.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, ScarTrace, TitleCard } from "../brand";
import { LevelLines } from "../dev/TP05_LevelLines";
import { HeliTriptych } from "../dev/TP05_HeliTriptych";
import { RescueBar } from "../dev/TP05_RescueBar";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TOTAL = 129.4, END = 128.3;
const DUR = F(TOTAL);

type Sh = { a: number; b: number; vo: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const G = "gw.mp4";
// tower measured on the frames: 66.6 s (ball top y .05) and 85.0 s (platform y .62)

// VO parts: A 0-30.85 @4.0 | B 30.95-42.75 @49.0 | C1 42.9-52.2 @71.0 | C2 52.35-54.75 @85.5 | D 54.95-end @97.6
// RAWS at the cut sheet's 4 cues: R1 34.85-48.85 (70.0) | R2 60.8-70.8 (95.6) | R3 80.3-85.3 (89.6) | R4 87.9-97.4 (133.0)
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.3, vo: "Ninety-five metres. That's the height of the Top of the World, (white level locks on the tower top)",
    node: <LevelLines src={GR + G} from={66.6} top={{ y: 0.05, at: 4, label: "95 M" }} fx={0.5} fy={0.4} />,
    over: <RedLabel text="TOP OF THE WORLD" at={F(1.5)} hold={F(1.6)} /> },
  { a: 7.3, b: 10.85, vo: "a tower at Freizeitland Geiselwind in northern Bavaria.", from: 11.0, s0: 1.04, s1: 1.1, fx: 0.6, fy: 0.4,
    over: <RedLabel text="GEISELWIND, GERMANY" at={F(0.4)} hold={F(2.8)} /> },
  { a: 10.85, b: 14.75, vo: "A ring-shaped viewing platform turns slowly as it rides up and down.", from: 34.6, s0: 1.03, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 14.75, b: 17.6, vo: "It's about as calm as a theme park ride gets.", from: 16.0, s0: 1.06, s1: 1.11, fx: 0.6, fy: 0.45 },
  { a: 17.6, b: 22.2, vo: "At around half past four on Tuesday the 3rd of September 2019,", from: 57.5, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <RedLabel text="SEPTEMBER 3, 2019" at={F(1.0)} hold={F(3.0)} /> },
  { a: 22.2, b: 26.3, vo: "it stopped at roughly sixty metres with twenty-one people on it. (red level on the platform, the drop below)",
    node: <LevelLines src={GR + G} from={85.0} stop={{ y: 0.62, at: 26, label: "60 M" }} s0={1.0} s1={1.05} fx={0.5} fy={0.5} /> },
  { a: 26.3, b: 29.8, vo: "The park said it had gone into a fault mode and couldn't be lowered.", from: 19.5, s0: 1.08, s1: 1.14, fx: 0.55, fy: 0.4 },
  { a: 29.8, b: 34.85, vo: "Three helicopters were called, from the police, the German army and Deutsche Luftrettung. (triptych)",
    node: <HeliTriptych src={GR + G} bgFrom={22.0} panels={[{ from: 5.4, at: 8, pos: "35% 30%" }, { from: 120.3, at: 48, pos: "50% 40%" }, { from: 143.1, at: 88, pos: "50% 45%" }]} /> },
  { a: 34.85, b: 48.85, vo: "RAW R1: the helicopter over the tower lifts a rescuer + rider off the platform", from: 70.0, s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.4 },
  { a: 48.85, b: 51.9, vo: "When the ladder can't reach and the ride won't come down, (fire engine on the field)", from: 52.3, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 51.9, b: 53.75, vo: "you're running out of ideas.", from: 30.3, s0: 1.1, s1: 1.16, fx: 0.5, fy: 0.5 },
  { a: 53.75, b: 56.85, vo: "Height-rescue teams climbed up to secure the platform,", from: 40.0, s0: 1.08, s1: 1.16, fx: 0.7, fy: 0.5 },
  { a: 56.85, b: 60.8, vo: "and the visitors were taken off on a rope, one by one, to a helicopter.", from: 116.25, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 60.8, b: 70.8, vo: "RAW R2: under the platform, a rescuer and a visitor on the line", from: 95.6, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 70.8, b: 75.25, vo: "According to inFranken, one child refused to go on the helicopter line,", from: 23.5, s0: 1.05, s1: 1.12, fx: 0.4, fy: 0.5 },
  { a: 75.25, b: 78.15, vo: "so a rescuer lowered the child on a rope instead.", from: 123.3, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.5 },
  { a: 78.15, b: 80.3, vo: "Fair enough. I'd have refused too. (the crews waiting at the ambulance)", from: 113.2, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 85.3, b: 87.9, vo: "It carried on like that for more than two hours. (rescuers waiting on the field)", from: 47.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 80.3, b: 85.3, vo: "RAW R3: the helicopter over the tower, a rider on the line", from: 89.6, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  { a: 87.9, b: 97.35, vo: "RAW R4: the helicopter holds over the tower, a rider on the line", from: 133.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.3 },
  { a: 97.35, b: 104.25, vo: "Most were down by seven, and the last at around a quarter past eight. Police said eleven of the twenty-one were children. (RescueBar)",
    node: <RescueBar bg={GR + G} bgFrom={63.0} tMost={F(0.4)} tLast={F(2.9)} tCount={F(4.0)} tKids={F(5.5)} /> },
  { a: 104.25, b: 108.75, vo: "A technical defect was blamed, a safety mechanism stopping the gondola,", from: 127.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 108.75, b: 110.85, vo: "and TÜV inspectors were called in.", from: 111.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 110.85, b: 118.65, vo: "Only weeks earlier, the Würzburg fire brigade had practised ... on the loop of the park's Boomerang coaster. (orthophoto, Boomerang boxed)",
    node: <Aerial src={GR + "park.jpg"} iw={3600} ih={2025} spot={[1810, 545, 2160, 680]} z0={1.0} z1={1.45} label="BOOMERANG" boxAt={F(4.6)} labelAt={F(5.2)} /> },
  { a: 118.65, b: 123.25, vo: "The next day the park was so packed that cars queued almost back to the autobahn. (the park road traced toward the A3)",
    node: <ScarTrace src={GR + "region.jpg"} iw={3200} ih={1800} path={[[1480, 1070], [1280, 930], [1200, 840], [1110, 770], [1000, 650], [890, 545]]} at={F(0.6)} len={F(2.6)} z0={1.35} z1={1.5} label="A3 AUTOBAHN" labelAt={F(2.9)} /> },
  { a: 123.25, b: 124.9, vo: "The safety system worked.", from: 62.6, s0: 1.08, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 124.9, b: TOTAL, vo: "It just stopped the ride with everyone sixty metres up. (under the platform, people still on it)", from: 106.0, s0: 1.12, s1: 1.0, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.3), kind: "blurDip", len: 12 },
  { at: F(22.2), kind: "blurDip", len: 12 },
  { at: F(26.3), kind: "blurDip", len: 12 },
  { at: F(53.75), kind: "blurDip", len: 12 },
  { at: F(97.35), kind: "glitch", len: 8 },
  { at: F(110.85), kind: "zoomHit", len: 10 },
  { at: F(118.65), kind: "blurDip", len: 12 },
  { at: F(124.9), kind: "blurDip", len: 14 },
  { at: F(85.3), kind: "blurDip", len: 12 },
  { at: F(87.9), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + G} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [29.85, "sfx_n2/whoosh_02.wav", -31],
  [31.5, "sfx_n2/whoosh_01.wav", -33],
  [32.8, "sfx_n2/whoosh_03.wav", -33],
  [97.3, "sfx_n2/glitch_03.wav", -28],
  [110.8, "sfx_n2/whoosh_01.wav", -30],
];
const VO: [number, number, number][] = [[4.0, 0.0, 30.85], [49.0, 30.95, 42.75], [71.0, 42.9, 52.2], [85.5, 52.35, 54.75], [97.6, 54.95, 85.6]];
const RAWS: [number, number, number][] = [[34.85, 48.85, 70.0], [60.8, 70.8, 95.6], [80.3, 85.3, 89.6], [87.9, 97.35, 133.0]]; // [a, b, source s] — sound from gw_clean.wav (rawclean.py)

const Fade: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="LIFTED OFF THE TOWER" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(END)} layout="none"><Fade n={F(TOTAL) - F(END)} /></Sequence>
      {VO.map(([t, a, b], i) => <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} startFrom={F(a)} /></Sequence>)}
      {/* raws: the filmer's own rotor sound, in fast, out before the VO returns */}
      {RAWS.map(([a, b, from], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(M + "gw_clean.wav")} startFrom={F(from)} volume={(f) => dB(-13) * interpolate(f, [0, 6, F(b - a) - 16, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, out under the loud rotor raws, back after each */}
      <Sequence from={F(4.0)} durationInFrames={F(TOTAL) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(0)} volume={(f) => {
          const t = f / 30 + 4.0; let k = interpolate(t, [4.0, 5.0, END, TOTAL], [0, 1, 1, 0], cl);
          for (const [a, b] of RAWS) k = Math.min(k, interpolate(t, [a - 0.6, a + 0.2, b - 0.3, b + 1.2], [1, 0.08, 0.08, 1], cl));
          return dB(-15) * k;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): removed RAW 3 (5 s) and RAW 4: near-duplicates of RAW 1 (helicopter over the tower, rider on the line). 4 -> 2 raws (14 s main, 10 s).
const _cut = cutOut(CompFull, DUR, [[80.3, 85.3], [87.9, 97.35]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
