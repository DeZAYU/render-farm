// TP19 VoidCut: a 2.5-D white-line cutaway of the one-storey Coney Island Arcade over the darkened footage of the fire.
// The street front is a rolled steel shutter; above the room is the suspended ceiling, then a hidden gap, then the roof deck.
// mode "cut":    the front goes see-through, the gap between ceiling and roof glows red (the fire), then the two ways in
//                are cut as spoken: a square through the shutter (the flap falls), then a vent through the roof (panel lifts,
//                glow and smoke escape). One smooth camera curve (front-low -> high three-quarter).
// mode "reveal": seen from outside only roof + street are lit; the walls then go see-through and the camera sinks into the gap.
// All marks are projected from one small 3-D model (units ~ metres), so lines stay locked to the building while the camera moves.
import React from "react";
import { AbsoluteFill, Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RED, RedLabel } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
type V3 = [number, number, number];

// building (x along the street front, y up, z back into the block)
const W = 22, D = 12, HC = 4.6, HR = 6.4, HF = 7.0; // ceiling, roof deck, top of the front fascia (sign band)
const SH: [number, number] = [1.0, 21.0];               // shutter run along the front
const CUT1 = { x0: 5.2, x1: 7.6, y0: 0.25, y1: 2.55 };   // square cut in the shutter
const CUT2 = { x0: 12.2, x1: 15.0, z0: 4.0, z1: 6.6 };   // vent cut in the roof

type Cam = { yaw: number; pitch: number; dist: number; tx: number; ty: number; tz: number };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpCam = (a: Cam, b: Cam, t: number): Cam => ({ yaw: lerp(a.yaw, b.yaw, t), pitch: lerp(a.pitch, b.pitch, t), dist: lerp(a.dist, b.dist, t), tx: lerp(a.tx, b.tx, t), ty: lerp(a.ty, b.ty, t), tz: lerp(a.tz, b.tz, t) });

// one quadratic curve through the three camera keys (start, middle, end), run on a single eased clock -> no hold/move/hold jerks
const camAt = (k: [Cam, Cam, Cam], u: number): Cam => {
  const s = io(Math.min(1, Math.max(0, u)));
  const C = lerpCam(lerpCam(k[0], k[2], 0.5), k[1], 2); // control point so the curve passes the middle key at s = 0.5
  return lerpCam(lerpCam(k[0], C, s), lerpCam(C, k[2], s), s);
};

const project = (c: Cam, p: V3, w: number, h: number): [number, number, number] => {
  const x = p[0] - c.tx, y = p[1] - c.ty, z = p[2] - c.tz;
  const cy = Math.cos(c.yaw), sy = Math.sin(c.yaw);
  const x1 = x * cy - z * sy, z1 = x * sy + z * cy;
  const cp = Math.cos(c.pitch), sp = Math.sin(c.pitch);
  const y2 = y * cp + z1 * sp, z2 = -y * sp + z1 * cp;
  const depth = z2 + c.dist, F = 1350;
  return [w / 2 + (F * x1) / depth, h * 0.53 - (F * y2) / depth, depth];
};

const flick = (f: number, k: number) => 0.72 + 0.16 * Math.sin(f * 0.37 + k * 1.7) + 0.12 * Math.sin(f * 0.91 + k * 4.1);

export const VoidCut: React.FC<{ mode: "cut" | "reveal"; bg: string; bgFrom: number; t: Record<string, number> }> = ({ mode, bg, bgFrom, t }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames: N } = useVideoConfig();

  const keys: [Cam, Cam, Cam] = mode === "cut"
    ? [{ yaw: -0.12, pitch: 0.08, dist: 34, tx: 11, ty: 3.4, tz: 5 }, { yaw: -0.3, pitch: 0.24, dist: 31, tx: 11, ty: 3.6, tz: 5 }, { yaw: -0.42, pitch: 0.4, dist: 30, tx: 11, ty: 3.8, tz: 5 }]
    : [{ yaw: 0.4, pitch: 0.5, dist: 36, tx: 11, ty: 3.0, tz: 5 }, { yaw: 0.28, pitch: 0.3, dist: 32, tx: 11, ty: 4.0, tz: 5 }, { yaw: 0.14, pitch: 0.12, dist: 19, tx: 10, ty: 5.4, tz: 4 }];
  const c = camAt(keys, f / N);
  const P = (p: V3) => project(c, p, width, height);
  const pts = (ps: V3[]) => ps.map((p) => { const q = P(p); return `${q[0].toFixed(1)},${q[1].toFixed(1)}`; }).join(" ");
  const poly = (ps: V3[], st: React.SVGProps<SVGPolygonElement>, k?: string) => <polygon key={k} points={pts(ps)} {...st} />;
  const line = (a: V3, b: V3, st: React.SVGProps<SVGLineElement>, k?: string) => { const p = P(a), q = P(b); return <line key={k} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} {...st} />; };

  // timings (frames), passed from the case so they land on the words
  const xray = io(interpolate(f, [t.xray ?? 30, (t.xray ?? 30) + 22], [0, 1], cl));
  const fire = out(interpolate(f, [t.fire ?? 45, (t.fire ?? 45) + 18], [0, 1], cl));
  const c1 = io(interpolate(f, [t.cut1 ?? 9999, (t.cut1 ?? 9999) + 16], [0, 1], cl));          // shutter cut traced
  const flap = io(interpolate(f, [(t.cut1 ?? 9999) + 16, (t.cut1 ?? 9999) + 30], [0, 1], cl)); // flap falls
  const c2 = io(interpolate(f, [t.cut2 ?? 9999, (t.cut2 ?? 9999) + 14], [0, 1], cl));
  const lift = io(interpolate(f, [(t.cut2 ?? 9999) + 14, (t.cut2 ?? 9999) + 30], [0, 1], cl));
  const outside = mode === "reveal" ? 1 - xray : 0; // reveal: roof + street lit before the x-ray
  const fade = interpolate(f, [0, 8, N - 10, N], [0, 1, 1, mode === "reveal" ? 0.0 : 1], cl);

  const wall = `rgba(255,255,255,${0.9 - 0.62 * xray})`;
  const S = { stroke: "#fff", strokeWidth: 3, strokeLinejoin: "round" as const, fill: "none" };
  const thin = { stroke: "rgba(255,255,255,.55)", strokeWidth: 1.6 };

  // fire tongues in the gap (between ceiling HC and roof HR), mid-depth rows
  const tongues: React.ReactNode[] = [];
  if (fire > 0) {
    for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) {
      const x = 1.8 + i * 2.6 + r * 1.3, z = 1.0 + r * 3.0, k = r * 8 + i;
      const hgt = (HR - HC - 0.15) * (0.4 + 0.6 * flick(f, k)) * fire;
      const a = P([x - 0.45, HC + 0.02, z]), b = P([x + 0.45, HC + 0.02, z]), tip = P([x + 0.18 * Math.sin(f * 0.2 + k), HC + hgt, z]);
      tongues.push(<polygon key={"t" + k} points={`${a[0]},${a[1]} ${tip[0]},${tip[1]} ${b[0]},${b[1]}`} fill={k % 3 ? "rgba(255,120,40,.8)" : "rgba(255,190,90,.85)"} filter="url(#tp19soft)" />);
    }
  }
  // smoke out of the roof vent
  const smoke: React.ReactNode[] = [];
  if (lift > 0) for (let i = 0; i < 7; i++) {
    const age = ((f - (t.cut2! + 18) + i * 7) % 49) / 49; if (f - (t.cut2! + 18) + i * 7 < 0) continue;
    const q = P([13.6 + Math.sin(i * 2.1) * 0.6 + age * 1.2, HR + 0.3 + age * 4.5, 6.4]);
    smoke.push(<circle key={"s" + i} cx={q[0]} cy={q[1]} r={(18 + age * 60) * (25 / q[2])} fill={`rgba(150,150,150,${0.38 * (1 - age) * lift})`} />);
  }

  // shutter slats (front face z=0)
  const slats: React.ReactNode[] = [];
  for (let y = 0.2; y < HC - 0.05; y += 0.17) slats.push(line([SH[0], y, 0], [SH[1], y, 0], { stroke: `rgba(255,255,255,${(0.42 - 0.3 * xray)})`, strokeWidth: 1.2 }, "sl" + y.toFixed(2)));

  // shutter cut path (square), traced as one stroke
  const cutSq: V3[] = [[CUT1.x0, CUT1.y0, 0], [CUT1.x0, CUT1.y1, 0], [CUT1.x1, CUT1.y1, 0], [CUT1.x1, CUT1.y0, 0]];
  const cutD = "M" + cutSq.map((p) => P(p).slice(0, 2).join(" ")).join(" L");
  // the flap hinges at its bottom edge and falls toward the street (-z)
  const fa = flap * 1.45;
  const flapPts: V3[] = [[CUT1.x0, CUT1.y0, 0], [CUT1.x1, CUT1.y0, 0],
    [CUT1.x1, CUT1.y0 + (CUT1.y1 - CUT1.y0) * Math.cos(fa), -(CUT1.y1 - CUT1.y0) * Math.sin(fa)], [CUT1.x0, CUT1.y0 + (CUT1.y1 - CUT1.y0) * Math.cos(fa), -(CUT1.y1 - CUT1.y0) * Math.sin(fa)]];
  // roof vent cut + lifting panel
  const v: V3[] = [[CUT2.x0, HR, CUT2.z0], [CUT2.x1, HR, CUT2.z0], [CUT2.x1, HR, CUT2.z1], [CUT2.x0, HR, CUT2.z1]];
  const vD = "M" + v.map((p) => P(p).slice(0, 2).join(" ")).join(" L") + " Z";
  const panel: V3[] = v.map(([x, y, z]) => [x + lift * 1.6, y + lift * 1.3 + (x - CUT2.x0) * 0.25 * lift, z - lift * 0.6]);

  const lbl = (p: V3, text: string, at: number, hold = 9999) => { const q = P(p); return <RedLabel key={text} text={text} at={at} hold={hold} x={q[0] / width} y={q[1] / height} size={30} />; };

  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden", opacity: fade }}>
      <OffthreadVideo src={staticFile(bg)} startFrom={Math.round(bgFrom * 30)} muted style={{ position: "absolute", inset: -40, width: width + 80, height: height + 80, objectFit: "cover", filter: "blur(9px) brightness(.26) saturate(.55)" }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 65% at 50% 52%, rgba(0,0,0,0) 35%, rgba(0,0,0,.65) 100%)" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="tp19glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" /></filter>
          <filter id="tp19soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2" /></filter>
        </defs>
        {/* street in front (lit in reveal mode) */}
        {poly([[-6, 0, -7], [W + 6, 0, -7], [W + 6, 0, 0], [-6, 0, 0]], { fill: `rgba(255,255,255,${0.04 + 0.14 * outside})`, stroke: `rgba(255,255,255,${0.15 + 0.5 * outside})`, strokeWidth: 1.5 }, "street")}
        {/* floor + back + sides */}
        {poly([[0, 0, 0], [W, 0, 0], [W, 0, D], [0, 0, D]], { fill: "rgba(255,255,255,.035)", ...thin }, "floor")}
        {poly([[0, 0, D], [W, 0, D], [W, HR, D], [0, HR, D]], { fill: `rgba(18,20,24,${0.55 - 0.25 * xray})`, stroke: wall, strokeWidth: 2.2 }, "back")}
        {poly([[0, 0, 0], [0, 0, D], [0, HR, D], [0, HF, 0]], { fill: `rgba(18,20,24,${0.5 - 0.3 * xray})`, stroke: wall, strokeWidth: 2.2 }, "left")}
        {/* ceiling (dashed) */}
        {xray > 0.01 && poly([[0, HC, 0], [W, HC, 0], [W, HC, D], [0, HC, D]], { fill: `rgba(255,255,255,${0.07 * xray})`, stroke: `rgba(255,255,255,${0.85 * xray})`, strokeWidth: 2.4, strokeDasharray: "14 9" }, "ceil")}
        {/* the gap: red glow volume between ceiling and roof */}
        {fire > 0 && <g opacity={fire * flick(f, 99)}>
          {poly([[0.2, HC + 0.05, 0.3], [W - 0.2, HC + 0.05, 0.3], [W - 0.2, HC + 0.05, D - 0.3], [0.2, HC + 0.05, D - 0.3]], { fill: "rgba(227,20,27,.32)", filter: "url(#tp19glow)" }, "g1")}
          {poly([[0.2, HC, 0.2], [W - 0.2, HC, 0.2], [W - 0.2, HR, 0.2], [0.2, HR, 0.2]], { fill: "rgba(227,20,27,.6)", filter: "url(#tp19glow)" }, "g2")}
        </g>}
        {tongues}
        {/* right wall */}
        {poly([[W, 0, 0], [W, 0, D], [W, HR, D], [W, HF, 0]], { fill: `rgba(18,20,24,${0.45 - 0.33 * xray})`, stroke: wall, strokeWidth: 2.2 }, "right")}
        {/* roof deck */}
        {poly([[0, HR, 0], [W, HR, 0], [W, HR, D], [0, HR, D]], { fill: `rgba(${outside > 0 ? "235,235,230" : "20,22,26"},${outside > 0 ? 0.08 + 0.2 * outside : 0.62})`, stroke: "#fff", strokeWidth: 3 }, "roof")}
        {/* roof vent: cut traced, hole glows, panel lifts */}
        {c2 > 0 && <path d={vD} fill="none" stroke={RED} strokeWidth={5} pathLength={1} strokeDasharray={`${c2} 1`} strokeLinejoin="round" />}
        {lift > 0 && poly(v, { fill: `rgba(255,110,40,${0.75 * lift * flick(f, 7)})` }, "hole")}
        {lift > 0 && poly(v, { fill: `rgba(227,20,27,${0.6 * lift})`, filter: "url(#tp19glow)" }, "holeg")}
        {lift > 0 && poly(panel, { fill: "rgba(30,32,36,.9)", stroke: "#fff", strokeWidth: 2.5 }, "panel")}
        {smoke}
        {/* front: fascia + shutter (see-through as the x-ray comes up) */}
        {poly([[0, HC, 0], [W, HC, 0], [W, HF, 0], [0, HF, 0]], { fill: `rgba(20,22,26,${0.75 * (1 - xray) + 0.05})`, stroke: "#fff", strokeWidth: 3 }, "fascia")}
        {poly([[SH[0], 0, 0], [SH[1], 0, 0], [SH[1], HC - 0.05, 0], [SH[0], HC - 0.05, 0]], { fill: `rgba(40,44,50,${0.8 * (1 - xray) + 0.08})`, stroke: wall, strokeWidth: 2.6 }, "shutter")}
        {slats}
        {line([0, 0, 0], [0, HF, 0], S, "e1")}{line([W, 0, 0], [W, HF, 0], S, "e2")}
        {/* shutter cut: opening glows, flap falls to the street */}
        {flap > 0 && poly(cutSq, { fill: `rgba(255,120,40,${0.55 * flap * flick(f, 3)})` }, "open")}
        {c1 > 0 && <path d={cutD} fill="none" stroke={RED} strokeWidth={5} pathLength={1} strokeDasharray={`${c1} 1`} strokeLinejoin="round" />}
        {flap > 0 && poly(flapPts, { fill: "rgba(46,50,56,.95)", stroke: "#fff", strokeWidth: 2.4 }, "flap")}
      </svg>
      {mode === "cut" && t.lRoof != null && lbl([W * 0.16, HR + 0.55, 0], "ROOF", t.lRoof, 52)}
      {mode === "cut" && t.lCeil != null && lbl([W * 0.84, HC - 0.55, 0], "CEILING", t.lCeil, 46)}
      {mode === "cut" && t.cut1 != null && lbl([(CUT1.x0 + CUT1.x1) / 2, -0.9, 0], "STEEL SHUTTER", t.cut1 + 4, 40)}
    </AbsoluteFill>
  );
};
