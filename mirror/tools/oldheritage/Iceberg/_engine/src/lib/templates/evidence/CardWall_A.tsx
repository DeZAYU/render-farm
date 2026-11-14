// evidence / CardWall_A (EDITOR A sibling of Corkboard / ListBuild_A; Amusement Park 2026-10-19).
// Findings as TEXT index cards pinned to a dark wall (Corkboard needs images; this one needs only words). Each card drops 40 px onto the wall
// on its word (EZ.quick 10 f, 1 f contact kick, a red pin), slightly rotated; a `red` card is the key finding (red rule on the card). Editor A
// motion: a world camera that starts close on the first card and travels/pulls back across the wall between stations (EZ.quick 30 f) plus a
// constant +1 %/s push, so it never parks. Inter 700 on warm white cards, wall = dark radial with a soft top light.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, lerp } from "../../core";

export type WallCard = { text: string; x: number; y: number; w: number; at: number; red?: boolean; rot?: number };
export type CardWallAProps = { cards: WallCard[]; cam0: { x: number; y: number; z: number }; moves?: { at: number; x: number; y: number; z: number }[]; cap?: number };
const RED = "#D41218";
export const CardWall_A: React.FC<CardWallAProps> = ({ cards, cam0, moves = [], cap = 34 }) => {
  const f = useCurrentFrame();
  let c = { ...cam0 };
  for (const m of moves) { const u = EZ.quick(clamp01((f - m.at) / 30)); c = { x: lerp(c.x, m.x, u), y: lerp(c.y, m.y, u), z: lerp(c.z, m.z, u) }; }
  const z = c.z * (1 + 0.03 * (f / 30));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 25%, #222226, #070708 75%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${W / 2}px, ${H / 2}px) scale(${z.toFixed(5)}) translate(${-c.x}px, ${-c.y}px)`, transformOrigin: "0 0" }}>
        {cards.map((cd, i) => {
          const k = f - cd.at;
          if (k < 0) return null;
          const u = EZ.quick(clamp01(k / 10));
          const kick = k >= 10 && k < 13 ? Math.sin(((k - 10) / 3) * Math.PI) * 3 : 0;
          const rot = cd.rot ?? ((i % 3) - 1) * 1.8;
          return (
            <div key={i} style={{ position: "absolute", left: cd.x - cd.w / 2, top: cd.y - 60 - 40 * (1 - u) + kick, width: cd.w, padding: "34px 30px 28px", background: "#F2EFE8", borderRadius: 4,
              transform: `rotate(${rot}deg)`, opacity: clamp01(k / 4), boxShadow: "0 18px 40px rgba(0,0,0,.6)", borderTop: cd.red ? `8px solid ${RED}` : "8px solid #D9D4C8" }}>
              <div style={{ position: "absolute", left: cd.w / 2 - 9, top: 6, width: 18, height: 18, borderRadius: 9, background: RED, boxShadow: "0 3px 6px rgba(0,0,0,.5)" }} />
              <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", cap), color: cd.red ? RED : "#1B1B1B", lineHeight: 1.25, textAlign: "center" }}>{cd.text}</div>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
