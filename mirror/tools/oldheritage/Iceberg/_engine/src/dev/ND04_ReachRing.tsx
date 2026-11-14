// ND04 ReachRing — a measured radius on a real aerial: the white box marks a site (the Asahi-cho fuel depot on Kesennuma Bay), then a
// white ring grows from it to a stated real distance (2.5 km, scaled from the image's metres per pixel) while the camera pulls back so
// the whole reach is seen against the bay and the town. RedLabels name the site and the distance.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const ReachRing: React.FC<{ src: string; iw: number; ih: number; site: [number, number]; box: number; mPerPx: number; metres: number;
  ringAt: number; ringLen?: number; z0: number; z1: number; siteLabel?: string; ringLabel?: string; boxAt?: number }> = ({ src, iw, ih, site, box, mPerPx, metres, ringAt, ringLen = 50, z0, z1, siteLabel, ringLabel, boxAt = 8 }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const k = io(interpolate(f, [0, D], [0, 1], cl));
  const base = Math.max(W / iw, H / ih) * (z0 + (z1 - z0) * k);
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - site[0] * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - site[1] * base));
  const sx = ox + site[0] * base, sy = oy + site[1] * base, bs = box * base;
  const gb = out(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl)), P = 4 * bs;
  const gr = io(interpolate(f, [ringAt, ringAt + ringLen], [0, 1], cl));
  const R = (metres / mPerPx) * base * gr;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {gr > 0 && <>
          <circle cx={sx} cy={sy} r={R} fill="rgba(255,255,255,.06)" stroke="rgba(0,0,0,.45)" strokeWidth={11} />
          <circle cx={sx} cy={sy} r={R} fill="none" stroke="#fff" strokeWidth={5} />
          <line x1={sx} y1={sy} x2={sx + R * 0.7071} y2={sy - R * 0.7071} stroke="#fff" strokeWidth={3} strokeDasharray="12 9" />
        </>}
        <rect x={sx - bs / 2} y={sy - bs / 2} width={bs} height={bs} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - gb)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
      </svg>
      {siteLabel && <RedLabel text={siteLabel} at={boxAt + 6} hold={ringAt - boxAt - 4} x={sx / W} y={Math.min(0.92, (sy + bs / 2 + 46) / H)} size={40} />}
      {ringLabel && <RedLabel text={ringLabel} at={ringAt + ringLen - 6} x={Math.min(0.85, (sx + R * 0.7071 * 0.5 + 60) / W)} y={Math.max(0.08, (sy - R * 0.7071 * 0.5 - 30) / H)} size={44} />}
    </AbsoluteFill>
  );
};
