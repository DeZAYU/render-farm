// Dashcam #07 — North Keene Road, unincorporated Clearwater, Florida, Sun 19 Nov 2017 ~10:20 AM: Rockwell 112A N1401J loses all
// engine power on the way home to Clearwater Air Park and comes down level along Keene Road in front of a Pinellas County deputy's
// cruiser, clips a tree in the median and ends up in trees beside the road; pilot and passenger unhurt. One source: Pinellas County
// Sheriff's Office release (rG3pJNFW8H0, 1920x1080, silent): cruiser 1 (src 7–33.5, pillarboxed: media/c1 = crop 1588x893 at x86,
// time = src) and cruiser 2 driving up (src 33.5–62.3: media/c2 = crop 1792x1008 at x60, time = src − 33.5). Sheriff title card
// (src 0–6.9) not used. c1 has a source cut at 28.43: not crossed.
// VO = one take (CASE07.mp3), split only at the two raws (both at sentence ends):
//   A take 0–57.01 @4.00 | R1 61.01–78.31 (c1 src 11.0–28.3, main: the plane over the traffic, level descent toward the camera, bank,
//   out of sight; traffic stops) | B take 57.01–70.68 @78.31 | R2 91.98–102.48 (c2 src 41.5–52.0: cruiser 2 drives up, the wreck in
//   the trees at the roadside) | C take 70.68–end @102.48, VO ends 130.71, hold to 131.6. The source is silent: real SFX beds.
// Devices: FlightArc (Sentinel-2 Tampa Bay, the hop home), PilotsEye (NAIP, runway ahead -> the opening on Keene Road),
// ReportDesk (NTSB ANC18LA010 pages: sump line, debris photo, probable cause).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io } from "../dev/DC01_kit";
import { FlightArc } from "../dev/DC07_FlightArc";
import { PilotsEye } from "../dev/DC07_PilotsEye";
import { ReportDesk } from "../dev/DC07_ReportDesk";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", C1 = GR + "c1.mp4", C2 = GR + "c2.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(131.6);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

/** a photo filling the frame, slow eased push */
const Photo: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 9.48, vo: "Sunday, November 19, 2017, was a clear morning in Clearwater, Florida. (cruiser 2, a residential street)",
    node: (n) => <Cam src={C2} from={22.9} keys={K(n, [1.05, 0.5, 0.5], [1.12, 0.5, 0.48])} />, over: <RedLabel text="NOVEMBER 19, 2017 · CLEARWATER" at={F(0.5)} hold={F(4.2)} size={42} /> },
  { a: 9.48, b: 17.18, vo: "Two Pinellas County deputies were driving up North Keene Road, a four lane street lined with houses, on their way to an unrelated call. (cruiser 2 on Keene Road)",
    node: (n) => <Cam src={C2} from={0.1} keys={K(n, [1.04, 0.5, 0.5], [1.14, 0.55, 0.5])} />, over: <RedLabel text="NORTH KEENE ROAD" at={F(1.0)} hold={F(3.6)} size={42} /> },
  { a: 17.18, b: 20.61, vo: "Above them, a small four seat plane was heading home. (a Rockwell Commander 112A, the same type)",
    node: (n) => <Photo src={GR + "r112.jpg"} n={n} s0={1.03} s1={1.12} fx={0.5} fy={0.5} />, over: <RedLabel text="ROCKWELL COMMANDER 112A" at={F(0.4)} hold={F(2.8)} size={40} /> },
  { a: 20.61, b: 38.44, vo: "Pilot Marc Benedict ... Zephyrhills ... the short hop back to Clearwater Air Park ... Descending through 1,200 feet ... left tank to both. (FlightArc)",
    node: () => <FlightArc src={GR + "bay.jpg"} size={1792} from={[1437, 643]} to={[562, 1053]} outAt={88} backAt={187} backLen={150} stopU={0.94} labelAt={244}
      cam={[{ f: 0, x: 1000, y: 860, s: 1.0, pitch: 36 }, { f: 186, x: 1080, y: 820, s: 1.06, pitch: 40 }, { f: 340, x: 660, y: 1000, s: 1.9, pitch: 46 }, { f: 535, x: 600, y: 1035, s: 2.5, pitch: 50 }]} />,
    over: <RedLabel text="PILOT MARC BENEDICT" at={F(0.3)} hold={F(2.6)} size={42} y={0.12} /> },
  { a: 38.44, b: 45.02, vo: "About ten seconds later the fuel flow on his gauge fell from 8 gallons an hour to nothing, and the engine quit. (cruiser 1, empty sky over Keene Road, 0.5x)",
    node: (n) => <Cam src={C1} from={7.7} rate={0.5} keys={K(n, [1.1, 0.55, 0.3], [1.3, 0.55, 0.25])} /> },
  { a: 45.02, b: 48.49, vo: "He switched back to the left tank. It wouldn't restart. (the 112A, another one)",
    node: (n) => <Photo src={GR + "r112b.jpg"} n={n} s0={1.04} s1={1.14} fx={0.5} fy={0.5} /> },
  { a: 48.49, b: 55.37, vo: "He couldn't reach the runway from that height, and below him ... an opening on Keene Road. (PilotsEye)",
    node: () => <PilotsEye src={GR + "naip.jpg"} iw={3200} ih={1800} field={[1943, 1645]} box={[1318, 200, 1388, 360]} boxAt={165} fieldLabelAt={22} roadLabelAt={178}
      cam={[{ f: 0, x: 1353, y: 320, s: 0.95, pitch: 62 }, { f: 120, x: 1353, y: 300, s: 1.05, pitch: 60 }, { f: 175, x: 1353, y: 280, s: 1.7, pitch: 14 }, { f: 206, x: 1353, y: 280, s: 1.78, pitch: 12 }]} /> },
  { a: 55.37, b: 61.01, vo: "So that's where he went. The plane comes in at the very top of the frame, right above the traffic. (cruiser 1 held at src 11.0, easing toward the spot)",
    node: (n) => <Cam src={C1} t={11.0} keys={[{ f: 0, s: 1.0, x: 0.5, y: 0.5 }, { f: F(1.5), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.45, x: 0.545, y: 0.3 }]} /> },
  // RAW 1 (main): live from the held frame, easing back to full frame as the plane appears; it grows over the road, banks, drops away
  { a: 61.01, b: 78.31, vo: "RAW 1 (c1 src 11.0-28.3)",
    node: (n) => <Cam src={C1} from={11.0} keys={[{ f: 0, s: 1.45, x: 0.545, y: 0.3 }, { f: F(2.6), s: 1.2, x: 0.55, y: 0.3 }, { f: F(7.5), s: 1.0, x: 0.5, y: 0.5 }, { f: n, s: 1.04, x: 0.5, y: 0.5 }]} /> },
  { a: 78.31, b: 85.42, vo: "The NTSB ... said the video shows a controlled, level descent. (0.5x replay following the plane)",
    node: () => <Cam src={C1} from={14.8} rate={0.5} keys={[{ f: 0, s: 1.8, x: 0.555, y: 0.26 }, { f: 72, s: 1.9, x: 0.572, y: 0.19 }, { f: 132, s: 1.95, x: 0.618, y: 0.14 }, { f: 213, s: 1.95, x: 0.69, y: 0.09 }]} /> },
  { a: 85.42, b: 91.98, vo: "Benedict told deputies his left wing caught a tree in the median, and the plane ended up in a stand of trees beside the road. (frozen on the bank)",
    node: (n) => <Cam src={C1} t={18.5} keys={K(n, [1.3, 0.62, 0.2], [1.75, 0.68, 0.12])} filter="contrast(1.05)" /> },
  // RAW 2: cruiser 2 drives up Keene Road, the wreck in the trees at the left roadside
  { a: 91.98, b: 102.48, vo: "RAW 2 (c2 src 41.5-52.0)", node: (n) => <Cam src={C2} from={8.0} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.4, 0.5])} /> },
  { a: 102.48, b: 106.99, vo: "He and his passenger climbed out without a scratch, and they didn't want treatment. (cruiser 2 passing the scene)",
    node: (n) => <Cam src={C2} from={18.6} keys={K(n, [1.1, 0.4, 0.5], [1.18, 0.4, 0.5])} /> },
  { a: 106.99, b: 108.83, vo: "So why did the engine quit? (cruiser 1, stopped traffic)", node: (n) => <Cam src={C1} from={29.0} keys={K(n, [1.12, 0.5, 0.45], [1.2, 0.5, 0.42])} /> },
  { a: 108.83, b: 131.6, vo: "Benedict hadn't checked his fuel ... debris ... could not be determined. (ReportDesk)",
    node: () => <ReportDesk ruleAt={597} ruleLen={30} rule={[182, 1865, 1072, 1902]}
      pages={[{ src: GR + "ntsb_p2.png", x: 0, y: 0, rot: -2.5, line: [150, 1041, 1550, 1078] }, { src: GR + "ntsb_p3.png", x: 1180, y: 60, rot: 1.8 },
        { src: GR + "ntsb_p0.png", x: 2360, y: -30, rot: -1.2, line: [150, 1767, 1560, 1902] }]}
      stops={[{ f: 0, x: 550, y: 686, s: 1.35, page: 0 }, { f: 178, x: 1732, y: 805, s: 1.0, page: 1 }, { f: 380, x: 1732, y: 805, s: 1.5, page: 1 }, { f: 500, x: 2755, y: 1157, s: 1.45, page: 2 }]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(9.48), kind: "blurDip", len: 10 },
  { at: F(17.18), kind: "glitch", len: 10 },
  { at: F(20.61), kind: "blurDip", len: 12 },
  { at: F(38.44), kind: "blurDip", len: 12 },
  { at: F(45.02), kind: "glitch", len: 10 },
  { at: F(48.49), kind: "blurDip", len: 12 },
  { at: F(55.37), kind: "glitch", len: 10 },
  { at: F(78.31), kind: "blurDip", len: 12 },
  { at: F(85.42), kind: "blurDip", len: 10 },
  { at: F(91.98), kind: "blurDip", len: 12 },
  { at: F(102.48), kind: "blurDip", len: 10 },
  { at: F(106.99), kind: "blurDip", len: 10 },
  { at: F(108.83), kind: "blurDip", len: 12 },
];
const PART: [number, number, number | null][] = [[4.0, 0, 57.01], [78.31, 57.01, 70.68], [102.48, 70.68, null]];
const RAWS: [number, number][] = [[61.01, 78.31], [91.98, 102.48]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [17.13, "sfx_n2/glitch_01.wav", -28], [44.97, "sfx_n2/glitch_03.wav", -30], [55.32, "sfx_n2/glitch_01.wav", -28],
  [66.2, "sfx_n2/real/wind_gust_1.wav", -22],      // the plane gliding in over the road (engine dead)
  [69.3, "sfx_n2/real/impact_3.wav", -26],          // out of sight into the trees (distant)
  [109.0, "sfx_n2/real/paper_2.wav", -28], [114.7, "sfx_n2/real/page_turn_1.wav", -30], [125.0, "sfx_n2/real/paper_3.wav", -30],
];
// the release has no sound: low cruiser engine beds under both raws
const BED: [number, number, string, number][] = [[61.01, 78.31, "sfx_n2/real/car_engine_2.wav", -24], [91.98, 102.48, "sfx_n2/real/car_engine_4.wav", -24]];
const MUSIC_DB = -21.5;   // Music 4 measures -11.9 LUFS -> about -33 LUFS bed

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE PLANE ON KEENE ROAD" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {BED.map(([a, b, file, g], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} loop volume={(f) => dB(g) * interpolate(f, [0, 12, F(b - a) - 14, F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, ducked (not muted) under the silent raws so the beds read */}
      <Sequence from={F(4.0)} durationInFrames={F(127.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(6)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((m, [ra, rb]) => Math.min(m, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? 0.45 + 0.55 * (ra - t) / 0.8 : t > rb ? 0.45 + 0.55 * (t - rb) / 0.6 : 0.45), 1);
          return dB(MUSIC_DB) * interpolate(t, [4.0, 5.0, 130.1, 131.6], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
