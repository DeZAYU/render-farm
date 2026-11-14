// WP16 device: CitationStamps. The across-the-street frame of the plant burning is frozen and darkened under a slow push. The OSHA
// settlement's own words are typed sharp in Elite, one line per beat; as the count is spoken, nine red SERIOUS stamps thump down one
// after another in a loose block over the burning yard (each lands big and settles, the frame gives a 2 px knock); the penalty figure
// is boxed in red when it is spoken. Source credited small.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { ARCH, FrameAt, cl, io, out, useWpFonts } from "./WP01_kit";

type Line = { text: string; at: number; hi?: string; hiAt?: number };

export const CitationStamps: React.FC<{ src: string; t: number; n: number; lines: Line[]; stampAt: number; gap?: number; credit: string }> = ({ src, t, n, lines, stampAt, gap = 5, credit }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const s = 1.02 + 0.08 * io(interpolate(f, [0, n], [0, 1], cl));
  const dim = 0.45 * out(interpolate(f, [0, 14], [0, 1], cl));
  // knock: a short 2 px jolt on each landing
  let kx = 0, ky = 0;
  for (let i = 0; i < 9; i++) { const d = f - (stampAt + i * gap); if (d >= 0 && d < 4) { const a = (4 - d) / 4; kx += Math.sin(i * 2.3) * 2 * a; ky += 2 * a; } }
  const rnd = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
  const credK = out(interpolate(f, [4, 14], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", transform: `translate(${kx}px, ${ky}px)` }}>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: "62% 55%" }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(90deg, rgba(0,0,0,${dim + 0.2}) 0%, rgba(0,0,0,${dim}) 48%, rgba(0,0,0,${dim * 0.55}) 100%)` }} />
      {/* the stamps, in a loose 3 x 3 block over the burning yard */}
      {Array.from({ length: 9 }, (_, i) => {
        const at = stampAt + i * gap; if (f < at) return null;
        const u = out(interpolate(f, [at, at + 5], [0, 1], cl));
        const col = i % 3, row = Math.floor(i / 3);
        const x = 1250 + col * 246 + (rnd(i, 1) - 0.5) * 22, y = 330 + row * 165 + (rnd(i, 2) - 0.5) * 30, r = (rnd(i, 3) - 0.5) * 12;
        const sc = 1.7 - 0.7 * u;
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) rotate(${r}deg) scale(${sc})`, opacity: 0.25 + 0.67 * u,
            border: "6px solid #E3141B", borderRadius: 8, padding: "10px 18px 6px", color: "#E3141B", ...ARCH, fontSize: 32, letterSpacing: 2,
            mixBlendMode: "screen", filter: `contrast(1.1) blur(${(1 - u) * 2}px)` }}>SERIOUS</div>
        );
      })}
      {/* the release's words, typed one line per beat */}
      {lines.map((l, i) => {
        if (f < l.at) return null;
        const k = Math.floor(interpolate(f, [l.at, l.at + l.text.length * 1.1], [0, l.text.length], cl));
        const shown = l.text.slice(0, k);
        const hiK = l.hi && l.hiAt !== undefined ? out(interpolate(f, [l.hiAt, l.hiAt + 8], [0, 1], cl)) : 0;
        let body: React.ReactNode = shown;
        if (l.hi && shown.includes(l.hi)) {
          const j = shown.indexOf(l.hi);
          body = <>{shown.slice(0, j)}<span style={{ outline: `${5 * hiK}px solid rgba(227,20,27,${hiK})`, outlineOffset: 6, color: hiK > 0.5 ? "#FFFFFF" : undefined }}>{l.hi}</span>{shown.slice(j + l.hi.length)}</>;
        }
        return (
          <div key={i} style={{ position: "absolute", left: 110, top: 300 + i * 150, width: 960, fontFamily: "Elite", fontSize: 50, lineHeight: 1.2, color: "#F2F2F0", textShadow: "0 2px 10px rgba(0,0,0,.95)" }}>
            {body}
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 110, top: 200, opacity: credK }}>
        <span style={{ ...ARCH, background: "#E3141B", color: "#0A0A0A", fontSize: 30, padding: "8px 14px 6px", letterSpacing: 1 }}>{credit}</span>
      </div>
    </AbsoluteFill>
  );
};
