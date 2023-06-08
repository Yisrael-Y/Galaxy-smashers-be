const express = require("express");
const router = express.Router();
//Import user controllers
const {
  signUp,
  logIn,
  logOut,
  updateUser,
  getAllPlayers,
  getPlayerById,
  getUserByToken,
  editUser,
} = require("../controllers/userController");
// Import user middleware
const {
  passwordsMatch,
  isNewUser,
  hashPwd,
  doesUserExist,
  verifyPassword,
  auth,
  upload
} = require("../middleware/usersMiddleware");

// Route handler for user registration
router.post("/signup", passwordsMatch, isNewUser, hashPwd, signUp);

// Route handler for user login
router.post("/login", doesUserExist, verifyPassword, logIn);

// Route handler for user logout
router.get("/logout", logOut);

// Route handler for user update
router.put("/update", auth, upload.single("picture"), updateUser);

// Player routes
router.get("/players", getAllPlayers);
router.get("/player/:id", auth, getPlayerById);
router.get("/player/", auth, getUserByToken);
router.put("/update", auth, editUser);

// Route handler for retrieving user high scores
router.get("/player:userId/scores");

module.exports = router;
