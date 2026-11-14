// timeline / HorizonTrack: a sequence of VV §3 date cards on ONE horizon line (VV @ 17:42 "1987 / WITNESS A CRIME", @ 20:00 "1984 / LIVE FROM HER
// MAJESTY'S", @ 22:40 "2009 / VIDEO LEAKED ON YOUTUBE": on twos, 2 px white line at 0.59 H, small white year, amber Bebas subtitle sliding in
// with bezier (0.221,0.496,0.454,1.01), torn B/W print rising from behind the line, B/W -> colour +1.9 s with a x1.15 bloom). VV hard-cuts
// between date cards; ours keeps the line and slides the whole strip along it on the subtitle curve, so the years read as one track:
// the old print sinks back behind the line (ease-in), the new one rises, a tick marks each year on the line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, Media, W, clamp01, fs, lerp } from "../../core";
import { CardVig, Specks, TornPrint } from "../photo/shared";

export type HTNode = { year: string; label: string; media?: string; at: number };
export type HorizonTrackProps = { nodes: HTNode[]; gap?: number; accent?: string; lineY?: number; cap?: number; labelCap?: number };

export const HorizonTrack: React.FC<HorizonTrackProps> = ({ nodes, gap = 1180, accent = "#D0B53E", lineY = Math.round(0.59 * H), cap = 76, labelCap = 38 }) => {
  const k0 = useCurrentFrame();
  const g = Math.floor(k0 / 2) * 2; // on twos
  // strip offset: slide to node i on its beat (first node arrives from the right like VV's year)
  let off = 0;
  nodes.forEach((n, i) => { off = lerp(off, i * gap, i === 0 ? 1 : EZ.dateSlide((g - n.at) / 22)); });
  const intro = EZ.dateSlide((g - Math.max(0, nodes[0].at)) / 22);
  const x0 = W / 2 - off + (1 - intro) * W * 0.62;
  const lineW = W * EZ.out2(g / 8);
  const cur = nodes.reduce((c, n, i) => (n.at <= g ? i : c), 0);
  const yf = fs("inter", labelCap), tf = fs("bebas", cap);
  const pw = 900, ph = 506;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 50% at 50% ${((lineY - 160) / H) * 100}%, rgba(70,52,18,.26), rgba(0,0,0,0) 70%)` }} />
      <Specks k={k0} n={40} seed={13} />
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: lineY, overflow: "hidden" }}>
        {nodes.map((n, i) => {
          if (!n.media) return null;
          const rise = EZ.out3((g - n.at - 6) / 20);
          const next = nodes[i + 1];
          const sink = next ? EZ.in2((g - next.at) / 12) : 0;
          const p = rise * (1 - sink);
          if (p <= 0) return null;
          const col = clamp01((g - n.at - 56) / 4);
          const top = lerp(lineY + 10, lineY - ph + 34, p) - 0.12 * Math.max(0, g - n.at - 26);
          return (
            <div key={i} style={{ position: "absolute", left: x0 + i * gap - pw / 2, top, width: pw, height: ph, transform: `rotate(${i % 2 ? 1.1 : -1.2}deg)` }}>
              <TornPrint w={pw} h={ph} seed={21 + i} paper="#E4E1D8">
                <Media src={n.media} style={{ filter: `grayscale(${(1 - col).toFixed(3)}) contrast(1.08)` }} /><CardVig k={0.42} />
              </TornPrint>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, top: lineY - 1, width: lineW, height: 2, background: "#F4F4F4", boxShadow: "0 0 6px rgba(255,255,255,.5)" }} />
      {nodes.map((n, i) => {
        const x = x0 + i * gap;
        const on = i === cur;
        const bloom = 1 + 0.15 * clamp01((g - n.at - 56) / 4);
        const a = i <= cur ? 1 : 0.35;
        return (
          <React.Fragment key={i}>
            <div style={{ position: "absolute", left: x - 1, top: lineY - 9, width: 2, height: 18, background: "#F4F4F4", opacity: lineW > x ? 0.9 : 0 }} />
            <div style={{ position: "absolute", left: x, top: lineY + 24, transform: "translateX(-50%)", fontFamily: FONT.inter, fontWeight: 400, fontSize: yf, color: "#F2F2F2", letterSpacing: "0.06em", opacity: a }}>{n.year}</div>
            {i <= cur ? (
              <div style={{ position: "absolute", left: x - 900, width: 1800, top: lineY + 34 + yf * 1.05, textAlign: "center", fontFamily: FONT.bebas, fontSize: tf, lineHeight: 1, letterSpacing: "0.04em", color: accent,
                opacity: on ? 1 : 0.5, textShadow: on ? `0 0 ${(6 * bloom).toFixed(1)}px ${accent}, 0 0 ${(18 * bloom).toFixed(1)}px rgba(168,112,42,.55), 0 0 ${(40 * bloom).toFixed(1)}px rgba(90,60,30,.5)` : "none" }}>{n.label}</div>
            ) : null}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
