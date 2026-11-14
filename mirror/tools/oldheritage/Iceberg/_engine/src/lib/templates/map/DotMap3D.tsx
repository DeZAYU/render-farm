// map / DotMap3D: a tilted 3-D map whose dots spread out from an origin, then a map box. REF D1 E10 (Dashcam Vol.1 @ 22:02 second map: 3-D
// satellite plane entering by a 25 f dissolve, linear orbit -4.4 deg/s, zoom slow) + D1 E4 map box (@ 0:05.0: red leader, outlined box wiping
// L->R in 6 f, then the words); wp3 sec_B HospMap @ abs 5126 ("more than fifty hospitals around Taiwan").
// Ours: the dots light up in order of distance from the origin (the spread reads as travel), each with a 3 f glow pop; the leader is drawn as one
// continuous stroke into the box edge under motion blur.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CHIP_TONE, FONT, H, RC, W, EZ, MBlur, asset, clamp01, fs as capFs, lerp, rng, measure } from "../../core";
import { DEMO_BM, DEMO_COUNTRY, layerTf, imageRect, wxy, type GeoImage, type GeoLayer, type LonLat, type Word, type WorldProj } from "./shared";

export type DotMap3DProps = {
  cap?: number; labelCap?: number; subCap?: number; // box text / place label / source line caps (M-024 >= 28)
  imagery: GeoImage;
  outline?: GeoLayer; // faint coastline over the imagery
  centre: LonLat; // map point at the frame centre
  pxPerDeg: number; // map scale on the plane (px per degree of latitude)
  tilt?: number; // plane tilt (deg, D1 ~42)
  rot0?: number; // start rotation (deg)
  rotPerS?: number; // orbit (deg/s, D1 -4.4)
  dissolve?: number; // fade-in frames (D1: 25 f dissolve)
  points: (LonLat & { n?: number })[]; // dot sites (n dots each, jittered)
  jitter?: number; // deg
  origin: LonLat; // spread starts here
  dotsFrom: number; dotsTo: number; // local frames: first and last dot
  box?: LonLat & { lineAt: number; words: Word[]; dx?: number; dy?: number }; // map box on a point
  label?: LonLat & { t: string; at: number }; // white place name on the map
  credit?: string; // small source line bottom right
  seed?: number;
};

const PERSP = 1800;
export const DotMap3D: React.FC<DotMap3DProps> = (p) => {
  const f = useCurrentFrame();
  const P: WorldProj = { lon0: p.centre.lon, lat0: p.centre.lat, k: Math.cos((p.centre.lat * Math.PI) / 180), u: p.pxPerDeg };
  const tilt = p.tilt ?? 42;
  const t = Math.max(0, f) / 30;
  const rot = (p.rot0 ?? 8) + (p.rotPerS ?? -4.4) * t, z = 1 + 0.007 * t;
  const fade = clamp01(f / (p.dissolve ?? 25));
  const toPlane = (lon: number, lat: number) => { const q = wxy(P, lon, lat); return { x: 960 + q.x, y: 540 + q.y }; };
  const project = (px: number, py: number) => {
    const rx = (px - 960) * z, ry = (py - 540) * z, b = (rot * Math.PI) / 180, a = (tilt * Math.PI) / 180;
    const x1 = rx * Math.cos(b) - ry * Math.sin(b), y1 = rx * Math.sin(b) + ry * Math.cos(b);
    const y2 = y1 * Math.cos(a), z2 = y1 * Math.sin(a), k = PERSP / (PERSP - z2);
    return { x: 960 + x1 * k, y: 540 + y2 * k };
  };
  const dots = React.useMemo(() => {
    const r = rng(p.seed ?? 11), j = p.jitter ?? 0.07;
    const d: { x: number; y: number; k: number }[] = [];
    const o = toPlane(p.origin.lon, p.origin.lat);
    p.points.forEach((q) => { for (let i = 0; i < (q.n ?? 1); i++) { const c = toPlane(q.lon + (r() - 0.5) * j, q.lat + (r() - 0.5) * j); d.push({ ...c, k: Math.hypot(c.x - o.x, c.y - o.y) + r() * 60 }); } });
    return d.sort((a, b) => a.k - b.k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.points, p.origin, p.seed, p.jitter, p.centre.lon, p.centre.lat, p.pxPerDeg]);
  const ir = imageRect(P, p.imagery);
  const plane = (
    <AbsoluteFill style={{ transform: `perspective(${PERSP}px) rotateX(${tilt}deg) rotateZ(${rot.toFixed(4)}deg) scale(${z.toFixed(5)})`, transformOrigin: "960px 540px" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform="translate(960 540)">
          <image href={asset(p.imagery.src)} x={ir.x} y={ir.y} width={ir.w} height={ir.h} preserveAspectRatio="none" />
          {p.outline ? <g transform={layerTf(P, p.outline)}>{p.outline.paths.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(235,240,230,.22)" strokeWidth={1} vectorEffect="non-scaling-stroke" />)}</g> : null}
        </g>
        {dots.map((q, i) => {
          const at = p.dotsFrom + ((p.dotsTo - p.dotsFrom) * i) / Math.max(1, dots.length), a = clamp01((f - at) / 3);
          if (a <= 0) return null;
          const pop = 1 + 0.5 * (1 - clamp01((f - at) / 6));
          return <circle key={i} cx={q.x} cy={q.y} r={5 * (0.6 + 0.4 * a) * pop} fill="#fff" opacity={a} style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,.95)) drop-shadow(0 0 10px rgba(255,255,255,.5))" }} />;
        })}
      </svg>
    </AbsoluteFill>
  );
  const bx = p.box;
  let callout: React.ReactNode = null;
  if (bx) {
    const tp = toPlane(bx.lon, bx.lat), Pt = project(tp.x, tp.y);
    const elbow = { x: Pt.x + (bx.dx ?? 150), y: Pt.y + (bx.dy ?? -130) };
    const cap = p.cap ?? 40, fsB = capFs("inter", cap);
    const text = bx.words.map((w) => w.t).join(" ");
    const box = { w: Math.round(measure(text, `700 ${fsB}px ${FONT.inter}`) + 56), h: 88 };
    const bxX = elbow.x + 18, by = elbow.y - box.h / 2;
    const lineP = EZ.out3((f - bx.lineAt) / 9), wipe = EZ.out3((f - (bx.lineAt + 9)) / 6);
    const seg1 = Math.hypot(elbow.x - Pt.x, elbow.y - Pt.y), seg2 = bxX - elbow.x;
    const drawn = lineP * (seg1 + Math.max(0, seg2));
    callout = (
      <>
        <MBlur on={f >= bx.lineAt && f < bx.lineAt + 16}>
          <AbsoluteFill>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
              {lineP > 0 ? (
                <g style={{ filter: "drop-shadow(0 0 6px rgba(255,26,26,.8))" }}>
                  <polyline fill="none" stroke={RC.lineRed} strokeWidth={3}
                    points={drawn <= seg1 ? `${Pt.x},${Pt.y} ${lerp(Pt.x, elbow.x, drawn / seg1)},${lerp(Pt.y, elbow.y, drawn / seg1)}` : `${Pt.x},${Pt.y} ${elbow.x},${elbow.y} ${elbow.x + (drawn - seg1)},${elbow.y}`} />
                  {wipe > 0 ? <rect x={bxX} y={by} width={box.w * wipe} height={box.h} fill={CHIP_TONE.light.fill} stroke={RC.lineRed} strokeWidth={3} /> : null}
                </g>
              ) : null}
            </svg>
          </AbsoluteFill>
        </MBlur>
        <div style={{ position: "absolute", left: bxX + 26, top: by, height: box.h, display: "flex", alignItems: "center", fontFamily: FONT.inter, fontWeight: 700, fontSize: fsB, color: CHIP_TONE.light.text, textShadow: CHIP_TONE.light.shadow, whiteSpace: "pre" }}>
          {bx.words.map((w, i) => <span key={i} style={{ opacity: f >= w.at && wipe >= 1 ? 1 : 0 }}>{(i ? " " : "") + w.t}</span>)}
        </div>
      </>
    );
  }
  let label: React.ReactNode = null;
  if (p.label && f >= p.label.at) {
    const q = toPlane(p.label.lon, p.label.lat), L = project(q.x, q.y);
    label = <div style={{ position: "absolute", left: L.x - 300, width: 600, top: L.y - 30, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: capFs("inter", p.labelCap ?? 30), color: "#F4F4F4", textShadow: "0 2px 6px rgba(0,0,0,.8)", opacity: clamp01((f - p.label.at) / 6) }}>{p.label.t}</div>;
  }
  return (
    <AbsoluteFill style={{ opacity: fade, background: "#0C131D" }}>
      {plane}
      {callout}
      {label}
      {p.credit ? <div style={{ position: "absolute", right: 56, bottom: 44, fontFamily: FONT.inter, fontWeight: 500, fontSize: capFs("inter", p.subCap ?? 28), color: "rgba(255,255,255,.62)", textShadow: "0 2px 6px rgba(0,0,0,.8)" }}>{p.credit}</div> : null}
    </AbsoluteFill>
  );
};

export const DOT_MAP_DEMO: DotMap3DProps = {
  imagery: DEMO_BM,
  outline: DEMO_COUNTRY,
  centre: { lon: 121.0, lat: 23.85 },
  pxPerDeg: 295,
  tilt: 42, rot0: 8, rotPerS: -4.4, dissolve: 25,
  points: [
    { lon: 121.52, lat: 25.05, n: 10 }, { lon: 121.47, lat: 25.01, n: 8 }, { lon: 121.74, lat: 25.13, n: 2 }, { lon: 121.3, lat: 24.99, n: 6 }, { lon: 120.97, lat: 24.8, n: 4 },
    { lon: 120.68, lat: 24.15, n: 6 }, { lon: 120.45, lat: 23.48, n: 2 }, { lon: 120.21, lat: 22.99, n: 4 }, { lon: 120.31, lat: 22.63, n: 5 }, { lon: 121.6, lat: 23.98, n: 1 }, { lon: 121.15, lat: 22.76, n: 1 },
  ],
  origin: { lon: 121.39, lat: 25.15 },
  dotsFrom: 30, dotsTo: 95,
  box: { lon: 121.47, lat: 25.03, lineAt: 58, words: [{ t: "50+", at: 73 }, { t: "sites", at: 82 }] },
  label: { lon: 120.82, lat: 23.75, t: "Country Name", at: 12 },
  credit: "dots indicative · NASA Blue Marble / Natural Earth",
};
