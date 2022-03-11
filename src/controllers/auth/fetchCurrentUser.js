const { db } = require("../../utils/db");
exports.fetchCurrentUser = async (req, res, next) => {
  try {
    // get data already store in response local objects
    const currentUserId = res.locals.user.id;
    const currentUser = await db.user.findUnique({
      where: {
        id: currentUserId,
      },
    });

    const accountLoggedin = await db.accountLoggedin.findFirst({
      where: {
        AND: [{ userId: currentUserId }, { isCurrent: true }],
      },
    });

    delete currentUser.password;
    return res.status(200).json({
      type: "success",
      message: "Fetch current user",
      data: {
        user: currentUser,
        accountLoggedin,
      },
    });
  } catch (error) {
    next(error);
  }
};
