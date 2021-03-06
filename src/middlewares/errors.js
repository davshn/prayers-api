module.exports.error404 = function (req, res, next) {
  res.status(404).send("La ruta no existe");
};

module.exports.generalErrorHandler = function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || err;
  res.status(status).send(message);
};

/*
400 ERROR EN LA PETICION
401 TOKEN INVALIDO
403 ERROR EN ENVIO DE DATOS
409 USUARIO INTENTO ALGO RARO
426 APLICACION DESACTUALIZADA
*/