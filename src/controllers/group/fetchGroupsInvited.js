const { db } = require("../../utils/db");

exports.fetchGroupsInvited = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        invitedPeople: {
          some: {
            id: currentUser.id,
          },
        },
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
      message: "Fetch groups invited",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
