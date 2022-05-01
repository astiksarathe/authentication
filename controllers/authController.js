const userModel = require("../models/userModel");
const { signAccessToken } = require("../configurations/Tokens/webToken");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendGridTransporter = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(
  sendGridTransporter({
    auth: {
      api_key: process.env.MAIL_API_KEY,
    },
  })
);

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

  forgetPassword: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.params;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError.NotFound("Invalid email address");
      }
      const ACCESS_SECRET_KEY =
        "25938eeb531bd950435339eb2ca0a57ac5440819ce11ffe7e4880f17a647e56a";
      const SECRET_KEY = ACCESS_SECRET_KEY + user.password;
      const payload = {
        email: user.email,
        id: user.id,
      };
      const options = {
        expiresIn: "15m",
      };
      const token = jwt.sign(payload, SECRET_KEY, options);
      transporter
        .sendMail({
          to: email,
          from: "snakesnake575@gmail.com",
          subject: "Logged In",
          html: `<h1>Use this link to reset your password http://localhost:3000/reset-password/${email}/${token}</h1>`,
        })
        .catch((err) => console.log(err));
      res.send(token);
    } catch (error) {
      next(error);
    }
  },

  resetPassword: async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, token } = req.params;
    const { password } = req.body;
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw createError.NotFound("Invalid email address");
      }
      const ACCESS_SECRET_KEY =
        "25938eeb531bd950435339eb2ca0a57ac5440819ce11ffe7e4880f17a647e56a";
      const SECRET_KEY = ACCESS_SECRET_KEY + user.password;

      const checkToken = jwt.verify(token, SECRET_KEY);

      await userModel.findOneAndUpdate(
        {
          email: email,
        },
        { password: password }
      );
      res.send({
        message: "Password updated",
      });
      res.send(token);
    } catch (error) {
      next(error);
    }
  },
};
