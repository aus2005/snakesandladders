import React, { useState } from "react";
import "./board.css";
import DiceRoll from "./diceroll"; 
import "./helpers";


function Board() {
  const boardSize = 10;
  const totalCells = 100;
  const [playerPosition, setPlayerPosition] = useState(1);
  const [diceValue, setDiceValue] = useState(null);

  const snakesAndLadders = {
    4: 25, 8: 30, 28: 14, 40: 42, 50: 5, 62: 81, 95: 75
  };

  const handleDiceRoll = (roll) => {
    setDiceValue(roll);
    let targetPosition = playerPosition + roll;

    if (targetPosition > totalCells) return;

    // Check for snakes and ladders
    if (snakesAndLadders[targetPosition]) {
      targetPosition = snakesAndLadders[targetPosition];
    }

    // Animate the movement step-by-step
    animateMove(playerPosition, targetPosition);
  };
  const animateMove = (current, target) => {
    let step = 1;

    const interval = setInterval(() => {
      if (current < target) {
        current += step;
        setPlayerPosition(current);
      } else {
        clearInterval(interval);
      }
    }, 600); // Moves every 300ms
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

}

export default Board;
