// ND04 SinkLine — "The earthquake had dropped the land … up to about a metre … the sea was already closer before the wave arrived."
// A shore cross-section drawn in white over a dark copy of the harbour footage: the low harbour flats, the quay, the sea at its level.
// The land block sinks by one metre (vertical scale stated by a white 1 M bracket), and the sea's level line slides inland across
// the flats it now sits above. Mechanism, not decoration: what changed before the wave arrived.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

export const SinkLine: React.FC<{ bg: string; bgFrom: number; dropAt: number; dropLen?: number; label?: string; labelAt?: number }> = ({ bg, bgFrom, dropAt, dropLen = 40, label, labelAt }) => {
  const f = useCurrentFrame(); const { width: W, height: H, durationInFrames: D } = useVideoConfig();
  const PXM = 110;                         // px per metre (vertical)
  const seaY = 620;                        // sea level on screen
  const drop = PXM * io(interpolate(f, [dropAt, dropAt + dropLen], [0, 1], cl));
  const draw = out(interpolate(f, [0, 22], [0, 1], cl));
  const cam = 1.0 + 0.05 * io(f / D);
  // land profile (x px, metres above the sea): hills on the left, flats, the quay edge on the right
  const prof: [number, number][] = [[-40, 5.2], [160, 4.6], [330, 3.2], [520, 2.2], [760, 1.6], [1000, 1.1], [1240, 0.8], [1380, 0.75]];
  const quayX = 1380, seabedY = seaY + 260;
  const P = prof.map(([x, m]) => [x, seaY - m * PXM + drop] as [number, number]);
  const top = "M" + P.map((p) => p.join(" ")).join(" L");
  const land = `${top} L${quayX} ${seabedY + drop} L-40 ${seabedY + drop} Z`;
  // where the sea level now meets the land (first profile x whose surface is below the sea line)
  let shoreX = quayX;
  for (let i = P.length - 1; i > 0; i--) { const [xa, ya] = P[i - 1], [xb, yb] = P[i]; if (ya <= seaY && yb > seaY) { shoreX = xa + (xb - xa) * (seaY - ya) / (yb - ya); break; } if (ya > seaY) shoreX = xa; }
  const brX = quayX + 70, brA = seaY - 0.75 * PXM, brB = brA + drop;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(9px) brightness(.32) saturate(.5)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0, transform: `scale(${cam})`, transformOrigin: "60% 55%" }}>
        {/* sea */}
        <rect x={quayX - 2} y={seaY} width={W} height={H} fill="rgba(120,160,185,.42)" />
        {/* water now standing over the sunken flats */}
        {shoreX < quayX && <path d={`M${shoreX} ${seaY} L${quayX} ${seaY} ` + P.filter(([x]) => x > shoreX).reverse().map(([x, y]) => `L${x} ${y}`).join(" ") + " Z"} fill="rgba(120,160,185,.5)" />}
        <path d={land} fill="rgba(255,255,255,.13)" opacity={draw} />
        <path d={top + ` L${quayX} ${seabedY + drop}`} fill="none" stroke="#fff" strokeWidth={6} strokeLinejoin="round" pathLength={1} strokeDasharray={`${draw} 1`} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.6))" }} />
        {/* the sea's level, carried inland as a dashed line */}
        <line x1={W} y1={seaY} x2={quayX} y2={seaY} stroke="#fff" strokeWidth={4} opacity={0.9 * draw} />
        <line x1={quayX} y1={seaY} x2={shoreX} y2={seaY} stroke="#fff" strokeWidth={4} strokeDasharray="16 12" opacity={shoreX < quayX ? 0.9 : 0} />
        {/* the original ground line, ghosted, once it has dropped */}
        {drop > 2 && <path d={"M" + prof.map(([x, m]) => `${x} ${seaY - m * PXM}`).join(" L")} fill="none" stroke="rgba(255,255,255,.35)" strokeWidth={3} strokeDasharray="6 10" />}
        {/* 1 m bracket at the quay */}
        {drop > 2 && <g stroke="#fff" strokeWidth={5} fill="none" opacity={interpolate(drop, [2, 30], [0, 1], cl)}>
          <line x1={brX} y1={brA} x2={brX} y2={brB} /><line x1={brX - 18} y1={brA} x2={brX + 18} y2={brA} /><line x1={brX - 18} y1={brB} x2={brX + 18} y2={brB} />
        </g>}
      </svg>
      <RedLabel text="SEA LEVEL" at={10} hold={dropAt - 4} x={(quayX + 260) / W} y={(seaY + 60) / H} size={40} />
      {label && <RedLabel text={label} at={labelAt ?? dropAt + dropLen} x={(brX + 110) / W} y={(brA + 55) / H} size={54} />}
    </AbsoluteFill>
  );
};
