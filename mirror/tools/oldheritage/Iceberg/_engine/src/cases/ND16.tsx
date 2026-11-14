// Natural Disasters #16 — Irma's surge at the glass doors, Marathon, Florida Keys (10 Sep 2017).
// Footage: [IRM] the pawn shop's own camera (main), [IRL] a second phone in the same shop, [IRB] a balcony/condo nearby (boat, towels,
// windows shaking); more/: Eric Isaacs' Summerland Key drone (surge during the eye + aftermath, watermark cropped out), Miklos Angyal's
// aftermath photos (Big Pine / Summerland / Marathon). Devices built for this case (dev/ND16_*): KeysTrack (Irma's HURDAT2 track over NAIP,
// landfall at Cudjoe, red east-side wash to Marathon), PressureSection (door fails -> wind in -> pressure -> roof off), ScanReveal
// (Big Pine Key NAIP -> NOAA 13 Sep 2017), DoorGauge (5 / 8 ft on the shop's own doors), BridgeTrace (Overseas Highway, bridges lit).
// VO = one continuous take (no count word in this take), split only where the six raws play (cut-sheet cues 1-5 and 9).
// Source cuts used to place windows: IRM 22.37 / 49.94 / 58.09 / 88.54 / 94.65 / 123.46; IRL 3.23 23.07 47.17 51.9 73.87 92.47 95.23
// 122.43 ... 132.63 140.5 ... 209.43 218.43 222.57 238.77 255.77; IRB 33.63 116.8 128.47 129.93 170.27 174.63 204.7 258.03 266.8 280.5.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { KeysTrack } from "../dev/ND16_KeysTrack";
import { PressureSection } from "../dev/ND16_PressureSection";
import { ScanReveal } from "../dev/ND16_ScanReveal";
import { DoorGauge } from "../dev/ND16_DoorGauge";
import { BridgeTrace } from "../dev/ND16_BridgeTrace";
import { layout, type TRaw, type TShot } from "../dev/ND16_Timeline";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
type Sh = { vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; cut?: FxCut["kind"]; clen?: number };
type Rw = { audio: string; src: string; from: number; gain: number; cut?: FxCut["kind"]; note: string };

// RAWS at the cut sheet's RAW cue positions (after = take second of the last word before the cue), dead air trimmed; audio = rawclean.py output
const RAWS: TRaw<Rw>[] = [
  // 3 Nov owner rule (raws only at the incident): the surge at the doors, the floor, the people at the glass. The whiteout raw after the
  // drowning figure and the 'windows are shaking' raw after the strip-mall survey are cut; that VO runs on over silent footage.
  { after: 33.9, len: 8.0, audio: "r1_clean.wav", src: "irm.mp4", from: 14.2, gain: -3, note: "cue 1 [IRM] surge slams the doors" },
  { after: 48.92, len: 8.8, audio: "r2_clean.wav", src: "irm.mp4", from: 95.4, gain: -3, cut: "blurDip", note: "cue 2 [IRM] water across the floor, 'a foot of mud piles up down here'" },
  { after: 64.2, len: 8.4, audio: "r3_clean.wav", src: "irl.mp4", from: 59.6, gain: 0, cut: "blurDip", note: "cue 4 [IRL] 'Hurricane Irma, we love you, please don't kill us'" },
];

const TSHOTS: TShot<Sh>[] = [
  // ---- VO-A (+4.0)
  { t0: 0.0, t1: 3.42, vo: "Those chasers in Lake Charles picked their concrete in advance. (the shop interior, dark, the doors glowing)", src: "irm.mp4", from: 28.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { t0: 3.42, t1: 5.84, vo: "In Marathon, in the Florida Keys, (the sea from a Marathon balcony)", src: "irb.mp4", from: 296.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MARATHON, FLORIDA KEYS" at={6} hold={F(2.0)} /> },
  { t0: 5.84, t1: 11.06, vo: "someone stayed behind in a pawn shop with a pair of sliding glass doors between them and the sea.", src: "irm.mp4", from: 1.0, s0: 1.0, s1: 1.09, fx: 0.42, fy: 0.5 },
  { t0: 11.06, t1: 19.46, cut: "blurDip", vo: "landfall at Cudjoe Key ... Sunday the 10th of September 2017, a Category 4. (track to landfall)",
    node: <KeysTrack src={GR + "keys.jpg"} phase="landfall" cudjoeAt={53} dateAt={126} /> },
  { t0: 19.46, t1: 27.19, cut: "whip", vo: "Days earlier, out in the Atlantic, 185 mph for longer than any storm on record. (MODIS, 6 Sep 2017, push into the eye)", src: "irma_modis.jpg", still: true, s0: 1.0, s1: 1.45, fx: 0.458, fy: 0.454 },
  { t0: 27.19, t1: 34.1, cut: "blurDip", vo: "Marathon, further up the chain, was on its east side, where winds and surge are strongest. (east wash, Marathon box)",
    node: <KeysTrack src={GR + "keys.jpg"} phase="east" boxAt={18} washAt={81} /> },
  // RAW 1 38.1-46.1
  // ---- VO-B (+12.6)
  { t0: 33.9, t1: 36.62, vo: "Storm surge takes more lives than the wind. (second phone: waves at the glass)", src: "irl.mp4", from: 15.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
  { t0: 36.62, t1: 41.55, vo: "It's the sea itself, pushed up and piled onto land by the wind and the low pressure. (surge under the balcony)", src: "irb.mp4", from: 282.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.6 },
  { t0: 41.55, t1: 44.36, vo: "In the Keys there's no high ground to run to. (Summerland Key in the eye: the streets under water)", src: "sumr.mp4", from: 20.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { t0: 44.36, t1: 47.53, vo: "Most of the islands sit only a few feet above the water. (houses at water level)", src: "sumr.mp4", from: 39.5, s0: 1.08, s1: 1.14, fx: 0.5, fy: 0.55 },
  { t0: 47.53, t1: 49.2, vo: "Now look at the floor.", src: "irm.mp4", from: 89.3, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.7 },
  // RAW 2 61.8-70.6
  // ---- VO-C (+22.08)
  { t0: 48.92, t1: 53.99, cut: "blurDip", vo: "The waves were carrying brick pavers, gravel and sand, and that's what is hitting the glass. (pavers piled at the sill)", src: "irm.mp4", from: 158.0, s0: 1.12, s1: 1.3, fx: 0.42, fy: 0.62 },
  { t0: 53.99, t1: 59.12, cut: "blurDip", vo: "A brick paver weighs a few kilos, and thrown by a wave it lands like a rock. (rubble against the glass)", src: "irm.mp4", from: 60.0, s0: 1.08, s1: 1.16, fx: 0.5, fy: 0.68 },
  // RAW 3 81.2-89.6
  // ---- VO-D (+31.14)
  { t0: 58.86, t1: 61.01, vo: "According to the county medical examiner, (grey sea from the balcony)", src: "irb.mp4", from: 37.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.5 },
  { t0: 61.01, t1: 64.2, vo: "three men drowned in the middle and lower Keys that day. (surge breaking at the shop)", src: "irl.mp4", from: 76.5, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  { t0: 64.2, t1: 68.15, cut: "blurDip", vo: "Sliding glass doors are one of the weakest points of any building in a hurricane.", src: "irl.mp4", from: 134.0, s0: 1.02, s1: 1.1, fx: 0.45, fy: 0.5 },
  { t0: 68.15, t1: 75.16, cut: "glitch", vo: "If one fails, the wind gets inside, the pressure climbs, and that's how a roof comes off from underneath. (section)",
    node: <PressureSection bg={GR + "irm.mp4"} bgFrom={150} failAt={14} windAt={56} pressAt={93} roofAt={140} /> },
  // RAW 4 106.3-116.3
  // ---- VO-E (+41.78)
  { t0: 74.92, t1: 78.49, cut: "blurDip", vo: "In the same town, a boat was torn right off its lift. (the boat in the fog off the balcony)", src: "irb.mp4", from: 12.0, s0: 1.25, s1: 1.38, fx: 0.55, fy: 0.62 },
  { t0: 78.49, t1: 81.92, vo: "Boat lifts hold boats up out of reach of ordinary storms. (Summerland Key: boats sunk at their docks)", src: "ang61.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.5 },
  { t0: 81.92, t1: 85.3, vo: "In a surge, the water simply rises to meet them. (drone, the eye: boats afloat among the houses)", src: "sumr.mp4", from: 5.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { t0: 85.3, t1: 89.2, vo: "Indoors, people packed towels against the bottom of a leaking door.", src: "irb.mp4", from: 100.5, s0: 1.03, s1: 1.08, fx: 0.6, fy: 0.7 },
  { t0: 89.2, t1: 94.88, cut: "blurDip", vo: "Towels against a door, in a storm like this, might be the most human detail in this whole story.", src: "irb.mp4", from: 117.6, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.7 },
  { t0: 94.88, t1: 96.84, vo: "Monroe County covers the Keys. (drone over Summerland Key after)", src: "sumr.mp4", from: 118.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MONROE COUNTY" at={4} /> },
  { t0: 96.84, t1: 100.76, vo: "In the end, 27,649 homes there were damaged (a Big Pine street after)", src: "ang72.jpg", still: true, s0: 1.02, s1: 1.09, fx: 0.5, fy: 0.5 },
  { t0: 100.76, t1: 104.59, vo: "and 1,179 were destroyed. (a destroyed house)", src: "ang97.jpg", still: true, s0: 1.05, s1: 1.12, fx: 0.55, fy: 0.5 },
  { t0: 104.59, t1: 110.24, cut: "zoomHit", vo: "Big Pine Key and the islands around Cudjoe, a short drive down the chain, took the worst of it. (NAIP -> NOAA 13 Sep 2017)",
    node: <ScanReveal before={GR + "bp_before.jpg"} after={GR + "bp_after.jpg"} iw={3072} ih={1792} focus={[1700, 900]} at={28} len={100} placeLabel="BIG PINE KEY" dateLabel="SEPTEMBER 13, 2017" /> },
  { t0: 110.24, t1: 117.48, cut: "blurDip", vo: "The survey put the flooding at five to eight feet over parts of the Lower and Middle Keys, Marathon included. (gauge on the doors)",
    node: <DoorGauge src={GR + "door168.jpg"} fiveAt={75} eightAt={94} /> },
  { t0: 117.48, t1: 122.25, vo: "Around Marathon it estimated gusts of 100 to 115 miles an hour, (palms whipping past the doors)", src: "irl.mp4", from: 226.0, s0: 1.03, s1: 1.09, fx: 0.55, fy: 0.45 },
  { t0: 122.25, t1: 126.15, vo: "and on some older strip malls the whole roof lifted and collapsed. (a canopy and roof down)", src: "ang94.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.6, fy: 0.45 },
  { t0: 126.15, t1: 130.85, vo: "Irma took at least 134 lives along its path, at least 14 of them in the Keys, (drone over wrecked canal homes)", src: "sumr.mp4", from: 57.8, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { t0: 130.85, t1: 135.55, vo: "and caused 77.2 billion dollars in damage. (a boat on US-1)", src: "ang37.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.62, fy: 0.55 },
  { t0: 135.55, t1: 140.12, vo: "The Keys had been ordered to evacuate, and thousands of people stayed anyway. (the people in the shop at the glass)", src: "irl.mp4", from: 107.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  { t0: 140.12, t1: 143.77, cut: "blurDip", vo: "Early federal estimates said a quarter of all homes there might be gone. (drone, homes from above)", src: "sumr.mp4", from: 150.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { t0: 143.77, t1: 148.58, vo: "The final count was far lower, but more than half the homes in the county took damage. (a toppled cottage)", src: "ang133.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { t0: 148.58, t1: 151.22, vo: "Afterwards the Keys were cut off for days, (US-1 buckled at the shore)", src: "ang154.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
  { t0: 151.22, t1: 155.82, cut: "glitch", vo: "because the Overseas Highway, the only road in, had to be checked bridge by bridge.",
    node: <BridgeTrace src={GR + "hwy.jpg"} at={10} len={118} /> },
  { t0: 155.82, t1: 164.62, cut: "blurDip", vo: "You can understand why the evacuation order exists, and also why somebody stays behind to guard what they've built.", src: "irm.mp4", from: 144.6, s0: 1.0, s1: 1.1, fx: 0.45, fy: 0.45 },
];

const L = layout(4.0, 162.3, TSHOTS, RAWS);
export const DUR = F(L.end + 2.0);
type Any = { a: number; b: number; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode; cut?: FxCut["kind"]; clen?: number };
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
  [at(11.06) - 0.06, "sfx_n2/whoosh_02.wav", -30],
  [at(11.06) + 1.74, X + "wind_gust_1.wav", -30],       // the eye moving up the track
  [at(19.46) - 0.06, "sfx_n2/whoosh_01.wav", -28],
  [at(27.19) - 0.09, X + "wind_gust_1.wav", -32],
  [at(68.15) - 0.04, "sfx_n2/glitch_03.wav", -28],
  [at(68.15) + 0.46, X + "impact_1.wav", -24],          // the door pane gives
  [at(68.15) + 1.91, X + "wind_gust_1.wav", -24],       // wind gets inside
  [at(68.15) + 4.71, X + "metal_clank_3.wav", -24],     // the roof goes
  [at(104.59) - 0.02, "sfx_n2/whoosh_02.wav", -30],
  [at(104.59) + 1.63, X + "static_1.wav", -34],         // the scan
  [at(151.22) - 0.03, "sfx_n2/glitch_02.wav", -28],
];

// music bed: Epidemic ambient Music 4 (-11 LUFS file -> -21 dB), one stretch per VO part (out under every raw), offsets walk through the file
const BED: [number, number, number][] = (() => { let off = 0; return L.parts.map((p, i) => { const a = p.at - 0.2, b = i < L.raws.length ? L.raws[i].a + 0.3 : L.end + 2.0; const o = off % Math.max(1, 118 - (b - a)); off += b - a; return [a, b, o] as [number, number, number]; }); })();

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE GLASS DOORS IN MARATHON" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {ALL.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* fade to black at the end */}
      <Sequence from={F(L.end + 0.4)} layout="none"><FadeOut n={F(1.5)} /></Sequence>
      {L.parts.map((p, i) => (
        <Sequence key={"v" + i} from={F(p.at)} durationInFrames={F(p.t1) - F(p.t0)} layout="none"><Audio src={staticFile("vor/CASE16.mp3")} startFrom={F(p.t0)} /></Sequence>
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
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => dB(-21) * interpolate(f, [0, 30, n - 24, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeOut: React.FC<{ n: number }> = ({ n }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, n], [0, 1], cl) }} />;
};

export const _CUTS = CUTS;
