// AM15 Torchlight: the real El País story of 14 Aug 2005 ("Un hombre muere en el Parque Warner tras sufrir un accidente en una
// atracción", Esther Sánchez; captured with _tools/capture_page.py, cut above the paywall) lies flat and straight-on in the dark, as if
// in the haunted hotel itself. A warm torch pool, slightly unsteady, finds the masthead and the headline, then travels down the page and
// settles on the park spokeswoman's sentence (the panic-attack version) while the camera eases in; the rest of the page stays in the
// dark with only a faint spill. No red (the case's one red mark is elsewhere).
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1);
type Key = { at: number; x: number; y: number; r: number; k: number }; // page px focus, torch radius (page px), zoom

const at = (f: number, keys: Key[]) => {
  let c = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, r: a.r + (b.r - a.r) * u, k: a.k + (b.k - a.k) * u };
  }
  return c;
};

export const Torchlight: React.FC<{ page: string; pw: number; ph: number; keys: Key[]; camLag?: number }> = ({ page, pw, ph, keys, camLag = 10 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const t = at(f, keys), cam = at(Math.max(0, f - camLag), keys);          // the camera follows the torch a little late
  const wob = [Math.sin(f * 0.21) * 9 + Math.sin(f * 0.53) * 4, Math.cos(f * 0.17) * 6 + Math.sin(f * 0.61) * 3];
  const on = io(interpolate(f, [4, 22], [0, 1], cl));
  const k = cam.k * (1 + 0.03 * f / dur);
  const left = 960 - cam.x * k, top = 540 - cam.y * k;
  const tx = (t.x + wob[0]) * k + left, ty = (t.y + wob[1]) * k + top, rx = t.r * k * 1.9, ry = t.r * k;
  return (
    <AbsoluteFill style={{ background: "#020202", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: pw * k, height: ph * k }}>
        <Img src={staticFile(page)} style={{ width: "100%", height: "100%", filter: "sepia(.18) contrast(1.04)", WebkitMaskImage: "linear-gradient(180deg, #000 82%, transparent 99%)", maskImage: "linear-gradient(180deg, #000 82%, transparent 99%)" }} />
      </div>
      {/* darkness with the torch pool cut out (warm core, soft edge, faint spill) */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse ${rx}px ${ry}px at ${tx}px ${ty}px, rgba(0,0,0,0) 0%, rgba(0,0,0,${0.12 + 0.85 * (1 - on)}) 50%, rgba(0,0,0,.86) 100%)` }} />
      <AbsoluteFill style={{ mixBlendMode: "soft-light", opacity: 0.22 * on, background: `radial-gradient(ellipse ${rx * 0.8}px ${ry * 0.8}px at ${tx}px ${ty}px, rgba(255,190,110,.9) 0%, rgba(255,160,80,0) 100%)` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 75% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.7) 100%)" }} />
    </AbsoluteFill>
  );
};
