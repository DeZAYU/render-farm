// Tornado #2 — Joplin, St. John's emergency waiting room (22 May 2011). Same channel grammar as TorC01v5 (brand.tsx), new devices for
// this case's beats: TimeRuler (warning -> touchdown), ScarTrace (NASA ASTER scar across Joplin), ThenNow (NOAA 2011 vs NAIP today on the
// hospital site). Footage: Mercy's own ER CCTV (320x240 / 6 fps, silent -> real SFX for the impact), Mercy's aftermath film (exterior,
// glass, the emergency entrance), a Joplin diner during the storm (munndo). VO = one take, "Two." cut, split once for the impact.
// Source cuts: er 99.6-100.43 / 106.1-106.93 / 113.27 / 120.1-120.43 (light drops + glitches) — the impact window plays them on purpose
// (the lights going IS the moment); every other window avoids them. mercy: cut list in grade notes; windows chosen between cuts.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, ScarTrace, ThenNow, TimeRuler, TitleCard } from "../brand";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(84.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO-A: take 0.8-24.2 at 4.0 (+3.2); VO-B: take 24.2-end at 48.0 (+23.8)
const SHOTS: Sh[] = [
  { a: 4.0, b: 8.6, vo: "Sunday the 22nd of May 2011, about twenty to six in the evening, (the waiting room, empty; date label)", src: "er.mp4", from: 36.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MAY 22, 2011" at={F(0.4)} hold={F(3.4)} /> },
  { a: 8.6, b: 14.4, vo: "and the emergency department waiting room at St. John's Regional Medical Center in Joplin, Missouri, is empty.", src: "er.mp4", from: 62.0, s0: 1.18, s1: 1.26, fx: 0.4, fy: 0.45,
    over: <RedLabel text="ST. JOHN'S, JOPLIN, MISSOURI" at={F(1.0)} hold={F(4.0)} /> },
  { a: 14.4, b: 20.0, vo: "Joplin's first tornado warning went out at 5:17, seventeen minutes before touchdown, (time ruler)",
    node: <TimeRuler bg={GR + "er.mp4"} bgFrom={70} t0={10} t1={45} events={[{ t: 17, label: "WARNING", at: F(0.6) }, { t: 34, label: "TOUCHDOWN", at: F(3.4) }]} span={{ a: 17, b: 34, label: "17 MIN", at: F(4.4) }} /> },
  { a: 20.0, b: 23.7, vo: "and Joplin's sirens sounded about twenty minutes before it struck. (a Joplin diner as the storm comes)", src: "diner.mp4", from: 42.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 23.7, b: 25.7, vo: "Plenty of people didn't act on them. (people at the door, watching it come)", src: "diner.mp4", from: 126.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 25.7, b: 27.6, vo: "Keep an eye on the ceiling lights. (back in the waiting room, slow push)", src: "er.mp4", from: 94.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.3 },
  // IMPACT (27.6-47.6): the waiting room as the tornado hits — CCTV, silent, real SFX under it
  { a: 27.6, b: 47.6, vo: "IMPACT: the lights drop, the room is thrown, haze (CCTV 1:36-1:56)", src: "er.mp4", from: 96.0, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  // VO-B (48.0): "EF5, with winds estimated between 225 and 250 miles an hour," — the chairs again, slow
  { a: 47.6, b: 51.8, vo: "EF5, with winds estimated between two hundred and twenty-five (slow replay of the chairs thrown)", src: "er_replay.mp4", from: 0.0, s0: 1.08, s1: 1.18, fx: 0.5, fy: 0.5 },
  { a: 51.8, b: 54.1, vo: "and two hundred and fifty miles an hour, (the haze after)", src: "er.mp4", from: 116.6, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 54.1, b: 58.3, vo: "and a direct hit on the hospital. Six people were lost at St. John's, (NOAA aerial two days later: the hospital in the swath)",
    node: <Aerial src={GR + "stj2011.jpg"} iw={2816} ih={1792} spot={[1011, 1203, 1280, 1472]} z0={1.0} z1={1.28} label="ST. JOHN'S REGIONAL MEDICAL CENTER" boxAt={6} labelAt={12} /> },
  { a: 58.3, b: 61.1, vo: "five of them patients who needed machines to breathe. (the wrecked patient beds, Mercy's film)", src: "mercy.mp4", from: 78.2, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 61.1, b: 66.2, vo: "Across Joplin the toll was a hundred and fifty-eight, with about eleven hundred and fifty hurt. (NASA ASTER: the scar across the city, traced)",
    node: <ScarTrace src={GR + "aster.jpg"} iw={1606} ih={1606} path={[[312, 901], [464, 892], [607, 878], [749, 856], [892, 838], [999, 824]]} at={F(0.3)} len={F(2.6)} z0={1.45} z1={1.65} /> },
  { a: 66.2, b: 69.3, vo: "This was the building the rest of the city would have been sent to. (St. John's that night)", src: "mercy.mp4", from: 55.8, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 69.3, b: 72.4, vo: "It lost nearly every window on three sides, (the façade, glass gone)", src: "mercy.mp4", from: 232.1, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 72.4, b: 75.5, vo: "along with interior walls, ceilings and part of its roof. (inside: the ceilings down)", src: "mercy.mp4", from: 113.6, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 75.5, b: 79.4, vo: "It was so badly damaged it had to be torn down, (then / now on the same ground)",
    node: <ThenNow then={GR + "stj2011.jpg"} now={GR + "stjtoday.jpg"} iw={2816} ih={1792} focus={[1145, 1337]} at={F(1.6)} len={30} thenLabel="2011" nowLabel="TODAY" /> },
  { a: 79.4, b: 84.6, vo: "and the hospital was rebuilt and reopened in 2015 as Mercy Hospital Joplin. (the new hospital from above)",
    node: <Aerial src={GR + "mercytoday.jpg"} iw={2400} ih={1700} spot={[1013, 640, 1413, 987]} z0={1.0} z1={1.2} label="MERCY HOSPITAL JOPLIN" boxAt={F(0.6)} labelAt={F(1.0)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.6), kind: "blurDip", len: 12 },
  { at: F(14.4), kind: "blurDip", len: 12 },
  { at: F(20.0), kind: "blurDip", len: 12 },
  { at: F(47.6), kind: "blurDip", len: 12 },
  { at: F(54.1), kind: "glitch", len: 8 },
  { at: F(61.1), kind: "blurDip", len: 12 },
  { at: F(75.5), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// the CCTV has no sound: the impact is built from real recordings, timed to what the picture does (lights 99.6-100.4, room thrown 108-110)
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [14.45, "sfx_n2/whoosh_02.wav", -30],
  [27.6, X + "wind_gust_1.wav", -20],       // the storm outside rising
  [29.0, X + "rain_22.wav", -26],
  [31.4, X + "sub_drop_1.wav", -16],        // the lights go (CCTV 99.6)
  [32.0, X + "static_1.wav", -26],
  [35.0, X + "wind_gust_1.wav", -14],
  [39.6, X + "impact_2.wav", -12],          // the room is hit (CCTV 108)
  [39.8, X + "metal_clank_2.wav", -16],
  [40.3, X + "impact_3.wav", -14],
  [41.0, X + "metal_clank_4.wav", -18],
  [42.0, X + "boom_4.wav", -16],
  [43.5, X + "wind_gust_1.wav", -18],
  [54.1, "sfx_n2/glitch_03.wav", -28],
  [61.15, "sfx_n2/whoosh_01.wav", -30],
  [75.55, "sfx_n2/whoosh_02.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE EMERGENCY ROOM WAITING AREA" bg={GR + "er_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take ("Two." removed), split once for the impact; nothing plays under it but music */}
      <Sequence from={F(4.0)} durationInFrames={F(24.2) - F(0.8)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(0.8)} /></Sequence>
      <Sequence from={F(48.0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(24.2)} /></Sequence>
      {/* music: Epidemic ambient (Who's at the Window?, Lennon Hutton — a different bed from case 1), out for the impact, back after */}
      <Sequence from={F(4.0)} durationInFrames={F(28.0) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} volume={(f) => dB(-19) * interpolate(f, [0, 30, F(22.0), F(24.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(49.0)} durationInFrames={F(84.6) - F(49.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(30)} volume={(f) => dB(-21) * interpolate(f, [0, F(2.5), F(33.6), F(35.6)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
