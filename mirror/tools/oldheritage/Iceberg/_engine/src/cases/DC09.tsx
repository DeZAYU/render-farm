// Dashcam #09 — N4 highway, Pretoria, 22 Apr 2021, morning: robbers in an Audi A5 Sportback and a white pickup shoot at an armoured
// Fortis Land Cruiser escorting a phone shipment; driver Leo Prinsloo (ex-STF) evades, rams, turns back; guard Lloyd Mtombeni beside
// him. One source: the leaked company recording (HUxcE70u3qo, Fast And Curious In RSA), a vertical 480x854 strip of three cameras,
// used 0:00-2:23 only (2:24+ = appended interview, meme card, end animation). Panels cut out and upscaled:
// media/cab.mp4 (y 0-261), road.mp4 (y 293-560), rear.mp4 (y 590-853), media t = src t. Source cut at 94.07 (the middle panel
// switches to the camera behind the crazed glass): no window crosses it. Audio: rawclean (music only in 142-143, unused).
// VO = one take (CASE09.mp3), split only at sentence ends where a raw plays:
//   A 0-49.17 @4.00 | R1 53.17-78.67 (src 1.5-27.0, main: calm drive, the dark car, the shooting, the swerve, the ram) |
//   B 49.17-76.84 @78.67 | R2 106.34-114.54 (src 85.6-93.8: Prinsloo's level voice, "we're gonna shoot", more shots) |
//   C 76.84-end @114.54, VO ends 134.41, hold to 135.25.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { Inset, RedLabel, TitleCard } from "../brand";
import { CamA, K2 } from "../dev/DC08_kit";
import { PanelHold, PanelLive } from "../dev/DC09_PanelSplit";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/";
const CAB = GR + "cab.mp4", ROAD = GR + "road.mp4", REAR = GR + "rear.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
export const DUR = F(135.25);

const P: React.FC<{ n: number; src: string; from: number; a: [number, number, number]; b: [number, number, number]; rate?: number }> = ({ n, src, from, a, b, rate }) =>
  <CamA src={src} from={from} rate={rate} keys={K2(n, a, b)} />;

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: 4.0, b: 14.30, vo: "The N4 runs right through Pretoria, South Africa, and on the morning of April 22, 2021, an armored Toyota Land Cruiser was out on it running an escort job. (road camera, calm highway)",
    node: (n) => <P n={n} src={ROAD} from={40.0} a={[1.05, 0.5, 0.5]} b={[1.2, 0.5, 0.45]} />,
    over: <><RedLabel text="N4 HIGHWAY, PRETORIA" at={F(0.6)} hold={F(3.4)} /><RedLabel text="APRIL 22, 2021" at={F(4.6)} hold={F(3.4)} /></> },
  { a: 14.30, b: 18.45, vo: "It was guarding a load of mobile phones reported to be worth millions of rand. (third camera, the road ahead)",
    node: (n) => <P n={n} src={REAR} from={112.0} a={[1.1, 0.5, 0.5]} b={[1.22, 0.55, 0.5]} /> },
  { a: 18.45, b: 29.30, vo: "Behind the wheel was Leo Prinsloo, a former member of the South African Police's Special Task Force ... shooting academy in Centurion. (cab, Prinsloo)",
    node: (n) => <P n={n} src={CAB} from={60.0} a={[1.55, 0.3, 0.5]} b={[1.75, 0.3, 0.45]} />, over: <RedLabel text="LEO PRINSLOO" at={F(0.9)} hold={F(3.6)} /> },
  { a: 29.30, b: 34.05, vo: "Beside him sat Lloyd Mtombeni, who was reportedly on his fourth day in the job. (cab, Mtombeni)",
    node: (n) => <P n={n} src={CAB} from={72.0} a={[1.7, 0.68, 0.5]} b={[1.85, 0.68, 0.45]} />, over: <RedLabel text="LLOYD MTOMBENI" at={F(0.9)} hold={F(3.0)} /> },
  { a: 34.05, b: 39.79, vo: "Crews that hit cash and cargo vans in South Africa often come with several cars and rifles. (road camera, traffic ahead)",
    node: (n) => <P n={n} src={ROAD} from={66.0} a={[1.1, 0.5, 0.5]} b={[1.25, 0.5, 0.48]} /> },
  { a: 39.79, b: 53.17, vo: "Three cameras were rolling in this one. The top panel shows the cab, the middle one the road ahead, and the bottom one ... Watch for a dark car closing in, and don't lose track of Prinsloo's hands. (PanelHold)",
    node: () => <PanelHold srcs={[CAB, ROAD, REAR]} t={1.5} visits={[69, 126, 177]} split={272} /> },
  // RAW 1 (main): calm -> the dark car -> shots -> swerve and ram, all three angles live
  { a: 53.17, b: 78.67, vo: "RAW 1 src 1.5-27.0", node: () => <PanelLive srcs={[CAB, ROAD, REAR]} from={1.5} /> },
  { a: 78.67, b: 83.40, vo: "The attackers came in at least two vehicles, an Audi A5 Sportback (0.5x replay of the dark car beside them, third camera)",
    node: (n) => <P n={n} src={REAR} from={11.75} rate={0.5} a={[1.3, 0.6, 0.55]} b={[1.6, 0.62, 0.55]} /> },
  { a: 83.40, b: 87.61, vo: "and a white pickup, and reports said the Land Cruiser was hit more than 30 times. (cab, Prinsloo driving hard)",
    node: (n) => <P n={n} src={CAB} from={31.0} a={[1.3, 0.42, 0.5]} b={[1.42, 0.4, 0.5]} /> },
  { a: 87.61, b: 90.54, vo: "The cab's glass was reinforced, and it held. (the crazed glass)",
    node: (n) => <P n={n} src={ROAD} from={100.0} a={[1.05, 0.5, 0.5]} b={[1.2, 0.5, 0.5]} /> },
  { a: 90.54, b: 97.04, vo: "Police said Prinsloo evaded them for a while, then stopped and waited for them, and that they fled without taking anything. (through the glass, slowing)",
    node: (n) => <P n={n} src={ROAD} from={118.0} a={[1.2, 0.45, 0.5]} b={[1.3, 0.5, 0.5]} /> },
  { a: 97.04, b: 101.45, vo: "They also said no arrests had been made, and there hasn't been one reported since. (third camera, the road at the end)",
    node: (n) => <P n={n} src={REAR} from={128.0} a={[1.05, 0.5, 0.5]} b={[1.15, 0.5, 0.5]} /> },
  { a: 101.45, b: 106.34, vo: "Prinsloo's voice is what I'd play back for anyone. He sounds like he's reading out directions. (cab, Prinsloo talking)",
    node: (n) => <P n={n} src={CAB} from={78.0} a={[1.7, 0.3, 0.48]} b={[1.85, 0.3, 0.46]} /> },
  { a: 106.34, b: 114.54, vo: "RAW 2 src 85.6-93.8", node: (n) => <P n={n} src={CAB} from={85.6} a={[1.0, 0.5, 0.5]} b={[1.15, 0.42, 0.5]} /> },
  { a: 114.54, b: 118.99, vo: "Mtombeni said later that it'd been his first time getting shot at sitting in a vehicle. (cab, Mtombeni on the phone, rifle on his lap)",
    node: (n) => <P n={n} src={CAB} from={116.0} a={[1.6, 0.66, 0.55]} b={[1.75, 0.66, 0.55]} /> },
  { a: 118.99, b: 123.23, vo: "Prinsloo said there wasn't any way he was letting them take it. Neither man was hurt. (cab, both men)",
    node: (n) => <P n={n} src={CAB} from={133.0} a={[1.15, 0.5, 0.5]} b={[1.25, 0.48, 0.5]} /> },
  { a: 123.23, b: 128.82, vo: "About ten days later the footage leaked and went around the world. More angles came out within the week. (the vertical strip as it circulated)",
    node: () => <Inset src={GR + "strip.mp4"} from={44.0} ar={608 / 1080} box={0.27} drift={0.04} label="LEAKED · MAY 2021" labelAt={30} /> },
  { a: 128.82, b: 135.25, vo: "The attention also brought death threats, and his employer put Prinsloo and his family under protection. (cab, Prinsloo)",
    node: (n) => <P n={n} src={CAB} from={138.0} a={[1.45, 0.32, 0.5]} b={[1.7, 0.3, 0.46]} /> },
];

const CUTS: FxCut[] = [
  { at: F(4.0), kind: "glitch", len: 10 },
  ...[14.30, 18.45, 29.30, 34.05, 39.79, 78.67, 83.40, 87.61, 90.54, 97.04, 101.45, 106.34, 114.54, 118.99, 128.82].map((t) => ({ at: F(t), kind: "blurDip" as const, len: 10 })),
  { at: F(123.23), kind: "glitch", len: 10 },
];

const PART: [number, number, number | null][] = [[4.0, 0, 49.17], [78.67, 49.17, 76.84], [114.54, 76.84, null]];
const RAWS: [number, number, number, number, number][] = [[53.17, 78.67, 1.5, 0, 0.1], [106.34, 114.54, 85.6, 2, 0.12]];
const SFX: [number, string, number][] = [
  [3.95, "sfx_n2/glitch_02.wav", -24], [39.8, "sfx_n2/real/tape_click_2.wav", -26], [48.2, "sfx_n2/whoosh_02.wav", -32], [123.18, "sfx_n2/glitch_03.wav", -28],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(4.0)} layout="none"><AbsoluteFill><TitleCard dur={F(4.0)} title="THE N4 ESCORT AMBUSH" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
        <Sequence key={"v" + i} from={F(at)} durationInFrames={s1 === null ? undefined : F(s1) - F(s0)} layout="none"><Audio src={staticFile("vor/CASE09.mp3")} startFrom={F(s0)} /></Sequence>
      ))}
      {RAWS.map(([a, b, src, g], i) => (
        <Sequence key={"r" + i} from={F(a)} durationInFrames={F(b) - F(a)} layout="none">
          <Audio src={staticFile(C + "media/main_clean.wav")} startFrom={F(src)} volume={(f) => dB(g) * interpolate(f, [0, 6, F(b - a) - 14, F(b - a) - 3], [0, 1, 1, 0], cl)} />
        </Sequence>
      ))}
      {/* music: Epidemic ambient Music 4 (-21.5 dB: -11.9 LUFS file, matched to Music 5 at -13), ducked under the raws */}
      <Sequence from={F(4.0)} durationInFrames={F(135.25 - 4.0)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(0)} volume={(f) => {
          const t = f / 30 + 4.0;
          const duck = RAWS.reduce((mm, [ra, rb, , , lv]) => Math.min(mm, t < ra - 0.8 || t > rb + 0.6 ? 1 : t < ra ? lv + (1 - lv) * (ra - t) / 0.8 : t > rb ? lv + (1 - lv) * (t - rb) / 0.6 : lv), 1);
          return dB(-21.5) * interpolate(t, [4.0, 5.0, 122.5, 123.9], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      <Sequence from={F(122.9)} durationInFrames={F(135.25 - 122.9)} layout="none">
        <Audio src={staticFile("music/Music 4.mp3")} startFrom={F(30)} volume={(f) => { const t = f / 30 + 122.9; return dB(-21.5) * interpolate(t, [122.9, 123.9, 133.8, 135.25], [0, 1, 1, 0], cl); }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
