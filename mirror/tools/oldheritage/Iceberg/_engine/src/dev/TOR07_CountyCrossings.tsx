// TOR07 | CountyCrossings: the NWS damage swath (public-domain survey map) read like a road trip. The camera starts tight on the
// Albany end of the swath, then travels north-east along it; the rest of the map stays dim under a soft spotlight that rides the
// swath, and every time the path crosses a county line a white bar is stamped across the swath with the county's name, on the
// word. px = image pixels; `path` is the swath's centre line, `cross` the county-line crossings (point, frame, name).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const CountyCrossings: React.FC<{ src: string; iw: number; ih: number; path: [number, number][]; cross: { p: [number, number]; at: number; name: string }[];
  z0?: number; z1?: number; travel: [number, number]; startU?: number }> = ({ src, iw, ih, path, cross, z0 = 2.2, z1 = 1.25, travel, startU = 0.25 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])); const total = seg.reduce((a, b) => a + b, 0);
  const at = (u: number): [number, number] => { let d = u * total; for (let i = 0; i < seg.length; i++) { if (d <= seg[i] || i === seg.length - 1) { const k = Math.min(1, d / seg[i]); return [path[i][0] + (path[i + 1][0] - path[i][0]) * k, path[i][1] + (path[i + 1][1] - path[i][1]) * k]; } d -= seg[i]; } return path[path.length - 1]; };
  const t = io(interpolate(f, travel, [0, 1], cl));
  const u = startU + (1 - startU - 0.06) * t;
  const [cx, cy] = at(u);
  const z = z0 + (z1 - z0) * t;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cy * base));
  const S = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const [sx, sy] = S([cx, cy]);
  const k = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: k }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base }} />
      {/* spotlight riding the swath */}
      <AbsoluteFill style={{ background: `radial-gradient(circle ${Math.round(520)}px at ${sx.toFixed(0)}px ${sy.toFixed(0)}px, rgba(0,0,0,0) 35%, rgba(0,0,0,.62) 100%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {cross.map((c, i) => {
          const g = out(interpolate(f, [c.at, c.at + 10], [0, 1], cl)); if (g <= 0) return null;
          // perpendicular to the path at the crossing
          let best = 0, bd = 1e9; for (let j = 0; j <= 200; j++) { const p = at(j / 200); const d = Math.hypot(p[0] - c.p[0], p[1] - c.p[1]); if (d < bd) { bd = d; best = j / 200; } }
          const a = at(Math.max(0, best - 0.01)), b = at(Math.min(1, best + 0.01)); const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
          const nx = -dy / L, ny = dx / L, half = 46 * g;
          const [x, y] = S(c.p);
          return <g key={i}><line x1={x - nx * half} y1={y - ny * half} x2={x + nx * half} y2={y + ny * half} stroke="rgba(0,0,0,.55)" strokeWidth={14} strokeLinecap="square" />
            <line x1={x - nx * half} y1={y - ny * half} x2={x + nx * half} y2={y + ny * half} stroke="#fff" strokeWidth={7} strokeLinecap="square" /></g>;
        })}
      </svg>
      {cross.map((c, i) => { const [x, y] = S(c.p); return <RedLabel key={i} text={c.name} at={c.at + 3} hold={9999} x={Math.min(0.86, Math.max(0.14, (x + 150) / width))} y={Math.min(0.9, Math.max(0.1, (y + 70) / height))} size={34} />; })}
    </AbsoluteFill>
  );
};
