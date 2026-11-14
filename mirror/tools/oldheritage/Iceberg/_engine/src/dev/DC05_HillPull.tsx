// DC05 HillPull: a real Sentinel-2 satellite image of Kuala Lumpur (EOX s2cloudless 2016, CC BY 4.0). Opens wide on the grey city
// and eases down onto the dark green hill district west of the centre while the place label wipes on; on the spoken names a small
// white point + caps name lands on Lake Gardens and on Kenny Hills (Bukit Tunku), and a thin white dashed line joins them — the
// stretch of hill road where the clip was filmed ("somewhere between Lake Gardens and Kenny Hills"). Edges darkened, no red marks.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { cl, ease, io, out, useDcFonts } from "./DC01_kit";

type Pt = { x: number; y: number; name: string; at: number; side?: "l" | "r" };
export const HillPull: React.FC<{ src: string; iw: number; ih: number; z0: number; z1: number; f0: [number, number]; f1: [number, number];
  pts: Pt[]; lineAt: number; children?: React.ReactNode }> = ({ src, iw, ih, z0, z1, f0, f1, pts, lineAt, children }) => {
  useDcFonts();
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(Math.min(1, f / (durationInFrames - 4)));
  const z = z0 + (z1 - z0) * u, fx = f0[0] + (f1[0] - f0[0]) * u, fy = f0[1] + (f1[1] - f0[1]) * u;
  const base = Math.max(width / iw, height / ih) * z;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - fx * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - fy * base));
  const P = (x: number, y: number) => [ox + x * base, oy + y * base];
  const g = ease(f, lineAt, lineAt + 22);
  const [ax, ay] = P(pts[0].x, pts[0].y), [bx, by] = P(pts[1].x, pts[1].y);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 8], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.08) saturate(1.05) brightness(.95)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(0,0,0,0) 40%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={ax} y1={ay} x2={ax + (bx - ax) * g} y2={ay + (by - ay) * g} stroke="rgba(0,0,0,.5)" strokeWidth={8} strokeDasharray="14 12" />
        <line x1={ax} y1={ay} x2={ax + (bx - ax) * g} y2={ay + (by - ay) * g} stroke="#fff" strokeWidth={4} strokeDasharray="14 12" />
      </svg>
      {pts.map((p, i) => {
        const [x, y] = P(p.x, p.y); const a = out(interpolate(f, [p.at, p.at + 10], [0, 1], cl));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: a }}>
            <div style={{ position: "absolute", left: -9, top: -9, width: 18, height: 18, borderRadius: 9, background: "#fff", boxShadow: "0 0 0 4px rgba(0,0,0,.35), 0 2px 10px rgba(0,0,0,.6)", transform: `scale(${0.4 + 0.6 * a})` }} />
            <div style={{ position: "absolute", top: -17, ...(p.side === "l" ? { right: 24 } : { left: 24 }), whiteSpace: "pre", fontFamily: "ArchivoBlk", fontWeight: 900,
              fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 30, color: "#fff", letterSpacing: "0.02em", textShadow: "0 2px 10px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9)",
              transform: `translateX(${(1 - a) * (p.side === "l" ? 10 : -10)}px)` }}>{p.name}</div>
          </div>
        );
      })}
      {children}
    </AbsoluteFill>
  );
};
