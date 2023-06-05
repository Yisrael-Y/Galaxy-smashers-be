const express = require("express");
const router = express.Router();
const { signUp, logIn } = require("../controllers/userController");
const {
  passwordsMatch,
  isNewUser,
  hashPwd,
  doesUserExist,
  verifyPassword,
} = require("../middleware/usersMiddleware");

// Route handler for user registration
router.post("/signup", passwordsMatch, isNewUser, hashPwd, signUp);

// Route handler for user login
router.post("/login", doesUserExist, verifyPassword, logIn);

// Route handler for retrieving user high scores
router.get("/:userId/scores");
// Retrieve user high scores from the database or any other data source
// and send the response back to the client

module.exports = router;
