// transition / CrackSplit: black frame, a typed time line, then on the "crack / creak" word a WHITE CRACK LINE splits the frame and the two halves
// part to reveal the next shot. REF DD black beat (Farrell/wp3 sec_B 1.0 s black + sub boom) + D1 E4 typed time stamp @2:29.2 ("MONDAY - 4:30 PM",
// 2 f/char, white + red) + VV §10 tear (the frame breaks along a line, bands displaced) with Rule 0 white (no RGB). Map: c02 #13 ("JUST AFTER 7 PM"
// typed; on "crack" the line splits the frame + crack SFX), c08 #7 ("A LITTLE BEFORE 10 AM", creak on "twisting metal", split on "creak").
// The crack draws from an origin outward in 3 f (fast, jagged, with short branches), hot white core + bloom; 4 f later the halves start to part
// (ease-in, motion-blurred) and the incoming shot shows through the widening gap; at `cut` the halves are off-frame. Frames LOCAL.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, RoundText, W, clamp01, hash } from "../../core";
import { typedN } from "../../core/kits/labels";
import { SideB, type TransitionProps } from "./shared";

export type CrackSplitProps = TransitionProps & { white?: string; red?: string; typeAt?: number; crackAt: number; seed?: number; slope?: number; cap?: number };
const crackPts = (seed: number, slope: number) => {
  const pts: { x: number; y: number }[] = [];
  const n = 26;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = -40 + t * (W + 80);
    const y = H * 0.52 + (t - 0.5) * slope * H + (i === 0 || i === n ? 0 : (hash(seed * 13 + i * 7.1) - 0.5) * 70);
    pts.push({ x, y });
  }
  return pts;
};
export const CrackSplit: React.FC<CrackSplitProps> = (p) => {
  const { white = "JUST AFTER", red = "7 PM", typeAt = 6, crackAt, seed = 3, slope = -0.12, cut, cap = 76 } = p;
  const f = useCurrentFrame();
  const pts = crackPts(seed, slope);
  const origin = 0.42;
  const k = f - crackAt;
  const draw = EZ.out2(clamp01((k + 1) / 3)); // 3 f: outward from the origin
  const part = EZ.in3(clamp01((f - crackAt - 4) / Math.max(4, cut - crackAt - 4)));
  const gapPx = part * H * 0.75;
  const xs0 = W * origin - draw * W * 0.75, xs1 = W * origin + draw * W * 0.75;
  const visible = pts.filter((q) => q.x >= xs0 - 60 && q.x <= xs1 + 60);
  const line = visible.map((q, i) => `${i ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`).join(" ");
  const topPoly = `0,0 ${W},0 ${pts.slice().reverse().map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")}`;
  const botPoly = `${pts.map((q) => `${q.x.toFixed(1)},${q.y.toFixed(1)}`).join(" ")} ${W},${H} 0,${H}`;
  const branches = [5, 9, 15, 19, 22].map((i, j) => {
    const a = pts[i], len = 40 + hash(seed + j * 3.3) * 70, dir = j % 2 ? 1 : -1;
    return { a, b: { x: a.x + (hash(seed + j) - 0.5) * 60, y: a.y + dir * len }, on: a.x >= xs0 && a.x <= xs1 };
  });
  const typedW = white.slice(0, typedN(white, f - typeAt, 2));
  const typedR = red.slice(0, typedN(red, f - typeAt - 2 * (white.length + 1), 2));
  const bloom = k >= 0 ? Math.max(0, 1 - k / 6) : 0;
  const fast = part > 0.02 && part < 0.98;
  const half = (poly: string, dy: number) => (
    <div style={{ position: "absolute", inset: 0, transform: `translateY(${dy.toFixed(2)}px)`, clipPath: `polygon(${poly.split(" ").map((c) => c.split(",").map((v) => `${v}px`).join(" ")).join(",")})`, background: "#000" }}>
      <div style={{ position: "absolute", left: 300, top: 0.47 * H - cap * 0.62 / 0.708, display: "flex", gap: 30, opacity: 1 - 0.6 * part }}>
        {typedW ? <RoundText text={typedW} cap={cap} colour="#FFFFFF" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,.6))" }} /> : null}
        {typedR ? <RoundText text={typedR} cap={cap} colour="#F92B30" style={{ filter: "drop-shadow(0 3px 2px rgba(70,0,4,.8)) drop-shadow(0 0 8px rgba(249,43,48,.4))" }} /> : null}
      </div>
    </div>
  );
  if (f >= cut) return <AbsoluteFill style={{ background: "#000" }}><SideB {...p} cut={crackAt + 4} /></AbsoluteFill>;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {part > 0 ? <AbsoluteFill><SideB {...p} cut={crackAt + 4} /></AbsoluteFill> : null}
      <MBlur on={fast} samples={6}>
        <AbsoluteFill>
          {half(topPoly, -gapPx * 0.5)}
          {half(botPoly, gapPx * 0.5)}
        </AbsoluteFill>
      </MBlur>
      {k >= 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible", opacity: 1 - part }}>
          <g style={{ filter: `drop-shadow(0 0 ${(4 + 18 * bloom).toFixed(1)}px rgba(255,255,255,.95)) drop-shadow(0 0 ${(20 + 40 * bloom).toFixed(1)}px rgba(255,255,255,.5))` }}>
            <g transform={`translate(0 ${(-gapPx * 0.5).toFixed(2)})`}><path d={line} fill="none" stroke="#FFFFFF" strokeWidth={4 + 3 * bloom} strokeLinejoin="miter" /></g>
            <g transform={`translate(0 ${(gapPx * 0.5).toFixed(2)})`}><path d={line} fill="none" stroke="#FFFFFF" strokeWidth={part > 0 ? 4 : 0.01} strokeLinejoin="miter" /></g>
            {branches.filter((b) => b.on).map((b, i) => <line key={i} x1={b.a.x} y1={b.a.y} x2={b.b.x} y2={b.b.y} stroke="#FFFFFF" strokeWidth={2.5} />)}
          </g>
        </svg>
      ) : null}
      {bloom > 0 ? <AbsoluteFill style={{ background: "#fff", opacity: 0.1 * bloom }} /> : null}
    </AbsoluteFill>
  );
};
