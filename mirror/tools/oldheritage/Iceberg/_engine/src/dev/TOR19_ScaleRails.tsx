// TOR19 ScaleRails: why Elie was rated on the OLD scale: two year-rails (United States / Canada) over a dark copy of the footage. Each rail
// is thin white while it is on the Fujita scale and turns into a heavy red bar where that country moved to the Enhanced Fujita scale
// (US 1 Feb 2007, Canada 1 Apr 2013). Elie's date drops onto the Canada rail inside the old-scale stretch; the camera glides along time.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

type Rail = { name: string; sw: number; at: number; label: string };
export const ScaleRails: React.FC<{ bg: string; bgFrom: number; y0: number; y1: number; rails: [Rail, Rail]; mark: { t: number; label: string; at: number };
  cam: { t: number; f: number }[]; pxYear?: number }> = ({ bg, bgFrom, y0, y1, rails, mark, cam, pxYear = 330 }) => {
  const f = useCurrentFrame(); const { width: W, height: H } = useVideoConfig();
  // camera: eased between keys (centre year)
  let cx = cam[0].t;
  for (let i = 1; i < cam.length; i++) { const a = cam[i - 1], b = cam[i]; if (f >= a.f) cx = a.t + (b.t - a.t) * io(interpolate(f, [a.f, b.f], [0, 1], cl)); }
  const X = (t: number) => W / 2 + (t - cx) * pxYear;
  const ys = [H * 0.40, H * 0.64];
  const fin = interpolate(f, [0, 10], [0, 1], cl);
  const years = Array.from({ length: Math.round(y1 - y0) + 1 }, (_, i) => y0 + i);
  const font = { fontFamily: "ArchivoBlk", fontWeight: 900, fontVariationSettings: "'wght' 900, 'wdth' 100" } as const;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fin }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: W + 80, height: H + 80, objectFit: "cover", filter: "blur(12px) brightness(.32) saturate(.6)" }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {years.map((y) => (
          <g key={y}>
            <line x1={X(y)} y1={ys[0] - 70} x2={X(y)} y2={ys[1] + 40} stroke="rgba(255,255,255,.18)" strokeWidth={1.5} />
            <text x={X(y)} y={ys[1] + 86} fill="rgba(255,255,255,.8)" fontSize={30} textAnchor="middle" style={font}>{y}</text>
          </g>
        ))}
        {rails.map((r, i) => {
          const g = out(interpolate(f, [r.at, r.at + 16], [0, 1], cl));
          const xs = X(r.sw);
          return (
            <g key={i}>
              <line x1={X(y0)} y1={ys[i]} x2={xs} y2={ys[i]} stroke="#fff" strokeWidth={4} opacity={0.9} />
              <line x1={xs} y1={ys[i]} x2={X(y1 + 1)} y2={ys[i]} stroke="#fff" strokeWidth={4} opacity={0.35} />
              {g > 0 && <rect x={xs} y={ys[i] - 11} width={(X(y1 + 1) - xs) * g} height={22} fill={RED} stroke="#fff" strokeWidth={2} />}
              <line x1={xs} y1={ys[i] - 34} x2={xs} y2={ys[i] + 34} stroke="#fff" strokeWidth={5} opacity={g} />
              <text x={70} y={ys[i] - 30} fill="#fff" fontSize={40} style={{ ...font, paintOrder: "stroke", stroke: "rgba(0,0,0,.6)", strokeWidth: 6 }}>{r.name}</text>
            </g>
          );
        })}
        {(() => { const g = out(interpolate(f, [mark.at, mark.at + 12], [0, 1], cl)); if (g <= 0) return null; const x = X(mark.t), y = ys[1];
          return <g opacity={g}><line x1={x} y1={y - 90 * g} x2={x} y2={y} stroke="#fff" strokeWidth={3} /><rect x={x - 12} y={y - 12} width={24} height={24} transform={`rotate(45 ${x} ${y})`} fill="#fff" stroke="#000" strokeWidth={2} /></g>; })()}
      </svg>
      {rails.map((r, i) => <RedLabel key={i} text={r.label} at={r.at + 6} x={(X(r.sw) + 150) / W} y={(ys[i] - 52) / H} size={32} />)}
      <RedLabel text={mark.label} at={mark.at + 6} x={X(mark.t) / W} y={(ys[1] - 120) / H} size={34} />
    </AbsoluteFill>
  );
};
