const { db } = require("../../utils/db");
exports.fetchAccountLoggedin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const accountsLoggedin = await db.accountLoggedin.findMany({
      where: {
        userId: currentUser.id,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch account loggedin list",
      data: {
        accountsLoggedin,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.removeAccountLoggedin = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    await db.accountLoggedin.deleteMany({
      where: {
        userId: currentUser.id,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "clear account loggedin list",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
