import React from "react";
import { Game, createNewGame, requestSpeed } from "../game";
import { VesselUpdate } from "../__protogen__/mass/api/updates_pb";
import { SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } from "constants";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.game = createNewGame();
    this.state = {
      requestedSpeed: 0,
    };
    this.game.worldEvents.listen((update) => {
      this.setState({ latestUpdate: update });
    });
  }
  state: {
    requestedSpeed: number;
    latestUpdate?: VesselUpdate.AsObject;
  };
  game: Game;

  render() {
    const modSpeed = (num: number) => () => {
      this.setState(
        {
          requestedSpeed: this.state.requestedSpeed + num,
        },
        () => {
          requestSpeed(this.game, this.state.requestedSpeed);
        }
      );
    };

    return (
      <div>
        <h1>Sub Sub Sub Sub</h1>
        {JSON.stringify(this.state.latestUpdate)}
        <button onClick={modSpeed(1)}>Faster!</button>
        <button onClick={modSpeed(1)}>Slower!</button>
      </div>
    );
  }
}

export default App;
