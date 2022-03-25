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
      switch (post.audience) {
        case "PUBLIC":
          postsData.push(post);
          break;

        case "ONLY_ME":
          if (post.authorId === currentUser.id) {
            postsData.push(post);
          }
          break;

        case "SPECIFIC":
          post.specificAudienceFriends.forEach((u) => {
            if (u.id === currentUser.id || currentUser.id === post.authorId) {
              postsData.push(post);
            }
          });
          break;

        case "FRIENDS":
          const friends = await db.user.findUnique({
            where: { id: post.authorId },
            select: {
              myFriends: {
                select: {
                  id: true,
                },
              },
            },
          });

          const index = friends.myFriends.findIndex(
            (u) => u.id === currentUser.id
          );
          if (index >= 0 || post.authorId === currentUser.id) {
            postsData.push(post);
          }
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
