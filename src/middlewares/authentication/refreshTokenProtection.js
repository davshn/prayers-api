const jwt = require("jsonwebtoken");
const { TOKEN_KEY } = process.env;

const refreshTokenProtection = (req, res, next) => {
  const token = req.header("token");
  const refreshToken = req.header("RefreshToken");

  if (!token || !refreshToken) {
    return res.status(400).send("Se requiere ser un usuario autenticado");
  }
  try {
    const decoded = jwt.verify(token, TOKEN_KEY, { ignoreExpiration: true });
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Usuario invalido");
  }
  return next();
};

module.exports = refreshTokenProtection;
