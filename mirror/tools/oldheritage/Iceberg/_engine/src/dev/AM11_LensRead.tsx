// AM11 LensRead: the real Seattle Times report on the Cal/OSHA findings (26 Mar 1999, archive.seattletimes.com; captured with
// _tools/capture_page.py, the article block cut from the capture, nothing re-typed) as a printed sheet lying slightly askew over the dimmed
// footage. A reading loupe (round glass, thin bright rim, soft shadow, darker edge) glides over the paper and magnifies the line the VO is
// on: the headline and dateline first, then Disney's own manual ("comprehensive 8-hour training program"). Outside the loupe the page stays
// soft and a little darker. One thin red rule under the 8-hour phrase. No text of ours.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type LensKey = { at: number; x: number; y: number; k: number };  // lens centre on the page (px) + page zoom

const camAt = (f: number, keys: LensKey[], move = 24) => {
  let c = { ...keys[0] };
  for (let i = 1; i < keys.length; i++) {
    const b = keys[i]; if (f < b.at - move) break;
    const u = io(interpolate(f, [b.at - move, b.at], [0, 1], cl));
    c = { at: f, x: c.x + (b.x - c.x) * u, y: c.y + (b.y - c.y) * u, k: c.k + (b.k - c.k) * u };
  }
  return c;
};

export const LensRead: React.FC<{ page: string; pw: number; ph: number; bg: string; bgFrom?: number; keys: LensKey[]; mag?: number; r?: number; rule: { box: [number, number, number, number]; at: number } }> = ({ page, pw, ph, bg, bgFrom = 0, keys, mag = 2.0, r = 290, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = camAt(f, keys);
  const rise = out(interpolate(f, [0, 22], [0, 1], cl));
  const drift = io(f / dur);
  const k = c.k * (1 + 0.025 * drift);
  const lx = 960, ly = 540;
  const lift = (1 - rise) * 140;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const sheet = (scale: number, left: number, top: number, extra?: React.CSSProperties) => (
    <div style={{ position: "absolute", left, top, width: pw * scale, height: ph * scale, overflow: "hidden", ...extra }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${scale})`, transformOrigin: "0 0", background: "#F5F2EB" }}>
        <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, mixBlendMode: "multiply" }} />
        {ru > 0 && <div style={{ position: "absolute", left: rule.box[0], top: rule.box[3] + 3, height: 5, width: (rule.box[2] - rule.box[0]) * ru, background: RED }} />}
        <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.1 }}>
          <filter id="am11Paper"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={11} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width={pw} height={ph} filter="url(#am11Paper)" />
        </svg>
      </div>
    </div>
  );
  const K2 = k * mag;
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 + 0.04 * drift})` }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.28) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: rise, transform: `rotate(${-1.6 + 0.8 * drift}deg)` }}>
        {sheet(k, lx - c.x * k, ly - c.y * k + lift, { boxShadow: "0 40px 90px rgba(0,0,0,.8)", filter: "blur(1.4px) brightness(.78)" })}
        <div style={{ position: "absolute", left: lx - r, top: ly - r + lift, width: 2 * r, height: 2 * r, borderRadius: "50%", overflow: "hidden",
          boxShadow: "0 30px 60px rgba(0,0,0,.6), 0 0 0 4px rgba(245,245,240,.9), inset 0 0 26px rgba(0,0,0,.35)" }}>
          {sheet(K2, r - c.x * K2, r - c.y * K2)}
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 28%, rgba(255,255,255,.2) 0%, rgba(255,255,255,0) 30%), radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 74%, rgba(0,0,0,.3) 100%)" }} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
