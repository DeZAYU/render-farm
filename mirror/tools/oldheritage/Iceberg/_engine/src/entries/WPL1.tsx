import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/WPL1";
registerRoot(() => <Composition id="WPL1" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
