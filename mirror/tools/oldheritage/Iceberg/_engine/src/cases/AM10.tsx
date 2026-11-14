// Amusement Parks Iceberg #10 (LEVEL 2, case 3) — Green Plaza mall (Smouha Tourist Center), east Alexandria, Egypt, late Thu 25 May 2023
// (CCTV clock Fri 26 May 00:15): the seat ring of a spinning pendulum ride ("al-dawwara") came off its arm at the top of a swing with 3 riders
// and landed on 3 bystanders by the ticket booth; 6 hurt (15-27), nobody died; two staff held 4 days on suspicion of negligence.
// Footage: [main] the mall CCTV re-post (9uPgCBtPPVk, AMBER, 426x320 @20 fps -> 1440x1080 lanczos @30, graded, src 0-70 only). Silent
// CCTV: the raw plays without clip sound, real SFX on the tear-off and the landing. Wide only: no freeze or zoom on the landing spot or the
// crowd (a small child in a ride-on car crosses the bottom from ~38 s: kept wide, never the subject). Skip 66 s+ (crowd lifting the wreck).
// Slow files (0.5x, minterpolate): ride_slow = 19.0-25.6, tear_slow = 49.0-52.6, pre_slow = 25.5-33.6. Still: Commons "Smouha.jpg"
// (Abdelrhman 1990, CC BY-SA 4.0). Page: Egypt Independent 29 May 2023 (Wayback copy), dev/AM10_BacklitPage.
// Motion analysis: the ring leaves the arm ~src 50.7 and lands left by the booth ~51.6; the re-encode has 1-frame blips every 5 s (45, 50, 55…).
// VO split only at the raw (sentence end "…watch the top of the swing."): A 0-39.60 @4.0 | RAW 43.60-59.60 (src 41.05-57.05) |
// B 39.80-end @59.60, last word 98.64 -> 118.44, hold + fade to 120.4.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Shot_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BacklitPage } from "../dev/AM10_BacklitPage";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(120.4);
const TC = 4.0;

type Sh = { a: number; b: number; vo: string; src?: string; still?: boolean; fill?: boolean; from?: number; s0?: number; s1?: number; fx?: number; fy?: number; node?: React.ReactNode; over?: React.ReactNode };

const SHOTS: Sh[] = [
  { a: 4.00, b: 14.56, vo: "The clock in the top corner of this security camera reads just before a quarter past midnight on Friday, May 26, 2023, so really it's still late Thursday night. (CCTV, slow push toward its clock)",
    src: "main.mp4", fill: true, from: 0, s0: 1.0, s1: 1.12, fx: 0.12, fy: 0.08 },
  { a: 14.56, b: 23.12, vo: "The camera hangs over a walkway in Green Plaza, one of the busiest malls in Alexandria, Egypt. Its indoor play area is still full of families. (wide)",
    src: "main.mp4", fill: true, from: 10.56, s0: 1.06, s1: 1.0,
    over: <><RedLabel text="GREEN PLAZA" at={F(1.8)} hold={F(2.2)} /><RedLabel text="ALEXANDRIA, EGYPT" at={F(4.2)} hold={F(2.0)} /></> },
  { a: 23.12, b: 36.20, vo: "The ride in the middle is a spinning pendulum. A ring of outward-facing seats spins on the end of an arm ... Three riders are strapped in while people lean on the fence to watch. (0.5x, closer on the ride)",
    src: "ride_slow.mp4", fill: true, from: 0, s0: 1.18, s1: 1.24, fx: 0.5, fy: 0.5 },
  { a: 36.20, b: 43.60, vo: "For almost a minute it's just a ride doing what it does. When the clock passes a quarter past twelve, watch the top of the swing. (wide, runs straight into the raw)",
    src: "main.mp4", fill: true, from: 33.65, s0: 1.0, s1: 1.0 },
  // RAW (main, 16 s, silent CCTV + real SFX): src 41.05-57.05: the swing, the seat ring tears off (~50.7) and lands by the booth (~51.6), people run in
  { a: 43.60, b: 59.60, vo: "RAW: src 41.05-57.05", src: "main.mp4", fill: true, from: 41.05, s0: 1.0, s1: 1.0 },
  { a: 59.60, b: 65.36, vo: "That's the whole seat ring, with the riders still in it. Within seconds the walkway floods with people. (0.5x replay, wide)",
    src: "tear_slow.mp4", fill: true, from: 0, s0: 1.0, s1: 1.02 },
  { a: 65.36, b: 70.88, vo: "Some families grabbed their children and left, while others tried to lift the wreck off the people underneath. (the walkway fills, wide)",
    src: "main.mp4", fill: true, from: 57.05, s0: 1.0, s1: 1.03 },
  { a: 70.88, b: 81.37, vo: "Six went to the hospital, the three riders and three people who'd just been standing nearby, some with broken bones. Nobody died. Half the people hurt never even got on the ride. (before: people at the fence, 0.5x)",
    src: "pre_slow.mp4", fill: true, from: 0, s0: 1.0, s1: 1.1 },
  { a: 81.37, b: 87.01, vo: "I didn't know a ride could sit in a mall walkway with nobody's license covering it, but that's where this one was. (the ride in the walkway, closer)",
    src: "pre_slow.mp4", fill: true, from: 10.5, s0: 1.22, s1: 1.28 },
  { a: 87.01, b: 91.00, vo: "Whose ride was it, the mall's or the play area's? On paper, neither. (the first frame, pulling back)", src: "f0.05.jpg", still: true, fill: true, s0: 1.12, s1: 1.0 },
  { a: 91.00, b: 96.39, vo: "East Alexandria's district chief said the play area was licensed in the mall's name, (Smouha)", src: "smouha.jpg", still: true, s0: 1.04, s1: 1.12, fx: 0.5, fy: 0.5,
    over: <RedLabel text="SMOUHA, EAST ALEXANDRIA" at={F(0.3)} hold={F(2.8)} /> },
  { a: 96.39, b: 102.62, vo: "but this ride sat outside the licensed area. It belonged to someone else, who'd set it up in the walkway with the park manager's agreement. (the ride in the walkway)",
    src: "f20.0.jpg", still: true, fill: true, s0: 1.0, s1: 1.16 },
  { a: 102.62, b: 120.40, vo: "Prosecutors went through this same footage ... no charges have been reported. (BacklitPage: Egypt Independent over the CCTV)",
    node: <BacklitPage page={C + "shots/ei_sheet.png"} pw={1940} ph={1725} bg={GR + "main.mp4"} bgFrom={0.0} head={[40, 800]} slideAt={50}
      paras={[[850, 1110, 74], [1170, 1440, 191], [1500, 1665, 281]]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },      // title card -> the case
  { at: F(14.56), kind: "blurDip", len: 12 },   // same camera, reframe
  { at: F(23.12), kind: "blurDip", len: 10 },   // same camera, 0.5x closer
  { at: F(36.20), kind: "blurDip", len: 10 },   // back to wide, real speed
  { at: F(59.60), kind: "blurDip", len: 14 },   // raw -> replay
  { at: F(65.36), kind: "blurDip", len: 10 },   // replay -> the walkway after
  { at: F(70.88), kind: "blurDip", len: 10 },   // back to before the accident
  { at: F(81.37), kind: "blurDip", len: 10 },   // same camera, closer
  { at: F(87.01), kind: "blurDip", len: 10 },   // the first frame
  { at: F(102.62), kind: "blurDip", len: 12 },  // into the report
];

const PART: [number, number, number | null][] = [[TC, 0.0, 39.60], [59.60, 39.80, null]];
const RAWS: [number, number][] = [[43.60, 59.60]];

const SFX: [number, string, number, number?][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24],
  [53.25, "sfx_n2/real/metal_clank_3.wav", -20],   // the ring tears off the arm
  [54.15, "sfx_n2/real/impact_3.wav", -17],        // it lands by the booth
  [102.57, "sfx_n2/real/paper_3.wav", -26],
];

const ShotView: React.FC<{ s: Sh }> = ({ s }) => {
  if (s.node) return <FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>;
  return <FilmLook_FX grain={0.08}><Shot_FX src={GR + s.src!} still={s.still} fill={s.fill} n={F(s.b) - F(s.a)} from={s.from} s0={s.s0} s1={s.s1} fx={s.fx} fy={s.fy} /></FilmLook_FX>;
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="GREEN PLAZA" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none"><AbsoluteFill><ShotView s={s} />{s.over}</AbsoluteFill></Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(119.2)} layout="none"><FadeBlack len={F(120.4 - 119.2)} /></Sequence>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE10.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* music: Epidemic ambient Music 4, -21.5 dB under the VO; the raw is silent CCTV, so the bed lifts a little there */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(15)} volume={(f) => {
          const t = f / 30;
          const up = RAWS.reduce((m, [ra, rb]) => Math.max(m, interpolate(t, [ra - 0.4, ra + 0.8, rb - 0.8, rb + 0.2], [0, 1, 1, 0], cl)), 0);
          return dB(-21.5 + 4 * up) * interpolate(t, [0, 1.2, 118.6, 120.3], [0, 1, 1, 0], cl);
        }} />
      </Sequence>
      {SFX.map(([t, f, d, len], i) => <Sequence key={"x" + i} from={F(t)} durationInFrames={len ? F(len) : undefined} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
