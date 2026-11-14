// Theme Park #1 — the Steel Max slingshot, Feria de Abril, Seville (24 April 2026). Channel grammar (brand.tsx) + devices built for this case:
// CableTrace (masts + two cables drawn on the filmer's frame), a Blender slingshot model (even launch / one cable gone, swing into the mast),
// StepStrip (the stepped lowering as frames of the phone clip), CableHold (brackets close on the last cable's attachment), TwoSystems (coaster
// wheel assembly vs the slingshot's two cables on one 3-D board).
// Footage: sx = BlRSPQvw-NA (filmer's daylight clip: launch, the snap at 64.6, people run, the capsule against the mast, close-ups; live sound)
//          sm = lMdhTJ8_QEA (vertical phone clip, starts after the snap: the capsule hanging, the lowering, crews and police; its audio is an
//          added track -> always muted). sm's own cuts: windows chosen between them (0.3-3.4, 18.2-35.4, 44.6-51.1, 86.4-100.5, 110.4-120.4,
//          122.5-132.7, 147.1-150.6, 165.3-170.4, 186.9-194.0). sx: one source cut at 127.6.
// VO = one take (no count word), split only where the raws sit.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { CableTrace } from "../dev/TP01_CableTrace";
import { StepStrip } from "../dev/TP01_StepStrip";
import { CableHold } from "../dev/TP01_CableHold";
import { TwoSystems } from "../dev/TP01_TwoSystems";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", AS = C + "assets/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(143.0);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; node?: React.ReactNode; over?: React.ReactNode };

// VO parts (take s -> timeline s): A 0-19.12 @4.0 | B 19.12-27.99 @39.0 | C 27.99-40.40 @55.4 | D 40.40-47.16 @70.6 | E 47.16-55.16 @89.8 | F 55.16-end @107.2
const VO: [number, number, number][] = [[0, 19.12, 4.0], [19.12, 27.99, 39.0], [27.99, 40.40, 55.4], [40.40, 47.16, 80.6], [47.16, 55.16, 99.8], [55.16, 80.2, 117.2]];
// raws (sx with its own sound): [timeline a, b, source from]
const RAWS: [number, number, number][] = [[23.1, 38.7, 50.6], [48.1, 55.1, 81.0], [87.6, 99.6, 131.0], [108.0, 117.0, 158.0]];
// RAW 3 (cut sheet: the lowering, sm): sm 90.5-100.3 at 70.5-80.3; its sound is the cleaned sm track (music stripped -> voices only)
const RAW3: [number, number, number] = [70.5, 80.3, 5.5];

const SHOTS: Sh[] = [
  { a: 4.0, b: 8.9, vo: "It was the 24th of April 2026, on the strip of rides at the far end of the fair", src: "sx.mp4", from: 1.5, s0: 1.04, s1: 1.1, fy: 0.6,
    over: <><RedLabel text="APRIL 24, 2026" at={F(0.3)} hold={F(2.3)} /><RedLabel text="FERIA DE ABRIL, SEVILLE" at={F(2.9)} hold={F(1.8)} /></> },
  { a: 8.9, b: 13.9, vo: "that locals call the street of hell. A slingshot is about as simple as rides get. (the camera tilts up the masts)", src: "sx.mp4", from: 17.5, s0: 1.03, s1: 1.1, fy: 0.4,
    over: <RedLabel text="CALLE DEL INFIERNO" at={F(1.1)} hold={F(2.4)} /> },
  { a: 13.9, b: 17.5, vo: "Two tall masts, a capsule hung between them on two cables, (traced on the filmer's frame)",
    node: <CableTrace src={AS + "tp01_sx_38.png"} iw={848} ih={480} focus={[470, 260]} z0={1.0} z1={1.1}
      lines={[{ pts: [[247, 0], [112, 440]], at: 4, len: 14, w: 4 }, { pts: [[582, 0], [728, 470]], at: 10, len: 14, w: 4 },
        { pts: [[305, 0], [436, 385]], at: 70, len: 18 }, { pts: [[572, 68], [528, 378]], at: 76, len: 18 }]} /> },
  { a: 17.5, b: 23.1, vo: "and the cables fling it straight up like a catapult. It only works if both cables pull evenly. (Blender: even launch)", src: "sling.mp4", from: 0.3, s0: 1.0, s1: 1.05, fy: 0.4 },
  // RAW 1 23.1-38.7: launch, the snap (64.6), the cable whipping loose
  { a: 23.1, b: 38.7, vo: "RAW sx 50.6-66.2", src: "sx.mp4", from: 50.6, s0: 1.0, s1: 1.05, fy: 0.3 },
  { a: 38.7, b: 41.3, vo: "One cable broke. (0.5x replay of the snap, pushed in on the capsule)", src: "sx_replay.mp4", from: 1.4, s0: 1.55, s1: 1.75, fx: 0.55, fy: 0.15 },
  { a: 41.3, b: 45.9, vo: "The other held, and with nothing pulling against it, it swung the capsule sideways into a mast. (Blender: the swing; hit at 45.25)", src: "sling.mp4", from: 6.0, s0: 1.0, s1: 1.06, fx: 0.4, fy: 0.4 },
  { a: 45.9, b: 48.1, vo: "The people standing closest ran.", src: "sx.mp4", from: 66.5, s0: 1.05, s1: 1.1 },
  // RAW 2 48.1-55.1: the capsule against the mast, the crowd's voices
  { a: 48.1, b: 55.1, vo: "RAW sx 81-88", src: "sx.mp4", from: 81.0, s0: 1.02, s1: 1.08, fx: 0.4, fy: 0.4 },
  { a: 55.1, b: 58.1, vo: "Now the operators had a problem nobody wants.", src: "sm.mp4", from: 0.3, fill: true, s0: 1.0, s1: 1.04 },
  { a: 58.1, b: 62.7, vo: "A damaged capsule leaning on a mast, hanging off the one cable it had left.", src: "sx.mp4", from: 99.5, s0: 1.2, s1: 1.3, fx: 0.4, fy: 0.3 },
  { a: 62.7, b: 65.7, vo: "Lower it too fast and that cable might go as well.", src: "sm.mp4", from: 24.0, fill: true, s0: 1.02, s1: 1.07, fy: 0.3 },
  { a: 65.7, b: 70.4, vo: "So they brought it down in small steps. (StepStrip: five frames of the lowering)",
    node: <StepStrip bg={GR + "tp01_sm.mp4"} bgFrom={66} iw={480} ih={854} at={4} every={9} lineAt={52}
      frames={[{ src: AS + "tp01_sm_3.png", cap: [187, 283] }, { src: AS + "tp01_sm_30.png", cap: [132, 336] }, { src: AS + "tp01_sm_62.png", cap: [247, 408] }, { src: AS + "tp01_sm_96.png", cap: [240, 492] }, { src: AS + "tp01_sm_114.png", cap: [360, 516] }]} /> },
  // RAW 3 70.5-80.3: the lowering, step by step, near the base (sm, vertical)
  { a: 70.4, b: 80.4, vo: "RAW sm 90.4-100.4", src: "sm.mp4", from: 90.4, fill: true, s0: 1.0, s1: 1.05, fy: 0.45 },
  { a: 80.4, b: 82.3, vo: "The riders were still inside,", src: "sx.mp4", from: 176.0, s0: 1.08, s1: 1.14, fx: 0.4, fy: 0.3 },
  { a: 82.3, b: 84, vo: "pressed up against the blue mast,", src: "sm.mp4", from: 44.8, fill: true, s0: 1.03, s1: 1.08 },
  { a: 84, b: 87.6, vo: "with the whole capsule hanging off the one cable left beside them.", src: "sx.mp4", from: 121.0, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.4 },
  // RAW 4 77.6-89.6: the close-up, riders against the mast, the crowd below
  { a: 87.6, b: 99.6, vo: "RAW sx 131-143", src: "sx.mp4", from: 131.0, s0: 1.0, s1: 1.06, fx: 0.45, fy: 0.4 },
  { a: 99.6, b: 103.4, vo: "I'd love to tell you someone on the ground knew that last cable would hold. (brackets close on the cable's attachment)",
    node: <CableHold src={AS + "tp01_sx_150.png"} iw={848} ih={480} box={[352, 196, 492, 316]} at={F(0.5)} len={F(1.9)} zoom={2.0} /> },
  { a: 103.4, b: 104.8, vo: "Nobody did.", src: "sx.mp4", from: 144.0, s0: 1.1, s1: 1.14, fx: 0.4, fy: 0.5 },
  { a: 104.8, b: 108, vo: "The people underneath just stayed where they were and watched.", src: "sm.mp4", from: 166.0, fill: true, s0: 1.02, s1: 1.07, fy: 0.7 },
  // RAW 5 98-107: the close-up again, later
  { a: 108, b: 117, vo: "RAW sx 158-167", src: "sx.mp4", from: 158.0, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.35 },
  { a: 117, b: 119.5, vo: "Four people were hurt, all of them lightly,", src: "sm.mp4", from: 112.0, fill: true, s0: 1.03, s1: 1.08, fy: 0.6 },
  { a: 119.5, b: 122.8, vo: "and the two children were taken to a medical centre to be checked.", src: "sm.mp4", from: 123.0, fill: true, s0: 1.1, s1: 1.16, fy: 0.65 },
  { a: 122.8, b: 127.4, vo: "Seville police opened an investigation, and no cause has been published since.", src: "sm.mp4", from: 187.0, fill: true, s0: 1.03, s1: 1.09, fy: 0.6 },
  { a: 127.4, b: 130, vo: "Here's what I keep thinking about with slingshots.", src: "sx.mp4", from: 105.0, s0: 1.1, s1: 1.18, fx: 0.4, fy: 0.35 },
  { a: 130, b: 139.1, vo: "On a coaster, everything ... tucked away under the train. On a slingshot, the entire safety system is two cables hanging in plain view.",
    node: <TwoSystems left={GR + "tp01_cw.jpg"} right={AS + "tp01_sx_495.png"} riw={848} rih={480} bg={AS + "tp01_sx_495.png"} moveAt={F(4.3)} moveLen={F(1.1)} traceAt={F(6.6)}
      cables={[[[299, 0], [422, 410]], [[562, 37], [514, 410]]]} /> },
  { a: 139.1, b: 143, vo: "When one goes, the whole street gets to see it.", src: "sx.mp4", from: 7.0, s0: 1.04, s1: 1.1, fy: 0.6 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(8.9), kind: "blurDip", len: 12 },
  { at: F(13.9), kind: "blurDip", len: 12 },
  { at: F(38.7), kind: "blurDip", len: 12 },
  { at: F(48.1), kind: "blurDip", len: 12 },
  { at: F(65.7), kind: "glitch", len: 10 },
  { at: F(87.6), kind: "blurDip", len: 12 },
  { at: F(99.6), kind: "zoomHit", len: 10 },
  { at: F(119.5), kind: "blurDip", len: 12 },
  { at: F(122.8), kind: "blurDip", len: 12 },
  { at: F(130), kind: "whip", len: 10 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + "tp01_" + s.src!} n={F(s.b) - F(s.a)} from={s.from} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [13.95, "sfx_n2/whoosh_01.wav", -32],
  [39.7, X + "sub_drop_1.wav", -18],          // the snap, replayed
  [42.1, X + "metal_clank_3.wav", -26],       // model: the right cable lets go
  [45.2, X + "impact_2.wav", -22],            // model: the capsule meets the mast
  [45.3, X + "metal_clank_2.wav", -26],
  [65.65, "sfx_n2/glitch_03.wav", -28],
  ...[0, 1, 2, 3, 4].map((i) => [65.7 + (4 + 9 * i + 3) / 30, X + (i % 2 ? "metal_clank_1.wav" : "metal_clank_4.wav"), -27] as [number, string, number]), // each frame lands
  [99.5, "sfx_n2/whoosh_02.wav", -32],
  [130, "sfx_n2/whoosh_03.wav", -30],
];

// music: Epidemic ambient Music 4 (-11.9 LUFS file -> -22 dB = ~10 LU under the VO); out under every raw
const musicVol = (T: number) => {
  let v = interpolate(T, [4.0, 5.0], [0, 1], cl);
  for (const [a, b] of [...RAWS, RAW3]) v *= T < a - 0.6 || T > b + 0.9 ? 1 : T < a ? interpolate(T, [a - 0.6, a], [1, 0], cl) : T > b ? interpolate(T, [b, b + 0.9], [0, 1], cl) : 0;
  return v * interpolate(T, [141.5, 143.0], [1, 0], cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE STEEL MAX SLINGSHOT" bg={AS + "tp01_sx_495.png"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE01.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, from], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/tp01_sx_clean.wav")} startFrom={F(from)} volume={(f) => dB(-2) * interpolate(f, [0, 6, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(RAW3[0])} durationInFrames={F(RAW3[1]) - F(RAW3[0])} layout="none">
        <Audio src={staticFile(C + "media/tp01_sm85_clean.wav")} startFrom={F(RAW3[2])} volume={(f) => dB(0) * interpolate(f, [0, 6, F(RAW3[1] - RAW3[0]) - 12, F(RAW3[1] - RAW3[0])], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(4.0)} durationInFrames={F(71.0) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} volume={(f) => dB(-22) * musicVol(4.0 + f / 30)} />
      </Sequence>
      <Sequence from={F(79.4)} durationInFrames={F(143.0) - F(79.4)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(52)} volume={(f) => dB(-22) * musicVol(79.4 + f / 30) * interpolate(f, [0, 20], [0, 1], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
