// AM05 ReadLine: the real IBTimes UK story (1 Oct 2014, captured live with _tools/capture_page.py; ads and sidebar cut away, the
// article's own masthead, headline, byline, photo and paragraphs kept as they are) as one printed sheet standing in the dark in front
// of the blurred woods, turned away on its vertical axis. The camera first reads the masthead and headline, then tracks sideways and
// down while the sheet turns to face it, settling on the spokeswoman's quote. The page falls into shadow except the key line(s); a soft
// reading light runs along each key line in turn as the VO says it (left to right, like an eye reading), and one thin red rule draws
// under the single phrase that matters ("during the night"). No re-typed text: everything on screen is the captured page.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number]; // page px x0 y0 x1 y1
type Key = { at: number; x: number; y: number; k: number; ry: number };

const cam = (f: number, ks: Key[]) => {
  let c = ks[0];
  for (let i = 1; i < ks.length; i++) {
    const a = ks[i - 1], b = ks[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u, ry: a.ry + (b.ry - a.ry) * u };
  }
  return c;
};

export const ReadLine: React.FC<{ page: string; pw: number; ph: number; bg: string; keys: Key[]; lines: { box: Box; at: number; len: number }[]; shadeAt: number; rule: { boxes: Box[]; at: number } }> = ({ page, pw, ph, bg, keys, lines, shadeAt, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = cam(f, keys);
  const inn = out(interpolate(f, [0, 22], [0, 1], cl));
  const shade = io(interpolate(f, [shadeAt, shadeAt + 18], [0, 1], cl)) * 0.62;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const pad = 14;
  // shadow mask: the page darkens everywhere except the key lines (one rect per line, soft edges)
  const holes = lines.map(({ box: [x0, y0, x1, y1] }, i) => <rect key={i} x={x0 - pad} y={y0 - pad} width={x1 - x0 + 2 * pad} height={y1 - y0 + 2 * pad} rx={10} fill="#000" />);
  return (
    <AbsoluteFill style={{ background: "#040506", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.12 + 0.05 * (f / dur)})` }}>
        <Img src={staticFile(bg)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(18px) brightness(.3) saturate(.6)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 2200, perspectiveOrigin: "50% 45%" }}>
        <div style={{ position: "absolute", left: 960 - c.x * c.k + (1 - inn) * 380, top: 540 - c.y * c.k, width: pw * c.k, height: ph * c.k,
          transformOrigin: `${(c.x / pw) * 100}% ${(c.y / ph) * 100}%`, transform: `rotateY(${c.ry + (1 - inn) * 22}deg) rotateX(4deg)`, opacity: inn,
          boxShadow: "0 50px 100px rgba(0,0,0,.8), 0 10px 22px rgba(0,0,0,.55)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k})`, transformOrigin: "0 0", background: "#F7F5F0" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
            {/* the page falls into shadow except the key lines */}
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0 }}>
              <defs>
                <filter id="am05soft"><feGaussianBlur stdDeviation="9" /></filter>
                <mask id="am05m"><rect width={pw} height={ph} fill="#fff" /><g filter="url(#am05soft)">{holes}</g></mask>
              </defs>
              <rect width={pw} height={ph} fill="#0a0b0c" opacity={shade} mask="url(#am05m)" />
            </svg>
            {/* reading light: runs along each key line as it is spoken */}
            {lines.map(({ box: [x0, y0, x1, y1], at, len }, i) => {
              const u = interpolate(f, [at, at + len], [0, 1], cl);
              if (u <= 0) return null;
              const lw = x1 - x0, cx = x0 + lw * u;
              const fade = u >= 1 ? 0.35 : 1;
              return (
                <div key={i} style={{ position: "absolute", left: x0 - 40, top: y0 - 18, width: lw + 80, height: y1 - y0 + 36, mixBlendMode: "multiply", opacity: 0.22 * fade,
                  background: `radial-gradient(ellipse 160px 60% at ${cx - x0 + 40}px 50%, rgba(255,214,150,1) 0%, rgba(255,214,150,0) 100%)` }} />
              );
            })}
            {ru > 0 && rule.boxes.map((b, i) => {
              const tot = rule.boxes.reduce((m, q) => m + q[2] - q[0], 0), before = rule.boxes.slice(0, i).reduce((m, q) => m + q[2] - q[0], 0);
              const w = Math.max(0, Math.min(b[2] - b[0], ru * tot - before));
              return w > 0 ? <div key={i} style={{ position: "absolute", left: b[0], top: b[3] + 4, height: 6, width: w, background: RED }} /> : null;
            })}
            {/* paper falloff */}
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.18, background: "radial-gradient(ellipse 75% 55% at 45% 50%, rgba(255,250,240,0) 0%, rgba(110,98,80,.9) 100%)" }} />
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
