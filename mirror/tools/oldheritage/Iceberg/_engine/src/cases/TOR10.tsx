// Tornado #10 — Gaylord, Michigan, 20 May 2022 (EF3). One witness clip: a vertical phone video from a car on the M-32 commercial strip
// (HhC4YvoQnko, 240x426, real sound: rain, wind, debris). Devices for THIS case: PhoneTilt (the vertical clip kept vertical in a
// white-framed panel turning in 3-D over its blurred copy, for two raws), PlateTilt (NAIP flown 11 Aug 2022, twelve weeks after: the
// camera lowers onto the cleared lots of Nottingham Forest), NwsPhone (the NWS damage-survey statement re-typeset on a phone, tap on Start Time),
// a 0.5x replay of the debris cloud, NWS Gaylord's own survey photos (public domain, Commons), the brand Aerial on Pine Ridge Square.
// VO = one take, "Ten." dropped, split only where a raw plays. Source cut: 60.90 (to black) — the merged raw ends at 60.6.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { PhoneTilt } from "../dev/TOR10_PhoneTilt";
import { PlateTilt } from "../dev/TOR10_PlateTilt";
import { NwsPhone } from "../dev/TOR10_NwsPhone";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/", SH = "case/shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(81.4);

const VO: [number, number, number][] = [[0.6, 13.6, 11.0], [13.7, 45.9, 48.2]];
// raws: [timeline a, b, source from] — the clip's own sound plays only here
// 3 Nov (owner: raws only at incident moments): old RAW B (src 36.5-49) + RAW C (49-60.6) merged into one 24.1 s raw; the
// "first tornado to hit Gaylord since 1950" line now follows it.
const RAWS: [number, number, number][] = [[4.0, 11.0, 2.0], [24.0, 48.1, 36.5]];
type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; fill?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: (d: number) => React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.0, b: 11.0, vo: "RAW A (0:02-0:09): the commercial strip in the rain, traffic, wipers", node: () => <PhoneTilt src={GR + "gay.mp4"} from={2.0} yaw={[-10, 6]} /> },
  { a: 11.0, b: 13.7, vo: "The commercial strip in Gaylord, northern Michigan, (NAIP: the M-32 strip)",
    node: () => <Aerial src={GR + "strip.jpg"} iw={2600} ih={1750} spot={[610, 640, 1640, 790]} z0={1.02} z1={1.16} label="GAYLORD, MICHIGAN" boxAt={6} labelAt={14} /> },
  { a: 13.7, b: 17.0, vo: "at about twenty to four on Friday the 20th of May 2022.", src: "gay.mp4", from: 12.0, fill: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.55,
    over: <RedLabel text="MAY 20, 2022" at={14} hold={F(2.6)} /> },
  { a: 17.0, b: 22.0, vo: "It had first touched down at 3:35, back in Antrim County. (NWS survey statement)",
    node: (d) => <NwsPhone dur={d} bg={GR + "gay.mp4"} bgFrom={20.0} tapAt={38} big={["3:35 PM", "6 miles south of Elmira, Antrim County"]} credit="NWS Gaylord, Public Information Statement, May 21 2022" /> },
  { a: 22.0, b: 24.0, vo: "Somewhere up ahead, the rain has something in it. (the windshield, the cloud beyond)", src: "gay.mp4", from: 27.5, fill: true, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 24.0, b: 36.5, vo: "RAW (0:36-1:00.6, one continuous sound) part 1: the tornado and its debris cloud ahead over the road (PhoneTilt)", node: () => <PhoneTilt src={GR + "gay.mp4"} from={36.5} yaw={[-8, 5]} pitch={[2, -2]} zoom={[1.0, 1.05]} /> },
  { a: 36.5, b: 48.1, vo: "RAW part 2 (0:49-1:00.6): poles leaning, debris across the windshield (fill)", src: "gay.mp4", from: 49.0, fill: true, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.45 },
  { a: 48.1, b: 52.8, vo: "It was the first tornado to hit Gaylord since reliable records began in 1950. (0.5x replay, debris cloud, full-frame crop)", src: "gay_replay.mp4", from: 0.05, s0: 1.08, s1: 1.18, fx: 0.55, fy: 0.4 },
  { a: 52.8, b: 57.72, vo: "EF3, peak winds of a hundred and fifty, twenty-two minutes across town, (NWS photo + label)",
    src: "devast.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5, over: <RedLabel text="EF3 · 150 MPH" at={10} hold={F(4.2)} /> },
  { a: 57.72, b: 60.69, vo: "and the first EF3 in Michigan in over a decade. (NWS aerial: the track through the woods)", src: "path.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 60.69, b: 63.4, vo: "Two people in the Nottingham Forest mobile home community (NAIP Aug 2022: the cleared lots)",
    node: () => <PlateTilt src={GR + "strip.jpg"} iw={2600} ih={1750} spot={[690, 705, 830, 950]} z0={1.3} z1={2.0} boxAt={26} label="NOTTINGHAM FOREST" labelAt={34} /> },
  { a: 63.4, b: 65.81, vo: "didn't make it, and forty-four were hurt. (NWS: the mobile home community)", src: "mhc.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 65.81, b: 67.5, vo: "Two hundred and ten homes", src: "shifted.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 67.5, b: 69.18, vo: "and thirty businesses were damaged.", src: "ef3house.jpg", still: true, s0: 1.1, s1: 1.04, fx: 0.5, fy: 0.55 },
  { a: 69.18, b: 71.55, vo: "FEMA turned down the request for federal aid,", src: "sighome.jpg", still: true, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 71.55, b: 74.0, vo: "and the rebuilt Pine Ridge Square shopping centre (NWS: Hobby Lobby, its anchor)", src: "hobby.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.45, fy: 0.5,
    over: <RedLabel text="PINE RIDGE SQUARE" at={10} hold={F(1.9)} /> },
  { a: 74.0, b: 76.38, vo: "wasn't finished until March 2024. (NAIP 11 Aug 2022: still being rebuilt)",
    node: () => <Aerial src={GR + "strip.jpg"} iw={2600} ih={1750} spot={[930, 700, 1240, 900]} z0={1.9} z1={2.15} label="AUGUST 2022" boxAt={6} labelAt={14} /> },
  { a: 76.38, b: 81.4, vo: "Local donors later raised nearly two million dollars for the people it hit. (NWS: the trees and the street)", src: "trees.jpg", still: true, s0: 1.14, s1: 1.0, fx: 0.5, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(24.0), kind: "blurDip", len: 12 },
  { at: F(36.5), kind: "blurDip", len: 12 },   // framing change inside the raw (sound continuous)
  { at: F(48.1), kind: "blurDip", len: 12 },
  { at: F(52.8), kind: "glitch", len: 8 },
  { at: F(60.69), kind: "whip", len: 10 },
  { at: F(71.55), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const d = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(d)}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={d} from={s.from} still={s.still} fill={s.fill} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_01.wav", -24],
  [11.0, "sfx_n2/whoosh_01.wav", -32],
  [17.0, "sfx_n2/real/static_3.wav", -34],
  [52.75, "sfx_n2/glitch_03.wav", -26],
  [60.69, "sfx_n2/whoosh_02.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="DRIVING INTO THE DEBRIS" bg={GR + "gay_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t0, t1, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      {/* the clip's own sound, only inside the raws, faded to 0 before the VO returns */}
      {RAWS.map(([a, b, from], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("case/media/gay_clean.wav")} startFrom={F(from)} volume={(f) => dB(-4) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1 (-18.3 LUFS file, -15 dB ≈ 10 LU under the VO), out under each raw, back after */}
      {[[11.0, 24.0, 0], [48.1, 81.4, 18]].map(([a, b, off], i) => (
        <Sequence key={"m" + i} from={F(a - 0.3)} durationInFrames={F(b - a + 0.3)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off + 30)} volume={(f) => dB(-17) * interpolate(f, [0, 20, F(b - a + 0.3) - 16, F(b - a + 0.3)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
