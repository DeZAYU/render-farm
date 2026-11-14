// diagram / MeasureBracket_A (EDITOR A sibling of MeasureOnSat / MeasureOnPhoto; Amusement Park 2026-10-19). OVERLAY in screen px over a plate.
// REF TEMPLATE_UPGRADES #7 (VV §11 "X2" slide-up, D1 typed "40 minutes", D3 two-tone): leaders drop in 6 f, the dashed red bracket draws OUT
// FROM ITS CENTRE in 14 f (EZ.quick), end ticks 6 f, the value TYPES at 2 f/char (Nunito 900 white) with the unit in Varela Round red; the
// whole overlay rides the plate's camera (pass the same scale/origin as the plate push via `cam`) so it stays registered. SFX: typing_key.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, RoundText, clamp01, fs, lerp } from "../../core";

export type MeasureBracketAProps = {
  a: { x: number; y: number }; b: { x: number; y: number }; // measured points (screen px at cam scale 1)
  offset?: number; // bracket offset perpendicular to a->b (+ = left of a->b)
  at: number; valueAt?: number; value: string; unit: string; out?: number;
  cam?: { push: number; ox: number; oy: number }; // the plate's linear push (per s) and origin, to stay registered
  cap?: number; side?: "left" | "right";
};
const RED = "#E30A10";
export const MeasureBracket_A: React.FC<MeasureBracketAProps> = ({ a, b, offset = 80, at, valueAt, value, unit, out, cam, cap = 96, side = "right" }) => {
  const f = useCurrentFrame();
  const k = f - at; if (k < 0) return null;
  const ex = out === undefined ? 0 : EZ.in2((f - out) / 12);
  if (ex >= 1) return null;
  const s = cam ? 1 + cam.push * (f / 30) : 1;
  const P = (p: { x: number; y: number }) => (cam ? { x: cam.ox + (p.x - cam.ox) * s, y: cam.oy + (p.y - cam.oy) * s } : p);
  const A = P(a), B = P(b);
  const L = Math.hypot(B.x - A.x, B.y - A.y) || 1; const nx = -(B.y - A.y) / L, ny = (B.x - A.x) / L;
  const A2 = { x: A.x + nx * offset, y: A.y + ny * offset }, B2 = { x: B.x + nx * offset, y: B.y + ny * offset };
  const M = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 };
  const lu = EZ.out3(k / 6), bu = EZ.quick(clamp01((k - 4) / 14)), tu = EZ.out3((k - 16) / 6);
  const e1 = { x: lerp(M.x, A2.x, bu), y: lerp(M.y, A2.y, bu) }, e2 = { x: lerp(M.x, B2.x, bu), y: lerp(M.y, B2.y, bu) };
  const vk = f - (valueAt ?? at + 14);
  const shown = vk < 0 ? "" : value.slice(0, Math.min(value.length, Math.floor(vk / 2) + 1));
  const uo = vk < value.length * 2 ? 0 : EZ.out2((vk - value.length * 2) / 8);
  const tx = side === "right" ? M.x + 46 : M.x - 46;
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, pointerEvents: "none" }}>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible", filter: "drop-shadow(0 0 6px rgba(227,10,16,.7)) drop-shadow(0 2px 4px rgba(0,0,0,.6))" }}>
        <line x1={A.x} y1={A.y} x2={lerp(A.x, A2.x, lu)} y2={lerp(A.y, A2.y, lu)} stroke="#F2F2F2" strokeWidth={2} strokeDasharray="6 6" opacity={0.8} />
        <line x1={B.x} y1={B.y} x2={lerp(B.x, B2.x, lu)} y2={lerp(B.y, B2.y, lu)} stroke="#F2F2F2" strokeWidth={2} strokeDasharray="6 6" opacity={0.8} />
        <line x1={e1.x} y1={e1.y} x2={e2.x} y2={e2.y} stroke={RED} strokeWidth={5} strokeDasharray="18 10" />
        {tu > 0 ? [A2, B2].map((p, i) => <line key={i} x1={p.x - ny * 0 - (B.x - A.x) / L * 0 + nx * -22 * tu} y1={p.y + ny * -22 * tu} x2={p.x + nx * 22 * tu} y2={p.y + ny * 22 * tu} stroke={RED} strokeWidth={5} />) : null}
      </svg>
      {shown ? (<>
        <div style={{ position: "absolute", left: side === "right" ? tx - 60 : tx - 520, top: M.y - 110, width: 580, height: 220, opacity: 0.8, background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(0,0,0,.85) 0%, rgba(0,0,0,.4) 60%, rgba(0,0,0,0) 100%)" }} />
        <div style={{ position: "absolute", left: tx, top: M.y, transform: `translate(${side === "right" ? "0" : "-100%"}, -50%)`, display: "flex", alignItems: "baseline", gap: cap * 0.18, whiteSpace: "nowrap" }}>
          <span style={{ fontFamily: FONT.nunito, fontWeight: 900, fontSize: fs("nunito", cap), lineHeight: 1, color: "#FDFDFD", textShadow: "0 4px 14px rgba(0,0,0,.75)" }}>{shown}</span>
          <span style={{ opacity: uo, filter: "drop-shadow(0 0 6px rgba(242,37,34,.65)) drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}><RoundText text={unit} cap={cap * 0.5} colour="#F22522" /></span>
        </div>
      </>) : null}
    </AbsoluteFill>
  );
};
