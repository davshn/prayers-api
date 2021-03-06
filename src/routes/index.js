const { Router } = require("express");

const user = require("./user");
const category = require("./category");
const prayer = require("./prayer");
const comment = require("./comment");

const router = Router();

router.use("/user", user);
router.use("/category", category);
router.use("/prayer", prayer);
router.use("/comment", comment);

module.exports = router;
