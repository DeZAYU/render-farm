// TOR09 PenTable (3 Nov; replaces PageLight_N2P): the NWS Norman tornado table for 3 May 1999, re-typeset sharp as a printed sheet
// (typewriter face, the real rows 10-12 with tornado A9 in the middle) lying on a dark desk in 3-D. A red pen comes in and annotates it
// on the words: a hand-drawn loop round A9's time span, "85 MIN" written beside it, then two quick strokes under the 38 miles.
// Source credited small. Data: weather.gov/oun/events-19990503 (row 11: A9, 05/03/1999, 1726-1848, 38 mi, 1760 yd, F5).
import React from "react";
import { AbsoluteFill, Easing, continueRender, delayRender, interpolate, random, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";
import { useChannelFonts, ARCH } from "./TOR09_util";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
const INK = "#C8141A";

let hp: Promise<void> | null = null;
const useHand = () => {
  const [h] = React.useState(() => delayRender("pentable hand font"));
  React.useEffect(() => {
    if (!hp) hp = new FontFace("PenHand", `url(${staticFile("fonts/Lacquer-Regular.ttf")})`).load().then((f) => { document.fonts.add(f); });
    hp.then(() => continueRender(h));
  }, [h]);
};

// sheet layout (sheet px)
const SW = 1500, SH = 800;
const COLS: [string, number][] = [["#", 70], ["ID", 90], ["DATE", 200], ["TIME (CDT)", 200], ["LENGTH (MI)", 160], ["WIDTH (YD)", 160], ["F-SCALE", 130], ["COUNTIES", 340]];
const ROWS: string[][] = [
  ["10", "B2", "05/03/1999", "1720-1724", "2", "25", "F0", "Caddo"],
  ["11", "A9", "05/03/1999", "1726-1848", "38", "1760", "F5", "Grady / McClain / Cleveland / Oklahoma"],
  ["12", "B3", "05/03/1999", "1738-1759", "7", "150", "F1", "Caddo"],
];
const X0 = 75, HY = 180, HH = 56, RH = 100, RA = 180; // table left, header top, header height, row height, A9 row height (room for the note)
const colX = (i: number) => X0 + COLS.slice(0, i).reduce((a, c) => a + c[1], 0);
const rowY = (r: number) => HY + HH + (r === 0 ? 0 : r === 1 ? RH : RH + RA);
const rowH = (r: number) => (r === 1 ? RA : RH);
// annotation geometry: the A9 time cell and length cell
const TC = { x: colX(3) + COLS[3][1] / 2, y: rowY(1) + 118 };
const LC = { x: colX(4) + COLS[4][1] / 2, y: rowY(1) + 118 };

// hand-drawn loop: ~1.12 turns with a slowly changing radius (overshoot), tiny wobble
const loopPt = (u: number) => {
  const a = -2.4 + u * Math.PI * 2 * 1.12;
  const rx = 108 + 8 * u + 4 * Math.sin(u * 17), ry = 50 + 6 * u + 2 * Math.sin(u * 13);
  return { x: TC.x + rx * Math.cos(a) + 6 * u, y: TC.y + ry * Math.sin(a) - 4 * u };
};
const LOOP = Array.from({ length: 81 }, (_, i) => loopPt(i / 80));
const UL1 = [{ x: LC.x - 46, y: LC.y + 34 }, { x: LC.x + 50, y: LC.y + 30 }];
const UL2 = [{ x: LC.x + 44, y: LC.y + 44 }, { x: LC.x - 40, y: LC.y + 47 }];
const NOTE = { x: TC.x - 70, y: rowY(1) + 56 }; // "85 MIN" written above the loop, slightly tilted

const poly = (pts: { x: number; y: number }[], u: number) => {
  const n = Math.max(2, Math.round(u * (pts.length - 1)) + 1);
  return pts.slice(0, n).map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
};
const lerpPts = (pts: { x: number; y: number }[], u: number) => {
  const t = Math.min(0.9999, Math.max(0, u)) * (pts.length - 1), i = Math.floor(t), k = t - i;
  return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * k, y: pts[i].y + (pts[i + 1].y - pts[i].y) * k };
};

// timings (frames from the start of the shot); defaults fit "It lasted eighty-five minutes over about thirty-eight miles."
type T = { loop: [number, number]; note: [number, number]; ul: [number, number] };
export const PenTable: React.FC<{ t?: T; credit?: string }> = ({ t = { loop: [16, 40], note: [40, 58], ul: [66, 84] }, credit = "SOURCE: NWS NORMAN, WEATHER.GOV/OUN" }) => {
  useChannelFonts(); useHand();
  const f = useCurrentFrame(); const { width, height, durationInFrames: n } = useVideoConfig();
  const uL = io(interpolate(f, [t.loop[0], t.loop[1]], [0, 1], cl));
  const uN = interpolate(f, [t.note[0], t.note[1]], [0, 1], cl);
  const mid = (t.ul[0] + t.ul[1]) / 2;
  const u1 = io(interpolate(f, [t.ul[0], mid - 1], [0, 1], cl)), u2 = io(interpolate(f, [mid + 1, t.ul[1]], [0, 1], cl));
  // pen tip path
  const start = { x: SW + 120, y: SH + 140 }, park = { x: SW - 160, y: SH + 60 };
  const notePt = (u: number) => ({ x: NOTE.x + u * 190, y: NOTE.y + 8 * Math.sin(u * 22) - 6 });
  let tip: { x: number; y: number }, down = false;
  if (f < t.loop[0]) { const u = io(interpolate(f, [0, t.loop[0]], [0, 1], cl)); tip = { x: start.x + (LOOP[0].x - start.x) * u, y: start.y + (LOOP[0].y - start.y) * u }; }
  else if (f <= t.loop[1]) { tip = lerpPts(LOOP, uL); down = true; }
  else if (f < t.note[0] + 2) { const u = io(interpolate(f, [t.loop[1], t.note[0] + 2], [0, 1], cl)); const a = LOOP[80], b = notePt(0); tip = { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
  else if (f <= t.note[1]) { tip = notePt(uN); down = true; }
  else if (f < t.ul[0]) { const u = io(interpolate(f, [t.note[1], t.ul[0]], [0, 1], cl)); const a = notePt(1); tip = { x: a.x + (UL1[0].x - a.x) * u, y: a.y + (UL1[0].y - a.y) * u }; }
  else if (f <= mid) { tip = lerpPts(UL1, u1); down = true; }
  else if (f <= t.ul[1]) { tip = lerpPts(UL2, u2); down = true; }
  else { const u = io(interpolate(f, [t.ul[1], t.ul[1] + 24], [0, 1], cl)); const a = UL2[1]; tip = { x: a.x + (park.x - a.x) * u, y: a.y + (park.y - a.y) * u }; }
  const lift = down ? 0 : 14;
  // camera: whole sheet, then an eased push toward the A9 row
  const push = io(interpolate(f, [0, n - 1], [0, 1], cl));
  const z = 0.98 + 0.26 * push;
  const fx = SW / 2 + (TC.x + 80 - SW / 2) * push, fy = SH / 2 + (TC.y - SH / 2) * push;
  const fade = interpolate(f, [0, 8], [0, 1], cl);
  const cell = (txt: string, w: number, key: number, bold?: boolean) => (
    <div key={key} style={{ width: w, flex: "none", textAlign: key === 7 ? "left" : "center", padding: key === 7 ? "0 14px" : 0, boxSizing: "border-box",
      fontFamily: "Elite", fontSize: key === 7 ? 25 : 34, lineHeight: 1.2, color: "#151515", fontWeight: bold ? 700 : 400 }}>{txt}</div>
  );
  return (
    <AbsoluteFill style={{ background: "#0d0d0d", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 60% at 50% 45%, #2b2a28 0%, #121212 60%, #070707 100%)" }} />
      <AbsoluteFill style={{ perspective: 2400, opacity: fade }}>
        <div style={{ position: "absolute", left: width / 2 - fx, top: height / 2 - fy, width: SW, height: SH, transformOrigin: `${fx}px ${fy}px`,
          transform: `scale(${z}) rotateX(${12 - 5 * push}deg) rotateZ(${-2.2 + 1.2 * push}deg)` }}>
          {/* the printed sheet */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, #f6f3ec 0%, #ebe6dc 100%)", boxShadow: "0 40px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(0,0,0,.08)" }} />
          <div style={{ position: "absolute", left: X0, top: 64, ...ARCH, fontSize: 30, letterSpacing: "0.04em", color: "#141414" }}>THE GREAT PLAINS TORNADO OUTBREAK OF MAY 3-4, 1999</div>
          <div style={{ position: "absolute", left: X0, top: 110, fontFamily: "Elite", fontSize: 24, color: "#3a3a3a" }}>National Weather Service, Norman, Oklahoma - tornado table (rows 10-12)</div>
          {/* header */}
          <div style={{ position: "absolute", left: X0, top: HY, height: HH, display: "flex", alignItems: "center", background: "#161616" }}>
            {COLS.map(([h, w], i) => <div key={i} style={{ width: w, textAlign: i === 7 ? "left" : "center", padding: i === 7 ? "0 14px" : 0, boxSizing: "border-box", ...ARCH, fontSize: 19, letterSpacing: "0.06em", color: "#f2f2f0" }}>{h}</div>)}
          </div>
          {ROWS.map((r, ri) => (
            <div key={ri} style={{ position: "absolute", left: X0, top: rowY(ri), height: rowH(ri), display: "flex", alignItems: "center", paddingTop: ri === 1 ? 76 : 0, boxSizing: "border-box",
              borderBottom: "2px solid rgba(0,0,0,.55)", opacity: ri === 1 ? 1 : 0.55 }}>
              {r.map((c, ci) => cell(c, COLS[ci][1], ci, ri === 1))}
            </div>
          ))}
          {/* column rules */}
          {COLS.slice(1).map((_, i) => <div key={i} style={{ position: "absolute", left: colX(i + 1), top: HY + HH, width: 1.5, height: RH * 2 + RA, background: "rgba(0,0,0,.28)" }} />)}
          {/* paper grain */}
          <svg style={{ position: "absolute", inset: 0 }} width={SW} height={SH}>
            {Array.from({ length: 220 }, (_, i) => <circle key={i} cx={random("gx" + i) * SW} cy={random("gy" + i) * SH} r={0.6 + random("gr" + i)} fill="#000" opacity={0.035} />)}
          </svg>
          {/* ink */}
          <svg style={{ position: "absolute", inset: 0, overflow: "visible" }} width={SW} height={SH}>
            {f >= t.loop[0] && <path d={poly(LOOP, uL)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />}
            {f >= t.ul[0] && <path d={poly(UL1, u1)} fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" opacity={0.92} />}
            {f > mid && <path d={poly(UL2, u2)} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.9} />}
            <defs><clipPath id="pt-note"><rect x={NOTE.x - 10} y={NOTE.y - 70} width={20 + 200 * uN} height={110} /></clipPath></defs>
            <text x={NOTE.x} y={NOTE.y} clipPath="url(#pt-note)" transform={`rotate(-4 ${NOTE.x} ${NOTE.y})`} fontFamily="PenHand" fontSize={58} fill={INK} opacity={0.95}>85 MIN</text>
          </svg>
          {/* the pen: a slim red-capped barrel, its tip on the ink point, a soft shadow that closes in when it touches the paper */}
          <div style={{ position: "absolute", left: tip.x + 18 + lift, top: tip.y + 26 + lift * 1.4, width: 30, height: 420, borderRadius: 15, background: "rgba(0,0,0,.35)", filter: "blur(10px)", transform: "rotate(-38deg)", transformOrigin: "50% 0%" }} />
          <div style={{ position: "absolute", left: tip.x - 11, top: tip.y - 6 - lift, width: 22, height: 400, transform: "rotate(-38deg)", transformOrigin: "50% 0%" }}>
            <div style={{ position: "absolute", left: 7, top: 0, width: 8, height: 22, background: "linear-gradient(90deg,#777,#ddd,#666)", clipPath: "polygon(50% 0, 100% 100%, 0 100%)" }} />
            <div style={{ position: "absolute", left: 2, top: 20, width: 18, height: 40, background: "linear-gradient(90deg,#1a1a1a,#555,#111)", borderRadius: "3px 3px 0 0" }} />
            <div style={{ position: "absolute", left: 0, top: 58, width: 22, height: 340, background: `linear-gradient(90deg, #7d0c10, ${RED} 45%, #8c0d12)`, borderRadius: 4 }} />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{ position: "absolute", right: 46, bottom: 34, ...ARCH, fontSize: 16, letterSpacing: "0.12em", color: "rgba(242,242,240,.6)", opacity: fade }}>{credit}</div>
    </AbsoluteFill>
  );
};
