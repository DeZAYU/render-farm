// evidence / ListBuild_A (EDITOR A sibling of CitationSheet / ChainReaction; Amusement Park 2026-10-19).
// A findings LIST that builds on the words (Farrell "it was a list": one line per finding, each on its spoken word). Editor A motion: the
// list lives on a tall plane that the camera TILTS along (EZ.quick re-centre on each new item, plus a constant +0.9 %H/s tilt so it never
// sits still); each item slides in 70 px from the right with a 6 px defocus clearing over 10 f, its red index number pops first (2 f
// earlier), and the previous items step down to 42 % so the eye stays on the new one. Header in Bebas, items in Inter 700, index in Nunito 900.
// The plate is the case footage, defocused 18 px at 30 % (no flat card), with its own linear push.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs, lerp } from "../../core";
import { FootPlate } from "../labels/kit";

export type ListItem = { text: string; at: number };
export type ListBuildAProps = { media?: string; mediaStart?: number; header?: { text: string; at: number }; items: ListItem[]; cap?: number; headerCap?: number; pitch?: number; x?: number; source?: string };
const RED = "#E30A10";
export const ListBuild_A: React.FC<ListBuildAProps> = ({ media, mediaStart = 0, header, items, cap = 44, headerCap = 58, pitch = 118, x = 0.13 * W, source }) => {
  const f = useCurrentFrame();
  // which item is current, and the camera target (centre on the newest item)
  let cur = -1;
  items.forEach((it, i) => { if (f >= it.at) cur = i; });
  const y0 = 0.3 * H;
  const target = (i: number) => (i < 0 ? 0 : Math.max(0, (y0 + i * pitch) - 0.56 * H));
  // eased re-centre between targets
  let camY = 0;
  for (let i = 0; i < items.length; i++) {
    const u = EZ.quick(clamp01((f - items[i].at + 4) / 22));
    camY = lerp(camY, target(i), u);
  }
  camY += 0.009 * H * (f / 30);
  const plate = media ? <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(18px) brightness(.3) saturate(.7)" /> : <AbsoluteFill style={{ background: "#050505" }} />;
  const hk = header ? f - header.at : -1;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {plate}
      <AbsoluteFill style={{ transform: `translateY(${(-camY).toFixed(2)}px)` }}>
        {header && hk >= 0 ? (
          <div style={{ position: "absolute", left: x, top: y0 - 1.6 * pitch, opacity: EZ.out3(clamp01(hk / 10)), transform: `translateX(${(40 * (1 - EZ.quick(clamp01(hk / 14)))).toFixed(1)}px)`, display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 8, height: headerCap * 1.25, background: RED }} />
            <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", headerCap), color: "#F2F2F2", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{header.text}</span>
          </div>
        ) : null}
        {items.map((it, i) => {
          const k = f - it.at;
          if (k < -2) return null;
          const n = EZ.out3(clamp01((k + 2) / 6));
          const u = EZ.quick(clamp01(k / 12));
          const dim = i < cur ? lerp(1, 0.42, EZ.out2(clamp01((f - items[cur].at) / 10))) : 1;
          return (
            <div key={i} style={{ position: "absolute", left: x, top: y0 + i * pitch, display: "flex", alignItems: "baseline", gap: 26, opacity: dim, whiteSpace: "nowrap" }}>
              <span style={{ fontFamily: FONT.nunito, fontWeight: 900, fontSize: fs("nunito", cap * 1.15), color: RED, opacity: n, filter: "drop-shadow(0 0 8px rgba(227,10,16,.5))" }}>{i + 1}</span>
              <span style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", cap), color: "#F4F4F4", opacity: clamp01(k / 8), transform: `translateX(${(70 * (1 - u)).toFixed(1)}px)`, filter: `blur(${(6 * (1 - u)).toFixed(2)}px) drop-shadow(0 3px 8px rgba(0,0,0,.7))` }}>{it.text}</span>
            </div>
          );
        })}
      </AbsoluteFill>
      {source ? <div style={{ position: "absolute", left: 40, bottom: 34, fontFamily: FONT.inter, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,.7)" }}>{source}</div> : null}
    </AbsoluteFill>
  );
};
