const { db } = require("../../utils/db");
const cookie = require("cookie");
const { NODE_ENV } = require("../../config/env.config");

exports.logout = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;

    const { accountId } = req.query;

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "LOGOUT",
        lastSeen: new Date().toISOString(),
      },
    });

    if (accountId) {
      console.log(accountId);
      await db.loginHistory.update({
        where: {
          id: accountId,
        },
        data: {
          isActive: false,
          lastSeen: new Date().toISOString(),
        },
      });
    }

    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "none",
        expires: new Date(0),
        path: "/",
        secure: NODE_ENV === "production" ? true : false,
      })
    );

    return res.status(200).json({
      type: "success",
      message: "You have logout successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
