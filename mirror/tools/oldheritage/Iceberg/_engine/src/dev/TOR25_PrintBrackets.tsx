// TOR25 | PrintBrackets: the NWS survey photo of the EF4 farmhouse as a physical print in 3-D (white border, tilted, slow swing over a
// blurred copy of itself) that settles flat and fills the frame; then white CORNER brackets close on the detail the rating turns on
// (the brick that was NOT swept away), and the camera travels across the print to the rubble. Built for the beat where a survey
// photo has to carry three sentences: the house, the brick, the rubble.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type Box = [number, number, number, number];
type View = { at: number; c: [number, number]; z: number }; // photo px centre + zoom (1 = photo fills the frame)

export const PrintBrackets: React.FC<{
  src: string; iw: number; ih: number;
  flatAt: number; flatLen: number; // the print settles flat / fills the frame
  views: View[]; // camera over the flat photo after flatAt
  brackets: { box: Box; at: number; out?: number }[];
  label?: { text: string; at: number; hold: number };
}> = ({ src, iw, ih, flatAt, flatLen, views, brackets, label }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const k = io(interpolate(f, [flatAt, flatAt + flatLen], [0, 1], cl)); // 0 = print, 1 = flat full-frame
  // camera over the photo
  let v = views[0];
  for (let i = 1; i < views.length; i++) if (f >= views[i - 1].at) { const a = views[i - 1], b = views[i]; const u = io(interpolate(f, [a.at, b.at], [0, 1], cl)); v = { at: f, c: [a.c[0] + (b.c[0] - a.c[0]) * u, a.c[1] + (b.c[1] - a.c[1]) * u], z: a.z + (b.z - a.z) * u }; }
  const fill = Math.max(width / iw, height / ih);
  // print state: 62% of the frame width, tilted; flat state: photo px -> screen px = fill * z, centred on v.c
  const pw0 = width * 0.62, s0 = pw0 / iw;
  const s1 = fill * v.z;
  const sc = s0 + (s1 - s0) * k;
  const cx0 = iw / 2, cy0 = ih / 2;
  const cx = cx0 + (v.c[0] - cx0) * k, cy = cy0 + (v.c[1] - cy0) * k;
  let left = width / 2 - cx * sc, top = height / 2 - cy * sc - 20 * (1 - k);
  // flat state: never show past the photo's edge (clamp blends in with k)
  const lc = Math.min(0, Math.max(width - iw * sc, left)), tc = Math.min(0, Math.max(height - ih * sc, top));
  left = left + (lc - left) * k; top = top + (tc - top) * k;
  const ry = (-16 + 10 * io(Math.min(1, f / Math.max(1, flatAt)))) * (1 - k), rx = 6 * (1 - k), rz = -1.5 * (1 - k);
  const border = 14 * (1 - k);
  const P = (x: number, y: number): [number, number] => [left + x * sc, top + y * sc];
  return (
    <AbsoluteFill style={{ background: "#050505", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(24px) brightness(.4) saturate(.8)", opacity: 1 - k }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div style={{ position: "absolute", left: left - border, top: top - border, width: iw * sc + 2 * border, height: ih * sc + 2 * border, background: "#f4f2ec", padding: border, boxSizing: "border-box",
          boxShadow: `0 30px 70px rgba(0,0,0,${0.75 * (1 - k)})`, transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`, transformOrigin: "50% 50%" }}>
          <Img src={staticFile(src)} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>
      </AbsoluteFill>
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {brackets.map((b, i) => {
          const g = out(interpolate(f, [b.at, b.at + 14], [0, 1], cl)) * (b.out ? interpolate(f, [b.out, b.out + 8], [1, 0], cl) : 1); if (g <= 0) return null;
          const [x0, y0] = P(b.box[0], b.box[1]), [x1, y1] = P(b.box[2], b.box[3]);
          const pad = 40 * (1 - g), L = Math.min(60, (x1 - x0) / 4, (y1 - y0) / 3);
          const X0 = x0 - pad, Y0 = y0 - pad, X1 = x1 + pad, Y1 = y1 + pad;
          const c = (x: number, y: number, dx: number, dy: number) => `M${x + dx * L} ${y} L${x} ${y} L${x} ${y + dy * L}`;
          return <path key={i} d={[c(X0, Y0, 1, 1), c(X1, Y0, -1, 1), c(X0, Y1, 1, -1), c(X1, Y1, -1, -1)].join(" ")} fill="none" stroke="#fff" strokeWidth={6} opacity={g} style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,.7))" }} />;
        })}
      </svg>
      {label && <RedLabel text={label.text} at={label.at} hold={label.hold} x={0.5} y={0.9} />}
    </AbsoluteFill>
  );
};
