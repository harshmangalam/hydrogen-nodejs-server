const { db } = require("../utils/db");
const { generateRandomImage } = require("../utils/generateImage");
const { hashPassword } = require("../utils/password.util");

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

async function createUsers(total) {
  try {
    [...Array(total).keys()].forEach(async (loop) => {
      const password = await hashPassword("123456");
      const user = await db.user.create({
        data: {
          email: `user${loop}@gmail.com`,
          firstName: `User${loop}`,
          lastName: "attacker",
          gender: "MALE",
          password,
          profileImage:
            "https://images.unsplash.com/photo-1646667061864-55815a43fb71?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
          coverImage:
            "https://images.unsplash.com/photo-1646724034761-08e9667ba90d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60",
        },
      });

      console.log(`${user.firstName} created successfully`);
    });
  } catch (error) {
    console.log(error);
  }
}

async function removeAllUsers() {
  try {
    await db.user.deleteMany({});
  } catch (error) {
    console.log(error);
  }
}
function main() {
  // updateUserProfilePic();
  // removeAllUsers();
  createUsers(10);
}

main();
