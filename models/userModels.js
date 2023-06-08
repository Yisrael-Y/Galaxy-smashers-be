const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  profilePicture: { type: String },
  password: { type: String, required: true },
  date: { type: Date, default: Date.now },
  nickname: { type: String, required: true },
  phone: { type: Number },
  bio: { type: String },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
