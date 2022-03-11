exports.postInclude = {
  author: {
    select: {
      id: true,
      firstName: true,
      profileImage: true,
    },
  },
  _count: {
    select: {
      likes: true,
      taggedFriends: true,
    },
  },

  taggedFriends: {
    take: 3,
    select: {
      id: true,
      firstName: true,
      profileImage: true,
    },
  },
};
