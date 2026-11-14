import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/WP06";
registerRoot(() => <Composition id="WP06" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
