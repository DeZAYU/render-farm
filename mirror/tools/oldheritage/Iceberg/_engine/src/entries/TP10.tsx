import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TP10";
registerRoot(() => <Composition id="TP10" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
