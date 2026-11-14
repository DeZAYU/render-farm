// TOR12 OrbitTrace: the satellite explained on the real frame. The VHS freezes on the moment the thin Hesston rope stands beside the
// new tornado; white brackets name the two, then a dashed orbit is drawn round the big one and a marker carries the rope round it
// (anticlockwise, the way a satellite tornado orbits its parent). Coordinates in SOURCE px (cover-fit).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

const Bracket: React.FC<{ x: number; y: number; w: number; h: number; g: number }> = ({ x, y, w, h, g }) => {
  const L = Math.min(w, h) * 0.28 * g, s = { stroke: "#fff", strokeWidth: 5, fill: "none", strokeLinecap: "square" as const };
  return <g opacity={g} style={{ filter: "drop-shadow(0 2px 5px rgba(0,0,0,.7))" }}>
    <path d={`M${x} ${y + L} V${y} H${x + L}`} {...s} /><path d={`M${x + w - L} ${y} H${x + w} V${y + L}`} {...s} />
    <path d={`M${x} ${y + h - L} V${y + h} H${x + L}`} {...s} /><path d={`M${x + w - L} ${y + h} H${x + w} V${y + h - L}`} {...s} />
  </g>;
};

export const OrbitTrace: React.FC<{ still: string; sw: number; sh: number; a: [number, number, number, number]; b: [number, number, number, number];
  aLabel: string; bLabel: string; centre: [number, number]; rx: number; ry: number; startAng: number; at: { a: number; b: number; orbit: number; len: number } }> = ({ still, sw, sh, a, b, aLabel, bLabel, centre, rx, ry, startAng, at }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = 1.04 + 0.06 * io(f / durationInFrames);
  const k = Math.max(width / sw, height / sh), ox = (width - sw * k) / 2, oy = (height - sh * k) / 2;
  const S = (x: number, y: number): [number, number] => { const X = ox + x * k, Y = oy + y * k; return [width / 2 + (X - width / 2) * z, height / 2 + (Y - height / 2) * z]; };
  const box = (r: number[]) => { const [x0, y0] = S(r[0], r[1]), [x1, y1] = S(r[2], r[3]); return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 }; };
  const A = box(a), B = box(b);
  const ga = out(interpolate(f, [at.a, at.a + 10], [0, 1], cl)), gb = out(interpolate(f, [at.b, at.b + 10], [0, 1], cl));
  const [cx, cy] = S(centre[0], centre[1]), Rx = rx * k * z, Ry = ry * k * z;
  const go = io(interpolate(f, [at.orbit, at.orbit + at.len], [0, 1], cl));
  // orbit path: anticlockwise on screen seen from below = counter to the clock as drawn
  const N = 90, ang = (u: number) => startAng - u * Math.PI * 2;
  const pts = Array.from({ length: N + 1 }, (_, i) => { const t = ang((i / N) * go); return `${cx + Rx * Math.cos(t)},${cy + Ry * Math.sin(t)}`; }).join(" ");
  const mx = cx + Rx * Math.cos(ang(go)), my = cy + Ry * Math.sin(ang(go));
  const freezeIn = interpolate(f, [0, 6], [0, 1], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(still)} style={{ position: "absolute", left: ox, top: oy, width: sw * k, height: sh * k, transform: `scale(${z})`, transformOrigin: `${width / 2 - ox}px ${height / 2 - oy}px`,
        filter: `brightness(${1 - 0.12 * freezeIn}) contrast(1.06)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <Bracket {...A} g={ga} /><Bracket {...B} g={gb} />
        {go > 0 && <polyline points={pts} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="14 12" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.7))" }} />}
        {go > 0 && go < 1 && <circle cx={mx} cy={my} r={11} fill="#E3141B" stroke="#fff" strokeWidth={4} />}
      </svg>
      <RedLabel text={aLabel} at={at.a + 4} x={(A.x + A.w / 2) / width} y={Math.max(0.08, (A.y - 40) / height)} size={34} />
      <RedLabel text={bLabel} at={at.b + 4} x={(B.x + B.w / 2) / width} y={Math.min(0.93, (B.y + B.h + 40) / height)} size={34} />
    </AbsoluteFill>
  );
};
