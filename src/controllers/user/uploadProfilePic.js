const { db } = require("../../utils/db");

exports.uploadProfilePic = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { profileImage, coverImage } = req.body;

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        profileImage,
        coverImage,
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Profile pic uploaded successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
