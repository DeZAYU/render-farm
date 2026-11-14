// TOR22 TeletypeSheet: the NWS Boulder survey statement (PNSBOU, 22 May 2025, IEM AFOS archive) re-typeset sharp as the teletype
// product it really is: a continuous-form printout (tractor-feed holes, faint bars) lying tilted in 3-D over the deputy's blurred
// dashcam. The real lines print one by one (a print head runs each line), the paper feeds up as it prints; the rating block's "EF2"
// is boxed in red as the VO says it, then the camera glides back up the sheet to the overview line and a red rule draws under
// "UNCHARACTERISTICALLY STRONG LANDSPOUT". Source credited small. Text = the product's own words, line breaks re-flowed.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";
import { FONT } from "../lib/core/type";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

const LINES = [
  "PUBLIC INFORMATION STATEMENT",
  "NATIONAL WEATHER SERVICE DENVER/BOULDER CO",
  "730 AM MDT THU MAY 22 2025",
  "",
  "...NWS DAMAGE SURVEY FOR 05/18/25 TORNADO EVENT...",
  "",
  "THE FIRST TORNADO THAT PRODUCED DAMAGE IN NORTHWEST",
  "ELBERT COUNTY WAS AN UNCHARACTERISTICALLY STRONG LANDSPOUT,",
  "AS WELL AS THE LAST TORNADO THAT OCCURRED NORTHEAST OF BENNETT.",
  "",
  ".ELKHORN RANCH...",
  "",
  "RATING:                 EF2",
  "ESTIMATED PEAK WIND:    125 MPH",
  "PATH WIDTH /MAXIMUM/:   50 YARDS",
  "FATALITIES:             0",
];
const FS = 30, LH = 46, CW = FS * 0.6; // Courier Prime advance = 0.6 em
const PAD_X = 120, PAD_T = 90, PW = 1340;
const ly = (i: number) => PAD_T + i * LH; // baseline-ish top of line i

export const TeletypeSheet: React.FC<{ bg: string; bgFrom: number; printLen?: number; boxAt?: number; glideAt?: number; ruleAt?: number; credit?: string }> = ({
  bg, bgFrom, printLen = 52, boxAt = 57, glideAt = 66, ruleAt = 96, credit = "NWS DENVER/BOULDER · PUBLIC INFORMATION STATEMENT · 22 MAY 2025",
}) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  // print schedule: non-blank lines share printLen frames in proportion to their length
  const lens = LINES.map((l) => l.length), tot = lens.reduce((a, b) => a + b, 0);
  let acc = 0; const sched = LINES.map((l) => { const a = 4 + (acc / tot) * printLen; acc += l.length; return [a, 4 + (acc / tot) * printLen] as [number, number]; });
  // camera: follows the print line, holds on the rating block, glides up to the landspout line
  // smooth paper feed: continuous line position from the print schedule, averaged over the last 10 frames (no steps)
  const kt: number[] = [], kv: number[] = [];
  sched.forEach(([a0], i) => { if (!kt.length || a0 > kt[kt.length - 1] + 0.01) { kt.push(a0); kv.push(i); } });
  const lineAt = (t: number) => kt.length > 1 ? interpolate(t, kt, kv, cl) : 0;
  let pAvg = 0; for (let k = 0; k < 10; k++) pAvg += lineAt(f - k * 1.5) / 10;
  const followY = ly(Math.min(pAvg, 12)) + LH / 2;
  const holdY = ly(12) + LH / 2, landY = ly(7) + LH / 2;
  const g = io(interpolate(f, [glideAt, glideAt + 26], [0, 1], cl));
  const focusY = f < glideAt ? Math.min(followY, holdY) : holdY + (landY - holdY) * g;
  const focusX = PAD_X + 30 * CW;
  const zoom = 1.24 + 0.1 * io(f / Math.max(1, durationInFrames - 1));
  const inK = out(interpolate(f, [0, 14], [0, 1], cl));
  const PH = ly(LINES.length) + 120;
  const box = out(interpolate(f, [boxAt, boxAt + 10], [0, 1], cl));
  const rule = io(interpolate(f, [ruleAt, ruleAt + 22], [0, 1], cl));
  const efX = PAD_X + 24 * CW, efY = ly(12);
  const lsStart = LINES[7].indexOf("UNCHARACTERISTICALLY"), lsEnd = LINES[7].indexOf(",");
  const rx0 = PAD_X + lsStart * CW, rx1 = PAD_X + lsEnd * CW, ry = ly(7) + LH - 6;
  return (
    <AbsoluteFill style={{ background: "#070707", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(20px) brightness(.28) saturate(.6)" }} />
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: width / 2, top: height * 0.5, width: 0, height: 0, transformStyle: "preserve-3d",
          transform: `rotateX(${20 - 4 * inK}deg) rotateZ(${-3 + 1 * inK}deg) scale(${zoom * (0.94 + 0.06 * inK)})` }}>
          <div style={{ position: "absolute", left: -focusX, top: -focusY, width: PW, height: PH, background: "#f4f2ec", boxShadow: "0 40px 90px rgba(0,0,0,.7)", opacity: inK,
            backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,0) ${LH * 2}px, rgba(0,0,0,.035) ${LH * 2}px, rgba(0,0,0,.035) ${LH * 4}px)`, backgroundPositionY: PAD_T }}>
            {/* tractor-feed strips */}
            {[0, PW - 64].map((x) => <div key={x} style={{ position: "absolute", left: x, top: 0, width: 64, height: PH, borderLeft: x ? "2px dashed rgba(0,0,0,.18)" : undefined, borderRight: x ? undefined : "2px dashed rgba(0,0,0,.18)" }}>
              {Array.from({ length: Math.ceil(PH / 46) }).map((_, i) => <div key={i} style={{ position: "absolute", left: 20, top: 14 + i * 46, width: 22, height: 22, borderRadius: 11, background: "#070707", opacity: 0.85 }} />)}
            </div>)}
            {LINES.map((l, i) => {
              const [a, b] = sched[i]; if (!l.length) return null; const n = Math.floor(l.length * interpolate(f, [a, b], [0, 1], cl)); if (n <= 0) return null;
              return <div key={i} style={{ position: "absolute", left: PAD_X, top: ly(i), height: LH, lineHeight: `${LH}px`, fontFamily: FONT.courier, fontWeight: 700, fontSize: FS, color: "#151515", whiteSpace: "pre", letterSpacing: 0 }}>
                {l.slice(0, n)}
                {f < b && <span style={{ display: "inline-block", width: CW, height: FS * 0.95, background: "#151515", verticalAlign: "middle", marginLeft: 2 }} />}
              </div>;
            })}
            <svg width={PW} height={PH} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
              {box > 0 && <rect x={efX - 12} y={efY + 2} width={(3 * CW + 24)} height={LH - 4} fill="rgba(227,20,27,.10)" stroke={RED} strokeWidth={5}
                strokeDasharray={2 * (3 * CW + 24 + LH - 4)} strokeDashoffset={2 * (3 * CW + 24 + LH - 4) * (1 - box)} />}
              {rule > 0 && <line x1={rx0} y1={ry} x2={rx0 + (rx1 - rx0) * rule} y2={ry} stroke={RED} strokeWidth={6} strokeLinecap="round" />}
            </svg>
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 48, bottom: 34, padding: "7px 14px", background: "rgba(0,0,0,.72)", fontFamily: FONT.din, fontWeight: 700, fontSize: 20, letterSpacing: 2, color: "rgba(255,255,255,.78)", opacity: inK }}>{credit}</div>
    </AbsoluteFill>
  );
};
