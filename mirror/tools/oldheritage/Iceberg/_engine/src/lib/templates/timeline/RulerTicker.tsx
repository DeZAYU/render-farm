// timeline / RulerTicker: a year ruler that scrolls under a fixed red needle while a big readout rolls with it (count up, or a countdown when the
// years go back). REF: Farrell NUMBER device (GR @ 6:09.3 bank balance counter rolling, story §2 NUMBER: LED/neon figures, the number lands on its
// word) + DD Vol.3 E5 stat callout (Dashcam Vol.3 @ 1:47.87 "23 years": rounded white figure + red word) + DD Vol.3 E4 scroll velocity
// (ease-in to a 0.9 s peak, then halving every 0.45 s). Each node scrolls the ruler to its year on its beat; a red marker drops onto the ruler at
// every reached year; the node's label lands red under the readout. Our version: the readout is the DD rounded label face, digits roll with the
// ruler (no jumps), ruler edges defocus, life drift on the whole plate.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, MBlur, RC, RoundText, W, clamp01, ddScroll, fs } from "../../core";

export type RulerNode = { year: number; label: string; at: number };
export type RulerTickerProps = { nodes: RulerNode[]; unit?: number; norm?: number; from?: number; cap?: number; labelCap?: number; subCap?: number };

export const RulerTicker: React.FC<RulerTickerProps> = ({ nodes, unit = 64, norm = 60, from, cap = 170, labelCap = 58, subCap = 28 }) => {
  const k = useCurrentFrame();
  let yr = from ?? nodes[0].year;
  let fast = false;
  let prev = yr;
  nodes.forEach((n) => {
    const p = n.at <= 0 ? 1 : ddScroll(k - n.at, norm);
    yr = yr + (n.year - prev) * p;
    prev = n.year;
    if (n.at > 0 && k - n.at > 8 && k - n.at < 34) fast = true;
  });
  let qa = 0; while (qa < norm && ddScroll(qa, norm) < 0.85) qa++;
  const arr = (n: RulerNode) => (n.at <= 0 ? -999 : n.at + qa);
  const reached = nodes.filter((n) => k >= arr(n));
  const curN = [...nodes].reverse().find((n) => reached.includes(n));
  const lo = Math.floor(yr - W / 2 / unit) - 2, hi = Math.ceil(yr + W / 2 / unit) + 2;
  const RY = 712;
  const z = 1 + 0.006 * (k / 30);
  const lf = fs("inter", subCap);
  const ruler = (
    <div style={{ position: "absolute", inset: 0 }}>
      <div style={{ position: "absolute", left: 0, width: W, top: RY, height: 2, background: "rgba(233,233,230,.55)" }} />
      {Array.from({ length: hi - lo + 1 }, (_, j) => {
        const y = lo + j;
        const x = W / 2 + (y - yr) * unit;
        const major = y % 5 === 0;
        return (
          <React.Fragment key={y}>
            <div style={{ position: "absolute", left: x - 1, top: RY - (major ? 34 : 18), width: 2, height: major ? 34 : 18, background: major ? "rgba(240,240,236,.85)" : "rgba(233,233,230,.45)" }} />
            {major ? <div style={{ position: "absolute", left: x - 90, width: 180, top: RY + 14, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: lf, color: "rgba(233,233,230,.6)" }}>{y}</div> : null}
          </React.Fragment>
        );
      })}
      {nodes.filter((n) => reached.includes(n)).map((n) => {
        const x = W / 2 + (n.year - yr) * unit;
        return <div key={n.year} style={{ position: "absolute", left: x - 8, top: RY - 52, width: 16, height: 16, background: RC.hudRed, transform: "rotate(45deg)", boxShadow: `0 0 10px ${RC.hudRed}` }} />;
      })}
    </div>
  );
  const shown = Math.round(yr);
  // the previous label leaves as soon as the ruler starts rolling to the next year
  const mv = Math.max(0, ...nodes.filter((n) => n.at > 0 && k >= n.at && k < arr(n)).map((n) => clamp01((k - n.at) / 6)));
  const lk = curN ? (curN.at <= 0 ? 99 : k - arr(curN)) : -1;
  const edge = "linear-gradient(to right, transparent 0, #000 22%, #000 78%, transparent 100%)";
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 70% at 50% 55%, #1A1A1C 0%, #0B0B0C 60%, #040404 100%)" }}>
      <AbsoluteFill style={{ transform: `scale(${z.toFixed(5)})` }}>
        <MBlur on={fast} samples={6}>
          <AbsoluteFill>
            <AbsoluteFill style={{ filter: "blur(3px)", opacity: 0.8 }}>{ruler}</AbsoluteFill>
            <AbsoluteFill style={{ WebkitMaskImage: edge, maskImage: edge }}>{ruler}</AbsoluteFill>
          </AbsoluteFill>
        </MBlur>
        {/* the needle */}
        <div style={{ position: "absolute", left: W / 2 - 2, top: RY - 96, width: 4, height: 116, background: RC.hudRed, boxShadow: `0 0 12px ${RC.hudRed}` }} />
        <div style={{ position: "absolute", left: 0, width: W, top: 214, display: "flex", justifyContent: "center", filter: "drop-shadow(0 4px 10px rgba(0,0,0,.6))" }}>
          <RoundText text={String(shown)} cap={cap} colour="#FFFFFF" />
        </div>
        {curN && lk >= 0 ? (
          <div style={{ position: "absolute", left: 0, width: W, top: 486, display: "flex", justifyContent: "center", opacity: clamp01(lk / 8) * (1 - mv), transform: `translateY(${(18 * (1 - EZ.out3(lk / 16))).toFixed(2)}px)`,
            filter: "drop-shadow(0 0 8px rgba(242,37,34,.55)) drop-shadow(0 3px 6px rgba(0,0,0,.5))" }}>
            <RoundText text={curN.label} cap={labelCap} colour={RC.labelRed} />
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
