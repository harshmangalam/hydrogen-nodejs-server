const { db } = require("../../utils/db");
const { include, hasLikePost } = require("./_helper");
exports.fetchTrendingPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.post.findMany({
      orderBy: [
        {
          likes: {
            _count: "desc",
          },
        },
        {
          createdAt: "desc",
        },
      ],

      include,
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await hasLikePost(currentUser.id, post.id);
      if (post.audience === "PUBLIC") {
        postsData.push(post);
      }
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
