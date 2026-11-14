// diagram / IgnitionFront: the hanging cloud densifies, the heat source glows and throws heat lines into it, a flame front runs out from the
// source through the cloud, then a tank-burst push flies into the burning core. REF VV §7 tank "hold -> burst -> hold" (Visual Venture @ 10:43.0:
// push x2.98 in 57 f, log bezier (0.326, 0, 0.143, 0.807)), colour = meaning (white/colour powder -> orange flame) + FA evidence E1 (one element
// per noun: "dense" -> dots densify, "heat" -> the lights glow, "go up" -> the front) + Farrell story "the explainer returns"; wp3 sec_A IgnDiagram
// @ abs 2879 + sec_B CausePicto @ abs 3208 (heat lines, front 1.6x, burst ends in the fire's white core).
// Ours: the front speed, the heat source lamp and the burst target are props; the burst can end in a white-core bloom that hides the cut.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, EZ, MBlur, clamp01, lerp, type Cam } from "../../core";
import { Cloud, Crowd, DEMO_SCENE, HeatLines, Operators, PLATE_BG, Structure, lampPoint, makeCloud, makeCrowd, toScreen, worldTf, type Scene } from "./kit";

export type IgnitionFrontProps = {
  scene: Scene;
  denseAt: number; // the cloud contracts + fills
  heatAt: number; // the lamps glow, heat lines run into the cloud
  ignAt: number; // the front leaves the source lamp
  lamp?: number; // index of the source lamp
  frontSpeed?: number; // 1 = A's front (34 f to full), B used 1.6
  burstAt: number;
  burstFrames?: number; // VV 57
  zoom?: number; // burst zoom (VV 2.98; A used 2.2)
  target?: { x: number; y: number }; // world point the burst flies into (default: cloud centre)
  cam0: Cam; // held view (with a slow drift)
  coreAt?: number; // white-core bloom (5 f) to cut on
  operators?: boolean;
};

const World: React.FC<IgnitionFrontProps & { c: Cam }> = (p) => {
  const f = useCurrentFrame();
  const people = React.useMemo(() => makeCrowd(p.scene), [p.scene]);
  const cloud = React.useMemo(() => makeCloud(p.scene), [p.scene]);
  const heat = clamp01((f - p.heatAt) / 8);
  const src = p.scene.stage ? lampPoint(p.scene, p.lamp ?? (p.scene.stage.lamps.length - 1)) : { x: 0, y: 0 };
  const ign = f - p.ignAt;
  const bloom = clamp01((ign * (p.frontSpeed ?? 1) - 20) / 30);
  const L = toScreen(p.c, src.x, src.y);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG, opacity: 0.6 }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(p.c)}>
          <Structure scene={p.scene} heat={heat} />
          <Crowd f={f} scene={p.scene} people={people} uid="if" tint={() => 0.7} opacity={0.5} />
          {p.operators !== false ? <Operators scene={p.scene} /> : null}
          <HeatLines f={f} scene={p.scene} k={f - p.heatAt} />
          <Cloud f={f} scene={p.scene} pts={cloud} uid="if" k={1} dense={EZ.out2((f - p.denseAt) / 20)} ign={ign} src={src} speed={p.frontSpeed ?? 1} />
        </g>
      </svg>
      {heat > 0 ? <AbsoluteFill style={{ background: `radial-gradient(circle at ${L.x.toFixed(0)}px ${L.y.toFixed(0)}px, rgba(255,140,40,${(0.35 * heat).toFixed(3)}) 0, rgba(255,80,20,0) ${(340 * p.c.s / 1.2).toFixed(0)}px)`, mixBlendMode: "screen" }} /> : null}
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 80% 70% at 60% 45%, rgba(255,120,30,${(0.42 * bloom).toFixed(3)}), rgba(220,40,8,${(0.28 * bloom).toFixed(3)}) 60%, rgba(0,0,0,0) 100%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};
const Cammed: React.FC<IgnitionFrontProps> = (p) => {
  const f = useCurrentFrame();
  const C = p.scene.cloud;
  const tg = p.target ?? (C ? { x: C.cx - 30, y: C.cy } : { x: p.cam0.cx, y: p.cam0.cy });
  const bk = EZ.tankBurst(clamp01((f - p.burstAt) / (p.burstFrames ?? 57)));
  const s0 = p.cam0.s * Math.exp(0.012 * (Math.max(0, f) / 30));
  const c: Cam = { cx: lerp(p.cam0.cx, tg.x, bk), cy: lerp(p.cam0.cy, tg.y, bk), s: s0 * Math.exp(Math.log(p.zoom ?? 2.2) * bk) };
  return <World {...p} c={c} />;
};

export const IgnitionFront: React.FC<IgnitionFrontProps> = (p) => {
  const f = useCurrentFrame();
  const fast = f >= p.burstAt + 4 && f < p.burstAt + (p.burstFrames ?? 57) * 0.8;
  return (
    <AbsoluteFill>
      <MBlur on={fast} samples={8}><Cammed {...p} /></MBlur>
      {p.coreAt !== undefined ? <AbsoluteFill style={{ background: "#FFF2B8", opacity: clamp01((f - p.coreAt) / 5) * 0.9 }} /> : null}
    </AbsoluteFill>
  );
};

export const IGNITION_DEMO: IgnitionFrontProps = {
  scene: DEMO_SCENE,
  denseAt: 25, heatAt: 50, ignAt: 78, lamp: 2, frontSpeed: 1.15,
  burstAt: 100, burstFrames: 57, zoom: 2.2,
  target: { x: 1180, y: 470 },
  cam0: { cx: 1000, cy: 440, s: 1.16 },
  coreAt: 148,
};
