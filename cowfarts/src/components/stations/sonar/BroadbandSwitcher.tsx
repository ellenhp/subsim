import React, { useState } from "react";
import { SonarEngine } from "../../../engines/sonarEngine/sonarEngine";
import BroadbandWaterfall from "./BroadbandWaterfall";
import "./BroadbandSwitcher.css";
import { GameConnection } from "../../../game";
import { VesselUpdate } from "../../../__protogen__/mass/api/updates_pb";

type Term = "short" | "medium" | "long";

interface BroadbandSwitcherProps {
  game: GameConnection;
  defaultTerm: Term;
  engine: SonarEngine;
  selectedContacts: string[];
  latestUpdate: VesselUpdate.AsObject;
}

// Should be renamed BroadbandBay
const BroadbandSwitcher = (props: BroadbandSwitcherProps) => {
  const currentContact: string | undefined =
    props.selectedContacts.length === 1 ? props.selectedContacts[0] : undefined;
  const [term, setTerm] = useState(props.defaultTerm);
  const screen = {
    short: props.engine.waterfalls.broadbandShort,
    medium: props.engine.waterfalls.broadbandMedium,
    long: props.engine.waterfalls.broadbandLong,
  }[term];
  return (
    <div className="broadband-switcher">
      <BroadbandWaterfall
        screen={screen}
        contact={currentContact}
        game={props.game}
        latestUpdate={props.latestUpdate}
        key={term}
      />
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
