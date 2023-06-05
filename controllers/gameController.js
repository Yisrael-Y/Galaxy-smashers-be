// Import necessary modules
const Game = require("../models/gameModel");


// Game controller
exports.createGame = async (req, res) => {
  try {
    const { playerIds, settings } = req.body;
    const game = new Game({ playerIds, settings });
    await game.save();
    res.status(201).json(game);
  } catch (error) {
    res.status(500).json({ error: "Failed to create game" });
  }
};

exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(game);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game" });
  }
};

// Score controller
exports.submitScore = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerId, score } = req.body;
    const game = await Game.findById(id);
    if (!game) {
      return res.status(404).json({ error: "Game not found" });
    }
    const scoreData = new Score({ gameId: id, playerId, score });
    await scoreData.save();
    res.status(201).json(scoreData);
  } catch (error) {
    res.status(500).json({ error: "Failed to submit score" });
  }
};
