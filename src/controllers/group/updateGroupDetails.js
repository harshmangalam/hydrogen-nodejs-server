const { db } = require("../../utils/db");

exports.updateGroupDetails = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const { name } = req.body;

    await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        name,
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Group  updated successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
