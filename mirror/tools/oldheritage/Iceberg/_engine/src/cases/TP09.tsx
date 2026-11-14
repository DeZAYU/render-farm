// Theme Park #09 — Stargate jams upside down, German-American Volksfest, Berlin (8 Aug 2009). A short case. Footage = joonudsch's 1-min
// upload (Y10YRJfm0Ig, 13 subs, 640x480 20 fps, upscaled to 1440x1080 30 fps; source cut at 31.1 avoided). The Local's article is behind a
// paywall now (body does not render), so no page; its figures are shown as devices instead.
// Devices built for this case: ArmStop (3 Nov audit, replaces FreezeBracket: rider head-down + white-line side view, arm stops over the top),
// MinuteBlocks (the 20 minutes before rescuers arrived, then the 25 more to bring them down, one block per minute).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { ArmStop } from "../dev/TP09_ArmStop";
import { MinuteBlocks } from "../dev/TP09_MinuteBlocks";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(56.0);

type Sh = { a: number; b: number; vo: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.0, b: 8.0, vo: "A short one. Saturday evening, the 8th of August 2009,", from: 1.0, s0: 1.02, s1: 1.08, fy: 0.3, over: <RedLabel text="AUGUST 8, 2009" at={F(1.0)} hold={F(2.5)} /> },
  { a: 8.0, b: 10.4, vo: "at Berlin's German-American Volksfest,", from: 35.5, s0: 1.03, s1: 1.08, over: <RedLabel text="GERMAN-AMERICAN VOLKSFEST, BERLIN" at={F(0.3)} hold={F(1.8)} size={40} /> },
  { a: 10.4, b: 13.5, vo: "a ride called Stargate jams while it's upside down. (ArmStop: rider head-down + ride side view, arm swings over the top and stops)", node: <ArmStop src={GR + "freeze.jpg"} focus={[1100, 420]} swingAt={8} swingLen={34} /> },
  // R1 13.5-25.5: crew on the platform, riders hanging, the sign
  { a: 13.5, b: 25.5, vo: "RAW", from: 5.0, s0: 1.0, s1: 1.05, fy: 0.35 },
  { a: 25.5, b: 30.4, vo: "According to The Local, fifteen people hung there, more than ten metres up,", from: 19.0, s0: 1.03, s1: 1.1, fy: 0.3 },
  { a: 30.4, b: 34.25, vo: "for about twenty minutes before the emergency services even arrived.", node: <MinuteBlocks part={1} bg={GR + "sg_smooth.mp4"} bgFrom={32.0} at={6} per={2} label="20 MIN" /> },
  // R2 34.25-44.25: the arm, riders hanging at the top
  { a: 34.25, b: 44.5, vo: "RAW", from: 40.0, s0: 1.0, s1: 1.05, fy: 0.3 },
  { a: 44.5, b: 48.4, vo: "It took roughly another twenty-five minutes to restart it and lower them.", node: <MinuteBlocks part={2} bg={GR + "sg_smooth.mp4"} bgFrom={36.0} at={4} per={2} label="+25 MIN" /> },
  { a: 48.4, b: 52.2, vo: "Two passengers went to hospital with shock and circulation problems, (the rescuers at the ride)", from: 55.2, s0: 1.02, s1: 1.07, fy: 0.4 },
  { a: 52.2, b: 56.0, vo: "and the ride was sealed while it was investigated. (the ride platform)", from: 26.4, s0: 1.03, s1: 1.1, fy: 0.4 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(10.4), kind: "zoomHit", len: 10 },
  { at: F(25.5), kind: "blurDip", len: 12 },
  { at: F(30.4), kind: "glitch", len: 8 },
  { at: F(44.5), kind: "blurDip", len: 12 },
  { at: F(52.2), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.1}><Shot_FX src={GR + "sg_smooth.mp4"} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const VO: [number, number, number][] = [[0.0, 9.5, 4.0], [9.5, 17.95, 25.8], [17.95, 28.7, 44.5]];
const RAW: [number, number, number][] = [[13.6, 25.5, 5.1], [34.35, 44.25, 40.1]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [30.35, "sfx_n2/glitch_03.wav", -28],
  [44.5, "sfx_n2/whoosh_01.wav", -32],
];
const duck = (t: number) => {
  let g = 1;
  for (const [a, b] of RAW) g = Math.min(g, interpolate(t, [a - 0.6, a, b - 0.2, b + 0.6], [1, 0.25, 0.25, 1], cl));
  return g;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="UPSIDE DOWN ON THE STARGATE" bg={GR + "title_still.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, t], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAW.map(([a, b, s], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/sg_clean.wav")} startFrom={F(s)} volume={(f) => dB(-5) * interpolate(f, [0, 8, F(b - a) - 12, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient, Music 5 at -13 dB (house level), from a different offset than the tornado cases */}
      <Sequence from={F(4.0)} durationInFrames={F(52.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(40)} volume={(f) => dB(-14) * duck(4.0 + f / 30) * interpolate(f, [0, 30, F(49.5), F(52.0)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
