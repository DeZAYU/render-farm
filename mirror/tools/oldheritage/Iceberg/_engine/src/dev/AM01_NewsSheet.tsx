// AM01 NewsSheet: the real WMBB News 13 story (mypanhandle.com, 22 Aug 2019, captured from the Wayback Machine copy with
// _tools/capture_page.py, laid out as its print view: the real masthead, headline, dateline and paragraphs) as a printed sheet in 3-D.
// The sheet rises out of the dark over the burst-cord footage (blurred, far behind it), tilted back on its bottom edge, the outlet's
// masthead and headline first; the camera then glides down the paper to the state's statement while the sheet eases flatter. Shallow
// focus: only a band of the page around the focus line is sharp, the rest of the paper falls soft; the statement's paragraph stays full
// strength while the lines around it fade back. Paper feel: soft contact shadow, a faint warm grain and a light falloff across the sheet.
// One red mark only: a thin red rule draws under "the allowable number of uses" when the VO reaches it.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number]; // page px (x0, y0, x1, y1)
type Key = { at: number; y: number; k: number; tilt: number };

const camAt = (f: number, keys: Key[]) => {
  let c = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u, tilt: a.tilt + (b.tilt - a.tilt) * u };
  }
  return c;
};

export const NewsSheet: React.FC<{ page: string; pw: number; ph: number; bg: string; bgFrom?: number; keys: Key[]; para: [number, number]; rule: { box: Box; at: number } }> = ({ page, pw, ph, bg, bgFrom = 0, keys, para, rule }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const c = camAt(f, keys);
  const rise = out(interpolate(f, [0, 26], [0, 1], cl));
  const fy = c.y;                                       // page y at screen centre
  const left = 960 - (pw / 2) * c.k, top = 540 - fy * c.k + (1 - rise) * 260;
  const band = 230 / Math.max(0.35, c.k) * 0.6;          // sharp band half-height (page px)
  const mask = `linear-gradient(180deg, transparent ${((fy - band * 2.2) / ph) * 100}%, #000 ${((fy - band) / ph) * 100}%, #000 ${((fy + band) / ph) * 100}%, transparent ${((fy + band * 2.2) / ph) * 100}%)`;
  const dimOthers = io(interpolate(f, [keys[keys.length - 2]?.at ?? 0, keys[keys.length - 1].at], [0, 1], cl)) * 0.45;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const sheet = (blur: number, m?: string) => (
    <div style={{ position: "absolute", inset: 0, filter: blur ? `blur(${blur}px)` : undefined, WebkitMaskImage: m, maskImage: m }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
      {/* lines around the statement fall back */}
      <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: para[0], background: `linear-gradient(180deg, rgba(246,243,236,${dimOthers}) 0%, rgba(246,243,236,${dimOthers}) calc(100% - 60px), rgba(246,243,236,0) 100%)` }} />
      <div style={{ position: "absolute", left: 0, top: para[1], width: pw, height: ph - para[1], background: `linear-gradient(180deg, rgba(246,243,236,0) 0%, rgba(246,243,236,${dimOthers}) 60px, rgba(246,243,236,${dimOthers}) 100%)` }} />
      {ru > 0 && <div style={{ position: "absolute", left: rule.box[0], top: rule.box[3] - 2, height: 6, width: (rule.box[2] - rule.box[0]) * ru, background: RED }} />}
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050607", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${1.15 + 0.05 * (f / dur)})` }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(16px) brightness(.35) saturate(.7)" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 30%" }}>
        <div style={{ position: "absolute", left, top, width: pw * c.k, height: ph * c.k, transformOrigin: `50% ${(fy / ph) * 100}%`,
          transform: `rotateX(${c.tilt + (1 - rise) * 16}deg) rotateZ(${-2.2 + 1.2 * io(f / dur)}deg)`, opacity: rise,
          boxShadow: "0 40px 90px rgba(0,0,0,.75), 0 8px 18px rgba(0,0,0,.5)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k})`, transformOrigin: "0 0", background: "#F6F3EC" }}>
            {sheet(5)}
            {sheet(0, mask)}
            {/* paper: warm grain + light falloff */}
            <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.16,
              background: "radial-gradient(ellipse 70% 50% at 40% 35%, rgba(255,250,240,0) 0%, rgba(120,105,85,.9) 100%)" }} />
            <svg width={pw} height={ph} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.1 }}>
              <filter id="amPaper"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={4} /><feColorMatrix type="saturate" values="0" /></filter>
              <rect width={pw} height={ph} filter="url(#amPaper)" />
            </svg>
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
