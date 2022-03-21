const { db } = require("../../utils/db");
exports.fetchComments = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            profileImage: true,
          },
        },
      },
      orderBy:{
        createdAt:"desc"
      }
    });

    return res.status(200).json({
      type: "success",
      message: "fetch post comments",
      data: {
        comments,
      },
    });
  } catch (error) {
    next(error);
  }
};
