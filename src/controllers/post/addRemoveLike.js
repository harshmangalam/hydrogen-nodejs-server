const { db } = require("../../utils/db");

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
