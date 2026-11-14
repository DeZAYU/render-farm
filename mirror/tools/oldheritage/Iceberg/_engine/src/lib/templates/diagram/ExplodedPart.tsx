// diagram / ExplodedPart (set "midway", Amusement Park "MIDWAY AFTER DARK" ride-mechanics diagram, REFERENCE_SYNTHESIS §I3 AP-1 + §I4 #2).
// REF Farrell FA story explainer (#3/#15/#33: the same object returns and is explained part by part) + Visual Venture §11 world-infographic
// camera phases @3:28.0 (A quick start / long settle, C settle push) + VV §7 tank burst @10:43.0 (hold 1.3 s, x2.98 in 57 f, log
// bezier(0.326,0,0.143,0.807)) + VV §7 colour = meaning.
// Our version: ONE component (bolt, braking plate, carousel column) on its REAL photo. The camera holds 39 f, bursts into the part (log
// tank-burst), the part's pieces (polygons in photo px, cut out of the photo itself) get accent outlines (12 f draw, bez(0.45,0,0.35,1)) and
// separate along `axis` (VV phase A quick-start), the gaps go dark; the crack draws white-hot on "fatigue"; labels/values land on their
// words with a leader. Accent strokes 4-6 px over the graded photo (never white line-art on a dark plate = Waterpark).
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { EZ, H, Media, Vignette, W, camAt, clamp01, lerp } from "../../core";
import { fsFace, pickAccent } from "../../core/kits/led";
import { WATERPARK, type Theme } from "../../core/themes";

const DRAW = Easing.bezier(0.45, 0, 0.35, 1);
type Pt = [number, number];
export type PartPiece = { poly: Pt[]; shift: number }; // shift = multiples of `spread` along the axis (0 = stays)
export type PartLabel = { text: string; at: number; x: number; y: number; dx: number; dy: number; piece?: number; value?: string; valueAt?: number };
export type ExplodedPartProps = {
  photo: string; // real photo of the ride part (still or clip), 1920x1080 cover; coordinates are in these px
  part: { x: number; y: number }; // centre of the component (camera burst target)
  zoom?: number; // burst scale (VV x2.98; keep <= photo resolution allows)
  burstAt?: number; // VV hold 1.3 s = 39 f
  burstDur?: number; // 57
  pieces: PartPiece[];
  axis?: { x: number; y: number }; // separation direction (normalised inside)
  spread?: number; // photo px per shift unit at full separation
  outlineAt?: number; // outlines draw (default explodeAt - 14)
  explodeAt: number; // pieces separate (the noun: "the bolt", "the plate")
  crack?: { pts: Pt[]; at: number; piece?: number }; // draws on "fatigue"
  labels?: PartLabel[];
  stroke?: number; // 5 px on screen
  theme?: Theme;
  fire?: boolean;
};

export const ExplodedPart: React.FC<ExplodedPartProps> = ({
  photo, part, zoom = 2.4, burstAt = 39, burstDur = 57, pieces, axis = { x: 1, y: 0 }, spread = 70, outlineAt, explodeAt, crack, labels = [], stroke = 5, theme = WATERPARK, fire,
}) => {
  const f = useCurrentFrame();
  const acc = pickAccent(theme, fire);
  const glow = fire ? "rgba(255,255,255,.5)" : theme.accentGlow;
  const al = Math.hypot(axis.x, axis.y) || 1;
  const ax = { x: axis.x / al, y: axis.y / al };
  // ---- camera: hold (drift) -> VV tank burst into the part -> VV phase C settle push while the pieces part
  const cam0 = camAt(f, { cx: W / 2, cy: H / 2, s: 1 }, [
    { f: burstAt, d: burstDur, to: { cx: part.x, cy: part.y, s: zoom }, e: EZ.tankBurst },
    { f: explodeAt, d: 80, to: { cx: part.x, cy: part.y, s: zoom * 1.07 }, e: EZ.settle },
  ]);
  const s = cam0.s * Math.exp(0.006 * (f / 30)); // never dead-still (+0.6 %/s)
  const hw = W / (2 * s), hh = H / (2 * s);
  const cx = Math.min(W - hw, Math.max(hw, cam0.cx)), cy = Math.min(H - hh, Math.max(hh, cam0.cy));
  const world = `translate(${W / 2}px, ${H / 2}px) scale(${s.toFixed(5)}) translate(${-cx.toFixed(2)}px, ${-cy.toFixed(2)}px)`;
  const toScr = (p: { x: number; y: number }) => ({ x: W / 2 + (p.x - cx) * s, y: H / 2 + (p.y - cy) * s });
  // ---- separation (VV phase A quick start / long settle) and the dark gap under the moved pieces
  const sep = spread * EZ.quick((f - explodeAt) / 30);
  const off = (shift: number) => ({ x: ax.x * shift * sep, y: ax.y * shift * sep });
  const gap = EZ.out2((f - explodeAt) / 12);
  const oAt = outlineAt ?? explodeAt - 14;
  // FIX 2026-10-19 (review #5 / M-065): outlines + crack are drawn in SCREEN space as CLOSED polygons with the dash measured in screen px,
  // so the draw always completes; the pieces share the photo's grade, cast a soft shadow (filter on a wrapper, never on the clipped node)
  // and carry a lit bevel + inner rim highlight, and the slots they leave go dark, so they read as parts of the object, not thumbnails.
  const clip = (poly: Pt[]) => `polygon(${poly.map(([x, y]) => `${x}px ${y}px`).join(",")})`;
  const scrPts = (poly: Pt[], o: { x: number; y: number }) => poly.map(([x, y]) => toScr({ x: x + o.x, y: y + o.y }));
  const ptsStr = (pts: { x: number; y: number }[]) => pts.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ");
  const perim = (pts: { x: number; y: number }[], closed: boolean) => {
    let L = 0;
    for (let i = 0; i < pts.length - (closed ? 0 : 1); i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; L += Math.hypot(b.x - a.x, b.y - a.y); }
    return L;
  };
  const shrink = (pts: { x: number; y: number }[], px: number) => {
    const c = pts.reduce((acc, q) => ({ x: acc.x + q.x / pts.length, y: acc.y + q.y / pts.length }), { x: 0, y: 0 });
    return pts.map((q) => { const d = Math.hypot(q.x - c.x, q.y - c.y) || 1; const k = Math.max(0, d - px) / d; return { x: c.x + (q.x - c.x) * k, y: c.y + (q.y - c.y) * k }; });
  };
  const crackOff = crack && crack.piece !== undefined && pieces[crack.piece] ? off(pieces[crack.piece].shift) : { x: 0, y: 0 };
  const crackP = crack ? DRAW(clamp01((f - crack.at) / 10)) : 0;
  const lab = fsFace(theme.title.face, 40);
  const grade = "contrast(1.06) saturate(.92)"; // one grade for the photo and its pieces
  const sh = (len: number) => (len / s).toFixed(2); // screen px -> world px (pieces live in world space)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* the photo (dims + softens a little where the pieces left; the pieces stay the lit subject) */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: world,
        filter: `${grade}${gap > 0 ? ` brightness(${lerp(1, 0.66, gap).toFixed(3)}) blur(${sh(2.2 * gap)}px)` : ""}` }}>
        <Media src={photo} />
        {/* the empty slots the moved pieces leave: dark cavities with soft edges */}
        {gap > 0 ? (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
            {pieces.map((pc, i) => pc.shift === 0 ? null : (
              <polygon key={i} points={pc.poly.map(([x, y]) => `${x},${y}`).join(" ")} fill="rgb(8,3,6)" opacity={0.88 * gap} style={{ filter: `blur(${sh(1.5)}px)` }} />
            ))}
          </svg>
        ) : null}
      </div>
      {/* the pieces: the photo itself, cut by each polygon, moved along the axis; shadow on the wrapper, bevel light inside the clip */}
      {gap > 0 ? pieces.map((pc, i) => {
        const o = off(pc.shift);
        const lift = gap * (pc.shift === 0 ? 0.6 : 1);
        const xs = pc.poly.map((q) => q[0]), ys = pc.poly.map((q) => q[1]);
        const bb = { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) };
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0", transform: world }}>
            <div style={{ position: "absolute", inset: 0, transform: `translate(${o.x.toFixed(2)}px, ${o.y.toFixed(2)}px)`,
              filter: `drop-shadow(${sh(-6 * ax.x * lift)}px ${sh(10 * lift)}px ${sh(14)}px rgba(0,0,0,${(0.7 * lift).toFixed(2)})) drop-shadow(0 0 ${sh(2)}px rgba(0,0,0,.5))` }}>
              <div style={{ position: "absolute", inset: 0, clipPath: clip(pc.poly), filter: `${grade} brightness(${lerp(1, 0.9, lift).toFixed(3)})` }}>
                <Media src={photo} />
                <div style={{ position: "absolute", left: bb.x, top: bb.y, width: bb.w, height: bb.h, opacity: lift, background: "linear-gradient(160deg, rgba(255,250,252,.22) 0%, rgba(255,250,252,0) 42%, rgba(0,0,0,0) 60%, rgba(10,3,7,.32) 100%)" }} />
              </div>
            </div>
          </div>
        );
      }) : null}
      <Vignette opacity={0.8} />
      {/* outlines + crack, SCREEN space, closed polygons, dash = measured screen perimeter */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        {pieces.map((pc, i) => {
          const p = DRAW(clamp01((f - oAt - 2 * i) / 12));
          if (p <= 0) return null;
          const pts = scrPts(pc.poly, off(pc.shift));
          const L = perim(pts, true);
          const dash = p >= 1 ? undefined : `${(p * L).toFixed(1)} ${(L + 20).toFixed(1)}`;
          const rim = gap > 0 ? shrink(pts, stroke * 0.5 + 3) : null;
          return (
            <g key={i}>
              <polygon points={ptsStr(pts)} strokeDasharray={dash} fill="none" stroke="rgba(20,0,10,.55)" strokeWidth={stroke + 5} strokeLinejoin="round" />
              {rim ? <polygon points={ptsStr(rim)} fill="none" stroke="rgba(255,248,252,.55)" strokeWidth={1.6} strokeLinejoin="round" opacity={gap} /> : null}
              <polygon points={ptsStr(pts)} strokeDasharray={dash} fill="none" stroke={acc} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 4px ${glow}) drop-shadow(0 0 12px ${glow})` }} />
            </g>
          );
        })}
        {crack && crackP > 0 ? (() => {
          const pts = scrPts(crack.pts, crackOff);
          const L = perim(pts, false);
          return (
            <polyline points={ptsStr(pts)} strokeDasharray={crackP >= 1 ? undefined : `${(crackP * L).toFixed(1)} ${(L + 20).toFixed(1)}`} fill="none" stroke="#FFFFFF" strokeWidth={4}
              strokeLinejoin="miter" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 3px #fff) drop-shadow(0 0 10px ${glow}) drop-shadow(0 0 22px ${glow})` }} />
          );
        })() : null}
      </svg>
      {/* labels: leader draws 6 f from the anchor, words rise 8 px / alpha 8 f, value lands on its own word */}
      {labels.map((l, i) => {
        const k = f - l.at;
        if (k < 0) return null;
        const o = l.piece !== undefined && pieces[l.piece] ? off(pieces[l.piece].shift) : { x: 0, y: 0 };
        const a = toScr({ x: l.x + o.x, y: l.y + o.y });
        const b = { x: a.x + l.dx, y: a.y + l.dy };
        const lk = EZ.out2(k / 6);
        const tk = EZ.out3((k - 3) / 8);
        const vk = l.value ? EZ.out3((f - (l.valueAt ?? l.at + 6)) / 8) : 0;
        const right = l.dx >= 0;
        return (
          <React.Fragment key={i}>
            <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              <line x1={a.x} y1={a.y} x2={lerp(a.x, b.x, lk)} y2={lerp(a.y, b.y, lk)} stroke={acc} strokeWidth={4} strokeLinecap="round" style={{ filter: `drop-shadow(0 0 6px ${glow})` }} />
              <circle cx={a.x} cy={a.y} r={7 * lk} fill={acc} />
            </svg>
            <div style={{ position: "absolute", left: b.x, top: b.y, transform: `translate(${right ? "12px" : "calc(-100% - 12px)"}, -50%) translateY(${(8 * (1 - tk)).toFixed(2)}px)`, opacity: tk,
              display: "flex", alignItems: "baseline", gap: lab * 0.3, whiteSpace: "nowrap", fontFamily: theme.title.face, fontWeight: theme.title.weight, fontSize: lab, lineHeight: 1, textShadow: "0 3px 10px rgba(0,0,0,.75)" }}>
              <span style={{ color: theme.neutral }}>{l.text.toUpperCase()}</span>
              {l.value ? <span style={{ color: acc, opacity: vk, textShadow: `0 0 14px ${glow}, 0 3px 10px rgba(0,0,0,.7)` }}>{l.value.toUpperCase()}</span> : null}
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
