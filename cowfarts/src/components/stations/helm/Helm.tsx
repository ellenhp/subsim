import React from "react";
import { StationComponent } from "..";
import PropulsionControl from "./PropulsionControl";

const Helm: StationComponent = ({ game, latestUpdate }) => {
  return (
    <div>
      <h1>Helm</h1>
      <PropulsionControl game={game} latestUpdate={latestUpdate} />
    </div>
  );
};

export default Helm;
