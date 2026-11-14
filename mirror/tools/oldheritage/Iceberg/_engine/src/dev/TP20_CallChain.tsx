// TP20 CallChain: the alarm handed along a chain of people. Node cards (white frames, heavy caps) on a dark board over the
// pier the night before: ALARM -> MONITORING COMPANY -> KEY-HOLDER. A white signal runs down each link; at the key-holder it rings
// (three white arcs) and nobody picks up: the card goes hollow, dashed, "NO ANSWER". Then the link runs on as an empty dashed wire
// and the camera travels along it (time to scale: 1 min = PX px) until the FIRE SERVICE card at 6:46, where the board warms to the
// fire. A last pull-back shows the whole chain with the empty stretch bracketed. Not a clock, ruler or day strip: the gap is a wire.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const FONT = { fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100" } as const;

export type ChainNode = { x: number; y: number; title: string; at: number; time?: string; timeAt?: number; dead?: number };
export const CallChain: React.FC<{
  bg: string; fire: string; fireFrom?: number; fireAt: number; nodes: ChainNode[];
  links: { from: number; to: number; at: number; len: number; empty?: boolean }[];
  ring: { node: number; at: number }; noAnswerAt: number; noAnswerHold?: number;
  cam: { at: number; x: number; y: number; z: number }[]; span: { a: number; b: number; label: string; at: number };
}> = ({ bg, fire, fireFrom = 0, fireAt, nodes, links, ring, noAnswerAt, noAnswerHold = 9999, cam, span }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  // camera: eased between keys
  let c = cam[0];
  for (let i = 1; i < cam.length; i++) {
    const p = cam[i - 1], q = cam[i];
    if (f >= p.at) { const k = io(interpolate(f, [p.at, q.at], [0, 1], cl)); c = { at: f, x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k, z: p.z + (q.z - p.z) * k }; }
  }
  const S = (x: number, y: number) => [width / 2 + (x - c.x) * c.z, height / 2 + (y - c.y) * c.z] as const;
  const W = 420, H = 124;
  const fireK = io(interpolate(f, [fireAt, fireAt + 24], [0, 1], cl));
  const enter = out(interpolate(f, [0, 12], [0, 1], cl));
  const bgShift = (c.x - cam[0].x) * 0.04; // parallax: the picture behind drifts slower than the board
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover", transform: `translateX(${-bgShift}px) scale(1.05)`,
        filter: "blur(9px) brightness(.26) saturate(.45) hue-rotate(-12deg)", opacity: 1 - fireK }} />
      {fireK > 0 && <OffthreadVideo src={staticFile(fire)} startFrom={Math.round(fireFrom * 30)} muted style={{ position: "absolute", inset: -80, width: width + 160, height: height + 160, objectFit: "cover",
        transform: `translateX(${-bgShift}px) scale(1.05)`, filter: "blur(8px) brightness(.36) saturate(.8)", opacity: fireK }} />}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 65% at 50% 50%, rgba(0,0,0,0) 35%, rgba(0,0,0,.65) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: enter }}>
        {/* links */}
        {links.map((l, i) => {
          const a = nodes[l.from], b = nodes[l.to];
          const g = io(interpolate(f, [l.at, l.at + l.len], [0, 1], cl));
          if (g <= 0) return null;
          const [x1, y1] = S(a.x + W / 2, a.y), [x2, y2] = S(b.x - W / 2, b.y);
          const xe = x1 + (x2 - x1) * g, ye = y1 + (y2 - y1) * g;
          const pulse = !l.empty && g < 1;
          return <g key={i}>
            <line x1={x1} y1={y1} x2={xe} y2={ye} stroke={l.empty ? "rgba(255,255,255,.55)" : "#fff"} strokeWidth={l.empty ? 3 : 5} strokeDasharray={l.empty ? "10 16" : undefined} />
            {pulse && <circle cx={xe} cy={ye} r={9} fill="#fff" style={{ filter: "drop-shadow(0 0 10px rgba(255,255,255,.9))" }} />}
            {l.empty && g < 1 && <circle cx={xe} cy={ye} r={8} fill="none" stroke="rgba(255,255,255,.7)" strokeWidth={3} />}
          </g>;
        })}
        {/* nodes */}
        {nodes.map((n, i) => {
          const g = out(interpolate(f, [n.at, n.at + 12], [0, 1], cl)); if (g <= 0) return null;
          const [x, y] = S(n.x, n.y); const w = W * c.z, h = H * c.z;
          const dead = n.dead !== undefined ? interpolate(f, [n.dead, n.dead + 10], [0, 1], cl) : 0;
          return <g key={i} opacity={g} transform={`translate(${x} ${y}) scale(${0.9 + 0.1 * g})`}>
            <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={`rgba(8,8,8,${0.72 - 0.4 * dead})`} stroke="#fff" strokeWidth={5} strokeDasharray={dead > 0.5 ? "14 10" : undefined} opacity={1 - 0.45 * dead} />
            <text x={0} y={h * 0.13} textAnchor="middle" fill="#fff" opacity={1 - 0.5 * dead} fontSize={Math.max(13, 36 * c.z)} style={FONT} letterSpacing="0.02em">{n.title}</text>
          </g>;
        })}
        {/* the ring at the key-holder: three white arcs either side, pulsing, then nothing */}
        {(() => { const n = nodes[ring.node]; const [x, y] = S(n.x, n.y); const w = W * c.z;
          return [0, 1, 2].map((k) => { const t0 = ring.at + k * 13; const g = interpolate(f, [t0, t0 + 12], [0, 1], cl); if (g <= 0 || g >= 1) return null;
            const r = (30 + 50 * g) * c.z, o = 1 - g;
            return <g key={k} opacity={o} stroke="#fff" strokeWidth={5} fill="none">
              <path d={`M ${x + w / 2 + 14} ${y - r} A ${r} ${r} 0 0 1 ${x + w / 2 + 14} ${y + r}`} />
              <path d={`M ${x - w / 2 - 14} ${y - r} A ${r} ${r} 0 0 0 ${x - w / 2 - 14} ${y + r}`} />
            </g>; }); })()}
        {/* bracket over the empty wire */}
        {f >= span.at && (() => { const g = io(interpolate(f, [span.at, span.at + 18], [0, 1], cl));
          const [xa, ya] = S(nodes[span.a].x + W / 2 + 10, nodes[span.a].y - H / 2 - 40), [xb] = S(nodes[span.b].x - W / 2 - 10, 0);
          const xe = xa + (xb - xa) * g;
          return <g stroke={RED} strokeWidth={6}><line x1={xa} y1={ya} x2={xe} y2={ya} /><line x1={xa} y1={ya - 18} x2={xa} y2={ya + 18} />{g > 0.98 && <line x1={xb} y1={ya - 18} x2={xb} y2={ya + 18} />}</g>; })()}
      </svg>
      {nodes.map((n, i) => n.time ? (() => { const [x, y] = S(n.x, n.y); return <RedLabel key={i} text={n.time} at={n.timeAt ?? n.at + 6} x={x / width} y={(y + H * c.z / 2 + 46) / height} size={40} />; })() : null)}
      {(() => { const n = nodes[ring.node]; const [x, y] = S(n.x, n.y); return <RedLabel text="NO ANSWER" at={noAnswerAt} hold={noAnswerHold} x={x / width} y={(y + H * c.z / 2 + 46) / height} size={40} />; })()}
      {(() => { const [xa, ya] = S(nodes[span.a].x + W / 2, nodes[span.a].y - H / 2 - 40), [xb] = S(nodes[span.b].x - W / 2, 0);
        return <RedLabel text={span.label} at={span.at + 14} x={((xa + xb) / 2) / width} y={(ya - 52) / height} size={46} />; })()}
    </AbsoluteFill>
  );
};
