const { check } = require("express-validator");

const { validateResults } = require("../validateResults");

const validateRegister = [
  check("name").exists().isString(),
  check("lastname").exists().isString(),
  check("dateOfBirth").exists(),
  check("email").exists().isEmail(),
  check("password").exists().isString(),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validateRegister: validateRegister,
};
