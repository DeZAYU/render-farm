// Natural Disasters #5 — Aldaia (Valencia), the DANA of 29 Oct 2024: Antonio Fernández's phone at his window (ALD; night, sodium
// light, the street running as a river, his building's underground garage filling). Channel grammar (TitleCard, RedLabel, Inset, glitch,
// blur-dip); devices built for this case's beats, different from ND04's:
//   RavineTrace  (dev/ND05_RavineTrace)  the two dry barrancos on Spain's PNOA orthophoto, OSM courses drawn as named; 3 views
//                                        (Aldaia / Turís in the hills / Paiporta down the Poyo)
//   CarLift      (dev/ND05_CarLift)      NWS "30 cm of moving water floats most cars": side view to scale, tyres leave the road, carried off
//   EveningClock (dev/ND05_EveningClock) the Poyo over its banks ~18:30 -> ES-Alert 20:11 on one clock face, swept hour sector in red
//   GaugeStaff   (dev/ND05_GaugeStaff)   the Poyo gauge: water at 15x its top warning level, then the staff is carried away
// VO = one take, split only where a raw plays (at the measured silence before each raw). Shots in TAKE seconds, mapped to the timeline.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { RavineTrace } from "../dev/ND05_RavineTrace";
import { POYO, SALETA } from "../dev/ND05_ravines";
import { CarLift } from "../dev/ND05_CarLift";
import { EveningClock } from "../dev/ND05_EveningClock";
import { GaugeStaff } from "../dev/ND05_GaugeStaff";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, G0 = 0.25, G1 = 0.35;

type Raw = { after: number; from: number; len: number; what: string; s0?: number; s1?: number; fx?: number; fy?: number };
const RAWS: Raw[] = [
  // 3 Nov owner rule: raws only at the incident (the street, the cars lifted, the garage). The five raws under the cars / garages /
  // timing / ES-Alert / gauge explanation are cut; that VO runs on over silent footage.
  { after: 35.12, from: 9.55, len: 6.2, what: "the street below the window at night, brown water running under the tree" },
  { after: 40.7, from: 20.5, len: 9.5, what: "parked cars lifted and carried off by the torrent" },
  { after: 55.94, from: 70.0, len: 5.6, what: "the garage: water pouring in, filling it (loud)" },
];
const SRC_CUTS = [5.57, 8.57, 34.03, 56.43, 62.43, 65.03, 67.83, 68.83, 69.23, 75.97, 76.37, 77.57, 80.33, 80.63, 81.43, 88.23, 89.03, 89.83, 98.63, 114.37, 129.33, 147.23, 159.33, 173.43, 183.57, 183.77, 188.27, 204.57, 212.07];
const RAWLEN = (r: Raw) => G0 + r.len + G1;
const T = (t: number) => TITLE + t + RAWS.filter((r) => r.after < t - 1e-6).reduce((a, r) => a + RAWLEN(r), 0);
const Ts = (t: number) => T(t + 1e-3) - 1e-3; // a shot starting at a split starts after the raw
const rawAt = (r: Raw) => T(r.after) + G0;
const TAKE_END = 139.85, TAIL = 1.0;
export const DUR = F(T(TAKE_END) + TAIL);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const IMG = GR + "ald_pnoa.jpg", IW = 2816, IH = 1536;
const ALDAIA = { x: 1934, y: 552 }, PAIPORTA = { x: 2173, y: 830 }, TURIS = { x: 468, y: 1119 };
const POYO_LOW = POYO.filter(([x]) => x > 1560);

const VO: Sh[] = [
  { a: 0, b: 14.07, vo: "A riverbed with no water … Above Aldaia … the Saleta and the Poyo ravines … barrancos … nothing in them at all. (PNOA, the dry beds traced)",
    node: <RavineTrace src={IMG} iw={IW} ih={IH}
      views={[{ at: 0, x: 1880, y: 560, z: 3.4 }, { at: F(4.2), x: 1880, y: 600, z: 2.1 }, { at: F(14), x: 1800, y: 660, z: 1.8 }]}
      pins={[{ ...ALDAIA, label: "ALDAIA", at: F(3.9), dy: -64 }]}
      lines={[{ pts: SALETA, at: F(7.2), len: 26, label: "BARRANCO DE LA SALETA", lx: 1830, ly: 470, labelAt: F(7.6) },
              { pts: POYO_LOW, at: F(8.3), len: 54, label: "BARRANCO DEL POYO", lx: 1700, ly: 770, labelAt: F(8.9) }]} /> },
  { a: 14.07, b: 17.22, vo: "On Tuesday the 29th of October 2024,", src: "ald", from: 0.3, s0: 1.03, s1: 1.08, over: <RedLabel text="OCTOBER 29, 2024" at={F(0.5)} hold={F(2.3)} /> },
  { a: 17.22, b: 20.04, vo: "a storm system stalled over the province.", src: "ald", from: 148.0, s0: 1.03, s1: 1.08 },
  { a: 20.04, b: 24.29, vo: "The Spanish call it a DANA, a cut-off low that gets stuck in place.", src: "ald", from: 174.2, s0: 1.04, s1: 1.09 },
  { a: 24.29, b: 30.97, vo: "A rain gauge at Turís measured 184.6 millimetres in a single hour. That's a Spanish record. (pulled back to the hills)",
    node: <RavineTrace src={IMG} iw={IW} ih={IH} done
      views={[{ at: 0, x: 1550, y: 760, z: 1.12 }, { at: F(6.6), x: 1050, y: 880, z: 1.32 }]}
      pins={[{ ...ALDAIA, label: "ALDAIA", at: -30, dy: -64 }, { ...TURIS, label: "TURÍS", at: F(0.8), dy: -64 }]}
      lines={[{ pts: SALETA, at: 0, len: 1 }, { pts: POYO, at: 0, len: 1 }]} /> },
  { a: 30.97, b: 35.12, vo: "Antonio Fernández watched what came down those ravines from the window of his house.", src: "ald", from: 16.0, s0: 1.03, s1: 1.08,
    over: <RedLabel text="ANTONIO FERNÁNDEZ, ALDAIA" at={F(0.6)} hold={F(3.0)} /> },
  { a: 35.12, b: 40.7, vo: "A lot of this water had fallen miles upstream, in the hills, before it ever reached his street.", src: "ald", from: 100.0, s0: 1.03, s1: 1.08 },
  { a: 40.7, b: 44.13, vo: "This is why flash floods catch so many people in cars.", src: "ald", from: 115.2, s0: 1.03, s1: 1.08 },
  { a: 44.13, b: 53.44, vo: "NWS: about thirty centimetres of moving water is enough to float most cars. Once a car floats … (CarLift)",
    node: <CarLift bg={GR + "ald.mp4"} bgFrom={110.0} riseAt={F(1.0)} riseLen={F(3.4)} floatAt={F(5.0)} driftAt={F(6.6)} /> },
  { a: 53.44, b: 55.94, vo: "Halfway down his street there's a garage ramp.", src: "ald", from: 42.0, s0: 1.04, s1: 1.09 },
  { a: 55.94, b: 59.66, vo: "Underground garages were some of the worst places to be that night.", src: "ald", from: 57.4, s0: 1.03, s1: 1.08 },
  { a: 59.66, b: 61.74, vo: "Water like this fills them in minutes,", src: "ald", from: 65.73, s0: 1.04, s1: 1.08 },
  { a: 61.74, b: 63.7, vo: "and across the region people were caught", src: "ald", from: 78.27, s0: 1.04, s1: 1.08 },
  { a: 63.7, b: 65.6, vo: "after going down to move their cars.", src: "ald", from: 82.13, s0: 1.04, s1: 1.08 },
  { a: 65.6, b: 70.87, vo: "Now hold on to the timing. The Poyo overflowed at around half past six that evening.", src: "ald", from: 153.5, s0: 1.03, s1: 1.08 },
  { a: 70.87, b: 74.55, vo: "Paiporta, just down the road, lost 62 people. (down the Poyo to Paiporta)",
    node: <RavineTrace src={IMG} iw={IW} ih={IH} done
      views={[{ at: 0, x: 1990, y: 640, z: 2.0 }, { at: F(3.7), x: 2130, y: 780, z: 2.35 }]}
      pins={[{ ...ALDAIA, label: "ALDAIA", at: -30, dy: -64 }, { ...PAIPORTA, label: "PAIPORTA", at: F(0.5), dy: 70 }]}
      lines={[{ pts: SALETA, at: 0, len: 1 }, { pts: POYO_LOW, at: 0, len: 1 }]} /> },
  { a: 74.55, b: 79.62, vo: "AEMET, the national weather agency, had put the province on red alert that morning.", src: "ald", from: 106.2, s0: 1.03, s1: 1.08 },
  { a: 79.62, b: 90.1, vo: "Spain has … the ES-Alert … It went out at 8:11 that evening. By then the Poyo had been over its banks for well over an hour. (EveningClock)",
    node: <EveningClock bg={GR + "ald.mp4"} bgFrom={189.0} start={390} moves={[{ to: 491, at: F(5.1), len: F(1.6) }]}
      events={[{ min: 390, label: "THE POYO OVER ITS BANKS  ~18:30", at: F(0.5) }, { min: 491, label: "ES-ALERT  20:11", at: F(6.3) }]} /> },
  { a: 90.1, b: 94.53, vo: "Picture your phone telling you to keep away from riverbeds while your street is turning into one.", src: "ald", from: 205.3, s0: 1.03, s1: 1.08 },
  { a: 94.53, b: 99.97, vo: "The river authority's gauge on the Poyo gave its last reliable reading at 18:55.", src: "ald", from: 213.0, s0: 1.03, s1: 1.08 },
  { a: 99.97, b: 112.91, vo: "2,282 m³ a second … about fifteen times its top warning level. Then the water carried the gauge away. (GaugeStaff)",
    node: <GaugeStaff bg={GR + "ald.mp4"} bgFrom={196.0} ratio={15.2} warnAt={F(0.3)} riseAt={F(0.6)} riseLen={F(5.0)} readLabel="2,282 M³/S  ·  18:55" readAt={F(1.6)} loseAt={F(11.0)} warn2At={F(8.1)} /> },
  { a: 112.91, b: 115.12, vo: "Aldaia lost six people.", src: "ald", from: 36.0, s0: 1.03, s1: 1.07, over: <RedLabel text="ALDAIA" at={F(0.4)} hold={F(1.6)} /> },
  { a: 115.12, b: 120.82, vo: "Across Spain at least 232 did, 224 of them in Valencia province,", src: "ald", from: 119.0, s0: 1.03, s1: 1.08 },
  { a: 120.82, b: 123.73, vo: "and more than 100,000 cars were damaged.", src: "ald", from: 184.5, s0: 1.04, s1: 1.08 },
  { a: 123.73, b: 128.73, vo: "Much of the anger afterwards was about one afternoon meeting of the regional emergency committee,", src: "ald", from: 140.6, s0: 1.03, s1: 1.08 },
  { a: 128.73, b: 131.85, vo: "still going on while towns were already under water.", src: "ald", from: 221.0, s0: 1.04, s1: 1.08 },
  { a: 131.85, b: 136.0, vo: "The regional president, Carlos Mazón, (portrait)",
    node: <Inset src={GR + "mazon.jpg"} still box={0.3} ar={570 / 855} pos="50% 35%" bg={{ src: GR + "ald.mp4", from: 200.0 }} label="CARLOS MAZÓN" labelAt={F(1.0)} drift={0.05} /> },
  { a: 136.0, b: TAKE_END + TAIL, vo: "faced lawsuits over that evening and announced his resignation in November 2025.", src: "ald", from: 199.0, s0: 1.02, s1: 1.08 },
];

const SHOTS: Sh[] = [
  ...VO.map((s) => ({ ...s, a: Ts(s.a), b: s.b > TAKE_END ? T(TAKE_END) + (s.b - TAKE_END) : T(s.b) })),
  ...RAWS.map((r) => ({ a: rawAt(r) - G0, b: rawAt(r) + r.len + G1, vo: "RAW " + r.what, src: "ald", from: r.from - G0, s0: r.s0 ?? 1.02, s1: r.s1 ?? 1.06, fx: r.fx, fy: r.fy })),
].sort((p, q) => p.a - q.a);

const CUTS: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }, { at: F(Ts(112.91)), kind: "glitch", len: 8 }];
const win = (s: Sh) => SRC_CUTS.filter((c) => c <= (s.from ?? 0) + 0.01).length;
for (let i = 1; i < SHOTS.length; i++) {
  const p = SHOTS[i - 1], q = SHOTS[i]; const at = F(q.a);
  if (CUTS.some((c) => c.at === at)) continue;
  if (p.src && q.src && win(p) === win(q)) CUTS.push({ at, kind: "blurDip", len: 12 });
  else if (!p.src && !q.src) CUTS.push({ at, kind: "blurDip", len: 12 });
}
export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`).join(",");
export const _SHOTS = SHOTS.map((s) => [s.a.toFixed(2), s.src, s.from, (s.b - s.a).toFixed(2)]);

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src + ".mp4"} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_01.wav", -24],
  [TITLE + 7.2, "sfx_n2/whoosh_03.wav", -32],             // the ravines drawn
  [Ts(24.29), "sfx_n2/whoosh_01.wav", -31],
  [Ts(44.13), X + "rain_5.wav", -30],                      // CarLift: the water under it
  [Ts(70.87), "sfx_n2/whoosh_02.wav", -32],
  [Ts(79.62), X + "tape_click_2.wav", -28],
  [Ts(79.62) + 5.1, "sfx_n2/whoosh_01.wav", -33],          // the hands run to 20:11
  [Ts(99.97), X + "rain_9.wav", -30],
  [Ts(99.97) + 11.0, X + "metal_clank_3.wav", -26],        // the gauge goes
  [Ts(112.91) - 0.05, "sfx_n2/glitch_03.wav", -27],
  [Ts(131.85), X + "camera_shutter_2.wav", -27],
];

const parts: [number, number][] = [];
{ let a = 0; for (const r of RAWS) { parts.push([a, r.after]); a = r.after; } parts.push([a, TAKE_END]); }
const rawWin = RAWS.map((r) => [F(rawAt(r)), F(rawAt(r) + r.len)] as const);

const Music: React.FC = () => {
  const f = useCurrentFrame() + F(TITLE);
  // out for every raw (each one is the street's own roar), back after it; fades of 0.6 s
  let k = 1;
  for (const [a, b] of rawWin) k = Math.min(k, interpolate(f, [a - 18, a, b, b + 24], [1, 0, 0, 1], cl));
  const end = F(T(TAKE_END) + TAIL);
  return <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} loop volume={() => dB(-21.5) * k * interpolate(f, [F(TITLE), F(TITLE) + 60, end - 75, end], [0, 1, 1, 0], cl)} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE NIGHT THE RAVINES CAME THROUGH" bg={GR + "ald_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={DUR - 30} layout="none"><FadeOut /></Sequence>
      {parts.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(Ts(a))} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE05.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rawAt(r))} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(MD + "ald_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(-3) * interpolate(f, [0, 6, F(r.len) - 14, F(r.len) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(TITLE)} layout="none"><Music /></Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
const FadeOut: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 29], [0, 1], cl) }} />; };
