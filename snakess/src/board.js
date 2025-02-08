import React, { useState, useEffect } from "react";
import "./board.css";
import DiceRoll from "./diceroll";
import { animateMove } from "./helpers";
import snake1 from "./images/snake1.png";
import snake2 from "./images/snake2.png";
import snake3 from "./images/snake3.png";

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
  const [snakeBiteMessage, setSnakeBiteMessage] = useState(null); // State for the snake bite message

  const snakesAndLadders = {
    4: 25,
    8: 30,
    28: 14,
    40: 42,
    50: 5,
    62: 81,
    95: 75,
  };

  const snakes = [
    {
      image: snake1,
      position: {
        top: "65%",
        left: "35%",
        width: "40%",
        transform: "rotate(20deg)",
      },
      start: 23,
      end: 7,
    },
    {
      image: snake2,
      position: {
        top: "-6%",
        left: "43%",
        width: "40%",
        transform: "rotate(-20deg)",
      },
      start: 97,
      end: 41,
    },
    {
      image: snake3,
      position: {
        top: "30%",
        left: "10%",
        width: "30%",
        transform: "rotate(1deg)",
      },
      start: 67,
      end: 49,
    },
  ];

  const handleDiceRoll = async (roll) => {
    if (isMoving || winner || defeatedPlayer) return;

    setDiceValue(roll);
    setShowDiceResult(true);
    setIsMoving(true);

    const currentPosition = isPlayerOneTurn ? player1Position : player2Position;
    const setPosition = isPlayerOneTurn
      ? setPlayer1Position
      : setPlayer2Position;

    let targetPosition = currentPosition + roll;

    if (targetPosition > totalCells) {
      setIsMoving(false);
      setShowDiceResult(false);
      finishTurn();
      return;
    }

    try {
      const snake = snakes.find((snake) => snake.start === targetPosition);
      if (snake) {
        setSnakeBiteMessage(`Oopsie! Bitten by a snake! 😱`);
        setTimeout(() => {
          // Move the player to the start of the snake's tail position
          setPosition(snake.end);  // Move player to the snake's tail (end position)
          setSnakeBiteMessage(null);
        }, 1500);
        targetPosition = snake.end; // Set target position to the snake's tail
      } else {
        await animateMove(currentPosition, targetPosition, setPosition);
      }

      if (targetPosition === totalCells) {
        setWinner(isPlayerOneTurn ? "Player 1 (🔴)" : "Player 2 (🔵)");
        setIsMoving(false);
        return;
      }

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
    setIsPlayerOneTurn(!isPlayerOneTurn);
  };

  return (
    <div className="game-container">
      <div className="board-wrapper">
        <div className="board">
          {Array.from({ length: totalCells }, (_, i) => {
            const number = totalCells - i;
            return (
              <div
                key={number}
                className={`cell ${
                  (Math.floor(i / boardSize) + i) % 2 === 0 ? "red" : "white"
                }`}
              >
                {number}
                {player1Position === number && (
                  <div
                    className={`player player1 ${
                      defeatedPlayer === "Player 1 (🔴)" ? "shake" : ""
                    }`}
                  >
                    🔴
                  </div>
                )}
                {player2Position === number && (
                  <div
                    className={`player player2 ${
                      defeatedPlayer === "Player 2 (🔵)" ? "shake" : ""
                    }`}
                  >
                    🔵
                  </div>
                )}
              </div>
            );
          })}

          <div className="snakes-container">
            {snakes.map((snake, index) => (
              <img
                key={index}
                src={snake.image}
                alt={`Snake from ${snake.start} to ${snake.end}`}
                className="snake-image"
                style={{
                  position: "absolute",
                  ...snake.position,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {!winner && (
        <div
          className={`dice-container ${
            isPlayerOneTurn ? "left red-dice" : "right blue-dice"
          }`}
        >
          <DiceRoll
            onRoll={handleDiceRoll}
            disabled={isMoving || !!defeatedPlayer || !!winner}
            diceClass={isPlayerOneTurn ? "red-dice" : "blue-dice"}
          />
          {showDiceResult && <p>You rolled: {diceValue}</p>}
        </div>
      )}

      {winner && <h2 className="winner-message">🎉 {winner} WINS! 🎉</h2>}
      {defeatedPlayer && (
        <h2 className="defeat-message">💥 {defeatedPlayer} was CAPTURED! 💥</h2>
      )}
      {!winner && !defeatedPlayer && (
        <p>
          Current Turn: {isPlayerOneTurn ? "Player 1 (🔴)" : "Player 2 (🔵)"}
        </p>
      )}

      {snakeBiteMessage && (
        <h2 className="snake-bite-message">{snakeBiteMessage}</h2>
      )}
    </div>
  );
}

export default Board;
