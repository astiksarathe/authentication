const userModel = require("../models/userModel");
const { signAccessToken } = require("../configurations/Tokens/webToken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

module.exports = {
  register: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;
      const newUser = new userModel({ email, password });
      const savedUser = await newUser.save();

      if (!savedUser) {
        throw createError.createError("Can not register user");
      }
      const accessToken = await signAccessToken(savedUser.id);
      res.json({
        id: newUser._id,
        email: newUser.email,
        accessToken: accessToken,
      });
    } catch (error) {
      next(error);
    }
  },

  logIn: async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const user = await userModel.findOne({ email: email });
      if (!user) {
        return next(createError.Unauthorized("username/password is not valid"));
      }
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return next(createError.Unauthorized("username/password is not valid"));
      }
      const accessToken = await signAccessToken(user.id);
      res.json({
        id: user._id,
        email: user.email,
        accessToken: accessToken,
      });
    } catch (error) {
      next(error);
    }
  },
};
