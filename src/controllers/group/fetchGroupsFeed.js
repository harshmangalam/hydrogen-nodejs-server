const { db } = require("../../utils/db");
const { includeGroupPost, hasLikePost } = require("./_helper");

exports.fetchGroupsFeed = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      where: {
        OR: [
          {
            authorId: currentUser.id,
          },
          {
            group: {
              members: {
                some: {
                  id: currentUser.id,
                },
              },
            },
          },
          {
            group: {
              adminId: currentUser.id,
            },
          },
        ],
      },
      include: includeGroupPost,
      orderBy: {
        updatedAt: "desc",
      },
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await hasLikePost(currentUser.id, post.id);
      postsData.push(post);
    }

    return res.status(200).json({
      type: "success",
      message: "Fetch group feed ",
      data: {
        posts: postsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
