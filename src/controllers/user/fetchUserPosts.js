const { db } = require("../../utils/db");
const { postInclude } = require("./_helper");
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
