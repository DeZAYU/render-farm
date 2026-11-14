// TP10 | WheelClock: the ride's own rim used as a 12-hour dial (real photo of The Wheel, CC0, dropped to night). Twelve white hour ticks
// land on the rim, then a white arc runs along the rim from the outage time to the time the last rider was off (red sector behind it);
// each end gets its red time label on its spoken word. Ellipse = the rim in image pixels (cx, cy, rx, ry); a slow push toward the arc.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const WheelClock: React.FC<{
  src: string; iw: number; ih: number; rim: [number, number, number, number]; h0: number; h1: number;
  ticksAt?: number; sweepAt: number; sweepLen: number; label0: string; label1: string; label1At?: number; z0?: number; z1?: number;
}> = ({ src, iw, ih, rim, h0, h1, ticksAt = 4, sweepAt, sweepLen, label0, label1, label1At, z0 = 0.62, z1 = 0.7 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const [cx, cy, rx, ry] = rim;
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = (height / (2 * ry + 520)) * (z / z0) ; // fit the rim + margin, then push
  // focus drifts from the rim centre toward the swept side
  const midH = (h0 + h1) / 2, ma = (midH / 12) * 2 * Math.PI;
  const k = io(f / durationInFrames);
  const fx = cx + rx * Math.sin(ma) * 0.25 * k, fy = cy - ry * Math.cos(ma) * 0.25 * k;
  const ox = width / 2 - fx * base, oy = height / 2 - fy * base;
  const P = (h: number, s = 1) => { const a = (h / 12) * 2 * Math.PI; return [ox + (cx + rx * s * Math.sin(a)) * base, oy + (cy - ry * s * Math.cos(a)) * base]; };
  const g = io(interpolate(f, [sweepAt, sweepAt + sweepLen], [0, 1], cl));
  const hNow = h0 + (h1 - h0) * g;
  const N = 90, arc: string[] = [];
  for (let i = 0; i <= N; i++) { const [x, y] = P(h0 + ((hNow - h0) * i) / N); arc.push(`${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`); }
  const [hx, hy] = [ox + cx * base, oy + cy * base];
  const sector = arc.join(" ") + ` L${hx} ${hy} Z`;
  const [ex, ey] = P(hNow), [sx, sy] = P(h0), [lx, ly] = P(h1);
  const o = interpolate(f, [0, 8], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(24px) brightness(.18) saturate(.5)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "brightness(.36) contrast(1.15) saturate(.35) hue-rotate(10deg)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 62% at 50% 45%, #000 60%, rgba(0,0,0,0) 100%)", maskImage: "radial-gradient(ellipse 60% 62% at 50% 45%, #000 60%, rgba(0,0,0,0) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 12 }, (_, h) => {
          const t = out(interpolate(f, [ticksAt + h * 1.5, ticksAt + h * 1.5 + 10], [0, 1], cl)); if (t <= 0) return null;
          const [x1, y1] = P(h, 1.0), [x2, y2] = P(h, 1 - 0.09 * t);
          return <line key={h} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth={h % 3 === 0 ? 7 : 4} opacity={0.9 * t} strokeLinecap="round" />;
        })}
        {g > 0 && <path d={sector} fill="rgba(227,20,27,.15)" />}
        {g > 0 && <path d={arc.join(" ")} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={18} strokeLinecap="round" />}
        {g > 0 && <path d={arc.join(" ")} fill="none" stroke="#fff" strokeWidth={8} strokeLinecap="round" />}
        {g > 0 && <line x1={hx} y1={hy} x2={ex} y2={ey} stroke="#fff" strokeWidth={4} opacity={0.85} />}
        <circle cx={sx} cy={sy} r={12} fill={RED} stroke="#fff" strokeWidth={4} opacity={interpolate(f, [sweepAt - 6, sweepAt], [0, 1], cl)} />
        {g > 0.98 && <circle cx={lx} cy={ly} r={12} fill={RED} stroke="#fff" strokeWidth={4} />}
      </svg>
      <RedLabel text={label0} at={sweepAt - 4} x={Math.min(0.85, Math.max(0.15, sx / width))} y={Math.min(0.92, (sy + 70) / height)} size={40} />
      <RedLabel text={label1} at={label1At ?? sweepAt + sweepLen} x={Math.min(0.85, Math.max(0.15, lx / width))} y={Math.max(0.08, (ly - 70) / height)} size={40} />
    </AbsoluteFill>
  );
};
