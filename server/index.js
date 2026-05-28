const express = require("express");
const cors = require("cors");

const sudokuRoutes = require("./routes/sudokuRoutes");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/", sudokuRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});