import React from "react";
import { Game, createNewGame } from "../game";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import { Station, stationMapping } from "./stations";
import StationSwitcher from "./StationSwitcher";
import "./inGame.css";

interface InGameProps {
  game: Game;
}

class InGame extends React.Component<InGameProps> {
  constructor(props) {
    super(props);
    this.game = props.game;
    this.state = {
      currentStation: Station.HELM,
    };
    this.game.worldEvents.listen((update) => {
      this.setState({ latestUpdate: update });
    });

  }
  state: {
    latestUpdate?: VesselUpdate.AsObject;
    currentStation: Station;
  };
  game: Game;
  sonarEngine

  render() {
    const CurrentStation = stationMapping[this.state.currentStation];

    return (
      <div className="in-game">
        <div className="switcher-wrapper">
          <StationSwitcher
            currentStation={this.state.currentStation}
            switchTo={(station) => this.setState({ currentStation: station })}
          />
        </div>
        <div className="station-wrapper">
          <CurrentStation game={this.game} />
          {JSON.stringify(this.state.latestUpdate)}
        </div>
      </div>
    );
  }
}

export default InGame;
