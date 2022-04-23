const { check } = require("express-validator");

const { Category } = require("../../models/index");
const { validateResults } = require("../validateResults");

const validateCreation = [
  check("title")
    .exists()
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Titulo incorrecto"),
  check("text")
    .exists()
    .isString()
    .notEmpty()
    .isLength({ max: 200 })
    .withMessage("Contenido incorrecto"),
  check("categoryId")
    .exists()
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

const validateEdit = [
  check("text")
    .if((value, { req }) => req.body.text)
    .isString()
    .isLength({ max: 200 })
    .withMessage("Contenido incorrecto"),
  check("profileImage")
    .if((value, { req }) => req.body.profileImage)
    .isNumeric()
    .withMessage("Contenido incorrecto"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateCreation: validateCreation,
  validateEdit: validateEdit,
};
