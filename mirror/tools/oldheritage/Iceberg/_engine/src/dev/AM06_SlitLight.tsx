// AM06 SlitLight: the real Claims Journal story (25 Oct 2011, captured live with _tools/capture_page.py; the masthead's modern
// "Featured Stories" links painted out with the band colour, ads and the unrelated last paragraph cut) lying flat like a printout on a
// dark desk, seen from above at an angle. The camera glides down the sheet from the masthead and headline to the paragraph about
// Montalvo. Then the light goes: the whole sheet sinks into darkness and soft focus except one horizontal slit of light across the
// line where Universal's report is quoted, as if from a door left ajar; the slit opens from the centre outward. One thin red rule
// draws under the two quoted words. Everything readable is the captured page; nothing is re-typed.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Key = { at: number; y: number; k: number };

export const SlitLight: React.FC<{ page: string; pw: number; ph: number; keys: Key[]; slit: [number, number]; slitAt: number; rule: [number, number, number]; ruleAt: number }> = ({ page, pw, ph, keys, slit, slitAt, rule, ruleAt }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  let c = keys[0];
  for (let i = 1; i < keys.length; i++) {
    const a = keys[i - 1], b = keys[i]; if (f <= a.at) break;
    const u = io(interpolate(f, [a.at, b.at], [0, 1], cl));
    c = { at: f, y: a.y + (b.y - a.y) * u, k: a.k + (b.k - a.k) * u };
  }
  const inn = out(interpolate(f, [0, 20], [0, 1], cl));
  const dark = io(interpolate(f, [slitAt, slitAt + 22], [0, 1], cl));
  const open = out(interpolate(f, [slitAt + 4, slitAt + 30], [0, 1], cl));
  const ru = out(interpolate(f, [ruleAt, ruleAt + 14], [0, 1], cl));
  const sy = (slit[0] + slit[1]) / 2, sh = (slit[1] - slit[0]) / 2 + 26;
  const mask = `linear-gradient(180deg, transparent ${((sy - sh - 40) / ph) * 100}%, #000 ${((sy - sh) / ph) * 100}%, #000 ${((sy + sh) / ph) * 100}%, transparent ${((sy + sh + 40) / ph) * 100}%)`;
  const wmask = `linear-gradient(90deg, transparent ${50 - 62 * open}%, #000 ${56 - 56 * open}%, #000 ${44 + 56 * open}%, transparent ${50 + 62 * open}%)`;
  const tilt = 30 - 8 * io(f / dur);
  const drift = 1 + 0.04 * io(f / dur);
  const pageEl = (blur: number) => (
    <div style={{ position: "absolute", inset: 0, filter: blur ? `blur(${blur}px)` : undefined }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      {/* the desk: a dark surface with a warm pool of light that goes out with the room */}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 60% at 50% 45%, rgba(70,58,44,${0.55 * (1 - dark)}) 0%, rgba(8,7,6,1) 75%)` }} />
      <AbsoluteFill style={{ perspective: 1800, perspectiveOrigin: "50% 20%" }}>
        <div style={{ position: "absolute", left: 960 - (pw / 2) * c.k * drift, top: 450 - c.y * c.k * drift + (1 - inn) * 200, width: pw * c.k * drift, height: ph * c.k * drift,
          transformOrigin: `50% ${(c.y / ph) * 100}%`, transform: `rotateX(${tilt}deg) rotateZ(1.5deg)`, opacity: inn, boxShadow: "0 40px 80px rgba(0,0,0,.85)" }}>
          <div style={{ position: "absolute", left: 0, top: 0, width: pw, height: ph, transform: `scale(${c.k * drift})`, transformOrigin: "0 0", background: "#F4F2EC" }}>
            {/* the lit page (before the light goes) */}
            <div style={{ position: "absolute", inset: 0, opacity: 1 - dark }}>{pageEl(0)}</div>
            {/* in the dark: the sheet is dim and soft... */}
            <div style={{ position: "absolute", inset: 0, opacity: dark, filter: "brightness(.16)" }}>{pageEl(3)}</div>
            {/* ...except the slit of light across the quoted line */}
            {dark > 0 && (
              <div style={{ position: "absolute", inset: 0, opacity: dark, WebkitMaskImage: mask, maskImage: mask }}>
                <div style={{ position: "absolute", inset: 0, WebkitMaskImage: wmask, maskImage: wmask }}>{pageEl(0)}</div>
              </div>
            )}
            {ru > 0 && <div style={{ position: "absolute", left: rule[0], top: rule[2] + 5, height: 4, width: (rule[1] - rule[0]) * ru, background: RED }} />}
          </div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.65) 100%)" }} />
    </AbsoluteFill>
  );
};
