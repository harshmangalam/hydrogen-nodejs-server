const { db } = require("../utils/db");
const { generateRandomImage } = require("../utils/generateImage");
const { hashPassword } = require("../utils/password.util");

async function createUsers(total) {
  try {
    [...Array(total).keys()].forEach(async (loop) => {
      const password = await hashPassword("123456");
      const email = `test${loop}@gmail.com`;
      const user = await db.user.create({
        data: {
          email: email,
          firstName: `Test${loop}`,
          gender: "MALE",
          password,
          profileImage: generateRandomImage({ str: email }),
          coverImage: generateRandomImage({
            size: 400,
            str: email,
            type: "blank",
          }),
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
