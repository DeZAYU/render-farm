// stat / PriceTag: two swinging price tags compared (the fix that was never bought vs the fine). REF Visual Venture §7 neon object pictograms
// @0:32.3 / 10:43.0 (one white-neon line object on black, tight halo, hold -> camera move; colour = meaning) + VV §11 world camera (quick start /
// long settle bezier (0.31,0,0,0.957)) + DD D3 E5 stat (red key figure). Map: c03 #28 ("< A$3,000" sensor tag, then on "That September" the camera
// pulls back and a far larger tag "FINED A$3.6 MILLION" swings in beside it: the two tags side by side are the point).
// OUR VERSION: paper tags on strings (damped pendulum swing, never fully dead), the small one hangs off the neon object; the big one drops in from
// above on its word and out-sizes it; the camera holds close on the object first, then pulls back to the pair.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, camAt, clamp01, fs, lerp } from "../../core";
import { GLYPHS, NEON, NeonGlyph, neonFilter } from "../../core/kits/glyphs";
import { swing } from "../../core/kits/verdict";

export type TagLine = { text: string; red?: boolean };
export type PriceTagProps = { object?: string; tag1: { lines: TagLine[]; at: number }; tag2: { lines: TagLine[]; at: number }; pullAt: number; cap?: number };
/** a generic water-level sensor in neon line (box + probe + water line) when `object` is "sensor" */
const Sensor: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`} style={{ filter: neonFilter(NEON.white, 1, 0.9) }} fill="none" stroke={NEON.white} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
    <rect x={-70} y={-150} width={140} height={100} rx={14} />
    <circle cx={-30} cy={-100} r={10} />
    <line x1={10} y1={-112} x2={45} y2={-112} />
    <line x1={10} y1={-88} x2={45} y2={-88} />
    <line x1={0} y1={-50} x2={0} y2={90} />
    <path d="M -150 60 q 25 -14 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" stroke={NEON.cyan} />
    <path d="M -150 100 q 25 -14 50 0 t 50 0 t 50 0 t 50 0 t 50 0 t 50 0" stroke={NEON.cyan} opacity={0.6} />
  </g>
);
const Tag: React.FC<{ lines: TagLine[]; scale: number; base?: number; rot: number; x: number; y: number; string: number; o: number }> = ({ lines, scale, rot, x, y, string, o, base = 34 }) => {
  const cap = base * scale;
  return (
    <div style={{ position: "absolute", left: x, top: y, transformOrigin: "0 0", transform: `rotate(${rot.toFixed(3)}deg)`, opacity: o }}>
      <div style={{ position: "absolute", left: -1.5, top: 0, width: 3, height: string, background: "linear-gradient(#d9d2c4, #9b9386)" }} />
      <div style={{ position: "absolute", left: 0, top: string, transform: "translateX(-50%)", padding: `${cap * 1.6}px ${cap * 0.9}px ${cap * 0.8}px`, background: "linear-gradient(170deg, #F3EEE3, #E2DACB)",
        clipPath: `polygon(${cap * 1.2}px 0, calc(100% - ${cap * 1.2}px) 0, 100% ${cap * 1.2}px, 100% 100%, 0 100%, 0 ${cap * 1.2}px)`, boxShadow: "0 18px 40px rgba(0,0,0,.6)",
        filter: "drop-shadow(0 14px 22px rgba(0,0,0,.55))", whiteSpace: "nowrap", textAlign: "center" }}>
        <div style={{ position: "absolute", left: "50%", top: cap * 0.55, width: cap * 0.55, height: cap * 0.55, marginLeft: -cap * 0.275, borderRadius: "50%", background: "#1a1a1a", boxShadow: "inset 0 2px 3px rgba(0,0,0,.8)" }} />
        {lines.map((l, i) => (
          <div key={i} style={{ fontFamily: FONT.inter, fontWeight: 800, fontSize: fs("inter", l.red ? cap * 1.45 : cap), lineHeight: 1.25, letterSpacing: "0.02em", color: l.red ? "#C8000E" : "#161616" }}>{l.text}</div>
        ))}
      </div>
    </div>
  );
};
export const PriceTag: React.FC<PriceTagProps> = ({ object = "sensor", tag1, tag2, pullAt, cap = 34 }) => {
  const f = useCurrentFrame();
  const OBJ = { x: 560, y: 470 };
  const cam = camAt(f, { cx: OBJ.x + 40, cy: OBJ.y + 40, s: 1.45 }, [{ f: pullAt, d: 46, to: { cx: W / 2 + 80, cy: H / 2 - 30, s: 1 }, e: EZ.quick }]);
  const drift = 1 + 0.008 * (f / 30);
  const t1o = clamp01((f - tag1.at + 1) / 4);
  const r1 = swing(f - tag1.at, 16, 36, 30);
  const dropU = EZ.out3(clamp01((f - tag2.at) / 14));
  const r2 = swing(f - tag2.at - 8, 11, 48, 34);
  const appear = clamp01((f + 1) / 8);
  return (
    <AbsoluteFill style={{ background: "#030303", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 50% 40% at 45% 75%, rgba(40,60,70,.25), rgba(0,0,0,0) 80%)" }} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0",
        transform: `translate(${W / 2}px, ${H / 2}px) scale(${(cam.s * drift).toFixed(5)}) translate(${(-cam.cx).toFixed(2)}px, ${(-cam.cy).toFixed(2)}px)`, opacity: appear }}>
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {object === "sensor" || !GLYPHS[object] ? <Sensor x={OBJ.x} y={OBJ.y} /> : <NeonGlyph name={object} colour={NEON.white} x={OBJ.x - 100} y={OBJ.y - 160} size={200} />}
        </svg>
        <Tag base={cap} lines={tag1.lines} scale={1} rot={r1} x={OBJ.x + 70} y={OBJ.y - 100} string={70} o={t1o} />
        {f >= tag2.at ? <Tag base={cap} lines={tag2.lines} scale={1.4} rot={r2} x={1370} y={lerp(-700, 130, dropU)} string={110} o={1} /> : null}
      </div>
    </AbsoluteFill>
  );
};
