module.exports.generalErrorHandler = function (err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
};

module.exports.error404 = function (req, res, next) {
  res.status(404).send("La ruta no existe");
};

/*
200 TODO SALIO BIEN
400 ERROR EN LA PETICION
401 TOKEN INVALIDO
402 RECARGAR CON DINERO LA CUENTA
403 ERROR EN ENVIO DE DATOS
404 PAGINA NO EXISTE
409 USUARIO INTENTO ALGO RARO
426 APLICACION DESACTUALIZADA
500 ERROR EN EL SERVIDOR
*/