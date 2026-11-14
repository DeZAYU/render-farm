import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/WP28";
registerRoot(() => <Composition id="WP28" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
