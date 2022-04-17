const jwt = require("jsonwebtoken");

const { TOKEN_KEY } = process.env;

const authenticateProtection = (req, res, next) => {
  const token = req.header("token");

  if (!token) {
    return res.status(400).send("Se requiere ser un usuario autenticado");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Usuario invalido");
  }
  return next();
};

module.exports = authenticateProtection;
