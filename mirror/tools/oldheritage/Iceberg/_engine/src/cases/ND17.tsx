// Natural Disasters #17 — the Erft tears through Bad Muenstereifel (14 July 2021). Footage: [BAD] Josef Muetter's own film (the
// bookshop owner, Buchhandlung am Markt; small yellow time stamps kept, cut sheet ok; the title / "Der Tag danach" / "Unser Laden" cards
// are avoided), [PH] an unidentified neighbour's phone (river roar only). Devices built for this case (dev/ND17_*): WallRiver (NRW DOP,
// OSM city wall + the Erft through the walled town), RidgeLines (33 real terrain sections of the Erft valley, rain running to one floor),
// FrameTrace (the bookshop's own half-timbered house, June 2021 Commons photo: timber frame lit, infill tinted), ReliefMap (DEM relief:
// Ahrweiler district over the state border; the Rhine vs the Ahr and Erft). Brand Inset for the June photo (the Erft three weeks before).
// VO = one continuous take, split only at the ten raw cues (cut-sheet order and positions). BAD source cuts: 10 25.3 43.1 59.3 86.35 108.2 121.8 136.5 147.85 161.85 171.5
// 182.4 191.3 211.35 229.07 248.6 267.6 281.0 316.0 322.7 360.4 371.7 421.65 469.58 492.18 519.7 528-529.8 544.65 567.25 579.9 600 609 ...
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { WallRiver } from "../dev/ND17_WallRiver";
import { RidgeLines } from "../dev/ND17_RidgeLines";
import { FrameTrace } from "../dev/ND17_FrameTrace";
import { ReliefMap } from "../dev/ND17_ReliefMap";
import { layout, type TRaw, type TShot } from "../dev/ND16_Timeline";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
type Sh = { vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; cut?: FxCut["kind"] };
type Rw = { audio: string; src: string; from: number; gain: number; cut?: FxCut["kind"]; note: string };

// RAWS at the cut sheet's 10 RAW cue positions and order (after = take second of the last word before the cue); dead air trimmed;
// audio = rawclean.py output (no music found in any window)
const RAWS: TRaw<Rw>[] = [
  // 3 Nov owner rule (raws only at the incident): the Erft coming through, the van carried off (climax), the wrecked shop after. The
  // seven raws after the rain / timber-frame / Ahr / planning / warning / daylight / networks explanation are cut; that VO runs on.
  { after: 30.19, len: 9.0, audio: "c1_clean.wav", src: "bad.mp4", from: 26.0, gain: -3, note: "cue 1 BAD 0:25-0:55 the Erft as a brown torrent between the houses" },
  { after: 70.03, len: 21.3, audio: "r3_clean.wav", src: "bad.mp4", from: 470.3, gain: -2, note: "cue 6 CLIMAX: the white van carried off (7:50-8:11, uncut)" },
  { after: 118.45, len: 8.0, audio: "c10_clean.wav", src: "bad.mp4", from: 647.0, gain: -3, cut: "blurDip", note: "cue 10 BAD 10:47 the wrecked shop (16 July)" },
];

const TSHOTS: TShot<Sh>[] = [
  // ---- A (+4.0)
  { t0: 0.0, t1: 2.55, vo: "This flood was forecast days in advance, (18:22, the river still below the garden wall)", src: "bad.mp4", from: 11.0, s0: 1.03, s1: 1.08 },
  { t0: 2.55, t1: 4.78, vo: "in one of the wealthiest countries in Europe, (half-timbered fronts)", src: "bad.mp4", from: 61.0, s0: 1.04, s1: 1.09, fy: 0.4 },
  { t0: 4.78, t1: 7.17, vo: "and it still came through the streets like this.", src: "bad.mp4", from: 300.0, s0: 1.03, s1: 1.09 },
  { t0: 7.17, t1: 16.58, cut: "blurDip", vo: "Bad Muenstereifel ... with a medieval wall around it. Half-timbered houses along both banks of its river, the Erft. (wall + river)",
    node: <WallRiver src={GR + "dop.jpg"} wallAt={100} erftAt={222} /> },
  { t0: 16.58, t1: 20.08, cut: "whip", vo: "Most of the year the Erft is small enough that you'd hardly notice it. (the same bridge, June 2021)",
    node: <Inset src={GR + "erft_markt_2021.jpg"} still box={0.6} ar={1.5} pos="50% 70%" label="JUNE 26, 2021" labelAt={10} drift={0.08} /> },
  { t0: 20.08, t1: 24.71, cut: "blurDip", vo: "On Wednesday the 14th of July 2021, after days of extreme rain, (the Erft in its channel, 19:02)", src: "bad.mp4", from: 44.0, s0: 1.03, s1: 1.09,
    over: <RedLabel text="JULY 14, 2021" at={8} hold={F(3.6)} /> },
  { t0: 24.71, t1: 27.28, vo: "the town's bookshop owner was out on the street.", src: "bad.mp4", from: 88.0, s0: 1.03, s1: 1.08 },
  { t0: 27.28, t1: 30.5, vo: "It was daylight, and he watched the river come through.", src: "bad.mp4", from: 110.0, s0: 1.02, s1: 1.07 },
  // ---- B (+14.71)
  { t0: 30.19, t1: 32.59, vo: "In parts of the region more than a month's rain fell in a day,", src: "bad.mp4", from: 138.0, s0: 1.03, s1: 1.08 },
  { t0: 32.59, t1: 35.32, vo: "on ground that was already soaked.", src: "bad.mp4", from: 255.0, s0: 1.04, s1: 1.09 },
  { t0: 35.32, t1: 42.12, cut: "glitch", vo: "In a narrow valley, rain on steep hillsides reaches the river all at once. When a town is built right up against the water,",
    node: <FilmLook_FX grain={0.06}><RidgeLines rainAt={30} floorAt={112} townAt={132} /></FilmLook_FX> },
  { t0: 42.12, t1: 45.02, vo: "the only place left for the river to go is the street.", src: "bad.mp4", from: 172.5, s0: 1.03, s1: 1.08 },
  { t0: 45.02, t1: 49.47, cut: "zoomHit", vo: "Half-timbered houses are a wooden frame filled in with clay, brick or plaster. (the bookshop's house)",
    node: <FrameTrace photo={GR + "erft_markt_2021.jpg"} timber={GR + "timber.png"} infill={GR + "infill.png"} frameAt={36} infillAt={72} /> },
  { t0: 49.47, t1: 51.3, vo: "They've stood here for centuries.", src: "bad.mp4", from: 74.0, s0: 1.03, s1: 1.07, fy: 0.4 },
  { t0: 51.3, t1: 54.49, vo: "Their ground floors were never meant to sit in moving water.", src: "bad.mp4", from: 164.0, s0: 1.04, s1: 1.1 },
  // ---- C (+25.38)
  { t0: 54.22, t1: 59.82, cut: "glitch", vo: "Just over the state border, in the Ahrweiler district, about 135 people died.",
    node: <ReliefMap src={GR + "relief.jpg"} phase="border" drawAt={10} fillAt={58} /> },
  { t0: 59.82, t1: 63.22, vo: "Germany's flood planning had mostly been built around its big rivers,", src: "bad.mp4", from: 232.0, s0: 1.03, s1: 1.08 },
  { t0: 63.22, t1: 68.48, cut: "blurDip", vo: "the Rhine and the Elbe. That summer it was small rivers in narrow valleys that took lives.",
    node: <ReliefMap src={GR + "relief.jpg"} phase="rivers" drawAt={4} smallAt={72} /> },
  { t0: 68.48, t1: 70.32, vo: "Then the cars start to move.", src: "bad.mp4", from: 425.0, s0: 1.03, s1: 1.07 },
  // ---- D (+47.37)
  { t0: 70.03, t1: 73.78, cut: "blurDip", vo: "The part of this flood that's hardest to accept has nothing to do with water. (0.5x replay of the van)", src: "replay.mp4", from: 12.0, s0: 1.14, s1: 1.24, fx: 0.5, fy: 0.55 },
  { t0: 73.78, t1: 78.0, vo: "Europe's flood warning system had been sending alerts to authorities days ahead.", src: "bad.mp4", from: 350.0, s0: 1.03, s1: 1.08 },
  { t0: 78.0, t1: 83.47, vo: "between the people reading the models and the people standing in these streets, the message got lost.", src: "bad.mp4", from: 225.0, s0: 1.03, s1: 1.09 },
  { t0: 83.47, t1: 88.98, vo: "Germany has since started sending flood alerts straight to phones, the way Spain's ES-Alert works.", src: "bad.mp4", from: 375.0, s0: 1.03, s1: 1.08 },
  { t0: 88.98, t1: 92.9, cut: "blurDip", vo: "As Aldaia showed us, that only helps if someone presses the button in time.", src: "bad.mp4", from: 398.0, s0: 1.12, s1: 1.18, fx: 0.4 },
  { t0: 92.9, t1: 98.07, vo: "The worst of this flood happened at night, in other towns, in the Ahr valley especially.", src: "bad.mp4", from: 290.0, s0: 1.03, s1: 1.08 },
  { t0: 98.07, t1: 102.29, vo: "Here, at least, it came in daylight, and people could see what the water was doing. (a bin carried down the street)", src: "bad.mp4", from: 196.0, s0: 1.03, s1: 1.08 },
  { t0: 102.29, t1: 106.43, vo: "Mobile networks went down in parts of both states.", src: "bad.mp4", from: 440.0, s0: 1.03, s1: 1.08 },
  { t0: 106.43, t1: 110.93, vo: "That's part of why around 1,300 people were still listed as missing two days later.", src: "bad.mp4", from: 312.0, s0: 1.03, s1: 1.08 },
  // ---- E (+56.07)
  { t0: 110.63, t1: 114.46, cut: "glitch", vo: "When the water finally dropped, the bookshop owner went back inside. (15 July, 08:44)", src: "bad.mp4", from: 556.0, s0: 1.03, s1: 1.08 },
  { t0: 114.46, t1: 118.45, vo: "Paper soaks up water and mud, and almost none of it can be saved. (the shop)", src: "bad.mp4", from: 677.0, s0: 1.03, s1: 1.09 },
  { t0: 118.45, t1: 122.38, vo: "Across Germany the floods took at least 184 lives,", src: "bad.mp4", from: 583.0, s0: 1.03, s1: 1.08 },
  { t0: 122.38, t1: 128.66, vo: "47 of them in North Rhine-Westphalia and 27 in the Euskirchen district this town belongs to.", src: "bad.mp4", from: 610.0, s0: 1.03, s1: 1.09 },
  { t0: 128.66, t1: 131.59, vo: "Across Europe it was at least 243.", src: "bad.mp4", from: 570.0, s0: 1.03, s1: 1.08 },
  { t0: 131.59, t1: 137.02, vo: "Six days later, Chancellor Angela Merkel came to Bad Muenstereifel to see it for herself,", src: "bad.mp4", from: 592.0, s0: 1.03, s1: 1.09,
    over: <RedLabel text="JULY 20, 2021" at={8} hold={F(4.2)} /> },
  { t0: 137.02, t1: 142.93, vo: "and Germany set aside around thirty billion euros for rebuilding. (the books in the mud)", src: "bad.mp4", from: 764.0, s0: 1.02, s1: 1.1 },
];

const L = layout(4.0, 141.0, TSHOTS, RAWS);
export const DUR = F(L.end + 2.0);
type Any = { a: number; b: number; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; cut?: FxCut["kind"] };
const ALL: Any[] = [...L.shots, ...L.raws.map((r) => ({ a: r.a, b: r.b, src: r.src, from: r.from, s0: 1.0, s1: 1.05, cut: r.cut }))].sort((p, q) => p.a - q.a);
const CUTS: FxCut[] = [{ at: F(4.0), kind: "glitch", len: 10 }, ...ALL.filter((s) => s.cut && s.a > 4.1).map((s) => ({ at: F(s.a), kind: s.cut!, len: s.cut === "blurDip" ? 12 : 10 }))];
const at = (t0: number) => L.shots.find((s) => Math.abs(s.t0 - t0) < 1e-3)!.a;

const ShotView: React.FC<{ s: Any }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [at(7.17) + 0.03, X + "rain_5.wav", -34],
  [at(16.58) - 0.03, "sfx_n2/whoosh_01.wav", -28],
  [at(35.32) - 0.03, "sfx_n2/glitch_03.wav", -28],
  [at(35.32) + 1.17, X + "rain_9.wav", -28],          // rain on the sections
  [at(45.02) - 0.03, "sfx_n2/whoosh_02.wav", -30],
  [at(54.22) - 0.05, "sfx_n2/glitch_02.wav", -28],
  [at(63.22) + 0.0, "sfx_n2/whoosh_01.wav", -32],
  [at(110.63) - 0.05, "sfx_n2/glitch_03.wav", -28],
];

// music: Epidemic ambient Music 1 (-18 LUFS file -> -14 dB), one stretch per VO part, out under every raw
const BED: [number, number, number][] = (() => { let off = 0; return L.parts.map((p, i) => { const a = p.at - 0.2, b = i < L.raws.length ? L.raws[i].a + 0.3 : L.end + 2.0; const o = off % Math.max(1, 126 - (b - a)); off += b - a; return [a, b, o] as [number, number, number]; }); })();

const FadeOut: React.FC<{ n: number }> = ({ n }) => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />; };

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE ERFT IN THE OLD TOWN" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {ALL.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(L.end + 0.4)} layout="none"><FadeOut n={F(1.5)} /></Sequence>
      {L.parts.map((p, i) => (
        <Sequence key={"v" + i} from={F(p.at)} durationInFrames={F(p.t1) - F(p.t0)} layout="none"><Audio src={staticFile("vor/CASE17.mp3")} startFrom={F(p.t0)} /></Sequence>
      ))}
      {L.raws.map((r, i) => {
        const n = F(r.b) - F(r.a);
        return <Sequence key={"r" + i} from={F(r.a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + r.audio)} volume={(f) => dB(r.gain) * interpolate(f, [0, 6, n - 14, n - 2], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {BED.map(([a, b, off], i) => {
        const n = F(b) - F(a);
        return <Sequence key={"m" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => dB(-14) * interpolate(f, [0, 30, n - 24, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

export const _CUTS = CUTS;
