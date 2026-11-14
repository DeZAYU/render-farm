// Dashcam #08 — Ball, Louisiana, 5 Apr 2006, just after 4 pm: escaped murderer Richard Lee McNair, out of USP Pollock that morning,
// is stopped jogging on the railroad tracks by Ball PD officer Carl Bordelon, talks for ten minutes as "Robert Jones" / "Jimmy Jones"
// and is let go. One source: Ball PD cruiser tape (vBrnBmUmVzI), 4:3 480x360 with the camera's stamp under the picture (normally
// framed out: 16:9 top window). media/main.mp4 = src 1.0-607.4 (so media t = src - 1), cleaned of the left black edge, x3 lanczos.
// Audio: rawclean (no music found) -> main_bleep.wav (src time; "Oh, [bleep]" at 39.85-40.85).
// VO = one take (CASE08.mp3), split only at sentence ends where a raw plays:
//   A 0-50.05 @4.00 | R1 54.05-79.25 (src 13.7-28.2 + blur-dip + 34.9-45.6: name, roofing; "We got an escapee" "where from?") |
//   B 50.05-62.13 @79.25 | R2 91.33-100.03 (src 254.6-263.3: "I'll just cut him loose" ... "You're matching up to him") |
//   C 62.13-69.19 @100.03 | R3 107.09-125.19 (src 321.3-339.4: "What's your name again?" "Jimmy Jones" ... "how lucky can I be?") |
//   D 69.19-end @125.19, VO ends 176.43, hold to 177.25.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Aerial, Inset, RedLabel } from "../brand";
import { CamA, K2, Still, TypeTitle } from "../dev/DC08_kit";
import { StampRead } from "../dev/DC08_StampRead";
import { HeadCheck } from "../dev/DC08_HeadCheck";
import { TwoClocks } from "../dev/DC08_TwoClocks";
import { ReleaseFeed } from "../dev/DC08_ReleaseFeed";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "main.mp4";
const m = (src: number) => src - 1;                 // source time -> media time
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(177.25);
const AR = 4 / 3, TOP = 0.375;                       // 4:3 tape; y focus that shows the 16:9 window above the stamp

/** the tape through the camera, 16:9 window above the stamp (s >= 1) */
const Tape: React.FC<{ n: number; src: number; a: [number, number, number]; b: [number, number, number]; rate?: number }> = ({ n, src, a, b, rate }) =>
  <CamA src={M} from={m(src)} ar={AR} rate={rate} keys={K2(n, a, b)} />;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 12.45, vo: "McNair was serving two life sentences when he got out of the federal prison at Pollock, Louisiana, on the morning of April 5, 2006. (NAIP: the penitentiary compound boxed)",
    node: () => <Aerial src={GR + "pollock.jpg"} iw={2400} ih={1350} spot={[500, 330, 1150, 1250]} z0={1.0} z1={1.22} label="USP POLLOCK, LOUISIANA" boxAt={40} labelAt={70} /> },
  { a: 12.45, b: 20.49, vo: "In 1987 he'd killed a man named Jerry Thies during a burglary at a grain elevator in North Dakota, and shot a second man there. (the man in the white vest, slow push)",
    node: (n) => <Tape n={n} src={105} a={[1.55, 0.6, 0.36]} b={[1.85, 0.62, 0.34]} />, over: <RedLabel text="RICHARD LEE McNAIR" at={F(0.6)} hold={F(3.2)} /> },
  { a: 20.49, b: 28.66, vo: "That morning he'd hidden inside a pallet of mailbags that was moved to a warehouse outside the fence, and when the staff went to lunch, he cut his way out. (NAIP: from the fence line out to the buildings beyond it)",
    node: (n) => <Still src={GR + "pollock2.jpg"} n={n} s0={1.04} s1={1.24} fx={0.66} fy={0.82} /> },
  { a: 28.66, b: 34.0, vo: "It wasn't his first escape. He'd slipped out of handcuffs at a police station in 1988, (McNair, tight)",
    node: (n) => <Tape n={n} src={176} a={[2.2, 0.66, 0.36]} b={[2.35, 0.66, 0.35]} /> },
  { a: 34.0, b: 39.59, vo: "and in 1992 he got out of a North Dakota prison and stayed free for about nine months. (the two men, wider)",
    node: (n) => <Tape n={n} src={300} a={[1.3, 0.62, 0.4]} b={[1.4, 0.6, 0.4]} /> },
  { a: 39.59, b: 48.97, vo: "Just after four that afternoon, Ball police officer Carl Bordelon spotted a man in a white vest and shorts running along the railroad tracks, and waved him over. (StampRead)",
    node: () => <StampRead src={M} from={m(2.0)} band={0.775} dimTo={112}
      keys={[{ f: 0, s: 2.1, x: 0.2, y: 0.92 }, { f: 46, s: 2.1, x: 0.2, y: 0.92 }, { f: 82, s: 2.1, x: 0.2, y: 0.85 }, { f: 112, s: 2.1, x: 0.2, y: 0.85 },
        { f: 160, s: 1.35, x: 0.66, y: 0.4 }, { f: 281, s: 1.45, x: 0.68, y: 0.4 }]} /> },
  { a: 48.97, b: 54.05, vo: "His dashcam caught the next ten minutes. Listen to how easily the man answers. (the whole crossing)",
    node: (n) => <Tape n={n} src={7.5} a={[1.0, 0.5, TOP]} b={[1.12, 0.6, 0.36]} /> },
  // RAW 1 (two windows, blur-dip between): name / no ID / roofing ... "We got an escapee" - "Oh, [bleep]. Where's it from?"
  { a: 54.05, b: 68.55, vo: "RAW 1a src 13.7-28.2", node: (n) => <Tape n={n} src={13.7} a={[1.0, 0.5, TOP]} b={[1.18, 0.62, 0.36]} /> },
  { a: 68.55, b: 79.25, vo: "RAW 1b src 34.9-45.6", node: (n) => <Tape n={n} src={34.9} a={[1.2, 0.6, 0.36]} b={[1.3, 0.62, 0.35]} /> },
  { a: 79.25, b: 83.61, vo: "So how did he walk away? The description Bordelon radioed for didn't fit. (Bordelon at the radio)",
    node: (n) => <Tape n={n} src={66} a={[1.6, 0.48, 0.38]} b={[1.7, 0.47, 0.38]} /> },
  { a: 83.61, b: 88.54, vo: "The prison's picture showed a full beard, and the man on the tracks had a goatee and a buzz cut. (HeadCheck)",
    node: (n) => <HeadCheck src={M} t={m(512)} at={10} head={[0.67, 0.42, 0.075]} brackets={false} keys={K2(n, [1.3, 0.62, 0.4], [1.75, 0.66, 0.4])} /> },
  { a: 88.54, b: 91.33, vo: "Bordelon even joked that he was matching up to him. (the two of them, side by side)",
    node: (n) => <Tape n={n} src={232} a={[1.45, 0.58, 0.38]} b={[1.55, 0.58, 0.38]} /> },
  { a: 91.33, b: 100.03, vo: "RAW 2 src 254.6-263.3", node: (n) => <Tape n={n} src={254.6} a={[1.05, 0.55, TOP]} b={[1.25, 0.6, 0.36]} /> },
  { a: 100.03, b: 107.09, vo: "A few minutes after calling himself Robert Jones, the man gave his name as Jimmy Jones, and the slip went right past. (TwoClocks)",
    node: () => <TwoClocks f1={GR + "clk1.jpg"} f2={GR + "clk2.jpg"} at2={124} settle={158} /> },
  { a: 107.09, b: 125.19, vo: "RAW 3 src 321.3-339.4", node: (n) => <Tape n={n} src={321.3} a={[1.0, 0.5, TOP]} b={[1.2, 0.6, 0.36]} /> },
  { a: 125.19, b: 130.89, vo: "After about ten minutes Bordelon let him go, with advice to carry some ID next time he went jogging. (the last minute together)",
    node: (n) => <Tape n={n} src={586} a={[1.3, 0.58, 0.38]} b={[1.42, 0.56, 0.38]} /> },
  { a: 130.89, b: 135.99, vo: "Bordelon later watched his own tape with the prison guards and realized who he'd let walk away. (the whole tape, stamp and all: both walk out of frame)",
    node: () => <Inset src={M} from={m(592.0)} ar={AR} box={0.62} drift={0.05} label="BALL POLICE DASHCAM · APRIL 5, 2006" labelAt={20} /> },
  { a: 135.99, b: 141.92, vo: "He kept his job, rose to assistant chief, and died in 2015 at 51. (Bordelon alone on the gravel)",
    node: (n) => <Tape n={n} src={441} a={[1.9, 0.56, 0.4]} b={[2.05, 0.56, 0.4]} /> },
  { a: 141.92, b: 148.39, vo: "McNair stayed free for 18 months. Within days he was on the US Marshals' 15 Most Wanted list. (the empty crossing after he has gone)",
    node: (n) => <Tape n={n} src={598.5} a={[1.0, 0.5, TOP]} b={[1.3, 0.35, 0.4]} /> },
  { a: 148.39, b: 156.44, vo: "That same month, Canadian police questioned him over a stolen car in Penticton, British Columbia, and he ran across a field and got away.",
    node: (n) => <Still src={GR + "penticton.jpg"} n={n} s0={1.03} s1={1.13} fx={0.5} fy={0.45} />, over: <RedLabel text="PENTICTON, BRITISH COLUMBIA" at={F(0.6)} hold={F(3.6)} size={42} /> },
  { a: 156.44, b: 161.88, vo: "On October 25, 2007, a rookie officer with the Royal Canadian Mounted Police",
    node: (n) => <Still src={GR + "campbellton.jpg"} n={n} s0={1.03} s1={1.12} fx={0.5} fy={0.6} />, over: <RedLabel text="CAMPBELLTON, NEW BRUNSWICK" at={F(0.5)} hold={F(3.8)} size={42} /> },
  { a: 161.88, b: 172.25, vo: "chased his stolen van through Campbellton, then caught him on foot. 'In typical McNair fashion...' (ReleaseFeed: USMS release 25 Oct 2007)",
    node: () => <ReleaseFeed bg={GR + "campbellton.jpg"} sheet={GR + "usms_sheet.png"} sw={1180} sh={1026} para={[836, 1012]} stopAt={118} dimAt={120} /> },
  { a: 172.25, b: 177.25, vo: "Today he's reportedly held in a high security federal prison in Kentucky.",
    node: () => <Aerial src={GR + "mccreary.jpg"} iw={2400} ih={1350} spot={[700, 330, 1725, 1025]} z0={1.0} z1={1.15} label="USP McCREARY, KENTUCKY" boxAt={14} labelAt={34} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  { at: F(12.45), kind: "glitch", len: 10 },
  { at: F(28.66), kind: "glitch", len: 10 },
  ...[34.0, 39.59, 48.97, 54.05, 68.55, 79.25, 83.61, 88.54, 91.33, 100.03, 107.09, 125.19, 130.89, 135.99, 141.92, 161.88].map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),
  { at: F(148.39), kind: "glitch", len: 10 },
  { at: F(156.44), kind: "blurDip", len: 12 },
  { at: F(172.25), kind: "glitch", len: 10 },
];

// VO take parts: [timeline at, take from, take to]
const PART: [number, number, number | null][] = [[4.0, 0, 50.05], [79.25, 50.05, 62.13], [100.03, 62.13, 69.19], [125.19, 69.19, null]];
// raws: [timeline a, b, src s, gain dB, music duck level]
const RAWS: [number, number, number, number, number][] = [
  [54.05, 68.55, 13.7, 3, 0.15], [68.55, 79.25, 34.9, 3, 0.15], [91.33, 100.03, 254.6, 2, 0.15], [107.09, 125.19, 321.3, 3, 0.15],
];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [12.4, "sfx_n2/glitch_01.wav", -28], [28.61, "sfx_n2/glitch_03.wav", -30],
  [39.6, "sfx_n2/real/tape_click_2.wav", -24], [100.05, "sfx_n2/real/camera_shutter_2.wav", -30], [104.2, "sfx_n2/real/camera_shutter_2.wav", -30],
  [130.9, "sfx_n2/real/vhs_1.wav", -30], [148.34, "sfx_n2/glitch_02.wav", -28],
  [161.95, "sfx_n2/real/paper_2.wav", -26], [164.6, "sfx_n2/real/paper_3.wav", -28], [172.2, "sfx_n2/glitch_01.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill>
            <TypeTitle title="ESCAPED KILLER TALKS HIS WAY PAST A COP" place="BALL, LOUISIANA · 2006" bg={GR + "title.jpg"} dur={F(4.0)} />
          </AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE08.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_bleep.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 3, ~-19 dB, ducked under the raws; two passes, handed over inside RAW 3 */}
      {([[4.0, 117.0, 12], [116.0, 177.25, 20]] as const).map(([a, b, off], k) => (
        <Sequence key={"m" + k} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile("music/Music 3.mp3")} startFrom={F(off)} volume={(f) => {
            const t = f / 30 + a;
            const duck = RAWS.reduce((mm, [ra, rb, , , lv]) => Math.min(mm, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
            const env = k === 0 ? interpolate(t, [4.0, 5.0, 116.0, 117.0], [0, 1, 1, 0], cl) : interpolate(t, [116.0, 117.0, 175.8, 177.25], [0, 1, 1, 0], cl);
            return dB(-19) * env * duck;
          }} />
        </Sequence>
      ))}
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
