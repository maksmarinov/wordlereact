import React, { useState } from "react";

export const Game = () => {
  const [guessGrid, setGuessGrid] = useState<string[][]>(
    Array(6)
      .fill("")
      .map(() => Array(5).fill(""))
  );
  const [lastAttempt, setLastAttempt] = useState(false);
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["DEL", "ENT"],
  ];
  const [currentCol, setCurrentCol] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const newGrid = [...guessGrid];
    if (event.target instanceof HTMLButtonElement) {
      const buttonVal = event.target.textContent || "";
      if (buttonVal === "ENT") {
        if (currentCol === 5 && currentRow < 6) {
          setCurrentRow(currentRow + 1);
          setCurrentCol(0);
        }
        if (currentRow === 6) {
          setLastAttempt(true);
        }
      } else if (buttonVal === "DEL") {
        if (currentCol > 0 && !lastAttempt) {
          newGrid[currentRow][currentCol - 1] = "";
          setCurrentCol(currentCol - 1);
          setGuessGrid(newGrid);
        }
      } else if (currentCol < 5) {
        newGrid[currentRow][currentCol] = buttonVal;
        setGuessGrid(newGrid);
        setCurrentCol(currentCol + 1);
      }
    }
  };

  const renderKbd = (keyName: string, rowIndex: number, colIndex: number) => {
    if (keyName === "DEL") {
      return (
        <button className="DEL" key={`${rowIndex}-${colIndex}`}>
          {keyName}
        </button>
      );
    } else if (keyName === "ENT") {
      return (
        <button className="ENT" key={`${rowIndex}-${colIndex}`}>
          {keyName}
        </button>
      );
    } else {
      return (
        <button className="keyboardButton" key={`${rowIndex}-${colIndex}`}>
          {keyName}
        </button>
      );
    }
  };
  return (
    <>
      <div className="inputGrid">
        {guessGrid.map((row, rowIndex) => (
          <div className="inputRow" key={rowIndex}>
            {row.map((val, colIndex) => (
              <div className="inputCell" key={`${rowIndex}-${colIndex}`}>
                {val}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard">
        {keyboardLayout.map((row, rowIndex: number) => (
          <div className="kbrdRow" key={rowIndex} onClick={handleClick}>
            {row.map((keyName: string, colIndex: number) =>
              renderKbd(keyName, rowIndex, colIndex)
            )}
          </div>
        ))}
      </div>
    </>
  );
};
