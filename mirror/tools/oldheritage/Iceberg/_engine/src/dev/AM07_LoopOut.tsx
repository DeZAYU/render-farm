// AM07 LoopOut: "They couldn't handle the loop, so the loop came out". A real photo of a Son of Beast train inside its 118 ft wooden
// vertical loop (ThrillZing, April 2001), laid over its own blurred copy (portrait photo), slow push. On "the loop" a white line runs
// once round the loop's ring; on "came out" the ring and everything inside it drain to a cold grey and sink into shadow while the
// rest of the ride keeps its colour, and the white line breaks into dashes and fades: the loop marked as gone, the photo itself untouched.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);

/** ring: ellipse in the picture's own px (iw x ih) -> drawn in the contained frame */
export const LoopOut: React.FC<{ src: string; iw: number; ih: number; ring: { cx: number; cy: number; rx: number; ry: number; rot?: number }; traceAt: number; outAt: number; s0?: number; s1?: number }> = ({ src, iw, ih, ring, traceAt, outAt, s0 = 1.0, s1 = 1.1 }) => {
  const f = useCurrentFrame(); const { durationInFrames: dur } = useVideoConfig();
  const sc = Math.min(1080 / ih, 1920 / iw), w = iw * sc, h = ih * sc, ox = (1920 - w) / 2, oy = (1080 - h) / 2;
  const cx = ox + ring.cx * sc, cy = oy + ring.cy * sc, rx = ring.rx * sc, ry = ring.ry * sc, rot = ring.rot ?? 0;
  const s = s0 + (s1 - s0) * io(f / dur);
  const tr = io(interpolate(f, [traceAt, traceAt + 26], [0, 1], cl));
  const g = io(interpolate(f, [outAt, outAt + 30], [0, 1], cl));
  const per = Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)));
  const mask = `radial-gradient(ellipse ${rx * 1.18}px ${ry * 1.18}px at ${cx}px ${cy}px, #000 80%, transparent 100%)`;
  const pic = (st: React.CSSProperties) => <Img src={staticFile(src)} style={{ position: "absolute", left: ox, top: oy, width: w, height: h, ...st }} />;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ filter: "blur(30px) brightness(.55)", transform: "scale(1.2)" }}><Img src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></AbsoluteFill>
      <AbsoluteFill style={{ transform: `scale3d(${s},${s},1)`, transformOrigin: `${(cx / 1920) * 100}% ${(cy / 1080) * 100}%`, willChange: "transform" }}>
        {pic({ boxShadow: "0 0 40px rgba(0,0,0,.6)" })}
        {g > 0 && <div style={{ position: "absolute", inset: 0, opacity: g, WebkitMaskImage: mask, maskImage: mask }}>{pic({ filter: "grayscale(1) brightness(.42) contrast(.9)" })}</div>}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {tr > 0 && <ellipse cx={cx} cy={cy} rx={rx} ry={ry} transform={`rotate(${rot} ${cx} ${cy})`} fill="none" stroke="#fff" strokeWidth={4}
            strokeDasharray={g > 0 ? `${14 + 30 * (1 - g)} ${14 * g + 1}` : `${per} ${per}`} strokeDashoffset={g > 0 ? 0 : per * (1 - tr)}
            opacity={1 - 0.85 * g} style={{ filter: "drop-shadow(0 0 5px rgba(0,0,0,.8))" }} />}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
