const { Router } = require("express");

const user = require("./user");

const router = Router();

//User routes
router.use("/user",user)

module.exports = router;