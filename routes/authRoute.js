const express = require("express");
const router = express.Router();
const { register, logIn } = require("../controllers/authController");
const { body } = require("express-validator");
const userModel = require("../models/userModel");

router.post(
  "/sigin",
  body("email", "Email should be a valid email")
    .isEmail()
    .normalizeEmail()
    .trim(),
  body("password", "Passoword should have atleast 5 char").isLength({ min: 5 }),
  logIn
);
router.post(
  "/signup",
  body("email", "Email should be a valid email")
    .isEmail()
    .normalizeEmail()
    .trim(),
  body("email").custom((value) => {
    return userModel.findOne({ email: value }).then((user) => {
      if (user) {
        return Promise.reject("E-mail already in use");
      }
    });
  }),
  body("password", "Passoword should have atleast 5 char").isLength({ min: 5 }),
  register
);

module.exports = router;
