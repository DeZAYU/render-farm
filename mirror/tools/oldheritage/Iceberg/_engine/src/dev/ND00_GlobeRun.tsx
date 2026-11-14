// ND00 (intro): GlobeRun v2 (owner 3 Nov: v1 too fast). A real 3-D globe (NASA Blue Marble shaded relief + bathymetry, GIBS, public domain,
// house grade) rendered per frame by orthographic ray-mapping on a canvas with bilinear sampling (no shimmer). Only a few FEATURED cases, each
// on its VO line: the camera eases (ease-in-out per segment, continuous float values) across the globe to the case, its pin drops with a
// small spring bounce, and a white-framed card plays that case's own footage beside the pin (leader line from the pin head) with its red
// place + year label; the card holds >= 1.5 s and fades out completely before the camera moves on. At the end the other cases' pins fade in
// softly together while the camera eases wide.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, Sequence, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const D2R = Math.PI / 180;

let TEX: { w: number; h: number; d: Uint8ClampedArray } | null = null;
let TEXP: Promise<void> | null = null;
const loadTex = (url: string) => {
  if (!TEXP) TEXP = new Promise<void>((res, rej) => {
    const im = new Image(); im.crossOrigin = "anonymous";
    im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const g = c.getContext("2d")!; g.drawImage(im, 0, 0);
      TEX = { w: im.width, h: im.height, d: g.getImageData(0, 0, im.width, im.height).data }; res(); };
    im.onerror = () => rej(new Error("globe texture " + url)); im.src = url;
  });
  return TEXP;
};

export type GFeat = { lon: number; lat: number; label: string; video: string; from: number; drop: number; out: number };
export type GPin = { lon: number; lat: number };
export type Cam = { f: number; lon: number; lat: number; r: number; hop?: number }; // hop: radius at mid-flight (one continuous eased move, zoom arcs out)

const camAt = (keys: Cam[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) {
      const u = (f - a.f) / (b.f - a.f), t = ease(u); const r0 = a.r + (b.r - a.r) * t;
      const r = b.hop ? r0 - (r0 - b.hop) * Math.sin(Math.PI * t) : r0;
      return { f, lon: a.lon + (b.lon - a.lon) * t, lat: a.lat + (b.lat - a.lat) * t, r };
    }
  }
  return keys[keys.length - 1];
};

export const GlobeRun: React.FC<{ tex: string; feats: GFeat[]; context: GPin[]; cam: Cam[]; ctx0: number; ctx1: number; cxf?: number; cy?: number }> = ({ tex, feats, context, cam, ctx0, ctx1, cxf = 0.36, cy = 560 }) => {
  const f = useCurrentFrame(); const { width, height, fps } = useVideoConfig();
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [h] = React.useState(() => delayRender("globe texture"));
  const [ready, setReady] = React.useState(!!TEX);
  React.useEffect(() => { loadTex(staticFile(tex)).then(() => { setReady(true); continueRender(h); }); }, [tex, h]);
  const c = camAt(cam, f);
  const l0 = c.lon * D2R, p0 = c.lat * D2R, R = c.r, cx = width * cxf;
  const sp = Math.sin(p0), cp = Math.cos(p0);
  React.useLayoutEffect(() => {
    if (!ready || !ref.current || !TEX) return;
    const g = ref.current.getContext("2d")!; const img = g.createImageData(width, height); const o = img.data; const T = TEX; const W = T.w, Hh = T.h, d = T.d;
    const y0 = Math.max(0, Math.floor(cy - R)), y1 = Math.min(height - 1, Math.ceil(cy + R));
    for (let py = y0; py <= y1; py++) {
      const y = (cy - py) / R; const xr = Math.sqrt(Math.max(0, 1 - y * y)) * R;
      const x0 = Math.max(0, Math.floor(cx - xr)), x1 = Math.min(width - 1, Math.ceil(cx + xr));
      for (let px = x0; px <= x1; px++) {
        const x = (px - cx) / R; const rr = x * x + y * y; if (rr > 1) continue;
        const z = Math.sqrt(1 - rr);
        const lat = Math.asin(z * sp + y * cp); const lon = l0 + Math.atan2(x, z * cp - y * sp);
        let u = (lon / (2 * Math.PI) + 0.5) % 1; if (u < 0) u += 1;
        const fx = u * W - 0.5, fy = Math.min(Hh - 1.001, Math.max(0, (0.5 - lat / Math.PI) * Hh - 0.5));
        const ix = Math.floor(fx), iy = Math.floor(fy), ax = fx - ix, ay = fy - iy;
        const xa = ((ix % W) + W) % W, xb = (xa + 1) % W, ya = iy, yb = Math.min(Hh - 1, iy + 1);
        const i00 = (ya * W + xa) * 4, i10 = (ya * W + xb) * 4, i01 = (yb * W + xa) * 4, i11 = (yb * W + xb) * 4;
        const shade = (0.42 + 0.68 * Math.pow(z, 0.6)) * 1.12; const edge = Math.min(1, ((1 - Math.sqrt(rr)) * R) / 1.5);
        const k = (py * width + px) * 4;
        for (let ch = 0; ch < 3; ch++) {
          const v = (d[i00 + ch] * (1 - ax) + d[i10 + ch] * ax) * (1 - ay) + (d[i01 + ch] * (1 - ax) + d[i11 + ch] * ax) * ay;
          o[k + ch] = Math.min(255, v * shade);
        }
        o[k + 3] = 255 * edge;
      }
    }
    g.putImageData(img, 0, 0);
  });
  const proj = (lon: number, lat: number) => {
    const la = lat * D2R, dl = lon * D2R - l0;
    const cosc = sp * Math.sin(la) + cp * Math.cos(la) * Math.cos(dl);
    const x = Math.cos(la) * Math.sin(dl), y = cp * Math.sin(la) - sp * Math.cos(la) * Math.cos(dl);
    return { X: cx + x * R, Y: cy - y * R, vis: cosc };
  };
  const ctxO = interpolate(f, [ctx0, ctx1], [0, 1], { ...cl, easing: ease });
  const CW = 640, CH = 360;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 40% 52%, #0d1116 0%, #050505 70%)", overflow: "hidden" }}>
      <RedLabel text="." at={1e6} />
      <div style={{ position: "absolute", left: cx - R - 26, top: cy - R - 26, width: (R + 26) * 2, height: (R + 26) * 2, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(170,195,220,0) 92%, rgba(170,195,220,.22) 96.5%, rgba(170,195,220,0) 100%)" }} />
      <canvas ref={ref} width={width} height={height} style={{ position: "absolute", inset: 0 }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {ctxO > 0 && context.map((p, i) => {
          const q = proj(p.lon, p.lat); if (q.vis < 0.3) return null; const o = ctxO * Math.min(1, (q.vis - 0.3) * 5);
          return (<g key={"c" + i} opacity={o}><line x1={q.X} y1={q.Y} x2={q.X} y2={q.Y - 26} stroke="#fff" strokeWidth={2.5} /><circle cx={q.X} cy={q.Y - 26} r={5.5} fill={RED} stroke="#fff" strokeWidth={2} /></g>);
        })}
        {feats.map((p, i) => {
          if (f < p.drop) return null;
          const q = proj(p.lon, p.lat); if (q.vis < 0.3) return null;
          const s = spring({ frame: f - p.drop, fps, config: { damping: 10, stiffness: 140, mass: 0.8 } });
          const top = q.Y - 46 - (1 - s) * 100;
          return (
            <g key={i} opacity={Math.min(1, (f - p.drop) / 5) * Math.min(1, (q.vis - 0.3) * 5)}>
              <ellipse cx={q.X + 5} cy={q.Y + 2} rx={12} ry={4} fill="rgba(0,0,0,.6)" />
              <line x1={q.X} y1={q.Y} x2={q.X} y2={top + 7} stroke="#fff" strokeWidth={3.5} />
              <circle cx={q.X} cy={top} r={8.5} fill={RED} stroke="#fff" strokeWidth={3} />
            </g>
          );
        })}
      </svg>
      {feats.map((p, i) => {
        const a = p.drop + 6; if (f < a || f > p.out + 10) return null;
        const q = proj(p.lon, p.lat); const top = q.Y - 46;
        const inn = interpolate(f, [a, a + 10], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
        const o = interpolate(f, [p.out, p.out + 10], [1, 0], { ...cl, easing: ease }) * inn;
        const lx = q.X + 130, ly = top - 300 + (1 - inn) * 20;
        return (
          <React.Fragment key={"k" + i}>
            <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: o }}>
              <line x1={q.X + 6} y1={top - 6} x2={lx} y2={ly + CH} stroke="#fff" strokeWidth={3} />
            </svg>
            <div style={{ position: "absolute", left: lx, top: ly, width: CW, opacity: o }}>
              <div style={{ width: CW, height: CH, border: "6px solid #fff", boxSizing: "border-box", overflow: "hidden", background: "#000", boxShadow: "0 14px 34px rgba(0,0,0,.65)" }}>
                <Sequence from={a} layout="none"><OffthreadVideo src={staticFile(p.video)} startFrom={Math.round(p.from * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
              </div>
              <div style={{ position: "absolute", left: 0, top: CH + 14, background: RED, padding: "7px 14px", boxShadow: "0 5px 14px rgba(0,0,0,.5)" }}>
                <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 36, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre", textTransform: "uppercase" }}>{p.label}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
