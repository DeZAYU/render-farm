// IN01 HeadlineCut: the real article (masthead, headline, byline, photo) rises as a tilted paper sheet over the dimmed, softened
// footage; the quoted headline line, the page's own pixels on a white paper strip, lifts off the sheet toward camera while the sheet
// sinks away, and settles flat over the footage, which clears and brightens behind it. No red, no re-typed text.
import React from "react";
import { AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { type CK, camAt, placeOf, cl, io, out } from "./DC01_kit";

type P = {
  bg: string; bgT: number; bgKeys: CK[];
  sheet: string; sw: number; sh: number;        // sheet image (px)
  quote: string; qw: number; qh: number;        // the headline line (page pixels)
  qx: number; qy: number;                       // where that line sits on the sheet (px)
  liftAt?: number; settle?: [number, number];   // frame the lift starts; final strip centre on screen
};
export const HeadlineCut: React.FC<P> = ({ bg, bgT, bgKeys, sheet, sw, sh, quote, qw, qh, qx, qy, liftAt = 40, settle = [960, 820] }) => {
  const f = useCurrentFrame();
  const p = placeOf(camAt(f, bgKeys));
  const enter = out(interpolate(f, [0, 26], [0, 1], cl));
  const lift = io(interpolate(f, [liftAt, liftAt + 34], [0, 1], cl));
  const dim = interpolate(f, [0, 14], [0, 1], cl) * (1 - 0.55 * lift);
  const ox = qx + qw / 2, oy = qy + qh / 2;     // transform origin = the line's centre
  const P0: [number, number] = [1120, 360], P1 = settle;
  const cx = P0[0] + (P1[0] - P0[0]) * lift, cy = P0[1] + (P1[1] - P0[1]) * lift + (1 - enter) * 520;
  const gs = 0.6 + (1.22 - 0.6) * lift + 0.02 * io(interpolate(f, [0, 200], [0, 1], cl));
  const rx = 18 * (1 - lift) + 6 * (1 - enter), rz = -4 * (1 - lift), ry = -10 * (1 - lift);
  const sheetOp = enter * (1 - io(interpolate(f, [liftAt + 4, liftAt + 30], [0, 1], cl)));
  const sheetDrop = 160 * io(interpolate(f, [liftAt, liftAt + 34], [0, 1], cl));
  const z = 70 * lift;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Freeze frame={0}><OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgT * 30)} muted
        style={{ position: "absolute", left: p.left, top: p.top, width: p.w, height: p.h, filter: `brightness(${1 - 0.5 * dim}) blur(${4 * dim}px) saturate(${1 - 0.3 * dim})` }} /></Freeze>
      <AbsoluteFill style={{ perspective: 1700, perspectiveOrigin: "50% 40%" }}>
        <div style={{ position: "absolute", left: cx - ox, top: cy - oy, width: sw, height: sh, transformOrigin: `${ox}px ${oy}px`, transformStyle: "preserve-3d",
          transform: `scale(${gs}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)` }}>
          <div style={{ position: "absolute", inset: 0, opacity: sheetOp, transform: `translateZ(${-sheetDrop}px) translateY(${sheetDrop * 0.6}px)`,
            boxShadow: "0 30px 70px rgba(0,0,0,.6), 0 4px 12px rgba(0,0,0,.4)", background: "#fff" }}>
            <Img src={staticFile(sheet)} style={{ width: sw, height: sh, display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(255,255,255,0) 55%, rgba(0,0,0,.18) 100%)" }} />
          </div>
          <div style={{ position: "absolute", left: qx - 18, top: qy - 10, padding: "10px 18px", background: "#fff", opacity: enter,
            transform: `translateZ(${z}px)`, boxShadow: `0 ${6 + 26 * lift}px ${10 + 40 * lift}px rgba(0,0,0,${0.15 + 0.45 * lift})` }}>
            <Img src={staticFile(quote)} style={{ width: qw, height: qh, display: "block" }} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
