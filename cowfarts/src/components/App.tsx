import React from "react";
import { Game, createNewGame } from "../game";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = createNewGame();
    this.state = {};
    this.game.worldEvents.listen((update) => {
      this.setState({ latestUpdate: update });
    });
  }
  state: { latestUpdate?: VesselUpdate.AsObject };
  game: Game;

  render() {
    return (
      <div>
        <h1>Sub Sub Sub Sub</h1>
        {JSON.stringify(this.state.latestUpdate)}
      </div>
    );
  }
}

export default App;
