// DC09 PanelSplit: the leaked escort video is one vertical strip of three company cameras. PanelHold rebuilds that strip from the
// three graded panels, frozen on the frame the main raw starts from, and the camera visits each panel as the VO names it (cab, road
// ahead, third camera), the other two dimmed; on "watch for a dark car..." the strip comes apart and the panels glide into a
// three-camera layout (cab large on the left, the two outward cameras stacked on the right) over a soft copy of the cab.
// PanelLive is that same layout running live: the main raw plays in it, all three angles in sync, footage kept big.
import React from "react";
import { AbsoluteFill, Freeze, OffthreadVideo, interpolate, staticFile, useCurrentFrame } from "remotion";
import { cl, io } from "./DC08_kit";

type R = [number, number, number, number];   // x, y, w, h
const STRIP: R[] = [[656, -3, 608, 342], [656, 369, 608, 342], [656, 741, 608, 342]];
const TRI: R[] = [[24, 189, 1248, 702], [1284, 189, 612, 344], [1284, 547, 612, 344]];
const lerp = (a: R, b: R, u: number): R => a.map((v, i) => v + (b[i] - v) * u) as R;

const Panel: React.FC<{ src: string; t: number; live: boolean; r: R; dim: number; frame: number }> = ({ src, t, live, r, dim, frame }) => {
  const st: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", filter: `brightness(${1 - dim})` };
  return (
    <div style={{ position: "absolute", left: r[0], top: r[1], width: r[2], height: r[3], overflow: "hidden", background: "#000",
      outline: frame > 0 ? `${4 * frame}px solid rgba(242,242,240,${frame})` : undefined, boxShadow: "0 20px 50px rgba(0,0,0,.55)" }}>
      {live ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} />
        : <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>}
    </div>
  );
};

const Bg: React.FC<{ src: string; t: number; live: boolean; o: number }> = ({ src, t, live, o }) => {
  const st: React.CSSProperties = { position: "absolute", inset: -60, width: 2040, height: 1200, objectFit: "cover", filter: "blur(22px) brightness(.5) saturate(.8)", opacity: o };
  return live ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} />
    : <Freeze frame={0}><OffthreadVideo src={staticFile(src)} startFrom={Math.round(t * 30)} muted style={st} /></Freeze>;
};

/** frozen strip, panel tour, split into the layout. visits = frames at which the camera arrives on panel 0, 1, 2; split = frame the split starts */
export const PanelHold: React.FC<{ srcs: [string, string, string]; t: number; visits: [number, number, number]; split: number }> = ({ srcs, t, visits, split }) => {
  const f = useCurrentFrame();
  const enter = io(interpolate(f, [0, 20], [0, 1], cl));
  // which panel the camera is on (fractional) and how far in
  const z0 = io(interpolate(f, [visits[0] - 18, visits[0] + 6], [0, 1], cl)) * (1 - io(interpolate(f, [split - 6, split + 30], [0, 1], cl)));
  const p = interpolate(f, [visits[0], visits[1] - 16, visits[1] + 4, visits[2] - 16, visits[2] + 4], [0, 0, 1, 1, 2], cl);
  const pe = Math.floor(p) + io(p - Math.floor(p));
  const u = io(interpolate(f, [split, split + 40], [0, 1], cl));
  const rects = STRIP.map((r, i) => lerp(r, TRI[i], u));
  // camera: scale toward the current panel's centre in the strip
  const Z = 1 + 0.78 * z0, cy = 171 + 372 * pe;
  const tx = 960 - 960, ty = (540 - cy) * (z0 > 0 ? 1 : 0);
  const dimOf = (i: number) => 0.62 * z0 * Math.min(1, Math.abs(pe - i));
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Bg src={srcs[0]} t={t} live={false} o={0.35 + 0.65 * u} />
      <AbsoluteFill style={{ transform: `scale(${Z}) translate(${tx}px, ${ty * z0}px)`, transformOrigin: "50% 50%", opacity: enter }}>
        {rects.map((r, i) => <Panel key={i} src={srcs[i]} t={t} live={false} r={r} dim={dimOf(i)} frame={u} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** the three angles live, in sync, in the split layout */
export const PanelLive: React.FC<{ srcs: [string, string, string]; from: number }> = ({ srcs, from }) => (
  <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
    <Bg src={srcs[0]} t={from} live o={1} />
    {TRI.map((r, i) => <Panel key={i} src={srcs[i]} t={from} live r={r} dim={0} frame={1} />)}
  </AbsoluteFill>
);
