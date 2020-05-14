import React, { useState } from "react";
import { StationComponent } from "..";
//import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";
import BroadbandWaterfall from "./waterfalls/Broadband";

type WaterfallTypes = "short" | "medium" | "long";

const Sonar: StationComponent = ({ engines: { sonarEngine } }) => {
  return (
    <h1>
      Sonar
      <BroadbandWaterfall
        source={sonarEngine.broadbandSource}
        displaySettings={{
          multiplier: 4,
          contrast: 1,
          gain: 0.08,
        }}
      />
    </h1>
  );
};

export default Sonar;
