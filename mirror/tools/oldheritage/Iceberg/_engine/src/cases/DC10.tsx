// Dashcam #10 — Androscoggin Mill, Jay, Maine, 15 Apr 2020 ~noon: Digester A (166 ft, ~260,000 gal, 1964) ruptures and takes out
// Digester B; trucker Rick Pratt's dashcam, waiting in the log-truck line, films the fireball, the black column and the debris.
// One source: fLrqRNwXlxQ (HASETFIN repost), used 0:05-0:43 only (0:01-0:04 is a still of the gate, 0:45+ appended aerials of
// unknown source). media/main.mp4 = src 5.0-43.5 (media t = src - 5), 1080p50 -> 30. Its audio is an added music bed only
// (rawclean: music in 45 of 45 s; whisper hears no speech): the clip is treated as silent; raws carry real SFX (boom, sub, wind,
// rain-like debris patter, idling truck) timed to the picture. Pratt's swearing is therefore not in the edit at all.
// VO = one take (CASE10.mp3), split only at sentence ends where a raw plays:
//   A 0-39.26 @4.00 | R1 43.26-64.26 (src 5.4-26.4 (media starts on a 0.3 s fade from the gate still), main: calm, fireball, column climbs and spreads) |
//   B 39.26-49.34 @64.26 | R2 74.34-83.64 (src 34.0-43.3: the column spreading over the road, debris) |
//   C 49.34-end @83.64, VO ends 158.43, hold to 159.25.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel } from "../brand";
import { CamA, K2, Still, TypeTitle } from "../dev/DC08_kit";
import { FocusPull } from "../dev/DC10_FocusPull";
import { ReportLeaf } from "../dev/DC10_ReportLeaf";
import { TwoVantage } from "../dev/DC10_TwoVantage";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const m = (src: number) => src - 5;
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
// v2: +6.2 s — RAW 2 is now the scale-shack phone clip (15.5 s); everything from the old 83.64 on is shifted by X()
const SH = 6.2, X = (t: number) => (t >= 83.6 ? t + SH : t);
export const DUR = F(159.25 + SH);

const D: React.FC<{ n: number; src: number; a: [number, number, number]; b: [number, number, number]; rate?: number; filter?: string }> = ({ n, src, a, b, rate, filter }) =>
  <CamA src={M} from={m(src)} rate={rate} filter={filter} keys={K2(n, a, b)} />;
/** last shot: the column frozen at its height, colour drained, slow push */
const Drain: React.FC<{ n: number }> = ({ n }) =>
  <CamA src={M} t={m(20.0)} keys={K2(n, [1.15, 0.32, 0.4], [1.32, 0.3, 0.36])} filter="saturate(0.35) brightness(0.9)" />;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 12.65, vo: "A pulp digester is a steel pressure cooker the size of a building ... paper. (the mill at Jay, 1973, EPA Documerica)",
    node: (n) => <Still src={GR + "mill73.jpg"} n={n} s0={1.04} s1={1.16} fx={0.62} fy={0.45} /> },
  { a: 12.65, b: 22.16, vo: "The one called Digester A, at the Androscoggin Mill in Jay, Maine, stood about 166 feet tall and held some 260,000 gallons. (NAIP, the mill)",
    node: () => <Aerial src={GR + "naip.jpg"} iw={2400} ih={1350} spot={[780, 40, 1560, 820]} z0={1.0} z1={1.2} label="ANDROSCOGGIN MILL, JAY, MAINE" boxAt={30} labelAt={56} /> },
  { a: 22.16, b: 28.21, vo: "It was built in 1964, and the mill had changed hands just 66 days before this footage was shot. (the builder's sign on the mill, 1973)",
    node: (n) => <Still src={GR + "ipsign.jpg"} n={n} s0={1.04} s1={1.12} fx={0.35} fy={0.5} /> },
  { a: 28.21, b: 43.26, vo: "Around noon ... trucker Rick Pratt ... His dashcam was pointed at the load ... Look just to the left of those logs, over the trees, where the mill stands. (FocusPull)",
    node: () => <FocusPull src={M} t={0.4} pullAt={322} releaseAt={432} spot={[0.27, 0.27, 0.12]}
      keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: 230, s: 1.22, x: 0.52, y: 0.56 }, { f: 300, s: 1.22, x: 0.52, y: 0.56 }, { f: 380, s: 1.3, x: 0.36, y: 0.38 }, { f: 420, s: 1.3, x: 0.36, y: 0.38 }, { f: 451, s: 1.0, x: 0.5, y: 0.5 }]} />,
    over: <><RedLabel text="APRIL 15, 2020" at={F(1.3)} hold={F(3.2)} /><RedLabel text="RICK PRATT'S DASHCAM" at={F(8.2)} hold={F(2.6)} size={42} /></> },
  // RAW 1 (main, silent source + SFX): fireball over the trees left of the load, the black column climbs and spreads
  { a: 43.26, b: 64.26, vo: "RAW 1 src 5.4-26.4", node: (n) => <D n={n} src={5.4} a={[1.0, 0.5, 0.5]} b={[1.12, 0.38, 0.4]} /> },
  { a: 64.26, b: 66.68, vo: "Pratt's reaction isn't one I can repeat. (0.5x, tight on the column as it climbs)",
    node: (n) => <D n={n} src={9.5} rate={0.5} a={[1.9, 0.28, 0.28]} b={[2.1, 0.28, 0.26]} /> },
  { a: 66.68, b: 74.34, vo: "Within seconds, wet brown debris was raining down on his truck ... a moment before. (the load and the sky above it)",
    node: (n) => <D n={n} src={26.6} a={[1.45, 0.55, 0.32]} b={[1.6, 0.55, 0.36]} /> },
  // RAW 2: a worker's phone from the scale shack (iJWLnRBcE2I, the filmer's own upload): the column, then the brown debris hammering
  // the windshield, wipers going. Audio = Demucs no-vocals stem (wind, debris hits): the filmer swears through all of it.
  { a: 74.34, b: 89.84, vo: "RAW 2 phone src 37.0-52.5", node: () => <Inset src={GR + "phone.mp4"} from={37.0} ar={608 / 1080} box={0.29} drift={0.05} label="FROM THE MILL'S SCALE SHACK" labelAt={24} /> },
  { a: 83.64, b: 89.79, vo: "The digester had split open while running at about 160 pounds per square inch and over 300 degrees, (TwoVantage: dashcam + scale-shack phone, 0.5x)",
    node: () => <TwoVantage wide={M} wideFrom={m(11.5)} tall={GR + "phone.mp4"} tallFrom={1.0} rate={0.5} /> },
  { a: 89.79, b: 97.0, vo: "and it destroyed the second digester next to it. About 170 employees and contractors were on site, many of them at lunch. (Pixelle photo via CSB)",
    node: (n) => <Still src={GR + "digester.jpg"} n={n} s0={1.03} s1={1.14} fx={0.6} fy={0.5} /> },
  { a: 97.0, b: 101.59, vo: "Nobody was seriously hurt, and only a few were treated for breathing problems. (0.5x, the top of the column)",
    node: (n) => <D n={n} src={19.0} rate={0.5} a={[2.2, 0.2, 0.22]} b={[2.35, 0.2, 0.2]} /> },
  { a: 101.59, b: 106.35, vo: "With a blast that size and that many people around, I'd put that down to plain luck. (0.35x, the fireball, wide)",
    node: (n) => <D n={n} src={7.0} rate={0.35} a={[1.0, 0.5, 0.5]} b={[1.2, 0.35, 0.38]} /> },
  { a: 106.35, b: 122.82, vo: "Federal safety investigators found ... 70 percent ... September 2019 ... weld repair practices (ReportLeaf: CSB report pp. 5-6)",
    node: () => <ReportLeaf sheet={GR + "csb_spread.png"} sw={3440} sh={2200} bg={GR + "digester.jpg"}
      stops={[{ f: 0, x: 620, y: 280, z: 0.9, h: 150 }, { f: 40, x: 620, y: 280, z: 0.9, h: 150 }, { f: 118, x: 2566, y: 1290, z: 1.0, h: 70 },
        { f: 238, x: 2566, y: 1290, z: 1.0, h: 70 }, { f: 262, x: 2570, y: 1604, z: 1.0, h: 46 }, { f: 352, x: 2570, y: 1604, z: 1.0, h: 46 },
        { f: 378, x: 2560, y: 1872, z: 0.96, h: 120 }, { f: 494, x: 2560, y: 1880, z: 1.02, h: 120 }]} /> },
  { a: 122.82, b: 129.9, vo: "OSHA, the workplace safety agency, opened its own inspection but didn't issue a fine, because no OSHA standard applied. (0.5x, smoke over the road)",
    node: (n) => <D n={n} src={38.0} rate={0.5} a={[1.1, 0.5, 0.45]} b={[1.25, 0.6, 0.42]} /> },
  { a: 129.9, b: 137.0, vo: "The damage came to about $350 million. The owner, Pixelle, sued a Florida contractor, (NAIP Sept 2021: the pulp mill after)",
    node: (n) => <Still src={GR + "naipt.jpg"} n={n} s0={1.03} s1={1.15} fx={0.62} fy={0.45} />, over: <RedLabel text="ANDROSCOGGIN MILL · 2021" at={F(1.0)} hold={F(3.4)} size={42} /> },
  { a: 137.0, b: 143.08, vo: "saying welds it had repaired in 2018 and 2019 had failed, and there's been no ruling reported. (0.5x, the column over the trees)",
    node: (n) => <D n={n} src={23.0} rate={0.5} a={[1.6, 0.36, 0.36]} b={[1.5, 0.4, 0.36]} /> },
  { a: 143.08, b: 153.9, vo: "The company never rebuilt the pulp side ... the machines in Jay had stopped for good. (0.5x, the smoke spreading)",
    node: (n) => <D n={n} src={35.0} rate={0.5} a={[1.0, 0.5, 0.5]} b={[1.18, 0.42, 0.45]} /> },
  { a: 153.9, b: 159.25, vo: "When the digester blew, the mill employed 515 people. (the column frozen, colour drained)",
    node: (n) => <Drain n={n} /> },
];

const CUTS0: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.65), kind: "blurDip", len: 12 },
  { at: F(22.16), kind: "blurDip", len: 12 },
  { at: F(28.21), kind: "glitch", len: 10 },
  ...[43.26, 64.26, 66.68, 74.34, 83.64, 97.0, 101.59, 122.82, 137.0, 143.08, 153.9].map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),
  { at: F(89.79), kind: "glitch", len: 10 },
  { at: F(106.35), kind: "blurDip", len: 12 },
  { at: F(129.9), kind: "glitch", len: 10 },
];

const CUTS: FxCut[] = CUTS0.map((c) => ({ ...c, at: F(X(c.at / 30)) }));

const PART: [number, number, number | null][] = [[4.0, 0, 39.26], [64.26, 39.26, 49.34], [89.84, 49.34, null]];
const RAWS: [number, number][] = [[43.26, 64.26], [74.34, 89.84]];
// silent source: real recordings timed to the picture (fireball first visible ~src 6.9 -> T 45.2; the sound a beat late at distance)
const FX: [number, number, string, number, number, number][] = [   // at, len (s), file, gain dB, fade in, fade out
  [43.26, 21.0, "sfx_n2/real/car_engine_2.wav", -30, 0.3, 1.0],
  [45.35, 6.0, "sfx_n2/real/boom_4.wav", -6, 0.0, 1.5],
  [45.4, 5.0, "sfx_n2/real/sub_drop_1.wav", -10, 0.0, 1.5],
  [47.0, 14.0, "sfx_n2/real/wind_gust_1.wav", -20, 1.5, 3.0],
  [56.5, 7.7, "sfx_n2/real/rain_9.wav", -24, 2.5, 1.2],
];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [28.16, "sfx_n2/glitch_01.wav", -28], [89.74, "sfx_n2/glitch_03.wav", -28],
  [106.4, "sfx_n2/real/page_turn_2.wav", -28], [129.85, "sfx_n2/glitch_02.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill>
            <TypeTitle title="THE PAPER MILL BLAST" place="JAY, MAINE · 2020" bg={GR + "title.jpg"} dur={F(4.0)} />
          </AbsoluteFill></Sequence>
          {SHOTS.map((s0, i) => {
            const s = s0.a >= 83.6 ? { ...s0, a: X(s0.a), b: X(s0.b) } : s0;
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX>{s.over}</AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {FX.map(([a, len, file, g, fi, fo], i) => (
        <Sequence key={"fx" + i} from={F(a)} durationInFrames={F(len)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, Math.max(1, F(fi)), F(len) - F(fo), F(len)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      <Sequence from={F(74.34)} durationInFrames={F(89.84) - F(74.34)} layout="none">
        <Audio src={staticFile(C + "media/phone_novox.wav")} startFrom={F(37.0)} volume={(f) => dB(2) * interpolate(f, [0, 6, F(15.5) - 14, F(15.5) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 1 (-15 dB: -18.3 LUFS file, matched to Music 5 at -13), ducked under the raws; two passes */}
      {([[4.0, 126.2, 4], [125.2, 165.45, 40]] as const).map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a;
            const duck = RAWS.reduce((mm, [ra, rb]) => Math.min(mm, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.15 + 0.85 * (ra - t) / 0.8 : t > rb ? 0.15 + 0.85 * (t - rb) / 0.6 : 0.15), 1);
            const env = k === 0 ? interpolate(t, [4.0, 5.0, 125.2, 126.2], [0, 1, 1, 0], cl) : interpolate(t, [125.2, 126.2, 164.0, 165.45], [0, 1, 1, 0], cl);
            return dB(-15) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(X(t))} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
