// DC20 LineCross: the Augusta - Aiken country on the real Sentinel-2 plate (EOX s2cloudless, CC BY 4.0). A white ring marks Fort
// Gordon's Barton Field; a dashed line runs up to Interstate 20 (the exact roads aren't known), then a solid white line follows I-20
// east (OSM geometry) with the camera, over the Savannah River: the place label turns from Georgia to South Carolina as the head
// crosses. It stops at South Carolina mile 11 near Aiken (where the deputy picked it up), a ring opens there, and the label wipes on.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";
import { cl, ease, io } from "./DC01_kit";
import { I20 } from "./DC20_i20";

type P = [number, number];
export const LineCross: React.FC<{ src: string; iw: number; ih: number; base: P; z0: number; z1: number; dashAt: number; runAt: number; runLen: number; riverX: number;
  labels: { text: string; at: number; hold?: number }[] }> = ({ src, iw, ih, base: B, z0, z1, dashAt, runAt, runLen, riverX, labels }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // cumulative lengths of the I-20 polyline
  const L = [0]; for (let i = 1; i < I20.length; i++) L.push(L[i - 1] + Math.hypot(I20[i][0] - I20[i - 1][0], I20[i][1] - I20[i - 1][1]));
  const g = ease(f, runAt, runAt + runLen), want = g * L[L.length - 1];
  let k = 1; while (k < I20.length - 1 && L[k] < want) k++;
  const u = (want - L[k - 1]) / Math.max(1e-6, L[k] - L[k - 1]);
  const head: P = g <= 0 ? I20[0] : [I20[k - 1][0] + (I20[k][0] - I20[k - 1][0]) * Math.min(1, u), I20[k - 1][1] + (I20[k][1] - I20[k - 1][1]) * Math.min(1, u)];
  const done = I20.slice(0, k).concat([head]);
  const d = ease(f, dashAt, dashAt + 16);
  const fc: P = g <= 0 ? [(B[0] + I20[0][0]) / 2 + 120, (B[1] + I20[0][1]) / 2] : [head[0] - 60, head[1] + 60];
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const [sx, sy] = [fc[0], fc[1]];
  const base = Math.max(width / iw, height / ih) * z;
  // smooth the camera: follow the head with a lag
  const lag = io(interpolate(f, [runAt - 10, runAt + runLen + 20], [0, 1], cl));
  const camX = (B[0] + 200) + (sx - (B[0] + 200)) * lag, camY = (B[1] - 120) + (sy - (B[1] - 120)) * lag;
  const ox = Math.min(0, Math.max(width - iw * base, width / 2 - camX * base)), oy = Math.min(0, Math.max(height - ih * base, height / 2 - camY * base));
  const Q = (p: P) => `${ox + p[0] * base} ${oy + p[1] * base}`;
  const end = I20[I20.length - 1]; const ring = interpolate(f, [runAt + runLen, runAt + runLen + 28], [0, 1], cl);
  const [ex, ey] = [ox + end[0] * base, oy + end[1] * base];
  const crossed = head[0] >= riverX;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: interpolate(f, [0, 10], [0, 1], cl) }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: "contrast(1.08) brightness(1.3)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 72% 66% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.5) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <circle cx={ox + B[0] * base} cy={oy + B[1] * base} r={16} fill="none" stroke="#fff" strokeWidth={4} />
        <path d={`M${Q(B)} L${Q(I20[0])}`} stroke="#fff" strokeWidth={3.5} strokeDasharray="12 10" pathLength={1} fill="none" opacity={d} />
        {g > 0 && <>
          <path d={"M" + done.map(Q).join(" L")} fill="none" stroke="rgba(0,0,0,.5)" strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
          <path d={"M" + done.map(Q).join(" L")} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
        </>}
        {g > 0.99 && <circle cx={ex} cy={ey} r={11} fill="#fff" />}
        {ring > 0 && ring < 1 && <circle cx={ex} cy={ey} r={11 + ring * 90} fill="none" stroke={`rgba(255,255,255,${1 - ring})`} strokeWidth={4} />}
      </svg>
      {labels.map((l, i) => <RedLabel key={i} text={l.text} at={l.at} hold={l.hold ?? 9999} />)}
      {g > 0 && g < 1 && <RedLabel text={crossed ? "SOUTH CAROLINA" : "GEORGIA"} at={0} y={0.12} />}
    </AbsoluteFill>
  );
};
