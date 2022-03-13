const { db } = require("../../utils/db");

exports.findSearchResults = async (req, res, next) => {
  const search = req.query.q;
  try {
    const users = await db.user.findMany({
      where: {
        OR: [
          {
            firstName: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
      },
      select: {
        id: true,
        firstName: true,
        profileImage: true,
      },
      take: 6,
    });

    return res.status(200).json({
      type: "success",
      message: "fetch search results",
      data: {
        users,
      },
    });
  } catch (error) {
    next(error);
  }
};
