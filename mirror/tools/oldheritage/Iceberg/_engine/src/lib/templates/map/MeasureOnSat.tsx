// map / MeasureOnSat (set dash2, Dashcam "INSTRUMENT" H9): a dashed measuring bracket across a real satellite / aerial still.
// REF VisualVenture §11 world infographic @3:28.0 (a dashed bracket + leader lines on the world plane; the value "X2" slides up in 0.5 s on
// "twice", +0.0 s; camera phase C position bezier(0.242,-0.22,0,1.144), zoom bezier(0.242,0,0,1)) + Dashcam Vol.1 E10 satellite @0:04.8 +
// Dashcam Vol.1 E4 typed stamp @2:27.5 (2 f/char) + Abyssal E2 typed date @0:42.62 (block cursor, blink 0.5 s).
// Ours: the leaders drop from the two points (6 f), the dashed bracket draws out from its centre (12 f, eased), then the value TYPES at 2 f/char
// on its spoken word with the accent block cursor, while the camera makes a VV phase-C push onto the bracket. Units + decimals are props.
// SFX: typing_key per character (SI T1 rule; the bracket itself is silent).
import React from "react";
import { AbsoluteFill, Easing, Img, useCurrentFrame } from "remotion";
import { WATERPARK, EZ, H, PlateVig, W, asset, clamp01, drift, lerp, lerpLog, measure, type Theme } from "../../core";
import { themeFs } from "../lookhere/dash2kit";

type P2 = { x: number; y: number };
export type MeasureOnSatProps = {
  src: string; srcW?: number; srcH?: number; grade?: string;
  a: P2; b: P2; // the two measured points (still px)
  offset?: number; // bracket offset from the a-b line, still px (+ = left of a->b)
  at: number; // leaders + bracket start
  valueAt: number; // the spoken number: typing starts here
  value: number; decimals?: number; unit?: string; prefix?: string; // e.g. 940, 0, " m", "~"
  cap?: number; // value cap height (primary >= 40)
  cam0?: { cx: number; cy: number; s: number }; push?: { s: number; d?: number; at?: number }; // phase-C push (default on valueAt)
  driftPerS?: number;
  outAt?: number;
  theme?: Theme;
};

const posC = (() => { const e = Easing.bezier(0.242, -0.22, 0, 1.144); return (x: number) => e(clamp01(x)); })();

export const MeasureOnSat: React.FC<MeasureOnSatProps> = ({
  src, srcW = 1920, srcH = 1080, grade = "brightness(.66) saturate(.6) contrast(1.12)", a, b, offset = 70, at, valueAt, value, decimals = 0, unit = " m", prefix = "",
  cap = 56, cam0, push, driftPerS = 0.005, outAt, theme = WATERPARK,
}) => {
  const f = useCurrentFrame();
  // geometry (still px)
  const dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
  const nx = dy / L, ny = -dx / L; // left normal of a->b (screen y down)
  const A2 = { x: a.x + nx * offset, y: a.y + ny * offset }, B2 = { x: b.x + nx * offset, y: b.y + ny * offset };
  const M = { x: (A2.x + B2.x) / 2, y: (A2.y + B2.y) / 2 };
  // camera: start framing the bracket, phase-C push onto its centre
  const c0 = cam0 ?? { cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, s: 1 };
  const pAt = push?.at ?? valueAt, pD = push?.d ?? 30, pS = push?.s ?? c0.s * 1.18;
  const u = (f - pAt) / pD;
  const cx = lerp(c0.cx, M.x, posC(u)), cy = lerp(c0.cy, M.y, posC(u));
  const s = lerpLog(c0.s, pS, EZ.settle(u)) * drift(f, driftPerS);
  const map = (p: P2): P2 => ({ x: W / 2 + (p.x - cx) * s, y: H / 2 + (p.y - cy) * s });
  const sa = map(a), sb = map(b), sA2 = map(A2), sB2 = map(B2), sM = map(M);
  // draw progress
  const k = f - at;
  const lead = EZ.out2(k / 6), br = EZ.out3((k - 4) / 12);
  const o = outAt === undefined ? 1 : 1 - EZ.out2((f - outAt) / 8);
  const half = { x: (sB2.x - sA2.x) / 2, y: (sB2.y - sA2.y) / 2 };
  const e1 = { x: sM.x - half.x * br, y: sM.y - half.y * br }, e2 = { x: sM.x + half.x * br, y: sM.y + half.y * br };
  const tick = 16; // bracket end ticks (screen px) along the normal
  // typed value: 2 f/char
  const txt = prefix + value.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + unit;
  const kv = f - valueAt;
  const nChar = kv < 0 ? 0 : Math.min(txt.length, Math.floor(kv / 2) + 1);
  const typing = kv >= 0 && nChar < txt.length;
  const cursorOn = kv >= 0 && (typing || Math.floor((kv - txt.length * 2) / 15) % 2 === 0) && (kv < txt.length * 2 + 60);
  const shown = txt.slice(0, nChar);
  const numPart = shown.slice(0, Math.min(shown.length, prefix.length + (txt.length - prefix.length - unit.length)));
  const unitPart = shown.slice(numPart.length);
  const fsz = themeFs(theme.num.face, cap);
  // the value sits on the OUTER side of the bracket (away from the measured line), left-anchored at its final width so it never re-centres
  const wFull = measure(txt, `${theme.num.weight} ${fsz}px "${theme.num.face}"`) + cap * 0.74;
  const sg = Math.sign(offset || 1), dist = cap * 0.95 + Math.abs(nx) * wFull * 0.5;
  const lab = { x: sM.x + nx * sg * dist - wFull / 2, y: sM.y + ny * sg * dist };
  const dash = "14 10";
  return (
    <AbsoluteFill style={{ background: "#05080B", overflow: "hidden" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${s.toFixed(5)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
        <Img src={asset(src)} style={{ position: "absolute", left: 0, top: 0, width: srcW, height: srcH, filter: grade }} />
      </AbsoluteFill>
      <PlateVig k={0.5} tint="0,0,0" inner={50} />
      {k >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: o }}>
          <g style={{ filter: `drop-shadow(0 0 5px ${theme.accentGlow}) drop-shadow(0 2px 3px rgba(0,0,0,.7))` }}>
            {/* end points */}
            {[sa, sb].map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={7 * lead} fill={theme.neutral} />)}
            {/* dashed leaders from the points to the bracket */}
            <line x1={sa.x} y1={sa.y} x2={lerp(sa.x, sA2.x, lead)} y2={lerp(sa.y, sA2.y, lead)} stroke={theme.neutral} strokeWidth={2.5} strokeDasharray="6 6" />
            <line x1={sb.x} y1={sb.y} x2={lerp(sb.x, sB2.x, lead)} y2={lerp(sb.y, sB2.y, lead)} stroke={theme.neutral} strokeWidth={2.5} strokeDasharray="6 6" />
            {/* the bracket: dashed, drawn out from its centre, with end ticks */}
            {br > 0 ? (
              <>
                {/* two halves from the centre outward, so the dash pattern stays anchored while it draws */}
                {[e1, e2].map((e, i) => <line key={i} x1={sM.x} y1={sM.y} x2={e.x} y2={e.y} stroke={theme.accent} strokeWidth={5} strokeDasharray={dash} strokeLinecap="round" />)}
                {k >= 14 ? [sA2, sB2].map((p, i) => { const tu = EZ.out2((k - 14) / 6); return <line key={i} x1={p.x - nx * tick * tu} y1={p.y - ny * tick * tu} x2={p.x + nx * tick * tu} y2={p.y + ny * tick * tu} stroke={theme.accent} strokeWidth={5} strokeLinecap="round" />; }) : null}
              </>
            ) : null}
          </g>
        </svg>
      ) : null}
      {kv >= 0 ? (
        <div style={{ position: "absolute", left: lab.x, top: lab.y, transform: "translateY(-50%)", opacity: o, whiteSpace: "pre", display: "flex", alignItems: "center",
          fontFamily: theme.num.face, fontWeight: theme.num.weight, fontSize: fsz, lineHeight: 1, fontVariantNumeric: "tabular-nums", textShadow: "0 3px 10px rgba(0,0,0,.85), 0 0 22px rgba(0,0,0,.6)" }}>
          <span style={{ color: theme.neutral }}>{numPart}</span>
          <span style={{ color: theme.accent }}>{unitPart}</span>
          <span style={{ display: "inline-block", width: cap * 0.62, height: cap * 1.05, marginLeft: cap * 0.12, background: theme.accent, opacity: cursorOn ? 1 : 0 }} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
