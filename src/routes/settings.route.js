const {Router} = require('express')
const { fetchAccountLoggedin,removeAccountLoggedin } = require('../controllers/settings')
const checkAuth= require("../middlewares/auth.middleware")
const router = Router()

router.get("/accounts_loggedin",checkAuth,fetchAccountLoggedin)
router.delete("/accounts_loggedin",checkAuth,removeAccountLoggedin)

module.exports = router