const { db } = require("../../utils/db");
exports.fetchLoginHistory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const loginHistory = await db.loginHistory.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch account loggedin list",
      data: {
        loginHistory,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeLoginHistory = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const data = await db.loginHistory.deleteMany({
      where: {
        AND: [
          {
            userId: currentUser.id,
          },
          {
            isCurrent: false,
          },
        ],
      },
    });

    if(!data?.count){
      return next({status:404,message:"Already cleared"})
    }

    return res.status(200).json({
      type: "success",
      message: "clear account login history",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
