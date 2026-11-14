// PROMOTED to core (was src/templates/evidence/shared.tsx); shared by several families. Import as "../../core/kits/evidence".
// Shared parts for the "evidence" family: one evidence item face (page excerpt print / photo print / polaroid with a handwritten-style
// Dashcam label caption), its size, and the pin position on a rotated item. All frames LOCAL.
import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { EZ, RC, RoundText, asset, clamp01 } from "../index";
import { markBars, type Mark } from "./page";

export type EvItem = {
  src: string; // public-relative image
  kind?: "page" | "photo" | "polaroid";
  cssW: number; cssH: number; // natural size: CSS px of a 2x capture for pages, or any w/h pair giving the photo's aspect
  x: number; y: number; // centre in world px
  w: number; // width in world px (the image area)
  rot?: number; // deg
  at: number; // local frame it lands (negative = already there)
  bars?: Mark[]; // red bars on a page excerpt (CSS px of the capture)
  caption?: { text: string; red?: string; at?: number; cap?: number }; // polaroid margin label (Varela Round recipe); `red` word lands at `at`; cap = cap height in item px (default 42; >= 28 on screen at the board's settled zoom)
};
const PAD = { page: 22, photo: 14, polaroid: 24 };
/** outer size of an item (paper included) */
export const itemSize = (it: EvItem) => {
  const k = it.kind ?? "page";
  const ih = (it.w * it.cssH) / it.cssW;
  const p = PAD[k];
  return { w: it.w + 2 * p, h: ih + 2 * p + (k === "polaroid" ? Math.max(96, 2.6 * (it.caption?.cap ?? 42)) : 0), ih, pad: p };
};
/** world position of the pin (top centre, 20 px down) of a rotated item */
export const pinOf = (it: EvItem) => {
  const { h } = itemSize(it);
  const a = ((it.rot ?? 0) * Math.PI) / 180;
  const dy = -h / 2 + 22;
  return { x: it.x - dy * Math.sin(a), y: it.y + dy * Math.cos(a) };
};
/** the face of one item, laid out from its top-left (0,0) at outer size */
export const ItemFace: React.FC<{ it: EvItem }> = ({ it }) => {
  const f = useCurrentFrame();
  const k = it.kind ?? "page";
  const { w, h, ih, pad } = itemSize(it);
  const sc = it.w / it.cssW;
  const bars = k === "page" ? markBars(f, it.bars, { c: RC.pageRed, perLine: 18, px: 3, py: 3, radius: 0 }) : [];
  const capK = it.caption?.at === undefined ? 1 : clamp01((f - it.caption.at) / 5);
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: w, height: h, background: k === "photo" ? "#efede6" : k === "polaroid" ? "#F3F1EA" : "#fbfaf6" }}>
      <div style={{ position: "absolute", left: pad, top: pad, width: it.w, height: ih, overflow: "hidden", isolation: "isolate", background: "#fff" }}>
        {k === "page" ? (
          <div style={{ position: "absolute", left: 0, top: 0, width: it.cssW, height: it.cssH, transformOrigin: "0 0", transform: `scale(${sc})` }}>
            {bars.filter((b) => b.p > 0).map((b, i) => (
              <div key={i} style={{ position: "absolute", left: b.r[0] - 3, top: b.r[1] - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c }} />
            ))}
            <Img src={asset(it.src)} style={{ position: "absolute", left: 0, top: 0, width: it.cssW, height: it.cssH, mixBlendMode: "multiply" }} />
          </div>
        ) : (
          <Img src={asset(it.src)} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(.9) contrast(1.06) saturate(.92)" }} />
        )}
      </div>
      {k === "polaroid" && it.caption ? (
        <div style={{ position: "absolute", left: 0, width: w, top: pad + ih + 26, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 16 }}>
          <RoundText text={it.caption.text} cap={it.caption.cap ?? 42} colour="#2A2826" />
          {it.caption.red ? (
            <div style={{ opacity: capK, transform: `translateY(${(12 * (1 - EZ.out3(capK))).toFixed(2)}px)` }}><RoundText text={it.caption.red} cap={it.caption.cap ?? 42} colour={RC.labelRed} /></div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
