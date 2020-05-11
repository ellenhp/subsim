import React from "react";
import { StationComponent } from "..";
import PropulsionControl from "./PropulsionControl";

const Helm: StationComponent = ({ game }) => {
  return (
    <div>
      <h1>Helm</h1>
      <PropulsionControl game={game} />
    </div>
  );
};

export default Helm;
