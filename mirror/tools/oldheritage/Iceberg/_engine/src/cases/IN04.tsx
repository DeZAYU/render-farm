// Incidents #04 — Grand Couloir du Goûter, Goûter Route, Mont Blanc, July 2020: Katrin Merisalu's team, coming down from the summit,
// waits on the rock rib at the edge of the couloir; a lone climber in dark clothes is out on the ice band when rocks come down the
// gully; the climber presses flat; "Luckily all ended well, the climber was rescued later by helicopter." Footage: the filmer's own
// upload (Kate's Climbing Stories, xNRkImOHkb8, 4:28, 1080p60 -> m.mp4 30p). One source cut at 39.3. Raw audio: rawclean (music only
// at 197-199 s, unused). A teammate's face passes the lens at ~63.7-65.8 s: the raw is blurred there.
// Timeline: title 0-4 | VO A take 0-50.41 @4 | RAW 54.41-77.81 (src 49.1-72.5: the crossing, the rocks, the camera ducks, back to the
// climber pressed flat) | VO B take 50.41-67.32 @77.81 | end 95.5.
// Stills: Aiguille du Goûter (Abjad, CC BY 3.0, inset cropped out); Grand Couloir / Tête Rousse (Jacek Rużyczka, CC BY-SA 4.0);
// Tête Rousse from above (Anthospace, CC BY-SA 4.0). Device: PrintDrop (the held rock moment drops away as a print, uncovering the live
// climber still pressed flat).
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { FilmLook_FX, Transitions_FX, type FxCut } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
import { RedLabel, TitleCard } from "../brand";
import { Cam, type CK, io, camAt, placeOf } from "../dev/DC01_kit";
import { PrintDrop } from "../dev/IN04_PrintDrop";

const F = (s: number) => Math.round(s * 30);
const C = "case/", GR = C + "graded/", M = GR + "m.mp4";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const dB = (d: number) => Math.pow(10, d / 20);
const V1 = 4.0, R0 = 54.41, R1 = 77.81, V2 = 77.81, END = 95.5;
export const DUR = F(END);
const K = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};
/** the raw through a soft full-frame blur ramp (a teammate's face crosses the lens) */
const BlurCam: React.FC<{ from: number; n: number; keys: CK[] }> = ({ from, n, keys }) => {
  const f = useCurrentFrame(); const b = interpolate(f, [0, 5, n - 5, n], [0, 24, 24, 0], cl);
  const p = placeOf(camAt(f, keys));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><OffthreadVideo src={staticFile(M)} startFrom={Math.round(from * 30)} muted style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, filter: `blur(${b}px)` }} /></AbsoluteFill>;
};

type Sh = { a: number; b: number; vo: string; node: (n: number) => React.ReactNode; over?: React.ReactNode };
const SHOTS: Sh[] = [
  { a: V1, b: V1 + 4.6, vo: "The Grand Couloir du Goûter is a steep gully on the most popular route up Mont Blanc, (the Aiguille du Goûter face)",
    node: (n) => <Still src={GR + "couloir1.jpg"} n={n} s0={1.25} s1={1.38} fx={0.3} fy={0.3} />, over: <RedLabel text="MONT BLANC, FRANCE" at={F(1.0)} hold={F(3.2)} /> },
  { a: V1 + 4.6, b: V1 + 8.81, vo: "the highest peak in the Alps, and climbers call it the Couloir of Death. (the Grand Couloir)",
    node: (n) => <Still src={GR + "couloir3.jpg"} n={n} s0={1.04} s1={1.14} fx={0.5} fy={0.4} /> },
  { a: V1 + 8.81, b: V1 + 13.36, vo: "Almost everyone on that route crosses it twice, going up and coming down. (the team on the rib)",
    node: (n) => <Cam src={M} from={12.3} keys={K(n, [1.05, 0.5, 0.5], [1.14, 0.55, 0.5])} /> },
  { a: V1 + 13.36, b: V1 + 17.6, vo: "It's only about 330 feet across, and the only protection is a steel cable strung over it, (across the gully)",
    node: (n) => <Cam src={M} from={1.0} keys={K(n, [1.08, 0.5, 0.5], [1.18, 0.4, 0.5])} /> },
  { a: V1 + 17.6, b: V1 + 21.96, vo: "under a face that sheds rocks all day long. (the face above, from the rib)",
    node: (n) => <Cam src={M} from={26.0} keys={K(n, [1.1, 0.4, 0.55], [1.22, 0.35, 0.35])} /> },
  { a: V1 + 21.96, b: V1 + 25.04, vo: "So how often does that face actually drop something? (Tête Rousse from above, loose rock)",
    node: (n) => <Still src={GR + "couloir2.jpg"} n={n} s0={1.04} s1={1.12} fx={0.5} fy={0.6} /> },
  { a: V1 + 25.04, b: V1 + 34.23, vo: "In the summer of 2019, sensors in the couloir picked up more than 2,600 rockfalls in 68 days. That's about 39 a day. (the rib, the gully beyond)",
    node: (n) => <Cam src={M} from={16.9} keys={K(n, [1.05, 0.5, 0.5], [1.2, 0.5, 0.55])} /> },
  { a: V1 + 34.23, b: V1 + 41.70, vo: "In July 2020, Katrin Merisalu's team was on the way down from the summit, waiting at the edge of the gully for their turn to cross.",
    node: (n) => <Cam src={M} from={31.0} keys={K(n, [1.04, 0.5, 0.5], [1.12, 0.45, 0.5])} />, over: <RedLabel text="KATRIN MERISALU · JULY 2020" at={F(1.2)} hold={F(3.6)} size={42} /> },
  { a: V1 + 41.70, b: R0, vo: "Her phone was recording. Out in the middle, on a band of ice and snow, one climber in dark clothes was crossing alone. Then the mountain lets go.",
    node: (n) => <Cam src={M} from={40.4} keys={K(n, [1.0, 0.5, 0.5], [1.35, 0.48, 0.42])} /> },
  // RAW (blurred while a teammate's face crosses the lens)
  { a: R0, b: R0 + 14.6, vo: "RAW a (src 49.1-63.7)", node: (n) => <Cam src={M} from={49.1} keys={K(n, [1.35, 0.48, 0.42], [1.0, 0.5, 0.5])} /> },
  { a: R0 + 14.6, b: R0 + 16.7, vo: "RAW b (src 63.7-65.8, blurred)", node: (n) => <BlurCam from={63.7} n={n} keys={K(n, [1.0, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
  { a: R0 + 16.7, b: R1, vo: "RAW c (src 65.8-72.5)", node: (n) => <Cam src={M} from={65.8} keys={K(n, [1.0, 0.5, 0.5], [1.08, 0.5, 0.45])} /> },
  // VO B
  { a: V2, b: V2 + 2.9, vo: "This time, Merisalu wrote, it all ended well. (0.5x replay of the rocks coming through)",
    node: (n) => <Cam src={GR + "rock_slow.mp4"} from={0.4} keys={K(n, [1.25, 0.48, 0.42], [1.45, 0.48, 0.42])} /> },
  { a: V2 + 2.9, b: V2 + 8.2, vo: "Between 1990 and 2011, accidents on this stretch of the route killed 74 people, (PrintDrop)",
    node: (n) => <PrintDrop print={M} t={60.25} bg={M} bgFrom={80.0} bgKeys={K(n, [1.25, 0.48, 0.45], [1.35, 0.48, 0.45])} at={18} len={50} /> },
  { a: V2 + 8.2, b: V2 + 12.4, vo: "so I doubt that's a sentence anyone gets to write very often. (the long hold on the couloir)",
    node: (n) => <Cam src={M} from={160.0} keys={K(n, [1.05, 0.5, 0.5], [1.15, 0.45, 0.45])} /> },
  { a: V2 + 12.4, b: END, vo: "The climber was rescued later by helicopter, and that's about all anyone knows. (the team moves on)",
    node: (n) => <Cam src={M} from={236.0} keys={K(n, [1.12, 0.5, 0.5], [1.0, 0.5, 0.5])} /> },
];

const CUTS: FxCut[] = [
  { at: F(V1), kind: "glitch", len: 10 },
  { at: F(V1 + 13.36), kind: "blurDip", len: 10 },
  { at: F(V1 + 17.6), kind: "blurDip", len: 10 },
  { at: F(V1 + 25.04), kind: "blurDip", len: 12 },
  { at: F(V1 + 34.23), kind: "blurDip", len: 10 },
  { at: F(V1 + 41.70), kind: "blurDip", len: 10 },
  { at: F(R0), kind: "blurDip", len: 10 },
  { at: F(V2), kind: "blurDip", len: 14 },
  { at: F(V2 + 2.9), kind: "blurDip", len: 10 },
  { at: F(V2 + 8.2), kind: "blurDip", len: 12 },
  { at: F(V2 + 12.4), kind: "blurDip", len: 12 },
];
const SFX: [number, string, number][] = [
  [V1 - 0.05, "sfx_n2/glitch_02.wav", -26], [V2 + 3.4, "sfx_n2/real/camera_shutter_2.wav", -30], [V2 + 4.0, "sfx_n2/real/paper_3.wav", -30],
];

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <Transitions_FX cuts={CUTS}>
        <AbsoluteFill>
          <Sequence from={0} durationInFrames={F(V1)} layout="none"><AbsoluteFill><TitleCard dur={F(V1)} title="THE COULOIR OF DEATH" bg={GR + "title.jpg"} /></AbsoluteFill></Sequence>
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
      <Sequence from={F(V1)} durationInFrames={F(50.41)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} /></Sequence>
      <Sequence from={F(V2)} layout="none"><Audio src={staticFile("vor/CASE04.mp3")} startFrom={F(50.41)} /></Sequence>
      <Sequence from={F(R0)} durationInFrames={F(R1 - R0)} layout="none">
        <Audio src={staticFile(C + "media/m_clean.wav")} startFrom={F(49.1)} volume={(f) => dB(2) * interpolate(f, [0, 8, F(R1 - R0) - 14, F(R1 - R0) - 3], [0, 1, 1, 0], cl)} />
      </Sequence>
      <Sequence from={F(V1)} durationInFrames={F(END - V1)} layout="none">
        <Audio src={staticFile("music/Music 1.mp3")} startFrom={F(20)} volume={(f) => {
          const t = f / 30 + V1;
          const duck = t < R0 - 0.8 || t > R1 + 0.6 ? 1 : t < R0 ? 0.12 + 0.88 * (R0 - t) / 0.8 : t > R1 ? 0.12 + 0.88 * (t - R1) / 0.6 : 0.12;
          return dB(-16) * interpolate(t, [V1, V1 + 1, END - 1.5, END], [0, 1, 1, 0], cl) * duck;
        }} />
      </Sequence>
      {SFX.map(([t, f, d], i) => <Sequence key={"x" + i} from={F(t)} layout="none"><Audio src={staticFile(f)} volume={dB(d)} /></Sequence>)}
    </AbsoluteFill>
  </LibFontGate>
);
