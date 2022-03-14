const { db } = require("../../utils/db");

exports.fetchPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }

    return res.status(200).json({
      type: "success",
      message: "Fetch post",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};
