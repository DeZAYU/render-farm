// ND11 KitStrip: the three things Mort's group didn't have, as three white-framed panels standing in a shallow 3-D arc. Each panel swings
// forward and lights on its word while the others sit back and dim: a transceiver in use (USMC photo, public domain), a probe in use
// (Commons, CC BY-SA 3.0), and the red shovel from the dig itself (a frame of the friend's own camera).
// Built for "A beacon tells your friends where you are under the snow, a probe pins down the spot and a shovel gets you out."
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Panel = { src: string; still?: boolean; from?: number; pos?: string; at: number };

export const ND11_KitStrip: React.FC<{ panels: [Panel, Panel, Panel]; bg: string; bgFrom?: number }> = ({ panels, bg, bgFrom = 0 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const W = 520, H = 700;
  // which panel is active: eased index between the cue frames
  let act = 0; panels.forEach((p, i) => { if (i > 0) act += io(interpolate(f, [p.at - 8, p.at + 8], [0, 1], cl)); });
  const cam = -12 + 24 * (f / durationInFrames); // slow camera yaw across the arc
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", perspective: 1700 }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(16px) brightness(.4) saturate(.6)" }} />
      <AbsoluteFill style={{ transformStyle: "preserve-3d", transform: `rotateY(${cam.toFixed(3)}deg)` }}>
        {panels.map((p, i) => {
          const k = out(interpolate(f, [i * 5, i * 5 + 16], [0, 1], cl));
          const near = Math.max(0, 1 - Math.abs(act - i)); // 1 when this panel is the one spoken
          const x = (i - 1) * 580, z = -220 + 260 * near, ry = (1 - i) * 18 * (1 - near);
          return (
            <div key={i} style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2, width: W, height: H, border: "6px solid #fff", overflow: "hidden", background: "#111",
              boxShadow: "0 30px 70px rgba(0,0,0,.7)", opacity: k, transform: `translate3d(${x}px, ${(1 - k) * 60}px, ${z.toFixed(1)}px) rotateY(${ry.toFixed(2)}deg)`,
              filter: `brightness(${(0.42 + 0.58 * near).toFixed(3)}) saturate(${(0.6 + 0.4 * near).toFixed(3)})` }}>
              {p.still ? <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 50%", transform: `scale(${1.04 + 0.05 * near})` }} />
                : <OffthreadVideo src={staticFile(p.src)} startFrom={Math.round((p.from ?? 0) * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: p.pos ?? "50% 50%", transform: `scale(${1.04 + 0.05 * near})` }} />}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
