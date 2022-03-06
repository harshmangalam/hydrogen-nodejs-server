const { db } = require("../../utils/db");

exports.fetchGroupDetails = async (req, res, next) => {
    try {
      const groupId = req.params.groupId;
      const group = await db.group.findUnique({
        where: {
          id: groupId,
        },
        select: {
          id: true,
          name: true,
          privacy: true,
          coverImage: true,
          profileImage: true,
  
          _count: {
            select: {
              members: true,
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
          group,
        },
      });
    } catch (error) {
      next(error);
    }
  };