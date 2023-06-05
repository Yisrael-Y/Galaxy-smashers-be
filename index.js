const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Routes
const userRouter = require("./routes/userRouter");
app.use("/users", userRouter);
const gameRouter = require("./routes/gameRouter");
app.use("/game", gameRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(`ERROR => ${err}`);
  res.send(err); 
});

// Start the server
async function init() {
  try {
    const connection = await mongoose.connect(dbUrl, {
      dbName: "galaxy-smashers",
    });
    if (connection.connections[0].host) {
      console.log("Connected to DB");
      app.listen(PORT, () => {
        console.log("Listening on port " + PORT);
      });
    }
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

init();
