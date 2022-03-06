exports.rejectGroupInvitation = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;

    // check is invited
    const isInvited = await db.group.findFirst({
      where: {
        AND: [
          {
            id: groupId,
          },
          {
            invitedPeople: {
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

    console.log(isInvited);

    if (!isInvited) {
      return next({
        status: 400,
        message: "You are not invited by group admin",
      });
    }

    // check is already member
    const isMember = await db.group.findFirst({
      where: {
        AND: [
          {
            id: groupId,
          },
          {
            members: {
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

    console.log(isMember);

    if (isMember) {
      return next({
        status: 400,
        message: "You are already member of this group",
      });
    }

    await db.group.update({
      where: {
        id: groupId,
      },
      data: {
        members: {
          disconnect: {
            id: currentUser.id,
          },
        },
        invitedPeople: {
          disconnect: {
            id: currentUser.id,
          },
        },
      },
    });

    return res.status(201).json({
      type: "success",
      message: "You have rejected group invitation",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
