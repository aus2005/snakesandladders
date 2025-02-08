import React, { useState } from "react";
import "./board.css";
import DiceRoll from "./diceroll";
import { animateMove } from "./helpers";

function Board() {
  const boardSize = 10;
  const totalCells = 100;
  const [player1Position, setPlayer1Position] = useState(1);
  const [player2Position, setPlayer2Position] = useState(1);
  const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
  const [diceValue, setDiceValue] = useState(null);
  const [showDiceResult, setShowDiceResult] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [winner, setWinner] = useState(null);
  const [defeatedPlayer, setDefeatedPlayer] = useState(null);

  const snakesAndLadders = {
    4: 25, 8: 30, 28: 14, 40: 42, 50: 5, 62: 81, 95: 75
  };

  const handleDiceRoll = async (roll) => {
    if (isMoving || winner || defeatedPlayer) return;

    setDiceValue(roll);
    setShowDiceResult(true);
    setIsMoving(true);

    const currentPosition = isPlayerOneTurn ? player1Position : player2Position;
    const setPosition = isPlayerOneTurn ? setPlayer1Position : setPlayer2Position;

    let targetPosition = currentPosition + roll;

    if (targetPosition > totalCells) {
      // If the roll goes beyond the total cells, stop the turn and skip to the next player
      setIsMoving(false);
      setShowDiceResult(false);
      finishTurn();  // End the turn immediately
      return;
    }

    // Move piece according to dice roll
    try {
      if (snakesAndLadders[targetPosition]) {
        const newTarget = snakesAndLadders[targetPosition];
        setPosition(newTarget); // Move directly to the snake/ladder destination
        targetPosition = newTarget; // Update the target position
      } else {
        await animateMove(currentPosition, targetPosition, setPosition);
      }

      // Check win condition
      if (targetPosition === totalCells) {
        setWinner(isPlayerOneTurn ? "Player 1 (🔴)" : "Player 2 (🔵)");
        setIsMoving(false);
        return;
      }

      // Check collision
      if (isPlayerOneTurn && targetPosition === player2Position) {
        setDefeatedPlayer("Player 2 (🔵)");
        setTimeout(() => {
          setPlayer2Position(1);
          setDefeatedPlayer(null);
          finishTurn();
        }, 2000);
      } else if (!isPlayerOneTurn && targetPosition === player1Position) {
        setDefeatedPlayer("Player 1 (🔴)");
        setTimeout(() => {
          setPlayer1Position(1);
          setDefeatedPlayer(null);
          finishTurn();
        }, 2000);
      } else {
        finishTurn();
      }
    } catch (error) {
      console.error("Movement error:", error);
      setIsMoving(false);
    }
  };

  const finishTurn = () => {
    setIsMoving(false);
    setShowDiceResult(false);
    setIsPlayerOneTurn(!isPlayerOneTurn);  // Switch to the next player's turn
  };

  return (
    <div className="game-container">
      <div className="board">
        {Array.from({ length: totalCells }, (_, i) => {
          const number = totalCells - i;
          return (
            <div key={number} className={`cell ${(Math.floor(i / boardSize) + i) % 2 === 0 ? "red" : "white"}`}>
              {number}
              {player1Position === number && (
                <div className={`player player1 ${defeatedPlayer === "Player 1 (🔴)" ? "shake" : ""}`}>
                  🔴
                </div>
              )}
              {player2Position === number && (
                <div className={`player player2 ${defeatedPlayer === "Player 2 (🔵)" ? "shake" : ""}`}>
                  🔵
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!winner && (
        <div className={`dice-container ${isPlayerOneTurn ? "left" : "right"}`}>
          <DiceRoll 
            onRoll={handleDiceRoll} 
            disabled={isMoving || !!defeatedPlayer || !!winner}
          />
          {showDiceResult && <p>You rolled: {diceValue}</p>}
        </div>
      )}

      {winner && <h2 className="winner-message">🎉 {winner} WINS! 🎉</h2>}
      {defeatedPlayer && <h2 className="defeat-message">💥 {defeatedPlayer} was CAPTURED! 💥</h2>}
      {!winner && !defeatedPlayer && (
        <p>Current Turn: {isPlayerOneTurn ? "Player 1 (🔴)" : "Player 2 (🔵)"}</p>
      )}
    </div>
  );
}

export default Board;
