// Natural Disasters #1 — Ōfunato, 11 March 2011. One camera on the hill above the harbour (the Ōfunato Tsunami Memorial Hall's own
// recording, jbvBsgoEAe0: phone clips 0:10-1:34 from the office + street, then the hillside camera 1:34-16:58, 10 fps).
// Grammar: TitleCard, RedLabel, Inset, Aerial (brand.tsx). Devices built for this case's beats (dev/ND01_*):
//   RisingStaff (3 m forecast / 6 m upgrade / 23.6 m run-up to one scale against a two-storey house), BayFunnel (the narrowing bay,
//   tilted Sentinel-2 plane with measured widths; then the 3 km run inland), HistoryStack (1896 / 1933 photographs in depth),
//   PacificCrossing (1960 Chile wave across the Pacific on Blue Marble), StoneRead (the Aneyoshi stone), WarningFax (the JMA report's own lines printing out of a fax slot).
// VO: one take (no count word in this take), split only where the 6 incident raws sit. Raw sound only inside raw windows, out before the VO.
// Source cuts (srccuts): 10.0, 141.5, 160.5, 192.4, 212.3/212.7, 223.2, 273.7, 311.4, 371.7-385.9 (several), 483.6, 805.5, 929.5.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { RisingStaff } from "../dev/ND01_RisingStaff";
import { BayFunnel } from "../dev/ND01_BayFunnel";
import { HistoryStack } from "../dev/ND01_HistoryStack";
import { PacificCrossing } from "../dev/ND01_PacificCrossing";
import { StoneRead } from "../dev/ND01_StoneRead";
import { WarningFax } from "../dev/ND01_WarningFax";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, PRE = 0.25, POST = 0.45;

// ---- VO blocks (take seconds; each ends in the take's own silence) and the raw that follows each block
const BLOCKS: [number, number][] = [
  [0.0, 32.5], [32.5, 69.2], [69.2, 85.8], [85.8, 103.1], [103.1, 117.1], [117.1, 134.1], [134.1, 153.7],
  [153.7, 166.8], [166.8, 177.7], [177.7, 197.7], [197.7, 204.85], [204.85, 211.8], [211.8, 249.8],
];
// raw: source in-point, length, music level under it (0 = out: the clip's sound carries it)
const RAWS: { from: number; len: number; mus: number; what: string }[] = [
  { from: 95.0, len: 11.0, mus: 0, what: "the harbour and the town below, before the wave" },
  { from: 312.0, len: 20.0, mus: 0, what: "the sea surging through the harbour, boats and barges dragged" },
  { from: 386.6, len: 17.4, mus: 0, what: "water pouring into the streets" },
  { from: 440.5, len: 27.5, mus: 0, what: "houses lifted off their foundations, carried up the valley (climax)" },
  { from: 484.5, len: 17.5, mus: 0, what: "more houses drifting as the water keeps rising" },
  { from: 508.0, len: 16.0, mus: 0, what: "the valley filling, wreckage drifting inland" },
  // 3 Nov owner rule: raws only at the incident (build-up, moment, reactions, immediate aftermath). The six aftermath raws that
  // sat under the history / precautions / statistics VO (600-945 s, 'the town still under water' x6) are cut; that VO runs on over silent footage.
];
// timeline: block i starts at bt[i]; raw i at rt[i]
const bt: number[] = [], rt: number[] = [];
{ let t = TITLE; BLOCKS.forEach(([a, b], i) => { bt.push(t); t += b - a; if (RAWS[i]) { t += PRE; rt.push(t); t += RAWS[i].len + POST; } }); }
const END = bt[12] + (BLOCKS[12][1] - BLOCKS[12][0]) + 1.6;
export const DUR = F(END);
/** take seconds -> timeline seconds */
const T = (x: number) => { let i = BLOCKS.findIndex(([a, b]) => x >= a - 1e-6 && x < b - 1e-6); if (i < 0) i = BLOCKS.length - 1; return bt[i] + (x - BLOCKS[i][0]); };

type Sh = { t: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: (n: number) => React.ReactNode; over?: React.ReactNode };
const O = "ofu.mp4", PH = "ofu_phone.mp4"; // phone file = source - 10 s

// shots in TAKE seconds (start); each runs to the next shot's start (or the block end / raw start)
const SHOTS: Sh[] = [
  // B1
  { t: 0.0, vo: "One of the people watching this harbour that afternoon ran a museum about tsunamis.", src: O, from: 118.0, s0: 1.03, s1: 1.09 },
  { t: 4.3, vo: "His surname is Saitō. He was director of the Tsunami Memorial Hall (the hall's own title card on its recording)",
    node: () => <Inset src={GR + "ofu_card.jpg"} still box={0.6} pos="50% 30%" label="ŌFUNATO TSUNAMI MEMORIAL HALL" labelAt={14} drift={0.05} /> },
  { t: 9.7, vo: "in Ōfunato, a fishing town in Iwate Prefecture.", src: O, from: 131.5, s0: 1.04, s1: 1.1, over: <RedLabel text="ŌFUNATO, IWATE" at={F(0.4)} hold={F(1.9)} /> },
  { t: 12.2, vo: "If anyone on this coast understood what was coming, it was him.", src: O, from: 178.0, s0: 1.02, s1: 1.08 },
  { t: 15.75, vo: "At 2:46 on the afternoon of Friday the 11th of March 2011, (the office after the shaking, phone)", src: PH, from: 0.4, fill: true, s0: 1.0, s1: 1.04,
    over: <RedLabel text="MARCH 11, 2011 · 2:46 PM" at={F(0.5)} hold={F(3.4)} /> },
  { t: 20.2, vo: "the seabed off northeastern Japan slipped in the biggest earthquake the country had ever measured. (the office, shelves emptied)", src: PH, from: 21.0, fill: true, s0: 1.02, s1: 1.06 },
  { t: 25.4, vo: "Saitō was on high ground above the town when the shaking began, and he stayed there. (looking down on the roofs from the hill)", src: O, from: 108.6, s0: 1.03, s1: 1.08 },
  { t: 30.0, vo: "This is the harbour before the water arrives.", src: O, from: 136.0, s0: 1.02, s1: 1.06 },
  // B2
  { t: 32.5, vo: "Now, if you only know tsunamis from movies, forget the wall of water. (the water simply creeping over the quay)", src: O, from: 146.0, s0: 1.04, s1: 1.1 },
  { t: 36.6, vo: "The quake heaves up a huge stretch of sea floor, and the whole ocean above it rises with it.", src: O, from: 163.0, s0: 1.02, s1: 1.08 },
  { t: 41.9, vo: "That water then has to travel to the shore, which is why there's a gap between the shaking and the flood. (the canal running)", src: PH, from: 66.4, fill: true, s0: 1.02, s1: 1.07 },
  { t: 47.3, vo: "Japan's warning service used that gap.", src: O, from: 184.0, s0: 1.03, s1: 1.08 },
  { t: 50.1, vo: "The first tsunami warning went out at 14:49, three minutes after the shaking started. The problem was what it said. The estimate for Iwate was three metres, because the quake's size had been read as magnitude 7.9. (WarningFax: the JMA report's own lines print out)",
    node: () => <WarningFax credit="SOURCE: JAPAN METEOROLOGICAL AGENCY REPORT ON THE 2011 WARNINGS" lines={[
      { text: "...issued an initial tsunami warning", at: F(0.6) },
      { text: "at 14:49 around three minutes after", at: F(1.9), mark: "14:49" },
      { text: "The estimated tsunami heights ...", at: F(7.2) },
      { text: "three meters in the prefectures of Iwate", at: F(8.2), mark: "three meters" },
      { text: "The JMA magnitude (Mj) calculated at", at: F(10.4) },
      { text: "the time was 7.9", at: F(11.5), mark: "7.9" },
    ]} /> },
  { t: 63.6, vo: "On an earthquake this big, the seismometers saturate, and the early number comes out low.", src: O, from: 226.0, s0: 1.02, s1: 1.08 },
  // B3
  { t: 69.2, vo: "At 15:14 the warning for Iwate went up to six metres,", src: O, from: 240.0, s0: 1.03, s1: 1.08 },
  { t: 73.0, vo: "after a GPS buoy off Kamaishi picked up the sea rising. (the sea rising, boats shifting)", src: O, from: 256.0, s0: 1.02, s1: 1.07 },
  { t: 77.0, vo: "A three metre forecast is a number you can hold up against a harbour wall. The real wave here was many times that, and the harbour wall was never going to matter.",
    node: () => <RisingStaff bg={GR + "staff_bg.jpg"} at3={F(0.5)} at6={F(2.6)} atBig={F(4.4)} bigLabel="ŌFUNATO · UP TO 23.6 M" /> },
  // B4
  { t: 85.8, vo: "Ōfunato sits at the end of a long, narrow bay, and that shape is why the wave here was estimated at up to 23.6 metres.",
    node: () => <BayFunnel src={GR + "bay_s2.jpg"} iw={1792} ih={1536}
      cam={[{ at: 0, p: [850, 900], z: 1.35, tilt: 52 }, { at: F(7.6), p: [790, 520], z: 2.1, tilt: 40 }]}
      bars={[{ a: [806, 818], b: [918, 808], label: "1.7 KM", at: F(0.8) }, { a: [740, 660], b: [835, 660], label: "1.4 KM", at: F(2.6) },
        { a: [762, 570], b: [830, 570], label: "1.0 KM", at: F(4.2) }, { a: [790, 482], b: [830, 482], label: "0.6 KM", at: F(5.7) }]} /> },
  { t: 93.5, vo: "As the bay narrows, the same water has less and less room, so it climbs. (water climbing between the buildings)", src: O, from: 352.6, s0: 1.03, s1: 1.09 },
  { t: 98.2, vo: "Here it ran about three kilometres inland.",
    node: () => <BayFunnel src={GR + "bay_s2.jpg"} iw={1792} ih={1536}
      cam={[{ at: 0, p: [770, 430], z: 2.3, tilt: 34 }, { at: F(2.8), p: [748, 360], z: 2.5, tilt: 30 }]}
      path={{ pts: [[785, 445], [745, 360], [715, 280], [705, 255]], at: 4, len: F(1.9), label: "3 KM" }} /> },
  { t: 101.0, vo: "Keep your eyes on the far end of the valley.", src: O, from: 427.0, s0: 1.02, s1: 1.06 },
  // B5 (after the climax raw: the moment again, slow)
  { t: 103.1, vo: "These houses had come through the earthquake. (slow replay: the houses lifting)", src: "ofu_replay.mp4", from: 0, s0: 1.1, s1: 1.2, fx: 0.5, fy: 0.55 },
  { t: 107.6, vo: "Japan's building codes for shaking are some of the strictest anywhere, and they mostly worked that afternoon.", src: O, from: 405.0, s0: 1.03, s1: 1.08 },
  { t: 111.0, vo: "Nobody writes a code for a house that floats.", src: O, from: 475.0, s0: 1.04, s1: 1.1 },
  { t: 113.5, vo: "Once one comes loose, it becomes the thing that hits the next one.", src: O, from: 432.5, s0: 1.03, s1: 1.09 },
  // B6
  { t: 117.1, vo: "The city's own records contain one line that should bother anyone who plans for disasters.", src: O, from: 530.0, s0: 1.02, s1: 1.07 },
  { t: 122.0, vo: "Ōfunato had 58 designated evacuation sites, the places people had been told to run to.", src: O, from: 544.0, s0: 1.03, s1: 1.08 },
  { t: 128.0, vo: "At least six of them flooded.", src: O, from: 556.0, s0: 1.04, s1: 1.09 },
  { t: 130.0, vo: "This town had prepared for a tsunami.", src: O, from: 416.0, s0: 1.03, s1: 1.08 },
  { t: 132.2, vo: "It had prepared for a smaller one.", src: O, from: 572.0, s0: 1.03, s1: 1.07 },
  // B7
  { t: 134.1, vo: "Saitō knew this coast's history better than almost anyone.", src: O, from: 584.0, s0: 1.02, s1: 1.07 },
  { t: 137.6, vo: "This coast was hit in 1896 and again in 1933.",
    node: () => <HistoryStack prints={[{ src: GR + "kamaishi1896.jpg", ar: 1024 / 759, label: "KAMAISHI, 1896", at: F(0.9), rot: -4 },
      { src: GR + "ofu1933.jpg", ar: 628 / 286, label: "ŌFUNATO BAY, 1933", at: F(3.0), rot: 3 }]} /> },
  { t: 142.0, vo: "In 1960, a wave from an earthquake in Chile crossed the entire Pacific and came into this same bay, with no shaking felt here at all.",
    node: () => <PacificCrossing src={GR + "pacific.jpg"} from={[-73.2, -39.8]} to={[141.72, 39.06]} fromLabel="VALDIVIA, CHILE · MAY 22, 1960" toLabel="ŌFUNATO · A DAY LATER" goAt={F(2.2)} len={F(4.6)} /> },
  { t: 151.0, vo: "His museum existed because of those dates. (Ōfunato's 1960 Chile-tsunami height marker)",
    src: GR + "ofu_marker.jpg", still: true, s0: 1.02, s1: 1.22, fx: 0.58, fy: 0.34, over: <RedLabel text="1960 WAVE · 5.3 M" at={10} y={0.86} /> }, // full frame, slow push (one Inset per case)
  // B8
  { t: 153.7, vo: "Out in the deep ocean, a tsunami moves at roughly the speed of a jet airliner,", src: O, from: 622.0, s0: 1.03, s1: 1.08 },
  { t: 158.3, vo: "and it only slows down as the water gets shallow.", src: O, from: 638.0, s0: 1.03, s1: 1.08 },
  { t: 161.0, vo: "Slowing down is what makes it pile up.", src: O, from: 652.0, s0: 1.04, s1: 1.09 },
  { t: 163.4, vo: "Around here, the water can start to look like it's settling.", src: O, from: 674.0, s0: 1.02, s1: 1.06 },
  // B9
  { t: 166.8, vo: "It hasn't. A tsunami arrives as a series, and the first wave is often not the biggest.", src: O, from: 712.0, s0: 1.03, s1: 1.09 },
  { t: 172.3, vo: "That's why the rule along this coast is to reach high ground and stay there, even when it looks finished.", src: O, from: 728.0, s0: 1.02, s1: 1.07 },
  // B10
  { t: 177.7, vo: "Up the coast in Aneyoshi, a hamlet in Miyako,",
    node: () => <Aerial src={GR + "aneyoshi_z16.jpg"} iw={1792} ih={1280} spot={[740, 560, 960, 740]} z0={1.0} z1={1.22} label="ANEYOSHI, MIYAKO" boxAt={8} labelAt={14} /> },
  { t: 181.0, vo: "there's a stone tablet left after the 1933 tsunami telling people not to build their homes below that point.",
    node: () => <StoneRead src={GR + "stone.jpg"} iw={3648} ih={2432} box={[1338, 608, 1662, 1702]} at={F(3.4)} z1={1.4} /> },
  { t: 188.0, vo: "The hamlet listened, and in 2011 the water stopped just short of the stone. (the stone in its wood)", src: GR + "stone.jpg", still: true, s0: 1.18, s1: 1.06, fx: 0.62, fy: 0.5,
    over: <RedLabel text="ANEYOSHI TSUNAMI STONE" at={F(0.5)} hold={F(3.6)} /> },
  { t: 192.6, vo: "A slab of rock carved in the 1930s gave better advice than the first forecast did.", src: O, from: 742.0, s0: 1.03, s1: 1.08 },
  // B11
  { t: 197.7, vo: "The people who made it up the hills spent that night outside.", src: O, from: 818.0, s0: 1.02, s1: 1.07 },
  { t: 201.0, vo: "It was March, and snow fell across parts of Tōhoku that evening.", src: O, from: 846.0, s0: 1.03, s1: 1.08 },
  // B12
  { t: 204.85, vo: "One building in town held.", src: O, from: 878.0, s0: 1.03, s1: 1.07 },
  { t: 206.6, vo: "Ōfunato's theatre came through without damage and sheltered about 250 survivors. (GSI aerial, March 2011)",
    node: () => <Aerial src={GR + "town2011.jpg"} iw={2816} ih={3072} spot={[1128, 1296, 1218, 1384]} z0={1.25} z1={1.6} label="RIAS HALL" boxAt={8} labelAt={16} /> },
  // B13
  { t: 211.8, vo: "Japan's weather agency changed its warnings because of days like this one.", src: O, from: 912.0, s0: 1.03, s1: 1.08 },
  { t: 216.0, vo: "If it thinks a quake might be bigger than its first reading, it no longer gives a number at all.", src: O, from: 952.0, s0: 1.02, s1: 1.07 },
  { t: 221.0, vo: "It just says the tsunami will be huge,", src: O, from: 963.0, s0: 1.03, s1: 1.09 },
  { t: 223.2, vo: "and its updates now come around fifteen minutes after a quake, using a measurement that doesn't saturate.", src: O, from: 974.0, s0: 1.02, s1: 1.07 },
  { t: 229.0, vo: "By September 2015, Ōfunato counted 340 lives lost and 79 people still missing, (the town from the air in March 2011)",
    node: () => <Aerial src={GR + "town2011.jpg"} iw={2816} ih={3072} spot={[1500, 2000, 1900, 2400]} z0={1.0} z1={1.18} label="ŌFUNATO · MARCH 2011" boxAt={9999} labelAt={10} /> },
  { t: 236.0, vo: "and 2,791 households had lost their homes completely.", src: O, from: 754.0, s0: 1.03, s1: 1.08 },
  { t: 240.4, vo: "A man who spent his working life warning people about the sea watched the afternoon it proved him right.", src: O, from: 990.0, s0: 1.02, s1: 1.07 },
  { t: 246.0, vo: "He watched it from the high ground he had always told people to reach.", src: O, from: 1004.0, s0: 1.02, s1: 1.07 },
];

// timeline segments: shots (mapped), raws, replay
type Seg = { a: number; b: number; s?: Sh; raw?: number };
const SEGS: Seg[] = [];
SHOTS.forEach((s, i) => {
  const bi = BLOCKS.findIndex(([a, b]) => s.t >= a - 1e-6 && s.t < b - 1e-6);
  const a = i === 0 ? TITLE : T(s.t);
  const nx = SHOTS[i + 1];
  const sameBlock = nx && BLOCKS.findIndex(([a2, b2]) => nx.t >= a2 - 1e-6 && nx.t < b2 - 1e-6) === bi;
  const b = sameBlock ? T(nx.t) : rt[bi] ?? (nx ? T(nx.t) : END);
  SEGS.push({ a, b, s });
});
RAWS.forEach((r, i) => SEGS.push({ a: rt[i], b: rt[i] + r.len + POST, raw: i }));

const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  ...rt.map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),                       // into each raw (same camera)
  ...rt.map((t, i) => ({ at: F(t + RAWS[i].len + POST), kind: "blurDip" as const, len: 10 })), // out of each raw
];
// designed cuts on device entries
const devCuts = SHOTS.filter((s) => s.node).map((s) => F(T(s.t)));
devCuts.forEach((at) => { if (!CUTS.some((c) => Math.abs(c.at - at) < 12)) CUTS.push({ at, kind: "glitch", len: 8 }); });
// same-camera joins inside a block: blur-dip where the source moments are close or framing similar
SEGS.filter((g) => g.s && !g.s.node).forEach((g) => {
  const at = F(g.a); if (CUTS.some((c) => Math.abs(c.at - at) < 12)) return;
  const prev = SEGS.find((h) => Math.abs(F(h.b) - at) <= 1 && h.s && !h.s.node && h !== g);
  if (prev && prev.s!.src === g.s!.src) CUTS.push({ at, kind: "blurDip", len: 10 });
});
CUTS.sort((a, b) => a.at - b.at);
export const ALLOW = CUTS.filter((c) => c.kind !== "hard").map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.3).toFixed(2)}`).join(",");

const ShotView: React.FC<{ s: Sh; n: number }> = ({ s, n }) => {
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={n} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(50.1) + 0.4, X + "paper_2.wav", -30],               // the fax sheet feeds
  [T(57.4), X + "paper_3.wav", -32],
  [T(77.0), "sfx_n2/whoosh_02.wav", -30],
  [T(77.0) + 4.4, X + "reverse_swell_1.wav", -30],
  [T(85.8), "sfx_n2/whoosh_01.wav", -30],
  [T(98.2), "sfx_n2/whoosh_03.wav", -32],
  [T(137.6), X + "camera_shutter_2.wav", -27],
  [T(137.6) + 3.0, X + "camera_shutter_2.wav", -29],
  [T(142.0), "sfx_n2/whoosh_02.wav", -31],
  [T(177.7), "sfx_n2/whoosh_01.wav", -31],
  [T(181.0) + 3.3, X + "marker_1.wav", -32],
  [T(206.6), "sfx_n2/whoosh_03.wav", -32],
];

// music: Epidemic ambient Music 4 (≈ -12 LUFS file -> -23 dB ≈ 10 LU under the VO), looped, out under the loud raws, low under the quiet ones
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
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE WAVE COMES UP ŌFUNATO BAY" bg={GR + "ofu_title.jpg"} /></AbsoluteFill></Sequence>
          {SEGS.map((g, i) => (
            <Sequence key={i} from={F(g.a)} durationInFrames={F(g.b) - F(g.a)} layout="none"><AbsoluteFill>
              {g.s ? <><ShotView s={g.s} n={F(g.b) - F(g.a)} />{g.s.over}</> :
                <FilmLook_FX grain={0.08}><Shot_FX src={GR + O} n={F(g.b) - F(g.a)} from={RAWS[g.raw!].from} s0={1.0} s1={1.05} /></FilmLook_FX>}
            </AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the one take, a part per block */}
      {BLOCKS.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(bt[i])} durationInFrames={F(b) - F(a) + (i === BLOCKS.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {/* raws: the hillside camera's own sound, only inside the raw window, gone before the VO returns */}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rt[i])} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(C + "media/ofu_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(r.len) - 18, F(r.len)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(TITLE)} durationInFrames={F(END - TITLE)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} loop startFrom={F(8)} volume={(f) => dB(-23) * musVol(TITLE + f / 30)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
