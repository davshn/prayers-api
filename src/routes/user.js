const { Router } = require("express");
const bcrypt = require("bcrypt");

const { User } = require("../models/index");
const { validateRegister } = require("../middlewares/validators/user");
const verification = require("../microservices/emails/verificationEmail");

const router = Router();

router.post("/register",validateRegister, async (req, res) => {
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

module.exports = router;
