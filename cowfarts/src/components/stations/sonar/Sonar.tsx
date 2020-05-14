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
    <>
      <h1>Sonar</h1>
      <div className="waterfall-wrapper">
        <BroadbandWaterfall screen={broadbandShort} />
        <BroadbandWaterfall screen={broadbandMedium} />
        <BroadbandWaterfall screen={broadbandLong} />
      </div>
    </>
  );
};

export default Sonar;
