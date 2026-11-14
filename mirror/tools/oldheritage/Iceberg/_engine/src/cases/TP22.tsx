// Theme Park #22 — Eastbourne Pier, 30 July 2014: the amusement arcade halfway along the pier burns on a busy summer afternoon;
// the beach fills with watchers; two-thirds of the pier is saved. Footage: [EM] pQZsrKPC-bM (the filmer's own phone clips: landscape
// + vertical, a 4-s montage from 176 s; its track is an added pop song then silence, so its raws carry GZ's real beach sound), [ER] 4nx3Rx8PD_8 (Rob Bain, wide over the
// crowd), [EC] f9aBE6vjEhY (Christopher Friend, from the promenade), + more/ from small personal channels: GZIvbrCcbco (Faza Filmuje,
// the fire from the promenade and beach, 1080p), 7ZCuy-S1AtU + LPLfbsGMWDI (Paul Briden, the burned arcade 13 Aug 2014),
// jgfyDP_KzRM (Richard and Bianca Howes, the wreck and the workers under the pier).
// Devices for this case, each used once: PierThirds (the 1,000 ft deck on a side-on photo of the day, the arcade boxed, then the burned third red vs
// the saved two-thirds white) and CoastChain (Weston 2008 -> Hastings 2010 -> Eastbourne 2014 on Sentinel-2, a photo plate at each;
// once, on "Three British pier fires now"). VO = one take, split only at four paragraph ends where the raws sit (main raw 18 s).
// Source cuts: EM 5.57 10.78 15.08 26.43 71.04 95.90 110.04 113.68 128.70 135.40 145.58 151.18 159.63 169.34 176.11 then every 4.004 s;
// ER 84.8 (white flash); EC none; GZ 122.0 136.7.
import React from "react";
import { cutOut } from "../lib/core/cutOut";
import { AbsoluteFill, Audio, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { PierThirds } from "../dev/TP22_PierThirds";
import { CoastChain } from "../dev/TP22_CoastChain";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const DUR = F(165.4);

type Sh = { a: number; b: number; vo: string; src?: string; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; vert?: boolean; still?: boolean; node?: React.ReactNode; over?: React.ReactNode };

// map pixels (Sentinel-2 cloudless mosaic z10, see NOTES): 3568x1621
const WIDE = { src: GR + "coast2.jpg", iw: 3568, ih: 1621 };
const WES: [number, number] = [558, 434], HAS: [number, number] = [3148, 1008], EAS: [number, number] = [2942, 1110];

const SHOTS: Sh[] = [
  // P1 — take 0-21.70 @ 4.0 (paragraph 1)
  { a: 4.0, b: 7.73, vo: "Every other pier fire here started after dark, on an empty pier. (the pier before the fire)", src: "em.mp4", from: 6.4, s0: 1.02, s1: 1.08, fx: 0.55, fy: 0.45 },
  { a: 7.73, b: 10.34, vo: "Eastbourne's started on a busy summer afternoon, (the beach full)", src: "em.mp4", from: 0.8, s0: 1.14, s1: 1.07, fx: 0.4, fy: 0.6 },
  { a: 10.34, b: 13.37, vo: "Wednesday the 30th of July 2014.", src: "emv.mp4", from: 16.0, vert: true, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4,
    over: <RedLabel text="EASTBOURNE PIER · JULY 30, 2014" at={F(0.5)} hold={F(2.3)} /> },
  { a: 13.37, b: 16.19, vo: "The Victorian pier was full of holidaymakers. (the same arcade, 1999, people on the deck)", src: "pier99.jpg", still: true, s0: 1.18, s1: 1.28, fx: 0.4, fy: 0.55 },
  { a: 16.19, b: 20.2, vo: "Then smoke began pouring out of the amusement arcade halfway along it.", src: "emv.mp4", from: 55.0, vert: true, s0: 1.06, s1: 1.14, fx: 0.5, fy: 0.25 },
  { a: 20.2, b: 25.7, vo: "The pier was 144 years old, a thousand feet long and Grade II* listed. (the whole pier side-on, today)", src: "pier18.jpg", still: true, s0: 1.12, s1: 1.2, fx: 0.3, fy: 0.75 },
  // RAW 1 = the main incident raw, 18 s (cue EM 1:12-1:42): smoke pouring off the arcade, the black column, people leaving the shingle
  { a: 25.7, b: 43.7, vo: "RAW", src: "emv.mp4", from: 72.0, vert: true, s0: 1.0, s1: 1.06, fx: 0.5, fy: 0.35 },
  // P2 — take 21.85-38.45 @ 43.70 (paragraph 2)
  { a: 43.7, b: 48.43, vo: "Police said the pier was evacuated quickly and safely and that nobody was trapped. (the promenade, watching)", src: "gz1.mp4", from: 2.5, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.45 },
  { a: 48.43, b: 55.41, vo: "Up to eighty firefighters were sent, along with RNLI lifeboat crews, and between them they saved two-thirds of the pier. (PierThirds: the photo of the day with firefighters + lifeboat; arcade boxed, 1,000 ft rule, burned third red, saved two-thirds white)",
    node: <PierThirds src={GR + "pier.jpg"} mode="all" boxAt={8} ruleAt={F(1.5)} burnAt={F(4.6)} saveAt={F(5.4)} z0={1.0} z1={1.05} /> },
  { a: 55.41, b: 60.3, vo: "On a summer afternoon, that's a lot of people moving down one deck toward the promenade.", src: "em.mp4", from: 96.6, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.6 },
  // RAW 2, 12 s (cue ER 0:02-0:32): the arcade ablaze mid-pier, the plume, the crowd packed on the shingle
  { a: 60.3, b: 72.3, vo: "RAW", src: "er.mp4", from: 2.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.45 },
  // P3 — take 38.72-57.25 @ 72.30 (paragraph 3 + "The beach didn't empty." + the seafront line: cue raws 3/4 merged into raw 3)
  { a: 72.3, b: 75.68, vo: "Three British pier fires now, and they share a problem. (CoastChain)",
    node: <CoastChain {...WIDE} focus0={[1853, 760]} z0={1.0} z1={1.04}
      legs={[{ pts: [WES, HAS], at: 8, len: 30, bow: 330 }, { pts: [HAS, EAS], at: 44, len: 12, bow: 60 }]}
      stops={[{ x: WES[0], y: WES[1], at: 2, photo: GR + "weston.jpg", label: "WESTON-SUPER-MARE 2008", px: 470, py: 600, pos: "50% 40%" },
        { x: HAS[0], y: HAS[1], at: 38, photo: GR + "hastings.jpg", label: "HASTINGS 2010", px: 1560, py: 280, pw: 380, ph: 230, pos: "62% 56%" },
        { x: EAS[0], y: EAS[1], at: 56, photo: GR + "eastb.jpg", label: "EASTBOURNE 2014", px: 1180, py: 850, ph: 220, pos: "45% 50%" }]} /> },
  { a: 75.68, b: 79.83, vo: "The buildings are old timber, with more than a century of paint and wiring. (flames in the arcade's frame)", src: "gz4.mp4", from: 4.0, s0: 1.2, s1: 1.28, fx: 0.45, fy: 0.55 },
  { a: 79.83, b: 83.13, vo: "They stand out over the sea, and the wind goes straight through them. (smoke streaming off the pier)", src: "er.mp4", from: 66.0, s0: 1.06, s1: 1.12, fx: 0.4, fy: 0.4 },
  { a: 83.13, b: 84.96, vo: "The beach didn't empty. (the crowd sitting on the shingle, open flames)", src: "em.mp4", from: 232.9, s0: 1.04, s1: 1.08, fx: 0.5, fy: 0.6 },
  { a: 84.96, b: 87.27, vo: "On a seafront there's no hiding a fire,", src: "em.mp4", from: 224.9, s0: 1.08, s1: 1.13, fx: 0.5, fy: 0.5 },
  { a: 87.27, b: 90.83, vo: "because the smoke blows straight out over the sand where everyone is sitting.", src: "gz2.mp4", from: 6.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.5 },
  // RAW 3, 10 s (cue EC 0:02-0:32): the wide view, the black column, phones held up
  { a: 90.83, b: 100.83, vo: "RAW", src: "ec.mp4", from: 2.0, s0: 1.0, s1: 1.05, fx: 0.5, fy: 0.4 },
  // P4 — take 57.50-67.25 @ 100.83 (paragraph 4)
  { a: 100.83, b: 105.63, vo: "Investigators needed a scaffold platform just to reach the burned section safely. (workers under the pier, half speed)",
    src: "jgslow.mp4", from: 0, s0: 1.03, s1: 1.1, fx: 0.45, fy: 0.7 }, // audit 3 Nov: inset -> full frame (inset kept once, at the wall zoom)
  { a: 105.63, b: 110.58, vo: "Superintendent Laurence Taylor said the area around and under the pier was still very hazardous. (the legs under the burned section)", src: "z7.mp4", from: 39.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.55 },
  // RAW 4, 12 s (cue ER 0:32-1:02): the arcade burning with open flames over the beach crowd
  { a: 110.58, b: 122.58, vo: "RAW", src: "er.mp4", from: 32.0, s0: 1.03, s1: 1.08, fx: 0.5, fy: 0.45 },
  // P5 — take 67.33-end @ 122.58 (the outcome, to the last line)
  { a: 122.58, b: 124.05, vo: "There were no injuries.", src: "gz1.mp4", from: 18.5, s0: 1.03, s1: 1.06 },
  { a: 124.05, b: 128.03, vo: "The arcade was badly damaged, and so was the wooden structure around it. (the burned dome, two weeks on)", src: "z7.mp4", from: 9.0, s0: 1.04, s1: 1.1, fx: 0.5, fy: 0.45 },
  { a: 128.03, b: 132.23, vo: "East Sussex Fire and Rescue believed it started behind some wood panelling. (white-framed zoom into the burning wall)",
    node: <Inset src={GR + "gzwall.mp4"} from={6.0} bg={{ src: GR + "gz3.mp4", from: 46.0 }} box={0.52} ar={16 / 9} pos="50% 50%" drift={0.14} /> },
  { a: 132.23, b: 135.43, vo: "Within two days, Sussex Police were saying someone may have started it,", src: "lpl.mp4", from: 5.0, s0: 1.03, s1: 1.08 },
  { a: 135.43, b: 138.8, vo: "either deliberately or by accident.", src: "jg.mp4", from: 15.0, s0: 1.05, s1: 1.1 },
  { a: 138.8, b: 141.94, vo: "Prime Minister David Cameron came down with the Chancellor. (the wrecked pier)", src: "lpl.mp4", from: 30.0, s0: 1.04, s1: 1.09 },
  { a: 141.94, b: 146.54, vo: "The government offered up to two million pounds to help the town's tourism recover. (the seafront)", src: "z7.mp4", from: 0.3, s0: 1.02, s1: 1.07 },
  { a: 146.54, b: 152.26, vo: "Less than three weeks after the fire, a workman fell from the damaged pier and lost his life.", src: "z7.mp4", from: 21.0, s0: 1.03, s1: 1.09, fx: 0.5, fy: 0.5,
    over: <RedLabel text="AUGUST 2014" at={F(0.6)} hold={F(4.2)} /> },
  { a: 152.26, b: 156.0, vo: "In October 2015 the pier was bought by Abid Gulzar, (the pier today, its domes gilded)", src: "gulzar.jpg", still: true, s0: 1.03, s1: 1.1, fx: 0.62, fy: 0.5,
    over: <RedLabel text="ABID GULZAR · OCTOBER 2015" at={F(0.5)} hold={F(3.0)} /> },
  { a: 156.0, b: 159.67, vo: "the same businessman who'd buy Hastings Pier three years later. (the burned arcade from the promenade)", src: "lpl.mp4", from: 15.0, s0: 1.04, s1: 1.1 },
  { a: 159.67, b: 165.4, vo: "Hastings is just along this coast, and its pier had burned four years earlier. (Hastings Pier after its 2010 fire) + hold", src: "hasdmg.jpg", still: true, s0: 1.02, s1: 1.1, fx: 0.4, fy: 0.55,
    over: <RedLabel text="HASTINGS PIER · 2010" at={F(0.8)} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(7.73), kind: "blurDip", len: 12 },
  { at: F(48.43), kind: "zoomHit", len: 10 },
  { at: F(72.3), kind: "glitch", len: 10 },
  { at: F(84.96), kind: "blurDip", len: 12 },
  { at: F(122.58), kind: "glitch", len: 8 },
  { at: F(128.03), kind: "zoomHit", len: 10 },
  { at: F(146.54), kind: "blurDip", len: 12 },
  { at: F(152.26), kind: "whip", len: 10 },
  { at: F(159.67), kind: "blurDip", len: 14 },
];

// the vertical phone clips: whole, in a white-framed panel over a bright blurred copy of themselves (no dark side bars)
const Vert: React.FC<{ s: Sh }> = ({ s }) => {
  const f = useCurrentFrame(); const n = F(s.b) - F(s.a); const u = Math.min(1, f / Math.max(1, n - 1));
  const k = (s.s0 ?? 1) + ((s.s1 ?? s.s0 ?? 1) - (s.s0 ?? 1)) * (u * u * (3 - 2 * u));
  const H = 1000, W = H * 404 / 720;
  const v = (st: React.CSSProperties) => <OffthreadVideo src={staticFile(GR + s.src!)} startFrom={Math.round((s.from ?? 0) * 30)} muted style={st} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(28px) brightness(0.95) saturate(1.1)", transform: `scale(${1.25 + 0.03 * u})` }}>{v({ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" })}</AbsoluteFill>
      <div style={{ position: "absolute", left: (1920 - W) / 2, top: (1080 - H) / 2, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)", overflow: "hidden", background: "#000" }}>
        <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: `${(s.fx ?? 0.5) * 100}% ${(s.fy ?? 0.5) * 100}%` }}>{v({ width: "100%", height: "100%", objectFit: "cover" })}</AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <>{s.node}</>;
  if (s.vert) return <FilmLook_FX grain={0.08}><Vert s={s} /></FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

// VO parts [timeline at, take from, take to]
const VO: [number, number, number][] = [[4.0, 0, 21.7], [43.7, 21.85, 38.45], [72.3, 38.72, 57.25], [100.83, 57.5, 67.25], [122.58, 67.33, 109.01]];
// raws [a, b, audio, file sec, fade-in frames, fade-out frames, dB]. media/rawN.wav = the window cut from the rawclean output and
// levelled to -25.5 LUFS. EM's own track is a pop song (60-169 s) then digital silence (montage): no real sound to keep, so raw 1
// carries the real beach sound of the same fire from GZIvbrCcbco (Faza Filmuje, GZ 56-74; rawclean: no music there).
const M = C + "media/";
const RAWS: [number, number, string, number, number, number, number][] = [
  [25.7, 43.7, M + "raw1.wav", 0, 8, 14, -3],
  [60.3, 72.3, M + "raw2.wav", 0, 6, 14, 0],
  [90.83, 100.83, M + "raw5.wav", 0, 6, 14, 0],
  [110.58, 122.58, M + "raw6.wav", 0, 6, 14, 0],
];
const RAWWIN: [number, number][] = RAWS.map(([a, b]) => [a, b]);
const MUS: [number, number, number][] = [[3.6, 96.0, 30], [95.0, 165.4, 8]];
const X = "sfx_n2/real/";
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -26],
  [48.38, "sfx_n2/whoosh_02.wav", -32],
  [72.25, "sfx_n2/glitch_03.wav", -28],
  [81.5, X + "wind_gust_1.wav", -27],       // the wind through the pier
  [122.53, "sfx_n2/glitch_01.wav", -28],
  [128.03, X + "camera_shutter_2.wav", -32], // the zoom into the wall
  [152.2, "sfx_n2/whoosh_03.wav", -32],
];

const CompFull: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="FIRE ON A SUMMER AFTERNOON" bg={C + "media/title.jpg"} pos="50% 40%" /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      {VO.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE22.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, file, src, fi, fo, d], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(file)} startFrom={F(src)} volume={(f) => dB(d) * interpolate(f, [0, fi, F(b) - F(a) - fo - 1, F(b) - F(a) - 1], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient (Music 3, 152 s), ~10 LU under the VO, dipped under every raw; the file is re-entered inside raw 4
          (where the bed is ducked) with a 1 s crossfade, so it never runs out */}
      {MUS.map(([t0, t1, from], i) => (
        <Sequence key={"m" + i} from={F(t0)} durationInFrames={F(t1) - F(t0)} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(from)} volume={(f) => {
            const t = f / 30 + t0; const duck = RAWWIN.reduce((m, [a, b]) => Math.min(m, t < a - 0.8 || t > b + 0.6 ? 1 : t < a ? (a - t) / 0.8 : t > b ? (t - b) / 0.6 : 0), 1);
            const xf = interpolate(t, [t0, t0 + 1, t1 - 1, t1], [i === 0 ? 0 : 0, 1, 1, i === MUS.length - 1 ? 1 : 0], cl);
            return dB(-20.5) * xf * interpolate(t, [3.6, 4.6, 164.3, 165.35], [0, 1, 1, 0], cl) * (0.12 + 0.88 * duck);
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

// RAW AUDIT 3 Nov 2026 (owner: raws only at incident moments): raw 3 (EC wide, end of the pier-problem explanation) and raw 4 (ER, investigation phase) removed; VO runs on. 4 -> 2 raws.
const _cut = cutOut(CompFull, DUR, [[90.83, 100.83], [110.58, 122.58]]);
export const Comp = _cut.Comp;
const DUR_OUT = _cut.DUR;
export { DUR_OUT as DUR };
