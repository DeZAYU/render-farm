// Theme Park #15 — Öcher Bend, Aachen, 27 April 2022: a tower chain swing stops mid-ride with 24 aboard (four children) ~25 m up;
// the fire brigade's aerial platform takes them off. Footage: Quoyle23's own vertical phone clip (main, 352x640, real crowd sound ->
// the two raws; upload title says 2020, it is 2022), and a small channel's walk round the same spring Bend a week earlier
// (fair_a = source 35-62 s, fair_b = source 253.8-263.6 s; Freizeitpark.explorer09). Devices built for this case: SwingDiagram
// (2.5-D line diagram over the darkened footage: crown climbing while it spins, seats flying out, the dead stop, the 25 m bracket)
// + the Bendplatz on the NRW orthophoto (Aerial) + one Inset (the blankets). VO = one take, split for the two raws.
// Source cuts: main none; fair_a 25.9 (file s); fair_b 4.3 / 4.9 / 9.93. One camera carries the incident: same-camera joins use blur-dips.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { SwingDiagram } from "../dev/TP15_SwingDiagram";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(84.95);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };
const M = "main.mp4";

// VO take parts -> timeline (RAW AUDIT 3 Nov 2026, recoded by hand): A1 take 0-25.3 @4.0 | R1 29.3-37.3 (8 s) | A2 25.5-31.6 @37.3
// | R2 43.4-57.4 (14 s, the main raw) | B1 31.75-41.1 @57.4 | B2 41.25-46.15 @66.9 | C 46.3-end @71.95 (B1 -> B2 -> C one take, take gaps kept).
// Removed: old R3 (basket working, 56.0-61.0, in the commentary stretch) and old R4 (seats over the crowd, after the open-seat line).
// Raw sound = the clip's crowd, through rawclean.py --force (the fair's music removed, voices kept): media/main_clean.wav.
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.56, vo: "It's late on Wednesday the 27th of April 2022,", src: M, from: 2.5, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4,
    over: <RedLabel text="APRIL 27, 2022" at={F(0.9)} hold={F(2.3)} /> },
  { a: 7.56, b: 11.17, vo: "it's cold, and the spring fair is on at the Bendplatz in Aachen. (NRW orthophoto, the Bendplatz boxed)",
    node: <Aerial src={GR + "dop.jpg"} iw={3000} ih={1820} spot={[1200, 640, 1780, 1210]} z0={1.0} z1={1.35} label="BENDPLATZ, AACHEN" boxAt={F(1.0)} labelAt={F(1.5)} /> },
  { a: 11.17, b: 13.0, vo: "People there call themselves Öcher, (the spring Bend at dusk)", src: "fair_a.mp4", from: 5.0, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 13.0, b: 15.99, vo: "so this is the Öcher Bend, the city's own fair. (the fair at night, its crowd)", src: "fair_b.mp4", from: 5.6, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 15.99, b: 22.0, vo: "On a chain swing, the seats hang on chains from a spinning crown that rises up the tower as it turns. (SwingDiagram: rise + spin)",
    node: <SwingDiagram bg={GR + M} bgFrom={50} rise={[F(2.6), F(5.4)]} stopAt={F(9.0)} /> },
  { a: 22.0, b: 25.11, vo: "This one stops dead mid-ride and won't lower its seats. (the real swing, stopped, seats up)", src: M, from: 30.0, fill: true, s0: 1.1, s1: 1.16, fx: 0.6, fy: 0.25 },
  { a: 25.11, b: 29.3, vo: "Twenty-four people, four of them children, are left about twenty-five metres up. (SwingDiagram: stopped, 25 m)",
    node: <SwingDiagram bg={GR + M} bgFrom={66} rise={[0, 1]} stopAt={0} startUp markAt={F(2.4)} /> },
  // RAW 1 (cue OB 0:00-0:30): the stopped swing, seats raised round the lit tower (8 s, main has no source cuts)
  { a: 29.3, b: 37.3, vo: "RAW: the stopped swing, crowd below", src: M, from: 66.0, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.35 },
  { a: 37.3, b: 39.67, vo: "Police called it a technical defect. (the crown, close)", src: M, from: 45.0, fill: true, s0: 1.35, s1: 1.42, fx: 0.72, fy: 0.12 },
  { a: 39.67, b: 43.4, vo: "With the seats stuck up there, the only way down was a fire brigade ladder. (the platform's boom and basket)", src: M, from: 10.0, fill: true, s0: 1.25, s1: 1.32, fx: 0.25, fy: 0.22 },
  // RAW 2 (cue OB 0:30-1:00), the main raw: the aerial platform's basket beside the seats, 14 s played through
  { a: 43.4, b: 57.4, vo: "RAW: basket at the seats, crowd sound", src: M, from: 20.0, fill: true, s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.3 },
  { a: 57.4, b: 59.71, vo: "The firefighters handed out blankets. (white-framed zoom on the basket: the case's one Inset)",
    node: <Inset src={GR + M} from={36.0} box={0.34} ar={0.8} pos="22% 22%" drift={0.08} /> },
  { a: 59.71, b: 63.31, vo: "A chain swing is the ride parents pick because it looks gentle. (the Bend's rides at dusk)", src: "fair_a.mp4", from: 12.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  { a: 63.31, b: 66.75, vo: "This one left four kids sitting in the night air, twenty-five metres up.", src: M, from: 75.0, fill: true, s0: 1.3, s1: 1.38, fx: 0.55, fy: 0.3 },
  // was a second Inset (audit: one per case): now a slow push in on one open seat on the phone panel
  { a: 66.75, b: 71.95, vo: "There's nothing around you on one of these. It's an open seat hanging on chains, and that's all. (slow push: one seat)", src: M, from: 85.0, fill: true, s0: 1.2, s1: 1.5, fx: 0.42, fy: 0.3 },
  { a: 71.95, b: 73.83, vo: "They were up there for about an hour.", src: M, from: 60.0, fill: true, s0: 1.12, s1: 1.16, fx: 0.5, fy: 0.3 },
  { a: 73.83, b: 78.55, vo: "Rescue workers checked all twenty-four afterwards, and nobody was seriously hurt. (down to the crowd)", src: M, from: 93.0, fill: true, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 78.55, b: 82.08, vo: "Police said they were still deciding whether to open an investigation. (the Bend at night)", src: "fair_b.mp4", from: 0.4, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 82.08, b: 84.95, vo: "I couldn't find out what they decided. (the tower, still lit)", src: M, from: 112.5, fill: true, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.4 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.56), kind: "whip", len: 10 },       // to the aerial
  { at: F(15.99), kind: "zoomHit", len: 10 },   // into the diagram
  { at: F(22.0), kind: "blurDip", len: 12 },    // diagram -> real
  { at: F(25.11), kind: "blurDip", len: 12 },   // real -> diagram (stopped)
  { at: F(29.3), kind: "blurDip", len: 12 },    // diagram -> raw
  { at: F(37.3), kind: "blurDip", len: 10 },    // main -> main
  { at: F(39.67), kind: "blurDip", len: 10 },
  { at: F(43.4), kind: "blurDip", len: 10 },
  { at: F(57.4), kind: "blurDip", len: 10 },
  { at: F(63.31), kind: "blurDip", len: 10 },
  { at: F(66.75), kind: "blurDip", len: 10 },
  { at: F(71.95), kind: "blurDip", len: 10 },
  { at: F(73.83), kind: "blurDip", len: 10 },
  { at: F(82.08), kind: "glitch", len: 8 },
]

// the phone clip is vertical: shown whole in a white-framed panel over a bright blurred copy of itself (no dark side bars), eased push inside
const Vert: React.FC<{ s: Sh }> = ({ s }) => {
  const f = useCurrentFrame(); const n = F(s.b) - F(s.a); const u = Math.min(1, f / Math.max(1, n - 1));
  const k = (s.s0 ?? 1) + ((s.s1 ?? s.s0 ?? 1) - (s.s0 ?? 1)) * (u * u * (3 - 2 * u));
  const H = 1000, W = H * 352 / 640;
  const v = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(GR + s.src!)} startFrom={Math.round((s.from ?? 0) * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(1.0) saturate(1.2)", transform: `scale(${1.25 + 0.03 * u})` }}>{v({ width: "100%", height: "100%", objectFit: "cover", objectPosition: "70% 35%" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: (1080 - H) / 2, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: `${(s.fx ?? 0.5) * 100}% ${(s.fy ?? 0.5) * 100}%` }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.fill) return <FilmLook_FX grain={0.08}><Vert s={s} /></FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [7.5, "sfx_n2/whoosh_01.wav", -28],
  [15.95, "sfx_n2/whoosh_02.wav", -30],
  [18.6, X + "riser_2.wav", -32],            // the crown climbing
  [24.95, X + "metal_clank_4.wav", -28],     // the dead stop (cut to the stopped diagram)
  [25.2, X + "sub_drop_1.wav", -30],
  [57.45, X + "camera_shutter_2.wav", -30],   // the zoom
  [66.8, X + "wind_gust_1.wav", -32],       // the open seat in the night air
  [82.03, "sfx_n2/glitch_03.wav", -30],
]
const RAWS: [number, number, number][] = [[29.3, 37.3, 66.0], [43.4, 57.4, 20.0]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE CHAIN SWING THAT STUCK" bg={GR + "title.jpg"} pos="50% 30%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {([[4.0, 0, 25.3], [37.3, 25.5, 31.6], [57.4, 31.75, 41.1], [66.9, 41.25, 46.15]] as const).map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      <Sequence from={F(71.95)} layout="none"><Audio src={staticFile("vor/CASE15.mp3")} startFrom={F(46.3)} /></Sequence>
      {RAWS.map(([a, b, src], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(-8) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 3), dipped under the two raws */}
      <Sequence from={F(3.6)} durationInFrames={F(84.95) - F(3.6)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(50)} volume={(f) => {
          const t = f / 30 + 3.6; const duck = RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
          return dB(-19) * interpolate(f, [0, 30, F(78.95), F(81.35)], [0, 1, 1, 0], cl) * (0.15 + 0.85 * duck);
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
