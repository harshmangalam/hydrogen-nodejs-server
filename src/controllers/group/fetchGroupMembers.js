const { db } = require("../../utils/db");

exports.fetchGroupMembers = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        members: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            status: true,
          },
        },
      },
    });
    if (!group) {
      return next({ status: 404, message: "Group not found" });
    }
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      data: {
        members: group.members,
      },
    });
  } catch (error) {
    next(error);
  }
};
