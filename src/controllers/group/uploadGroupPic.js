const { db } = require("../../utils/db");

exports.uploadGroupPic = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;
    const { profileImage, coverImage } = req.body;

    await db.group.update({
      where: {
        id: groupId,
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
      message: "Group pic uploaded successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
