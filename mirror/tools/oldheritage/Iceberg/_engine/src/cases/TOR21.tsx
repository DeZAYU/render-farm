// Tornado #21 — Marshalltown, Iowa (19 July 2018), the courthouse tower. Footage: Jason L. Wegner's own drive into town (windshield +
// handheld, his sound only from src 180 s; 65-180 s are silent in the upload -> real rain/wind SFX under those raws) and his aftermath
// (Lennox lot, the courthouse, downtown); next-day drones from personal channels: Tim Kilbride (downtown), Sam Rockwell (Lennox, the
// courthouse from above), Mid Iowa Rotor Wing (Lennox roofs; its corner logo is framed out: scale >= 1.3 about 30 %/30 %).
// Devices for THIS case (dev/TOR21_*): OutlookPage (the 2 % outlook plate, then the card turns over to the SPC storm reports of the same day;
// Iowa bracketed), BulletinSheet (the 3:54 PM warning "Radar indicated rotation" and the 4:37 PM TORNADO EMERGENCY, sheets in 3-D),
// SurveySwath (the NWS DAT survey line + EF polygons on a NAIP aerial lying in 3-D). VO = one take, split only at the three raws (R1, R2, R4 main).
// Source cuts (srccuts): weg 7.03 22.7 46.9 57.6 58.6 62.1 99.1 172.9 184.2 258.0-258.9 393.1 402.7 412.7 436.8 451.6 452.7 476.2;
// captions burned in at 9-16 (3:41PM), 62.5-68.5 (4:38Pm), 99-105.5 (COURTHOUSE FALLS), 393-394 (Lennox), 403-404.5 (The Aftermath):
// every window below sits inside one segment and outside the captions. len cuts 87.0 160.6 205.35 275.4 304.5.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { OutlookPage } from "../dev/TOR21_OutlookTracks";
import { BulletinSheet } from "../dev/TOR21_Bulletins";
import { SurveySwath } from "../dev/TOR21_SurveySwath";
import { SWATH_POLYS, SWATH_TRACK } from "../dev/TOR21_data";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/", WEB = C + "assets/web/", SH = C + "shots/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(136.92);

// VO parts: [take from, take to, timeline at]  (cut in the take's own pauses; "Two percent." opens the case, nothing to drop)
const VO: [number, number, number][] = [[0, 19.4, 4], [19.4, 31.4, 33.5], [31.4, 45.15, 57.5], [45.15, 94.45, 87.25]];
// raws: [timeline a, b, media file, file offset, gain dB, fade-out s] — clip sound only inside these, faded to 0 before the VO
const RAWS: [number, number, string, number, number, number][] = [
  [71.25, 87.25, "weg_e_clean.wav", 0.5, -3, 0.8],  // R4 (main, 16 s) the cone over the street, behind the brick building
  // 3 Nov (raws only at incident moments): R3 "over the town" after the EF3 stats (near-dup) and R5 "trees thrashing" removed
];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };
const LEN = { s0: 1.32, fx: 0.3, fy: 0.3 }; // frames the rotor-wing logo (bottom right) out of picture

const SHOTS: Sh[] = [
  { a: 4, b: 8.75, vo: "Two percent. That was the Storm Prediction Center's tornado chance for much of eastern Iowa (the 12:59Z outlook, 2 % bracketed)",
    node: <OutlookPage src={WEB + "day1probotlk_20180719_1300_torn.png"} iw={815} ih={555} focus={[480, 215]} bracket={[438, 150, 522, 292]} bracketAt={6} /> },
  { a: 8.75, b: 12.16, vo: "on the morning of Thursday the 19th of July 2018. (that afternoon west of town, still quiet)", src: "weg_a.mp4", from: 1.2, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45,
    over: <RedLabel text="JULY 19, 2018" at={F(1.0)} hold={F(2.2)} /> },
  { a: 12.16, b: 16.83, vo: "By nightfall there had been twenty-two tornadoes. Number twenty-one is Marshalltown, (the outlook card turns over: SPC storm reports of the same day, the Iowa cluster bracketed)",
    node: <OutlookPage src={WEB + "180719_rpts.png"} from={WEB + "day1probotlk_20180719_1300_torn.png"} flipAt={2} iw={582} ih={408} focus={[333, 142]} bracket={[303, 112, 364, 172]} bracketAt={30} zEnd={2.1} label="MARSHALLTOWN, IOWA" labelAt={F(2.9)} /> },
  { a: 16.83, b: 20.7, vo: "where the warning went out about thirty minutes before the tornado even formed. (the storm base over the fields, no tornado yet)", src: "weg_a.mp4", from: 24.8, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.4 },
  { a: 20.7, b: 23.4, vo: "It reached town at around twenty-five past four. (driving into town under it)", src: "weg_b.mp4", from: 0.5, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.45 },
  // R1 23.4-33.4: the wedge on the road ahead (silent upload -> rain + wind)
  { a: 23.4, b: 33.4, vo: "RAW 1: the wedge over the street ahead", src: "weg_c.mp4", from: 0.5, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.42 },
  { a: 33.4, b: 37.02, vo: "Forecasters warn on the rotation they can see on radar, (the 3:54 PM warning: SOURCE...Radar indicated rotation.)",
    node: <BulletinSheet src={SH + "tor354.png"} iw={2560} ih={3200} marks={[{ box: [218.8, 2305.6, 783.5, 2341.6], at: 44 }]} camY={[[0, 1640], [40, 2200], [108, 2300]]} /> },
  { a: 37.02, b: 40.69, vo: "which is how a warning can arrive before there's a tornado to spot. (rain shaft over the fields, nothing on the ground)", src: "weg_a.mp4", from: 10.2, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 40.69, b: 45.5, vo: "This one was followed by a tornado emergency, the highest level the Weather Service issues. (4:37 PM: TORNADO EMERGENCY ... CATASTROPHIC)",
    node: <BulletinSheet src={SH + "tor437.png"} under={SH + "tor354.png"} iw={2560} ih={4000} enterFrom="below" tilt={[22, 7]}
      marks={[{ box: [186, 1501.1, 849.0, 1537.1], at: 26 }, { box: [186, 3458.6, 783.5, 3494.6], at: 96 }]} camY={[[0, 1380], [30, 1530], [92, 3440], [144, 3480]]} /> },
  // R2 45.5-57.5: crossing the town from the bridge (silent upload)
  { a: 45.5, b: 57.5, vo: "RAW 2: the wedge crossing the town", src: "weg_c.mp4", from: 16.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.42 },
  { a: 57.5, b: 63.65, vo: "EF3, up to twelve hundred yards wide, twenty-three minutes on the ground over eight point four miles, (the NWS survey on NAIP, in 3-D)",
    node: <SurveySwath src={GR + "naip.jpg"} iw={4000} ih={2250} track={SWATH_TRACK} polys={SWATH_POLYS} label="EF3" labelAt={8} swathAt={34} lineAt={F(2.9)} lineLen={F(2.9)} coreAt={F(5.0)} /> },
  { a: 63.65, b: 65.05, vo: "straight through downtown. (the downtown roofs next morning, drone)", src: "kil.mp4", from: 3.0, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.55 },
  { a: 65.05, b: 67.21, vo: "At the Lennox International plant, (the plant from above)", src: "rock_b.mp4", from: 2.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.55,
    over: <RedLabel text="LENNOX INTERNATIONAL" at={F(0.3)} hold={F(1.6)} /> },
  { a: 67.21, b: 69.4, vo: "the roof and reinforced walls came off (the torn roof)", src: "len_a.mp4", from: 67.0, s0: LEN.s0, s1: LEN.s0 + 0.06, fx: LEN.fx, fy: LEN.fy },
  { a: 69.4, b: 71.25, vo: "and cars were tossed around the lot. (his camera in the Lennox lot after)", src: "weg_f.mp4", from: 0.8, s0: 1.04, s1: 1.1, fx: 0.4, fy: 0.6 },
  // R4 71.25-87.25 + VO "It's heading out over the rest of town now." over the same continuous take (sound faded before it), to 89.52
  { a: 71.25, b: 89.52, vo: "RAW 4 + 'It's heading out over the rest of town now.'", src: "weg_e.mp4", from: 0.5, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.4 },
  { a: 89.52, b: 93.31, vo: "It tore the top off the clock tower on the Marshall County Courthouse. (his camera at the courthouse after)", src: "weg_g.mp4", from: 15.0, s0: 1.03, s1: 1.09, fx: 0.4, fy: 0.3,
    over: <RedLabel text="MARSHALL COUNTY COURTHOUSE" at={F(1.2)} hold={F(2.3)} /> },
  { a: 93.31, b: 95.93, vo: "Twenty-two people were hurt and nobody was lost, (downtown storefronts, bricks on the pavement)", src: "weg_h.mp4", from: 5.0, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5 },
  { a: 95.93, b: 98.71, vo: "and the official write-ups credited timely warnings. (the damaged blocks from the drone)", src: "kil.mp4", from: 50.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 98.71, b: 100.75, vo: "Like the candle factory in Mayfield, (Lennox roofs, open)", src: "len_a.mp4", from: 26.0, s0: LEN.s0, s1: LEN.s0 + 0.05, fx: LEN.fx, fy: LEN.fy },
  { a: 100.75, b: 104.08, vo: "the Lennox plant was a factory hit by a strong tornado. (the whole plant, wide)", src: "len_b.mp4", from: 6.0, s0: LEN.s0 + 0.02, s1: LEN.s0 + 0.08, fx: LEN.fx, fy: LEN.fy },
  { a: 104.08, b: 106.58, vo: "This time, everyone there walked out. (the plant's lot from above)", src: "rock_b.mp4", from: 14.5, s0: 1.03, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 106.58, b: 110.1, vo: "Lennox reopened the rebuilt plant in July 2023. (NAIP today: the rebuilt plant)",
    node: <Aerial src={GR + "naip_lennox.jpg"} iw={2880} ih={1620} spot={[1470, 330, 2130, 680]} z0={1.05} z1={1.3} label="JULY 2023" boxAt={8} labelAt={16} /> },
  { a: 110.1, b: 113.54, vo: "Several downtown buildings were condemned and torn down later, (downtown roofs, drone)", src: "kil.mp4", from: 18.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.6 },
  { a: 113.54, b: 117, vo: "partly from this and partly from a derecho two years on. (the brick block with its top torn)", src: "weg_h.mp4", from: 18.5, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.4 },
  { a: 117, b: 121.45, vo: "The courthouse repair was first estimated at fifteen and a half million dollars. (NWS photo: the tarped tower)",
    node: <Inset src={GR + "courthouse.jpg"} still box={0.36} ar={896 / 1200} pos="50% 40%" drift={0.08} /> },
  { a: 121.45, b: 123.91, vo: "It ended up costing about forty-two million, (the courthouse from the drone, the tower open)", src: "rock_a.mp4", from: 5.0, s0: 1.05, s1: 1.12, fx: 0.38, fy: 0.55 },
  { a: 123.91, b: 127.5, vo: "and the building was rededicated in November 2022. (NAIP today: the courthouse square)",
    node: <Aerial src={GR + "naip_court.jpg"} iw={2880} ih={1620} spot={[1075, 955, 1245, 1115]} z0={1.3} z1={1.6} label="NOVEMBER 2022" boxAt={8} labelAt={16} /> },
  { a: 127.5, b: 129.63, vo: "Set it beside the house in Kentucky. (the storm far off over open fields)", src: "weg_a.mp4", from: 17.2, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.45 },
  { a: 129.63, b: 131.27, vo: "One town got half an hour, (the storm base, still far away)", src: "weg_a.mp4", from: 29.8, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.4 },
  { a: 131.27, b: 132.8, vo: "and the other got nothing. (in the rain under it)", src: "weg_b.mp4", from: 17.0, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 132.8, b: 136.92, vo: "To me, that half hour matters more than any wind speed on this list. (the wedge over the town, last look)", src: "weg_c.mp4", from: 44.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.42 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },     // title -> case
  { at: F(12.16), kind: "blurDip", len: 12 },  // back to the plate
  { at: F(33.4), kind: "glitch", len: 8 },     // raw -> the bulletins section
  { at: F(37.02), kind: "blurDip", len: 10 },  // weg_a again (other moment)
  { at: F(57.5), kind: "whip", len: 10 },      // raw -> the survey
  { at: F(89.52), kind: "glitch", len: 10 },   // into the aftermath
  { at: F(100.75), kind: "blurDip", len: 10 }, // two rotor-wing windows back to back
  { at: F(127.5), kind: "blurDip", len: 12 }, // back to the afternoon (time jump)
  { at: F(129.63), kind: "blurDip", len: 10 }, // same camera, other moment
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// R1 / R2 are silent in the upload: rain on the glass + wind built from real recordings; designed transitions get a subtle whoosh/glitch
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [4.1, X + "paper_2.wav", -32],          // the outlook plate settles
  [12.1, "sfx_n2/whoosh_01.wav", -32],
  [23.4, X + "rain_9.wav", -20], [23.6, X + "wind_gust_1.wav", -22], [28, X + "wind_gust_1.wav", -24],
  [33.35, "sfx_n2/glitch_03.wav", -28],
  [33.5, X + "page_turn_1.wav", -30],
  [40.7, X + "page_turn_2.wav", -28],
  [45.5, X + "rain_22.wav", -20], [45.7, X + "wind_gust_1.wav", -20], [51, X + "wind_gust_1.wav", -21],
  [57.45, "sfx_n2/whoosh_02.wav", -28],
  [89.47, "sfx_n2/glitch_02.wav", -26],
  [106.62, "sfx_n2/whoosh_01.wav", -33],
  [123.92, "sfx_n2/whoosh_01.wav", -33],
];
// silent raws: the rain/wind beds are clipped to the raw windows with fades (never under the VO)
const BEDS: [number, number][] = [[23.4, 33.4], [45.5, 57.5]];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE COURTHOUSE TOWER" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([a, b, at], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE21.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, off, g, fo], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(MD + file)} startFrom={F(off)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a - fo), F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {BEDS.map(([a, b], i) => (
        <Sequence key={"b" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(X + "rain_5.wav")} volume={(f) => dB(-17) * interpolate(f, [0, 10, F(b - a - 0.8), F(b - a) - 2], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => {
        // anything starting inside a raw bed window ends with that window
        const bed = BEDS.find(([a, b]) => t >= a && t < b);
        const len = bed ? F(bed[1] - t) : undefined;
        return <Sequence key={"x" + i} from={F(t)} durationInFrames={len} layout="none"><Audio src={staticFile(f)} volume={(fr) => dB(d) * (len ? interpolate(fr, [len - 20, len - 2], [1, 0], cl) : 1)} /></Sequence>;
      })}
      {/* music: Epidemic ambient (Music 4, measured -11.9 LUFS -> about -33.5 under a -26 VO), out under the sound raws, back after */}
      <Sequence from={F(4.0)} durationInFrames={F(71.45) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(8)} volume={(f) => dB(-21.5) * interpolate(f, [0, 30, F(65.4), F(67.4)], [0, 1, 1, 0.0], cl)} />
      </Sequence>
      <Sequence from={F(87.0)} durationInFrames={F(136.92) - F(87.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(40)} volume={(f) => dB(-21.5) * interpolate(f, [0, F(1.5), F(47.3), F(49.9)], [0, 1, 1, 0], cl)} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
