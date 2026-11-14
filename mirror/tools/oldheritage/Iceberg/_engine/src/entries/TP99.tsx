import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TP99";
registerRoot(() => <Composition id="TP99" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
