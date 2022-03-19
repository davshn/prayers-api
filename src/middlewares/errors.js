module.exports.generalErrorHandler = function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
};

module.exports.error404 = function (req, res, next) {
  res.status(404).send("La ruta no existe");
};
