// Amusement Parks Iceberg #19 (LEVEL 5 "The Deepest", 2nd case) — Ocean Park Hong Kong, "Buried Alive" walk-through at the Halloween
// festival, Saturday 16 Sep 2017 ~2 pm: a 21-year-old student went into a staff-only machinery area behind the attraction and was struck
// by the moving coffin mechanism; EMSD found no mechanical failure; coroner: accident; never reopened. No footage exists (news only), no
// Commons photo of the attraction: real Commons photos of Ocean Park's Halloween festival + the real Asia Times report (18 Sep 2017).
// VO = vor/CASE19.mp3, one take, unsplit; no raw (no incident clip exists). Device: DarkTorch (the report read by torch light in the dark).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Still, type Cam } from "../dev/AM1720_Still";
import { DarkTorch } from "../dev/AM19_DarkTorch";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const TC = 4.0, v = (t: number) => +(t + TC).toFixed(2), VO_END = v(75.86);
export const DUR = F(VO_END + 1.3);

const IM: Record<string, [number, number]> = { entrance: [1024, 768], pumpkin: [1920, 1440], signs: [1920, 1440], bash: [720, 540], staffs: [1280, 1600], op444: [1920, 1440], op2044: [1920, 1440] };
const st = (n: string, a: Cam, b: Cam, o: { look?: [number, number]; gray?: number } = {}) => <Still src={GR + n + ".jpg"} iw={IM[n][0]} ih={IM[n][1]} a={a} b={b} {...o} />;

type Sh = { a: number; b: number; vo: string; node: React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: v(0), b: v(4.84), vo: "Buried Alive was part of Ocean Park's 2017 Halloween festival in Hong Kong. (the park entrance dressed for Halloween)",
    node: st("entrance", { x: 0.5, y: 0.5, s: 1.02 }, { x: 0.5, y: 0.46, s: 1.12 }),
    over: <RedLabel text="OCEAN PARK, HONG KONG" at={F(1.4)} hold={F(2.6)} /> },
  { a: v(4.84), b: v(11.80), vo: "You went in on your own and lay down in a coffin. Then the bottom dropped away, and you slid down into a pitch-black maze. (festival performers, the light going out)",
    node: st("staffs", { x: 0.5, y: 0.4, s: 1.05 }, { x: 0.5, y: 0.5, s: 1.22 }, { look: [0, 0.95] }) },
  { a: v(11.80), b: v(20.96), vo: "On Saturday, September 16, at around two in the afternoon, a 21-year-old university student, Cheung Chiu-kit, went in. He didn't come out. (the festival's pumpkin)",
    node: st("pumpkin", { x: 0.5, y: 0.5, s: 1.03 }, { x: 0.48, y: 0.46, s: 1.16 }),
    over: <RedLabel text="SEPTEMBER 16, 2017" at={F(0.8)} hold={F(2.6)} /> },
  { a: v(20.96), b: v(24.89), vo: "Somewhere in the dark, he took a wrong turn and ended up behind the attraction, (the park's direction signs at the festival)",
    node: st("signs", { x: 0.5, y: 0.5, s: 1.05 }, { x: 0.55, y: 0.45, s: 1.2 }, { look: [0.1, 0.45] }) },
  { a: v(24.89), b: v(32.57), vo: "in a staff-only area where the coffin machinery moved. When the machinery stopped, a staff member went to check and found him unconscious. (DarkTorch: the Asia Times report)",
    node: <DarkTorch page={C + "shots/at_sheet.png"} pw={1430} ph={1380} rule={{ box: [228, 1268, 399, 1316], at: 118 }}
      beam={[{ at: 0, x: 700, y: 270, r: 400 }, { at: 46, x: 640, y: 880, r: 360 }, { at: 104, x: 560, y: 1300, r: 450 }, { at: 230, x: 580, y: 1305, r: 470 }]}
      cam={[{ at: 0, y: 330, k: 1.02 }, { at: 104, y: 1110, k: 1.22 }, { at: 230, y: 1125, k: 1.3 }]} />,
    over: <RedLabel text="ASIA TIMES, SEPT 18, 2017" at={F(0.4)} hold={F(2.0)} y={0.12} size={34} /> },
  { a: v(32.57), b: v(40.71), vo: "He'd been struck by a moving part, and he died in the hospital. It was the first death at the park's Halloween event, which had run since 2001. (the festival in 2019, held dark)",
    node: st("op444", { x: 0.5, y: 0.5, s: 1.08 }, { x: 0.5, y: 0.5, s: 1.18 }, { look: [0.55, 0.3] }) },
  { a: v(40.71), b: v(47.29), vo: "Inspectors found nothing had broken, so lawmakers asked the obvious question. Why wasn't that area locked? (the entrance again, tight)",
    node: st("entrance", { x: 0.3, y: 0.6, s: 1.6 }, { x: 0.33, y: 0.58, s: 1.75 }) },
  { a: v(47.29), b: v(51.22), vo: "Police sources suggested he may have missed a dimly lit warning sign. (the festival's signs, dim)",
    node: st("op2044", { x: 0.5, y: 0.5, s: 1.05 }, { x: 0.52, y: 0.52, s: 1.15 }, { look: [0.4, 0.65] }) },
  { a: v(51.22), b: v(57.71), vo: "At the inquest, a trainer testified that performers inside should've stopped him. The coroner ruled it an accident. (costumed performers at the festival's show)",
    node: st("bash", { x: 0.5, y: 0.5, s: 1.02 }, { x: 0.5, y: 0.48, s: 1.12 }) },
  { a: v(57.71), b: v(65.05), vo: "In a haunted house, a figure moving through the dark is part of the show. I think that's exactly why nobody saw a guest in trouble. (performers, tight, near dark)",
    node: st("staffs", { x: 0.45, y: 0.3, s: 1.5 }, { x: 0.47, y: 0.33, s: 1.62 }, { look: [0.65, 0.8], gray: 0.2 }) },
  { a: v(65.05), b: v(71.0), vo: "The government ordered it shut, and Buried Alive never reopened. His family sued the park the next year, (the pumpkin, tight)",
    node: st("pumpkin", { x: 0.35, y: 0.55, s: 1.6 }, { x: 0.37, y: 0.55, s: 1.72 }) },
  { a: v(71.0), b: VO_END + 1.3, vo: "and at the inquest, the park said it had revised its safety rules and added lighting. (the festival entrance wide, slow pull, fade)",
    node: st("signs", { x: 0.4, y: 0.6, s: 1.5 }, { x: 0.45, y: 0.55, s: 1.25 }) },
];

const CUTS: FxCut[] = [
  { at: F(TC), kind: "glitch", len: 10 },
  { at: F(v(24.89)), kind: "blurDip", len: 12 },
  { at: F(v(32.57)), kind: "blurDip", len: 14 },
];
const SFX: [number, string, number][] = [
  [TC - 0.05, "sfx_n2/glitch_02.wav", -24],
  [v(24.89), "sfx_n2/real/flashlight_click_2.wav", -24],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(TC)} layout="none"><AbsoluteFill><TitleCard dur={F(TC)} title="BURIED ALIVE" bg={GR + "staffs.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => (
            <Sequence key={i} from={F(s.a)} durationInFrames={F(s.b) - F(s.a)} layout="none">
              <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node}</FilmLook_FX>{s.over}</AbsoluteFill>
            </Sequence>
          ))}
        </AbsoluteFill>
      </Transitions_FX>
      <Sequence from={F(VO_END + 0.2)} layout="none"><FadeBlack len={F(1.1)} /></Sequence>
      <Sequence from={F(TC)} layout="none"><Audio src={staticFile("vor/CASE19.mp3")} /></Sequence>
      {/* music: Epidemic ambient Music 4, -21.5 dB (matched to the AM01 bed), dip on the death line */}
      <Sequence from={0} durationInFrames={DUR} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(15)} volume={(f) => {
          const t = f / 30;
          const dip = interpolate(t, [v(32.3), v(33.0), v(36.0), v(37.0)], [1, 0.6, 0.6, 1], cl);
          return dB(-21.5) * interpolate(t, [0, 1.2, VO_END - 0.5, VO_END + 1.3], [0, 1, 1, 0], cl) * dip;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);

const FadeBlack: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{ background: "#000", opacity: interpolate(f, [0, len - 2], [0, 1], cl) }} />;
};
