const User = require("../models/userModels");

exports.signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const newUser = new User({ email, password, name });
    const savedUser = await newUser.save();
    res.send({ userId: savedUser._id, email, name });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.logIn = async (req, res) => {
  try {
    const { user, token } = req.body;
    res.cookie("token", token, {
      maxAge: 900000,
      httpOnly: true,
      sameSite: "none",
      secure: true,
    });
    res.send({ name: user.name, id: user.id });
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

