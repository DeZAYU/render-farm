import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/AM00";
registerRoot(() => <Composition id="AM00" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
