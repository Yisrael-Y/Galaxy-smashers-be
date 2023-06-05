const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const jwtSecret = process.env.TOKEN_KEY;

function passwordsMatch(req, res, next) {
  if (req.body.password !== req.body.repassword) {
    return res.status(400).send("Passwords don't match");
  }
  next();
}

async function isNewUser(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).send("User already exists");
    }
    next();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

function hashPwd(req, res, next) {
  const saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    req.body.password = hash;
    next();
  });
}

async function doesUserExist(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User with this email does not exist");
    }
    req.body.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
}

async function verifyPassword(req, res, next) {
  const { user, password } = req.body;
  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      return res.status(500).send(err.message);
    }
    if (result) {
      const token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: "2h",
      });
      req.body.token = token;
      next();
    } else {
      return res.status(400).send("Incorrect Password");
    }
  });
}

function auth(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send("Missing token");
  }
  const token = req.headers.authorization.replace("Bearer ", "");
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid Token");
    }
    if (decoded) {
      req.body.userId = decoded.id;
      next();
    }
  });
}

async function verifyToken(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("Token Required");
  }
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).send("Invalid Token");
    }
    req.body.userId = decoded.id;
    next();
  });
}

function isAdmin(req, res, next) {
  try {
    if (req.user.admin === 1) {
      next();
    } else {
      return res.status(403).send("Forbidden access");
    }
  } catch (error) {
    return res.status(500).send(error.message);
  }
}

module.exports = {
  passwordsMatch,
  isNewUser,
  hashPwd,
  doesUserExist,
  verifyPassword,
  auth,
  verifyToken,
  isAdmin,
};
