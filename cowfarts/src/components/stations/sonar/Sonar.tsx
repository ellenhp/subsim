import React, { useState } from "react";
import { StationComponent, StationProps } from "..";
//import Waterfall from "./ElemSingletonMount";
import "./Sonar.css";
import BroadbandWaterfall from "./BroadbandWaterfall";

type WaterfallTypes = "short" | "medium" | "long";

const Sonar: StationComponent = (props: StationProps) => {
  const {
    broadbandShort,
    broadbandMedium,
    broadbandLong,
  } = props.engines.sonarEngine.waterfalls;

  return (
    <h1>
      Sonar
      <div className="waterfall-wrapper">
        <BroadbandWaterfall imagePipe={broadbandShort} />
        <BroadbandWaterfall imagePipe={broadbandMedium} />
        <BroadbandWaterfall imagePipe={broadbandLong} />
      </div>
    </h1>
  );
};

export default Sonar;
