// Natural Disasters #2 — the road below Volcán de Fuego, 3 June 2018. Footage: Luis Roldan's phone on the road (Q3jDjAZoe-Q, one take,
// 640x352, no source cuts) + a second phone on the same road from a motorbike (rVOFPVBfqHw, small channel; flashes/cuts avoided:
// 12.4-13.8, 16.8-17.8, 25.8-26.2, 29.9-33.7, 36.4-37.0, 45.2-46.0, 56.6-57.0, 64.3, 66.6, 74.0-78.4, 86.2-86.4, 91.4).
// Devices (dev/ND02_*): Blender terrain of Fuego (S2 cloudless + DEM; flows traced by steepest descent down the barrancas) with
// TerrainLabels pinned from Blender's projection; TwoPhones (both phones on the road side by side); one news page (Global News, TornQuote: the agency's words torn out of the page).
// VO: one take, split only at the five raws. Raw sound only inside raw windows.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { TornQuote } from "../dev/ND02_TornQuote";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { TerrainLabels } from "../dev/ND02_TerrainLabels";
import { TwoPhones } from "../dev/ND02_TwoPhones";
import FLY from "../dev/ND02_fly_labels.json";
import FLOWS from "../dev/ND02_flows_labels.json";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/", MP = C + "maps/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, PRE = 0.25, POST = 0.45;

const BLOCKS: [number, number][] = [[0.0, 29.3], [29.3, 36.1], [36.1, 55.35], [55.35, 60.75], [60.75, 71.3], [71.3, 107.43]];
const RAWS: { from: number; len: number; mus: number; what: string }[] = [
  { from: 9.0, len: 12.0, mus: 0, what: "people on motorbikes stopped on the road, watching the eruption" },
  { from: 26.0, len: 14.0, mus: 0, what: "cars and motorbikes on the road, the grey flow billowing down the slope beside them" },
  { from: 44.0, len: 18.0, mus: 0, what: "vehicles moving off down the road, the flow behind" },
  { from: 66.0, len: 13.5, mus: 0, what: "running for the pickup, relatives climbing in (the blurred 1:20-1:35 is cut)" },
  // 3 Nov owner rule (raws only at the incident): the bridge raw after the "where the flows ended up" explanation is cut; that VO runs on
  { from: 124.0, len: 26.0, mus: 0, what: "the cloud billowing over the trees right by the road (climax, uncut)" },
];
const bt: number[] = [], rt: number[] = [];
{ let t = TITLE; BLOCKS.forEach(([a, b], i) => { bt.push(t); t += b - a; if (RAWS[i]) { t += PRE; rt.push(t); t += RAWS[i].len + POST; } }); }
const END = bt[BLOCKS.length - 1] + (BLOCKS[BLOCKS.length - 1][1] - BLOCKS[BLOCKS.length - 1][0]) + 1.6;
export const DUR = F(END);
const bi = (x: number) => { const i = BLOCKS.findIndex(([a, b]) => x >= a - 1e-6 && x < b - 1e-6); return i < 0 ? BLOCKS.length - 1 : i; };
const T = (x: number) => bt[bi(x)] + (x - BLOCKS[bi(x)][0]);

type Sh = { t: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: (n: number) => React.ReactNode; over?: React.ReactNode };
const L = "fue.mp4", D = "fue2.mp4";

const SHOTS: Sh[] = [
  // B1
  { t: 0.0, vo: "In Ōfunato, the water at least had to cross the sea before it arrived.", src: L, from: 0.3, s0: 1.03, s1: 1.08 },
  { t: 4.2, vo: "On the road below Fuego, the danger was already on the slope next to the traffic.", src: D, from: 37.3, s0: 1.04, s1: 1.1 },
  { t: 8.7, vo: "Volcán de Fuego ... stands above the towns west of Guatemala City, one of the most active volcanoes on Earth. (Blender: from above the capital west to the volcano)",
    node: () => <TerrainLabels src={MP + "fly.mp4"} labels={FLY} push={0.02} pins={[{ name: "FUEGO", text: "VOLCÁN DE FUEGO", at: F(5.0), dy: 90 }]} /> },
  { t: 17.2, vo: "People on its southern slopes grow up watching it.", src: L, from: 22.0, s0: 1.04, s1: 1.09 },
  { t: 20.3, vo: "So on the afternoon of Sunday the 3rd of June 2018, when it erupted again,", src: D, from: 46.3, s0: 1.03, s1: 1.08,
    over: <RedLabel text="JUNE 3, 2018 · ESCUINTLA" at={F(0.4)} hold={F(3.0)} /> },
  { t: 24.0, vo: "the people on this road did what they'd always done.", src: D, from: 18.3, s0: 1.04, s1: 1.09 },
  { t: 27.9, vo: "They stopped to look.", src: L, from: 6.9, s0: 1.06, s1: 1.1 },
  // B2
  { t: 29.3, vo: "Families are still on that road, in cars and on motorbikes. (both phones on the road)",
    node: () => <TwoPhones a={{ src: GR + L, from: 40.5 }} b={{ src: GR + D, from: 57.2 }} /> },
  { t: 33.2, vo: "What's rolling down the slope beside them isn't smoke.", src: D, from: 26.4, s0: 1.04, s1: 1.12, fx: 0.6, fy: 0.35 },
  // B3
  { t: 36.1, vo: "It's a pyroclastic flow.", src: L, from: 118.2, s0: 1.05, s1: 1.1 },
  { t: 37.9, vo: "If you've never heard the term, picture an avalanche made of hot gas, ash and broken rock.", src: L, from: 151.0, s0: 1.04, s1: 1.12 },
  { t: 43.0, vo: "It's heavier than air, so it pours down valleys the way water would, and flows like this can move faster than a hundred kilometres an hour. (Blender: the flows run down the barrancas)",
    node: () => <TerrainLabels src={MP + "flows.mp4"} labels={FLOWS} push={0.02} pins={[]} /> },
  { t: 50.6, vo: "On foot you have no chance.", src: D, from: 52.0, s0: 1.04, s1: 1.09 },
  { t: 52.4, vo: "On a motorbike you have one, and it's right now.", src: D, from: 68.0, s0: 1.03, s1: 1.08 },
  // B4
  { t: 55.35, vo: "That afternoon the flows came down several ravines at once, (the flows reach the plain)",
    node: () => <TerrainLabels src={MP + "flows.mp4"} labels={FLOWS} from={228} push={0.02} pins={[]} /> },
  { t: 58.6, vo: "and the road below the volcano was cut.", src: D, from: 71.5, s0: 1.04, s1: 1.09 },
  // B5
  { t: 60.75, vo: "What matters is where the flows ended up.", src: D, from: 79.0, s0: 1.03, s1: 1.08 },
  { t: 62.95, vo: "They buried San Miguel Los Lotes and reached El Rodeo, where most of the victims lived. (the end frame, the two villages pinned)",
    node: () => <TerrainLabels src={MP + "flows.mp4"} labels={FLOWS} hold={329} push={0.1}
      pins={[{ name: "SAN MIGUEL LOS LOTES", text: "SAN MIGUEL LOS LOTES", at: F(1.3), dy: -110, dx: 60 }, { name: "EL RODEO", text: "EL RODEO", at: F(3.2), dy: 80, dx: -90 }]} /> },
  // B6
  { t: 68.15, vo: "Now the cloud is in the trees, right beside the road.", src: L, from: 120.6, s0: 1.03, s1: 1.08 },
  // B7 (after the climax: the moment again, slow)
  { t: 71.3, vo: "About 3,100 people were evacuated. (slow replay: the cloud over the trees)", src: "fue_replay.mp4", from: 0, s0: 1.12, s1: 1.22 },
  { t: 74.3, vo: "The death toll reached about 190,", src: D, from: 0.0, s0: 1.04, s1: 1.1 },
  { t: 77.0, vo: "and at the end of July 256 people were still missing,", src: D, from: 61.0, s0: 1.03, s1: 1.08 },
  { t: 80.4, vo: "most of them under what had been their villages.", src: D, from: 54.0, s0: 1.04, s1: 1.1 },
  { t: 83.1, vo: "The uploader titled this relatives fleeing the fury of the Fuego volcano. (from the pickup, the family driving away)", src: L, from: 97.0, s0: 1.03, s1: 1.08 },
  { t: 87.4, vo: "Afterwards the two agencies blamed each other.", src: D, from: 82.0, s0: 1.04, s1: 1.09 },
  { t: 90.1, vo: "The volcanology institute said it had put out several bulletins that day.", src: D, from: 86.6, s0: 1.03, s1: 1.08 },
  { t: 93.6, vo: "The disaster agency said it hadn't been given enough to judge the risk. (Global News, 7 June 2018)",
    node: (n) => <TornQuote src={SH + "gn.png"} imgW={2560} imgH={2800} view={[160, 250, 1380, 780]} cutBelow={850}
      strips={[{ r: [190, 322, 1320, 172], at: 6 }, { r: [190, 700, 1300, 122], at: Math.round(n * 0.52) }]} label="CONRED, 7 JUNE 2018" labelAt={14} /> },
  { t: 98.4, vo: "One of its officials said communities near Fuego rely on what he called self-evacuation. (people getting themselves out)", src: L, from: 62.2, s0: 1.03, s1: 1.08 },
  { t: 101.5, vo: "(self-evacuation, the rider)", src: D, from: 92.0, s0: 1.03, s1: 1.07 },
  { t: 103.6, vo: "Nobody has ever said whether every family on that road made it. (the last of the road from the pickup, held)", src: GR + "fue_last.jpg", still: true, s0: 1.04, s1: 1.12 },
];

type Seg = { a: number; b: number; s?: Sh; raw?: number };
const SEGS: Seg[] = [];
SHOTS.forEach((s, i) => {
  const a = i === 0 ? TITLE : T(s.t); const nx = SHOTS[i + 1];
  const b = nx && bi(nx.t) === bi(s.t) ? T(nx.t) : rt[bi(s.t)] ?? (nx ? T(nx.t) : END);
  SEGS.push({ a, b, s });
});
RAWS.forEach((r, i) => SEGS.push({ a: rt[i], b: rt[i] + r.len + POST, raw: i }));

const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  ...rt.map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),
  ...rt.map((t, i) => ({ at: F(t + RAWS[i].len + POST), kind: "blurDip" as const, len: 10 })),
];
SHOTS.filter((s) => s.node).forEach((s) => { const at = F(T(s.t)); if (!CUTS.some((c) => Math.abs(c.at - at) < 12)) CUTS.push({ at, kind: s.t === 8.7 || s.t === 43.0 ? "whip" : "glitch", len: s.t === 8.7 || s.t === 43.0 ? 10 : 8 }); });
SEGS.filter((g) => g.s && !g.s.node).forEach((g) => {
  const at = F(g.a); if (CUTS.some((c) => Math.abs(c.at - at) < 12)) return;
  const prev = SEGS.find((h) => h !== g && h.s && !h.s.node && Math.abs(F(h.b) - at) <= 1);
  if (prev && prev.s!.src === g.s!.src) CUTS.push({ at, kind: "blurDip", len: 10 });
});
CUTS.sort((a, b) => a.at - b.at);

const ShotView: React.FC<{ s: Sh; n: number }> = ({ s, n }) => {
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.1}><Shot_FX src={src} n={n} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_01.wav", -24],
  [T(8.7), "sfx_n2/whoosh_01.wav", -29],
  [T(8.7) + 0.2, X + "wind_gust_1.wav", -34],
  [T(29.3), "sfx_n2/whoosh_03.wav", -31],
  [T(43.0), "sfx_n2/whoosh_02.wav", -29],
  [T(43.0) + 0.6, X + "riser_2.wav", -34],
  [T(62.95) + 1.3, X + "marker_1.wav", -33],
  [T(62.95) + 3.2, X + "marker_1.wav", -34],
  [T(93.6), "sfx_n2/page_in_01.wav", -31],
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
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="FAMILIES ON THE ROAD BELOW FUEGO" bg={GR + "fue_title.jpg"} /></AbsoluteFill></Sequence>
          {SEGS.map((g, i) => (
            <Sequence key={i} from={F(g.a)} durationInFrames={F(g.b) - F(g.a)} layout="none"><AbsoluteFill>
              {g.s ? <><ShotView s={g.s} n={F(g.b) - F(g.a)} />{g.s.over}</> :
                <FilmLook_FX grain={0.1}><Shot_FX src={GR + L} n={F(g.b) - F(g.a)} from={RAWS[g.raw!].from} s0={1.0} s1={1.05} /></FilmLook_FX>}
            </AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {BLOCKS.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(bt[i])} durationInFrames={F(b) - F(a) + (i === BLOCKS.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE02.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rt[i])} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(C + "media/fue_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(-1) * interpolate(f, [0, 6, F(r.len) - 18, F(r.len)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(TITLE)} durationInFrames={F(END - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} loop startFrom={F(20)} volume={(f) => dB(-17) * musVol(TITLE + f / 30)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

export const _CUTS = CUTS;
