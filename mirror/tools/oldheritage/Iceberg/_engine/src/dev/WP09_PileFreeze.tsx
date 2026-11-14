// WP09 PileFreeze — the morning drone pass over the wreck plays, freezes, and pushes in on the pile: a white line runs along the derailed
// stretch from the first car off the rails to the last, the rest of the frame dims round it, then white corner brackets close on the
// burning tank cars. Built for "Eleven were tank cars carrying hazardous materials, and three were breached." (no numerals on screen).
import React from "react";
import { AbsoluteFill, Easing, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** pile: polyline (1920x1080 px of the frozen frame) along the wreck; box: [x0,y0,x1,y1] round the burning tank cars */
export const WP09_PileFreeze: React.FC<{ src: string; from: number; freezeAt: number; n: number; pile: [number, number][]; box: [number, number, number, number]; zoom?: number }> = ({ src, from, freezeAt, n, pile, box, zoom = 1.5 }) => {
  const f = useCurrentFrame();
  const fz = Math.round(freezeAt * 30);
  const live = f < fz;
  const u = io(interpolate(f, [fz - 4, n - 4], [0, 1], cl));
  const s = 1 + (zoom - 1) * u;
  const cx = (box[0] + box[2]) / 2, cy = (box[1] + box[3]) / 2;
  const tr = io(interpolate(f, [fz + 2, fz + 34], [0, 1], cl));
  const dim = interpolate(f, [fz + 6, fz + 30], [0, 1], cl);
  const br = out(interpolate(f, [fz + 30, fz + 44], [0, 1], cl));
  const len = pile.reduce((a, p, i) => i ? a + Math.hypot(p[0] - pile[i - 1][0], p[1] - pile[i - 1][1]) : 0, 0);
  const pad = 46 * (1 - br), L = 40;
  const [X0, Y0, X1, Y1] = [box[0] - pad, box[1] - pad, box[2] + pad, box[3] + pad];
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(cx / 1920) * 100}% ${(cy / 1080) * 100}%`, willChange: "transform" }}>
        {live ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={st} />
          : <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30) + fz} muted style={st} /></Freeze>}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="wp09spot" cx={cx / 1920} cy={cy / 1080} r="0.55" gradientUnits="objectBoundingBox">
              <stop offset="0.25" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.72" />
            </radialGradient>
          </defs>
          <rect width="1920" height="1080" fill="url(#wp09spot)" opacity={dim} />
          <polyline points={pile.map((p) => p.join(",")).join(" ")} fill="none" stroke="#fff" strokeWidth={6 / s} strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray={`${len * tr} ${len}`} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.9))" }} />
          {br > 0 && <path d={`M${X0},${Y0 + L} V${Y0} H${X0 + L} M${X1 - L},${Y0} H${X1} V${Y0 + L} M${X1},${Y1 - L} V${Y1} H${X1 - L} M${X0 + L},${Y1} H${X0} V${Y1 - L}`}
            fill="none" stroke="#fff" strokeWidth={6 / s} opacity={br} style={{ filter: "drop-shadow(0 0 6px rgba(0,0,0,.8))" }} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
