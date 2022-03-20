const { Router } = require("express");

const { Category } = require("../models/index");
const setCategories = require("../microservices/setCategories");
const authenticateProtection = require('../middlewares/authenticateProtection');

const router = Router();

router.get("/getall",authenticateProtection, async (req, res) => {
  try {
    await setCategories();
    const allCategories = await Category.findAll();
    res.status(200).send(allCategories);
  } catch (error) {
    res.status(400).send("Error en la carga de categorias");
  }
});

module.exports = router;