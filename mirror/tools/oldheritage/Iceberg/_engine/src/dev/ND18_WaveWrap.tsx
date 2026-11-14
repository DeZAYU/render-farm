// ND18 WaveWrap: why the wave "came around" Koh Ngai. A real Sentinel-2 image of the island and the Trang coast; the group's spot on the
// sheltered east beach (white marker + red name label) and its sightline to the mainland; then a train of white wave crests rolls in from
// the Andaman Sea (west) and bends round both ends of the island, meeting again on the sheltered side. The crests are isochrones of a
// computed travel-time field (shortest water path from the west edge, land as obstacle; build/CASE18/assets, fields18.py).
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { useField } from "./ND18_field";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type WrapP = {
  img: string; iw: number; ih: number; field: string; fscale: number; tmax: number; // field px * fscale = image px; tmax = field units at value 1
  cam0: [number, number, number]; cam1: [number, number, number]; // image px centre x, y, visible width (image px)
  spot: [number, number]; spotLabel: string; spotAt: number; spotHold: number;
  sight: [number, number]; sightAt: number; sightHold: number;
  front: [number, number, number, number]; // frame a, frame b, field-unit position at a, at b (linear)
  lambda?: number; crests?: number;
};

export const WaveWrap: React.FC<WrapP> = (p) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const fld = useField(p.field);
  const ref = React.useRef<HTMLCanvasElement>(null);
  const u = io(f / durationInFrames);
  const cx = p.cam0[0] + (p.cam1[0] - p.cam0[0]) * u, cy = p.cam0[1] + (p.cam1[1] - p.cam0[1]) * u, vw = p.cam0[2] + (p.cam1[2] - p.cam0[2]) * u;
  const s = width / vw; const L = (x: number) => width / 2 + (x - cx) * s, T = (y: number) => height / 2 + (y - cy) * s;
  const F = interpolate(f, [p.front[0], p.front[1]], [p.front[2], p.front[3]], { extrapolateLeft: "clamp" });
  const lam = p.lambda ?? 26, n = p.crests ?? 6;
  React.useEffect(() => {
    if (!fld || !ref.current) return;
    const h = delayRender("wavewrap draw");
    const c = ref.current, x = c.getContext("2d")!; const im = x.createImageData(fld.w, fld.h); const d = im.data;
    if (f >= p.front[0]) {
      for (let i = 0; i < fld.t.length; i++) {
        const tv = fld.t[i]; if (tv < 0) continue; const t = tv * p.tmax; if (t > F + 2) continue;
        let a = 0.07; // a faint wash on the water the wave has reached
        for (let k = 0; k < n; k++) { const dd = (F - k * lam - t) / 1.5; if (dd > -3 && dd < 3) a = Math.max(a, Math.exp(-dd * dd) * (1 - k / (n + 0.5))); }
        const edge = interpolate(F - t, [-2, 0], [0, 1], cl); a *= edge;
        d[i * 4] = 255; d[i * 4 + 1] = 255; d[i * 4 + 2] = 255; d[i * 4 + 3] = Math.round(a * 235);
      }
    }
    x.putImageData(im, 0, 0); continueRender(h);
  }, [fld, f, F, lam, n, p.front, p.tmax]);
  const sg = out(interpolate(f, [p.spotAt, p.spotAt + 10], [0, 1], cl));
  const sl = io(interpolate(f, [p.sightAt, p.sightAt + 18], [0, 1], cl)) * interpolate(f, [p.sightAt + p.sightHold, p.sightAt + p.sightHold + 10], [1, 0], cl);
  const ring = ((f - p.spotAt) % 40) / 40;
  return (
    <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: L(0), top: T(0), width: p.iw * s, height: p.ih * s }}>
        <Img src={staticFile(p.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "brightness(1.4) contrast(1.06) saturate(1.1)" }} />
        <canvas ref={ref} width={fld?.w ?? 1} height={fld?.h ?? 1} style={{ position: "absolute", left: 0, top: 0, width: (fld?.w ?? 1) * p.fscale * s, height: (fld?.h ?? 1) * p.fscale * s, filter: "drop-shadow(0 0 3px rgba(0,0,0,.45))" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.4) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {sl > 0 && <line x1={L(p.spot[0])} y1={T(p.spot[1])} x2={L(p.spot[0]) + (L(p.sight[0]) - L(p.spot[0])) * sl} y2={T(p.spot[1]) + (T(p.sight[1]) - T(p.spot[1])) * sl}
          stroke="#fff" strokeWidth={4} strokeDasharray="14 12" opacity={0.9} style={{ filter: "drop-shadow(0 1px 4px rgba(0,0,0,.7))" }} />}
        {sg > 0 && <g>
          <rect x={L(p.spot[0]) - 13 - 40 * ring} y={T(p.spot[1]) - 13 - 40 * ring} width={26 + 80 * ring} height={26 + 80 * ring} fill="none" stroke="#fff" strokeWidth={3} opacity={(1 - ring) * sg * 0.9} />
          <rect x={L(p.spot[0]) - 11} y={T(p.spot[1]) - 11} width={22} height={22} fill="#fff" stroke="#000" strokeOpacity={0.4} strokeWidth={2} opacity={sg} />
        </g>}
      </svg>
      <RedLabel text={p.spotLabel} at={p.spotAt + 6} hold={p.spotHold} x={L(p.spot[0]) / width} y={(T(p.spot[1]) - 70) / height} size={40} />
    </AbsoluteFill>
  );
};
