// Natural Disasters #4 — Kesennuma, 11 March 2011: Hirotaka Oyama's own camera on the roof of the Kahoku Shimpō building (KES), two
// street-level cameras of the water rising through the shops (MOY1, MOY2) and one from the hills (CRV). Same channel grammar as the
// tornado cases (TitleCard, RedLabel, Aerial, Inset, glitch / blur-dip); devices built for this case's beats:
//   LockOn     (dev/ND04_LockOn)     "Pick one of those parked cars": freeze on the lot + white brackets onto one car
//   SinkLine   (dev/ND04_SinkLine)   the land dropping ~1 m before the wave: shore cross-section, sea level carried inland
//   CoastGlide (dev/ND04_CoastGlide) Kesennuma -> Kamaishi up the Sanriku coast, 3-D camera over the GSI mosaic
//   ReachRing  (dev/ND04_ReachRing)  the Asahi-cho fuel depot boxed on the GSI aerial, a 2.5 km ring = how far the tanks floated
// VO = one take (no count word in this take), split only where a raw plays, at the silence before each raw (measured).
// Timeline: every VO-covered shot is given in TAKE seconds and mapped onto the timeline (title + raws inserted before it).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { LockOn } from "../dev/ND04_LockOn";
import { SinkLine } from "../dev/ND04_SinkLine";
import { CoastGlide } from "../dev/ND04_CoastGlide";
import { ReachRing } from "../dev/ND04_ReachRing";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, G0 = 0.25, G1 = 0.35; // title length; silence before / after each raw

// raws: inserted after take second `after` (the silence before the next line). src = graded clip, from/len in source seconds
type Raw = { after: number; src: string; from: number; len: number; vol?: number; what: string; fx?: number; fy?: number; s0?: number; s1?: number };
const RAWS: Raw[] = [
  // 3 Nov owner rule: raws only at the incident (the wave, the street going, the night fires). The 11 raws under explanation
  // (subsidence, refuge buildings, cars, containers, tendenko, statistics) or repeating "the flooded town" are cut; that VO runs on.
  { after: 31.07, src: "kes", from: 141.0, len: 24.8, vol: -1, what: "CLIMAX: the wave comes up the street under the power lines, cars lifted away" },
  { after: 49.33, src: "kes", from: 195.0, len: 8.0, what: "the white truck spun in the black water, buildings grinding" },
  { after: 67.53, src: "kes", from: 284.0, len: 7.0, what: "the street gone, wreckage moving past the building" },
  { after: 190.98, src: "kes", from: 686.0, len: 8.0, what: "NIGHT: fires burning across the town" },
];
const RAWLEN = (r: Raw) => G0 + r.len + G1;
/** take seconds -> timeline seconds */
const T = (t: number) => TITLE + t + RAWS.filter((r) => r.after < t - 1e-6).reduce((a, r) => a + RAWLEN(r), 0);
const rawAt = (r: Raw) => T(r.after) + G0; // raw start on the timeline (just after the VO stops)
const TAKE_END = 222.75;
export const DUR = F(T(TAKE_END) + 0.6);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; abs?: boolean };

// VO shots (a, b in TAKE seconds)
const VO: Sh[] = [
  { a: 0, b: 5.33, vo: "Ontake gave its hikers seconds. The earthquake that hit Ōfunato gave Kesennuma a few minutes,", src: "kes", from: 73.0, s0: 1.03, s1: 1.08,
    over: <><RedLabel text="KESENNUMA, JAPAN" at={F(0.6)} hold={F(2.2)} /><RedLabel text="MARCH 11, 2011" at={F(3.1)} hold={F(2.0)} /></> },
  { a: 5.33, b: 8.6, vo: "and Hirotaka Oyama and his father spent them climbing. (the balcony stairs of the building)", src: "kes", from: 102.2, s0: 1.04, s1: 1.1 },
  { a: 8.6, b: 11.6, vo: "Oyama is the fifth generation of his family (the street below the roof)", src: "kes", from: 114.0, s0: 1.03, s1: 1.08 },
  { a: 11.6, b: 14.07, vo: "to run the Koyama confectionery shop in Kesennuma. (the Diamond Plaza lot)", src: "kes", from: 85.7, s0: 1.03, s1: 1.07 },
  { a: 14.07, b: 19.07, vo: "one of the biggest fishing ports in Japan, and the harbour reaches right into the middle of town. (GSI aerial, the inner bay boxed)",
    node: <Aerial src={GR + "reach_ort.jpg"} iw={2304} ih={2304} spot={[930, 520, 1290, 1060]} z0={1.0} z1={1.22} label="KESENNUMA BAY" boxAt={10} labelAt={18} /> },
  { a: 19.07, b: 24.34, vo: "When the shaking stopped, the two of them went up onto the roof of the Kahoku Shimpō newspaper building,", src: "kes", from: 19.3, s0: 1.03, s1: 1.08,
    over: <RedLabel text="KAHOKU SHIMPO BUILDING, ROOF" at={F(1.6)} hold={F(3.0)} /> },
  { a: 24.34, b: 28.33, vo: "and from there they could see their own street. This is it before the water.", src: "kes", from: 52.5, s0: 1.02, s1: 1.07 },
  { a: 28.33, b: 31.07, vo: "Pick one of those parked cars and try to follow it. (freeze + brackets)", node: <LockOn src={GR + "kc/4300.mp4"} sec={0.4} tx={0.497} ty={0.31} tw={0.07} th={0.075} at={6} z1={1.5} /> },
  { a: 31.07, b: 35.42, vo: "Oyama later described buildings grinding against each other in black water. (slow replay of the cars lifted away)", src: "kes_replay", from: 0.2, s0: 1.1, s1: 1.2, fx: 0.5, fy: 0.55 },
  { a: 35.42, b: 38.25, vo: "It's black because by now it isn't really the sea.", src: "kes", from: 250.9, s0: 1.04, s1: 1.09 },
  { a: 38.25, b: 43.34, vo: "It's the harbour floor, mud and fuel, plus everything the wave has already picked up.", src: "kes", from: 263.3, s0: 1.03, s1: 1.08 },
  { a: 43.34, b: 46.22, vo: "A cubic metre of seawater weighs about a tonne.", src: "kes", from: 292.0, s0: 1.04, s1: 1.09 },
  { a: 46.22, b: 49.33, vo: "Imagine that moving at running speed and full of cars.", src: "kes", from: 274.5, s0: 1.03, s1: 1.08 },
  { a: 49.33, b: 53.13, vo: "And something had already happened that nobody on that roof could see. (the people at the railing)", src: "kes", from: 487.0, s0: 1.03, s1: 1.08 },
  { a: 53.13, b: 62.28, vo: "The earthquake had dropped the land … up to about a metre … the sea was already closer. (SinkLine)",
    node: <SinkLine bg={GR + "kc/60000.mp4"} bgFrom={0} dropAt={F(2.0)} dropLen={F(1.6)} label="1 M" /> },
  { a: 62.28, b: 65.95, vo: "Somewhere down there is his family's shop, and his home.", src: "kes", from: 323.0, s0: 1.03, s1: 1.08 },
  { a: 65.95, b: 67.53, vo: "He watched both of them go.", src: "kes", from: 383.0, s0: 1.04, s1: 1.08 },
  { a: 67.53, b: 73.14, vo: "The newspaper building held. Along this coast, it was often the tall concrete buildings that stood.", src: "kes", from: 560.5, s0: 1.03, s1: 1.08 },
  { a: 73.14, b: 78.44, vo: "That's why towns here now mark certain buildings as places to climb … (a Kamaishi evacuation-building sign, 2011)",
    src: GR + "kamaishi_evac.jpg", still: true, s0: 1.03, s1: 1.2, fx: 0.45, fy: 0.5, over: <RedLabel text="KAMAISHI, 2011" at={F(0.5)} hold={F(4.2)} /> }, // full frame, slow push (no inset)
  { a: 78.44, b: 84.57, vo: "In other streets the water came in quietly at first, rising between the shops before it started to carry anything.", src: "moy1", from: 10.0, s0: 1.03, s1: 1.08 },
  { a: 84.57, b: 87.9, vo: "Across Tōhoku, a lot of people were caught in cars,", src: "kes", from: 61.9, s0: 1.03, s1: 1.08 },
  { a: 87.9, b: 90.95, vo: "trying to drive to higher ground on roads that jammed.", src: "kes", from: 68.9, s0: 1.03, s1: 1.07 },
  { a: 90.95, b: 94.38, vo: "Japan's advice since then is to leave on foot wherever you can.", src: "kes", from: 118.7, s0: 1.04, s1: 1.08 },
  { a: 94.38, b: 101.74, vo: "Shipping containers from the port were in the water too. Containers float until they fill up …", src: "moy1", from: 116.0, s0: 1.03, s1: 1.1 },
  { a: 101.74, b: 104.33, vo: "so in a tsunami they turn into battering rams.", src: "moy2", from: 2.0, s0: 1.04, s1: 1.08 },
  { a: 104.33, b: 109.56, vo: "From the hills above the harbourside district, the whole inner bay was going under at once.", src: "crv", from: 12.2, s0: 1.3, s1: 1.35, fx: 0.25 },
  { a: 109.56, b: 113.28, vo: "People on this coast have an old phrase, tsunami tendenko.", src: "kes", from: 496.0, s0: 1.03, s1: 1.08 },
  { a: 113.28, b: 118.82, vo: "when the tsunami comes, everyone runs for themselves and nobody goes back.", src: "kes", from: 538.0, s0: 1.03, s1: 1.08 },
  { a: 118.82, b: 121.75, vo: "It sounds cold until you learn why it exists. (the filmer alone on the stairs)", src: "moy2", from: 8.0, s0: 1.04, s1: 1.09 },
  { a: 121.75, b: 125.97, vo: "It was taught so that whole families wouldn't be lost going back for each other.", src: "kes", from: 552.45, s0: 1.03, s1: 1.08 },
  { a: 125.97, b: 135.01, vo: "In Kamaishi, further up the coast, nearly all of the children … reached high ground … (CoastGlide)",
    node: <CoastGlide src={GR + "coast12b.jpg"} iw={3072} ih={3584} a={{ x: 975, y: 2764, label: "KESENNUMA", at: 8 }} b={{ x: 1878, y: 1386, label: "KAMAISHI", at: F(5.0) }} moveAt={F(1.6)} moveLen={F(4.0)} tilt={46} scale={1.25} /> },
  { a: 135.01, b: 137.96, vo: "That smoke is where Kesennuma's night begins.", src: "kes", from: 635.8, s0: 1.03, s1: 1.08 },
  { a: 137.96, b: 144.3, vo: "Kesennuma was one of the worst hit cities in Miyagi, a prefecture where the death toll passed ten thousand.", src: "kes", from: 608.8, s0: 1.03, s1: 1.08 },
  { a: 144.3, b: 148.55, vo: "Its bay is long and narrow too, and the water reached deep into the city.", src: "kes", from: 620.0, s0: 1.03, s1: 1.08 },
  { a: 148.55, b: 154.87, vo: "Then the sun went down, and this is where Kesennuma's story turns worse …", src: "kes", from: 652.5, s0: 1.02, s1: 1.07 },
  { a: 154.87, b: 166.94, vo: "A fuel depot … 23 storage tanks … tore 22 of them off … floating more than two and a half kilometres away. (ReachRing)",
    node: <ReachRing src={GR + "reach_ort.jpg"} iw={2304} ih={2304} site={[1273, 1100]} box={70} mPerPx={3.718} metres={2500} z0={2.3} z1={1.25}
      ringAt={F(166.94 - 154.87 - 3.6)} ringLen={F(2.0)} siteLabel="FUEL DEPOT, ASAHI-CHO" ringLabel="2.5 KM" boxAt={F(0.5)} /> },
  { a: 166.94, b: 171.88, vo: "More than 12,800 cubic metres of oil spilled into the seawater.", src: "kes", from: 776.0, s0: 1.03, s1: 1.08 },
  { a: 171.88, b: 175.12, vo: "That's enough to fill about five Olympic swimming pools.", src: "kes", from: 795.0, s0: 1.04, s1: 1.09 },
  { a: 175.12, b: 177.25, vo: "Fuel from the fishing fleet joined it.", src: "kes", from: 676.0, s0: 1.03, s1: 1.07 },
  { a: 177.25, b: 182.0, vo: "Then the whole mixture caught fire, probably from a wrecked boat or a short circuit.", src: "kes", from: 805.0, s0: 1.03, s1: 1.08 },
  { a: 182.0, b: 184.41, vo: "Fuel floats, so it doesn't stay put.", src: "kes", from: 820.0, s0: 1.04, s1: 1.08 },
  { a: 184.41, b: 187.98, vo: "It spreads across the surface and goes wherever the water goes.", src: "kes", from: 788.0, s0: 1.03, s1: 1.08 },
  { a: 187.98, b: 190.98, vo: "Oyama wrote that the town burned together with the sea.", src: "kes", from: 664.0, s0: 1.03, s1: 1.08 },
  { a: 190.98, b: 193.04, vo: "Those fires burned for four days.", src: "kes", from: 704.0, s0: 1.03, s1: 1.07 },
  { a: 193.04, b: 196.41, vo: "When most of us hear the word tsunami, we picture water.", src: "moy1", from: 60.0, s0: 1.03, s1: 1.08 },
  { a: 196.41, b: 200.15, vo: "In Kesennuma that night, the water had fire sitting on top of it.", src: "kes", from: 670.0, s0: 1.04, s1: 1.1 },
  { a: 200.15, b: 204.84, vo: "Miyagi Prefecture updated its figures in February 2026.", src: "kes", from: 518.6, s0: 1.03, s1: 1.08 },
  { a: 204.84, b: 209.57, vo: "They give 1,220 people from Kesennuma who lost their lives,", src: "kes", from: 433.9, s0: 1.03, s1: 1.08 },
  { a: 209.57, b: 213.28, vo: "and 111 of those deaths came in the months after.", src: "kes", from: 627.0, s0: 1.03, s1: 1.08 },
  { a: 213.28, b: 217.35, vo: "Fifteen years on, 214 people are still missing.", src: "kes", from: 441.0, s0: 1.03, s1: 1.08 },
  { a: 217.35, b: 219.95, vo: "Hirotaka Oyama reopened the shop five months later, (the street before the water)", src: "kes", from: 78.4, s0: 1.03, s1: 1.07 },
  { a: 219.95, b: TAKE_END + 0.6, vo: "on the same spot. (his street, before)", src: "kes", from: 0.3, s0: 1.02, s1: 1.07 },
];

// all shots on the timeline (absolute seconds)
const SHOTS: Sh[] = [
  ...VO.map((s) => ({ ...s, a: T(s.a + 1e-3) - 1e-3, b: s.b > TAKE_END ? T(TAKE_END) + (s.b - TAKE_END) : T(s.b) })),
  ...RAWS.map((r) => ({ a: rawAt(r) - G0, b: rawAt(r) + r.len + G1, vo: "RAW " + r.what, src: r.src, from: r.from - G0, s0: r.s0 ?? 1.02, s1: r.s1 ?? 1.06, fx: r.fx, fy: r.fy })),
].sort((p, q) => p.a - q.a);

const SRC_CUTS: Record<string, number[]> = {
  kes: [11.51, 15.52, 27.73, 28.76, 29.63, 56.72, 88.49, 101.37, 129.83, 134.84, 168.94, 245.55, 298.23, 411.04, 432.63, 450.82, 453.32, 481.18, 512.81, 517.68, 547.05, 549.98, 570.04, 581.41, 603.27, 607.77, 608.14, 635.10, 651.45, 773.14],
  moy1: [20.17, 56.53, 89.5, 107.03, 115.23, 135.4, 154.1], moy2: [22.97, 41.97], crv: [],
};
// designed transitions: glitch out of the title and into the night; blur-dip wherever two shots of the same camera meet
const NIGHT = T(148.551) - 1e-3;
const CUTS: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }, { at: F(NIGHT), kind: "glitch", len: 8 }];
for (let i = 1; i < SHOTS.length; i++) {
  const p = SHOTS[i - 1], q = SHOTS[i]; const at = F(q.a);
  if (at === F(NIGHT) || !p.src || !q.src || p.src === "kes_replay" || q.src === "kes_replay") continue;
  // same continuous source shot (no source cut between the two windows) -> blur-dip; different shots of one file cut hard
  const win = (s: Sh) => (SRC_CUTS[s.src!] ?? []).filter((c) => c <= (s.from ?? 0) + 0.01).length;
  const night = (s: Sh) => s.src === "kes" && (s.from ?? 0) > 651;
  if ((p.src === q.src && win(p) === win(q)) || (night(p) && night(q)) || q.vo.includes("(the street before the water)")) CUTS.push({ at, kind: "blurDip", len: 12 }); // dark night joins dissolve
}
// the climax raw runs uncut: Oyama's camera swings to follow the cars (source 150.8-157.4, 161.5-163.1): real motion, allowed
const CLIMAX_MOVES = [[150.8, 157.4], [161.5, 163.1]].map(([a, b]) => `${(rawAt(RAWS[0]) + a - RAWS[0].from).toFixed(2)}-${(rawAt(RAWS[0]) + b - RAWS[0].from).toFixed(2)}`);
export const ALLOW = [...CUTS.map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`), ...CLIMAX_MOVES].join(",");

// the 14-min graded KES file is split (stream copy at keyframes) so the compositor never has to index the whole file
// per-shot clips cut from the graded KES (kc/<from*100>.mp4, each starts exactly at its window): the loaded machine timed out
// extracting frames from the long file
const kseg = (from: number): [string, number] => ["kc/" + Math.round(from * 100), 0];
const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.still) return <FilmLook_FX grain={0.08}><Shot_FX src={s.src!} n={F(s.b) - F(s.a)} still s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
  const [src, from] = s.src === "kes" ? kseg(s.from ?? 0) : [s.src!, s.from];
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + src + ".mp4"} n={F(s.b) - F(s.a)} from={from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(14.07), "sfx_n2/whoosh_02.wav", -30],
  [T(28.331) + 0.1, X + "camera_shutter_2.wav", -24],  // the freeze
  [T(53.13), "sfx_n2/whoosh_01.wav", -31],
  [T(53.13) + 2.0, X + "sub_drop_1.wav", -22],           // the land drops
  [T(73.14), X + "camera_shutter_2.wav", -27],
  [T(125.97), "sfx_n2/whoosh_03.wav", -30],
  [NIGHT - 0.05, "sfx_n2/glitch_03.wav", -27],
  [T(154.87), "sfx_n2/whoosh_02.wav", -31],
  [T(154.87) + 8.6, "sfx_n2/whoosh_01.wav", -32],        // the ring
];

// VO parts: [take from, take to]
const parts: [number, number][] = [];
{ let a = 0; for (const r of RAWS) { parts.push([a, r.after]); a = r.after; } parts.push([a, TAKE_END]); }

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE STREET THAT WASHED AWAY" bg={GR + "kes_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* fade to black over the last second */}
      <Sequence from={DUR - 30} layout="none"><FadeIn /></Sequence>
      {/* VO: one take, split only where a raw plays */}
      {parts.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(T(a + 1e-3) - 1e-3)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {/* the raws' own sound: in after the VO stops, out before it returns */}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rawAt(r))} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(MD + r.src + "_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(r.vol ?? -3) * interpolate(f, [0, 6, F(r.len) - 14, F(r.len) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 1), under the VO only; out for the climax raw, back after; lower for the night */}
      <Music from={TITLE} to={rawAt(RAWS[0]) + 1.5} off={0} />
      <Music from={rawAt(RAWS[0]) + RAWS[0].len - 0.5} to={T(TAKE_END) + 0.6} off={40} />
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const Music: React.FC<{ from: number; to: number; off: number }> = ({ from, to, off }) => {
  const n = F(to) - F(from);
  return (
    <Sequence from={F(from)} durationInFrames={n} layout="none">
      <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} loop volume={(f) => dB(-15) * interpolate(f, [0, F(2), n - F(2.5), n], [0, 1, 1, 0], cl)} />
    </Sequence>
  );
};
const FadeIn: React.FC = () => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 29], [0, 1], cl) }} />;
};
export const _SHOTS = SHOTS.map((s) => [s.a.toFixed(2), s.src, s.from, (s.b - s.a).toFixed(2)]);
