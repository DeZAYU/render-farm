// AM15 LineRide: the real Europa Press story of 13 Aug 2007 ("La familia del fallecido en el parque Warner Bros cree que se 'ha hecho
// justicia' dos años después", captured with _tools/capture_page.py, cut before the lines the outline rules out) read the way an eye
// reads it: the page is flat and square to the camera, very close, and the camera rides along one printed line at a time as the VO
// reaches it (headline -> the two convicted -> the fines -> the cameras -> the appeal), easing between lines. Shallow focus: a band
// round the line in play is sharp, the page above and below falls soft and dim; light rakes in from the left. The case's one red mark
// draws under "no estaba pendiente de las cámaras".
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
export type LKey = { at: number; x: number; y: number; k: number; band?: number };

const camAt = (f: number, keys: LKey[]) => {
  let c = { ...keys[0], band: keys[0].band ?? 70 };
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    const ba = a.band ?? 70, bb = b.band ?? 70;
    c = { at: f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u, band: ba + (bb - ba) * u };
  }
  return c;
};

export const LineRide: React.FC<{ page: string; pw: number; ph: number; keys: LKey[]; rule: { x0: number; x1: number; y: number; at: number } }> = ({ page, pw, ph, keys, rule }) => {
  const f = useCurrentFrame();
  const c = camAt(f, keys);
  const rise = out(interpolate(f, [0, 20], [0, 1], cl));
  const k = c.k * (0.94 + 0.06 * rise);
  const left = 960 - c.x * k, top = 540 - c.y * k;
  const b = c.band;
  const mask = `linear-gradient(180deg, transparent ${((c.y - b * 2.4) / ph) * 100}%, #000 ${((c.y - b) / ph) * 100}%, #000 ${((c.y + b) / ph) * 100}%, transparent ${((c.y + b * 2.4) / ph) * 100}%)`;
  const ru = out(interpolate(f, [rule.at, rule.at + 16], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "#0b0b0c", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: pw * k, height: ph * k, opacity: rise }}>
        <div style={{ position: "absolute", inset: 0, transform: `scale(${k})`, transformOrigin: "0 0", width: pw, height: ph }}>
          <Img src={staticFile(page)} style={{ position: "absolute", inset: 0, width: pw, height: ph, filter: "blur(4px) brightness(.55)", WebkitMaskImage: "linear-gradient(180deg, #000 85%, transparent 100%)", maskImage: "linear-gradient(180deg, #000 85%, transparent 100%)" }} />
          <div style={{ position: "absolute", inset: 0, WebkitMaskImage: mask, maskImage: mask }}>
            <Img src={staticFile(page)} style={{ position: "absolute", inset: 0, width: pw, height: ph }} />
            {ru > 0 && <div style={{ position: "absolute", left: rule.x0, top: rule.y, height: 5, width: (rule.x1 - rule.x0) * ru, background: RED }} />}
          </div>
        </div>
      </div>
      {/* raking light from the left + paper falloff */}
      <AbsoluteFill style={{ mixBlendMode: "multiply", background: "linear-gradient(100deg, rgba(255,250,240,1) 0%, rgba(205,198,188,1) 60%, rgba(120,114,108,1) 100%)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 70% at 45% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
