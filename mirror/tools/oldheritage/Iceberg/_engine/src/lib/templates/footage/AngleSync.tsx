// footage / AngleSync (set dash2, Dashcam "INSTRUMENT" H5): two cameras of ONE event, aligned to the same instant.
// REF Dashcam Vol.2 C12 split @11:21-13:12 (two angles side by side, full-frame switches on the key beats @11:55-11:58, 12:31-12:33) + D2 C19
// stacked split (seam y ~ 503) + Nocturn NB8 LOST @3:12.5 (hard 2-up, 4 s) + D2 E6 PiP grow bezier(0.40,0.22,0.00,0.92) over 2.57 s (77 f).
// Ours: a 2-up (side by side or stacked) with a shared SOURCE-TIMECODE chip at the seam in the theme's numeral face (D-DIN Exp), so the viewer
// sees both clips sit on the same instant; on the key beat the winning side grows to full frame with the D2 bezier over 2.57 s. Silent.
import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, staticFile, useCurrentFrame } from "remotion";
import { WATERPARK, EZ, FPS, H, Media, W, clamp01, lerp, linPush, type Theme } from "../../core";
import { LIB_PATHS } from "../../core/config";
import { themeFs } from "../lookhere/dash2kit";

const GROW = Easing.bezier(0.4, 0.22, 0, 0.92);
export type AngleSide = { media: string; mediaStart?: number; pos?: string; label?: string };
export type AngleSyncProps = {
  a: AngleSide; b: AngleSide; // a = left / top, b = right / bottom; mediaStart of both = the SAME instant
  layout?: "side" | "stacked";
  gap?: number; // seam px
  push?: number; // linear push inside each panel
  tcStart?: number; // source timecode (seconds since midnight, or since the clip start) shown at local 0
  tcFormat?: "clock" | "tc"; // "clock" = 14:32:07, "tc" = 00:12.40 (mm:ss.ff)
  tcCap?: number;
  winner?: "a" | "b"; growAt?: number; growDur?: number; // D2: 77 f
  theme?: Theme;
};

const pad = (n: number, d = 2) => String(Math.floor(n)).padStart(d, "0");
const fmt = (t: number, mode: "clock" | "tc") => {
  if (mode === "clock") { const s = Math.floor(t) % 86400; return `${pad(s / 3600)}:${pad((s % 3600) / 60)}:${pad(s % 60)}`; }
  const ff = Math.floor((t - Math.floor(t)) * FPS);
  return `${pad(t / 60)}:${pad(Math.floor(t) % 60)}.${pad(ff)}`;
};

export const AngleSync: React.FC<AngleSyncProps> = ({ a, b, layout = "side", gap = 6, push = 0.02, tcStart = 0, tcFormat = "clock", tcCap = 30, winner = "a", growAt, growDur = 77, theme = WATERPARK }) => {
  const f = useCurrentFrame();
  const g = growAt === undefined ? 0 : GROW(clamp01((f - growAt) / growDur));
  const side = layout === "side";
  // rest rects
  const half = side ? (W - gap) / 2 : (H - gap) / 2;
  const rest = {
    a: side ? { x: 0, y: 0, w: half, h: H } : { x: 0, y: 0, w: W, h: half },
    b: side ? { x: half + gap, y: 0, w: half, h: H } : { x: 0, y: half + gap, w: W, h: half },
  };
  const full = { x: 0, y: 0, w: W, h: H };
  const rectOf = (key: "a" | "b") => {
    const r = rest[key];
    if (key !== winner || g === 0) return r;
    return { x: lerp(r.x, full.x, g), y: lerp(r.y, full.y, g), w: lerp(r.w, full.w, g), h: lerp(r.h, full.h, g) };
  };
  const panel = (key: "a" | "b", sd: AngleSide) => {
    const r = rectOf(key);
    const lo = clamp01(1 - (growAt === undefined ? 0 : (f - growAt) / 6));
    return (
      <div key={key} style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, overflow: "hidden", zIndex: key === winner ? 2 : 1 }}>
        <AbsoluteFill style={{ transform: `scale(${linPush(f, push).toFixed(5)})` }}>
          <Sequence layout="none"><Media src={sd.media} startFrom={sd.mediaStart ?? 0} pos={sd.pos} /></Sequence>
        </AbsoluteFill>
        {sd.label && lo > 0 ? (
          <div style={{ position: "absolute", left: 28, top: 24, padding: "8px 14px", background: theme.plateDark, color: theme.neutral, opacity: lo * EZ.out2(f / 7),
            fontFamily: theme.text.face, fontWeight: theme.text.weight, fontSize: themeFs(theme.text.face, 28), letterSpacing: "0.06em" }}>{sd.label}</div>
        ) : null}
      </div>
    );
  };
  // timecode chip at the seam (bottom of the vertical seam / right end of the horizontal seam), fades out in 6 f as the grow starts
  const tcO = EZ.out2(f / 7) * (growAt === undefined ? 1 : 1 - clamp01((f - growAt) / 6));
  const tcF = themeFs(theme.num.face, tcCap);
  const chipPos = side ? { left: W / 2, top: H * 0.9 } : { left: W / 2, top: half + gap / 2 };
  return (
    <AbsoluteFill style={{ background: "#07090B", overflow: "hidden" }}>
      {panel("a", a)}
      {panel("b", b)}
      {/* M-062: the multiply vignette is mounted directly in the panels' stacking context with zIndex on the image itself (a zIndex wrapper
          isolates the blend and paints the white-centred PNG as a veil) */}
      <Img src={staticFile(LIB_PATHS.vignette)} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, mixBlendMode: "multiply", pointerEvents: "none", opacity: 0.8, zIndex: 3 }} />
      {tcO > 0 ? (
        <div style={{ position: "absolute", ...chipPos, zIndex: 4, transform: `translate(-50%, -50%) translateY(${(6 * (1 - EZ.out3(f / 8))).toFixed(1)}px)`, opacity: tcO,
          padding: `${Math.round(tcCap * 0.42)}px ${Math.round(tcCap * 0.7)}px`, background: theme.plateDark,
          fontFamily: theme.num.face, fontWeight: theme.num.weight, fontSize: tcF, lineHeight: 1, color: theme.neutral, fontVariantNumeric: "tabular-nums", whiteSpace: "pre" }}>
          {fmt(tcStart + f / FPS, tcFormat)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
