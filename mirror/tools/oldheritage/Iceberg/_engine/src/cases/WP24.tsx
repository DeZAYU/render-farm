// Workplace #24 — Indian Oil terminal, Sitapura, Jaipur, 29 Oct 2009: petrol leaked during a transfer from a tank into a pipeline,
// the vapour cloud spread across the site and exploded; the fire burned for about eleven days. Eleven lives, 300+ injured.
// Footage (small personal uploaders only): IOC = vinitkumardharad (T2Ok6Rmt518): night handheld of the fire over the terminal wall
// (its own track carries music -> muted per the cut sheet; real SFX). KK = Kamal Khatri (Qsl7iyfWHCY, 5 subs): the burning tank rows
// from far off at night. PR = Caribbean Petroleum (CASE08's graded morning clip, Werius IhGPLhO3G-c). BFG / BFC = Buncefield 2005
// CCTV evidence released by the UK Health and Safety Executive ("Solutions from HSE": nQuCdXen3b0 garden camera, eIp1TMiI_nQ blast).
// VO = one take (CASE24.mp3), split once at the raw. RAW = IOC src 63.2-74.8 (11.6 s): the fireball rolling up over the wall.
// Blender (build/CASE24/maps/leak.py): a terminal at dusk, petrol spraying from a valve on the line, the vapour sheet spreading.
// Devices: StampPunch (Buncefield camera's own time stamp, 6:01 on a Sunday), FenceSplit (the terminal wall: inside vs outside).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { BlenderShot, Clip, F, cl, io } from "../dev/WP45_kit";
import { StampPunch } from "../dev/WP24_StampPunch";
import { FenceSplit } from "../dev/WP24_FenceSplit";
import { LK } from "../dev/WP24_blLabels";

const C = "case/", G = C + "graded/";
const IOC = G + "ioc.mp4", KK = G + "kk.mp4", PR = G + "pr.mp4", BFG = G + "bfg.mp4", BFC = G + "bfc.mp4";
const dB = (d: number) => Math.pow(10, d / 20);

// timeline (s): title 0-4 | VO part 1 (take 0-27.48) @4.0 (case = take + 4) | RAW 31.7-43.3 (IOC src 63.2-74.8) |
// VO part 2 (take 27.45-end) @43.3 (case = take + 15.85), VO ends ~110.36, hold to END
const v1 = (t: number) => t + 4.0;
const RAW: [number, number] = [31.7, 43.3];
const R0 = 63.2;
const V2 = 27.45, v2 = (t: number) => t + (RAW[1] - V2);
const END = 111.7;
export const DUR = F(END);
const PART: [number, number, number | null][] = [[4.0, 0, 27.48], [RAW[1], V2, null]];

/** extra eased push over a Blender shot (its own camera starts slowly) */
const Push: React.FC<{ n: number; s1?: number; children: React.ReactNode }> = ({ n, s1 = 1.07, children }) => {
  const f = useCurrentFrame(); const s = 1 + (s1 - 1) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: "50% 55%" }}>{children}</AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: v1(4.97), vo: "Indian Oil, Sitapura, outside Jaipur. October 2009. (IOC: the fire over the terminal wall)",
    node: (n) => <><Clip src={IOC} from={1.4} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.45} />
      <RedLabel text="INDIAN OIL TERMINAL · SITAPURA, JAIPUR" at={8} hold={F(2.3)} size={40} /><RedLabel text="OCTOBER 29, 2009" at={F(3.1)} hold={F(1.6)} size={44} /></> },
  { a: v1(4.97), b: v1(7.58), vo: "The fire there went on for about eleven days. (KK: the tank rows burning from far off)",
    node: (n) => <Clip src={KK} from={19.0} n={n} s0={1.12} s1={1.04} fx={0.5} fy={0.6} /> },
  { a: v1(7.58), b: v1(11.98), vo: "Indian Oil is the country's biggest oil company, and it's owned by the government. (IOC)",
    node: (n) => <Clip src={IOC} from={39.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: v1(11.98), b: v1(15.88), vo: "At least forty of its employees were at the terminal when the fire started. (IOC)",
    node: (n) => <Clip src={IOC} from={11.0} n={n} s0={1.1} s1={1.03} fx={0.5} fy={0.5} /> },
  { a: v1(15.88), b: v1(24.58), vo: "At about half past seven ... petrol moved from a storage tank into a pipeline. The petrol leaked, and the vapour spread across the site. (Blender leak)",
    node: (n) => <Push n={n}><BlenderShot src={C + "maps/leak.mp4"} track={LK} labels={[["tank", "STORAGE TANK", 20, 64, -0.06], ["line", "PIPELINE", 110, 60, -0.07]]} /></Push> },
  { a: v1(24.58), b: RAW[0], vo: "When it ignited, the explosion was massive. (KK: the far blast blooms)",
    node: (n) => <Clip src={KK} from={24.0} n={n} s0={1.0} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: RAW[0], b: RAW[1], vo: "RAW: the fireball rolling up over the terminal wall (IOC src 63.2-74.8, real SFX)",
    node: (n) => <Clip src={IOC} from={R0} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.45} /> },
  { a: RAW[1], b: v2(33.54), vo: "At least eleven people lost their lives ... more than three hundred were injured. (replay of the fireball 0.5x, pushed)",
    node: (n) => <Clip src={IOC} from={65.0} rate={0.5} n={n} s0={1.12} s1={1.3} fx={0.48} fy={0.4} /> },
  { a: v2(33.54), b: v2(42.32), vo: "It's the same sequence as Caribbean Petroleum on level two ... In Puerto Rico, three people were hurt. (PR)",
    node: (n) => <><Clip src={PR} from={8.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.5} />
      <RedLabel text="CARIBBEAN PETROLEUM · PUERTO RICO, 2009" at={F(34.79 - 33.54)} hold={F(2.4)} size={40} /></> },
  { a: v2(42.32), b: v2(44.79), vo: "Here, it burned for eleven days. (KK)",
    node: (n) => <Clip src={KK} from={50.0} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.55} /> },
  { a: v2(44.79), b: v2(54.66), vo: "A case in England ... Buncefield oil depot north of London, because its gauge stuck. (BFG: the cloud creeping over the lawn)",
    node: (n) => <><Clip src={BFG} from={0.5} n={n} s0={1.0} s1={1.08} fx={0.5} fy={0.6} />
      <RedLabel text="BUNCEFIELD OIL DEPOT · ENGLAND" at={F(50.56 - 44.79)} hold={F(2.0)} size={40} /><RedLabel text="DECEMBER 11, 2005" at={F(47.3 - 44.79)} hold={F(2.0)} size={44} /></> },
  { a: v2(54.66), b: v2(57.0), vo: "The vapour cloud exploded (BFC: the blast hits the depot camera)",
    node: (n) => <Clip src={BFC} from={0.2} n={n} s0={1.0} s1={1.06} fx={0.5} fy={0.5} /> },
  { a: v2(57.0), b: v2(61.38), vo: "early on a Sunday morning. Nobody was lost there, and the hour had a lot to do with that. (StampPunch)",
    node: (n) => <StampPunch src={BFG} from={13.7} n={n} freeze={22} box={[80, 66, 1190, 142]} /> },
  { a: v2(61.38), b: v2(64.94), vo: "In Jaipur, a government committee ruled out sabotage. (IOC)",
    node: (n) => <Clip src={KK} from={80.0} n={n} s0={1.03} s1={1.1} fx={0.5} fy={0.55} /> },
  { a: v2(64.94), b: v2(69.19), vo: "It blamed corporate neglect and a failure to follow normal safety procedures, (IOC)",
    node: (n) => <Clip src={IOC} from={30.0} n={n} s0={1.08} s1={1.02} fx={0.5} fy={0.5} /> },
  { a: v2(69.19), b: v2(72.73), vo: "and it recommended moving oil terminals out of city limits. (KK)",
    node: (n) => <Clip src={KK} from={70.0} n={n} s0={1.02} s1={1.1} fx={0.5} fy={0.6} /> },
  { a: v2(72.73), b: v2(76.97), vo: "Jaipur district didn't even have a disaster management plan at the time. (IOC)",
    node: (n) => <Clip src={IOC} from={151.4} n={n} s0={1.04} s1={1.1} fx={0.5} fy={0.5} /> },
  { a: v2(76.97), b: v2(81.24), vo: "In July 2010 police arrested nine senior Indian Oil officials, (IOC)",
    node: (n) => <Clip src={KK} from={100.0} n={n} s0={1.08} s1={1.02} fx={0.5} fy={0.55} /> },
  { a: v2(81.24), b: v2(86.08), vo: "including the general manager, Gautam Bose, on charges of criminal negligence. (IOC)",
    node: (n) => <><Clip src={IOC} from={44.0} n={n} s0={1.03} s1={1.09} fx={0.5} fy={0.5} />
      <RedLabel text="GAUTAM BOSE · GENERAL MANAGER" at={F(82.98 - 81.24)} hold={F(2.3)} size={42} /></> },
  { a: v2(86.08), b: v2(89.64), vo: "Where those cases ended up has barely been reported. (IOC)",
    node: (n) => <Clip src={IOC} from={51.4} n={n} s0={1.02} s1={1.09} fx={0.5} fy={0.5} /> },
  { a: v2(89.64), b: END, vo: "A committee that rules out sabotage is telling you the cause came from inside the fence. (FenceSplit)",
    node: (n) => <FenceSplit src={IOC} from={9.0} rate={0.05} n={n} at={F(92.2 - 89.64)} pts={WALL} fx={0.45} fy={0.55} /> },
];
// the filmer's side in the IOC frame at src 9.0 (1920x1080 shot coords): the dark wall block on the left, then the tops of the
// terminal's fence posts along the bottom; everything above/behind that edge is the terminal
const WALL: [number, number][] = [[0, 500], [430, 524], [610, 584], [724, 660], [724, 916], [1920, 916]];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(v1(15.88)), kind: "glitch", len: 10 },   // into Blender
  { at: F(RAW[0]), kind: "blurDip", len: 12 },     // VO -> raw
  { at: F(RAW[1]), kind: "blurDip", len: 14 },     // raw -> replay (same camera)
  { at: F(v2(44.79)), kind: "glitch", len: 10 },   // to England
  { at: F(v2(61.38)), kind: "blurDip", len: 12 },  // back to Jaipur
  { at: F(v2(86.08)), kind: "blurDip", len: 12 },
  { at: F(v2(89.64)), kind: "blurDip", len: 12 },
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="ELEVEN DAYS" bg={C + "graded/title.jpg"} /></AbsoluteFill></Sequence>
          {SHOTS.map((s, i) => {
            const n = F(s.b) - F(s.a);
            return (
              <Sequence key={i} from={F(s.a)} durationInFrames={n} layout="none">
                <AbsoluteFill><FilmLook_FX grain={0.08}>{s.node(n)}</FilmLook_FX></AbsoluteFill>
              </Sequence>
            );
          })}
        </AbsoluteFill>
      </Transitions_FX>
      {PART.map(([at, s0, s1], i) => (
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE24.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {/* raw sound: the clip's own track is muted (music) -> real recordings: the fireball's boom, the roar of the fire, wind */}
      <Sequence from={F(RAW[0])} durationInFrames={F(RAW[1] - RAW[0])} layout="none">
        <Audio src={staticFile("sfx_n2/real/boom_4.wav")} volume={dB(-3)} />
        <Audio src={staticFile("sfx_n2/real/sub_drop_2.wav")} volume={dB(-7)} />
        <Audio src={staticFile(C + "media/sfx/fire_big_cc0.wav")} volume={(f) => dB(-5) * interpolate(f, [0, 10, F(RAW[1] - RAW[0]) - 24, F(RAW[1] - RAW[0]) - 8], [0, 1, 1, 0], cl)} />
        <Audio src={staticFile("sfx_n2/real/wind_gust_1.wav")} volume={(f) => dB(-18) * interpolate(f, [0, 20, F(RAW[1] - RAW[0]) - 24, F(RAW[1] - RAW[0]) - 8], [0, 1, 1, 0], cl)} />
        <Sequence from={F(2.6)} layout="none"><Audio src={staticFile("sfx_n2/real/boom_2.wav")} volume={dB(-9)} /></Sequence>
      </Sequence>
      {/* music: Epidemic ambient Music 3 at -18 dB, out under the raw */}
      <Sequence from={F(4.0)} durationInFrames={F(END - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(140)} volume={(f) => {
          const t = f / 30 + 4.0, [ra, rb] = RAW;
          const duck = t < ra - 0.8 || t > rb + 0.8 ? 1 : t < ra ? (ra - t) / 0.8 : t > rb ? (t - rb) / 0.8 : 0;
          return dB(-18) * interpolate(t, [4.0, 5.0, END - 1.4, END], [0, 1, 1, 0], cl) * (0.06 + 0.94 * duck);
        }} />
      </Sequence>
    </AbsoluteFill>
  </LibFontGate>
);
