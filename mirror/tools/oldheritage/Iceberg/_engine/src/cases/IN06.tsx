// Incidents #06 — Gage's Falls, Belson Creek (Gages Gulf) near Ripley, New York, 14 Mar 2015: Ted Engelhardt's helmet GoPro as the hole
// below the falls holds and recirculates him; he swims out and claws along the gorge wall. One source: his own upload QL9LqjDRZio
// (1920x1080 25 fps, 3:20; source cuts at 29.68, 51.08, 179.64 = end card). Music bed (Urbanstep) stripped by rawclean.py (whole clip).
// VO = one take (CASE06.mp3, no count word), split only at the three raws (all at sentence ends):
//   A 0-34.12 @4.0 | R1 38.12-50.66 (src 12.96-25.5: the lip, the drop, the boil) | B 34.12-51.79 @50.66 |
//   R2 68.33-86.53 (main: src 51.8-70.0, out of the boat, the boat seen from outside, rolled, moaning) | C 51.79-60.84 @86.53 |
//   R3 95.58-108.08 (src 101.5-114.0, bare hands on the gorge wall) | D 60.84-end @108.08, VO ends 125.25, end card hold to 126.6.
// Devices: GorgeRelief (NAIP x 3DEP lidar hillshade tipping into 3-D, creek traced), RecordLift (the real AW accident record, injury
// field lifted). The creator's own end card ("TED'S ALIVE! PADDLE SAFE KIDS!") closes under his lesson line.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK } from "../dev/DC01_kit";
import { GorgeRelief } from "../dev/IN06_GorgeRelief";
import { RecordLift } from "../dev/IN06_RecordLift";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(126.6);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

const CREEK: [number, number][] = [[2190,1],[2190,3],[2194,6],[2205,11],[2211,16],[2211,30],[2203,35],[2186,39],[2183,44],[2171,43],[2162,45],[2137,52],[2109,62],[2102,66],[2093,67],[2076,65],[2062,65],[2051,65],[2037,68],[2008,75],[1968,86],[1959,90],[1942,98],[1922,113],[1922,124],[1915,136],[1906,144],[1892,145],[1877,145],[1856,143],[1827,142],[1820,146],[1816,152],[1810,157],[1803,161],[1793,160],[1788,163],[1784,179],[1776,196],[1768,204],[1764,207],[1731,215],[1709,231],[1706,242],[1705,261],[1703,264],[1687,273],[1664,280],[1660,282],[1650,296],[1646,303],[1645,308],[1643,310],[1634,310],[1630,311],[1617,320],[1612,356],[1607,358],[1585,367],[1572,375],[1563,375],[1551,374],[1533,369],[1529,366],[1518,364],[1507,370],[1497,373],[1493,366],[1492,359],[1486,356],[1481,348],[1477,341],[1473,339],[1470,340],[1458,362],[1443,370],[1434,383],[1433,393],[1438,405],[1441,420],[1442,429],[1437,436],[1423,442],[1411,451],[1396,467],[1375,476],[1347,518],[1306,538],[1302,540],[1294,541],[1264,524],[1245,523],[1241,525],[1234,558],[1230,564],[1207,584],[1196,584],[1180,590],[1132,591],[1128,597],[1118,615],[1100,637],[1097,640],[1096,651],[1094,658],[1091,663],[1084,669],[1077,670],[1070,675],[1059,678],[1050,673],[1035,665],[1026,657],[1013,635],[1010,632],[998,632],[987,637],[984,648],[984,663],[978,676],[971,684],[957,692],[953,700],[951,706],[951,718],[954,730],[960,738],[968,742],[977,746],[983,747],[985,758],[986,768],[983,781],[982,826],[978,831],[946,845],[932,853],[917,858],[900,854],[886,849],[871,850],[868,851],[855,861],[847,862],[839,859],[834,846],[830,834],[830,825],[834,812],[840,804],[854,796],[871,791],[885,783],[890,774],[888,767],[880,759],[867,759],[850,762],[829,775],[812,799],[808,806],[804,822],[798,827],[788,826],[767,822],[756,822],[749,827],[747,833],[748,841],[759,853],[762,864],[761,870],[752,877],[732,879],[727,878],[695,850],[689,849],[681,857],[670,875],[670,890],[672,903],[673,919],[669,923],[657,926],[638,928],[631,928],[629,933],[631,942],[632,944],[632,955],[627,960],[621,962],[587,963],[580,965],[560,966],[555,963],[528,965],[508,970],[504,976],[493,991],[491,1000],[492,1021],[496,1031],[497,1043],[492,1050],[486,1053],[463,1054],[437,1048],[423,1044],[411,1048],[409,1052],[403,1059],[400,1069],[401,1082],[403,1091],[407,1100],[406,1110],[403,1116],[400,1127],[397,1131],[391,1137],[386,1138],[374,1139],[368,1137],[358,1138],[355,1141],[356,1146],[362,1150],[376,1155],[379,1157],[383,1163],[383,1176],[380,1182],[371,1189],[352,1199],[338,1207],[310,1204],[303,1204],[293,1210],[287,1216],[278,1224],[276,1226]];

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.35, vo: "Ted Engelhardt, a creek paddler from around Erie, had wanted to run Belson Creek for years. (the red bow in the snowy gorge)",
    node: (n) => <Cam src={M} from={0.3} keys={K(n, [1.12, 0.5, 0.6], [1.22, 0.5, 0.66])} />, over: <RedLabel text="TED ENGELHARDT" at={F(1.0)} hold={F(3.6)} /> },
  { a: 9.35, b: 17.88, vo: "a tiny snowmelt creek in a deep gorge near Ripley, New York ... camped down there alone for four days (GorgeRelief)",
    node: (n) => <GorgeRelief src={GR + "relief.jpg"} hs={GR + "hs.jpg"} iw={2400} ih={1350} n={n} focus={[1050, 680]} path={CREEK} traceAt={50} traceLen={90} />,
    over: <RedLabel text="BELSON CREEK · RIPLEY, NEW YORK" at={F(1.4)} hold={F(5.6)} size={42} /> },
  { a: 17.88, b: 22.69, vo: "That was four days in a gorge for one run ... patience. (the gorge downstream, walls and snow)",
    node: (n) => <Cam src={M} from={174.6} keys={K(n, [1.05, 0.5, 0.45], [1.15, 0.5, 0.42])} /> },
  { a: 22.69, b: 26.86, vo: "On March 14, 2015, the creek was high with meltwater. (high brown water running between the walls)",
    node: (n) => <Cam src={M} from={82.6} keys={K(n, [1.1, 0.5, 0.45], [1.2, 0.5, 0.42])} />, over: <RedLabel text="MARCH 14, 2015" at={F(0.5)} hold={F(3.0)} /> },
  { a: 26.86, b: 32.46, vo: "Ted and his friend Frank put on at 4:30 in the afternoon, with nobody on the bank holding a rope. (empty rock walls, white water)",
    node: (n) => <Cam src={M} from={155.5} keys={K(n, [1.25, 0.5, 0.35], [1.35, 0.55, 0.32])} /> },
  // scouted in a hurry -> the red bow tips over the lip -> RAW 1 runs on from the same frame (src 7.3 -> 25.5)
  { a: 32.46, b: 50.66, vo: "It was getting late, so Ted scouted Gage's Falls in a hurry. The red bow tips over the lip. + RAW 1 (src 12.96-25.5)",
    node: (n) => <Cam src={M} from={7.3} keys={[{ f: 0, s: 1.18, x: 0.5, y: 0.62 }, { f: F(5.6), s: 1.08, x: 0.5, y: 0.55 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 50.66, b: 53.04, vo: "The boat lands in the boil and stalls. (in the boil, still in the boat)",
    node: (n) => <Cam src={M} from={30.6} keys={K(n, [1.15, 0.5, 0.6], [1.22, 0.5, 0.62])} /> },
  { a: 53.04, b: 57.62, vo: "The hole rolls him for close to a minute, and about halfway through he's out of the kayak. (the first roll, 0.8x)",
    node: (n) => <Cam src={GR + "roll_slow.mp4"} from={0} keys={K(n, [1.1, 0.5, 0.5], [1.2, 0.48, 0.5])} /> },
  { a: 57.62, b: 63.28, vo: "His GoPro sat about 11 inches above his mouth, so the camera is often above water when he isn't. (held against the rock)",
    node: (n) => <Cam src={M} from={36.0} keys={K(n, [1.3, 0.45, 0.55], [1.4, 0.45, 0.58])} /> },
  { a: 63.28, b: 68.33, vo: "How can you tell when he's under? He wrote that if you can't hear him moaning, he probably is. (wider, the boil over the bow)",
    node: (n) => <Cam src={M} from={42.5} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.52, 0.5])} /> },
  // RAW 2 (main): out of the boat, the empty red boat circling in the hole, rolled again, moaning (src 51.8-70.0)
  { a: 68.33, b: 86.53, vo: "RAW 2 (src 51.8-70.0)", node: (n) => <Cam src={M} from={51.8} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.48])} /> },
  { a: 86.53, b: 89.0, vo: "A deep pool saved him. (under the surface, brown light)",
    node: (n) => <Cam src={M} from={78.6} keys={K(n, [1.1, 0.5, 0.5], [1.25, 0.5, 0.5])} /> },
  { a: 89.0, b: 92.97, vo: "He balled up and sank, and the current flushed him downstream. (flushed down between the walls)",
    node: (n) => <Cam src={M} from={88.5} keys={K(n, [1.1, 0.5, 0.45], [1.2, 0.5, 0.5])} /> },
  // the hands line runs straight on into RAW 3 (src 98.9 -> 114.0)
  { a: 92.97, b: 108.08, vo: "After that, the camera catches his bare hands on the gorge wall. + RAW 3 (src 101.5-114.0)",
    node: (n) => <Cam src={M} from={98.9} keys={[{ f: 0, s: 1.15, x: 0.5, y: 0.5 }, { f: F(2.6), s: 1.05, x: 0.5, y: 0.52 }, { f: n, s: 1.0, x: 0.5, y: 0.5 }]} /> },
  { a: 108.08, b: 113.45, vo: "He swam another 300 feet, then the pair hiked a mile and a half through knee deep snow in the dark. (hands along the wall)",
    node: (n) => <Cam src={M} from={118.0} keys={K(n, [1.2, 0.5, 0.5], [1.3, 0.48, 0.45])} /> },
  { a: 113.45, b: 117.03, vo: "His empty boat circled in that hole for over 20 minutes. (0.5x replay: the empty red boat in the hole, pushing in)",
    node: (n) => <Cam src={GR + "boat_slow.mp4"} from={0.4} keys={K(n, [1.35, 0.5, 0.42], [1.6, 0.52, 0.42])} /> },
  { a: 117.03, b: 121.40, vo: "The accident report he filed himself logs his injury as hypothermia. (RecordLift: AW report #83729, injury cell)",
    node: (n) => <RecordLift bg={M} bgFrom={140} sheet={GR + "aw_top.png"} sw={2560} sh={1560} cell={[860, 1236, 1290, 1372]} rule={[904, 1140, 1314]}
      n={n} liftAt={52} start={[700, 520]} end={[1075, 1290]} z0={0.6} z1={1.0} /> },
  { a: 121.40, b: 126.6, vo: "His lesson afterward was never to run it with fewer than three people. (his own end card, held)",
    node: () => <AbsoluteFill style={{ background: "#000" }}><OffthreadVideo src={staticFile(C + "media/endcard.mp4")} muted style={{ width: "100%", height: "100%" }} /></AbsoluteFill> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.35), kind: "glitch", len: 10 },   // into the relief
  { at: F(17.88), kind: "glitch", len: 10 },  // out of it
  { at: F(22.69), kind: "blurDip", len: 10 },
  { at: F(26.86), kind: "blurDip", len: 10 },
  { at: F(32.46), kind: "blurDip", len: 10 },
  { at: F(50.66), kind: "blurDip", len: 10 },
  { at: F(53.04), kind: "blurDip", len: 10 },
  { at: F(57.62), kind: "blurDip", len: 10 },
  { at: F(63.28), kind: "blurDip", len: 10 },
  { at: F(68.33), kind: "blurDip", len: 10 },
  { at: F(86.53), kind: "blurDip", len: 10 },
  { at: F(89.0), kind: "blurDip", len: 10 },
  { at: F(92.97), kind: "blurDip", len: 10 },
  { at: F(108.08), kind: "blurDip", len: 12 },
  { at: F(113.45), kind: "blurDip", len: 12 },  // into the slow replay
  { at: F(117.03), kind: "blurDip", len: 12 },  // into the record
  { at: F(121.40), kind: "glitch", len: 10 },   // the end card
];

const PART: [number, number, number | null][] = [[4.0, 0, 34.12], [50.66, 34.12, 51.79], [86.53, 51.79, 60.84], [108.08, 60.84, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [[38.12, 50.66, 12.96, 8, 0.25], [68.33, 86.53, 51.8, 8, 0.12], [95.58, 108.08, 101.5, 8, 0.2]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [9.3, "sfx_n2/glitch_01.wav", -28], [17.83, "sfx_n2/glitch_03.wav", -28],
  [117.05, "sfx_n2/real/paper_2.wav", -26], [118.75, "sfx_n2/real/paper_3.wav", -30], [121.35, "sfx_n2/glitch_01.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE HOLE AT GAGE'S FALLS" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(126.6 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb, , , lv]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-19) * interpolate(t, [4.0, 5.0, 125.2, 126.6], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
