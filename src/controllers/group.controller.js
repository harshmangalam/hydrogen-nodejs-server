const { db } = require("../utils/db");

const fetchGroupSuggestions = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        NOT: {
          OR: [
            { adminId: currentUser.id },
            {
              members: {
                some: {
                  id: currentUser.id,
                },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchMyCreatedGroupPosts = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
      where: {
        author: {
          id: currentUser.id,
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
const fetchMyCreatedGroups = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        admin: {
          id: currentUser.id,
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch my created groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupsInvited = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        invitedPeople: {
          some: {
            id: currentUser.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch groups invited",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupNotifications = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
const fetchGroupsFeed = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const posts = await db.groupPost.findMany({
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
          },
        },
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
const fetchGroupsJoined = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groups = await db.group.findMany({
      where: {
        members: {
          some: {
            id: currentUser.id,
          },
        },
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        _count: {
          select: {
            members: true,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Fetch joined groups",
      data: {
        groups,
      },
    });
  } catch (error) {
    next(error);
  }
};
const createGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const {
      name,
      coverImage,
      profileImage,
      privacy,
      invitedPeople = [],
    } = req.body;

    console.log(privacy);
    const group = await db.group.create({
      data: {
        name,
        coverImage,
        profileImage,
        privacy,
        admin: {
          connect: {
            id: currentUser.id,
          },
        },
        invitedPeople: invitedPeople.length
          ? {
              connect: invitedPeople.map((id) => ({
                id,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    return res.status(201).json({
      type: "success",
      message: "Group created successfully",
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};
const createGroupPost = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const { content, image, groupId } = req.body;
    const post = await db.groupPost.create({
      data: {
        content,
        image,
        author: {
          connect: {
            id: currentUser.id,
          },
        },
        group: {
          connect: {
            id: groupId,
          },
        },
      },
    });

    return res.status(200).json({
      type: "success",
      message: "Group post created. Will publish when approve from group admin",
      data: {
        post,
      },
    });
  } catch (error) {
    next(error);
  }
};
const fetchGroupDetails = async (req, res, next) => {
  try {
    const groupId = req.params.groupId;
    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        name: true,
        privacy: true,
        coverImage: true,
        profileImage: true,

        _count: {
          select: {
            members: true,
          },
        },
      },
    });
    if (!group) {
      return next({ status: 404, message: "Group not found" });
    }
    return res.status(200).json({
      type: "success",
      message: "Fetch groups suggestion",
      data: {
        group,
      },
    });
  } catch (error) {
    next(error);
  }
};
const joinGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;
    const findGroup = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
      },
    });

    if (!findGroup) {
      return next({ status: 404, message: "Group not found" });
    }

    const alreadyMember = await db.group.findFirst({
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

    if (alreadyMember) {
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
          connect: {
            id: currentUser.id,
          },
        },
      },
    });
    return res.status(201).json({
      type: "success",
      message: "Group joined successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
const leaveGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;
    const findGroup = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
      },
    });

    if (!findGroup) {
      return next({ status: 404, message: "Group not found" });
    }

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
    });

    if (!isMember) {
      return next({
        status: 400,
        message: "Yoy are not the member of this group",
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
      },
    });
    return res.status(201).json({
      type: "success",
      message: "Group left successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
const deleteGroup = async (req, res, next) => {
  try {
    const currentUser = res.locals.user;
    const groupId = req.params.groupId;

    const group = await db.group.findUnique({
      where: {
        id: groupId,
      },
      select: {
        id: true,
        adminId,
      },
    });

    if (!group) {
      return next({ status: 404, message: "Group not found" });
    }

    const isGroupAdmin = group.adminId === currentUser.id;
    if (!isGroupAdmin) {
      return next({
        status: 401,
        message: "Yo`re not the admin of this group",
      });
    }

    await db.group.delete({
      where: {
        id: groupId,
      },
    });
    return res.status(201).json({
      type: "success",
      message: "Group deleted successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  fetchGroupSuggestions,
  createGroup,
  createGroupPost,
  fetchMyCreatedGroups,
  fetchGroupsInvited,
  fetchMyCreatedGroupPosts,
  fetchGroupNotifications,
  fetchGroupsFeed,
  fetchGroupsJoined,
  fetchGroupDetails,

  joinGroup,
  leaveGroup,
  deleteGroup,
};
