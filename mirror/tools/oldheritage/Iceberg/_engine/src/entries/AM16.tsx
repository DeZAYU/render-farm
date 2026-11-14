import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/AM16";
registerRoot(() => <Composition id="AM16" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
