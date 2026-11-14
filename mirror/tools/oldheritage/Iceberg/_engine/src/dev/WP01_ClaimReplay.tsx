// WP01 ClaimReplay: the farm's own account against the picture. Left: the fall replayed at half speed in a white portrait panel, landing
// on the flash as the VO says "lit the dust", then held on the flash with a slow push. Right: the filmer's post (the YouTube description,
// re-set sharp in the channel's typewriter face) types out; context lines small and grey, the claim line large, typed in step with the VO,
// and ruled red on "dust". On "No agency report" the context drops away and a dashed white frame (= unconfirmed) draws round the claim.
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { RED, RedLabel } from "../brand";
import { AR, ARCH, BlurBed, FrameAt, cl, ease, out, useWpFonts } from "./WP01_kit";

const CTX = ["July 31, 2017 at approximately 1:00 pm.", "Switz City, Indiana. White Farms Inc.", "Overhead tank full of corn collapsed."];
const KEY = "The tank hit a power line on the way down igniting the grain dust and causing a flash fire.";
const END = "There were no injuries!";

export const ClaimReplay: React.FC<{ src: string; t0: number; freezeAt: number; words: [number, number]; rule: number; doubt: number; credit: string }> = ({ src, t0, freezeAt, words: kw, rule, doubt, credit }) => {
  useWpFonts();
  const f = useCurrentFrame();
  const k = out(interpolate(f, [0, 14], [0, 1], cl));
  const t = t0 + Math.min(f, freezeAt) / 60; // 0.5x
  const push = 1 + 0.12 * ease(f, freezeAt, freezeAt + 90);
  const H = 940, W = H * AR, PX = 150, PY = 70;
  const typed = (s: string, a: number, b: number) => s.slice(0, Math.round(s.length * interpolate(f, [a, b], [0, 1], cl)));
  const dim = 1 - 0.75 * ease(f, doubt, doubt + 16);
  const ru = ease(f, rule, rule + 14);
  const dash = ease(f, doubt + 6, doubt + 30);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <BlurBed src={src} t={t} dim={0.3} />
      <div style={{ position: "absolute", left: PX, top: PY, width: W, height: H, border: "6px solid #fff", boxShadow: "0 24px 70px rgba(0,0,0,.7)", overflow: "hidden", opacity: k, transform: `scale(${0.95 + 0.05 * k})` }}>
        <FrameAt src={src} t={t} style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${push})`, transformOrigin: "45% 78%" }} />
        <div style={{ ...ARCH, position: "absolute", left: 18, top: 16, fontSize: 24, color: "#fff", background: "rgba(0,0,0,.45)", padding: "6px 10px", opacity: f < freezeAt ? 1 : 0 }}>½ SPEED</div>
      </div>
      <div style={{ position: "absolute", left: 830, top: 250, width: 960 }}>
        {CTX.map((s, i) => (
          <div key={i} style={{ fontFamily: "Elite", fontSize: 36, lineHeight: 1.35, color: "rgba(235,235,230,.72)", opacity: dim, minHeight: 49 }}>{typed(s, 4 + i * 14, 16 + i * 14)}</div>
        ))}
        <div style={{ position: "relative", marginTop: 26, padding: "18px 22px", fontFamily: "Elite", fontSize: 52, lineHeight: 1.28, color: "#fff", textShadow: "0 2px 12px rgba(0,0,0,.8)", minHeight: 270 }}>
          <span>{typed(KEY, kw[0], kw[1])}</span>
          <svg width={960} height={300} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <rect x={6} y={6} width={940} height={268} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="18 12" pathLength={1000} opacity={dash} />
          </svg>
          <div style={{ position: "absolute", left: 22, top: 218, height: 8, width: 520 * ru, background: RED }} />
        </div>
        <div style={{ fontFamily: "Elite", fontSize: 36, lineHeight: 1.35, color: "rgba(235,235,230,.72)", opacity: dim, marginTop: 18 }}>{typed(END, kw[1] + 4, kw[1] + 14)}</div>
        <div style={{ ...ARCH, fontSize: 22, color: "rgba(255,255,255,.6)", marginTop: 40, letterSpacing: "0.05em", opacity: k }}>{credit}</div>
      </div>
      <RedLabel text="THE FARM'S ACCOUNT" at={4} hold={9999} x={0.68} y={0.15} size={42} />
    </AbsoluteFill>
  );
};
