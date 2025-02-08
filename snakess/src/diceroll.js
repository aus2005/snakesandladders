import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

function DiceDot({ position }) {
  return (
    <mesh position={[position[0], position[1], 0.501]}>
      <circleGeometry args={[0.07, 32]} />
      <meshBasicMaterial color="white" />
    </mesh>
  );
}

function DiceFace({ dots, rotation }) {
  return (
    <group rotation={rotation}>
      {dots.map((pos, index) => (
        <DiceDot key={index} position={pos} />
      ))}
    </group>
  );
}

function Dice({ number, isRolling }) {
  const dotPositions = {
    1: [[0, 0]],
    2: [
      [-0.3, -0.3],
      [0.3, 0.3],
    ],
    4: [
      [-0.3, -0.3],
      [0, 0],
      [0.3, 0.3],
    ],
    3: [
      [-0.3, -0.3],
      [-0.3, 0.3],
      [0.3, -0.3],
      [0.3, 0.3],
    ],
    5: [
      [-0.3, -0.3],
      [-0.3, 0],
      [-0.3, 0.3],
      [0.3, -0.3],
      [0.3, 0],
      [0.3, 0.3],
    ],
    6: [
      [-0.3, -0.3],
      [-0.3, 0.3],
      [0, 0],
      [0.3, -0.3],
      [0.3, 0.3],
    ],
  };

  const finalRotations = {
    1: [0, 0, 0],
    2: [0, Math.PI, 0],
    3: [0, Math.PI / 2, 0],
    4: [0, -Math.PI / 2, 0],
    5: [-Math.PI / 2, 0, 0],
    6: [Math.PI / 2, 0, 0],
  };

  const { rotation } = useSpring({
    to: async (next) => {
      if (isRolling) {
        await next({
          rotation: [
            Math.PI * (4 + Math.random()),
            Math.PI * (4 + Math.random()),
            Math.PI * (4 + Math.random()),
          ],
        });
      }
      await next({ rotation: finalRotations[number] });
    },
    config: { tension: 150, friction: 20 },
  });

  return (
    <animated.group rotation={rotation}>
      <mesh>
        <primitive object={new RoundedBoxGeometry(1, 1, 1, 6, 0.2)} />
        <meshBasicMaterial color="red" />
      </mesh>
      {[1, 2, 3, 4, 5, 6].map((face) => (
        <DiceFace
          key={face}
          dots={dotPositions[face]}
          rotation={finalRotations[face]}
        />
      ))}
    </animated.group>
  );
}

function DiceRoll({ onRoll, disabled }) {
  const [roll, setRoll] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const diceSound = new Audio("/Dice Sound.mp3");

  useEffect(() => {
    if (isRolling) {
      diceSound.play();
    }
  }, [isRolling, diceSound]);

  const rollDice = () => {
    if (disabled || isRolling) return;

    setIsRolling(true);
    setTimeout(() => {
      const newRoll = Math.floor(Math.random() * 6) + 1;
      setRoll(newRoll);
      setIsRolling(false);
      if (onRoll) onRoll(newRoll);
    }, 1000);
  };

  return (
    <div className="w-32 h-32 flex flex-col items-center justify-center">
      <Canvas className="w-full h-full" camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[3, 3, 3]} angle={0.3} intensity={0.8} />
        <Dice number={roll} isRolling={isRolling} />
      </Canvas>
      <button
        className={`mt-4 px-6 py-2 rounded-lg text-lg font-semibold ${
          disabled || isRolling
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
        onClick={rollDice}
        disabled={disabled || isRolling}
      >
        Roll
      </button>
    </div>
  );
}

export default DiceRoll;
