// Tornado #11 — Tsukuba, Ibaraki, Japan, Sunday 6 May 2012 (F3). Three witness clips: Junko Tateishi's short clip (JUNKO2, lEatd8alZA8)
// and her main clip (JUNKO, nV87QZ66KP8) from beside the pylon, and a golfer at Tsukuba International Country Club (GOLF, _LBvm4L2YQs).
// Devices for THIS case: SatDive (NASA Aqua MODIS of that afternoon: Japan, then the anvil of the storm sitting over Ibaraki, pins on
// Joso / Tokyo / Tsukuba), LightTable (the frame as a print on a light table, a loupe slides onto the debris skirt), JmaSheets (the JMA's own papers on a desk: the
// 7 May release says F2, the 8 June report lands on top and says F3; later its 17 km damage map lifts off the page), a 0.5x replay of the
// funnel over the golfer, Commons CC0 / GSDF CC BY-SA photos of Hojo for the outcome.
// VO: the take opens "Eleven takes us to Japan, where ..."; dropping only "Eleven" leaves a broken "takes us to Japan", so the case
// starts on "where tornadoes are usually small and over quickly" over the satellite view of Japan with the red JAPAN label (noted).
// Source cuts: GOLF 172.13 / 197.47 / 201.27 (RAW6 starts 173.0); JUNKO white frames 44-46 s avoided.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { SatDive } from "../dev/TOR11_SatDive";
import { JmaSheets } from "../dev/TOR11_JmaSheets";
import { LightTable } from "../dev/TOR11_LightTable";

const F = (s: number) => Math.round(s * 30);
const GR = "case/graded/", JM = "case/assets/jma/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(132.0);

// 3 Nov (owner: raws only at incident moments): RAW 2 (near-dup of RAW 1), RAW 3 (after the path-width line) and RAW 4 removed; the VO runs on.
const VO: [number, number, number][] = [[1.55, 25.4, 4.0], [25.4, 62.3, 36.85], [62.3, 65.8, 83.75], [65.8, 98.6, 98.25]];
// raws: [a, b, audio file, source from, gain dB]
const RAWS: [number, number, string, number, number][] = [
  [27.85, 36.85, "junko2", 2.0, 0], [73.75, 83.75, "golf", 84.0, -6], [87.25, 98.25, "golf", 173.0, 0],
];
type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: (d: number) => React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4, b: 7.02, vo: "where tornadoes are usually small and over quickly. (Aqua MODIS, 6 May 2012: Japan)",
    node: () => <SatDive src={GR + "japan.jpg"} iw={2400} ih={2600} cam={[[0, 1250, 1450, 1.0], [91, 1440, 1640, 1.55]]} box={{ r: [1315, 1517, 1607, 1775], at: 34 }} label={{ text: "JAPAN", at: 6 }} /> },
  { a: 7.02, b: 10.26, vo: "Junko Tateishi was about five hundred metres from its path, by her own estimate,", src: "junko2.mp4", from: 14.0, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.5,
    over: <RedLabel text="JUNKO TATEISHI" at={12} hold={F(2.5)} /> },
  { a: 10.26, b: 13.8, vo: "with a pylon and power lines between them.", src: "junko.mp4", from: 20.0, s0: 1.03, s1: 1.1, fx: 0.6, fy: 0.45 },
  { a: 13.8, b: 17.55, vo: "It was twenty-five to one on Sunday the 6th of May 2012.", src: "junko2.mp4", from: 24.0, s0: 1.06, s1: 1.12, fx: 0.45, fy: 0.5,
    over: <RedLabel text="MAY 6, 2012" at={14} hold={F(3.0)} /> },
  { a: 17.55, b: 27.85, vo: "The tornado had just touched down in Joso City, in Ibaraki Prefecture north of Tokyo. It was heading for Tsukuba ... (Kanto, the anvil)",
    node: () => <SatDive src={GR + "kanto.jpg"} iw={2400} ih={2000} cam={[[0, 1100, 950, 1.05], [150, 1150, 880, 1.4], [309, 1270, 820, 1.85]]}
      pins={[{ name: "JOSO", p: [1191, 872], at: 50, dx: -70, dy: 40 }, { name: "TOKYO", p: [934, 1239], at: 124, small: true, dy: 44 }, { name: "TSUKUBA", p: [1294, 805], at: 184, dx: 60, dy: -50 }]}
      label={{ text: "IBARAKI PREFECTURE", at: 88 }} /> },
  { a: 27.85, b: 36.85, vo: "RAW 1 (JUNKO2 0:02-0:11): the funnel on the ground beside the power lines and pylon", src: "junko2.mp4", from: 2.0, s0: 1.0, s1: 1.05, fx: 0.45, fy: 0.5 },
  { a: 36.85, b: 40.62, vo: "That dark skirt at the bottom is soil and debris being torn up. (LightTable: the frame as a print, loupe on the skirt)",
    node: () => <LightTable src={GR + "junko2_f9.jpg"} iw={1920} ih={1080} focus={[0.53, 0.57]} mag={2.1} tag="SOIL + DEBRIS" tagAt={52} /> },
  { a: 40.62, b: 44.55, vo: "It was heading east-northeast, toward the rooftops of the Hojo district.", src: "junko.mp4", from: 30.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 44.55, b: 50.43, vo: "The Japan Meteorological Agency first rated it F2 and later raised it to F3. (JMA release 7 May / report 8 June)",
    node: () => <JmaSheets mode="rating" press={JM + "press.png"} report={JM + "report.png"} f2={[549, 1131, 825, 1172]} f2At={84} slideAt={118} f3={[530, 795, 806, 841]} f3At={146} /> },
  { a: 50.43, b: 56.18, vo: "It was moving at about sixty kilometres an hour, and it covered seventeen kilometres in eighteen minutes.", src: "junko.mp4", from: 36.0, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 56.18, b: 60, vo: "If it had turned toward her, she'd have had roughly thirty seconds.", src: "junko2.mp4", from: 28.5, s0: 1.08, s1: 1.16, fx: 0.4, fy: 0.55 },
  { a: 60, b: 64.85, vo: "Its path was up to five hundred metres wide, and it lifted at about seven minutes to one. (JMA damage map lifts off the page)",
    node: () => <JmaSheets mode="figure" map={JM + "map.png"} f2={[0, 0, 1, 1]} fig={[197, 197, 1455, 1127]} liftAt={6} target={[1250, 430]} /> },
  { a: 64.85, b: 70.7, vo: "At Tsukuba International Country Club, a golfer ducked into the shelter hut by the seventeenth hole.", src: "golf.mp4", from: 5.0, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.45,
    over: <RedLabel text="TSUKUBA INTERNATIONAL COUNTRY CLUB" at={16} hold={F(4.6)} size={40} /> },
  { a: 70.7, b: 72.2, vo: "That hut was built for rain.", src: "golf.mp4", from: 18.0, s0: 1.08, s1: 1.12, fx: 0.5, fy: 0.5 },
  { a: 72.2, b: 73.75, vo: "It's coming his way. (JUNKO 0:58, silent: the funnel closing in; breaks the golf run)", src: "junko.mp4", from: 58.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 73.75, b: 83.75, vo: "RAW 5 (GOLF 1:24-1:34): almost overhead", src: "golf.mp4", from: 84.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  { a: 83.75, b: 87.25, vo: "It weakens right over him, and then it drops what it was carrying. (0.5x replay)", src: "golf_replay.mp4", from: 0.05, s0: 1.2, s1: 1.32, fx: 0.5, fy: 0.35 },
  { a: 87.25, b: 98.25, vo: "RAW 6 (GOLF 2:53-3:04): debris falling out of the sky", src: "golf.mp4", from: 173.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  { a: 98.25, b: 101.2, vo: "Seventy-six homes were destroyed,", src: "hojo1.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5,
    over: <RedLabel text="HOJO, TSUKUBA" at={10} hold={F(2.4)} /> },
  { a: 101.2, b: 104.62, vo: "a hundred and fifty-eight half destroyed and four hundred partly damaged,", src: "gsdf_house.jpg", still: true, s0: 1.1, s1: 1.03, fx: 0.4, fy: 0.5 },
  { a: 104.62, b: 107.7, vo: "and about twenty-four thousand homes lost power.", src: "hojo2.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.4, fy: 0.4 },
  { a: 107.7, b: 111.96, vo: "Thirty-seven people had minor injuries, and one boy lost his life.", src: "apt.jpg", still: true, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 111.96, b: 115.6, vo: "In the Hojo area, Japan's national building research institute (JMA: the Hojo damage, 7 May aerial)",
    node: () => <JmaSheets mode="figure" map={JM + "map.png"} f2={[0, 0, 1, 1]} fig={[197, 1127, 1455, 2066]} liftAt={4} target={[840, 1620]} /> },
  { a: 115.6, b: 120.39, vo: "found a wooden house turned completely over along with its concrete mat foundation.", src: "gsdf_out.jpg", still: true, s0: 1.04, s1: 1.11, fx: 0.5, fy: 0.55 },
  { a: 120.39, b: 123.49, vo: "Wooden houses with no foundation were scattered outright,", src: "junko.mp4", from: 80.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 123.49, b: 127.75, vo: "and a steel garage was knocked over with its column base pulled out of the ground. (GSDF: steel beams)", src: "gsdf_beam.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.55 },
  { a: 127.75, b: 132, vo: "It's still one of the strongest tornadoes Japan has ever recorded.", src: "junko2.mp4", from: 18.5, s0: 1.02, s1: 1.12, fx: 0.42, fy: 0.5 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(36.85), kind: "blurDip", len: 12 },
  { at: F(44.55), kind: "glitch", len: 8 },
  { at: F(60.0), kind: "blurDip", len: 12 },
  { at: F(64.85), kind: "whip", len: 10 },
  { at: F(70.7), kind: "blurDip", len: 10 },   // same golf camera, other moment (jump-cut guard)
  { at: F(73.75), kind: "blurDip", len: 10 },
  { at: F(83.75), kind: "blurDip", len: 12 },
  { at: F(87.25), kind: "blurDip", len: 12 },
  { at: F(98.25), kind: "glitch", len: 10 },
  { at: F(111.96), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  const d = F(s.b) - F(s.a);
  if (s.node) return <>{s.node(d)}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={d} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [17.6, "sfx_n2/whoosh_03.wav", -32],
  [36.95, "sfx_n2/real/paper_2.wav", -28],
  [44.5, "sfx_n2/glitch_01.wav", -27], [44.7, "sfx_n2/real/paper_2.wav", -24], [48.5, "sfx_n2/real/page_turn_2.wav", -22],
  [60.1, "sfx_n2/real/paper_3.wav", -26],
  [64.85, "sfx_n2/whoosh_01.wav", -30],
  [98.2, "sfx_n2/glitch_03.wav", -27],
  [112.0, "sfx_n2/real/paper_3.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="A SUNDAY LUNCHTIME IN IBARAKI" bg={GR + "junko2_title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t0, t1, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0)} layout="none"><Audio src={staticFile("vor/CASE11.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, n, from, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("case/media/" + n + "_clean.wav")} startFrom={F(from)} volume={(f) => dB(g) * interpolate(f, [0, 8, F(b - a) - 14, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (-11.9 LUFS file -> -22 dB), only under the VO; out for every raw (they carry wind and voices) */}
      {VO.filter(([t0, t1]) => t1 - t0 > 3).map(([t0, t1, at], i) => (
        <Sequence key={"m" + i} from={F(at - 0.3)} durationInFrames={F(t1 - t0 + 0.3)} layout="none">
          <Audio src={staticFile("music/Music 4.mp3")} startFrom={F((at * 0.6) % 80)} volume={(f) => dB(-22) * interpolate(f, [0, 20, F(t1 - t0 + 0.3) - 16, F(t1 - t0 + 0.3)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
