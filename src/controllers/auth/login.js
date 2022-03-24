const { db } = require("../../utils/db");
const { validationResult } = require("express-validator");
const { checkPassword } = require("../../utils/password.util");
const { createJwtToken } = require("../../utils/token.util");
const cookie = require("cookie");
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
  const { email, password, platform, coords } = req.body;

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
        sameSite: "strict",
        maxAge: 3600 * 12,
        path: "/",
      })
    );

    const { name, version, layout, description, ua, os } = platform;

    await db.loginHistory.updateMany({
      where: {
        userId: user.id,
      },
      data: {
        isCurrent: false,
      },
    });
    const currentAccount = await db.loginHistory.create({
      data: {
        browser: {
          name,
          description,
          version,
          ua,
          layout,
        },

        os,
        location: {
          ...coords,
        },
        token,
        userId: user.id,
        isActive: true,
        isCurrent: true,
      },
    });

    const currentUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        status: "ACTIVE",
      },
    });

    delete currentUser.password;

    res.status(201).json({
      type: "success",
      message: "You have loggedin successfully",
      data: {
        user: currentUser,
        token,
        currentAccount,
      },
    });
  } catch (error) {
    next(error);
  }
};
