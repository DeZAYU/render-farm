// diagram / BuildOnWords: the cross-section is built element by element on its nouns. REF Farrell story #3 (Grindr-era explainer, "a strip of
// stone between two channels": one diagram built on the words, elements pop/fade 0.2-0.3 s each, it returns later) + FA evidence E1 (IG @ 2:47.5:
// white glyphs with a 20-30 px glow, one element per noun) + VV §11 infographic in world space (@ 3:28.0: quick-start / long-settle camera
// phases, labels never animate after arrival) + D1 E4 HUD callout (@ 1:07.9) + D3 E5 stat (@ 1:47.87); wp3 sec_A PoolDiagram @ abs 1827.
// Ours: the pit outline draws as one stroke, the camera pull-back reveals the stage on its noun, the crowd fills in seeded order and the number
// rolls up while the red word rises on its own word.
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { H, W, HudBox, MBlur, camFast, clamp01, type Cam } from "../../core";
import { Crowd, DEMO_SCENE, DiagramStat, PLATE_BG, Structure, camOf, makeCrowd, toKeys, toScreen, worldTf, type CamSpec, type Scene } from "./kit";

export type BuildOnWordsProps = {
  labelCap?: number; // HUD callout cap (M-024 >= 28, default 34)
  scene: Scene;
  at: { ground?: number; pit: number; pitFrames?: number; stage: number; crowd: number; crowdFrames?: number }; // local frames on the nouns
  hud?: { text: string; at: number; until?: number; x: number; y: number; dx?: number; dy?: number }; // world anchor point
  stat?: { value: number; prefix?: string; word: string; at: number; wordAt: number; y?: number };
  cam0: Cam;
  cam: CamSpec[];
  drift?: number; // life push per second
};

const World: React.FC<BuildOnWordsProps> = (p) => {
  const f = useCurrentFrame();
  const people = React.useMemo(() => makeCrowd(p.scene), [p.scene]);
  const c = camOf(f, p.cam0, p.cam, p.drift ?? 0.009);
  const a = p.at;
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <AbsoluteFill style={{ background: PLATE_BG }} />
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g transform={worldTf(c)}>
          <Structure scene={p.scene} ground={clamp01((f - (a.ground ?? 0) + 1) / 3)} pit={clamp01((f - a.pit) / (a.pitFrames ?? 20))} stage={clamp01((f - a.stage) / 6)} />
          <Crowd f={f} scene={p.scene} people={people} uid="bow" fill={clamp01((f - a.crowd) / (a.crowdFrames ?? 40))} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

export const BuildOnWords: React.FC<BuildOnWordsProps> = (p) => {
  const f = useCurrentFrame();
  const fast = camFast(f, toKeys(p.cam), 0.04, 0.6);
  const c = camOf(f, p.cam0, p.cam, p.drift ?? 0.009);
  const h = p.hud;
  const hp = h ? toScreen(c, h.x, h.y) : null;
  return (
    <AbsoluteFill>
      <MBlur on={fast}><World {...p} /></MBlur>
      {h && hp && (h.until === undefined || f < h.until) ? <HudBox k={f - h.at} p={hp} elbow={{ x: hp.x + (h.dx ?? 100), y: hp.y + (h.dy ?? -190) }} text={h.text} cap={p.labelCap ?? 34} /> : null}
      {p.stat ? <DiagramStat f={f} {...p.stat} /> : null}
    </AbsoluteFill>
  );
};

export const BUILD_DEMO: BuildOnWordsProps = {
  scene: DEMO_SCENE,
  at: { ground: 0, pit: 2, pitFrames: 20, stage: 72, crowd: 106, crowdFrames: 40 },
  hud: { text: "drained pool", at: 34, until: 106, x: 1380, y: 790, dx: 100, dy: -190 },
  stat: { value: 1000, prefix: "~", word: "people", at: 106, wordAt: 122, y: 120 },
  cam0: { cx: 1220, cy: 700, s: 1.42 },
  cam: [{ at: 58, d: 56, cx: 1010, cy: 560, s: 1.12, ease: "quick" }],
  drift: 0.009,
};
