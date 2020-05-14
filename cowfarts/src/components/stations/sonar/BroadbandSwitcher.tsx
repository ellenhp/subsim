import React, { useState } from "react";
import { SonarEngine } from "../../../engines/sonarEngine/sonarEngine";
import BroadbandWaterfall from "./BroadbandWaterfall";
import "./BroadbandSwitcher.css";

type Term = "short" | "medium" | "long";

interface BroadbandSwitcherProps {
  defaultTerm: Term;
  engine: SonarEngine;
}

const BroadbandSwitcher = (props: BroadbandSwitcherProps) => {
  const [term, setTerm] = useState(props.defaultTerm);
  const screen = {
    short: props.engine.waterfalls.broadbandShort,
    medium: props.engine.waterfalls.broadbandMedium,
    long: props.engine.waterfalls.broadbandLong,
  }[term];
  return (
    <div className="broadband-switcher">
      <BroadbandWaterfall screen={screen} key={term} />
      <div className="switcher-radiogroup">
        <label>
          <input
            type="radio"
            checked={term === "short"}
            onClick={() => setTerm("short")}
          />
          Short
        </label>
        <label>
          <input
            type="radio"
            checked={term === "medium"}
            onClick={() => setTerm("medium")}
          />
          Medium
        </label>
        <label>
          <input
            type="radio"
            checked={term === "long"}
            onClick={() => setTerm("long")}
          />
          Long
        </label>
      </div>
    </div>
  );
};

export default BroadbandSwitcher;
