const { check } = require("express-validator");

const { validateResults } = require("../validateResults");

const validateRegister = [
  check("name").exists().isString().withMessage("Nombre incorrecto"),
  check("lastname").exists().isString().withMessage("Apellido incorrecto"),
  check("dateOfBirth").exists().withMessage("Fecha de nacimiento incorrecta"),
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

module.exports = {
  validateRegister: validateRegister,
};
