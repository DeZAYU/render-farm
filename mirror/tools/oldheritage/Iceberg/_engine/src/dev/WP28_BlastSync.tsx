// WP28 device: BlastSync — the two cameras that caught the Shahid Rajaee blast, side by side and synced on the moment: the yard
// CCTV (people on the apron, flames behind the portacabins; the feed whites out and dies) and the wide port camera (the plume, the
// fireball, the wave of dust). The shot opens on the yard camera full frame; a white seam splits the picture and the second angle
// slides in from the right so both fireballs land on the same frame. Silent under the VO line about the blast wave.
import React from "react";
import { AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./WP01_kit";

export const BlastSync: React.FC<{
  a: string; aFrom: number; aX?: number;    // left camera: source second at the shot start, horizontal focus 0-1 of its frame
  b: string; bFrom: number; bX?: number;    // right camera
  n: number; open?: number;                 // frame at which the split opens
}> = ({ a, aFrom, aX = 0.3, b, bFrom, bX = 0.6, n, open = 18 }) => {
  const f = useCurrentFrame();
  const k = io(interpolate(f, [open, open + 22], [0, 1], cl));
  const s = 1.0 + 0.06 * io(Math.min(1, f / n));
  const half = 960 + 960 * (1 - k);           // the left panel narrows from full frame to half
  const pan = (src: string, from: number, x: number, w: number) => (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <OffthreadVideo src={staticFile(src)} startFrom={Math.round(from * 30)} muted
        style={{ position: "absolute", top: 0, height: 1080, width: 1920, left: (w - 1920) * x,
          transform: `scale3d(${s},${s},1)`, transformOrigin: `${x * 100}% 50%` }} />
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: half, height: 1080, overflow: "hidden" }}>{pan(a, aFrom, aX, half)}</div>
      {k > 0 && <div style={{ position: "absolute", left: half, top: 0, width: 1920 - half, height: 1080, overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 960, height: 1080, overflow: "hidden" }}>{pan(b, bFrom, bX, 960)}</div>
      </div>}
      {k > 0 && <div style={{ position: "absolute", left: half - 3, top: 0, width: 6, height: 1080 * Math.min(1, k * 1.4), background: "#fff", boxShadow: "0 0 18px rgba(0,0,0,.6)" }} />}
    </AbsoluteFill>
  );
};
