import React, { useState, useEffect } from "react";
import useGetWord from "../hooks/useGetWord";
import useValidateWord from "../hooks/useValidateWord";
import { MouseEvent } from "react";

type GridState = {
  guess: string;
  color: string;
};

export const Game: React.FC = () => {
  const [grid, setGrid] = useState<GridState[][]>(
    Array(6)
      .fill("")
      .map(() =>
        Array(5).fill({
          guess: "",
          color: "#543058",
        })
      )
  );
  const keyboardLayout = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
    ["DELETE", "ENTER"],
  ];
  const [kbdColors, setKbdColors] = useState<string[][]>(
    keyboardLayout.map((row) => row.map(() => "blueviolet"))
  );

  const [currentCol, setCurrentCol] = useState<number>(0);
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<string>("");
  const [gameState, setGameState] = useState({
    win: false,
    lose: false,
    invalidWord: false,
  });
  const [wordToValidate, setWordToValidate] = useState<string>("");
  const { isValid, loading } = useValidateWord(wordToValidate);
  const word = useGetWord();

  const handleNewGame = () => {
    window.location.reload();
  };
  const handleClick = async (event: MouseEvent<HTMLDivElement>) => {
    const newGrid = [...grid];

    if (event.target instanceof HTMLButtonElement) {
      const buttonVal: string = event.target.textContent || "";

      if (buttonVal === "ENTER" && userGuess.length === 5) {
        if (loading) {
          return;
        }
        if (isValid && !loading) {
          if (currentCol === 5 && currentRow <= 5) {
            const test1 = newGrid[currentRow].map((cell) => cell.guess);
            const test2 = [...word];
            const newColorGrid = [...grid];
            let winCounter = 0;
            for (let i = 0; i < test1.length; i++) {
              if (test1[i] === word[i]) {
                winCounter++;
                if (winCounter === 5) {
                  setGameState({ ...gameState, win: true });
                }

                newColorGrid[currentRow][i] = {
                  ...newColorGrid[currentRow][i],
                  color: "#003d05",
                };
                test1[i] = "-";
                test2[i] = "";
              } else {
                newColorGrid[currentRow][i] = {
                  ...newColorGrid[currentRow][i],
                  color: "#29172b",
                };
              }
            }
            for (let i = 0; i < test1.length; i++) {
              const newColorsKbd = [...kbdColors];
              const x = test2.indexOf(test1[i]);
              const z = word.indexOf(test1[i]);
              if (x != -1) {
                test2[x] = "";
                newColorGrid[currentRow][i] = {
                  ...newColorGrid[currentRow][i],
                  color: "#867200",
                };
              }
              if (z === -1) {
                for (let j = 0; j < 3; j++) {
                  const y = keyboardLayout[j].indexOf(test1[i]);
                  if (y != -1) {
                    newColorsKbd[j][y] = "#29172b";
                    setKbdColors(newColorsKbd);
                  }
                }
              }
            }
            setGrid(newColorGrid);
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
            setUserGuess("");
          }
        } else if (isValid === false) {
          setGameState({ ...gameState, invalidWord: true });
          setTimeout(() => {
            setGameState({ ...gameState, invalidWord: false });
          }, 2200);
        }
      } else if (buttonVal === "DELETE") {
        if (currentCol > 0 && currentRow < 6) {
          const newGuess = userGuess.slice(0, -1);
          setGameState({ ...gameState, invalidWord: false });
          newGrid[currentRow][currentCol - 1] = {
            ...newGrid[currentRow][currentCol - 1],
            guess: "",
          };
          setCurrentCol(currentCol - 1);
          setGrid(newGrid);
          setUserGuess(newGuess);
        }
      } else if (
        currentCol < 5 &&
        buttonVal != "DELETE" &&
        buttonVal != "ENTER"
      ) {
        const newGuess = userGuess + buttonVal;
        setUserGuess(newGuess);
        newGrid[currentRow][currentCol] = {
          ...newGrid[currentRow][currentCol],
          guess: buttonVal,
        };
        setGrid(newGrid);
        setCurrentCol(currentCol + 1);
        if (newGuess.length === 5) {
          setWordToValidate(newGuess);
        }
      }
    }
  };

  useEffect(() => {
    if (currentRow > 5 && !gameState.win) {
      setGameState({ ...gameState, lose: true });
    }
  }, [currentRow, gameState, setGameState]);

  const renderKbd = (keyName: string, rowIndex: number, colIndex: number) => {
    const buttonProps = {
      "aria-label": keyName,
      tabIndex: 0,
    };

    if (keyName === "DELETE") {
      return (
        <button
          className="DELETE"
          key={`${rowIndex}-${colIndex}`}
          {...buttonProps}
        >
          {keyName}
        </button>
      );
    } else if (keyName === "ENTER") {
      return (
        <button
          className="ENTER"
          key={`${rowIndex}-${colIndex}`}
          disabled={loading}
          {...buttonProps}
        >
          {keyName}
        </button>
      );
    } else {
      return (
        <button
          className="keyboardButton"
          key={`${rowIndex}-${colIndex}`}
          style={{ backgroundColor: kbdColors[rowIndex][colIndex] }}
          {...buttonProps}
        >
          {keyName}
        </button>
      );
    }
  };
  return (
    <>
      <div className="inputGrid">
        <div
          className="gameWon"
          style={{ visibility: gameState.win ? "visible" : "hidden" }}
          aria-live="assertive"
        >
          <h1>
            YOU WON!
            <div>
              <button
                className="newGame"
                style={{ opacity: 1 }}
                onClick={handleNewGame}
              >
                {"<"} NEW GAME{">"}
              </button>
            </div>
          </h1>
        </div>
        <div
          className="gameLost"
          style={{
            visibility: gameState.lose && !gameState.win ? "visible" : "hidden",
          }}
          aria-live="assertive"
        >
          LOSS... Word was {word}
          <div>
            <button
              className="newGame"
              style={{ opacity: 1 }}
              onClick={handleNewGame}
            >
              {"<"} NEW GAME{">"}
            </button>
          </div>
        </div>
        <div
          className="invalidWord"
          style={{ display: gameState.invalidWord ? "block" : "none" }}
          aria-live="assertive"
        >
          Word not in dictionary!
        </div>
        {grid.map((row, rowIndex) => (
          <div className="inputRow" key={rowIndex}>
            {row.map((cell, colIndex) => (
              <div
                className="inputCell"
                style={{ backgroundColor: grid[rowIndex][colIndex].color }}
                key={`${rowIndex}-${colIndex}`}
                aria-label={`Row ${rowIndex + 1}, Column ${
                  colIndex + 1
                }, Letter ${cell.guess || "blank"}`}
              >
                {cell.guess}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard">
        {keyboardLayout.map((row, rowIndex: number) => (
          <div className="kbdRow" key={rowIndex} onClick={handleClick}>
            {row.map((keyName: string, colIndex: number) =>
              renderKbd(keyName, rowIndex, colIndex)
            )}
          </div>
        ))}
      </div>
    </>
  );
};
