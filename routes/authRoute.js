const express = require("express");
const router = express.Router();
const {
  register,
  logIn,
  resetPassword,
  forgetPassword,
} = require("../controllers/authController");
const userModel = require("../models/userModel");
const {
  validSignUp,
  validSignIn,
  validForgetPassword,
} = require("../helpers/valid");


router.post("/signin", validSignIn, logIn);
router.post("/signup", validSignUp, register);

router.post("/forget-password/:email",validForgetPassword, forgetPassword);
router.post("/reset-password/:email/:token", resetPassword);
// router.post('/reset-password')


module.exports = router;
