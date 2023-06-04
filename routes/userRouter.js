const express = require("express");
const router = express.Router();
const { signUp, logIn } = require("./controllers/userController");
const {
  validateBody,
  signUpSchema,
  passwordsMatch,
  isNewUser,
  hashPwd,
  doesUserExist,
  verifyPassword,
} = require("../middleware/usersMiddleware");


// Route handler for user registration
router.post(
  "/signup",
  validateBody(signUpSchema),
  passwordsMatch,
  isNewUser,
  hashPwd,
  UsersController.signUp
);

// Route handler for user login
router.post(
  "/login",
  validateBody(loginSchema),
  doesUserExist,
  verifyPassword,
  UsersController.logIn
);

// Route handler for retrieving user high scores
router.get("/:userId/scores", );
  // Retrieve user high scores from the database or any other data source
  // and send the response back to the client


// Other user-related route handlers and logic

module.exports = userRouter;
