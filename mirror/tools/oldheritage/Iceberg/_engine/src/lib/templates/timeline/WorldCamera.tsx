// timeline / WorldCamera: VV §11 infographic in world space with a camera (VV @ 3:28.0 balloon altitude: labels on ONE plane, the camera tells
// the story in eased phases, each quick-start / long-settle (0.31,0,0,0.957) / (0.185,0,0.021,0.619); labels never animate after they arrive)
// + DD V1 I11 item entry (fade 10 f, 1.04 -> 1 settle); wp3 sec_C Timeline @ 6544. A horizontal line through year nodes; nodes with media get a
// photo card above the line. Each new node: the line grows to it, the dot pops, the year and label land, the camera travels there.
// The line turns DASHED from `dashFrom` on ("still hasn't ended"); the last node can land red. Optional final pull-back to the whole line.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { EZ, FONT, H, MBlur, Media, W, clamp01, fs, lerp, lerpLog } from "../../core";
import { CardVig } from "../photo/shared";

export type TLNode = { year: string; label: string; media?: string; at: number };
export type WorldCameraProps = {
  nodes: TLNode[];
  gap?: number; // world px between nodes
  dashFrom?: number; // index of the node after which the line is dashed (omit = solid)
  redLast?: boolean;
  wideAt?: number; // local frame of a final pull-back to the whole line (omit = none)
  zoom?: number; // camera zoom on a node
  cap?: number; // year cap ON SCREEN minimum (px)
  labelCap?: number; // label cap ON SCREEN minimum (px)
};

const LY = 600, CW = 440, CH = 248;

export const WorldCamera: React.FC<WorldCameraProps> = ({ nodes, gap = 780, dashFrom, redLast = true, wideAt, zoom = 1.5, cap = 84, labelCap = 30 }) => {
  const k = useCurrentFrame();
  const xs = nodes.map((_, i) => i * gap);
  // frame the new node together with the previous one (both whole), cards included when either has media
  const frame = (i: number) => {
    const j = Math.max(0, i - 1), med = !!(nodes[i].media || nodes[j].media);
    return { cx: (xs[i] + xs[j]) / 2, cy: LY - (med ? 110 : 20), s: Math.min(zoom, (W * 0.8) / (xs[i] - xs[j] + CW)) };
  };
  const firstLive = Math.max(0, nodes.filter((n) => n.at <= 0).length - 1);
  const start = { cx: (xs[0] + xs[firstLive]) / 2 + gap * 0.25, cy: LY - 110, s: firstLive > 0 ? 1.12 : zoom };
  let cam = { ...start };
  let fast = false;
  nodes.forEach((n, i) => {
    if (n.at <= 0) return;
    const d = i % 2 ? 46 : 60;
    const u = clamp01((k - n.at + 2) / d);
    const e = i % 2 ? EZ.quick(u) : EZ.phaseB(u);
    const t = frame(i);
    cam = { cx: lerp(cam.cx, t.cx, e), cy: lerp(cam.cy, t.cy, e), s: lerpLog(cam.s, t.s, e) };
    if (u > 0.04 && u < 0.45) fast = true;
  });
  if (wideAt !== undefined) {
    const u = clamp01((k - wideAt) / 60);
    const span = xs[xs.length - 1] + CW + 380;
    const e = EZ.settle(u);
    cam = { cx: lerp(cam.cx, xs[xs.length - 1] / 2, e), cy: lerp(cam.cy, LY - 60, e), s: lerpLog(cam.s, Math.min(1.1, W / span), e) };
    if (u > 0.04 && u < 0.4) fast = true;
  }
  const z = cam.s * (1 + 0.008 * (k / 30));
  const vis = (n: TLNode) => (n.at <= 0 ? 1 : clamp01((k - n.at) / 8));
  const red = (i: number) => redLast && i === nodes.length - 1;
  // world text is counter-scaled so the on-screen caps never drop under the props at any camera zoom (wide pull-back included)
  const yf = fs("bebas", Math.max(cap * 0.75, cap / z)), lf = fs("inter", Math.max(labelCap, (labelCap + 0.5) / z));
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 45%, #1A1B1D 0%, #0D0E0F 60%, #050505 100%)" }}>
      <MBlur on={fast} samples={6}>
        <AbsoluteFill style={{ transformOrigin: "0 0", transform: `translate(${W / 2}px, ${H / 2}px) scale(${z.toFixed(5)}) translate(${(-cam.cx).toFixed(2)}px, ${(-cam.cy).toFixed(2)}px)` }}>
          {nodes.slice(1).map((n, j) => {
            const i = j + 1;
            const dashed = dashFrom !== undefined && j >= dashFrom;
            const len = n.at <= 0 ? 1 : (dashed ? EZ.ddScroll((k - n.at - 4) / 52) : EZ.out3((k - n.at) / 14));
            if (len <= 0) return null;
            return (
              <div key={i} style={{ position: "absolute", left: xs[i - 1], top: LY - 3, width: gap * len, height: 6,
                background: dashed ? "repeating-linear-gradient(90deg, #E9E9E6 0 26px, rgba(0,0,0,0) 26px 44px)" : "#E9E9E6" }} />
            );
          })}
          {nodes.map((n, i) => {
            const v = vis(n);
            if (v <= 0) return null;
            const q = k - n.at;
            const sc = n.at <= 0 ? 1 : 1.04 - 0.04 * EZ.out3(q / 14);
            const rc = red(i) ? "#F2252A" : "#E9E9E6";
            return (
              <React.Fragment key={i}>
                {n.media ? (
                  <div style={{ position: "absolute", left: xs[i] - CW / 2, top: LY - 70 - CH, width: CW, height: CH, opacity: n.at <= 0 ? 1 : clamp01(q / 10), transform: `scale(${sc})`,
                    boxShadow: "0 14px 34px rgba(0,0,0,.6)", overflow: "hidden", background: "#111" }}>
                    <Media src={n.media} style={{ filter: "contrast(1.06) saturate(.9)" }} /><CardVig k={0.35} />
                  </div>
                ) : null}
                {n.media ? <div style={{ position: "absolute", left: xs[i] - 1, top: LY - 70, width: 2, height: 55, background: "rgba(233,233,230,.5)", opacity: v }} /> : null}
                <div style={{ position: "absolute", left: xs[i] - 15, top: LY - 15, width: 30, height: 30, borderRadius: 15, boxSizing: "border-box", background: red(i) ? rc : "#0D0E0F", border: `5px solid ${rc}`,
                  opacity: v, transform: `scale(${n.at <= 0 ? 1 : 1.3 - 0.3 * EZ.out3(q / 8)})`, boxShadow: red(i) ? "0 0 18px rgba(242,37,42,.7)" : undefined }} />
                <div style={{ position: "absolute", left: xs[i] - 220, width: 440, top: LY + 30, textAlign: "center", fontFamily: FONT.bebas, fontSize: yf, lineHeight: 1, opacity: v,
                  color: red(i) ? "#F2252A" : "#F2F2F0", textShadow: red(i) ? "0 0 18px rgba(242,37,42,.55)" : "0 0 12px rgba(255,255,255,.15)" }}>{n.year}</div>
                <div style={{ position: "absolute", left: xs[i] - 220, width: 440, top: LY + 40 + yf, textAlign: "center", fontFamily: FONT.inter, fontWeight: 500, fontSize: lf, color: "#A9A9A6",
                  opacity: n.at <= 0 ? 1 : clamp01((q - 4) / 8) }}>{n.label}</div>
              </React.Fragment>
            );
          })}
        </AbsoluteFill>
      </MBlur>
    </AbsoluteFill>
  );
};
