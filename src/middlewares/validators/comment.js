const { check } = require("express-validator");

const { Prayer } = require("../../models/index");
const { validateResults } = require("../validateResults");

const validateCreation = [
  check("text")
    .exists()
    .isString()
    .isLength({ max: 200 })
    .withMessage("Contenido incorrecto"),
  check("prayerId")
    .exists()
    .withMessage("Id de oracion incorrecto")
    .custom((value) => {
      return Prayer.findOne({ where: { id: value } }).then((prayer) => {
        if (!prayer) return Promise.reject("Oracion no existe");
      });
    }),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validateEdit = [
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
  validateEdit: validateEdit,
};
