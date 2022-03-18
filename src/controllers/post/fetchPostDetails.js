const { db } = require("../../utils/db");

exports.fetchPostDetails = async (req, res, next) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id: req.params.postId,
      },
      include: {
        author: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
          },
        },
        specificAudienceFriends: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
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
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }

    return res.status(200).json({
      type: "success",
      message: "fetch post details",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};
