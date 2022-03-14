const { db } = require("../../utils/db");

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
