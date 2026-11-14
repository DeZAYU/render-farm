// timeline / YearScroll: a vertical column of years that the camera sinks through, one year per beat. REF: Abyssal iceberg descent (Abyssal @ 0:38.0
// "Level" sink between tiers, ICEBERG_MOTION.md: camera sinks to the next band, 3-D tilted plane yaw -16 -> -11 deg) + DD Vol.3 E4 scroll
// velocity (Dashcam Vol.3 @ 8.0-14.4: ease-in to a peak at 0.9 s, then halving every 0.45 s; edge defocus). The current year sits in the sharp
// focus band and turns red (DD red with glow), the others stay dim grey and defocused; its label rises in beside it.
// Our version: the column sits on a slightly yawed plane that keeps turning (-14 -> -9 deg) so the frame is never dead; motion blur on the
// scroll peak.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, W, clamp01, ddScroll, fs } from "../../core";

export type YearNode = { year: string; label: string; at: number };
export type YearScrollProps = { nodes: YearNode[]; pitch?: number; norm?: number; cap?: number; labelCap?: number };

export const YearScroll: React.FC<YearScrollProps> = ({ nodes, pitch = 250, norm = 66, cap = 150, labelCap = 32 }) => {
  const k = useCurrentFrame();
  // scroll position (in nodes): each node's beat scrolls one pitch with the DD curve
  let pos = 0, fast = false, cur = 0;
  nodes.forEach((n, i) => {
    if (i === 0 || n.at <= 0) { if (i > 0) pos += 1; return; }
    const q = k - n.at;
    pos += ddScroll(q, norm);
    if (q > 8 && q < 40) fast = true;
  });
  cur = Math.round(pos);
  const near = (i: number) => clamp01(1 - Math.abs(pos - i) * 2.2); // 1 in the focus band
  const yaw = -14 + 5 * clamp01(k / 300);
  const yf = fs("bebas", cap), lf = fs("inter", labelCap);
  const col = (dofBlur: number) => (
    <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transform: `perspective(2200px) rotateY(${yaw.toFixed(3)}deg) translateY(${(-(pos * pitch) - 0.4 * k).toFixed(2)}px)`, transformOrigin: "50% 50%" }}>
      {nodes.map((n, i) => {
        const glow = EZ.out2(near(i));
        const on = glow > 0;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: 340, width: 560, top: H / 2 + i * pitch - yf * 0.55, textAlign: "right", fontFamily: FONT.bebas, fontSize: yf, lineHeight: 1,
              color: on ? `rgb(${Math.round(110 + 132 * glow)},${Math.round(110 - 73 * glow)},${Math.round(112 - 70 * glow)})` : "#5E5F61",
              textShadow: on ? `0 0 ${(22 * glow).toFixed(1)}px rgba(242,37,42,${(0.55 * glow).toFixed(3)})` : undefined, filter: dofBlur ? `blur(${dofBlur}px)` : undefined }}>{n.year}</div>
            <div style={{ position: "absolute", left: 950, top: H / 2 + i * pitch - lf * 0.7 + 14 * (1 - glow), whiteSpace: "nowrap", fontFamily: FONT.inter, fontWeight: 500, fontSize: lf,
              color: on ? "#F2F2F0" : "#6A6B6D", opacity: 0.4 + 0.6 * glow }}>{n.label}</div>
          </React.Fragment>
        );
      })}
      {/* the column rule with a tick per year */}
      <div style={{ position: "absolute", left: 925, top: H / 2 - 2 * pitch, width: 3, height: (nodes.length + 3) * pitch, background: "linear-gradient(to bottom, rgba(233,233,230,0), rgba(233,233,230,.35) 12%, rgba(233,233,230,.35) 88%, rgba(233,233,230,0))" }} />
      {nodes.map((_, i) => <div key={`t${i}`} style={{ position: "absolute", left: 917, top: H / 2 + i * pitch - 1.5, width: 19, height: 3, background: i === cur ? "#F2252A" : "rgba(233,233,230,.5)" }} />)}
    </div>
  );
  const band = `linear-gradient(to bottom, transparent ${H / 2 - 230}px, #000 ${H / 2 - 120}px, #000 ${H / 2 + 120}px, transparent ${H / 2 + 230}px)`;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 40% 50%, #19191B 0%, #0B0B0C 60%, #040404 100%)" }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          <AbsoluteFill>{col(4)}</AbsoluteFill>
          <AbsoluteFill style={{ WebkitMaskImage: band, maskImage: band }}>{col(0)}</AbsoluteFill>
        </AbsoluteFill>
      </MBlur>
      <AbsoluteFill style={{ background: "linear-gradient(to bottom, rgba(4,4,4,.85) 0%, rgba(4,4,4,0) 26%, rgba(4,4,4,0) 74%, rgba(4,4,4,.85) 100%)" }} />
    </AbsoluteFill>
  );
};
