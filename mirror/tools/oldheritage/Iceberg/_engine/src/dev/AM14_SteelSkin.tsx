// AM14 SteelSkin: a real close photo of the New Texas Giant's track (Martin Lewison, Aug 2013, CC BY-SA 2.0): red steel I-box rails
// bolted on top of the old timber structure. The photo starts drained to a dim grey; on "wood underneath" the timber beams flood back
// to their own colour with a soft warm glow, on "steel track on top" the steel rails flood back and one light sweep runs along them,
// while the camera eases in. The two masks are colour keys of the same photo (shots/track_wood_a.png, track_steel_a.png). No text.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);

export const SteelSkin: React.FC<{ src: string; wood: string; steel: string; iw: number; ih: number; woodAt: number; steelAt: number; focus?: [number, number] }> = ({ src, wood, steel, iw, ih, woodAt, steelAt, focus = [0.5, 0.5] }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const k0 = Math.max(1920 / iw, 1080 / ih), W = iw * k0, H = ih * k0;
  const s = 1.02 + 0.08 * io(interpolate(f, [0, dur], [0, 1], cl));
  const left = 960 - focus[0] * W * s, top = 540 - focus[1] * H * s;
  const w = io(interpolate(f, [woodAt, woodAt + 16], [0, 1], cl));
  const st = io(interpolate(f, [steelAt, steelAt + 16], [0, 1], cl));
  const sweep = interpolate(f, [steelAt + 4, steelAt + 40], [-0.3, 1.3], cl);
  const masked = (m: string): React.CSSProperties => ({ position: "absolute", inset: 0, WebkitMaskImage: `url(${staticFile(m)})`, maskImage: `url(${staticFile(m)})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%" });
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: W, height: H, transform: `scale(${s})`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "grayscale(1) brightness(.42) contrast(1.05)" }} />
        <div style={{ ...masked(wood), opacity: w }}>
          <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: `brightness(${0.95 + 0.12 * (1 - st)}) saturate(1.1)` }} />
        </div>
        <div style={{ ...masked(steel), opacity: st }}>
          <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: W, height: H, filter: "brightness(1.05) saturate(1.1)" }} />
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen",
            background: `linear-gradient(105deg, rgba(255,255,255,0) ${sweep * 100 - 12}%, rgba(255,240,235,.55) ${sweep * 100}%, rgba(255,255,255,0) ${sweep * 100 + 12}%)` }} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
