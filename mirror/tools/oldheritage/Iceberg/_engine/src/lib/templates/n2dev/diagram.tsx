// n2dev 2D mechanism diagrams (when 3D is overkill): Cutaway (x-ray sweep through a shell), ExplodedPart, ScaleCompare, StructureSection.
// Blueprint look in the channel colours: thin ice lines on navy, ice-cyan for the active part, amber only for the failure point.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { clamp01, lerp } from "../../core";
import { Glyph } from "../../core/kits/glyphs";
import { EI, K, Plate, type PlateP, Svg, Typed, assertDev, envIO, mono, typedN, wide } from "./kit";

type Base = PlateP & { dur: number };
/** blueprint grid plate */
const Grid: React.FC<PlateP> = (p) => (
  <>
    <Plate {...p} dim={p.src ? (p.dim ?? 0.78) : undefined} blur={p.src ? 14 : undefined} />
    <AbsoluteFill style={{ backgroundImage: "linear-gradient(rgba(166,246,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(166,246,255,.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
  </>
);
const Cam: React.FC<{ f: number; dur: number; s?: [number, number]; o?: [number, number]; children: React.ReactNode }> = ({ f, dur, s = [1, 1.06], o = [50, 50], children }) => {
  const z = lerp(s[0], s[1], EI.smooth(f / dur));
  return <AbsoluteFill style={{ willChange: "transform", transform: `scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, transformOrigin: `${o[0]}% ${o[1]}%` }}>{children}</AbsoluteFill>;
};
/** callout: leader from a point to a mono label (types on) */
const Callout: React.FC<{ f: number; at: number; x: number; y: number; lx: number; ly: number; t: string; hot?: boolean }> = ({ f, at, x, y, lx, ly, t, hot }) => {
  const k = EI.cam((f - at) / 12);
  if (k <= 0) return null;
  const c = hot ? K.amber : K.cyan;
  return (
    <>
      <Svg><line x1={x} y1={y} x2={lerp(x, lx, k)} y2={lerp(y, ly, k)} stroke={c} strokeWidth={1.6} /><rect x={x - 4} y={y - 4} width={8} height={8} fill={c} /></Svg>
      <div style={{ position: "absolute", left: lx + (lx >= x ? 10 : -10), top: ly - 14, transform: lx >= x ? undefined : "translateX(-100%)", ...mono(22, 500, 0.16), color: K.ice, opacity: k }}>
        <Typed text={t} n={typedN(f, t.length, at + 6, 34)} />
      </div>
    </>
  );
};
export type Part = { d: string; at?: number; hot?: boolean; label?: string; lp?: [number, number, number, number]; dx?: number; dy?: number; fill?: boolean };

// ---------------------------------------------------------------- Cutaway_D
/** the outer shell draws on, an x-ray band sweeps across and peels it away to reveal the inner parts (section hatch), callouts type; the
 *  failure part (`hot`) pulses once in amber. Paths are in 1920x1080 px. */
export const Cutaway_D: React.FC<Base & { shell: string[]; inner: Part[]; sweepAt?: number; sweepLen?: number; title?: string }> = (p) => {
  const { dur, shell, inner, sweepAt = 30, sweepLen = 40, title } = p;
  assertDev("Cutaway", dur, () => (sweepLen < 24 ? "sweep < 24 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 14);
  const draw = EI.cam(f / 28);
  const sx = lerp(-100, 2020, EI.cam((f - sweepAt) / sweepLen));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Grid {...p} />
      <Cam f={f} dur={dur}>
        <Svg>
          <defs>
            <pattern id="cw_hatch" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="12" stroke="rgba(166,246,255,.35)" strokeWidth="2" /></pattern>
            <clipPath id="cw_rev"><rect x={0} y={0} width={Math.max(0, sx)} height={1080} /></clipPath>
            <clipPath id="cw_keep"><rect x={Math.max(0, sx)} y={0} width={1920} height={1080} /></clipPath>
          </defs>
          <g clipPath="url(#cw_keep)">{shell.map((d, i) => <path key={i} d={d} fill="rgba(20,40,58,.85)" stroke={K.ice} strokeWidth={2.2} pathLength={1} strokeDasharray={`${draw} 1`} />)}</g>
          <g clipPath="url(#cw_rev)">
            {shell.map((d, i) => <path key={i} d={d} fill="url(#cw_hatch)" stroke={K.cyanDim} strokeWidth={1.5} strokeDasharray="8 6" />)}
            {inner.map((pt, i) => {
              const k = EI.cam((f - (pt.at ?? sweepAt + 10)) / 14);
              const pulse = pt.hot ? Math.sin(clamp01((f - (pt.at ?? sweepAt) - 20) / 24) * Math.PI) : 0;
              return <path key={i} d={pt.d} fill={pt.fill === false ? "none" : pt.hot ? `rgba(255,178,63,${0.25 + 0.35 * pulse})` : "rgba(166,246,255,.16)"} stroke={pt.hot ? K.amber : K.cyan} strokeWidth={2.2} opacity={k} />;
            })}
          </g>
          <line x1={sx} y1={0} x2={sx} y2={1080} stroke={K.cyan} strokeWidth={2} opacity={sx > 0 && sx < 1920 ? 0.9 : 0} style={{ filter: K.cyanGlow }} />
        </Svg>
        {inner.filter((pt) => pt.label && pt.lp).map((pt, i) => <Callout key={i} f={f} at={(pt.at ?? sweepAt + 10) + 12} x={pt.lp![0]} y={pt.lp![1]} lx={pt.lp![2]} ly={pt.lp![3]} t={pt.label!} hot={pt.hot} />)}
      </Cam>
      {title && <div style={{ position: "absolute", left: 80, top: 70, ...wide(24, 560, 100, 0.36), color: K.frost }}><Typed text={title} n={typedN(f, title.length, 6, 26)} /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ExplodedPart_D
/** an assembly drawn whole, then each part slides apart along its own (dx, dy) on an eased stagger; labels type at rest; the hot part stays lit. */
export const ExplodedPart_D: React.FC<Base & { parts: Part[]; at?: number; len?: number; title?: string }> = (p) => {
  const { dur, parts, at = 30, len = 30, title } = p;
  assertDev("ExplodedPart", dur, () => (len < 20 ? "explode < 20 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 14);
  const draw = EI.cam(f / 26);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Grid {...p} />
      <Cam f={f} dur={dur}>
        <Svg>
          {parts.map((pt, i) => {
            const k = EI.cam((f - at - i * 4) / len);
            return <path key={i} d={pt.d} transform={`translate(${((pt.dx ?? 0) * k).toFixed(2)} ${((pt.dy ?? 0) * k).toFixed(2)})`} fill={pt.hot ? "rgba(255,178,63,.22)" : "rgba(20,40,58,.85)"} stroke={pt.hot ? K.amber : K.ice} strokeWidth={2.2} pathLength={1} strokeDasharray={`${draw} 1`} />;
          })}
        </Svg>
        {parts.filter((pt) => pt.label && pt.lp).map((pt, i) => {
          const k = EI.cam((f - at - i * 4) / len);
          const [x, y, lx, ly] = pt.lp!;
          return <Callout key={i} f={f} at={at + len + i * 6} x={x + (pt.dx ?? 0) * k} y={y + (pt.dy ?? 0) * k} lx={lx + (pt.dx ?? 0) * k} ly={ly + (pt.dy ?? 0) * k} t={pt.label!} hot={pt.hot} />;
        })}
      </Cam>
      {title && <div style={{ position: "absolute", left: 80, top: 70, ...wide(24, 560, 100, 0.36), color: K.frost }}><Typed text={title} n={typedN(f, title.length, 6, 26)} /></div>}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- ScaleCompare_D
/** a 1.75 m person silhouette beside the object's height bar; the bar grows to scale, a measure line draws with the value, the camera tilts
 *  from the top of the bar down to the person. */
export const ScaleCompare_D: React.FC<Base & { h: number; unit?: string; what: string; person?: number; at?: number; len?: number }> = (p) => {
  const { dur, h, unit = "m", what, person = 1.75, at = 8, len = 40 } = p;
  assertDev("ScaleCompare", dur, () => (len < 24 ? "grow < 24 f" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 14);
  const ground = 900, pxm = 760 / Math.max(h, person * 2);
  const g = EI.quick((f - at) / len);
  const top = ground - h * pxm * g;
  const tilt = lerp(-80, 40, EI.cam((f - at - len) / (dur - at - len - 10)));
  const val = `${(h * g).toFixed(h < 10 ? 1 : 0)} ${unit}`;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Grid {...p} />
      <AbsoluteFill style={{ transform: `translate3d(0, ${tilt.toFixed(2)}px, 0)` }}>
        <Svg>
          <line x1={300} y1={ground} x2={1620} y2={ground} stroke="rgba(244,247,247,.5)" strokeWidth={2} />
          <g transform={`translate(760 ${ground - (person * pxm) / 2}) scale(${((person * pxm) / 200).toFixed(4)})`} opacity={EI.cam(f / 12)}>
            <Glyph name="person" colour={K.ice} size={200} />
          </g>
          <rect x={980} y={top} width={200} height={ground - top} fill="rgba(166,246,255,.14)" stroke={K.cyan} strokeWidth={2} />
          <line x1={1240} y1={ground} x2={1240} y2={top} stroke={K.ice} strokeWidth={2} />
          <line x1={1226} y1={top} x2={1254} y2={top} stroke={K.ice} strokeWidth={2} /><line x1={1226} y1={ground} x2={1254} y2={ground} stroke={K.ice} strokeWidth={2} />
          {Array.from({ length: Math.floor(h) + 1 }, (_, i) => ground - i * pxm >= top ? <line key={i} x1={1240} y1={ground - i * pxm} x2={1250} y2={ground - i * pxm} stroke={K.ice} strokeWidth={1} opacity={0.5} /> : null)}
        </Svg>
        <div style={{ position: "absolute", left: 1270, top: (top + ground) / 2 - 30, ...mono(48, 500, 0.04), color: K.ice }}>{val}</div>
        <div style={{ position: "absolute", left: 1080, top: ground + 20, transform: "translateX(-50%)", ...wide(22, 560, 100, 0.3), color: K.cyan, opacity: EI.cam((f - at) / 12) }}>{what}</div>
        <div style={{ position: "absolute", left: 760, top: ground + 20, transform: "translateX(-50%)", ...mono(18, 400, 0.16), color: K.frost }}>{`${person} ${unit}`}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- StructureSection_D
/** a building section (floors stacked), floors build bottom-up, the camera glides to the incident floor which lights from inside (amber), the
 *  floor label types. */
export const StructureSection_D: React.FC<Base & { floors: number; hot: number; label?: string; basement?: number; at?: number }> = (p) => {
  const { dur, floors, hot, label, basement = 0, at = 6 } = p;
  assertDev("StructureSection", dur, () => (hot < -basement || hot >= floors ? "hot floor outside the building" : null));
  const f = useCurrentFrame();
  const o = envIO(f, dur, 10, 14);
  const total = floors + basement, fh = Math.min(70, 640 / total), W = 640, x0 = 960 - W / 2, ground = 540 + ((floors - basement) * fh) / 2;
  const yOf = (i: number) => ground - (i + 1) * fh;
  const build = (i: number) => EI.cam((f - at - (i + basement) * 2.2) / 10);
  const lit = EI.cam((f - at - total * 2.2 - 10) / 14);
  const cy = yOf(hot) + fh / 2;
  const z = lerp(1, 1.3, EI.cam((f - at - total * 2.2 - 4) / 40));
  const n = label ? typedN(f, label.length, at + total * 2.2 + 26, 26) : 0;
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <Grid {...p} />
      <AbsoluteFill style={{ transform: `scale3d(${z.toFixed(5)}, ${z.toFixed(5)}, 1)`, transformOrigin: `1080px ${cy}px` }}>
        <Svg>
          <line x1={x0 - 200} y1={ground} x2={x0 + W + 200} y2={ground} stroke="rgba(244,247,247,.6)" strokeWidth={2} />
          {Array.from({ length: total }, (_, j) => {
            const i = j - basement, k = build(i), y = yOf(i), isHot = i === hot;
            return (
              <g key={j} opacity={k} transform={`translate(0 ${((1 - k) * 12).toFixed(2)})`}>
                <rect x={x0} y={y} width={W} height={fh - 4} fill={isHot ? `rgba(255,178,63,${0.12 + 0.3 * lit})` : i < 0 ? "rgba(20,40,58,.5)" : "rgba(20,40,58,.85)"} stroke={isHot && lit > 0 ? K.amber : K.ice} strokeWidth={isHot ? 2.4 : 1.4} />
                {Array.from({ length: 7 }, (_, w) => <rect key={w} x={x0 + 30 + w * 86} y={y + fh * 0.28} width={44} height={fh * 0.36} fill={isHot ? `rgba(255,200,120,${0.2 + 0.6 * lit})` : "rgba(166,246,255,.12)"} />)}
                <text x={x0 - 24} y={y + fh / 2 + 6} textAnchor="end" fill={K.frost} style={mono(16, 400, 0.1)}>{i < 0 ? `B${-i}` : i === 0 ? "G" : `${i}F`}</text>
              </g>
            );
          })}
        </Svg>
        {label && <div style={{ position: "absolute", left: x0 + W + 40, top: cy - 20, ...mono(28, 500, 0.16), color: K.ice, opacity: lit }}><Typed text={label} n={n} caret /></div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
