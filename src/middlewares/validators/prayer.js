const { check } = require("express-validator");

const { Category,User } = require("../../models/index");
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
  check("userId")
    .exists()
    .withMessage("Id de usuario incorrecto")
    .custom((value) => {
      return User.findOne({ where: { id: value } }).then((user) => {
        if (!user) return Promise.reject("Usuario no existe");
      });
    }),
  ,
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

module.exports = {
  validateCreation: validateCreation,
};
