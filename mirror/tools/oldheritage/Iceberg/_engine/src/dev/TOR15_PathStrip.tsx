// TOR15 PathStrip: the Cullman-Arab EF4's 47-mile NWS track (start 34.0757,-87.0097 -> end 34.4776,-86.3684) laid flat as a horizontal
// strip on real USGS imagery: the picture is turned so the track runs left-right, everything off the damage corridor is dimmed, a
// mile ruler runs under the line. The camera opens on Arab (spoken first), then dollies back down the line to Cullman as the
// "Cullman and Arab tornado" name is said, pulling out so both ends of that name sit in one frame. Different from a tilted map plane
// (TOR12) or a radar (TOR18): this is a measured, unrolled path.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

type Town = { name: string; p: [number, number]; at: number; hold?: number };
type P = { src: string; iw: number; ih: number; a: [number, number]; b: [number, number]; miles: number; towns: Town[];
  cam: { at: number; u: number; k: number }[]; band?: number };

export const PathStrip: React.FC<P> = ({ src, iw, ih, a, b, miles, towns, cam, band = 230 }) => {
  const f = useCurrentFrame(); const { width, height } = useVideoConfig();
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const th = -Math.atan2(dy, dx); // rotate the picture so the track is horizontal
  // camera: one smooth eased move between keys
  let u = cam[0].u, k = cam[0].k;
  for (let i = 1; i < cam.length; i++) {
    const e = io(interpolate(f, [cam[i - 1].at, cam[i].at], [0, 1], cl));
    if (f >= cam[i - 1].at) { u = cam[i - 1].u + (cam[i].u - cam[i - 1].u) * e; k = cam[i - 1].k + (cam[i].k - cam[i - 1].k) * e; }
  }
  const cx = width / 2, cy = height * 0.48;
  const Px = a[0] + dx * u, Py = a[1] + dy * u;
  const tf = `translate(${cx}px, ${cy}px) rotate(${th}rad) scale(${k}) translate(${-Px}px, ${-Py}px)`;
  const X = (t: number) => cx + (t - u) * L * k; // track fraction -> screen x
  const proj = (p: [number, number]) => { const rx = p[0] - a[0], ry = p[1] - a[1]; return { t: (rx * ux + ry * uy) / L, d: -rx * uy + ry * ux }; };
  const o = interpolate(f, [0, 8], [0, 1], cl);
  const ry = cy - band + 40; // ruler along the top edge of the corridor (the towns sit below the line)
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: o }}>
      {/* blurred underlay so the turned picture never shows black corners */}
      <Img src={staticFile(src)} style={{ position: "absolute", inset: -60, width: width + 120, height: height + 120, objectFit: "cover", filter: "blur(30px) brightness(.7) saturate(.8)", transform: "scale(1.3)" }} />
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 0, width: iw, height: ih, transformOrigin: "0 0", transform: tf, filter: "brightness(1.28) saturate(.95) contrast(1.08)" }} />
      {/* the corridor: everything above / below the band is dimmed */}
      <AbsoluteFill style={{ background: `linear-gradient(180deg, rgba(0,0,0,.6) 0px, rgba(0,0,0,.6) ${cy - band - 40}px, rgba(0,0,0,0) ${cy - band + 30}px, rgba(0,0,0,0) ${cy + band - 30}px, rgba(0,0,0,.6) ${cy + band + 40}px, rgba(0,0,0,.6) 100%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <line x1={X(0)} y1={cy} x2={X(1)} y2={cy} stroke="rgba(0,0,0,.5)" strokeWidth={14} strokeLinecap="round" />
        <line x1={X(0)} y1={cy} x2={X(1)} y2={cy} stroke="#fff" strokeWidth={6} strokeLinecap="round" />
        {/* start / end caps */}
        {[0, 1].map((t) => <line key={t} x1={X(t)} y1={cy - 22} x2={X(t)} y2={cy + 22} stroke="#fff" strokeWidth={5} />)}
        {/* mile ruler */}
        <line x1={X(0)} y1={ry} x2={X(1)} y2={ry} stroke="rgba(255,255,255,.6)" strokeWidth={2} />
        {Array.from({ length: Math.floor(miles) + 1 }, (_, m) => m).map((m) => {
          const x = X(m / miles); if (x < -40 || x > width + 40) return null;
          const big = m % 10 === 0;
          return <g key={m}><line x1={x} y1={ry} x2={x} y2={ry + (big ? 22 : m % 5 === 0 ? 14 : 8)} stroke="#fff" strokeWidth={big ? 3 : 1.5} opacity={big ? 0.95 : 0.6} />
            {big && <text x={x} y={ry - 30} fill="rgba(255,255,255,.85)" fontFamily="ArchivoBlk" fontWeight={800} fontSize={24} textAnchor="middle">{m === 0 ? "0 MI" : `${m}`}</text>}</g>;
        })}
        {/* towns: a small white mark on the place, joined to the line */}
        {towns.map((tw, i) => { const q = proj(tw.p); const x = X(q.t), y = cy + q.d * k;
          const g = interpolate(f, [tw.at - 6, tw.at + 4], [0, 1], cl);
          return <g key={i} opacity={g}><line x1={x} y1={cy} x2={x} y2={y} stroke="#fff" strokeWidth={2} strokeDasharray="5 5" />
            <rect x={x - 9} y={y - 9} width={18} height={18} fill="none" stroke="#fff" strokeWidth={4} style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,.7))" }} /></g>; })}
      </svg>
      {towns.map((tw, i) => { const q = proj(tw.p); const x = X(q.t), y = cy + q.d * k;
        return <RedLabel key={i} text={tw.name} at={tw.at} hold={tw.hold} x={Math.min(0.86, Math.max(0.14, x / width))} y={(y - 62) / height} size={40} />; })}
    </AbsoluteFill>
  );
};
