import { useState, useRef, useEffect } from "react";
import axios from "axios";


const easyBoard = [
  [5,3,0,0,7,0,0,0,0],
  [6,0,0,1,9,5,0,0,0],
  [0,9,8,0,0,0,0,6,0],

  [8,0,0,0,6,0,0,0,3],
  [4,0,0,8,0,3,0,0,1],
  [7,0,0,0,2,0,0,0,6],

  [0,6,0,0,0,0,2,8,0],
  [0,0,0,4,1,9,0,0,5],
  [0,0,0,0,8,0,0,7,9]
];

const mediumBoard = [
  [0,0,0,2,6,0,7,0,1],
  [6,8,0,0,7,0,0,9,0],
  [1,9,0,0,0,4,5,0,0],

  [8,2,0,1,0,0,0,4,0],
  [0,0,4,6,0,2,9,0,0],
  [0,5,0,0,0,3,0,2,8],

  [0,0,9,3,0,0,0,7,4],
  [0,4,0,0,5,0,0,3,6],
  [7,0,3,0,1,8,0,0,0]
];

const hardBoard = [
  [0,0,0,0,0,0,0,1,2],
  [0,0,0,0,0,7,0,0,0],
  [0,0,1,0,9,0,5,0,0],

  [0,0,0,0,0,0,0,0,0],
  [0,0,0,5,0,8,0,0,0],
  [0,0,0,0,0,0,0,0,0],

  [0,0,9,0,4,0,7,0,0],
  [0,0,0,2,0,0,0,0,0],
  [4,7,0,0,0,0,0,0,0]
];


const createEmptyBoard = () => {
  return Array(9)
    .fill()
    .map(() => Array(9).fill(0));
};


function SudokuBoard() {

  const [board, setBoard] = useState(createEmptyBoard());

  const [activeCell, setActiveCell] = useState(null);

  // Speed state
  const [speed, setSpeed] = useState(100);

  // Pause state
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const speedRef = useRef(speed);
  const pauseRef = useRef(isPaused);


  // Sync refs
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    pauseRef.current = isPaused;
  }, [isPaused]);


  // Handle typing
  const handleChange = (row, col, value) => {

    // Allow only numbers 1-9
    if (value !== "" && !/^[1-9]$/.test(value)) {
      return;
    }

    // Copy board
    const newBoard = board.map(row => [...row]);

    // Update cell
    newBoard[row][col] = value === "" ? 0 : Number(value);

    // Update board
    setBoard(newBoard);
  };


  // Animate solving process
  const animateSteps = async (steps) => {

    for (let step of steps) {

      // Pause animation
      while (pauseRef.current) {

        await new Promise(resolve =>
          setTimeout(resolve, 100)
        );
      }

      // Highlight current cell
      setActiveCell({
        row: step.row,
        col: step.col,
        action: step.action
      });

      // Dynamic speed
      await new Promise(resolve =>
        setTimeout(resolve, 210 - speedRef.current)
      );

      // Update board
      setBoard(prevBoard => {

        const newBoard = prevBoard.map(row => [...row]);

        newBoard[step.row][step.col] = step.value;

        return newBoard;
      });
    }

    // Remove highlight
    setActiveCell(null);
  };


  // Solve Sudoku
  const solveBoard = async () => {

    try {

      setIsPaused(false);

      const response = await axios.post(
        "http://localhost:5000/solve",
        {
          board
        }
      );

      if (response.data.success) {

        await animateSteps(response.data.steps);

      } else {

        alert("No solution exists");
      }

    } catch (error) {

      console.log(error);

      alert("Error solving Sudoku");
    }
  };


  // Load sample puzzles
  const loadSample = (difficulty) => {

    let selectedBoard;

    if (difficulty === "easy") {
      selectedBoard = easyBoard;
    }

    else if (difficulty === "medium") {
      selectedBoard = mediumBoard;
    }

    else {
      selectedBoard = hardBoard;
    }

    // Copy board
    const copiedBoard = selectedBoard.map(
      row => [...row]
    );

    setBoard(copiedBoard);

    setActiveCell(null);
  };


  // Clear board
  const clearBoard = () => {

    setBoard(createEmptyBoard());

    setActiveCell(null);

    setIsPaused(false);
  };


  return (

    <div>

      <div className="board">

        {board.map((row, rowIndex) => (

          <div key={rowIndex} className="row">

            {row.map((cell, colIndex) => (

              <input
                key={colIndex}
                type="text"
                maxLength="1"
                className={`cell ${
                  activeCell &&
                  activeCell.row === rowIndex &&
                  activeCell.col === colIndex
                    ? activeCell.action
                    : ""
                }`}
                value={cell === 0 ? "" : cell}
                onChange={(e) =>
                  handleChange(
                    rowIndex,
                    colIndex,
                    e.target.value
                  )
                }
              />

            ))}

          </div>

        ))}

      </div>


      <div className="controls">

        <div className="main-buttons">

          <button onClick={solveBoard}>
            Solve
          </button>

          <button
            onClick={() =>
              setIsPaused(!isPaused)
            }
          >
            {isPaused ? "Resume" : "Pause"}
          </button>

          <button onClick={() => loadSample("easy")}>
            Easy
          </button>

          <button onClick={() => loadSample("medium")}>
            Medium
          </button>

          <button onClick={() => loadSample("hard")}>
            Hard
          </button>

          <button onClick={clearBoard}>
            Clear
          </button>

        </div>


        <div className="speed-control">

          <label>
            Speed: {speed}
          </label>

          <input
            type="range"
            min="10"
            max="200"
            value={speed}
            onChange={(e) =>
              setSpeed(Number(e.target.value))
            }
          />

        </div>

      </div>

    </div>
  );
}

export default SudokuBoard;