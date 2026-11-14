import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/IN23";
registerRoot(() => <Composition id="IN23" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
