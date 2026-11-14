// ND18 OceanReach: "across the Indian Ocean". NASA Blue Marble bathymetry of the basin; the tsunami's reach spreads as a red tint with a
// white leading edge, timed by a real travel-time field (shallow-water speed sqrt(g*depth) from NOAA ETOPO1, shortest paths from the
// 2004 rupture; fields18.py). Then Thailand's Andaman coast is boxed and named. Hours run faster than life (0 -> `hours` over the shot).
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { useField } from "./ND18_field";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export type ReachP = {
  img: string; bbox: [number, number, number, number]; // lon0, lat0(south), lon1, lat1(north) of img and field
  field: string; tmaxh: number; hours: [number, number, number]; // frame end of spread, hours at start, hours at end
  cam0: [number, number, number]; cam1: [number, number, number]; // lon, lat, visible width (deg)
  box: [number, number, number, number]; boxAt: number; label: string;
};

export const OceanReach: React.FC<ReachP> = (p) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const fld = useField(p.field); const ref = React.useRef<HTMLCanvasElement>(null);
  const u = io(f / durationInFrames);
  const lon = p.cam0[0] + (p.cam1[0] - p.cam0[0]) * u, lat = p.cam0[1] + (p.cam1[1] - p.cam0[1]) * u, wd = p.cam0[2] * Math.pow(p.cam1[2] / p.cam0[2], u);
  const ppd = width / wd; const X = (lo: number) => width / 2 + (lo - lon) * ppd, Y = (la: number) => height / 2 - (la - lat) * ppd;
  const hrs = interpolate(f, [0, p.hours[0]], [p.hours[1], p.hours[2]], { ...cl, easing: Easing.bezier(0.3, 0.1, 0.5, 1) });
  React.useEffect(() => {
    if (!fld || !ref.current) return;
    const h = delayRender("reach draw");
    const x = ref.current.getContext("2d")!; const im = x.createImageData(fld.w, fld.h); const d = im.data;
    const F = hrs / p.tmaxh;
    for (let i = 0; i < fld.t.length; i++) {
      const t = fld.t[i]; if (t < 0 || t > F + 0.01) continue;
      const lead = Math.exp(-Math.pow((F - t) / 0.006, 2)); const fill = interpolate(F - t, [-0.004, 0.004], [0, 1], cl);
      const a = Math.max(lead * 0.95, fill * 0.11);
      const w = lead / Math.max(lead + fill * 0.11, 1e-3);
      d[i * 4] = Math.round(227 + (255 - 227) * w); d[i * 4 + 1] = Math.round(20 + 235 * w); d[i * 4 + 2] = Math.round(27 + 228 * w); d[i * 4 + 3] = Math.round(a * 255);
    }
    x.putImageData(im, 0, 0); continueRender(h);
  }, [fld, hrs, p.tmaxh]);
  const [lo0, la0, lo1, la1] = p.bbox;
  const bx = [X(p.box[0]), Y(p.box[3]), X(p.box[2]), Y(p.box[1])]; const g = out(interpolate(f, [p.boxAt, p.boxAt + 14], [0, 1], cl));
  const P = 2 * ((bx[2] - bx[0]) + (bx[3] - bx[1]));
  // the field's cells are 0.1 deg centred on grid nodes: extend half a cell
  const hc = 0.05;
  return (
    <AbsoluteFill style={{ background: "#020409", overflow: "hidden" }}>
      <Img src={staticFile(p.img)} style={{ position: "absolute", left: X(lo0), top: Y(la1), width: (lo1 - lo0) * ppd, height: (la1 - la0) * ppd, filter: "brightness(.85)" }} />
      <canvas ref={ref} width={fld?.w ?? 1} height={fld?.h ?? 1} style={{ position: "absolute", left: X(lo0 - hc), top: Y(la1 + hc), width: (lo1 - lo0 + 2 * hc) * ppd, height: (la1 - la0 + 2 * hc) * ppd, mixBlendMode: "normal" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {g > 0 && <rect x={bx[0]} y={bx[1]} width={bx[2] - bx[0]} height={bx[3] - bx[1]} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />}
      </svg>
      <RedLabel text={p.label} at={p.boxAt + 8} x={((bx[0] + bx[2]) / 2) / width} y={(bx[1] - 40) / height} size={42} />
    </AbsoluteFill>
  );
};
