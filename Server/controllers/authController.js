const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

module.exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          {
            phone: {
              $regex: req.query.search,
              $options: "i",
            },
          },
        ],
      }
    : {};

  const users = await User.find(keyword).find({
    _id: {
      $ne: req.user._id,
    },
  });
  res.send(users);
});

module.exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      message: "Invalid inputs passed, please check your data.",
    });
  }

  const { username, phone, password, email, pic, notificationToken } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ phone: phone });
  } catch (err) {
    return res.json({ message: "Signing up failed, please try again later." });
  }

  if (existingUser) {
    return res.json({ message: "Phone already exists." });
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return res.json({ message: "Signing up failed, please try again later." });
  }

  const createdUser = new User({
    username,
    phone,
    password: hashedPassword,
    email,
    pic,
    notificationToken,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return res.json({ message: "Signing up failed, please try again later." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, phone: createdUser.phone },
      "supersecret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return res.json({ message: "Signing up failed, please try again later." });
  }

  res.status(201).json({
    message: "OK",
    userId: createdUser.id,
    phone: createdUser.phone,
    token,
    pic: createdUser.pic,
  });
};

module.exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({
      message: "Invalid inputs passed, please check your data.",
    });
  }

  const { phone, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ phone: phone });
  } catch (error) {
    return res.json({ message: "Logging in failed, please try again later." });
  }

  if (!existingUser) {
    return res.json({ message: "Invalid credentials could not log you in." });
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return res.json({ message: "Invalid credentials could not log you in." });
  }

  if (!isValidPassword) {
    return res.json({ message: "Invalid credentials could not log you in." });
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, phone: existingUser.phone },
      "supersecret",
      { expiresIn: "1h" }
    );
  } catch (error) {
    return res.json({ message: "Logging in failed, please try again later." });
  }

  res.json({
    message: "OK",
    userId: existingUser.id,
    phone: existingUser.phone,
    token: token,
    pic: existingUser.pic,
  });
};
