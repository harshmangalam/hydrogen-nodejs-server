const { db } = require("../../utils/db");
exports.deleteComment = async (req, res, next) => {
  try {
    const commentId = req.params.commentId;

    const comment = await db.comment.delete({
      where: {
        id: commentId,
      },
      select: {
        id: true,
      },
    });

    return res.status(201).json({
      type: "success",
      message: "Comment deleted",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
