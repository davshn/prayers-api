const { validationResult } = require("express-validator");

//Response validations in express validators

const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    res.status(403);
    res.send(err.array()[0].msg );
  }
};

module.exports = { validateResults };