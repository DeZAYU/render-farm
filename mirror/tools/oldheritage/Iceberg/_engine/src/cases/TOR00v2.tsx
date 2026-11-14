// Tornado video — INTRO v5 (10 Nov 2026). Owner: new VO line ("These are twenty-five times a tornado was caught on camera from far
// closer than anyone should ever be...") and new visuals made from the film's own clips: "clips showing and then at last a 3d zoom out of
// clips". Full-frame case clips, one per VO phrase (slow push-in, short dissolves, red place label), then on "Worst first. Let's begin."
// the Chapman wedge fills the frame and the camera pulls back in 3-D to reveal a field of other case clips, dipping to black for the
// title (the title is the delivered TOR00 title, spliced from the film at 16.2 s). Picture only: VO/music are mixed in ffmpeg.
// Sources: build/CASE00/graded/v2/*.mp4, cut from "Tornado FULL.mp4" (see NOTES.md).
import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, interpolate, Easing, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FilmLook_FX } from "../lib/templates/n2fx/fx";
import { LibFontGate } from "../lib/core/type";
// (no RedLabel in the intro)

const F = (s: number) => Math.round(s * 30);
const V2 = "case/graded/v2/";
const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const X = 7; // dissolve frames

// montage: [clip, start s, end s, label]
const SHOTS: [string, number, number, string][] = [
  ["elie", 0.0, 2.0, "ELIE, MANITOBA · 2007"],
  ["tusc", 2.0, 3.4, "TUSCALOOSA, ALABAMA · 2011"],
  ["manch", 3.4, 6.0, "MANCHESTER, SOUTH DAKOTA · 2003"],
  ["moore", 6.0, 7.5, "MOORE, OKLAHOMA · 2013"],
  ["albany", 7.5, 9.1, "ALBANY, GEORGIA · 2017"],
  ["elkhorn", 9.1, 10.9, "ELKHORN, NEBRASKA · 2024"],
];
const PB = 10.9;          // pull-back starts
export const DUR = F(14.6); // then the title (from the film)

const Shot: React.FC<{ src: string; len: number; first: boolean }> = ({ src, len, first }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, len + X], [1.0, 1.07], cl);
  const o = first ? interpolate(f, [0, 8], [0, 1], cl) : interpolate(f, [0, X], [0, 1], cl);
  return (
    <AbsoluteFill style={{ opacity: o, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(V2 + src + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})` }} />
    </AbsoluteFill>
  );
};

// ---- 3-D pull-back ----
const PW = 640, PH = 360, P = 1000;
type Pl = { src: string; x: number; y: number; z: number; ry: number; rx: number; s: number };
const FIELD: Pl[] = [
  ["f97", -820, -470, -260, 16, -4, 1.0], ["f348", 840, -440, -420, -18, -3, 1.05], ["f602", -900, 430, -380, 18, 4, 1.0],
  ["f766", 880, 470, -300, -16, 5, 0.95], ["f1389", 0, -760, -700, 0, -10, 1.0], ["f1629", 0, 780, -640, 0, 10, 1.05],
  ["f1910", -1640, -60, -820, 26, 0, 1.1], ["f1962", 1660, 40, -900, -26, 0, 1.1], ["f2052", -1560, -900, -1250, 24, -8, 1.0],
  ["f2389", 1580, -880, -1200, -24, -8, 1.0], ["f2539", -1520, 920, -1150, 24, 8, 1.05], ["f2659", 1540, 900, -1280, -24, 8, 1.0],
  ["f2724", -760, -1260, -1600, 12, -14, 1.0], ["f2809", 780, 1280, -1550, -12, 14, 1.0], ["f3015", -2350, 420, -1700, 30, 4, 1.1],
  ["f3559", 2380, -420, -1750, -30, -4, 1.1], ["f299", 820, -1300, -1900, -14, -14, 1.0], ["f979", -840, 1320, -1950, 14, 14, 1.0],
  ["f426", -2300, -700, -2200, 30, -8, 1.0],
].map(([src, x, y, z, ry, rx, s]) => ({ src: src as string, x: x as number, y: y as number, z: z as number, ry: ry as number, rx: rx as number, s: s as number }));

const PullBack: React.FC = () => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const n = DUR - F(PB);
  const k = interpolate(f, [0, n], [0, 1], { ...cl, easing: ease });
  const ez = 300 + (2300 - 300) * k;         // hero fills the frame (d=300 → 2133 px wide) … field of clips
  const ey = -40 * k, ex = 60 * Math.sin(k * Math.PI) ;
  const yaw = -3 * k, roll = 1.2 * Math.sin(k * Math.PI);
  const dip = interpolate(f, [n - 12, n], [0, 1], cl);
  const all = [{ src: "wedge", x: 0, y: 0, z: 0, ry: 0, rx: 0, s: 1, hero: true }, ...FIELD.map((p) => ({ ...p, hero: false }))]
    .sort((a, b) => a.z - b.z);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, #121418 0%, #050506 75%)", overflow: "hidden", perspective: P }}>
      <div style={{ position: "absolute", left: width / 2, top: height / 2, transformStyle: "preserve-3d",
        transform: `rotateZ(${roll}deg) rotateY(${yaw}deg) translate3d(${-ex}px, ${-ey}px, ${-(ez - P)}px)` }}>
        {all.map((p) => {
          const dist = ez - p.z;
          const reveal = p.hero ? 1 : interpolate(k, [0.08, 0.45], [0, 1], cl); // field fades in as it comes into view
          const blur = p.hero ? 0 : Math.min(5, Math.abs(p.z) / 450) * (1 - 0.4 * k);
          const light = p.hero ? 1 : 0.62 + 0.25 * k - Math.min(0.2, Math.abs(p.z) / 9000);
          const drift = p.hero ? 0 : Math.sin(f / 40 + p.x / 300) * 10;
          return (
            <div key={p.src} style={{ position: "absolute", left: -PW * p.s / 2, top: -PH * p.s / 2, width: PW * p.s, height: PH * p.s,
              transform: `translate3d(${p.x + drift}px, ${p.y}px, ${p.z}px) rotateY(${p.ry * (0.4 + 0.6 * k)}deg) rotateX(${p.rx}deg)`,
              opacity: reveal * (dist > 120 ? 1 : 0), filter: `blur(${blur.toFixed(2)}px) brightness(${light.toFixed(3)})`,
              boxShadow: "0 30px 80px rgba(0,0,0,.7)", background: "#000", overflow: "hidden" }}>
              <OffthreadVideo src={staticFile(V2 + p.src + ".mp4")} muted style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, boxShadow: `inset 0 0 0 ${p.hero ? 3 * k : 3}px rgba(255,255,255,.85)` }} />
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
      <AbsoluteFill style={{ background: "#000", opacity: 0.92 * dip, backdropFilter: `blur(${(dip * 12).toFixed(1)}px)` }} />
    </AbsoluteFill>
  );
};

export const Comp: React.FC = () => (
  <LibFontGate>
    <AbsoluteFill style={{ background: "#000" }}>
      <FilmLook_FX grain={0.07}>
        <AbsoluteFill>
          {SHOTS.map(([src, a, b], i) => (
            <Sequence key={src} from={F(a) - (i ? X : 0)} durationInFrames={F(b) - F(a) + (i ? X : 0) + X} layout="none">
              <Shot src={src} len={F(b) - F(a)} first={i === 0} />
            </Sequence>
          ))}
          <Sequence from={F(PB)} durationInFrames={DUR - F(PB)} layout="none">
            <AbsoluteFill style={{ opacity: 1 }}>
              <CameraMotionBlur samples={4} shutterAngle={150}><PullBack /></CameraMotionBlur>
            </AbsoluteFill>
          </Sequence>
        </AbsoluteFill>
      </FilmLook_FX>
      {/* no place labels in the intro (owner 10 Nov: "dont add these for the intro") */}
    </AbsoluteFill>
  </LibFontGate>
);
