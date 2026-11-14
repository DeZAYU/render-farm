import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TP19";
registerRoot(() => <Composition id="TP19" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
