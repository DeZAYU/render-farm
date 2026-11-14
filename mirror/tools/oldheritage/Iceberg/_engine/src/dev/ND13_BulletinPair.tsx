// ND13 BulletinPair: the two real "EVACUATION IMMEDIATE" bulletins (IEM archive of NWS Morristown products) as lit paper sheets in
// 3-D: the first lands tilted, its issue-time line is marked; the second slides in over it and its time is marked. Over the drive, darkened.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type Sheet = { src: string; imgW: number; imgH: number; crop: [number, number, number, number]; mark: [number, number, number, number]; at: number; markAt: number; from: 1 | -1 };

export const BulletinPair: React.FC<{ bg: string; bgFrom: number; sheets: Sheet[] }> = ({ bg, bgFrom, sheets }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = f / durationInFrames;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.7)", transform: `scale(${1.05 + 0.04 * u})` }} />
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 45%" }}>
        {sheets.map((s, i) => {
          const [cx0, cy0, cx1, cy1] = s.crop; const cw = cx1 - cx0, ch = cy1 - cy0;
          const W = width * 0.62, k = W / cw, H = ch * k;
          const g = out(interpolate(f, [s.at, s.at + 20], [0, 1], cl));
          if (g <= 0) return null;
          const later = sheets.slice(i + 1).some((n) => f >= n.at);
          const back = later ? io(interpolate(f, [sheets[i + 1].at, sheets[i + 1].at + 20], [0, 1], cl)) : 0;
          const rx = 10 - 6 * u, ry = s.from * (16 * (1 - g) + 7) - back * 10 * s.from;
          const tx = s.from * (1 - g) * width * 0.6 - back * s.from * 150 + (i ? 70 : -70), ty = -30 + i * 60 - back * 70;
          const mk = io(interpolate(f, [s.markAt, s.markAt + 14], [0, 1], cl));
          const [m0, m1, m2, m3] = s.mark;
          return (
            <div key={i} style={{ position: "absolute", left: (width - W) / 2, top: (height - H) / 2, width: W, height: H, overflow: "hidden",
              transform: `translate3d(${tx}px, ${ty}px, ${-back * 260}px) rotateX(${rx}deg) rotateY(${ry}deg)`, opacity: g * (1 - 0.35 * back),
              boxShadow: "0 30px 90px rgba(0,0,0,.75)", border: "5px solid #fff", background: "#f7f8fa" }}>
              <div style={{ position: "absolute", left: -cx0 * k, top: -cy0 * k, width: s.imgW * k, height: s.imgH * k }}>
                <div style={{ position: "absolute", left: (m0 - 10) * k, top: (m1 - 6) * k, width: (m2 - m0 + 20) * k * mk, height: (m3 - m1 + 12) * k, background: RED, opacity: 0.85 }} />
                <Img src={staticFile(s.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", mixBlendMode: "multiply" }} />
              </div>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 80% at ${35 + 30 * u}% 30%, rgba(255,250,240,0) 30%, rgba(0,0,0,.22) 100%)` }} />
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
