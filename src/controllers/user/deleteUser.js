const { db } = require("../../utils/db");

exports.deleteUser = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    await db.user.delete({
      where: {
        id: currentUser.id,
      },
    });

    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: NODE_ENV === "production" ? "none" : "strict",
        expires: new Date(0),
        path: "/",
        secure: NODE_ENV === "production" ? true : false,
      })
    );

    return res.status(200).json({
      type: "success",
      message: "Account deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
