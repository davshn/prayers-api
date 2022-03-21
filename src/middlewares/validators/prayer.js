const { check } = require("express-validator");

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
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateCreation: validateCreation,
};
