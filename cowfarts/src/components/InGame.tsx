import React from "react";
import { GameConnection, createNewGame } from "../game";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import { Station, stationMapping } from "./stations";
import StationSwitcher from "./StationSwitcher";
import BroadbandSource from "../engines/sonarEngine/BroadbandSource";
import "./inGame.css";
import {
  buildSonarEngine,
  SonarEngine,
} from "../engines/sonarEngine/sonarEngine";
import MapEngine from "../engines/mapEngine/mapEngine";

interface InGameProps {
  game: GameConnection;
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

    this.sonarEngine = buildSonarEngine(this.game.worldEvents);
    this.mapEngine = new MapEngine("puget");
  }
  state: {
    latestUpdate?: VesselUpdate.AsObject;
    currentStation: Station;
  };
  game: GameConnection;
  sonarEngine: SonarEngine;
  mapEngine: MapEngine;

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
          {
            /* LOOOL */ this.state.latestUpdate && (
              <CurrentStation
                game={this.game}
                engines={{
                  sonarEngine: this.sonarEngine,
                  mapEngine: this.mapEngine,
                }}
                latestUpdate={this.state.latestUpdate}
              />
            )
          }
          {JSON.stringify(this.state.latestUpdate)}
        </div>
      </div>
    );
  }
}

export default InGame;
