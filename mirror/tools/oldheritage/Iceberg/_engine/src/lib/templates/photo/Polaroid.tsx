// photo / Polaroid: DD polaroid cluster with the caption written on the margin. REF: DD Dashcam Vol.2 E12 "polaroid on a clothesline" (case 18
// opener 18:44.0-18:45.5: the polaroid drops in on a peg 0 -> rest in 30 f while the camera pulls back -48 % log over 2.0 s, ez(0,.6,.2,1),
// sway +-1.5 deg at 0.4 Hz) and DD Vol.1 E12 corkboard (14:44.4: items fade 10 f with a 1.04 -> 1 settle on their nouns, red pushpins, red
// string drawn pin to pin in 10 f); wp3 sec_C Cork @7377 (caption on the polaroid margin, red word on its word).
// attach "peg" = clothesline on a dark wall (each print drops and swings, then sways); attach "pin" = cork board with pushpins + red string.
// Our version: up to 4 prints in one continuous pull-back that frames the whole cluster at the end, photos in the DD grade.
import React from "react";
import { AbsoluteFill, Easing, Img, useCurrentFrame } from "remotion";
import { EZ, H, MBlur, Media, PushPin, RC, RoundText, W, asset, clamp01, lerp, lerpLog } from "../../core";
import { CardVig } from "./shared";

export type PolaroidItem = {
  src: string; at: number; caption?: string; red?: string; redAt?: number;
  x?: number; y?: number; rot?: number; aspect?: number; pos?: string;
};
export type PolaroidProps = {
  items: PolaroidItem[];
  attach?: "peg" | "pin";
  board?: string; // background texture (public path), default demo cork
  zFrom?: number; // camera zoom on the first print
  pull?: number; // frames of the pull-back
  labelCap?: number; // caption cap ON SCREEN at the settled zoom (px); default keeps >= 30
};

const PW = 500, PAD = 22, BOT = 112;
const LAYOUT: Record<number, [number, number, number][]> = {
  1: [[0, 0, -2]],
  2: [[-330, -10, -3], [330, 24, 2.4]],
  3: [[-620, 10, -3], [0, -26, 1.6], [610, 36, -2.2]],
  4: [[-840, 0, -3], [-280, -30, 2], [285, 30, -1.5], [840, -10, 2.6]],
};
const PULL = Easing.bezier(0, 0.6, 0.2, 1); // DD V2 I13 pull-back
const lineY = (x: number) => -330 + 0.03 * x + 60 * (1 - Math.pow(x / 1400, 2)); // sagging clothesline (world)

export const Polaroid: React.FC<PolaroidProps> = ({ items, attach = "peg", board = "demo/cork.jpg", zFrom, pull = 120, labelCap = 30 }) => {
  const k = useCurrentFrame();
  const n = Math.min(4, items.length);
  const lay = LAYOUT[n] ?? LAYOUT[1];
  const its = items.slice(0, n).map((it, i) => {
    const a = it.aspect ?? 4 / 3;
    const ph = PW / a, w = PW + 2 * PAD, h = ph + PAD + BOT;
    const x = it.x ?? lay[i][0];
    const yRest = attach === "peg" ? lineY(x) - 8 : (it.y ?? lay[i][1]) - h / 2;
    return { ...it, ph, w, h, x, top: yRest, rot: it.rot ?? lay[i][2] };
  });
  // camera: from the first print to the whole cluster (DD V2 E12 pull-back, strong ease-out), then a slow drift
  const xs = its.map((p) => p.x), ys = its.map((p) => p.top + p.h / 2);
  const span = Math.max(...xs) - Math.min(...xs) + PW + 260;
  const z1 = Math.min(1.12, W / span) * (attach === "peg" ? 0.98 : 1);
  const z0 = zFrom ?? Math.min(1.6, z1 * 1.48);
  const c0 = { x: its[0].x, y: ys[0] }, c1 = { x: (Math.max(...xs) + Math.min(...xs)) / 2, y: (Math.max(...ys) + Math.min(...ys)) / 2 - (attach === "peg" ? 20 : 0) };
  const pu = PULL(clamp01(k / pull));
  const z = lerpLog(z0, z1, pu) * (1 + 0.006 * (k / 30));
  const cx = lerp(c0.x, c1.x, pu), cy = lerp(c0.y, c1.y, pu);
  const capW = labelCap / z1; // world caption cap so the settled on-screen cap = labelCap
  const camRot = -0.5 + 0.12 * (k / 30);
  const fast = its.some((p) => p.at > 0 && k - p.at >= 0 && k - p.at < 9);
  const isPeg = attach === "peg";
  return (
    <AbsoluteFill style={{ background: isPeg ? "#0b0b0c" : "#1a120b" }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) rotate(${camRot.toFixed(3)}deg) scale(${z.toFixed(5)}) translate(${(-cx).toFixed(2)}px, ${(-cy).toFixed(2)}px)` }}>
          <Img src={asset(board)} style={{ position: "absolute", left: -1900, top: -1150, width: 3800, height: 2400, objectFit: "cover",
            filter: isPeg ? "grayscale(1) brightness(.34) contrast(1.35)" : "saturate(.72) brightness(.86)" }} />
          {isPeg ? (
            <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              <path d={Array.from({ length: 57 }, (_, i) => { const x = -1400 + i * 50; return `${i ? "L" : "M"}${x} ${lineY(x).toFixed(1)}`; }).join(" ")} fill="none" stroke="#8d8576" strokeWidth={3.5}
                style={{ filter: "drop-shadow(0 10px 6px rgba(0,0,0,.6))" }} />
            </svg>
          ) : null}
          {its.map((p, i) => {
            const q = k - p.at;
            if (p.at > 0 && q < 0) return null;
            const live = p.at <= 0 ? 999 : q;
            let o = 1, sc = 1, dy = 0, rot = p.rot;
            const t = k / 30;
            if (isPeg) {
              o = clamp01(live / 3);
              dy = -260 * (1 - EZ.out3(live / 30));
              const swing = 4.2 * Math.exp(-Math.max(0, live - 24) / 26) * Math.sin(Math.max(0, live - 24) / 7) * clamp01(live / 24);
              rot = p.rot * 0.4 + swing + 1.5 * Math.sin(2 * Math.PI * 0.4 * t + i * 1.9) * clamp01((live - 20) / 30);
            } else {
              o = clamp01(live / 10);
              sc = 1.04 - 0.04 * EZ.out3(live / 14);
            }
            const ra = p.redAt ?? p.at + 20;
            return (
              <div key={i} style={{ position: "absolute", left: p.x - p.w / 2, top: p.top + dy, width: p.w, height: p.h, opacity: o, transformOrigin: isPeg ? "50% 0%" : "50% 50%",
                transform: `rotate(${rot.toFixed(3)}deg) scale(${sc.toFixed(4)})`, boxShadow: "0 22px 36px rgba(0,0,0,.6), 0 3px 7px rgba(0,0,0,.45)", background: "#F2F0E9" }}>
                <div style={{ position: "absolute", left: PAD, top: PAD, width: PW, height: p.ph, overflow: "hidden", background: "#111" }}>
                  <Media src={p.src} pos={p.pos} style={{ filter: "contrast(1.08) brightness(.9) saturate(.9)" }} />
                  <CardVig k={0.38} />
                </div>
                {p.caption || p.red ? (
                  <div style={{ position: "absolute", left: 0, right: 0, top: PAD + p.ph + (BOT - capW * 1.18) / 2 - 4, display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 14 }}>
                    {p.caption ? <RoundText text={p.caption} cap={capW} colour="#2A2826" /> : null}
                    {p.red ? (
                      <div style={{ opacity: clamp01((k - ra) / 5), transform: `translateY(${(12 * (1 - EZ.out3((k - ra) / 10))).toFixed(2)}px)` }}><RoundText text={p.red} cap={capW} colour={RC.labelRed} /></div>
                    ) : null}
                  </div>
                ) : null}
                {isPeg ? (
                  <div style={{ position: "absolute", left: p.w / 2 - 13, top: -26, width: 26, height: 64, borderRadius: 3, background: "linear-gradient(90deg, #9b7b52, #c9a77a 45%, #8a6a43)", boxShadow: "2px 6px 6px rgba(0,0,0,.5)" }} />
                ) : (
                  <PushPin x={p.w / 2} y={16} r={17} />
                )}
              </div>
            );
          })}
          {!isPeg ? (
            <svg width={10} height={10} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
              {its.slice(1).map((p, i) => {
                const a = its[i];
                const pr = EZ.out3((k - p.at) / 10);
                if (p.at <= 0 ? false : pr <= 0) return null;
                const x0 = a.x, y0 = a.top + 16, x1 = p.x, y1 = p.top + 16;
                const d = `M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + 60} ${x1} ${y1}`;
                return <path key={i} d={d} stroke="#B3121A" strokeWidth={4} fill="none" pathLength={1} strokeDasharray={1} strokeDashoffset={p.at <= 0 ? 0 : 1 - pr} style={{ filter: "drop-shadow(0 4px 3px rgba(0,0,0,.5))" }} />;
              })}
            </svg>
          ) : null}
        </AbsoluteFill>
      </MBlur>
      <AbsoluteFill style={{ background: isPeg ? "radial-gradient(ellipse 70% 64% at 50% 38%, rgba(0,0,0,0) 40%, rgba(0,0,0,.72) 100%)" : "radial-gradient(ellipse 72% 70% at 50% 46%, rgba(0,0,0,0) 45%, rgba(10,4,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
