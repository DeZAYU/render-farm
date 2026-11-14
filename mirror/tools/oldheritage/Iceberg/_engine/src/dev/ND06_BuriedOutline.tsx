// ND06 BuriedOutline — the same ground from orbit before and after (Sentinel-2, aligned crops): the village is outlined in white on
// the "before" image, then the "after" image spreads over it from the mouth of the gully, the way the flow came, until the outline
// holds only grey debris. RedLabels give each image's date.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export const BuriedOutline: React.FC<{ before: string; after: string; iw: number; ih: number; poly: [number, number][]; origin: [number, number]; focus: [number, number];
  drawAt: number; spreadAt: number; spreadLen: number; z0?: number; z1?: number; beforeLabel: string; afterLabel: string }> = ({ before, after, iw, ih, poly, origin, focus, drawAt, spreadAt, spreadLen, z0 = 1.25, z1 = 1.5, beforeLabel, afterLabel }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / D);
  const base = Math.max(W / iw, H / ih) * z;
  const ox = Math.min(0, Math.max(W - iw * base, W / 2 - focus[0] * base)), oy = Math.min(0, Math.max(H - ih * base, H / 2 - focus[1] * base));
  const S = (x: number, y: number) => [ox + x * base, oy + y * base];
  const d = "M" + poly.map(([x, y]) => S(x, y).map((n) => n.toFixed(1)).join(" ")).join(" L") + " Z";
  const g = io(interpolate(f, [drawAt, drawAt + 26], [0, 1], cl));
  const r = io(interpolate(f, [spreadAt, spreadAt + spreadLen], [0, 1], cl)) * Math.hypot(W, H) * 1.1;
  const [sx, sy] = S(origin[0], origin[1]);
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base };
  const mask = `radial-gradient(circle ${Math.max(1, r)}px at ${sx}px ${sy}px, #000 70%, transparent 100%)`;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(before)} style={st} />
      <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}><Img src={staticFile(after)} style={st} /></AbsoluteFill>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <path d={d} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={12} strokeLinejoin="round" pathLength={1} strokeDasharray={`${g} 1`} />
        <path d={d} fill="none" stroke="#fff" strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={`${g} 1`} />
      </svg>
      <RedLabel text={beforeLabel} at={drawAt + 6} hold={spreadAt - drawAt} x={0.5} y={0.9} />
      <RedLabel text={afterLabel} at={spreadAt + spreadLen - 6} x={0.5} y={0.9} />
    </AbsoluteFill>
  );
};
