const { Router } = require("express");
const { Op } = require("sequelize");

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

router.get("/getown/:userId", authenticateProtection, async (req, res) => {
  try {
    const userId = req.params.userId;

    const ownPrayers = await Prayer.findAll({ where: { userId: userId } });

    res.status(200).send(ownPrayers);
  } catch (error) {
    res.status(400).send("Error en la busqueda de oraciones " + error);
  }
});

router.get("/getall/:userId", authenticateProtection, async (req, res) => {
  try {
    const userId = req.params.userId;

    const allPrayers = await Prayer.findAll({
      where: { userId: { [Op.ne]: userId } },
    });

    res.status(200).send(allPrayers);
  } catch (error) {
    res.status(400).send("Error en la busqueda de oraciones " + error);
  }
});

module.exports = router;
