const { Router } = require("express");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

const { User, Prayer, Comment } = require("../models/index");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const {
  validateCreation,
  validateEdit,
} = require("../middlewares/validators/prayer");
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
        createdPrayers: user.createdPrayers + 1,
      });
      await user.save();

      await Prayer.create({
        title: req.body.title,
        text: req.body.text,
        userId: userId,
        categoryId: req.body.categoryId,
        profileImage: req.body.profileImage,
      });

      res.status(200).send("Oracion creada con exito");
    } catch (error) {
      res.status(400).send("Error en la creacion de oracion " + error);
    }
  }
);

router.get("/getown", authenticateProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const size = req.query.size;
    const page = req.query.page;

    const { limit, offset } = getPagination(page, size);

    const ownPrayers = await Prayer.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ["id", "title", "text", "profileImage", "updatedAt"],
      where: { userId: userId },
      order: [["updatedAt", "DESC"]],
    });

    const response = getPagingData(ownPrayers, page, limit);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send("Error en la busqueda de oraciones " + error);
  }
});

router.get("/getall", authenticateProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const size = req.query.size;
    const page = req.query.page;

    const { limit, offset } = getPagination(page, size);

    const allPrayers = await Prayer.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ["id", "title", "text", "profileImage", "updatedAt"],
      where: sequelize.literal(
        `"userId" != '${userId}' AND ID NOT IN (SELECT "prayerId" FROM supportedby WHERE "userId" = '${userId}')`
      ),
      order: [["updatedAt", "DESC"]],
    });

    const response = getPagingData(allPrayers, page, limit);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send("Error en la busqueda de oraciones " + error);
  }
});

router.get("/getsupported", authenticateProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const size = req.query.size;
    const page = req.query.page;

    const { limit, offset } = getPagination(page, size);

    const suportedPrayers = await Prayer.findAndCountAll({
      limit: limit,
      offset: offset,
      attributes: ["id", "title", "text", "profileImage", "updatedAt"],
      where: { userId: { [Op.ne]: userId } },
      include: [
        {
          model: User,
          as: "supported",
          where: { id: userId },
          attributes: [],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    const response = getPagingData(suportedPrayers, page, limit);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send("Error en la busqueda de oraciones " + error);
  }
});

router.get("/detailed/:prayerId", authenticateProtection, async (req, res) => {
  try {
    const prayerId = req.params.prayerId;

    const prayer = await Prayer.findOne({
      attributes: [
        "id",
        "title",
        "text",
        "profileImage",
        "supporters",
        "categoryId",
      ],
      where: { id: prayerId },
      include: [
        {
          model: Comment,
          attributes: ["id", "text"],
        },
      ],
    });

    res.status(200).send(prayer);
  } catch (error) {
    res.status(400).send("La Oracion no existe " + error);
  }
});

router.patch(
  "/edit/:prayerId",
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
        if (req.body.text) {
          await prayer.set({
            text: req.body.text,
          });
        }

        if (req.body.profileImage) {
          await prayer.set({
            profileImage: req.body.profileImage,
          });
        }

        await prayer.save();

        res.status(200).send("Oracion modificada");
      } else res.status(409).send("La oracion no pertenece al usuario");
    } catch (error) {
      res.status(400).send("Error en la modificacion de la oracion " + error);
    }
  }
);

router.put("/support/:prayerId", authenticateProtection, async (req, res) => {
  try {
    const prayerId = req.params.prayerId;
    const userId = req.user.id;

    const prayer = await Prayer.findOne({ where: { id: prayerId } });

    if (prayer.userId === userId) {
      res.status(403).send("No puedes apoyar tus propias oraciones");
    } else {
      const user = await User.findOne({ where: { id: userId } });
      const support = await prayer.addSupported(user);
      if (support) {
        await prayer.set({ supporters: prayer.supporters + 1 });
        await prayer.save();
        res.status(200).send("Oracion apoyada con exito");
      } else {
        res.status(400).send("Ya apoyaste esta oracion");
      }
    }
  } catch (error) {
    res.status(400).send("La Oracion no existe " + error);
  }
});

router.put("/unsupport/:prayerId", authenticateProtection, async (req, res) => {
  try {
    const prayerId = req.params.prayerId;
    const userId = req.user.id;

    const prayer = await Prayer.findOne({ where: { id: prayerId } });

    if (prayer.userId === userId) {
      res
        .status(403)
        .send("No puedes eliminar el apoyo de tus propias oraciones");
    } else {
      const user = await User.findOne({ where: { id: userId } });
      const unsupported = await prayer.removeSupported(user);
      if (unsupported !== 0) {
        await prayer.set({ supporters: prayer.supporters - 1 });
        await prayer.save();
        res.status(200).send("Dejaste de apoyar la oracion");
      } else {
        res.status(400).send("No estabas apoyando esta oracion");
      }
    }
  } catch (error) {
    res.status(400).send("La Oracion no existe " + error);
  }
});

router.delete(
  "/delete/:prayerId",
  authenticateProtection,

  async (req, res) => {
    try {
      const prayerId = req.params.prayerId;
      const userId = req.user.id;
      const prayer = await Prayer.findOne({
        where: { id: prayerId },
      });

      if (userId === prayer.userId) {
        await prayer.destroy({
          where: { id: prayerId },
        });
        await Comment.destroy({
          where: { prayerId: null },
        });
        res.status(200).send("Oracion borrada");
      } else res.status(409).send("La oracion no pertenece al usuario");
    } catch (error) {
      res.status(400).send("Error en el borrado de la oracion " + error);
    }
  }
);

module.exports = router;
