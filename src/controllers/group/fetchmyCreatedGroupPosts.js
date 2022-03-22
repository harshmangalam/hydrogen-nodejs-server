const { db } = require("../../utils/db");
const { includeGroupPost, hasLikePost } = require("./_helper");

exports.fetchMyCreatedGroupPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      where: {
        author: {
          id: currentUser.id,
        },
      },
      include: includeGroupPost,
    });

    const postsData = [];

    for await (const post of posts) {
      post.hasLike = await hasLikePost(currentUser.id, post.id);
      postsData.push(post);
    }

    return res.status(200).json({
      type: "success",
      message: "fetch create group posts",
      data: {
        posts: postsData,
      },
    });
  } catch (error) {
    next(error);
  }
};
