const { Router } = require("express");
const checkAuth = require("../middlewares/auth.middleware");
const { deleteCloudinaryImage } = require("../controllers/post/deletePostImage");
const router = Router();

router.delete("/:imageId", checkAuth, deleteCloudinaryImage);

module.exports = router;
