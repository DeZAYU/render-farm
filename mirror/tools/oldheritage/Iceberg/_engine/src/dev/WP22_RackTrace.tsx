// WP22 device: RackTrace — the refinery's own CCTV picture of the burning unit (minutes before the blast) runs full frame at slow
// speed with an eased push. The frame sinks into shadow except a band along the overhead pipe rack that crosses the whole view; a
// white line with a bright head runs along the rack ("an overhead pipeline ... had lost its seal"). On "That isn't an official
// finding" the line breaks into dashes and dims, the shadow lifts: the account stays unconfirmed.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out } from "./WP01_kit";

export const RackTrace: React.FC<{
  src: string; from: number; rate?: number; n: number; pts: [number, number][]; at: number; doubt: number;
  s0?: number; s1?: number; fx?: number; fy?: number;
}> = ({ src, from, rate = 0.5, n, pts, at, doubt, s0 = 1.0, s1 = 1.1, fx = 0.5, fy = 0.38 }) => {
  const f = useCurrentFrame();
  const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const len = seg.reduce((x, y) => x + y, 0);
  const u = io(interpolate(f, [at, at + 54], [0, 1], cl));
  const shade = 0.62 * io(interpolate(f, [at - 12, at + 14], [0, 1], cl)) * (1 - 0.75 * io(interpolate(f, [doubt, doubt + 26], [0, 1], cl)));
  const dash = io(interpolate(f, [doubt, doubt + 20], [0, 1], cl));
  const lineOp = 1 - 0.45 * dash;
  // head position along the polyline
  let rem = u * len, hx = pts[0][0], hy = pts[0][1];
  for (let i = 0; i < seg.length; i++) {
    if (rem <= seg[i]) { const k = rem / seg[i]; hx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k; hy = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k; break; }
    rem -= seg[i]; hx = pts[i + 1][0]; hy = pts[i + 1][1];
  }
  const headOp = u > 0 && u < 1 ? 1 : interpolate(f, [at + 54, at + 66], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${fx * 100}% ${fy * 100}%`, willChange: "transform" }}>
        <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <defs>
            <filter id="bl" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="40" /></filter>
            <filter id="gl" filterUnits="userSpaceOnUse" x="-200" y="-200" width="2320" height="1480"><feGaussianBlur stdDeviation="7" /></filter>
            <mask id="rk"><rect width="1920" height="1080" fill="#fff" />
              <path d={d} stroke="#000" strokeWidth={170} fill="none" filter="url(#bl)" /></mask>
          </defs>
          <rect width="1920" height="1080" fill="#000" opacity={shade} mask="url(#rk)" />
          {u > 0 && <g opacity={lineOp}>
            <path d={d} fill="none" stroke="#fff" strokeWidth={14} opacity={0.35} filter="url(#gl)" strokeDasharray={`${len * u} ${len}`} />
            <path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round"
              strokeDasharray={dash > 0 ? `${36 - 8 * dash} ${8 + 26 * dash}` : `${len * u} ${len}`} />
          </g>}
          {u > 0 && <g opacity={headOp}>
            <circle cx={hx} cy={hy} r={22} fill="#fff" opacity={0.45} filter="url(#gl)" />
            <circle cx={hx} cy={hy} r={8} fill="#fff" />
          </g>}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
