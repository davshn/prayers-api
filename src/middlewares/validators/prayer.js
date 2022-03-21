const { check } = require("express-validator");

const { Category } = require("../../models/index");
const { validateResults } = require("../validateResults");

const validateCreation = [
  check("title")
    .exists()
    .isString()
    .isLength({ max: 50 })
    .withMessage("Titulo incorrecto"),
  check("text")
    .exists()
    .isString()
    .isLength({ max: 200 })
    .withMessage("Contenido incorrecto"),
  check("userId").exists().isString().withMessage("Id de usuario incorrecto"),
  check("categoryId")
    .exists()
    .isInt()
    .withMessage("Id de categoria incorrecto")
    .custom((value) => {
      return Category.findOne({ where: { id: value } }).then((category) => {
        if (!category) return Promise.reject("Categoria no existe");
      });
    }),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateCreation: validateCreation,
};
