const { check } = require("express-validator");

const { Category } = require("../../models/index");
const { validateResults } = require("../validateResults");

const validateCreation = [
  check("title")
    .exists()
    .withMessage("Se requiere un titulo")
    .isString()
    .isLength({ min: 3, max: 50 })
    .withMessage("Titulo demasiado corto o largo"),
  check("text")
    .exists()
    .withMessage("Texto requerido")
    .isString()
    .notEmpty()
    .withMessage("Se requiere un texto en tu oracion")
    .isLength({ max: 200 })
    .withMessage("Contenido demasiado largo"),
  check("categoryId")
    .exists()
    .withMessage("Se requiere una categoria")
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
    .withMessage("Contenido demasiado largo"),
  check("profileImage")
    .if((value, { req }) => req.body.profileImage)
    .isNumeric()
    .withMessage("Imagen no valida"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateCreation: validateCreation,
  validateEdit: validateEdit,
};
