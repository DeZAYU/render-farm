// Tornado #7 — Radium Springs, Albany, Georgia, Sunday 22 January 2017 (EF3). "Eight minutes in the hall bathroom."
// One camera carries the case: the family's GoPro, left running at the window while they sat in the hall bathroom (cWArodUunWU, 15 min).
// Files: win = source 470-700 s (t = src - 470), calm = source 60-120 (t = src - 60), hall = source 0-48 (the hallway as they go in).
// The roar builds from 480 s, white-out 548-556, the pine snaps 566-570, broken trunks from 590. Only source cut: 37.07 (camera moved).
// Devices built for THIS case: MinuteStrip (one real frame per minute of the eight minutes, -8:00 ... 0:00, receding in 3-D),
// CountyCrossings (the NWS damage swath travelled from Albany, a white bar stamped at each county line on the word), SiteHop (NAIP:
// the Procter & Gamble plant, then across to the Marine Corps Logistics Base). Stills: NWS (public domain) Ashburn EF3 home and the
// Zion Church Road church; Baker Co. funnel at 3:12 PM by Spotter31768 (CC BY-SA 4.0, credited in NOTES); NASA/NOAA GOES image.
// VO = one take ("Seven," cut), split only where the two raws play (3 Nov raw audit: 6 -> 2 raws, the pine-snap raw runs on through the debris); the window's own sound only inside raw windows.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut, type FxPunch } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel, TitleCard } from "../brand";
import { MinuteStrip } from "../dev/TOR07_MinuteStrip";
import { CountyCrossings } from "../dev/TOR07_CountyCrossings";
import { SiteHop } from "../dev/TOR07_SiteHop";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", MD = C + "media/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(141.32);
const W = (src: number) => src - 470; // source seconds -> win.mp4 seconds

// NAIP (naip_albany.jpg, EPSG:3857, -84.16..-84.00 / 31.50..31.60, 3200 x 2340; OSM positions): site boxes in image px
const PG: [number, number, number, number] = [955, 1085, 1165, 1285];
const MCLB: [number, number, number, number] = [1310, 890, 1920, 1300];

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; still?: boolean; s0?: number; s1?: number; fx?: number; fy?: number; punches?: FxPunch[]; node?: React.ReactNode; over?: React.ReactNode };

// VO blocks: [timeline start, take start, take end]
const VO: [number, number, number][] = [
  [4.3, 0.7, 14.64],      // and here's what you're supposed to do ... eight minutes
  [29.0, 14.64, 37.35],   // This was January ... The family is still in the hall bathroom. (raws 2, 3 removed 3 Nov: the take runs on)
  [77.47, 37.35, 100.8],   // seventy-two minutes ... outcome (raws 5, 6 removed 3 Nov)
];
// raws: [timeline a, b, window source second, gain dB]
const RAWS: [number, number, number, number][] = [
  [18.6, 28.6, 515.0, 6],   // the wind rising in the fog (quiet source: lifted)
  [52.07, 77.07, 563.0, -3],  // MAIN: the pine snaps (568-569), the source runs on into the debris against the glass (to 588)
];

const SHOTS: Sh[] = [
  // VO 1
  { a: 4.0, b: 5.9, vo: "and here's what you're supposed to do. (the window, before)", src: "calm.mp4", from: 12.0, s0: 1.04, s1: 1.08, fx: 0.55, fy: 0.45 },
  { a: 5.9, b: 8.85, vo: "It's Sunday the 22nd of January 2017,", src: "calm.mp4", from: 30.0, s0: 1.3, s1: 1.36, fx: 0.62, fy: 0.35,
    over: <RedLabel text="JANUARY 22, 2017" at={8} hold={F(2.4)} /> },
  { a: 8.85, b: 12.25, vo: "in Radium Springs, on the southern edge of Albany, Georgia.", src: "win.mp4", from: W(475.0), s0: 1.05, s1: 1.1, fx: 0.5, fy: 0.45,
    over: <RedLabel text="RADIUM SPRINGS, ALBANY, GEORGIA" at={10} hold={F(2.7)} /> },
  { a: 12.25, b: 14.37, vo: "A family goes into their hall bathroom. (the hallway, the camera in hand)", src: "hall.mp4", from: 1.8, s0: 1.04, s1: 1.08, fx: 0.6, fy: 0.5 },
  { a: 14.37, b: 18.6, vo: "By their own account, they're in there for eight minutes before the tornado arrives. (one frame per minute)",
    node: <MinuteStrip frames={[8, 7, 6, 5, 4, 3, 2, 1, 0].map((m) => GR + `min${m}.jpg`)} captions={["-8:00", "-7:00", "-6:00", "-5:00", "-4:00", "-3:00", "-2:00", "-1:00", "0:00"]} bg={GR + "min4.jpg"} travelFrom={4} /> },
  // RAW 1
  { a: 18.6, b: 28.6, vo: "RAW the wind rising", src: "win.mp4", from: W(515.0), s0: 1.03, s1: 1.08, fx: 0.55, fy: 0.45 },
  // VO 2
  { a: 28.6, b: 30.22, vo: "This was January. (the pine tops)", src: "calm.mp4", from: 45.0, s0: 1.45, s1: 1.5, fx: 0.62, fy: 0.22 },
  { a: 30.22, b: 33.44, vo: "People think of tornadoes as a spring thing out on the Plains.", src: "win.mp4", from: W(486.0), s0: 1.18, s1: 1.24, fx: 0.42, fy: 0.5 },
  { a: 33.44, b: 35.53, vo: "The Southeast gets them in winter too,", src: "calm.mp4", from: 52.0, s0: 1.25, s1: 1.3, fx: 0.4, fy: 0.75 },
  { a: 35.53, b: 37.95, vo: "often wrapped in rain and moving fast. (rain sheeting down the glass)", src: "hall.mp4", from: 20.0, s0: 1.06, s1: 1.12, fx: 0.55, fy: 0.45 },
  { a: 37.95, b: 43.06, vo: "This one belonged to a three-day outbreak across the region, from the 21st to the 23rd. (GOES, the storm system over the Southeast)",
    src: GR + "goes.jpg", still: true, s0: 1.55, s1: 1.85, fx: 0.32, fy: 0.42 },
  // VO 3
  { a: 43.06, b: 45.84, vo: "EF3, winds around a hundred and fifty. (NWS: EF3 damage to a frame home, Ashburn, same tornado)",
    src: GR + "ashburn.jpg", still: true, s0: 1.14, s1: 1.03, fx: 0.5, fy: 0.5, over: <RedLabel text="ASHBURN, GEORGIA" at={10} hold={F(2.4)} /> },
  { a: 45.84, b: 49.46, vo: "It had touched down in southern Dougherty County at about a quarter past three. (the funnel at 3:12 near Newton)",
    src: GR + "funnel.jpg", still: true, s0: 1.08, s1: 1.18, fx: 0.47, fy: 0.62, over: <RedLabel text="3:12 PM, NEAR NEWTON" at={12} hold={F(3.2)} /> },
  // VO 4
  { a: 49.46, b: 52.07, vo: "The family is still in the hall bathroom. (the dark room they left)", src: "hall.mp4", from: 9.0, s0: 1.06, s1: 1.1, fx: 0.5, fy: 0.5 },
  // RAW 2 (main, 25 s): the pine snaps, then the debris against the glass (one run of the source, 563-588)
  { a: 52.07, b: 77.07, vo: "RAW the pine snaps", src: "win.mp4", from: W(563.0), s0: 1.02, s1: 1.07, fx: 0.55, fy: 0.42 },
  // VO 5
  { a: 77.07, b: 81.59, vo: "It stayed down for seventy-two minutes and covered more than seventy miles. (the snap again, slow)", src: "win_replay.mp4", from: 2.0, s0: 1.3, s1: 1.42, fx: 0.62, fy: 0.35 },
  { a: 81.59, b: 88.04, vo: "The damage path was up to a mile and a quarter wide. After Albany, it went on through Worth, Turner and Wilcox counties. (NWS swath)",
    node: <CountyCrossings src={GR + "swath.jpg"} iw={1238} ih={773} travel={[8, 186]} startU={0.3}
      path={[[65, 698], [290, 590], [380, 535], [540, 425], [720, 310], [860, 210], [940, 140], [1040, 40]]}
      cross={[{ p: [405, 518], at: 108, name: "WORTH" }, { p: [600, 387], at: 143, name: "TURNER" }, { p: [862, 208], at: 172, name: "WILCOX" }]} /> },
  // VO 6
  { a: 88.04, b: 91.04, vo: "Radium Springs came out of the survey with nearly every tree destroyed (the trunks, snapped)", src: "win.mp4", from: W(591.0), s0: 1.45, s1: 1.52, fx: 0.62, fy: 0.42 },
  { a: 91.04, b: 94.42, vo: "and EF2 damage to several houses.", src: "win.mp4", from: W(595.5), s0: 1.15, s1: 1.2, fx: 0.35, fy: 0.62 },
  // VO 7: the outcome
  { a: 94.42, b: 97.13, vo: "Five people along the track never came home,", src: "win.mp4", from: W(660.0), s0: 1.06, s1: 1.11, fx: 0.5, fy: 0.45 },
  { a: 97.13, b: 100.25, vo: "one of them an elderly woman who passed away days later,", src: "win.mp4", from: W(688.0), s0: 1.35, s1: 1.4, fx: 0.6, fy: 0.55 },
  { a: 100.25, b: 106.94, vo: "and more than forty were hurt. On Harris Road, a row of mobile homes was blown away at low-end EF3 strength. (the swath where EF3 begins, Albany)",
    node: <Aerial src={GR + "swath.jpg"} iw={1238} ih={773} spot={[262, 520, 352, 600]} z0={1.25} z1={1.9} label="ALBANY" boxAt={F(2.0)} labelAt={F(2.4)} /> },
  { a: 106.94, b: 116.22, vo: "Further on, a large part of a warehouse at the Procter and Gamble plant collapsed. It regained EF3 strength over the Marine Corps Logistics Base. (NAIP)",
    node: <SiteHop src={GR + "naip_albany.jpg"} iw={3200} ih={2340} a={{ box: PG, label: "PROCTER & GAMBLE PLANT", at: 20 }} b={{ box: MCLB, label: "MARINE CORPS LOGISTICS BASE", at: F(4.9) }} hop={[F(3.6), F(4.8)]} /> },
  { a: 116.22, b: 123.67, vo: "There, anchored double-wide trailers were completely destroyed. Concrete light poles snapped, and a concrete roof was shifted more than two inches. (the window after)", src: "win.mp4", from: W(662.0), s0: 1.1, s1: 1.2, fx: 0.55, fy: 0.5 },
  { a: 123.67, b: 126.6, vo: "Four of the five lives were lost in Albany itself.", src: "win.mp4", from: W(640.0), s0: 1.04, s1: 1.08, fx: 0.45, fy: 0.45 },
  { a: 126.6, b: 132.68, vo: "It also badly damaged a well-built concrete church anchored with rebar, exactly where most of us would run. (NWS photo)",
    node: <Inset src={GR + "church.jpg"} still box={0.62} ar={16 / 9} label="ZION CHURCH ROAD, WORTH COUNTY" labelAt={12} /> },
  { a: 132.68, b: 135.67, vo: "Staying in that bathroom for eight minutes was the right call. (the house, inside)", src: "hall.mp4", from: 12.6, s0: 1.08, s1: 1.14, fx: 0.5, fy: 0.5 },
  { a: 135.67, b: 141.32, vo: "On a day when five people were lost, that's the part of this case I'd want everyone to remember. (the window, after)", src: "win.mp4", from: W(694.0), s0: 1.0, s1: 1.08, fx: 0.5, fy: 0.45 },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(14.37), kind: "zoomHit", len: 10 },
  { at: F(18.6), kind: "blurDip", len: 10 },
  { at: F(33.44), kind: "blurDip", len: 10 },   // same camera (win -> calm): no jump cut
  { at: F(43.06), kind: "glitch", len: 8 },
  { at: F(77.07), kind: "blurDip", len: 12 },   // raw -> its slow replay
  { at: F(81.59), kind: "whip", len: 10 },
  { at: F(88.04), kind: "blurDip", len: 10 },
  { at: F(91.04), kind: "blurDip", len: 10 },
  { at: F(94.42), kind: "blurDip", len: 10 },
  { at: F(97.13), kind: "blurDip", len: 10 },
  { at: F(100.25), kind: "glitch", len: 8 },
  { at: F(123.67), kind: "blurDip", len: 10 },
  { at: F(135.67), kind: "blurDip", len: 12 },
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  const src = s.src!.startsWith(C) ? s.src! : GR + s.src!;
  return <FilmLook_FX grain={0.08}><Shot_FX src={src} n={F(s.b) - F(s.a)} from={s.from} still={s.still} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} punches={s.punches} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [14.37, "sfx_n2/whoosh_02.wav", -30],
  [14.5, X + "tape_click_2.wav", -28],
  [43.06, "sfx_n2/glitch_01.wav", -28],
  [81.59, "sfx_n2/whoosh_01.wav", -30],
  [100.25, "sfx_n2/glitch_03.wav", -28],
  [126.62, X + "camera_shutter_2.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="EIGHT MINUTES IN THE HALL BATHROOM" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([t, a, b], i) => (
        <Sequence key={"v" + i} from={F(t)} durationInFrames={F(b) - F(a)} layout="none"><Audio src={staticFile("vor/CASE07.mp3")} startFrom={F(a)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => { const n = F(b) - F(a); return (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={n} layout="none">
          <Audio src={staticFile(MD + "win_clean.wav")} startFrom={F(W(src))} volume={(f) => dB(g) * interpolate(f, [0, 8, n - 18, n], [0, 1, 1, 0], cl)} />
        </Sequence>); })}
      {/* music: Epidemic ambient Music 4, out under every raw, back after */}
      {VO.map(([t, a, b], i) => { const n = F(b) - F(a) + F(0.8); const off = [4, 22, 50][i];
        return (
          <Sequence key={"m" + i} from={F(t) - 10} durationInFrames={n + 10} layout="none">
            <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(off)} volume={(f) => dB(-22) * interpolate(f, [0, 16, n - 6, n + 10], [0, 1, 1, 0], cl)} />
          </Sequence>); })}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
