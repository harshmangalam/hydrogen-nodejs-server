const { db } = require("../../utils/db");

exports.addRemoveGroupPostLike = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const currentUser = res.locals.user;

    // check post exists ?
    const post = await db.groupPost.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      return next({ status: 404, message: "Group Post not found" });
    }

    // is already like ?
    const hasLike = await db.groupPost.findFirst({
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
      await db.groupPost.update({
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
        message: "You`ve removed like from group post",
        data: null,
      });
    } else {
      // add like
      await db.groupPost.update({
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
        message: "You`ve liked the group post",
        data: null,
      });
    }
  } catch (error) {
    next(error);
  }
};
