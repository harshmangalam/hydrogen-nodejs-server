const {PrismaClient} = require("@prisma/client")

exports.db = new PrismaClient()
