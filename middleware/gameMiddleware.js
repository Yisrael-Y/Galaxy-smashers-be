// validateScoreSubmission middleware
exports.validateScoreSubmission = (req, res, next) => {
  const { playerId, score } = req.body;
  const { id } = req.params;

  // Validate playerId and score presence
  if (!playerId || !score) {
    return res.status(400).json({ error: "Player ID and score are required" });
  }

  // Validate score is a positive number
  if (typeof score !== "number" || score <= 0) {
    return res.status(400).json({ error: "Score must be a positive number" });
  }

  // Additional validation logic as per your game requirements
  // ...

  next();
};

// validateGameCreation middleware
exports.validateGameCreation = (req, res, next) => {
  const { playerIds, settings } = req.body;

  // Validate playerIds presence and length
  if (!playerIds || !Array.isArray(playerIds) || playerIds.length < 2) {
    return res
      .status(400)
      .json({ error: "At least two player IDs are required" });
  }

  // Validate settings presence and type
  if (!settings || typeof settings !== "object") {
    return res.status(400).json({ error: "Game settings must be provided" });
  }

  // Additional validation logic as per your game requirements
  // ...

  next();
};
