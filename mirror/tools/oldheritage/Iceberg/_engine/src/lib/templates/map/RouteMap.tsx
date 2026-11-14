// map / RouteMap: an animated route between two places with the distance rolling up. REF Farrell evidence D3 route draw (Google Maps @ 2:57-3:07
// "a more direct-looking route": hard cut, held 2.1 s, the line draws by arc length at near-constant speed (~9 %W/s) with a 10 f ease-out into
// the end, a leading dot, the map pushing +0.47 %/s linear the whole time; the line ends on "shaved off 170 kilometers") + D1 E10 pin
// + D3 E5 stat (white number + red unit) + FA text R9 number roll-up.
// Ours: dark graded satellite instead of Farrell's flat green map, a DD red dashed route with glow, the distance rolls up in step with the
// drawn length and lands with the DD pin at the end; the camera frames the route automatically.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, MapPin, PlateVig, asset, clamp01, fs as capFs } from "../../core";
import { DEMO_BM, DEMO_COUNTRY, PlaceWords, haversine, imageRect, layerTf, wxy, type GeoImage, type GeoLayer, type LonLat, type Word, type WorldProj } from "./shared";

export type RouteMapProps = {
  cap?: number; labelCap?: number; // distance stat cap / end-point label cap (M-024 >= 28)
  imagery: GeoImage;
  outline?: GeoLayer;
  from: LonLat & { label?: Word[]; dx?: number; dy?: number };
  to: LonLat & { label?: Word[]; dx?: number; dy?: number };
  via?: LonLat[]; // waypoints (the line is a smooth Catmull-Rom through them)
  drawAt: number; // local frame the line starts
  drawFrames: number; // draw length (constant speed, last 10 f ease out)
  distance?: { value?: number; unit?: string; decimals?: number; prefix?: string } | false; // value omitted = great-circle length of the route; false = no distance stat (unverified number)
  pad?: number; // framing padding (fraction of the frame)
  pushPerS?: number; // linear map push (Farrell +0.47 %/s)
  dashed?: boolean;
  colour?: string;
};

const catmull = (pts: { x: number; y: number }[], n = 24) => {
  if (pts.length < 3) return Array.from({ length: n + 1 }, (_, i) => ({ x: pts[0].x + ((pts[1].x - pts[0].x) * i) / n, y: pts[0].y + ((pts[1].y - pts[0].y) * i) / n }));
  const out: { x: number; y: number }[] = [];
  for (let s = 0; s < pts.length - 1; s++) {
    const p0 = pts[Math.max(0, s - 1)], p1 = pts[s], p2 = pts[s + 1], p3 = pts[Math.min(pts.length - 1, s + 2)];
    for (let i = 0; i < n; i++) {
      const t = i / n, t2 = t * t, t3 = t2 * t;
      const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
      out.push({ x: c(p0.x, p1.x, p2.x, p3.x), y: c(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  out.push(pts[pts.length - 1]);
  return out;
};

export const RouteMap: React.FC<RouteMapProps> = (p) => {
  const f = useCurrentFrame();
  const midLat = (p.from.lat + p.to.lat) / 2;
  const P: WorldProj = { lon0: 0, lat0: 90, k: Math.cos((midLat * Math.PI) / 180), u: 100 };
  const geo = [p.from, ...(p.via ?? []), p.to];
  const wpts = geo.map((g) => wxy(P, g.lon, g.lat));
  // framing: fit the route's bbox with padding, keep 16:9
  const xs = wpts.map((q) => q.x), ys = wpts.map((q) => q.y);
  const bx0 = Math.min(...xs), bx1 = Math.max(...xs), by0 = Math.min(...ys), by1 = Math.max(...ys);
  const pad = p.pad ?? 0.26;
  const s0 = Math.min((W * (1 - 2 * pad)) / Math.max(1, bx1 - bx0), (H * (1 - 2 * pad)) / Math.max(1, by1 - by0));
  const s = s0 * (1 + (p.pushPerS ?? 0.0047) * (Math.max(0, f) / 30));
  const cx = (bx0 + bx1) / 2, cy = (by0 + by1) / 2;
  const sc = (q: { x: number; y: number }) => ({ x: (q.x - cx) * s + W / 2, y: (q.y - cy) * s + H / 2 });
  const curve = catmull(wpts).map(sc);
  const cum = [0];
  for (let i = 1; i < curve.length; i++) cum.push(cum[i - 1] + Math.hypot(curve[i].x - curve[i - 1].x, curve[i].y - curve[i - 1].y));
  const total = cum[cum.length - 1];
  // constant speed, last 10 f eased out (Farrell D3)
  const k = f - p.drawAt, D = p.drawFrames, E = Math.min(10, D * 0.3);
  const vLin = 1 / (D - E / 2); // constant speed, then a linear velocity decay to 0 over E frames (out2 position)
  const prog = k <= 0 ? 0 : k < D - E ? vLin * k : clamp01(vLin * (D - E) + ((vLin * E) / 2) * EZ.out2((k - (D - E)) / E));
  const len = prog * total;
  let hi = 0;
  while (hi < cum.length - 1 && cum[hi + 1] < len) hi++;
  const segU = hi < cum.length - 1 ? (len - cum[hi]) / Math.max(1e-6, cum[hi + 1] - cum[hi]) : 1;
  const head = hi < curve.length - 1 ? { x: curve[hi].x + (curve[hi + 1].x - curve[hi].x) * segU, y: curve[hi].y + (curve[hi + 1].y - curve[hi].y) * segU } : curve[curve.length - 1];
  const drawn = [...curve.slice(0, hi + 1), head];
  const dPath = (pts: { x: number; y: number }[]) => pts.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const col = p.colour ?? RC.lineRed;
  const A = sc(wpts[0]), B = sc(wpts[wpts.length - 1]);
  const ir = imageRect(P, p.imagery);
  const done = prog >= 0.999;
  // distance
  const DST = p.distance || undefined;
  const kmTotal = DST?.value ?? (() => { let d = 0; for (let i = 1; i < geo.length; i++) d += haversine(geo[i - 1], geo[i]); return d; })();
  const dec = DST?.decimals ?? 0;
  const shown = (kmTotal * prog).toFixed(dec);
  const mid = curve[Math.floor(curve.length / 2)], mid2 = curve[Math.floor(curve.length / 2) + 1];
  const nx = -(mid2.y - mid.y), ny = mid2.x - mid.x, nl = Math.hypot(nx, ny) || 1;
  const side = ny / nl < 0 ? 1 : -1; // put the stat on the upper side of the line
  const statPos = { x: mid.x + (nx / nl) * 60 * side, y: mid.y + (ny / nl) * 60 * side };
  const statO = clamp01((k - 2) / 6);
  const capN = p.cap ?? 54;
  return (
    <AbsoluteFill style={{ background: "#05080B", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${s.toFixed(6)}) translate(${-cx} ${-cy})`}>
          <image href={asset(p.imagery.src)} x={ir.x} y={ir.y} width={ir.w} height={ir.h} preserveAspectRatio="none" style={{ filter: "brightness(.85) saturate(.75) contrast(1.08)" }} />
          {p.outline ? <g transform={layerTf(P, p.outline)}>{p.outline.paths.map((d, i) => <path key={i} d={d} fill="none" stroke="rgba(235,240,230,.28)" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />)}</g> : null}
        </g>
      </svg>
      <PlateVig k={0.66} tint="0,0,0" inner={44} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* start point: white ring */}
        <g opacity={clamp01((f - p.drawAt + 12) / 6)}>
          <circle cx={A.x} cy={A.y} r={11} fill="none" stroke="#fff" strokeWidth={4} style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.8))" }} />
          <circle cx={A.x} cy={A.y} r={4} fill="#fff" />
        </g>
        {len > 0 ? (
          <g style={{ filter: `drop-shadow(0 0 6px ${col}) drop-shadow(0 0 14px rgba(255,26,26,.45))` }}>
            <path d={dPath(drawn)} fill="none" stroke={col} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={p.dashed === false ? undefined : "18 14"} />
            {!done ? <circle cx={head.x} cy={head.y} r={9} fill="#fff" stroke={col} strokeWidth={3} /> : null}
          </g>
        ) : null}
      </svg>
      <MapPin k={k - D + 4} x={B.x} y={B.y - 24} size={1.1} />
      {p.from.label ? <PlaceWords f={f} words={p.from.label} cap={p.labelCap ?? 40} x={A.x + (p.from.dx ?? 30)} y={A.y + (p.from.dy ?? 4)} /> : null}
      {p.to.label ? <PlaceWords f={f} words={p.to.label} cap={p.labelCap ?? 40} x={B.x + (p.to.dx ?? 30)} y={B.y + (p.to.dy ?? -20)} /> : null}
      {k >= 0 && p.distance !== false ? (
        <div style={{ position: "absolute", left: statPos.x < mid.x ? statPos.x - 900 : statPos.x, width: 900, top: statPos.y, transform: `translateY(-50%) translateY(${(8 * (1 - EZ.out3(k / 15))).toFixed(1)}px)`, display: "flex", justifyContent: statPos.x < mid.x ? "flex-end" : "flex-start", alignItems: "baseline", gap: 14, opacity: statO }}>
          <span style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", capN), color: "#F2F2F2", fontVariantNumeric: "tabular-nums", textShadow: "0 4px 10px rgba(0,0,0,.7)" }}>{(DST?.prefix ?? "") + Number(shown).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec })}</span>
          <span style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: capFs("inter", capN), color: RC.ringRed, textShadow: "0 0 14px rgba(227,10,16,.55), 0 4px 10px rgba(0,0,0,.6)" }}>{DST?.unit ?? "km"}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

export const ROUTE_DEMO: RouteMapProps = {
  imagery: DEMO_BM,
  outline: DEMO_COUNTRY,
  from: { lon: 121.39, lat: 25.13, label: [{ t: "Harbour", at: 4 }, { t: "District", at: 9, red: true }] },
  to: { lon: 120.3, lat: 22.65, label: [{ t: "City", at: 100 }, { t: "Name", at: 104, red: true }] },
  via: [{ lon: 121.05, lat: 24.75 }, { lon: 120.62, lat: 24.1 }, { lon: 120.25, lat: 23.2 }],
  drawAt: 24, drawFrames: 78,
  distance: { unit: "km", prefix: "~" },
  pad: 0.2,
};
