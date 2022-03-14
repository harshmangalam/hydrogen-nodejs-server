const { db } = require("../../utils/db");
const { hasLikePost, include } = require("./_helper");
exports.fetchFeedPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.post.findMany({
      where: {
        OR: [
          {
            author: {
              myFriends: {
                some: {
                  id: currentUser.id,
                },
              },
            },
          },
          {
            author: {
              id: currentUser.id,
            },
          },
        ],
      },
      orderBy: {
        updatedAt: "desc",
      },
      include,
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await hasLikePost(currentUser.id, post.id);
      postsData.push(post);
    }

    return res.status(200).json({
      type: "success",
      message: "fetch feed posts",
      data: { posts: postsData },
    });
  } catch (error) {
    next(error);
  }
};
