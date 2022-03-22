const { db } = require("../../utils/db");

exports.removeGroupPost = async (req, res, next) => {
  const userId = res.locals.user.id;
  const postId = req.params.postId;
  try {
    const post = await db.groupPost.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Group Post not found" });
    }

    if (post.authorId !== userId) {
      return next({ status: 401, message: "Unauthorized access denied" });
    }

    await db.groupPost.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Group Post removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
