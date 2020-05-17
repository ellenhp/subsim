import React, { Component } from "react";
import { GameConnection, createNewGame, joinGame } from "../game";
import InGame from "./InGame";
import TitleScreen from "./TitleScreen";
import "./App.css";
import { setGameHash, getGameHash } from "../util/url";
import { GameId } from "../commonTypes";

type AppState =
  | {
      status: "titleScreen";
    }
  | {
      status: "joiningGame";
      scenarioId: string;
      vesselId: string;
    }
  | {
      status: "inGame";
      activeGame: GameConnection;
    };

class App extends React.Component<{}> {
  constructor(props: {}) {
    super(props);
    this.state = {
      status: "titleScreen",
    };
    const currentGameId = getGameHash();
    if (currentGameId) {
      this.state = {
        status: "joiningGame",
        scenarioId: currentGameId.scenarioId,
        vesselId: currentGameId.vesselId,
      };
      // Todo, promisify this.
      const game = joinGame(currentGameId);

      this.state = {
        status: "inGame",
        activeGame: game,
      };
    }
  }

  state: AppState;

  joinGame = (id: GameId) => {
    // Todo, promisify this.
    const game = joinGame(id);

    setGameHash({
      scenarioId: game.scenarioId,
      vesselId: game.vesselId,
    });

    this.setState(() => ({
      status: "inGame",
      activeGame: game,
    }));
  };

  createGame = (id: GameId) => {
    // Todo, promisify this.
    const game = createNewGame(id);
    setGameHash({
      scenarioId: game.scenarioId,
      vesselId: game.vesselId,
    });

    this.setState(() => ({
      status: "inGame",
      activeGame: game,
    }));
  };

  render() {
    switch (this.state.status) {
      case "inGame":
        return <InGame game={this.state.activeGame} />;
      case "titleScreen":
        return (
          <TitleScreen createGame={this.createGame} joinGame={this.joinGame} />
        );
      default:
        return <div>Joining...</div>;
    }
  }
}

export default App;
