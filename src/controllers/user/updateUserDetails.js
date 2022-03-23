const { checkPassword, hashPassword } = require("../../utils/password.util");
const { db } = require("../../utils/db");
exports.updateUserDetails = async (req, res, next) => {
  try {
    const { firstName, lastName, email, gender } = req.body;
    const currentUser = res.locals.user;

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        firstName,
        lastName,
        email,
        gender,
      },
    });
    return res.status(200).json({
      type: "success",
      message: "User details updated successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
