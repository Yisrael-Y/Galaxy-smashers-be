const express = require("express");
const router = express.Router();
//Import user controllers
const {
  signUp,
  logIn,
  getAllPlayers,
  getPlayerById
} = require("../controllers/userController");
// Import user middleware
const {
  passwordsMatch,
  isNewUser,
  hashPwd,
  doesUserExist,
  verifyPassword,
  auth
} = require("../middleware/usersMiddleware");

// Route handler for user registration
router.post("/signup", passwordsMatch, isNewUser, hashPwd, signUp);

// Route handler for user login
router.post("/login", doesUserExist, verifyPassword, logIn);

// Player routes
router.get("/players", getAllPlayers);
router.get("/player/:id", auth, getPlayerById);

// Route handler for retrieving user high scores
router.get("/player:userId/scores");

module.exports = router;
