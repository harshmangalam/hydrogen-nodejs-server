const { db } = require("../utils/db");

const author = {
  select: {
    id: true,
    firstName: true,
    profileImage: true,
  },
};

const _count = {
  select: {
    likes: true,
  },
};

exports.fetchPosts = async (req, res, next) => {
  try {
    const posts = await db.post.findMany({
      include: {
        author,
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
  const currentUser = res.locals.user;
  const {
    content,
    audience,
    specificAudienceFriends = [],
    image,
    feeling,
    checkIn,
    taggedFriends = [],
  } = req.body;
  try {
    const post = await db.post.create({
      data: {
        content,
        image,
        feeling,
        checkIn,
        audience,
        author: {
          connect: {
            id: currentUser.id,
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

exports.fetchTrendingPosts = async (req, res, next) => {
  try {
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

      include: {
        author,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch trending posts",
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

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
      include: {
        author,
        _count,
      },
    });

    

    return res.status(200).json({
      type: "success",
      message: "fetch feed posts",
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

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
      include: {
        author,
      },
    });

    return res.status(200).json({
      type: "success",
      message: "fetch feed posts",
      data: { posts },
    });
  } catch (error) {
    next(error);
  }
};

exports.addRemoveLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const currentUser = res.locals.user;

    // check post exists ?
    const post = await db.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Post not found" });
    }

    // is already like ?
    const hasLike = await db.post.findFirst({
      where: {
        AND: [
          { id: postId },
          {
            likes: {
              some: {
                id: currentUser.id,
              },
            },
          },
        ],
      },
      select: {
        id: true,
      },
    });

    // if liked remove like
    if (hasLike) {
      await db.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            disconnect: {
              id: currentUser.id,
            },
          },
        },
      });

      return res.status(200).json({
        type: "success",
        message: "You`ve removed like from post",
        data: null,
      });
    } else {
      // add like
      await db.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });

      return res.status(200).json({
        type: "success",
        message: "You`ve liked the post",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
