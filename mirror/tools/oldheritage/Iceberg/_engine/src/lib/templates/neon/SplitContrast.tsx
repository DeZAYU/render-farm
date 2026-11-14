// neon / SplitContrast: two neon columns that oppose each other (cold vs warm, risk vs action). A glowing divider draws top -> bottom, the two
// halves slide apart from the centre, each with a big header glyph + Bebas title; small pictograms pop under each on their words; one side can
// frost over (cold) or flash an alert. REF VV §7 neon pictograms (Visual Venture TV @ 0:32.3: pop on the cut, colour = meaning; @ 1:44.1 crowd:
// new elements on their phrase) + VV §9 Bebas word pop.
// Ours: a symmetric split stage (not a group pull-back): each side carries its own colour temperature and its own background wash.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, clamp01, lerp, rng } from "../../core";
import { NeonGlyph, NEON, hexA } from "./glyphs";

export type SplitSide = { glyph: string; colour: string; title?: string; titleAt?: number; at: number; items?: { glyph: string; at: number; label?: string }[]; effect?: { kind: "frost" | "alert"; at: number } };
export type SplitContrastProps = { left: SplitSide; right: SplitSide; dividerAt?: number; slide?: number; labelCap?: number /* item label cap (M-024 >= 28), default 32 */ };

const Frost: React.FC<{ k: number; x0: number; x1: number }> = ({ k, x0, x1 }) => {
  const r = React.useMemo(() => { const q = rng(77); return Array.from({ length: 70 }, () => ({ x: q(), y: q(), s: 6 + q() * 16, a: q() * 60 })); }, []);
  if (k <= 0) return null;
  return (
    <g stroke="#CFF4FF" strokeWidth={2} strokeLinecap="round" opacity={0.8 * k}>
      {r.map((c, i) => {
        const x = lerp(x0, x1, c.x), y = c.y * H, s = c.s * EZ.out2(clamp01(k * 1.6 - c.y * 0.6));
        return s > 0.5 ? <path key={i} transform={`translate(${x} ${y}) rotate(${c.a})`} d={`M${-s} 0 H${s} M0 ${-s} V${s} M${-s * 0.7} ${-s * 0.7} L${s * 0.7} ${s * 0.7} M${s * 0.7} ${-s * 0.7} L${-s * 0.7} ${s * 0.7}`} /> : null;
      })}
    </g>
  );
};

export const SplitContrast: React.FC<SplitContrastProps> = ({ left, right, dividerAt = 0, slide = 70, labelCap = 32 }) => {
  const f = useCurrentFrame();
  const dk = EZ.out3((f - dividerAt) / 10);
  const side = (S: SplitSide, dir: -1 | 1) => {
    const k = f - S.at;
    if (k < 0) return null;
    const cx = W / 2 + dir * (W / 4) + dir * slide * (1 - EZ.quick(k / 24));
    const items = S.items ?? [];
    const fe = S.effect ? EZ.out2((f - S.effect.at) / 20) : 0;
    const alert = S.effect?.kind === "alert" && f >= S.effect.at ? 0.5 + 0.5 * Math.sin((f - S.effect.at) * 0.6) : 0;
    return (
      <g>
        <NeonGlyph name={S.glyph} colour={S.colour} x={cx} y={H * 0.36} size={230} o={EZ.out2(k / 3)} />
        {items.map((it, i) => (f >= it.at ? (
          <g key={i}>
            <NeonGlyph name={it.glyph} colour={NEON.white} x={cx + (i - (items.length - 1) / 2) * 150} y={H * 0.66} size={110} />
            {it.label ? <text x={cx + (i - (items.length - 1) / 2) * 150} y={H * 0.66 + 95} textAnchor="middle" fontFamily={FONT.bebas} fontSize={labelCap / 0.7} letterSpacing="0.06em" fill="#FDFCFD">{it.label}</text> : null}
          </g>
        ) : null))}
        {S.effect?.kind === "frost" ? <Frost k={fe} x0={dir < 0 ? 0 : W / 2} x1={dir < 0 ? W / 2 : W} /> : null}
        {alert > 0 ? <NeonGlyph name="exclaim" colour={NEON.red} x={cx + 150} y={H * 0.28} size={110} o={0.4 + 0.6 * alert} /> : null}
      </g>
    );
  };
  const title = (S: SplitSide, dir: -1 | 1) => {
    if (!S.title || f < (S.titleAt ?? S.at)) return null;
    const cx = W / 2 + dir * (W / 4);
    return <div style={{ position: "absolute", left: cx - 400, width: 800, top: H * 0.48, textAlign: "center", fontFamily: FONT.bebas, fontSize: 120, letterSpacing: "0.04em", color: S.colour, lineHeight: 1, textShadow: `0 0 18px ${hexA(S.colour, 0.6)}` }}>{S.title}</div>;
  };
  const washL = clamp01((f - left.at) / 10), washR = clamp01((f - right.at) / 10);
  const frostL = left.effect?.kind === "frost" ? EZ.out2((f - left.effect.at) / 20) : 0, frostR = right.effect?.kind === "frost" ? EZ.out2((f - right.effect.at) / 20) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 30% 55% at 25% 45%, ${hexA(left.colour, 0.22 * washL + 0.15 * frostL)}, rgba(0,0,0,0) 100%), radial-gradient(ellipse 30% 55% at 75% 45%, ${hexA(right.colour, 0.22 * washR + 0.15 * frostR)}, rgba(0,0,0,0) 100%)` }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={`M${W / 2} ${H * 0.1} V${H * 0.1 + H * 0.8 * dk}`} stroke="#FDFCFD" strokeWidth={5} strokeLinecap="round" style={{ filter: "drop-shadow(0 0 4px #fff) drop-shadow(0 0 18px rgba(255,255,255,.5))" }} opacity={dk > 0 ? 1 : 0} />
        {side(left, -1)}
        {side(right, 1)}
      </svg>
      {title(left, -1)}
      {title(right, 1)}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const SPLIT_DEMO: SplitContrastProps = {
  dividerAt: 0,
  left: { glyph: "snowflake", colour: NEON.cyan, title: "−20°", at: 4, titleAt: 10, effect: { kind: "frost", at: 70 } },
  right: { glyph: "sun", colour: NEON.orange, title: "+30°", at: 24, titleAt: 30, items: [{ glyph: "palm", at: 40 }, { glyph: "wave", at: 48 }, { glyph: "drop", at: 56 }] },
};
