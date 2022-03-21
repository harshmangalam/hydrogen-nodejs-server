const { db } = require("../../utils/db");
exports.createComment = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
    const postId = req.params.postId;
    const { content } = req.body;
    const comment = await db.comment.create({
      data: {
        content,
        postId,
        userId,
      },
    });

    return res.status(201).json({
      type: "success",
      message: "Comments added",
      data: {
        comment,
      },
    });
  } catch (error) {
    next(error);
  }
};
