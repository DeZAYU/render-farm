// Natural Disasters #14 — The room that wouldn't stop moving (Mandalay, 28 Mar 2025, M7.7). Channel grammar + devices for THIS case:
//   FaultBlock (dev/ND14_FaultBlock): the Sagaing Fault traced past Mandalay on NASA Blue Marble, the map splits into two crust
//     blocks that slide sideways (right-lateral) — then the REAL slip: GP Energy's CCTV of the fault rupturing near Thazi (Commons, PD).
//   RuptureClock (dev/ND14_RuptureClock): the rupture running north and south from the epicentre at one speed with a 0->85 s counter;
//     used again (other mode, far apart) to reach Bangkok, 1,000+ km away.
//   StoreyStack (dev/ND14_StoreyStack): this 3rd-floor home vs the 12-storey Sky Villa, whose floors pancake.
//   DrumTrace (dev/ND14_DrumTrace): a seismograph strip, the USGS event page's figures (M 7.7, 10.0 km depth, origin time) stamped as the pen throws.
// Footage: the family's IMOU camera (K46en5mHEAM, 25 fps; IMOU logo + date stamp kept, as the cut sheet allows). Its sound is quiet:
// pre-gained +12 dB with a limiter (media/room_a.m4a) and only plays inside raws. Source cut 29.6 (camera jolt); camera knocked 53-59, re-seated 69.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { DrumTrace } from "../dev/ND14_DrumTrace";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { FaultBlock } from "../dev/ND14_FaultBlock";
import { RuptureClock } from "../dev/ND14_RuptureClock";
import { StoreyStack } from "../dev/ND14_StoreyStack";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", SH = C + "shots/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, GAP = 0.35;

const BL: [number, number][] = [[0.03, 11.14], [11.14, 28.15], [28.15, 44.94], [44.94, 50.55], [50.55, 71.78]];
type Raw = { a: number; b: number; what: string; s0?: number; s1?: number; fx?: number; fy?: number };
const RAWS: Raw[] = [
  { a: 13.0, b: 28.6, what: "the still room, a woman crossing it; the rumble starts and the picture jolts" },
  { a: 30.2, b: 41.8, what: "the whole picture swinging, someone crouching by the cabinet, the tall cabinet crashing down" },
  { a: 44.0, b: 68.4, what: "the room still swinging, the camera knocked to the ceiling and back" },
  { a: 69.4, b: 80.0, what: "the camera re-seated: the cabinet face down across the floor, the room still" },
];
const BS: number[] = [], RS: number[] = [];
{ let t = TITLE; BL.forEach(([s, e], i) => { BS.push(t); t += e - s; if (RAWS[i]) { RS.push(t); t += RAWS[i].b - RAWS[i].a + GAP; } }); }
const blockOf = (take: number) => { let k = 0; BL.forEach(([s], i) => { if (take >= s - 0.001) k = i; }); return k; };
const T = (take: number) => BS[blockOf(take)] + take - BL[blockOf(take)][0];
const END = BS[BL.length - 1] + BL[BL.length - 1][1] - BL[BL.length - 1][0] + 0.8;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: (n: number) => React.ReactNode; over?: React.ReactNode };

// wide.jpg = NASA Blue Marble 92.5-102.5E / 12.5-24.5N at 250 px/deg; near.jpg = 94.6-97.6E / 20.2-23.8N at 500 px/deg
const EPI: [number, number] = [859, 622];
const NORTH: [number, number][] = [[859, 622], [870, 425], [865, 300]];
const SOUTH: [number, number][] = [[859, 622], [882, 825], [892, 1000], [920, 1175], [950, 1375], [962, 1475]];

const VO_SHOTS: Sh[] = [
  { a: 0.03, b: 4.05, vo: "Ten to one in the afternoon, Friday the 28th of March 2025, (the room, calm)", src: "room.mp4", from: 3.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5,
    over: <RedLabel text="MARCH 28, 2025" at={F(1.2)} hold={F(2.5)} /> },
  { a: 4.05, b: 8.35, vo: "a third floor home in the Sagaing and Mandalay area of Myanmar. (Blue Marble, box round Mandalay)",
    node: () => <Aerial src={GR + "wide.jpg"} iw={2500} ih={3000} spot={[835, 575, 955, 695]} z0={1.6} z1={2.4} label="MANDALAY, MYANMAR" boxAt={8} labelAt={16} /> },
  { a: 8.35, b: 11.14, vo: "For a few more seconds, nothing is wrong. (the room)", src: "room.mp4", from: 8.6, s0: 1.12, s1: 1.18, fx: 0.4, fy: 0.45 },
  // block 2
  { a: 11.14, b: 17.6, vo: "The Sagaing Fault runs right past Mandalay, north to south, two blocks of crust sliding sideways (FaultBlock)",
    node: () => <FaultBlock src={GR + "near.jpg"} iw={1500} ih={1800} fault={[[670, 0], [675, 100], [690, 500], [700, 900], [715, 1300], [735, 1650], [740, 1800]]} city={[740, 915]}
      cityLabel="MANDALAY" faultLabel="SAGAING FAULT" traceAt={6} traceLen={F(1.8)} tiltAt={F(3.3)} slideAt={F(4.4)} slide={130} /> },
  { a: 17.6, b: 21.16, vo: "past each other the way California's San Andreas does. (the fault slipping on CCTV, near Thazi)", src: "thazi.mp4", from: 4.0, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.45,
    over: <RedLabel text="SAGAING FAULT, NEAR THAZI" at={F(0.4)} hold={F(2.8)} /> },
  { a: 21.16, b: 28.15, vo: "That afternoon it ruptured, with the epicentre about sixteen kilometres from the city and only ten kilometres down. (USGS ShakeMap)",
    node: () => <Inset src={GR + "shakemap.jpg"} still bg={{ src: GR + "near.jpg", still: true }} box={0.36} ar={749 / 1001} pos="50% 40%" drift={0.1} label="USGS SHAKEMAP" labelAt={10} /> },
  // block 3
  { a: 28.15, b: 32.2, vo: "The US Geological Survey put it at magnitude 7.7. (USGS event page)",
    node: () => <DrumTrace onset={8} mag="M 7.7" magAt={14} credit="SOURCE: USGS EARTHQUAKE EVENT PAGE"
      lines={[{ text: "10.0 KM DEPTH", at: 52 }, { text: "2025-03-28 06:20:52 UTC", at: 70 }]} /> },
  { a: 32.2, b: 40.66, vo: "The rupture ran about 500 km along the fault in roughly 85 seconds, in places faster than the seismic waves (RuptureClock)",
    node: () => <RuptureClock src={GR + "wide.jpg"} iw={2500} ih={3000} epi={EPI} north={NORTH} south={SOUTH} at={14} len={F(7.0)} secs={85} focus={[900, 900]} z0={1.25} z1={1.4} label="EPICENTRE" labelAt={6} /> },
  { a: 40.66, b: 44.94, vo: "A quake that shallow hits the surface hard, and it doesn't stop quickly. (slow replay: the cabinet going over)", src: "rep_cab.mp4", from: 0.0, s0: 1.14, s1: 1.24, fx: 0.45, fy: 0.6 },
  // block 4
  { a: 44.94, b: 48.07, vo: "For the family in this room, it wasn't life threatening. (slow replay: the woman crouched, safe)", src: "rep_fam.mp4", from: 0.0, s0: 1.2, s1: 1.3, fx: 0.4, fy: 0.55 },
  { a: 48.07, b: 50.55, vo: "This is the lucky version of that afternoon. (the room before, calm)", src: "room.mp4", from: 0.4, s0: 1.06, s1: 1.1, fx: 0.55, fy: 0.5 },
  // block 5: the outcome
  { a: 50.55, b: 57.54, vo: "Not far away, the twelve storey Sky Villa condominium collapsed, and 207 people were lost inside it. (StoreyStack)",
    node: () => <StoreyStack bg={GR + "room.mp4"} bgFrom={92} small={3} lit={3} tall={12} smallLabel="THIS HOME: 3RD FLOOR" tallLabel="SKY VILLA: 12 STOREYS" tallAt={F(1.0)} fallAt={F(3.4)} /> },
  { a: 57.54, b: 59.28, vo: "The Ava Bridge came down. (Commons: the collapsed spans)", src: GR + "ava2.jpg", still: true, s0: 1.08, s1: 1.16, fx: 0.55, fy: 0.45,
    over: <RedLabel text="AVA BRIDGE" at={F(0.3)} hold={F(1.2)} /> },
  { a: 59.28, b: 61.9, vo: "More than a thousand kilometres away in Bangkok, (the reach: epicentre -> Bangkok)",
    node: () => <RuptureClock src={GR + "wide.jpg"} iw={2500} ih={3000} epi={EPI} north={NORTH} south={SOUTH} at={-9999} len={1} secs={85} focus={[1100, 1100]} z0={0.5} z1={0.52}
      reach={{ to: [2000, 2687], label: "BANGKOK", at: 6 }} /> },
  { a: 61.9, b: 64.52, vo: "a tower under construction collapsed. (US Air Force: rescuers at the State Audit Office tower)", src: GR + "bkk.jpg", still: true, s0: 1.05, s1: 1.13, fx: 0.5, fy: 0.45 },
  { a: 64.52, b: 68.99, vo: "The military government counted 3,770 deaths. (Copernicus EMS: Pha Duu, nearly every house graded destroyed)", src: GR + "cems.jpg", still: true, s0: 1.15, s1: 1.4, fx: 0.42, fy: 0.45,
    over: <RedLabel text="PHA DUU, MYANMAR" at={F(0.6)} hold={F(3.2)} /> },
  { a: 68.99, b: 72.6, vo: "Independent counts put it over 5,000. (the room, last: the cabinet down, everyone out)", src: "room.mp4", from: 98.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
];

const SHOTS: Sh[] = [
  ...VO_SHOTS.map((s) => ({ ...s, a: T(s.a), b: s.b >= 71.7 ? END : T(s.b - 0.001) + 0.001 })),
  ...RAWS.map((r, i) => ({ a: RS[i], b: BS[i + 1], vo: "RAW: " + r.what, src: "room.mp4", from: r.a, s0: r.s0 ?? 1.02, s1: r.s1 ?? 1.05, fx: 0.5, fy: 0.5 })),
].sort((x, y) => x.a - y.a);

const CUTS: FxCut[] = [
  { at: F(TITLE), kind: "glitch", len: 10 },
  { at: F(T(8.35)), kind: "zoomHit", len: 10 },
  { at: F(RS[0]), kind: "blurDip", len: 12 },        // same camera, a few seconds on
  { at: F(T(11.14)), kind: "glitch", len: 10 },      // out of the shaking into the map
  { at: F(T(28.15)), kind: "blurDip", len: 12 },
  { at: F(T(32.2)), kind: "whip", len: 10, dir: 1 },  // page -> rupture map
  { at: F(T(40.66)), kind: "blurDip", len: 12 },     // into the slow replay
  { at: F(T(44.94)), kind: "blurDip", len: 12 },
  { at: F(T(48.07)), kind: "blurDip", len: 12 },
  { at: F(RS[3]), kind: "blurDip", len: 12 },
  { at: F(T(50.55)), kind: "glitch", len: 10 },
  { at: F(T(68.99)), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const n = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(n)}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={n} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [T(4.05), "sfx_n2/whoosh_02.wav", -30],
  [T(11.14) - 0.05, "sfx_n2/glitch_01.wav", -28],
  [T(11.14) + 4.5, X + "sub_drop_1.wav", -22],        // the blocks start to slide
  [T(32.2), "sfx_n2/whoosh_01.wav", -30],
  [T(50.55) - 0.05, "sfx_n2/glitch_03.wav", -28],
  [T(50.55) + 3.4, X + "impact_3.wav", -20],           // the floors pancake
  [T(50.55) + 3.6, X + "boom_4.wav", -24],
  [T(59.28), "sfx_n2/whoosh_02.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE ROOM THAT KEPT MOVING" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={Math.max(1, F(s.b) - F(s.a))} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {BL.map(([s, e], i) => (
        <Sequence key={"v" + i} from={F(BS[i])} durationInFrames={F(e - s) + (i === BL.length - 1 ? 30 : 0)} layout="none"><Audio src={staticFile("vor/CASE14.mp3")} startFrom={F(s)} /></Sequence>
      ))}
      {RAWS.map((r, i) => {
        const n = F(r.b - r.a);
        return <Sequence key={"r" + i} from={F(RS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + "room_clean.wav")} startFrom={F(r.a)} volume={(f) => interpolate(f, [0, 5, n - 18, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {/* music: Epidemic ambient Music 1 under the VO blocks only (the room's own sound carries the raws) */}
      {BL.map(([s, e], i) => {
        const n = F(e - s) + (i === BL.length - 1 ? 24 : 0);
        return <Sequence key={"m" + i} from={F(BS[i])} durationInFrames={n} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(35 + BS[i] - TITLE)} volume={(f) => dB(-15) * interpolate(f, [0, 20, n - 20, n], [0, 1, 1, 0], cl)} />
        </Sequence>;
      })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

export const _CUTS = CUTS;
