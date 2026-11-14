// Tornado #24 — Washington, Indiana: on the air at Memories 107.9 (WAMW), 17 Nov 2013, EF2. One source: the station's own phone video
// through the studio window (1280x720, rain on the glass, the lot, the station's tower; it goes white, the phone drops, the roar goes on).
// Devices built for this case: TwinTowns ("the second Washington": Illinois from case 6 and Indiana side by side, the Indiana panel
// becomes the frame) and TrackGlide (the NWS track on a NAIP aerial tilted in 3-D, pins standing up; touchdown + measure, then the
// 3:20 -> 3:23 crossing). Outcome: the same lot after, debris across it. VO = one take (the count word sits inside "Twenty-four is the
// one in Indiana", so nothing is cut), split for the two raws.
// Source cuts (srccuts): 46.2 (phone drops, black from 46.7), 54.4-55.6 / 64-71 / 94-118 handheld swings. Windows: 4.0-7.6 / 11.0-20.5 /
// 22.0-25.65 / 26.0-46.1 (raw ends before 46.2), slow 43.0-46.1, window 363.5-367.2 (the hall glass 99-103 swung too hard: cutcheck JUMPs), inside 55.6-58.1 (0.8x), after 597.0-600.9.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { TwinTowns } from "../dev/TOR24_TwinTowns";
import { TrackGlide } from "../dev/TOR24_TrackGlide";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(72.3);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// NAIP 4000x2400 (EPSG:3857, bbox -87.2300,38.6330,-87.1640,38.6640): NWS start 38.6420,-87.2224 / end 38.6546,-87.1730
const A: [number, number] = [464, 1703], B: [number, number] = [3451, 728];

// VO-A: take 0-9.75 at 4.0 | VO-B: take 9.75-13.4 at 23.6 | VO-C: take 13.4-end at 54.0 (+40.6)
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.6, vo: "Remember the second Washington? Twenty-four is the one in Indiana, (the two Washingtons, same afternoon)",
    node: <TwinTowns left={{ src: GR + "wil.mp4", from: 2.0, label: "WASHINGTON, ILLINOIS" }} right={{ src: GR + "win.mp4", from: 0.4, label: "WASHINGTON, INDIANA" }} rightLabelAt={F(2.4)} handAt={F(2.75)} /> },
  { a: 7.6, b: 10.1, vo: "at about twenty past three that same afternoon. (the studio window, rain on the glass; continues the panel)", src: "win.mp4", from: 4.0, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.55,
    over: <RedLabel text="NOVEMBER 17, 2013" at={F(0.3)} hold={F(1.9)} /> },
  { a: 10.1, b: 13.75, vo: "The DJs at Memories 107.9 were on the air. (the station's own tower outside the window)", src: "win.mp4", from: 22.0, s0: 1.08, s1: 1.16, fx: 0.8, fy: 0.45,
    over: <RedLabel text="MEMORIES 107.9 · WAMW" at={F(0.5)} hold={F(2.7)} /> },
  // RAW 1 (13.75-23.25): the wall of rain and wind crossing the lot (its own sound)
  { a: 13.75, b: 23.25, vo: "RAW: rain and wind sweep the lot, the trees bend (11.0-20.5)", src: "win.mp4", from: 11.0, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.5 },
  { a: 23.25, b: 27.5, vo: "It had touched down about three miles west-southwest of town. (NWS track: touchdown, measure to town)",
    node: <TrackGlide src={GR + "naip.jpg"} iw={4000} ih={2400} a={A} b={B} mode="touchdown"
      cams={[{ at: 0, c: [700, 1580], span: 1500, tilt: 54 }, { at: F(1.3), c: [760, 1560], span: 1700, tilt: 52 }, { at: F(4.1), c: [1950, 1220], span: 3900, tilt: 46 }]}
      pinA={{ text: "TOUCHDOWN 3:20 PM", at: F(0.45) }} measure={{ at: F(1.4), len: F(1.7), text: "2.8 MI" }} pinB={{ text: "WASHINGTON", at: F(2.9) }} /> },
  // RAW 2 (27.5-47.6): the station's tower, the dumpster rolling, the lot going white, debris (its own sound, the roar rising)
  { a: 27.5, b: 47.6, vo: "RAW: debris crossing outside the window, white-out (26.0-46.1)", src: "win.mp4", from: 26.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.5 },
  // the phone went down at 46.2; its roar keeps going over the last seconds, replayed at half speed
  { a: 47.6, b: 53.6, vo: "(roar continues) slow replay 0.5x of the white-out 43.0-46.1", src: "win_slow.mp4", from: 0.0, s0: 1.1, s1: 1.22, fx: 0.55, fy: 0.5 },
  { a: 53.6, b: 58.75, vo: "EF2, around a hundred and twenty, three minutes across the southwest side. (the track crosses into town, 3:20 -> 3:23)",
    node: <TrackGlide src={GR + "naip.jpg"} iw={4000} ih={2400} a={A} b={B} mode="cross"
      cams={[{ at: 0, c: [1100, 1450], span: 2600, tilt: 50 }, { at: F(1.0), c: [1100, 1450], span: 2600, tilt: 50 }, { at: F(4.9), c: [2950, 900], span: 1650, tilt: 55 }]}
      pinA={{ text: "TOUCHDOWN", at: 4 }} draw={{ at: F(0.9), len: F(3.6), t0: 20, t1: 23 }} /> },
  { a: 58.75, b: 62.45, vo: "DJ Dave Crooks said the windows blew out within seconds, (the station wall after: a blown-out window, steady; the hall was too shaky)", src: "window.mp4", from: 2.0, s0: 1.03, s1: 1.08, fx: 0.45, fy: 0.25 },
  { a: 62.45, b: 65.15, vo: "and he sheltered in a corner by the station's vault. (inside, the dark room, light from the window)", src: "inside_slow.mp4", from: 0.2, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.5 },
  { a: 65.15, b: 68.45, vo: "Near Fourth and Sycamore it knocked a house off its foundation. (NAIP: the intersection on the track)",
    node: <Aerial src={GR + "naip_syc.jpg"} iw={2400} ih={1600} spot={[1080, 700, 1330, 900]} z0={2.0} z1={2.4} label="4TH & SYCAMORE" boxAt={F(0.4)} labelAt={F(0.8)} /> },
  { a: 68.45, b: 72.3, vo: "The survey lists no injuries. (the same lot after: debris across it, the buildings across the road)", src: "after.mp4", from: 0.5, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(10.1), kind: "blurDip", len: 12 },   // same camera, later in the clip
  { at: F(13.75), kind: "blurDip", len: 12 },  // same camera, back to the rain
  { at: F(47.6), kind: "blurDip", len: 14 },   // raw -> its slow replay
  { at: F(62.45), kind: "blurDip", len: 12 },  // hall -> room (same phone)
  { at: F(65.15), kind: "whip", len: 10 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [7.6, X + "rain_3.wav", -34],             // rain on the studio glass under the VO (the clip's own sound stays out)
  [23.25, "sfx_n2/whoosh_02.wav", -30],
  [53.6, "sfx_n2/whoosh_01.wav", -31],
  [58.8, X + "metal_clank_3.wav", -30],     // glass and frames in the hall
  [65.12, "sfx_n2/whoosh_03.wav", -28],
];

// raw sound: the phone mic is very quiet until the roar (-55 dBFS at 30 s, -18 at 48 s); the gain that follows the source time
// (+17/+19 dB before the roar, 0 dB at it) is baked into media/raw1.wav (11.0-20.5) and raw2.wav (26.0-52.1) by bake.py, from media/win_clean.wav (rawclean.py: music stripped, owner rule 5b)

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="ON THE AIR AT MEMORIES 107.9" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {/* VO: one take, split only where the two raws sit */}
      <Sequence from={F(4.0)} durationInFrames={F(9.75)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} /></Sequence>
      <Sequence from={F(23.6)} durationInFrames={F(13.4) - F(9.75)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} startFrom={F(9.75)} /></Sequence>
      <Sequence from={F(54.0)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} startFrom={F(13.4)} /></Sequence>
      {/* RAW 1 sound (source 11.0-20.5) */}
      <Sequence from={F(13.75)} durationInFrames={F(23.25) - F(13.75)} layout="none">
        <Audio src={staticFile(C + "media/raw1.wav")} volume={(f) => interpolate(f, [F(9.0), F(9.5)], [1, 0], cl)} />
      </Sequence>
      {/* RAW 2 sound (source 26.0-52.1): continuous through the slow replay; the roar after the phone fell, out before the VO */}
      <Sequence from={F(27.5)} durationInFrames={F(53.6) - F(27.5)} layout="none">
        <Audio src={staticFile(C + "media/raw2.wav")} volume={(f) => interpolate(f, [F(24.6), F(25.9)], [1, 0], cl)} />
      </Sequence>
      {/* music: Epidemic ambient Music 4 (a bed no neighbour uses), low under raw 1's rain, out before the roar, back for the aftermath */}
      <Sequence from={F(4.0)} durationInFrames={F(27.5) - F(4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(12)} volume={(f) => dB(-22) * interpolate(f, [0, 30, F(9.4), F(10.2), F(18.8), F(19.4), F(21.5), F(23.5)], [0, 1, 1, 0.55, 0.55, 0.8, 0.8, 0], cl)} />
      </Sequence>
      <Sequence from={F(53.6)} durationInFrames={F(72.3) - F(53.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(48)} volume={(f) => dB(-23) * interpolate(f, [0, F(2.0), F(16.3), F(18.7)], [0, 1, 1, 0], cl)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
