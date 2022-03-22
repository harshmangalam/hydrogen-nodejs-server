const { db } = require("../../utils/db");

exports.fetchPostLikesUser = async (req, res, next) => {
  try {
    const post = await db.post.findUnique({
      where: {
        id: req.params.postId,
      },
      select: {
        likes: {
          select: {
            id: true,
            profileImage: true,
            firstName: true,
            status: true,
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
        users: post.likes,
      },
    });
  } catch (error) {
    next(error);
  }
};
