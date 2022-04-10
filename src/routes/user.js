const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/index");
const verification = require("../microservices/emails/verificationEmail");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const ownUserProtection = require("../middlewares/authentication/ownUserProtection");
const {
  validateRegister,
  validateLogin,
  validateEdit,
} = require("../middlewares/validators/user");

const router = Router();
const { TOKEN_KEY, VERSION } = process.env;

router.post("/register", validateRegister, async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  try {
    const version = req.body.version;

    if (version !== VERSION) {
      res.status(426).send("Actualiza tu aplicacion");
    } else {
      const newUser = await User.create({
        dateOfBirth: req.body.dateOfBirth,
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email.toLowerCase(),
        password: await bcrypt.hash(req.body.password, salt),
      });

      verification(newUser.email);

      res.status(200).send("Usuario creado con exito");
    }
  } catch (error) {
    res.status(400).send("Error en la creacion de usuario " + error);
  }
});

router.post("/login", validateLogin, async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const version = req.body.version;
    const refreshToken = req.body.refreshToken;

    if (version !== VERSION) {
      res.status(426).send("Actualiza tu aplicacion");
    } else {
      const user = await User.findOne({ where: { email } });

      if (user && (await bcrypt.compare(password, user.password))) {
        const token = jwt.sign({ id: user.id, email: user.email }, TOKEN_KEY, {
          expiresIn: "1h",
        });
        await user.set({ refreshToken: refreshToken });
        await user.save();

        user.token = token;
        const loggedUser = {
          token: user.token,
          id: user.id,
        };

        res.status(200).json(loggedUser);
      } else {
        res.status(402).send("Usuario o contraseña incorrectos");
      }
    }
  } catch (error) {
    res.status(400).send("Error en el login" + error);
  }
});

router.get(
  "/info/:userId",
  authenticateProtection,
  ownUserProtection,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findOne({ where: { id: userId } });

      const userInfo = {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        isAutenticated: true,
        createdPrayers: user.createdPrayers,
        createdComments: user.createdComments,
        prayersToCreate: user.prayersToCreate,
      };

      res.status(200).json(userInfo);
    } catch (error) {
      res.status(400).send("Error al obtener datos de usuario");
    }
  }
);

router.patch(
  "/edit/:userId",
  authenticateProtection,
  ownUserProtection,
  validateEdit,
  async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findOne({
        where: { id: userId },
      });

      if (req.body.name) {
        await user.set({
          name: req.body.name,
        });
      }
      if (req.body.lastname) {
        await user.set({
          lastname: req.body.lastname,
        });
      }
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        await user.set({
          password: await bcrypt.hash(req.body.password, salt),
        });
      }
      await user.save();

      res.status(200).send("Usuario modificado");
    } catch (error) {
      res.status(400).send("Error en la edicion de usuario " + error);
    }
  }
);

module.exports = router;
