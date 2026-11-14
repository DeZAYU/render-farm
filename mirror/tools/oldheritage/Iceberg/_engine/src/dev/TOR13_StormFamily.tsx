// TOR13 StormFamily: the supercell itself, from the real radar archive (IEM NEXRAD n0r composites, 5-minute frames, reprojected onto a
// graded USGS NAIP mosaic of northeast Nebraska), with each of the storm's six tornado tracks (SPC database) appearing at the minute it
// touched down. The four EF4s are drawn red, the two weak ones white; a clock (CDT) runs with the loop.
// Second use (`mode="costliest"`): the loop holds on the last frame, all tracks drawn, the Pilger track pulses.
import React from "react";
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RedLabel, RED } from "../brand";

const cl = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const io = Easing.bezier(0.45, 0, 0.2, 1);

export type FamTrack = { a: [number, number]; b: [number, number]; z: number; ef4: boolean; key?: boolean }; // z = touchdown, minutes after 0:00 UTC
export type Town = { x: number; y: number; name: string };

export const StormFamily: React.FC<{ base: string; iw: number; ih: number; frames: string[]; f0: number; step: number; // frame list (UTC minutes of frames[0], step minutes)
  tracks: FamTrack[]; towns: Town[]; cam: { cx: number; cy: number; z: number }[]; z0: number; z1: number; // UTC minutes shown at start / end of the shot
  mode?: "loop" | "costliest"; dateLabel?: string }> = ({ base, iw, ih, frames, f0, step, tracks, towns, cam, z0, z1, mode = "loop", dateLabel }) => {
  const f = useCurrentFrame(); const { width, height, durationInFrames } = useVideoConfig();
  const u = io(f / Math.max(1, durationInFrames - 1));
  const c = { cx: cam[0].cx + (cam[1].cx - cam[0].cx) * u, cy: cam[0].cy + (cam[1].cy - cam[0].cy) * u, z: cam[0].z + (cam[1].z - cam[0].z) * u };
  const k = Math.max(width / iw, height / ih) * c.z;
  const ox = Math.min(0, Math.max(width - iw * k, width / 2 - c.cx * k)), oy = Math.min(0, Math.max(height - ih * k, height / 2 - c.cy * k));
  const tm = mode === "loop" ? z0 + (z1 - z0) * interpolate(f, [6, durationInFrames - 10], [0, 1], cl) : z1; // UTC minutes now
  const fi = Math.max(0, Math.min(frames.length - 1, (tm - f0) / step));
  const i0 = Math.floor(fi), i1 = Math.min(frames.length - 1, i0 + 1), t = fi - i0;
  const cdt = tm - 5 * 60, hh = Math.floor(cdt / 60), mm = Math.floor(cdt % 60);
  const clock = `${hh > 12 ? hh - 12 : hh}:${String(mm).padStart(2, "0")} PM`;
  const st: React.CSSProperties = { position: "absolute", left: ox, top: oy, width: iw * k, height: ih * k };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Img src={staticFile(base)} style={{ ...st, filter: "brightness(.62) saturate(.7) contrast(1.05)" }} />
      <Img src={staticFile(frames[i0])} style={{ ...st, opacity: (mode === "loop" ? 0.62 : 0) * (1 - t), mixBlendMode: "screen" }} />
      <Img src={staticFile(frames[i1])} style={{ ...st, opacity: (mode === "loop" ? 0.62 : 0) * t, mixBlendMode: "screen" }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        {tracks.map((tr, i) => {
          const g = mode === "costliest" ? 1 : io(interpolate(tm, [tr.z, tr.z + 9], [0, 1], cl)); if (g <= 0) return null;
          const ax = ox + tr.a[0] * k, ay = oy + tr.a[1] * k, bx = ox + tr.b[0] * k, by = oy + tr.b[1] * k;
          const ex = ax + (bx - ax) * g, ey = ay + (by - ay) * g, w = tr.ef4 ? 7 : 4;
          const pulse = mode === "costliest" && tr.key ? 0.5 + 0.5 * Math.sin(f / 5) : 0;
          const dim = mode === "costliest" && !tr.key ? 0.45 : 1;
          return <g key={i} opacity={dim}>
            <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="rgba(0,0,0,.55)" strokeWidth={w + 6} strokeLinecap="round" />
            {pulse > 0 && <line x1={ax} y1={ay} x2={ex} y2={ey} stroke="#fff" strokeWidth={w + 10 + 8 * pulse} strokeLinecap="round" opacity={0.35} />}
            <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={tr.ef4 ? RED : "#fff"} strokeWidth={w} strokeLinecap="round" />
            <circle cx={ax} cy={ay} r={w} fill="#fff" />
          </g>;
        })}
        {towns.map((tw, i) => <circle key={i} cx={ox + tw.x * k} cy={oy + tw.y * k} r={7} fill="#fff" stroke="#000" strokeOpacity={0.6} strokeWidth={2} />)}
      </svg>
      {towns.map((tw, i) => <RedLabel key={i} text={tw.name} at={0} x={(ox + tw.x * k) / width} y={(oy + tw.y * k + 34) / height} size={26} />)}
      {mode === "loop" && <RedLabel text={clock} at={0} x={0.9} y={0.08} size={34} />}
      {dateLabel && <RedLabel text={dateLabel} at={10} x={0.5} y={0.9} />}
    </AbsoluteFill>
  );
};
