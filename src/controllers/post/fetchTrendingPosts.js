const { db } = require("../../utils/db");
const { include } = require("./_helper");
exports.fetchTrendingPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          likes: {
            _count: "desc",
          },
        },
      ],

      include,
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await _hasLikePost(currentUser.id, post.id);
      postsData.push(post);
    }

    return res.status(200).json({
      type: "success",
      message: "fetch trending posts",
      data: { posts: postsData },
    });
  } catch (error) {
    next(error);
  }
};
