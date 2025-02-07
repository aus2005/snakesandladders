import React from "react";
import DiceRoll from "./diceroll";
import Chessboard from "./board";

function App() {
  return (
    <div className="App">
      <h1 className="text-3xl font-bold text-center my-4">
        Chessboard with Dice
      </h1>
      <Chessboard />
      <DiceRoll />
    </div>
  );
}

export default App;
