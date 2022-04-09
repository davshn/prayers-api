const ownUserProtection = (req, res, next) => {
  const tokenUser = req.user.id;
  const userId = req.params.userId;

  try {
    if (tokenUser !== userId) {
      return res.status(403).send("Usuario invalido, Usuario reportado");
    }
  } catch (err) {
    return res.status(401).send("Usuario invalido");
  }
  return next();
};

module.exports = ownUserProtection;
