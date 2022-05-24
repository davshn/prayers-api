const { check } = require("express-validator");

const { validateResults } = require("../validateResults");

const validateRegister = [
  check("name")
    .exists()
    .withMessage("Nombre requerido")
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Nombre incorrecto"),
  check("lastname")
    .exists()
    .withMessage("Apellido requerido")
    .isString()
    .isLength({ min: 3, max: 12 })
    .withMessage("Apellido incorrecto"),
  check("dateOfBirth")
    .exists()
    .withMessage("Fecha de nacimiento requerida")
    .notEmpty()
    .withMessage("Fecha de nacimiento incorrecta"),
  check("email").exists().withMessage("Se requiere un email").isEmail().withMessage("Se requiere un email valido"),
  check("password")
    .exists()
    .withMessage("Se requiere una contraseña")
    .isString()
    .isStrongPassword()
    .withMessage("Contraseña demasiado debil"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validateLogin = [
  check("email").exists().withMessage("Se requiere un email").isEmail().withMessage("Se requiere un email valido"),
  check("password")
    .exists()
    .withMessage("Se requiere una contraseña")
    .isString()
    .isStrongPassword()
    .withMessage("Contraseña no valida"),
  check("deviceInfo")
    .exists()
    .withMessage("La informacion del dispositivo es requerida")
    .isString()
    .isLength({ min: 5 })
    .withMessage("La informacion del dispositivo no es valida"),
    
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
    .withMessage("Contraseña demasiado debil"),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validateLogin,
  validateEdit: validateEdit,
};
