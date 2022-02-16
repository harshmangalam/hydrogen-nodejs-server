const { db } = require("../utils/db");

const { verifyJwtToken } = require("../utils/token.util");

module.exports = async (req, res, next) => {
  try {
    // extract json web token from cookies
    const token = req.cookies.token;
    if (!token) {
      return next({ status: 403, message: "JWT token is missing" });
    }
    // verify jwt token
    const userId = verifyJwtToken(token, next);
    if (!userId) {
      return next({ status: 403, message: "JWT token is invalid" });
    }

    // find user from payload userId
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return next({ status: 404, message: "User does not exists" });
    }

    // store user data in response local object  valid for one req-res cycle
    res.locals.user = user;
    return next();
  } catch (err) {
    next(err);
  }
};
