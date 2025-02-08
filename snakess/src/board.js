import React, { useState } from "react";
import "./board.css";
import DiceRoll from "./diceroll";
import { animateMove } from "./helpers";
import snake1 from "./images/snake1.png";
import snake2 from "./images/snake2.png";
import snake3 from "./images/snake3.png";
import ladder1 from "./images/ladder1.png";
import ladder2 from "./images/ladder1.png";
import ladder3 from "./images/ladder1.png";

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
  const [snakeBiteMessage, setSnakeBiteMessage] = useState(null);
  const [affectedPlayer, setAffectedPlayer] = useState(null);
  const [showVictoryAnimation, setShowVictoryAnimation] = useState(false);

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
      path: [14.5, 15, 6, 7],
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
      path: [86, 76, 65, 54, 43, 42, 41],
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
      path: [68, 57, 47, 58, 59, 48, 49],
    },
  ];

  const ladders = [
    {
      image: ladder1,
      position: {
        top: "75%",
        left: "48%",
        width: "3.5%",
        transform: "rotate(35deg)",
      },
      start: 16,
      end: 25,
      path: [25],
    },
    {
      image: ladder2,
      position: {
        top: "47%",
        left: "71%",
        width: "7.5%",
        transform: "rotate(0deg)",
      },
      start: 33,
      end: 53,
      path: [43, 53],
    },
    {
      image: ladder3,
      position: {
        top: "3.5%",
        left: "15%",
        width: "10%",
        transform: "rotate(-25deg)",
      },
      start: 78,
      end: 99,
      path: [88.5, 89, 99],
    },
    {
      image: ladder1,
      position: {
        top: "51%",
        left: "10%",
        width: "9%",
        height: "28%",
        transform: "rotate(-45deg)",
      },
      start: 28,
      end: 50,
      path: [39, 50],
    },
    {
      image: ladder2,
      position: {
        top: "15%",
        left: "87%",
        width: "4%",
        transform: "rotate(39deg)",
      },
      start: 72,
      end: 81,
      path: [81],
    },
  ];

  const resetGame = () => {
    setPlayer1Position(1);
    setPlayer2Position(1);
    setIsPlayerOneTurn(true);
    setDiceValue(null);
    setShowDiceResult(false);
    setIsMoving(false);
    setWinner(null);
    setDefeatedPlayer(null);
    setSnakeBiteMessage(null);
    setAffectedPlayer(null);
    setShowVictoryAnimation(false);
  };

  const animatePathMove = async (path, setPosition) => {
    for (let i = 0; i < path.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      setPosition(path[i]);
    }
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
      setTimeout(() => {
        setIsMoving(false);
        finishTurn();
      }, 1000);
      return;
    }

    try {
      await animateMove(currentPosition, targetPosition, setPosition);

      const ladder = ladders.find((ladder) => ladder.start === targetPosition);
      if (ladder) {
        setAffectedPlayer(isPlayerOneTurn ? "Player 1 (🟢)" : "Player 2 (🔵)");
        await animatePathMove(ladder.path, setPosition);
        setTimeout(() => setAffectedPlayer(null), 1000);
        targetPosition = ladder.end;
      }

      const snake = snakes.find((snake) => snake.start === targetPosition);
      if (snake) {
        setAffectedPlayer(isPlayerOneTurn ? "Player 1 (🟢)" : "Player 2 (🔵)");
        setSnakeBiteMessage("Oopsie! Bitten by a snake! 😱");
        await animatePathMove(snake.path, setPosition);
        setTimeout(() => {
          setSnakeBiteMessage(null);
          setAffectedPlayer(null);
        }, 1000);
        targetPosition = snake.end;
      }

      if (targetPosition === totalCells) {
        const winningPlayer = isPlayerOneTurn ? "Player 1 (🟢)" : "Player 2 (🔵)";
        setWinner(winningPlayer);
        setShowVictoryAnimation(true);
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
        setDefeatedPlayer("Player 1 (🟢)");
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
                      affectedPlayer === "Player 1 (🟢)" ? "shine-effect" : ""
                    } ${defeatedPlayer === "Player 1 (🟢)" ? "shake" : ""}`}
                  >
                    🟢
                  </div>
                )}

                {player2Position === number && (
                  <div
                    className={`player player2 ${
                      affectedPlayer === "Player 2 (🔵)" ? "shine-effect" : ""
                    } ${defeatedPlayer === "Player 2 (🔵)" ? "shake" : ""}`}
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

          <div className="ladders-container">
            {ladders.map((ladder, index) => (
              <img
                key={index}
                src={ladder.image}
                alt={`Ladder from ${ladder.start} to ${ladder.end}`}
                className="ladder-image"
                style={{
                  position: "absolute",
                  ...ladder.position,
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

{winner && (
        <div className="victory-container">
          <div className="confetti-container">
            {Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="confetti" style={{
                "--x": `${Math.random() * 100}vw`,
                "--y": `${Math.random() * 100}vh`,
                "--delay": `${Math.random() * 3}s`,
                "--size": `${Math.random() * 10 + 5}px`,
                "--rotation": `${Math.random() * 360}deg`,
                "--color": `hsl(${Math.random() * 360}, 70%, 50%)`
              }}></div>
            ))}
          </div>
          <h2 className="winner-message animate-victory">
            🎉 {winner} WINS! 🎉
          </h2>
          <button 
            onClick={resetGame}
            className="play-again-button"
          >
            Play Again 🎲
          </button>
        </div>
      )}

      
      {defeatedPlayer && (
        <h2 className="defeat-message">💥 {defeatedPlayer} was CAPTURED! 💥</h2>
      )}
      {!winner && !defeatedPlayer && (
        <p>
          Current Turn: {isPlayerOneTurn ? "Player 1 (🟢)" : "Player 2 (🔵)"}
        </p>
      )}

      {snakeBiteMessage && (
        <h2 className="snake-bite-message">{snakeBiteMessage}</h2>
      )}
    </div>
  );
}

export default Board;