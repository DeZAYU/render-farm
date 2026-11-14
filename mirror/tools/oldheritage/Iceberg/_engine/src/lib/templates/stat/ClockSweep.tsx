// stat / ClockSweep: a dial sweeping to a duration ("~ 1 HOUR", "~ 10 MIN"). REF Farrell clock glyph (FA evidence E1 white line glyphs, one element
// per noun) + Visual Venture §7 neon pictograms @0:32.3 / 10:43.0 (white neon line object on black, tight halo, COLOUR = MEANING: the swept time
// fills red) + DD D3 E5 two-tone label (white figure + red word, pop curves). Map: c02 #23 (held her above the water ~1 hour), c04 #13 (~10 min).
// OUR VERSION: a white neon dial (12 major + 48 minor ticks); the minute hand starts on the first word and sweeps at a steady pace that eases only
// into the final word (time passing = linear; the landing = VV long settle); the swept sector fills dark red behind the hand; the duration pops
// under the dial on its word; the camera creeps in +1 %/s the whole time.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, RC, W, clamp01, fs } from "../../core";
import { neonFilter, NEON } from "../../core/kits/glyphs";
import { numPop, wordPop } from "../../core/kits/stat";
import { RedStage } from "../../core/kits/verdict";

export type ClockSweepProps = { minutes: number; sweepAt: number; landAt: number; figure: string; word: string; labelAt: number; r?: number; startMin?: number; cap?: number };
export const ClockSweep: React.FC<ClockSweepProps> = ({ minutes, sweepAt, landAt, figure, word, labelAt, r = 260, startMin = 0, cap = 74 }) => {
  const f = useCurrentFrame();
  const span = Math.max(1, landAt - sweepAt);
  const t = clamp01((f - sweepAt) / span);
  // 80 % of the way linear, then a long settle into the landing word
  const u = t < 0.8 ? t * 0.9 / 0.8 : 0.9 + 0.1 * EZ.settle((t - 0.8) / 0.2);
  const swept = (minutes / 60) * 360 * u;
  const a0 = (startMin / 60) * 360;
  const land = f >= landAt ? Math.max(0, 1 - (f - landAt) / 8) : 0;
  const cx = W / 2, cy = H * 0.43;
  const push = 1 + 0.01 * (f / 30);
  const appear = EZ.out3(clamp01((f + 1) / 10));
  const rad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const sector = (() => {
    if (swept <= 0.01) return "";
    const s = rad(a0), e = rad(a0 + Math.min(359.99, swept));
    const large = Math.min(359.99, swept) > 180 ? 1 : 0;
    const rr = r * 0.9;
    return `M ${cx} ${cy} L ${cx + rr * Math.cos(s)} ${cy + rr * Math.sin(s)} A ${rr} ${rr} 0 ${large} 1 ${cx + rr * Math.cos(e)} ${cy + rr * Math.sin(e)} Z`;
  })();
  const hand = rad(a0 + swept);
  const hh = rad(a0 / 12 + swept / 12); // hour hand moves 1/12
  const n = numPop(f - labelAt), w = wordPop(f - labelAt - 4);
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <RedStage o={0.6 + 0.4 * u} y={43} />
      <AbsoluteFill style={{ transform: `scale(${(push * (0.94 + 0.06 * appear)).toFixed(5)})`, transformOrigin: `${cx}px ${cy}px`, opacity: appear }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <path d={sector} fill={`rgba(200,8,14,${(0.42 + 0.2 * land).toFixed(3)})`} style={{ filter: "drop-shadow(0 0 18px rgba(230,20,30,.5))" }} />
          <g style={{ filter: neonFilter(NEON.white, 0.8, 0.8) }}>
            <circle cx={cx} cy={cy} r={r} fill="none" stroke={NEON.white} strokeWidth={7} />
            {Array.from({ length: 60 }, (_, i) => {
              const a = rad(i * 6), major = i % 5 === 0;
              const r1 = r - (major ? 40 : 20), r2 = r - 12;
              return <line key={i} x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)} x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)} stroke={NEON.white} strokeWidth={major ? 6 : 2.5} strokeLinecap="round" opacity={major ? 1 : 0.7} />;
            })}
            <line x1={cx} y1={cy} x2={cx + r * 0.48 * Math.cos(hh)} y2={cy + r * 0.48 * Math.sin(hh)} stroke={NEON.white} strokeWidth={10} strokeLinecap="round" />
          </g>
          <g style={{ filter: neonFilter(NEON.red, 0.9, 1) }}>
            <line x1={cx - 0.12 * r * Math.cos(hand)} y1={cy - 0.12 * r * Math.sin(hand)} x2={cx + r * 0.8 * Math.cos(hand)} y2={cy + r * 0.8 * Math.sin(hand)} stroke="#FF2A35" strokeWidth={7} strokeLinecap="round" />
            <circle cx={cx} cy={cy} r={11} fill="#FF2A35" />
          </g>
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 0, width: W, top: cy + r + 70, display: "flex", justifyContent: "center", alignItems: "baseline", gap: 26 }}>
        <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", cap), color: "#F2F2F2", opacity: n.o, transform: `translateY(${n.y.toFixed(1)}px)`, textShadow: "0 4px 10px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{figure}</div>
        <div style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", cap), color: RC.ringRed, opacity: w.o, transform: `translateY(${w.y.toFixed(1)}px)`, textShadow: "0 0 14px rgba(227,10,16,.55), 0 4px 10px rgba(0,0,0,.6)", whiteSpace: "nowrap" }}>{word}</div>
      </div>
    </AbsoluteFill>
  );
};
