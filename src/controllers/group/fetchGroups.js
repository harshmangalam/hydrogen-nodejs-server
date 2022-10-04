const { db } = require("../../utils/db");

exports.fetchGroups = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        OR: [
          {
            admin: {
              id: currentUser.id,
            },
          },
          {
            members: {
              some: {
                id: currentUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
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
