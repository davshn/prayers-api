const ownUserProtection = (req, res, next) => {
  const tokenUser = req.user.id;
  const userId = req.params.userId;

  try {
    if (tokenUser !== userId) {
      return res.status(409).send("Usuario invalido, Usuario reportado");
    }
  } catch (err) {
    return res.status(400).send("Error en validacion de usuario");
  }
  return next();
};

module.exports = ownUserProtection;
