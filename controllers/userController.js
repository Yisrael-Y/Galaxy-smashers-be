const User = require("../models/userModels");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.signUp = async (req, res) => {
  try {
    const { email, password, firstName, nickname, lastName } = req.body;
    const newUser = new User({
      email,
      password,
      firstName,
      lastName,
      nickname,
    });
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

exports.logOut = async (req, res) => {
  // Set token to none and expire after 5 seconds
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
  });
  res
    .status(200)
    .json({ success: true, message: "User logged out successfully" });
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const { username, email } = req.body;

    let updateFields = { username, email };

    if (req.file) {
      // If a new image is uploaded
      updateFields.profileImage = req.file.path;
    }

    // Update the user in the database
    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Send the updated user as a response
    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
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

exports.getUserByToken = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.editUser = async (req, res) => {
  const { userId, email, firstName, lastName, phone, bio } = req.body;
  const fieldsToUpdate = {
    ...(email && { email }),
    ...(firstName && { firstName }),
    ...(lastName && { lastName }),
    ...(phone && { phone }),
    ...(bio && { bio }),
  };
  try {
    const user = await User.findByIdAndUpdate(userId, fieldsToUpdate, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User edited successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.incrementWin = async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.gamesWon) {
      user.gamesWon = 0;
    }
    user.gamesWon += 1;
    await user.save();
    res.json({ message: "User's win count incremented successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
