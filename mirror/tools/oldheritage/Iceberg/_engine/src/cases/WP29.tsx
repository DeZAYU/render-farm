// Workplace #29 — Ruihai International Logistics warehouse, Port of Tianjin, China, 12 Aug 2015: containers burning at a hazardous
// goods warehouse, firefighters sent in, then two explosions about thirty seconds apart. 173 lives (104 firefighters), 798 injured.
// Footage (small personal uploaders only): MH = MR. H. (_hHRAbJCyow): a phone at a window, the fire on the skyline, the fireballs, the
// camera jolting (its own sound: rawclean found no music, kept); app logo delogo'd. TJ = Galen Crout (HfXmG3GdAig): a dashcam in a
// street of the Binhai district, the glow at the end of the road, the second blast arriving (silent upload).
// VO = one take (CASE29.mp3), split once at the raw. RAW = MH src 15.5-29.5 (14 s), its own sound.
// Blender (build/CASE28/maps/port.py via CASE29/maps/site.py, ring.py): site = the yard burning at night; ring = the 1 km rule round
// the site and the line to the nearest homes (~520 m).
// Devices: RewindWave (the dashcam replays the second blast: live, a fast rewind, half speed with a push).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl } from "../dev/WP45_kit";
import { Tall } from "../dev/WP01_kit";
import { RewindWave } from "../dev/WP29_RewindWave";
import { SITE, RING } from "../dev/WP29_blLabels";

const C = "case/", G = C + "graded/";
const TJ = G + "tj.mp4", MH = G + "mh.mp4";
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO part 1 (take 0-13.12) @4.0 | RAW 17.3-31.3 (MH src 15.5-29.5) | VO part 2 (take 13.10-end) @31.3
const v1 = (t: number) => t + 4.0;
const RAW: [number, number] = [17.3, 31.3];
const R0 = 15.5;
const V2 = 13.1, v2 = (t: number) => t + (RAW[1] - V2);
const END = 107.4;
export const DUR = F(END);
const PART: [number, number, number | null][] = [[4.0, 0, 13.12], [RAW[1], V2, null]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(3.53), vo: "Port of Tianjin, China. August 2015. (TJ: the dashcam street at night)",
    node: (n) => <><Clip src={TJ} from={1.0} n={n} s0={1.03} s1={1.1} fx={0.5} fy={0.5} />
      <RedLabel text="PORT OF TIANJIN · CHINA" at={6} hold={F(1.6)} size={42} /><RedLabel text="AUGUST 12, 2015" at={F(1.9)} hold={F(1.4)} size={44} /></> },
  { a: v1(3.53), b: v1(8.40), vo: "Shortly before midnight that Wednesday, containers had caught fire at a hazardous goods warehouse (MH: the fire on the skyline)",
    node: (n) => <Tall src={MH} from={0.5} n={n} s0={1.0} s1={1.08} fy={0.4} /> },
  { a: v1(8.40), b: RAW[0], vo: "run by Ruihai International Logistics, and firefighters had been sent in. (Blender site)",
    node: () => <BlenderShot src={C + "maps/site.mp4"} track={SITE} labels={[["fire", "RUIHAI LOGISTICS WAREHOUSE", 12, 110, -0.02]]} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the fireballs over the skyline, the camera jolts (MH src 15.5-29.5, own sound)",
    node: (n) => <Tall src={MH} from={R0} n={n} s0={1.0} s1={1.05} fy={0.45} /> },
  { a: RAW[1], b: v2(16.40), vo: "There were two explosions, about thirty seconds apart. (TJ: the first flash at the end of the road)",
    node: (n) => <Clip src={TJ} from={5.0} n={n} s0={1.02} s1={1.08} fx={0.6} fy={0.4} /> },
  { a: v2(16.40), b: v2(26.86), vo: "Seismic readings ... 21.9 tonnes of TNT. The blasts carried across the Binhai district and blew out windows ... (RewindWave)",
    node: (n) => <RewindWave src={TJ} from={35.0} n={n} live={F(5.4)} rew={16} back={38.4} slow={0.5} fx={0.62} fy={0.4} /> },
  { a: v2(26.86), b: v2(29.98), vo: "The official toll was a hundred and seventy three lives. (MH: the burning skyline)",
    node: (n) => <Tall src={MH} from={31.0} n={n} s0={1.06} s1={1.0} fy={0.5} x={0.36} /> },
  { a: v2(29.98), b: v2(37.11), vo: "A hundred and four of them were firefighters ... Seven hundred and ninety eight people were injured. (TJ)",
    node: (n) => <Clip src={TJ} from={46.5} n={n} s0={1.02} s1={1.09} fx={0.55} fy={0.45} /> },
  { a: v2(37.11), b: v2(43.53), vo: "Nitrocellulose goes into lacquer, paint and propellant ... much easier to ignite. (MH)",
    node: (n) => <Tall src={MH} from={36.5} n={n} s0={1.0} s1={1.07} fy={0.45} x={0.64} /> },
  { a: v2(43.53), b: v2(50.57), vo: "Investigators found that nitrocellulose in an overheated container had dried out and ignited ... (TJ: driving toward the glow)",
    node: (n) => <Clip src={TJ} from={27.5} n={n} s0={1.03} s1={1.1} fx={0.6} fy={0.4} /> },
  { a: v2(50.57), b: v2(59.01), vo: "Safety rules called for at least a kilometre ... the closest homes were about five hundred and twenty metres away. (Blender ring)",
    node: () => <><BlenderShot src={C + "maps/ring.mp4"} track={RING} labels={[["home", "HOMES", 150, 100, -0.03]]} />
      <RedLabel text="1 KILOMETRE" at={70} hold={170} x={0.5} y={0.88} size={42} /></> },
  { a: v2(59.01), b: v2(64.49), vo: "Ruihai's temporary licence to handle dangerous chemicals had expired in October 2014, (TJ: the street after)",
    node: (n) => <Clip src={TJ} from={54.0} n={n} s0={1.08} s1={1.02} fx={0.5} fy={0.5} /> },
  { a: v2(64.49), b: v2(68.65), vo: "and it reportedly kept operating without one until June 2015. (TJ)",
    node: (n) => <Clip src={TJ} from={21.5} n={n} s0={1.02} s1={1.08} fx={0.6} fy={0.45} /> },
  { a: v2(68.65), b: v2(74.39), vo: "Investigators said it had misrepresented its plans and colluded with local officials to get approval. (MH)",
    node: (n) => <Tall src={MH} from={52.0} n={n} s0={1.06} s1={1.0} fy={0.5} /> },
  { a: v2(74.39), b: v2(79.72), vo: "In November 2016, forty nine officials, executives and staff were jailed. (TJ: the glow after the first blast)",
    node: (n) => <Clip src={TJ} from={8.5} n={n} s0={1.1} s1={1.03} fx={0.6} fy={0.4} /> },
  { a: v2(79.72), b: v2(84.41), vo: "Ruihai's chairman, Yu Xuewei, was sentenced to death with a two year reprieve. (MH)",
    node: (n) => <><Tall src={MH} from={60.0} n={n} s0={1.0} s1={1.06} fy={0.5} x={0.4} />
      <RedLabel text="YU XUEWEI · RUIHAI CHAIRMAN" at={F(80.86 - 79.72)} hold={F(2.6)} size={40} /></> },
  { a: v2(84.41), b: END, vo: "Most of the people lost that night were the ones sent toward it. (TJ: the road toward the glow)",
    node: (n) => <Clip src={TJ} from={15.0} n={n} s0={1.02} s1={1.12} fx={0.62} fy={0.42} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(v1(8.40)), kind: "glitch", len: 10 },     // into Blender
  { at: F(RAW[0]), kind: "blurDip", len: 12 },      // VO -> raw
  { at: F(RAW[1]), kind: "blurDip", len: 12 },      // raw -> VO
  { at: F(v2(16.40)), kind: "blurDip", len: 12 },   // same dashcam, 30 s later (RewindWave)
  { at: F(v2(64.49)), kind: "blurDip", len: 12 },   // same dashcam, earlier moment
  { at: F(v2(50.57)), kind: "glitch", len: 10 },    // into Blender
  { at: F(v2(59.01)), kind: "blurDip", len: 12 },
  { at: F(v2(84.41)), kind: "blurDip", len: 12 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE WAREHOUSE AT RUIHAI" bg={G + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE29.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the phone's own track (rawclean: no music), faded at both ends */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile(C + "media/mh_clean.wav")} startFrom={F(R0)} volume={(f) => dB(2) * interpolate(f, [0, 8, F(RAW[1] - RAW[0]) - 18, F(RAW[1] - RAW[0])], [0, 1, 1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 5 at -18 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(10)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-18) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.06 + 0.94 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
