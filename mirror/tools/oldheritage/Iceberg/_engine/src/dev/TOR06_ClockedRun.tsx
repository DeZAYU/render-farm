// TOR06 | ClockedRun: the whole life of the tornado on a real autumn satellite image (NASA HLS), seen straight down.
// The camera sits tight on the touchdown point, then rides the head of the track as it is drawn; a small red clock rides with the
// head and ticks through the real NCEI segment times (10:59 -> 11:47), places light as the head passes them, and at the end the
// camera lifts off to show the whole 46-mile line at once. px = image pixels; nodes carry their clock minute.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Node = [number, number, number]; // x, y, minutes after h0:m0
export const ClockedRun: React.FC<{
  src: string; iw: number; ih: number; nodes: Node[]; h0: number; m0: number;
  at: number; len: number; z0?: number; z1?: number; places?: { x: number; y: number; label: string }[];
}> = ({ src, iw, ih, nodes, h0, m0, at, len, z0 = 2.4, z1 = 1.0, places = [] }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // cumulative length along the track
  const seg = nodes.slice(1).map((n, i) => Math.hypot(n[0] - nodes[i][0], n[1] - nodes[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  const pointAt = (u: number): Node => {
    let d = u * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) { const k = seg[i] ? Math.min(1, d / seg[i]) : 0; const a = nodes[i], b = nodes[i + 1];
        return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
      d -= seg[i];
    }
    return nodes[nodes.length - 1];
  };
  const head = pointAt(g);
  // camera: tight on the head while it runs, then lift off to the whole track
  const lift = io(interpolate(f, [at + len - 6, durationInFrames - 4], [0, 1], cl));
  const mid: [number, number] = [(nodes[0][0] + nodes[nodes.length - 1][0]) / 2, (nodes[0][1] + nodes[nodes.length - 1][1]) / 2];
  const z = z0 + (z1 - z0) * lift;
  const cx = head[0] + (mid[0] - head[0]) * lift, cy = head[1] + (mid[1] - head[1]) * lift;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - cx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - cy * base));
  const S = (p: [number, number] | Node) => [ox + p[0] * base, oy + p[1] * base];
  // drawn part of the line
  const drawn: number[][] = [S(nodes[0])];
  { let d = g * total; for (let i = 0; i < seg.length && d > 0; i++) { if (d >= seg[i]) { drawn.push(S(nodes[i + 1])); d -= seg[i]; } else { drawn.push(S(pointAt(g))); d = 0; } } }
  const path = "M" + drawn.map((p) => p.map((v) => v.toFixed(1)).join(" ")).join(" L");
  const [hx, hy] = S(head);
  const mins = Math.floor(head[2] + 1e-6), hh = h0 + Math.floor((m0 + mins) / 60), mm = (m0 + mins) % 60;
  const clock = `${hh}:${String(mm).padStart(2, "0")} AM`;
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const passed = (x: number, y: number) => { // has the head passed the place (closest point fraction)?
    let best = 0, bd = 1e9; for (let i = 0; i <= 60; i++) { const p = pointAt(i / 60); const d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = i / 60; } } return best;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.04)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <path d={path} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
        <path d={path} fill="none" stroke="#fff" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        {/* touchdown and lift marks: small white squares */}
        {(() => { const [x, y] = S(nodes[0]); return <rect x={x - 9} y={y - 9} width={18} height={18} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={2} />; })()}
        {g > 0.995 && (() => { const [x, y] = S(nodes[nodes.length - 1]); const k = out(interpolate(f, [at + len, at + len + 8], [0, 1], cl));
          return <rect x={x - 9 * k} y={y - 9 * k} width={18 * k} height={18 * k} fill="#fff" stroke="rgba(0,0,0,.6)" strokeWidth={2} />; })()}
        {g > 0 && g < 0.995 && <rect x={hx - 7} y={hy - 7} width={14} height={14} fill="#fff" />}
      </svg>
      {/* the clock rides the head */}
      {f >= at - 4 && lift < 0.6 && <div style={{ opacity: 1 - lift / 0.6 }}><RedLabel text={clock} at={at - 4} x={Math.min(0.9, Math.max(0.1, hx / width - 0.08))} y={Math.min(0.9, Math.max(0.08, hy / height - 0.1))} size={40} /></div>}
      {places.map((p, i) => { const u = passed(p.x, p.y); const t = at + Math.round(len * u) ; const [x, y] = S([p.x, p.y]);
        return <RedLabel key={i} text={p.label} at={t} x={Math.min(0.88, Math.max(0.12, x / width))} y={Math.min(0.93, (y + 52) / height)} size={30} />; })}
    </AbsoluteFill>
  );
};
