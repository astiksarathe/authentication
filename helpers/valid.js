const { check } = require('express-validator')
const userModel = require('../models/userModel')
const createError = require("http-errors")

exports.validSignUp = [
    check("email").isEmail().withMessage("Must be a valid email address"),
    check("email")
        .normalizeEmail()
        .trim()
        .custom(async (value) => {
            const user = await userModel.findOne({ email: value });
            if (user) {
                return Promise.reject("E-mail already in exist");
            }
        }),
    check("password", "password is required").notEmpty(),
    check("password")
        .isLength({
            min: 8,
        })
        .withMessage("Password must contain at least 8 characters")
        .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/).withMessage("Password must contain at least 8 characters, a number and a special characters"),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw createError.BadRequest("Password must be same")
        }
        return true
    })
];

exports.validSignIn = [
  check("email").isEmail().withMessage("Must be a valid email address"),
  check("password", "password is required").notEmpty(),
  check("password")
    .isLength({
      min: 8,
    })
    .withMessage("Password must contain at least 8 characters"),
];

exports.validForgetPassword = [
  check("email", "email is required").notEmpty(),
  check("email")
    .isEmail()
    .normalizeEmail()
    .trim()
    .withMessage("Must be a valid email address"),
];