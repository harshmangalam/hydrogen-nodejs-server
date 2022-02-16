const cookie = require("cookie");
const { validationResult } = require("express-validator");
const { checkPassword, hashPassword } = require("../utils/password.util");
const { createJwtToken } = require("../utils/token.util");

const { db } = require("../utils/db");
// ------------------------- login ------------------------------

exports.login = async (req, res, next) => {
  // return api fields validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  const { email, password } = req.body;
  try {
    // verify email
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next({ status: 400, message: "Incorrect email address" });
    }
    // verify password
    const matchPassword = await checkPassword(password, user.password);
    if (!matchPassword) {
      return next({ status: 400, message: "Incorrect password" });
    }

    const token = createJwtToken({ userId: user.id });

    // set token to user frontend cookies
    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 3600 * 12,
        path: "/",
      })
    );

    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    return res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------------- signup ---------------------------------

exports.signup = async (req, res, next) => {
  // return api fields level error validations
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({
      status: 422,
      message: "User input error",
      data: errors.mapped(),
    });
  }
  let { email, password, firstName, lastName,gender } = req.body;
  try {
    // check duplicate email
    const emailExist = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });

    if (emailExist) {
      return next({ status: 400, message: "Email address already exists" });
    }

    // hash password

    password = await hashPassword(password);

    // create new user

    const user = await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        password,
        gender
      },
    });

    return res.status(201).json({
      type: "success",
      message: `Account created for ${user.firstName}`,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --------------- fetch current user -------------------------

exports.fetchCurrentUser = async (req, res, next) => {
  try {
    // get data already store in response local objects
    const currentUser = res.locals.user;
    return res.status(200).json({
      type: "success",
      message: "Fetch current user",
      data: {
        user: currentUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

// logout user

exports.logout = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    // expire cookies from user frontend
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
      })
    );

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "LOGOUT",
        lastSeen: new Date().toISOString(),
      },
    });

    return res.status(200).json({
      type: "success",
      message: "You have loggedout successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
