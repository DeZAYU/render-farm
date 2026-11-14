// photo / PortraitFile: the DD "File Viewer" portrait card over footage. REF: Dashcam Vol.1 0:01.9-4.77 (Sydney Thomas card) + D2 6:47;
// FONTS.md File Viewer (Helvetica Medium/Regular/Bold -> Inter 500/400/700: chrome "File Viewer" cap 15 #BCBCBC, age line #E5E5EA, NAME caps
// #F6F7FB right-aligned bottom-right, card #232323); wp3 sec_C LuCard @5992. Motion (D1 A1): card scales 0.10 -> 1.00 in 6 f while opacity
// ramps 0 -> 0.9 over 13 f, settles 0.95 -> 1.01 by f32; a red leader line draws from the card to the subject; the background pushes x1.21
// in 1.2 s ease-out (peak 2.5 %/f at f8). Our version: name block sized up ~15 % for legibility, motion blur on the 6 f pop, the card keeps
// a 0.4 %/s life drift, the footage keeps the Dashcam linear push under the eased punch.
import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, Media, RC, Vignette, W, clamp01, fs, linPush } from "../../core";

export type PortraitFileProps = {
  bg: string; // footage or still behind the card
  src: string; // portrait photo
  pos?: string; // object-position of the portrait
  zoom?: number; // extra zoom on the portrait inside the card
  chrome?: string; // title bar text
  sub?: string; // small line above the name (age / role)
  name: string; // caps
  at?: number; // card pop (D1: ~0.8 s before the name is spoken)
  card?: { x: number; y: number; w: number; h: number }; // screen px (photo area h; the chrome bar is added on top)
  line?: { x: number; y: number }; // leader-line target (screen px); omit for no line
  punch?: number; // background punch (D1 x1.21)
  cap?: number; // name cap (px)
  subCap?: number; // sub line cap (px)
};

export const PortraitFile: React.FC<PortraitFileProps> = ({
  bg, src, pos = "50% 30%", zoom = 1, chrome = "File Viewer", sub, name, at = 10, card = { x: 640, y: 150, w: 548, h: 700 }, line, punch = 0.21, cap = 32, subCap = 28,
}) => {
  const k = useCurrentFrame();
  const kc = k - at;
  const cs = kc < 0 ? 0 : kc < 6 ? 0.1 + 0.9 * EZ.out3(kc / 6) : interpolate(kc, [6, 14, 32], [1, 0.95, 1.01], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.sin) }) * (1 + 0.004 * (Math.max(0, kc - 32) / 30));
  const co = 0.9 * clamp01(kc / 13) + 0.1 * clamp01((kc - 13) / 10);
  const bgS = linPush(k) * (1 + punch * (1 - Math.exp(-Math.max(0, kc) / 9)));
  const bar = 36;
  const L = line ? (() => {
    const sx = line.x < card.x ? card.x : card.x + card.w, sy = card.y + bar + card.h * 0.42;
    const len = Math.hypot(line.x - sx, line.y - sy);
    return { sx, sy, len, p: EZ.out2((kc - 8) / 6) };
  })() : null;
  const nf = fs("inter", cap), sf = fs("inter", subCap);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ transformOrigin: "50% 45%", transform: `scale(${bgS.toFixed(5)})` }}><Media src={bg} /></AbsoluteFill>
      <Vignette />
      {L && L.p > 0 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <line x1={L.sx} y1={L.sy} x2={line!.x} y2={line!.y} stroke={RC.lineRed} strokeWidth={3} strokeDasharray={`${L.len * L.p} ${L.len + 10}`} style={{ filter: `drop-shadow(0 0 5px ${RC.lineRed})` }} />
        </svg>
      ) : null}
      {kc >= 0 ? (
        <MBlur on={kc < 6} samples={6}>
          <AbsoluteFill>
            <div style={{ position: "absolute", left: card.x, top: card.y, width: card.w, height: card.h + bar + 8, opacity: co, transform: `scale(${cs.toFixed(4)})`, transformOrigin: "50% 48%",
              background: "#232323", boxShadow: "0 18px 50px rgba(0,0,0,.75), 0 0 0 1px rgba(255,255,255,.06)" }}>
              <div style={{ height: bar, display: "flex", alignItems: "center", paddingLeft: 12, fontFamily: FONT.inter, fontWeight: 500, fontSize: fs("inter", 15), color: "#BCBCBC" }}>{chrome}</div>
              <div style={{ position: "absolute", left: 6, top: bar, width: card.w - 12, height: card.h, overflow: "hidden", background: "#111" }}>
                <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: pos }}><Media src={src} pos={pos} /></div>
                <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 240, background: "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,.8))" }} />
                <div style={{ position: "absolute", right: 22, bottom: 20, textAlign: "right", textShadow: "0 2px 6px rgba(0,0,0,.6)" }}>
                  {sub ? <div style={{ fontFamily: FONT.inter, fontWeight: 400, fontSize: sf, color: "#E5E5EA", marginBottom: 2 }}>{sub}</div> : null}
                  <div style={{ fontFamily: FONT.inter, fontWeight: 700, fontSize: nf, color: "#F6F7FB", letterSpacing: "0.01em" }}>{name}</div>
                </div>
              </div>
            </div>
          </AbsoluteFill>
        </MBlur>
      ) : null}
    </AbsoluteFill>
  );
};
