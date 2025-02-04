import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useSpring, animated } from "@react-spring/three";

function DiceDot({ position }) {
  return (
    <mesh position={[position[0], position[1], 0.501]}>
      <circleGeometry args={[0.07, 32]} />
      <meshBasicMaterial color="pink" />
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
  // Dot positions for each face
  const dotPositions = {
    1: [[0, 0]], 
  
    2: [[-0.3, -0.3], [0.3, 0.3]], 
  
    3: [[-0.3, -0.3], [-0.3, 0.3], [0.3, -0.3], [0.3, 0.3]], 
  
    4: [[-0.3, -0.3], [0, 0], [0.3, 0.3]], 
  
    5: [[-0.3, -0.3], [-0.3, 0], [-0.3, 0.3], [0.3, -0.3], [0.3, 0], [0.3, 0.3]], 
  
    6: [[-0.3, -0.3], [-0.3, 0.3], [0, 0], [0.3, -0.3], [0.3, 0.3]] 
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
          Math.PI * (4 + Math.random())
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
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {[1, 2, 3, 4, 5, 6].map((face) => (
        <DiceFace key={face} dots={dotPositions[face]} rotation={finalRotations[face]} />
      ))}
    </animated.group>
  );
}

export default function DiceRoll() {
  const [roll, setRoll] = useState(1);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    setTimeout(() => {
      const newRoll = Math.floor(Math.random() * 6) + 1;
      setRoll(newRoll);
      setIsRolling(false);
    }, 1000);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <Canvas className="w-64 h-64" camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[3, 3, 3]} angle={0.3} intensity={0.8} />
        <Dice number={roll} isRolling={isRolling} />
      </Canvas>
      <button
        className="mt-4 px-6 py-2 bg-blue-500 rounded-lg text-lg font-semibold hover:bg-blue-600"
        onClick={rollDice}
        disabled={isRolling}
      >
        Roll
      </button>
      <p className="mt-2 text-xl">You rolled: {roll}</p>
    </div>
  );
} 

