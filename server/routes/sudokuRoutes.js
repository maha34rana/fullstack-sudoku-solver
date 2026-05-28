const express = require("express");
const solveSudoku = require("../solver/solveSudoku");

const router = express.Router();

router.post("/solve", (req, res) => {

  const { board } = req.body;

  const boardCopy = JSON.parse(JSON.stringify(board));

  // Create steps array
  const steps = [];

  // Pass steps into solver
  const solved = solveSudoku(boardCopy, steps);

  if (solved) {

    return res.json({
      success: true,
      solution: boardCopy,
      steps
    });

  }

  return res.json({
    success: false,
    message: "No solution exists"
  });
});

module.exports = router;