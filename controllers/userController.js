const {} = require("../models/userModels");

async function signUp(req, res) {
  try {
    const { email, password, name } = req.body;
    const newUser = {
      email,
      password,
      name,
    };
    const userId = await signUpModel(newUser);
    res.send({ userId: userId, email, name });
  } catch (err) {
    console.log(err);
  }
}

async function logIn(req, res) {
  try {
    const { user, token } = req.body;
    res.cookie("token", token, {
      maxAge: 900000,
      httpOnly: true,
      sameSite: "none",
      secure: true / false,
    });
    res.send({ name: user.name, id: user.id });
  } catch (err) {
    res.status(500).send(err);
  }
}

module.exports = {
  signUp,
  logIn,
};
