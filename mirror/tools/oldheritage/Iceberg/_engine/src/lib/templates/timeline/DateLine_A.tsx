// timeline / DateLine_A (EDITOR A sibling of HorizonCard / ChapterCard / HorizonTrack; Amusement Park 2026-10-19).
// REF VV 2026 2:10-2:22 "2001 DAVID CASTOR" -> "2003 THE SECOND MARRIAGE" (TEMPLATE_UPGRADES #9): a thin light line draws out from the centre
// (5 f), the small year + Bebas title fade up, a torn-edge photo RISES FROM BEHIND THE LINE (~0.7 s, EZ.quick), and inside the same card the
// photo cross-swaps to the next year (state change). Skin: white line + red year (never VV gold); it sits on the case's own footage / photo
// blurred and dimmed (never empty black). Camera: the whole card pushes +3 %/s (VV dated card +3-5 %/s). SFX (case mix): transition_whoosh
// on the line draw, dip_whoosh on the photo rise.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, useCurrentFrame } from "remotion";
import { EZ, FONT, RoundText, W, asset, clamp01, fs, isVideo, lerp } from "../../core";
import { tornClip } from "../../core/kits/photo";

export type DLStep = { year: string; title: string; media: string; mediaStart?: number; at: number; pos?: string };
export type DateLineAProps = { steps: DLStep[]; bg: string; bgStart?: number; lineY?: number; exitAt?: number; photoW?: number; photoH?: number };
export const DateLine_A: React.FC<DateLineAProps> = ({ steps, bg, bgStart = 0, lineY = 640, exitAt, photoW = 620, photoH = 400 }) => {
  const f = useCurrentFrame();
  const z = 1 + 0.03 * (f / 30);
  const lu = EZ.out3(clamp01((f - steps[0].at) / 5));
  const ex = exitAt === undefined ? 0 : EZ.in2((f - exitAt) / 12);
  const cur = steps.reduce((a, s, i) => (f >= s.at ? i : a), 0);
  const clip = tornClip(photoW, photoH, 5, 8, 14);
  const media = (m: string, s = 0) => (isVideo(m) ? <OffthreadVideo muted src={asset(m)} startFrom={s} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Img src={asset(m)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(18px) brightness(.34) saturate(.55)", transform: `scale(${(1.1 * z).toFixed(4)})` }}>{media(bg, bgStart)}</AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(5)})`, transformOrigin: `50% ${lineY}px`, opacity: 1 - ex }}>
        {/* photos rise from behind the line (masked above it) */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lineY, overflow: "hidden" }}>
          {steps.map((s, i) => {
            const k = f - s.at - 4; if (k < 0) return null;
            const ru = EZ.quick(clamp01(k / 21));
            const xo = i < cur ? 1 - clamp01((f - steps[i + 1].at) / 10) : 1;
            if (xo <= 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: W / 2 - photoW / 2, top: lerp(lineY + 20, lineY - photoH - 26, ru), width: photoW, height: photoH, opacity: xo, clipPath: clip,
                filter: "grayscale(1) contrast(1.08) brightness(.92) drop-shadow(0 18px 40px rgba(0,0,0,.6))", transform: `rotate(${(-1.2 + i * 2.1).toFixed(2)}deg)` }}>
                {media(s.media, s.mediaStart)}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: W / 2 - 560 * lu, top: lineY - 1.5, width: 1120 * lu, height: 3, background: "#F2F2F2", boxShadow: "0 0 12px rgba(255,255,255,.7)" }} />
        {steps.map((s, i) => {
          const k = f - s.at - 3; if (k < 0) return null;
          const xo = i < cur ? 1 - clamp01((f - steps[i + 1].at) / 8) : 1;
          if (xo <= 0) return null;
          const o = EZ.out2(k / 10) * xo; const r = 14 * (1 - EZ.out3(k / 18));
          return (
            <div key={i} style={{ position: "absolute", left: 0, width: W, top: lineY + 24 + r, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, opacity: o }}>
              <div style={{ filter: "drop-shadow(0 0 6px rgba(242,37,34,.65)) drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}><RoundText text={s.year} cap={40} colour="#F22522" /></div>
              <div style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", 70), lineHeight: 1, letterSpacing: "0.03em", color: "#EEEDED", textShadow: "0 0 8px rgba(255,255,255,.22), 0 4px 10px rgba(0,0,0,.7)", whiteSpace: "nowrap" }}>{s.title}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
