// evidence / SplitCompare: two claims side by side on one world plane. Each side = its source (who says it), one line-glyph, the claim,
// landing on its words (DD label rise; glyph draws on). The camera opens on the first claim and, when the second arrives, eases out to hold
// both (VV §11 quick start / long settle). A red "≠" lands between them on the disagreement; optionally one side LOSES (desaturates,
// dims, steps back) and the camera leans toward the side that stands.
// REF Dashcam two-claim comparison (DD device family: word-by-word labels, red key mark) + VV §11 world-space infographic @3:28.0 (phases
// bezier (0.31,0,0,0.957)); c02-08 legend intent "two claims side by side, then one wins". Glyphs = core kits/glyphs (line mode).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, RC, RoundText, W, clamp01, fs, lerp, roundWidth } from "../../core";
import { Glyph, type GlyphName } from "../../core/kits/glyphs";

export type Claim = { source: string; claim: string; glyph?: GlyphName; at: number; credit?: string };
export type SplitCompareProps = {
  left: Claim;
  right: Claim;
  neqAt?: number; // red ≠ between them (omit = none)
  loser?: { side: "left" | "right"; at: number }; // that side greys out
  gap?: number; // world distance between the two centres (default 900)
  cap?: number; // claim cap height px (default 64; auto-fits the column but never below 40)
  labelCap?: number; // source label cap (default 38)
  subCap?: number; // credit line cap (default 28)
};
const Side: React.FC<{ c: Claim; x: number; f: number; lose: number; cap: number; labelCap: number; subCap: number }> = ({ c, x, f, lose, cap, labelCap, subCap }) => {
  const k = f - c.at;
  if (k < 0) return null;
  const rise = (d: number, kk: number) => d * (1 - EZ.out3(kk / 22));
  const capC = Math.max(40, Math.min(cap, (cap * 720) / roundWidth(c.claim, cap)));
  const kc = k - 8;
  return (
    <div style={{ position: "absolute", left: x - 450, top: -340, width: 900, height: 680, transform: `scale(${(1 - 0.04 * lose).toFixed(4)})`,
      filter: lose > 0 ? `grayscale(${lose.toFixed(3)}) brightness(${(1 - 0.55 * lose).toFixed(3)})` : undefined }}>
      <div style={{ position: "absolute", left: 0, width: 900, top: 20, display: "flex", justifyContent: "center", opacity: clamp01(k / 12) * 0.92, transform: `translateY(${rise(19, k).toFixed(2)}px)` }}>
        <RoundText text={c.source} cap={labelCap} colour="#C9C9C9" />
      </div>
      {c.glyph ? (
        <svg width={900} height={330} style={{ position: "absolute", left: 0, top: 120, overflow: "visible" }}>
          <g transform="translate(450 150)" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,.35))" }}>
            <Glyph name={c.glyph} colour="#F2F2F2" size={260} mode="line" lineW={8} draw={EZ.out2((k - 2) / 18)} />
          </g>
        </svg>
      ) : null}
      {kc >= 0 ? (
        <div style={{ position: "absolute", left: 0, width: 900, top: 480, display: "flex", justifyContent: "center", opacity: clamp01(kc / 12), transform: `translateY(${rise(22, kc).toFixed(2)}px)`,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }}>
          <RoundText text={c.claim} cap={capC} colour="#FDFDFD" />
        </div>
      ) : null}
      {c.credit && kc >= 0 ? (
        <div style={{ position: "absolute", left: 0, width: 900, top: 490 + capC * 1.7, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", subCap), color: "#A8A8A8", opacity: clamp01((kc - 6) / 12) }}>{c.credit}</div>
      ) : null}
    </div>
  );
};
const Inner: React.FC<SplitCompareProps> = (p) => {
  const f = useCurrentFrame();
  const g = p.gap ?? 900;
  const first = p.left.at <= p.right.at ? -1 : 1;
  const second = Math.max(p.left.at, p.right.at);
  const both = EZ.quick((f - second) / 36);
  const lo = p.loser;
  const lu = lo ? EZ.settle((f - lo.at) / 40) : 0;
  const lose = lo ? clamp01((f - lo.at) / 14) : 0;
  const cx = lerp((first * g) / 2 * 0.72, 0, both) + (lo ? (lo.side === "left" ? 1 : -1) * 50 * lu : 0);
  const z = lerp(1.18, 1, both) * (1 + 0.02 * lu) * (1 + 0.008 * (Math.max(0, f) / 30));
  const div = EZ.out2((f - Math.min(p.left.at, p.right.at) - 6) / 16);
  const nk = p.neqAt !== undefined ? f - p.neqAt : -1;
  return (
    <AbsoluteFill style={{ background: "#0a0a0b" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 46%, #1c1b1d 0%, #0a0a0b 100%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${z.toFixed(4)}) translate(${(-cx).toFixed(2)}px, 0px)` }}>
        <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
          <line x1={0} y1={-300 * div} x2={0} y2={-80 * div} stroke="rgba(255,255,255,.28)" strokeWidth={3} />
          <line x1={0} y1={60 * div} x2={0} y2={300 * div} stroke="rgba(255,255,255,.28)" strokeWidth={3} />
          {nk >= 0 ? (
            <g transform={`translate(0 -10) scale(${(1 + 0.25 * (1 - EZ.out3(nk / 8))).toFixed(4)})`} opacity={clamp01(nk / 3)} style={{ filter: "drop-shadow(0 0 8px rgba(227,10,16,.8)) drop-shadow(0 0 20px rgba(227,10,16,.45))" }}>
              <line x1={-46} y1={-20} x2={46} y2={-20} stroke={RC.ringRed} strokeWidth={13} strokeLinecap="round" />
              <line x1={-46} y1={20} x2={46} y2={20} stroke={RC.ringRed} strokeWidth={13} strokeLinecap="round" />
              <line x1={22} y1={-56} x2={-22} y2={56} stroke={RC.ringRed} strokeWidth={13} strokeLinecap="round" />
            </g>
          ) : null}
        </svg>
        <Side c={p.left} x={-g / 2} f={f} lose={lo?.side === "left" ? lose : 0} cap={p.cap ?? 64} labelCap={p.labelCap ?? 38} subCap={p.subCap ?? 28} />
        <Side c={p.right} x={g / 2} f={f} lose={lo?.side === "right" ? lose : 0} cap={p.cap ?? 64} labelCap={p.labelCap ?? 38} subCap={p.subCap ?? 28} />
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 72% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
export const SplitCompare: React.FC<SplitCompareProps> = (p) => {
  const f = useCurrentFrame();
  const second = Math.max(p.left.at, p.right.at);
  return <MBlur on={f > second + 1 && f < second + 14}><Inner {...p} /></MBlur>;
};
