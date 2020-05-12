import React from "react";
import { StationComponent } from "..";
import PropulsionControl from "./PropulsionControl";
import SteeringControl from "./SteeringControl";

const Helm: StationComponent = ({ game, latestUpdate }) => {
  return (
    <div>
      <h1>Helm</h1>
      <PropulsionControl game={game} latestUpdate={latestUpdate} />
      <SteeringControl game={game} latestUpdate={latestUpdate} />
    </div>
  );
};

export default Helm;
