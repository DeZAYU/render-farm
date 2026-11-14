// ND12 GlassLayers: why the windshield held and a side window wouldn't. Over a freeze of Preston's own crazed windshield (dimmed):
// phase 1, an exploded edge-on slice of laminated glass (glass / plastic interlayer / glass) slides apart in 3-D, the crack shown
// stopping at the interlayer; phase 2 (at `temperedAt`), a tempered pane on the right bursts into small cubes.
// Built for "A windshield is laminated, two layers of glass with a plastic sheet between them ... Side windows are usually tempered glass,
// which bursts into thousands of little cubes."
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const rnd = (n: number) => { const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

export const ND12_GlassLayers: React.FC<{ freeze: string; temperedAt: number; labels: [string, string, string, string] }> = ({ freeze, temperedAt, labels }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const sep = io(interpolate(f, [6, 30], [0, 1], cl));
  const crack = io(interpolate(f, [30, 46], [0, 1], cl));
  const tp = out(interpolate(f, [temperedAt - 8, temperedAt + 8], [0, 1], cl));
  const burst = interpolate(f, [temperedAt + 10, durationInFrames], [0, 1], cl);
  const shiftL = -300 * io(interpolate(f, [temperedAt - 14, temperedAt + 10], [0, 1], cl));
  const z = 1.04 + 0.05 * (f / durationInFrames);
  // laminated slab, edge-on in perspective
  const layer = (i: number, h: number, fill: string, y: number) => (
    <div key={i} style={{ position: "absolute", left: 0, top: y, width: 760, height: h, background: fill, border: "3px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.5)" }} />
  );
  const gy = 60 * sep;
  // tempered pane cubes
  const N = 14, cs = 520 / N;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(freeze)} style={{ position: "absolute", inset: 0, width, height, objectFit: "cover", transform: `scale(${z})`, filter: "brightness(.38) saturate(.6) blur(2px)" }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: 260 + shiftL, top: 330, width: 760, height: 420, transformStyle: "preserve-3d", transform: `rotateX(52deg) rotateZ(-14deg)` }}>
          {layer(0, 90, "rgba(190,215,225,.55)", -gy)}
          {layer(1, 34, "rgba(227,20,27,.55)", 104)}
          {layer(2, 90, "rgba(190,215,225,.55)", 152 + gy)}
          {/* the crack: through the top glass only, stopping at the interlayer */}
          <svg width={760} height={420} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
            <path d={`M 380 ${-gy} L 360 ${-gy + 30 * crack} L 392 ${-gy + 60 * crack} L 372 ${-gy + 90 * crack}`} fill="none" stroke="#fff" strokeWidth={5} />
          </svg>
        </div>
        {/* tempered pane */}
        {tp > 0 && <div style={{ position: "absolute", left: 1220, top: 260, width: 520, height: 520, opacity: tp, transform: `translateX(${(1 - tp) * 120}px)` }}>
          {burst <= 0 ? <div style={{ width: 520, height: 520, background: "rgba(190,215,225,.45)", border: "5px solid #fff" }} /> :
            Array.from({ length: N * N }, (_, i) => { const cx = i % N, cy = Math.floor(i / N); const dx = (cx - N / 2) + (rnd(i) - 0.5) * 2, dy = (cy - N / 2) + (rnd(i + 99) - 0.5) * 2;
              const k = out(Math.min(1, burst * 1.6)); const g = burst * burst * 260;
              return <div key={i} style={{ position: "absolute", left: cx * cs + dx * 14 * k, top: cy * cs + dy * 14 * k + g * (0.6 + rnd(i + 7)), width: cs - 3, height: cs - 3,
                background: "rgba(200,222,232,.7)", border: "1px solid rgba(255,255,255,.9)", transform: `rotate(${(rnd(i + 3) - 0.5) * 60 * k}deg)`, opacity: 1 - burst * 0.4 }} />; })}
        </div>}
      </AbsoluteFill>
      <RedLabel text={labels[0]} at={14} hold={temperedAt - 30} x={0.32} y={0.17} size={34} />
      <RedLabel text={labels[1]} at={28} hold={temperedAt - 44} x={0.32} y={0.88} size={34} />
      <RedLabel text={labels[2]} at={temperedAt - 10} hold={24} x={0.2} y={0.17} size={34} />
      <RedLabel text={labels[3]} at={temperedAt + 4} x={0.77} y={0.17} size={34} />
    </AbsoluteFill>
  );
};
void RED;
