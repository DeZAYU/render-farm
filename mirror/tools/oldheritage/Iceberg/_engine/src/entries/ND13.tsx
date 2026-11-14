import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/ND13";
registerRoot(() => <Composition id="ND13" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
