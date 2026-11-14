// title / RoleStack: who was charged, as roles (no names): three role cards SLAM in one per word, a red "CHARGED" bar, then the charge lines.
// REF DD title slam language (Dashcam Vol.1 E13 / Vol.3 E8 title wall: red over white caps, hard arrival, impact kick) + DD D1 white-flash impact
// grammar (1-2 f) + FONTS.md VV/Bebas caps for the cards, Inter 700 for the charge lines. Map: c07 #18 ("OWNER", "GENERAL MANAGER", "OPERATIONS
// MANAGER" on their words; red "CHARGED"; "NO PROPER SAFETY PROCEDURES", "NO REGULAR MAINTENANCE BY QUALIFIED STAFF").
// Differs from title/SlamCard (VV: one block oversized, falling back by recession) and title/TitleWall (tiles + drip title): here SEPARATE CARDS
// fall onto a left column from above the lens (x1.35 -> 1 in 4 f, accelerating) with a white edge-flash and a 2 f kick each, the red bar wipes
// in at an angle under the stack, and the charges type in word by word under it.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { RedStage, kick } from "../../core/kits/verdict";

export type RoleStackProps = { roles: { text: string; at: number }[]; bar?: { text: string; at: number }; charges?: { words: { text: string; at: number }[] }[]; x?: number; cap?: number; labelCap?: number; subCap?: number };
export const RoleStack: React.FC<RoleStackProps> = ({ roles, bar, charges = [], x = 0.12 * W, cap = 84, labelCap = 92, subCap = 34 }) => {
  const f = useCurrentFrame();
  const cardH = Math.max(128, cap * 1.5), gap = 22;
  const top0 = H * 0.12;
  const kicks = roles.map((r, i) => kick(f - r.at, 9, i + 1));
  const kk = kicks.reduce((a, b) => ({ x: a.x + b.x, y: a.y + b.y }), { x: 0, y: 0 });
  const push = 1 + 0.01 * (f / 30);
  const bk = bar ? f - bar.at : -1;
  const wipe = EZ.out3(clamp01(bk / 7));
  const barY = top0 + roles.length * (cardH + gap) + 34;
  return (
    <AbsoluteFill style={{ background: "#040404", overflow: "hidden" }}>
      <RedStage o={0.9} y={42} />
      <AbsoluteFill style={{ transform: `translate(${kk.x.toFixed(2)}px, ${kk.y.toFixed(2)}px) scale(${push.toFixed(5)})` }}>
        {roles.map((r, i) => {
          const k = f - r.at;
          if (k < -4) return null;
          const u = EZ.in2(clamp01((k + 4) / 4));
          const s = k < 0 ? 1.35 - 0.35 * u : 1;
          const o = k < 0 ? 0.3 + 0.6 * u : 1;
          const flash = k >= 0 && k < 3 ? [0.9, 0.45, 0.15][Math.floor(k)] : 0;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: top0 + i * (cardH + gap), height: cardH, padding: "0 44px", display: "flex", alignItems: "center", transformOrigin: "0% 50%",
              transform: `scale(${s.toFixed(4)})`, opacity: o, background: "linear-gradient(180deg, #1d1d1d, #111)", boxShadow: `0 14px 30px rgba(0,0,0,.65), inset 0 0 0 2px rgba(255,255,255,${(0.08 + 0.6 * flash).toFixed(2)}), 0 0 ${(30 * flash).toFixed(0)}px rgba(255,255,255,${(0.5 * flash).toFixed(2)})` }}>
              <div style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), lineHeight: 1, letterSpacing: "0.04em", color: "#F1F1F1", whiteSpace: "nowrap" }}>{r.text}</div>
            </div>
          );
        })}
        {bar && bk >= 0 ? (
          <div style={{ position: "absolute", left: x - 40, top: barY, width: 980, height: 118, transform: "rotate(-2.5deg)", transformOrigin: "0 50%", clipPath: `inset(0 ${((1 - wipe) * 100).toFixed(2)}% 0 0)` }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #E0101A, #A8000C)", boxShadow: "0 10px 30px rgba(0,0,0,.6), 0 0 30px rgba(224,16,26,.45)" }} />
            <div style={{ position: "absolute", right: 70, top: 0, height: 118, display: "flex", alignItems: "center", fontFamily: FONT.bebas, fontSize: fs("bebas", labelCap), letterSpacing: "0.12em", color: "#FFF", whiteSpace: "nowrap" }}>{bar.text}</div>
          </div>
        ) : null}
        <div style={{ position: "absolute", left: x, top: top0 + roles.length * (cardH + gap) + 200 }}>
          {charges.map((c, i) => {
            const vis = c.words.filter((w) => f >= w.at);
            if (!vis.length) return null;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 18 }}>
                <div style={{ width: 28, height: 6, background: "#E0101A", boxShadow: "0 0 8px rgba(224,16,26,.6)" }} />
                <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", subCap), letterSpacing: "0.03em", color: "#EDEDED", whiteSpace: "nowrap", textShadow: "0 3px 8px rgba(0,0,0,.7)" }}>
                  {c.words.map((w, j) => <span key={j} style={{ opacity: f >= w.at ? 1 : 0 }}>{j ? " " : ""}{w.text}</span>)}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
