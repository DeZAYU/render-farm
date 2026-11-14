// TOR08 | ScarDevelop: the tornado's 27-km scar appearing on the land, from the satellite itself. Two real NASA HLS (Sentinel-2)
// images of the same ground, five days before and five days after: the "before" fills the frame; a corridor that follows the track
// develops into the "after" from Břeclav towards Pánov (soft leading edge, no wipe line), so the flattened forest and fields show up in
// the order the tornado made them (the change inside the corridor is lifted slightly so it reads on a phone). Towns get the red label
// as the developing front reaches them. The "before" is dimmed so the developed corridor reads as a band. px = image pixels.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const ScarDevelop: React.FC<{ before: string; after: string; iw: number; ih: number; path: [number, number][]; at: number; len: number;
  half?: number; towns: { x: number; y: number; label: string }[]; z0?: number; z1?: number; focus?: [number, number] }> = ({ before, after, iw, ih, path, at, len, half = 150, towns, z0 = 1.25, z1 = 1.12, focus }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / iw, height / ih) * z;
  const fc = focus ?? [iw / 2, ih / 2];
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fc[0] * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fc[1] * base));
  const seg = path.slice(1).map((p, i) => Math.hypot(p[0] - path[i][0], p[1] - path[i][1])); const total = seg.reduce((a, b) => a + b, 0);
  const g = io(interpolate(f, [at, at + len], [0, 1], cl));
  // the developed part of the corridor as an SVG mask path (stroke of width 2*half along the path, up to g)
  const S = (p: [number, number]) => [ox + p[0] * base, oy + p[1] * base];
  const d = "M" + path.map((p) => S(p).map((v) => v.toFixed(1)).join(" ")).join(" L");
  const sw = 2 * half * base;
  const proj = (x: number, y: number) => { // fraction along the path of the closest point
    let acc = 0, best = 0, bd = 1e9;
    for (let i = 0; i < seg.length; i++) { const [x0, y0] = path[i], [x1, y1] = path[i + 1]; const vx = x1 - x0, vy = y1 - y0;
      const t = Math.max(0, Math.min(1, ((x - x0) * vx + (y - y0) * vy) / (vx * vx + vy * vy))); const dd = Math.hypot(x - x0 - t * vx, y - y0 - t * vy);
      if (dd < bd) { bd = dd; best = (acc + t * seg[i]) / total; } acc += seg[i]; }
    return best;
  };
  const id = "scarmask";
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(before)} style={{ ...st, filter: "brightness(.62) saturate(.8)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={18} /></filter>
          <mask id={id} maskUnits="userSpaceOnUse" x={0} y={0} width={width} height={height}>
            <path d={d} fill="none" stroke="#fff" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={`${g} 2`} filter="url(#soft)" />
          </mask>
        </defs>
        <image href={staticFile(after)} x={ox} y={oy} width={iw * base} height={ih * base} mask={`url(#${id})`} preserveAspectRatio="none" />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
      {towns.map((t, i) => { const u = proj(t.x, t.y); const fr = at + Math.round(len * Math.max(0, u - 0.02)); const [x, y] = S([t.x, t.y]);
        return <RedLabel key={i} text={t.label} at={fr} x={Math.min(0.88, Math.max(0.12, x / width))} y={Math.min(0.92, Math.max(0.08, (y + 46) / height))} size={34} />; })}
    </AbsoluteFill>
  );
};
