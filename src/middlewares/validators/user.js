const { check } = require("express-validator");

const { validateResults } = require("../validateResults");

const validateRegister = [
  check("name")
    .exists()
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Nombre incorrecto"),
  check("lastname")
    .exists()
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Apellido incorrecto"),
  check("dateOfBirth")
    .exists()
    .notEmpty()
    .withMessage("Fecha de nacimiento incorrecta"),
  check("email").exists().isEmail().withMessage("Email incorrecto"),
  check("password")
    .exists()
    .isString()
    .isStrongPassword()
    .withMessage("Contraseña incorrecta"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validateLogin = [
  check("email").exists().isEmail().withMessage("El email es requerido"),
  check("password")
    .exists()
    .isString()
    .isStrongPassword()
    .withMessage("La contraseña es requerida"),
  check("version")
    .exists()
    .isString()
    .isLength({ min: 3 })
    .withMessage("La version es requerida"),
  check("deviceInfo")
    .exists()
    .isString()
    .isLength({ min: 5 })
    .withMessage("La informacion del dispositivo es requerida"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validateEdit = [
  check("name")
    .if((value, { req }) => req.body.name)
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Nombre incorrecto"),
  check("lastname")
    .if((value, { req }) => req.body.lastname)
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Apellido incorrecto"),
  check("password")
    .if((value, { req }) => req.body.password)
    .isString()
    .isStrongPassword()
    .withMessage("Contraseña incorrecta"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validateLogin,
  validateEdit: validateEdit,
};
