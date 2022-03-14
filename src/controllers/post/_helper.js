const { db } = require("../../utils/db");

exports.hasLikePost = async (userId, postId) => {
  const likes = await db.user.count({
    where: {
      AND: [
        {
          id: userId,
        },
        {
          likePosts: {
            some: {
              id: postId,
            },
          },
        },
      ],
    },
  });

  return likes ? true : false;
};

exports.include = {
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
