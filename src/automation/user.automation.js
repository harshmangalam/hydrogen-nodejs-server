const { db } = require("../utils/db");
const { generateRandomImage } = require("../utils/generateImage");

async function updateUserProfilePic() {
  try {
    const users = await db.user.findMany();
    users.forEach(async (user) => {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          profileImage: generateRandomImage({ str: user.email }),
          coverImage: generateRandomImage({
            str: user.email,
            type: "blank",
            size: 400,
          }),
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function main() {
  updateUserProfilePic();
}

main();
