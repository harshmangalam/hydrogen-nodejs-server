const { db } = require("../../utils/db");

exports.fetchMyCreatedGroups = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        admin: {
          id: currentUser.id,
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        createdAt: true,
        admin: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
          },
        },
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch my created groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
