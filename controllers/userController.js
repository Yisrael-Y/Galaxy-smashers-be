const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, nickname } = req.body;
    const newUser = new User({ email, password, firstName, nickname });
    const savedUser = await newUser.save();

    res.status(201).send({
      message: "User created successfully",
      userId: savedUser._id,
      email,
      firstName,
      nickname,
    });
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
    const data = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id,
      nickname: user.nickname,
    };
    res.status(200).send({ ...data });
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
