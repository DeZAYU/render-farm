// TP00 (intro): CaseWall v2 (owner 3 Nov: v1 too fast). All 25 cases of the countdown as one 3-D wall of white-framed cards (a frame of each
// case's own footage, house grade, red place + year label), countdown order 25 -> 1. One slow eased camera move reveals the whole wall while
// the cards fade in softly as a diagonal wave (context, not one by one). Then FEATURED cards only, each on its VO line: the camera eases
// (ease-in-out per segment, continuous values) into the card, the other cards dim, the card's still turns into that case's footage playing;
// it holds >= 1.5 s, returns to the still and the dim lifts completely before the camera moves to the next one.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ease = Easing.inOut(Easing.cubic);
const COLS = 5, CW = 360, CH = 203, GX = 400, GY = 292;
const PW = COLS * GX, PH = 5 * GY;

export type WCard = { src: string; label: string };
export type WFeat = { j: number; video: string; from: number; vin: number; vout: number }; // card index, footage on vin..vout
export type WKey = { f: number; x: number; y: number; s: number; ry: number; rx: number; hop?: number }; // hop: scale at mid-move (continuous)
export const cardCenter = (j: number) => [(j % COLS) * GX + GX / 2, Math.floor(j / COLS) * GY + GY / 2 - 18] as const;
export const WALL_W = PW, WALL_H = PH;

const camAt = (keys: WKey[], f: number): WKey => {
  if (f <= keys[0].f) return keys[0];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (f <= b.f) { const t = ease((f - a.f) / (b.f - a.f)); const m = (k: "x" | "y" | "s" | "ry" | "rx") => a[k] + (b[k] - a[k]) * t;
      const s0 = m("s"), sc = b.hop ? s0 - (s0 - b.hop) * Math.sin(Math.PI * t) : s0;
      return { f, x: m("x"), y: m("y"), s: sc, ry: m("ry"), rx: m("rx") }; }
  }
  return keys[keys.length - 1];
};

export const CaseWall: React.FC<{ cards: WCard[]; feats: WFeat[]; cam: WKey[]; fadeIn?: [number, number] }> = ({ cards, feats, cam, fadeIn = [0, 70] }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const c = camAt(cam, f);
  // dim of the non-featured cards: up while a featured card plays, fully back to 0 between features
  const dimOf = (q: WFeat) => interpolate(f, [q.vin - 12, q.vin, q.vout, q.vout + 10], [0, 1, 1, 0], { ...cl, easing: ease });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, #15130f 0%, #050505 75%)", overflow: "hidden" }}>
      <RedLabel text="." at={1e6} />
      <div style={{ position: "absolute", left: width / 2, top: height / 2, width: PW, height: PH, transformOrigin: "0 0", willChange: "transform",
        transform: `perspective(2400px) rotateY(${c.ry}deg) rotateX(${c.rx}deg) scale(${c.s}) translate(${-c.x}px, ${-c.y}px)` }}>
        {cards.map((cd, j) => {
          const [x, y] = cardCenter(j);
          const w = ((j % COLS) + Math.floor(j / COLS)) / 8; // diagonal wave 0..1
          const a = fadeIn[0] + w * (fadeIn[1] - fadeIn[0] - 24);
          const g = interpolate(f, [a, a + 24], [0, 1], { ...cl, easing: ease });
          const ft = feats.find((q) => q.j === j);
          const on = ft ? interpolate(f, [ft.vin, ft.vin + 10, ft.vout - 8, ft.vout], [0, 1, 1, 0], { ...cl, easing: ease }) : 0;
          const dim = Math.max(0, ...feats.filter((q) => q.j !== j).map(dimOf)); // a featured card is never dimmed by its own feature
          const op = g * (1 - 0.7 * dim);
          return (
            <div key={j} style={{ position: "absolute", left: x - CW / 2, top: y - CH / 2, width: CW, opacity: op, transform: `translateY(${(1 - g) * 18}px)` }}>
              <div style={{ position: "relative", width: CW, height: CH, border: "6px solid #fff", boxSizing: "border-box", overflow: "hidden", background: "#000", boxShadow: "0 14px 30px rgba(0,0,0,.65)" }}>
                <Img src={staticFile(cd.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                {ft && f >= ft.vin - 2 && f <= ft.vout + 2 && (
                  <Sequence from={ft.vin - 2} layout="none">
                    <OffthreadVideo src={staticFile(ft.video)} startFrom={Math.round(ft.from * 30)} muted style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: on }} />
                  </Sequence>
                )}
              </div>
              <div style={{ position: "absolute", left: 0, top: CH + 10, background: RED, padding: "4px 9px", boxShadow: "0 4px 10px rgba(0,0,0,.5)" }}>
                <div style={{ fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100", fontSize: 24, lineHeight: 1, color: "#0B0B0B", whiteSpace: "pre", textTransform: "uppercase" }}>{cd.label}</div>
              </div>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
