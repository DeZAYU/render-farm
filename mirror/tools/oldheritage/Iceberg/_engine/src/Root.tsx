import React from "react";
import { Composition } from "remotion";
import { TorC01v5, TOR_C01V5_DUR } from "./TorC01v5";
import { TorC02, TOR_C02_DUR } from "./TorC02";

export const Root: React.FC = () => (
  <>
    <Composition id="TOR-C01-V5" component={TorC01v5} durationInFrames={TOR_C01V5_DUR} fps={30} width={1920} height={1080} />
    <Composition id="TOR-C02" component={TorC02} durationInFrames={TOR_C02_DUR} fps={30} width={1920} height={1080} />
  </>
);
