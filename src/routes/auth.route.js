const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const checkAuth = require("../middlewares/auth.middleware");

const {
  signup,
  login,
  fetchCurrentUser,
  logout,
} = require("../controllers/auth.controller");

const loginValidation = [
  body("email").not().isEmpty().withMessage("Email must be required"),
  body("password").not().isEmpty().withMessage("Password must be required"),
];

const signupValidation = [
  body("firstName").not().isEmpty().withMessage("First name must be required"),
  body("email")
    .not()
    .isEmpty()
    .withMessage("Email address must be required")
    .isEmail()
    .withMessage("Incorrect email address"),
  body("password").not().isEmpty().withMessage("Password must be required"),
];

router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.get("/me", checkAuth, fetchCurrentUser);
router.patch("/logout", checkAuth, logout);

module.exports = router;
