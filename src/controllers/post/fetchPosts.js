const { db } = require("../../utils/db");

exports.fetchPosts = async (req, res, next) => {
  try {
    const posts = await db.post.findMany({
      include: {
        author: true,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch posts",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
