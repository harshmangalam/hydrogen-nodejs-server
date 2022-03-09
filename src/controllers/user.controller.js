const { db } = require("../utils/db");
exports.uploadProfilePic = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { profileImage, coverImage } = req.body;

    await db.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        profileImage,
        coverImage,
      },
      select: {
        id: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Profile pic uploaded successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

const postInclude = {
  author: {
    select: {
      id: true,
      firstName: true,
      profileImage: true,
    },
  },
  _count: {
    select: {
      likes: true,
      taggedFriends: true,
    },
  },

  taggedFriends: {
    take: 3,
    select: {
      id: true,
      firstName: true,
      profileImage: true,
    },
  },
};

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
            status:true,
            lastSeen:true,
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

exports.fetchUserPosts = async (req, res, next) => {
  try {
    const posts = await db.post.findMany({
      where: {
        authorId: req.params.userId,
      },
      include: postInclude,
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch user posts",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
