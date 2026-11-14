// Natural Disasters #6 — Dharali (Uttarakhand), 5 Aug 2025: one villager's phone from the hillside across the valley (56 s, shouting),
// the debris flow of the Kheer Ganga burying the market village. The clip is almost all raw in the cut sheet, so the VO lines between
// the raws are carried by deliberate slow replays (0.5x, reframed) and by devices built for this case (different from ND04/ND05):
//   FrameToMap    (dev/ND06_FrameToMap)    the filmed frame folds into a white card pinned on Dharali in the Sentinel-2 valley, then
//                                          the camera travels up the road to Gangotri
//   BuriedOutline (dev/ND06_BuriedOutline) Sentinel-2 April 2025 vs November 2025 on the same ground: the village outlined, the
//                                          "after" spreads from the gully mouth until the outline holds grey debris
//   Aerial (brand) on the November image: the Kheer Ganga catchment above the village (snow and ice: the glacial-lake question)
// VO = one take, split only at the three raws (measured silences). Raw sound = rawclean'd (_clean.wav).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, TitleCard } from "../brand";
import { FrameToMap } from "../dev/ND06_FrameToMap";
import { BuriedOutline } from "../dev/ND06_BuriedOutline";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TITLE = 4.0, G0 = 0.25, G1 = 0.35;

type Raw = { after: number; from: number; len: number; what: string };
const RAWS: Raw[] = [
  { after: 14.9, from: 6.0, len: 9.0, what: "the debris flow pouring down onto the village, onlookers shouting" },
  { after: 16.38, from: 15.5, len: 22.5, what: "buildings engulfed by the debris flow, dust rising as they go (uncut)" },
  { after: 21.94, from: 40.0, len: 13.6, what: "the village disappearing under the mud" },
];
const RAWLEN = (r: Raw) => G0 + r.len + G1;
const T = (t: number) => TITLE + t + RAWS.filter((r) => r.after < t - 1e-6).reduce((a, r) => a + RAWLEN(r), 0);
const Ts = (t: number) => T(t + 1e-3) - 1e-3;
const rawAt = (r: Raw) => T(r.after) + G0;
const TAKE_END = 38.22, TAIL = 1.0;
export const DUR = F(T(TAKE_END) + TAIL);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; cut?: FxCut["kind"] };
const POLY: [number, number][] = [[236, 522], [300, 478], [400, 476], [452, 520], [444, 598], [466, 652], [404, 634], [330, 612], [258, 592]];

const VO: Sh[] = [
  { a: 0, b: 4.16, vo: "On the hillside across the valley, people are shouting down at the village below.", src: "dhr30", from: 0.9, s0: 1.03, s1: 1.08 },
  { a: 4.16, b: 14.9, vo: "That's Dharali, a market village on the road to Gangotri … source of the Ganges. Tuesday the 5th of August 2025. (FrameToMap)",
    node: <FrameToMap still={GR + "dhr_still.jpg"} map={GR + "s2_before_wide.jpg"} iw={2699} ih={1278}
      home={{ x: 906, y: 409, label: "DHARALI", at: F(0.2) }} to={{ x: 2300, y: 946, label: "GANGOTRI", at: F(2.6) }}
      foldAt={4} foldLen={30} panAt={F(1.4)} panLen={F(3.6)} z0={2.6} z1={1.45} date={{ label: "AUGUST 5, 2025", at: F(8.0) }} /> },
  { a: 14.9, b: 16.38, vo: "The shouting doesn't stop. (slow replay, reframed)", src: "dhr_rep_a", from: 0.0, s0: 1.18, s1: 1.24, fx: 0.4, fy: 0.55, cut: "blurDip" },
  { a: 16.38, b: 21.94, vo: "A debris flow carries rock, mud and whole trees, so it's far denser than floodwater. (slow replay of the houses going)", src: "dhr_rep_b", from: 0.2, s0: 1.14, s1: 1.26, fx: 0.42, fy: 0.5, cut: "blurDip" },
  { a: 21.94, b: 31.55, vo: "190 rescued … 43 missing … more than 70 presumed dead, most of them never found. (BuriedOutline)", cut: "glitch",
    node: <BuriedOutline before={GR + "s2_before_fan.jpg"} after={GR + "s2_after_fan.jpg"} iw={1600} ih={900} poly={POLY} origin={[452, 690]} focus={[380, 560]}
      drawAt={8} spreadAt={F(2.3)} spreadLen={F(2.6)} z0={1.25} z1={1.55} beforeLabel="DHARALI, APRIL 2025" afterLabel="DHARALI, NOVEMBER 2025" /> },
  { a: 31.55, b: 35.3, vo: "People called it a cloudburst. An expert team later ruled out a glacial lake, (the Kheer Ganga's catchment above the village)", cut: "blurDip",
    node: <Aerial src={GR + "s2_after_wide.jpg"} iw={2699} ih={1278} spot={[760, 430, 1030, 900]} z0={1.25} z1={1.5} label="KHEER GANGA" boxAt={8} labelAt={16} /> },
  { a: 35.3, b: TAKE_END + TAIL, vo: "and the cause is still argued over. (slow replay: the last of the village going under)", src: "dhr_rep_c", from: 0.0, s0: 1.1, s1: 1.2, fx: 0.5, fy: 0.5 },
];
const SHOTS: Sh[] = [
  ...VO.map((s) => ({ ...s, a: Ts(s.a), b: s.b > TAKE_END ? T(TAKE_END) + (s.b - TAKE_END) : T(s.b) })),
  ...RAWS.map((r, i) => ({ a: rawAt(r) - G0, b: rawAt(r) + r.len + G1, vo: "RAW " + r.what, src: "dhr30", from: r.from - G0, s0: 1.02, s1: 1.06, cut: (i === 0 ? "hard" : "blurDip") as FxCut["kind"] })),
].sort((p, q) => p.a - q.a);

const CUTS: FxCut[] = [{ at: F(TITLE), kind: "glitch", len: 10 }];
for (let i = 1; i < SHOTS.length; i++) {
  const k = SHOTS[i].cut; if (!k || k === "hard") continue;
  CUTS.push({ at: F(SHOTS[i].a), kind: k, len: k === "glitch" ? 8 : 12 });
}
// a blur-dip out of each replay into the next raw too
for (let i = 1; i < SHOTS.length; i++) if (SHOTS[i - 1].src?.startsWith("dhr_rep") && SHOTS[i].vo.startsWith("RAW") && !CUTS.some((c) => c.at === F(SHOTS[i].a))) CUTS.push({ at: F(SHOTS[i].a), kind: "blurDip", len: 12 });
export const ALLOW = CUTS.map((c) => `${(c.at / 30 - 0.3).toFixed(2)}-${(c.at / 30 + 0.5).toFixed(2)}`).join(",");
export const _SHOTS = SHOTS.map((s) => [s.a.toFixed(2), s.src, s.from, (s.b - s.a).toFixed(2)]);

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src + ".mp4"} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [TITLE - 0.05, "sfx_n2/glitch_02.wav", -24],
  [Ts(4.16) + 0.1, "sfx_n2/whoosh_02.wav", -30],          // the frame folds into the map
  [Ts(4.16) + 1.4, "sfx_n2/whoosh_03.wav", -33],          // up the valley
  [Ts(21.94) - 0.05, "sfx_n2/glitch_03.wav", -27],
  [Ts(21.94) + 2.3, X + "reverse_swell_1.wav", -30],     // the after image spreads
  [Ts(31.55), "sfx_n2/whoosh_01.wav", -32],
];

const parts: [number, number][] = [];
{ let a = 0; for (const r of RAWS) { parts.push([a, r.after]); a = r.after; } parts.push([a, TAKE_END]); }
const rawWin = RAWS.map((r) => [F(rawAt(r)), F(rawAt(r) + r.len)] as const);
const Music: React.FC = () => {
  const f = useCurrentFrame() + F(TITLE);
  let k = 1;
  for (const [a, b] of rawWin) k = Math.min(k, interpolate(f, [a - 18, a, b, b + 24], [1, 0, 0, 1], cl));
  const end = F(T(TAKE_END) + TAIL);
  return <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(95)} loop volume={() => dB(-13) * k * interpolate(f, [F(TITLE), F(TITLE) + 45, end - 60, end], [0, 1, 1, 0], cl)} />;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TITLE)} layout="none"><AbsoluteFill><TitleCard dur={F(TITLE)} title="THE TORRENT THAT BURIED DHARALI" bg={GR + "dhr_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={DUR - 30} layout="none"><FadeOut /></Sequence>
      {parts.map(([a, b], i) => (
        <Sequence key={"v" + i} from={F(Ts(a))} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map((r, i) => (
        <Sequence key={"r" + i} from={F(rawAt(r))} durationInFrames={F(r.len)} layout="none">
          <Audio src={staticFile(MD + "dhr_clean.wav")} startFrom={F(r.from)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(r.len) - 14, F(r.len) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(TITLE)} layout="none"><Music /></Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
const FadeOut: React.FC = () => { const f = useCurrentFrame(); return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, 29], [0, 1], cl) }} />; };
