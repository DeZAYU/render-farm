// IN16 SaidLater: the real Bassmaster article (captured page) as one printed sheet tilted back in 3-D over the dim, blurred deck footage.
// An eased camera travels the paper on the VO: headline + date, down to the photo of the angler, down to his own account; the sheet
// flattens as it goes. On `litAt` the paper sinks into shadow except the spoken pieces of his account, which rise a little off the page.
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);
type Box = [number, number, number, number]; // page px: x0 y0 x1 y1
export type PK = { f: number; x: number; y: number; z: number; rx: number };

const at = (f: number, k: PK[]) => {
  if (f <= k[0].f) return k[0];
  for (let i = 1; i < k.length; i++) if (f <= k[i].f) {
    const a = k[i - 1], b = k[i], u = io((f - a.f) / Math.max(1, b.f - a.f));
    return { f, x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u, z: a.z + (b.z - a.z) * u, rx: a.rx + (b.rx - a.rx) * u };
  }
  return k[k.length - 1];
};

export const SaidLater: React.FC<{ bg: string; bgFrom: number; page: string; pw: number; ph: number; crop: Box; lines: Box[]; keys: PK[]; litAt: number }> =
  ({ bg, bgFrom, page, pw, ph, crop, lines, keys, litAt }) => {
  const f = useCurrentFrame();
  const c = at(f, keys), z = c.z * (1 + 0.00025 * f), rz = -2.2 + 1.4 * Math.min(1, f / 300), ry = 5 - 4 * Math.min(1, f / 300);
  const lit = io(interpolate(f, [litAt, litAt + 18], [0, 1], cl));
  const [cx0, cy0, cx1, cy1] = crop, W = cx1 - cx0, H = cy1 - cy0, ox = c.x - cx0, oy = c.y - cy0;
  const sheetIn = io(interpolate(f, [0, 16], [0, 1], cl));
  const piece = (b: Box, i: number, lift: number) => (
    <div key={i} style={{ position: "absolute", left: b[0] - cx0 - 8, top: b[1] - cy0 - 6, width: b[2] - b[0] + 16, height: b[3] - b[1] + 12, overflow: "hidden",
      transform: `translateZ(${lift}px)`, boxShadow: `0 ${lift * 0.5}px ${lift * 1.1}px rgba(0,0,0,${0.4 * lit})`, background: "#ffffff", opacity: lit }}>
      <Img src={staticFile(page)} style={{ position: "absolute", left: -(b[0] - 8), top: -(b[1] - 6), width: pw, height: ph, maxWidth: "none" }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted
        style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: `scale(${1.12 + 0.0006 * f})`, filter: "blur(16px) brightness(0.32) saturate(0.7)" }} />
      <AbsoluteFill style={{ perspective: 1900, perspectiveOrigin: "50% 42%" }}>
        <div style={{ position: "absolute", left: 960 - ox, top: 540 - oy, width: W, height: H, transformStyle: "preserve-3d", transformOrigin: `${ox}px ${oy}px`,
          opacity: sheetIn, transform: `scale(${z}) rotateX(${c.rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) translateY(${(1 - sheetIn) * 70}px)` }}>
          <div style={{ position: "absolute", inset: -46, background: "#ffffff", boxShadow: "0 40px 100px rgba(0,0,0,.7)" }} />
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            <Img src={staticFile(page)} style={{ position: "absolute", left: -cx0, top: -cy0, width: pw, height: ph, maxWidth: "none" }} />
          </div>
          <div style={{ position: "absolute", inset: -46, background: "linear-gradient(165deg, rgba(255,250,235,.10) 0%, rgba(0,0,0,0) 40%, rgba(0,0,0,.22) 100%)" }} />
          <div style={{ position: "absolute", inset: -46, background: `rgba(6,6,8,${0.6 * lit})` }} />
          {lines.map((b, i) => piece(b, i, 30 * lit))}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)" }} />
    </AbsoluteFill>
  );
};
