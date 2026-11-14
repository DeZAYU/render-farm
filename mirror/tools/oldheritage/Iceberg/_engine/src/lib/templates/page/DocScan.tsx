// page / DocScan: official documents (PDF / report pages) lying on a desk, seen at a reading angle (plane pitched ~34 deg). The desk lamp
// flickers on (Farrell CC screen-on flicker), the camera travels between pages (DD corkboard camera bezier), and on the key row a RULER
// highlight lands: a pale band across the full row while the rest of that page dims (a reading guide), with an optional number that rolls
// up beside the row and an optional DD red bar on one cell.
// REF Farrell evidence A7 documents on a lit surface (GR 8:33, CC 9:40 incl. the 3-flicker switch-on L 17 -> 35 -> 17 -> 28 -> 35) +
// DD V1 E12 camera moves (bezier .45,0,.2,1) + Farrell FA R9 roll-up for the count.
import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { EZ, FONT, MBlur, RC, asset, clamp01, fs, lerp, lerpLog, type Rect } from "../../core";
import { ddWipe, markBars, WhiteInk, type Mark } from "./shared";

export type DocPage = { src: string; cssW: number; cssH: number; crop: [number, number, number, number]; x: number; y: number; w: number; rot?: number };
export type DocScanProps = {
  /** words inside the red bars: "page" (default, DD original: black on red) | "white" (re-inked white, M-024 contrast) */
  ink?: "page" | "white";
  pages: DocPage[]; // world (desk) px: centre x/y, width
  cam0: { x: number; y: number; z: number };
  moves?: { at: number; d?: number; x: number; y: number; z: number }[];
  ruler?: { page: number; r: Rect; at: number }; // the row (CSS px of that page's capture)
  count?: { to: number; at: number; dur?: number; suffix?: string }; // rolls up beside the ruler row
  bars?: { page: number; marks: Mark[] }; // DD red bar on a cell
  cap?: number; // count cap height (default 120)
};
const FLICK = [0.18, 0.62, 0.22, 0.5, 0.82, 1];
const Inner: React.FC<DocScanProps> = (p) => {
  const f = useCurrentFrame();
  const t = Math.max(0, f) / 30;
  let c = { x: p.cam0.x, y: p.cam0.y, z: p.cam0.z };
  for (const m of p.moves ?? []) {
    const u = EZ.ddCam((f - m.at) / (m.d ?? 36));
    c = { x: lerp(c.x, m.x, u), y: lerp(c.y, m.y, u), z: lerpLog(c.z, m.z, u) };
  }
  const z = c.z * (1 + 0.007 * t);
  const lamp = f < FLICK.length ? FLICK[Math.max(0, Math.floor(f))] : 1;
  const rk = p.ruler ? EZ.out2((f - p.ruler.at) / 10) : 0;
  return (
    <AbsoluteFill style={{ background: "#070504" }}>
      <AbsoluteFill style={{ filter: `brightness(${lamp})` }}>
        <AbsoluteFill style={{ perspective: "1500px" }}>
          <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "960px 540px", transform: "rotateX(34deg)" }}>
            <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(960px, 540px) rotate(${(-0.8 + 0.1 * t).toFixed(3)}deg) scale(${z.toFixed(4)}) translate(${-c.x}px, ${-c.y}px)` }}>
              <div style={{ position: "absolute", left: -3000, top: -2400, width: 6000, height: 4800, background: "radial-gradient(ellipse 22% 26% at 50% 50%, #3a2a1c 0%, #20160e 45%, #0d0906 100%)" }} />
              {p.pages.map((pg, i) => {
                const [x0, y0, x1, y1] = pg.crop;
                const k = pg.w / (x1 - x0), h = (y1 - y0) * k;
                const isR = p.ruler?.page === i;
                const bars = p.bars?.page === i ? markBars(f, p.bars.marks, { ink: p.ink, c: RC.pageRed, ease: ddWipe, perLine: 18, px: 3, py: 3, radius: 0 }) : [];
                const rr = isR ? p.ruler!.r : null;
                return (
                  <div key={i} style={{ position: "absolute", left: pg.x - pg.w / 2, top: pg.y - h / 2, width: pg.w, height: h, transform: `rotate(${pg.rot ?? 0}deg)`, background: "#fbfaf7",
                    boxShadow: "8px 14px 26px rgba(0,0,0,.55)", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: -x0 * k, top: -y0 * k, width: pg.cssW, height: pg.cssH, transformOrigin: "0 0", transform: `scale(${k})`, isolation: "isolate" }}>
                      {bars.filter((b) => b.p > 0).map((b, j) => (
                        <div key={j} style={{ position: "absolute", left: b.r[0] - 3, top: b.r[1] - 3, width: (b.r[2] + 6) * b.p, height: b.r[3] + 6, background: b.c }} />
                      ))}
                      <Img src={asset(pg.src)} style={{ position: "absolute", left: 0, top: 0, width: pg.cssW, height: pg.cssH, mixBlendMode: "multiply", filter: "contrast(1.05) grayscale(.2)" }} />
                      {p.ink === "white" ? <WhiteInk bars={bars} src={pg.src} cssW={pg.cssW} cssH={pg.cssH} ix={0} iy={0} /> : null}
                      {rr && rk > 0 ? (
                        <>
                          {/* reading guide: dim above and below the row, a pale band on it */}
                          <div style={{ position: "absolute", left: 0, top: 0, width: pg.cssW, height: rr[1] - 6, background: `rgba(10,8,6,${(0.5 * rk).toFixed(3)})` }} />
                          <div style={{ position: "absolute", left: 0, top: rr[1] + rr[3] + 6, width: pg.cssW, height: pg.cssH, background: `rgba(10,8,6,${(0.5 * rk).toFixed(3)})` }} />
                          <div style={{ position: "absolute", left: rr[0] - 10, top: rr[1] - 6, width: (rr[2] + 20) * EZ.out3((f - p.ruler!.at) / 14), height: rr[3] + 12, background: "rgba(255,236,150,.55)", mixBlendMode: "multiply" }} />
                          <div style={{ position: "absolute", left: 0, top: rr[1] + rr[3] + 5, width: pg.cssW * EZ.out3((f - p.ruler!.at) / 14), height: 2, background: RC.pageRed }} />
                        </>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>
      {p.count && f >= p.count.at ? (
        <div style={{ position: "absolute", right: 120, bottom: 110, padding: "6px 30px 14px", background: "rgba(8,6,5,.82)", boxShadow: "0 10px 30px rgba(0,0,0,.6)", fontFamily: FONT.nunito, fontWeight: 900, fontSize: fs("nunito", p.cap ?? 120), color: RC.labelRed, lineHeight: 1,
          filter: "drop-shadow(0 0 10px rgba(249,9,15,.5)) drop-shadow(0 4px 10px rgba(0,0,0,.7))", opacity: clamp01((f - p.count.at) / 5) }}>
          {Math.round(p.count.to * EZ.out3((f - p.count.at) / (p.count.dur ?? 24)))}{p.count.suffix ?? ""}
        </div>
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 70% 68% at 50% 52%, rgba(0,0,0,0) 45%, rgba(0,0,0,.7) 100%)" }} />
    </AbsoluteFill>
  );
};
export const DocScan: React.FC<DocScanProps> = (p) => {
  const f = useCurrentFrame();
  const fast = (p.moves ?? []).some((m) => { const u = (f - m.at) / (m.d ?? 36); return u > 0.12 && u < 0.75; });
  return <MBlur on={fast}><Inner {...p} /></MBlur>;
};
