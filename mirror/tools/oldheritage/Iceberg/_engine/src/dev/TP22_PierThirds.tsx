// TP22 PierThirds: Eastbourne pier on the day, side-on (geograph 4096544, Commons, CC BY-SA 2.0), the whole deck from the
// promenade to the sea end. mode "rule": the arcade is boxed (white, stroked on), then a 1,000 FT rule is drawn along the deck
// under it, end ticks + red label. mode "all" = rule then thirds in one appearance (TP22 uses only this). mode "thirds": the rule is there; the burned third (the arcade's span) washes red on the deck
// bar and the building, then the saved two-thirds either side light up white, each with its own bracket.
// All coordinates are image pixels of the 3840x1991 photo.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

const IW = 3840, IH = 1991;
const ROOT = 60, SEA = 3510;          // promenade end / sea end of the deck
const ARC: [number, number, number, number] = [462, 985, 1612, 1226]; // the arcade building
const deckY = (x: number) => 1220 + (x - ROOT) / (SEA - ROOT) * 28;     // underside of the deck (slight perspective)

export const PierThirds: React.FC<{ src: string; mode: "rule" | "thirds" | "all"; boxAt?: number; ruleAt?: number; burnAt?: number; saveAt?: number; z0?: number; z1?: number }> = ({ src, mode, boxAt = 6, ruleAt = 40, burnAt = 6, saveAt = 36, z0 = 1.0, z1 = 1.04 }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const z = z0 + (z1 - z0) * io(f / durationInFrames);
  const base = Math.max(width / IW, height / IH) * z;
  const fxI = (ROOT + SEA) / 2, fyI = 1120;
  const ox = Math.min(0, Math.max(width - IW * base, width / 2 - fxI * base)), oy = Math.min(0, Math.max(height - IH * base, height / 2 - fyI * base));
  const X = (x: number) => ox + x * base, Y = (y: number) => oy + y * base;
  const rule = mode === "thirds" ? 1 : io(interpolate(f, [ruleAt, ruleAt + 26], [0, 1], cl));
  const box = mode === "thirds" ? 1 : out(interpolate(f, [boxAt, boxAt + 16], [0, 1], cl));
  const burn = mode !== "rule" ? out(interpolate(f, [burnAt, burnAt + 14], [0, 1], cl)) : 0;
  const save = mode !== "rule" ? io(interpolate(f, [saveAt, saveAt + 18], [0, 1], cl)) : 0;
  const ry = (x: number) => Y(deckY(x) + 46); // the rule runs just under the deck
  const bx = X(ARC[0]), by = Y(ARC[1]), bw = X(ARC[2]) - bx, bh = Y(ARC[3]) - by, P = 2 * (bw + bh);
  const xr = ROOT + (SEA - ROOT) * rule;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => ROOT + (SEA - ROOT) * t);
  // brackets above the pier: [x0, x1, colour, progress]
  const seg = (x0: number, x1: number, c: string, g: number, k: string) => {
    if (g <= 0) return null; const yB = Y(930), xa = X(x0) + 6, xb = X(x0) + (X(x1) - X(x0) - 6) * g;
    return <g key={k} opacity={Math.min(1, g * 1.5)}>
      <line x1={xa} y1={yB} x2={xb} y2={yB} stroke={c} strokeWidth={6} />
      <line x1={xa} y1={yB - 14} x2={xa} y2={yB + 14} stroke={c} strokeWidth={6} />
      {g > 0.97 && <line x1={xb} y1={yB - 14} x2={xb} y2={yB + 14} stroke={c} strokeWidth={6} />}
      <line x1={xa} y1={ry(x0)} x2={xa + (X(x1) - X(x0) - 6) * g} y2={ry(x0 + (x1 - x0) * g)} stroke={c} strokeWidth={14} strokeLinecap="butt" />
    </g>;
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: IW * base, height: IH * base }} />
      {/* the pier band stays clear; above and below sink back a little */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.12) ${(Y(900) / height) * 100}%, rgba(0,0,0,0) ${(Y(980) / height) * 100}%, rgba(0,0,0,0) ${(Y(1330) / height) * 100}%, rgba(0,0,0,.5) 100%)` }} />
      {/* burned third: the arcade washes red */}
      {burn > 0 && <div style={{ position: "absolute", left: bx, top: by, width: bw, height: bh, background: `rgba(227,20,27,${0.5 * burn})`, mixBlendMode: "multiply" }} />}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, filter: "drop-shadow(0 2px 6px rgba(0,0,0,.65))" }}>
        {/* arcade box */}
        <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={burn > 0 ? RED : "#fff"} strokeWidth={5} strokeDasharray={P} strokeDashoffset={P * (1 - box)} />
        {/* the 1,000 ft rule along the deck */}
        <line x1={X(ROOT)} y1={ry(ROOT)} x2={X(xr)} y2={ry(xr)} stroke="#fff" strokeWidth={4} />
        {ticks.map((x, i) => x <= xr + 1 && <line key={i} x1={X(x)} y1={ry(x) - (i % 2 === 0 ? 22 : 12)} x2={X(x)} y2={ry(x) + (i % 2 === 0 ? 22 : 12)} stroke="#fff" strokeWidth={i % 2 === 0 ? 4 : 3} />)}
        {mode !== "rule" && seg(ARC[0], ARC[2], RED, burn, "b")}
        {mode !== "rule" && seg(ROOT, ARC[0], "#fff", save, "s1")}
        {mode !== "rule" && seg(ARC[2], SEA, "#fff", save, "s2")}
      </svg>
      {mode !== "thirds" && <RedLabel text="1,000 FT" at={ruleAt + 22} hold={mode === "all" ? Math.max(10, burnAt - ruleAt - 26) : 9999} x={X((ROOT + SEA) / 2) / width} y={(ry(1800) + 62) / height} size={42} />}
    </AbsoluteFill>
  );
};
