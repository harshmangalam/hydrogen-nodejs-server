const { Router } = require("express");
const { findSearchResults } = require("../controllers/search");

const router = Router();

router.get("/", findSearchResults);

module.exports = router;
