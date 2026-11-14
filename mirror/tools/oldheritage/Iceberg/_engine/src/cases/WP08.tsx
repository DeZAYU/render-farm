// Workplace #08 — Caribbean Petroleum (CAPECO), Bayamón, Puerto Rico, 23 Oct 2009 ~00:23: a ship offloads gasoline into a tank whose
// gauge is stuck; the tank overflows, the vapour cloud reaches electrical equipment and explodes; 11 tanks lost, fire to the 25th.
// Sources (all OK in SOURCES.csv): main zP8-j4EhpnA (Kruz Rivera, night bystander, 320x180 -> 1920x1080), extra1 dmHIqsUgyUA (Omar
// Vazquez, the terminal's CCTV channels, SILENT, 486x360 -> 1440x1080, recorder mouse cursor delogo'd), extra2 IhGPLhO3G-c (Werius,
// morning at the perimeter fence, 320x240 -> 1440x1080).
// VO = one take (CASE08.mp3), split once at the end of "It was heard eleven miles away." (silence 26.92-27.29).
// ONE raw (WP_PLAN: VO 85 s > 70 s): the gate camera (CH 9) 14.6 s: the glow over the trees -> the blast whites out the camera ->
// shaking -> (blur-dip, the recorder's next clip) the yard lit red. The CCTV is silent, so the raw's sound is real SFX timed to the picture
// (Pixabay booms / sub / wind from sfx_n2/real, CC0 freesound fire bed in case/media/sfx).
// Blender (build/CASE08/assets/tank.py): fill (ship -> pipe -> cut-away tank, gasoline rising past the stuck float), spill (overflow out
// of the vents, vapour cloud to the electrical building, spark), alarm (the fix: separate high-level switch turns red, valve shuts).
// Devices (new, dev/WP08_*): StepReplay (stepped slow replay of the gate camera into the fireball), GateCams (three security cameras in
// a 3-D arc), DawnWipe (night clip swept into the morning clip of the same fence line).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { WP08_StepReplay } from "../dev/WP08_StepReplay";
import { WP08_GateCams } from "../dev/WP08_GateCams";
import { WP08_DawnWipe } from "../dev/WP08_DawnWipe";

const F = (s: number) => Math.round(s * 30);
const G = "case/graded/", MP = "case/maps/";
const KR = G + "kr.mp4", CCT = G + "cct.mp4", WE = G + "we.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(105.4);

// timeline (s): title 0-4 | VO A (0-27.15) @4.00 | RAW 31.40-46.00 (CCT 35.0-46.0, blur-dip, 46.75-50.35) | VO B (27.15-end) @46.35
// (tl = vo + 19.2), VO ends 104.22, hold to 105.4
const PART: [number, number, number | null][] = [[4.0, 0, 27.15], [46.35, 27.15, null]];
const RAW: [number, number] = [31.4, 46.0];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const V = (src: string, from: number, o: { s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean } = {}) => (n: number) =>
  <Shot_FX src={src} from={from} n={n} s0={o.s0 ?? 1.0} s1={o.s1 ?? 1.07} fx={o.fx ?? 0.5} fy={o.fy ?? 0.5} fill={o.fill} />;

const SHOTS: Sh[] = [
  { a: 4.0, b: 7.32, vo: "Caribbean Petroleum, Bayamón, Puerto Rico. (the night fire over the trees)",
    node: (n) => <>{V(KR, 77.0, { s0: 1.0, s1: 1.08, fy: 0.45 })(n)}<RedLabel text="CARIBBEAN PETROLEUM · BAYAMÓN, PUERTO RICO" at={8} hold={F(2.6)} size={42} /></> },
  { a: 7.32, b: 11.39, vo: "October 2009. Twenty past midnight, on the 23rd. (terminal camera CH 5, before)",
    node: (n) => <>{V(CCT, 0.8, { s0: 1.0, s1: 1.06, fill: true })(n)}<RedLabel text="OCTOBER 23, 2009" at={4} hold={F(2.2)} size={44} /></> },
  { a: 11.39, b: 16.58, vo: "A ship was offloading gasoline into a storage tank, and the tank's gauge said there was room. (Blender fill)",
    node: (n) => V(MP + "fill.mp4", 0, { s0: 1.0, s1: 1.0 })(n) },
  { a: 16.58, b: 25.55, vo: "According to the CSB, the gauge was faulty ... already overflowing. The gasoline formed a vapour cloud, the cloud reached electrical equipment, (Blender spill)",
    node: (n) => V(MP + "spill.mp4", 0, { s0: 1.0, s1: 1.0 })(n) },
  { a: 25.55, b: 29.37, vo: "and the blast registered like a magnitude two point eight earthquake. (CH 11 office shaking)",
    node: (n) => V(CCT, 10.0, { s0: 1.05, s1: 1.12, fy: 0.55 })(n) },
  { a: 29.37, b: 31.4, vo: "It was heard eleven miles away. (the glow far off behind the buildings)",
    node: (n) => V(KR, 253.0, { s0: 1.12, s1: 1.02 })(n) },
  { a: 31.4, b: 42.4, vo: "RAW (CCTV CH 9, silent + real SFX): the glow grows over the trees, the blast whites out the camera, shaking (src 35.0-46.0)",
    node: (n) => V(CCT, 35.0, { s0: 1.0, s1: 1.05, fy: 0.4, fill: true })(n) },
  { a: 42.4, b: 46.0, vo: "RAW cont. (blur-dip, the recorder's next clip): the yard lit red (src 46.75-50.35)",
    node: (n) => V(CCT, 46.75, { s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.3, fill: true })(n) },
  { a: 46.35, b: 49.07, vo: "This is the first CSB case on the iceberg. (StepReplay: the whiteout again, stepped, into the fireball)",
    node: (n) => <WP08_StepReplay src={CCT} t0={41.9} n={n} rate={0.55} step={10} box={[0.58, 0.06, 0.92, 0.36]} zoom={1.25} /> },
  { a: 49.07, b: 52.87, vo: "The Chemical Safety Board is a small independent federal agency (the fire wall)",
    node: (n) => V(KR, 33.5, { s0: 1.0, s1: 1.08 })(n) },
  { a: 52.87, b: 56.66, vo: "that looks into chemical accidents the way the NTSB looks into crashes. (the fire from the road)",
    node: (n) => V(KR, 46.0, { s0: 1.06, s1: 1.0, fx: 0.45 })(n) },
  { a: 56.66, b: 61.03, vo: "It can't fine anyone. It can only find out what happened and tell everyone else. (fire along the horizon, blue lights)",
    node: (n) => V(KR, 90.0, { s0: 1.0, s1: 1.07, fy: 0.55 })(n) },
  { a: 61.03, b: 65.17, vo: "The usual fix is a second high level alarm that works separately from the gauge. (Blender alarm)",
    node: (n) => V(MP + "alarm.mp4", 0, { s0: 1.0, s1: 1.0 })(n) },
  { a: 65.17, b: 68.9, vo: "That way, one broken instrument can't hide an overflow on its own. (close fire wall)",
    node: (n) => V(KR, 216.5, { s0: 1.0, s1: 1.08, fy: 0.45 })(n) },
  { a: 68.9, b: 72.64, vo: "Eleven tanks were destroyed, and the fire burned until the 25th. (morning: tanks and flame)",
    node: (n) => V(WE, 40.5, { s0: 1.02, s1: 1.1, fy: 0.55 })(n) },
  { a: 72.64, b: 77.66, vo: "The pressure wave damaged buildings around the terminal and hit cars moving on the roads nearby. (GateCams)",
    node: (n) => <WP08_GateCams src={CCT} n={n} cams={[{ from: 6.7, to: 9.1 }, { from: 15.9, to: 21.8 }, { from: 25.4, to: 33.0 }]} /> },
  { a: 77.66, b: 80.87, vo: "By daylight, the tanks along the perimeter were still burning. (DawnWipe night -> morning)",
    node: (n) => <WP08_DawnWipe n={n} w0={0.06} w1={0.82} night={{ src: KR, from: 240.5 }} day={{ src: WE, from: 18.0 }} /> },
  { a: 80.87, b: 86.23, vo: "Three people were injured, nobody lost their life, and about fifteen hundred residents were evacuated. (ambulance, people on the road)",
    node: (n) => V(KR, 148.5, { s0: 1.0, s1: 1.07 })(n) },
  { a: 86.23, b: 92.43, vo: "CAPECO filed for bankruptcy the following August, and the EPA took over the cleanup. (morning smoke)",
    node: (n) => V(WE, 49.5, { s0: 1.0, s1: 1.08, fy: 0.4 })(n) },
  { a: 92.43, b: 96.87, vo: "The CSB's final report came out in October 2015, six years later, (morning: the tanks burning)",
    node: (n) => V(WE, 32.0, { s0: 1.08, s1: 1.0 })(n) },
  { a: 96.87, b: 101.09, vo: "and called for automatic overfill prevention on big fuel tanks. (water on the burning tank)",
    node: (n) => V(WE, 86.0, { s0: 1.0, s1: 1.07, fx: 0.45 })(n) },
  { a: 101.09, b: 105.4, vo: "One gauge reading wrong at midnight took out the whole terminal. (the night fire along the horizon, slow push)",
    node: (n) => V(KR, 100.0, { s0: 1.0, s1: 1.1, fy: 0.5 })(n) },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(42.4), kind: "blurDip", len: 12 },   // same camera, the recorder's next clip
  { at: F(46.35), kind: "blurDip", len: 14 },  // raw -> the replay (same camera)
  { at: F(61.03), kind: "glitch", len: 10 },   // into the fix
];

// SFX for the silent raw (timeline s, file, gain dB, file offset s)
const SFX: [number, string, number, number?][] = [
  [31.4, "sfx_n2/real/wind_gust_1.wav", -24],
  [39.33, "sfx_n2/real/boom_4.wav", -1],         // the whiteout (src 42.93 -> tl 39.33)
  [39.33, "sfx_n2/real/sub_drop_2.wav", -5],
  [39.5, "sfx_n2/real/impact_3.wav", -10],
  [39.9, "sfx_n2/real/wind_gust_1.wav", -9],    // the pressure wave rocks the camera
  [41.6, "case/media/sfx/fire_big_cc0.wav", -9],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE GAUGE THAT LIED" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* the raw's sound: real SFX on the silent CCTV, all faded out before the VO returns */}
      {SFX.map(([at, src, g, off], i) => {
        const end = RAW[1] - 0.15;
        return (
          <Sequence key={"s" + i} from={F(at)} durationInFrames={F(end - at)} layout="none">
            <Audio src={staticFile(src)} startFrom={F(off ?? 0)} volume={(f) => dB(g) * interpolate(f, [0, 3, F(end - at) - 20, F(end - at)], [0, 1, 1, 0], cl)} />
          </Sequence>
        );
      })}
      {/* music: Epidemic ambient Music 4 (-11.9 LUFS file) ~-22 dB, ducked under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(105.4 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = t < RAW[0] - 0.8 || t > RAW[1] + 0.6 ? 1 : t < RAW[0] ? (RAW[0] - t) / 0.8 : t > RAW[1] ? (t - RAW[1]) / 0.6 : 0;
          return dB(-22) * interpolate(t, [4.0, 5.0, 103.9, 105.4], [0, 1, 1, 0], cl) * (0.08 + 0.92 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
