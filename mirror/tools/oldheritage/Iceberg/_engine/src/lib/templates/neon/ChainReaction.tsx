// neon / ChainReaction: cause chips light one after another and their arrows run (a pulse travels the wire) into ONE outcome node that turns
// red (cause -> effect) or grey (claim -> denied). REF VV §7 neon pictograms (Visual Venture TV @ 0:32.3: colour = meaning, pop on the phrase)
// + FA evidence E1 (Instagram @ 2:47.5: one element per noun) + VV §8 word ghost.
// Ours (vs EquationRow): text chips instead of glyph terms, a fan-in layout (chips stacked left, node right), wires with travelling pulses, and the
// node's verdict colour; no re-framing camera, only a slow push.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, H, W, EZ, clamp01, fs as capFs, measure } from "../../core";
import { NEON, hexA, neonFilter } from "./glyphs";

export type ChainReactionProps = {
  cap?: number; subCap?: number; // chip text cap / node sub-line cap (M-024 >= 28)
  chips: { text: string; at: number; colour?: string }[]; // stacked top -> bottom on the left
  node: { text: string; at: number; tone?: "red" | "grey"; sub?: string };
  wireAt?: number; // wires start (default: node.at - 14)
  pushPerS?: number;
};

export const ChainReaction: React.FC<ChainReactionProps> = (p) => {
  const { chips, node, wireAt, pushPerS = 0.01 } = p;
  const f = useCurrentFrame();
  const s = 1 + pushPerS * (Math.max(0, f) / 30);
  const cap = p.cap ?? 40, fsz = capFs("inter", cap), n = chips.length;
  const gap = 180, y0 = H / 2 - ((n - 1) * gap) / 2;
  const nodeX = W * 0.72, nodeY = H / 2, nodeR = 175;
  const tone = node.tone === "grey" ? "#9AA0A6" : NEON.red;
  const w0 = wireAt ?? node.at - 14;
  const nk = f - node.at;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 72% 50%, ${hexA(tone, 0.18 * clamp01(nk / 10))}, rgba(0,0,0,0) 34%)` }} />
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(5)})` }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {chips.map((c, i) => {
            const k = f - c.at;
            if (k < 0) return null;
            const col = c.colour ?? NEON.white;
            const tw = measure(c.text, `700 ${fsz}px ${FONT.inter}`) + 80, th = 110;
            const cx = W * 0.27, cy = y0 + i * gap;
            const lit = EZ.out3(k / 8), flash = k < 3 ? 1 - k / 3 : 0;
            const wk = EZ.out3((f - Math.max(w0, c.at + 6) - i * 4) / 14);
            const sx = cx + tw / 2 + 6, ex = nodeX - nodeR - 10, ey = nodeY + (i - (n - 1) / 2) * 34;
            const mx = (sx + ex) / 2;
            const d = `M${sx} ${cy} C${mx} ${cy} ${mx} ${ey} ${ex} ${ey}`;
            const pk = (f - w0 - i * 4) % 30;
            return (
              <g key={i}>
                <rect x={cx - tw / 2} y={cy - th / 2} width={tw} height={th} rx={th / 2} fill={hexA(col, (0.06 + 0.12 * flash) * lit)} stroke={col} strokeWidth={5} pathLength={1} strokeDasharray={`${lit} 1`} style={{ filter: neonFilter(col) }} />
                {wk > 0 ? (
                  <g>
                    <path d={d} fill="none" stroke={hexA(col, 0.85)} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray={`${wk} 1`} style={{ filter: neonFilter(col, 0.7) }} />
                    {wk >= 1 && nk < 40 ? <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={9} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 1" strokeDashoffset={-(pk / 30)} style={{ filter: neonFilter("#FFFFFF") }} /> : null}
                    {wk >= 1 ? <path d={`M${ex - 22} ${ey - 14} L${ex} ${ey} L${ex - 22} ${ey + 14}`} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" /> : null}
                  </g>
                ) : null}
              </g>
            );
          })}
          {nk >= 0 ? (
            <g>
              <circle cx={nodeX} cy={nodeY} r={nodeR * (1 + 0.15 * (1 - EZ.out3(nk / 8)))} fill={hexA(tone, 0.16)} stroke={tone} strokeWidth={8} style={{ filter: neonFilter(tone) }} />
              {nk < 4 ? <circle cx={nodeX} cy={nodeY} r={nodeR + 40 * nk} fill="none" stroke={tone} strokeWidth={4} opacity={1 - nk / 4} /> : null}
            </g>
          ) : null}
        </svg>
        {chips.map((c, i) => (f >= c.at + 3 ? (
          <div key={i} style={{ position: "absolute", left: W * 0.27 - 400, width: 800, top: y0 + i * gap, transform: "translateY(-50%)", textAlign: "center", fontFamily: FONT.inter, fontWeight: 700, fontSize: fsz, letterSpacing: "0.04em",
            color: c.colour ?? "#FDFCFD", opacity: EZ.out2((f - c.at - 3) / 5) }}>{c.text}</div>
        ) : null))}
        {nk >= 2 ? (
          <div style={{ position: "absolute", left: nodeX - 260, width: 520, top: nodeY, transform: "translateY(-50%)", textAlign: "center", fontFamily: FONT.bebas, fontSize: 84, lineHeight: 1.0, color: node.tone === "grey" ? "#C9CDD1" : "#FFFFFF", letterSpacing: "0.04em",
            textShadow: `0 0 16px ${hexA(tone, 0.8)}`, opacity: EZ.out2((nk - 2) / 5) }}>{node.text}{node.sub ? <div style={{ fontFamily: FONT.inter, fontWeight: 600, fontSize: capFs("inter", p.subCap ?? 28), letterSpacing: "0.08em", marginTop: 8, color: "rgba(255,255,255,.75)" }}>{node.sub}</div> : null}</div>
        ) : null}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const CHAIN_DEMO: ChainReactionProps = {
  chips: [{ text: "MATERIAL CHOICE", at: 4 }, { text: "LOAD ABOVE LIMIT", at: 30, colour: NEON.yellow }],
  node: { text: "FAILURE", at: 70, tone: "red", sub: "DIRECT CAUSE" },
  wireAt: 50,
};
