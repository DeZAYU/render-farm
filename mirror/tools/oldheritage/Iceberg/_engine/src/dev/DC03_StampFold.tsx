// DC03 StampFold: the truck camera's first frame held; the camera eases into its own burned-in stamp (date + GPS) and a white rule draws
// under the date; then the whole picture folds back away from us on a hinge at its top edge, uncovering the real satellite ground at
// those GPS numbers (EOX Sentinel-2): a white box closes on the camera's position, the view drifts toward the port and a second box
// closes on the ferry harbour. Place label only.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RedLabel } from "../brand";
import { Cam, type CK, cl, io, out } from "./DC01_kit";

type Box = [number, number, number, number];
export const StampFold: React.FC<{
  src: string; t: number; keys: CK[]; rule: [number, number, number]; ruleAt: number; foldAt: number; foldLen: number;
  sat: string; iw: number; ih: number; gps: Box; port: Box; z0: number; z1: number; driftAt: number; label: string;
}> = ({ src, t, keys, rule, ruleAt, foldAt, foldLen, sat, iw, ih, gps, port, z0, z1, driftAt, label }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [foldAt, foldAt + foldLen], [0, 1], cl));
  const r = out(interpolate(f, [ruleAt, ruleAt + 16], [0, 1], cl));
  // satellite camera: centre on gps, then drift toward the midpoint of gps and port
  const g = io(interpolate(f, [foldAt, foldAt + 200], [0, 1], cl)), d = io(interpolate(f, [driftAt, driftAt + 110], [0, 1], cl));
  const z = z0 + (z1 - z0) * g;
  const base = Math.max(1920 / iw, 1080 / ih) * z;
  const c = (b: Box) => [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2];
  const [gx, gy] = c(gps), [px, py] = c(port);
  const fx = gx + ((gx + px) / 2 - gx) * d, fy = gy + ((gy + py) / 2 - gy) * d;
  const ox = Math.min(0, Math.max(1920 - iw * base, 960 - fx * base)), oy = Math.min(0, Math.max(1080 - ih * base, 540 - fy * base));
  const rect = (b: Box, at: number) => {
    const p = out(interpolate(f, [at, at + 16], [0, 1], cl));
    const x = b[0] * base + ox, y = b[1] * base + oy, w = (b[2] - b[0]) * base, h = (b[3] - b[1]) * base, P = 2 * (w + h);
    return <rect x={x} y={y} width={w} height={h} fill="none" stroke="#fff" strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - p)} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />;
  };
  const layers = (
    <div style={{ position: "absolute", left: `${rule[0] * 100}%`, top: `${rule[2] * 100}%`, width: `${(rule[1] - rule[0]) * 100 * r}%`, height: "0.28%", background: "#fff", boxShadow: "0 0 5px rgba(255,255,255,.7)" }} />
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {f >= foldAt - 2 && (
        <AbsoluteFill>
          <Img src={staticFile(sat)} style={{ position: "absolute", left: ox, top: oy, width: iw * base, height: ih * base, filter: `brightness(${0.55 + 0.45 * k})` }} />
          <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.45) 100%)" }} />
          <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>{rect(gps, foldAt + foldLen + 6)}{rect(port, driftAt + 80)}</svg>
          <RedLabel text={label} at={foldAt + foldLen + 18} />
        </AbsoluteFill>
      )}
      {k < 1 && (
        <AbsoluteFill style={{ perspective: 1500, perspectiveOrigin: "50% 0%" }}>
          <AbsoluteFill style={{ transformOrigin: "50% 0%", transform: `rotateX(${-96 * k}deg)`, backfaceVisibility: "hidden", filter: `brightness(${1 - 0.6 * k})`,
            boxShadow: `0 ${40 * k}px ${80 * k}px rgba(0,0,0,${0.8 * k})` }}>
            <Cam src={src} t={t} keys={keys} layers={layers} />
          </AbsoluteFill>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
