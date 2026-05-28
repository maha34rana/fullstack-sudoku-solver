const findEmpty = require("./findEmpty");
const isValid = require("./isValid");

function solveSudoku(board, steps) {

  const empty = findEmpty(board);

  if (!empty) {
    return true;
  }

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {

    if (isValid(board, num, row, col)) {

      board[row][col] = num;

      // Record placement
      steps.push({
        row,
        col,
        value: num,
        action: "place"
      });

      // Recursive call
      if (solveSudoku(board, steps)) {
        return true;
      }

      // Backtrack
      board[row][col] = 0;

      // Record removal
      steps.push({
        row,
        col,
        value: 0,
        action: "remove"
      });
    }
  }

  return false;
}

module.exports = solveSudoku;