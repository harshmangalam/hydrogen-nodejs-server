const { db } = require("../utils/db");

async function deleteAllGroups() {
  try {
    await db.group.deleteMany({});
    console.log("deleted all groups");
  } catch (error) {
    console.log(error);
  }
}

function main() {
    deleteAllGroups();
}

main();
