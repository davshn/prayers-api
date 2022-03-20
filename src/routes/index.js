const { Router } = require("express");

const user = require("./user");
const category = require("./category");

const router = Router();

router.use("/user", user);
router.use("/category", category);

module.exports = router;
