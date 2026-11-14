// AM10 BacklitPage: "Prosecutors went through this same footage…" The mall's own CCTV keeps playing full frame; the real Egypt
// Independent report (29 May 2023, Wayback copy captured with _tools/capture_page.py: masthead, headline, dateline and three of its
// paragraphs, ads and the crowd photo left out, nothing re-typed) slides up over it as a thin sheet held against the light, so the
// CCTV still glows through the paper. Each paragraph comes through the paper (full ink, sharp) as the VO reaches it while the ones
// already read fall back to a pale print; the sheet drifts slowly toward the camera. No red: the page's own link colour stays.
// (13 Nov night: page fitted to 1640 px so the paragraphs read; the inactive ones sit under a paper veil.)
// Props: `paras` = [y0, y1, at] in page px / frames: the paragraph bands that light in turn; `head` = [y0, y1] always readable.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const BacklitPage: React.FC<{ page: string; pw: number; ph: number; bg: string; bgFrom: number; crop?: { s: number; x: number; y: number };
  head: [number, number]; paras: [number, number, number][]; slideAt?: number }> = ({ page, pw, ph, bg, bgFrom, crop = { s: 1, x: 0.5, y: 0.5 }, head, paras, slideAt = 24 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const up = out(interpolate(f, [slideAt, slideAt + 30], [0, 1], cl));
  // page placement: fit width ~1180 px, then a slow drift closer
  const k = (1640 / pw) * (1 + 0.06 * io(interpolate(f, [slideAt, dur], [0, 1], cl)));
  // follow the active paragraph: page y at frame centre
  let cur = -1; paras.forEach((p, i) => { if (f >= p[2]) cur = i; });
  const focusY = (() => {
    const tgt = paras.map((p) => (p[0] + p[1]) / 2);
    const startY = Math.min(ph / 2, (head[0] + head[1]) / 2 + 260);
    if (cur < 0) return startY;
    const from = cur === 0 ? startY : tgt[cur - 1];
    return from + (tgt[cur] - from) * io(interpolate(f, [paras[cur][2] - 6, paras[cur][2] + 22], [0, 1], cl));
  })();
  const top = 540 - focusY * k + (1 - up) * 1100;
  const W = 1920 * crop.s, H = 1080 * crop.s;
  const vl = Math.min(0, Math.max(1920 - W, 960 - crop.x * W)), vt = Math.min(0, Math.max(1080 - H, 540 - crop.y * H));
  const ink = (i: number) => {
    if (i > cur) return 0.42;
    if (i === cur) return 0.42 + 0.58 * io(interpolate(f, [paras[i][2], paras[i][2] + 14], [0, 1], cl));
    return 1 - 0.45 * io(interpolate(f, [paras[i + 1][2], paras[i + 1][2] + 14], [0, 1], cl));
  };
  const bands: [number, number, number][] = [[head[0], head[1], 1], ...paras.map((p, i) => [p[0], p[1], ink(i)] as [number, number, number])];
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: vl, top: vt, width: W, height: H }}>
        <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", filter: `brightness(${1 - 0.35 * up}) blur(${3 * up}px)` }} />
      </div>
      <div style={{ position: "absolute", left: 960 - (pw * k) / 2, top, width: pw * k, height: ph * k, transform: `rotate(${-1.4 + 0.6 * up}deg)`,
        boxShadow: `0 30px 80px rgba(0,0,0,${0.55 * up})` }}>
        {/* the sheet: thin paper, the CCTV light glowing through it */}
        <div style={{ position: "absolute", inset: 0, background: "rgba(250,248,243,.80)" }} />
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", mixBlendMode: "screen", opacity: 0.22 }}>
          <div style={{ position: "absolute", left: (vl - (960 - (pw * k) / 2)), top: vt - top, width: W, height: H }}>
            <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ width: "100%", height: "100%", filter: "blur(10px)" }} />
          </div>
        </div>
        <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw * k, height: ph * k, mixBlendMode: "multiply", opacity: 0.95 }} />
        {/* paragraphs not (or no longer) being read fall back under a paper veil */}
        {bands.map(([y0, y1, a], i) => a < 0.99 ? (
          <div key={i} style={{ position: "absolute", left: 0, top: (y0 - 14) * k, width: pw * k, height: (y1 - y0 + 28) * k, background: `rgba(250,248,243,${((1 - a) * 0.95).toFixed(3)})` }} />
        ) : null)}
        <svg width={pw * k} height={ph * k} style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.1 }}>
          <filter id="am10paper"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves={2} seed={10} /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width={pw * k} height={ph * k} filter="url(#am10paper)" />
        </svg>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
