// Tornado #4 — Mayfield, Kentucky, 10 December 2021 (high-end EF4). Channel grammar (brand.tsx) + devices built for this case:
//   LobbyWall   (dev/TOR04_LobbyWall): the bank's lobby cameras as one security wall in 3-D (east burst / west goes dark / front door replay).
//   TrackFold   (dev/TOR04_TrackFold): the last bank frame folds down like a lid onto the NWS Paducah track map; then the camera
//               travels the 165-mile track (no drawn line: the NWS survey points carry it).
//   BulletinRoll(dev/TOR04_BulletinRoll): the real 9:26 PM Tornado Warning (IEM archive) on a lit sheet, the emergency line marked.
//   PeelReveal  (dev/TOR04_PeelReveal): the candle-factory site before the storm peels off the same ground after it (NWS PAH aerials).
// Footage: FNB Bank's lobby CCTV (Wikimedia Commons public-domain copy, 1272x718 — sharper than the YouTube upload, and silent:
// the YouTube copy carries added music, so NO clip audio is used), Mayfield Electric & Water's parking-lot camera (mike hodges repost,
// JA9pj-qVNCw, silent). Every raw's sound is built from real recordings timed to the picture. VO = one take ("Four." cut),
// split only where the three raws play (3 Nov: the lot camera merged into one raw). Source cuts: bank 6.6 (lights drop: kept inside raw 1, it IS the moment), 12.83, 25.17, 39.33.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, RedLabel, TitleCard } from "../brand";
import { LobbyWall } from "../dev/TOR04_LobbyWall";
import { TrackFold } from "../dev/TOR04_TrackFold";
import { BulletinRoll } from "../dev/TOR04_BulletinRoll";
import { PeelReveal } from "../dev/TOR04_PeelReveal";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(152.35);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO parts: [abs start, take start, take end]
// 3 Nov raw audit: the lot is ONE raw after "Across town, the lights were still on."; old raws 4/5/6 (after stats / factory / lawsuit) removed
const VO: [number, number, number][] = [
  [15.9, 0.75, 18.89], [42.6, 18.89, 36.02], [83.2, 36.02, 104.35],
];
// EF4 path map (NWS Paducah, 1260x732): Woodland Mills TN -> Mayfield -> Rough River Dam
const TRACK: [number, number][] = [[280, 630], [352, 578], [460, 513], [560, 447], [660, 385], [760, 330], [870, 270], [960, 232], [1060, 200], [1150, 160], [1235, 117]];

const SHOTS: Sh[] = [
  // RAW 1 (4.0-15.6): the front-door camera, calm, the lights drop, the doors burst inward (silent CCTV, real SFX)
  { a: 4, b: 15.6, vo: "RAW 1: FNB lobby, front door camera", src: "bank.mp4", from: 1.0, s0: 1.02, s1: 1.08, fx: 0.5, fy: 0.5 },
  // P1 (15.9) "It's about half past nine on Friday the 10th of December 2021."
  { a: 15.6, b: 19.98, vo: "It's about half past nine on Friday the 10th of December 2021. (downtown Mayfield before the storm, Sableman)", src: GR + "sable1.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.55, fy: 0.55,
    over: <RedLabel text="DECEMBER 10, 2021" at={F(0.6)} hold={F(3.0)} /> },
  { a: 19.98, b: 22.71, vo: "FNB Bank's main office in Mayfield, Kentucky, (lobby east camera)", src: "bank.mp4", from: 25.9, s0: 1.04, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <RedLabel text="FNB BANK, MAYFIELD, KENTUCKY" at={F(0.3)} hold={F(2.2)} /> },
  { a: 22.71, b: 24.48, vo: "is closed and empty. (lobby west camera)", src: "bank.mp4", from: 13.6, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 24.48, b: 28.44, vo: "FNB had been on that corner of East Broadway since 1875. (Broadway, 1906, public domain)", src: GR + "b1906.jpg", still: true, s0: 1.06, s1: 1.16, fx: 0.7, fy: 0.5,
    over: <RedLabel text="BROADWAY, MAYFIELD, 1906" at={F(0.5)} hold={F(3.0)} /> },
  { a: 28.44, b: 34.3, vo: "A tornado in western Kentucky in the middle of December is not something most people there were braced for. (downtown, before)", src: GR + "sable2.jpg", still: true, s0: 1.12, s1: 1.03, fx: 0.4, fy: 0.5 },
  // RAW 2 (34.3-42.3): the lobby wall
  { a: 34.3, b: 42.3, vo: "RAW 2: lobby east bursts, lobby west goes dark and fills, the front door again at half speed",
    node: <LobbyWall big={{ src: GR + "bank.mp4", from: 30.4 }} top={{ src: GR + "bank.mp4", from: 16.4 }} bottom={{ src: GR + "bank_rep.mp4", from: 0 }} bg={{ src: GR + "bank.mp4", from: 30.4 }} /> },
  // P2 (42.6)
  { a: 42.3, b: 45.31, vo: "That tornado had been on the ground since Tennessee. (the bank frame folds onto the NWS track map)",
    node: <TrackFold map={GR + "ef4map.jpg"} iw={1260} ih={732} path={TRACK} phase="fold" lid={{ src: GR + "bank.mp4", from: 38.4 }} startLabel="OBION COUNTY, TENNESSEE" zoom={2.6} /> },
  { a: 45.31, b: 49.18, vo: "It was a high-end EF4, with winds near a hundred and ninety. (NWS drone photo of the swath)", src: GR + "dji.jpg", still: true, s0: 1.05, s1: 1.14, fx: 0.4, fy: 0.55 },
  { a: 49.18, b: 57.19, vo: "Its track ran a hundred and sixty-five miles, from Woodland Mills to Rough River Dam. That's one of the longest ever recorded. (the whole track)",
    node: <TrackFold map={GR + "ef4map.jpg"} iw={1260} ih={732} path={TRACK} phase="span" startLabel="WOODLAND MILLS, TN" endLabel="ROUGH RIVER DAM, KY" zoom={1.8} /> },
  { a: 57.19, b: 64.9, vo: "Across town, the lights were still on. (59.73) + RAW 3 (59.9-82.9, one lot raw, 23 s): the lit lot, calm", src: "lot.mp4", from: 0.3, s0: 1.02, s1: 1.07, fx: 0.5, fy: 0.45 },
  { a: 64.9, b: 74.9, vo: "RAW 3 cont.: wind and rain building over the lot (blur-dip in)", src: "lot.mp4", from: 47.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45 },
  { a: 74.9, b: 82.9, vo: "RAW 3 cont.: debris across the frame as the lot disappears (blur-dip in)", src: "lot.mp4", from: 58.0, s0: 1.02, s1: 1.06, fx: 0.5, fy: 0.5 },
  // P3 (66.6)
  { a: 82.9, b: 89.32, vo: "The Weather Service had issued a tornado emergency for Mayfield at 9:26, a few minutes before this. (the bulletin)",
    node: <BulletinRoll src={GR + "bulletin.jpg"} w={2560} h={3600} startY={560} settleY={860} settleAt={F(2.2)}
      marks={[{ box: [186, 805.5, 619.8, 841.5], at: F(2.6) }, { box: [235.1, 887.1, 734.4, 923.1], at: F(3.4), red: true }]} /> },
  { a: 89.32, b: 95.97, vo: "By the end, the tornado had stayed down for nearly three hours and was up to twenty-six hundred yards wide at its peak. (the lot after the debris, still lost in rain)", src: "lot.mp4", from: 86.0, s0: 1.1, s1: 1.18, fx: 0.5, fy: 0.4 },
  // P4 (91.9)
  { a: 95.97, b: 101.53, vo: "The bank's rebuilt main office went up on the same block, the first business rebuilt on the downtown square. (downtown that week, State Farm CC BY)", src: GR + "sf_down1.jpg", still: true, s0: 1.04, s1: 1.13, fx: 0.4, fy: 0.5,
    over: <RedLabel text="DOWNTOWN MAYFIELD" at={F(0.6)} hold={F(3.6)} /> },
  { a: 101.53, b: 103.32, vo: "The bank was empty that night. (the empty lobby, still)", src: GR + "title.jpg", still: true, s0: 1.1, s1: 1.16, fx: 0.5, fy: 0.5 },
  { a: 103.32, b: 110.99, vo: "The candle factory, Mayfield Consumer Products, had about 110 people on shift when it collapsed. Eight of them didn't make it out. (before peels off after)",
    node: <PeelReveal before={GR + "cf_before.jpg"} after={GR + "cf_after.jpg"} iw={1150} ih={585} focus={[600, 170]} spot={[540, 95, 650, 195]} peelAt={F(1.2)} peelLen={34} z0={1.9} z1={2.2} label="MAYFIELD CONSUMER PRODUCTS" /> },
  // P5 (119.5)
  { a: 110.99, b: 116.22, vo: "Employees later sued, saying managers had threatened to fire anyone who left before the storm. (the factory site from above, after)",
    node: <Aerial src={GR + "cf_after.jpg"} iw={1150} ih={585} spot={[540, 95, 650, 195]} z0={1.5} z1={1.75} boxAt={8} /> },
  { a: 116.22, b: 117.85, vo: "The company disputed that. (wrecked building, State Farm CC BY)", src: GR + "sf_wreck.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.55 },
  // P6 (136.9)
  { a: 117.85, b: 123.62, vo: "In 2022, workplace safety regulators cited the company for seven serious violations. (NWS: the industrial park from the air)", src: GR + "graves1.jpg", still: true, s0: 1.03, s1: 1.12, fx: 0.4, fy: 0.5 },
  { a: 123.62, b: 126.65, vo: "They included its exit routes and its emergency action plan, (NWS ground survey)", src: GR + "christine2.jpg", still: true, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5 },
  { a: 126.65, b: 129.67, vo: "and the fines came to forty thousand dollars. (NWS: the swath)", src: GR + "graves4.jpg", still: true, s0: 1.1, s1: 1.04, fx: 0.5, fy: 0.55 },
  { a: 129.67, b: 131.67, vo: "The company contested all seven. (downtown, State Farm CC BY)", src: GR + "sf_down2.jpg", still: true, s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 131.67, b: 137.69, vo: "The factory closed for good the following January, and about two hundred and fifty workers were laid off. (the factory as it stood, NWS before image)",
    node: <Aerial src={GR + "cf_before.jpg"} iw={1150} ih={585} spot={[540, 95, 650, 195]} z0={1.3} z1={1.6} boxAt={10} /> },
  { a: 137.69, b: 142.59, vo: "Twenty-two lives were lost in and around Mayfield, fifty-seven along the whole track. (the courthouse, NWS)", src: GR + "graves5.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.45,
    over: <RedLabel text="GRAVES COUNTY COURTHOUSE" at={F(0.6)} hold={F(3.0)} /> },
  { a: 142.59, b: 146.13, vo: "A court can argue over who said what on that factory floor. (downtown street, NWS)", src: GR + "graves3.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.5, fy: 0.5 },
  { a: 146.13, b: 152.35, vo: "I don't need one to tell me that nobody under a tornado warning should be choosing between a shift and their life. (the lot camera, last of it)", src: "lot.mp4", from: 108.0, s0: 1.05, s1: 1.12, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(15.6), kind: "blurDip", len: 12 },
  { at: F(34.3), kind: "zoomHit", len: 10 },
  { at: F(42.3), kind: "hard" },
  { at: F(57.19), kind: "whip", len: 10, dir: 1 },
  { at: F(64.9), kind: "blurDip", len: 12 },   // inside the lot raw: calm -> building
  { at: F(74.9), kind: "blurDip", len: 12 },   // inside the lot raw: building -> debris
  { at: F(82.9), kind: "glitch", len: 8 },
  { at: F(89.32), kind: "blurDip", len: 12 },
  { at: F(95.97), kind: "blurDip", len: 12 },
  { at: F(117.85), kind: "blurDip", len: 10 },
  { at: F(146.13), kind: "blurDip", len: 14 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
// both cameras are silent: every raw is scored with real recordings, timed to what the picture does
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  // raw 1: front door (src 1.0 at 4.0): wind outside, lights drop at src 6.6 (9.6), doors burst ~src 9.3 (12.3), whiteout
  [4.1, X + "rain_9.wav", -30], [5.2, X + "wind_gust_1.wav", -27], [8.6, X + "wind_gust_1.wav", -22],
  [9.55, X + "sub_drop_1.wav", -22], [9.6, X + "static_1.wav", -28],
  [12.2, X + "impact_2.wav", -13], [12.3, X + "metal_clank_2.wav", -19], [12.45, X + "boom_4.wav", -18], [12.6, X + "wind_gust_1.wav", -15], [13.4, X + "impact_4.wav", -20],
  // raw 2: the wall (east src 30.4 at 34.3: dark at 34, burst 37.2 -> 41.1; west src 16.4: dark 19 -> 36.9, debris 23 -> 40.9)
  [34.25, "sfx_n2/whoosh_02.wav", -30], [34.5, X + "wind_gust_1.wav", -20], [36.9, X + "sub_drop_2.wav", -22], [37.0, X + "static_3.wav", -30],
  [40.8, X + "impact_3.wav", -15], [41.1, X + "impact_1.wav", -13], [41.2, X + "metal_clank_4.wav", -19], [41.3, X + "wind_gust_1.wav", -16],
  [57.15, "sfx_n2/whoosh_03.wav", -30],
  // raw 3 (one lot raw, 59.9-82.9): calm (src 3.0), blur-dip to wind/rain building (src 47 at 64.9), blur-dip to debris (src 58 at 74.9: hits ~src 58.5 / 60.5 / 64)
  [59.9, X + "rain_3.wav", -26],
  [65.0, X + "rain_5.wav", -21], [65.4, X + "wind_gust_1.wav", -20], [69.4, X + "wind_gust_1.wav", -17], [72.8, X + "wind_gust_1.wav", -15],
  [75.0, X + "wind_gust_1.wav", -14], [75.3, X + "rain_22.wav", -20], [75.5, X + "impact_1.wav", -18], [77.4, X + "metal_clank_1.wav", -18],
  [79.3, X + "wind_gust_1.wav", -14], [80.9, X + "impact_3.wav", -17],
  [82.85, "sfx_n2/glitch_03.wav", -28],
];

// music: Music 4 (Epidemic ambient, -11.9 LUFS -> -22.5 dB); out under the three raws, under the VO everywhere else
const M4 = dB(-22.5);
const env = (t: number) => {
  const k: [number, number][] = [[15.6, 0], [16.6, 1], [33.6, 1], [34.3, 0], [42.5, 0], [43.6, 1], [59.3, 1], [60.3, 0], [82.9, 0], [84.0, 1], [150.35, 1], [152.35, 0]];
  return interpolate(t, k.map((x) => x[0]), k.map((x) => x[1]), cl);
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE BANK AND THE CANDLE FACTORY" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, t0, t1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(t1) - F(t0) + (i === VO.length - 1 ? 24 : 0)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(t0)} /></Sequence>
      ))}
      <Sequence from={F(15.6)} durationInFrames={F(61.0) - F(15.6)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(6)} volume={(f) => M4 * env(15.6 + f / 30)} />
      </Sequence>
      <Sequence from={F(82.9)} durationInFrames={F(152.35) - F(82.9)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(50)} volume={(f) => M4 * env(82.9 + f / 30)} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
