// IN11 HeldBinding: the helmet camera's frame a split second after the landing, when the left ski stands straight up out of the snow with
// the boot still locked in it. Frozen full frame, slow eased push down the ski toward the binding; the rest of the picture drains to a cold
// dim grey while a soft band of colour stays on the ski, and a thin white corner bracket closes on the binding (the part that should have
// let go). No text.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { camAt, cl, out, placeOf, type CK } from "./DC01_kit";

export const HeldBinding: React.FC<{
  src: string; t: number; keys: CK[]; band: [number, number, number, number]; bind: [number, number, number, number]; drainAt: number; boxAt: number;
}> = ({ src, t, keys, band, bind, drainAt, boxAt }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, keys));
  const d = out(interpolate(f, [drainAt, drainAt + 24], [0, 1], cl));
  const b = out(interpolate(f, [boxAt, boxAt + 14], [0, 1], cl));
  const st: React.CSSProperties = { position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h };
  const X = (u: number) => p.left + u * p.w, Y = (v: number) => p.top + v * p.h;
  const [bx0, by0, bx1, by1] = band;
  const mask = `linear-gradient(90deg, black ${X(bx0) - 24}px, transparent ${X(bx0) + 4}px, transparent ${X(bx1) - 4}px, black ${X(bx1) + 24}px)`;
  const [k0, l0, k1, l1] = bind;
  const pad = (1 - b) * 40, x0 = X(k0) - pad, y0 = Y(l0) - pad, x1 = X(k1) + pad, y1 = Math.min(1076, Y(l1) + pad), c = 34;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>
      <AbsoluteFill style={{ opacity: d, WebkitMaskImage: mask, maskImage: mask }}>
        <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={{ ...st, filter: "grayscale(1) brightness(.5) contrast(1.05)" }} /></Freeze>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,${0.25 * d}) 0%, rgba(0,0,0,0) ${Math.max(0, (by0 + 0.1)) * 100}%)` }} />
      {b > 0 && <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: b, filter: "drop-shadow(0 0 5px rgba(0,0,0,.9))" }}>
        <path d={`M${x0} ${y0 + c} L${x0} ${y0} L${x0 + c} ${y0} M${x1 - c} ${y0} L${x1} ${y0} L${x1} ${y0 + c} M${x1} ${y1 - c} L${x1} ${y1} L${x1 - c} ${y1} M${x0 + c} ${y1} L${x0} ${y1} L${x0} ${y1 - c}`}
          fill="none" stroke="#fff" strokeWidth={4} />
      </svg>}
    </AbsoluteFill>
  );
};
