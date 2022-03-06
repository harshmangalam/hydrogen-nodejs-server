const { db } = require("../../utils/db");

exports.fetchGroupsJoined = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            id: currentUser.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch joined groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
