// Natural Disasters #3 — Mount Ontake, 27 September 2014. The case's own footage is one hiker's vertical phone video on the Ōtaki trail
// (7Ea3uED1Zgc), which the cut sheet plays almost entirely as three raws. Under the VO: two more hikers' recordings of the same eruption,
// from small personal channels (nT5zIc3LYSk: the plume from Marishiten peak; cOyCqyExwYw: sheltering in the summit lodge, then the summit
// under ash) and the plume seen from Yatsugatake (Zw6KffzwHwc, 0:30-0:50 only: a burned-in caption sits at 0:20-0:28).
// Devices (dev/ND03_*): PhoneFrame (the vertical raws in a clean frame over their blurred copy), LevelOne (JMA's 2014 alert levels, level 1
// "平常 / normal" locked in red). Grammar: TitleCard, RedLabel, Aerial (GSI photo of the summit, the Jigokudani vents boxed).
// Source cuts: ont 26.5, 70.1 (a fast swing inside raw 3, allowed), 87.7; lodge 4.04, 82.4, 138.9.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { PhoneFrame } from "../dev/ND03_PhoneFrame";
import { LevelOne } from "../dev/ND03_LevelOne";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, PRE = 0.25, POST = 0.45;

const BLOCKS: [number, number][] = [[0.0, 18.0], [18.0, 35.75], [35.75, 40.75], [40.75, 68.41]];
const RAWS = [
  { from: 3.0, len: 23.3, mus: 0, label: "ŌTAKI TRAIL, MOUNT ONTAKE", what: "the grey plume bursting over the ridge, hikers on the rocks" },
  { from: 30.0, len: 27.0, mus: 0, label: "", what: "the cloud rolling down toward the trail, the light going (0:55)" },
  { from: 58.0, len: 28.5, mus: 0, label: "", what: "the cloud engulfing the filmer, near black" },
];
const bt: number[] = [], rt: number[] = [];
{ let t = TITLE; BLOCKS.forEach(([a, b], i) => { bt.push(t); t += b - a; if (RAWS[i]) { t += PRE; rt.push(t); t += RAWS[i].len + POST; } }); }
const END = bt[3] + (BLOCKS[3][1] - BLOCKS[3][0]) + 1.6;
export const DUR = F(END);
const bi = (x: number) => { const i = BLOCKS.findIndex(([a, b]) => x >= a - 1e-6 && x < b - 1e-6); return i < 0 ? BLOCKS.length - 1 : i; };
const T = (x: number) => bt[bi(x)] + (x - BLOCKS[bi(x)][0]);

type Sh = { t: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: (n: number) => React.ReactNode; over?: React.ReactNode };
const M = "mari.mp4", Y = "yatsu.mp4", LD = "lodge.mp4", O = "ont.mp4";

const SHOTS: Sh[] = [
  // B1
  { t: 0.0, vo: "At 11:52 in the morning, (the plume from Marishiten peak)", src: M, from: 0.5, s0: 1.03, s1: 1.08, over: <RedLabel text="SEPT 27, 2014 · 11:52 AM" at={F(0.3)} hold={F(2.0)} /> },
  { t: 2.65, vo: "the mountain blew, just above the hut at the ninth station of the Ōtaki trail", src: M, from: 9.0, s0: 1.04, s1: 1.1 },
  { t: 6.3, vo: "on Mount Ontake, Japan's second highest volcano. (GSI aerial: the Jigokudani vents)",
    node: () => <Aerial src={GR + "ontake.jpg"} iw={2560} ih={2048} spot={[1088, 800, 1344, 1088]} z0={1.0} z1={1.25} label="JIGOKUDANI, MOUNT ONTAKE" boxAt={8} labelAt={14} /> },
  { t: 9.6, vo: "It's Saturday the 27th of September 2014, a clear day (the plume seen from Yatsugatake)", src: Y, from: 6.0, s0: 1.05, s1: 1.12 },
  { t: 13.0, vo: "in the middle of the autumn leaf season, and several hundred people are on the mountain.", src: M, from: 15.0, s0: 1.03, s1: 1.08 },
  // B2
  { t: 18.0, vo: "This is a phreatic eruption, groundwater flashing to steam inside the volcano,", src: M, from: 21.0, s0: 1.04, s1: 1.1 },
  { t: 21.0, vo: "and those give almost no warning.", src: Y, from: 12.0, s0: 1.08, s1: 1.14 },
  { t: 24.6, vo: "Small earthquakes under Ontake had ticked up that month. (the summit shrine, the plume behind)", src: LD, from: 0.3, s0: 1.04, s1: 1.1 },
  { t: 28.2, vo: "The Japan Meteorological Agency kept the alert at level one, the lowest there is.",
    node: () => <LevelOne bg={GR + O} bgFrom={10} lockAt={F(2.6)} label="JMA ALERT LEVEL · MOUNT ONTAKE · 2014" /> },
  { t: 33.7, vo: "The daylight goes in about half a minute. (into raw 2)", node: () => <PhoneFrame src={GR + O} from={27.7} sway={0.8} /> },
  // B3
  { t: 35.75, vo: "One hiker just below the hut wrote later", src: M, from: 26.0, s0: 1.05, s1: 1.1 },
  { t: 38.0, vo: "that the first plume caught him before he reached the door. (a summit lodge window, the ash outside)", src: LD, from: 5.0, s0: 1.04, s1: 1.1 },
  // B4
  { t: 40.75, vo: "He made it inside, (a summit lodge from the inside, the window grey with ash)", src: LD, from: 9.0, s0: 1.03, s1: 1.07 },
  { t: 42.2, vo: "rode out two more explosions there and walked down afterwards. (hikers sheltering in the lodge)", src: LD, from: 84.0, s0: 1.04, s1: 1.1 },
  { t: 45.6, vo: "Sixty-three people never came home, and five were never found. (the summit under ash)", src: LD, from: 141.0, s0: 1.03, s1: 1.09 },
  { t: 49.6, vo: "Families took the government to court over that level one.", node: () => <LevelOne bg={GR + LD} bgFrom={150} lockAt={4} quick /> },
  { t: 52.8, vo: "In 2022 a district court agreed the agency had failed in its duty,", src: LD, from: 160.0, s0: 1.03, s1: 1.08, over: <RedLabel text="NAGANO DISTRICT COURT · 2022" at={F(0.4)} hold={F(3.6)} /> },
  { t: 57.4, vo: "then said a higher alert wouldn't have closed the mountain in time anyway.", src: LD, from: 152.0, s0: 1.04, s1: 1.1 },
  { t: 61.3, vo: "In 2024 the Tokyo High Court threw out even that.", src: LD, from: 170.0, s0: 1.03, s1: 1.08, over: <RedLabel text="TOKYO HIGH COURT · 2024" at={F(0.4)} hold={F(3.3)} /> },
  { t: 65.2, vo: "So, officially, nobody got anything wrong. (the cloud closing over Marishiten peak, held)", src: GR + "ont_last.jpg", still: true, s0: 1.02, s1: 1.1 },
];

type Seg = { a: number; b: number; s?: Sh; raw?: number };
const SEGS: Seg[] = [];
SHOTS.forEach((s, i) => { const a = i === 0 ? TITLE : T(s.t); const nx = SHOTS[i + 1]; const b = nx && bi(nx.t) === bi(s.t) ? T(nx.t) : rt[bi(s.t)] ?? END; SEGS.push({ a, b, s }); });
RAWS.forEach((r, i) => SEGS.push({ a: rt[i], b: rt[i] + r.len + POST, raw: i }));

const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  { at: F(rt[0]), kind: "zoomHit", len: 10 },
  { at: F(rt[0] + RAWS[0].len + POST), kind: "blurDip", len: 10 },
  { at: F(rt[2]), kind: "blurDip", len: 12 },
  { at: F(rt[2] + RAWS[2].len + POST), kind: "blurDip", len: 14 },
  { at: F(rt[1] + RAWS[1].len + POST), kind: "blurDip", len: 10 },
  { at: F(rt[1]), kind: "blurDip", len: 10 },
  { at: F(T(6.3)), kind: "whip", len: 10 },
  { at: F(T(28.2)), kind: "glitch", len: 8 },
  { at: F(T(49.6)), kind: "glitch", len: 8 },
];
SEGS.filter((g) => g.s && !g.s.node).forEach((g) => {
  const at = F(g.a); if (CUTS.some((c) => Math.abs(c.at - at) < 12)) return;
  const prev = SEGS.find((h) => h !== g && h.s && !h.s.node && Math.abs(F(h.b) - at) <= 1);
  if (prev && prev.s!.src === g.s!.src) CUTS.push({ at, kind: "blurDip", len: 10 });
});
CUTS.sort((a, b) => a.at - b.at);

const ShotView: React.FC<{ s: Sh; n: number }> = ({ s, n }) => {
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.1}><Shot_FX src={src} n={n} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_03.wav", -25],
  [T(6.3), "sfx_n2/whoosh_02.wav", -30],
  [T(28.2), "sfx_n2/glitch_02.wav", -29],
  [T(28.2) + 2.6, X + "impact_1.wav", -30],
  [T(42.2) + 0.6, X + "boom_2.wav", -27],   // the lodge is dark and silent on its own: the explosions it sat through, felt
  [T(42.2) + 2.4, X + "boom_5.wav", -30],
  [T(49.6), "sfx_n2/glitch_01.wav", -30],
];
const musVol = (t: number) => {
  let v = 1;
  RAWS.forEach((r, i) => { const a = rt[i], b = rt[i] + r.len + POST; v = Math.min(v, interpolate(t, [a - 1.2, a, b, b + 1.5], [1, r.mus, r.mus, 1], cl)); });
  return v * interpolate(t, [TITLE, TITLE + 1, END - 2.5, END], [0, 1, 1, 0], cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="SWALLOWED BY ONTAKE'S ASH CLOUD" bg={GR + "ont_title.jpg"} /></AbsoluteFill></Sequence>
          {SEGS.map((g, i) => (
            <Sequence key={i} from={F(g.a)} durationInFrames={F(g.b) - F(g.a)} layout="none"><AbsoluteFill>
              {g.s ? <><ShotView s={g.s} n={F(g.b) - F(g.a)} />{g.s.over}</> :
                <PhoneFrame src={GR + O} from={RAWS[g.raw!].from} sway={0.8} label={RAWS[g.raw!].label || undefined} labelAt={F(0.8)} labelHold={F(3.5)} />}
            </AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {BLOCKS.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(bt[i])} durationInFrames={F(b) - F(a) + (i === BLOCKS.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE03.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rt[i])} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(C + "media/ont_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(-1) * interpolate(f, [0, 6, F(r.len) - 18, F(r.len)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(TITLE)} durationInFrames={F(END - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} loop startFrom={F(40)} volume={(f) => dB(-13) * musVol(TITLE + f / 30)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
