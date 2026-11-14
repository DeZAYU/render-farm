// diagram / EmitterSpray: operators pop on their noun, plumes of particles leave the nozzles, the camera follows the plume over the crowd and the
// crowd takes the particle colours; a HUD callout names the equipment. REF Farrell story "the diagram returns" (#15 / #33: the explainer from #3
// returns and changes on the words) + VV §11 phase C push (@ 3:28.0 "Then he suddenly descended", bezier ~(0.3,0,0,1)) + D1 E4 HUD bracket
// callout (Dashcam Vol.1 @ 1:07.9 "[2004 Subaru Forester XT]": red polyline first, then the box, then the words); wp3 sec_A CannonDiagram @ abs 2166.
// Ours: the tint front travels with the plume (people turn colour as it reaches them), the cloud builds from the plume; motion blur on both moves.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, HudBox, MBlur, camFast, clamp01, type Cam } from "../../core";
import { Cloud, Crowd, DEMO_SCENE, Operators, PLATE_BG, Plume, Structure, camOf, cylinderPoint, makeCloud, makeCrowd, makePlume, nozzle, toKeys, toScreen, worldTf, type CamSpec, type Scene } from "./kit";

export type EmitterSprayProps = {
  labelCap?: number; // HUD callout cap (M-024 >= 28, default 34)
  scene: Scene;
  operatorsAt: number; // operators pop
  sprayAt: number; // plumes start
  cylinderAt?: number; // cylinders appear (+ HUD)
  hud?: { text: string; at: number; emitter?: number; dx?: number; dy?: number };
  plumeLife?: number; // frames a particle lives
  tintSpeed?: number; // world units per frame the tint front travels from the nozzle
  cloudFrom?: number; // frames after sprayAt the cloud starts building
  cam0: Cam;
  cam: CamSpec[];
};

const World: React.FC<EmitterSprayProps> = (p) => {
  const f = useCurrentFrame();
  const people = React.useMemo(() => makeCrowd(p.scene), [p.scene]);
  const plume = React.useMemo(() => makePlume(p.scene), [p.scene]);
  const cloud = React.useMemo(() => makeCloud(p.scene), [p.scene]);
  const c = camOf(f, p.cam0, p.cam);
  const sk = f - p.sprayAt;
  const n0 = p.scene.stage?.x1 ?? nozzle(p.scene, 0).x; // the tint front starts at the stage edge
  const ts = p.tintSpeed ?? 26;
  const tint = (x: number) => clamp01((sk - (x - n0) / ts) / 14) * 0.85;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          <Structure scene={p.scene} />
          <Crowd f={f} scene={p.scene} people={people} uid="es" tint={tint} />
          <Operators scene={p.scene} k={f - p.operatorsAt} spray={sk} co2={f - (p.cylinderAt ?? p.hud?.at ?? 1e9)} />
          <Plume scene={p.scene} pts={plume} k={sk} life={p.plumeLife ?? 60} />
          <Cloud f={f} scene={p.scene} pts={cloud} uid="es" k={clamp01((sk - (p.cloudFrom ?? 24)) / 90)} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const EmitterSpray: React.FC<EmitterSprayProps> = (p) => {
  const f = useCurrentFrame();
  const fast = camFast(f, toKeys(p.cam), 0.05, 0.5);
  const c = camOf(f, p.cam0, p.cam);
  const h = p.hud;
  const cp = h ? cylinderPoint(p.scene, h.emitter ?? (p.scene.emitters?.length ?? 1) - 1) : null;
  const sp = cp ? toScreen(c, cp.x, cp.y) : null;
  return (
    <AbsoluteFill>
      <MBlur on={fast}><World {...p} /></MBlur>
      {h && sp ? <HudBox k={f - h.at} p={sp} elbow={{ x: sp.x + (h.dx ?? 210), y: sp.y + (h.dy ?? -262) }} text={h.text} cap={p.labelCap ?? 34} /> : null}
    </AbsoluteFill>
  );
};

export const SPRAY_DEMO: EmitterSprayProps = {
  scene: DEMO_SCENE,
  operatorsAt: 7, sprayAt: 40, cylinderAt: 116,
  hud: { text: "CO₂ cylinder", at: 116, dx: 210, dy: -262 },
  cam0: { cx: 1010, cy: 560, s: 1.12 },
  cam: [
    { at: 0, d: 42, cx: 400, cy: 470, s: 1.7, ease: "settle" },
    { at: 44, d: 60, cx: 990, cy: 530, s: 1.1, ease: "quick" },
  ],
};
