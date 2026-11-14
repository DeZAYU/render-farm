// DC07 ReportDesk: three real pages of the NTSB final report (ANC18LA010, rendered sharp from the PDF) lying fanned on a dark desk
// in 3-D under one soft overhead light. The camera glides page to page on the VO: the factual page, where the line about the fuel
// not being sumped stays bright while the rest of the sheet sinks; the engine-test page, easing into the photo of the debris tapped
// out of the fuel strainer; the summary page, settling on the probable cause, where one thin red rule draws under its last words.
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC01_kit";

type Page = { src: string; x: number; y: number; rot: number; line?: [number, number, number, number] };   // line box in page px (1700x2200)
type Stop = { f: number; x: number; y: number; s: number; page: number };
export const ReportDesk: React.FC<{ pages: Page[]; stops: Stop[]; ruleAt: number; rule: [number, number, number, number]; ruleLen: number }> = ({ pages, stops, ruleAt, rule, ruleLen }) => {
  const f = useCurrentFrame();
  const PW = 1100, k = PW / 1700, PH = 2200 * k;
  let c = { x: stops[0].x, y: stops[0].y, s: stops[0].s }, act = stops[0].page, lit = 1;
  const wt = pages.map((_, i) => (i === stops[0].page ? 1 : 0));
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    if (f >= b.f) { c = { x: b.x, y: b.y, s: b.s }; act = b.page; wt.fill(0); wt[b.page] = 1; continue; }
    if (f >= b.f - 32) { const u = io(interpolate(f, [b.f - 32, b.f], [0, 1], cl)); c = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, s: a.s + (b.s - a.s) * u }; lit = Math.abs(u - 0.5) * 2; act = u < 0.5 ? a.page : b.page; wt.fill(0); wt[a.page] += 1 - u; wt[b.page] += u; }
    break;
  }
  const enter = io(interpolate(f, [0, 24], [0, 1], cl));
  const rp = io(interpolate(f, [ruleAt, ruleAt + ruleLen], [0, 1], cl));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, #1b1a18 0%, #070707 100%)", overflow: "hidden", perspective: 1600 }}>
      <div style={{ position: "absolute", left: 960 - c.x, top: 540 - c.y, width: 1, height: 1, transformOrigin: `${c.x}px ${c.y}px`,
        transform: `scale(${c.s * (0.92 + 0.08 * enter)}) rotateX(${12 - 4 * enter}deg)` }}>
        {pages.map((p, i) => {
          const on = i === act ? lit : 0;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, width: PW, height: PH, transform: `rotate(${p.rot}deg)`, boxShadow: "0 30px 60px rgba(0,0,0,.7)", opacity: enter }}>
              <Img src={staticFile(p.src)} style={{ width: PW, height: PH, display: "block", filter: `brightness(${0.42 + 0.58 * wt[i]})` }} />
              {p.line && <>
                {/* the rest of the sheet sinks while the spoken line stays bright */}
                <div style={{ position: "absolute", left: 0, top: 0, width: PW, height: (p.line[1] - 4) * k, background: "linear-gradient(to bottom, #000 0%, #000 calc(100% - 46px), rgba(0,0,0,0) 100%)", opacity: 0.3 * on }} />
                <div style={{ position: "absolute", left: 0, top: (p.line[3] + 4) * k, width: PW, bottom: 0, background: "linear-gradient(to top, #000 0%, #000 calc(100% - 46px), rgba(0,0,0,0) 100%)", opacity: 0.3 * on }} />
              </>}
              {i === pages.length - 1 && <div style={{ position: "absolute", left: rule[0] * k, top: rule[3] * k + 3, width: (rule[2] - rule[0]) * k * rp, height: 3, background: "#E3141B" }} />}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 65% 60% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
