// photo / KenBurnsParallax: full-frame photo, slow LINEAR push already moving on frame 1 (Farrell camera: photos pushed 0.6-1.4 %/s, openers
// up to 4.6-5.25 %/s @ OF 0:39.1; FA text T1b "Dallas" GF 7:22: a place label INSIDE the pushing photo, regular sans #DDE0D6, words popping
// 1 f; entry by the FA camera R5 flash-decay .87/.71/.50 @ GF 8:33.08; wp3 sec_A beat 3 @852). Our version (2.5-D, which Farrell keeps for
// openers only): a foreground layer, cut by a feathered mask (rect / ellipse / polygon in frame fractions) or given as a separate cut-out PNG,
// pushes faster than the background (parallax), and the label sits BETWEEN the two layers so the foreground occludes it (VV rule 8: depth by
// occlusion). Background optionally defocused a touch. DD grade vignette over everything.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { DECAY3, FONT, H, Media, Vignette, W, envAt, fs } from "../../core";
import type { Word } from "./shared";

export type FgMask = { shape: "rect" | "ellipse" | "poly"; pts: number[]; feather?: number }; // rect: x,y,w,h ; ellipse: cx,cy,rx,ry ; poly: x1,y1,x2,y2,... (all 0..1 of the frame)
export type KenBurnsParallaxProps = {
  src: string; // background photo (cover-fit)
  fg?: string; // cut-out PNG with alpha, same framing as src (wins over mask)
  mask?: FgMask; // or: a region of src lifted as the foreground
  push?: number; // background push, fraction per second (linear)
  parallax?: number; // foreground rate = push * (1 + parallax)
  origin?: [number, number]; // push origin (frame fractions)
  pan?: [number, number]; // px per second
  bgBlur?: number; // px defocus on the background layer (depth)
  words?: Word[]; // label words (pop 1 f each)
  label?: { x: number; y: number; cap?: number; align?: "left" | "center" }; // frame fractions
  flash?: boolean; // FA R5 flash-decay entry
  pos?: string;
  cap?: number; // label cap (overrides label.cap)
};

const maskUrl = (m: FgMask) => {
  const P = (i: number, s: number) => (m.pts[i] * s).toFixed(1);
  const shape =
    m.shape === "rect" ? `<rect x='${P(0, W)}' y='${P(1, H)}' width='${P(2, W)}' height='${P(3, H)}'/>`
    : m.shape === "ellipse" ? `<ellipse cx='${P(0, W)}' cy='${P(1, H)}' rx='${P(2, W)}' ry='${P(3, H)}'/>`
    : `<polygon points='${m.pts.map((v, i) => (v * (i % 2 ? H : W)).toFixed(1)).join(" ")}'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${W}' height='${H}' viewBox='0 0 ${W} ${H}'><filter id='f'><feGaussianBlur stdDeviation='${m.feather ?? 6}'/></filter><g fill='white' filter='url(#f)'>${shape}</g></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
};

export const KenBurnsParallax: React.FC<KenBurnsParallaxProps> = ({
  src, fg, mask, push = 0.014, parallax = 0.9, origin = [0.5, 0.45], pan = [0, 0], bgBlur = 0, words = [], label = { x: 0.08, y: 0.78, cap: 46 }, flash = true, pos, cap: capP,
}) => {
  const k = useCurrentFrame();
  const t = (k + 1) / 30; // already moving on frame 0
  const sB = 1.02 + push * t, sF = 1.02 + push * (1 + parallax) * t;
  const tx = pan[0] * t, ty = pan[1] * t;
  const o = `${origin[0] * 100}% ${origin[1] * 100}%`;
  const layer = (s: number, extraPan = 1): React.CSSProperties => ({ transformOrigin: o, transform: `translate(${(tx * extraPan).toFixed(2)}px, ${(ty * extraPan).toFixed(2)}px) scale(${s.toFixed(5)})` });
  const m = mask ? maskUrl(mask) : undefined;
  const cap = capP ?? label.cap ?? 46, f = fs("inter", cap);
  const sM = 1.02 + push * (1 + parallax * 0.45) * t; // label plane sits between the two layers
  const fl = flash ? envAt(DECAY3, k) : 0;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ ...layer(sB), filter: bgBlur ? `blur(${bgBlur}px)` : undefined }}><Media src={src} pos={pos} /></AbsoluteFill>
      {words.length ? (
        <AbsoluteFill style={layer(sM, 1.2)}>
          <div style={{ position: "absolute", left: label.align === "center" ? 0 : label.x * W, width: label.align === "center" ? W : undefined, top: label.y * H - f * 0.8, textAlign: label.align === "center" ? "center" : "left",
            fontFamily: FONT.inter, fontWeight: 400, fontSize: f, color: "#DDE0D6", whiteSpace: "pre", textShadow: "0 2px 10px rgba(0,0,0,.55)" }}>
            {words.map((w, i) => <span key={i} style={{ opacity: k >= w.at ? 1 : 0 }}>{w.text}{i < words.length - 1 ? " " : ""}</span>)}
          </div>
        </AbsoluteFill>
      ) : null}
      {fg || m ? (
        <AbsoluteFill style={{ ...layer(sF, 1.5), WebkitMaskImage: fg ? undefined : m, maskImage: fg ? undefined : m, WebkitMaskSize: "100% 100%", maskSize: "100% 100%",
          filter: "drop-shadow(0 10px 18px rgba(0,0,0,.35))" }}>
          <Media src={fg ?? src} pos={pos} />
        </AbsoluteFill>
      ) : null}
      <Vignette />
      {fl > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: fl }} /> : null}
    </AbsoluteFill>
  );
};
