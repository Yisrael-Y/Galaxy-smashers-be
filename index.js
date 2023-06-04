const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Additional dependencies and setup
// const db = require("./database");

// Routes
const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);

// Error handling middleware
app.use((err, req, res) => {
  console.log(`ERROR => ${err}`);
  res.send(err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on http://localhost:${PORT}`);
});
