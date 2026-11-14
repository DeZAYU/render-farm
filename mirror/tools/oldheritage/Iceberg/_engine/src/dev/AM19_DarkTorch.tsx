// AM19 DarkTorch (Ocean Park "Buried Alive", "…ended up behind the attraction, in a staff-only area where the coffin machinery moved"):
// the real Asia Times report (18 Sep 2017, captured page: headline + standfirst, the opening paragraphs, the paragraph on the staff-only
// area) lies flat in total darkness, read by a hand torch: a warm soft beam (radial pool with a faint rim, slight hand wobble) sweeps
// from the headline down across the paper and settles on the line about the staff-only area; there one thin red rule draws under
// "staff only". Outside the beam the paper is almost black. The page drifts slowly toward camera the whole time. No other text.
// Props: page + pw/ph, beam keys {at, x, y (page px), r (px on page)}, cam keys {at, y, k}, rule box + frame.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type B = { at: number; x: number; y: number; r: number };
type K = { at: number; y: number; k: number };
function track<T extends { at: number }>(f: number, ks: T[], keys: (keyof T)[]): T {
  let c = { ...ks[0] };
  for (let i = 1; i < ks.length; i++) {
    const a = ks[i - 1], b = ks[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    for (const k of keys) (c as any)[k] = (a[k] as any) + ((b[k] as any) - (a[k] as any)) * u;
  }
  return c;
}

export const DarkTorch: React.FC<{ page: string; pw: number; ph: number; beam: B[]; cam: K[]; rule: { box: [number, number, number, number]; at: number } }> = ({ page, pw, ph, beam, cam, rule }) => {
  const f = useCurrentFrame();
  const b = track(f, beam, ["x", "y", "r"]), c = track(f, cam, ["y", "k"]);
  const wob = [Math.sin(f * 0.11) * 6 + Math.sin(f * 0.37) * 2.5, Math.cos(f * 0.09) * 5 + Math.sin(f * 0.29) * 2];
  const on = out(interpolate(f, [0, 14], [0, 1], cl));
  const bx = b.x + wob[0], by = b.y + wob[1], r = b.r * on;
  const ru = out(interpolate(f, [rule.at, rule.at + 14], [0, 1], cl));
  const left = 960 - (pw / 2) * c.k, top = 540 - c.y * c.k;
  const light = `radial-gradient(circle ${r * 1.25}px at ${bx}px ${by}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 72%, rgba(3,3,4,.93) 100%)`;
  return (
    <AbsoluteFill style={{ background: "#020203", overflow: "hidden" }}>
      <div style={{ position: "absolute", left, top, width: pw * c.k, height: ph * c.k, transform: "rotate(-1.5deg)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k})`, transformOrigin: "0 0", background: "#EDEBE6" }}>
          <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, filter: "sepia(.12)" }} />
          {ru > 0 && <div style={{ position: "absolute", left: rule.box[0], top: rule.box[3] + 2, height: 5, width: (rule.box[2] - rule.box[0]) * ru, background: RED }} />}
          {/* warm beam colour, then the dark outside it */}
          <div style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", background: `radial-gradient(circle ${r}px at ${bx}px ${by}px, rgba(255,236,200,1) 0%, rgba(240,214,170,1) 70%, rgba(200,190,170,1) 100%)` }} />
          <div style={{ position: "absolute", inset: 0, background: light }} />
        </div>
      </div>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 50%, rgba(0,0,0,.6) 100%)" }} />
    </AbsoluteFill>
  );
};
