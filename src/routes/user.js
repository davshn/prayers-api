const { Router } = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { User } = require("../models/index");
const verification = require("../microservices/emails/verificationEmail");
const authenticateProtection = require("../middlewares/authenticateProtection");
const {
  validateRegister,
  validateLogin,
} = require("../middlewares/validators/user");

const router = Router();
const { TOKEN_KEY } = process.env;

router.post("/register", validateRegister, async (req, res) => {
  const salt = await bcrypt.genSalt(10);

  try {
    const newUser = await User.create({
      dateOfBirth: req.body.dateOfBirth,
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

router.post("/login", validateLogin, async (req, res) => {
  try {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user.id, email: user.email }, TOKEN_KEY, {
        expiresIn: "2h",
      });

      user.token = token;
      const loggedUser = {
        token: user.token,
        id: user.id,
      };

      res.status(200).json(loggedUser);
    } else {
      res.status(402).send("Usuario o contraseña incorrectos");
    }
  } catch (error) {
    res.status(405).send("Error en el login");
  }
});

router.get("/userinfo/:userId", authenticateProtection, async (req, res) => {
  try {
    console.log(req.params);
    const userId = req.params.userId;

    const user = await User.findOne({ where: { id: userId } });

    const userInfo = {
      name: user.name,
      lastname: user.lastname,
      email: user.email,
      isAutenticated: true,
      createdPrays: user.createdPrays,
      createdComments: user.createdComments,
      prayersToCreate: user.prayersToCreate,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(405).send("Error al obtener datos de usuario");
  }
});

module.exports = router;
