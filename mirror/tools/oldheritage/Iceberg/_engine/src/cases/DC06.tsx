// Dashcam #06 — Riverside Drive near E 66th Place, Tulsa, Thu 15 Aug 2019 ~7:30 PM (camera clocks 19:31:34 at impact): a northbound
// Jeep Grand Cherokee crosses the grass median and hits a southbound Tulsa PD SUV on the driver's side while the inside camera shows
// the officer looking down at a phone. One source: the TPD release (front + inside camera side by side, then inside only) via
// RealBodyCam (ew1RaSOyy0A, 1280x720, LiveLeak bug in the top letterbox bar: cropped out). Media crops (all from that file):
// front.mp4 / inner.mp4 = the two panes cut to 16:9 (src 0–37), rel.mp4 = both panes as released (src 0–37), solo.mp4 = inside
// camera alone (src 0–67.6). Sound: silent to 30, impact, then the car's own "Sync" system placing a 911 call (37.7–54.2).
// VO = one take (CASE06.mp3), split only at the two raws (both at sentence ends):
//   A take 0–30.75 @4.00 | R1 34.75–56.75 (src 14.0–36.0, main: the phone, the glances, the Jeep over the median, the hit, pink
//   flare) | B take 30.75–37.05 @56.75 | R2 63.05–80.25 (src 37.4–54.6: inside camera, dazed officer, "Sync will attempt to call
//   911... the 911 assist call is being placed") | C take 37.05–end @80.25, VO ends 117.39, hold to 118.3.
// Devices: MedianLine (NAIP aerial, southbound lane + grass median), SyncReplay (0.5x front replay, inside cam slides in synced),
// StripSlide (real WSET/KTUL page as three paper strips, the neighbour's quote nearest). Officer unnamed (never released); face left
// unblurred (on-duty officer in the department's own release; the VO asks the viewer to watch his eyes).
import React from "react";
import { AbsoluteFill, Audio, Freeze, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { MedianLine } from "../dev/DC06_MedianLine";
import { SyncReplay } from "../dev/DC06_SyncReplay";
import { StripSlide } from "../dev/DC06_StripSlide";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const FR = GR + "front.mp4", IN = GR + "inner.mp4", REL = GR + "rel.mp4", SOLO = GR + "solo.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(118.3);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

/** the release as published: both panes side by side (1236x466) across the frame, over a bright soft copy of itself */
const Release: React.FC<{ from?: number; t?: number; n: number; s0?: number; s1?: number }> = ({ from = 0, t, n, s0 = 1.0, s1 = 1.05 }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const v = (st: React.CSSProperties) => t !== undefined
    ? <Freeze frame={0}><OffthreadVideo src={staticFile(REL)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
    : <OffthreadVideo src={staticFile(REL)} startFrom={Math.round(from * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {v({ position: "absolute", left: -200, top: -200, width: 2320, height: 1480, objectFit: "cover", filter: "blur(30px) brightness(.55) saturate(.8)" })}
      <div style={{ position: "absolute", left: 960 - 960 * s, top: 540 - 362 * s, width: 1920 * s, height: 724 * s, boxShadow: "0 20px 60px rgba(0,0,0,.6)" }}>
        {v({ width: "100%", height: "100%" })}
      </div>
    </AbsoluteFill>
  );
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 6.44, vo: "Most police dashcams look out at the road, (front camera)", node: (n) => <Cam src={FR} from={0} keys={K(n, [1.04, 0.5, 0.5], [1.1, 0.5, 0.52])} /> },
  { a: 6.44, b: 11.14, vo: "but one of the two in this Tulsa cruiser points straight back at the officer driving it. (inside camera, push to him)",
    node: (n) => <Cam src={IN} from={0} keys={K(n, [1.04, 0.45, 0.5], [1.35, 0.3, 0.45])} /> },
  { a: 11.14, b: 16.91, vo: "It's about 7:30 on a Thursday evening, August 15, 2019, and he's heading (front camera, the road south)",
    node: (n) => <Cam src={FR} from={4.7} keys={K(n, [1.12, 0.5, 0.55], [1.22, 0.52, 0.55])} />, over: <RedLabel text="AUGUST 15, 2019 · 7:30 PM" at={F(0.6)} hold={F(4.2)} size={42} /> },
  { a: 16.91, b: 22.89, vo: "south on Riverside Drive near East 66th Place, a wide road with a grassy median down the middle. (MedianLine)",
    node: () => <MedianLine src={GR + "naip.jpg"} iw={3200} ih={1800} z0={1.05} z1={1.9} f0={[1600, 760]} f1={[1650, 700]} traceAt={6} traceLen={48} glowAt={F(3.94)}
      lane={[[1525, 200], [1565, 350], [1600, 500], [1645, 650], [1672, 735], [1692, 790]]} median={[[1545, 160], [1585, 330], [1622, 490], [1667, 640], [1702, 750], [1745, 905], [1782, 1050]]}>
      <RedLabel text="RIVERSIDE DRIVE, TULSA" at={F(1.0)} hold={F(4.6)} size={42} />
    </MedianLine> },
  { a: 22.89, b: 26.35, vo: "The department's release shows both cameras side by side. (the release layout)", node: (n) => <Release from={10.5} n={n} s0={0.94} s1={1.0} /> },
  { a: 26.35, b: 28.95, vo: "There's a phone in his hands, down near his lap. (inside camera, tight on the phone)",
    node: (n) => <Cam src={IN} from={4.7} keys={K(n, [2.0, 0.27, 0.8], [2.15, 0.27, 0.82])} /> },
  { a: 28.95, b: 34.75, vo: "Watch his eyes on the inside camera, and count how often they drop to that screen over the next half minute. (tight on his face)",
    node: (n) => <Cam src={IN} from={7.3} keys={K(n, [1.5, 0.28, 0.42], [1.7, 0.27, 0.4])} /> },
  // RAW 1 (main): the release layout live, from the glances to the hit and the pink flare
  { a: 34.75, b: 56.75, vo: "RAW 1 (src 14.0-36.0)", node: (n) => <Release from={14.0} n={n} s0={1.0} s1={1.06} /> },
  { a: 56.75, b: 63.05, vo: "The Jeep Grand Cherokee came from the northbound lanes, crossed the median and hit him square on the driver's side. (SyncReplay)",
    node: () => <SyncReplay front={FR} inner={IN} from={28.6} splitAt={100} fKeys={[[0, 1.12, 0.45], [100, 1.4, 0.28], [189, 1.45, 0.3]]} iFocus={[0.28, 0.45]} /> },
  // RAW 2: inside camera alone, the car's system calling 911
  { a: 63.05, b: 80.25, vo: "RAW 2 (src 37.4-54.6)", node: (n) => <Cam src={SOLO} from={37.4} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.4, 0.45])} /> },
  { a: 80.25, b: 85.32, vo: "The officer went to the hospital with a sore jaw and elbow, most likely from the airbag. (inside, the spent airbag beside him)",
    node: (n) => <Cam src={SOLO} from={55.0} keys={K(n, [1.25, 0.3, 0.55], [1.4, 0.25, 0.6])} /> },
  { a: 85.32, b: 87.3, vo: "The Jeep's driver wasn't hurt. (front camera frozen on the Jeep coming over)",
    node: (n) => <Cam src={FR} t={29.95} keys={K(n, [1.5, 0.2, 0.55], [1.7, 0.18, 0.55])} /> },
  { a: 87.3, b: 90.83, vo: "Tulsa Police released both videos about ten weeks later, (the release's first frame, held)",
    node: (n) => <Release t={1.5} n={n} s0={1.0} s1={0.93} />, over: <RedLabel text="TULSA POLICE RELEASE · OCT 2019" at={F(0.5)} hold={F(2.6)} size={40} /> },
  { a: 90.83, b: 96.22, vo: "and I'll give them some credit for that, since the inside camera doesn't exactly flatter their own man. (0.5x, head down over the phone)",
    node: (n) => <Cam src={IN} from={16.0} rate={0.5} keys={K(n, [1.7, 0.3, 0.55], [2.0, 0.28, 0.58])} /> },
  { a: 96.22, b: 103.57, vo: "People noticed the phone right away. A neighbor told local reporters it possibly could have been prevented ... (StripSlide: WSET/KTUL)",
    node: () => <StripSlide bg={IN} bgFrom={2.0} bgKeys={K(F(7.35), [1.1, 0.5, 0.5], [1.18, 0.4, 0.5])} focusAt={60} strips={[
      { src: GR + "wset_mast.png", w: 390, h: 122, W: 420, x: 560, y: 180, at: 4, from: "l", rot: -1.2 },
      { src: GR + "wset_head.png", w: 1140, h: 330, W: 1100, x: 980, y: 440, at: 14, from: "r", rot: 0.8 },
      { src: GR + "wset_quote.png", w: 1020, h: 178, W: 1380, x: 960, y: 720, at: 60, from: "b", rot: -0.6 }]} /> },
  { a: 103.57, b: 108.6, vo: "So was he disciplined? His name was never released, and the department never said. (inside camera after the crash)",
    node: (n) => <Cam src={SOLO} from={60.1} keys={K(n, [1.15, 0.35, 0.45], [1.3, 0.3, 0.42])} /> },
  { a: 108.6, b: 111.6, vo: "Officially, police put the blame on the Jeep driver, (front camera 0.5x, the road through the pink flare)",
    node: (n) => <Cam src={FR} from={33.0} rate={0.5} keys={K(n, [1.1, 0.4, 0.55], [1.2, 0.3, 0.55])} /> },
  { a: 111.6, b: 118.3, vo: "and Officer Jeanne Pierce, speaking for the department, said there was nothing the officer could have done. (inside, slow, easing out)",
    node: (n) => <Cam src={SOLO} from={65.4} rate={0.5} keys={K(n, [1.25, 0.32, 0.45], [1.05, 0.4, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(6.44), kind: "blurDip", len: 10 },
  { at: F(11.14), kind: "blurDip", len: 10 },
  { at: F(16.91), kind: "glitch", len: 10 },
  { at: F(22.89), kind: "glitch", len: 10 },
  { at: F(26.35), kind: "blurDip", len: 10 },
  { at: F(28.95), kind: "blurDip", len: 10 },
  { at: F(34.75), kind: "blurDip", len: 10 },
  { at: F(56.75), kind: "blurDip", len: 12 },
  { at: F(63.05), kind: "blurDip", len: 12 },
  { at: F(80.25), kind: "blurDip", len: 10 },
  { at: F(85.32), kind: "blurDip", len: 10 },
  { at: F(87.3), kind: "blurDip", len: 10 },
  { at: F(90.83), kind: "blurDip", len: 10 },
  { at: F(96.22), kind: "blurDip", len: 12 },
  { at: F(103.57), kind: "blurDip", len: 12 },
  { at: F(108.6), kind: "blurDip", len: 10 },
  { at: F(111.6), kind: "blurDip", len: 10 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 30.75], [56.75, 30.75, 37.05], [80.25, 37.05, null]];
const RAWS: [number, number, number, number, number][] = [[34.75, 56.75, 14.0, 0, 0.3], [63.05, 80.25, 37.4, 2, 0.12]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [16.86, "sfx_n2/glitch_01.wav", -28], [22.84, "sfx_n2/glitch_03.wav", -30],
  [96.4, "sfx_n2/real/paper_2.wav", -28], [96.8, "sfx_n2/real/paper_3.wav", -30], [98.2, "sfx_n2/real/page_turn_1.wav", -30],
];
// the source is silent until the hit: a low road/engine bed under the first raw's silent part
const BED: [number, number, string, number][] = [[34.75, 51.3, "sfx_n2/real/car_engine_2.wav", -27]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE PHONE AND THE JEEP" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE06.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} volume={(f) => dB(g) * interpolate(f, [0, 15, F(b - a) - 6, F(b - a)], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 1, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(114.3)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(MUSIC_DB) * interpolate(t, [4.0, 5.0, 116.8, 118.3], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
const MUSIC_DB = -15;
