const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const User = require("../models/userModels");
const jwtSecret = process.env.TOKEN_KEY;

cloudinary.config({
  cloud_name: "dqy0kss8b",
  api_key: "177599771816185",
  api_secret: "axM6WCs_c-qDsdV3YYJpMd338B0",
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: cloudStorage });

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
  if (!req.headers.cookie) {
    return res.status(401).send("Missing token");
  }
  const token = req.headers.cookie.split("=")[1];
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
  upload,
};
