const { db } = require("../../utils/db");
const cookie = require("cookie");

exports.logout = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    // expire cookies from user frontend

    const { accountId } = req.params;

    await db.user.update({
      where: {
        id: userId,
      },
      data: {
        status: "LOGOUT",
        lastSeen: new Date().toISOString(),
      },
    });

    await db.accountLoggedin.update({
      where: {
        id: accountId,
      },
      data: {
        isActive: false,
        lastSeen: new Date().toISOString(),
      },
    });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        expires: new Date(0),
        path: "/",
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
