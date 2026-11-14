// IN23 LedgeSection: the tripod's view of the lake, slowed almost to a hold; below the waterline the picture sinks into a dark
// cut-away of the water. A dashed white surface line, then the bottom drawn flat out from the shore with a white bracket "30 YARDS"
// over it (spoken), a small white marker walking out along it; on the drop-off the bottom line plunges out of frame and the marker
// drops after it (a section drawn to the hunter's own description: chest deep for about 30 yards, then nothing).
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { io, useDcFonts } from "./DC01_kit";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const LedgeSection: React.FC<{ src: string; from: number; n: number; surf?: number; flatAt: number; flatLen: number; labelAt: number; dropAt: number }> =
  ({ src, from, n, surf = 0.56, flatAt, flatLen, labelAt, dropAt }) => {
  useDcFonts();
  const f = useCurrentFrame();
  const W = 1920, H = 1080, sy = surf * H;
  const z = 1.04 + 0.06 * io(Math.min(1, f / n));
  const cut = io(interpolate(f, [4, 22], [0, 1], cl));
  const x0 = 170, x1 = 1180, by = sy + 170, x2 = 1330, y2 = H + 60;
  const fl = io(interpolate(f, [flatAt, flatAt + flatLen], [0, 1], cl));
  const dr = io(interpolate(f, [dropAt, dropAt + 16], [0, 1], cl));
  const lab = interpolate(f, [labelAt, labelAt + 12], [0, 1], cl);
  // marker: walks the flat bottom with the line, then falls past the edge
  const mx = x0 + (x1 - x0) * fl + (x2 - x1) * dr, my = by - 26 + (y2 - by) * dr * dr;
  const mo = interpolate(f, [flatAt, flatAt + 8], [0, 1], cl) * interpolate(f, [dropAt + 10, dropAt + 18], [1, 0], cl);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} playbackRate={0.25} muted
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: `scale(${z})` }} />
      {/* the cut-away: below the surface the frame turns to deep water */}
      <div style={{ position: "absolute", left: 0, top: sy, width: W, height: H - sy, opacity: cut,
        background: "linear-gradient(180deg, rgba(14,30,36,.72) 0%, rgba(6,14,18,.93) 55%, rgba(2,6,8,.98) 100%)", backdropFilter: "blur(6px)" }} />
      <svg width={W} height={H} style={{ position: "absolute", left: 0, top: 0 }}>
        <line x1={0} y1={sy} x2={W * cut} y2={sy} stroke="rgba(255,255,255,.85)" strokeWidth={3} strokeDasharray="22 14" />
        <polyline points={`${x0},${by} ${x0 + (x1 - x0) * fl},${by}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />
        {dr > 0 && <polyline points={`${x1},${by} ${x1 + (x2 - x1) * dr},${by + (y2 - by) * dr}`} fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" />}
        {/* shore end: the bottom rises to the bank */}
        <line x1={x0 - 120} y1={sy + 6} x2={x0} y2={by} stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={interpolate(f, [flatAt - 8, flatAt], [0, 1], cl)} />
        {/* the 30-yard bracket */}
        <g opacity={lab}>
          <line x1={x0} y1={by - 70} x2={x1} y2={by - 70} stroke="#fff" strokeWidth={2.5} />
          <line x1={x0} y1={by - 84} x2={x0} y2={by - 56} stroke="#fff" strokeWidth={2.5} />
          <line x1={x1} y1={by - 84} x2={x1} y2={by - 56} stroke="#fff" strokeWidth={2.5} />
        </g>
        <circle cx={mx} cy={my} r={11} fill="#fff" opacity={mo} />
      </svg>
      <div style={{ position: "absolute", left: (x0 + x1) / 2 - 200, width: 400, top: by - 128, textAlign: "center", opacity: lab, fontFamily: "ArchivoBlk", fontWeight: 800,
        fontStretch: "110%", fontSize: 38, letterSpacing: "0.12em", color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,.8)" }}>30 YARDS</div>
    </AbsoluteFill>
  );
};
