const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const gameSchema = new mongoose.Schema({
  playerIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: true,
    },
  ],
  settings: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
  },
});

const scoreSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Game",
    required: true,
  },
  playerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
});

const Player = mongoose.model("Player", playerSchema);
const Game = mongoose.model("Game", gameSchema);
const Score = mongoose.model("Score", scoreSchema);

module.exports = { Player, Game, Score };
