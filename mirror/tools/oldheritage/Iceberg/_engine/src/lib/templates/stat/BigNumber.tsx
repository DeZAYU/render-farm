// stat / BigNumber: the VV big number + a smaller second figure on its word. REF Visual Venture §7 tank "hold -> burst" @10:43.0 (log-zoom bezier
// (0.326,0,0.143,0.807): the object flies AT the camera, motion-blurred) + VV §9 word pops / §15 rule 6 (stagger by layer: the second element 2-15 f
// later, on its word) + DD D3 E5 two-tone (white figure, red qualifier). Map: c02 #36 ("28" then "~ 200 INJURED"), c04 #23 ("4" then "3 CRITICAL").
// Differs from stat/RecedeNumber (oversize -> recede, left block over footage) and title/SlamCard (three lines falling back): here ONE centred
// numeral BURSTS FORWARD out of the dark (small + defocused -> full size), then SLIDES ASIDE to make room for the second figure, which enters
// from the right. Dark-red stage glow behind, slow life push after the landing.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, W, clamp01, fs, ghost, lerp, lerpLog } from "../../core";
import { RedStage } from "../../core/kits/verdict";

export type BigNumberProps = { num: string; at: number; second?: { figure: string; word: string; at: number }; size?: number; cap?: number; labelCap?: number };
export const BigNumber: React.FC<BigNumberProps> = ({ num, at, second, size = 520, cap = 210, labelCap = 74 }) => {
  const f = useCurrentFrame();
  const k = f - at;
  const b = EZ.tankBurst(clamp01(k / 22));
  const s = lerpLog(0.42, 1, b) * (1 + 0.006 * Math.max(0, k - 22) / 30 * 1);
  const o = k < 0 ? 0 : clamp01((k + 1) / 5);
  const blur = 10 * (1 - b);
  const k2 = second ? f - second.at : -1;
  const slide = second ? EZ.quick(clamp01(k2 / 20)) : 0;
  const numFs = fs("bebas", size);
  const shiftX = -W * 0.17 * slide;
  const fast = k > 1 && k < 16;
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <RedStage o={o} />
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          <div style={{ position: "absolute", left: W / 2 + shiftX, top: H * 0.5, transform: `translate(-50%,-52%) scale(${s.toFixed(4)})`, opacity: o, filter: blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : undefined,
            fontFamily: FONT.bebas, fontSize: numFs, lineHeight: 1, color: "#F4F2F0", whiteSpace: "nowrap",
            textShadow: "0 0 2px rgba(255,255,255,.4), 0 0 40px rgba(200,10,20,.35), 0 18px 40px rgba(0,0,0,.8)" }}>{num}</div>
        </AbsoluteFill>
      </MBlur>
      {second && k2 >= 0 ? (
        <div style={{ position: "absolute", left: W / 2 + W * 0.08 + lerp(90, 0, slide), top: H * 0.5, transform: "translateY(-50%)", opacity: ghost(k2, 6, 0.2), whiteSpace: "nowrap" }}>
          <div style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), lineHeight: 0.95, color: "#E30A10", textShadow: "0 0 18px rgba(227,10,16,.45), 0 8px 18px rgba(0,0,0,.7)" }}>{second.figure}</div>
          <div style={{ fontFamily: FONT.oswald, fontWeight: 200, fontSize: fs("oswald", labelCap), lineHeight: 1.1, color: "#EDEDED", letterSpacing: "0.04em", opacity: ghost(k2 - 5, 5, 0) }}>{second.word}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
