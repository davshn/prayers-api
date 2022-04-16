const { Router } = require("express");
const { Op } = require("sequelize");

const { User, Prayer, Comment } = require("../models/index");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const {
  validateCreation,
  validateEdit,
} = require("../middlewares/validators/prayer");

const router = Router();

router.post(
  "/create",
  authenticateProtection,
  validateCreation,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findOne({ where: { id: userId } });

      if (user.prayersToCreate > 0) {
        await user.set({
          prayersToCreate: user.prayersToCreate - 1,
          createdPrayers: user.createdPrayers + 1,
        });
        await user.save();

        await Prayer.create({
          title: req.body.title,
          text: req.body.text,
          userId: req.params.userId,
          categoryId: req.body.categoryId,
        });
        res.status(200).send("Oracion creada con exito");
      } else {
        res.status(402).send("No puedes crear mas oraciones");
      }
    } catch (error) {
      res.status(400).send("Error en la creacion de oracion " + error);
    }
  }
);

router.get(
  "/getown",
  authenticateProtection,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const ownPrayers = await Prayer.findAll({ where: { userId: userId } });

      res.status(200).send(ownPrayers);
    } catch (error) {
      res.status(400).send("Error en la busqueda de oraciones " + error);
    }
  }
);

router.get(
  "/getall",
  authenticateProtection,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const allPrayers = await Prayer.findAll({
        where: { userId: { [Op.ne]: userId } },
      });

      res.status(200).send(allPrayers);
    } catch (error) {
      res.status(400).send("Error en la busqueda de oraciones " + error);
    }
  }
);

router.get(
  "/getsupported",
  authenticateProtection,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const suportedPrayers = await Prayer.findAll({
        where: { userId: { [Op.ne]: userId } },
      });

      res.status(200).send(suportedPrayers);
    } catch (error) {
      res.status(400).send("Error en la busqueda de oraciones " + error);
    }
  }
);

router.get(
  "/detailed/:prayerId",
  authenticateProtection,
  async (req, res) => {
    try {
      const prayerId = req.params.prayerId;

      const prayer = await Prayer.findOne({
        where: { id: prayerId },
        include: Comment,
      });

      res.status(200).send(prayer);
    } catch (error) {
      res.status(400).send("La Oracion no existe " + error);
    }
  }
);

router.patch(
  "/edit",
  authenticateProtection,
  validateEdit,
  async (req, res) => {
    try {
      const prayerId = req.params.prayerId;
      const userId = req.user.id;

      const prayer = await Prayer.findOne({
        where: { id: prayerId },
      });

      if (userId === prayer.userId) {
        await prayer.set({
          text: req.body.text,
        });
        await prayer.save();

        res.status(200).send("Oracion modificada");
      } else res.status(409).send("La oracion no pertenece al usuario");
    } catch (error) {
      res.status(400).send("Error en la modificacion de la oracion " + error);
    }
  }
);

module.exports = router;
