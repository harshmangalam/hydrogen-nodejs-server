const { db } = require("../../utils/db");

exports.fetchFriends = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;

    const user = await db.user.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        myFriends: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
            status: true,
            lastSeen: true,
            _count: {
              select: {
                myFriends: true,
              },
            },
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch user friends",
      data: {
        users: user.myFriends,
      },
    });
  } catch (error) {
    next(error);
  }
};
