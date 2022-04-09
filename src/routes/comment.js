const { Router } = require("express");

const { User, Comment, Prayer } = require("../models/index");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const ownUserProtection = require("../middlewares/authentication/ownUserProtection");
const { validateCreation } = require("../middlewares/validators/comment");

const router = Router();

router.post(
  "/create/:userId",
  authenticateProtection,
  ownUserProtection,
  validateCreation,
  async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findOne({ where: { id: userId } });

      await user.set({
        createdComments: user.createdComments + 1,
      });
      await user.save();

      await Comment.create({
        text: req.body.text,
        userId: req.params.userId,
        prayerId: req.body.prayerId,
      });
      res.status(200).send("Comentario creado con exito");
    } catch (error) {
      res.status(400).send("Error en la creacion de comentario " + error);
    }
  }
);

router.get(
  "/getown/:userId",
  authenticateProtection,
  ownUserProtection,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const ownComments = await Comment.findAll({
        where: { userId: userId },
        include: Prayer,
      });

      res.status(200).send(ownComments);
    } catch (error) {
      res.status(400).send("Error en la busqueda de comentarios " + error);
    }
  }
);

module.exports = router;
