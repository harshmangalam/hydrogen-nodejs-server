const { db } = require("../utils/db");

async function deleteAllPosts() {
  try {
    await db.post.deleteMany({});
    console.log("deleted all posts");
  } catch (error) {
    console.log(error);
  }
}

function main() {
  deleteAllPosts();
}

main();
