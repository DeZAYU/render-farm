// Shared media primitives: asset paths, footage/photo layer, grade vignette, targeted blurs, motion-blur gate, depth of field, page plane.
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { LIB_PATHS } from "./config";
import { H, W } from "./tokens";

/** public-relative path -> URL (http(s) and data: pass through) */
export const asset = (src: string) => (/^(https?:|data:|blob:)/.test(src) || src.startsWith("/") ? src : staticFile(src));
export const isVideo = (src: string) => /\.(mp4|mov|webm|mkv)$/i.test(src);

/** a still or a (muted) clip filling its box. Clips: graded, 30 fps CFR, 1 source frame = 1 frame (Rule 2). */
export const Media: React.FC<{ src: string; startFrom?: number; fit?: "cover" | "contain"; pos?: string; style?: React.CSSProperties }> = ({ src, startFrom = 0, fit = "cover", pos = "50% 50%", style }) =>
  isVideo(src) ? (
    <OffthreadVideo muted src={asset(src)} startFrom={startFrom} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: pos, ...style }} />
  ) : (
    <Img src={asset(src)} style={{ width: "100%", height: "100%", objectFit: fit, objectPosition: pos, ...style }} />
  );

/** the measured DD grade vignette (multiply). Over footage/photos only, never over designed text. */
export const Vignette: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <Img src={staticFile(LIB_PATHS.vignette)} style={{ position: "absolute", inset: 0, width: W, height: H, mixBlendMode: "multiply", pointerEvents: "none", opacity }} />
);
/** a soft radial vignette for designed plates (pages, boards) */
export const PlateVig: React.FC<{ k?: number; tint?: string; inner?: number }> = ({ k = 0.62, tint = "12,8,8", inner = 42 }) => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) ${inner}%, rgba(${tint},${k}) 100%)`, pointerEvents: "none" }} />
);

/** D1 C: feathered elliptical blur over faces / injured people (screen px). Targeted, never full-frame. */
export const EBlur: React.FC<{ cx: number; cy: number; rx: number; ry: number; px?: number }> = ({ cx, cy, rx, ry, px = 18 }) => {
  const m = "radial-gradient(closest-side, #000 62%, rgba(0,0,0,0) 100%)";
  return <div style={{ position: "absolute", left: cx - rx, top: cy - ry, width: 2 * rx, height: 2 * ry, backdropFilter: `blur(${px}px)`, WebkitBackdropFilter: `blur(${px}px)`, WebkitMaskImage: m, maskImage: m }} />;
};
export type BlurRegion = { cx: number; cy: number; rx: number; ry: number; px?: number };
export const Blurs: React.FC<{ regions?: BlurRegion[] }> = ({ regions }) => <>{(regions ?? []).map((r, i) => <EBlur key={i} {...r} />)}</>;

/** CameraMotionBlur only while `on` (fast moves only; samples <= 8 keeps renders fast) */
export const MBlur: React.FC<{ on: boolean; samples?: number; children: React.ReactNode }> = ({ on, samples = 14, children }) =>
  on ? <CameraMotionBlur shutterAngle={180} samples={samples}>{children}</CameraMotionBlur> : <>{children}</>;

/** depth of field: a sharp copy kept in a horizontal screen band (centre y, half height), a blurred copy elsewhere (VV §6 / DD V3 E4) */
export const DOFBand: React.FC<{ y?: number; half: number; blur: number; feather?: number; children: React.ReactNode }> = ({ y = H / 2, half, blur, feather = 130, children }) => {
  const m = `linear-gradient(to bottom, transparent ${y - half - feather}px, #000 ${y - half}px, #000 ${y + half}px, transparent ${y + half + feather}px)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
/** radial depth of field (sharp ellipse in the centre, edges defocused) */
export const DOFRadial: React.FC<{ blur: number; rx?: number; ry?: number; children: React.ReactNode }> = ({ blur, rx = 62, ry = 58, children }) => {
  const m = `radial-gradient(ellipse ${rx}% ${ry}% at 50% 50%, #000 55%, transparent 100%)`;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>
      <AbsoluteFill style={{ WebkitMaskImage: m, maskImage: m }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- page plane (captured web pages: PNG at 2x DPR, rects in CSS px)
export type Rect = [number, number, number, number]; // css px [x, y, w, h]
/** a highlight on a page: "bar" = opaque bar UNDER the multiplied page (DD red bar / VV highlighter); "ink" = colour over the words (lighten: black text turns colour) */
/** "white" = DD bar under the page with the words inside re-inked white (M-024) */
export type PageBar = { r: Rect; p: number; c: string; mode?: "bar" | "ink" | "white"; px?: number; py?: number; radius?: number };
/** camera (cx, cy) in css px at the screen centre (ox, oy), s = screen px per css px, rot in deg. */
export const PagePlane: React.FC<{
  src: string; cssW: number; cssH: number; cx: number; cy: number; s: number; rot?: number; bars?: PageBar[]; bg?: string;
  ox?: number; oy?: number; imgFilter?: string; shadow?: string; clip?: [number, number]; children?: React.ReactNode;
}> = ({ src, cssW, cssH, cx, cy, s, rot = 0, bars = [], bg = "#fff", ox = W / 2, oy = H / 2, imgFilter, shadow = "0 30px 90px rgba(0,0,0,.55)", clip, children }) => {
  const y0 = clip ? clip[0] : 0, y1 = clip ? clip[1] : cssH;
  const bar = (b: PageBar, i: number) => {
    const px = b.px ?? 3, py = b.py ?? 2;
    return (
      <div key={i} style={{ position: "absolute", left: b.r[0] - px, top: b.r[1] - y0 - py, width: (b.r[2] + 2 * px) * Math.min(1, Math.max(0, b.p)), height: b.r[3] + 2 * py, background: b.c,
        mixBlendMode: b.mode === "ink" ? "lighten" : undefined, borderRadius: b.radius ?? (b.mode === "ink" ? 0 : 3) }} />
    );
  };
  const vis = bars.filter((b) => b.p > 0);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: cssW, height: y1 - y0, transformOrigin: "0 0", transform: `translate(${ox}px, ${oy}px) rotate(${rot}deg) scale(${s}) translate(${-cx}px, ${-(cy - y0)}px)`,
      background: bg, isolation: "isolate", boxShadow: shadow, overflow: "hidden" }}>
      {vis.filter((b) => b.mode !== "ink").map(bar)}
      <Img src={asset(src)} style={{ position: "absolute", left: 0, top: -y0, width: cssW, height: cssH, mixBlendMode: "multiply", filter: imgFilter }} />
      {vis.filter((b) => b.mode === "white").map((b, i) => {
        const px = b.px ?? 3, py = b.py ?? 2, L = b.r[0] - px, T = b.r[1] - y0 - py;
        return (
          <div key={`w${i}`} style={{ position: "absolute", left: L, top: T, width: (b.r[2] + 2 * px) * Math.min(1, Math.max(0, b.p)), height: b.r[3] + 2 * py, overflow: "hidden", mixBlendMode: "screen" }}>
            <Img src={asset(src)} style={{ position: "absolute", left: -L, top: -y0 - T, width: cssW, height: cssH, filter: "grayscale(1) invert(1) contrast(1.6)" }} />
          </div>
        );
      })}
      {vis.filter((b) => b.mode === "ink").map(bar)}
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- pixel person (Farrell YT blocky glyph, 7 x 13 cells)
export const PIXEL_PERSON = [
  "..XXX..", "..XXX..", "..XXX..", ".......", ".XXXXX.", "XXXXXXX", "X.XXX.X", "X.XXX.X", "..XXX..", "..X.X..", "..X.X..", "..X.X..", ".XX.XX.",
];
/** one SVG path (unit cells) of the pixel person; draw with transform scale(px) */
export const PP_PATH = PIXEL_PERSON.flatMap((row, r) => [...row].map((c, k) => (c === "X" ? `M${k} ${r}h1v1h-1z` : ""))).join("");

/** Re-creates its subtree on every frame. Use around TEXT that sits under an animated transform (scale/rise) together with CSS filters
 *  (glow / drop-shadow): in long multi-tab renders Chrome can reuse a stale compositor raster for such layers (wrong raster scale, bounds
 *  frozen from an earlier frame => words drawn at the wrong size and cut off; seen on c07/c13 openers, never in single stills).
 *  Never wrap video in it (it would remount the player every frame). */
export const FreshLayer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = Math.floor(useCurrentFrame());
  return <React.Fragment key={f}>{children}</React.Fragment>;
};
