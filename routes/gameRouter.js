const express = require('express');
const router = express.Router();

// Import controllers
const {
  createGame,
  getGameById,
  submitScore,
} = require('../controllers/gameController');

// Import middleware functions
const {
  validateGameCreation,
  validateScoreSubmission,
} = require('../middleware/gameMiddleware');

// Game routes
router.post('/games', validateGameCreation, createGame);
router.get('/games/:id', getGameById);

// Score routes
router.post('/games/:id/scores', validateScoreSubmission, submitScore);

module.exports = router;
