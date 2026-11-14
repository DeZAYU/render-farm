import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/IN24";
registerRoot(() => <Composition id="IN24" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
