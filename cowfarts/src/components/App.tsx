import React, { useState } from "react";
import { GameConnection, createNewGame } from "../game";
import InGame from "./InGame";
import TitleScreen from "./TitleScreen";
import "./App.css";

type AppState =
  | {
      status: "titleScreen";
    }
  | {
      status: "joiningGame";
      scenarioId: string;
      vesselId: "user";
    }
  | {
      status: "inGame";
      activeGame: GameConnection;
    };

const App = () => {
  const [appState, setAppState] = useState<AppState>({
    status: "titleScreen",
  });

  const createGame = () => {
    // Todo, promisify this.
    const game = createNewGame();
    setAppState({
      status: "inGame",
      activeGame: game,
    });
  };

  switch (appState.status) {
    case "inGame":
      return <InGame game={appState.activeGame} />;
    case "titleScreen":
      return <TitleScreen createGame={createGame} />;
    default:
      return <div>Joining...</div>;
  }
};

export default App;
