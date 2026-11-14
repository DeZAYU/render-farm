// WP08 StepReplay — the gate camera's blast, again, at a fraction of its speed and stepped like the security recorder's own frames:
// the 4:3 CCTV picture at full height over its blurred copy, each recorded frame held, a slow push into the fireball rising behind the
// canopy, then white corner brackets close round it. Used once, under the line right after the raw.
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

const At: React.FC<{ src: string; t: number; style: React.CSSProperties }> = ({ src, t, style }) => (
  <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={style} /></Freeze>
);

/** box: [x0, y0, x1, y1] of the fireball in the 4:3 picture (0..1); rate: playback speed; step: recorder frames per second */
export const WP08_StepReplay: React.FC<{ src: string; t0: number; n: number; rate?: number; step?: number; box: [number, number, number, number]; zoom?: number }> = ({ src, t0, n, rate = 0.5, step = 10, box, zoom = 1.6 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const t = t0 + Math.floor((f / 30) * rate * step) / step;
  const W = height * 4 / 3, x0 = (width - W) / 2;
  const u = io(interpolate(f, [0, n - 6], [0, 1], cl));
  const s = 1 + (zoom - 1) * u;
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const b = out(interpolate(f, [n * 0.45, n * 0.45 + 14], [0, 1], cl));
  const pad = 40 * (1 - b);
  const L = 34;
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(34px) brightness(0.45) saturate(.85)", transform: "scale(1.2)" }}><At src={src} t={t} style={st} /></AbsoluteFill>
      <div style={{ position: "absolute", left: x0, top: 0, width: W, height, overflow: "hidden", boxShadow: "0 0 60px rgba(0,0,0,.7)" }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale3d(${s},${s},1)`, transformOrigin: `${cx * 100}% ${cy * 100}%`, willChange: "transform" }}>
          <At src={src} t={t} style={st} />
          {b > 0 && (
            <svg viewBox={`0 0 ${W} ${height}`} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: b }}>
              {(() => {
                const X0 = box[0] * W - pad, Y0 = box[1] * height - pad, X1 = box[2] * W + pad, Y1 = box[3] * height + pad;
                const sw = 5 / s;
                const d = `M${X0},${Y0 + L} V${Y0} H${X0 + L} M${X1 - L},${Y0} H${X1} V${Y0 + L} M${X1},${Y1 - L} V${Y1} H${X1 - L} M${X0 + L},${Y1} H${X0} V${Y1 - L}`;
                return <path d={d} fill="none" stroke="#fff" strokeWidth={sw} strokeLinecap="square" style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.6))" }} />;
              })()}
            </svg>
          )}
        </div>
      </div>
    </AbsoluteFill>
  );
};
