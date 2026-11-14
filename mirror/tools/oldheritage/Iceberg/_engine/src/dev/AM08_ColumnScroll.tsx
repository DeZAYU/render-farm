// AM08 ColumnScroll: The News Minute's real story (21 Jun 2019, captured with _tools/capture_page.py, article column only:
// headline, standfirst, lede photo, byline, paragraphs; nothing re-typed) as one long printed column standing in 3-D, turned
// away from the camera on its vertical axis like a strip of newsprint held up beside the frame, over the dark blurred clip.
// The camera starts on the headline, glides down the column to the assistant commissioner's paragraph and a soft lit band
// settles on "tried to hide the whole thing" (the one red rule draws under it), then glides back UP the column to the April
// paragraph and the band moves onto "claimed that they had checked everything", while the rest of the column falls back.
// Keys: page y at the frame centre + scale + turn (deg); `bands` = lit line boxes (page px) with the frame they light at.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number];
type Key = { at: number; y: number; k: number; turn: number };
type Band = { at: number; box: Box; lines: Box[]; red?: boolean };

const camAt = (f: number, keys: Key[]) => {
  let c = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u, turn: a.turn + (b.turn - a.turn) * u };
  }
  return c;
};

export const ColumnScroll: React.FC<{ page: string; pw: number; ph: number; bg: string; bgFrom?: number; keys: Key[]; bands: Band[]; x?: number }> = ({ page, pw, ph, bg, bgFrom = 0, keys, bands, x = 1010 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = camAt(f, keys);
  const rise = out(interpolate(f, [0, 24], [0, 1], cl));
  // which band is lit (the latest that has started), and how far its light has come up
  let cur = -1; bands.forEach((b, i) => { if (f >= b.at) cur = i; });
  const lit = cur < 0 ? 0 : io(interpolate(f, [bands[cur].at, bands[cur].at + 16], [0, 1], cl));
  const prev = cur > 0 ? bands[cur - 1] : null;
  const dim = 0.5 * (cur < 0 ? 0 : cur === 0 ? lit : 1);
  // the lit band box eases from the previous one to the current one
  const bx = cur < 0 ? null : prev ? bands[cur].box.map((v, i) => prev.box[i] + (v - prev.box[i]) * lit) as Box : bands[cur].box;
  const pad = 18;
  return (
    <AbsoluteFill style={{ background: "#040506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.18 + 0.05 * (f / dur)})` }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.3) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "40% 50%" }}>
        <div style={{ position: "absolute", left: x - (pw / 2) * c.k, top: 540 - c.y * c.k + (1 - rise) * 220, width: pw * c.k, height: ph * c.k,
          transformOrigin: `50% ${(c.y / ph) * 100}%`, transform: `rotateY(${c.turn + (1 - rise) * 10}deg) rotateX(3deg) rotateZ(-0.8deg)`, opacity: rise,
          boxShadow: "30px 40px 90px rgba(0,0,0,.8), 0 8px 18px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k})`, transformOrigin: "0 0", background: "#FBFAF7" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
            {/* the rest of the column falls back; the lit band keeps full strength */}
            {bx && (
              <svg width={pw} height={ph} style={{ position: "absolute", inset: 0 }}>
                <defs>
                  <mask id="am08cut"><rect width={pw} height={ph} fill="#fff" /><rect x={bx[0] - pad} y={bx[1] - pad} width={bx[2] - bx[0] + 2 * pad} height={bx[3] - bx[1] + 2 * pad} rx={10} fill="#000" /></mask>
                  <filter id="am08soft"><feGaussianBlur stdDeviation="14" /></filter>
                </defs>
                <g mask="url(#am08cut)"><rect width={pw} height={ph} fill="#FBFAF7" opacity={dim} /></g>
              </svg>
            )}
            {/* one red rule, under the phrase that matters */}
            {bands.map((b, i) => {
              if (!b.red || f < b.at) return null;
              const u = out(interpolate(f, [b.at + 10, b.at + 30], [0, 1], cl));
              const total = b.lines.reduce((s, l) => s + (l[2] - l[0]), 0);
              let acc = 0;
              return b.lines.map((l, j) => {
                const w = l[2] - l[0], seg = Math.max(0, Math.min(1, (u * total - acc) / w)); acc += w;
                return <div key={`${i}-${j}`} style={{ position: "absolute", left: l[0], top: l[3] - 6, height: 6, width: w * seg, background: RED }} />;
              });
            })}
            {/* paper: faint grain + light falloff across the strip */}
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.18,
              background: "linear-gradient(90deg, rgba(110,100,85,.9) 0%, rgba(255,250,240,0) 30%, rgba(255,250,240,0) 70%, rgba(110,100,85,.9) 100%)" }} />
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.09 }}>
              <filter id="am08paper"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={8} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width={pw} height={ph} filter="url(#am08paper)" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 52% 50%, rgba(0,0,0,0) 48%, rgba(0,0,0,.62) 100%)" }} />
    </AbsoluteFill>
  );
};
