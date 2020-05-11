import React from "react";
import { Game, createNewGame } from "../game";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import { Station, stationMapping } from "./stations";
import StationSwitcher from "./StationSwitcher";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = createNewGame();
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

  render() {
    const CurrentStation = stationMapping[this.state.currentStation];

    return (
      <div>
        <h1>Sub Sub Sub Sub</h1>
        <StationSwitcher
          switchTo={(station) => this.setState({ currentStation: station })}
        />
        {JSON.stringify(this.state.latestUpdate)}
        <CurrentStation game={this.game} />
      </div>
    );
  }
}

export default App;
