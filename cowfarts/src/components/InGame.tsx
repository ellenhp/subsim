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

interface InGameState {
  latestUpdate?: VesselUpdate.AsObject;
  currentStation: Station;
  // some small structureless data about what the station should land on
  // when loaded. Means something different
  stationFocusData: {
    [key in Station]: string;
  };
}

class InGame extends React.Component<InGameProps> {
  constructor(props: InGameProps) {
    super(props);
    this.game = props.game;
    this.state = {
      currentStation: Station.HELM,
      stationFocusData: {
        helm: "",
        map: "",
        tma: "",
        sonar: "",
        weapons: "",
      },
    };
    this.game.worldEvents.listen((update) => {
      this.setState({ latestUpdate: update });
    });

    this.sonarEngine = buildSonarEngine(this.game.worldEvents);
    this.mapEngine = new MapEngine("puget");
  }
  state: InGameState;
  game: GameConnection;
  sonarEngine: SonarEngine;
  mapEngine: MapEngine;

  changeStation = (station: Station) => {
    this.setState((state) => ({ ...state, currentStation: station }));
  };

  changeStationFocusData = (station: Station, focusData: string) => {
    this.setState((state: InGameState) => ({
      ...state,
      stationFocusData: {
        ...state.stationFocusData,
        [station]: focusData,
      },
    }));
  };

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
                changeStation={this.changeStation}
                stationFocusData={
                  this.state.stationFocusData[this.state.currentStation]
                }
                setStationFocusData={this.changeStationFocusData}
                latestUpdate={this.state.latestUpdate}
              />
            )
          }
        </div>
        {this.state.latestUpdate && this.state.latestUpdate.isDead && (
          <div className="ded-indicator">Your submarine has been destroyed</div>
        )}
      </div>
    );
  }
}

export default InGame;
