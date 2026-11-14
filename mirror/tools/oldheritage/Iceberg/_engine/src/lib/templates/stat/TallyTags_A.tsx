// stat / TallyTags_A (EDITOR A sibling of CounterStack / IconGrid / RollUp; Amusement Park 2026-10-19).
// A count that is BUILT from named tags: each tag (a city, a ride, a person's role) drops into a row on its spoken word and the big figure beside
// it ticks up by one at the same frame (VV §9 word pop for the tag, Farrell R9 counter for the figure). Editor A motion: the whole plane rides a
// constant slow truck (-14 px/s) and a +1.2 %/s push, the newest tag lands with an EZ.quick 10 f drop from 46 px above and a 1 f white edge flash,
// earlier tags settle to 70 %. Optional red qualifier under the figure wipes in on its word. Plate: case footage defocused 16 px at 32 %.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, W, clamp01, fs } from "../../core";
import { FootPlate } from "../labels/kit";

export type Tally = { text: string; at: number };
export type TallyTagsAProps = { media?: string; mediaStart?: number; tags: Tally[]; word?: string; wordAt?: number; header?: string; headerAt?: number; cap?: number; tagCap?: number };
const RED = "#E30A10";
export const TallyTags_A: React.FC<TallyTagsAProps> = ({ media, mediaStart = 0, tags, word, wordAt = 0, header, headerAt = 0, cap = 260, tagCap = 40 }) => {
  const f = useCurrentFrame();
  const t = f / 30;
  const n = tags.filter((g) => f >= g.at).length;
  const last = n > 0 ? tags[n - 1].at : -99;
  const bump = n > 0 ? 1 + 0.12 * (1 - EZ.out3(clamp01((f - last) / 10))) : 1;
  const wk = f - wordAt;
  const wipe = word ? EZ.out3(clamp01(wk / 12)) : 0;
  const hk = f - headerAt;
  const X0 = 0.1 * W, TX = 0.42 * W;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {media ? <FootPlate src={media} startFrom={mediaStart} push={0.02} filter="blur(16px) brightness(.32) saturate(.7)" /> : <AbsoluteFill style={{ background: "#060606" }} />}
      <AbsoluteFill style={{ transform: `translateX(${(-14 * t).toFixed(2)}px) scale(${(1 + 0.012 * t).toFixed(5)})`, transformOrigin: "50% 50%" }}>
        {header && hk >= 0 ? <div style={{ position: "absolute", left: X0, top: 0.2 * H, opacity: clamp01(hk / 8), fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", 30), color: "#E6E6E6", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>{header}</div> : null}
        <div style={{ position: "absolute", left: X0, top: 0.3 * H, transform: `scale(${bump.toFixed(4)})`, transformOrigin: "0% 50%" }}>
          <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", cap), color: "#FDFDFD", lineHeight: 1, filter: "drop-shadow(0 6px 18px rgba(0,0,0,.7))" }}>{n}</span>
        </div>
        {word && wk >= 0 ? (
          <div style={{ position: "absolute", left: X0, top: 0.3 * H + cap * 1.12, clipPath: `inset(0 ${(100 * (1 - wipe)).toFixed(1)}% 0 0)`, whiteSpace: "nowrap" }}>
            <span style={{ fontFamily: FONT.bebas, fontSize: fs("bebas", 56), color: RED, letterSpacing: "0.03em", filter: "drop-shadow(0 0 10px rgba(227,10,16,.45))" }}>{word}</span>
          </div>
        ) : null}
        {tags.map((g, i) => {
          const k = f - g.at;
          if (k < 0) return null;
          const u = EZ.quick(clamp01(k / 10));
          const newest = i === n - 1;
          const flash = k < 2 ? 1 - k / 2 : 0;
          return (
            <div key={i} style={{ position: "absolute", left: TX, top: 0.3 * H + i * tagCap * 2.05 - 46 * (1 - u), opacity: clamp01(k / 4) * (newest ? 1 : 0.7), display: "flex", alignItems: "center", gap: 18, whiteSpace: "nowrap" }}>
              <div style={{ width: 10, height: tagCap * 1.3, background: newest ? RED : "#8A8A8A" }} />
              <span style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: fs("inter", tagCap), color: "#F4F4F4", textShadow: `0 3px 10px rgba(0,0,0,.7)${flash > 0 ? `, 0 0 ${(14 * flash).toFixed(1)}px rgba(255,255,255,.9)` : ""}` }}>{g.text}</span>
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
