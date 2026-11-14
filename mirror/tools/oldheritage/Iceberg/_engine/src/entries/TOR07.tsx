import React from "react";
import { Composition, registerRoot } from "remotion";
import { Comp, DUR } from "../cases/TOR07";
registerRoot(() => <Composition id="TOR07" component={Comp} durationInFrames={DUR} fps={30} width={1920} height={1080} />);
