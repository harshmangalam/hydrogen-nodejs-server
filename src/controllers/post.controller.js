const { db } = require("../utils/db");

exports.fetchPosts = async (req, res, next) => {
  try {
    const posts = await db.post.findMany();
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

exports.fetchPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }
    
    return res.status(200).json({
      type: "success",
      message: "Fetch post",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createPost = async (req, res, next) => {
  console.log(req.body)
  const userId = res.locals.user.id;
  const {
    content,
    audience,
    specificAudienceFriends = [],
    images = [],
    feeling,
    gif,
    checkIn,
    taggedFriends = [],
  } = req.body;
  try {
    const post = await db.post.create({
      data: {
        content,
        images,
        feeling,
        gif,
        checkIn,
        audience,
        author: {
          connect: {
            id: userId,
          },
        },
        taggedFriends: taggedFriends?.length
          ? {
              connect: taggedFriends.map((id) => ({
                id,
              })),
            }
          : undefined,
        specificAudienceFriends: specificAudienceFriends?.length
          ? {
              connect: specificAudienceFriends.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Post created successfully",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const userId = res.locals.user.id;
  const postId = req.params.postId;
  try {
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return next({ status: 401, message: "Unauthorized access denied" });
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Post removed successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
