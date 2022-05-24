const { Router } = require("express");

const { User, Comment, Prayer } = require("../models/index");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const {
  validateCreation,
  validateEdit,
} = require("../middlewares/validators/comment");
const { getPagination, getPagingData } = require("../microservices/pagination");

const router = Router();

router.post(
  "/create",
  authenticateProtection,
  validateCreation,
  async (req, res) => {
    try {
      const userId = req.user.id;

      const user = await User.findOne({ where: { id: userId } });

      await user.set({
        createdComments: user.createdComments + 1,
      });
      await user.save();

      await Comment.create({
        text: req.body.text,
        userId: userId,
        prayerId: req.body.prayerId,
      });
      res.status(200).send("Comentario creado con exito");
    } catch (error) {
      res.status(400).send("Error en la creacion del comentario " + error);
    }
  }
);

router.get("/getown", authenticateProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const size = req.query.size;
    const page = req.query.page;

    const { limit, offset } = getPagination(page, size);

    const ownComments = await Comment.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ["id", "text", "prayerId", "updatedAt"],
      where: { userId: userId },
      include: [
        {
          model: Prayer,
          attributes: ["title"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const response = getPagingData(ownComments, page, limit);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send("Error en la busqueda de comentarios " + error);
  }
});

router.patch(
  "/edit/:commentId",
  authenticateProtection,
  validateEdit,
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id: commentId },
      });

      if (userId === comment.userId) {
        await comment.set({
          text: req.body.text,
        });
        await comment.save();

        res.status(200).send("Comentario modificado");
      } else res.status(409).send("El comentario no pertenece al usuario");
    } catch (error) {
      res.status(400).send("Error en la modificacion del comentario " + error);
    }
  }
);

router.delete(
  "/delete/:commentId",
  authenticateProtection,
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user.id;

      const comment = await Comment.findOne({
        where: { id: commentId },
      });

      if (userId === comment.userId) {
        await comment.destroy({
          where: { id: commentId },
        });

        res.status(200).send("Comentario borrado con exito");
      } else res.status(409).send("El comentario no pertenece al usuario");
    } catch (error) {
      res.status(400).send("Error en el borrado del comentario " + error);
    }
  }
);

module.exports = router;
