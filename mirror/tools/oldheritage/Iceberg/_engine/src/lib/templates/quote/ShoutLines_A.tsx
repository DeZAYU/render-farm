// quote / ShoutLines_A (EDITOR A sibling of KineticTitle / WordPops / RedSentence; Amusement Park 2026-10-19).
// A witness's account as short PHRASES that slam in over the case footage, alternating left and right of frame, each on its spoken word:
// the phrase enters from its own side with an 80 px whip (EZ.quick 9 f, 10 px motion blur clearing) and a 1 f white edge flash, settles,
// then keeps a slow drift toward centre; earlier phrases step back to 55 % and shrink 6 %. Key phrases are red. Bebas caps, cap 84.
// Editor A motion: the footage behind is darkened to 42 % (not blurred: the event stays visible) and trucks constantly; the attribution
// types on in the corner. Use it for "out of control / faster than it should / kids crying".
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type Shout = { text: string; at: number; red?: boolean };
export type ShoutLinesAProps = { media: string; mediaStart?: number; shouts: Shout[]; attribution?: { text: string; at: number }; cap?: number };
const RED = "#E30A10";
export const ShoutLines_A: React.FC<ShoutLinesAProps> = ({ media, mediaStart = 0, shouts, attribution, cap = 84 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const n = shouts.filter((s) => f >= s.at).length;
  const ak = attribution ? f - attribution.at : -1;
  const shown = attribution ? attribution.text.slice(0, Math.max(0, Math.min(attribution.text.length, Math.floor(ak / 1.3)))) : "";
  const rows = shouts.length;
  const y0 = H / 2 - (rows * cap * 1.5) / 2;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translateX(${(-16 * t).toFixed(2)}px) scale(1.06)` }}>
        <FootPlate src={media} startFrom={mediaStart} push={0.025} filter="brightness(.42) saturate(.8)" />
      </AbsoluteFill>
      {shouts.map((s, i) => {
        const k = f - s.at;
        if (k < 0) return null;
        const left = i % 2 === 0;
        const u = EZ.quick(clamp01(k / 9));
        const back = i < n - 1 ? EZ.out2(clamp01((f - shouts[n - 1].at) / 10)) : 0;
        const dx = (left ? -80 : 80) * (1 - u) + (left ? 6 : -6) * (k / 30);
        const flash = k < 2 ? 1 - k / 2 : 0;
        const y = y0 + i * cap * 1.5;
        return (
          <div key={i} style={{ position: "absolute", top: y, left: left ? 0.1 * W : undefined, right: left ? undefined : 0.1 * W, transform: `translateX(${dx.toFixed(1)}px) scale(${(1 - 0.06 * back).toFixed(4)})`, transformOrigin: left ? "0% 50%" : "100% 50%",
            opacity: clamp01(k / 3) * (1 - 0.45 * back), filter: `blur(${(10 * (1 - u)).toFixed(1)}px) drop-shadow(0 4px 14px rgba(0,0,0,.75))${flash > 0 ? ` drop-shadow(0 0 ${(16 * flash).toFixed(1)}px rgba(255,255,255,.9))` : ""}`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), color: s.red ? RED : "#FDFDFD", letterSpacing: "0.02em" }}>{s.text}</span>
          </div>
        );
      })}
      {shown ? <div style={{ position: "absolute", left: 0.1 * W, bottom: 70, fontFamily: FONT.inter, fontWeight: 600, fontSize: fs("inter", 26), color: "rgba(240,240,240,.85)", whiteSpace: "nowrap" }}>{shown}</div> : null}
    </AbsoluteFill>
  );
};
