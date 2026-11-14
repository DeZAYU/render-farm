// ND15 AdvisoryTerminal: the NHC advisory as it went out, plain text typed onto a dark terminal line by line with a block cursor
// (the product is a plain-text wire bulletin). The key phrase types itself in red and a red rule runs under it; the camera starts tight
// on the first line and eases back as the text fills, then settles on the surge figure for Lake Charles' own lake. Header and source small.
// Built for the opening word "Unsurvivable": the viewer reads the word in the forecaster's own text as it arrives.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.55, 1);
const out = Easing.bezier(0.16, 1, 0.3, 1);

export type TermLine = { text: string; at: number; mark?: string; dim?: boolean };

export const AdvisoryTerminal: React.FC<{ header: string; lines: TermLine[]; credit: string; cps?: number; zoomTo?: number; zoomAt?: number }> =
  ({ header, lines, credit, cps = 2.2, zoomTo = 0, zoomAt = 9999 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const FS = 46, LH = 74, X0 = 150, Y0 = 240;
  // camera: tight on line 0, eases back to the whole block, then pushes in on line `zoomTo`
  const back = io(interpolate(f, [lines[0].at + 40, lines[0].at + 110], [0, 1], cl));
  const push = io(interpolate(f, [zoomAt, zoomAt + 40], [0, 1], cl));
  const focusY = (i: number) => Y0 + i * LH + LH / 2;
  const s = 1.55 - 0.55 * back + 0.15 * push;
  const fy = focusY(0) * (1 - back) + (height / 2) * back * (1 - push) + focusY(zoomTo) * push;
  const fx = (X0 + 520) * (1 - back) + (X0 + 718) * back * (1 - push) + (X0 + 718) * push;
  // typing head (for the cursor)
  let head: [number, number] | null = null;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 45% 45%, #15181a 0%, #070808 80%)", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `translate(${width / 2 - fx * s}px, ${height / 2 - fy * s}px) scale(${s})`, transformOrigin: "0 0" }}>
        <div style={{ position: "absolute", left: X0, top: Y0 - 90, fontFamily: "JetBrains Mono", fontWeight: 500, fontSize: 28, color: "rgba(255,255,255,.45)", letterSpacing: "0.04em",
          clipPath: `inset(0 ${(1 - interpolate(f, [0, 16], [0, 1], cl)) * 100}% 0 0)` }}>{header}</div>
        <div style={{ position: "absolute", left: X0, top: Y0 - 48, width: 1620, height: 2, background: "rgba(255,255,255,.18)" }} />
        {lines.map((l, i) => {
          const n = Math.floor(interpolate(f, [l.at, l.at + l.text.length / cps], [0, l.text.length], cl));
          if (n <= 0) return null;
          if (n < l.text.length || f < l.at + l.text.length / cps + 1) head = [i, n];
          const mi = l.mark ? l.text.indexOf(l.mark) : -1;
          const shown = l.text.slice(0, n);
          const doneMark = mi >= 0 && n >= mi + l.mark!.length;
          const rule = doneMark ? out(interpolate(f, [l.at + (mi + l.mark!.length) / cps + 2, l.at + (mi + l.mark!.length) / cps + 16], [0, 1], cl)) : 0;
          return (
            <div key={i} style={{ position: "absolute", left: X0, top: Y0 + i * LH, whiteSpace: "pre", fontFamily: "JetBrains Mono", fontWeight: 600, fontSize: FS, lineHeight: `${LH}px`,
              color: l.dim ? "rgba(255,255,255,.5)" : "#f1f1ee" }}>
              {mi < 0 ? shown : <>
                {shown.slice(0, mi)}
                <span style={{ position: "relative", color: RED }}>{shown.slice(mi, mi + l.mark!.length)}
                  <span style={{ position: "absolute", left: 0, bottom: 6, height: 6, width: `${rule * 100}%`, background: RED }} /></span>
                {shown.slice(mi + l.mark!.length)}
              </>}
            </div>
          );
        })}
        {(() => {
          const h = head as [number, number] | null;
          const last = Math.max(0, lines.reduce((k, l, j) => (f >= l.at ? j : k), 0));
          const [i, n] = h ?? [last, lines[last].text.length];
          const on = h ? 1 : Math.round((Math.sin(f / 4) + 1) / 2);
          return <div style={{ position: "absolute", left: X0 + n * FS * 0.6 + 4, top: Y0 + i * LH + 12, width: FS * 0.56, height: LH - 24, background: "#f1f1ee", opacity: on * 0.85 }} />;
        })()}
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, bottom: 40, fontFamily: "D-DIN", fontWeight: 700, fontSize: 26, letterSpacing: 2, color: "rgba(255,255,255,.62)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
