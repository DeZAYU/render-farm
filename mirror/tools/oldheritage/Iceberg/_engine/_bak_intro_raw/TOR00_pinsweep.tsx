// Tornado video — INTRO (rebuilt 3 Nov 2026 twice; owner: "no raw in intro, just VO with 3D motion or clip", then "looks pretty good" but wants
// real 3-D motion "showing many cases"). Countdown video: no iceberg, no clip sound anywhere; the intro VO runs straight through from 0.5 s.
// Washington IL wedge -> the lot the next morning -> glitch into PinSweep (TOR00_PinSweep: the 23 North American cases pin in one by one on a
// tilted NASA Blue Marble plate of the US with red place + year labels, the camera gliding west -> east on "twenty-five times people were
// standing right there") -> STORM CHASERS (Greenfield: a chase car, radar on the dash) on "A few were there on purpose" -> a semi blown over
// beside an ordinary driver on I-75 (Ocala) on "Most of them weren't" -> Moore carport -> Joplin ER -> Chapman wedge -> blur-dip into the title.
// Backup of the cold-open version: _engine/_bak_intro_raw/TOR00.tsx.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { VideoTitle } from "../dev/TOR00_VideoTitle";
import { RedLabel } from "../brand";
import { PinSweep, PX, PY, type Pin, type Feat, type CamKey } from "../dev/TOR00_PinSweep";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(20.0);
const V = 0.5; // VO (INTRO.mp3, whole) starts here
const T = 16.2; // title (VO "Let's begin." at V+15.70)

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; fill?: boolean; node?: React.ReactNode; over?: React.ReactNode };
// graded windows (media/*.mp4 cut from the raw clips): lanc 99.6 / clem 82.0 / carport 48.0 / er 106.0 (6 fps CCTV, the lights drop at +1.0) /
// wedge 215.5 / titlebg 300.0 (+2.8) / chase = TOR14 forry 128.4 (source cut at 127.5) / semi = TOR17 dash 4.0 / us_bm = NASA GIBS Blue Marble
// featured (worst three, west -> east): Moore #3, Joplin #2, Fairdale #1; the other 20 North American cases fade in together as context
const FEATS: Feat[] = [
  { lon: -97.49, lat: 35.34, label: "MOORE, OKLAHOMA · 2013", drop: 16, out: 70 },
  { lon: -94.51, lat: 37.08, label: "JOPLIN, MISSOURI · 2011", drop: 92, out: 146 },
  { lon: -88.9, lat: 42.11, label: "FAIRDALE, ILLINOIS · 2015", drop: 172, out: 226 },
];
const CTX: Pin[] = [
  [-104.15, 39.27], [-97.75, 49.91], [-97.98, 44.37], [-97.05, 42.01], [-96.24, 41.29], [-97.02, 38.97], [-97.43, 38.14], [-97.14, 37.71],
  [-97.62, 35.42], [-94.46, 41.31], [-92.91, 42.05], [-89.41, 40.7], [-84.67, 45.03], [-87.17, 38.66], [-88.64, 36.74], [-84.87, 38.2],
  [-86.84, 34.17], [-87.57, 33.21], [-84.16, 31.58], [-82.14, 29.19],
].map(([lon, lat]) => ({ lon, lat }));
const k = (f: number, lon: number, lat: number, s: number, dx = 0, dy = 0): CamKey => ({ f, x: PX(lon) + dx, y: PY(lat) + dy, s });
const CAM: CamKey[] = [
  k(0, -99.0, 34.2, 0.66, 60, 0), k(20, -97.49, 35.34, 0.78, 60, 0), k(66, -97.3, 35.45, 0.8, 60, 0), k(94, -94.51, 37.08, 0.78, 60, 0),
  k(146, -94.35, 37.18, 0.8, 60, 0), k(174, -88.9, 42.11, 0.78, 60, 0), k(214, -88.8, 42.05, 0.8, 60, 0), k(240, -94.5, 38.8, 0.5),
];
const M0 = 0, M1 = 8.0; // PinSweep from the first frame to "...when one arrived."
const SHOTS: Sh[] = [
  { a: M0, b: M1, vo: "Tornadoes used to be something most people heard about the next morning. These are twenty-five times people were standing right there when one arrived. (PinSweep v2: Moore, Joplin, Fairdale featured; 20 context pins)",
    node: <PinSweep src={GR + "us_bm.jpg"} feats={FEATS} context={CTX} cam={CAM} ctx0={212} ctx1={238} /> },
  { a: M1, b: 9.65, vo: "A few were there on purpose. (Greenfield: inside a chase car, radar on the dash; STORM CHASERS)", src: "chase.mp4", from: 0.3, s0: 1.02, s1: 1.08,
    over: <RedLabel text="STORM CHASERS" at={4} hold={F(1.65) - 12} y={0.13} /> },
  { a: 9.65, b: 11.01, vo: "Most of them weren't. (Ocala: an ordinary driver, the semi beside them blown over on I-75)", src: "semi.mp4", from: 1.0, s0: 1.02, s1: 1.07 },
  { a: 11.01, b: 13.24, vo: "And in some of these, the tornado got there (Moore: the black tornado beyond the carport)", src: "carport.mp4", from: 0.5, s0: 1.03, s1: 1.09 },
  { a: 13.24, b: 14.95, vo: "before any warning did. (Joplin: the ER waiting room as the lights drop)", src: "er.mp4", from: 0.3, s0: 1.02, s1: 1.06, fill: true },
  { a: 14.95, b: T, vo: "Worst first. (Chapman: the wedge)", src: "wedge.mp4", from: 0.5, s0: 1.04, s1: 1.1 },
];

const CUTS: FxCut[] = [
  { at: F(M1), kind: "glitch", len: 10 }, // map -> footage
  { at: F(T), kind: "blurDip", len: 14 }, // into the title
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => s.node ? <FilmLook_FX grain={0.06}>{s.node}</FilmLook_FX> : (
  <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} fill={s.fill} /></FilmLook_FX>
);

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [M1 - 0.05, "sfx_n2/glitch_02.wav", -26], // map -> footage
  [11.01, X + "wind_gust_1.wav", -30],    // the carport clip is silent
  [13.29, X + "sub_drop_1.wav", -22],     // the ER lights drop (silent CCTV)
  [13.74, X + "impact_2.wav", -24],
  [T - 0.1, "sfx_n2/whoosh_02.wav", -28], // into the title
  [T + 0.5, "sfx_n2/title_hit_01.wav", -26],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
          <Sequence from={F(T)} durationInFrames={DUR - F(T)} layout="none"><AbsoluteFill>
            <VideoTitle bg={GR + "titlebg.mp4"} bgFrom={2.8} ruleAt={F(1.5)} ruleAfter={1}
              lines={[{ text: "25 MOST DISTURBING", size: 112, at: F(0.25) }, { text: "TORNADO ENCOUNTERS", size: 112, at: F(0.55) }, { text: "EVER CAUGHT ON CAMERA", size: 58, at: F(1.6) }]} />
          </AbsoluteFill></Sequence>
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: the intro take, whole and continuous (no raw, no clip sound) */}
      <Sequence from={F(V)} layout="none"><Audio src={staticFile("vor/INTRO.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 5 from the first frame under the VO, swells into the title, out with it */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(20)} volume={(f) => dB(-13) * interpolate(f, [0, 15, F(T - 1.0), F(T), DUR - F(1.4), DUR], [0, 1, 1, 1.5, 1.5, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
