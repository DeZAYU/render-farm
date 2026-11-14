// Natural Disasters #8 — The avalanche hits Everest Base Camp (25 Apr 2015). One clip exists (a climber at base camp, reposted by Raquel
// Sharp; 640x352): it is spent entirely on the two raws the cut sheet sets (the cloud pouring down; the cloud reaching the tents and the
// camera ducking), so every VO line around them is a device with real information: QuakeReach (Blue Marble relief: Everest -> the Gorkha
// epicentre 222 km west -> true-scale fronts rolling back east to Everest) and PeakFall (a real photo of the camp under Pumori, two
// parallax layers, the fall line from the face to the tents). The outcome sits on Pumori itself in clear weather. No slow motion (cut sheet).
// VO = one take ("This avalanche…", no count word), split twice for the raws. Source cuts: ebc 6.93 (finger over the lens follows to 12),
// 34.1 (inside the tent) — R1 ends before 6.93, R2 ends at 34.0. 7-12 (finger) is never used.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { TitleCard } from "../brand";
import { QuakeReach } from "../dev/ND08_QuakeReach";
import { PeakFall } from "../dev/ND08_PeakFall";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO1 take 0-17.75 @4.0 | R1 ebc 0.3-6.8 @21.75 | VO2 take 17.75-19.5 @28.5 over ebc 14.25-16.0, which runs
// straight on into R2 ebc 16.0-34.0 @30.25 | VO3 take 19.5-end @48.55 | tail
const V1 = 4.0, R1 = 21.75, V2 = 28.5, R2 = V2 + 1.75, V3 = R2 + 18.0 + 0.3, END = V3 + (25.88 - 19.5) + 2.0;
export const DUR = F(END);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: V1, b: V1 + 9.3, vo: "This avalanche didn't start on Everest. Just before noon on Saturday the 25th of April 2015, a magnitude 7.8 earthquake hit Nepal. (QuakeReach)",
    node: <QuakeReach src={GR + "nepal.jpg"} swingAt={F(1.9)} swingLen={70} pulseAt={F(6.1)} kmPerFrame={3.4} dateLabel="APRIL 25, 2015" epiLabel="GORKHA, 11:56 AM" peakLabel="EVEREST" /> },
  { a: V1 + 9.3, b: R1, vo: "The shaking broke a huge mass of snow and ice off Pumori, the peak above Base Camp. 359 climbers were at Base Camp. (PeakFall)",
    node: <PeakFall src={GR + "littents.jpg"} iw={1280} ih={854} split={0.47} peakAt={[612, 196]} at={F(1.4)} len={F(2.6)} peakLabel="PUMORI" campLabel="EVEREST BASE CAMP" campAt={F(5.7)}
      path={[[655, 250], [640, 318], [588, 372], [505, 422], [420, 468]]} /> },
  { a: R1, b: V2, vo: "RAW 1: the cloud pours off the mountain toward the camp", src: "ebc.mp4", from: 0.3, s0: 1.02, s1: 1.07 },
  { a: V2, b: R2, vo: "The yellow tents are the camp. (runs straight on into R2)", src: "ebc.mp4", from: 14.25, s0: 1.0, s1: 1.0 },
  { a: R2, b: V3 - 0.3, vo: "RAW 2: the cloud reaches the tents, the camera ducks", src: "ebc.mp4", from: 16.0, s0: 1.0, s1: 1.06, fy: 0.55 },
  { a: V3 - 0.3, b: END, vo: "At least 24 people never came home from Everest that day, the worst single day the mountain has ever had. (Pumori in clear weather, slow push onto the face)",
    src: GR + "ebcview.jpg", still: true, s0: 1.04, s1: 1.22, fx: 0.3, fy: 0.62 },
];

const CUTS: FxCut[] = [
  { at: F(V1), kind: "glitch", len: 10 },
  { at: F(V1 + 9.3), kind: "blurDip", len: 12 },
  { at: F(R1), kind: "glitch", len: 8 },
  { at: F(V2), kind: "blurDip", len: 12 },     // same camera, 7 s later in the source
  { at: F(V3 - 0.3), kind: "blurDip", len: 18 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [V1 - 0.05, "sfx_n2/glitch_02.wav", -24],
  [V1 + 6.1, X + "sub_drop_2.wav", -20],        // the quake (the fronts leave the epicentre)
  [V1 + 6.3, X + "boom_5.wav", -26],
  [V1 + 9.3, "sfx_n2/whoosh_01.wav", -31],
  [R1 - 0.05, "sfx_n2/glitch_03.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(V1)} layout="none"><AbsoluteFill><TitleCard dur={F(V1)} title="THE AVALANCHE AT BASE CAMP" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} /></AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split for the two raws */}
      <Sequence from={F(V1)} durationInFrames={F(17.75)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} endAt={F(17.75)} /></Sequence>
      <Sequence from={F(V2)} durationInFrames={F(19.5 - 17.75)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(17.75)} endAt={F(19.5)} /></Sequence>
      <Sequence from={F(V3)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(19.5)} /></Sequence>
      {/* raws: the clip's own sound (wind, voices, the blast), out before the VO */}
      <Sequence from={F(R1)} durationInFrames={F(6.5)} layout="none">
        <Audio src={staticFile(MD + "ebc_clean.wav")} startFrom={F(0.3)} volume={(f) => dB(-1) * interpolate(f, [0, 5, F(6.5) - 14, F(6.5) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(R2)} durationInFrames={F(18.0)} layout="none">
        <Audio src={staticFile(MD + "ebc_clean.wav")} startFrom={F(16.0)} volume={(f) => dB(-1) * interpolate(f, [0, 8, F(18.0) - 14, F(18.0) - 2], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file -> -15 dB, ~10 LU under the VO); out under both raws */}
      <Sequence from={F(V1)} durationInFrames={F(R1 + 0.8 - V1)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(12)} volume={(f) => dB(-15) * interpolate(f, [0, 30, F(R1 - V1) - 10, F(R1 + 0.8 - V1)], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(V3 - 0.6)} durationInFrames={F(END - V3 + 0.6)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(48)} volume={(f) => dB(-15) * interpolate(f, [0, 30, F(END - V3) - 30, F(END - V3 + 0.6)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
