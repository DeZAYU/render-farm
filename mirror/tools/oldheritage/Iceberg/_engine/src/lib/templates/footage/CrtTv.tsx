// footage / CrtTv: REF Visual Venture §14 CRT / TV push @0:03.0 (cold-open CRT set on black: +1.0 %/s LINEAR, rotation +0.18 deg/s, cut not
// stopped; a CRT treatment on the SCREEN LAYER ONLY: barrel ~0.08, 3 px scanlines at 18 %, inner vignette) and @1:03.0 (B/W room with the
// colour TV, +2.8 %/s). V4_BRIEF footage treatment "VV CRT/TV frame for news". OUR VERSION: a drawn 4:3 tube set (no stock image), the news
// clip cover-cropped into a curved screen with glass highlight, slight RGB misconvergence and a 2 % luminance flicker, screen light spilling on
// the floor. Use for archive / broadcast news clips (it says "this was on TV"), max once or twice a video.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, hash } from "../../core";
import { ClipLayer } from "../labels/kit";

export type CrtTvProps = { media: string; mediaStart?: number; rate?: number; rot?: number; screenW?: number; spill?: string; bw?: boolean };
export const CrtTv: React.FC<CrtTvProps> = ({ media, mediaStart = 0, rate = 0.01, rot = 0.18, screenW = 860, spill = "70,110,190", bw = false }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const s = 1 + rate * t;
  const sh = (screenW * 3) / 4;
  const bodyW = screenW + 150, bodyH = sh + 210;
  const flick = 1 + 0.02 * (hash(Math.floor(f) * 1.7) - 0.5);
  const screenRadius = "46px / 56px";
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      {/* screen light on the floor / wall behind */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 46% 40% at 50% 46%, rgba(${spill},.20), rgba(${spill},.05) 55%, rgba(0,0,0,0) 80%)` }} />
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 40% 9% at 50% 93%, rgba(${spill},.16), rgba(0,0,0,0) 100%)` }} />
      <div style={{ position: "absolute", left: W / 2, top: H / 2 - 10, transform: `translate(-50%,-50%) scale(${s.toFixed(5)}) rotate(${(rot * t).toFixed(4)}deg)` }}>
        {/* body */}
        <div style={{ position: "relative", width: bodyW, height: bodyH, borderRadius: 38, background: "linear-gradient(180deg, #3a3835 0%, #24221f 18%, #191816 70%, #0e0d0c 100%)",
          boxShadow: "inset 0 2px 0 rgba(255,255,255,.12), inset 0 -3px 6px rgba(0,0,0,.6), 0 40px 90px rgba(0,0,0,.85), 0 0 0 2px #0a0a09" }}>
          {/* bezel recess */}
          <div style={{ position: "absolute", left: 50, top: 46, width: screenW + 50, height: sh + 50, borderRadius: 30, background: "linear-gradient(160deg, #121110, #1d1b19 60%, #2a2825)", boxShadow: "inset 0 6px 14px rgba(0,0,0,.85), inset 0 -2px 2px rgba(255,255,255,.07)" }}>
            {/* tube */}
            <div style={{ position: "absolute", left: 25, top: 25, width: screenW, height: sh, borderRadius: screenRadius, overflow: "hidden", background: "#000", isolation: "isolate" }}>
              <div style={{ position: "absolute", left: -0.04 * screenW, top: -0.04 * sh, width: screenW * 1.08, height: sh * 1.08, filter: `brightness(${(1.06 * flick).toFixed(3)}) contrast(1.12) saturate(${bw ? 0 : 1.1})` }}>
                <ClipLayer src={media} startFrom={mediaStart} />
              </div>
              {/* misconvergence: a faint red copy offset */}
              <div style={{ position: "absolute", left: -0.04 * screenW + 2, top: -0.04 * sh, width: screenW * 1.08, height: sh * 1.08, opacity: 0.18, mixBlendMode: "screen", filter: "sepia(1) saturate(6) hue-rotate(-50deg)" }}>
                <ClipLayer src={media} startFrom={mediaStart} />
              </div>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.18) 0 1px, rgba(0,0,0,0) 1px 3px)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: screenRadius, boxShadow: "inset 0 0 70px 18px rgba(0,0,0,.85), inset 0 0 14px 4px rgba(0,0,0,.9)" }} />
              <div style={{ position: "absolute", inset: 0, borderRadius: screenRadius, background: "radial-gradient(ellipse 70% 55% at 32% 22%, rgba(255,255,255,.10), rgba(255,255,255,0) 60%), linear-gradient(170deg, rgba(255,255,255,.06), rgba(255,255,255,0) 40%)" }} />
            </div>
          </div>
          {/* control strip */}
          <div style={{ position: "absolute", left: 60, right: 60, bottom: 30, height: 64, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ flex: 1, height: 26, borderRadius: 6, backgroundImage: "repeating-linear-gradient(90deg, #0b0b0a 0 4px, #1f1d1b 4px 9px)", opacity: 0.9 }} />
            {[0, 1].map((i) => <div key={i} style={{ width: 38, height: 38, borderRadius: "50%", background: "radial-gradient(circle at 38% 32%, #4a4743, #151413 70%)", boxShadow: "0 3px 5px rgba(0,0,0,.7)" }} />)}
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff2a1a", boxShadow: "0 0 8px 2px rgba(255,42,26,.7)" }} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
