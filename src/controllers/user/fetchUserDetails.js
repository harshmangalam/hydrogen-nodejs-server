const { db } = require("../../utils/db");

exports.fetchUserDetails = async (req, res, next) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id: req.params.userId,
      },
      select: {
        id: true,
        coverImage: true,
        firstName: true,
        lastName: true,
        status: true,
        lastSeen: true,
        profileImage: true,
        _count: {
          select: {
            myFriends: true,
          },
        },
        myFriends: {
          take: 3,
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch user details",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
