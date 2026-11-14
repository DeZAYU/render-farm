// DC08-DC10 helpers (not devices): a virtual camera over a clip of any aspect (the Ball PD tape is 4:3 with its burned-in stamp
// below the 16:9 window), a still with an eased push, and the typewriter-strike case title (style B from dev/TitleStyles.tsx).
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, staticFile, useCurrentFrame } from "remotion";
import { cl, io, out, useDcFonts } from "./DC01_kit";
export { cl, io, out };

export type CK = { f: number; s: number; x: number; y: number };
export const camAt = (f: number, keys: CK[]) => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i];
    if (f <= b.f) { const u = io((f - a.f) / Math.max(1, b.f - a.f)); return { f, s: a.s + (b.s - a.s) * u, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  }
  return keys[keys.length - 1];
};
/** picture box for a camera state; s = 1 fills the frame width; ar = picture aspect */
export const placeAr = (c: { s: number; x: number; y: number }, ar: number, W = 1920, H = 1080) => {
  const w = W * c.s, h = w / ar;
  const left = Math.min(0, Math.max(W - w, W / 2 - c.x * w)), top = Math.min(0, Math.max(H - h, H / 2 - c.y * h));
  return { left, top, w, h };
};
/** two-key shorthand */
export const K2 = (n: number, a: [number, number, number], b: [number, number, number]): CK[] => [{ f: 0, s: a[0], x: a[1], y: a[2] }, { f: n, s: b[0], x: b[1], y: b[2] }];

/** the clip through the camera (live from `from` at `rate`, or frozen at `t`), `layers` drawn in picture space */
export const CamA: React.FC<{ src: string; keys: CK[]; ar?: number; from?: number; t?: number; rate?: number; filter?: string; layers?: React.ReactNode }> = ({ src, keys, ar = 16 / 9, from = 0, t, rate = 1, filter, layers }) => {
  const f = useCurrentFrame();
  const p = placeAr(camAt(f, keys), ar);
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, filter };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {t !== undefined
        ? <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
        : <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={rate} muted style={st} />}
      {layers && <div style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h }}>{layers}</div>}
    </AbsoluteFill>
  );
};

export const Still: React.FC<{ src: string; n: number; s0: number; s1: number; fx: number; fy: number }> = ({ src, n, s0, s1, fx, fy }) => {
  const f = useCurrentFrame(); const s = s0 + (s1 - s0) * io(Math.min(1, f / n));
  return <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${s})`, transformOrigin: `${fx * 100}% ${fy * 100}%` }} /></AbsoluteFill>;
};

/** case title, style B: letters struck one by one with a small ink settle, then the place · year line */
export const TypeTitle: React.FC<{ title: string; place: string; bg: string; dur: number; pos?: string }> = ({ title, place, bg, dur, pos = "50% 50%" }) => {
  useDcFonts();
  const f = useCurrentFrame(), per = Math.min(2.2, 56 / title.length), start = 10, z = 1.06 + 0.07 * io(Math.min(1, f / dur));
  const pa = start + title.length * per + 6, pt = io(Math.max(0, Math.min(1, (f - pa) / 18)));
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, transform: `scale(${z})`, filter: "brightness(0.42) contrast(1.1) saturate(0.6) blur(2px)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0) 30%, rgba(0,0,0,.7) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 462, textAlign: "center", fontFamily: "Elite", fontSize: Math.min(92, Math.round(1720 / (title.length * 0.66))), letterSpacing: "0.06em", color: "#F2F2F0",
        textShadow: "0 0 18px rgba(255,255,255,.22), 0 2px 8px rgba(0,0,0,.75)" }}>
        {title.split("").map((c, i) => { const a = f - start - i * per; const j = a >= 0 && a < 3 ? (3 - a) * 0.6 : 0;
          return <span key={i} style={{ opacity: a < 0 ? 0 : 1, display: "inline-block", transform: `translateY(${-j}px)`, filter: `blur(${j * 0.3}px)`, whiteSpace: "pre" }}>{c}</span>; })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 590, textAlign: "center", fontFamily: "ArchivoBlk", fontWeight: 700, fontStretch: "110%",
        fontSize: 26, letterSpacing: "0.32em", color: "rgba(242,242,240,.78)", opacity: pt, transform: `translateY(${(1 - pt) * 6}px)` }}>{place}</div>
    </AbsoluteFill>
  );
};
