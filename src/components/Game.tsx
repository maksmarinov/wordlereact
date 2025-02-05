import React, { useState } from "react";
import useGetWord from "../hooks/useGetWord";
import useValidateWord from "../hooks/useValidateWord";
import { MouseEvent } from "react";

export const Game: React.FC = () => {
  const [guessGrid, setGuessGrid] = useState<string[][]>(
    Array(6)
      .fill("")
      .map(() => Array(5).fill(""))
  );
  const [colorLayoutGrid, setColorLayoutGrid] = useState<string[][]>(
    Array(6)
      .fill("")
      .map(() => Array(5).fill("#543058"))
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
  const [invalidWord, setInvalidWord] = useState<boolean>(false);
  const [win, setWin] = useState<boolean>(false);
  const [lose, setLose] = useState<boolean>(false);
  const [wordToValidate, setWordToValidate] = useState<string>("");
  const { isValid, loading } = useValidateWord(wordToValidate);
  const word = useGetWord();

  const handleNewGame = () => {
    window.location.reload();
  };
  const handleClick = async (event: MouseEvent<HTMLDivElement>) => {
    const newGrid = [...guessGrid];

    if (event.target instanceof HTMLButtonElement) {
      const buttonVal: string = event.target.textContent || "";

      if (buttonVal === "ENTER" && userGuess.length === 5) {
        if (loading) {
          return;
        }
        if (isValid && !loading) {
          if (currentCol === 5 && currentRow <= 5) {
            const test1 = [...guessGrid[currentRow]];
            const test2 = [...word];
            const newColorGrid = [...colorLayoutGrid];
            let winCounter = 0;
            for (let i = 0; i < test1.length; i++) {
              if (test1[i] === word[i]) {
                winCounter++;
                if (winCounter === 5) {
                  setWin(true);
                } else if (currentRow === 5) {
                  setLose(true);
                }

                newColorGrid[currentRow][i] = "#003d05";
                test1[i] = "-";
                test2[i] = "";
              } else {
                newColorGrid[currentRow][i] = "#29172b";
              }
            }
            for (let i = 0; i < test1.length; i++) {
              const newColorsKbd = [...kbdColors];
              const x = test2.indexOf(test1[i]);
              const z = word.indexOf(test1[i]);
              if (x != -1) {
                test2[x] = "";
                newColorGrid[currentRow][i] = "#867200";
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
            setColorLayoutGrid(newColorGrid);
            setCurrentRow(currentRow + 1);
            setCurrentCol(0);
            setUserGuess("");
          }
        } else if (isValid === false) {
          setInvalidWord(true);
          setTimeout(() => {
            setInvalidWord(false);
          }, 2200);
        }
      } else if (buttonVal === "DELETE") {
        if (currentCol > 0 && currentRow < 6) {
          const newGuess = userGuess.slice(0, -1);
          setInvalidWord(false);
          newGrid[currentRow][currentCol - 1] = "";
          setCurrentCol(currentCol - 1);
          setGuessGrid(newGrid);
          setUserGuess(newGuess);
        }
      } else if (
        currentCol < 5 &&
        buttonVal != "DELETE" &&
        buttonVal != "ENTER"
      ) {
        const newGuess = userGuess + buttonVal;
        setUserGuess(newGuess);
        newGrid[currentRow][currentCol] = buttonVal;
        setGuessGrid(newGrid);
        setCurrentCol(currentCol + 1);
        if (newGuess.length === 5) {
          setWordToValidate(newGuess);
        }
      }
    }
  };

  const renderKbd = (keyName: string, rowIndex: number, colIndex: number) => {
    if (keyName === "DELETE") {
      return (
        <button className="DELETE" key={`${rowIndex}-${colIndex}`}>
          {keyName}
        </button>
      );
    } else if (keyName === "ENTER") {
      return (
        <button
          className="ENTER"
          key={`${rowIndex}-${colIndex}`}
          disabled={loading}
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
        >
          {keyName}
        </button>
      );
    }
  };
  return (
    <>
      <div
        className="gameWon"
        style={{ visibility: win ? "visible" : "hidden" }}
      >
        <h1>
          YOU WON!{" "}
          <div>
            <button
              className="newGame"
              style={{ opacity: 1 }}
              onClick={handleNewGame}
            >
              {"<"} NEW GAME{">"}
            </button>
          </div>{" "}
        </h1>
      </div>
      <div
        className="gameLost"
        style={{ visibility: lose && !win ? "visible" : "hidden" }}
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
        className={"invalidWord"}
        style={{ display: !invalidWord ? "none" : "block" }}
      >
        Word not in dictionary!
      </div>
      <div className="inputGrid">
        {guessGrid.map((row, rowIndex) => (
          <div className="inputRow" key={rowIndex}>
            {row.map((val, colIndex) => (
              <div
                className="inputCell"
                style={{ backgroundColor: colorLayoutGrid[rowIndex][colIndex] }}
                key={`${rowIndex}-${colIndex}`}
              >
                {val}
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
