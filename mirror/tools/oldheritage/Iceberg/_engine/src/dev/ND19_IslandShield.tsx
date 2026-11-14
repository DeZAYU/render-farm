// ND19 IslandShield: Matsushima Bay on Sentinel-2 (2016). Phase 1: the bay's islands light up white one by one, swept from the open sea
// toward Shiogama (each lit outline is a real island: OpenStreetMap coastline rings, bay19osm.py). Phase 2: a soft white surge band crosses from the
// south-east; behind every island it is dimmed (its strength = exp(-island area upstream along the travel line)), so it reaches the
// Shiogama shore weak; the port is boxed and named.
import React from "react";
import { AbsoluteFill, Easing, Img, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Fld = { w: number; h: number; d: Uint8ClampedArray };
const cache = new Map<string, Promise<Fld>>();
const load = (src: string) => {
  if (!cache.has(src)) cache.set(src, new Promise((res) => {
    const im = new Image(); im.onload = () => { const c = document.createElement("canvas"); c.width = im.width; c.height = im.height; const x = c.getContext("2d")!; x.drawImage(im, 0, 0); res({ w: im.width, h: im.height, d: x.getImageData(0, 0, im.width, im.height).data }); };
    im.src = staticFile(src);
  }));
  return cache.get(src)!;
};

export type ShieldP = {
  img: string; iw: number; ih: number; field: string; fscale: number; nIsl: number;
  cam0: [number, number, number]; cam1: [number, number, number]; // image px centre x, y, visible width
  lightAt: [number, number]; // frames: island sweep
  band: [number, number]; dir: [number, number]; // frames: band crossing; travel direction (field px)
  port: [number, number, number, number]; portAt: number; label: string; bayLabel: string; bayAt: number;
};

export const IslandShield: React.FC<ShieldP> = (p) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const [h0] = React.useState(() => delayRender("islands field"));
  const [fld, set] = React.useState<Fld | null>(null);
  React.useEffect(() => { load(p.field).then((v) => { set(v); continueRender(h0); }); }, [p.field, h0]);
  const ref = React.useRef<HTMLCanvasElement>(null);
  const u = io(f / durationInFrames);
  const cx = p.cam0[0] + (p.cam1[0] - p.cam0[0]) * u, cy = p.cam0[1] + (p.cam1[1] - p.cam0[1]) * u, vw = p.cam0[2] + (p.cam1[2] - p.cam0[2]) * u;
  const s = width / vw; const L = (x: number) => width / 2 + (x - cx) * s, T = (y: number) => height / 2 + (y - cy) * s;
  const lit = interpolate(f, p.lightAt, [0, p.nIsl], cl);
  const bt = interpolate(f, p.band, [0, 1], cl);
  React.useEffect(() => {
    if (!fld || !ref.current) return;
    const h = delayRender("shield draw");
    const x = ref.current.getContext("2d")!; const im = x.createImageData(fld.w, fld.h); const o = im.data; const d = fld.d;
    const [dx, dy] = p.dir; const n = Math.hypot(dx, dy); const ux = dx / n, uy = dy / n;
    // travel coordinate range over the field
    const ps = [0 * ux + 0 * uy, fld.w * ux, fld.h * uy, fld.w * ux + fld.h * uy]; const pmin = Math.min(...ps), pmax = Math.max(...ps);
    const F = pmin + (pmax - pmin + 300) * bt - 150, bw = 110;
    for (let yy = 0; yy < fld.h; yy++) for (let xx = 0; xx < fld.w; xx++) {
      const i = yy * fld.w + xx, k = i * 4; const idx = d[k];
      let a = 0;
      if (idx > 0) { if (idx <= lit) { const age = lit - idx; a = d[k + 1] > 128 ? 0.95 : 0.22 + 0.35 * Math.exp(-age / 8); } }
      else if (d[k + 2] > 128 && bt > 0 && bt < 1) {
        const pp = xx * ux + yy * uy; const z = (F - pp) / bw;
        if (z > -1.5 && z < 6) { const amp = d[k + 1] / 255; a = amp * (z < 0 ? Math.exp(-z * z * 2) : Math.exp(-z * 0.7)) * 0.9; }
      }
      o[k] = 255; o[k + 1] = 255; o[k + 2] = 255; o[k + 3] = Math.round(a * 255);
    }
    x.putImageData(im, 0, 0); continueRender(h);
  }, [fld, lit, bt, p.dir]);
  const g = out(interpolate(f, [p.portAt, p.portAt + 14], [0, 1], cl));
  const bx = [L(p.port[0]), T(p.port[1]), L(p.port[2]), T(p.port[3])]; const P = 2 * ((bx[2] - bx[0]) + (bx[3] - bx[1]));
  return (
    <AbsoluteFill style={{ background: "#03060c", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: L(0), top: T(0), width: p.iw * s, height: p.ih * s }}>
        <Img src={staticFile(p.img)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "brightness(1.2) contrast(1.05)" }} />
        <canvas ref={ref} width={fld?.w ?? 1} height={fld?.h ?? 1} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 2px rgba(0,0,0,.5))" }} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.45) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {g > 0 && <rect x={bx[0]} y={bx[1]} width={bx[2] - bx[0]} height={bx[3] - bx[1]} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - g)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />}
      </svg>
      <RedLabel text={p.bayLabel} at={p.bayAt} hold={p.portAt - p.bayAt - 12} x={0.62} y={0.12} />
      <RedLabel text={p.label} at={p.portAt + 8} x={((bx[0] + bx[2]) / 2) / width} y={Math.min(0.92, (bx[3] + 46) / height)} />
    </AbsoluteFill>
  );
};
