// Small DD-family device parts shared by several families (callout box, draw-on ring, pin). Times are LOCAL frames (k = frames since start).
import React from "react";
import { H, RC, W, clamp01, EZ } from "./tokens";
import { FONT, fs, measure } from "./type";

/** callout/box text tones (M-024 contrast): "light" = white type, red outline, dark translucent fill (default);
 *  "red" = the old D1 red-on-dark-red (only over very dark plates). */
export type ChipTone = "light" | "red";
export const CHIP_TONE = {
  light: { text: "#F6F5F2", fill: "rgba(8,0,0,.78)", shadow: "0 2px 6px rgba(0,0,0,.85)" },
  red: { text: RC.hudRed, fill: "rgba(40,0,0,.6)", shadow: "0 0 8px rgba(255,20,20,.6)" },
} as const;

/** D1 E4 / E10 HUD callout: a red leader line draws from the point to an elbow (6 f), then the box wipes open (6 f), then the words.
 *  k = frames since start; p = anchor point, elbow = where the box starts. `words` appear one by one every `wordStep` f after the box. */
export const HudBox: React.FC<{ k: number; p: { x: number; y: number }; elbow: { x: number; y: number }; text: string; cap?: number; colour?: string; wordStep?: number; boxFill?: string; dir?: 1 | -1; dot?: boolean; tone?: ChipTone }> = ({
  k, p, elbow, text, cap = 34, colour, wordStep = 0, boxFill, dir = 1, dot = false, tone = "light",
}) => {
  if (k < 0) return null;
  const T = CHIP_TONE[tone];
  const f = fs("inter", cap);
  const lk = EZ.out2(k / 6), bk = EZ.out3((k - 4) / 6);
  const tw = measure(text, `700 ${f}px ${FONT.inter}`) + 44;
  const bh = Math.round(cap * 2.1);
  const box = { x: dir === 1 ? elbow.x : elbow.x - tw, y: elbow.y - bh / 2, w: tw, h: bh };
  const L = Math.hypot(elbow.x - p.x, elbow.y - p.y);
  const words = text.split(" ");
  const nW = wordStep > 0 ? Math.max(0, Math.floor((k - 9) / wordStep) + 1) : k >= 9 ? words.length : 0;
  return (
    <>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <g style={{ filter: `drop-shadow(0 0 6px ${RC.lineRed}cc)` }}>
          <polyline points={`${p.x},${p.y} ${elbow.x},${elbow.y}`} fill="none" stroke={RC.lineRed} strokeWidth={3} strokeDasharray={`${L * lk} ${L + 10}`} />
          {dot ? <circle cx={p.x} cy={p.y} r={5} fill={RC.lineRed} opacity={lk} /> : null}
          {bk > 0 ? <rect x={dir === 1 ? box.x : box.x + box.w * (1 - bk)} y={box.y} width={box.w * bk} height={box.h} fill={boxFill ?? T.fill} stroke={RC.lineRed} strokeWidth={3} /> : null}
        </g>
      </svg>
      <div style={{ position: "absolute", left: box.x + 22, top: box.y, height: box.h, display: "flex", alignItems: "center", fontFamily: FONT.inter, fontWeight: 700, fontSize: f, color: colour ?? T.text, whiteSpace: "pre",
        textShadow: T.shadow }}>
        {words.slice(0, nW).join(" ")}
      </div>
    </>
  );
};

/** D1 E5 tracked ring: 7 px core + soft glow, draw-on clockwise from 12 o'clock in 5 f (160/270/320/350/360 deg).
 *  `steps` = the measured per-frame arc; set `drawFrames` to use a smooth ease-out draw instead. */
export const DrawRing: React.FC<{ k: number; x: number; y: number; r: number; core?: number; colour?: string; glow?: string; drawFrames?: number; ry?: number }> = ({
  k, x, y, r, core = 7, colour = RC.ringCore, glow = "rgba(229,74,72,.55)", drawFrames, ry,
}) => {
  if (k < 0) return null;
  const arc = drawFrames ? EZ.out2((k + 1) / drawFrames) : [160, 270, 320, 350, 360][Math.min(4, Math.floor(k))] / 360;
  const R = ry ?? r;
  const C = Math.PI * (3 * (r + R) - Math.sqrt((3 * r + R) * (r + 3 * R))); // Ramanujan perimeter
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(-90)`}>
        <ellipse rx={R} ry={r} fill="none" stroke={glow} strokeWidth={core + 10} strokeDasharray={`${C * arc} ${C}`} style={{ filter: "blur(5px)" }} />
        <ellipse rx={R} ry={r} fill="none" stroke={colour} strokeWidth={core} strokeDasharray={`${C * arc} ${C}`} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** red pushpin (DD V1 E12 corkboard) */
export const PushPin: React.FC<{ x: number; y: number; r?: number; opacity?: number }> = ({ x, y, r = 18, opacity = 1 }) => (
  <div style={{ position: "absolute", left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: "50%", opacity,
    background: "radial-gradient(circle at 36% 33%, #ff8a8a 0%, #e01414 40%, #7a0606 100%)", boxShadow: `${r * 0.25}px ${r * 0.45}px ${r * 0.45}px rgba(0,0,0,.5)` }} />
);

/** map pin (D1 E10): red teardrop */
export const MapPin: React.FC<{ k: number; x: number; y: number; size?: number }> = ({ k, x, y, size = 1 }) => {
  if (k < 0) return null;
  const sc = (k < 6 ? 0.6 + 0.4 * EZ.out2(k / 6) : 1) * size;
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
      <g transform={`translate(${x} ${y}) scale(${sc.toFixed(3)})`} opacity={clamp01(k / 4)}>
        <path d="M0 0 C -6 -14 -15 -20 -15 -30 A 15 15 0 1 1 15 -30 C 15 -20 6 -14 0 0 Z" fill="#E8141B" stroke="#7a0004" strokeWidth={1.5} />
        <circle cx={0} cy={-30} r={5.5} fill="#5a0003" />
      </g>
    </svg>
  );
};
