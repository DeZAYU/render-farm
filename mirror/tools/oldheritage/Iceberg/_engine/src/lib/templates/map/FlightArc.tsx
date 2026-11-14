// map / FlightArc: arcs fly between places on a dark outline map: several origins INTO one dot (people travelling in), or one source OUT to
// several nodes (letters sent) that can later grey out ("NO REPLY"). Each arc launches on its word with a bright comet head and leaves a glowing
// trail; labels land at the arc's end. REF VV §11 world camera (Visual Venture TV @ 3:28.0: one plane, quick-start / long-settle framing) +
// FA evidence E1 (Instagram @ 2:47.5: one element per noun) + D1 E10 pin language for the hub.
// Zoo 2026-10-18: optional `imagery` (georeferenced satellite still under the arcs, c19 Chester).
// Ours: lifted great-circle-style arcs (height grows with distance), comet heads, the grey-out state, the camera frames every place automatically.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, clamp01, fs as capFs } from "../../core";
import { imageRect, layerTf, wxy, type GeoImage, type GeoLayer, type LonLat, type WorldProj } from "../../core/kits/geo";
import { asset } from "../../core";
import { DEMO_REGION } from "./shared";

export type FlightArcProps = {
  layers?: GeoLayer[]; // outline map
  /** optional georeferenced satellite still under the outlines (graded dark Blue Marble / Esri crop); M-050: satellite, not hand-drawn coasts */
  imagery?: GeoImage;
  imageryOpacity?: number;
  hub: LonLat & { label?: string; at: number };
  arcs: (LonLat & { at: number; frames?: number; label?: string; sub?: string; dir?: "in" | "out"; greyAt?: number; greyLabel?: string; colour?: string })[];
  pad?: number;
  pushPerS?: number;
  /** cap height (px at 1080p) of the origin labels; hub = x1.25, sub lines = max(28, x0.85). Default 34 (M-024: every label >= 28 px cap) */
  labelCap?: number;
};

export const FlightArc: React.FC<FlightArcProps> = (p) => {
  const f = useCurrentFrame();
  const all = [p.hub, ...p.arcs];
  const lat0 = all.reduce((a, q) => a + q.lat, 0) / all.length;
  const P: WorldProj = { lon0: 0, lat0: 90, k: Math.cos((lat0 * Math.PI) / 180), u: 100 };
  const pts = all.map((q) => wxy(P, q.lon, q.lat));
  const xs = pts.map((q) => q.x), ys = pts.map((q) => q.y);
  const pad = p.pad ?? 0.22;
  const s0 = Math.min((W * (1 - 2 * pad)) / Math.max(1, Math.max(...xs) - Math.min(...xs)), (H * (1 - 2 * pad)) / Math.max(1, Math.max(...ys) - Math.min(...ys)));
  const s = s0 * (1 + (p.pushPerS ?? 0.008) * (Math.max(0, f) / 30));
  const cx = (Math.max(...xs) + Math.min(...xs)) / 2, cy = (Math.max(...ys) + Math.min(...ys)) / 2;
  const sc = (q: { x: number; y: number }) => ({ x: (q.x - cx) * s + W / 2, y: (q.y - cy) * s + H / 2 });
  const hub = sc(pts[0]);
  const hk = f - p.hub.at;
  const LC = p.labelCap ?? 34, caps = { big: LC * 1.25, normal: LC, small: Math.max(28, LC * 0.85) };
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, #0B141C 0%, #020406 85%)", overflow: "hidden" }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${s.toFixed(6)}) translate(${-cx} ${-cy})`}>
          {p.imagery ? (() => { const r = imageRect(P, p.imagery); return <image href={asset(p.imagery.src)} x={r.x} y={r.y} width={r.w} height={r.h} preserveAspectRatio="none" opacity={p.imageryOpacity ?? 0.9} />; })() : null}
          {(p.layers ?? []).map((L, i) => (
            <g key={i} transform={layerTf(P, L)}>{L.paths.map((d, j) => <path key={j} d={d} fill="rgba(170,190,205,.07)" stroke="rgba(220,232,240,.5)" strokeWidth={1.3} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />)}</g>
          ))}
        </g>
        {p.arcs.map((a, i) => {
          const k = f - a.at;
          if (k < 0) return null;
          const o = sc(pts[i + 1]);
          const out = a.dir === "out";
          const A = out ? hub : o, B = out ? o : hub;
          const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy) || 1;
          const lift = Math.min(260, L * 0.32);
          const C = { x: (A.x + B.x) / 2 + (dy / L) * lift * (dx > 0 ? -1 : 1), y: (A.y + B.y) / 2 - Math.abs(dx / L) * lift - lift * 0.3 };
          const u = EZ.out3(k / (a.frames ?? 30));
          const q = (t: number) => ({ x: (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x, y: (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y });
          const N = 48, line = Array.from({ length: N + 1 }, (_, j) => q((j / N) * u));
          const grey = a.greyAt !== undefined ? clamp01((f - a.greyAt) / 10) : 0;
          const col = grey > 0.5 ? "#7C8389" : a.colour ?? RC.lineRed;
          const head = line[N];
          const end = out ? B : A;
          return (
            <g key={i}>
              <polyline points={line.map((z) => `${z.x.toFixed(1)},${z.y.toFixed(1)}`).join(" ")} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={grey > 0.5 ? "10 10" : undefined}
                style={{ filter: grey > 0.5 ? undefined : `drop-shadow(0 0 6px ${col}) drop-shadow(0 0 16px rgba(255,26,26,.35))` }} />
              {u < 1 ? <circle cx={head.x} cy={head.y} r={9} fill="#FFFFFF" style={{ filter: `drop-shadow(0 0 10px ${col}) drop-shadow(0 0 4px #fff)` }} /> : null}
              <circle cx={end.x} cy={end.y} r={9} fill={out ? (grey > 0.5 ? "#7C8389" : "#FFFFFF") : "#FFFFFF"} opacity={out ? (u >= 1 ? 1 : 0) : 1} />
            </g>
          );
        })}
        {hk >= 0 ? (
          <g>
            <circle cx={hub.x} cy={hub.y} r={14} fill={RC.lineRed} style={{ filter: `drop-shadow(0 0 10px ${RC.lineRed})` }} />
            <circle cx={hub.x} cy={hub.y} r={14 + 26 * ((hk % 40) / 40)} fill="none" stroke={RC.lineRed} strokeWidth={3} opacity={1 - (hk % 40) / 40} />
          </g>
        ) : null}
      </svg>
      {hk >= 0 && p.hub.label ? <Lbl x={hub.x} y={hub.y + 34} text={p.hub.label} o={EZ.out2(hk / 6)} colour="#FF3B3B" cap={caps.big} /> : null}
      {p.arcs.map((a, i) => {
        const o = sc(pts[i + 1]), k = f - a.at - (a.dir === "out" ? (a.frames ?? 30) * 0.8 : 4);
        if (!a.label || k < 0) return null;
        const grey = a.greyAt !== undefined && f >= a.greyAt;
        return (
          <React.Fragment key={i}>
            <Lbl x={o.x} y={o.y + 24} text={a.label} o={EZ.out2(k / 6)} colour={grey ? "#8A9096" : "#F4F6F6"} cap={caps.normal} />
            {a.sub ? <Lbl x={o.x} y={o.y + 24 + caps.normal * 1.55} text={a.sub} o={EZ.out2((k - 4) / 6)} colour="#C2C9CE" cap={caps.small} small /> : null}
            {grey ? <Lbl x={o.x} y={o.y - 24 - caps.small * 1.6} text={a.greyLabel ?? "NO REPLY"} o={EZ.out2((f - a.greyAt!) / 6)} colour="#A8AEB4" cap={caps.small} small /> : null}
          </React.Fragment>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
const Lbl: React.FC<{ x: number; y: number; text: string; o: number; colour: string; cap: number; small?: boolean }> = ({ x, y, text, o, colour, cap, small }) => (
  <div style={{ position: "absolute", left: x - 450, width: 900, top: y, textAlign: "center", fontFamily: FONT.inter, fontWeight: small ? 500 : 700, fontSize: capFs("inter", cap),
    letterSpacing: small ? "0.02em" : "0.06em", color: colour, opacity: o, textShadow: "0 2px 8px rgba(0,0,0,.9)", whiteSpace: "nowrap", transform: `translateY(${(6 * (1 - o)).toFixed(1)}px)` }}>{text}</div>
);

export const FLIGHT_DEMO: FlightArcProps = {
  layers: [DEMO_REGION],
  hub: { lon: 121.5, lat: 25.0, label: "CITY NAME", at: 0 },
  arcs: [
    { lon: 104.1, lat: 30.6, at: 12, label: "ORIGIN A", sub: "a family of four" },
    { lon: 113.3, lat: 23.1, at: 38, label: "ORIGIN B", sub: "a local resident" },
    { lon: 126.6, lat: 45.8, at: 64, label: "ORIGIN C", sub: "a visiting athlete", greyAt: 110, greyLabel: "NO REPLY" },
  ],
  pad: 0.2,
};
