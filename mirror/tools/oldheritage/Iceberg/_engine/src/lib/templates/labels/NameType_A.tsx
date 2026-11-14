// labels / NameType_A (EDITOR A sibling of NameTag / TornPrint name; Amusement Park 2026-10-19). OVERLAY (no media): put it over the plate.
// REF VV 2026 53.4-55.4 "MICHAEL", 11:35 "MATTHEW GIBSON" (TEMPLATE_UPGRADES #10): the name TYPES ON letter by letter (~1 char/f) lower-left in a
// thin condensed glowing face; a role line rises under it on its own word. Skin: Oswald 200 white with the Waterpark glow, surname in DD red
// #F22522; role in Varela Round + stroke (channel label face). A soft local dark band keeps >= 4.5:1 (M-024); the group drifts +6 px/s (VV
// continuous). SFX: none or case_number_hit -10 (VV soft thump, LF only).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, RoundText, clamp01, fs } from "../../core";

export type NameTypeAProps = { first: string; last?: string; at: number; role?: string; roleAt?: number; out?: number; x?: number; y?: number; cap?: number; cpf?: number };
export const NameType_A: React.FC<NameTypeAProps> = ({ first, last = "", at, role, roleAt, out, x = 140, y = 820, cap = 92, cpf = 1 }) => {
  const f = useCurrentFrame();
  const k = f - at; if (k < 0) return null;
  const ex = out === undefined ? 0 : EZ.in2((f - out) / 14);
  if (ex >= 1) return null;
  const full = `${first}${last ? " " : ""}${last}`;
  const n = Math.min(full.length, Math.floor(k * cpf) + 1);
  const a = full.slice(0, Math.min(n, first.length)), b = n > first.length ? full.slice(first.length, n) : "";
  const dx = 6 * (k / 30);
  const rk = roleAt === undefined ? -1 : f - roleAt;
  const glow = "0 0 10px rgba(255,255,255,.35), 0 0 26px rgba(255,255,255,.15), 0 4px 12px rgba(0,0,0,.7)";
  return (
    <AbsoluteFill style={{ opacity: 1 - ex, filter: ex > 0 ? `blur(${(3 * ex).toFixed(2)}px)` : undefined }}>
      <div style={{ position: "absolute", left: x - 220, top: y - cap * 2.2, width: 1500, height: cap * 4.4, opacity: 0.85 * clamp01(k / 8),
        background: "radial-gradient(ellipse 45% 50% at 35% 50%, rgba(0,0,0,.8) 0%, rgba(0,0,0,.35) 60%, rgba(0,0,0,0) 100%)" }} />
      <div style={{ position: "absolute", left: x + dx, top: y - cap * 1.25, fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", cap), lineHeight: 1, letterSpacing: "0.06em", whiteSpace: "pre" }}>
        <span style={{ color: "#FDFDFD", textShadow: glow }}>{a.toUpperCase()}</span>
        <span style={{ color: "#F22522", fontWeight: 300, textShadow: "0 0 10px rgba(242,37,34,.55), 0 4px 12px rgba(0,0,0,.7)" }}>{b.toUpperCase()}</span>
      </div>
      {role && rk >= 0 ? (
        <div style={{ position: "absolute", left: x + dx * 0.7, top: y + cap * 0.25, opacity: EZ.out2(rk / 12), transform: `translateY(${(16 * (1 - EZ.out3(rk / 20))).toFixed(2)}px)`, filter: "drop-shadow(0 3px 8px rgba(0,0,0,.8))" }}>
          <RoundText text={role} cap={cap * 0.42} colour="#FDFDFD" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
