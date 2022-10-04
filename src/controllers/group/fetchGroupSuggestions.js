const { db } = require("../../utils/db");

exports.fetchGroupSuggestions = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        AND: [
          {
            NOT: {
              OR: [
                { adminId: currentUser.id },
                {
                  members: {
                    some: {
                      id: currentUser.id,
                    },
                  },
                },
              ],
            },
          },
          {
            privacy: "PUBLIC",
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
      message: "Fetch groups suggestion",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
