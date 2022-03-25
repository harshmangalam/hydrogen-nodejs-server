const { db } = require("../../utils/db");
const { hasLikePost, include } = require("./_helper");
exports.fetchFriendsPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.post.findMany({
      where: {
        author: {
          myFriends: {
            some: {
              id: currentUser.id,
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include,
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await hasLikePost(currentUser.id, post.id);

      switch (post.audience) {
        case "FRIENDS":
          postsData.push(post);
          break;

        case "PUBLIC":
          postsData.push(post);
          break;

        case "SPECIFIC":
          post.specificAudienceFriends.forEach((u) => {
            if (u.id === currentUser.id) {
              postsData.push(post);
            }
          });
          break;
      }
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
