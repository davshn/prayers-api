const { Router } = require("express");

const { Prayer } = require("../models/index");
const authenticateProtection = require("../middlewares/authenticateProtection");
const { validateCreation } = require("../middlewares/validators/prayer");

const router = Router();

router.post(
  "/create",
  authenticateProtection,
  validateCreation,
  async (req, res) => {
    try {
      await Prayer.create({
        title: req.body.title,
        text: req.body.text,
        userId: req.body.userId,
        categoryId: req.body.categoryId,
      });

      res.status(200).send("Oracion creada con exito");
    } catch (error) {
      res.status(400).send("Error en la creacion de oracion " + error);
    }
  }
);

module.exports = router;
