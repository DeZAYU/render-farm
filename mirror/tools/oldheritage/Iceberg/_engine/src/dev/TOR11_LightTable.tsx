// TOR11 LightTable: Junko Tateishi's frame as a glossy photo print lying on a lit light table (cool white glow, faint register marks);
// the print settles, the camera eases down, and a black-rimmed loupe slides across the print and stops on the dark skirt at the
// funnel's foot: inside the glass the same frame magnified, so the soil and debris read; a small red tag names it. Built for TOR11 only.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT } from "../lib/core/type";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.55, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const LightTable: React.FC<{ src: string; iw: number; ih: number; focus: [number, number]; tag: string; mag?: number; slideAt?: [number, number]; tagAt?: number }> =
  ({ src, iw, ih, focus, tag, mag = 2.6, slideAt = [8, 44], tagAt = 50 }) => {
  const f = useCurrentFrame(); const { durationInFrames: n } = useVideoConfig();
  const drop = out(interpolate(f, [0, 16], [0, 1], cl));
  const u = io(interpolate(f, [0, n], [0, 1], cl));
  const PW = 1240, PH = (PW * ih) / iw, B = 26;                   // print image size + white border
  const px0 = 960 - PW / 2, py0 = 540 - PH / 2;
  // loupe: travels in from the right edge of the print to the focus, then drifts a hair
  const s = out(interpolate(f, [slideAt[0], slideAt[1]], [0, 1], cl));
  const fx = focus[0] + (1 - s) * 0.42 + 0.01 * u, fy = focus[1] + (1 - s) * -0.12;
  const R = 200, cx = fx * PW, cy = fy * PH;
  const cam = 1.0 + 0.16 * u;                                     // camera eases down onto the loupe
  const tg = out(interpolate(f, [tagAt, tagAt + 10], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#dfe5ea", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: `${((px0 + focus[0] * PW) / 1920) * 100}% ${((py0 + focus[1] * PH) / 1080) * 100}%` }}>
        {/* the light table: an even cool glow, brighter in the middle, faint register lines */}
        <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 65% at 50% 50%, #ffffff 0%, #f3f7fa 55%, #d9e0e6 100%)" }} />
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
          {Array.from({ length: 13 }, (_, i) => <line key={"v" + i} x1={i * 160} y1={0} x2={i * 160} y2={1080} stroke="#b9c3cc" strokeWidth={1} />)}
          {Array.from({ length: 8 }, (_, i) => <line key={"h" + i} x1={0} y1={i * 160} x2={1920} y2={i * 160} stroke="#b9c3cc" strokeWidth={1} />)}
        </svg>
        {/* the print */}
        <div style={{ position: "absolute", left: px0 - B, top: py0 - B, width: PW + 2 * B, height: PH + 2 * B, background: "#fbfbf8",
          transform: `translateY(${(1 - drop) * -40}px) rotate(${-1.6 + 0.4 * u}deg) scale(${1.05 - 0.05 * drop})`,
          boxShadow: `0 ${8 + 18 * (1 - drop)}px ${26 + 40 * (1 - drop)}px rgba(40,50,60,${0.28 + 0.12 * (1 - drop)})` }}>
          <div style={{ position: "absolute", left: B, top: B, width: PW, height: PH, overflow: "hidden" }}>
            <Img src={staticFile(src)} style={{ width: PW, height: PH, display: "block", filter: "contrast(1.04) saturate(.9)" }} />
            {/* the light table shines through the print a little: a faint lift in the shadows */}
            <div style={{ position: "absolute", inset: 0, background: "rgba(235,242,248,.06)" }} />
            {/* gloss */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(120deg, rgba(255,255,255,0) 30%, rgba(255,255,255,.10) 48%, rgba(255,255,255,0) 62%)" }} />
          </div>
          {/* the loupe sits on the print */}
          <div style={{ position: "absolute", left: B + cx - R, top: B + cy - R, width: 2 * R, height: 2 * R, borderRadius: "50%",
            boxShadow: "0 34px 60px rgba(20,25,30,.5), 0 0 0 16px #121212, 0 0 0 19px #4a4a4a, 0 0 0 21px #0c0c0c" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", background: "#000" }}>
              <Img src={staticFile(src)} style={{ position: "absolute", width: PW * mag, height: PH * mag, left: R - cx * mag, top: R - cy * mag, maxWidth: "none",
                filter: "brightness(1.3) contrast(1.18) saturate(.95)" }} />
              {/* lens: darkened rim + a curved highlight */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,.45) 100%)" }} />
              <div style={{ position: "absolute", left: R * 0.25, top: R * 0.12, width: R * 0.9, height: R * 0.45, borderRadius: "50%",
                background: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,.22), rgba(255,255,255,0) 70%)", transform: "rotate(-24deg)" }} />
            </div>
          </div>
          {/* red tag beside the loupe */}
          <div style={{ position: "absolute", left: B + cx + R + 34, top: B + cy - 26, opacity: tg, transform: `translateX(${(1 - tg) * -18}px)` }}>
            <div style={{ position: "absolute", left: -30, top: 26, width: 26 * tg, height: 4, background: RED }} />
            <div style={{ background: RED, padding: "8px 16px", fontFamily: FONT.archivo, fontWeight: 800, fontVariationSettings: "'wght' 800, 'wdth' 100", fontSize: 38, lineHeight: 1, color: "#0B0B0B", whiteSpace: "nowrap",
              boxShadow: "0 6px 16px rgba(0,0,0,.3)" }}>{tag}</div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
