import React from "react";
import "./board.css";

const Chessboard = () => {
  const board = [
    ["b", "w", "b", "w"],
    ["w", "b", "w", "b"],
    ["b", "w", "b", "w"],
    ["w", "b", "w", "b"],
  ];

  return (
    <table>
      <tbody>
        {board.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex} className={cell}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Chessboard;
