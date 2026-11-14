// diagram / CleanDiagram: a clean labelled node diagram, A -> B with arrows, built on the words. REF Farrell story (IG @ 2:54.0-3:04.8 "a broker
// ... UK clients with surgeons in Turkey": person icon linked to two flag circles, elements build on the words, plane tilts down 2.93 %H/s linear;
// IG @ 2:47.6 white doctor line-icon on black, a red X crosses it) + Farrell evidence rule 10 (one element animates at a time; icons change by
// sliding the whole plane) + FA evidence E1 (white line glyphs, soft glow).
// Ours: nodes are line icons in thin rings with Inter labels, links draw as arrows (optionally dashed, with a small label riding the middle),
// any node can be crossed out in red on its word, and the plane can re-centre on a node (quick-start / long-settle) while it drifts.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, RC, W, EZ, MBlur, camAt, camFast, clamp01, fs as capFs, lerp, type Cam } from "../../core";
import { Glyph } from "../neon/glyphs";
import { toKeys, type CamSpec } from "./kit";

export type CleanNode = { id: string; glyph: string; label?: string; sub?: string; x: number; y: number; at: number; r?: number; accent?: boolean; cross?: number; labelAbove?: boolean };
export type CleanLink = { from: string; to: string; at: number; label?: string; dashed?: boolean; accent?: boolean; bend?: number; frames?: number; both?: boolean };
export type CleanDiagramProps = {
  labelCap?: number; subCap?: number; // node label / sub line + link label caps (M-024 >= 28)
  nodes: CleanNode[]; // world px (1920 x 1080 plane)
  links: CleanLink[];
  cam0?: Cam; cam?: CamSpec[]; // optional re-centring moves
  tiltPerS?: number; // Farrell linear tilt (plane moves up, %H per second)
  pushPerS?: number;
  accent?: string;
  bg?: string;
};

const CleanCaps = React.createContext({ label: 36, sub: 28 });
const NodeG: React.FC<{ n: CleanNode; f: number; accent: string }> = ({ n, f, accent }) => {
  const k = f - n.at;
  if (k < 0) return null;
  const r = n.r ?? 92;
  const o = EZ.out2(k / 7), s = 1.06 - 0.06 * EZ.out3(k / 9);
  const col = n.accent ? accent : "#F4F6F6";
  const ring = 2 * Math.PI * r;
  const ck = n.cross === undefined ? -1 : f - n.cross;
  return (
    <g transform={`translate(${n.x} ${n.y}) scale(${s.toFixed(4)})`} opacity={o}>
      <g style={{ filter: `drop-shadow(0 0 4px ${n.accent ? "rgba(255,40,40,.7)" : "rgba(255,255,255,.55)"}) drop-shadow(0 0 18px ${n.accent ? "rgba(255,20,20,.35)" : "rgba(255,255,255,.18)"})` }}>
        <circle r={r} fill="rgba(255,255,255,.035)" stroke={col} strokeWidth={4} strokeDasharray={`${(ring * EZ.out3(k / 10)).toFixed(1)} ${ring + 2}`} transform="rotate(-90)" />
        <g transform="translate(0 0)"><Glyph name={n.glyph} colour={col} size={r * 1.12} mode="line" lineW={8} /></g>
      </g>
      {ck >= 0 ? (
        <g stroke={RC.lineRed} strokeWidth={13} strokeLinecap="round" opacity={0.9} style={{ filter: "drop-shadow(0 0 6px rgba(255,26,26,.9))" }}>
          <path d={`M${-r * 0.78} ${-r * 0.78} L${lerp(-r * 0.78, r * 0.78, clamp01((ck + 1) / 2))} ${lerp(-r * 0.78, r * 0.78, clamp01((ck + 1) / 2))}`} />
          {ck >= 1 ? <path d={`M${r * 0.78} ${-r * 0.78} L${lerp(r * 0.78, -r * 0.78, clamp01(ck / 2))} ${lerp(-r * 0.78, r * 0.78, clamp01(ck / 2))}`} /> : null}
        </g>
      ) : null}
    </g>
  );
};

const LinkG: React.FC<{ l: CleanLink; a: CleanNode; b: CleanNode; f: number; accent: string }> = ({ l, a, b, f, accent }) => {
  const caps = React.useContext(CleanCaps);
  const k = f - l.at;
  if (k < 0) return null;
  const ra = (a.r ?? 92) + 22, rb = (b.r ?? 92) + 22;
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const p0 = { x: a.x + ux * ra, y: a.y + uy * ra }, p1 = { x: b.x - ux * rb, y: b.y - uy * rb };
  const bend = l.bend ?? 0, m = { x: (p0.x + p1.x) / 2 - uy * bend, y: (p0.y + p1.y) / 2 + ux * bend };
  const u = EZ.out3(k / (l.frames ?? 12));
  // quadratic point + tangent at u
  const q = (t: number) => ({ x: (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * m.x + t * t * p1.x, y: (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * m.y + t * t * p1.y });
  const N = 40, pts = Array.from({ length: N + 1 }, (_, i) => q((i / N) * u));
  const tip = pts[N], pre = pts[N - 1];
  const ang = (Math.atan2(tip.y - pre.y, tip.x - pre.x) * 180) / Math.PI;
  const col = l.accent ? accent : "#E9ECEC";
  const head = (x: number, y: number, deg: number) => <path d="M -22 -14 L 2 0 L -22 14" transform={`translate(${x} ${y}) rotate(${deg})`} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />;
  const mid = q(0.5);
  return (
    <g>
      <g style={{ filter: `drop-shadow(0 0 4px ${l.accent ? "rgba(255,40,40,.7)" : "rgba(255,255,255,.45)"})` }}>
        <polyline points={pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={l.dashed ? "16 14" : undefined} />
        {u > 0.05 ? head(tip.x, tip.y, ang) : null}
        {l.both && u > 0.95 ? head(p0.x, p0.y, (Math.atan2(p0.y - q(0.03).y, p0.x - q(0.03).x) * 180) / Math.PI) : null}
      </g>
      {l.label && u > 0.6 ? (
        <foreignObject x={mid.x - 300} y={mid.y - 30 - 46 - Math.abs(bend) * 0.0} width={600} height={60}>
          <div style={{ width: 600, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: capFs("inter", caps.sub), color: l.accent ? accent : "#BFC6C8", opacity: EZ.out2((u - 0.6) / 0.4) }}>{l.label}</div>
        </foreignObject>
      ) : null}
    </g>
  );
};

const Plane: React.FC<CleanDiagramProps> = (p) => {
  const caps = { label: Math.max(28, p.labelCap ?? 36), sub: Math.max(28, p.subCap ?? 28) };
  const f = useCurrentFrame();
  const accent = p.accent ?? RC.lineRed;
  const c0 = p.cam0 ?? { cx: W / 2, cy: H / 2, s: 1 };
  const cam = camAt(f, c0, toKeys(p.cam ?? []));
  const t = Math.max(0, f) / 30;
  const cy = cam.cy + (p.tiltPerS ?? 0.012) * H * t;
  const s = cam.s * (1 + (p.pushPerS ?? 0.005) * t);
  const byId: Record<string, CleanNode> = {};
  p.nodes.forEach((n) => { byId[n.id] = n; });
  return (
    <AbsoluteFill>
      <CleanCaps.Provider value={caps}><svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g transform={`translate(${W / 2} ${H / 2}) scale(${s.toFixed(5)}) translate(${(-cam.cx).toFixed(2)} ${(-cy).toFixed(2)})`}>
          {p.links.map((l, i) => (byId[l.from] && byId[l.to] ? <LinkG key={i} l={l} a={byId[l.from]} b={byId[l.to]} f={f} accent={accent} /> : null))}
          {p.nodes.map((n) => <NodeG key={n.id} n={n} f={f} accent={accent} />)}
          {p.nodes.map((n) => (n.label && f >= n.at + 3 ? (
            <foreignObject key={`l${n.id}`} x={n.x - 300} y={n.labelAbove ? n.y - (n.r ?? 92) - 22 - 120 : n.y + (n.r ?? 92) + 22} width={600} height={120}>
              <div style={{ width: 600, height: 120, display: "flex", flexDirection: "column", justifyContent: n.labelAbove ? "flex-end" : "flex-start", textAlign: "center", fontFamily: FONT.inter, opacity: EZ.out2((f - n.at - 3) / 7) }}>
                <div style={{ fontWeight: 700, fontSize: capFs("inter", caps.label), color: n.accent ? accent : "#F4F6F6", textShadow: "0 2px 8px rgba(0,0,0,.7)" }}>{n.label}</div>
                {n.sub ? <div style={{ fontWeight: 400, fontSize: capFs("inter", caps.sub), color: "#A9B1B4", margin: "6px 0" }}>{n.sub}</div> : null}
              </div>
            </foreignObject>
          ) : null))}
        </g>
      </svg></CleanCaps.Provider>
    </AbsoluteFill>
  );
};

export const CleanDiagram: React.FC<CleanDiagramProps> = (p) => {
  const f = useCurrentFrame();
  const fast = p.cam ? camFast(f, toKeys(p.cam), 0.05, 0.5) : false;
  return (
    <AbsoluteFill style={{ background: p.bg ?? "radial-gradient(ellipse 75% 70% at 50% 45%, #121719 0%, #050708 80%)" }}>
      <MBlur on={fast}><Plane {...p} /></MBlur>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const CLEAN_DEMO: CleanDiagramProps = {
  nodes: [
    { id: "a", glyph: "person", label: "Organiser", sub: "bought the supplies", x: 500, y: 430, at: 2, r: 112, labelAbove: true },
    { id: "b", glyph: "canister", label: "Contractor", sub: "ran the equipment", x: 1420, y: 430, at: 22, r: 112, labelAbove: true },
    { id: "c", glyph: "extinguisher", label: "Safety check", x: 960, y: 860, at: 64, r: 112, accent: true, cross: 84 },
  ],
  links: [
    { from: "a", to: "b", at: 30, label: "hired", frames: 12 },
    { from: "b", to: "c", at: 56, dashed: true, bend: -50 },
    { from: "a", to: "c", at: 58, dashed: true, bend: 50 },
  ],
  cam0: { cx: 960, cy: 460, s: 1.08 },
  cam: [{ at: 54, d: 34, cx: 960, cy: 600, s: 1.0, ease: "quick" }],
  tiltPerS: 0.008,
};
