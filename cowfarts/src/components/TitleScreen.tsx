import React, { useState } from "react";
import "./TitleScreen.css";
import { latLongToMapTL } from "./map/helpers";
import { GameId } from "../commonTypes";

type GameStartFn = (id: GameId) => void;

interface TitleScreenProps {
  createGame: GameStartFn;
  joinGame: GameStartFn;
}

type TitleScreenState =
  | undefined
  | {
      type: "joinGame";
      gameId: string;
    }
  | {
      type: "createGame";
      gameId: string;
    };

const getRandomLetter = (str: string) =>
  str[Math.floor(str.length * Math.random())];
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const gameIdLength = 4;

const TitleScreen = ({ createGame, joinGame }: TitleScreenProps) => {
  const [state, setState] = useState<TitleScreenState>();
  let articleInnards;
  if (!state) {
    const handleCreateGameClick = () => {
      let gameId = "";
      for (let i = 0; i < gameIdLength; i++) {
        gameId += getRandomLetter(alphabet);
      }
      setState({
        type: "createGame",
        gameId,
      });
    };

    const handleJoinGameClick = () => {
      setState({
        type: "joinGame",
        gameId: "",
      });
    };

    articleInnards = (
      <>
        <button onClick={handleCreateGameClick}>Start a new game!</button>
        <button onClick={handleJoinGameClick}>Join a game!</button>
      </>
    );
  } else if (state.type === "createGame") {
    const createHandler = (team: string) => () => {
      createGame({
        scenarioId: state.gameId,
        vesselId: team,
      });
    };
    articleInnards = (
      <>
        <h3>Creating a game...</h3>
        <div>Your game code will be: {state.gameId}</div>
        <button onClick={createHandler("rebels")}>Join as Cascadia</button>
        <button onClick={createHandler("blockaders")}>
          Join as Blockaders
        </button>
      </>
    );
  } else {
    const joinHandler = (team: string) => () => {
      if (state.gameId.length !== gameIdLength) {
        alert("Please enter a game ");
        return;
      }
      joinGame({
        scenarioId: state.gameId,
        vesselId: team,
      });
    };

    const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
      setState({
        type: "joinGame",
        gameId: e.target.value
          .toUpperCase()
          .replace(/[^A-Z]/, "")
          .slice(0, 4),
      });
    articleInnards = (
      <>
        <h3>Joining a game...</h3>
        <label>
          Enter your game code:
          <input type="text" onChange={onTextChange}></input>
          <button onClick={joinHandler("rebels")}>Join as Cascadia</button>
          <button onClick={joinHandler("blockaders")}>
            Join as Blockaders
          </button>
        </label>
      </>
    );
  }

  return (
    <div className="title-screen">
      <header className="card">
        <h1>SUB SUB SUB SUB</h1>
        <h2>The world's most expensive to run Submarine Simulator</h2>
      </header>
      <article className="card">{articleInnards}</article>
    </div>
  );
};

export default TitleScreen;
