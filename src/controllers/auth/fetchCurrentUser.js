const { db } = require("../../utils/db");
exports.fetchCurrentUser = async (req, res, next) => {
  try {
    // get data already store in response local objects
    const currentUserId = res.locals.user.id;
    const token = req.cookies.token;
    const currentUser = await db.user.findUnique({
      where: {
        id: currentUserId,
      },
    });

    const currentAccount = await db.loginHistory.findFirst({
      where: {
        token,
      },
    });

    delete currentUser.password;
    return res.status(200).json({
      type: "success",
      message: "Fetch current user",
      data: {
        user: currentUser,
        currentAccount,
      },
    });
  } catch (error) {
    next(error);
  }
};
