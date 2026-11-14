// WP17 JetTrace — the CSB camera at the moment the connection breaks, full frame, slowed: the frame dims except a soft pool of light
// that follows the white jet down from where it bursts out of the pipe rack and spreads along the deck; a thin white line is drawn
// along the jet's path behind the pool, then the RedLabel names what is in it (HYDROFLUORIC ACID · HF). Used once.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, io, out } from "./WP01_kit";

type P = [number, number];
const along = (pts: P[], u: number): P => {
  const L: number[] = [0];
  for (let i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  const d = u * L[L.length - 1]; let i = 1; while (i < L.length - 1 && L[i] < d) i++;
  const k = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]);
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k];
};

/** path: the jet in display coords (0..1), from the burst point down/out; label: [text, frame, x, y] */
export const WP17_JetTrace: React.FC<{ src: string; from: number; n: number; rate?: number; path: P[]; label: [string, number, number, number] }> = ({ src, from, n, rate = 0.6, path, label }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  const u = io(interpolate(f, [8, n - 20], [0, 1], cl));
  const [cx, cy] = along(path, u);
  const dim = 0.58 * out(interpolate(f, [0, 22], [0, 1], cl));
  const r = 0.16 + 0.12 * u;
  const s = 1.03 + 0.07 * io(Math.min(1, f / n));
  const draw = interpolate(f, [14, n - 26], [0, 1], cl);
  const d = path.map((p, i) => `${i ? "L" : "M"}${p[0] * W},${p[1] * H}`).join(" ");
  const len = path.reduce((a, p, i) => i ? a + Math.hypot((p[0] - path[i - 1][0]) * W, (p[1] - path[i - 1][1]) * H) : 0, 0);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${path[0][0] * 100}% ${path[0][1] * 100 + 30}%` }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <AbsoluteFill style={{ background: `radial-gradient(ellipse ${r * 100 * 1.15}% ${r * 100 * 1.9}% at ${cx * 100}% ${cy * 100}%, rgba(0,0,0,0) 35%, rgba(0,0,0,${dim}) 100%)` }} />
        <svg viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - draw)}
            style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.75))" }} opacity={0.92} />
          {draw > 0 && <circle cx={path[0][0] * W} cy={path[0][1] * H} r={9} fill="#fff" opacity={out(interpolate(f, [14, 26], [0, 1], cl))} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.75))" }} />}
        </svg>
      </AbsoluteFill>
      <RedLabel text={label[0]} at={label[1]} hold={n - label[1] - 12} x={label[2]} y={label[3]} size={42} />
    </AbsoluteFill>
  );
};
