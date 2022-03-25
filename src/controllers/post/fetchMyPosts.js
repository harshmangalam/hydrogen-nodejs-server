const { db } = require("../../utils/db");
const { include } = require("./_helper");
exports.fetchMyPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.post.findMany({
      where: {
        authorId: currentUser.id,
      },
      include,
      orderBy: {
        createdAt: "desc",
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
