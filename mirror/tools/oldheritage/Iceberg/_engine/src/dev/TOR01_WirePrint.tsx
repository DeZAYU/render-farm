// TOR01 | WirePrint: the real NWS tornado warning (IEM archive text, re-typeset) printing out of a dark teleprinter, line by
// line, on fanfold paper with tractor holes. The paper feeds up a line at a time while a small carriage runs along the line
// being printed; the key lines are then marked (channel red bar / white box) and the camera leans in on them. Source small.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const LH = 56, FS = 38, CW = FS * 0.6; // Courier Prime: advance 0.6 em
const PAPER_W = 1500, SLOT_Y = 800;

export type WireMark = { line: number; at: number; red?: boolean; c0?: number; c1?: number };

export const WirePrint: React.FC<{ lines: string[]; marks: WireMark[]; cpf?: number; gap?: number; pushAt?: number; pushTo?: number; credit: string }> = ({
  lines, marks, cpf = 2.4, gap = 3, pushAt = 60, pushTo = 1.32, credit,
}) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // schedule: each line prints over len/cpf frames after a short line feed
  const st: number[] = []; let t = 0;
  lines.forEach((l) => { st.push(t); t += Math.max(2, Math.ceil(l.length / cpf)) + gap; });
  let cur = 0; for (let i = 0; i < lines.length; i++) if (f >= st[i]) cur = i;
  const feedP = cur === 0 ? 1 : io(interpolate(f, [st[cur], st[cur] + gap], [0, 1], cl));
  const fed = (cur - 1 + feedP) * LH;              // paper travel so far (px)
  const PY = SLOT_Y - 30 - fed;                    // screen y of line 0's baseline
  const lineY = (i: number) => PY + i * LH;
  const shown = (i: number) => (f < st[i] ? 0 : Math.min(lines[i].length, Math.floor((f - st[i] - (i ? gap : 0) + 1) * cpf)));
  const curChars = shown(cur);
  const x0 = width / 2 - PAPER_W / 2 + 110;
  const printing = curChars > 0 && curChars < lines[cur].length;
  // camera: slow lean, then push toward the first mark
  const m0 = marks[0];
  const push = io(interpolate(f, [pushAt, durationInFrames], [0, 1], cl));
  const fy = m0 ? lineY(m0.line) : height / 2;
  const sc = 1.02 + 0.04 * (f / durationInFrames) + (pushTo - 1.02) * push;
  const ty = (height / 2 - fy) * push * 0.85;
  const shake = printing ? Math.sin(f * 2.7) * 0.6 : 0;
  return (
    <AbsoluteFill style={{ background: "#06080b", overflow: "hidden" }}>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 70%" }}>
        <div style={{ position: "absolute", inset: 0, transform: `translateY(${ty}px) scale(${sc}) rotateX(${16 - 6 * push}deg) rotateZ(${-1.6 + 0.8 * push}deg)`, transformOrigin: `50% ${fy}px` }}>
          {/* paper */}
          <div style={{ position: "absolute", left: width / 2 - PAPER_W / 2, width: PAPER_W, top: -400, height: SLOT_Y + 400 + 20,
            background: "linear-gradient(90deg,#d9d3c4 0%,#efeadf 6%,#f3efe6 50%,#ece6d9 94%,#d6cfbf 100%)", boxShadow: "0 0 60px rgba(0,0,0,.6)" }}>
            {/* tractor holes + perforation lines, moving with the feed */}
            {Array.from({ length: 40 }).map((_, k) => {
              const y = PY - 12 - 20 * LH + k * LH + 400 + LH / 2; // paper-local: the paper div starts at screen y -400
              if (y < -40 || y > SLOT_Y + 420) return null;
              return <React.Fragment key={k}>
                <div style={{ position: "absolute", left: 22, top: y, width: 20, height: 20, borderRadius: 10, background: "#06080b", opacity: 0.85 }} />
                <div style={{ position: "absolute", right: 22, top: y, width: 20, height: 20, borderRadius: 10, background: "#06080b", opacity: 0.85 }} />
              </React.Fragment>;
            })}
            <div style={{ position: "absolute", left: 62, top: 0, bottom: 0, borderLeft: "2px dashed rgba(0,0,0,.12)" }} />
            <div style={{ position: "absolute", right: 62, top: 0, bottom: 0, borderLeft: "2px dashed rgba(0,0,0,.12)" }} />
          </div>
          {/* marks under the text */}
          {marks.map((m, i) => {
            const g = io(interpolate(f, [m.at, m.at + 12], [0, 1], cl)); if (g <= 0 || f < st[m.line]) return null;
            const c0 = m.c0 ?? 0, c1 = m.c1 ?? lines[m.line].length;
            const x = x0 + c0 * CW - 12, w = (c1 - c0) * CW + 24, y = lineY(m.line) - FS * 0.95;
            return m.red
              ? <div key={i} style={{ position: "absolute", left: x, top: y, width: w * g, height: FS * 1.25, background: RED, opacity: 0.92 }} />
              : <div key={i} style={{ position: "absolute", left: x, top: y - 4, width: w, height: FS * 1.25 + 8, border: `4px solid ${RED}`, clipPath: `inset(0 ${(1 - g) * 100}% 0 0)` }} />;
          })}
          {/* the printed text */}
          {lines.map((l, i) => {
            const n = shown(i); if (n <= 0) return null;
            const mk = marks.find((m) => m.line === i && m.red && f >= m.at + 4);
            const dim = marks.length && f > marks[0].at && !marks.some((m) => m.line === i) ? 1 - 0.55 * io(interpolate(f, [marks[0].at, marks[0].at + 14], [0, 1], cl)) : 1;
            return <div key={i} style={{ position: "absolute", left: x0, top: lineY(i) - FS, fontFamily: "Courier Prime", fontWeight: 700, fontSize: FS, lineHeight: `${FS * 1.1}px`,
              whiteSpace: "pre", color: mk ? "#fff" : "#16171a", opacity: 0.93 * dim, textShadow: mk ? "none" : "0 0 1px rgba(20,20,25,.6)" }}>{l.slice(0, n)}</div>;
          })}
          {/* the machine: slot, platen, carriage */}
          <div style={{ position: "absolute", left: 0, right: 0, top: SLOT_Y, bottom: -300, background: "linear-gradient(180deg,#1b1e23 0%,#101215 18%,#07080a 100%)", borderTop: "3px solid #3a3f47" }} />
          <div style={{ position: "absolute", left: width / 2 - PAPER_W / 2 - 40, width: PAPER_W + 80, top: SLOT_Y - 6, height: 14, borderRadius: 7, background: "linear-gradient(180deg,#4a4f57,#16181c)" }} />
          <div style={{ position: "absolute", top: SLOT_Y - 26 + shake, left: x0 + Math.min(curChars, lines[cur].length) * CW - 8, width: 34, height: 40, borderRadius: 4,
            background: "linear-gradient(180deg,#2d3137,#121418)", boxShadow: "0 4px 10px rgba(0,0,0,.6)", opacity: f >= st[cur] ? 1 : 0 }} />
        </div>
      </AbsoluteFill>
      {/* light pool + vignette */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 60% 55% at ${48 + 4 * Math.sin(f / 50)}% 46%, rgba(255,244,225,.07) 0%, rgba(0,0,0,0) 45%, rgba(3,4,6,.7) 100%)` }} />
      <div style={{ position: "absolute", left: 48, bottom: 36, padding: "6px 12px", background: "rgba(6,8,11,.78)", fontFamily: "Archivo", fontWeight: 600, fontSize: 22, letterSpacing: "0.08em", color: "rgba(255,255,255,.7)" }}>{credit}</div>
    </AbsoluteFill>
  );
};
