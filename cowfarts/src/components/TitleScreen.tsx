import React from "react";

interface TitleScreenProps {
  createGame: () => void;
}

const TitleScreen = ({ createGame }) => (
  <>
    <h1>SUB SUB SUB SUB</h1>
    <h2>The world's most expensive to run Submarine Simulator</h2>
    <hr />
    <button onClick={createGame}>Start a new game!</button>
  </>
);

export default TitleScreen;
