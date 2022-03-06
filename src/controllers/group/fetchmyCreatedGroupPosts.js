const { db } = require("../../utils/db");

exports.fetchMyCreatedGroupPosts = async (req, res, next) => {
    try {
      const currentUser = res.locals.user;
      const posts = await db.groupPost.findMany({
        where: {
          author: {
            id: currentUser.id,
          },
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              firstName: true,
              profileImage: true,
            },
          },
          image: true,
          group: {
            select: {
              id: true,
              name: true,
              profileImage: true,
              privacy: true,
            },
          },
        },
      });
  
      return res.status(200).json({
        type: "success",
        message: "fetch create group posts",
        data: {
          posts,
        },
      });
    } catch (error) {
      next(error);
    }
  };