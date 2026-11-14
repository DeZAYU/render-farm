// Theme Park #23 — Cheetah Hunt, Busch Gardens Tampa, Wednesday 12 February 2014: the launched coaster stalls on the banked crest
// just out of the station (between its first and second launches), 16 riders sit in the rain in ponchos; Tampa Fire Rescue takes
// them off with two aerial ladders and the park's own cherry picker. Footage: Tampa Fire Rescue's own release (Pw_TNLyNuz8, 1080p;
// logo cards trimmed, its burned-in "Tampa Fire Rescue" credit delogo'd and re-set as a small clean corner credit from the 2nd raw on).
// Source shots (file s): A 10.5-30.3 bucket beside the train (low angle) | B 31.5-43.8 the ladder truck | C 45.5-71.3 the ladder
// tower + train on the crest | D 73.0-98.3 wide: train on the crest, cherry picker, truck. Dissolves between them, no hard cuts.
// Devices built for this case: StationCrest (NAIP: station -> crest traced and measured) + CountDiff (park 15 vs fire service 16).
// VO = one take, split only at the three raws.
import React from "react";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { StationCrest } from "../dev/TP23_StationCrest";
import { CountDiff } from "../dev/TP23_CountDiff";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(95.5);

// NAIP (USGS, public domain) of the station area, 2400 x 1357 px, 0.1256 m of ground per px
const SITE = { src: GR + "site.jpg", iw: 2400, ih: 1357, mpp: 0.1256,
  station: [805, 295, 1260, 600] as [number, number, number, number],
  train: [1258, 884, 1408, 968] as [number, number, number, number],
  path: [[1212, 600], [1210, 700], [1210, 800], [1214, 850], [1228, 885], [1252, 910], [1300, 925], [1336, 929]] as [number, number][] };

type Sh = { a: number; b: number; vo: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; rate?: number; cr?: boolean; node?: React.ReactNode; over?: React.ReactNode };

// timeline: title 0-4 | A1 take 0-17.09 @4.0 | R1 21.09-32.19 (A 14.9-26.0) | A2 17.09-23.29 @32.19 | R2 38.39-53.49 (C 49.9-65.0)
// | A3 23.29-33.67 @53.49 | R3 63.87-78.87 (D 80.6-95.6) | A4 33.67-end @78.87 | hold to 95.5
const SHOTS: Sh[] = [
  { a: 4.0, b: 7.89, vo: "Staff tried pushing the train back to the platform, and it wouldn't budge. (the train on the incline)", from: 26.2, s0: 1.06, s1: 1.14, fx: 0.35, fy: 0.3 },
  { a: 7.89, b: 11.31, vo: "Cheetah Hunt is a launched coaster at Busch Gardens in Tampa. (wide: the coaster over the park)", from: 73.8, s0: 1.02, s1: 1.08, fx: 0.25, fy: 0.2,
    over: <RedLabel text="BUSCH GARDENS, TAMPA" at={F(0.5)} hold={F(2.4)} /> },
  { a: 11.31, b: 14.71, vo: "On the afternoon of Wednesday the 12th of February 2014, (the fire truck in the rain)", from: 36.0, s0: 1.04, s1: 1.1, fx: 0.55, fy: 0.5,
    over: <RedLabel text="FEBRUARY 12, 2014" at={F(1.0)} hold={F(2.0)} /> },
  { a: 14.71, b: 19.6, vo: "it stalled on a crest not long out of the station. The train was left sitting on that crest, (StationCrest)",
    node: <StationCrest {...SITE} focus={[1120, 640]} z0={1.12} z1={1.4} boxAt={4} traceAt={16} traceLen={70} stationLabel="CHEETAH HUNT STATION" label="ABOUT 50 M OUT" /> },
  { a: 19.6, b: 21.09, vo: "high over the park. (ladder tower + train on the crest, wide)", from: 69.4, s0: 1.0, s1: 1.04, fx: 0.5, fy: 0.5 },
  // RAW 1 (cue CH 0:12-0:31): the bucket beside the train
  { a: 21.09, b: 32.19, vo: "RAW: bucket at the stalled train", from: 14.9, s0: 1.0, s1: 1.05, fx: 0.6, fy: 0.4 },
  { a: 32.19, b: 35.51, vo: "According to CNN, the riders sat up there in the rain, (riders in blue ponchos, close)", from: 11.4, s0: 1.55, s1: 1.65, fx: 0.38, fy: 0.12 },
  { a: 35.51, b: 38.39, vo: "in ponchos, for more than three hours. (the train on the crest, close)", from: 46.6, s0: 1.7, s1: 1.8, fx: 0.72, fy: 0.78 },
  // RAW 2 (cue CH 0:46-1:16): the aerial ladder raised at the ride
  { a: 38.39, b: 53.49, vo: "RAW: aerial ladder at the crest", from: 49.9, s0: 1.0, s1: 1.04, fx: 0.4, fy: 0.5, cr: true },
  { a: 53.49, b: 56.26, vo: "Tampa Fire Rescue brought two ladder companies (the ladder truck)", from: 39.9, s0: 1.12, s1: 1.18, fx: 0.45, fy: 0.55, cr: true },
  { a: 56.26, b: 59.0, vo: "and used a cherry picker that was already on site. (the cherry picker's boom, close)", from: 77.4, s0: 1.6, s1: 1.7, fx: 0.72, fy: 0.45, cr: true },
  { a: 59.0, b: 63.87, vo: "Once crews were in place, ... about an hour to get everyone off. (slow replay: the bucket at the train)", from: 20.0, rate: 0.5, s0: 1.35, s1: 1.45, fx: 0.72, fy: 0.45, cr: true },
  // RAW 3 (cue CH 1:16-1:37, moved one sentence later so no VO stretch between raws is under 6 s): wide, train high, ladders working
  { a: 63.87, b: 78.87, vo: "RAW: wide, train on the crest, ladders and cherry picker", from: 80.6, s0: 1.0, s1: 1.04, fx: 0.3, fy: 0.3, cr: true },
  { a: 78.87, b: 86.07, vo: "The park said fifteen ... The fire service said ... sixteen off. Somebody, somewhere, miscounted. (CountDiff)",
    node: <CountDiff bg={M} bgFrom={56.0} leftAt={F(0.55)} rightAt={F(2.35)} redAt={F(3.8)} ruleAt={F(5.0)} leftName="BUSCH GARDENS" rightName="TAMPA FIRE RESCUE" /> },
  { a: 86.07, b: 88.56, vo: "Nobody was hurt. Busch Gardens said only (the truck, lights on)", from: 32.4, s0: 1.03, s1: 1.08, fx: 0.4, fy: 0.5, cr: true },
  { a: 88.56, b: 91.34, vo: "that the ride had malfunctioned near the loading station. (the teal station-side building under the track, close)",from: 65.3, s0: 1.55, s1: 1.62, fx: 0.62, fy: 0.92, cr: true },
  { a: 91.34, b: 95.5, vo: "It stayed shut the next day while the park worked out why. (wide, slowed)", from: 95.8, rate: 0.5, s0: 1.04, s1: 1.1, fx: 0.3, fy: 0.3, cr: true },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(14.71), kind: "zoomHit", len: 10 },   // into the aerial
  { at: F(19.6), kind: "blurDip", len: 12 },    // aerial -> footage
  { at: F(32.19), kind: "blurDip", len: 10 },   // A raw -> A close
  { at: F(38.39), kind: "blurDip", len: 10 },   // C close -> C raw
  { at: F(78.87), kind: "glitch", len: 8 },     // into the tallies
  { at: F(91.34), kind: "blurDip", len: 12 },
];

const Slow: React.FC<{ s: Sh }> = ({ s }) => {
  const f = useCurrentFrame(); const n = F(s.b) - F(s.a); const u = Math.min(1, f / Math.max(1, n - 1));
  const e = u * u * (3 - 2 * u); const k = (s.s0 ?? 1) + ((s.s1 ?? s.s0 ?? 1) - (s.s0 ?? 1)) * e;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${k.toFixed(5)}, ${k.toFixed(5)}, 1)`, transformOrigin: `${(s.fx ?? 0.5) * 100}% ${(s.fy ?? 0.5) * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(M)} startFrom={Math.round((s.from ?? 0) * 30)} playbackRate={s.rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// the fire service's credit, small, bottom-right (cut sheet: from source 0:48 on)
const Credit: React.FC = () => (<>
  <RedLabel text="" at={1e6} />{/* loads the channel fonts */}
  <div style={{ position: "absolute", right: 46, bottom: 34, fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 700, 'wdth' 100", fontSize: 22,
    letterSpacing: "0.04em", color: "rgba(255,255,255,.82)", textShadow: "0 1px 4px rgba(0,0,0,.8)" }}>VIDEO: TAMPA FIRE RESCUE</div>
</>);

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.rate) return <FilmLook_FX grain={0.08}><Slow s={s} /></FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={M} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

const X = "sfx_n2/real/";
const RAWS: [number, number, number][] = [[21.09, 32.19, 14.9], [38.39, 53.49, 49.9], [63.87, 78.87, 80.6]];
const VO: [number, number, number][] = [[4.0, 0, 17.09], [32.19, 17.09, 23.29], [53.49, 23.29, 33.67], [78.87, 33.67, 49.6]];
const duck = (t: number) => RAWS.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="STUCK IN THE RAIN" bg={GR + "title.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}{s.cr && <Credit />}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE23.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound = the release's own location sound (engine idle, the truck's pump tone, rain); rawclean.py found no music: media/main_clean.wav */}
      {RAWS.map(([a, b, src], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(-12) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 5), ~10 LU under the VO, dipped under the raws */}
      <Sequence from={F(3.6)} durationInFrames={F(95.5) - F(3.6)} layout="none">
        <Audio src={staticFile("music/Music 5.mp3")} startFrom={F(12)} volume={(f) => {
          const t = f / 30 + 3.6;
          return dB(-15) * interpolate(f, [0, 30, F(89.5), F(91.8)], [0, 1, 1, 0.55], cl) * interpolate(t, [93.5, 95.4], [1, 0], cl) * (0.12 + 0.88 * duck(t));
        }} />
      </Sequence>
      {/* real rain bed under the VO (it rained all through the rescue), out under the raws (they carry their own rain) */}
      <Audio src={staticFile(X + "rain_22.wav")} loop volume={(f) => { const t = f / 30; return dB(-17) * duck(t) * interpolate(t, [0, 1.2, 93.5, 95.4], [0, 1, 1, 0], cl); }} />
      <Sequence from={F(3.95)} layout="none"><Audio src={staticFile("sfx_n2/glitch_02.wav")} volume={dB(-26)} /></Sequence>
      <Sequence from={F(78.82)} layout="none"><Audio src={staticFile("sfx_n2/glitch_03.wav")} volume={dB(-30)} /></Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
