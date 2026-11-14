// diagram / SpreadPullback: after the event: the crowd runs from the source, their feet kick particles up, and a fire front runs along the floor
// while the camera pulls back to show all of it. REF VV §11 world-plane camera phases (Visual Venture @ 3:28.0: A quick start / long settle, C a
// long pull) + Farrell story "the explainer returns" (#15: the same diagram, the flood spreads over 2-3 s landing on its word); wp3 sec_B
// SpreadDiagram @ abs 3882 (A's front logic moved from the air to the floor; grains behind the front take the flame palette).
// Ours: run distance, kick, fire start/length and the pull-back are props; the air cloud burns out as the floor takes over.
import React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { H, W, EZ, MBlur, camFast, clamp01, type Cam } from "../../core";
import { Cloud, Crowd, DEMO_SCENE, FloorFire, Kicked, Operators, PLATE_BG, Structure, camOf, lampPoint, makeCloud, makeCrowd, makeFloorFire, makeKick, toKeys, worldTf, type CamSpec, type Scene } from "./kit";

export type SpreadPullbackProps = {
  scene: Scene;
  runAt: number; runFrames?: number; runMax?: number; // people flee (units)
  kickAt?: number; kickFrames?: number; cloudsAt?: number; // particles kicked up from the feet (+30 % more on "clouds")
  fireAt: number; fireFrames?: number; // the floor front runs from the pit's near wall to the far wall
  airCloud?: boolean; airFadeFrames?: number; // the burning air cloud from the previous beat, burning out
  cam0: Cam; cam: CamSpec[]; drift?: number;
};
const bzFire = Easing.bezier(0.25, 0, 0.1, 1);

const World: React.FC<SpreadPullbackProps> = (p) => {
  const f = useCurrentFrame();
  const people = React.useMemo(() => makeCrowd(p.scene), [p.scene]);
  const cloud = React.useMemo(() => makeCloud(p.scene), [p.scene]);
  const kickPts = React.useMemo(() => makeKick(), []);
  const fire = React.useMemo(() => makeFloorFire(p.scene), [p.scene]);
  const c = camOf(f, p.cam0, p.cam, p.drift ?? 0.008);
  const run = EZ.out3((f - p.runAt + 2) / (p.runFrames ?? 70));
  const kick = p.kickAt === undefined ? 0 : (clamp01((f - p.kickAt) / (p.kickFrames ?? 60)) * (1 + 0.3 * clamp01((f - (p.cloudsAt ?? 1e9)) / 20))) / 1.3;
  const P = p.scene.pit ?? { x0: p.scene.crowd?.x0 ?? 0, x1: p.scene.crowd?.x1 ?? W };
  const floorX = P.x0 + 30 + 120 * clamp01(f / 30) + (P.x1 - P.x0 - 160) * bzFire(clamp01((f - p.fireAt + 2) / (p.fireFrames ?? 62)));
  const airFade = 1 - 0.85 * clamp01(f / (p.airFadeFrames ?? 40));
  const src = p.scene.stage ? lampPoint(p.scene, p.scene.stage.lamps.length - 1) : { x: 0, y: 0 };
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          <Structure scene={p.scene} heat={1} />
          <Crowd f={f} scene={p.scene} people={people} uid="sp" tint={() => 1} run={run} runMax={p.runMax ?? 300} burntBefore={floorX} />
          <Kicked f={f} scene={p.scene} people={people} pts={kickPts} k={kick} run={run} front={floorX} />
          <FloorFire f={f} scene={p.scene} pts={fire} uid="sp" x1={floorX} />
          <Operators scene={p.scene} />
          {p.airCloud !== false ? <Cloud f={f} scene={p.scene} pts={cloud} uid="sp" k={1} dense={1} ign={200} src={src} fade={airFade} /> : null}
        </g>
      </svg>
      <AbsoluteFill style={{ background: `radial-gradient(ellipse 70% 40% at 50% 75%, rgba(255,110,30,${(0.22 * clamp01((f - p.fireAt) / 30)).toFixed(3)}), rgba(0,0,0,0) 100%)`, mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
};

export const SpreadPullback: React.FC<SpreadPullbackProps> = (p) => {
  const f = useCurrentFrame();
  const fast = camFast(f, toKeys(p.cam), 0.05, 0.45) || (f >= p.fireAt && f < p.fireAt + 24);
  return <AbsoluteFill><MBlur on={fast}><World {...p} /></MBlur></AbsoluteFill>;
};

export const SPREAD_DEMO: SpreadPullbackProps = {
  scene: DEMO_SCENE,
  runAt: 10, runFrames: 70, runMax: 300,
  kickAt: 40, kickFrames: 60, cloudsAt: 90,
  fireAt: 104, fireFrames: 62,
  cam0: { cx: 960, cy: 600, s: 1.7 },
  cam: [
    { at: 0, d: 46, cx: 1080, cy: 700, s: 1.42, ease: "quick" },
    { at: 98, d: 56, cx: 1040, cy: 600, s: 1.02, ease: "settle" },
  ],
};
