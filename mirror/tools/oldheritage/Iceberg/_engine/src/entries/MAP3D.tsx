// 3-D map shot (dev/Map3D.tsx, Three.js). Rendered by _tools/render_map3d.sh with --props (dir, shot, frames, font).
import React from "react";
import { Composition, registerRoot } from "remotion";
import { Map3D, Map3DProps } from "../dev/Map3D";
const defaults: Map3DProps = { dir: "map", shot: "M4_track", frames: 171, font: "D-DIN-Bold.otf" };
registerRoot(() => <Composition id="MAP3D" component={Map3D as React.FC<any>} durationInFrames={defaults.frames} fps={30} width={1920} height={1080}
  defaultProps={defaults} calculateMetadata={({ props }) => ({ durationInFrames: Math.max(1, Number((props as Map3DProps).frames) || 1) })} />);
