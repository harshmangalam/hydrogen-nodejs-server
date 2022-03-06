const { db } = require("../../utils/db");

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
          {},
        ],
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
      orderBy: {
        updatedAt: "desc",
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch group feed ",
      data: {
        posts,
      },
    });
  } catch (error) {
    next(error);
  }
};
