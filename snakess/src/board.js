import React, { useState } from "react";
import "./board.css";
import DiceRoll from "./diceroll"; 

const Board = () => {
  const boardSize = 10;
  const totalCells = 100;
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(null);

  const snakesAndLadders = {
    4: 25, 8: 30, 28: 14, 40: 42, 50: 5, 62: 81, 95: 75
  };

  const handleDiceRoll = (roll) => {
    setDiceValue(roll);
    let newPosition = playerPosition + roll;
    if (newPosition > totalCells) return;
    if (snakesAndLadders[newPosition]) {
      newPosition = snakesAndLadders[newPosition];
    }
    setPlayerPosition(newPosition);
  };

  return (
    <div className="game-container">
      <div className="board">
        {Array.from({ length: totalCells }, (_, i) => {
          const number = totalCells - i;
          return (
            <div key={number} className={`cell ${(Math.floor(i / boardSize) + i) % 2 === 0 ? "red" : "white"}`}>
              {number}
              {playerPosition === number && <div className="player">🔴</div>}
            </div>
          );
        })}
      </div>
      <DiceRoll onRoll={handleDiceRoll} /> 
      <p>Dice Roll: {diceValue}</p>
    </div>
  );
};

export default Board;
