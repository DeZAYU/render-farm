// AM00 BergFlight (Amusement Parks Iceberg intro): the same photoreal ice3 berg, four level lines and twenty case names that
// dev/AM_LevelEntry uses, treated as one 3-D space. The camera (eye x, y + distance D from the berg plane, a monotone Hermite path:
// no overshoot, every move eased) starts close on the tip, pulls back while the chart builds (lines draw out from the centre, the
// names settle band by band, a small "LEVEL n" tag on each band), then flies down it. The cases' real clips/photos lift OUT of their
// own band on planes in front of the berg (they rise from the berg towards the camera and grow, then float at depth), so they pass
// with parallax; hero planes are flown up to ~70 % of the frame. Depth of field (the plane in focus sharp, the rest soft by depth),
// light falloff on the berg while a hero is in front, the berg's dark below extends into black for the deepest band.
// End: everything sinks back into the berg, the camera returns to the wide berg (AM01's LevelEntry opens on that same wide).
import React from "react";
import { AbsoluteFill, Easing, Img, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame } from "remotion";
import { AM_BARS, AM_LEVELS } from "./AM_levels";
import { useAmFonts } from "./AM_LevelEntry";
import { pathAt, type Key } from "./TOR00_ClipField";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.25, 1), out = Easing.bezier(0.16, 1, 0.3, 1);
const ease = (f: number, a: number, b: number, e = io) => e(interpolate(f, [a, b], [0, 1], cl));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const W = 1920, H = 1080, P = 1000; // berg plane = 1920x1080 world units at z=0; eye at distance D (D = 1000: the berg fills the frame)
const YS = [0, ...AM_BARS, 1].map((y) => y * H);
const NAME_PX = 28, COL = 260;

/** the name positions, exactly as AM_LevelEntry lays them out (two columns either side of the berg, odd last name centred) */
export const namePos = (k: number) => {
  const top = YS[k], h = YS[k + 1] - YS[k], cs = AM_LEVELS[k].cases, rows = Math.ceil(cs.length / 2);
  return cs.map((c, i) => {
    const row = Math.floor(i / 2), lonely = cs.length === 1;
    const y = top + h * (rows === 1 ? 0.5 : 0.2 + (0.66 * row) / (rows - 1));
    const side = lonely ? 0 : i % 2 === 0 ? -1 : 1;
    const tw = c.length * NAME_PX * 0.56;
    const cx = side === 0 ? W / 2 : W / 2 + side * (COL + tw / 2);
    return { text: c.toUpperCase(), y, side, i, cx };
  });
};

export type Card = { id: string; src: string; still?: boolean; from?: number; x: number; y: number; z: number; w: number;
  at: number; out: number; lvl: number; idx: number; ry?: number; pos?: string };
export type Cam = Key & { fd: number; dim: number }; // fd = focus distance, dim = berg light falloff (0..1)

const dof = (d: number, fd: number) => Math.min(4.5, (7 * Math.abs(d - fd)) / fd);

export const BergFlight: React.FC<{ cards: Card[]; cam: Cam[]; reveal: [number, number]; rule?: { lvl: number; idx: number; at: number }[];
  chartFade?: [number, number, number] }> = ({ cards, cam, reveal, rule = [], chartFade }) => {
  useAmFonts();
  const f = useCurrentFrame();
  const e = pathAt(cam, f);
  const fd = pathAt(cam.map((k) => ({ f: k.f, x: k.fd, y: 0, z: 0 })), f).x;
  const dim = pathAt(cam.map((k) => ({ f: k.f, x: k.dim, y: 0, z: 0 })), f).x;
  const D = e.z, sB = P / D;
  const [r0, r1] = reveal;
  // chart (lines, names, tags) dims under the title: [from, to, level]
  const chart = chartFade ? lerp(1, chartFade[2], ease(f, chartFade[0], chartFade[1])) : 1;
  const bergBlur = dof(D, fd);
  // which band the eye is on: names of that band at full light, the rest frosted (only once the camera is in close)
  const close = interpolate(D, [880, 1000], [1, 0], cl);
  const bandLight = (k: number) => {
    const mid = (YS[k] + YS[k + 1]) / 2, h = YS[k + 1] - YS[k];
    return interpolate(Math.abs(e.y - mid), [h * 0.4, h * 1.4], [1, 0.45], cl);
  };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      {/* the berg plane */}
      <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, transformOrigin: "0 0",
        transform: `translate(960px,540px) scale(${sB.toFixed(5)}) translate(${(-e.x).toFixed(2)}px,${(-e.y).toFixed(2)}px)`,
        filter: bergBlur > 0.25 ? `blur(${(bergBlur / sB).toFixed(2)}px)` : undefined }}>
        <Img src={staticFile("ice3/wide.jpg")} style={{ position: "absolute", left: 0, top: 0, width: W, height: H, filter: `brightness(${(0.78 * (1 - 0.42 * dim)).toFixed(3)}) contrast(1.06)` }} />
        <div style={{ position: "absolute", left: -1200, width: W + 2400, top: H - 2, height: 1600, background: "#000" }} />
        {/* level lines: each draws out from the centre during the reveal */}
        {AM_BARS.map((y0, i) => {
          const y = y0 * H, g = ease(f, r0 + 6 + i * 7, r0 + 40 + i * 7, out);
          const half = g * (W / 2 + 400);
          return <div key={i} style={{ position: "absolute", left: W / 2 - half, width: 2 * half, top: y - 2.5, height: 5, opacity: chart * (1 - 0.35 * dim),
            background: "rgba(236,242,244,.85)", boxShadow: "0 2px 5px rgba(0,0,0,.55)" }} />;
        })}
        {/* LEVEL n tags, left edge of each band */}
        {AM_LEVELS.map((lv, k) => {
          const t = ease(f, r0 + 14 + k * 9, r0 + 32 + k * 9, out);
          return <div key={"t" + k} style={{ position: "absolute", left: 64, top: YS[k] + (k === 0 ? 14 : 12), fontFamily: "Elite", fontSize: 24, color: "#EEF2F2", whiteSpace: "pre",
            opacity: chart * t * 0.8 * (1 - close) * (1 - 0.4 * dim), textShadow: "0 2px 8px rgba(0,0,0,.85)", letterSpacing: "0.06em" }}>{`LEVEL ${lv.n}`}</div>;
        })}
        {/* the case names, settling band by band */}
        {AM_LEVELS.map((lv, k) => namePos(k).map((p) => {
          const t0 = r0 + 16 + k * 9 + p.i * 3, t = ease(f, t0, t0 + 16, out);
          const r = rule.find((q) => q.lvl === k && q.idx === p.i), ru = r ? ease(f, r.at, r.at + 14, out) : 0;
          const base = chart * t * lerp(0.82, bandLight(k), close) * (1 - 0.35 * dim), op = r ? Math.max(base, chart * ru) : base;
          const style: React.CSSProperties = { position: "absolute", top: p.y - NAME_PX * 0.62 + (1 - t) * 8, whiteSpace: "pre", fontFamily: "Elite", fontSize: NAME_PX,
            color: "#EEF2F2", opacity: Math.min(1, op), textShadow: "0 2px 10px rgba(0,0,0,.85), 0 0 3px rgba(0,0,0,.7)", filter: t < 0.98 ? `blur(${((1 - t) * 4).toFixed(2)}px)` : undefined,
            ...(p.side === 0 ? { left: 0, width: W, textAlign: "center" } : p.side < 0 ? { right: W / 2 + COL, textAlign: "right" } : { left: W / 2 + COL }) };
          return (
            <div key={`${k}-${p.i}`} style={style}>
              <span style={{ position: "relative" }}>{p.text}
                {ru > 0 && <span style={{ position: "absolute", left: 0, bottom: -5, height: 2, width: `${ru * 100}%`, background: "rgba(255,255,255,.92)" }} />}
              </span>
            </div>
          );
        }))}
      </div>
      {/* case planes in front of the berg, far to near */}
      {[...cards].sort((a, b) => a.z - b.z).map((c) => {
        if (f < c.at - 1 || f > c.out + 26) return null;
        const up = ease(f, c.at, c.at + 26), down = ease(f, c.out, c.out + 24, Easing.bezier(0.5, 0, 0.8, 0.6));
        const lift = up * (1 - down);
        const np = namePos(c.lvl)[c.idx];
        const x = lerp(np.cx, c.x, up), y = lerp(np.y, c.y, up), z = c.z * lift;   // rises out of its own name, sinks back where it floats
        const d = D - z; if (d < 40) return null;
        const s = P / d, w = c.w * (0.35 + 0.65 * lift), h = (w * 9) / 16;
        const X = 960 + (x - e.x) * s, Y = 540 + (y - e.y) * s, SW = w * s, SH = h * s;
        if (X + SW / 2 < -50 || X - SW / 2 > W + 50 || Y + SH / 2 < -50 || Y - SH / 2 > H + 50) return null;
        const blur = dof(d, fd), light = 1 - 0.3 * Math.min(1, Math.max(0, (d - fd) / fd));
        const op = interpolate(lift, [0, 0.25], [0, 1], cl);
        const ry = (c.ry ?? interpolate(X, [0, W], [10, -10], cl)) * (1 - 0.6 * ease(f, c.at, c.at + 40));
        const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: c.pos ?? "50% 50%", display: "block" };
        return (
          <div key={c.id} style={{ position: "absolute", left: X - SW / 2, top: Y - SH / 2, width: SW, height: SH, opacity: op }}>
            <div style={{ width: "100%", height: "100%", transform: `skewY(${(ry * 0.12).toFixed(3)}deg) scaleX(${(1 - Math.abs(ry) * 0.004).toFixed(4)})`, outline: `${Math.max(1, 3 * s / 1.6).toFixed(1)}px solid rgba(236,240,240,.88)`,
              boxShadow: `0 ${(18 * s).toFixed(0)}px ${(46 * s).toFixed(0)}px rgba(0,0,0,.6)`, overflow: "hidden", background: "#000",
              filter: `${blur > 0.25 ? `blur(${blur.toFixed(2)}px) ` : ""}brightness(${light.toFixed(3)})` }}>
              {c.still ? <Img src={staticFile(c.src)} style={{ ...style, transform: `scale(${(1.04 + 0.05 * ease(f, c.at, c.out + 24, (u) => u)).toFixed(4)})` }} />
                : <Sequence from={c.at - 2} layout="none"><OffthreadVideo src={staticFile(c.src)} startFrom={Math.round((c.from ?? 0) * 30)} muted style={style} /></Sequence>}
            </div>
          </div>
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
