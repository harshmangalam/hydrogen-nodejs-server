const { db } = require("../../utils/db");

exports.deletePost = async (req, res, next) => {
  const userId = res.locals.user.id;
  const postId = req.params.postId;
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return next({ status: 401, message: "Unauthorized access denied" });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Post removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
