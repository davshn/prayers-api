const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/index");
const verification = require("../microservices/emails/verificationEmail");
const authenticateProtection = require("../middlewares/authentication/authenticateProtection");
const refreshTokenProtection = require("../middlewares/authentication/refreshTokenProtection");
const versionProtection = require("../middlewares/authentication/versionProtection");

const {
  validateRegister,
  validateLogin,
  validateEdit,
} = require("../middlewares/validators/user");

const router = Router();
const { TOKEN_KEY, VERSION } = process.env;

router.post("/register", versionProtection, validateRegister, async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newUser = await User.create({
      dateOfBirth: new Date(req.body.dateOfBirth),
      name: req.body.name,
      lastname: req.body.lastname,
      email: req.body.email.toLowerCase(),
      password: await bcrypt.hash(req.body.password, salt),
    });

    verification(newUser.email);

    res.status(200).send("Usuario creado con exito");

  } catch (error) {
    res.status(400).send("Error en la creacion de usuario " + error);
  }
});

router.post("/login", versionProtection, validateLogin, async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    const deviceInfo = req.body.deviceInfo;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const salt = await bcrypt.genSalt(10);
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          deviceInfo: await bcrypt.hash(deviceInfo, salt),
        },
        TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      await user.set({ deviceInfo: deviceInfo });
      await user.save();

      user.token = token;
      const loggedUser = {
        token: user.token,
      };

      res.status(200).json(loggedUser);
    } else {
      res.status(402).send("Usuario o contraseña incorrectos");
    }

  } catch (error) {
    res.status(400).send("Error en el acceso " + error);
  }
});

router.get("/info", authenticateProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({
      attributes: [
        "name",
        "lastname",
        "email",
        "createdPrayers",
        "createdComments",
        "isBaned",
      ],
      where: { id: userId },
    });

    res.status(200).json(user);
  } catch (error) {
    res.status(400).send("Error al obtener datos de usuario");
  }
});

router.patch(
  "/edit",
  authenticateProtection,
  validateEdit,
  async (req, res) => {
    try {
      const userId = req.user.id;

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

router.get("/refresh", versionProtection, refreshTokenProtection, async (req, res) => {
  try {
    const refreshToken = req.header("RefreshToken");
    const userId = req.user.id;
    const deviceInfo = req.user.deviceInfo;
    const user = await User.findOne({ where: { id: userId } });
    if (
      await bcrypt.compare(refreshToken, deviceInfo) &&
      refreshToken === user.deviceInfo
    ) {
      const salt = await bcrypt.genSalt(10);

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          deviceInfo: await bcrypt.hash(deviceInfo, salt),
        },
        TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      user.token = token;
      const loggedUser = {
        token: user.token,
      };
      res.status(200).json(loggedUser);
    } else {
      await user.set({ deviceInfo: "" });
      await user.save();
      res.status(409).send("Dispositivo desconocido");
    }

  } catch (error) {
    res.status(400).send("Error refrescando sesion " + error);
  }
});

module.exports = router;
