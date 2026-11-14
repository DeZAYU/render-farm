// TOR25 | RibbonPath: a long-track tornado as a RIBBON on a real top-down aerial (USGS NAIP, flat, ~16 m/px), its width drawn to scale
// (900 yd ≈ 52 image px at its widest) and varying with the survey's intensity along the path: it thins where the tornado weakened
// near Abilene and swells again past Interstate 70 to the EF4 farmstead southwest of Chapman. The camera rides along the head,
// pulls out to the whole 25-mile strip (the aerial floats as a white-edged strip on black), then drops onto Chapman and the
// farmstead. Place tags are red labels on short white leaders. Not a 3-D plane (cf. TOR24 TrackGlide): flat, top-down, a ribbon.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type P = [number, number];
type Cam = { at: number; c: P; span: number };
type Tag = { p: P; text: string; at: number; dy?: number };

const camAt = (f: number, keys: Cam[]): { c: P; span: number } => {
  if (f <= keys[0].at) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.at) { const u = io((f - a.at) / (b.at - a.at)); return { c: [a.c[0] + (b.c[0] - a.c[0]) * u, a.c[1] + (b.c[1] - a.c[1]) * u], span: Math.exp(Math.log(a.span) + (Math.log(b.span) - Math.log(a.span)) * u) }; }
  }
  return keys[keys.length - 1];
};

/** polyline cut at fraction k of its length, with widths interpolated */
const cut = (pts: P[], w: number[], k: number) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const L = seg.reduce((a, b) => a + b, 0) * k;
  const P2: P[] = [pts[0]], W2 = [w[0]]; let acc = 0;
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] <= L) { P2.push(pts[i + 1]); W2.push(w[i + 1]); acc += seg[i]; continue; }
    const u = (L - acc) / seg[i]; if (u > 0) { P2.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u]); W2.push(w[i] + (w[i + 1] - w[i]) * u); }
    break;
  }
  return { P2, W2 };
};

/** a closed ribbon polygon around the polyline (half-width w/2 at each vertex, averaged normals, round-ish caps) */
const ribbon = (P2: P[], W2: number[]) => {
  if (P2.length < 2) return "";
  const n = P2.map((p, i) => {
    const a = P2[Math.max(0, i - 1)], b = P2[Math.min(P2.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [-dy / l, dx / l];
  });
  const L = P2.map((p, i) => [p[0] + n[i][0] * W2[i] / 2, p[1] + n[i][1] * W2[i] / 2]);
  const R = P2.map((p, i) => [p[0] - n[i][0] * W2[i] / 2, p[1] - n[i][1] * W2[i] / 2]).reverse();
  return "M" + [...L, ...R].map((q) => q.map((v) => v.toFixed(1)).join(" ")).join(" L") + " Z";
};

export const RibbonPath: React.FC<{
  src: string; iw: number; ih: number; pts: P[]; widths: number[]; // widths in image px
  draw: { at: number; len: number; k0: number; k1: number }[]; // drawing phases (fraction of the path)
  cams: Cam[]; tags: Tag[]; mark?: { p: P; at: number };
}> = ({ src, iw, ih, pts, widths, draw, cams, tags, mark }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const cam = camAt(f, cams); const s = width / cam.span;
  const ox = width / 2 - cam.c[0] * s, oy = height / 2 - cam.c[1] * s;
  const S = (p: P): P => [ox + p[0] * s, oy + p[1] * s];
  let k = 0; for (const d of draw) if (f >= d.at) k = d.k0 + (d.k1 - d.k0) * io(interpolate(f, [d.at, d.at + d.len], [0, 1], cl));
  const { P2, W2 } = cut(pts, widths, k);
  const d = ribbon(P2.map(S), W2.map((w) => Math.max(3, w * s)));
  const fade = interpolate(f, [0, 8], [0, 1], cl);
  const mg = mark ? out(interpolate(f, [mark.at, mark.at + 10], [0, 1], cl)) : 0;
  return (
    <AbsoluteFill style={{ background: "#08090b", overflow: "hidden", opacity: fade }}>
      <div style={{ position: "absolute", left: ox, top: oy, width: iw * s, height: ih * s, outline: "4px solid rgba(255,255,255,.9)", boxShadow: "0 30px 80px rgba(0,0,0,.8)" }}>
        <Img src={staticFile(src)} style={{ width: "100%", height: "100%", filter: "contrast(1.1) brightness(.92)" }} />
      </div>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {d && <path d={d} fill="rgba(0,0,0,.45)" stroke="rgba(0,0,0,.5)" strokeWidth={8} strokeLinejoin="round" />}
        {d && <path d={d} fill="rgba(255,255,255,.82)" stroke="#fff" strokeWidth={2.5} strokeLinejoin="round" />}
        {mark && mg > 0 && (() => { const [X, Y] = S(mark.p), q = 30 * (1.6 - 0.6 * mg);
          return <g opacity={mg}><rect x={X - q / 2} y={Y - q / 2} width={q} height={q} fill="rgba(227,20,27,.45)" stroke={RED} strokeWidth={4} /><rect x={X - q / 2 - 3} y={Y - q / 2 - 3} width={q + 6} height={q + 6} fill="none" stroke="rgba(255,255,255,.85)" strokeWidth={1.5} /></g>; })()}
        {tags.map((t, i) => { const g = out(interpolate(f, [t.at, t.at + 10], [0, 1], cl)); if (g <= 0) return null; const [X, Y] = S(t.p), dy = t.dy ?? -70;
          return <g key={i} opacity={g}><circle cx={X} cy={Y} r={6} fill="#fff" /><line x1={X} y1={Y} x2={X} y2={Y + dy * g} stroke="#fff" strokeWidth={3} /></g>; })}
      </svg>
      {tags.map((t, i) => { const [X, Y] = S(t.p), dy = t.dy ?? -70; return <RedLabel key={i} text={t.text} at={t.at + 4} x={X / width} y={(Y + dy + (dy < 0 ? -22 : 22)) / height} size={38} />; })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.5) 100%)" }} />
    </AbsoluteFill>
  );
};
