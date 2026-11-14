// TOR00 (intro): PinSweep v2 (owner 3 Nov: v1 "too fast, unsmooth"). A tilted 3-D NASA Blue Marble plate of the US (GIBS, public domain,
// house grade) with the state lines. Only a few FEATURED cases: the camera eases (ease-in-out per segment, continuous float values, no
// rounding) to each one, its pin drops with a small spring bounce and its red place + year label sits at the pin on a short white leader,
// holds >= 1.5 s, then fades out completely before the camera moves on. At the end the camera eases wide and the other cases' pins fade in
// softly together as context. Pins/labels use the same projection as the plate's CSS transform, so they stay locked to the ground.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";
import { STATES } from "./TOR00_states";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const MW = 6200, MH = 3000;
export const PX = (lon: number) => (lon + 126) * 100;
export const PY = (lat: number) => (53 - lat) * 100;

export type Pin = { lon: number; lat: number };
export type Feat = { lon: number; lat: number; label: string; drop: number; out: number }; // drop = pin frame; label in at drop+6, gone by out+8
export type CamKey = { f: number; x: number; y: number; s: number };

const camAt = (keys: CamKey[], f: number) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) { const t = ease((f - a.f) / (b.f - a.f)); return { f, x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, s: a.s + (b.s - a.s) * t }; }
  }
  return keys[keys.length - 1];
};

export const PinSweep: React.FC<{ src: string; feats: Feat[]; context: Pin[]; cam: CamKey[]; ctx0: number; ctx1: number }> = ({ src, feats, context, cam, ctx0, ctx1 }) => {
  const f = useCurrentFrame(); const { width, height, fps } = useVideoConfig();
  const P = 1800, TH = (48 * Math.PI) / 180, OX = width / 2, OY = height * 0.58;
  const c = camAt(cam, f);
  const proj = (x: number, y: number) => {
    const sx = c.s * (x - c.x), sy = c.s * (y - c.y), z = sy * Math.sin(TH), k = P / (P - z);
    return [OX + sx * k, OY + sy * Math.cos(TH) * k, k] as const;
  };
  const plate = `perspective(${P}px) rotateX(48deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)`;
  const pinG = (sx: number, sy: number, k: number, lift: number, o: number, key: string, big: boolean) => {
    const H = (big ? 78 : 50) * k, top = sy - H - lift;
    return (
      <g key={key} opacity={o}>
        <ellipse cx={sx + 5} cy={sy + 2} rx={(big ? 14 : 9) * k} ry={(big ? 5 : 3.5) * k} fill="rgba(0,0,0,.6)" />
        <line x1={sx} y1={sy} x2={sx} y2={top + 6} stroke="#fff" strokeWidth={big ? 4 : 2.5} />
        <circle cx={sx} cy={top} r={(big ? 10 : 6) * k} fill={RED} stroke="#fff" strokeWidth={big ? 3 : 2} />
      </g>
    );
  };
  const ctxO = interpolate(f, [ctx0, ctx1], [0, 1], { ...cl, easing: ease });
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <RedLabel text="." at={1e6} />
      <div style={{ position: "absolute", left: OX, top: OY, width: MW, height: MH, transformOrigin: "0 0", transform: plate, willChange: "transform" }}>
        <Img src={staticFile(src)} style={{ position: "absolute", inset: 0, width: MW, height: MH, filter: "brightness(1.45) saturate(.95) contrast(1.05)" }} />
        <svg width={MW} height={MH} style={{ position: "absolute", inset: 0 }}>
          <path d={STATES} fill="none" stroke="rgba(255,255,255,.42)" strokeWidth={5} strokeLinejoin="round" />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(5,5,5,1) 0%, rgba(5,5,5,.8) 8%, rgba(5,5,5,0) 30%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 55%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {ctxO > 0 && context.map((p, i) => { const [sx, sy, k] = proj(PX(p.lon), PY(p.lat)); return pinG(sx, sy, k, 0, ctxO * 0.9, "c" + i, false); })}
        {feats.map((p, i) => {
          if (f < p.drop) return null;
          const sp = spring({ frame: f - p.drop, fps, config: { damping: 10, stiffness: 140, mass: 0.8 } });
          const [sx, sy, k] = proj(PX(p.lon), PY(p.lat));
          return pinG(sx, sy, k, (1 - sp) * 110, Math.min(1, (f - p.drop) / 5), "f" + i, true);
        })}
      </svg>
      {feats.map((p, i) => {
        const a = p.drop + 6; if (f < a || f > p.out + 8) return null;
        const [sx, sy, k] = proj(PX(p.lon), PY(p.lat)); const top = sy - 78 * k;
        const w = interpolate(f, [a, a + 8], [0, 1], { ...cl, easing: Easing.out(Easing.cubic) });
        const o = interpolate(f, [p.out, p.out + 8], [1, 0], { ...cl, easing: ease });
        const lx = sx + 70, ly = top - 64;
        return (
          <React.Fragment key={"l" + i}>
            <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: o }}>
              <line x1={sx + 8} y1={top - 8} x2={sx + 8 + (lx - sx - 8) * w} y2={top - 8 + (ly - top + 8) * w} stroke="#fff" strokeWidth={3} />
            </svg>
            <div style={{ position: "absolute", left: lx, top: ly, transform: "translate(0,-50%)", opacity: o }}>
              <div style={{ background: RED, padding: "7px 15px", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)`, boxShadow: "0 6px 16px rgba(0,0,0,.5)" }}>
                <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 40, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre", textTransform: "uppercase" }}>{p.label}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
