import React, { useState } from 'react';

const PlayerMovement = () => {
  const [playerPos, setPlayerPos] = useState(1); // Player starts at position 1.

  // Function to simulate the dice roll.
  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1; // Get a random number between 1 and 6.
    setPlayerPos(prevPos => Math.min(prevPos + roll, 100)); // Move player and ensure it doesn't exceed position 100.
  };

  return (
    <div>
      <button onClick={rollDice}>Roll Dice</button>
      <div>Player Position: {playerPos}</div> {/* Shows where the player is */}

      {/* The Gotti - Simple CSS circle */}
      <div
        style={{
          width: '30px', // Width of the gotti
          height: '30px', // Height of the gotti
          backgroundColor: 'blue', // Gotti color
          borderRadius: '50%', // Makes the div round (circle)
          position: 'absolute', // Absolute positioning to place it anywhere
          top: `${playerPos * 10}px`, // Position it based on the player's position
          left: '50px', // Horizontal position (fixed for now)
        }}
      ></div>
    </div>
  );
};

export default PlayerMovement;
