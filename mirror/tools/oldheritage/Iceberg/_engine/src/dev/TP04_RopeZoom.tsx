// TP04 RopeZoom — the clip keeps running (no freeze): a white box finds the two small figures on the rope, a magnified live panel of
// the same moment lifts out of that box to the left (connector lines back to it), the rope is traced red from the gondola down to
// them, and the panel names them on the VO's words: RESCUER, then PASSENGER 2 OF 8. Overlays clear before the cut so the raw continues
// the same shot. Built for the 3 Nov audit (replaces FreezeBracket, which two other cases also used).
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** fig = the figures' centre in source pixels (1920x1080); rope = [x, yTop] where the rope leaves the gondola; tags = frames */
export const RopeZoom: React.FC<{ src: string; from: number; fig: [number, number]; rope: [number, number]; ropeAt: number; tag1At: number; tag2At: number; zoom?: number }> =
  ({ src, from, fig, rope, ropeAt, tag1At, tag2At, zoom = 3 }) => {
  const f = useCurrentFrame(); const { durationInFrames: N } = useVideoConfig();
  const s = 1.0 + 0.06 * io(f / N);                      // slow push on the wide shot
  const P = (x: number, y: number) => [960 + (x - 960) * s, 540 + (y - 540) * s] as const;
  const bw = 150, bh = 210;
  const [cx, cy] = P(fig[0], fig[1]);
  const B = { x0: cx - (bw * s) / 2, y0: cy - (bh * s) / 2, x1: cx + (bw * s) / 2, y1: cy + (bh * s) / 2 };
  const kBox = out(interpolate(f, [6, 22], [0, 1], cl));
  const kPan = io(interpolate(f, [16, 40], [0, 1], cl));
  const kRope = io(interpolate(f, [ropeAt - 6, ropeAt + 16], [0, 1], cl));
  const gone = interpolate(f, [N - 7, N - 1], [1, 0], cl);
  // panel rect: grows out of the box onto the left of the frame
  const T = { x0: 150, y0: 130, x1: 710, y1: 830 };
  const R = { x0: interpolate(kPan, [0, 1], [B.x0, T.x0]), y0: interpolate(kPan, [0, 1], [B.y0, T.y0]), x1: interpolate(kPan, [0, 1], [B.x1, T.x1]), y1: interpolate(kPan, [0, 1], [B.y1, T.y1]) };
  const pw = R.x1 - R.x0, ph = R.y1 - R.y0;
  const Z = zoom * (pw / (T.x1 - T.x0));
  const vid = (style: React.CSSProperties) => <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted style={style} />;
  // box corners as drawn brackets (grow from the centre)
  const half = (a: number, b: number) => [interpolate(kBox, [0, 1], [(a + b) / 2, a]), interpolate(kBox, [0, 1], [(a + b) / 2, b])];
  const [bx0, bx1] = half(B.x0, B.x1), [by0, by1] = half(B.y0, B.y1);
  const [rx, ry0] = P(rope[0], rope[1]); const ry1 = B.y0 - 6;
  const tag = (at: number, text: string, red: boolean, y: number) => {
    const k = out(interpolate(f, [at - 4, at + 10], [0, 1], cl));
    return <div style={{ position: "absolute", left: T.x0, top: y, opacity: k * gone, transform: `translateX(${(1 - k) * -40}px)`, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 14, height: 14, background: red ? RED : "#fff" }} />
      <div style={{ fontFamily: "ArchivoBlk, Archivo", fontWeight: 900, fontSize: 42, letterSpacing: "0.02em", color: red ? "#fff" : "#fff", background: red ? RED : "transparent", padding: red ? "4px 14px 0" : 0, lineHeight: 1.05, textShadow: red ? "none" : "0 3px 14px rgba(0,0,0,.8)" }}>{text}</div>
    </div>;
  };
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(4)})` }}>
        {vid({ width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${(1 - 0.3 * kPan * gone).toFixed(3)})` })}
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: gone }}>
        {/* rope traced from the gondola down to the figures */}
        <line x1={rx} y1={ry0} x2={rx} y2={ry0 + (ry1 - ry0) * kRope} stroke={RED} strokeWidth={5} strokeLinecap="round" />
        {kRope > 0.98 && <circle cx={rx} cy={ry0} r={9} fill={RED} />}
        {/* connectors from the box to the panel */}
        {kPan > 0.02 && <g stroke="#fff" strokeWidth={2.5} opacity={0.85 * kPan}>
          <line x1={B.x0} y1={B.y0} x2={R.x1} y2={R.y0} /><line x1={B.x0} y1={B.y1} x2={R.x1} y2={R.y1} /></g>}
        {[[bx0, by0, 1, 1], [bx1, by0, -1, 1], [bx0, by1, 1, -1], [bx1, by1, -1, -1]].map(([x, y, sx, sy], i) =>
          <path key={i} d={`M${x + sx * 26} ${y} L${x} ${y} L${x} ${y + sy * 26}`} fill="none" stroke="#fff" strokeWidth={5} opacity={kBox} />)}
      </svg>
      {kPan > 0.02 && <div style={{ position: "absolute", left: R.x0, top: R.y0, width: pw, height: ph, overflow: "hidden", opacity: gone,
        outline: "6px solid #fff", boxShadow: "0 24px 60px rgba(0,0,0,.7)", background: "#000" }}>
        <div style={{ position: "absolute", width: 1920 * Z, height: 1080 * Z, left: pw / 2 - fig[0] * Z, top: ph / 2 - fig[1] * Z }}>
          {vid({ width: "100%", height: "100%", objectFit: "cover", filter: "contrast(1.08) brightness(1.05)" })}
        </div>
        <div style={{ position: "absolute", right: 14, top: 10, fontFamily: "ArchivoBlk, Archivo", fontWeight: 900, fontSize: 24, color: "#fff", opacity: kPan, textShadow: "0 2px 8px #000" }}>× {zoom.toFixed(0)}</div>
      </div>}
      {tag(tag1At, "RESCUER", false, T.y1 + 34)}
      {tag(tag2At, "PASSENGER 2 OF 8", true, T.y1 + 98)}
    </AbsoluteFill>
  );
};
