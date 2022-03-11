const { checkPassword, hashPassword } = require("../../utils/password.util");
const { db } = require("../../utils/db");
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const currentUser = res.locals.user;
    const user = await db.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        password:true,
      },
    });
    const matchPassword = await checkPassword(currentPassword, user.password);
    if (!matchPassword) {
      return next({ status: 400, message: "Current password is incorrect." });
    }
    const hashPwd = await hashPassword(newPassword);
    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        password: hashPwd,
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Password updated successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
