const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const newUser = new User({ email, password, firstName, lastName });

    // Create token
    const token = jwt.sign(
      { user_id: newUser._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );

    newUser.token = token;
    const savedUser = await newUser.save();

    res.status(201).send({
      message: "User created successfully",
      userId: savedUser._id,
      email,
      firstName,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.logIn = async (req, res) => {
  try {
    const { email, password, user } = req.body;
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      );

      // Save user token
      user.token = token;

      // Set the token as a cookie in the response
//           const { user, token } = req.body;
//     res.cookie("token", token, {
//       maxAge: 900000,
//       httpOnly: true,
//       sameSite: "none",
//       secure: true,
//     });
      res.cookie('token', token, {
        maxAge: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      // Send the user as a JSON response
      res.status(200).json(user);
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllPlayers = async (req, res) => {
  try {
    const players = await User.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch players" });
  }
};

exports.getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;
    const player = await User.findById(id);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch player" });
  }
};
